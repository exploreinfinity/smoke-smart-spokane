// Loads the site in headless Chromium, tests the chatbot and layout, and writes docs/chatbot-test.md.
// Usage (from the site folder): python3 -m http.server 8765 &   then:   node tools/test-site.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const BASE = process.env.BASE || "http://localhost:8765/";

// Each question is a paraphrase that does not copy the stored question text.
const RANK_TESTS = [
  ["what is the air quality index", "what-aqi"], ["what do the AQI colors mean", "what-aqi"],
  ["where can I see today's air quality", "where-check"], ["which website shows smoke levels in Spokane", "where-check"],
  ["who is sensitive to smoke", "who-sensitive"], ["are kids at higher risk from wildfire smoke", "who-sensitive"],
  ["can my kid go to recess when it is smoky", "kids-outside"], ["should my child play soccer outside today", "kids-outside"],
  ["does an N95 work against smoke", "masks"], ["are cloth masks useful for wildfire smoke", "masks"],
  ["how do I set up a clean room at home", "clean-room"], ["what can I do to make my bedroom safer from smoke", "clean-room"],
  ["how to build a cheap air filter with a box fan", "diy-filter"], ["I cannot afford an air purifier", "diy-filter"],
  ["where can I go if my house has no clean air", "no-clean-air"], ["is there a friend's place or public space with cleaner air", "no-clean-air"],
  ["what do I do with my air conditioner during smoke", "hvac-car"], ["should I use recirculate in my car", "hvac-car"],
  ["should I open the windows", "windows"], ["what are the symptoms of breathing smoke", "symptoms"],
  ["when should I go to the hospital because of smoke", "symptoms"], ["my son has asthma how do I prepare", "asthma"],
  ["I am pregnant is smoke dangerous", "pregnant-older"], ["what are my rights as a construction worker in smoke", "workers"],
  ["does my employer have to give me a respirator", "workers"], ["when does the high school cancel football for smoke", "sports"],
  ["why does the AQI change every hour", "why-changes"], ["tell me about the Spokane Complex fire in 2026", "this-summer"],
  ["how many homes burned in August", "this-summer"], ["how many smoke days does Spokane get per year", "how-often"],
  ["my home burned where can I get assistance", "fire-help"], ["who do I call for evacuee recovery help", "fire-help"],
  ["I am young and fit so smoke does not matter right", "healthy-myth"], ["is this chatbot real medical advice", "about-bot"],
];
const UI_TESTS = [
  ["AQI 130", /sensitive/i, "AQI lookup, orange"],
  ["250", /Very unhealthy/i, "Bare number lookup"],
  ["AQI 45", /Good/i, "AQI lookup, good"],
  ["I can't breathe", /911/, "Emergency keyword"],
  ["I have chest pain", /911/, "Emergency keyword, chest pain"],
  ["what is pizza", /not sure/i, "Out-of-scope fallback"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [], failed = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) failed.push(r.status() + " " + r.url()); });
  await page.goto(BASE, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const rows = await page.evaluate((tests) => tests.map(([q, exp]) => {
    const r = window.SmokeBot.rank(q), f = window.SmokeBot.FAQ;
    return { q, exp, got: f[r[0].i].id, score: +r[0].s.toFixed(2), second: f[r[1].i].id };
  }), RANK_TESTS);
  const ok = rows.filter((r) => r.exp === r.got).length;
  const top2 = rows.filter((r) => r.exp === r.got || r.exp === r.second).length;
  const faqCount = await page.evaluate(() => window.SmokeBot.FAQ.length);

  const ui = [];
  for (const [text, re, label] of UI_TESTS) {
    await page.click("[data-clear]");
    await page.fill("#chat-input", text);
    await page.press("#chat-input", "Enter");
    const last = await page.locator(".msg.bot .msg-body").last().innerText();
    ui.push({ label, text, pass: re.test(last), reply: last.slice(0, 90).replace(/\n/g, " ") });
  }
  await page.click("[data-clear]");
  await page.fill("#chat-input", "AQI 85");
  await page.press("#chat-input", "Enter");
  let t = await page.locator(".msg.bot .msg-body").last().innerText();
  ui.push({ label: "Worker training note appears at AQI 85", text: "AQI 85", pass: /69/.test(t), reply: t.slice(-90).replace(/\n/g, " ") });
  await page.fill("#chat-input", "AQI 130");
  await page.press("#chat-input", "Enter");
  t = await page.locator(".msg.bot .msg-body").last().innerText();
  ui.push({ label: "Respirator note appears at AQI 130", text: "AQI 130", pass: /101/.test(t), reply: t.slice(-90).replace(/\n/g, " ") });
  await page.click("[data-clear]");
  await page.click("[data-quiz]");
  for (const c of ["101", "A well-fitted N95 respirator", "Close windows and run a HEPA or MERV 13 filter"]) await page.locator(".chat-chips .chip", { hasText: c }).first().click();
  t = await page.locator(".msg.bot .msg-body").last().innerText();
  ui.push({ label: "Quiz completes with 3 of 3", text: "(quiz)", pass: /3 of 3/.test(t), reply: t });
  await page.click("[data-clear]");
  await page.locator(".chat-chips .chip").first().click();
  t = await page.locator(".msg.bot .msg-body").last().innerText();
  ui.push({ label: "Suggested question chip returns an answer", text: "(chip)", pass: t.length > 40, reply: t.slice(0, 60) });

  // Language toggle for poster and flyer
  await page.click(".toggle button[data-ml='es']");
  const esShown = (await page.locator("img.es-only").first().isVisible()) && !(await page.locator("img.en-only").first().isVisible());
  ui.push({ label: "Spanish toggle shows Spanish poster and flyer", text: "(toggle)", pass: esShown, reply: "" });
  await page.click(".toggle button[data-ml='en']");

  const imgs = await page.evaluate(() => Array.from(document.images).map((i) => ({ src: i.getAttribute("src"), alt: i.alt, ok: i.complete && i.naturalWidth > 0 })));
  const brokenImgs = imgs.filter((i) => !i.ok), missingAlt = imgs.filter((i) => !i.alt);
  const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);

  for (const id of ["top", "why", "steps", "who", "goals", "framework", "literacy", "logic", "materials", "chatbot-section"]) {
    await page.locator("#" + id).screenshot({ path: `/tmp/s-${id}.png` });
  }
  const mobile = await browser.newPage({ viewport: { width: 390, height: 800 } });
  await mobile.goto(BASE, { waitUntil: "load" });
  await mobile.evaluate(() => document.fonts.ready);
  const mOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  await mobile.locator("#top").screenshot({ path: "/tmp/s-mobile-top.png" });
  await mobile.locator("#chatbot-section").screenshot({ path: "/tmp/s-mobile-chat.png" });
  await browser.close();

  const md = ["# Chatbot offline test", "",
    `Run date: ${new Date().toISOString().slice(0, 10)}. Each test question is a paraphrase that does not copy the stored question. The bot returns its top match. A reviewer set the expected answer first.`, "",
    `**Answer bank size:** ${faqCount}`, `**Top-1 accuracy:** ${ok} of ${rows.length} (${Math.round((ok / rows.length) * 100)} percent)`,
    `**Right answer in top 2:** ${top2} of ${rows.length}`, "", "| Question | Expected | Got | Score | Match |", "|---|---|---|---|---|"];
  rows.forEach((r) => md.push(`| ${r.q} | ${r.exp} | ${r.got} | ${r.score} | ${r.exp === r.got ? "yes" : "no"} |`));
  md.push("", "## Behavior tests (typed into the live widget)", "", "| Test | Input | Pass |", "|---|---|---|");
  ui.forEach((r) => md.push(`| ${r.label} | ${r.text} | ${r.pass ? "yes" : "NO"} |`));
  fs.writeFileSync(path.join(__dirname, "..", "docs", "chatbot-test.md"), md.join("\n") + "\n");

  console.log(JSON.stringify({ faqCount, ok, top2, total: rows.length, miss: rows.filter((r) => r.exp !== r.got), uiFail: ui.filter((u) => !u.pass), errors, failed, brokenImgs, missingAlt, hOverflow, mOverflow }, null, 1));
})();
