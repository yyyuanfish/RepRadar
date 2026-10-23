# RepRadar — final rehearsal script / 最终演讲稿

Website: https://repradar-phi.vercel.app · Direct pitch dashboard: https://repradar-phi.vercel.app/dashboard

Slide 5 opens the dashboard directly. Keep it open before the pitch; the welcome page remains available at the main website URL.

Deck: `RepRadar-Pitch-Four-Part.pptx` / PDF. Slides 1–12: ten minutes including a two-minute demo; 13–18 are Q&A only. English paragraphs are spoken text; 中文说明与 technical notes 不上台逐字读。

## Seven-person ownership

1 Problem / Maya · 2 UX journey · 3 Lin / scenario · 4 technology / demo operator · 5 decision support / learning · 6 human-centered design · 7 opening / feasibility / closing. One person should operate the browser throughout. Avoid unnecessary handoffs between slides.

## Four-part story / 四段逻辑

| Part | Slides | Main question |
|---|---|---|
| Problem | 2–3 | Why does Maya need help answering Lin? |
| Solution | 4–5 | What does RepRadar do? Workflow + live demo. |
| Architecture | 6–8 | How do retrieval, risk scoring and Qwen work, and how would we pilot them? |
| Human aspect | 9–12 | Who reviews, decides, learns and remains accountable? |

Slide 1 opens the story. Slide 12 returns to Lin and closes with the pilot ask. Slides 13–18 are backup material. Planned main-pitch time: 10 minutes including the 2-minute demo; rehearse to fit your pace.

## Main pitch and appendix

### Slide 01 — A farmer’s question

**Timing:** 15 seconds · **Presenter:** 7

**本页重点：** 用 08:12 Basel 和远在中国的农民提问开场。两个人物均为虚构；让观众先关心“谁需要帮助”，再介绍工具。不要朗读页面上所有字。

**English script:**

It is 08:12 in Basel. Maya, a Corporate Affairs colleague, sees a question from a farmer thousands of kilometres away in China. A shared headline has left him unsure about next season. This fictional story is where RepRadar begins.

**Technical explanation / 技术解释：** 无需讲模型。只说这是 synthetic-data demonstration。

### Slide 02 — Lin’s question, Maya’s responsibility

**Timing:** 40 seconds · **Presenter:** 3

**本页重点：** 两位队员分别演 Lin 和 Maya，各约 12 秒；语气自然，不模仿口音。明确“欧盟提案 → 英文转述为禁令 → 中国农民困惑”，提案不等于已生效禁令，更不自动适用于中国。

**English script:**

[Presenter 3 plays Lin, calmly, for about 12 seconds.] ‘I saw a headline saying some products are already banned. I grow crops in China. Do I need to change my plans for next season? Could a local adviser help me check?’ [Presenter 1 plays Maya for about 12 seconds.] ‘Our local team needs an answer. But which source is correct? Does this European proposal apply to his situation? What can I responsibly say?’ [Narrator.] This is a fictional public-forum signal. A translation alone cannot answer it. Maya needs evidence, local expertise and a decision she can explain.

**Technical explanation / 技术解释：** 跨文化理解不仅是翻译，还包括市场、产品、作物和管辖范围的解释。

### Slide 03 — Why Maya cannot answer from a headline

**Timing:** 40 seconds · **Presenter:** 1

**本页重点：** 解释 Syngenta 的农业业务和 Corporate Affairs 的沟通协调职责。问题是信息碎片化、跨语言误解、重复核实以及回复责任不清；不要声称验证过全球 CA 人数。

**English script:**

Syngenta works in crop protection and seeds. Corporate Affairs helps the organization understand stakeholder concerns and coordinate its response. Maya has three fragments: a European proposal, an English repost calling it a ban, and Lin’s Chinese planning question. Each source answers a different question. An alert tells her that something is happening, but it does not establish what applies locally or who should act. The risk is an unsupported generic answer, or a long silence while colleagues reconstruct the same context.

**Technical explanation / 技术解释：** 风险预警发现值得核查的问题，不证明因果或法律适用性。

### Slide 04 — Following the same question through RepRadar

**Timing:** 35 seconds · **Presenter:** 2

**本页重点：** 用 Listen → Interpret → Decide → Review 讲清旅程，每一步都保持同一个问题。首页先给重点，需要时才展开细节，减少认知负担。

**English script:**

RepRadar follows the same question through four steps. Listen: read Lin’s original wording and the translation. Interpret: compare the headline with the proposal and identify what remains unknown. Decide: retrieve role-specific guidance and compare three actions using Maya’s priorities. Review: assign a local owner, edit the action and record the reason. The dashboard gives her an overview first, with more detail when she needs it. Let us follow that journey now.

**Technical explanation / 技术解释：** Progressive disclosure：先概览，再按需展开；不是隐藏重要不确定性。

### Slide 05 — Live demo: help Maya answer Lin

**Timing:** 120 seconds · **Presenter:** 4

**本页重点：** 必须边操作边解释。在线助手展示来源摘录，不声称正在运行 Qwen。最后停在有负责人、有理由的 response plan，而不是宣称已经联系农民或解决问题。

**English script:**

Click Open live demo to open the public dashboard in the default browser. 0:00–0:15: show the dashboard’s KPI cards, trend, stakeholder groups and two priority topics. 0:15–0:30: Run demo, Start with the signals, inspect Lin’s Chinese question. 0:30–0:45: open Risk workspace; explain the unverified local applicability and three response options. 0:45–1:10: Ask RepRadar how to respond to Lin; inspect KB-02 and the fixed evidence boundary. Say: This public version retrieves source excerpts; local Qwen3 can generate an explanation from the same evidence. 1:10–1:40: review an option, edit the action, assign Maya and the China colleague, add the rationale and record the decision. 1:40–2:00: open Prepare team handoff; show the editable Outlook draft and ERP export. No email is sent. Switch back to PowerPoint with Command-Tab on Mac or Alt-Tab on Windows. The role-switch, feedback loop and remaining controls are available for Q&A, mapped in slides 16–17. If the server is unavailable, use slide 14.

**Technical explanation / 技术解释：** 来源摘录 = 检索；生成式回答 = 检索结果 + LLM。网页公开版保留前者，不依赖付费 endpoint。

### Slide 06 — The context behind Maya’s recommendation

**Timing:** 50 seconds · **Presenter:** 4

**本页重点：** 解释检索与生成分离：按角色/场景过滤文档，再检索相关段落，最后可选让 Qwen组织答案。现在是词语匹配检索；不是向量检索，也没有重新训练模型。agent 观点是预写示例。

**English script:**

Our prototype separates evidence from generation. First, it filters knowledge by role and scenario, then retrieves relevant passages using a lightweight lexical search. The public website shows those source excerpts. On the laptop, Qwen3 through Ollama can turn the same evidence into an explanation with citations. This adds context without retraining the model. Risk scoring and action ranking use transparent weights that the employee can change. The media, language and regulatory perspectives are authored examples today. A pilot would add licensed feeds, evaluated agents and document permissions. The key boundary is human review: an explanation becomes a recorded recommendation, never an automatically published response. Next, we will unpack retrieval and ranking before showing how human control shapes the workflow.

**Technical explanation / 技术解释：** Risk = Σ(rating/5 × weight)/Σweight ×100。默认权重35/25/20/20；高≥75，中≥50。它是可解释启发式分值，不是概率。推荐排序另用 evidence/trust/speed 偏好。

### Slide 07 — Retrieval, risk and generation

**Timing:** 55 seconds · **Presenter:** 4

**本页重点：** 用三步解释技术：先找角色和场景相关的证据，再算透明的优先级，最后可选让 Qwen 组织答案。RAG 是加上下文，不是训练模型；风险分不是争议发生概率。

**English script:**

Three technical choices make the workflow inspectable. First, retrieval filters knowledge by role and scenario, then ranks passages using word matching. This provides context without changing the model weights. Second, the risk score combines impact, urgency, momentum and stakeholder relevance using editable weights. It is a priority score, not a probability of controversy. Action preferences separately rank evidence quality, trust and speed. Third, the public demo returns source excerpts; optional local Qwen3 generates an explanation from those passages. Citation identifiers are checked, but an employee still needs to verify whether the source supports the claim. The pilot would add permission-aware retrieval and evaluated agents.

**Technical explanation / 技术解释：** 词语匹配检索 → 相关段落作为上下文 → 可选 LLM 生成。风险分是四项 1–5 评分的加权均值再映射到 0–100；行动排序另用 evidence / trust / speed 偏好。检查引用 ID 只能确认引用存在，不能证明每个结论都被支持。

### Slide 08 — Testing the story in real work

**Timing:** 50 seconds · **Presenter:** 7

**本页重点：** 六周、两地区、十名同事是试点提案。先建立基线，再 shadow mode，最后比较效率、漏报、来源支持与用户控制感。95% 和 30% 都是目标，不是已测结果。

**English script:**

We would test this journey with ten Corporate Affairs colleagues in two regions over six weeks. First, interview employees and establish how they handle comparable questions today. Then run in shadow mode with local reviewers. Finally, compare briefing time, citation support, missed concerns and perceived control. Proposed gates include every decision having an owner and rationale, no unauthorized publication, at least 95 percent citation support and 30 percent lower median briefing time without worse missed-concern performance. These are proposed targets. The illustrative monthly operating budget is about CHF 3.4k plus setup, with data and human review dominating this example.

**Technical explanation / 技术解释：** Shadow mode：在正常业务旁运行，比较输出但不让系统自动驱动外部动作。人工评估 citation support 才能发现“引用存在但不支持结论”。

### Slide 09 — What Maya and Lin each need

**Timing:** 35 seconds · **Presenter:** 6

**本页重点：** 从人的需求解释功能：Lin 要当地适用的回答，Maya 要可靠证据和决策控制。突出可查看、可质疑、可修改、可拒绝；低传播量不等于低重要性。

**English script:**

Lin needs guidance relevant to his situation. Maya needs evidence she can inspect, a route to the right local colleague, and control over the reply. That is our human-centered design brief. The system makes uncertainty visible and helps her choose a next step. It must not infer Chinese product restrictions from a European headline. Local experts verify the technical advice, and Maya keeps control of the response.

**Technical explanation / 技术解释：** Human-in-the-loop 要有真实操作控制和责任记录，而不只是页面写一句“人工审核”。

### Slide 10 — The decision stays with people

**Timing:** 50 seconds · **Presenter:** 6

**本页重点：** 讲真实的人类控制：保留原文、查看不确定性、调整权重、拒绝或延后、指定负责人。生产隐私方案是下一步；公开 demo 没有企业认证，不能输入真实内部资料。

**English script:**

Here is the human-centered test: can Maya disagree with the system, and does Lin’s actual need survive the process? She can inspect the original, change priorities and reject the suggested action. The local colleague checks language and technical context. One worried farmer must not disappear because the post has low reach. We also avoid turning a public question into an individual profile. Production requires permitted sources, personal-data minimization, identity, document permissions and an approved model environment. Maya coordinates the response; qualified colleagues own technical advice.

**Technical explanation / 技术解释：** 角色选择控制相关性，不提供授权。生产需要 SSO、文档级权限、保留策略以及批准的模型环境。

### Slide 11 — What happens after Maya decides

**Timing:** 45 seconds · **Presenter:** 5

**本页重点：** “学习”是记录结果、由 curator 审核、再用于之后的检索。批准建议不等于结果成功。浏览器本地保存，既不是自动微调，也不是跨用户共享学习。

**English script:**

We return to the same case after the decision. In the proposed operating workflow, the China colleague contacts Lin through an approved channel and checks whether the explanation answered his question. The reviewer records the observed outcome, including anything that did not work. A curator then decides whether a lesson is suitable for future retrieval. In the demo, these reflection and approval steps work locally, but no real contact or outcome has occurred. The reusable lesson might be to check jurisdiction and product context before offering a regional answer. Clicking approve never counts as proof of success.

**Technical explanation / 技术解释：** Curator approval 是知识更新门槛；没有模型参数更新。来源 ID 校验也不代表每句话有充分证据，仍需人查看原文。

### Slide 12 — Back to Lin and Maya

**Timing:** 65 seconds · **Presenter:** 7

**本页重点：** 回到开头 Lin 的疑问。Maya 得到的是核实计划、当地负责人、下一次更新时间。用同一个故事收尾，并提出一位 sponsor、十名同事、六周试点的请求。

**English script:**

Let us return to Lin. His question was simple: ‘What does this mean for my next season?’ By the end of our demo, Maya has replaced a vague alert with a recorded plan: verify the source and local applicability, assign a China response owner, and set the next update. The actual reply still needs local approval, and the outcome will be checked afterward. That is the value we want to test: a clear, accountable path to an answer. Our ask is one sponsor, ten colleagues and six weeks. RepRadar: listen closely, decide confidently.

**Technical explanation / 技术解释：** 明确 output 与 outcome：记录的方案是产出；农民是否得到有效回答要在后续验证。

### Slide 13 — Cost assumptions

**Timing:** Q&A only; about 30–45 seconds when asked · **Presenter:** 7

**本页重点：** 仅在被问成本时展开。CHF 3379.20 是假设月运营预算；最大项是人员审核与数据，不是 LLM。公开 Hobby 演示费用和企业试点预算是两个范围。

**English script:**

This is an illustrative operating budget, not a supplier quote. We assume ten users and 2,200 model requests per month. At the hypothetical token rates shown, inference is CHF 79.20. Adding hosting, licensed data and twenty hours of human review brings the monthly total to CHF 3,379.20, excluding setup and other integration costs. The public hackathon website uses the free Hobby plan and no paid model endpoint; that is a different scope from an enterprise pilot.

**Technical explanation / 技术解释：** 2200次/月 ×8000输入tokens =17.6M；×假设CHF3/M=52.8。输出2.2M×CHF12/M=26.4。推理79.2+hosting300+data1000+review2000=3379.2。不含集成、法务或本地硬件。

### Slide 14 — Story demo fallback

**Timing:** Q&A only; about 30–45 seconds when asked · **Presenter:** 4

**本页重点：** 网络不稳时直接用这一页，不临时换到水质故事。左边解释证据缺口，右边解释负责人和记录；它是演示截图，不是已发生的真实结果。

**English script:**

If the live site is unavailable, these screenshots show the same residue scenario and recorded response plan for Lin’s question. Explain the missing applicability evidence, the China owner and the rationale. No external reply has been sent. Keep the story continuous instead of switching to the unrelated water scenario.

**Technical explanation / 技术解释：** PDF是静态备份；PPT和PDF第5页的链接会打开浏览器，不是嵌入网页。

### Slide 15 — Q&A

**Timing:** Q&A only; about 30–45 seconds when asked · **Presenter:** 7

**本页重点：** 回答预测准确率、通用 chatbot、企业数据安全三类问题。主动区分原型实现与未来计划；不能承诺还没做过的准确率、偏差消除或完整覆盖。

**English script:**

Today, RepRadar prioritizes early signals; it does not produce validated controversy probabilities. Its advantage over a generic chatbot is the structured workflow: role-specific evidence, visible uncertainty, employee preferences and an accountable decision. The public prototype contains synthetic data. Real internal data would require identity, document permissions and approved hosting before a pilot.

**Technical explanation / 技术解释：** “Does it predict?” → early prioritization today; validated forecasting requires labelled history and testing. “Does it learn?” → reviewed retrieval updates, not automatic training.

### Slide 16 — Feature coverage: listen and interpret

**Timing:** Q&A only; about 30–45 seconds when asked · **Presenter:** 4

**本页重点：** 功能覆盖补充页：图表、筛选、来源、风险、知识库、助手分别解决什么认知或业务问题。介绍一个功能就说它对应哪个评审标准，不要把表格逐字读一遍。

**English script:**

This page maps the analysis features to the judging criteria. The dashboard reduces the initial information burden, while detailed charts help employees inspect coverage. Signals preserve original language and review notes. Risk controls expose assumptions, and the knowledge library shows document ownership and versions. The public assistant retrieves excerpts; the optional local Qwen model generates explanations from retrieved evidence. Live feeds and autonomous agent analysis remain pilot extensions.

**Technical explanation / 技术解释：** NLP标签、翻译与agent观点是合成示例；实时抓取、模型分类和agent编排属于pilot扩展。

### Slide 17 — Feature coverage: decide, coordinate and learn

**Timing:** Q&A only; about 30–45 seconds when asked · **Presenter:** 6

**本页重点：** 解释从建议到协作再到学习的闭环。Outlook 草稿要人发送；ERP CSV 要另行导入；审批记录在浏览器。把人的责任边界讲清楚。

**English script:**

These features make responsibility visible. Employees compare options, edit or reject them, and record an owner and a reason. They can prepare an Outlook draft or export a task, but external action still requires human review. Decisions and approved lessons remain local to the browser. The learning loop reuses reviewed knowledge; it does not retrain the model. Together, these steps connect the stakeholder concern to a response plan and a later check of the outcome.

**Technical explanation / 技术解释：** localStorage仅在当前浏览器和域名下保留。localhost与线上网址不会共享记录；导出用于备份，不构成企业级审计。

### Slide 18 — The story demonstrates the five criteria

**Timing:** Q&A only; about 30–45 seconds when asked · **Presenter:** 7

**本页重点：** 严格对齐五项实际标准：问题解决匹配、可行性、原创性、以人为本与责任、Pitch/Q&A。讲功能证据，不给自己打分。

**English script:**

Here is how the concrete demo meets the five categories. Fit: the dashboard and role-specific evidence help Maya coordinate a real Corporate Affairs task. Feasibility: local Qwen3, an Outlook compose link and a CSV export work today, within a bounded pilot proposal. Originality: local language context, domain knowledge, employee preferences and reviewed lessons form one decision workflow. Human-centered responsibility: simple and detailed views, quieter voices, visible unknowns and the ability to edit or reject preserve employee control. Pitch quality: Lin’s concern travels from the opening scene through the live demonstration to an accountable next step. The appendix maps the remaining demo controls to the criteria without extending the ten-minute main pitch.

**Technical explanation / 技术解释：** 原创性在于流程组合和员工体验，不宣称发明 NLP、RAG 或权重排序。

## Live demo: spoken lines and clicks (120 seconds)

| Time | Click | Say |
|---|---|---|
| 0–15s | Overview | “Maya sees the two topics needing attention, their trend and the stakeholder groups involved.” |
| 15–30s | Run demo → Start with the signals → Lin's Chinese source | “This is Lin’s original question. He wants planning guidance, not a generic statement about Europe.” |
| 30–45s | Risk workspace | “The missing piece is local applicability. This score helps prioritize review; it is not a forecast probability.” |
| 45–70s | Ask RepRadar; ask the question below; open source | “The public demo retrieves guidance for Maya’s role. A local Qwen model can generate an explanation from the same evidence.” |
| 70–100s | Review option; owner, action, reason, acknowledgment | “Maya can change this recommendation. She assigns a local reviewer and records why verification is needed.” |
| 100–120s | Decision log → Prepare team handoff | “The plan is now ready for colleagues. Outlook opens a draft; nothing is automatically sent. We have a next step and an owner.” |

Question to paste: **How should we respond to the farmer in China about the residue proposal?**

Action to paste: **Verify the original proposal and local crop, product and market applicability with the China regulatory and agronomy colleagues; prepare an evidence-based reply and schedule an update.**

Owner: **Maya Keller + China Regulatory / local agronomy adviser**

Rationale: **The European headline does not establish a restriction in China. Local verification is needed before technical guidance is shared.**

Set the update time to your rehearsal day at 14:00 Zurich time; if already past, choose a realistic future time. Rehearse the form once before presenting. Do not spend the live segment typing paragraphs. If time is tight, skip changing preference sliders; explain that control on slide 7. Never call an approval a successful real-world outcome.

## Technical Q&A in plain English

**What is RAG?** “We retrieve relevant documents first, then give that context to a language model. In the public demonstration we show the retrieved excerpts directly. In the local version, Qwen can explain them. Neither step requires retraining the model.”

**Why does the online chat not behave like ChatGPT?** “We intentionally deployed the no-key version. It searches our synthetic knowledge collection. A separately configured model endpoint enables generation.”

**Why Qwen?** “We implemented an optional small open-weight Qwen3 model through Ollama so the local demonstration can generate answers without a paid API. We have not established that it is the best model for this domain; the pilot must evaluate quality, languages, latency and licensing.”

**What do multiple agents do today?** “The perspective cards are authored examples. The pilot architecture proposes separate media, regulatory and local-language analyses with shared evidence and human review. We do not claim those agents run autonomously in this prototype.”

**What does the risk score mean?** “It is a weighted priority index. Employees can inspect the four factors and change their relative importance. It is not the chance that a controversy will occur.”

**How is the recommendation personalized?** “The employee adjusts preferences for evidence quality, trust and speed. These re-rank three authored actions. It is explicit preference weighting, not reinforcement learning or a hidden user profile.”

**How do you stop hallucinations?** “We scope retrieved evidence, instruct the model to stay within it, check citation identifiers, and display uncertainty. Those checks do not guarantee factual support; the employee still reviews the source before acting.”

**How does it learn?** “A person records the outcome, then a curator approves a reusable lesson. The demo adds approved lessons to browser-local retrieval. It does not automatically train or fine-tune Qwen.”

**Is it private?** “The public version only contains synthetic data and has no enterprise authentication. A real pilot would require identity, source permissions, approved hosting, retention controls and reviewed access to any model. Local inference is an option, not a guarantee that the whole workflow is private.”

**Does it integrate with Microsoft 365 or ERP?** “It prepares a Microsoft 365 compose link and an ERP CSV. Mailbox reading and ERP writeback require approved connectors and are not implemented.”

**What evidence shows impact?** “We have a working interaction prototype, not measured business impact. The pilot will compare briefing time, source support, missed concerns and employee control against a baseline.”

## Rehearsal checklist

- Open the public link in a fresh browser tab and reset old demo history.
- Keep the PDF and slide 14 ready. Test slide 5’s hyperlink in slideshow mode on the presenting computer.
- Pick one operator. Use Command-Tab on Mac / Alt-Tab on Windows to return to slides.
- If showing local Qwen instead, open localhost separately, check model readiness and say explicitly that this is the local generation version.
- Keep the same fictional case from opening to close. Do not imply a real Syngenta incident or verified product restriction.
- Aim for 120–140 spoken words per minute and preserve the two-minute demo. The appendix is not part of the ten-minute main talk.
