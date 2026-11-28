### Overview

Failed queue cleans were only logged, so nothing reached Sentry. This reports them.

| Change | Effect |
| --- | --- |
| `captureException` in the clean job | Failures show up in Sentry |

> [!NOTE]
> The retry count is unchanged on purpose.

* Relates to [ABC-123](https://acme.atlassian.net/browse/ABC-123)
