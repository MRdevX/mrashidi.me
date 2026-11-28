# Error tracker

The instance, org and which service reports where come from the **Error tracker** Project fact.
The worked recipes below are for Sentry and its newer `sentry` CLI; for another tracker, keep the
same questions and translate the commands.

A project can use more than one instance (SaaS for most services, a self-hosted one for a few).
Which one a service reports to is decided by its DSN in the deploy values, so check those before
trusting an empty project.

**An empty project is ambiguous.** Wrong host, wrong project, an environment that never deployed,
and broken delivery all look identical, because Sentry SDKs drop transport errors silently and log
nothing. Rule those out before concluding the instrumentation is missing.

Start every investigation by asking whether the environment reports at all, and from which build:

```bash
sentry explore <org>/<project> -F environment -F release -F "count()" --period 90d
```

A newest release that predates the PR means the environment never ran the code, whatever the
release tags say.

## The CLI

`brew install getsentry/tools/sentry`. Note this is the newer `sentry` CLI, not `sentry-cli`.

```bash
sentry auth status
sentry issue list <org>/<project> --period 14d --limit 25 --json \
  | jq -r '.data[] | "\(.shortId) [\(.level)] \(.title) | events=\(.count) last=\(.lastSeen)"'
sentry issue events <SHORT-ID> --json \
  | jq -r '.data[] | {dateCreated, tags: [.tags[] | select(.key|test("environment|release")) | "\(.key)=\(.value)"]}'
```

`--json` returns `{"data": [...]}`. Table output truncates titles, so use JSON for anything real.

Links for the report: an issue is `https://<org>.sentry.io/issues/<id>/` on SaaS, or
`https://<host>/organizations/<org>/issues/<id>/` self-hosted.

## Self-hosted behind a VPN

When the fact says the instance needs a VPN, probe it first:

```bash
curl -s -o /dev/null -w '%{http_code}' --max-time 5 https://<host>/api/0/
```

No `200` means ask the user to connect the VPN; it is not a token or tracker problem, and not a
finding. A wrapper that keeps a second credential for that instance (named in the fact) avoids
switching the stored login.

## Switching instances

The CLI stores exactly one credential; its `auth` table is `CHECK (id = 1)`, so there are no profiles.

Use a **user** token (`sntryu_`) from `/settings/account/api/auth-tokens/`. Org tokens (`sntrys_`)
are base64 JSON embedding their instance URL, and the CLI honours that over any config, so a token
minted by one instance cannot be pointed at another.

```bash
sentry auth login --url https://<host> --token <user token>
sentry cli defaults url https://<host>
```

Both are needed: the login sets the credential host, the default sets where requests route, and a
mismatch is refused. Clear with `sentry cli defaults url --clear` before returning to SaaS.

To read another instance without disturbing the stored login:

```bash
SENTRY_URL=https://<host> SENTRY_AUTH_TOKEN=<token> SENTRY_FORCE_ENV_TOKEN=1 \
  sentry issue list <org>/<project> --json
```

`SENTRY_FORCE_ENV_TOKEN=1` is what makes the env token win; without it the CLI detects it and keeps
using the stored login.

## Self-hosted quirks

`sentry project list <org>/` can fail with "Network error" on self-hosted; `sentry api` works
throughout:

```bash
sentry api "/projects/<org>/<slug>/issues/?statsPeriod=24h"
sentry api "/projects/<org>/<slug>/keys/"          # confirms a DSN's project and key
```

Valid `statsPeriod` values are only `''`, `24h`, `14d`. The issues endpoint defaults to
unresolved, so pass `query=` to see everything.

A self-hosted instance whose `system.url-prefix` still advertises a retired hostname gives out DSNs
and alert-email links that fail TLS; compare the DSN host with the one that answers.
