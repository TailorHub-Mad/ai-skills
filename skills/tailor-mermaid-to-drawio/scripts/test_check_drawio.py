import base64
import unittest
import xml.etree.ElementTree as ET
import zlib
from pathlib import Path
from urllib.parse import quote

from check_drawio import check_xml


MODEL = """<mxGraphModel><root><mxCell id="0"/>
<mxCell id="1" parent="0"/>
<mxCell id="a" parent="1" vertex="1"><mxGeometry x="40" y="40" width="140" height="60"/></mxCell>
<mxCell id="b" parent="1" vertex="1"><mxGeometry x="400" y="40" width="140" height="60"/></mxCell>
<mxCell id="e" parent="1" edge="1" source="a" target="b"><mxGeometry relative="1"/></mxCell>
</root></mxGraphModel>"""


class CheckDrawioTests(unittest.TestCase):
    def test_starter_has_valid_nesting_and_non_overlapping_bounds(self):
        path = (
            Path(__file__).resolve().parents[1] / "assets/architecture-starter.drawio"
        )
        result = check_xml(path.read_text())
        self.assertTrue(result["ok"], result)
        self.assertEqual(result["pages"][0]["edges"], 4)

    def test_compressed_and_uncompressed_pages(self):
        compressor = zlib.compressobj(wbits=-15)
        encoded = compressor.compress(quote(MODEL).encode()) + compressor.flush()
        compressed = base64.b64encode(encoded).decode()
        result = check_xml(
            f'<mxfile><diagram name="plain">{MODEL}</diagram>'
            f'<diagram name="compressed">{compressed}</diagram></mxfile>'
        )
        self.assertTrue(result["ok"], result)
        self.assertEqual(len(result["pages"]), 2)

    def test_overlap_is_rejected(self):
        result = check_xml(MODEL.replace('x="400"', 'x="100"'))
        self.assertFalse(result["ok"])
        self.assertIn("Overlapping", str(result))

    def test_missing_edge_geometry_is_rejected(self):
        result = check_xml(MODEL.replace('<mxGeometry relative="1"/>', ""))
        self.assertFalse(result["ok"])
        self.assertIn("edge needs", str(result))

    def test_missing_endpoint_is_rejected(self):
        result = check_xml(MODEL.replace('target="b"', 'target="missing"'))
        self.assertFalse(result["ok"])

    def test_free_and_partially_connected_edges_are_valid(self):
        for endpoints in (("source",), ("target",), ("source", "target")):
            with self.subTest(endpoints=endpoints):
                model = ET.fromstring(MODEL)
                edge = model.find("root/mxCell[@id='e']")
                for endpoint in endpoints:
                    del edge.attrib[endpoint]
                    ET.SubElement(
                        edge.find("mxGeometry"),
                        "mxPoint",
                        {"as": f"{endpoint}Point", "x": "40", "y": "200"},
                    )
                result = check_xml(ET.tostring(model, encoding="unicode"))
                self.assertTrue(result["ok"], result)

    def test_free_endpoint_requires_a_valid_point(self):
        for x in (None, "invalid", "nan", "inf"):
            with self.subTest(x=x):
                model = ET.fromstring(MODEL)
                edge = model.find("root/mxCell[@id='e']")
                del edge.attrib["target"]
                if x is not None:
                    ET.SubElement(
                        edge.find("mxGeometry"),
                        "mxPoint",
                        {"as": "targetPoint", "x": x, "y": "40"},
                    )
                result = check_xml(ET.tostring(model, encoding="unicode"))
                self.assertFalse(result["ok"], result)

    def test_endpoint_point_does_not_mask_broken_reference(self):
        source = MODEL.replace('target="b"', 'target="missing"').replace(
            '<mxGeometry relative="1"/>',
            '<mxGeometry relative="1"><mxPoint x="40" y="40" '
            'as="targetPoint"/></mxGeometry>',
        )
        self.assertFalse(check_xml(source)["ok"])

    def test_collapsed_container_hides_descendant_bounds(self):
        source = """<mxGraphModel><root><mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="g" parent="1" vertex="1" collapsed="1">
          <mxGeometry x="40" y="40" width="200" height="24">
            <mxRectangle width="200" height="200" as="alternateBounds"/>
          </mxGeometry>
        </mxCell>
        <mxCell id="child" parent="g" vertex="1">
          <mxGeometry x="20" y="40" width="140" height="100"/>
        </mxCell>
        <mxCell id="grandchild" parent="child" vertex="1">
          <mxGeometry x="0" y="20" width="100" height="60"/>
        </mxCell>
        <mxCell id="other" parent="1" vertex="1">
          <mxGeometry x="60" y="100" width="140" height="60"/>
        </mxCell></root></mxGraphModel>"""
        result = check_xml(source)
        self.assertTrue(result["ok"], result)
        self.assertFalse(
            check_xml(source.replace('collapsed="1"', 'collapsed="0"'))["ok"]
        )

    def test_hidden_vertices_and_layers_do_not_overlap_visible_cells(self):
        for source in (
            MODEL.replace('id="b"', 'id="b" visible="0"').replace('x="400"', 'x="40"'),
            MODEL.replace(
                '<mxCell id="a"',
                '<mxCell id="hidden" parent="0" visible="0"/><mxCell id="a"',
            )
            .replace('id="b" parent="1"', 'id="b" parent="hidden"')
            .replace(
                'x="400"',
                'x="40"',
            ),
        ):
            with self.subTest(source=source):
                result = check_xml(source)
                self.assertTrue(result["ok"], result)
                self.assertFalse(
                    check_xml(source.replace('target="b"', 'target="missing"'))["ok"]
                )

    def test_cycle_is_reported_without_hanging(self):
        result = check_xml(MODEL.replace('id="1" parent="0"', 'id="1" parent="a"'))
        self.assertFalse(result["ok"])
        self.assertIn("cyclic", str(result))

    def test_child_outside_container_is_rejected(self):
        result = check_xml(MODEL.replace('id="b" parent="1"', 'id="b" parent="a"'))
        self.assertFalse(result["ok"])
        self.assertIn("outside parent", str(result))

    def test_wrapped_objects_keep_their_ids(self):
        source = MODEL.replace(
            '<mxCell id="a" parent="1" vertex="1">',
            '<object id="a" label="API"><mxCell parent="1" vertex="1">',
        )
        source = source.replace(
            'height="60"/></mxCell>', 'height="60"/></mxCell></object>', 1
        )
        self.assertTrue(check_xml(source)["ok"])

    def test_duplicate_id_is_rejected(self):
        self.assertFalse(check_xml(MODEL.replace('id="b"', 'id="a"'))["ok"])

    def test_malformed_xml_is_reported(self):
        self.assertFalse(check_xml("<mxfile>")["ok"])


if __name__ == "__main__":
    unittest.main()
