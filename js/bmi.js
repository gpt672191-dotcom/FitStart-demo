// คำนวณ BMI ใช้ร่วมกันทุกหน้า (Shared BMI calc, Asian cut-offs)

const validBody = (h, w) => h >= 100 && h <= 230 && w >= 25 && w <= 250;

// Returns null when inputs are out of range.
function bmiInfo(h, w) {
  if (!validBody(h, w)) return null;
  const bmi = w / ((h / 100) ** 2);
  const idx = bmi < 18.5 ? 0 : bmi < 23 ? 1 : bmi < 25 ? 2 : 3;
  // Map BMI 14–34 onto the bar
  const pos = Math.min(100, Math.max(0, (bmi - 14) / 20 * 100));
  return { bmi, idx, pos };
}

function bmiHTML(h, w) {
  const t = T[lang], r = bmiInfo(h, w);
  if (!r) return `<span style="color:var(--muted)">${t.bmiEmpty}</span>`;
  return `
    <b>${r.bmi.toFixed(1)}</b> · ${t.bmiCat[r.idx]}
    <div class="bmi-bar"><i style="left:${r.pos}%"></i></div>
    <div style="color:var(--muted);font-size:.92rem">${t.bmiAdvice[r.idx]}</div>`;
}

// Body log saved on the user record: [{ h, w, at }], newest first
const bodyLog = u => (u && Array.isArray(u.body) ? u.body : []);
