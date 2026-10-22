# RepRadar product and pilot specification

## Problem and target user

Maya Keller is a fictional Corporate Affairs communications lead in Basel. At 08:12 she sees a public-forum question from Lin, a fictional farmer in China, asking whether a shared European residue-policy headline affects his plans for next season. Her task is to verify the source and local applicability, coordinate China regulatory and agronomy expertise, and approve an accountable response plan. A European proposal alone does not establish a restriction in China. The original water-stewardship scenario remains a secondary example.

The team whiteboard describes approximately 25 potential users as an initial design assumption. It is not a confirmed company headcount. The proposed pilot starts with ten colleagues in two regions.

Problem hypotheses to validate with employees:

- Fragmented sources force repeated manual reconstruction of the same issue.
- Translation without local interpretation can change the apparent request.
- Alert volume obscures which concern needs coordinated action.
- Guidance and previous decisions are hard to reuse across roles.
- An unexplained AI recommendation can increase review burden or automation bias.

## Interaction requirements and implemented evidence

| Employee need | Implementation |
| --- | --- |
| Understand why an issue matters | Evidence gap, source drill-down, scenario ratings and transparent formula |
| Hear local meaning | EN/DE/IT/ES/ZH originals, English translations, review annotations |
| Control priorities | Editable weights and visible changes to scores |
| Weigh competing actions | Three options, tradeoffs and preference-based ranking |
| Use relevant knowledge | Communications, Regulatory Affairs, Sustainability, Leadership collections |
| Challenge the system | Inspect citations, edit action, reject or defer |
| Keep accountability | Owner, rationale, timestamp and acknowledged limitations |
| Improve future work | Outcome lesson, separate approval step, scoped retrieval |
| Fit existing work | Exportable briefing and decision log; no auto-publication |

## Pilot plan

Weeks 1–2: workflow interviews, current-task timing, two topic definitions, approved sources, role matrix, local reviewers, and tabletop threat review. Co-design prompts and briefing templates with employees.

Weeks 3–4: shadow mode with daily sampled checks. Proposed specialist agents: media framing, regulatory context and regional language interpretation. Outputs remain hypotheses for human review. Deduplicate copied coverage and record missing source communities.

Weeks 5–6: compare to the baseline, inspect failures, interview employees about trust and perceived control, and make a documented go/no-go decision.

Proposed gates, not results:

- 100% of recorded decisions have an owner and rationale.
- Zero automated external publication or unauthorized document exposure.
- At least 95% of sampled citations genuinely support the associated claim.
- Median briefing time at least 30% lower on matched tasks, without worse missed-concern performance than the baseline.
- Review false alerts, missed concerns and corrections separately by language and region. Do not expand if an underserved group experiences materially worse coverage; agree the operational threshold with local reviewers before testing.

## Architecture for production

Permitted sources → provenance and personal-data minimization → deduplication → language and topic processing → proposed specialist agents → uncertainty-aware risk triage → identity/permission filtering → hybrid retrieval → cited LLM draft → human decision → audited outcome → curator-approved knowledge.

Possible knowledge: reviewed corporate policies, verified agricultural reference material, regulatory primary sources, company and competitor case histories, and expert interviews. Keep date, jurisdiction, authority, owner and access class for every chunk. Company statements are perspectives, not independent proof of a disputed claim.

A local open-source model is a deployment option for sensitive context. Model choice requires organizational approval, workload tests and license review. Hosting this demo on Vercel does not create an on-prem system.

## Cost assumptions

Ten users × ten requests × 22 working days = 2,200 requests/month.

At hypothetical rates of CHF 3 per million input tokens and CHF 12 per million output tokens, with 8,000 input and 1,000 output tokens per request:

- Input: 17.6 million × CHF 3 = CHF 52.80.
- Output: 2.2 million × CHF 12 = CHF 26.40.
- Model total: CHF 79.20.
- Hosting allowance: CHF 300.
- Data access allowance: CHF 1,000.
- Human review: 20 hours × CHF 100 = CHF 2,000.
- Monthly operating total: CHF 3,379.20.

These are changeable budgeting assumptions, not current prices or quotes. Integration, legal review, taxes and local-model hardware are excluded. A local model has a different cost structure.

## Scope of feedback

In the demo one user can act as both reviewer and curator, visibly as two steps. Production should assign separate permissions and ownership. A decision outcome must be observed, not inferred from the user clicking approve. An approved lesson updates retrieval only. Model or scoring changes require a separate versioned evaluation and rollback path.
