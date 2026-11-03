/*
 * The clock & the show.
 *
 *  idle       → wallpaper with a live clock
 *  countdown  → 23:59:00 … 23:59:59 the night before the birthday (60 → 1)
 *  celebrate  → 00:00 and the whole birthday day
 *
 *  URL:   ?theme=kitty|dopamine|vinyl|magazine|classic   (same as /roksa25/<theme>/)
 *         ?test=20    start a countdown from 20 s on load (any 3–60)
 *         ?celebrate  open directly in celebration mode
 *         ?daily      run the countdown every night at 23:59
 *         ?controls   show the test buttons (/roksa25/test/ opens this)
 *  Keys (test mode only): T = 20 s test, Shift+T = 60 s, C = celebrate, L = letter,
 *         R/Esc = real time, 1–5 = theme.   F = fullscreen (always)
 */
(function () {
  "use strict";

  var CFG = window.BIRTHDAY;
  var params = new URLSearchParams(location.search);
  var daily = CFG.everyMidnight || params.has("daily");

  var offset = 0; // ms added to real time (used by Test)
  function now() { return new Date(Date.now() + offset); }

  var state = null;
  var body = document.body;

  // the active theme (themes/<id>.js) can hook into everything below
  var TH = window.THEME || {};
  function hook(name) {
    if (typeof TH[name] === "function") {
      try { return TH[name].apply(TH, Array.prototype.slice.call(arguments, 1)); } catch (e) { console.error(e); }
    }
  }

  /* ───────────── time helpers ───────────── */
  function isBirthday(d) {
    return d.getMonth() + 1 === CFG.month && d.getDate() === CFG.day;
  }
  // the next midnight that should get a countdown
  function nextTarget(d) {
    if (daily) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
    }
    var t = new Date(d.getFullYear(), CFG.month - 1, CFG.day, 0, 0, 0, 0);
    if (t <= d) t = new Date(d.getFullYear() + 1, CFG.month - 1, CFG.day, 0, 0, 0, 0);
    return t;
  }

  /* ───────────── static text ───────────── */
  var nameEl = document.getElementById("name");
  nameEl.innerHTML = Array.from(CFG.name).map(function (ch, i) {
    return '<span class="l" style="--i:' + i + '">' + ch + "</span>";
  }).join("");
  document.querySelector(".age span").textContent = CFG.age;
  Array.prototype.forEach.call(document.querySelectorAll("[data-fill]"), function (el) {
    var v = { short: CFG.nameShort, name: CFG.name, age: CFG.age }[el.getAttribute("data-fill")];
    if (v != null) el.textContent = v;
  });

  /* ───────────── idle ───────────── */
  var clockEl = document.getElementById("clock");
  var dateEl = document.getElementById("idle-date");
  var dateFmt;
  try { dateFmt = new Intl.DateTimeFormat("uk-UA", { weekday: "long", day: "numeric", month: "long" }); } catch (e) { dateFmt = null; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var lastClock = "";
  function renderIdle(d) {
    var s = pad(d.getHours()) + ":" + pad(d.getMinutes()) + "|" + pad(d.getSeconds());
    if (s === lastClock) return;
    lastClock = s;
    var p = s.split("|");
    clockEl.innerHTML = p[0] + "<span>" + p[1] + "</span>";
    dateEl.textContent = dateFmt ? dateFmt.format(d) : d.toDateString();
  }

  /* ───────────── countdown ───────────── */
  var cdNum = document.getElementById("cd-num");
  var ring = document.getElementById("ring-bar");
  var CIRC = 2 * Math.PI * 92;
  var lastSec = -1;
  function renderCountdown(remaining) {
    var sec = Math.max(1, Math.ceil(remaining / 1000));
    if (sec !== lastSec) {
      lastSec = sec;
      cdNum.textContent = sec;
      cdNum.classList.remove("tick");
      void cdNum.offsetWidth; // restart animation
      cdNum.classList.add("tick");
      document.getElementById("countdown").classList.toggle("final", sec <= 10);
      body.setAttribute("data-sec", sec);
      hook("onSecond", sec);
    }
    hook("onCountdown", remaining, sec);
    var frac = Math.max(0, Math.min(1, remaining / 60000));
    ring.style.strokeDashoffset = (CIRC * (1 - frac)).toFixed(2);
  }

  /* ───────────── celebration ───────────── */
  var photos = (CFG.PHOTOS || []).filter(function (p) { return !p.hidden; });
  var slots = [];
  var shown = [];   // photo index per slot
  var nextPhoto = 0;
  var photoTimer = null, quoteTimer = null, fwTimers = [];

  // remember each photo's shape so the polaroid can match it
  var loaded = {};
  function load(photo, cb) {
    if (loaded[photo.src]) return cb(loaded[photo.src]);
    var im = new Image();
    im.onload = function () { loaded[photo.src] = im.naturalWidth / im.naturalHeight; cb(loaded[photo.src]); };
    im.onerror = function () { cb(0.8); };
    im.src = photo.src;
  }

  function polaroidEl(photo) {
    var el = document.createElement("div");
    var r = loaded[photo.src] || 0.8;
    el.className = "polaroid" + (r > 1.15 ? " landscape" : r > 0.9 ? " square" : "");
    el.innerHTML = '<div class="photo"></div><div class="cap"></div>';
    el.querySelector(".photo").style.backgroundImage = 'url("' + photo.src + '")';
    el.querySelector(".cap").textContent = photo.caption || "";
    hook("decoratePhoto", el, photo);
    return el;
  }

  function buildSlots() {
    var left = document.getElementById("pl-left");
    var right = document.getElementById("pl-right");
    left.innerHTML = right.innerHTML = "";
    slots = [];
    var count = Math.min(TH.slots || 4, 4, photos.length);
    // order the slots so photos alternate left / right
    var order = [[left, 0], [right, 0], [left, 1], [right, 1]];
    for (var i = 0; i < 4; i++) {
      var s = document.createElement("div");
      s.className = "slot";
      order[i][0].appendChild(s);
    }
    for (var k = 0; k < count; k++) {
      var parent = order[k][0];
      slots.push(parent.children[order[k][1]]);
    }
  }

  function putPhoto(slotIdx, photoIdx) {
    shown[slotIdx] = photoIdx;
    load(photos[photoIdx], function () { swapPhoto(slotIdx, photoIdx); });
  }

  function swapPhoto(slotIdx, photoIdx) {
    var slot = slots[slotIdx];
    var old = slot.querySelector(".polaroid");
    var el = polaroidEl(photos[photoIdx]);
    if (old) {
      old.classList.remove("in");
      old.classList.add("out");
      setTimeout(function () { old.remove(); }, 550);
      setTimeout(function () { slot.appendChild(el); el.classList.add("in"); }, 250);
    } else {
      slot.appendChild(el);
      el.classList.add("in");
    }
  }

  function startPhotos() {
    // warm the cache so nothing pops in late
    photos.forEach(function (p) { load(p, function () {}); });
    buildSlots();
    shown = [];
    slots.forEach(function (_, i) {
      later(PHOTOS_START + i * 650, function () { putPhoto(i, i); });
    });
    nextPhoto = slots.length % Math.max(1, photos.length);
    if (photos.length > slots.length) {
      var turn = 0;
      photoTimer = setInterval(function () {
        if (letterBusy) return; // hold the photos while the letter is on screen
        var slotIdx = turn++ % slots.length;
        // after a full round of photos, the letter comes back once more
        if (LT.text && ++swapsSinceLetter >= photos.length && LT.repeatAfterAllPhotos !== false) { showLetter(); return; }
        // pick the next photo that is not currently on screen
        for (var guard = 0; guard < photos.length; guard++) {
          if (shown.indexOf(nextPhoto) === -1) break;
          nextPhoto = (nextPhoto + 1) % photos.length;
        }
        putPhoto(slotIdx, nextPhoto);
        nextPhoto = (nextPhoto + 1) % photos.length;
      }, TH.photoInterval || CFG.photoSeconds * 1000 || 4000);
    }
  }

  var quoteEl = document.getElementById("quote");
  var quotes = TH.quotes || CFG.QUOTES || [];
  var qi = 0;
  function showQuote(i) {
    var q = quotes[i];
    quoteEl.querySelector(".q-text").textContent = q.text;
    quoteEl.querySelector(".q-by").textContent = q.by ? "— " + q.by : "";
  }
  function startQuotes() {
    if (!quotes.length) return;
    qi = 0;
    showQuote(qi);
    quoteTimer = setInterval(function () {
      quoteEl.classList.add("swap");
      setTimeout(function () {
        qi = (qi + 1) % quotes.length;
        showQuote(qi);
        quoteEl.classList.remove("swap");
      }, 1500);
    }, 12000);
  }

  function later(ms, fn) { fwTimers.push(setTimeout(fn, ms)); }

  /* the letter: ~1 min after the photos start, then again after every full round of photos */
  var PHOTOS_START = 4200;
  var LT = CFG.LETTER || {};
  var letterBusy = false;
  var swapsSinceLetter = 0;
  function showLetter() {
    var L = CFG.LETTER;
    var cel = document.getElementById("celebrate");
    if (!L || !L.text || letterBusy || state !== "celebrate") return;
    letterBusy = true;
    swapsSinceLetter = 0;
    var bodyEl = cel.querySelector(".l-body");
    var signEl = cel.querySelector(".l-sign");
    var chars = Array.from(L.text);
    bodyEl.textContent = "";
    bodyEl.classList.remove("done");
    signEl.textContent = L.signature || "";
    signEl.classList.remove("on");
    cel.classList.add("reading");
    var i = 0;
    var typer = setInterval(function () {
      var ch = chars[i++];
      bodyEl.textContent += ch;
      if (i >= chars.length) {
        clearInterval(typer);
        bodyEl.classList.add("done");
        signEl.classList.add("on");
        later((LT.holdSeconds != null ? LT.holdSeconds : 10) * 1000, function () {
          cel.classList.remove("reading");
          later(1800, function () { letterBusy = false; });
        });
      }
    }, LT.typingMs || 45);
    fwTimers.push(typer);
  }

  function startCelebration(big) {
    var flash = document.querySelector(".flash");
    if (big) { flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go"); }
    if (TH.celebrateFX) {
      hook("celebrateFX", big, later);
    } else if (big) {
      FX.burst(9);
      FX.setFireworks(2.6);
      later(1500, FX.heart);
      later(9000, function () { FX.burst(6); });
      later(14000, function () { FX.setFireworks(1.4); });
      later(26000, FX.heart);
      later(40000, function () { FX.setFireworks(0.5); });
      later(90000, function () { FX.setFireworks(0.18); }); // occasional sparkle forever
    } else {
      FX.setFireworks(0.18);
      later(800, function () { FX.burst(3); });
    }
    if (!TH.celebrateFX) {
      // occasional heart, all night long
      fwTimers.push(setInterval(function () { if (Math.random() < 0.5) FX.heart(); }, 45000));
      later(2500, function () { FX.setPetals(Math.round(Math.min(innerWidth, innerHeight) / 18)); });
      FX.setFireflies(0.6);
    }
    later(PHOTOS_START + (LT.showAfterSeconds != null ? LT.showAfterSeconds : 60) * 1000, showLetter);
    startPhotos();
    startQuotes();
  }

  /* ───────────── state machine ───────────── */
  function setState(s, big) {
    if (state === s) return;
    var prev = state;
    state = s;
    body.classList.remove("state-idle", "state-countdown", "state-celebrate");
    body.classList.add("state-" + s);
    if (s === "idle") { FX.setFireworks(0); FX.setPetals(0); FX.setFireflies(1); }
    if (s === "countdown") { lastSec = -1; FX.setFireflies(0.45); }
    if (s === "celebrate") startCelebration(big !== undefined ? big : prev === "countdown");
    hook("onState", s, prev);
  }

  function tick() {
    var d = now();
    if (state !== "celebrate") {
      var remaining = nextTarget(d) - d;
      if (state === "countdown" && (remaining <= 0 || remaining > 60000)) {
        // crossed midnight (nextTarget already moved on to next year/day)
        setState("celebrate", true);
      } else if (remaining > 0 && remaining <= 60000) {
        setState("countdown");
        renderCountdown(remaining);
      } else if (isBirthday(d) && !daily) {
        setState("celebrate", false);
      } else {
        setState("idle");
        renderIdle(d);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ───────────── test / controls ───────────── */
  function runTest(fromSeconds) {
    var s = Math.max(3, Math.min(60, fromSeconds || 20));
    var realNow = new Date();
    var target = nextTarget(realNow);
    if (!daily && isBirthday(realNow)) {
      // already the birthday: rehearse next year's midnight
      target = new Date(realNow.getFullYear() + 1, CFG.month - 1, CFG.day);
    }
    offset = target.getTime() - s * 1000 + 50 - Date.now();
    resetCelebration();
    setState("idle");
  }

  function resetCelebration() {
    clearInterval(photoTimer); clearInterval(quoteTimer);
    fwTimers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
    fwTimers = [];
    letterBusy = false;
    swapsSinceLetter = 0;
    // restart CSS entry animations
    var c = document.getElementById("celebrate");
    var clone = c.cloneNode(true);
    c.parentNode.replaceChild(clone, c);
    nameEl = document.getElementById("name");
    quoteEl = document.getElementById("quote");
    state = null;
  }

  function toggleFullscreen() {
    var d = document;
    if (!d.fullscreenElement && !d.webkitFullscreenElement) {
      var el = d.documentElement;
      (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
    } else {
      (d.exitFullscreen || d.webkitExitFullscreen || function () {}).call(d);
    }
  }

  /* theme picker */
  var themeSel = document.getElementById("theme-select");
  var TL = window.THEME_LIST || [];
  TL.forEach(function (t) {
    var o = document.createElement("option");
    o.value = t.id; o.textContent = t.label;
    if (t.id === window.THEME_ID) o.selected = true;
    themeSel.appendChild(o);
  });
  function switchTheme(id) {
    var q = new URLSearchParams(location.search);
    q.set("theme", id);
    q.delete("test");
    location.search = q.toString();
  }
  themeSel.addEventListener("change", function () { switchTheme(themeSel.value); });
  themeSel.addEventListener("keydown", function (e) { e.stopPropagation(); });

  // test controls & shortcuts exist only on /roksa25/test/ (which opens ?controls)
  var testMode = params.has("controls");
  if (testMode) body.classList.add("show-controls");
  function celebrateNow() { resetCelebration(); setState("celebrate", true); }
  function letterNow() { if (state !== "celebrate") setState("celebrate", false); setTimeout(showLetter, 300); }
  function resetNow() { offset = 0; resetCelebration(); setState("idle"); }
  function onClick(id, fn) { document.getElementById(id).addEventListener("click", function (e) { e.stopPropagation(); fn(); }); }
  Array.prototype.forEach.call(document.querySelectorAll("[data-test]"), function (b) {
    b.addEventListener("click", function (e) { e.stopPropagation(); runTest(+b.getAttribute("data-test")); });
  });
  onClick("btn-cel", celebrateNow);
  onClick("btn-letter", letterNow);
  onClick("btn-reset", resetNow);
  onClick("btn-fs", toggleFullscreen);
  document.addEventListener("dblclick", toggleFullscreen);
  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if (k === "f") return toggleFullscreen();
    if (!testMode) return;
    if (k === "t") runTest(e.shiftKey ? 60 : 20);
    else if (k === "c") celebrateNow();
    else if (k === "l") letterNow();
    else if (k === "r" || k === "escape") resetNow();
    else if (/^[1-9]$/.test(k) && TL[+k - 1]) switchTheme(TL[+k - 1].id);
  });

  // hide cursor & buttons when nobody touches the mouse
  var idleTimer;
  function wake() {
    body.classList.remove("hide-cursor");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { body.classList.add("hide-cursor"); }, 8000);
  }
  ["mousemove", "mousedown", "keydown", "touchstart"].forEach(function (ev) { document.addEventListener(ev, wake, { passive: true }); });
  wake();

  // keep the TV from dimming
  var lock = null;
  function keepAwake() {
    if (!("wakeLock" in navigator) || lock) return;
    navigator.wakeLock.request("screen").then(function (l) {
      lock = l;
      l.addEventListener("release", function () { lock = null; });
    }).catch(function () {});
  }
  keepAwake();
  document.addEventListener("click", keepAwake);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) keepAwake(); });

  /* ───────────── go ───────────── */
  hook("setup");
  if (params.has("celebrate")) { setState("celebrate", true); }
  else if (params.has("test")) { runTest(parseInt(params.get("test"), 10) || 20); }
  requestAnimationFrame(tick);
})();
