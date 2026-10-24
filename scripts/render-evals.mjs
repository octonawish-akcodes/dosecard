// Renders each fictional test prescription in evals/prescriptions.json to public/evidence/<id>.jpg,
// using macOS handwriting fonts and a slight tilt and blur so they look like phone photos.
// Run: node scripts/render-evals.mjs   (needs Google Chrome; macOS fonts)
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const { prescriptions } = JSON.parse(readFileSync("evals/prescriptions.json", "utf8"));
const out = "public/evidence";
mkdirSync(out, { recursive: true });
const tmp = join(tmpdir(), "dosecard-render");
mkdirSync(tmp, { recursive: true });

const FONTS = {
  "hand-bradley": '"Bradley Hand", cursive',
  "hand-noteworthy": '"Noteworthy", cursive',
  "hand-chalk": '"Chalkboard SE", cursive',
  "hand-marker": '"Marker Felt", cursive',
  "hand-script": '"Savoye LET", cursive',
  typed: '"Courier New", monospace',
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

prescriptions.forEach((rx, i) => {
  const tilt = ((i % 5) - 2) * 0.9;
  const blur = rx.blur ?? [0.2, 0.45, 0.3, 0, 0.6][i % 5];
  const contrast = rx.contrast ?? 1;
  const typed = rx.style === "typed";
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1200px;height:1600px;display:grid;place-items:center;background:${["#cfc8bd", "#b9b2a6", "#d8d2c8", "#a9a399", "#c7c1b5"][i % 5]}}
.p{width:1040px;min-height:1300px;background:${typed ? "#ffffff" : "#fffdf5"};transform:rotate(${tilt}deg);box-shadow:0 10px 30px #0004;filter:blur(${blur}px) contrast(${contrast});position:relative;color:#1b2a4a;font-family:"Helvetica Neue";padding-bottom:60px}
.h{padding:36px 56px 20px;border-bottom:4px solid ${typed ? "#333" : "#1b6e8a"}}
.h h1{margin:0;font-size:${typed ? 34 : 42}px;color:${typed ? "#111" : "#1b6e8a"}}
.s{position:absolute;top:24px;right:34px;border:3px solid #b33;color:#b33;font:700 20px "Helvetica Neue";padding:5px 12px;transform:rotate(5deg)}
.pt{padding:18px 56px;font-size:26px;border-bottom:1px dashed #99a}
.w{font-family:${FONTS[rx.style]};color:${typed ? "#111" : "#16306b"}}
.b{padding:22px 56px}
.dx{font-size:${typed ? 24 : 30}px;margin-bottom:14px}
.rx{font:italic 700 60px Georgia;color:#1b6e8a}
ol{margin:4px 0 0;padding-left:${typed ? 0 : 44}px;list-style:${typed ? "none" : "decimal"};font-size:${typed ? 27 : rx.style === "hand-script" ? 50 : 37}px;line-height:${typed ? 1.9 : 1.75}}
</style></head><body><div class="p"><div class="s">SAMPLE · NOT A REAL PRESCRIPTION</div>
<div class="h"><h1>${esc(rx.clinic)}</h1></div>
<div class="pt">Patient: <span class="w">${esc(rx.patient)}</span></div>
<div class="b w"><div class="dx">${esc(rx.notes)}</div>${typed ? "" : '<div class="rx">℞</div>'}
<ol>${rx.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ol></div></div></body></html>`;
  const page = join(tmp, `${rx.id}.html`);
  const png = join(tmp, `${rx.id}.png`);
  writeFileSync(page, html);
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1200,1600", `--screenshot=${png}`, `file://${page}`], { stdio: "ignore" });
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "78", png, "--out", join(out, `${rx.id}.jpg`)], { stdio: "ignore" });
  console.log(rx.id);
});
rmSync(tmp, { recursive: true, force: true });
