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

  // Theme for the plain address /roksa25/ : classic | dopamine | kitty | magazine | vinyl
  // Other themes: /roksa25/<theme>/ or ?theme=<theme>.  Test buttons: /roksa25/test/
  theme: "kitty",

  // One photo card changes every `photoSeconds`. With 4 cards on screen each photo stays ~4× that.
  // (Magazine shows one big photo, so it uses 6 s per photo.)
  photoSeconds: 4,

  // Photos are shown in this order. To change a title, edit the text in quotes after `caption:`.
  PHOTOS: [
    { src: "assets/photos/us-two.jpg",            caption: "просто ми" },
    { src: "assets/photos/bw-selfie.jpg",         caption: "головна героїня мого роману" },
    { src: "assets/photos/winter-walk.jpg",       caption: "та сама зима, з якої все почалося" },
    { src: "assets/photos/elevator-flowers.jpg",  caption: "квіти від мене їдуть додому" },
    { src: "assets/photos/kyiv-kiss.jpg",         caption: "туристи в Києві, закохані всюди" },
    { src: "assets/photos/weeknd-cph.jpg",        caption: "The Weeknd, Копенгаген" },
    { src: "assets/photos/cafe-date.jpg",         caption: "наше побачення в кавʼярні" },
    { src: "assets/photos/her-kitty.jpg",         caption: "мур-режим увімкнено" },
    { src: "assets/photos/odesa-sea.jpg",         caption: "Одеса, море і ти" },
    { src: "assets/photos/tongue.jpg",            caption: "серйозність: 0%" },
    { src: "assets/photos/color-date-us.jpg",     caption: "кольорове побачення, ми" },
    { src: "assets/photos/amsterdam-fav.jpg",     caption: "її улюблене місто" },
    { src: "assets/photos/hamster.jpg",           caption: "найсерйозніше фото року" },
    { src: "assets/photos/summer.jpg",            caption: "наше літо" },
    { src: "assets/photos/rocknroll.jpg",         caption: "трішки рок-н-ролу" },
    { src: "assets/photos/garden.jpg",            caption: "наш садок біля дому" },
    { src: "assets/photos/sleepy.jpg",            caption: "ще пʼять хвилиночок…" },
    { src: "assets/photos/cph-mermaid.jpg",       caption: "Копенгаген, привіт Русалоньці" },
    { src: "assets/photos/odyssey.jpg",           caption: "кіновечір: «Одіссея»" },
    { src: "assets/photos/mirror.jpg",            caption: "дзеркало знає, хто тут найкраща" },
    { src: "assets/photos/us-sea.jpg",            caption: "ми і море" },
    { src: "assets/photos/dentist.jpg",           caption: "перед стоматологом: сміливість 100%" },
    { src: "assets/photos/ladybug.jpg",           caption: "квіти — від мене, кадр — від тебе" },
    { src: "assets/photos/denmark.jpg",           caption: "десь у Данії" },
    { src: "assets/photos/us-selfie.jpg",         caption: "моя улюблена команда з двох" },
    { src: "assets/photos/my-flat.jpg",           caption: "у мене вдома, як у себе" },
    { src: "assets/photos/plane.jpg",             caption: "у небі" },
    { src: "assets/photos/tea.jpg",               caption: "чай?! а де моя V60-дівчинка" },
    { src: "assets/photos/color-date-her.jpg",    caption: "кольорове побачення, кольорова ти" },
    { src: "assets/photos/kyiv-binoculars.jpg",   caption: "вдивляється в майбутнє (там я)" },
    { src: "assets/photos/at-work.jpg",           caption: "робоча, але найкраща" },
    { src: "assets/photos/amsterdam-2.jpg",       caption: "ще трохи Амстердама" },
    { src: "assets/photos/dog-winter.jpg",        caption: "зима, сніг і песик" },
    { src: "assets/photos/bathroom.jpg",          caption: "селфі-сесія у ванній" },
    { src: "assets/photos/couple-fun.jpg",        caption: "офіційно дивакуваті разом" },
    { src: "assets/photos/towel.jpg",             caption: "затишок має обличчя" },
    { src: "assets/photos/plane-selfie.jpg",      caption: "летимо!" },
    { src: "assets/photos/amsterdam.jpg",         caption: "Амстердам, вперше і на сонці" },
    { src: "assets/photos/kitty.jpg",             caption: "дві наймʼякші істоти в домі" },
    { src: "assets/photos/work-party.jpg",        caption: "That one night. Корпоративна версія" },
    { src: "assets/photos/her-selfie.jpg",        caption: "просто красива. без підпису" },
    { src: "assets/photos/bestie.jpg",            caption: "старі добрі часи" },
    { src: "assets/photos/lviv-yellow.jpg",       caption: "Львів у жовтому, твоїм обʼєктивом" },
    { src: "assets/photos/kyiv-together.jpg",     caption: "ми + Київ" },
    { src: "assets/photos/home-fun.jpg",          caption: "домашня, справжня, моя" },
    { src: "assets/photos/color-date.jpg",        caption: "наше кольорове побачення" },
    { src: "assets/photos/her-selfie-2.jpg",      caption: "ще одна, бо не можу обрати" },
    // { src: "assets/photos/work-party-trio.jpg", caption: "" },
  ],

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
    { text: "Двадцять п'ять років світові щастить із тобою. А мені — найбільше.", by: "я" },
    { text: "Bears. Beets. Birthday cake.", by: "Dwight Schrute (неофіційно)" },
    { text: "Повільно, уважно, з любов'ю — як V60 о восьмій ранку. Так я хочу прожити з тобою кожен рік.", by: "я" },
    { text: "A girl has a name. And today it's on every screen in the house.", by: "Браавос пам'ятає" },
    { text: "Side A: 25 років. Side B: всі наступні — разом.", by: "наш вініл" },
  ],
};
