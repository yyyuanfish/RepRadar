# RepRadar

**Listen closely. Decide confidently.**

A human-centered Corporate Affairs intelligence prototype for the **UZH.ai Syngenta challenge**. It connects stakeholder signals, explainable triage, role-specific knowledge retrieval, recommendations and a recorded human decision.

This is a hackathon concept, not an official Syngenta product. Every incident, source, score and playbook in the demo is synthetic.

**Live demo:** https://repradar-phi.vercel.app · **Source:** https://github.com/yyyuanfish/RepRadar

**Start with the [team handoff guide](docs/TEAM_HANDOFF.md).**

## Pitch materials

- [Editable PowerPoint: 12 main slides + 5 appendix slides](outputs/pitch/RepRadar-Pitch-Public.pptx)
- [PDF visual backup](outputs/pitch/RepRadar-Pitch-Public.pdf)
- [Ten-minute English script, demo clicks and seven-person ownership](docs/PITCH_SCRIPT.md)
- [Product, pilot and cost assumptions](docs/PRODUCT_SPEC.md)
- [Sources and asset attribution](docs/ASSETS.md)

The deck includes speaker notes. Headings use Poppins, included under `assets/fonts/` with its SIL license; install the two font files on another presenting computer or use the PDF backup to preserve appearance. Slide 6 opens the live demo in a browser using a clickable button; the link is `https://repradar-phi.vercel.app` and opens the public website. Slides 16–17 map demo features to the five judging criteria. The PDF is a fixed-layout visual backup assembled from inspected renders. Use the PPTX to edit text and native tables. The public Vercel deployment uses source-excerpt mode; local Qwen is optional.

## 快速开始 / Run locally

Requires Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open **http://localhost:3000**. The development server reads `.env.local`. On this computer a local Qwen3 model is configured; start its service with `npm run model:start` in a separate terminal. On this computer, double-click **Start-RepRadar.command** to reopen the local demo. The reviewed preview runs on port **3001** with `npm run start -- -p 3001` after a build.

A new clone works in source-excerpt mode without configuration. To enable local generation:

```bash
# Install Ollama from https://ollama.com/download on a new computer.
ollama pull qwen3:1.7b
cp .env.example .env.local
npm run model:start
# In another terminal:
npm run dev
```

The model download is about 1.4 GB. This workspace uses a portable Ollama runtime and model files in `.runtime/`, excluded from Git. `scripts/start-model.sh` finds that runtime or a normal Ollama installation. Keep the model service running while presenting. **Team handoff → Assistant connection** checks whether the model is reachable and downloaded.

```bash
npm run typecheck
npm test
npm run build
npm start
```

## 明天怎样演示 / Two-minute demo

1. **Overview:** show the first-screen KPI cards, trend, stakeholder groups and priority queue; introduce Maya in Basel and Lin, a fictional farmer in China. A European policy headline has left Lin unsure about next season. The default scenario is the residue consultation.
2. **Run demo → Start with the signals:** the inbox filters to Chinese. Inspect **SIG-012**, preserving Lin’s original request and the English translation.
3. **Risk workspace → Analysis:** show why the headline cannot establish a restriction in China. Maya needs the original proposal and local crop, product and market context.
4. **Recommendations:** compare checking applicability, a grower Q&A, and monitoring. Show the tradeoff between speed and evidence.
5. **Ask RepRadar:** ask “How should we respond to the farmer in China about the residue proposal?” Inspect **KB-02**. Close the assistant, switch to Regulatory Affairs, and ask about local product applicability to expose **KB-04**.
6. **Review an option:** assign “Maya Keller + China Regulatory / local agronomy adviser”, record the need for verification and a 14:00 Zurich update, then approve/reject/defer with a rationale.
7. **Decision log → Prepare team handoff:** show the editable Outlook draft and ERP export. The demo ends with a recorded response plan, not a sent reply. A later outcome can inform a lesson, followed by explicit curator approval before offline retrieval reuses it.

The water stewardship scenario remains available for Q&A or a second demonstration. Keep the main pitch on Lin’s question so the live demo continues the opening story.

Use **Demo walkthrough** for the in-product guide. To reset, open **About this prototype → Reset demo history**. Export a backup first if needed. The decision record survives refresh using this browser’s local storage.

## Vercel 部署

The app uses the Next.js App Router and standard server routes. Vercel can detect Next.js automatically.

1. Create a Git repository and push this project to your GitHub repository. Commit `package-lock.json`. Do not commit `.env.local`, `node_modules`, `.next`, or `.build`.
2. In Vercel, choose **Add New → Project**, import the repository, and select the **Next.js** preset.
3. Use the repository root, install command `npm ci`, build command `npm run build`, and the default output setting. Choose Node.js 22.
4. For a public hackathon demo, leave the environment variables unset. All workflows work without a paid model.
5. Deploy, open the generated URL, and rehearse both scenarios. Decisions are per-browser, not shared between participants.

There is no database migration. The current public deployment is https://repradar-phi.vercel.app on the cl-thesis Hobby workspace.

Official references: [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).

## Connected assistant

The lightweight local option is **Qwen3 1.7B (Apache 2.0), through Ollama**. It generates English and Chinese answers using the selected role’s evidence. This is a small demo model: citations need human verification. Media/regulatory/language perspective cards are still authored examples, not autonomous agents.

- Greetings and incomplete inputs get clear guidance instead of a failed search message.
- Broad questions such as “Summarize this case” get the relevant role playbook.
- “Today’s news” explicitly explains that no live feed is connected. The model must not invent current events.
- Follow-up questions include up to four recent messages, capped to 900 characters each. Changing role or scenario clears this context.
- The API filters documents by role/scenario, checks citation IDs, and falls back to excerpts if the model fails or references invalid sources. This is not an entailment check.
- Every case answer also displays the scenario’s fixed evidence boundary, separately from generated text. Local applicability remains unverified until a qualified colleague checks it.
- Locally approved lessons remain in browser retrieval, not the model’s trusted server context.

For a hosted open-source model, set `LLM_PROVIDER=openai-compatible`, `LLM_BASE_URL=https://your-approved-endpoint/v1`, `LLM_MODEL`, `LLM_API_KEY` and `ENABLE_LIVE_LLM=true`. Keys remain server-side. **Vercel cannot reach the Ollama service on your laptop via localhost.** Use an approved reachable model endpoint for the deployed website. With no endpoint, the site clearly falls back to knowledge excerpts.

The role selector models relevance, not authenticated authorization. The demo contains synthetic data. A production deployment needs SSO, document permissions, endpoint protection, retention rules and rate/spend limits.

## Outlook and ERP handoff

**Decision log → Prepare team handoff**, or the **Team handoff** navigation item, creates an editable brief with the source uncertainty, proposed action, owner and decision reference. Review the message, enter a colleague and update time, then:

- **Open Outlook draft** opens Microsoft 365’s compose page with encoded draft text. It neither reads your inbox nor sends mail. Sign in to Outlook if needed.
- **Copy email text / Download brief** works with other email clients.
- **Export task for ERP** downloads a CSV with `external_id`, `title`, `description`, `owner`, `review_at`, `status`, `synthetic`. The next-update field uses Zurich local wall time. It needs mapping/import in SAP, Dynamics or your task system; no ERP connection is claimed. Spreadsheet formula prefixes are escaped.

A real inbound Outlook connector needs an Entra application, delegated permissions and tenant approval. A real ERP connector needs the product, tenant, object mapping and approved API access. See [integration notes](docs/INTEGRATIONS.md).

## Kiro credits

Kiro’s Free tier currently includes 50 development credits. Its documented API keys authenticate the **Kiro CLI** for CI/headless work on paid tiers; they are not a documented OpenAI-compatible web-chat endpoint. Use the credits for project implementation or testing in Kiro. The running RepRadar assistant uses Ollama and does not consume these credits. See [Kiro billing](https://kiro.dev/docs/billing/) and [Kiro authentication](https://kiro.dev/docs/getting-started/authentication/).

## What works, what is simulated

| Capability | Status |
| --- | --- |
| Two coherent end-to-end scenarios | Working |
| 14 initial signals, one optional injected signal | Working with synthetic records |
| EN, DE, IT, ES, ZH text and English translations | Authored examples, not a translation model |
| Inbox search, language/stakeholder filters and review notes | Working |
| Risk scoring and user-adjustable weights | Working transparent heuristic |
| Sentiment, topic labels, trend, agent perspectives | Authored synthetic annotations/aggregates |
| Role/domain-specific retrieval | Working local lexical retrieval, not vector search |
| Cited knowledge assistant | Local Qwen3 through Ollama, or hosted compatible model; excerpt fallback |
| Color dashboard | Interactive topic trend, all seven stakeholder groups, sentiment and language coverage |
| Reduced information load | Simple view by default; detailed charts and scoring controls on demand |
| Outlook / ERP handoff | Editable compose link and CSV export; no mailbox/ERP synchronization |
| Recommendation preference ranking | Working multi-criteria ranking over authored actions |
| Approve / edit / reject / defer, owner, rationale | Working |
| Decision and lesson persistence | Browser local storage only |
| Review-gated learning | Working for local retrieval; no automatic model retraining |
| Live news/social ingestion, agent orchestration | Pilot extension, not implemented |
| SSO, permission enforcement, enterprise audit, on-prem deployment | Production extension |
| Validated controversy probabilities or business impact | Not claimed |

## Scoring and recommendations

Risk priority uses impact, urgency, momentum and stakeholder relevance, each rated 1–5 in the synthetic scenario:

`score = Σ (rating / 5 × weight) / Σ weights × 100`

The default weights are 35, 25, 20 and 20. High is ≥75, medium ≥50, low <50. Ratings and thresholds are hypotheses to calibrate, not empirical probabilities. Weights are normalized, so they need not sum to 100. Setting all weights to zero shows a warning and returns 0.

Action preference fit uses illustrative 1–5 ratings for evidence quality, stakeholder trust and speed. Employee preferences re-rank the same three actions. The score does not predict success. Potential community harm should be reviewed independently of media reach.

## Data and knowledge

- `lib/data.ts`: multilingual signals, scenario narratives, source excerpts, twelve synthetic knowledge documents.
- `lib/engine.ts`: normalized scoring, scoped lexical retrieval, action ranking and approved-lesson conversion.
- The original mock workbook conversion is retained locally and excluded from public source; the application uses the synthetic records in `lib/data.ts`.
- `docs/ASSETS.md`: assets, research and branding sources.

All retrieved documents retain IDs, owners, domains, versions and synthetic labels. A locked cross-functional citation tells the employee to switch the demo role. The library does not imply an actual corporate authorization boundary.

## Architecture

```text
Synthetic stakeholder signals
    ↓
Curated language / sentiment / agent annotations
    ↓
Explainable risk score + editable employee priorities
    ↓
Role and scenario filter → lexical source retrieval
    ↓
Extractive assistant OR optional server-side LLM
    ↓
Preference-ranked options → human decision + rationale
    ↓
Outcome lesson → explicit curator review → local retrieval
```

The pilot design adds licensed ingestion, multilingual classification, independently evaluated agents, permission-filtered hybrid search, identity and server-side audit. A private model deployment is a proposed option, not a capability supplied by the Vercel demo.

## Human-centered design

The interaction makes uncertainty and original wording visible; lets employees change risk weights and preferred actions; supports rejection and deferral; requires an accountable owner and reason; and prevents automatic publication. The learning mechanism requires a second explicit review step. Keyboard navigation, labelled inputs, modal focus management and reduced-motion preferences support accessibility.

Potential production evaluation: task completion time against the current workflow, citation correctness, false alarms and missed issues by language, local-review corrections, perceived control and representation of quieter stakeholder groups. Targets in the deck are proposed pilot gates, not measured results.

## Project map

```text
app/                    Next.js page, styles and server endpoints
components/RepRadar.tsx  Interactive product interface
lib/                    Synthetic data, retrieval and scoring
public/assets/          Logo and field photograph
scripts/                Browser smoke test and deck source
tests/                  Meaningful scoring/retrieval unit tests
 docs/                  Pitch script, demo guide, assumptions and sources
 outputs/pitch/         Editable PowerPoint and PDF backup
```

The PPTX build requires the desktop bundled `@oai/artifact-tool` runtime used to create the deck. It is not part of the website build or Vercel runtime.

### Interface and brand refresh

RepRadar leads the sidebar; the Syngenta Group mark appears beneath “Built for the Syngenta challenge.” The new radar-and-leaf mark is an editable SVG at `public/assets/repradar-mark-color.svg`, with PNG and dark-background variants for presentations.

Detailed view immediately reveals four additional panels: sentiment, languages, risk drivers, and sources with review progress. Chart selections open the matching signals or risk workspace, with a clear filter label and reset action. Simple / Detailed controls appear only where they change the page (Overview and Risk workspace). The header remains available while scrolling. Connection checks show a pending state and result.

Interaction regression scripts: `scripts/dashboard-smoke.mjs`, `scripts/interaction-smoke.mjs`, `scripts/enhanced-smoke.mjs`, and `scripts/browser-smoke.mjs` (install Playwright browsers with `npx playwright install chromium`). Outlook opens a draft; ERP exports CSV. Neither sends messages nor creates external tasks.
