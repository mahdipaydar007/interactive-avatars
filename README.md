# Meet the Team: Animated Vector Avatars

An interactive team page that shows each teammate as a flat vector avatar. Hovering (or tapping) a card brings the character to life with a facial-expression animation and a small themed scene built around what they love: coding, painting, math, music, gaming, reading, gardening, coffee and photography.

Pure HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies. The only external request is the Poppins font from Google Fonts, which falls back to the system UI font if it can't load.

---

## Features

- **Nine hand-drawn SVG characters**, generated from data and styled after a flat-vector avatar sheet: navy outlines, coral and mustard fills, dot eyes, an L-shaped nose and short shoulders sitting on a ground line. Each has its own hair, outfit and accessories.
- **Face-driven animation engine.** Gaze, eyelids, brows, head tilt and mouth are animated by a small physics-style smoothing loop (`requestAnimationFrame`). Expressions blend into each other without abrupt jumps.
- **Morphing mouth.** One parametric path morphs between flat, smile, smirk, frown, open "o", grin and tongue-out. There are no cross-fades between separate drawings.
- **Per-character scenes.** Props such as a laptop, canvas, chalkboard, headphones, book, plant, mug and camera spring in and out by scaling, with no opacity fades.
- **Kai's viewfinder.** The camera frame hunts, locks onto his face, turns green, and tracks his head, then a flash sparkle fires at the shot.
- **Accessible and responsive.** Cards are keyboard-focusable. Touch devices toggle on tap. `prefers-reduced-motion` is respected. Light and dark themes are supported, and the layout is a responsive grid with safe-area insets.

## Project structure

```
team-site/
├── index.html   # Page shell: header and an empty grid the script fills in
├── styles.css   # Layout, theming, prop/scene animations
├── script.js    # Character data, SVG builders and the facial animation engine
└── README.md
```

## Getting started

No installation is needed.

1. Download or clone the folder.
2. Open `index.html` in any modern browser.

Or serve it locally if you prefer:

```bash
cd team-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

## How it works

### 1. Characters are data

Every teammate is one object in the `TEAM` array in `script.js`:

| Field | Purpose |
|---|---|
| `n`, `r`, `b` | Name, role label, one-line blurb shown on the card |
| `t` | Pastel background color of the card's stage |
| `bk`, `fr` | SVG for the hair behind the head (`bk`) and in front of it (`fr`) |
| `hx` | Extra head accessories, such as headphones |
| `nk` | Art drawn behind the neck, such as a hood |
| `ch` | `1` adds the pink cheek blush |
| `sh` | `1` adds the soft pink chin shadow on the neck |
| `body` | Shoulders and clothing |
| `bg`, `pr` | Scene elements drawn behind (`bg`) and in front of (`pr`) the character |
| `gl` | Optional soft screen-glow overlay on the face |
| `beard` | `1` places the mouth lower and draws it in white |
| `fx` | The expression script (see below) |

`face()` assembles these into one SVG per card. Eyebrows are not part of the resting look; they grow in while a face is animating, so the idle avatars stay true to the flat style. Small helpers (`P`, `L`, `C`, `T`, `IT`, `dr`) keep the drawing code compact.

### 2. The facial animation engine

Each card gets a `Face` instance. Instead of hand-written keyframes, the face has a set of numeric parameters (defined in `N`):

| Parameter | Controls |
|---|---|
| `gx`, `gy` | Gaze direction |
| `eL`, `eR` | Left and right eye openness (1 is normal, about 0.1 is closed, above 1 is wide) |
| `bLy`, `bLr`, `bRy`, `bRr` | Brow height and rotation |
| `hr`, `hy` | Head rotation and vertical offset |
| `w`, `sm`, `o`, `sk`, `tg` | Mouth width, smile curvature, openness, skew (smirk) and tongue |
| `px`, `py` | Optional prop offset (Ivy's butterfly) |
| `lk` | Camera-frame lock amount (Kai) |

While a card is active, the engine steps through the character's expression script. Each frame, every parameter eases toward the current target using exponential smoothing, which gives natural motion. When you stop hovering, all targets return to neutral, so the face eases back instead of snapping.

### 3. Expression scripts

`fx` holds a smoothing speed `k` and a list `s` of `[pose, holdMs]` pairs. Poses are plain objects that override the neutral values. The mouth presets live in `M`.

```js
fx: {
  k: 6,                       // how snappy the face moves (higher is faster)
  s: [
    [{ ...M.flat,  eL: .7, gx: -3, gy: 5, bLr: 7 }, 1500],  // focused
    [{ ...M.grin,  eL: 1.2, bLy: -5, hy: -2 },     1300],   // eureka!
  ]
}
```

### 4. Scene and prop animation

Props and symbols spring in and out using CSS `transform: scale()` transitions (`.it`, `.rise`, `.pop`, `.grow`). Loops such as drawing strokes, steam wisps, page flips and the LEVEL UP text are CSS keyframes in `styles.css`. All of them are gated behind the `.on` class that the script toggles on hover, focus or tap.

## Customization

**Change names, roles and blurbs.** Edit `n`, `r` and `b` for each entry in `TEAM`.

**Tune an expression.** Adjust the numbers in that character's `fx.s` poses, or change the hold time (the second value in each pair).

**Add a new teammate.**

1. Add a new object to `TEAM` with `n`, `r`, `b`, `t`, `bk`/`fr`, `body`, `pr` and an `fx` script.
2. Reuse the helpers and mouth presets (`M`) for consistent style.
3. Optionally add scene CSS under `.on` in `styles.css`.

**Change the theme.** The color tokens are CSS variables at the top of `styles.css` (`--bg`, `--card`, `--tx`, `--mu`, `--bd`). A dark variant is included and follows the system setting.

**Change the grid.** Edit the `.grid` rule in `styles.css`. It is currently `repeat(auto-fit, minmax(270px, 1fr))`.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari. The page uses SVG, CSS custom properties, `transform-box`, `requestAnimationFrame` and the Web Animations API (for Kai's flash).

## License

Add the license of your choice here (for example MIT).
