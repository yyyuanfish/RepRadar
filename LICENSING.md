# Licensing and reuse / 许可证与使用范围

RepRadar’s original contributions in this repository are released under the [MIT License](LICENSE), to the extent the contributors hold the relevant rights. Copyright © 2026 RepRadar contributors. Third-party works remain subject to their own terms, listed below and in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## What MIT covers

| Material | Files / location | Scope |
|---|---|---|
| Welcome page / 欢迎页 | `app/page.tsx`, `components/Welcome.tsx`, `components/Welcome.module.css` | Original page code, text, radar-garden/sprout illustration and animation; imported icons excluded |
| Dashboard and interactive demo / 看板与演示 | `app/dashboard/`, `components/`, `app/globals.css`, `lib/` | Original interface, charts, filters, scoring, retrieval, recommendation and human-review code |
| Assistant and model integration | `app/api/`, `lib/assistant.ts`, `lib/llm.ts` | RepRadar adapter and prompt code; not the external model or hosting service |
| Synthetic scenarios and knowledge | `lib/data.ts`, `scripts/story-content.json` | Project-authored fictional incidents, example guidance, translations and narrative text; not original supplied reference materials |
| Current RepRadar visual identity | `public/assets/repradar-mark-color*`, `app/icon.svg` | Original colored radar-and-leaf artwork; excludes the legacy Lucide-derived marks |
| Team documentation and speech | `README.md`, `docs/` | Original documentation, English script, Chinese speaking notes, demo instructions and technical explanations |
| Pitch deck and PDF | `outputs/pitch/RepRadar-Pitch-Public.pptx` and `.pdf` | Original slide text, layout, diagrams and original parts of embedded UI screenshots; third-party logos, imagery, icons and fonts retain their own terms |
| Build, test and startup files | `scripts/`, `tests/`, configuration files, `Start-RepRadar.command` | Original project code; proprietary desktop tooling referenced by the slide builder is not included or licensed here |

The MIT grant permits reuse, modification and distribution of covered material, including commercial reuse, subject to retaining its copyright and permission notice. It does not change a third-party asset’s terms or provide trademark rights. See the [standard MIT text](https://opensource.org/license/mit).

## Third-party exclusions apply everywhere

- **Syngenta / Syngenta Group:** `public/assets/syngenta.png` and `syngenta-group.png`, and their appearances in pages, screenshots, PPTX and PDF. These are supplied company marks, not RepRadar-owned artwork. No license to these marks or endorsement by Syngenta is granted by this repository. For another product or brand, replace them unless you have the necessary rights.
- **Field photograph:** `public/assets/fields.jpg`, `fields-cover-soft.png`, `fields-close-soft.png`, and their appearances in the deck or screenshots. Ivan Bandura’s photograph remains under the [Unsplash License](https://unsplash.com/license), not MIT. Cropping or lightening the background does not remove that source attribution or change its license.
- **Fonts:** Poppins, DM Sans and Manrope use the SIL Open Font License 1.1. Copies are in [LICENSES/](LICENSES/). Arial is a referenced system/presentation font; no Arial font binary is distributed or relicensed here.
- **Icons:** Lucide icons and the legacy `repradar-mark-green.*` / `repradar-mark-white.*` assets retain the Lucide ISC notice, including its Feather attribution. Copies are in [LICENSES/](LICENSES/).
- **Dependencies and optional models:** npm packages, Ollama, Qwen and any external service retain their respective licenses and terms. Model weights are not part of this repository. RepRadar’s MIT license does not license a separately downloaded model.
- **Provided references:** the original workbook, whiteboard/challenge photographs and teammate reference deck are not included in the public release and are not licensed by this repository. The local workbook conversion is excluded from Git.

A combined screenshot, presentation or PDF may contain both MIT-covered and third-party material. Carry this file, the relevant notices and asset credits with redistributed copies; do not describe the entire mixed-media file as having unrestricted MIT-only assets.

## 中文说明

欢迎页、Demo、自制雷达小芽与彩色 RepRadar 标志、模拟场景、代码、演讲稿和文档的原创部分采用 MIT。PPT/PDF 的原创文字与排版也在范围内，但里面的 Syngenta 标志、照片、字体和第三方图标仍按各自条款使用。

复用时保留 MIT 版权与许可声明，以及相关第三方声明。仓库公开不代表 Syngenta 授权其他产品使用其商标；项目也不是 Syngenta 官方产品。团队原始参考附件、真实公司数据、账号密钥和本地模型文件均不属于本次公开授权内容。
