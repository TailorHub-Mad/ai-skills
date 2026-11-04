# Third-party products and engine logos

External services deserve the same icon accuracy as the cloud platform. A Stripe,
GitHub, Kafka, or PostgreSQL node should be recognizable without reading a
generic cloud symbol. A custom internal component need not have a logo.

## Resolution order

1. Search Draw.io for the exact product/brand. Inspect title, style, and aspect
   ratio. A search for `stripe` may return "Diagonal Stripe"; reject that hit.
2. If necessary, narrow the search with `Stripe brand` or `PostgreSQL logo`.
   Use the returned URL or stencil exactly; don't guess an icon-service path.
3. If there is no match, fetch a trusted official brand asset or an established
   icon-library SVG and verify that it actually represents the product.
4. Embed the verified SVG as a data URI when permitted and portability matters.
   Percent-encode or base64-encode it, preserve its viewBox, and respect the
   asset's license/attribution and trademark rules. Never embed executable SVG
   content, scripts, or active external resources.
5. If no accurate asset is available, use a neutral labeled service card/database
   cylinder and disclose the fallback. Do not block the entire drawing or invent
   a plausible-looking logo.

## Mapping examples

| Actual component | Accurate representation | Avoid |
| --- | --- | --- |
| Stripe | Stripe logo and exact service label | Diagonal-stripe shape, generic Azure payment icon |
| External product with no verified logo | Neutral card with exact product name | An invented wordmark or another vendor's icon |
| Kafka | Apache Kafka product logo | MSK unless explicitly specified; Alibaba logo as an engine fallback |
| Amazon MSK | AWS managed-service icon | Implying it is self-managed Kafka |
| PostgreSQL / MySQL / MongoDB | Product/engine logo | Assuming RDS/Azure/DocumentDB from the surrounding cloud |
| Azure Cosmos DB | Azure Cosmos DB icon | MongoDB logo merely because the API is Mongo-compatible |
| Internal webhook handler | Function icon if it runs as a Function; otherwise neutral component | Stripe logo for code owned by your application |

## Card integration and export

Use the icon as the image of a native editable label card, with roughly 28–34 px
of height and sufficient text padding. Wordmarks may need more width but should
not dominate the card. Keep a readable text label even when the brand is obvious.

Check the actual image at normal zoom. An HTTP 200, a declared `image=` style,
or a successful XML parse does not prove it renders correctly in Draw.io, PNG,
or PDF. External URLs need network access; embedded images improve portability
but still require a renderer that supports their format.
