/* 💿 Vinyl theme: the record slides out of its sleeve, the needle drops at midnight. */
(function () {
  var TEAL = "#0f3d3a", CREAM = "#f3e8d2", TOMATO = "#ff5a36", MUSTARD = "#f6b73c", INK = "#121212";

  function record() {
    var g = "";
    for (var r = 94; r > 40; r -= 3.2) g += '<circle cx="100" cy="100" r="' + r.toFixed(1) + '" fill="none" stroke="#2a2a2a" stroke-width=".5"/>';
    var name = BIRTHDAY.nameShort.toUpperCase();
    return '<svg viewBox="0 0 200 200">' +
      '<defs><path id="vnArc" d="M100,100 m-26,0 a26,26 0 1,1 52,0 a26,26 0 1,1 -52,0"/>' +
      '<linearGradient id="vnGloss" x1="0" y1="0" x2="1" y2="1"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity=".16"/><stop offset=".52" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<g class="vn-disc">' +
      '<circle cx="100" cy="100" r="99" fill="#0b0b0b"/>' + g +
      '<circle cx="100" cy="100" r="36" fill="' + MUSTARD + '"/>' +
      '<text font-family="Oswald, sans-serif" font-size="7.2" font-weight="600" letter-spacing="1.6" fill="' + INK + '"><textPath href="#vnArc">' + name + " · " + BIRTHDAY.age + " · SIDE A · 33⅓ RPM · </textPath></text>" +
      '<circle cx="100" cy="100" r="2.6" fill="' + TEAL + '"/></g>' +
      '<circle cx="100" cy="100" r="99" fill="url(#vnGloss)"/>' +
      "</svg>";
  }
  function arm() {
    return '<svg viewBox="0 0 100 220">' +
      '<circle cx="70" cy="22" r="17" fill="#2b2b2b" stroke="#9a9a9a" stroke-width="3"/>' +
      '<circle cx="70" cy="22" r="7" fill="#d8d8d8"/>' +
      '<path d="M70 22 L70 150 Q70 176 52 192" fill="none" stroke="#d8d8d8" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="36" y="186" width="24" height="16" rx="3" transform="rotate(40 48 194)" fill="#bdbdbd" stroke="#7a7a7a" stroke-width="2"/>' +
      "</svg>";
  }
  function sleeve() {
    var name = BIRTHDAY.nameShort.toUpperCase();
    return '<div class="vn-sleeve-in">' +
      '<div class="vn-sun"></div>' +
      '<div class="vn-big">' + BIRTHDAY.age + "</div>" +
      '<div class="vn-title">' + name + "</div>" +
      '<div class="vn-meta"><span>Side A</span><span>' + BIRTHDAY.day + "." + (BIRTHDAY.month < 10 ? "0" : "") + BIRTHDAY.month + "</span></div>" +
      "</div>";
  }

  // where the needle sits: 0 = rest (off the record), 1 = outer groove, 2 = near the label
  var ANG = { rest: -34, outer: -8, inner: 24 };
  function setArm(a) {
    var el = document.querySelector(".vn-arm");
    if (el) el.style.transform = "rotate(" + a.toFixed(2) + "deg)";
  }

  window.THEME = {
    slots: 3,
    setup: function () {
      FX.configure({
        fireflyCount: 18,
        fireflies: [MUSTARD, CREAM],
        fall: ["note", "confetti", "confetti"],
        confettiColors: [MUSTARD, TOMATO, CREAM, "#8fd3c8"],
        fwColors: [MUSTARD, TOMATO, CREAM, "#8fd3c8", "#ffd9a0"],
        heartColors: [TOMATO, MUSTARD],
        fwStyle: "glow"
      });
      document.getElementById("decor").innerHTML =
        '<div class="vn-deck"><div class="vn-rec">' + record() + '</div><div class="vn-arm">' + arm() + "</div></div>" +
        '<div class="vn-sleeve">' + sleeve() + "</div>";

      document.querySelector(".whisper").textContent = "Наступний трек — " + BIRTHDAY.age;
      document.querySelector("#countdown .cd-label").textContent = "голка опускається…";

      var cel = document.getElementById("celebrate");
      var center = cel.querySelector(".center");
      var np = document.createElement("div");
      np.className = "vn-np";
      np.innerHTML = "<i></i> Зараз грає";
      center.insertBefore(np, center.firstChild);
      cel.querySelector(".age span").textContent = "Трек " + BIRTHDAY.age;
      cel.querySelector(".note").textContent = "ти — моя улюблена пісня";
      var eq = document.createElement("div");
      eq.className = "vn-eq";
      eq.innerHTML = new Array(25).join("<b></b>");
      center.appendChild(eq);
      Array.prototype.forEach.call(eq.children, function (b, i) { b.style.animationDelay = (-(i * 137) % 900) + "ms"; b.style.animationDuration = (520 + (i * 71) % 480) + "ms"; });
      document.querySelector(".seal span").textContent = BIRTHDAY.age;
      setArm(ANG.rest);
    },
    onCountdown: function (remaining) {
      var f = 1 - Math.max(0, Math.min(1, remaining / 60000));
      setArm(ANG.outer + (ANG.inner - ANG.outer) * f);
    },
    onState: function (s) {
      if (s === "idle") setArm(ANG.rest);
      if (s === "celebrate") setArm(ANG.outer + 4);
    },
    celebrateFX: function (big, later) {
      var m = Math.min(innerWidth, innerHeight);
      if (big) {
        FX.burst(8);
        FX.cannon(70);
        FX.setFireworks(1.6);
        later(14000, function () { FX.setFireworks(0.5); });
        later(45000, function () { FX.setFireworks(0.15); });
      } else {
        FX.setFireworks(0.15);
      }
      FX.setFireflies(0.5);
      later(2000, function () { FX.setPetals(Math.round(m / 30)); });
    }
  };
})();
