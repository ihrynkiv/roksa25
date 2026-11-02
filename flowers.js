/*
 * Procedural peonies & lilies, drawn as SVG so they stay crisp on a 4K TV.
 * No image files needed — every petal is a bezier curve with its own gradient.
 */
(function () {
  "use strict";

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var uid = 0;
  function id(p) { return p + (++uid); }

  function grad(defs, stops, x1, y1, x2, y2) {
    var gid = id("g");
    var s = stops.map(function (st) {
      return '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"' + (st[2] != null ? ' stop-opacity="' + st[2] + '"' : "") + "/>";
    }).join("");
    defs.push('<linearGradient id="' + gid + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' + s + "</linearGradient>");
    return "url(#" + gid + ")";
  }
  function rgrad(defs, stops) {
    var gid = id("r");
    var s = stops.map(function (st) {
      return '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"' + (st[2] != null ? ' stop-opacity="' + st[2] + '"' : "") + "/>";
    }).join("");
    defs.push('<radialGradient id="' + gid + '">' + s + "</radialGradient>");
    return "url(#" + gid + ")";
  }

  function f(n) { return Math.round(n * 10) / 10; }

  // A ruffled, rounded peony petal pointing "up" from the origin.
  function peonyPetal(L, w, R) {
    var rf = 0.04 + R() * 0.05; // ruffle depth
    return "M0,0" +
      "C" + f(-w * 0.95) + "," + f(-L * 0.12) + " " + f(-w * 1.2) + "," + f(-L * 0.78) + " " + f(-w * 0.62) + "," + f(-L * 0.95) +
      "Q" + f(-w * 0.42) + "," + f(-L * (1.04 + rf)) + " " + f(-w * 0.2) + "," + f(-L * 0.97) +
      "Q" + f(0) + "," + f(-L * (1.05 + rf)) + " " + f(w * 0.2) + "," + f(-L * 0.98) +
      "Q" + f(w * 0.42) + "," + f(-L * (1.03 + rf)) + " " + f(w * 0.62) + "," + f(-L * 0.95) +
      "C" + f(w * 1.2) + "," + f(-L * 0.78) + " " + f(w * 0.95) + "," + f(-L * 0.12) + " 0,0Z";
  }

  function peony(defs, R, size, pal) {
    var out = [];
    var layers = 7;
    for (var i = 0; i < layers; i++) {
      var t = i / (layers - 1);
      var r = size * (1 - 0.8 * t);
      var n = Math.round(9 - 3 * t + R() * 2);
      var fill = grad(defs, [
        [0, pal.base],
        [0.55, pal.mid],
        [1, mix(pal.tip, pal.mid, t * 0.55)]
      ], 0, 1, 0, 0);
      var off = R() * 360;
      for (var j = 0; j < n; j++) {
        var a = off + (j * 360) / n + (R() - 0.5) * 18;
        var L = r * (0.86 + R() * 0.22);
        var w = L * (0.5 + R() * 0.16) * (1 - t * 0.25);
        out.push('<path d="' + peonyPetal(L, w, R) + '" fill="' + fill + '" stroke="' + pal.edge + '" stroke-opacity=".35" stroke-width="' + f(0.6 + size / 220) + '" transform="rotate(' + f(a) + ')"/>');
        // soft vein / highlight
        out.push('<path d="M0,' + f(-L * 0.18) + "Q" + f(w * 0.08) + "," + f(-L * 0.5) + " 0," + f(-L * 0.82) + '" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="' + f(size / 90) + '" transform="rotate(' + f(a) + ')"/>');
      }
    }
    // tight heart of the flower
    var heart = rgrad(defs, [[0, pal.heart], [0.7, pal.base], [1, pal.base, 0]]);
    out.push('<circle r="' + f(size * 0.2) + '" fill="' + heart + '"/>');
    // squash slightly: we see the flower at an angle
    return '<g transform="scale(1,.86)">' + out.join("") + "</g>";
  }

  function lily(defs, R, size, pal) {
    var out = [];
    var petal = function (L, w) {
      return "M0,0C" + f(-w) + "," + f(-L * 0.28) + " " + f(-w * 0.75) + "," + f(-L * 0.72) + " " + f(w * 0.05) + "," + f(-L) +
        "C" + f(w * 0.6) + "," + f(-L * 0.74) + " " + f(w) + "," + f(-L * 0.3) + " 0,0Z";
    };
    var fillBack = grad(defs, [[0, pal.throat], [0.45, pal.mid], [1, pal.tipBack]], 0, 1, 0, 0);
    var fillFront = grad(defs, [[0, pal.throat], [0.4, pal.mid], [1, pal.tip]], 0, 1, 0, 0);
    var base = R() * 60;
    // three back petals, then three front ones
    [0, 1].forEach(function (front) {
      for (var k = 0; k < 3; k++) {
        var a = base + k * 120 + (front ? 60 : 0) + (R() - 0.5) * 10;
        var L = size * (front ? 0.95 : 1) * (0.92 + R() * 0.12);
        var w = L * (front ? 0.24 : 0.3);
        out.push('<g transform="rotate(' + f(a) + ')">' +
          '<path d="' + petal(L, w) + '" fill="' + (front ? fillFront : fillBack) + '" stroke="' + pal.edge + '" stroke-opacity=".3" stroke-width="' + f(size / 200) + '"/>' +
          '<path d="M0,' + f(-L * 0.06) + "Q" + f(w * 0.12) + "," + f(-L * 0.5) + " " + f(w * 0.04) + "," + f(-L * 0.92) + '" fill="none" stroke="' + pal.vein + '" stroke-opacity=".55" stroke-width="' + f(size / 110) + '"/>' +
          speckles(R, L, w, pal.speck, size) +
          "</g>");
      }
    });
    // stamens
    for (var s = 0; s < 6; s++) {
      var sa = base + s * 60 + 30 + (R() - 0.5) * 20;
      var sl = size * (0.5 + R() * 0.12);
      out.push('<g transform="rotate(' + f(sa) + ')">' +
        '<path d="M0,0Q' + f(sl * 0.12) + "," + f(-sl * 0.5) + " 0," + f(-sl) + '" fill="none" stroke="#e9e3c9" stroke-opacity=".85" stroke-width="' + f(size / 150) + '"/>' +
        '<ellipse cx="0" cy="' + f(-sl) + '" rx="' + f(size / 40) + '" ry="' + f(size / 17) + '" fill="' + pal.anther + '"/>' +
        "</g>");
    }
    out.push('<path d="M0,0L' + f(size * 0.05) + "," + f(-size * 0.62) + '" stroke="#a9c99a" stroke-width="' + f(size / 90) + '" stroke-linecap="round"/>');
    out.push('<circle cx="' + f(size * 0.05) + '" cy="' + f(-size * 0.63) + '" r="' + f(size / 34) + '" fill="#cfe3b8"/>');
    return out.join("");
  }

  function speckles(R, L, w, color, size) {
    var s = "";
    for (var i = 0; i < 9; i++) {
      var y = -L * (0.12 + R() * 0.35);
      var x = (R() - 0.5) * w * 0.7;
      s += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(size / 140 + R() * size / 160) + '" fill="' + color + '" opacity=".75"/>';
    }
    return s;
  }

  function leaf(defs, R, L, w) {
    var fill = grad(defs, [[0, "#0c2116"], [0.6, "#1d4a31"], [1, "#2f6a49"]], 0, 1, 0, 0);
    var d = "M0,0C" + f(w) + "," + f(-L * 0.25) + " " + f(w * 0.75) + "," + f(-L * 0.78) + " 0," + f(-L) +
      "C" + f(-w * 0.75) + "," + f(-L * 0.78) + " " + f(-w) + "," + f(-L * 0.25) + " 0,0Z";
    return '<path d="' + d + '" fill="' + fill + '"/>' +
      '<path d="M0,0Q' + f(w * 0.1) + "," + f(-L * 0.5) + " 0," + f(-L * 0.95) + '" stroke="#6fbf93" stroke-opacity=".35" stroke-width="' + f(L / 160) + '" fill="none"/>';
  }

  function bud(defs, R, size, color) {
    var fill = rgrad(defs, [[0, mix(color, "#ffffff", 0.25)], [0.8, color], [1, mix(color, "#000000", 0.35)]]);
    return '<g transform="rotate(-35)">' + leaf(defs, R, size * 1.4, size * 0.35) + "</g>" +
      '<circle r="' + f(size * 0.55) + '" cy="' + f(-size * 0.2) + '" fill="' + fill + '"/>' +
      '<g transform="rotate(30)">' + leaf(defs, R, size * 0.8, size * 0.25) + "</g>";
  }

  function mix(a, b, t) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
    var g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
    var bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  }

  var PAL = {
    lilacPeony: { base: "#3a1446", mid: "#8a5aa8", tip: "#e9d6f7", heart: "#5a1f5e", edge: "#2a0f33" },
    winePeony: { base: "#3d0a19", mid: "#8e2443", tip: "#e7a6bb", heart: "#4f0e22", edge: "#2a0610" },
    blushPeony: { base: "#5b2340", mid: "#c78aa6", tip: "#fbe9ef", heart: "#7a2d4d", edge: "#3b1428" },
    whiteLily: { throat: "#8a5aa8", mid: "#e8dcef", tip: "#fbf7f2", tipBack: "#e9e1ea", vein: "#b07fc6", speck: "#6b1830", anther: "#7a2e1a", edge: "#6b4e7a" },
    pinkLily: { throat: "#7a1d3c", mid: "#d77ea2", tip: "#fbeef3", tipBack: "#f0d4df", vein: "#fff", speck: "#5a0f24", anther: "#6a2a16", edge: "#7a1d3c" }
  };

  function place(x, y, rot, scale, inner) {
    return '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ") scale(" + scale + ')"><g class="sway">' + inner + "</g></g>";
  }

  function cluster(seed, variant) {
    uid = seed * 1000;
    var R = rng(seed);
    var defs = [];
    var parts = [];

    // foliage first (behind)
    [[-20, 200], [15, 230], [48, 210], [80, 170], [-52, 160], [110, 140]].forEach(function (lf) {
      parts.push(place(250 + (R() - 0.5) * 40, 380 + (R() - 0.5) * 30, lf[0] + (R() - 0.5) * 10, 1, leaf(defs, R, lf[1], lf[1] * 0.22)));
    });

    if (variant === 0) {
      parts.push(place(140, 170, -20, 1, bud(defs, R, 28, "#6b1830")));
      parts.push(place(400, 210, 14, 1, lily(defs, R, 150, PAL.whiteLily)));
      parts.push(place(470, 420, 0, 1, peony(defs, R, 100, PAL.winePeony)));
      parts.push(place(260, 360, 0, 1, peony(defs, R, 170, PAL.lilacPeony)));
      parts.push(place(520, 260, 30, 1, bud(defs, R, 22, "#8a5aa8")));
    } else {
      parts.push(place(170, 190, -10, 1, bud(defs, R, 26, "#8a5aa8")));
      parts.push(place(250, 360, 0, 1, peony(defs, R, 150, PAL.winePeony)));
      parts.push(place(430, 300, -8, 1, lily(defs, R, 140, PAL.pinkLily)));
      parts.push(place(480, 460, 0, 1, peony(defs, R, 95, PAL.blushPeony)));
    }

    return '<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
      "<defs>" + defs.join("") + "</defs>" +
      (variant === 1 ? '<g transform="rotate(180 300 300)">' : "<g>") + parts.join("") + "</g></svg>";
  }

  var a = document.querySelector(".fl-a");
  var b = document.querySelector(".fl-b");
  if (a) a.innerHTML = cluster(7, 0);
  if (b) b.innerHTML = cluster(25, 1);
})();
