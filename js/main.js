// เริ่มต้นแอป และสลับภาษา (Start-up and language switch) — shared by index.html and profile.html

/* ---------- Home page BMI tool: start from the logged-in user's latest profile entry ---------- */
function prefillBMI() {
  if (!$("#bmiOut")) return;
  const last = bodyLog(currentUser())[0];
  if (last && !$("#h").value && !$("#w").value) { $("#h").value = last.h; $("#w").value = last.w; }
  renderBMI();
}

/* ---------- Language ---------- */
function applyLang() {
  const t = T[lang];
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => { el.textContent = t[el.dataset.i18n]; });
  $$("[data-i18n-html]").forEach(el => { el.innerHTML = t[el.dataset.i18nHtml]; });
  $$(".lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
  if ($("#planForm")) { renderChips(); renderPlan(); }
  if ($("#bmiOut")) { prefillBMI(); drawTimer(); }
  renderAuth(); renderAccount();
}
$$(".lang button").forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set("fs-lang", lang); applyLang(); });

applyLang();
// Sections like #myplans are hidden until the account renders, so jump to the hash afterwards
if (location.hash && $(location.hash)) $(location.hash).scrollIntoView();
