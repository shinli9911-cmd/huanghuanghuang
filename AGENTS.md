# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Persisted design decisions

- The works section follows the 2026-07-24 supplied reference pair: a large gradient `SELECTED WORKS` title and numbered hierarchy in this order: 01 设计能力, 02 重点项目精选, 03 项目档案. The featured layer has three information-rich project cards and the archive has eight cards. Project titles, copy, and detail-route links remain unchanged unless explicitly revised.
- The featured-project display uses the supplied dedicated cover images in 01 → 02 → 03 order. The first card is titled 全场景监控设计实践 and uses the supplied 1920×1024 high-resolution B端合集 cover; the second is 数据智能可视化大屏 with matching data-visualization copy and tags; the third is 新能源场站数据监盘app with matching mobile-monitoring copy and tags. This is isolated to the three highlighted cards; archive and detail-page media stay unchanged.
- The first featured cover must be fully visible at its native 1920:1024 aspect ratio: its media frame uses `aspect-ratio: 1920 / 1024`, `object-fit: cover` at 100% height, and is excluded from hover scaling and scroll parallax. Do not crop it or add letterbox whitespace.
- All three featured covers now use high-resolution 1920×1024 source artwork and share a non-shrinking native-ratio media frame; preserve full-image, proportional rendering for 01–03.
- Keep featured-cover images vertically stationary while scrolling. Do not apply `yPercent` parallax, as it exposes an empty strip above 02–03 and breaks top alignment.
- Featured 01–03 each open a dedicated full-image project page at `/project/:caseId/full-image`. Their supplied long case-study assets render at responsive width in full, without cropping or a modal: 01 1920×29349, 02 1920×6480, 03 1920×10120.
- On the full-image project page, keep only the “返回首页” control in a fixed, low-opacity frosted header; do not show the brand or other navigation items.
- The eight lower project cards are a quieter secondary project archive. Preserve image insets/padding, and make BorderGlow a hover emphasis instead of a dominant default treatment.
- Keep the project-archive grid free of transform-based vertical entrance motion so full-screen rows never overlap; use a 28px desktop row gap. Archive projects six through eight are 安全生产考试平台, 水电监盘驾驶舱, and 水电安全智能管控平台. The sixth and eighth project cover images are intentionally swapped.
- In the three featured project cards, keep image areas free of numerical overlays. Place each restrained project index beside its category in the information area below the image.
- The former five-column preview matrix is replaced by the three-card featured-project presentation. Keep BorderGlow as the shared hover language and keep each card as a direct link to its dedicated case-study page.
- Keep `SELECTED WORKS` fully visible within the desktop content frame; use the smaller clamp scale (max 148px) and preserve a 92px desktop gap before the capability module.
- Project archive headers use a 112px effective desktop transition from the featured cards (88px before the divider plus a 24px heading inset) and a 24px gap before the card grid. The English display headings in the design-philosophy and contact screens share the works-section gradient, weight, and tracking, with a smaller 112px maximum to accommodate longer labels.
- `DESIGN PHILOSOPHY` lives inside the narrower left column of the philosophy layout and is intentionally capped at 76px (with dedicated tablet/mobile clamps) so the reveal-mask container does not crop its letters.
- The philosophy section includes the supplied three-part “方法论” sequence (设计前 / 设计中 / 设计后) and a linked “↓ 以下为近年代表项目” transition back to the works archive.
- Homepage visual order is Hero → Design Philosophy → Works → Contact. Preserve this order while keeping existing `#philosophy`, `#works`, and `#contact` navigation anchors functional.
- The site motion direction is an editorial, high-end portfolio opening: slow GSAP/ScrollTrigger sequences, strong masked title reveals, large English section-title entrances, and staggered media/card reveals. Avoid generic fade-ins, spring/bounce easing, or layout-affecting animation.
- Every work-cover interaction navigates to a dedicated full-screen project route. Project pages are complete, not modal overlays, and include a header navigation, project index/sidebar, functional workspace, case outcome section, and copyright footer in the same dark technology visual system.
- DotField is a low-opacity decorative first-screen background on the home and project-detail heroes. It stays below visual content and navigation, uses `pointer-events: none`, and must not block page interactions.
- The five hero capability tags use the same restrained BorderGlow hover language as the selected-work cards; retain their pill proportions, copy, and staggered entrance.
- On desktop, keep the hero capability tags 42px below the supporting description so the full-screen headline composition stays compact; retain the tighter mobile spacing.
- Keep the contact email visually subordinate to navigation and headline content. Hero tags need a relaxed horizontal rhythm, and the hero description should stay within a compact, comfortable reading measure. In the works section, emphasise the 01/02/03 structure, keep all five ability items visually consistent, and render the three featured-card tags as an even three-column row.
- The contact screen uses a top-half deep-to-transparent gradient overlay so its luminous background transitions smoothly from the preceding section; keep contact content and footer above this overlay.
- The contact screen includes a compact QR area beneath the email action. Present the provided 微信 personal QR as the largest primary “联系我” card; use the 站酷 and 花瓣 QR cards as matching secondary routes for more portfolio work, without displacing the email as the main contact route.
- In the QR area, label 站酷 as the route for project case-study breakdowns, and 花瓣 as the archive for visual work such as albums, logos, and motion pieces; keep these roles explicit in their card copy.
- The home navigation stays fixed as a frosted floating bar while scrolling. Its order is 设计理念 → 作品集 → 联系方式, and its current-state underline switches automatically according to the active scroll section.
- Keep the fixed navigation as a clearly frosted glass layer: the background has low opacity so imagery remains visible beneath it, with the border and blur retaining navigation legibility.
- The design-philosophy screen follows the 2026-07-24 reference: a full-width gradient `DESIGN PHILOSOPHY` masthead, Chinese statement and introduction aligned beneath it, three independent numbered principle cards, and a three-step icon-led horizontal methodology flow on desktop (stacked vertically on small screens). Keep the existing philosophy and project copy intact when refining this structure.
- The hero places the frosted `职业履历 / WORK EXPERIENCE` card directly below the capability tags, at roughly two-thirds of the desktop content width. Keep the three career stages and their supplied long-form content intact; it becomes full-width on tablet and mobile.
- The publication-design module is vertically aligned at every viewport width: its heading and description appear first, followed by full-width artwork in sequence. Keep the two artworks separated by a 6px-dash / 3px-gap divider at 50% opacity.
- Featured project 02 is the supplied “数据可视化监控大屏” case study. Keep its 1920×1024 top-cover crop on the homepage and render its 1920×11597 complete case-study image on the dedicated full-image page.
## 性能约定

- 项目长图页面使用 `*-case-study-opt.jpg` 作为线上资源；原始 PNG/JPG 仅保留为源文件备份。
- `SoftAurora` 在设计理念区接近视口时才下载；`DotField` 与 `SoftAurora` 在离开视口或浏览器标签隐藏时暂停，渲染密度上限为 `1.5x`，动画帧率约为 30fps。
