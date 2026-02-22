# Azure icon path strategy (Draw.io)

Use image-style nodes with paths under `img/lib/azure2/...`.

Recommended categories:
- Networking: `img/lib/azure2/networking/...`
- Compute: `img/lib/azure2/compute/...`
- Storage: `img/lib/azure2/storage/...`
- Integration: `img/lib/azure2/integration/...`
- Analytics: `img/lib/azure2/analytics/...`
- Management/Governance: `img/lib/azure2/management_governance/...`

Common mappings:
- API Management -> `integration/API_Management_Services.svg`
- Functions -> `compute/Function_Apps.svg`
- Storage Account -> `storage/Storage_Accounts.svg`
- App Configuration -> `integration/App_Configuration.svg`
- Front Door -> `networking/Front_Doors.svg`
- DNS -> `networking/DNS_Zones.svg`
- WAF -> `networking/Web_Application_Firewall_Policies_WAF.svg`
- App Insights -> `management_governance/Application_Insights.svg`
- Log Analytics -> `analytics/Log_Analytics_Workspaces.svg`
- Azure Database for PostgreSQL -> use Azure PostgreSQL database/server icon under `img/lib/azure2/...` (name varies by library version; prefer exact PostgreSQL server/service icon)
- Azure Database for MySQL -> use Azure MySQL database/server icon under `img/lib/azure2/...` (name varies by library version; prefer exact MySQL server/service icon)
- Azure Cosmos DB -> use Cosmos DB icon (and API-specific variant if available, e.g. Mongo API)

Database mapping rule:
- If the label explicitly names an Azure managed database service, use the Azure-native DB icon.
- If the label is only a database engine name (for example `PostgreSQL`, `MySQL`, `MongoDB`) inside an Azure container, prefer a stable engine-specific icon and keep the exact label.
- Fall back to a generic database icon only if neither managed-service nor engine-specific icons render in the current Draw.io build.

If any exact file is unavailable in current Draw.io build, pick nearest equivalent from same category and keep text label exact.
