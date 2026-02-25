# AWS icon path strategy (Draw.io)

Use image-style nodes with paths under `img/lib/aws4/...` when available in the current Draw.io version.

Recommended categories:
- Compute
- Integration
- Networking & Content Delivery
- Database
- Analytics
- Security

Guidelines:
- Prefer official AWS4 icon paths over generic shapes.
- Keep exact service name in node label even if icon fallback is required.
- If a path is not available in the local build, use nearest AWS equivalent icon from same domain and preserve the service label.
- Keep the same container/routing/layout rules as the Azure workflow.
