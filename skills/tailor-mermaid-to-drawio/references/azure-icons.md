# Azure icons

Use the exact Azure service icon for an explicitly named Azure managed service.
Search the connected Draw.io library first and reuse the returned image/style.
These known library paths are lookup hints, not a guarantee that every build or
exporter can resolve them. Verify the selected asset in the rendered output.

| Service | Path under `img/lib/azure2/` |
| --- | --- |
| API Management | `integration/API_Management_Services.svg` |
| Function App | `compute/Function_Apps.svg` |
| App Service | `compute/App_Services.svg` |
| Storage Account | `storage/Storage_Accounts.svg` |
| App Configuration | `integration/App_Configuration.svg` |
| Front Door | `networking/Front_Doors.svg` |
| DNS | `networking/DNS_Zones.svg` |
| Private Endpoint | `networking/Private_Endpoint.svg` |
| WAF | `networking/Web_Application_Firewall_Policies_WAF.svg` |
| Entra ID | `identity/Azure_Active_Directory.svg` |
| Managed Identity | `identity/Entra_Managed_Identities.svg` |
| Application Insights | `management_governance/Application_Insights.svg` |
| Log Analytics | `analytics/Log_Analytics_Workspaces.svg` |
| Cosmos DB | `databases/Azure_Cosmos_DB.svg` |
| Service Bus | `integration/Service_Bus.svg` |
| Azure AI Search | `app_services/Search_Services.svg` |

For portable web rendering, an image path may be qualified with
`https://app.diagrams.net/`; this still requires network access. If offline
delivery is required, embed the verified SVG when its license allows it.

Search Azure Database for PostgreSQL/MySQL by service name because file names
vary between library versions. An API-specific Cosmos icon is appropriate only
when the API is actually specified.

A plain `PostgreSQL`, `MySQL`, or `MongoDB` label does not establish that Azure
hosts a managed variant. Follow `third-party-icons.md` for engine logos instead
of silently changing the architecture. A missing Azure icon warrants a neutral
semantic fallback, not an unrelated Azure product or another cloud's branding.
