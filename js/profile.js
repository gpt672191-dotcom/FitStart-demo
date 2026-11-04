// โปรไฟล์: น้ำหนัก ส่วนสูง BMI และประวัติ (Profile: body stats, BMI and history)

/* Stored on the user record (DEMO: this browser only):
   u.body = [{ h, w, at }]   newest first; one entry per day (saving again the same day replaces it) */

const bodyLog = u => (u && Array.isArray(u.body) ? u.body : []);
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

function renderProfileBMI() {
  $("#pBmiOut").innerHTML = bmiHTML(parseFloat($("#pH").value), parseFloat($("#pW").value));
}
$("#pH").addEventListener("input", () => { $("#bodyErr").textContent = ""; renderProfileBMI(); });
$("#pW").addEventListener("input", () => { $("#bodyErr").textContent = ""; renderProfileBMI(); });

let profileOf = null; // whose data is in the form right now
function renderProfile() {
  const u = currentUser();
  $("#profile").hidden = !u;
  if ((u && u.email) !== profileOf) { $("#bodyForm").reset(); $("#bodyErr").textContent = ""; profileOf = u && u.email; }
  if (!u) return;
  const t = T[lang], log = bodyLog(u);

  $("#pAvatar").textContent = u.name.trim().charAt(0).toUpperCase() || "?";
  $("#pName").textContent = u.name;
  $("#pEmail").textContent = u.email;

  // Prefill with the latest entry unless the user is typing
  const latest = log[0];
  if (latest && document.activeElement !== $("#pH") && document.activeElement !== $("#pW")) {
    if (!$("#pH").value) $("#pH").value = latest.h;
    if (!$("#pW").value) $("#pW").value = latest.w;
  }
  renderProfileBMI();
  renderHistory(log);
}

function renderHistory(log) {
  const t = T[lang], list = $("#histList");
  if (!log.length) { list.innerHTML = `<div class="empty">${t.noHistory}</div>`; $("#trend").innerHTML = ""; return; }

  const dateFmt = new Intl.DateTimeFormat(lang === "th" ? "th-TH" : "en-GB", { dateStyle: "medium" });
  list.innerHTML = log.map((e, i) => {
    const r = bmiInfo(e.h, e.w);
    const prev = log[i + 1];
    let diff = "";
    if (prev) {
      const d = +(e.w - prev.w).toFixed(1);
      diff = d === 0 ? `<span class="diff">±0</span>`
        : `<span class="diff ${d < 0 ? "down" : "up"}">${d > 0 ? "+" : ""}${d} ${t.kg}</span>`;
    }
    return `
      <div class="hist">
        <div>
          <b>${e.w} ${t.kg} · BMI ${r ? r.bmi.toFixed(1) : "—"}</b>
          <small>${dateFmt.format(e.at)} · ${e.h} ${t.cm}${r ? " · " + t.bmiCat[r.idx] : ""}</small>
        </div>
        <div class="acts">${diff}<button type="button" class="btn sm ghost" data-hdel="${i}">${t.del}</button></div>
      </div>`;
  }).join("");

  renderTrend(log);
}

// Simple weight sparkline (oldest → newest)
function renderTrend(log) {
  const box = $("#trend"), t = T[lang];
  if (log.length < 2) { box.innerHTML = ""; return; }
  const pts = log.slice(0, 12).reverse();
  const ws = pts.map(p => p.w), min = Math.min(...ws), max = Math.max(...ws), span = max - min || 1;
  const W = 300, H = 70, pad = 8;
  const xy = pts.map((p, i) => [
    pad + (i / (pts.length - 1)) * (W - pad * 2),
    pad + (1 - (p.w - min) / span) * (H - pad * 2)
  ]);
  const total = +(pts[pts.length - 1].w - pts[0].w).toFixed(1);
  box.innerHTML = `
    <div class="trend">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${t.trendLabel}">
        <polyline points="${xy.map(p => p.join(",")).join(" ")}" />
      </svg>
      <small>${t.trendSum(pts.length, total)}</small>
    </div>`;
}

$("#bodyForm").addEventListener("submit", e => {
  e.preventDefault();
  const t = T[lang], h = parseFloat($("#pH").value), w = parseFloat($("#pW").value);
  if (!validBody(h, w)) { $("#bodyErr").textContent = t.errBody; return; }
  const users = getUsers(), u = users[session];
  if (!u) return;
  u.body = bodyLog(u);
  const entry = { h: +h.toFixed(1), w: +w.toFixed(1), at: Date.now() };
  if (u.body[0] && sameDay(u.body[0].at, entry.at)) u.body[0] = entry; else u.body.unshift(entry);
  setUsers(users);
  // Keep the BMI tool in sync
  $("#h").value = entry.h; $("#w").value = entry.w; renderBMI();
  renderProfile();
  toast(t.bodySaved);
});

$("#histList").addEventListener("click", e => {
  const i = e.target.dataset.hdel; if (i === undefined) return;
  const t = T[lang], users = getUsers(), u = users[session];
  if (!u) return;
  if (e.target.dataset.armed) {
    bodyLog(u).splice(+i, 1); setUsers(users); renderProfile(); toast(t.bodyDeleted);
  } else {
    e.target.dataset.armed = "1"; e.target.textContent = t.delConfirm;
    setTimeout(() => { if (e.target.isConnected) { delete e.target.dataset.armed; e.target.textContent = t.del; } }, 3000);
  }
});

$("#ddProfile").onclick = () => { $("#dropdown").hidden = true; };
