/*
 * Canvas effects shared by every theme:
 *   ambient layer  – fireflies, falling things (petals / confetti / hearts / paws), confetti cannons
 *   fireworks      – glowing (dark themes) or flat (light themes), with heart-shaped bursts
 * Themes tune it with FX.configure({...}).
 */
(function () {
  "use strict";

  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  var TAU = Math.PI * 2;
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function minDim() { return Math.min(innerWidth, innerHeight); }

  function setup(canvas) {
    var ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = Math.round(innerWidth * DPR);
      canvas.height = Math.round(innerHeight * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    addEventListener("resize", resize);
    return ctx;
  }

  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  // pre-rendered glow sprite (cheap to draw many times)
  function glowSprite(color, size) {
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var g = c.getContext("2d");
    var r = size / 2;
    var grd = g.createRadialGradient(r, r, 0, r, r, r);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.18, color);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return c;
  }

  /* ───────────── settings (themes override) ───────────── */
  var S = {
    fireflies: ["#cdb6f2", "#6fbf93", "#f3e9dc"],
    fireflyCount: 46,
    fall: "petal",              // petal | confetti | heart | paw | star | mixed | [list of these]
    fallColors: [
      ["#f6e3ee", "#c88aa8"], ["#e9d6f7", "#8a5aa8"], ["#d77ea2", "#7a1d3c"],
      ["#fbf3ea", "#d9c2c9"], ["#b8456f", "#5a0f24"], ["#cdb6f2", "#5d3a7d"]
    ],
    fwColors: ["#f3e9dc", "#cdb6f2", "#b07fd6", "#e05a86", "#ffd1e1", "#7fd1a8", "#f0d9a8", "#9c2c4f", "#ffffff"],
    fwStyle: "glow",            // glow (dark bg) | flat (light bg)
    heartColors: ["#e05a86", "#ffd1e1"],
    confettiColors: ["#ff3ea5", "#ffd60a", "#2f6bff", "#b8f400", "#ff7a1a", "#8b5cf6"]
  };

  /* ───────────── ambient ───────────── */
  var amb = setup(document.getElementById("ambient"));
  var flySprites = [];
  var flies = [];
  function buildFlies() {
    flySprites = S.fireflies.map(function (c) { return glowSprite(hexA(c, 0.55), 64); });
    flies = [];
    for (var i = 0; i < S.fireflyCount; i++) {
      flies.push({
        x: Math.random(), y: Math.random(),
        vx: rand(-0.00004, 0.00004), vy: rand(-0.00006, -0.00001),
        s: rand(8, 26), ph: Math.random() * TAU, sp: rand(0.4, 1.2),
        img: pick(flySprites)
      });
    }
  }
  buildFlies();

  var falling = [];
  var fallTarget = 0;
  function newFaller(top) {
    var shape = Array.isArray(S.fall) ? pick(S.fall) : S.fall === "mixed" ? pick(["confetti", "confetti", "heart", "star"]) : S.fall;
    var big = shape === "paw" || shape === "heart" || shape === "star" || shape === "note";
    return {
      shape: shape,
      sub: (Math.random() * 3) | 0,
      x: rand(-0.05, 1.05) * innerWidth,
      y: top ? rand(-innerHeight, -20) : rand(0, innerHeight),
      s: rand(0.7, 1.5) * minDim() / (big ? 55 : 70),
      vy: rand(0.35, 0.9) * (shape === "confetti" ? 1.6 : 1), vx: rand(-0.25, 0.35),
      rot: Math.random() * TAU, vr: rand(-0.02, 0.02) * (shape === "confetti" ? 3 : 1),
      flip: Math.random() * TAU, vf: rand(0.01, 0.035) * (shape === "confetti" ? 3 : 1),
      sway: Math.random() * TAU,
      c: shape === "petal" ? pick(S.fallColors) : pick(S.confettiColors)
    };
  }

  // confetti cannons (one-off bursts)
  var shots = [];
  function cannon(count, from) {
    var w = innerWidth, h = innerHeight, m = minDim();
    var sides = from ? [from] : ["left", "right"];
    sides.forEach(function (side) {
      for (var i = 0; i < count; i++) {
        var left = side === "left";
        var center = side === "center";
        var ang = center ? rand(-Math.PI * 0.5 - 0.6, -Math.PI * 0.5 + 0.6)
          : left ? rand(-Math.PI * 0.42, -Math.PI * 0.22) : rand(-Math.PI * 0.78, -Math.PI * 0.58);
        var sp = rand(0.9, 1.6) * m / 48;
        shots.push({
          x: center ? w / 2 : left ? -10 : w + 10, y: h + 10,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          s: rand(0.6, 1.2) * m / 80,
          rot: Math.random() * TAU, vr: rand(-0.3, 0.3),
          flip: Math.random() * TAU, vf: rand(0.1, 0.3),
          sub: (Math.random() * 3) | 0,
          c: pick(S.confettiColors), life: 1
        });
      }
    });
  }

  function drawConfettiPiece(p, scaleY) {
    amb.fillStyle = p.c;
    if (p.sub === 0) { amb.fillRect(-p.s * 0.5, -p.s * 0.8 * scaleY, p.s, p.s * 1.6 * scaleY); }
    else if (p.sub === 1) { amb.beginPath(); amb.ellipse(0, 0, p.s * 0.55, p.s * 0.55 * Math.max(0.15, scaleY), 0, 0, TAU); amb.fill(); }
    else {
      amb.strokeStyle = p.c; amb.lineWidth = p.s * 0.35; amb.lineCap = "round";
      amb.beginPath(); amb.moveTo(-p.s, 0);
      amb.quadraticCurveTo(-p.s * 0.5, -p.s * 0.8 * scaleY, 0, 0);
      amb.quadraticCurveTo(p.s * 0.5, p.s * 0.8 * scaleY, p.s, 0);
      amb.stroke();
    }
  }
  function heartPath(s) {
    amb.beginPath();
    amb.moveTo(0, s * 0.35);
    amb.bezierCurveTo(-s * 1.1, -s * 0.35, -s * 0.55, -s * 1.05, 0, -s * 0.45);
    amb.bezierCurveTo(s * 0.55, -s * 1.05, s * 1.1, -s * 0.35, 0, s * 0.35);
    amb.closePath();
  }
  function starPath(s) {
    amb.beginPath();
    for (var i = 0; i < 10; i++) {
      var r = i % 2 ? s * 0.45 : s;
      var a = (i / 10) * TAU - Math.PI / 2;
      amb.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    amb.closePath();
  }
  function pawPath(s) {
    amb.beginPath();
    amb.ellipse(0, s * 0.25, s * 0.55, s * 0.45, 0, 0, TAU);
    [[-0.62, -0.3], [-0.22, -0.62], [0.22, -0.62], [0.62, -0.3]].forEach(function (t) {
      amb.moveTo(t[0] * s + s * 0.2, t[1] * s);
      amb.ellipse(t[0] * s, t[1] * s, s * 0.2, s * 0.25, 0, 0, TAU);
    });
  }

  var fliesAlpha = 1;
  var t0 = performance.now();
  function drawAmbient(now) {
    var w = innerWidth, h = innerHeight, t = (now - t0) / 1000;
    amb.clearRect(0, 0, w, h);

    if (fliesAlpha > 0.01) {
      amb.globalCompositeOperation = "lighter";
      for (var i = 0; i < flies.length; i++) {
        var p = flies[i];
        p.x += p.vx + Math.sin(t * 0.3 + p.ph) * 0.00006;
        p.y += p.vy;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05; else if (p.x > 1.05) p.x = -0.05;
        var a = (0.35 + 0.65 * Math.max(0, Math.sin(t * p.sp + p.ph))) * fliesAlpha;
        if (a < 0.02) continue;
        amb.globalAlpha = a;
        amb.drawImage(p.img, p.x * w - p.s / 2, p.y * h - p.s / 2, p.s, p.s);
      }
      amb.globalAlpha = 1;
      amb.globalCompositeOperation = "source-over";
    }

    // falling things
    while (falling.length < fallTarget) falling.push(newFaller(true));
    for (var j = falling.length - 1; j >= 0; j--) {
      var q = falling[j];
      q.sway += 0.012;
      q.x += q.vx + Math.sin(q.sway) * 0.6;
      q.y += q.vy;
      q.rot += q.vr;
      q.flip += q.vf;
      if (q.y > h + 40) {
        if (falling.length > fallTarget) { falling.splice(j, 1); continue; }
        falling[j] = newFaller(true);
        continue;
      }
      var sx = Math.cos(q.flip);
      amb.save();
      amb.translate(q.x, q.y);
      amb.rotate(q.rot);
      amb.globalAlpha = 0.9;
      if (q.shape === "petal") {
        amb.scale(0.35 + 0.65 * Math.abs(sx), 1);
        var g = amb.createLinearGradient(0, -q.s, 0, q.s);
        g.addColorStop(0, sx > 0 ? q.c[0] : q.c[1]);
        g.addColorStop(1, sx > 0 ? q.c[1] : q.c[0]);
        amb.fillStyle = g;
        amb.beginPath();
        amb.moveTo(0, q.s);
        amb.bezierCurveTo(-q.s * 0.95, q.s * 0.4, -q.s * 0.8, -q.s * 0.9, -q.s * 0.15, -q.s * 0.85);
        amb.quadraticCurveTo(0, -q.s * 0.7, q.s * 0.15, -q.s * 0.85);
        amb.bezierCurveTo(q.s * 0.8, -q.s * 0.9, q.s * 0.95, q.s * 0.4, 0, q.s);
        amb.fill();
      } else if (q.shape === "confetti") {
        drawConfettiPiece(q, Math.abs(sx));
      } else {
        amb.rotate(-q.rot * 0.8); // hearts / paws mostly stay upright
        amb.scale(0.6 + 0.4 * Math.abs(sx), 1);
        amb.fillStyle = q.c;
        if (q.shape === "heart") heartPath(q.s);
        else if (q.shape === "star") starPath(q.s * 0.8);
        else if (q.shape === "note") { amb.font = "700 " + Math.round(q.s * 2.4) + "px serif"; amb.textAlign = "center"; amb.fillText(q.sub ? "♪" : "♫", 0, q.s * 0.8); amb.restore(); continue; }
        else pawPath(q.s * 0.7);
        amb.fill();
      }
      amb.restore();
    }

    // cannon confetti
    for (var k = shots.length - 1; k >= 0; k--) {
      var c = shots[k];
      c.x += c.vx; c.y += c.vy;
      c.vx *= 0.985; c.vy = c.vy * 0.985 + minDim() / 4200;
      c.rot += c.vr * 0.2; c.flip += c.vf;
      if (c.y > h + 60) { shots.splice(k, 1); continue; }
      amb.save();
      amb.translate(c.x, c.y);
      amb.rotate(c.rot);
      drawConfettiPiece(c, Math.abs(Math.cos(c.flip)));
      amb.restore();
    }
    amb.globalAlpha = 1;
  }

  /* ───────────── fireworks ───────────── */
  var fw = setup(document.getElementById("fireworks"));
  var sparkSprites = {};
  function sprite(c) {
    if (!sparkSprites[c]) sparkSprites[c] = glowSprite(hexA(c, 0.9), 32);
    return sparkSprites[c];
  }

  var rockets = [], sparks = [];
  var intensity = 0; // launches per second
  var launchAcc = 0;

  function launch(opts) {
    opts = opts || {};
    var w = innerWidth, h = innerHeight;
    var x = opts.x != null ? opts.x : rand(0.12, 0.88) * w;
    var ty = opts.y != null ? opts.y : rand(0.12, 0.42) * h;
    rockets.push({
      x: x + rand(-40, 40), y: h + 10,
      tx: x, ty: ty,
      vy: -rand(0.9, 1.15) * Math.sqrt(2 * 0.12 * (h - ty)),
      color: opts.color || pick(S.fwColors),
      shape: opts.shape || (Math.random() < 0.14 ? "heart" : Math.random() < 0.3 ? "ring" : "peony")
    });
  }

  function explode(r) {
    var power = minDim() / 260;
    var c2 = Math.random() < 0.5 ? pick(S.fwColors) : r.color;
    var n, i, a, sp;
    if (r.shape === "heart") {
      n = 90;
      for (i = 0; i < n; i++) {
        a = (i / n) * TAU;
        var hx = 16 * Math.pow(Math.sin(a), 3);
        var hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        spark(r.x, r.y, hx * power * 0.16, hy * power * 0.16, i % 3 ? S.heartColors[0] : S.heartColors[1], 1.6, 0.012);
      }
    } else if (r.shape === "ring") {
      n = 70;
      for (i = 0; i < n; i++) {
        a = (i / n) * TAU;
        sp = power * 2.3;
        spark(r.x, r.y, Math.cos(a) * sp, Math.sin(a) * sp * 0.9, i % 2 ? r.color : c2, 1.4, 0.014);
      }
    } else {
      n = 110;
      for (i = 0; i < n; i++) {
        a = Math.random() * TAU;
        sp = power * Math.pow(Math.random(), 0.45) * 2.8;
        spark(r.x, r.y, Math.cos(a) * sp, Math.sin(a) * sp, Math.random() < 0.75 ? r.color : c2, rand(1, 1.8), rand(0.009, 0.016));
      }
    }
  }

  function spark(x, y, vx, vy, color, size, decay) {
    sparks.push({ x: x, y: y, vx: vx, vy: vy, color: color, size: size, life: 1, decay: decay, tw: Math.random() < 0.3 });
  }

  function drawFireworks(dt) {
    var w = innerWidth, h = innerHeight;
    var flat = S.fwStyle === "flat";
    fw.globalCompositeOperation = "destination-out";
    fw.fillStyle = flat ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.2)";
    fw.fillRect(0, 0, w, h);
    fw.globalCompositeOperation = flat ? "source-over" : "lighter";

    launchAcc += intensity * dt;
    while (launchAcc >= 1) { launchAcc -= 1; launch(); }

    var m = minDim();
    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      var px = r.x, py = r.y;
      r.y += r.vy;
      r.vy += 0.12;
      r.x += (r.tx - r.x) * 0.02;
      fw.globalAlpha = flat ? 1 : 0.7;
      fw.strokeStyle = hexA(r.color, flat ? 1 : 0.8);
      fw.lineWidth = flat ? 3 : 2;
      fw.lineCap = "round";
      fw.beginPath(); fw.moveTo(px, py); fw.lineTo(r.x, r.y); fw.stroke();
      if (!flat) fw.drawImage(sprite(r.color), r.x - 5, r.y - 5, 10, 10);
      if (r.vy >= -0.5 || r.y <= r.ty) { explode(r); rockets.splice(i, 1); }
    }
    for (var j = sparks.length - 1; j >= 0; j--) {
      var s = sparks[j];
      s.x += s.vx; s.y += s.vy;
      s.vx *= 0.975; s.vy = s.vy * 0.975 + 0.035;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(j, 1); continue; }
      if (flat) {
        var rr = (m / 300) * s.size * (0.5 + s.life * 0.5);
        fw.globalAlpha = Math.min(1, s.life * 1.6);
        fw.fillStyle = s.color;
        fw.beginPath(); fw.arc(s.x, s.y, rr, 0, TAU); fw.fill();
      } else {
        var sz = (m / 110) * s.size * (0.4 + s.life * 0.6);
        fw.globalAlpha = s.tw ? s.life * (0.4 + 0.6 * Math.random()) : s.life;
        fw.drawImage(sprite(s.color), s.x - sz / 2, s.y - sz / 2, sz, sz);
      }
    }
    fw.globalAlpha = 1;
  }

  /* ───────────── loop ───────────── */
  var last = performance.now();
  function loop(now) {
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    drawAmbient(now);
    drawFireworks(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  window.FX = {
    configure: function (o) {
      for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) S[k] = o[k];
      if (o.fireflies || o.fireflyCount != null) buildFlies();
    },
    setFireworks: function (perSecond) { intensity = perSecond; },
    burst: function (count) {
      for (var i = 0; i < count; i++) {
        (function (k) {
          setTimeout(function () {
            launch({ x: innerWidth * (0.1 + 0.8 * Math.random()), y: innerHeight * rand(0.1, 0.4) });
          }, k * 140);
        })(i);
      }
    },
    heart: function () { launch({ x: innerWidth / 2, y: innerHeight * 0.3, shape: "heart" }); },
    cannon: cannon,
    setPetals: function (n) { fallTarget = n; },
    setFireflies: function (a) { fliesAlpha = a; }
  };
})();
