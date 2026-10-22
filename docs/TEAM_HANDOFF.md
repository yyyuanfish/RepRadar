# RepRadar — teammate handoff / 队友使用说明

- **Welcome page:** https://repradar-phi.vercel.app
- **Direct dashboard (for the pitch):** https://repradar-phi.vercel.app/dashboard
- **Open guided story:** https://repradar-phi.vercel.app/dashboard?tour=1
- **Public source:** https://github.com/yyyuanfish/RepRadar
- **Pitch:** [PowerPoint](../outputs/pitch/RepRadar-Pitch-Public.pptx) · [PDF backup](../outputs/pitch/RepRadar-Pitch-Public.pdf)
- **Rehearsal:** [English script + 中文逐页重点](PITCH_SCRIPT.md)

## Start here / 先看这段

This is a hackathon concept for the Syngenta challenge, not an official corporate system. All incidents and knowledge documents are synthetic. Do not enter company documents, personal information or credentials into the public demo. No login is implemented. Each browser keeps its own decisions and lessons; teammates do not share a database.

线上版无需账号或 API key，主要流程均可演示。Ask RepRadar 在线展示角色相关的知识摘录，不是假装已接入 LLM。需要生成式回答时，使用下面的本地 Qwen 配置。没有实时新闻、社交媒体采集或真正的自动多 agent 分析。Outlook 只是草稿链接，ERP 只是 CSV 导出。

## Two-minute story / 演示顺序

1. Overview: explain Maya in Basel and Lin, a fictional farmer in China. Point to the trend, stakeholder groups and priority queue. Detailed view adds sentiment, language, risk factors and review coverage. Click chart groups to filter the inbox.
2. Run demo → Start with the signals: read Lin’s Chinese original and translation (SIG-012). A European proposal is not evidence of a restriction in China.
3. Risk workspace: inspect missing evidence and the three possible actions. Changing weights changes priority, not a probability of controversy.
4. Ask RepRadar: “How should we respond to the farmer in China about the residue proposal?” Open the cited guidance. Online: source excerpts. Local model: generated explanation. Regulatory Affairs retrieves a different knowledge collection.
5. Review an option: enter an owner, edit the action, explain the decision and acknowledge the limits. Approve, reject or defer. Approval records a plan; it does not send anything.
6. Decision log → Prepare team handoff: inspect the Outlook draft and ERP CSV. Do not send to a real colleague while rehearsing. The later learning loop requires an outcome note and explicit curator approval.

Use About this prototype → Reset demo history before a fresh rehearsal. Export anything you want to keep first. Browser storage is not a durable enterprise audit log. Use the residue scenario throughout the main story; water stewardship is an optional second example for Q&A.

## Local Qwen / 真正接入小模型

Install Node.js 22 and [Ollama](https://ollama.com/download), then:

```bash
git clone https://github.com/yyyuanfish/RepRadar.git
cd RepRadar
npm ci
ollama pull qwen3:1.7b
cp .env.example .env.local
npm run model:start
```

Leave that terminal open. If Ollama already runs as a desktop service, skip `npm run model:start`; a port-in-use error usually means it is already running. In another terminal:

```bash
npm run dev
```

Open http://localhost:3000. Team handoff → Assistant connection → Check connection should report readiness. The model download is approximately 1.4 GB; generation speed depends on the laptop. [Official Qwen3:1.7b model page](https://ollama.com/library/qwen3:1.7b).

`.env.local` uses `ENABLE_LIVE_LLM=true`, `LLM_PROVIDER=ollama`, `LLM_BASE_URL=http://127.0.0.1:11434`, `LLM_MODEL=qwen3:1.7b`. Never commit this file. No paid API key is needed for local inference. Do not expose the local Ollama port to the public internet.

The Vercel server cannot access the presenter's localhost. A hosted generated-answer version requires an approved HTTPS model endpoint with `LLM_PROVIDER=openai-compatible`, a `/v1` base URL, model name, server-side API key and `ENABLE_LIVE_LLM=true`. Set these in Vercel environment settings and redeploy. Before exposing such an endpoint through this unauthenticated app, add access controls, rate limits and a spend cap. Hosting an open model does not imply free inference. Kiro development credits are not configured as a RepRadar model endpoint.

## What to say accurately

| Feature | Implemented | Do not claim |
|---|---|---|
| Dashboard and languages | Synthetic records and interactive filters | Live global monitoring |
| Risk score | Editable normalized weighted score | A calibrated controversy probability |
| RAG | Role/scenario filtering and lexical retrieval; optional LLM | Vector search, model training or secure role authorization |
| Citations | Source IDs checked, sources visible | Automatic proof every generated claim is supported |
| Agents | Authored perspective cards | Multiple autonomous models running now |
| Learning | Curator-approved lessons reused in browser retrieval | Automatic fine-tuning or proven improvement |
| Decisions | Owner, rationale, acknowledgment, browser storage | Shared enterprise audit system |
| Outlook / ERP | Compose link / CSV | Mailbox synchronization, sending or ERP writeback |

## Development, tests and deployment

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
REPRADAR_TEST_URL=https://repradar-phi.vercel.app node scripts/browser-smoke.mjs
```

Browser scripts default to local port 3001; set `REPRADAR_TEST_URL` for another address. If using installed Chrome instead of bundled Chromium, set `PLAYWRIGHT_CHANNEL=chrome`. Model-specific scripts require local Qwen; they are not appropriate checks of the excerpt-only public deployment.

The current deployment belongs to the `cl-thesis` Hobby workspace. The GitHub repository is connected to the Vercel project. Pushes to `main` can trigger production deployments; check the Vercel deployment result before sharing a changed version. The owner can also deploy with `npx vercel --prod --scope cl-thesis`. Collaborators can fork and import their own copy into Vercel.

[Hobby](https://vercel.com/docs/plans/hobby) is free within its limits and intended for personal/non-commercial use. This deployment is a hackathon prototype, not the proposed corporate production pilot. The deck's CHF 3.4k/month estimate is an illustrative future pilot budget, not this website's bill.

The PPTX and PDF are ready to present. Slide 6 contains a browser hyperlink, not an embedded live webpage. Use Command-Tab / Alt-Tab to return. Install the included Poppins fonts or use the PDF to preserve layout. The deck-building script requires the original desktop artifact runtime; normal website development does not.

## License and reuse / 复用与授权

RepRadar’s original welcome page, demo code, sprout illustration, colored logo, synthetic data, documentation and original pitch content use [MIT](../LICENSE). The complete [scope](../LICENSING.md) identifies exceptions in the app, screenshots, PPTX and PDF. Syngenta marks, the Unsplash photograph, fonts and Lucide icons keep their own rights and notices. Keep the relevant notices when sharing or adapting the project; model weights and supplied original reference attachments are not part of the public release.
