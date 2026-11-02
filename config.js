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
  name: "Роксолано",          // vocative, used in "З днем народження, …"
  nameShort: "Роксолана",
  age: 25,
  month: 11,                   // November
  day: 4,                      // the countdown runs 23:59:00 → 00:00 into this day

  // true = run the countdown every night at 23:59 (also enabled with ?daily in the URL)
  everyMidnight: false,

  PHOTOS: [
    { src: "assets/photos/bw-selfie.jpg",       caption: "головна героїня мого роману" },
    { src: "assets/photos/winter-walk.jpg",     caption: "та сама зима, з якої все почалося" },
    { src: "assets/photos/ladybug.jpg",         caption: "квіти — від мене, кадр — від тебе" },
    { src: "assets/photos/kyiv-kiss.jpg",       caption: "туристи в Києві, закохані всюди" },
    { src: "assets/photos/hamster.jpg",         caption: "найсерйозніше фото року" },
    { src: "assets/photos/amsterdam.jpg",       caption: "Амстердам, вперше і на сонці" },
    { src: "assets/photos/us-selfie.jpg",       caption: "моя улюблена команда з двох" },
    { src: "assets/photos/kitty.jpg",           caption: "дві наймʼякші істоти в домі" },
    { src: "assets/photos/kyiv-binoculars.jpg", caption: "вдивляється в майбутнє (там я)" },
    { src: "assets/photos/towel.jpg",           caption: "затишок має обличчя" },
    { src: "assets/photos/work-party.jpg",      caption: "That one night. Корпоративна версія" },
    { src: "assets/photos/her-selfie.jpg",      caption: "просто красива. без підпису" },
    { src: "assets/photos/tea.jpg",             caption: "чай?! а де моя V60-дівчинка" },
    { src: "assets/photos/couple-fun.jpg",      caption: "офіційно дивакуваті разом" },
    { src: "assets/photos/bestie.jpg",          caption: "старі добрі часи" },
    { src: "assets/photos/lviv-yellow.jpg",     caption: "Львів у жовтому, твоїм обʼєктивом" },
    { src: "assets/photos/kyiv-together.jpg",   caption: "ми + Київ" },
    { src: "assets/photos/home-fun.jpg",        caption: "домашня, справжня, моя" },
    { src: "assets/photos/color-date.jpg",      caption: "наше кольорове побачення" },
    { src: "assets/photos/her-selfie-2.jpg",    caption: "ще одна, бо не можу обрати" },
    // { src: "assets/photos/work-party-trio.jpg", caption: "" },
  ],

  // A letter that writes itself on screen ~1 minute after midnight, then every 5 minutes.
  // Edit freely — line breaks are kept. Press L to preview it.
  LETTER: {
    text:
      "Роксолано,\n\n" +
      "двадцять пʼять років тому світ отримав людину, яка читає «Грозовий перевал», як лист від старого друга, " +
      "заварює V60, ніби це маленька медитація, і сміється з Двайта до сліз.\n\n" +
      "А я отримав тебе — і досі не можу повірити, що мені так пощастило.\n\n" +
      "Дякую за кожну зиму, кожне місто і кожну пісню, яку ми слухали разом. " +
      "Хай цей рік буде теплим, як твоя улюблена кава, і довгим, як хороша книжка.\n\n" +
      "З днем народження, моя найулюбленіша історія.",
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
