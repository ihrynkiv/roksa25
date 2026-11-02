/* 🐱 Kitty theme: pink cartoon world with cats, a cake and hearts. */
(function () {
  var INK = "#3d2142", PINK = "#ff8fc1", HOT = "#ff5c9d", CREAM = "#fff6fb", BUTTER = "#ffe08a", LILAC = "#cdb4ff", MINT = "#a8e6cf";
  var FURS = {
    ginger: { fur: "#ffb26b", stripe: "#e8893a", ear: "#ffc7d9" },
    grey: { fur: "#c9c3d6", stripe: "#a69fb8", ear: "#ffc7d9" },
    black: { fur: "#3a3142", stripe: null, ear: "#ff9cc0", eye: "#ffe08a" },
    white: { fur: "#fffaf5", stripe: null, ear: "#ffc7d9" }
  };
  var SW = 6; // outline width

  function head(f, opts) {
    opts = opts || {};
    var eyeFill = f.eye || INK;
    var s = "";
    // ears
    s += '<path d="M42 92 L50 18 L98 58 Z" fill="' + f.fur + '" stroke="' + INK + '" stroke-width="' + SW + '" stroke-linejoin="round"/>';
    s += '<path d="M158 92 L150 18 L102 58 Z" fill="' + f.fur + '" stroke="' + INK + '" stroke-width="' + SW + '" stroke-linejoin="round"/>';
    s += '<path d="M56 74 L58 38 L82 60 Z" fill="' + f.ear + '"/><path d="M144 74 L142 38 L118 60 Z" fill="' + f.ear + '"/>';
    // face
    s += '<ellipse cx="100" cy="112" rx="76" ry="62" fill="' + f.fur + '" stroke="' + INK + '" stroke-width="' + SW + '"/>';
    if (f.stripe) s += '<g stroke="' + f.stripe + '" stroke-width="7" stroke-linecap="round"><path d="M100 54 L100 74"/><path d="M84 57 L88 74"/><path d="M116 57 L112 74"/></g>';
    // eyes
    if (opts.sleep) {
      s += '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"><path d="M58 112 Q70 122 82 112"/><path d="M118 112 Q130 122 142 112"/></g>';
    } else {
      s += '<g class="kt-eyes"><ellipse cx="70" cy="110" rx="10" ry="14" fill="' + eyeFill + '"' + (f.eye ? ' stroke="' + INK + '" stroke-width="3"' : "") + '/>' +
        '<ellipse cx="130" cy="110" rx="10" ry="14" fill="' + eyeFill + '"' + (f.eye ? ' stroke="' + INK + '" stroke-width="3"' : "") + '/>' +
        (f.eye ? '<ellipse cx="70" cy="111" rx="3.5" ry="10" fill="' + INK + '"/><ellipse cx="130" cy="111" rx="3.5" ry="10" fill="' + INK + '"/>' : "") +
        '<circle cx="74" cy="104" r="4" fill="#fff"/><circle cx="134" cy="104" r="4" fill="#fff"/></g>';
    }
    // cheeks, nose, mouth, whiskers
    s += '<ellipse cx="52" cy="136" rx="13" ry="8" fill="#ff8fb3" opacity=".55"/><ellipse cx="148" cy="136" rx="13" ry="8" fill="#ff8fb3" opacity=".55"/>';
    s += '<path d="M92 126 L108 126 L100 135 Z" fill="#ff7aa8" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>';
    s += '<path d="M100 135 Q100 144 90 145 M100 135 Q100 144 110 145" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
    s += '<g stroke="' + INK + '" stroke-width="3" stroke-linecap="round"><path d="M38 126 L8 120"/><path d="M38 134 L6 138"/><path d="M162 126 L192 120"/><path d="M162 134 L194 138"/></g>';
    return s;
  }
  function paw(cx, cy, fur) {
    return '<g><ellipse cx="' + cx + '" cy="' + cy + '" rx="25" ry="17" fill="' + fur + '" stroke="' + INK + '" stroke-width="' + SW + '"/>' +
      '<path d="M' + (cx - 8) + " " + (cy + 4) + " l0 9 M" + (cx + 8) + " " + (cy + 4) + ' l0 9" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/></g>';
  }
  function peekCat(kind) {
    var f = FURS[kind];
    return '<svg viewBox="0 0 200 210" class="kt-peek-svg"><g class="kt-head">' + head(f) + "</g>" + paw(58, 186, f.fur) + paw(142, 186, f.fur) + "</svg>";
  }
  function sleepCat(kind) {
    var f = FURS[kind];
    return '<svg viewBox="0 0 300 170">' +
      '<ellipse cx="170" cy="118" rx="112" ry="48" fill="' + f.fur + '" stroke="' + INK + '" stroke-width="' + SW + '"/>' +
      (f.stripe ? '<g stroke="' + f.stripe + '" stroke-width="8" stroke-linecap="round"><path d="M170 72 L176 92"/><path d="M200 74 L204 94"/><path d="M230 82 L230 100"/></g>' : "") +
      '<path d="M270 130 C290 170 120 175 70 152" fill="none" stroke="' + INK + '" stroke-width="28" stroke-linecap="round"/>' +
      '<path d="M270 130 C290 170 120 175 70 152" fill="none" stroke="' + f.fur + '" stroke-width="16" stroke-linecap="round"/>' +
      '<g transform="translate(-2 18) scale(.72)">' + head(f, { sleep: true }) + "</g>" +
      "</svg>";
  }
  function cake() {
    var sprink = "";
    var cols = [HOT, MINT, BUTTER, LILAC, "#fff"];
    for (var i = 0; i < 16; i++) {
      var x = 50 + (i * 37) % 150, y = 172 + (i * 13) % 34;
      sprink += '<rect x="' + x + '" y="' + y + '" width="11" height="4.5" rx="2.2" fill="' + cols[i % cols.length] + '" transform="rotate(' + ((i * 47) % 180) + " " + (x + 5) + " " + (y + 2) + ')"/>';
    }
    function candle(x, ch) {
      return '<g class="kt-candle" transform="translate(' + x + ' 0)">' +
        '<path class="kt-flame" d="M0 22 C-9 34 -8 46 0 50 C8 46 9 34 0 22Z" fill="#ffb02e" stroke="' + INK + '" stroke-width="3"/>' +
        '<path d="M0 36 C-3 41 -3 46 0 48 C3 46 3 41 0 36Z" fill="#fff3b0"/>' +
        '<text x="0" y="112" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="62" fill="' + BUTTER + '" stroke="' + INK + '" stroke-width="5" paint-order="stroke">' + ch + "</text></g>";
    }
    var age = String(BIRTHDAY.age);
    return '<svg viewBox="0 0 240 250">' +
      '<ellipse cx="120" cy="232" rx="110" ry="14" fill="#fff" stroke="' + INK + '" stroke-width="' + SW + '"/>' +
      '<rect x="28" y="150" width="184" height="80" rx="16" fill="' + PINK + '" stroke="' + INK + '" stroke-width="' + SW + '"/>' +
      '<path d="M28 168 Q28 150 46 150 L194 150 Q212 150 212 168 L212 178 Q200 192 188 178 Q176 196 162 180 Q148 194 134 180 Q120 198 106 180 Q92 194 78 180 Q64 196 52 180 Q40 192 28 178Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="4"/>' +
      sprink +
      '<rect x="58" y="104" width="124" height="52" rx="12" fill="' + LILAC + '" stroke="' + INK + '" stroke-width="' + SW + '"/>' +
      '<path d="M58 118 Q58 104 72 104 L168 104 Q182 104 182 118 L182 124 Q172 136 162 124 Q152 138 140 124 Q128 138 116 124 Q104 138 92 124 Q80 136 70 124 Q62 132 58 124Z" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="4"/>' +
      candle(age.length > 1 ? 96 : 120, age[0]) + (age.length > 1 ? candle(144, age[1]) : "") +
      "</svg>";
  }
  function heartSVG(fill) {
    return '<svg viewBox="0 0 100 90"><path d="M50 84 C10 58 2 34 14 18 C26 2 46 8 50 24 C54 8 74 2 86 18 C98 34 90 58 50 84Z" fill="' + fill + '" stroke="' + INK + '" stroke-width="6" stroke-linejoin="round"/></svg>';
  }

  window.THEME = {
    slots: 4,
    setup: function () {
      FX.configure({
        fireflyCount: 0,
        fall: ["heart", "heart", "paw", "confetti"],
        confettiColors: [HOT, PINK, LILAC, MINT, BUTTER, "#ffffff"],
        fwColors: [HOT, PINK, LILAC, "#7fd8be", "#ffc94d"],
        heartColors: [HOT, "#ff9cc0"],
        fwStyle: "flat"
      });

      var d = document.getElementById("decor");
      d.innerHTML =
        '<div class="kt-heart h1">' + heartSVG(HOT) + "</div>" +
        '<div class="kt-heart h2">' + heartSVG(LILAC) + "</div>" +
        '<div class="kt-heart h3">' + heartSVG(BUTTER) + "</div>" +
        '<div class="kt-heart h4">' + heartSVG(MINT) + "</div>" +
        '<div class="kt-peek p1">' + peekCat("ginger") + "</div>" +
        '<div class="kt-peek p2">' + peekCat("black") + "</div>" +
        '<div class="kt-peek p3">' + peekCat("grey") + "</div>" +
        '<div class="kt-ground"></div>' +
        '<div class="kt-sleep">' + sleepCat("white") + '<span class="z z1">z</span><span class="z z2">z</span><span class="z z3">z</span></div>' +
        '<div class="kt-bubble"><span></span></div>';

      // countdown: the clock becomes a cat face holding the number
      var wrap = document.querySelector("#countdown .cd-wrap");
      var deco = document.createElement("div");
      deco.className = "kt-cdcat";
      deco.innerHTML = '<svg viewBox="0 0 200 200" preserveAspectRatio="none">' +
        '<path d="M28 52 L30 -10 L78 22 Z" fill="#fff" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M172 52 L170 -10 L122 22 Z" fill="#fff" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M40 38 L41 6 L64 22 Z" fill="#ffc7d9"/><path d="M160 38 L159 6 L136 22 Z" fill="#ffc7d9"/></svg>' +
        '<div class="kt-paws"><svg viewBox="0 0 200 40">' + paw(58, 20, "#fff") + paw(142, 20, "#fff") + "</svg></div>";
      wrap.insertBefore(deco, wrap.firstChild);

      var cel = document.getElementById("celebrate");
      var c = document.createElement("div");
      c.className = "kt-cake";
      c.innerHTML = cake();
      cel.querySelector(".center").appendChild(c);

      var nm = document.querySelector(".idle-name");
      nm.classList.add("chars");
      nm.innerHTML = Array.from(nm.textContent).map(function (ch, i) { return '<span style="--i:' + i + '">' + ch + "</span>"; }).join("");

      document.querySelector(".whisper").textContent = "котики вже готують сюрприз…";
      document.querySelector("#countdown .cd-label").textContent = "мяу-відлік";
      document.querySelector(".seal span").textContent = "мяу";
      this.onState("idle");
    },
    onState: function (s) {
      var b = document.querySelector(".kt-bubble span");
      if (!b) return;
      b.textContent = s === "celebrate" ? "МЯУ! З днем народження!" : s === "countdown" ? "мяу?! вже?!" : "мрр… ще трішки";
    },
    onSecond: function () {
      var p = document.querySelector(".kt-paws");
      if (!p) return;
      p.classList.remove("bop"); void p.offsetWidth; p.classList.add("bop");
    },
    celebrateFX: function (big, later) {
      var m = Math.min(innerWidth, innerHeight);
      if (big) {
        FX.cannon(90);
        later(700, FX.heart);
        later(1800, function () { FX.cannon(70); });
        later(3200, FX.heart);
        FX.setFireworks(0.9);
        later(15000, function () { FX.setFireworks(0.25); });
      } else {
        FX.cannon(50);
        FX.setFireworks(0.15);
      }
      later(1200, function () { FX.setPetals(Math.round(m / 26)); });
      (function again() { later(35000, function () { FX.heart(); FX.cannon(25); again(); }); })();
    }
  };
})();
