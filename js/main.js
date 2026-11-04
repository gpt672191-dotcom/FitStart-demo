// เริ่มต้นแอป และสลับภาษา (Start-up and language switch) and page routing (home / #profile)

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
  if ($("#profileView")) document.title = isProfileRoute() ? `${t.profileTitle} · FitStart AI` : "FitStart AI";
}
$$(".lang button").forEach(b => b.onclick = () => { lang = b.dataset.lang; store.set("fs-lang", lang); applyLang(); });

/* ---------- Views: home and profile live in one file so they always share the login ----------
   index.html#profile → profile view, anything else → home view (and scroll to that section) */
const isProfileRoute = () => location.hash === "#profile";
function route() {
  const prof = isProfileRoute();
  $("#homeView").hidden = prof;
  $("#profileView").hidden = !prof;
  document.title = prof ? `${T[lang].profileTitle} · FitStart AI` : "FitStart AI";
  if (prof) { window.scrollTo(0, 0); return; }
  prefillBMI(); // pick up anything just saved on the profile
  const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView(); else if (!location.hash || location.hash === "#") window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);

applyLang();
route();
