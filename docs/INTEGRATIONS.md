# Connections and deployment boundaries

## Current implementation

The browser creates a reviewable handoff from a selected scenario and its latest recorded decision. Approval of an action does not send a message. The user separately reviews the draft before opening Outlook or exporting a task.

Outlook is an **editable compose link**, not an authenticated mailbox connection. The code URL-encodes recipients, subject and body. A manual send remains inside Outlook. Copy/download are fallbacks for clients or tenants that do not support the compose link.

ERP is a **CSV interchange**, not live synchronization. Users can review the export before importing it. The file contains a synthetic marker, review status, decision ID, owner and update time. An administrator must map fields to the target system. No product-specific SAP or Dynamics endpoint is invented.

## Proposed Microsoft Graph connector

1. Register an application in the organization's Microsoft Entra tenant and configure a callback URL.
2. Implement authorization-code login, protected sessions and a server-only token store. Let an administrator decide permissions and consent.
3. For a selected message, use narrowly scoped delegated reading with the permitted folder/shared mailbox scope. Do not ingest all employee mail by default.
4. Creating a saved draft uses `POST /me/messages` with delegated `Mail.ReadWrite`. Requesting this permission is separate from our compose-link demo. Graph sending is a separate action and remains outside the current prototype.
5. Preserve source provenance and permissions when extracting approved content into role-specific retrieval. A browser role dropdown is not an access-control boundary.

Official API reference: https://learn.microsoft.com/en-us/graph/api/user-post-messages?view=graph-rest-1.0

## Proposed ERP connector

Confirm whether the team uses SAP S/4HANA, Dynamics 365 or another product, the tenant/environment, and the correct task object. Map external ID, case title, rationale, accountable owner, next update, review state and evidence links. Use a service identity approved for that object, idempotent writes keyed by the decision ID, and an audit receipt. An export is not evidence of a successful remote write.

## Local LLM and hosted deployment

On this laptop the portable Ollama runtime listens only on 127.0.0.1:11434. The Next.js server calls it; the browser never receives API credentials. The model path `.runtime/models` and download archive are ignored by Git. `npm run model:start` restores the service after a restart.

For Vercel, use a server endpoint reachable from Vercel and approved for the intended data. A laptop localhost address will not work there. Do not expose an unauthenticated Ollama port to the public internet.

Model reference: https://ollama.com/library/qwen3:1.7b
API reference: https://docs.ollama.com/api/chat
Kiro credits: https://kiro.dev/docs/billing/
Kiro CLI authentication: https://kiro.dev/docs/getting-started/authentication/

Kiro's documented headless CLI authentication spends development subscription credits. It is not a documented generic chat-completion service for this website. No Kiro credentials are read or consumed by RepRadar.
