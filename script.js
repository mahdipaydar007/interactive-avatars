const ink = "#1f2340",
  K = "#f08c88",
  Y = "#f5b95f",
  G = "#6fc3b2",
  B = "#7aa7e8",
  W = "#fff",
  S2 = "#2b3060";
const st = `stroke="${ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const P = (d, f, x = "") => `<path d="${d}" fill="${f}" ${st} ${x}/>`;
const L = (d, c = ink, w = 3, x = "") =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${x}/>`;
const C = (x, y, r, f, x2 = "") =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${st} ${x2}/>`;
const IT = (s, d = 0) => `<g class="it" style="--d:${d}s">${s}</g>`;
const T = (x, y, t, c, d, s = 24) =>
  IT(
    `<text class="fl" x="${x}" y="${y}" fill="${c}" font-size="${s}" font-weight="700" text-anchor="middle" style="animation-delay:${d}s">${t}</text>`,
    d / 2,
  );
const dr = (d, c, dl, w = 5) =>
  L(d, c, w, `pathLength="100" class="dr" style="animation-delay:${dl}s"`);
const BD =
  "M50,248 V222 Q50,198 84,190 L106,184 Q120,196 134,184 L156,190 Q190,198 190,222 V248Z";
const glasses = (c) =>
  `<circle cx="86" cy="90" r="13.5" fill="none" stroke="${c}" stroke-width="3.2"/><circle cx="114" cy="90" r="13.5" fill="none" stroke="${c}" stroke-width="3.2"/>` +
  L("M99,90 H101", c, 3);
const glow = (c) =>
  `<ellipse class="scr" cx="100" cy="88" rx="34" ry="42" fill="${c}"/>`;

/* ---- facial expression engine ---- */
const N = {
  gx: 0,
  gy: 0,
  eL: 1,
  eR: 1,
  bLy: 0,
  bLr: 0,
  bRy: 0,
  bRr: 0,
  hr: 0,
  hy: 0,
  w: 8,
  sm: 1,
  o: 0,
  sk: 0,
  tg: 0,
  px: 0,
  py: 0,
  lk: 0,
};
const M = {
  flat: { w: 6, sm: 0 },
  smile: { w: 8, sm: 1 },
  smirk: { w: 7, sm: 0.5, sk: 4 },
  frown: { w: 7, sm: -1.2 },
  hmm: { w: 6, sm: -0.3, sk: 3 },
  grin: { w: 10, sm: 1.4, o: 10 },
  o: { w: 4.5, sm: 0, o: 12 },
  sing: { w: 6, sm: 0.4, o: 9 },
  tongue: { w: 9, sm: 1.2, o: 9, tg: 1 },
};
const mouthD = (w, sm, o, sk) => {
  const k = w * 0.55,
    Ly = 110 + sk / 2,
    Ry = 110 - sk / 2,
    uy = 110 + sm * 5,
    ly = uy + o * 1.35;
  return [
    `M${100 - w},${Ly} C${100 - w + k},${uy} ${100 + w - k},${uy} ${100 + w},${Ry} C${100 + w - k},${ly} ${100 - w + k},${ly} ${100 - w},${Ly}Z`,
    ly,
  ];
};
const SQ = { eL: 0.6, eR: 0.6 },
  CL = { eL: 0.08, eR: 0.08 };

function Face(card, fx) {
  const $ = (s) => card.querySelector(s),
    gz = $(".gz"),
    eL = $(".eyL"),
    eR = $(".eyR"),
    bl = $(".bl2"),
    br = $(".br2"),
    hd = card.querySelectorAll(".head"),
    mp = $(".mp"),
    tg = $(".tgm"),
    mv = $(".mv"),
    fl = $(".flash"),
    lkEl = $(".lock");
  let cur = { ...N },
    tgt = { ...N },
    idx = -1,
    hold = 0,
    on = false,
    raf = 0,
    last = 0,
    amp = 0;
  const f = (n) => n.toFixed(2);
  const eye = (e, cx, s) =>
    e.setAttribute(
      "transform",
      `translate(${cx} 90) scale(1 ${f(Math.max(0.05, s))}) translate(${-cx} -90)`,
    );
  const draw = (t) => {
    const c = cur;
    gz.setAttribute("transform", `translate(${f(c.gx)} ${f(c.gy)})`);
    eye(eL, 87, c.eL);
    eye(eR, 113, c.eR);
    const bs = f(Math.max(0.001, Math.min(1, amp * 1.8)));
    bl.setAttribute(
      "transform",
      `translate(0 ${f(c.bLy)}) translate(87 74) rotate(${f(c.bLr)}) scale(${bs}) translate(-87 -74)`,
    );
    br.setAttribute(
      "transform",
      `translate(0 ${f(c.bRy)}) translate(113 74) rotate(${f(c.bRr)}) scale(${bs}) translate(-113 -74)`,
    );
    const hy = c.hy + Math.sin(t / 650) * 1.4 * amp;
    hd.forEach((h) =>
      h.setAttribute(
        "transform",
        `translate(0 ${f(hy)}) rotate(${f(c.hr)} 120 190)`,
      ),
    );
    const [d, ly] = mouthD(c.w, c.sm, c.o, c.sk);
    mp.setAttribute("d", d);
    mp.setAttribute("fill-opacity", f(Math.min(1, c.o / 3)));
    tg.setAttribute(
      "transform",
      `translate(100 ${f(110 + 0.75 * (ly - 110) - 3)}) scale(${f(Math.max(0, c.tg))})`,
    );
    if (mv) mv.setAttribute("transform", `translate(${f(c.px)} ${f(c.py)})`);
    if (lkEl) {
      const s = 1.9 - 0.9 * c.lk,
        m = Math.max(0, Math.min(1, (c.lk - 0.6) / 0.4)),
        rgb = [242, 154, 154].map((a, i) =>
          Math.round(a + ([111, 195, 178][i] - a) * m),
        );
      lkEl.setAttribute(
        "transform",
        `translate(0 ${f(hy * c.lk)}) rotate(${f(c.hr * c.lk)} 120 190) translate(120 116) scale(${f(s)}) translate(-120 -116)`,
      );
      lkEl.style.color = `rgb(${rgb})`;
    }
  };
  const step = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    const k = 1 - Math.exp(-dt * fx.k);
    let moving = false;
    for (const key in N) {
      const d = tgt[key] - cur[key];
      cur[key] += d * k;
      if (Math.abs(d) > 0.01) moving = true;
    }
    amp += ((on ? 1 : 0) - amp) * (1 - Math.exp(-dt * 3));
    if (on) {
      hold -= dt * 1000;
      if (hold <= 0) {
        idx = (idx + 1) % fx.s.length;
        const [p, h] = fx.s[idx];
        tgt = { ...N, ...p };
        hold = h;
        if (p.hook && fl)
          fl.animate(
            [
              { transform: "scale(0) rotate(0deg)" },
              { transform: "scale(1.3) rotate(25deg)", offset: 0.3 },
              { transform: "scale(0) rotate(60deg)" },
            ],
            { duration: 520, easing: "ease-out" },
          );
      }
    }
    draw(t);
    raf = on || moving || amp > 0.01 ? requestAnimationFrame(step) : 0;
  };
  draw(0);
  return {
    start() {
      on = true;
      idx = -1;
      hold = 0;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    },
    stop() {
      on = false;
      tgt = { ...N };
    },
  };
}

/* ---- team: each fx.s entry is [pose, hold ms]; k = how snappy the face moves ---- */
const TEAM = [
  {
    n: "Mia",
    r: "Creative Artist",
    b: "Squints, gasps, and grins at her own canvas.",
    t: "#fde2e2",
    fx: {
      k: 5,
      s: [
        [
          {
            ...M.flat,
            ...SQ,
            gx: 5,
            gy: -1,
            bLy: 2,
            bLr: 8,
            bRy: 2,
            bRr: -8,
            hr: -4,
          },
          1500,
        ],
        [
          {
            ...M.grin,
            gx: 6,
            gy: 1,
            eL: 1.15,
            eR: 1.15,
            bLy: -4,
            bRy: -4,
            hy: -2,
          },
          1300,
        ],
        [
          {
            ...M.o,
            gx: -3,
            gy: 3,
            bLy: -4,
            bLr: -6,
            bRy: -4,
            bRr: 6,
            hr: 3,
            hy: 2,
          },
          1200,
        ],
        [{ ...M.smirk, gx: 5, eL: 0.8, eR: 0.8, hr: -3, hy: -1 }, 1300],
      ],
    },
    bk: P(
      "M56,98 Q54,36 100,32 Q146,36 144,98 L144,138 Q144,146 136,146 L64,146 Q56,146 56,138Z",
      K,
    ),
    fr: P(
      "M63,90 Q58,46 100,40 Q142,46 137,90 Q136,72 126,62 Q118,70 106,62 Q94,72 74,74 Q66,78 63,90Z",
      K,
    ),
    body:
      P(BD, ink) +
      L("M92,189 Q120,216 148,189", W, 11) +
      L("M103,187 Q120,201 137,187", ink, 3),
    ch: 1,
    bg: IT(
      L("M172,140 L164,214 M218,140 L226,214", ink, 4) +
        `<rect x="152" y="34" width="82" height="106" rx="4" fill="#fff" ${st}/>` +
        dr("M184,66 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0", Y, 0) +
        dr("M160,124 L180,98 L196,116 L214,92 L228,124", G, 1.2) +
        dr("M160,132 Q175,124 190,132 T224,132", B, 2.4, 4),
    ),
    pr:
      T(30, 110, "●", K, 0, 16) +
      T(46, 150, "●", Y, 1.2, 12) +
      T(26, 190, "●", B, 2, 14),
  },
  {
    n: "Leo",
    r: "Code Wizard",
    b: "Frowns, has a eureka moment, then smirks.",
    t: "#dfeee9",
    fx: {
      k: 6,
      s: [
        [
          {
            ...M.flat,
            eL: 0.7,
            eR: 0.7,
            gx: -3,
            gy: 5,
            bLy: 2,
            bLr: 7,
            bRy: 2,
            bRr: -7,
            hr: 2,
            hy: 4,
          },
          1500,
        ],
        [
          {
            ...M.flat,
            eL: 0.7,
            eR: 0.7,
            gx: 4,
            gy: 5,
            bLy: 2,
            bLr: 7,
            bRy: 2,
            bRr: -7,
            hr: 2,
            hy: 4,
          },
          900,
        ],
        [
          {
            ...M.grin,
            gx: 4,
            gy: -3,
            eL: 1.2,
            eR: 1.2,
            bLy: -5,
            bRy: -5,
            hr: -3,
            hy: -2,
          },
          1300,
        ],
        [
          {
            ...M.frown,
            gx: -5,
            gy: 4,
            eL: 0.9,
            eR: 0.9,
            bLy: -5,
            bLr: -8,
            bRy: 2,
            bRr: -8,
            hr: 3,
            hy: 2,
          },
          1400,
        ],
        [
          {
            ...M.smirk,
            gx: 3,
            gy: 5,
            eL: 0.8,
            eR: 0.8,
            bRy: -2,
            hr: -1,
            hy: 3,
          },
          1300,
        ],
      ],
    },
    gl: glow(G),
    beard: 1,
    fr:
      P(
        "M62,90 Q58,52 74,42 Q94,30 120,28 Q142,26 144,42 Q146,58 138,72 Q137,80 137,92 Q136,68 120,63 Q100,59 80,66 Q68,72 66,94Z",
        ink,
      ) +
      P(
        "M65,94 Q62,128 84,139 Q100,147 116,139 Q138,128 135,94 Q131,110 122,113 Q112,106 100,108 Q88,106 78,113 Q69,110 65,94Z",
        ink,
      ),
    body:
      P(BD, ink) +
      P("M96,184 Q120,198 144,184 V248 H96Z", K) +
      '<path d="M105,184 Q120,206 135,184Z" fill="#fff"/>' +
      L("M105,184 Q120,206 135,184", ink, 2.5),
    pr:
      `<g class="rise">${P("M68,248 V212 Q68,206 74,206 H166 Q172,206 172,212 V248Z", "#dfe3f1")}${C(120, 226, 6, K)}</g>` +
      T(36, 100, "&lt;/&gt;", G, 0, 20) +
      T(206, 100, "{ }", K, 0.8, 22) +
      T(30, 160, ";", Y, 1.5, 26) +
      T(210, 160, "#", B, 2.2, 22),
  },
  {
    n: "Ollie",
    r: "Math Whiz",
    b: 'Ponders, shouts "aha!", then gets puzzled again.',
    t: "#fdf0cf",
    fx: {
      k: 5,
      s: [
        [{ ...M.smirk, gx: -4, gy: -5, bRy: -6, bRr: -6, hr: -5 }, 1500],
        [
          {
            ...M.grin,
            gx: 5,
            gy: -4,
            eL: 1.25,
            eR: 1.25,
            bLy: -5,
            bRy: -5,
            hr: 3,
            hy: -3,
          },
          1200,
        ],
        [
          {
            ...M.frown,
            gx: -5,
            gy: 2,
            eL: 0.8,
            eR: 0.8,
            bLy: 2,
            bLr: 8,
            bRy: 2,
            bRr: -8,
            hr: 5,
          },
          1400,
        ],
        [{ ...M.hmm, gx: 4, gy: -4, bLy: -2, bRy: -2, hr: -3 }, 1300],
      ],
    },
    bk: (() => {
      const c = [
        [56, 64],
        [68, 46],
        [90, 38],
        [112, 38],
        [132, 46],
        [144, 62],
        [148, 86],
        [144, 108],
        [134, 124],
        [66, 124],
        [56, 108],
        [52, 86],
      ];
      return (
        c
          .map(
            ([x, y]) =>
              `<circle cx="${x}" cy="${y}" r="15" fill="${ink}" stroke="${ink}" stroke-width="6"/>`,
          )
          .join("") +
        c
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${Y}"/>`)
          .join("")
      );
    })(),
    fr: P(
      "M64,78 Q64,54 82,52 Q90,60 100,53 Q110,60 118,52 Q136,54 136,78 Q128,64 118,68 Q108,62 98,68 Q86,62 76,70 Q68,68 64,78Z",
      Y,
    ),
    body: `<clipPath id="k2"><path d="${BD}"/></clipPath>${P(BD, ink)}<g clip-path="url(#k2)">${[204, 220, 236].map((y) => L(`M30,${y} H210`, W, 6)).join("")}</g>`,
    sh: 1,
    bg: IT(
      `<rect x="124" y="14" width="108" height="94" rx="6" fill="#2f5d50" stroke="#a9794a" stroke-width="5"/>` +
        dr("M138,98 V50 L194,98Z", W, 0.2, 3) +
        L("M138,90 H146 V98", W, 2) +
        L("M206,98 H228 M206,98 V54", W, 2) +
        dr("M208,96 Q217,38 226,96", Y, 1.4, 3) +
        `<text x="178" y="38" text-anchor="middle" font-size="14" fill="#fff" font-weight="500">a²+b²=c²</text>`,
    ),
    pr:
      T(34, 110, "π", K, 0, 30) +
      T(44, 160, "∑", G, 1, 28) +
      T(28, 206, "√", Y, 2, 26),
  },
  {
    n: "Nina",
    r: "Music Maker",
    b: "Eyes closed, singing every note.",
    t: "#fde2e2",
    fx: {
      k: 9,
      s: [
        [{ ...M.smile, ...CL, bLy: -3, bRy: -3, hr: 6 }, 800],
        [{ ...M.sing, ...CL, bLy: -4, bRy: -4, hr: -6 }, 800],
        [{ ...M.grin, bLy: -6, bRy: -6, hr: 6, hy: -2 }, 800],
        [{ ...M.sing, ...CL, hr: -6 }, 800],
      ],
    },
    bk: P(
      "M60,96 Q52,34 100,30 Q148,34 140,96 Q146,112 138,126 Q144,140 134,154 L122,148 Q126,136 120,126 L80,126 Q74,136 78,148 L66,154 Q56,140 62,126 Q54,112 60,96Z",
      ink,
    ),
    fr: P(
      "M64,90 Q62,48 100,42 Q138,48 136,90 Q128,62 108,56 L100,48 L92,56 Q72,62 64,90Z",
      ink,
    ),
    hx: IT(
      L("M62,84 Q58,24 100,24 Q142,24 138,84", ink, 6) +
        `<rect x="53" y="76" width="15" height="28" rx="6" fill="${B}" ${st}/><rect x="132" y="76" width="15" height="28" rx="6" fill="${B}" ${st}/>`,
      0.1,
    ),
    body:
      P(BD, K) +
      L("M96,188 Q104,208 120,210 Q136,208 144,188", ink, 2.5) +
      L("M106,188 Q120,204 134,188", ink, 2.5) +
      L("M72,232 V248 M168,232 V248", ink, 2.5),
    ch: 1,
    pr:
      T(30, 90, "♪", K, 0, 34) +
      T(210, 80, "♫", G, 0.7, 34) +
      T(24, 150, "♬", Y, 1.4, 30) +
      T(214, 150, "♪", B, 2, 30) +
      T(120, 40, "♫", K, 2.6, 28),
  },
  {
    n: "Max",
    r: "Game Master",
    b: "Tongue out, rage face, victory grin.",
    t: "#fff0c9",
    fx: {
      k: 9,
      s: [
        [
          {
            ...M.tongue,
            eL: 0.8,
            eR: 0.8,
            gx: -4,
            gy: 2,
            bLy: 3,
            bLr: 10,
            bRy: 3,
            bRr: -10,
            hr: -4,
            hy: 3,
          },
          1000,
        ],
        [
          {
            ...M.grin,
            gy: -3,
            eL: 1.2,
            eR: 1.2,
            bLy: -5,
            bRy: -5,
            hr: 3,
            hy: -4,
          },
          1000,
        ],
        [
          {
            ...M.frown,
            eL: 0.7,
            eR: 0.7,
            gx: 5,
            gy: 3,
            bLy: 3,
            bLr: 12,
            bRy: 3,
            bRr: -12,
            hr: 5,
          },
          900,
        ],
        [{ ...M.smirk, gx: -3, bLy: -3, bLr: -6, bRy: -1, hr: -3 }, 1000],
      ],
    },
    gl: glow(B),
    fr:
      P("M64,72 Q64,34 100,32 Q136,34 136,72Z", Y) +
      P("M60,72 Q100,58 142,66 Q148,72 142,80 Q100,72 60,82 Q54,76 60,72Z", W) +
      P("M64,80 L67,98 L72,86Z", ink) +
      P("M136,80 L133,98 L128,86Z", ink),
    nk: P(
      "M92,192 Q84,174 100,166 L108,172 L132,172 L140,166 Q156,174 148,192Z",
      Y,
    ),
    hx: IT(
      L("M60,86 Q56,26 100,24 Q144,26 140,86", ink, 7) +
        `<rect x="52" y="74" width="16" height="30" rx="7" fill="${K}" ${st}/><rect x="132" y="74" width="16" height="30" rx="7" fill="${K}" ${st}/>` +
        L("M56,102 Q58,124 80,126", ink, 3) +
        C(82, 126, 4, ink),
      0.1,
    ),
    body:
      P(BD, Y) +
      L("M100,187 Q120,214 140,187") +
      L("M114,204 V238 M126,204 V238") +
      L("M72,232 V248 M168,232 V248", ink, 2.5),
    sh: 1,
    pr:
      IT(
        `<rect x="70" y="8" width="100" height="14" rx="7" fill="#fff" ${st}/><rect class="xp" x="73" y="11" width="94" height="8" rx="4" fill="${G}"/>`,
      ) +
      `<text class="lv" x="204" y="64" fill="${Y}" stroke="${ink}" stroke-width="3" paint-order="stroke" font-size="15" font-weight="700" text-anchor="middle">LEVEL UP!</text>` +
      T(34, 100, "+100", G, 0, 18) +
      T(208, 130, "GG", K, 0.8, 22) +
      T(30, 160, "★", Y, 1.5, 24) +
      T(210, 190, "♥", K, 2.2, 22),
  },
  {
    n: "Zoe",
    r: "Bookworm",
    b: "Reads, gasps at the plot twist, then swoons.",
    t: "#e4ecfb",
    fx: {
      k: 6,
      s: [
        [{ ...M.smile, eL: 0.85, eR: 0.85, gx: -5, gy: 4, hy: 4 }, 1100],
        [{ ...M.flat, eL: 0.85, eR: 0.85, gx: 5, gy: 4, hy: 4 }, 1100],
        [{ ...M.o, eL: 1.3, eR: 1.3, gy: -2, bLy: -6, bRy: -6, hy: -3 }, 1200],
        [
          {
            ...M.grin,
            eL: 0.8,
            eR: 0.8,
            gx: -4,
            gy: 4,
            bLy: -3,
            bRy: -3,
            hr: -3,
            hy: 2,
          },
          1400,
        ],
      ],
    },
    bk: P(
      "M54,92 Q50,36 100,30 Q146,34 146,92 Q148,112 152,134 L142,144 L130,124 L70,124 L58,144 L48,134 Q52,112 54,92Z",
      ink,
    ),
    fr:
      P(
        "M62,88 Q58,46 100,38 Q142,44 138,88 Q134,66 124,58 Q112,68 100,60 Q84,72 62,88Z",
        ink,
      ) + glasses("#ef8a8a"),
    body:
      P(BD, W) +
      P(
        "M92,184 L102,184 Q104,206 120,208 Q136,206 138,184 L148,184 Q152,200 154,214 V248 H86 V214 Q88,198 92,184Z",
        K,
      ),
    sh: 1,
    pr:
      `<g class="rise">${P("M120,212 Q94,202 68,208 V246 Q94,240 120,248Z", W)}${P("M120,212 Q146,202 172,208 V246 Q146,240 120,248Z", "#fff3d6")}${L("M76,218 Q94,214 112,220 M76,230 Q94,226 112,232", B, 2)}
    ${[0, 0.8, 1.6].map((d) => `<path class="fp" d="M120,214 Q146,206 166,211 V242 Q146,238 120,246Z" fill="#fff" ${st} style="animation-delay:${d}s"/>`).join("")}</g>` +
      IT(
        `<g class="gl">${C(200, 56, 11, Y)}<rect x="195" y="67" width="10" height="7" rx="2" fill="${W}" ${st}/>${L("M200,32 V38 M180,40 L184,45 M220,40 L216,45 M176,58 H182 M218,58 H224", Y, 3)}</g>`,
        0.8,
      ) +
      T(32, 100, "✦", Y, 0.4, 22),
  },
  {
    n: "Ivy",
    r: "Green Thumb",
    b: "Follows every butterfly with her eyes.",
    t: "#dff0e0",
    fx: {
      k: 4,
      s: [
        [
          {
            ...M.smile,
            eL: 1.1,
            eR: 1.1,
            gx: 5,
            gy: -5,
            bLy: -4,
            bRy: -4,
            hr: 4,
            px: 0,
            py: 0,
          },
          1500,
        ],
        [
          {
            ...M.o,
            eL: 1.2,
            eR: 1.2,
            gx: 6,
            gy: 0,
            bLy: -5,
            bRy: -5,
            hr: 5,
            px: 12,
            py: 50,
          },
          1500,
        ],
        [
          {
            ...M.grin,
            eL: 1.1,
            eR: 1.1,
            gx: 5,
            gy: 5,
            bLy: -3,
            bRy: -3,
            hr: 4,
            px: -8,
            py: 90,
          },
          1500,
        ],
        [
          {
            ...M.smile,
            eL: 1.2,
            eR: 1.2,
            gx: 6,
            gy: -2,
            bLy: -4,
            bRy: -4,
            hr: 5,
            px: 6,
            py: 30,
          },
          1500,
        ],
      ],
    },
    bk: P(
      "M54,92 Q50,44 100,38 Q150,44 146,92 L146,150 L126,150 L126,120 L74,120 L74,150 L54,150Z",
      K,
    ),
    fr:
      P("M62,66 Q62,28 100,26 Q138,28 138,66Z", Y) +
      P("M54,70 Q100,60 146,70 Q150,77 142,79 Q100,71 58,79 Q50,77 54,70Z", Y),
    body:
      P(BD, ink) +
      P("M98,184 Q120,196 142,184 V248 H98Z", W) +
      L("M106,186 Q120,200 134,186", ink, 2.5) +
      [
        [0, -9],
        [9, -3],
        [5, 8],
        [-5, 8],
        [-9, -3],
      ]
        .map(([a, b]) => C(120 + a, 226 + b, 6, K))
        .join("") +
      C(120, 226, 4, W),
    ch: 1,
    pr: `<g class="rise">${P("M14,248 L18,226 H46 L50,248Z", "#e9967a")}<g class="grow">${L("M32,226 Q28,206 34,184", "#5bb98c", 4)}</g>
    <g class="pop" style="transition-delay:1s"><ellipse cx="20" cy="208" rx="10" ry="5" transform="rotate(-30 20 208)" fill="#5bb98c" ${st}/></g>
    <g class="pop" style="transition-delay:1.2s"><ellipse cx="46" cy="204" rx="9" ry="5" transform="rotate(30 46 204)" fill="#5bb98c" ${st}/></g>
    <g class="pop" style="transition-delay:1.4s">${[
      [0, -9],
      [9, -3],
      [5, 7],
      [-5, 7],
      [-9, -3],
    ]
      .map(([a, b]) => C(34 + a, 180 + b, 6, K))
      .join("")}${C(34, 180, 4.5, Y)}</g></g>
    <g transform="translate(200 60)"><g class="mv">${IT(`<g class="wg"><ellipse cx="-7" cy="-3" rx="8" ry="6" fill="${B}" ${st}/><ellipse cx="7" cy="-3" rx="8" ry="6" fill="${B}" ${st}/></g>${L("M0,-6 V6", ink, 2)}`, 0.2)}</g></g>`,
  },
  {
    n: "Sam",
    r: "Coffee Chief",
    b: "Sniffs, sips, sighs, and wakes right up.",
    t: "#f4e6da",
    fx: {
      k: 5,
      s: [
        [{ ...M.smile, ...CL, bLy: -3, bRy: -3, hr: -4, hy: -3 }, 1700],
        [{ ...M.o, ...CL, hr: -6, hy: -4 }, 1200],
        [{ ...M.grin, ...CL, bLy: -4, bRy: -4, hr: 3 }, 1400],
        [{ ...M.smirk, eL: 1.3, eR: 1.3, bLy: -6, bRy: -6 }, 1300],
      ],
    },
    beard: 1,
    fr:
      P("M62,74 Q62,34 100,30 Q138,34 138,74Z", ink) +
      `<rect x="58" y="64" width="84" height="16" rx="8" fill="${S2}" ${st}/>` +
      L(
        "M72,67 v10 M84,67 v10 M96,67 v10 M108,67 v10 M120,67 v10 M130,67 v10",
        "#4a4f8c",
        2,
      ) +
      P(
        "M64,92 Q60,132 84,142 Q100,150 116,142 Q140,132 136,92 Q131,108 122,112 Q112,104 100,106 Q88,104 78,112 Q69,108 64,92Z",
        ink,
      ),
    body: P(BD, S2),
    sh: 1,
    pr:
      `<g class="rise">${P("M98,206 H142 V240 Q142,248 134,248 H106 Q98,248 98,240Z", W)}${L("M142,214 Q160,214 160,226 Q160,238 142,236", ink, 4)}<rect x="101" y="209" width="38" height="8" fill="#b9805a"/>` +
      [106, 120, 134]
        .map((x, i) =>
          L(
            `M${x},204 q-7,-9 0,-18 q7,-9 0,-18 q-7,-9 0,-18`,
            "#cfd3e6",
            4,
            `pathLength="100" class="wisp" style="animation-delay:${i * 0.7}s"`,
          ),
        )
        .join("") +
      `</g>`,
  },
  {
    n: "Kai",
    r: "Photographer",
    b: "Winks to focus, grins when he nails the shot.",
    t: "#fbe3ea",
    fx: {
      k: 6,
      s: [
        [
          { ...M.flat, eR: 0.08, gx: 4, bLy: 2, bLr: 8, hr: -4, lk: 0.15 },
          1100,
        ],
        [{ ...M.flat, eR: 0.08, gx: 2, bLy: 2, bLr: 8, hr: -3, lk: 1 }, 1000],
        [
          {
            ...M.grin,
            eL: 1.2,
            eR: 1.2,
            bLy: -4,
            bRy: -4,
            hr: 2,
            hy: -3,
            lk: 1,
            hook: 1,
          },
          1300,
        ],
        [
          { ...M.smile, eL: 0.9, eR: 0.9, gx: -4, gy: 4, hr: 3, hy: 3, lk: 1 },
          1200,
        ],
        [
          { ...M.smirk, gx: 5, gy: -2, bLy: -3, bRy: -3, hr: -3, lk: 0.3 },
          1200,
        ],
      ],
    },
    bk: P(
      "M58,94 Q52,38 100,30 Q148,38 142,94 L140,130 L126,126 L74,126 L60,130Z",
      ink,
    ),
    fr:
      P(
        "M62,92 Q58,46 100,40 Q142,46 138,92 Q134,68 120,60 Q104,70 84,62 Q66,72 62,92Z",
        ink,
      ) +
      P("M64,100 L66,128 L74,124 L70,102Z", ink) +
      P("M136,100 L134,128 L126,124 L130,102Z", ink) +
      glasses("#ef8a8a"),
    body:
      P(BD, Y) +
      '<path d="M96,186 Q120,200 144,186 L140,196 Q120,210 100,196Z" fill="#1f2340"/>' +
      L("M98,192 L120,214 L142,192", ink, 2.5) +
      L("M72,232 V248 M168,232 V248", ink, 2.5),
    sh: 1,
    pr:
      `<g class="rise"><g class="cam">${P("M72,222 Q72,214 80,214 H160 Q168,214 168,222 V244 Q168,248 162,248 H78 Q72,248 72,244Z", ink)}<rect x="98" y="205" width="28" height="11" rx="3" fill="${ink}"/><rect class="gl" x="142" y="220" width="14" height="8" rx="2" fill="${Y}"/>
    <circle cx="116" cy="231" r="14" fill="#2c3358" stroke="${W}" stroke-width="3"/><circle cx="116" cy="231" r="7" fill="#3b4678"/><circle class="lr" cx="116" cy="231" r="10.5" fill="none" stroke="${G}" stroke-width="2" stroke-dasharray="5 5"/><circle cx="111" cy="226" r="2.5" fill="${W}"/></g></g>` +
      IT(
        `<g class="lock" style="color:#f29a9a">${L("M68,70 V54 H84 M172,70 V54 H156 M68,162 V178 H84 M172,162 V178 H156", "currentColor", 4)}</g>`,
      ) +
      `<path class="flash" d="M149,204 L153,220 L169,224 L153,228 L149,244 L145,228 L129,224 L145,220Z" fill="${Y}" ${st}/>`,
  },
];

const CHK = `<ellipse cx="79" cy="102" rx="6.5" ry="4.2" fill="#f4a3a3"/><ellipse cx="121" cy="102" rx="6.5" ry="4.2" fill="#f4a3a3"/>`;
const EAR =
  `<ellipse cx="66" cy="92" rx="6" ry="9" fill="#fff" ${st}/><ellipse cx="134" cy="92" rx="6" ry="9" fill="#fff" ${st}/>` +
  L("M64,87 q-3,5 0,10", ink, 2) +
  L("M136,87 q3,5 0,10", ink, 2);
const face = (
  c,
  i,
) => `<svg viewBox="0 0 240 252" class="av c${i}" aria-hidden="true">
<g class="pr">${c.bg || ""}</g>
<g class="head"><g transform="translate(20 28)">${c.bk || ""}</g></g>
${c.nk || ""}
<rect x="107" y="148" width="26" height="46" fill="#fff" ${st}/>${c.sh ? '<path d="M113,158 H133 V168 Q124,172 113,161Z" fill="#f4b0aa"/>' : ""}
${c.body}<path d="M36,248 H204" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
<g class="head"><g transform="translate(20 28)">
${EAR}
<ellipse cx="100" cy="88" rx="34" ry="42" fill="#fff" ${st}/>${c.gl || ""}
${c.ch ? CHK : ""}
<g class="gz"><g class="blk"><g class="eyL"><circle cx="87" cy="90" r="2.9" fill="${ink}"/></g><g class="eyR"><circle cx="113" cy="90" r="2.9" fill="${ink}"/></g></g></g>
${L("M101,86 L99,101 Q101,104 105,102", ink, 2.2)}
${c.fr}
<g class="bl2">${L("M79,76 q8,-5 16,0", ink, 2.5)}</g><g class="br2">${L("M105,76 q8,-5 16,0", ink, 2.5)}</g>
<g${c.beard ? ' transform="translate(0 14)"' : ""}><path class="mp" d="" fill="#d9626d" fill-opacity="0" stroke="${c.beard ? W : ink}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><ellipse class="tgm" rx="5" ry="4" fill="#e8737f" stroke="${ink}" stroke-width="2"/></g>
${c.hx || ""}</g></g>
<g class="pr">${c.pr}</g></svg>`;

document.getElementById("grid").innerHTML = TEAM.map(
  (c, i) =>
    `<article class="card" tabindex="0"><div class="stage" style="--t:${c.t}">${face(c, i)}</div><h3>${c.n}</h3><p class="role">${c.r}</p><p class="blurb">${c.b}</p></article>`,
).join("");
const hoverable = matchMedia("(hover:hover)").matches;
document.querySelectorAll(".card").forEach((c, i) => {
  const fc = Face(c, TEAM[i].fx),
    set = (v) => {
      c.classList.toggle("on", v);
      v ? fc.start() : fc.stop();
    };
  c.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") set(true);
  });
  c.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") set(false);
  });
  c.addEventListener("focus", () => set(true));
  c.addEventListener("blur", () => set(false));
  c.addEventListener("click", () => {
    if (!hoverable) set(!c.classList.contains("on"));
  });
});
