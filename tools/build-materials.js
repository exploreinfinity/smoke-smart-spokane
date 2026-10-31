// Builds the campaign graphics (PNG) from HTML templates.
// Run from the site folder:  npm i playwright && npx playwright install chromium && node tools/build-materials.js
// Output: assets/*.png (English posts, poster and flyer in English and Spanish).
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const OUT = path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });

const FONTS = `
@font-face{font-family:'Fraunces';font-weight:400;font-style:normal;src:url('../../assets/fonts/fraunces-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Fraunces';font-weight:500;font-style:normal;src:url('../../assets/fonts/fraunces-latin-500-normal.woff2') format('woff2')}
@font-face{font-family:'Fraunces';font-weight:600;font-style:normal;src:url('../../assets/fonts/fraunces-latin-600-normal.woff2') format('woff2')}
@font-face{font-family:'Fraunces';font-weight:400;font-style:italic;src:url('../../assets/fonts/fraunces-latin-400-italic.woff2') format('woff2')}
@font-face{font-family:'Public Sans';font-weight:400;src:url('../../assets/fonts/public-sans-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Public Sans';font-weight:500;src:url('../../assets/fonts/public-sans-latin-500-normal.woff2') format('woff2')}
@font-face{font-family:'Public Sans';font-weight:600;src:url('../../assets/fonts/public-sans-latin-600-normal.woff2') format('woff2')}
@font-face{font-family:'Public Sans';font-weight:700;src:url('../../assets/fonts/public-sans-latin-700-normal.woff2') format('woff2')}
body{margin:0}`;
const page = (lang, title, body) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${title}</title><style>${FONTS}</style></head><body>${body}</body></html>`;
const SERIF = "'Fraunces',Georgia,serif";
const SANS = "'Public Sans',system-ui,sans-serif";

// ---------- Social post 1 ----------
function social1() {
  const rows = [
    ["#A8D8B9", "0 to 50", "Good.", "Enjoy the outdoors."],
    ["#F3E3A0", "51 to 100", "Moderate.", "Fine for most. Watch symptoms."],
    ["#F5C48F", "101 to 150", "Sensitive groups.", "Take it easy."],
    ["#EFA3A0", "151 to 200", "Unhealthy.", "Move activity indoors."],
    ["#C9B1DB", "201 to 300", "Very unhealthy.", "Stay in. Clean-air room."],
    ["#C79AAB", "301+", "Hazardous.", "Stay in. Follow alerts."],
  ];
  const r = rows.map((x, i) => `<div style="display:grid;grid-template-columns:230px 1fr;align-items:center;gap:32px;padding:14px 0;border-top:1.5px solid #B7C9CC;${i === 5 ? "border-bottom:1.5px solid #B7C9CC" : ""}"><div style="height:54px;border-radius:10px;background:${x[0]};display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;font-variant-numeric:tabular-nums">${x[1]}</div><div style="font-size:29px;line-height:1.2"><strong>${x[2]}</strong> <span style="color:#43606A">${x[3]}</span></div></div>`).join("");
  return `<div style="width:1080px;height:1080px;box-sizing:border-box;padding:72px 80px 64px;background:#E3ECEC;color:#26414A;font-family:${SANS};display:flex;flex-direction:column;justify-content:space-between">
<div><p style="margin:0 0 20px;font-size:26px;font-weight:600;color:#9A4A28">Know before you go</p><h1 style="margin:0;font-family:${SERIF};font-weight:500;font-size:116px;line-height:.98;letter-spacing:-.02em">Know your number.</h1><p style="margin:22px 0 0;font-size:30px;color:#43606A">Check the air quality index before you head out.</p></div>
<div style="display:flex;flex-direction:column">${r}</div>
<div style="display:flex;align-items:baseline;justify-content:space-between;gap:24px"><div style="font-size:27px;font-weight:600">spokanecleanair.org</div><div style="font-family:${SERIF};font-style:italic;font-size:36px;color:#9A4A28">Check. Clean. Cut back.</div></div></div>`;
}

// ---------- Social post 2 ----------
function social2() {
  const steps = [["1", "Pick one room.", "Few windows. A bedroom works well."], ["2", "Seal it.", "Close windows and doors. Keep them shut."], ["3", "Filter the air.", "Run a HEPA cleaner, or a box fan with a MERV 13 filter."]];
  const s = steps.map((x, i) => `<div style="display:grid;grid-template-columns:140px 1fr;align-items:center;gap:20px;padding:24px 0;border-top:${i === 0 ? "2px solid #26414A" : "1.5px solid #D9C4B6"};${i === 2 ? "border-bottom:1.5px solid #D9C4B6" : ""}"><div style="font-family:${SERIF};font-size:112px;line-height:1;color:#9A4A28">${x[0]}</div><div><div style="font-size:38px;font-weight:700">${x[1]}</div><div style="font-size:28px;color:#43606A;margin-top:4px">${x[2]}</div></div></div>`).join("");
  return `<div style="width:1080px;height:1080px;box-sizing:border-box;padding:72px 80px 64px;background:#F7E9DF;color:#26414A;font-family:${SANS};display:flex;flex-direction:column;justify-content:space-between">
<div><p style="margin:0 0 20px;font-size:26px;font-weight:600;color:#9A4A28">Step 2: Clean</p><h1 style="margin:0;font-family:${SERIF};font-weight:500;font-size:104px;line-height:1;letter-spacing:-.02em">A clean-air room in three steps.</h1></div>
<div style="display:flex;flex-direction:column">${s}</div>
<div style="display:flex;flex-direction:column;gap:20px"><p style="margin:0;font-size:26px;color:#43606A">No clean air at home? Go somewhere that has it, like a friend's place or a public space. Skip candles, smoking, wood fires and vacuuming.</p><div style="display:flex;align-items:baseline;justify-content:space-between;gap:24px"><div style="font-size:26px;font-weight:600">Ask our chatbot for a low-cost filter.</div><div style="font-family:${SERIF};font-style:italic;font-size:34px;color:#9A4A28">Check. Clean. Cut back.</div></div></div></div>`;
}

// ---------- School poster ----------
const SCHOOL = {
  en: { lang: "en", eyebrow: "For students, coaches and families", title: "Smoke Day Play Plan", titleSize: 88,
    sub: "We check the air quality index (AQI) every school day in smoke season.",
    t1: ["0 to 100", "Go outside", "Recess, PE and practice as usual."],
    t2: ["101 to 150", "Take it easy", ["Shorter, lighter play outside.", "Hard activity: about one hour at most.", "Students with asthma: play inside or keep it light. Inhaler close by."]],
    t3: ["151 and up", "Stay indoors", "Recess, PE and practice move inside."],
    f1: "Students: tell an adult if you cough, wheeze or feel tight in your chest.", f2: "Families: check the AQI at spokanecleanair.org", tag: "Check. Clean. Cut back." },
  es: { lang: "es", eyebrow: "Para estudiantes, entrenadores y familias", title: "Plan de juego para días de humo", titleSize: 68,
    sub: "Revisamos el índice de calidad del aire (ICA) cada día escolar en temporada de humo.",
    t1: ["0 a 100", "Salir a jugar", "Recreo, educación física y práctica como siempre."],
    t2: ["101 a 150", "Con calma", ["Juego más corto y ligero afuera.", "Actividad intensa: una hora como máximo.", "Alumnos con asma: jugar adentro o con calma. Inhalador a la mano."]],
    t3: ["151 o más", "Quedarse adentro", "El recreo, la educación física y la práctica pasan adentro."],
    f1: "Alumnos: avisen a un adulto si tosen, silban al respirar o sienten el pecho apretado.", f2: "Familias: revisen el ICA en spokanecleanair.org", tag: "Revise. Limpie. Reduzca." },
};
function school(L) {
  const lab = (t) => `<div style="flex:0 0 200px;font-family:${SERIF};font-size:46px;line-height:1;font-variant-numeric:tabular-nums">${t}</div>`;
  const head = (t) => `<div style="font-family:${SERIF};font-weight:500;font-size:40px;line-height:1.05">${t}</div>`;
  return `<div style="width:816px;height:1056px;box-sizing:border-box;background:#F4F6F4;color:#26414A;font-family:${SANS};display:flex;flex-direction:column">
<div style="padding:52px 56px 28px"><p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#9A4A28">${L.eyebrow}</p><h1 style="margin:0;font-family:${SERIF};font-weight:500;font-size:${L.titleSize}px;line-height:1;letter-spacing:-.02em">${L.title}</h1><p style="margin:16px 0 0;font-size:21px;color:#43606A">${L.sub}</p></div>
<div style="flex:1;display:flex;flex-direction:column">
<div style="flex:1;background:#A8D8B9;display:flex;align-items:center;gap:32px;padding:0 56px">${lab(L.t1[0])}<div>${head(L.t1[1])}<div style="font-size:21px;margin-top:6px">${L.t1[2]}</div></div></div>
<div style="flex:1.5;background:#F5C48F;display:flex;align-items:center;gap:32px;padding:0 56px">${lab(L.t2[0])}<div>${head(L.t2[1])}<ul style="margin:8px 0 0;padding-left:22px;font-size:21px;display:flex;flex-direction:column;gap:4px">${L.t2[2].map((x) => `<li>${x}</li>`).join("")}</ul></div></div>
<div style="flex:1;background:#EFA3A0;display:flex;align-items:center;gap:32px;padding:0 56px">${lab(L.t3[0])}<div>${head(L.t3[1])}<div style="font-size:21px;margin-top:6px">${L.t3[2]}</div></div></div>
</div>
<div style="padding:26px 56px 42px;display:flex;flex-direction:column;gap:12px"><p style="margin:0;font-size:21px;font-weight:600">${L.f1}</p><div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap"><span style="font-size:18px;color:#43606A">${L.f2}</span><span style="font-family:${SERIF};font-style:italic;font-size:28px;color:#9A4A28">${L.tag}</span></div></div></div>`;
}

// ---------- Worksite flyer ----------
const WORK = {
  en: { lang: "en", eyebrow: "For outdoor crews and supervisors", title: "Smoke season at work", titleSize: 84, sub: "Know two numbers.", when: "When the AQI reaches",
    c1: "Your employer must train you on wildfire smoke and share the smoke response plan.", c2: "Your employer must provide respirators for you to use if you choose. Ask about breaks in filtered air.",
    sym: "Tell your supervisor about cough, wheeze, chest tightness, headache or burning eyes.", emer: "Call 911 for severe trouble breathing, chest pain or fainting.",
    f1: "Check the AQI: spokanecleanair.org", f2: "Rule details: search wildfire smoke at lni.wa.gov. Confirm the current rule before posting.", tag: "Check. Clean. Cut back." },
  es: { lang: "es", eyebrow: "Para cuadrillas al aire libre y supervisores", title: "Temporada de humo en el trabajo", titleSize: 66, sub: "Conozca dos números.", when: "Cuando el ICA llega a",
    c1: "Su empleador debe capacitarle sobre el humo de incendios y compartir el plan de respuesta.", c2: "Su empleador debe darle respiradores para que los use si quiere. Pregunte por descansos en aire filtrado.",
    sym: "Avise a su supervisor si tiene tos, silbido al respirar, presión en el pecho, dolor de cabeza o ardor en los ojos.", emer: "Llame al 911 si tiene mucha dificultad para respirar, dolor de pecho o desmayo.",
    f1: "Revise el ICA: spokanecleanair.org", f2: "Detalles de la regla: busque wildfire smoke en lni.wa.gov. Confirme la regla vigente antes de publicar.", tag: "Revise. Limpie. Reduzca." },
};
function work(L) {
  const col = (n, t, border) => `<div style="flex:1;padding:24px ${border ? "0 8px 32px" : "28px 8px 0"};${border ? "border-left:1.5px solid #B7C6B7" : ""}"><div style="font-size:16px;font-weight:600;color:#43606A">${L.when}</div><div style="font-family:${SERIF};font-size:170px;line-height:.95;font-variant-numeric:tabular-nums">${n}</div><p style="margin:10px 0 0;font-size:21px">${t}</p></div>`;
  return `<div style="width:816px;height:1056px;box-sizing:border-box;background:#E2EAE0;color:#26414A;font-family:${SANS};display:flex;flex-direction:column">
<div style="padding:52px 56px 32px"><p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#9A4A28">${L.eyebrow}</p><h1 style="margin:0;font-family:${SERIF};font-weight:500;font-size:${L.titleSize}px;line-height:1;letter-spacing:-.02em">${L.title}</h1><p style="margin:16px 0 0;font-size:24px;color:#43606A">${L.sub}</p></div>
<div style="display:flex;margin:0 56px;border-top:2px solid #26414A">${col("69", L.c1, false)}${col("101", L.c2, true)}</div>
<div style="padding:34px 56px 0;display:flex;flex-direction:column;gap:20px;flex:1"><p style="margin:0;font-size:23px;line-height:1.45">${L.sym}</p><div style="background:#EFA3A0;border-radius:10px;padding:18px 24px;font-size:21px;font-weight:600">${L.emer}</div></div>
<div style="padding:0 56px 46px;display:flex;flex-direction:column;gap:10px"><div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;flex-wrap:wrap;border-top:1.5px solid #B7C6B7;padding-top:22px"><span style="font-size:22px;font-weight:600">${L.f1}</span><span style="font-family:${SERIF};font-style:italic;font-size:28px;color:#9A4A28">${L.tag}</span></div><span style="font-size:16px;color:#43606A">${L.f2}</span></div></div>`;
}

const JOBS = [
  { file: "social-1-know-your-number", lang: "en", html: social1(), w: 1080, h: 1080, scale: 1 },
  { file: "social-2-clean-air-room", lang: "en", html: social2(), w: 1080, h: 1080, scale: 1 },
  { file: "school-poster-en", lang: "en", html: school(SCHOOL.en), w: 816, h: 1056, scale: 2 },
  { file: "school-poster-es", lang: "es", html: school(SCHOOL.es), w: 816, h: 1056, scale: 2 },
  { file: "worksite-flyer-en", lang: "en", html: work(WORK.en), w: 816, h: 1056, scale: 2 },
  { file: "worksite-flyer-es", lang: "es", html: work(WORK.es), w: 816, h: 1056, scale: 2 },
];

(async () => {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  for (const j of JOBS) {
    const htmlPath = path.join(OUT, j.file + ".html");
    fs.writeFileSync(htmlPath, page(j.lang, j.file, j.html));
    const ctx = await browser.newContext({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: j.scale });
    const p = await ctx.newPage();
    await p.goto("file://" + htmlPath);
    await p.evaluate(() => document.fonts.ready);
    // Report text that overflows its box so layout problems are caught.
    const over = await p.evaluate(() => Array.from(document.querySelectorAll("div,p,span,li,h1")).filter((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).display !== "inline").map((e) => e.textContent.slice(0, 40)));
    const pageH = await p.evaluate(() => document.body.scrollHeight);
    await p.screenshot({ path: path.join(ROOT, "assets", j.file + ".png"), clip: { x: 0, y: 0, width: j.w, height: j.h } });
    console.log(j.file, pageH > j.h ? "TOO TALL " + pageH : "ok", over.length ? "OVERFLOW: " + over.join(" | ") : "");
    await ctx.close();
  }
  await browser.close();
})();
