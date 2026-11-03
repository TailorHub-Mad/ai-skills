"""Read-only checks for Draw.io structure and visible axis-aligned vertex bounds.

Not a renderer: text overflow, icon availability and connector routing require
a rendered review. Supports plain mxGraphModel, mxfile and compressed pages.
"""

import argparse
import base64
import json
import math
import sys
import xml.etree.ElementTree as ET
import zlib
from itertools import combinations
from pathlib import Path
from urllib.parse import unquote


def models(document):
    if document.tag == "mxGraphModel":
        return [("model", document)]
    if document.tag != "mxfile":
        raise ValueError("Expected mxfile or mxGraphModel")
    pages = []
    for page in document.findall("diagram"):
        model = page.find("mxGraphModel")
        if model is None:
            text = (page.text or "").strip()
            if text.startswith("<"):
                model = ET.fromstring(text)
            else:
                decoded = zlib.decompress(base64.b64decode(text), -15).decode("utf-8")
                model = ET.fromstring(unquote(decoded))
        if model.tag != "mxGraphModel":
            raise ValueError("Page does not contain mxGraphModel")
        pages.append((page.get("name", page.get("id", "unnamed")), model))
    if not pages:
        raise ValueError("No diagram pages")
    return pages


def check_model(name, model):
    errors, warnings = [], []
    cells = {}
    root = model.find("root")
    if root is None:
        return {"page": name, "errors": ["Missing graph root"], "warnings": []}
    for entry in root:
        cell = entry if entry.tag == "mxCell" else entry.find("mxCell")
        if cell is None:
            continue
        ident = entry.get("id") or cell.get("id")
        if not ident or ident in cells:
            errors.append(f"Missing or duplicate ID: {ident}")
        else:
            cells[ident] = cell
    if "0" not in cells:
        errors.append("Missing root cell 0")
    for ident, cell in cells.items():
        if ident != "0" and cell.get("parent") not in cells:
            errors.append(f"{ident}: missing parent")
        if cell.get("edge") == "1":
            geo = cell.find("mxGeometry")
            for endpoint in ("source", "target"):
                terminal = cell.get(endpoint)
                if terminal is not None:
                    target = cells.get(terminal)
                    if target is None or target.get("vertex") != "1":
                        errors.append(f"{ident}: missing/invalid {endpoint} vertex")
                else:
                    point = (
                        geo.find(f"mxPoint[@as='{endpoint}Point']")
                        if geo is not None
                        else None
                    )
                    try:
                        if point is None or not all(
                            math.isfinite(float(point.get(axis, "0")))
                            for axis in ("x", "y")
                        ):
                            raise ValueError("missing/non-finite point")
                    except ValueError:
                        errors.append(f"{ident}: missing/invalid {endpoint} point")
            if geo is None or geo.get("relative") != "1":
                errors.append(f"{ident}: edge needs relative mxGeometry")
        label = cell.get("value", "")
        if "<" in label and "html=1" not in cell.get("style", ""):
            errors.append(f"{ident}: HTML label without html=1")

    ancestors = {}
    for ident in cells:
        seen, current = set(), ident
        while current in cells:
            if current in seen:
                errors.append(f"{ident}: cyclic parent chain")
                break
            seen.add(current)
            current = cells[current].get("parent")
        ancestors[ident] = seen - {ident}

    local = {}
    for ident, cell in cells.items():
        if cell.get("vertex") != "1":
            continue
        geo = cell.find("mxGeometry")
        if geo is None:
            errors.append(f"{ident}: vertex needs mxGeometry")
            continue
        if geo.get("relative") == "1":
            warnings.append(f"{ident}: relative vertex bounds not checked")
            continue
        try:
            box = tuple(
                float(geo.get(key, "0")) for key in ("x", "y", "width", "height")
            )
            if not all(math.isfinite(value) for value in box) or min(box[2:]) <= 0:
                raise ValueError("non-finite/non-positive size")
            local[ident] = box
        except ValueError:
            errors.append(f"{ident}: invalid geometry dimensions")

    absolute = {}
    for ident, box in local.items():
        # Hidden cells and descendants of collapsed containers are not rendered.
        # Keep structural validation above, but exclude their visual bounds.
        if cells[ident].get("visible") == "0" or any(
            cells[parent].get("visible") == "0" or cells[parent].get("collapsed") == "1"
            for parent in ancestors[ident]
        ):
            continue
        if any(
            parent in cells
            and cells[parent].get("vertex") == "1"
            and parent not in local
            for parent in ancestors[ident]
        ):
            warnings.append(
                f"{ident}: ancestor geometry unsupported; bounds not checked"
            )
            continue
        x, y, width, height = box
        for parent in ancestors[ident]:
            if parent in local:
                x += local[parent][0]
                y += local[parent][1]
        absolute[ident] = (x, y, width, height)
        parent = cells[ident].get("parent")
        if parent in local:
            px, py, pw, ph = box
            parent_width, parent_height = local[parent][2:]
            if px < 0 or py < 0 or px + pw > parent_width or py + ph > parent_height:
                errors.append(f"{ident}: outside parent {parent}")

    for first, second in combinations(absolute, 2):
        if first in ancestors[second] or second in ancestors[first]:
            continue
        x1, y1, w1, h1 = absolute[first]
        x2, y2, w2, h2 = absolute[second]
        if min(x1 + w1, x2 + w2) > max(x1, x2) and min(y1 + h1, y2 + h2) > max(y1, y2):
            errors.append(f"Overlapping vertex bounds: {first} / {second}")
    return {
        "page": name,
        "vertices": len(local),
        "edges": sum(cell.get("edge") == "1" for cell in cells.values()),
        "errors": errors,
        "warnings": warnings,
    }


def check_xml(text):
    try:
        pages = [
            check_model(name, model) for name, model in models(ET.fromstring(text))
        ]
        return {
            "ok": all(not page["errors"] for page in pages),
            "pages": pages,
            "limitations": "Visible axis-aligned bounds only. Intentional overlaps may need review; "
            "text fit, icons, connectors and rendered appearance are not checked.",
        }
    except (ET.ParseError, ValueError, zlib.error, UnicodeError) as exc:
        return {"ok": False, "errors": [str(exc)]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("diagram", type=Path)
    args = parser.parse_args()
    try:
        result = check_xml(args.diagram.read_text(encoding="utf-8"))
    except (OSError, UnicodeError) as exc:
        result = {"ok": False, "errors": [str(exc)]}
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
