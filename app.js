/*
 * The clock & the show.
 *
 *  idle       → wallpaper with a live clock
 *  countdown  → 23:59:00 … 23:59:59 the night before the birthday (60 → 1)
 *  celebrate  → 00:00 and the whole birthday day
 *
 *  Keys:  T = test (start the 60 s countdown now)   C = skip straight to the celebration
 *         F = fullscreen                            R / Esc = back to real time
 *  URL:   ?test       start the test countdown on load (?test=10 → from 10 s)
 *         ?daily      run the countdown every night at 23:59
 *         ?celebrate  open directly in celebration mode
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
    }
    var frac = Math.max(0, Math.min(1, remaining / 60000));
    ring.style.strokeDashoffset = (CIRC * (1 - frac)).toFixed(2);
  }

  /* ───────────── celebration ───────────── */
  var photos = (CFG.PHOTOS || []).slice();
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
    return el;
  }

  function buildSlots() {
    var left = document.getElementById("pl-left");
    var right = document.getElementById("pl-right");
    left.innerHTML = right.innerHTML = "";
    slots = [];
    var count = Math.min(4, photos.length);
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
      setTimeout(function () { old.remove(); }, 1300);
      setTimeout(function () { slot.appendChild(el); el.classList.add("in"); }, 700);
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
      setTimeout(function () { putPhoto(i, i); }, 4200 + i * 650);
    });
    nextPhoto = slots.length % Math.max(1, photos.length);
    if (photos.length > slots.length) {
      var turn = 0;
      photoTimer = setInterval(function () {
        var slotIdx = turn++ % slots.length;
        // pick the next photo that is not currently on screen
        for (var guard = 0; guard < photos.length; guard++) {
          if (shown.indexOf(nextPhoto) === -1) break;
          nextPhoto = (nextPhoto + 1) % photos.length;
        }
        putPhoto(slotIdx, nextPhoto);
        nextPhoto = (nextPhoto + 1) % photos.length;
      }, 8000);
    }
  }

  var quoteEl = document.getElementById("quote");
  var quotes = CFG.QUOTES || [];
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

  function startCelebration(big) {
    var flash = document.querySelector(".flash");
    if (big) {
      flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go");
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
    // occasional heart, all night long
    fwTimers.push(setInterval(function () { if (Math.random() < 0.5) FX.heart(); }, 45000));
    later(2500, function () { FX.setPetals(Math.round(Math.min(innerWidth, innerHeight) / 18)); });
    FX.setFireflies(0.6);
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
    var s = Math.max(3, Math.min(60, fromSeconds || 60));
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

  document.getElementById("btn-test").addEventListener("click", function (e) { e.stopPropagation(); runTest(60); });
  document.getElementById("btn-fs").addEventListener("click", function (e) { e.stopPropagation(); toggleFullscreen(); });
  document.addEventListener("dblclick", toggleFullscreen);
  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if (k === "t") runTest(e.shiftKey ? 10 : 60);
    else if (k === "c") { resetCelebration(); setState("celebrate", true); }
    else if (k === "f") toggleFullscreen();
    else if (k === "r" || k === "escape") { offset = 0; resetCelebration(); setState("idle"); }
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
  if (params.has("celebrate")) { setState("celebrate", true); }
  else if (params.has("test")) { runTest(parseInt(params.get("test"), 10) || 60); }
  requestAnimationFrame(tick);
})();
