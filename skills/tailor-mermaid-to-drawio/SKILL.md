---
name: tailor-mermaid-to-drawio
description: Create, convert, or improve polished editable Draw.io diagrams from a description, Mermaid, or existing .drawio files. Use for technical architecture, service integrations, cloud infrastructure, security boundaries, and event/data flows, including requests such as "hazme un diagrama", "que quede profesional", or "sin líneas superpuestas". Applies Azure/AWS service icons, accurate third-party logos, clean connectors, and a visual quality pass. Respect an explicitly requested Mermaid-only or other output format; do not trigger for explanation-only questions.
---

# Tailor Mermaid to Draw.io

Deliver an editable diagram that is suitable for a technical presentation or
shared documentation without the user having to request visual polish separately.
Good XML is necessary; a readable composition is the actual goal.

## 1. Establish the contract

- Accept prose, Mermaid, or an existing diagram. Mermaid is not a prerequisite.
- Match the user's language and preserve exact product/service names, direction,
  ownership, and synchronous/asynchronous meaning.
- Identify the diagram's main question, actors, boundaries, and primary flow.
  Ask only about missing information that materially changes that meaning.
- Treat a reference diagram as a style reference, not evidence that its proposed
  architecture, service boundaries, or implementation decisions apply elsewhere.
- If a reference `.drawio` is supplied, list its pages and load only the relevant
  ones. When editing, preserve other pages, links, metadata, and unrelated content.
- Use the supplied Draw.io MCP tool schemas as the authority for supported
  parameters. If MCP is unavailable, report that the interactive preview/routing
  is unavailable; still deliver editable XML when local file tools permit it.
  Do not pretend that file creation alone is a rendered preview.

## 2. Load the visual contract and relevant resources

Read `references/visual-standard.md` for every creation or substantial redesign.
Use `assets/architecture-starter.drawio` as a composition/style seed when useful,
not as a required architecture or a fixed-size canvas.

Read only the icon references needed:
- Azure: `references/azure-icons.md`.
- AWS: `references/aws-icons.md`.
- External products, brands, or plain database engines:
  `references/third-party-icons.md`.

Keep classic flowcharts, sequence diagrams, UML, and ER diagrams semantically
correct. Use their standard shapes; do not add cloud icons to a decision diamond
or a class just to decorate it. Respect a request for basic shapes.

## 3. Compose before connecting

- Choose one reading direction and align the main path on a clear spine.
- Group by actual responsibility, trust boundary, or phase; use parent-child
  containment, not large rectangles drawn behind unrelated nodes.
- Place external actors outside implementation boundaries. A phase grouping is
  not itself a deployment or ownership boundary; label that distinction.
- Render services and named providers as white rounded cards (`fillColor=#FFFFFF`)
  with a thin semantic-color border, the real service/brand icon INSIDE the card
  on the left, and a bold service name to its right. An optional short secondary
  line sits below the name. This is the default service-node format, not an
  optional decoration; see the exact card contract in the visual standard.
- Treat icon, name, and secondary text as one service card. Connect edges to the
  card, not to a separate floating logo. Keep explanatory prose in separate notes.
- Use soft container fills, restrained semantic colors, consistent spacing,
  and readable typography from the visual standard.
- Reserve empty space for connectors and labels. If the graph becomes dense,
  split an overview and a detail view rather than shrinking everything to fit.

## 4. Resolve real icons

- Search the available Draw.io library for named cloud services and brands.
  Inspect the returned title and style: a lexical match is not proof of identity
  (a "Diagonal Stripe" shape is not the Stripe logo).
- Prefer the exact managed service icon when explicitly named; prefer the exact
  product/engine logo when no managed variant is specified.
- Use a verified official/library SVG if search has no suitable result. Embed
  when permitted and portability matters; retain required attribution.
- Never invent asset paths or use another vendor's logo as a generic substitute.
  If the exact logo cannot be sourced, use a clearly labeled neutral shape and
  mention the fallback briefly in the handoff.

## 5. Route for unambiguous reading

- Use consistent orthogonal connectors for architecture/flow diagrams. Other
  diagram types retain their standard connector notation.
- Distinct relationships should not share an indistinguishable stretch of line.
  Avoid crossing cards, icons, text, notes, or container title bars.
- Prefer rearranging nearby nodes, increasing space, or splitting views to adding
  bends. Do not invent an architectural gateway just to hide a routing problem.
- Use short edge labels with a background; number a lifecycle only when the
  numbering describes real ordering. Explain dashed/color meanings in a legend.
- For deliberately placed XML with obstructed or dense connections, use
  `routing: "libavoid"` on `open_drawio_xml` when the exposed tool supports it.
  The router keeps vertices in place; it does not validate labels or semantics.
- Do not hand-author waypoint arrays to fight the router. Add connection-point
  overrides only for intentional geometry, not as a blanket default.
- Auto-layout is optional and capability-dependent. Do not send unsupported
  `postLayout` parameters or reflow a meaningful container layout blindly.

## 6. Generate, check, preview, refine

1. Produce well-formed native Draw.io XML with unique IDs, escaped HTML labels,
   valid parent/source/target references, and geometry on every edge. Use
   `html=1` for HTML labels and actual XML line breaks, not literal `\n` strings.
2. Save a `.drawio` artifact. If filesystem tools are unavailable, provide XML
   that the user can save. A Mermaid import URL alone is not the final artifact.
3. When Python is available, run:
   ```sh
   python3 <skill-dir>/scripts/check_drawio.py <diagram.drawio>
   ```
   Fix structural errors and unintended geometry overlaps. The checker is
   read-only and does not prove icon, text, connector, or visual correctness.
4. Open via the XML MCP path. For an existing multi-page file, replace only the
   selected page using the appropriate page tool.
5. Inspect a rendered preview/export when an image or browser inspection tool is
   available. Check the icon rendering, text fit, connector/label collisions,
   arrow direction, title bars, and legibility both at overview and reading zoom.
   Draw.io Desktop's export CLI is also suitable: discover the installed executable
   and run `drawio --export --format png --border 20 --output <preview.png>
   <diagram.drawio>` using its actual path. Read the resulting image with an
   image-capable tool; an export exit code alone is not a visual review.
6. Fix observed problems and repeat the relevant check. If the tool returns
   routed XML, persist that final model. An open URL is not a saved routed model;
   if routing is only available in the editor, disclose that it must be saved
   there and do not claim the on-disk file contains the routed result.

Stop when the acceptance checklist in the visual standard is met. If preview or
export inspection is unavailable, deliver the checked artifact and explicitly
say visual verification remains pending. Never claim "no overlaps" based only
on an XML parse or an automatic routing request.

## Handoff

Link the editable file and, when actually produced, the preview/export. Briefly
state material assumptions, icon fallbacks, and verification limitations. Normal
chat explanations are allowed; "XML output" does not mean dumping a huge XML
document into the final answer when an artifact link is available.

## Maintainer checks

`evals/evals.json` contains realistic generation/editing and trigger cases.
`python3 -B -m unittest discover -s <skill-dir>/scripts -p 'test_*.py'`
tests the structural checker. Compare rendered outputs for generation cases;
checker tests alone are not a benchmark of diagram design quality.
