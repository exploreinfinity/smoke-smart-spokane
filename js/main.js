(function () {
  "use strict";

  // Language toggle for the school poster and worksite flyer (English / Español).
  var btns = document.querySelectorAll(".toggle button[data-ml]");
  function setLang(l) {
    document.body.setAttribute("data-ml", l);
    btns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-ml") === l ? "true" : "false");
    });
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-ml")); });
  });
  setLang("en");

  // Hide the video setup hint once a video file loads.
  var v = document.getElementById("campaignVideo");
  var hint = document.getElementById("videoHint");
  if (v && hint) v.addEventListener("loadedmetadata", function () { hint.style.display = "none"; });
})();
