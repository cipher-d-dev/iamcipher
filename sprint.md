# Grimoire Enhancement Sprint

Items are ordered by priority. Work through them top to bottom.
Mark each item `[x]` when shipped.

---

## 🔒 P0 — Book Clasp (High Priority)

- [ ] **Clasp / hasp mechanism**
  - SVG-based metal latch rendered in `preserve-3d` space, positioned on the right edge of the closed cover at vertical center
  - Locked state: latch arm sits flat, visually blocks the book from opening — clicking the cover while locked does nothing
  - On click: GSAP rotates the latch arm upward (~110°) around its base pivot with `power2.out`, plays `playClick` sound, then fires `handleOpen` after ~450ms delay once the arm is fully raised
  - On close complete: latch arm animates back down to locked position (`power3.out` for a satisfying snap)
  - Clasp body: a small rectangular base plate with a gold/brass colour (`--gold` token), engraved border detail, subtle `box-shadow` for depth
  - Latch arm: thinner bar connected at the base plate, `transform-origin` at the hinge point (bottom of arm), `preserve-3d` so it catches the book's parallax tilt
  - Hover state: faint gold glow pulse on the latch to invite interaction
  - The "Open Grimoire" implied action should shift to clicking the clasp rather than clicking the cover directly

---

## ✨ P1 — High Payoff, Low Effort

- [ ] **Page-edge gilding shimmer**
  - Animate a gold shimmer sweep across the right-side pageblock div on `handleOpen`
  - CSS `@keyframes` shine sweep (linear-gradient moving left→right) triggered by a class added during opening sequence
  - Duration ~0.8s, starts at the same time the cover lifts

- [ ] **Hover-to-peek**
  - When book is `closed`, hovering near the right edge of the cover lifts it 15–20° (`rotateY: -20` on leaf 0)
  - Mouse leave snaps it back with `power2.out`
  - Implemented in the mouse parallax `useGSAP` block — add a separate `mousemove` zone check for the right 20% of the book width
  - Should not fire while `bookState !== 'closed'`

- [ ] **Dust particle burst on open**
  - One-shot particle burst from the spine area when the cover lifts (at the same `t=0.5` point where `playMulti` fires)
  - Reuse the existing `<Particles>` component if it supports a triggered burst mode, otherwise add 6–8 tiny `div` elements that GSAP scatters outward with `stagger` and fade to `opacity: 0`
  - Particles: small irregular shapes, `--paper` / `--gold` colours, random `x/y` scatter ±60px, duration ~1s

- [ ] **Ribbon bookmark**
  - A thin (4px wide) silk ribbon hanging from the top of the book, extending ~80px below the bottom edge
  - Colour: deep crimson (`#8b1a1a`), slight sheen gradient
  - Positioned at roughly 65% from the left edge of the cover (classic bookmark position)
  - Subtle sway animation (`rotateZ: ±2°`, `sine.inOut`, `repeat: -1`) when book is closed
  - Hides/fades when book opens (it would be inside the pages)
  - Purely cosmetic — no functional jump behaviour needed unless you want it later

---

## 🕯️ P2 — Atmosphere & Lighting

- [ ] **Candle ambient light flicker**
  - A radial gradient overlay (`position: absolute`, `pointer-events-none`, `z-index: 0`) above the book, simulating a candle top-left
  - Animate `opacity` between `0.18` and `0.28` on a `sine.inOut` loop with slight `duration` randomisation to fake flame flutter
  - Warm amber tone (`rgba(255, 174, 80, 0.22)`)
  - Active in all states — very subtle, mostly felt rather than seen

- [ ] **Reading mode vignette**
  - On `handleOpen`, animate a full-screen dark vignette (`radial-gradient` from transparent center to `rgba(0,0,0,0.55)` edges) fading in over ~0.8s
  - Fades back out on `handleClose`
  - Makes the book feel like the only lit object in the room

- [ ] **Page texture variation per section**
  - Slightly adjust parchment warmth between sections via an inline `filter: sepia() brightness()` on the leaf div, driven by `leafCategory` or section index
  - Origin: warmer (`sepia(0.15)`)
  - Tools/Experience: cooler, slightly desaturated (`brightness(0.97)`)
  - Contact: slightly darker, more aged
  - One CSS variable change per leaf — zero animation cost

- [ ] **Ambient background layer**
  - A second `<audio>` element in `page.tsx`: fireplace crackling or wind ambience loop, volume `0.08`
  - Fades in when book opens, fades out when book closes
  - User mute toggle should silence this too
  - Source: find a royalty-free ~30s loop, add to `/public`

---

## 🖱️ P3 — Interaction Details

- [ ] **Page corner dog-ear on hover**
  - On hover over the bottom-right ~40×40px corner of the front-facing right page, a small triangle folds over
  - Implemented as an absolutely-positioned `div` inside the leaf's front face, `transform-origin: bottom-right`, `rotateX` or `skew` on hover
  - CSS transition only (no GSAP needed), `pointer-events-auto`
  - Only active when `bookState === 'reading'` and leaf is the current top page

- [ ] **Magnifying glass cursor**
  - Custom CSS cursor SVG (a simple magnifying glass) applied to the book container when `bookState === 'reading'`
  - `cursor: url('/cursor-magnify.svg') 12 12, auto`
  - Revert to `cursor-pointer` on nav buttons and bookmark

- [ ] **Ink-writing entrance per page**
  - When a page is revealed (becomes the visible spread), animate its content in via a `clip-path` wipe from top-left to bottom-right over ~0.4s
  - Applied as a CSS animation class added when the page becomes active
  - Falls back gracefully if `prefers-reduced-motion` is set

---

## 🔊 P4 — Sound Polish

- [ ] **Page settle sound**
  - A short, faint creak/paper-settle SFX at the end of `handleOpen` (when all leaves have landed)
  - New audio file in `/public`, triggered via `tl.call()` at the timeline's end
  - Volume ~0.3, no loop

- [ ] **Clasp-specific click sound**
  - Separate metal-click SFX distinct from `fantastyclicksound.mp3`
  - Only plays on clasp interaction, not on other click events
  - Short, sharp, metallic

---

## Notes

- CSS variables already in `globals.css`: `--gold`, `--gold-bright`, `--leather`, `--paper`, `--pen`, `--ink`
- Book dimensions: `400px × 600px`, scaled via `scale` state, `preserve-3d` context throughout
- Existing pageblock right edge (`right: -13px`, `width: 26px`) is the reference point for clasp positioning
- `playClick` is already wired and available in Book props — use it for the clasp unlock sound until a dedicated SFX is sourced
