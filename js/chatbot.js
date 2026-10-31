/* Smoke Smart Spokane chatbot (English).
   Method: TF-IDF cosine similarity over a reviewed FAQ bank,
   plus rule-based safety checks, AQI lookup and a teach-back quiz.
   Runs fully in the browser. No data leaves the page. */
(function () {
  "use strict";

  var FAQ = window.SMOKE_FAQ, AQI = window.SMOKE_AQI, NOTE = window.SMOKE_WORKER_NOTE, QUIZ = window.SMOKE_QUIZ;

  var STOP = ("a an the is are was were be been am i me my we our you your it its of to in on at for with and or but if then so do does did can could " +
    "should would will how what when where why who which this that these those there about into from as by not no yes please tell").split(" ");
  var STOPSET = {};
  STOP.forEach(function (w) { STOPSET[w] = 1; });

  function tokens(s) {
    return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(function (t) {
      return t && !STOPSET[t];
    }).map(function (t) { return t.length > 3 ? t.replace(/(es|s)$/, "") : t; });
  }

  // Questions and keywords count more than answer text.
  var docs = FAQ.map(function (f) {
    return tokens([f.q, f.q, f.q, f.kw, f.kw, f.a].join(" "));
  });
  var df = {};
  docs.forEach(function (d) {
    var seen = {};
    d.forEach(function (t) { if (!seen[t]) { df[t] = (df[t] || 0) + 1; seen[t] = 1; } });
  });
  var N = docs.length;
  function idf(t) { return Math.log((N + 1) / ((df[t] || 0) + 0.5)); }
  function vec(ts) {
    var v = {}, len = ts.length || 1;
    ts.forEach(function (t) { v[t] = (v[t] || 0) + 1 / len; });
    Object.keys(v).forEach(function (t) { v[t] *= idf(t); });
    return v;
  }
  function cos(a, b) {
    var dot = 0, na = 0, nb = 0, k;
    for (k in a) { na += a[k] * a[k]; if (b[k]) dot += a[k] * b[k]; }
    for (k in b) nb += b[k] * b[k];
    return na && nb ? dot / Math.sqrt(na * nb) : 0;
  }
  var dvecs = docs.map(vec);
  function rank(query) {
    var qv = vec(tokens(query));
    return dvecs.map(function (dv, i) { return { i: i, s: cos(qv, dv) }; }).sort(function (a, b) { return b.s - a.s; });
  }

  var EMERGENCY = /(can'?t|cannot|unable to|hard to)\s+breathe|struggling to breathe|chest pain|passed out|fainted|fainting|unconscious|911/i;
  function aqiLookup(n) {
    for (var i = 0; i < AQI.length; i++) if (n <= AQI[i].max) return AQI[i];
    return AQI[AQI.length - 1];
  }
  function parseAqi(text) {
    var m = text.match(/\baqi\b\D{0,12}(\d{1,3})\b/i) || text.match(/^\s*(\d{1,3})\s*$/);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    return n <= 500 ? n : null;
  }

  var root = document.getElementById("chatbot");
  if (!root) return;
  var log = root.querySelector(".chat-log");
  var form = root.querySelector("form");
  var input = root.querySelector("input[type=text]");
  var chips = root.querySelector(".chat-chips");
  var quizBtn = root.querySelector("[data-quiz]");
  var clearBtn = root.querySelector("[data-clear]");
  var DEFAULT_CHIPS = [3, 0, 4, 7, 18];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function addMsg(who, text, src, color) {
    var wrap = el("div", "msg " + who);
    wrap.appendChild(el("span", "msg-who", who === "user" ? "You said" : "Chatbot"));
    if (color) {
      var sw = el("span", "msg-swatch");
      sw.style.background = color;
      sw.setAttribute("aria-hidden", "true");
      wrap.appendChild(sw);
    }
    wrap.appendChild(el("p", "msg-body", text));
    if (src) wrap.appendChild(el("span", "msg-src", "Source: " + src));
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }
  function setChips(ids, label) {
    chips.innerHTML = "";
    chips.appendChild(el("span", "chip-label", label || "Try asking:"));
    ids.forEach(function (i) {
      var b = el("button", "chip", FAQ[i].q);
      b.type = "button";
      b.addEventListener("click", function () { ask(FAQ[i].q); });
      chips.appendChild(b);
    });
  }
  function reset() {
    log.innerHTML = "";
    addMsg("bot", "Hi! I answer questions about wildfire smoke in Spokane County. Pick a question, type your own, or type an AQI number like \"AQI 130\".");
    setChips(DEFAULT_CHIPS);
  }

  function ask(text) {
    text = text.trim();
    if (!text) return;
    addMsg("user", text);
    if (EMERGENCY.test(text)) {
      addMsg("bot", "If you or someone else has severe trouble breathing, chest pain or fainting, call 911 now. Do not wait for a chatbot.", "911");
      return;
    }
    var n = parseAqi(text);
    if (n !== null) {
      var row = aqiLookup(n);
      var parts = ["AQI " + n + ": " + row.name + ". " + row.text];
      if (n >= 101) parts.push(NOTE.high);
      else if (n >= 69) parts.push(NOTE.low);
      addMsg("bot", parts.join("\n\n"), "AirNow AQI categories; WA L&I", row.color);
      setChips([3, 4, 5]);
      return;
    }
    var r = rank(text);
    if (r[0].s >= 0.16) {
      var f = FAQ[r[0].i];
      addMsg("bot", f.a, f.src);
      var follow = r.slice(1, 4).filter(function (x) { return x.s > 0.05; }).map(function (x) { return x.i; });
      setChips(follow.length ? follow : DEFAULT_CHIPS);
    } else {
      addMsg("bot", "I am not sure about that one. Here are questions I can answer:");
      setChips(DEFAULT_CHIPS);
    }
  }

  function runQuiz(idx, score) {
    if (idx === 0) addMsg("bot", "Quick check. Three questions. There are no wrong answers, only practice.");
    if (idx >= QUIZ.length) {
      addMsg("bot", "You got " + score + " of " + QUIZ.length + ". Ask me any question to review the ones you missed.");
      setChips(DEFAULT_CHIPS);
      return;
    }
    var item = QUIZ[idx];
    addMsg("bot", (idx + 1) + ". " + item.q);
    chips.innerHTML = "";
    chips.appendChild(el("span", "chip-label", (idx + 1) + " of " + QUIZ.length));
    item.opts.forEach(function (opt, k) {
      var b = el("button", "chip", opt);
      b.type = "button";
      b.addEventListener("click", function () {
        addMsg("user", opt);
        var good = k === item.ok;
        addMsg("bot", (good ? "Correct. " : "Not quite. ") + item.fb);
        runQuiz(idx + 1, score + (good ? 1 : 0));
      });
      chips.appendChild(b);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    ask(v);
    input.focus();
  });
  quizBtn.addEventListener("click", function () { runQuiz(0, 0); });
  clearBtn.addEventListener("click", reset);
  reset();

  window.SmokeBot = { rank: rank, parseAqi: parseAqi, FAQ: FAQ };
})();
