# Logs

Evidence in order of cost: error tracker (grouped, fast) → logs (exact, noisy) → code. Error-tracker
instances, the CLI and their traps are in [`error-tracker.md`](error-tracker.md); what is deployed
where is in the `mr-ticket` skill's references. This file covers logs and access.

The project's provider, scopes and services come from the **Logs** and **Environments** Project
facts. The worked recipes below are for Google Cloud Logging on GKE; for another provider, keep the
same rules (scoped, bounded, trimmed) and translate the queries.

## Access rules

- Read-only access to the logs and error tracker of the environments the **Environments** fact
  marks readable is normal access. Read them whenever they help the investigation, without asking.
- Quote what the evidence needs (IDs, timestamps, status codes, messages). Leave out auth headers,
  tokens and cookies (for example `jsonPayload.express.req.headers`), and any personal or health
  field.
- If evidence needs more than read access (exec into a pod, read a secret, query a production
  database), stop. Name the exact permission and why, and draft the access request text (template
  in the `mr-work` skill's `references/writing.md`); the user files it. Never try a workaround.
- If the error tracker is self-hosted behind a VPN, probe it before concluding anything: see
  [`error-tracker.md`](error-tracker.md).

## gcloud basics

gcloud's default project on a developer machine is often unrelated: **always pass `--project`**,
taken from the **Logs** fact, one per environment. The fact also names cluster and namespace when
they matter. Some services may log outside the provider (another cloud); the fact says so.

Entries are `resource.type="k8s_container"`; the service is `resource.labels.container_name`. A
structured (JSON) payload typically has `level`, `message`, a logger `context`, a release
`version`, and for HTTP lines `express.req.{method,originalUrl,url,query,headers}`,
`express.res.statusCode`, `express.responseTime`. `severity` is set for warn/error; HTTP access
lines often have no severity, so filter those on status code. Request lines carry `trace`. Check a
few real entries before trusting these field names.

Always bound a query: `--freshness` (or a `timestamp>=` clause), `--limit`, and
`--format=json | jq` to keep only the fields you need.

```bash
# Errors and warnings of one service, last hour
gcloud logging read 'resource.type="k8s_container" AND resource.labels.namespace_name="<namespace>"
  AND resource.labels.container_name="<service>" AND severity>=WARNING' \
  --project <project> --freshness 1h --limit 50 --format=json \
  | jq -r '.[] | "\(.timestamp) \(.severity) [\(.jsonPayload.context // "-")] \(.jsonPayload.message)"'

# 5xx on one route
gcloud logging read 'resource.labels.namespace_name="<namespace>" AND jsonPayload.express.res.statusCode>=500
  AND jsonPayload.express.req.originalUrl:"/v2/<route>"' \
  --project <project> --freshness 6h --limit 50 --format=json \
  | jq -r '.[] | "\(.timestamp) \(.jsonPayload.express.res.statusCode) \(.jsonPayload.express.req.method) \(.jsonPayload.express.req.url) \(.trace)"'

# Everything one request did, across services
gcloud logging read 'trace="projects/<project>/traces/<TRACE_ID>"' \
  --project <project> --freshness 1d --limit 200 --format=json \
  | jq -r 'sort_by(.timestamp)[] | "\(.timestamp) \(.resource.labels.container_name) \(.severity // .jsonPayload.level) \(.jsonPayload.message)"'

# Is the new release running? (version per service, last 15 min)
gcloud logging read 'resource.labels.namespace_name="<namespace>" AND jsonPayload.version:*' \
  --project <project> --freshness 15m --limit 300 --format=json \
  | jq -r '.[] | "\(.resource.labels.container_name) \(.jsonPayload.version)"' | sort | uniq -c
```

An error-tracker event's `trace` tag is the same trace id, so an issue leads straight to the third
query.

Links for the report: a Logs Explorer URL is
`https://console.cloud.google.com/logs/query;query=<url-encoded filter>;duration=<PT1H>?project=<project>`.

## Verify after a deploy

The change is live only when the version query shows the new release on the service. Then: no new
error-tracker issues for that release (`sentry explore <org>/<project> -F release -F "count()"`),
no new error/5xx lines on the touched routes since the rollout, and the behaviour the ticket asked
for visible in logs or a read-only request.
