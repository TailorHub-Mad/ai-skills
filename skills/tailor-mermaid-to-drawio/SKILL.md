---
name: tailor-mermaid-to-drawio
description: Convert Mermaid architecture diagrams into polished Draw.io XML diagrams using cloud-native Azure or AWS icon libraries, enterprise container boundaries, and clean labeled flows. Use when a user asks to transform Mermaid into Draw.io, requests Azure/AWS architecture visuals, or needs service-accurate icon mapping and layout consistency for cloud diagrams.
---

# Tailor Mermaid To Drawio

Convert Mermaid graph intent into clean Draw.io XML with cloud-specific icons and consistent architecture layout.

## Workflow

0. Preflight: verify Draw.io MCP availability
- Before doing any substantial work, confirm the Draw.io MCP tools are available in the current session/environment.
- If the Draw.io MCP is not available, stop immediately and return a short message telling the user that this skill requires the Draw.io MCP to be enabled/installed.
- Do not continue with icon mapping, layout work, or XML generation if the MCP is unavailable (to avoid wasting tokens).

1. Identify provider and diagram scope
- Detect target cloud: Azure, AWS, or mixed.
- Preserve exact service labels from the Mermaid source and user prompt.
- If provider is ambiguous, infer from service names and keep labels unchanged.

2. Load only the needed icon mapping reference
- For Azure paths and mappings, read `references/azure-icons.md` (relative to this skill directory).
- For AWS paths and mappings, read `references/aws-icons.md` (relative to this skill directory).
- Do not load both references unless the diagram is intentionally multi-cloud.

3. Build nodes with image icon style
- Use image-style nodes with provider icon paths from the references.
- Keep node text as the exact service name.
- If an exact icon file is unavailable in the current Draw.io build, choose the nearest equivalent from the same domain/category and keep the label exact.
- For Kafka components, default to `mxgraph.alibaba_cloud.kafka` when it renders more reliably than provider-specific Kafka/MSK variants in the current Draw.io build (unless the user requests a different Kafka icon explicitly).
- For database engines (PostgreSQL, MySQL, MongoDB), prefer engine-specific icons over generic cylinders when available.
- Reliable generic engine icons in Draw.io:
  - PostgreSQL: `mxgraph.alibaba_cloud.postgresql`
  - MySQL: `mxgraph.alibaba_cloud.mysql`
  - MongoDB: `mxgraph.alibaba_cloud.mongodb`
- In AWS diagrams, if the label explicitly indicates a managed AWS database variant, prefer AWS-native database icons:
  - RDS PostgreSQL: `mxgraph.aws4.rds_postgresql_instance` (or `_alt`)
  - RDS MySQL: `mxgraph.aws4.rds_mysql_instance` (or `_alt`)
  - Aurora: `mxgraph.aws4.aurora` / `mxgraph.aws4.aurora_instance`
  - Mongo-compatible managed DB: `mxgraph.aws4.documentdb_with_mongodb_compatibility` (or `mxgraph.aws4.documentdb_elastic_clusters` when explicitly elastic)
- If the provider is AWS but the node is only labeled with a plain engine name (for example `PostgreSQL`, `MySQL`, `MongoDB`) and no managed service is specified, prefer the stable engine icon (for example Alibaba Cloud engine logos) while keeping the exact label and container context.
- In Azure diagrams, if the label explicitly indicates a managed Azure database service, prefer Azure-native database icons:
  - Azure Database for PostgreSQL -> Azure PostgreSQL service icon from `img/lib/azure2/...` (or nearest Azure PostgreSQL icon variant available in the current build)
  - Azure Database for MySQL -> Azure MySQL service icon from `img/lib/azure2/...` (or nearest Azure MySQL icon variant available in the current build)
  - Azure Cosmos DB (including Mongo API variants) -> Azure Cosmos DB icon / Mongo API variant when available
- If the provider is Azure but the node is only labeled with a plain engine name (for example `PostgreSQL`, `MySQL`, `MongoDB`) and no Azure managed service is specified, prefer the stable engine icon (for example `mxgraph.alibaba_cloud.postgresql/mysql/mongodb`) while keeping the exact label and container context.

4. Apply enterprise architecture layout
- Group services into clear containers by tier/domain (Edge, API, Compute, Data, Observability, Shared Services).
- Keep data flow direction consistent (typically left-to-right).
- Route connectors to minimize crossings and label critical paths.
- Keep ingress/egress boundaries explicit (internet edge, private zone, data boundary).

5. Produce Draw.io XML output
- Emit valid Draw.io XML only.
- Final output must be Draw.io XML via the Draw.io XML MCP path (not a Mermaid import URL).
- Ensure all referenced icon paths follow provider library conventions.
- Keep text readable and avoid overlapping shapes and labels.

6. Verify before returning
- Confirm the final artifact is XML-based (not Mermaid import) and opens with `type=xml`.
- Spot-check at least one provider icon style is present (for example `mxgraph.aws4...` or `img/lib/aws4/...`).
- If a third-party component is present (for example Kafka), prefer provider-native managed service icons first (for example MSK on AWS), unless the user requests a specific alternate icon library/path.

## Output Rules

- Preserve user-intended semantics from Mermaid.
- Prefer icon correctness over visual novelty.
- Keep output production-ready: balanced spacing, aligned tiers, and clear labels.
- Fail fast if Draw.io MCP is unavailable; provide a brief prerequisite message instead of attempting a text-only conversion.
- If fallback icons are used, preserve exact service names so meaning is never lost.
- For Kafka in mixed or AWS diagrams, prefer the stable `mxgraph.alibaba_cloud.kafka` icon unless the user explicitly requests AWS MSK branding.
- For databases, prefer engine logos first, then provider-managed DB icons when the service is explicitly named, and only then fall back to a generic database cylinder/icon.
- Apply the same managed-service-vs-engine rule consistently across AWS and Azure database nodes.
- If you use Mermaid import as a preview, do not stop there; still deliver the XML version as the final result.

## Resources

- Azure mappings: `references/azure-icons.md` (relative to this skill directory)
- AWS mappings: `references/aws-icons.md` (relative to this skill directory)
