/* 🏢 Office theme: a mockumentary birthday — memo, whiteboard countdown, corkboard party. */
(function () {
  var NAVY = "#1f2d4f", INK = "#22252b", RED = "#d6332e", PAPER = "#fffdf7";
  var STICKY = { yellow: "#fff27a", pink: "#ffc2d1", blue: "#bfe3ff", green: "#cdf3a9" };

  // Subtitles at the bottom after midnight (replace the shared quotes for this theme). Edit freely.
  var QUOTES = [
    { text: "That's what she said.", by: "Michael Scott" },
    { text: "ФАКТ: найкраща людина в цьому офісі народилася 4 листопада.", by: "Dwight Schrute (майже)" },
    { text: "Bears. Beets. Birthday cake.", by: "Dwight Schrute (неофіційно)" },
    { text: "Сьогодні я приніс свій знаменитий чилі. І навіть не розлив.", by: "Kevin Malone (майже)" },
    { text: "Всім chicken piccata. І side salad.", by: "замовлення на сьогодні" },
    { text: "That one night… але ця ніч ще краща.", by: "я" }
  ];
  // Dwight-style facts during the last seconds of the countdown
  function fact(sec) {
    if (sec > 40) return "ФАКТ: нарада почнеться вчасно. Запізнення не прощаються.";
    if (sec > 20) return "ФАКТ: торт уже в конференц-залі. Чилі — ні.";
    if (sec > 10) return "ФАКТ: до " + BIRTHDAY.age + " лишилось " + sec + " секунд.";
    return "ФАКТ: це найкращі " + sec + " секунд року.";
  }

  function chili() {
    return '<svg viewBox="0 0 220 190">' +
      '<g class="of-steam" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85">' +
      '<path d="M70 50 q-12 -14 0 -26 q12 -12 0 -24"/><path d="M110 46 q-12 -14 0 -26 q12 -12 0 -24"/><path d="M150 50 q-12 -14 0 -26 q12 -12 0 -24"/></g>' +
      '<rect x="8" y="86" width="28" height="14" rx="7" fill="#5d636e" stroke="' + INK + '" stroke-width="5"/>' +
      '<rect x="184" y="86" width="28" height="14" rx="7" fill="#5d636e" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M30 78 H190 V128 Q190 176 142 176 H78 Q30 176 30 128Z" fill="#8a909b" stroke="' + INK + '" stroke-width="5"/>' +
      '<path d="M44 96 V128 Q44 160 78 162" fill="none" stroke="#c3c8d0" stroke-width="6" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse cx="110" cy="78" rx="82" ry="17" fill="#b9bec7" stroke="' + INK + '" stroke-width="5"/>' +
      '<ellipse cx="110" cy="79" rx="70" ry="11" fill="#a3331f"/>' +
      '<g fill="#6e1f12"><circle cx="86" cy="78" r="3.5"/><circle cx="112" cy="81" r="3.5"/><circle cx="134" cy="76" r="3.5"/><circle cx="98" cy="74" r="3"/><circle cx="124" cy="83" r="3"/></g>' +
      '<g fill="#f2c14e"><rect x="72" y="80" width="6" height="3" rx="1.5"/><rect x="146" y="78" width="6" height="3" rx="1.5"/></g>' +
      "</svg>";
  }
  function mug() {
    return '<svg viewBox="0 0 180 200">' +
      '<g class="of-steam" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85">' +
      '<path d="M60 44 q-10 -12 0 -22 q10 -10 0 -20"/><path d="M95 40 q-10 -12 0 -22 q10 -10 0 -20"/></g>' +
      '<path d="M138 86 q38 0 38 32 q0 32 -38 32" fill="none" stroke="' + INK + '" stroke-width="12"/>' +
      '<path d="M138 86 q38 0 38 32 q0 32 -38 32" fill="none" stroke="#fff" stroke-width="5"/>' +
      '<rect x="18" y="56" width="124" height="134" rx="14" fill="#fff" stroke="' + INK + '" stroke-width="5"/>' +
      '<ellipse cx="80" cy="60" rx="58" ry="9" fill="#5b3a22" stroke="' + INK + '" stroke-width="4"/>' +
      '<text x="80" y="112" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="600" font-size="17" fill="' + INK + '" letter-spacing="1">WORLD\'S BEST</text>' +
      '<text x="80" y="146" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="600" font-size="30" fill="' + RED + '">' + BIRTHDAY.nameShort.toUpperCase() + "</text>" +
      "</svg>";
  }
  function trophy() {
    return '<svg viewBox="0 0 150 210">' +
      '<defs><linearGradient id="ofGold" x1="0" x2="1"><stop offset="0" stop-color="#b8862b"/><stop offset=".45" stop-color="#ffe08a"/><stop offset="1" stop-color="#b8862b"/></linearGradient></defs>' +
      '<path d="M75 6 L84 30 L110 31 L90 47 L97 72 L75 58 L53 72 L60 47 L40 31 L66 30Z" fill="url(#ofGold)" stroke="#6b4a12" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M30 76 H120 Q120 136 75 140 Q30 136 30 76Z" fill="url(#ofGold)" stroke="#6b4a12" stroke-width="3"/>' +
      '<path d="M30 86 Q8 86 10 104 Q12 122 38 124" fill="none" stroke="#b8862b" stroke-width="7"/><path d="M120 86 Q142 86 140 104 Q138 122 112 124" fill="none" stroke="#b8862b" stroke-width="7"/>' +
      '<rect x="66" y="140" width="18" height="24" fill="url(#ofGold)" stroke="#6b4a12" stroke-width="3"/>' +
      '<rect x="36" y="164" width="78" height="40" rx="4" fill="#2b2f36" stroke="#111" stroke-width="3"/>' +
      '<rect x="46" y="172" width="58" height="24" rx="2" fill="url(#ofGold)"/>' +
      '<text x="75" y="190" text-anchor="middle" font-family="Oswald, sans-serif" font-weight="600" font-size="18" fill="#2b2f36">' + BIRTHDAY.age + "</text>" +
      "</svg>";
  }
  function sticky(cls, color, html) {
    return '<div class="of-sticky ' + cls + '" style="--c:' + color + '">' + html + "</div>";
  }

  window.THEME = {
    slots: 4,
    quotes: QUOTES,

    setup: function () {
      FX.configure({
        fireflyCount: 0,
        fall: ["confetti", "confetti", "confetti", "heart"],
        confettiColors: ["#ffffff", STICKY.yellow, STICKY.pink, STICKY.blue, STICKY.green, NAVY],
        fwColors: [RED, NAVY, "#f2c14e", "#4aa3df", "#ffffff"],
        heartColors: [RED, "#ff8fa3"],
        fwStyle: "flat"
      });

      var from = (BIRTHDAY.LETTER && BIRTHDAY.LETTER.signature || "Іван").replace(/^Твій\s+/, "");
      document.getElementById("decor").innerHTML =
        '<div class="of-lights"><i></i><i></i></div>' +
        sticky("s1", STICKY.yellow, "Bears.<br>Beets.<br>Birthday.") +
        sticky("s2", STICKY.pink, "chicken piccata<br>+ side salad<br><small>як завжди</small>") +
        sticky("s3", STICKY.green, "Kevin's famous chili<br><small>нести обережно!</small>") +
        '<div class="of-chili">' + chili() + "</div>" +
        '<div class="of-mug">' + mug() + '<div class="of-twss">That\'s what she said!</div></div>' +
        '<div class="of-lower"><b>' + BIRTHDAY.nameShort + "</b><span>іменинниця (майже)</span></div>";

      // idle: the memo
      var idle = document.getElementById("idle");
      var memo = document.createElement("div");
      memo.className = "of-memo";
      memo.innerHTML =
        '<div class="of-memo-head"><b>МЕМО</b><span>' + BIRTHDAY.nameShort.toUpperCase() + ' PAPER CO. · Львівська філія</span></div>' +
        "<dl><dt>Кому:</dt><dd>" + BIRTHDAY.nameShort + "</dd>" +
        "<dt>Від:</dt><dd>" + from + ", регіональний менеджер твого серця</dd>" +
        "<dt>Тема:</dt><dd>Твій день народження</dd>" +
        '<dt>Сьогодні:</dt><dd class="of-date"></dd></dl>' +
        '<div class="of-memo-clock"></div>' +
        "<p>Явка обовʼязкова. Буде торт (не чилі).</p>";
      idle.appendChild(memo);
      memo.querySelector(".of-date").appendChild(idle.querySelector(".eyebrow"));
      memo.querySelector(".of-memo-clock").appendChild(idle.querySelector(".clock"));

      // countdown: whiteboard
      var cd = document.getElementById("countdown");
      cd.querySelector(".cd-label").textContent = "Нарада в конференц-залі через:";
      var f = document.createElement("p");
      f.className = "of-fact";
      cd.appendChild(f);

      // celebration: the award card
      var cel = document.getElementById("celebrate");
      cel.querySelector(".age").innerHTML = '<div class="of-trophy">' + trophy() + '</div><div class="of-plaque"><b>' + BIRTHDAY.age + " років стажу</b><span>у ролі найкращої людини</span></div>";
      cel.querySelector(".note").textContent = "Премія «Найкраща людина року». Без конкурентів.";
      document.querySelector(".seal span").textContent = "OK";
    },

    onSecond: function (sec) {
      var f = document.querySelector(".of-fact");
      if (f) f.textContent = fact(sec);
    },

    celebrateFX: function (big, later) {
      var m = Math.min(innerWidth, innerHeight);
      if (big) {
        FX.cannon(110);
        later(1000, function () { FX.cannon(80, "center"); });
        later(2600, function () { FX.cannon(80); });
        FX.setFireworks(0.8);
        later(12000, function () { FX.setFireworks(0.2); });
      } else {
        FX.cannon(50);
        FX.setFireworks(0.1);
      }
      later(1500, function () { FX.setPetals(Math.round(m / 24)); });
      (function again() { later(45000, function () { FX.cannon(30); again(); }); })();
    }
  };
})();
