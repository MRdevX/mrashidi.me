# Who depends on this service

A provider's consumers (other repos, mobile and web apps, partner integrations) ship on their own schedules, so a provider change that breaks them breaks production before their fix lands. The **Consumers** Project fact lists them: each consumer, how it calls (gRPC, REST, events, shared cache keys, token verification), which files in this repo form the contract, and where the consumer's caller code lives. A project may also have its own impact-check skill that runs this check against the live checkouts; this file explains what to check and what to do with the result.

## What to map per consumer

| Surface | Contract files in the provider | What to look for in the consumer |
| --- | --- | --- |
| gRPC | the `.proto` files and their handlers | generated stubs (they lag the provider; that is normal) and the calls that use them, e.g. `client_stub.<snake_name>(` |
| REST | routes: controller decorators or route tables, global prefix, version | hand-written or generated API clients, hard-coded prefixes and versions, copied request/response types |
| Shared state | cache key prefixes, queue names, event payloads | readers and writers of the same keys or events |
| Auth | token signing keys (JWKS), token claims | where the consumer verifies or reads them |

Handler names are not always cased like the RPC (`@GrpcMethod(…, 'getThing')` for `GetThing`), so match RPC names case-insensitively.

**What breaks a consumer:** removing or renaming a used RPC, route or handler; changing its request/response type; removing, renumbering, or retyping any field or enum value in a message it reaches (nested types included); changing a shared key prefix, event shape, signing key endpoint or token claim it reads; bumping a version or prefix the consumer hard-codes. Adding RPCs or routes, adding fields with new numbers, and touching surfaces no consumer calls are safe for that consumer (still check callers inside this repo).

## Expand / contract (the only safe way to change a used contract)

1. **Expand** (this project's ticket): add the new RPC, field, or route alongside the old. Mark the old one deprecated (in protos `[deprecated = true]` with a comment `// deprecated: <ticket>, remove after <consumer ticket>`). Both work. Ship it to production.
2. **Migrate** (a ticket for the consumer's team): the consumer regenerates stubs or clients and switches. Draft the ticket body from the consumer-ticket template in [`writing.md`](writing.md); the user files it in the consumer team's tracker and agrees timing with them.
3. **Contract** (a new ticket, after the consumer change is in production): remove the old one. In protos, `reserved` its number and name so they are never reused.

Never fold steps 1 and 3 into one PR, even when "nothing uses it": a check reads the consumer's default-branch checkout, not what is deployed.

## REST consumers

- Find the consumer's API services and their base URL setting; note any prefix and version hard-coded there. A version bump in the provider is a breaking change for that consumer.
- Copied types (`.d.ts`, generated clients) must be regenerated and copied in the consumer's PR when a request/response class changes.
- The same expand/contract rule applies to removing or renaming a route or a response field the consumer reads: keep the old one until the consumer release that stops using it is in production.

## API collections

If the project keeps an API collection (Bruno, Postman, `.http` files) mirroring its endpoints, a route change updates its request in the same PR, following the collection's own folder and naming convention, with URLs through its base-URL variable, never a hard-coded version.
