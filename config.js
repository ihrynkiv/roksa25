/*
 * ─────────────────────────────────────────────────────────────
 *  Everything you might want to edit lives in this file.
 * ─────────────────────────────────────────────────────────────
 *
 *  Adding photos: put the file in assets/photos/ and add a line to
 *  PHOTOS below. `caption` is the handwritten line under the polaroid.
 *  Portrait, landscape and square photos all work: the polaroid adapts.
 */
window.BIRTHDAY = {
  name: "Роксо",               // vocative, used in "З днем народження, …"
  nameShort: "Рокса",          // used everywhere the name stands on its own
  age: 25,
  month: 11,                   // November
  day: 4,                      // the countdown runs 23:59:00 → 00:00 into this day

  // true = run the countdown every night at 23:59 (also enabled with ?daily in the URL)
  everyMidnight: false,

  // Theme for the plain address /roksa25/ : classic | dopamine | kitty | magazine | vinyl | office
  // Other themes: /roksa25/<theme>/ or ?theme=<theme>.  Test buttons: /roksa25/test/
  theme: "kitty",

  // One photo card changes every `photoSeconds`. With 4 cards on screen each photo stays ~4× that.
  // (Magazine shows one big photo, so it uses 6 s per photo.)
  photoSeconds: 4,

  // The photos and their titles live in photos.js (easiest to edit via /roksa25/gallery/).


  // A letter that writes itself on screen. Edit freely — line breaks are kept. Press L to preview it.
  //   midnight → photos start → after `showAfterSeconds` the letter types itself (photos pause)
  //   → stays `holdSeconds` after the last word → photos continue.
  //   After a full round of all photos the letter comes back once more.
  LETTER: {
    showAfterSeconds: 60,
    holdSeconds: 10,
    typingMs: 45,              // per character
    repeatAfterAllPhotos: true,
    text:
      "Роксо,\n\n" +
      "тобі 25, моя улюблена людино!\n" +
      "Світ отримав тебе 25 років тому, а я вже рік дико радий, що ти є в моєму житті.\n\n" +
      "Бажаю, щоб цей новий рік твого життя був легким і сповненим памʼятних днів і пригод, " +
      "які ми ще довго згадуватимемо як моменти сміху, жартів і щасливих митей.\n\n" +
      "Міцно обіймаю тебе (просто зараз, IRL) і щиро люблю. " +
      "Рости великою (але не надто, бо станеш більшою за мене).",
    signature: "Твій Іван",
  },

  // Lines that slowly rotate at the bottom after midnight.
  QUOTES: [
    { text: "Whatever our souls are made of, yours and mine are the same.", by: "майже Емілі Бронте" },
    { text: "Радий бути частиною твого життя", by: "я" },
    { text: "Bears. Beets. Birthday cake.", by: "Dwight Schrute (неофіційно)" },
    { text: "Люблю тебе і маю на те купу причин, які готовий завжди розповісти", by: "я" },
    { text: "A girl has a name. And today it's on every screen in the house.", by: "Браавос пам'ятає" },
    { text: "Side A: 25 років. Side B: всі наступні — разом.", by: "наш вініл" },
  ],
};
