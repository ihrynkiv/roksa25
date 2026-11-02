/*
 * ─────────────────────────────────────────────────────────────
 *  Everything you might want to edit lives in this file.
 * ─────────────────────────────────────────────────────────────
 *
 *  Adding photos: put the file in assets/photos/ and add a line to
 *  PHOTOS below. `caption` is the handwritten line under the polaroid.
 *  Portrait photos (taller than wide) look best.
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
    { src: "assets/photos/5.jpg", caption: "головна героїня мого роману" },
    { src: "assets/photos/2.jpg", caption: "світ — твоїми очима" },
    { src: "assets/photos/3.jpg", caption: "затишок має обличчя" },
    { src: "assets/photos/4.jpg", caption: "найсерйозніше фото року" },
    { src: "assets/photos/1.jpg", caption: "Львів у жовтому, твоїм об'єктивом" },
  ],

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
