# AWS icons

Search the connected Draw.io library for the exact service and use the returned
AWS4 style. Prefer service/resource icons over generic cloud boxes. Preserve the
service label even if a neutral fallback is necessary.

Useful search terms include `aws lambda`, `aws api gateway`, `aws ecs fargate`,
`aws sqs`, `aws sns`, `aws s3`, `aws rds postgresql`, `aws aurora`, `aws dynamodb`,
`aws secrets manager`, and `aws cloudwatch`. Select the result whose title
matches the actual service, not just the first search hit.

The library commonly returns `mxgraph.aws4.*` stencils or `img/lib/aws4/...`
images. Do not construct a presumed image filename from the product name.

- If explicitly named, use RDS PostgreSQL/MySQL, Aurora, or DocumentDB icons
  rather than a plain engine logo. DocumentDB is not MongoDB itself.
- Use an MSK icon only if the component is actually Amazon MSK. A `Kafka` label
  alone does not imply MSK or justify Alibaba Cloud branding.
- For plain PostgreSQL, MySQL, MongoDB, or Kafka, use their product/engine logos
  per `third-party-icons.md`; neutral symbols are the honest fallback.
- VPC, subnet, region, and availability-zone containers must match the supplied
  topology. Do not add them merely to make the drawing look more sophisticated.

Use the shared card, container, and routing rules in `visual-standard.md`.
