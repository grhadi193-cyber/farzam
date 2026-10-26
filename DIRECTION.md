# DIRECTION.md — Farzam (فرزام) Creative & Technical Direction

## 1. BRAND READING: Geometry, Wordmark & Peyda Character

### 1.1 Logo Geometry (`brand/logo.svg`)
An exact reading of `brand/logo.svg` (`viewBox="0 0 234.21 324.76"`) reveals a bold, architectural monogram built from a single continuous path (`#102333`):
- **Structural Spine & Twin Vertical Pillars**: On the left (`x = 0` to `23.15` and `x = 23.15` to `117.2`), two vertical columns rise and descend with `175.46` units of straight vertical travel, terminated by semi-circular capsule caps (`r = 11.57`, stroke thickness `23.14` units).
- **The 117-Unit Crown Curve**: At the top-left (`0,123.6` to `117.17,0`), the outer silhouette sweeps through a broad, disciplined quarter-ellipse shoulder (`C 0,61.8 58.58,0 117.17,0`) into a horizontal top bar (`h 105.47`) with a `11.57`-unit rounded terminal.
- **The Inner Negative-Space Chamber**: Inside the mark, a vertical channel (`71.44` units tall) is framed by consistent `14.44`–`14.53` unit inner corner radii (`rx ≈ 14.5`), creating a protective U-shaped / chambered negative space before projecting right (`h 92.94`) and sweeping down the outer right flank (`c -4.47,76.92 -63.59,153.33 -96.87,184.87`) to a sharp-yet-rounded terminal anchor (`-10.75,11.19 -20.02,2.98 -20.02,-5.67`).
- **Derived Visual Motifs**:
  1. **Capsule-Terminal Stroke (`23.14px` / `11.57px` radius ratio)**: Our living orange signal thread, timeline bars, and hardware pins use full pill/capsule terminals paired with `14px`–`24px` inner chamber corner radii (`--radius-chamber: 18px`, `--radius-architecture: 28px`) rather than generic `8px` SaaS boxes or full circles everywhere.
  2. **The Sweeping Parabolic Arc**: The logo's signature outer right curve (`134.26` down to `319.13`) becomes the primary camera trajectory and SVG/3D spline profile for the signal line crossing between chapters.
  3. **Nested Negative-Space Channels**: UI containers and 3D hardware layers use recessed inner chambers with `14px` fillets that echo the internal cutout of the Farzam mark.

### 1.2 Wordmark Lockup (`brand/typography.svg`)
`brand/typography.svg` (`viewBox="0 0 497.03 166.91"`) constructs **«فرزام»** out of geometric horizontal bars (`height = 23.86`), vertical stems (`width = 23.86`, `rx = 11.93`), rectangular counters (`23.87 × 23.62` inside `ف` and `م`), and two circular nuqtas (`r = 11.93` at `cx=273.14` and `cx=155.15` for `ر/ز` and `ف`).
- **Motif**: The `11.93`-radius circular nuqtas act as "telemetry waypoints" above the baseline, while the square-with-rounded-fillet counters (`rx=5.22`) inspire our KPI data cells and matrix nodes.

### 1.3 Character of Peyda (`brand/fonts/woff2/peyda-300..900.woff2`)
Peyda is a contemporary Iranian geometric-humanist sans-serif with a strong horizontal baseline (kashida-ready), open counters, and decisive weight contrast from `300` (Light) to `900` (Black).
- At `800`–`900` (ExtraBold/Black), Peyda behaves like architectural signage—ideal for tight, confident Persian headlines answering a manager's question.
- At `400`–`500` (Regular/Medium) with `font-variant-numeric: tabular-nums`, its Persian digits (`۰۱۲۳۴۵۶۷۸۹`) align cleanly in dense fleet comparison tables, speedometers, and coordinates.

---

## 2. DESIGN FOUNDATIONS (Single Source of Truth in `src/styles/tokens.css`)

### 2.1 Extended Palette (Strictly Derived from `#FF742E`, `#102333`, `#E8DECD`)
No stray generic Tailwind greens, purples, or cyan-blues exist anywhere in the project. Every surface, neutral, and status token is mathematically mixed in OKLCH/sRGB from the three brand primaries:

| Token | Hex | Derivation | Role & Tested Contrast Pair (WCAG AA >= 4.5:1) |
|---|---|---|---|
| `--color-navy-950` | `#08131C` | Deep Navy darkened 42% | Deepest night sky / 3D void ground. Pair with `#F5EFE6` (15.8:1) or `#FF742E` (6.3:1) |
| `--color-navy-900` | `#102333` | **Core Brand Deep Navy** | Primary dark chapter surface & light-chapter headline ink. Pair with `#E8DECD` (11.4:1) |
| `--color-navy-800` | `#183146` | Deep Navy lightened 12% | Elevated dark cards, 3D hardware casing, HUD panels. Pair with `#F5EFE6` (11.9:1) |
| `--color-navy-700` | `#23435E` | Deep Navy lightened 24% | Dark hairline borders, inactive dark controls, secondary dark surfaces |
| `--color-navy-500` | `#4E6A80` | Mix 65% `#102333` + 35% `#E8DECD` | Muted metadata & captions on light beige surfaces (4.7:1 on `#F5EFE6`) |
| `--color-beige-50` | `#F6F1E7` | Warm Beige lightened 45% | Highest elevation light card surface. Pair with `#102333` (13.8:1) |
| `--color-beige-100` | `#EFE7D8` | Warm Beige lightened 22% | Secondary light surface / table row zebra / report canvas. Pair with `#102333` (12.6:1) |
| `--color-beige-200` | `#E8DECD` | **Core Brand Warm Beige** | Primary light chapter ground (Organisation, Reports, Proof). Pair with `#102333` (11.4:1) |
| `--color-beige-300` | `#D8CBB5` | Warm Beige shaded 12% | Recessed wells, input borders, subtle structural dividers on light chapters |
| `--color-beige-400` | `#B8AA93` | Mix 75% `#E8DECD` + 25% `#102333` | Muted text on dark navy surfaces (`#102333` vs `#B8AA93` = 6.4:1) |
| `--color-orange-500` | `#FF742E` | **Core Brand Vibrant Orange** | **Strictly reserved for live things**: the living signal path, active state, and single primary CTA |
| `--color-orange-400` | `#FF8F57` | Mix 80% `#FF742E` + 20% `#E8DECD` | Signal specular highlight, hover state on dark surfaces (7.8:1 on `#08131C`) |
| `--color-orange-600` | `#D9530F` | Mix 85% `#FF742E` + 15% `#102333` | Accessible orange text/accent on `#F6F1E7` light cards (4.6:1 contrast) |

#### Status Palette (Derived from the 3 Core Colours — Zero Stray Hues)
Every status is always paired with an explicit Persian text label and shape/icon (never colour alone):
- `--status-moving`: `#FF742E` (Vibrant Orange — live kinetic pulse, «در حال حرکت»)
- `--status-stopped`: `#D99B52` (Warm Amber mixed from 55% `#FF742E` + 45% `#E8DECD` — dwell ring, «متوقف»)
- `--status-alert`: `#E04819` (High-intensity Vermilion mixed from 90% `#FF742E` + 10% `#102333` — flare beacon, «هشدار»)
- `--status-cold`: `#8AB0C7` (Frosted Slate-Ice tinted from `#102333` + `#F6F1E7` — cold-chain temperature sensor, «زنجیره سرد»)
- `--status-offline`: `#687C8C` (Desaturated Navy-Beige neutral — «بدون داده / خاموش»)

### 2.2 Typography, Spacing, Radii, Shadows & Motion Tokens
- **Type Scale (Peyda `font-display: swap`)**:
  - `--text-hero`: `clamp(2.35rem, 4.6vw + 0.75rem, 4.5rem)`, weight `900`, line-height `1.14`, letter-spacing `-0.015em`
  - `--text-chapter`: `clamp(1.85rem, 3.2vw + 0.5rem, 3.1rem)`, weight `800`, line-height `1.22`
  - `--text-title`: `clamp(1.25rem, 1.6vw + 0.4rem, 1.65rem)`, weight `700`, line-height `1.35`
  - `--text-body-lg`: `clamp(1.05rem, 0.5vw + 0.9rem, 1.2rem)`, weight `400`, line-height `1.8`
  - `--text-body`: `1rem` (`16px`), weight `400`, line-height `1.75`
  - `--text-meta`: `0.8125rem` (`13px`), weight `500`, line-height `1.5`, `font-variant-numeric: tabular-nums`
- **Spacing Scale**: 8pt spatial rhythm (`--space-1: 0.25rem` through `--space-24: 6rem`, `--space-section: clamp(4.5rem, 9vw, 8.5rem)`).
- **Radii (Born from `logo.svg`)**:
  - `--radius-pill`: `9999px` (capsule terminals `r=11.57`)
  - `--radius-chamber`: `18px` (inner chamber fillet `r=14.5`)
  - `--radius-arch`: `28px` (outer shoulder arc)
  - `--radius-node`: `10px` (wordmark counter `r=5.22`)
- **Elevation (Soft Layered Shadows in Light Mode, No Harsh Borders)**:
  - `--shadow-beige-soft`: `0 18px 40px -16px rgba(16, 35, 51, 0.08), 0 4px 12px -4px rgba(16, 35, 51, 0.05)`
  - `--shadow-beige-float`: `0 28px 64px -20px rgba(16, 35, 51, 0.14), 0 8px 20px -6px rgba(16, 35, 51, 0.07)`
  - `--shadow-signal-glow`: `0 0 28px rgba(255, 116, 46, 0.38)`
- **Motion Language ("What the Signal Feels Like")**:
  - The signal never moves with linear mechanical stiffness; it travels with **high-tension telemetry snap followed by exponential settling** (`--ease-signal: cubic-bezier(0.16, 1, 0.3, 1)`), like a GPS packet locking onto a satellite fix and drawing a vector across terrain.
  - Micro-interactions settle in `--duration-fast: 160ms`; chapter transitions and 3D exploded-view layers damp smoothly via `THREE.MathUtils.damp` (`lambda = 7.5`).

---

## 3. THREE DISTINCT ART DIRECTIONS

### Direction A: «رشته سیگنال زنده» (The Living Telemetry Spine — Exploded Hardware-to-Horizon World)
- **Concept**: One continuous, physical 3D/SVG orange signal filament (`#FF742E`) originates inside the Farzam logo geometry in the Hero, threads downward through an exploded 6-layer 3D GPS tracker, ignites a SIM+IMEI registration pulse, traverses a dark 3D urban geofence dome, and crosses into a warm architectural beige relief world where 9 fleet reports and floating MyFarzam UI frames crystallize directly out of the line.
- **Scroll & Interaction Mechanic**: Scroll advances a synchronized normalized progress value (`0.0` to `1.0`) that drives both the 3D camera/object state and an overarching interactive SVG/WebGL signal spline, while pointer/touch directly bends the filament, explodes hardware layers, scrubs report timelines, and filters live Persian fleet data.
- **3D & Material Language**: Anisotropic brushed deep-navy anodised aluminium (`#102333`), warm beige architectural travertine/paper relief (`#E8DECD`), frosted cold-chain glass (`#8AB0C7`), and self-illuminated orange optical fiber (`#FF742E`) under a studio `RoomEnvironment`.
- **Risks**: Requires careful choreography between the 3D WebGL stage and semantic RTL DOM chapters so text remains 100% legible and mobile GPUs stay at 60fps.

### Direction B: «توپوگرافی داده‌ها» (The Cartographic Relief World)
- **Concept**: The entire website is a continuous top-down isometric contour map made of stacked architectural beige and navy topographic strata. As the user scrolls, the terrain morphs from a single vehicle's street grid into a mountain range of speed, stop durations, and thermal zones.
- **Scroll & Interaction Mechanic**: Camera pans across a giant tilted map table; clicking a report reshapes the elevation heightmap of the terrain in real time.
- **3D & Material Language**: Matte stacked paper/sandstone layers with procedural contour lines and glowing orange pins.
- **Risks**: Heavily favors geographic metaphors (Route, Heatmap) while making hardware internals (IMEI, SIM, ignition wiring, voltage) and tabular Excel evidence feel secondary.

### Direction C: «زوم مقیاس: از پالس تا اتاق فرمان» (Macro-to-Metropolis Scale Zoom)
- **Concept**: A continuous logarithmic Z-axis zoom starting inside the copper traces of a tracker PCB (`1mm` scale), pulling back to a truck (`10m`), a warehouse geofence (`1km`), a national highway network (`1,000km`), and finally an executive command screen.
- **Scroll & Interaction Mechanic**: Scroll controls Z-depth along a tunnel of nested frames.
- **3D & Material Language**: Wireframe schematics transitioning into volumetric point clouds.
- **Risks**: Z-axis scroll-jacking often causes motion discomfort on mobile phones and makes reading long-form Persian RTL copy and interacting with the 9 report metaphors awkward when the user stops mid-transition.

---

## 4. CHOSEN DIRECTION & JUSTIFICATION

**Chosen Direction: Direction A — «رشته سیگنال زنده» (The Living Telemetry Spine — Exploded Hardware-to-Horizon World)**

1. **Wow Factor**: It delivers an immediate, jaw-dropping Awwwards signature—a sculptural 3D world where the real Farzam logo is assembled by an orbiting orange telemetry filament on the left while razor-sharp Persian typography anchors the right, seamlessly evolving into an interactive exploded 3D tracker and a tactile 9-report laboratory.
2. **Fit with Farzam's Business**: Farzam is neither "just hardware" nor "just SaaS"—it is **Hardware + MyFarzam Software + Customisation** as one connected system. Direction A physically connects the hardware sensor layers (GPS, SIM, Ignition, Motion, Voltage, Temperature, Fuel) to the live map, the 9 analytical reports, and the organisational dashboard via one unbroken orange signal line.
3. **Performance on Mid-Range Phones**: Instead of one monolithic full-page WebGL canvas that hogs memory, we pair a lightweight, zero-latency SVG/Canvas Living Signal Spine across the page with **modular, IntersectionObserver-paused Three.js stages** (`pixelRatio <= 1.5` on mobile, `isSoftwareGl` adaptive rendering, on-demand `requestRender()` when idle) and an automatic rich SVG/CSS fallback if WebGL is unavailable.
4. **Persian / RTL Compatibility**: Semantic DOM text sits in clean RTL grid columns (`dir="rtl" lang="fa"`) using CSS logical properties (`margin-inline-start`, `padding-inline-end`), never trapped inside canvas pixels and never overlapped by the 3D viewport.

---

## 5. CHAPTER-BY-CHAPTER STORYBOARD

| Chapter | Surface Mode | Manager's Question | Visual Metaphor | User Interaction | Mobile Adaptation (`360px`–`640px`) |
|---|---|---|---|---|---|
| **1. HERO (قهرمان داستان)** | Dark Navy (`#08131C` -> `#102333`) | «ناوگان من همین لحظه کجاست و در چه حالی است؟» | **The Signal Awakens**: On the inline-end (left in RTL), a 3D spatial sculpture assembles the exact geometry of `brand/logo.svg` from brushed navy monoliths and a living orange telemetry ribbon orbiting a live vehicle beacon. Persian headline sits cleanly on the right (inline-start), never over the 3D object. | Pointer/touch tilts the 3D Farzam sculpture and sends a shockwave pulse down the orange signal line; live status switcher («در حال حرکت»، «توقف در محدوده»، «زنجیره سرد») morphs the signal behavior. | Vertical stack: crisp Persian headline & primary CTA at top (immediate LCP), interactive touch-tilt 3D stage directly below (`height: 340px`), zero horizontal overflow. |
| **2. HARDWARE (کالبدشکافی سخت‌افزار)** | Dark Navy (`#102333`) | «این داده از کجا می‌آید و چقدر قابل اعتماد است؟» | **Exploded 3D Tracker**: A composite 10-part 3D GPS hardware unit (anodised shell, GNSS ceramic patch antenna, SIM tray, ignition/power harness, accelerometer core, voltage regulator, plus optional temperature probe & fuel sensor). | Interactive layer selector + explode slider separates the 3D tracker layers and highlights the exact MyFarzam software outputs fed by each sensor (`content/farzam-features.md`). | Touch-friendly horizontal chip bar (`>=44px` height) above a compact 3D viewer with a synchronized hardware-to-software mapping card below. |
| **3. CONNECTIVITY (لحظه بیداری دستگاه)** | Dark-to-Mid Navy (`#102333` -> `#183146`) | «چطور یک ردیاب فیزیکی به یک دارایی زنده روی نقشه تبدیل می‌شود؟» | **IMEI + SIM Ignition**: An interactive hardware onboarding bridge based on `Add device / افزودن دستگاه` (`IMEI/ID`, tracker model, SIM number, vehicle label, UTC/local timezone, Iranian plate). | Clicking **«ثبت و ادامه»** fires an orange packet along the signal spine into the live coordinate grid—turning an unlinked tracker into a live, pulsing vehicle marker. | Single-column tactile registration card with 1-tap demo presets and instant animated connection feedback below. |
| **4. LIVE CONTROL (کنترل زنده، محدوده و اعلان)** | Deep Navy (`#08131C`) | «آیا ناوگان در مسیر و محدوده مجاز حرکت می‌کند؟» | **The Glass Geofence Dome & Alert Beacons**: A 3D/vector spatial map with a translucent dome boundary (Circle / Polygon / Speed limit) and a 3-tab chronological notification feed (`هشدارها` Alerts, `سرویس و نگهداری` Maintenance, `سیستمی` System). | Toggle vehicle position (`داخل محدوده`, `خروج از محدوده`, `تخطی از سرعت مجاز`) and filter notifications across the 3 authentic MyFarzam tabs. | Full-width interactive map stage on top, 3-tab touch switcher and chronological alert cards stacked cleanly underneath. |
| **5. THE 9 REPORTS (آزمایشگاه ۹ گزارش تحلیلی)** | Intentional Light Bridge -> Warm Beige (`#E8DECD` / `#EFE7D8` / `#F6F1E7`) | «هر گزارش به کدام سؤال حیاتی مدیر پاسخ می‌دهد؟» | **9 Bespoke Interactive Metaphors in One Shared World**: Each of the 9 reports (`پیمایش`, `سفر`, `توقف`, `روزانه`, `عملکرد`, `محدوده`, `رویداد`, `نقشه حرارتی`, `دما`) has its own interactive physics/visual canvas + real synthetic data table + **«تولید گزارش» -> «خروجی اکسل»** evidence workflow. | Select any of the 9 reports, scrub its interactive visual metaphor (e.g., dwell ring radius for Stop, ice crystallization for Temperature, 3D relief for Heatmap), click **«تولید گزارش»** to unlock **«خروجی اکسل (Excel)»**, and export real synthetic `.csv` data. | Report selector renders as a 3×3 tactile grid of `>=44px` buttons; the active report's interactive visual stage and generated table stack cleanly with card-based mobile rows. |
| **6. PERSONAL vs ORGANISATION (شخصی در برابر سازمانی)** | Warm Beige (`#EFE7D8` & `#F6F1E7`) | «فرزام برای یک خودرو چه تفاوتی با ناوگان صد خودرویی دارد؟» | **One Node vs. Fleet Constellation**: Side-by-side interactive transformation showing a single personal vehicle (`اشتراک شخصی`) expanding into grouped fleets (`مدیریت گروه‌ها`), multi-device `Performance` comparison, and fleet `Heatmap` (`اشتراک سازمانی`). | Toggle between Personal, Organisational, and Base tiers to watch the signal line branch from 1 thread into a multi-group organizational tree. | Segmented 2-way toggle at top; dynamically morphs the visual diagram and capability matrix below without horizontal scroll. |
| **7. CUSTOMISATION (سفارشی‌سازی سخت‌افزار و نرم‌افزار)** | Layered Beige (`#E8DECD` with `#102333` architectural blocks) | «آیا سیستم با فرآیند و سنسورهای خاص سازمان ما تطبیق می‌یابد؟» | **Modular System Plug-in**: Architecture blocks showing custom sensor inputs (cold-chain, fuel, specialized telemetry) and software workflow integrations snapping into the MyFarzam core. | Toggle industry scenarios (پخش سردخانه‌ای، حمل‌ونقل جاده‌ای و سوخت، ناوگان توزیع شهری) to rewire the input-to-report pipeline live. | Vertical pipeline diagram with tap-to-activate scenario buttons. |
| **8. PRODUCT UI (رابط کاربری مای‌فرزام در عمل)** | Dark/Light Contrast Showcase (`#102333` frame on `#E8DECD`) | «محیط واقعی نرم‌افزار مای‌فرزام چه حسی دارد؟» | **Floating 3D-Tilted Live Product Interface**: Built 100% in code from `content/farzam-features.md`—featuring `داشبورد مدیریتی` (4 KPI cards: کل دستگاه‌ها، روشن، در حال حرکت، دارای موقعیت فعال + 4 charts: بیشترین سرعت، بیشترین مسافت، میانگین سرعت، تعداد توقف + period switcher `۷ روز` / `۲ هفته` / `۱ ماه`), `مدیریت دستگاه‌ها` (with Iranian plates, SIM, IMEI, subscription validity), and `مقایسه عملکرد`. | Fully interactive workspace: switch menu pages, switch `۷ روز` / `۲ هفته` / `۱ ماه` chart ranges, filter by group, search devices, and inspect live synthetic vehicles. | Responsive mobile app shell with bottom/top tab bar and swipeable KPI & chart cards. |
| **9. FINAL CTA (پایان مسیر سیگنال)** | Deep Navy (`#08131C`) | «چطور ناوگان خودمان را به فرزام متصل کنیم؟» | **The Signal Locks On**: The orange signal line completes its journey by forming the Farzam emblem beside an outcome-driven consultation & demo request form. | Validated Persian form (نام و نام خانوادگی، نام سازمان / نوع کاربری، شماره تماس، تعداد ناوگان) with instant confirmation state and direct support handoff. | Full-width touch inputs (`>=48px` height), clear validation messages, and 1-tap submission. |

---

## 6. TECH PLAN: Stack, Budgets & Fallbacks

- **Stack**:
  - **Vite + React 19 + TypeScript**: Modular architecture under `src/components/`, `src/data/`, `src/utils/`, and `src/styles/tokens.css`.
  - **Three.js (`three@0.170.0`)**: Direct, zero-overhead custom `THREE.WebGLRenderer` components with `RoomEnvironment` PBR reflections, composite 8–12 part `THREE.Group` models, `isSoftwareGl` detection, and `afterDraw()` pacing so both real GPUs and headless Chromium software WebGL run smoothly without stalling.
  - **Pure Logic & Unit Testing (`node:test`)**: All telemetry math, report filtering, Persian numeral formatting (`toPersianDigits`), Excel/CSV generation, and form validation decoupled into `src/utils/telemetryLogic.ts` and verified with `npx --yes tsx --test`.
- **Scene & Asset Budget**:
  - Zero external image/model/font URLs (0 network 404s). All Peyda `.woff2` weights (`300`–`900`) served locally from `/brand/fonts/woff2/` with `font-display: swap`.
  - Real `brand/logo.svg` and `brand/typography.svg` embedded faithfully without distortion.
  - WebGL scenes paused automatically when off-screen via `IntersectionObserver`, pixel ratio capped at `1.5` on mobile (`1.0` on software WebGL), and all geometries/materials disposed on unmount.
- **Fallbacks & Accessibility**:
  - Automatic `webglSupported` check + `prefers-reduced-motion` listener: if WebGL is unavailable or reduced motion is active, scenes render a high-craft interactive SVG/CSS schematic blueprint with full functionality.
  - Full RTL logical CSS properties (`inline-start` / `inline-end`), semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), skip-to-content link, visible `:focus-visible` outlines, and WCAG AA contrast across every token pair.
