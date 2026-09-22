---
name: tailor-figma-slides
description: Create or edit Figma presentations and Figma Slides using Tailor Hub’s slide library and visual system. Use when the user asks for a Figma presentation, slide deck, pitch deck, proposal, or individual slides. Select relevant library sections instead of reading the entire library.
---

# Tailor Figma Slides

Create clear, editable Figma presentations using Tailor’s established
typography, colors, layouts, diagrams, and imagery treatments.

Use this skill alongside the installed `figma-use` and
`figma-use-slides` skills. Load their current instructions before
calling Figma tools. Do not hardcode plugin installation paths.

## 1. Establish the destination

Before creating or modifying slides, establish where the output belongs.

If the user has not already provided a destination, ask:

“Where should I put the presentation? Share an existing Figma Slides
file, or specify the team/project folder and a name for a new deck.”

- Reuse a destination already supplied in the conversation.
- Ask only for missing details.
- Do not use the slide library as the output destination.
- Do not silently create the presentation in an unrelated folder or Drafts.
- If the tools cannot create directly in the requested location, explain
  the limitation and resolve the destination before writing.
- Before creating a new file, load `figma-create-new-file`.
- Before editing an existing destination, inspect its current contents.
  Preserve unrelated work.

While waiting for the destination, you may read relevant library
references and develop the presentation outline.

Also establish the audience, purpose, key message, source material,
and approximate length when these cannot be inferred from the brief.
Bundle essential questions; avoid repeated confirmations.

## 2. Treat the library as read-only

Canonical library:
https://www.figma.com/slides/D8q0YgD6II05o6DpAZHdcq/Slide-library

Library file key:
`D8q0YgD6II05o6DpAZHdcq`

This file is a reference library, never a working canvas.

Allowed:
- Read section names and selected slide contents.
- Inspect typography, colors, variables, styles, and geometry.
- Take screenshots of selected reference slides.
- Export reference assets through supported read-only tools.
- Copy selected, relevant slides directly into the user-provided
  destination, then edit those copies there. Leave the source slides
  unchanged; copying out of the library is allowed.

Not allowed:
- Create, edit, delete, rename, or reorder anything in the library.
- Create temporary nodes, scratch slides, or clones inside it.
- Change its variables, text styles, imagery, or guide.
- Paste finished work back into it.

Before every write operation, verify that the destination file key
differs from the library file key.

If the library is inaccessible, state the access issue and request
access or a suitable reference. Do not claim to have followed a
reference you could not inspect.

## 3. Read selectively

Do not read or screenshot every slide in the library.

Use this sequence:

1. Map the presentation outline to the section index below.
2. Inspect the typography and color foundations once per task.
3. Read only the relevant section’s slide titles and IDs.
4. Inspect one or two candidate layouts per required visual pattern.
5. Screenshot the chosen references to understand their composition.
6. Expand the search only when the selected references are insufficient.

Foundation references:
- Library guide: `10:3`
- Typography & spacing: `10:15`
- Color & status treatments: `10:32`

Typography link:
https://www.figma.com/slides/D8q0YgD6II05o6DpAZHdcq/Slide-library?node-id=10-15

Section IDs below belong only to the source library.
They are navigation hints, not destination IDs.

If an ID becomes stale:
- Read only the slide-grid rows and their names.
- Resolve the matching section by name.
- Read slide titles within that section.
- Do not fall back to dumping the entire file.

Figma Slides sections are `SLIDE_ROW` nodes.
Treat slide-grid and row nodes as opaque containers: inspect names
and children, rather than accessing their fills or layout properties.

## 4. Section index

This catalog describes the retained layouts, not the original
pre-cleanup wish list. Some business use cases intentionally share
a single reusable pattern. Index checked on 2026-09-22; validate the
relevant section before relying on its listed contents.

| Section | Row ID | Contents and when to use |
|---|---|---|
| 01 · Foundations & Basic Building Blocks | `8:22` | Library guide, typography, spacing, colors, status treatments, cards, containers, circles, labels, badges, lines, arrows, connectors, icons, callouts, and brackets. Start here for the visual rules. |
| 02 · Comparisons | `8:23` | Side-by-side, versus, and benchmark comparisons. Adapt for before/after, pros/cons, and competing approaches. |
| 03 · Relationships & Connections | `8:24` | Two- and three-set Venn diagrams, hub-and-spokes, ecosystems, many-to-many connections, dependency maps, and relationship maps. |
| 04 · Hierarchies | `8:25` | Pyramids, nested hierarchies, and concentric hierarchies. Use for levels, scope, tiers, and containment. |
| 05 · Processes & Flows | `8:26` | Linear processes, chevrons, funnels, pipelines, feedback workflows, swimlanes, and end-to-end journeys. |
| 06 · Cycles & Loops | `8:27` | Circular processes, flywheels, virtuous/vicious cycles, and infinity loops. |
| 07 · Timelines & Roadmaps | `8:28` | Horizontal and vertical timelines, Gantt roadmaps, now/next/later, and implementation plans. |
| 08 · Matrices & Quadrants | `8:29` | Impact × effort, 3×3 matrices, risk matrices, and bubble portfolios. Adapt axes to the business question. |
| 09 · Prioritization & Ranking | `8:30` | Ranked lists, podiums, priority ladders, weighted criteria, heatmaps, and a prioritization funnel. |
| 10 · Balance, Trade-offs & Tensions | `8:31` | Balanced and imbalanced scales, opposing forces, trade-off sliders, and too-little/too-much treatments. |
| 11 · Composition & Breakdown | `8:32` | Stacked components, building blocks, exploded views, and 100% compositions. |
| 12 · Convergence & Divergence | `8:33` | Convergence, divergence, and double-diamond structures. |
| 13 · Inputs → Transformation → Outputs | `8:34` | Input/output and black-box models. Adapt for resources, capabilities, activities, and outcomes. |
| 14 · Strategy Frameworks | `8:35` | Strategic house, North Star, and strategy-on-a-page layouts. |
| 15 · Operating Models | `8:36` | Operating-model wheel, capability map, and functional interaction. |
| 16 · Value Chains & Ecosystems | `8:37` | Value-chain structure. For broader stakeholder networks, also use section 03. |
| 17 · Customer & User Journeys | `8:38` | Customer journey map, experience curve, and persona plus journey. |
| 18 · Problem Solving & Logic | `8:39` | Fishbone and problem → cause → solution. For branching analysis, consult sections 25 and 30. |
| 19 · Cause & Effect | `8:40` | Domino effect and root cause → impact. For causal sequences, also use section 05. |
| 20 · Data & Charts | `8:41` | Bar, column, stacked bar, line, area, waterfall, scatter, bubble, combo, histogram, Pareto, variance, indexed growth, slope, dumbbell, small multiples, highlight-one-bar, actual-vs-target, and 100% stacked columns. |
| 21 · Tables | `8:42` | Comparison, financial, KPI, and executive-summary tables. Adapt columns and rows to the content. |
| 22 · KPIs & Dashboards | `8:43` | KPI cards, big numbers, progress/gauges, target-vs-actual, and executive dashboard. |
| 23 · Financial & Business Case | `8:44` | Revenue/cost bridge, investment → return, ROI/payback, and business-case summary. |
| 24 · Market & Competitive Landscape | `8:45` | White-space map. Combine with sections 02, 08, 20, and 25 for broader market analysis. |
| 25 · Portfolio & Segmentation | `8:46` | Four archetypes, cluster map, and segmentation tree. |
| 26 · Risk & Opportunity | `8:47` | Likelihood × impact, risk register, upside/downside, uncertainty range, and risk dependencies. |
| 27 · Scenarios & Decision Making | `8:48` | Options A/B/C. Combine with weighted criteria in section 09 and scenario tables adapted from section 21. |
| 28 · Maturity & Evolution | `8:49` | Five maturity levels, current → transition → future, and S-curve. |
| 29 · Transformation & Change | `8:50` | Adoption curve. Combine with roadmaps, operating models, strategy, and maturity patterns. |
| 30 · People & Organization | `8:51` | Org chart and role map. Use for organizational structure, not photographic team introductions. |
| 31 · Geography | `8:52` | Global footprint, European markets, location network, and regional comparison. |
| 32 · Executive Storytelling Slides | `8:53` | Executive summary, key takeaway, recommendation with rationale, and “so what?” |
| 33 · Page Layouts | `8:54` | Title + chart + takeaway, 50/50, one-third/two-thirds, four cards, hero number, chart + sidebar, diagram + explanation, full-page table, and dense analytical slide. |
| 34 · Team | `43:2` | Photographic introductions: one person, two leaders, three people, six people, twelve people, and team lead + delivery squad. Names, roles, biographies, and photos are editable placeholders. |
| 35 · Image-led Slides | `43:3` | Balanced image/text split, portrait image + editorial text, panoramic image, full-bleed image, overlapping text panel, two-image story, and editorial collage. |

### Common routing combinations

- Proposal or pitch: 32 + 14 + 23 + 34 + 35.
- Transformation plan: 28 + 29 + 07 + 15 + 22.
- Market assessment: 24 + 02 + 08 + 20 + 25.
- Team introduction: 34; add 30 only for reporting lines or responsibilities.
- Image-supported narrative: 35; use 33 for additional analytical compositions.
- Decision or recommendation: 32 + 27 + 09 + 26.
- Customer experience: 17 + 05 + 22.

Use these as starting points, not requirements to include every section.

## 5. Preserve Tailor’s visual system

Inspect the selected references for exact values. Default conventions:

- Canvas: 1920 × 1080.
- Outer margin: approximately 40 px.
- Typeface: Roobert Regular.
- Roobert SemiBold: available for deliberate emphasis; do not
  automatically make every heading bold.
- Primary colors:
  - White: `#FFFFFF`
  - Charcoal: `#2E2C36`
  - Electric blue: `#2C54FF`
  - Light gray: `#EEEEEE`
  - Muted gray: `#939394`
  - Warm neutral: `#F4F1EF`
- Use additional status colors only as demonstrated in Foundations.
- Preserve the original Tailor vector logo and its proportions.
- Use generous whitespace, regular-weight type, restrained rules,
  square-cornered containers, and selective blue emphasis.
- Match the chosen pattern’s hierarchy and density.

Default to English unless the user explicitly requests another language.

### Fonts

Verify Roobert is available in the destination before building.

Download references:
- Regular:
  https://tailor-hub.slack.com/files/U09SVMXEMCM/F06QYEWRNJ3/roobert-regular.otf
- SemiBold:
  https://tailor-hub.slack.com/files/U09SVMXEMCM/F06RD24GK1Q/roobert-semibold.otf

These links require appropriate Tailor Slack access.

Fonts installed only on the local computer may be unavailable to
Figma’s remote editing tools. Use supported Figma font-upload workflows
when needed, and follow any required rights-confirmation prompts.

If Roobert is unavailable, resolve font access or obtain the user’s
agreement to a temporary substitute. Do not silently substitute Inter.

Load the existing text fonts and the intended replacement fonts before
editing text. Verify the actual family and style names.

## 6. Plan the presentation

Before building, create a concise slide-by-slide plan containing:

- The message or purpose.
- The source content or evidence.
- The selected library section and pattern.
- Any required adaptation, chart, or image.

Choose layouts according to what the slide needs to communicate.

The library is a toolkit, not a checklist:
- Do not reproduce all its sections in a presentation.
- Do not include multiple slides that differ only in placeholder wording.
- Reuse a layout when repetition helps understanding, not to inflate
  slide count.
- If no pattern fits, adapt the closest one using the same visual rules.
- Do not force an unsuitable diagram merely because its title matches
  the topic.

Proceed with routine design decisions once the brief and destination
are clear. Ask only when missing information materially affects the result.

## 7. Build only in the destination

Use the current Figma skills and supported tools.

- You may copy the library slides you consider relevant into the
  user-provided destination, then adapt their text, imagery, data,
  and layout there. Use supported cross-file copy workflows and
  preserve editable elements.
- Copying must not create intermediate nodes in the source library.
- If direct copying is unavailable, reconstruct only the selected
  patterns in the destination using the inspected references.
- Keep text, shapes, diagrams, tables, and charts editable.
- Do not flatten complete reference slides into images.
- Recreate or import styles and variables appropriately in the target.
  Source node IDs, local style IDs, variable IDs, and image hashes
  must not be assumed valid in another file.
- Use supported asset export/upload workflows for cross-file images.
- Use auto-layout for related text and content groups.
- Load fonts before text mutations.
- Parent nodes before setting their positions.
- Return all created and modified node IDs.
- Work in manageable batches and validate each batch.

Replace library placeholder content with the user’s actual content.
Remove library-specific section labels, pattern numbers, download
instructions, and example-data footers from finished presentations
unless they serve the user’s intended purpose.

Use suitable presentation titles, page numbers, and source notes.

### Data and imagery

- Never present illustrative library values as factual business data.
- Use supplied or verified data, and label assumptions clearly.
- Check units, totals, chart scales, and financial calculations.
- Replace example portraits with supplied team photos when available.
- Never imply stock-photo or generated subjects are actual employees
  or clients.
- If example imagery is retained in a draft, label it clearly.
- Preserve image aspect ratios and inspect crops, particularly faces.
- Check text contrast over photography.

### Generate high-quality imagery when needed

When a slide needs imagery and the user has not supplied suitable
assets, create high-quality imagery using the available image-generation
tool. This is authorized by this workflow; do not ask for a separate
confirmation merely to generate an illustrative image.

- Choose imagery that supports the slide’s specific message. Avoid
  decorative filler and generic business imagery that adds no meaning.
- Art-direct the image to suit Tailor’s restrained visual style and the
  presentation’s subject. Keep lighting, color treatment, and overall
  photographic or illustrative style coherent across the deck.
- Generate for the intended placement: choose the right aspect ratio,
  adequate resolution, focal point, crop, and negative space for text.
- Keep titles, labels, logos, and body copy as editable Figma elements;
  do not bake them into the generated image.
- Inspect generated images before use. Refine images with visual
  artifacts, unsuitable crops, distracting details, or poor text contrast.
- Import finished assets using Figma’s supported upload workflow and
  use replaceable image fills in the destination deck.
- Generated imagery is illustrative, not documentary evidence. Do not
  present invented people, places, products, or events as factual photos.
- For introductions of real team members, use their actual supplied
  photos or request them when essential. Generated portraits may be
  used only as clearly identified fictional examples or placeholders.
- Keep analytical charts and diagrams native and editable; generate
  imagery for visual storytelling rather than rasterizing data visuals.
- If image generation is unavailable, explain the limitation and use
  suitable available imagery or an explicitly identified placeholder.

## 8. Validate and deliver

Before reporting completion:

1. Confirm the work is in the requested destination.
2. Verify the library was not modified.
3. Check for missing fonts, clipped text, unintended overlaps,
   out-of-bounds elements, and broken image fills.
4. Inspect representative screenshots, including dense slides,
   team layouts, and text over images when used.
5. Confirm consistent typography, colors, logo treatment, and spacing.
6. Check content accuracy, English copy unless otherwise requested,
   and absence of unintended placeholders.
7. Remove redundant slides that add no new message.
8. Confirm slide order, section names, and links.

Return the destination Figma URL and a concise summary of what was
created or changed. Disclose any remaining limitations accurately.
