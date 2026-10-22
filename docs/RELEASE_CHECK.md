# Release check — 23 October 2026

- Production: https://repradar-phi.vercel.app
- Repository: https://github.com/yyyuanfish/RepRadar (PUBLIC)
- Deployment: Vercel `cl-thesis/repradar`, Hobby plan; ready production deployment.
- TypeScript check, 13 core tests and production build passed.
- Local browser regression passed: dashboard, desktop/mobile layout, filters, source review, weights, recommendation ranking, human approval gate, decision persistence, curator-approved learning, export and reset.
- Public browser regression passed: complete workflow above, simple/detailed toggle, trend range, all stakeholder groups, language filters, Outlook encoded compose link, ERP CSV and assistant boundaries. No browser exceptions in the full-flow test.
- Public `/api/status` returned HTTP 200 and `live:false`, `configured:false`: the no-key public deployment uses knowledge excerpts. Local Qwen remains a separate optional setup.
- Final deck: 17 slides, 12 main slides allocated 600 seconds. Cover has one large RepRadar wordmark and no small upper-left branding. Slide 6 links to the public website.
- PPTX structural/layout/import checks passed. Changed slide renders and PDF cover were inspected. This does not claim testing in the native PowerPoint application.
- PDF: 17 pages, two clickable demo areas on page 6.
- Public source scan found no credential patterns or personal absolute paths. `.env.local`, runtime/model files, original workbook conversion and build caches are ignored. This is a targeted pre-publication check, not a formal security audit.

Live news feeds, autonomous agent execution, authenticated role permissions, shared audit storage, mailbox sync and ERP writeback are not implemented. All demonstration records are synthetic. See TEAM_HANDOFF.md for the exact presentation boundaries.
