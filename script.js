(function () {
  var INK = "#232649", PINK = "#f4958f", CHEEK = "#f9bcb6", YEL = "#f8c24d", SKIN = "#ffffff", BLUE = "#5b6cf0";
  var BODY = "M24 180 C24 152 44 142 78 138 L122 138 C156 142 176 152 176 180Z";
  var NECK = '<path d="M86 114 L86 142 Q100 154 114 142 L114 114Z" fill="' + SKIN + '" class="o"/>';
  var PATCH = '<path d="M84 134 L116 134 L116 142 Q100 158 84 142Z" fill="' + SKIN + '"/><path d="M83 140 Q100 158 117 140" fill="none" class="o"/>';
  var p = function (d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '" class="o"' + (extra || '') + '/>'; };
  var circ = function (x, y, r, fill, extra) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" class="o"' + (extra || '') + '/>'; };
  var dl = function (s) { return ' style="animation-delay:' + s + 's"'; };

  /* ---------- bodies ---------- */
  var bodies = {
    tee: function (c) { return NECK + p(BODY, c) + PATCH + '<path d="M80 139 Q100 160 120 139" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>'; },
    jacket: function (outer, inner) { return NECK + p(BODY, outer) + '<path d="M82 139 Q100 156 118 139 L112 180 L88 180Z" fill="' + inner + '" class="o"/>' + '<path d="M84 134 L116 134 L116 142 Q100 156 84 142Z" fill="' + SKIN + '"/><path d="M83 140 Q100 156 117 140" fill="none" class="o"/>'; },
    stripes: function (i) { var s = '';[146, 157, 168].forEach(function (y) { s += '<rect x="20" y="' + y + '" width="160" height="5.5" fill="' + INK + '"/>'; }); return NECK + '<defs><clipPath id="cp' + i + '"><path d="' + BODY + '"/></clipPath></defs>' + p(BODY, '#fff') + '<g clip-path="url(#cp' + i + ')">' + s + '</g><path d="' + BODY + '" fill="none" class="o"/>' + PATCH; },
    hoodie: function (c) { return NECK + p(BODY, c) + p("M70 138 Q100 176 130 138 Q136 152 126 160 Q100 180 74 160 Q64 152 70 138Z", c) + '<path d="M84 134 L116 134 L116 142 Q100 158 84 142Z" fill="' + SKIN + '"/><path d="M80 141 Q100 160 120 141" fill="none" class="o"/><path d="M91 160 L90 176 M109 160 L110 176" class="thin"/>'; },
    polo: function (c) { return NECK + p(BODY, c) + PATCH + p("M80 139 L98 154 L82 162 L68 148Z", c) + p("M120 139 L102 154 L118 162 L132 148Z", c) + '<path d="M100 156 L100 180" class="thin"/><circle cx="100" cy="166" r="1.8" fill="' + INK + '"/>'; },
    tank: function (c) { return NECK + p(BODY, SKIN) + '<path d="M84 134 L116 134 L116 142 Q100 158 84 142Z" fill="' + SKIN + '"/>' + p("M64 180 L70 152 L84 140 Q100 166 116 140 L130 152 L136 180Z", c); },
    vneck: function (c) { return NECK + p(BODY, c) + '<path d="M82 136 L118 136 L100 164Z" fill="' + SKIN + '"/><path d="M80 139 L100 164 L120 139" fill="none" class="o"/>'; },
    flower: function () {
      var petals = '';
      for (var a = 0; a < 5; a++) { var r = a * 72 * Math.PI / 180; petals += circ((Math.sin(r) * 6).toFixed(1), (-Math.cos(r) * 6).toFixed(1), 4.4, PINK, ' stroke-width="2"'); }
      return bodies.jacket('#2a2d4f', '#ffffff') + '<g transform="translate(100 160)"><g class="fl">' + petals + '<circle r="3" fill="#fff"/></g></g>';
    }
  };

  /* ---------- face ---------- */
  var face = function (o) {
    o = o || {};
    var s = circ(66, 92, 7, SKIN) + circ(134, 92, 7, SKIN);
    s += p("M66 84 C66 50 134 50 134 84 C134 120 118 132 100 132 C82 132 66 120 66 84Z", SKIN);
    if (o.underHair) s += '<path d="M66 84 C64 52 136 52 134 84 C126 70 112 64 100 64 C88 64 74 70 66 84Z" fill="' + INK + '" class="o"/>';
    if (o.cheeks) s += '<circle cx="79" cy="109" r="6.5" fill="' + CHEEK + '"/><circle cx="121" cy="109" r="6.5" fill="' + CHEEK + '"/>';
    if (!o.noBrows) s += '<path d="M78 86 Q85 82 92 86 M108 86 Q115 82 122 86" class="thin"/>';
    s += '<g class="look"><g class="blink"><ellipse cx="85" cy="96" rx="2.8" ry="3.2" fill="' + INK + '"/><ellipse cx="115" cy="96" rx="2.8" ry="3.2" fill="' + INK + '"/></g></g>';
    s += '<path d="M100 100 L97.5 108 Q100 110 103 108" class="thin" stroke-width="2"/>';
    if (!o.beard) s += '<path d="' + (o.mouth || "M92 118 Q100 124 108 118") + '" class="thin"/>';
    return s;
  };
  var lenses = '<circle cx="84" cy="96" r="11.5" fill="rgba(255,255,255,.35)" stroke="#f08a86" stroke-width="3"/><circle cx="116" cy="96" r="11.5" fill="rgba(255,255,255,.35)" stroke="#f08a86" stroke-width="3"/><path d="M95.5 95 L104.5 95" stroke="#f08a86" stroke-width="3" fill="none" stroke-linecap="round"/>';
  var glassesPlain = function () { return '<g>' + lenses + '</g>'; };
  var glassesShine = function () {
    return '<g class="gl">' + lenses + '<defs><clipPath id="lensL"><circle cx="84" cy="96" r="10"/></clipPath><clipPath id="lensR"><circle cx="116" cy="96" r="10"/></clipPath></defs>' +
      '<g clip-path="url(#lensL)"><g class="shine"><polygon points="79,84 86,84 92,108 85,108" fill="#fff" opacity=".9"/></g></g>' +
      '<g clip-path="url(#lensR)"><g class="shine"><polygon points="111,84 118,84 124,108 117,108" fill="#fff" opacity=".9"/></g></g></g>';
  };
  var beard = function () { return p("M66 98 C66 142 134 142 134 98 C128 114 116 108 100 112 C84 108 72 114 66 98Z", INK) + '<path d="M92 119 Q100 125 108 119" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; };
  var curls = function (pts, r, c) { return pts.map(function (q, i) { return '<circle class="curl o" cx="' + q[0] + '" cy="' + q[1] + '" r="' + r + '" fill="' + c + '"' + dl((i * 0.09).toFixed(2)) + '/>'; }).join(''); };
  var star = function (x, y, c, d) { return '<g transform="translate(' + x + ' ' + y + ')"><path class="spark o" d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9Z" fill="' + c + '"' + dl(d) + '/></g>'; };
  var glyph = function (t, x, y, d) { return '<text class="glyph" x="' + x + '" y="' + y + '"' + dl(d) + '>' + t + '</text>'; };
  var noteShape = function (x, y, d) { return '<g transform="translate(' + x + ' ' + y + ')"><g class="note"' + dl(d) + '><ellipse cx="0" cy="0" rx="4.8" ry="3.5" transform="rotate(-20)" fill="' + INK + '"/><path d="M4 -1.5 L4 -17 Q10 -14 10.5 -8" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/></g></g>'; };

  /* ---------- scenes (extra effects drawn in front of the figure) ---------- */
  var fxIdea = (function () {
    var rays = '';
    [-180, -135, -90, -45, 0].forEach(function (a) {
      var r = a * Math.PI / 180;
      rays += '<line class="ray" x1="' + (Math.cos(r) * 13).toFixed(1) + '" y1="' + (Math.sin(r) * 13).toFixed(1) + '" x2="' + (Math.cos(r) * 18).toFixed(1) + '" y2="' + (Math.sin(r) * 18).toFixed(1) + '" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
    });
    return '<g transform="translate(100 26)"><g class="bulb">' + rays + '<circle cx="0" cy="0" r="8.5" fill="' + YEL + '" class="o"/><rect x="-4.5" y="8" width="9" height="5.5" rx="1.5" fill="#fff" class="o"/></g></g>';
  })();

  var people = [
    {
      n: "Emma White", r: "Creative director", tint: "#fde1de", cheeks: 1,
      body: bodies.tee("#272a4d"),
      back: p("M60 92 C56 44 144 44 140 92 L140 132 Q140 138 134 138 L120 138 L120 100 L80 100 L80 138 L66 138 Q60 138 60 132Z", PINK),
      front: p("M64 88 C60 46 140 46 136 88 C126 80 118 66 112 60 C104 72 84 80 64 88Z", PINK),
      fx: star(34, 52, YEL, 0) + star(164, 46, PINK, .5) + star(158, 112, YEL, 1) + star(40, 120, PINK, .3) + star(110, 22, YEL, .8)
    },
    {
      n: "Tomas Reyes", r: "Engineering lead", tint: "#dfe3fb", beard: 1,
      body: bodies.jacket("#272a4d", "#f4958f"),
      back: "",
      front: p("M64 84 C54 48 84 34 108 38 C132 34 146 54 136 84 C132 68 122 60 106 60 C90 58 70 66 64 84Z", INK) + beard(),
      fx: glyph("&lt;/&gt;", 22, 76, 0) + glyph("{ }", 152, 64, .5) + glyph("01", 156, 100, 1) + glyph("=&gt;", 24, 108, .3) +
        '<g class="lap"><rect x="54" y="138" width="92" height="42" rx="5" fill="#dfe3fb" class="o"/><circle cx="100" cy="159" r="5.5" fill="' + PINK + '" class="o"/></g>'
    },
    {
      n: "Emily Smith", r: "Illustrator", tint: "#fdeec2",
      body: bodies.stripes(3),
      back: curls([[66, 66], [82, 48], [102, 43], [122, 49], [137, 66], [144, 86], [56, 86]], 17, YEL),
      front: curls([[80, 65], [100, 59], [120, 65]], 13, YEL),
      fx: '<path class="sq" d="M16 34 q10 -16 20 0 t20 0 t20 0" stroke="' + PINK + '" stroke-width="5"/>' +
        '<circle class="splat" cx="164" cy="42" r="6" fill="' + PINK + '"' + dl(.1) + '/><circle class="splat" cx="150" cy="62" r="4" fill="' + BLUE + '"' + dl(.25) + '/><circle class="splat" cx="170" cy="76" r="3.5" fill="' + YEL + '"' + dl(.4) + '/><circle class="splat" cx="36" cy="132" r="5" fill="' + BLUE + '"' + dl(.55) + '/>'
    },
    {
      n: "Lena Hartmann", r: "Product designer", tint: "#fde1de", cheeks: 1, mouth: "M93 118 Q100 122 107 118",
      body: bodies.polo("#f4958f"),
      back: p("M64 90 C60 44 140 44 136 90 C141 122 139 150 132 162 L118 162 L118 100 L82 100 L82 162 L68 162 C61 150 59 122 64 90Z", INK),
      front: p("M64 90 C58 48 142 48 136 90 C128 76 112 64 100 56 C88 66 72 78 64 90Z", INK),
      fx: '<g class="sel"><rect x="54" y="44" width="92" height="96" fill="none" stroke="' + BLUE + '" stroke-width="2"/>' +
        [[54, 44], [146, 44], [54, 140], [146, 140], [100, 44], [100, 140], [54, 92], [146, 92]].map(function (c) { return '<rect x="' + (c[0] - 4) + '" y="' + (c[1] - 4) + '" width="8" height="8" fill="#fff" stroke="' + BLUE + '" stroke-width="2"/>'; }).join('') +
        '<rect x="70" y="20" width="60" height="16" rx="4" fill="' + BLUE + '"/><text x="100" y="31.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff" font-family="ui-monospace, Menlo, Consolas, monospace">92 × 96</text></g>' +
        '<g class="cur"><path d="M0 0 L0 15 L4.5 11.5 L7.5 18 L10 17 L7 10.5 L12.5 10.5Z" fill="' + INK + '" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></g>'
    },
    {
      n: "Ethan Taylor", r: "Front-end engineer", tint: "#fdeec2", noBrows: 1, underHair: 1,
      body: bodies.hoodie(YEL),
      back: "",
      front: '<g class="cap">' + p("M63 80 C60 40 140 40 137 80 Q100 71 63 80Z", YEL) + '<circle cx="100" cy="43" r="3" fill="' + INK + '"/>' + p("M58 80 Q100 68 142 80 L142 87 Q100 78 58 87Z", YEL) + '</g>',
      fx: '<circle class="ring" cx="100" cy="64" r="5" fill="none" stroke="' + INK + '" stroke-width="2.5"/>'
    },
    {
      n: "Jessy Wiliams", r: "Researcher", tint: "#dfe3fb", cheeks: 1,
      body: bodies.tank(PINK),
      back: p("M60 92 C56 44 144 44 140 92 L140 122 Q140 128 134 128 L122 128 L122 100 L78 100 L78 128 L66 128 Q60 128 60 122Z", INK),
      front: p("M63 86 C58 46 142 46 137 86 Q120 72 100 66 Q80 72 63 86Z", INK) + glassesShine(),
      fx: fxIdea
    },
    {
      n: "Sofia Lindqvist", r: "Brand strategist", tint: "#fde1de", cheeks: 1, noBrows: 1,
      body: bodies.flower(),
      back: p("M62 90 C58 44 142 44 138 90 L144 172 L120 172 L120 112 L80 112 L80 172 L56 172Z", PINK),
      front: '<g class="hat">' + p("M62 80 C58 34 142 34 138 80 Q100 70 62 80Z", YEL) + p("M55 82 Q100 68 145 82 Q148 90 140 90 Q100 79 60 90 Q52 90 55 82Z", YEL) + '</g>',
      fx: [0, .8, 1.6].map(function (d) { return '<g transform="translate(100 160)"><ellipse class="petal" cx="0" cy="0" rx="4" ry="2.4" fill="' + PINK + '" stroke="' + INK + '" stroke-width="1.6"' + dl(d) + '/></g>'; }).join('')
    },
    {
      n: "Marcus Bell", r: "Backend engineer", tint: "#fdeec2", beard: 1,
      body: bodies.tee("#272a4d"),
      back: "",
      front: p("M64 78 C62 36 138 36 136 78Z", INK) + circ(100, 33, 6, "#343863") + p("M61 80 Q61 67 72 67 L128 67 Q139 67 139 80 Q139 89 130 89 L70 89 Q61 89 61 80Z", "#343863") + beard(),
      fx: noteShape(160, 92, 0) + noteShape(150, 60, .9) +
        [[14, 18], [24, 30], [34, 14], [44, 24]].map(function (b, i) { return '<rect class="bar" x="' + (b[0] + 4) + '" y="' + (122 - b[1]) + '" width="7" height="' + b[1] + '" fill="' + PINK + '" stroke="' + INK + '" stroke-width="2"' + dl((i * .13).toFixed(2)) + '/>'; }).join('')
    },
    {
      n: "Harry Evans", r: "Motion designer", tint: "#dfe3fb",
      body: bodies.vneck(YEL),
      back: "",
      front: p("M62 92 C52 44 90 34 108 38 C136 36 148 64 138 92 C134 72 124 64 108 62 C88 62 68 72 62 92Z", INK) + glassesPlain(),
      fx: [[34, 108, 34], [46, 118, 24], [154, 108, 34], [166, 118, 24]].map(function (l, i) { return '<line class="spd" x1="' + l[0] + '" y1="' + l[1] + '" x2="' + l[0] + '" y2="' + (l[1] + l[2]) + '" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"' + dl((i * .03).toFixed(2)) + '/>'; }).join('') +
        '<g class="curve"><rect x="14" y="14" width="42" height="42" rx="6" fill="#fff" stroke="' + INK + '" stroke-width="2.2"/><path d="M20 50 C34 50 30 20 50 20" stroke="' + BLUE + '" stroke-width="3" class="cv"/><circle cx="20" cy="50" r="2.6" fill="' + INK + '"/><circle cx="50" cy="20" r="2.6" fill="' + INK + '"/></g>'
    }
  ];

  /* ---------- build ---------- */
  var grid = document.getElementById("grid");
  var cards = [];
  people.forEach(function (m, i) {
    var card = document.createElement("article");
    card.className = "card a" + (i + 1);
    card.tabIndex = 0;
    card.setAttribute("aria-label", m.n + ", " + m.r);
    card.style.setProperty("--tint", m.tint);
    var inner = '<g class="all"><g class="head"><g class="hairb">' + m.back + '</g></g><g class="bd">' + m.body + '</g><g class="head">' + face(m) + m.front + '</g></g>' + (m.fx || '');
    card.innerHTML =
      '<div class="stage"><div class="shadow"></div><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + inner + '</svg></div>' +
      '<div class="meta"><h3>' + m.n + '</h3><p>' + m.r + '</p></div>';
    grid.appendChild(card);
    cards.push(card);

    function on() { card.classList.add("go"); }
    function off() { card.classList.remove("go"); }
    card.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") on(); });
    card.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") off(); });
    card.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") { cards.forEach(function (c) { if (c !== card) c.classList.remove("go"); }); card.classList.toggle("go"); }
    });
    card.addEventListener("focus", function () { try { if (card.matches(":focus-visible")) on(); } catch (err) { on(); } });
    card.addEventListener("blur", off);
  });
})();