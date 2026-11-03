# Visual standard: polished technical diagrams

The default look is a calm, light canvas; soft domain/phase panels; rounded
icon-and-label service cards; and a clearly readable primary flow. This is a
reusable design language, not a specific payment architecture.

## Composition

- Give the page a descriptive title and, when helpful, a one-line scope subtitle.
  Mark proposed/under-review elements explicitly rather than implying deployment.
- Use left-to-right for an architecture or lifecycle unless a top-down arrangement
  is clearer. Feedback and callbacks can occupy their own lane.
- Keep aligned rows/columns and generous white space. Start from the tool's
  recommended grid. Expand cards/canvas when labels need room, rather than
  decreasing font size or packing nodes closer.
- Use real parent-child containers for ownership/trust/deployment boundaries.
  Child geometry is relative to its parent. Crossing a container boundary to
  reach its child is normal; crossing its header or an unrelated card is not.
- Keep roughly 24–40 px of inner panel padding and at least 40 px of usable
  connection space between cards when layout/tool constraints allow it.
- Fit the final page to the content with a comfortable outer margin. A clean
  multi-page overview/detail pair is preferable to an unreadable single poster.

## Cards and typography

### Default service-card contract

Use this composition for each service, datastore, and named external provider,
unless the user explicitly requests another style. Standard flowchart decisions,
UML/ER notation, actors, and explanatory notes retain their own appropriate shapes.

```text
╭────────────────────────────────────╮
│                                    │
│  [real logo]  Service name (bold)   │
│               Short role (gray)    │
│                                    │
╰────────────────────────────────────╯
```

- Card background is white (`fillColor=#FFFFFF`) in the light-theme design.
  Rounded corners and a thin color border identify the component's role. Soft
  blue/green/amber/pink fills belong to the enclosing panels, not the service
  cards. An explicit status highlight or user-requested variant may override
  this; do not recolor all cards just to match their panel.
- The actual service/brand logo is inside the card, on the left, vertically
  centered. Name and optional role are inside the same card, left-aligned to
  the right of the logo, with no text/logo collision.
- A bare logo with a caption underneath, a logo floating above a rectangle,
  an emoji, or a text-only box for a service whose logo is available does not
  satisfy this default. Use a neutral fallback only when the exact icon cannot
  be verified, and explain that fallback.
- Treat the card as one editable semantic node, with connections ending at its
  boundary. A native label shape with an image is preferred. If a renderer needs
  separate child shapes, group/contain them as one card, preserve editing, and
  connect to the card rather than the decorative icon.

### Implementation and sizing

- Default card base style:
  `shape=label;rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;align=left;verticalAlign=middle;strokeWidth=1.5;`.
  Add the verified image, semantic border color, and adequate padding.
- Put a 28–34 px icon on the left with sufficient text padding (typically
  `spacingLeft=40` to `48`). Keep icon aspect ratios; don't stretch wordmarks.
- Use a bold service name and a short secondary role line; retain exact product
  names. A generic component with no established logo may use a neutral card.
- Aim for 12–14 px body text, 12–14 px panel headings, and 20–24 px page titles.
  Enlarge the card when necessary. Avoid making tiny print the way to fit a graph.
- Keep at most two or three label lines on a card. Use a separate note for
  caveats, responsibilities, unresolved details, and longer explanations.
- Prefer flat fills, 1.5 px borders, and 2 px emphasis for important services.
  Avoid ornamental shadows, gradients, emoji icons, and excessive color coding.

## Palette and semantics

These are light-theme seeds; enable `adaptiveColors="auto"` for Draw.io's
theme adaptation. Verify exports in the theme used for the deliverable.

| Role | Panel background/header | Border | Text/accent |
| --- | --- | --- | --- |
| Public/API flow | `#F4F9FD` / `#E3F2FD` | `#BBDEFB` | `#1565C0` / `#2F80ED` |
| Compute/orchestration | `#FFFCF6` / `#FFF3DB` | `#F5D28B` | `#9A6700` |
| Private/event publication | `#F5FBF6` / `#E8F5E9` | `#A5D6A7` | `#2E7D32` / `#43A047` |
| External callbacks | `#FFF7FA` / `#FCE4EC` | `#F8BBD0` | `#AD1457` / `#EC407A` |
| Identity/notes | `#F8F6FC` | `#D1C4E9` | `#5E35B1` |
| External/neutral | `#F8FAFC` / `#EEF2F6` | `#94A3B8` | `#475569` |

Use `#0F172A` for main text and `#64748B` for secondary text. Keep the default
service-card background white across panels. Adapt the roles to the subject;
don't apply all colors to every diagram. Colors support labels rather than
replace them.

## Connectors

Architecture default:

```text
edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeWidth=1.5;endArrow=classic;endFill=1;fontSize=12;labelBackgroundColor=#FFFFFF;
```

- Use slightly heavier lines for the main flow, lighter lines for supporting
  dependencies. Assign consistent color and dash meanings and include a compact
  legend if those meanings are not obvious.
- Reserve an open channel for feedback or cross-panel connections. Try a closer
  placement first, then obstacle-avoiding routing, then a separate detail page.
- Use separate incoming/outgoing paths when a bidirectional connection would
  hide different protocols or lifecycle steps.
- A label background improves contrast but must not cover another connection.
- Avoid parallel edge segments that merge visually, gratuitous zigzags, edges
  running along node borders, and long labels across multiple lanes.
- Intentional crossings, if unavoidable, must remain traceable; line jumps may
  clarify a crossing, but do not fix a shared/overlapping stretch of line.
- A single node may be shown as a clearly marked reference on a detail page.
  Do not silently duplicate it as if it were a second deployed component.

## Acceptance checklist

### Meaning
- Exact services, boundaries, ownership, directions, and protocols are preserved.
- Planned elements and uncertain assumptions are visibly identified.
- Simplifying the drawing did not invent a service or remove a meaningful edge.

### Geometry and reading
- No unrelated cards/notes overlap; children fit inside their containers.
- No connector runs through a service card, icon, label, or panel heading.
- Distinct relationships remain independently traceable, without ambiguous shared
  segments; any unavoidable crossing is readable.
- Labels fit, have adequate contrast, and do not conceal other information.
- Primary path, supporting paths, and annotations have a clear hierarchy.
- Canvas has balanced spacing, readable text, and no large accidental empty areas.

### Icons and delivery
- Service nodes follow the white-card contract: internal left icon, right-hand
  bold name, optional gray role, rounded corners, and thin semantic-color border.
- Named services/brands have accurate, rendered icons, or an explained neutral
  fallback. No broken image placeholders or unrelated brand substitutions.
- Editable XML opens; other pages/metadata survive edits.
- If automatic routing changed geometry, the delivered file contains that result
  or the remaining editor-save step is explicitly stated.
- The handoff distinguishes structural checks from an actual rendered review.
