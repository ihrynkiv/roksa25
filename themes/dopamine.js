/* 🍭 Dopamine theme: shapes, ribbons, colour-flip countdown, confetti cannons. */
(function () {
  var C = { pink: "#ff3ea5", orange: "#ff7a1a", yellow: "#ffd23f", blue: "#3a5bff", lime: "#b6f03c", violet: "#9b5cff", mint: "#2fd3ae", ink: "#17121f" };
  var FLIP = [C.yellow, C.pink, C.blue, C.lime, C.orange, C.violet, C.mint];

  function svg(inner, vb) { return '<svg viewBox="' + (vb || "0 0 100 100") + '">' + inner + "</svg>"; }
  function flower(n, r1, r2, fill) {
    var d = "";
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      d += '<circle cx="' + (50 + Math.cos(a) * r1).toFixed(1) + '" cy="' + (50 + Math.sin(a) * r1).toFixed(1) + '" r="' + r2 + '" fill="' + fill + '"/>';
    }
    return d + '<circle cx="50" cy="50" r="' + r1 + '" fill="' + fill + '"/>';
  }
  function sparkle(fill) { return svg('<path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0Z" fill="' + fill + '"/>'); }
  function shape(cls, style, html) { return '<div class="dp-shape ' + cls + '" style="' + style + '">' + html + "</div>"; }
  function u(n) { return "calc(var(--u) * " + n + ")"; }

  function splitChars(el) {
    var t = el.textContent;
    el.classList.add("chars");
    el.innerHTML = Array.from(t).map(function (ch, i) { return '<span style="--i:' + i + '">' + ch + "</span>"; }).join("");
  }

  window.THEME = {
    slots: 4,
    photoInterval: 7000,

    setup: function () {
      FX.configure({
        fireflyCount: 0,
        fall: ["confetti", "confetti", "confetti", "star", "heart"],
        confettiColors: [C.pink, C.orange, C.yellow, C.blue, C.lime, C.violet, C.mint],
        fwColors: [C.pink, C.orange, C.blue, C.violet, C.mint, C.yellow],
        heartColors: [C.pink, C.violet],
        fwStyle: "flat"
      });

      var decor = document.getElementById("decor");
      var ribbonText = "З ДНЕМ НАРОДЖЕННЯ, " + BIRTHDAY.name.toUpperCase() + " ✦ " + BIRTHDAY.age + " ✦ ";
      var rep = new Array(13).join(ribbonText);
      decor.innerHTML =
        shape("dp-spin", "left:" + u(-14) + ";top:" + u(-14) + ";width:" + u(42) + ";height:" + u(42), svg(flower(8, 30, 18, C.pink))) +
        shape("dp-bob", "left:" + u(20) + ";top:" + u(-6) + ";width:" + u(16) + ";height:" + u(16), svg('<circle cx="50" cy="50" r="50" fill="' + C.yellow + '"/>')) +
        shape("dp-spin rev", "right:" + u(-10) + ";top:" + u(6) + ";width:" + u(30) + ";height:" + u(30), svg('<rect x="15" y="15" width="70" height="70" rx="8" fill="' + C.blue + '"/><g fill="#fff">' +
          [0, 1, 2, 3].map(function (r) { return [0, 1, 2, 3].map(function (c) { return (r + c) % 2 ? "" : '<rect x="' + (15 + c * 17.5) + '" y="' + (15 + r * 17.5) + '" width="17.5" height="17.5"/>'; }).join(""); }).join("") + "</g>")) +
        shape("dp-bob d2", "right:" + u(24) + ";top:" + u(4) + ";width:" + u(8) + ";height:" + u(8), sparkle(C.lime)) +
        shape("dp-bob", "left:" + u(-6) + ";bottom:" + u(-6) + ";width:" + u(40) + ";height:" + u(22), svg(
          '<path d="M0 100 A100 100 0 0 1 200 100Z" fill="' + C.orange + '"/><path d="M30 100 A70 70 0 0 1 170 100Z" fill="' + C.yellow + '"/><path d="M60 100 A40 40 0 0 1 140 100Z" fill="' + C.pink + '"/>', "0 0 200 100")) +
        shape("dp-spin", "right:" + u(-8) + ";bottom:" + u(-10) + ";width:" + u(34) + ";height:" + u(34), svg(flower(6, 26, 22, C.mint))) +
        shape("dp-bob d2", "right:" + u(28) + ";bottom:" + u(6) + ";width:" + u(20) + ";height:" + u(8), svg('<path d="M5 25 Q20 0 35 25 T65 25 T95 25" fill="none" stroke="' + C.violet + '" stroke-width="9" stroke-linecap="round"/>', "0 0 100 50")) +
        shape("dp-twinkle", "left:" + u(28) + ";bottom:" + u(26) + ";width:" + u(5) + ";height:" + u(5), sparkle(C.blue)) +
        shape("dp-twinkle", "right:" + u(30) + ";top:" + u(30) + ";width:" + u(4) + ";height:" + u(4) + ";animation-delay:-1s", sparkle(C.pink)) +
        shape("dp-twinkle", "left:" + u(14) + ";top:" + u(38) + ";width:" + u(3.5) + ";height:" + u(3.5) + ";animation-delay:-.6s", sparkle(C.orange)) +
        '<div class="dp-ribbon a"><span class="track">' + rep + rep + "</span></div>" +
        '<div class="dp-ribbon b"><span class="track">' + rep + rep + "</span></div>";

      splitChars(document.querySelector(".idle-name"));

      // "25 loading…" bar under the clock: how much of today has passed
      var idle = document.getElementById("idle");
      var box = document.createElement("div");
      box.className = "dp-loading";
      box.innerHTML = '<div class="lbl"><span>' + BIRTHDAY.age + ' завантажується…</span><span class="pct">0%</span></div><div class="bar"><div class="fill"></div></div>';
      idle.appendChild(box);
      function upd() {
        var n = new Date();
        var f = (n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds()) / 86400;
        box.querySelector(".pct").textContent = Math.floor(f * 100) + "%";
        box.querySelector(".fill").style.width = (f * 100).toFixed(2) + "%";
      }
      upd(); setInterval(upd, 1000);

      var cd = document.getElementById("countdown");
      cd.querySelector(".cd-label").textContent = "до " + BIRTHDAY.age + " лишилось";
      var bar = document.createElement("div");
      bar.className = "dp-cdbar";
      bar.innerHTML = "<i></i>";
      cd.appendChild(bar);

      document.querySelector("#celebrate .note").textContent = "рівень " + BIRTHDAY.age + ": розблоковано";
      document.querySelector(".seal span").textContent = BIRTHDAY.age;
    },

    onSecond: function (sec) {
      var bg = FLIP[sec % FLIP.length];
      document.body.style.setProperty("--flip", bg);
      document.body.style.setProperty("--numc", bg === C.yellow || bg === C.lime ? C.pink : "#fff");
      document.body.style.setProperty("--rot", (Math.random() * 30 - 15).toFixed(0) + "deg");
      document.body.classList.toggle("dp-final", sec <= 10);
    },
    onCountdown: function (remaining) {
      var i = document.querySelector(".dp-cdbar i");
      if (i) i.style.width = (Math.max(0, Math.min(1, remaining / 60000)) * 100).toFixed(2) + "%";
    },
    onState: function (s) { if (s !== "countdown") document.body.classList.remove("dp-final"); },

    celebrateFX: function (big, later) {
      var m = Math.min(innerWidth, innerHeight);
      if (big) {
        FX.cannon(110);
        later(900, function () { FX.cannon(80, "center"); });
        later(2400, function () { FX.cannon(90); });
        FX.setFireworks(1.4);
        later(12000, function () { FX.setFireworks(0.5); });
        later(40000, function () { FX.setFireworks(0.12); });
      } else {
        FX.cannon(60);
        FX.setFireworks(0.12);
      }
      later(1500, function () { FX.setPetals(Math.round(m / 22)); });
      (function again() { later(40000, function () { FX.cannon(35); again(); }); })();
    },

    decoratePhoto: function () {}
  };
})();
