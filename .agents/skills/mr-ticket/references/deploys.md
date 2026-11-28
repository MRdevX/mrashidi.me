# What is actually deployed

`scripts/shipped.sh` answers "which release contains this commit". This file answers "and did that
release reach the environment".

Containment test: `gh api repos/O/R/compare/<tag>...<sha> --jq .ahead_by`, where `0` means the
commit is an ancestor of the tag.

## Topology

The **Environments** Project fact says, per repo and environment, what deploys it (push to the
default branch, a published release tag, an infrastructure apply) and how to tell which version is
live. Read it before answering; never assume. Where it names several clouds or clusters for one
environment, check which one serves a hostname before assuming:

```bash
dig +short <host>     # the address range tells you which provider answers
```

Per-environment config overrides (values files, env files) are where a service quietly differs from
its defaults; the Environments fact says where they live.

## Traps

Each of these has produced a confidently wrong answer.

**Draft releases are not deploys.** Some repos create them nightly. Filter `isDraft == false`.

**Only the repo-named tag family drives the deploy.** A monorepo may publish per-service tags like
`service-foo@1.17.0` while only `<repo>@*` triggers the production workflow. Comparing against the
wrong family answers a different question.

**A red workflow run does not mean your service failed.** A promote workflow that fans out one job
per service goes red if any single one fails. Check the job for yours:

```bash
gh run view <id> --repo O/R --json jobs -q '.jobs[] | "\(.name): \(.conclusion)"'
```

**The image tag in a values file can be decoration.** A pipeline that overrides it by digest
(`--set ...image=...`) makes a stale-looking pin meaningless.

**In an infrastructure repo, pick the workflow by the PR's changed path, not by name.** Two
similarly named apply workflows can target different things, and the wrong one looks stale or
failing.

```bash
gh pr view N --repo O/R --json files -q '.files[].path'
```

**Infrastructure repos often have no meaningful release tags**, so "not in any release" is expected
there. Judge them by their apply run alone.

Cross-check any of these against the commit's own checks:

```bash
gh api repos/O/R/commits/<sha>/check-runs --jq '.check_runs[] | "\(.name): \(.conclusion)"'
```
