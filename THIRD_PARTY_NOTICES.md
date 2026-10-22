# Third-party notices

These notices apply to the repository and to third-party material embedded in the live welcome page, demo, screenshots, pitch deck and PDF. The root [MIT License](LICENSE) covers RepRadar’s original contributions only; see [LICENSING.md](LICENSING.md) for the complete scope.

## Brand marks

**Syngenta / Syngenta Group** — `public/assets/syngenta.png`, `public/assets/syngenta-group.png`. Supplied by the project owner for identifying the hackathon challenge. Rights remain with the respective owner. The project does not claim an affiliation, endorsement or a general right for downstream users to reuse these marks. Original proportions are retained; transparent outer padding on the Group asset was cropped.

## Photography

**Ivan Bandura, “Rice fields”, Unsplash.** Source: [original photograph](https://unsplash.com/photos/aerial-photography-of-green-farm-field-hdD1ZP1PzqI). License: [Unsplash License](https://unsplash.com/license). Files: `public/assets/fields.jpg`, `fields-cover-soft.png`, `fields-close-soft.png`. The two softened versions are project adaptations for readable slide backgrounds. The scene is illustrative and is not identified as a Syngenta site.

The Unsplash license allows broad image use but has its own conditions, including restrictions on selling unmodified images and building a competing image service. It is not replaced by MIT. Consult the linked license for the full terms.

## Fonts

| Font | Use | Upstream / retained notice |
|---|---|---|
| Poppins | Bundled Regular/Bold TTFs; presentation headings | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/poppins), [OFL copy](LICENSES/Poppins-OFL.txt); also retained in `assets/fonts/OFL.txt` |
| DM Sans | Website text, requested from Google Fonts | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/dmsans), [OFL copy](LICENSES/DM-Sans-OFL.txt) |
| Manrope | Website headings, requested from Google Fonts | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/manrope), [OFL copy](LICENSES/Manrope-OFL.txt) |
| Arial | System/presentation fallback and body text | Font name referenced only; no font binary distributed |

The website’s Google Fonts request is separate from the repository license. If self-hosting font files later, retain the corresponding OFL and copyright notices.

## Icons and direct runtime dependencies

| Package / artwork | Installed version | License / retained text |
|---|---|---|
| `lucide-react` and UI icons | 0.468.0 | [ISC](LICENSES/Lucide-ISC.txt), including Feather attribution |
| Legacy green / white radar marks | Derived from Lucide Radar | [Lucide ISC](LICENSES/Lucide-ISC.txt); original Feather portions retain [MIT](LICENSES/Feather-MIT.txt) |
| `next` | 16.4.2 | [MIT](LICENSES/Nextjs-MIT.txt), Vercel, Inc. |
| `react` | 19.3.1 | [MIT](LICENSES/React-MIT.txt), Meta Platforms, Inc. and affiliates |
| `react-dom` | 19.3.1 | [MIT](LICENSES/ReactDOM-MIT.txt), Meta Platforms, Inc. and affiliates |

Lucide attribution: copyright for portions is held by Cole Bemis, 2013–2022, as part of Feather (MIT); other Lucide copyright is held by Lucide Contributors, 2022. The legacy files are `public/assets/repradar-mark-green.svg`, `.png`, `repradar-mark-white.svg`, `.png`. They are distinct from the current project-authored colored radar-and-leaf mark.

Dependency versions and declared licenses, including development and optional platform packages, are inventoried in [docs/DEPENDENCY_LICENSES.md](docs/DEPENDENCY_LICENSES.md) from `package-lock.json`. Packages and their transitive dependencies retain their upstream terms. If distributing installed packages or a bundled runtime, preserve the upstream notices required for those artifacts; the inventory is not a replacement for their license texts.

## Optional local inference and authoring tools

- **Qwen3:1.7b:** the [Ollama model listing](https://ollama.com/library/qwen3:1.7b) identifies the model license as Apache 2.0. Weights are downloaded separately and excluded from Git. Check the license for the exact model/tag you distribute.
- **Ollama:** separately installed inference software, subject to its [upstream license](https://github.com/ollama/ollama/blob/main/LICENSE). The portable runtime under `.runtime/` is excluded from Git.
- **Desktop presentation tooling:** `scripts/build-deck.mjs` references a separately supplied `@oai/artifact-tool` environment. That software is not distributed with this repository or covered by RepRadar’s MIT license. The already exported PPTX/PDF can be used without it, under the mixed-content scope in LICENSING.md.
- **Vercel, GitHub, Google Fonts, Outlook and model hosting services:** separate services; their account, hosting and service terms are not changed by the project license.

Notices reviewed on 23 October 2026. Update this file and the dependency inventory when assets, models or dependencies change.
