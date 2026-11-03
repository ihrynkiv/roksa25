/* 📰 Magazine theme: a birthday cover issue. */
(function () {
  var LIME = "#d7ff3a", CREAM = "#f1ede6";

  // Cover lines — little headlines on the cover. Edit freely.
  var COVER_LINES = [
    { kicker: "Ексклюзив", text: "25 років — і жодного нудного дня" },
    { kicker: "Кава", text: "Чому V60 о восьмій ранку рятує світ" },
    { kicker: "Книжки", text: "Від Вестероса до Грозового перевалу" },
    { kicker: "Офіс", text: "Chicken piccata: рецепт, що пішов не за планом" }
  ];

  function barcode() {
    var x = 0, s = "";
    for (var i = 0; i < 38; i++) {
      var w = [1, 1, 2, 3][(i * 7 + 3) % 4];
      if (i % 2 === 0) s += '<rect x="' + x + '" y="0" width="' + w + '" height="40" fill="' + CREAM + '"/>';
      x += w + 1;
    }
    return '<svg viewBox="0 0 ' + x + ' 40" preserveAspectRatio="none">' + s + "</svg>";
  }

  window.THEME = {
    slots: 1,
    photoInterval: 6000,

    setup: function () {
      FX.configure({
        fireflyCount: 0,
        fwColors: [LIME, CREAM, "#ffffff", "#c8f02a"],
        heartColors: [LIME, CREAM],
        confettiColors: [LIME, CREAM, "#ffffff"],
        fall: "confetti",
        fwStyle: "glow"
      });
      var y = new Date().getFullYear();
      document.getElementById("decor").innerHTML =
        '<div class="mg-top"><span>Випуск № ' + BIRTHDAY.age + '</span><span>Спецвидання · ' + BIRTHDAY.day + "." + (BIRTHDAY.month < 10 ? "0" : "") + BIRTHDAY.month + "." + y + '</span><span>Ціна: безцінно</span></div>' +
        '<div class="mg-bottom"><span>Видання для однієї читачки</span><span class="mg-barcode">' + barcode() + "</span></div>" +
        '<div class="mg-ghost">' + BIRTHDAY.age + "</div>";

      document.querySelector(".whisper").textContent = "Наступний номер — " + BIRTHDAY.age + ".";
      document.querySelector("#countdown .cd-label").textContent = "T – мінус";
      document.querySelector(".cd-wish").textContent = "загадай бажання";

      var cd = document.getElementById("countdown");
      var line = document.createElement("div");
      line.className = "mg-line";
      line.innerHTML = "<i></i>";
      cd.appendChild(line);

      var cel = document.getElementById("celebrate");
      var center = cel.querySelector(".center");
      var mast = document.createElement("div");
      mast.className = "mg-mast";
      mast.textContent = BIRTHDAY.nameShort;
      center.insertBefore(mast, center.firstChild);
      cel.querySelector(".greet span").textContent = "З днем народження, " + BIRTHDAY.name + ".";
      var lines = document.createElement("ul");
      lines.className = "mg-lines";
      lines.innerHTML = COVER_LINES.map(function (l, i) {
        return '<li style="--i:' + i + '"><b>' + l.kicker + "</b><span>" + l.text + "</span></li>";
      }).join("");
      center.appendChild(lines);
      cel.querySelector(".age span").innerHTML = BIRTHDAY.age + "<small>років</small>";
      document.querySelector(".seal span").textContent = BIRTHDAY.age;
    },

    onCountdown: function (remaining) {
      var i = document.querySelector(".mg-line i");
      if (i) i.style.width = (Math.max(0, Math.min(1, remaining / 60000)) * 100).toFixed(2) + "%";
    },

    celebrateFX: function (big, later) {
      if (big) {
        FX.burst(7);
        FX.setFireworks(1.2);
        later(12000, function () { FX.setFireworks(0.35); });
        later(45000, function () { FX.setFireworks(0.1); });
      } else {
        FX.setFireworks(0.1);
      }
    }
  };
})();
