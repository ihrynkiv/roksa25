/*
 * Canvas effects: fireflies + falling peony petals (ambient layer)
 * and fireworks (with the occasional heart-shaped burst).
 */
(function () {
  "use strict";

  var DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  var TAU = Math.PI * 2;
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

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

  /* ───────────── ambient: fireflies + petals ───────────── */
  var amb = setup(document.getElementById("ambient"));
  var fireflySprites = [glowSprite("rgba(205,182,242,.55)", 64), glowSprite("rgba(111,191,147,.5)", 64), glowSprite("rgba(243,233,220,.5)", 64)];
  var flies = [];
  for (var i = 0; i < 46; i++) {
    flies.push({
      x: Math.random(), y: Math.random(),
      vx: rand(-0.00004, 0.00004), vy: rand(-0.00006, -0.00001),
      s: rand(8, 26), ph: Math.random() * TAU, sp: rand(0.4, 1.2),
      img: pick(fireflySprites)
    });
  }

  var PETAL_COLORS = [
    ["#f6e3ee", "#c88aa8"], ["#e9d6f7", "#8a5aa8"], ["#d77ea2", "#7a1d3c"],
    ["#fbf3ea", "#d9c2c9"], ["#b8456f", "#5a0f24"], ["#cdb6f2", "#5d3a7d"]
  ];
  var petals = [];
  var petalTarget = 0;
  function newPetal(top) {
    var c = pick(PETAL_COLORS);
    return {
      x: rand(-0.05, 1.05) * innerWidth,
      y: top ? rand(-innerHeight, -20) : rand(0, innerHeight),
      s: rand(0.7, 1.5) * Math.min(innerWidth, innerHeight) / 70,
      vy: rand(0.35, 0.9), vx: rand(-0.25, 0.35),
      rot: Math.random() * TAU, vr: rand(-0.02, 0.02),
      flip: Math.random() * TAU, vf: rand(0.01, 0.035),
      sway: Math.random() * TAU, c: c
    };
  }

  var fliesAlpha = 1;
  var t0 = performance.now();
  function drawAmbient(now) {
    var w = innerWidth, h = innerHeight, t = (now - t0) / 1000;
    amb.clearRect(0, 0, w, h);

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

    // petals
    while (petals.length < petalTarget) petals.push(newPetal(true));
    for (var j = petals.length - 1; j >= 0; j--) {
      var q = petals[j];
      q.sway += 0.012;
      q.x += q.vx + Math.sin(q.sway) * 0.6;
      q.y += q.vy;
      q.rot += q.vr;
      q.flip += q.vf;
      if (q.y > h + 40) {
        if (petals.length > petalTarget) { petals.splice(j, 1); continue; }
        petals[j] = newPetal(true);
        continue;
      }
      var sx = Math.cos(q.flip);
      amb.save();
      amb.translate(q.x, q.y);
      amb.rotate(q.rot);
      amb.scale(0.35 + 0.65 * Math.abs(sx), 1);
      var g = amb.createLinearGradient(0, -q.s, 0, q.s);
      g.addColorStop(0, sx > 0 ? q.c[0] : q.c[1]);
      g.addColorStop(1, sx > 0 ? q.c[1] : q.c[0]);
      amb.fillStyle = g;
      amb.globalAlpha = 0.85;
      amb.beginPath();
      // rounded petal with a soft notch at the top
      amb.moveTo(0, q.s);
      amb.bezierCurveTo(-q.s * 0.95, q.s * 0.4, -q.s * 0.8, -q.s * 0.9, -q.s * 0.15, -q.s * 0.85);
      amb.quadraticCurveTo(0, -q.s * 0.7, q.s * 0.15, -q.s * 0.85);
      amb.bezierCurveTo(q.s * 0.8, -q.s * 0.9, q.s * 0.95, q.s * 0.4, 0, q.s);
      amb.fill();
      amb.restore();
    }
    amb.globalAlpha = 1;
  }

  /* ───────────── fireworks ───────────── */
  var fw = setup(document.getElementById("fireworks"));
  var FW_COLORS = ["#f3e9dc", "#cdb6f2", "#b07fd6", "#e05a86", "#ffd1e1", "#7fd1a8", "#f0d9a8", "#9c2c4f", "#ffffff"];
  var sparkSprites = {};
  FW_COLORS.forEach(function (c) { sparkSprites[c] = glowSprite(hexA(c, 0.9), 32); });
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
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
      vy: -rand(0.9, 1.15) * Math.sqrt(2 * 0.12 * (h - ty)) * 1.0,
      color: opts.color || pick(FW_COLORS),
      shape: opts.shape || (Math.random() < 0.14 ? "heart" : Math.random() < 0.3 ? "ring" : "peony")
    });
  }

  function explode(r) {
    var m = Math.min(innerWidth, innerHeight);
    var power = m / 260;
    var c2 = Math.random() < 0.5 ? pick(FW_COLORS) : r.color;
    var n, i, a, sp;
    if (r.shape === "heart") {
      n = 90;
      for (i = 0; i < n; i++) {
        a = (i / n) * TAU;
        var hx = 16 * Math.pow(Math.sin(a), 3);
        var hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        spark(r.x, r.y, hx * power * 0.16, hy * power * 0.16, i % 3 ? "#e05a86" : "#ffd1e1", 1.6, 0.012);
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
    // fade old frame → trails
    fw.globalCompositeOperation = "destination-out";
    fw.fillStyle = "rgba(0,0,0,0.2)";
    fw.fillRect(0, 0, w, h);
    fw.globalCompositeOperation = "lighter";

    launchAcc += intensity * dt;
    while (launchAcc >= 1) { launchAcc -= 1; launch(); }

    var m = Math.min(w, h);
    for (var i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      r.y += r.vy;
      r.vy += 0.12;
      r.x += (r.tx - r.x) * 0.02;
      fw.globalAlpha = 0.55;
      fw.drawImage(sparkSprites[r.color], r.x - 4, r.y - 4, 8, 8);
      if (r.vy >= -0.5 || r.y <= r.ty) { explode(r); rockets.splice(i, 1); }
    }
    for (var j = sparks.length - 1; j >= 0; j--) {
      var s = sparks[j];
      s.x += s.vx; s.y += s.vy;
      s.vx *= 0.975; s.vy = s.vy * 0.975 + 0.035;
      s.life -= s.decay;
      if (s.life <= 0) { sparks.splice(j, 1); continue; }
      var sz = (m / 110) * s.size * (0.4 + s.life * 0.6);
      fw.globalAlpha = s.tw ? s.life * (0.4 + 0.6 * Math.random()) : s.life;
      fw.drawImage(sparkSprites[s.color], s.x - sz / 2, s.y - sz / 2, sz, sz);
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
    setPetals: function (n) { petalTarget = n; },
    setFireflies: function (a) { fliesAlpha = a; }
  };
})();
