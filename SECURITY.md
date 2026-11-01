# Security Policy

## Supported versions

Only the live site at [mrashidi.me](https://mrashidi.me), built from the `main` branch, gets
security fixes. Older releases and tags are not patched.

## Reporting a vulnerability

Report it privately through
[GitHub private vulnerability reporting](https://github.com/MRdevX/mrashidi.me/security/advisories/new).
Please do not open a public issue or pull request for a security problem.

Include what you found, where (URL, file, or endpoint), and the steps to reproduce it.

What to expect:

- An acknowledgement within 3 working days.
- An assessment, accepted or declined with the reason, within 10 working days.
- For accepted reports, a fix on `main` and a published advisory, crediting you unless you ask
  not to be named.

## Scope

In scope: the site at `mrashidi.me`, the content API at `api.mrashidi.me`, the Ask MR chat
assistant, and the code and infrastructure configuration in this repository.

Out of scope: denial of service through traffic volume, findings in third-party services the
site uses (Vercel, Cloudflare, Medium) that are not caused by this repository, and reports from
automated scanners without a demonstrated impact.
