/*
 * Theme registry. Each theme = themes/<id>.css (look) + themes/<id>.js (decorations & hooks).
 * Choice order: ?theme=<id> in the URL → last choice saved on this device → config.js `theme`.
 */
(function () {
  var LIST = [
    { id: "classic",  label: "🌸 Classic — moody bloom" },
    { id: "dopamine", label: "🍭 Dopamine — colour pop" },
    { id: "kitty",    label: "🐱 Kitty — pink cartoon" },
    { id: "magazine", label: "📰 Magazine — cover story" },
    { id: "vinyl",    label: "💿 Vinyl — record club" }
  ];
  var ids = LIST.map(function (t) { return t.id; });
  var id = null;
  try {
    var q = new URLSearchParams(location.search).get("theme");
    if (q && ids.indexOf(q) !== -1) { id = q; localStorage.setItem("roksa-theme", q); }
    if (!id) {
      var saved = localStorage.getItem("roksa-theme");
      if (saved && ids.indexOf(saved) !== -1) id = saved;
    }
  } catch (e) {}
  if (!id) id = (window.BIRTHDAY && ids.indexOf(window.BIRTHDAY.theme) !== -1) ? window.BIRTHDAY.theme : "classic";

  window.THEME_LIST = LIST;
  window.THEME_ID = id;
  document.documentElement.setAttribute("data-theme", id);
  if (id !== "classic") {
    document.write('<link rel="stylesheet" href="themes/_modern.css">');
    document.write('<link rel="stylesheet" href="themes/' + id + '.css">');
  }
})();
