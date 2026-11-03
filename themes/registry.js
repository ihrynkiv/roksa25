/*
 * Theme registry. Each theme = themes/<id>.css (look) + themes/<id>.js (decorations & hooks).
 * Choice: ?theme=<id> in the URL (the /<id>/ links add it), otherwise config.js `theme` (Kitty).
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
    if (q && ids.indexOf(q) !== -1) id = q;
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
