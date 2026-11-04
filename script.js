// ===== Navbar: scroll state + mobile menu =====
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 600);
});

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("open");
  nav.classList.toggle("menu-open");
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    nav.classList.remove("menu-open");
  })
);

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== Counter animation =====
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString("th-TH") + (p === 1 && target >= 1000 ? "+" : "");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

// ===== Hero checklist progress =====
const todayChecks = document.querySelectorAll("#todayList input");
const todayBar = document.getElementById("todayBar");
const todayLabel = document.getElementById("todayLabel");

function updateToday() {
  const done = [...todayChecks].filter((c) => c.checked).length;
  const total = todayChecks.length;
  todayBar.style.width = (done / total) * 100 + "%";
  todayLabel.textContent = done === total ? "เยี่ยมมาก! ครบทุกท่าแล้ว 🎉" : `สำเร็จ ${done} / ${total}`;
}
todayChecks.forEach((c) => c.addEventListener("change", updateToday));

// ===== Program filter tabs =====
const tabs = document.querySelectorAll(".tab");
const programs = document.querySelectorAll(".program");

tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const filter = tab.dataset.filter;
    programs.forEach((p) => {
      p.classList.toggle("hide", filter !== "all" && p.dataset.cat !== filter);
    });
  })
);

// ===== Weekly plan =====
const weekPlan = [
  { day: "จันทร์", icon: "💪", title: "Full Body น้ำหนักตัว", time: "20 นาที",
    items: ["วอร์มอัพ: ย่ำเท้าอยู่กับที่ 3 นาที", "สควอท 3 × 10", "วิดพื้นแบบคุกเข่า 3 × 8", "แพลงก์ 3 × 20 วินาที", "ยืดเหยียด 5 นาที"] },
  { day: "อังคาร", icon: "🚶", title: "เดินเร็ว", time: "20 นาที",
    items: ["เดินปกติ 5 นาที", "เดินเร็ว 1 นาที สลับเดินช้า 1 นาที × 5 รอบ", "เดินช้าคูลดาวน์ 5 นาที"] },
  { day: "พุธ", icon: "🧘", title: "ยืดเหยียด & พัก", time: "15 นาที",
    items: ["ยืดคอ บ่า ไหล่", "ท่าแมว-วัว 10 ครั้ง", "ท่าเด็ก (Child's pose) 1 นาที", "ยืดต้นขาด้านหลัง ข้างละ 30 วินาที"] },
  { day: "พฤหัส", icon: "🍑", title: "ขาและสะโพก", time: "20 นาที",
    items: ["วอร์มอัพ 3 นาที", "กลูตบริดจ์ 3 × 12", "ลันจ์ถอยหลัง ข้างละ 3 × 8", "สควอทค้าง 3 × 20 วินาที", "ยืดเหยียด 5 นาที"] },
  { day: "ศุกร์", icon: "⚡", title: "HIIT มือใหม่", time: "15 นาที",
    items: ["วอร์มอัพ 3 นาที", "จัมปิ้งแจ็ค 20 วิ / พัก 40 วิ", "ยกเข่าสูง 20 วิ / พัก 40 วิ", "ทำซ้ำ 4 รอบ", "คูลดาวน์ 3 นาที"] },
  { day: "เสาร์", icon: "🚴", title: "กิจกรรมที่ชอบ", time: "30 นาที",
    items: ["เลือกทำอะไรก็ได้ที่สนุก: ปั่นจักรยาน ว่ายน้ำ เต้น", "เน้นขยับร่างกายแบบไม่กดดัน"] },
  { day: "อาทิตย์", icon: "😴", title: "วันพัก", time: "—",
    items: ["พักผ่อนให้เต็มที่ นอน 7–8 ชั่วโมง", "ดื่มน้ำให้เพียงพอ", "ทบทวนสัปดาห์และวางแผนสัปดาห์หน้า"] },
];

const weekEl = document.getElementById("week");
const detailEl = document.getElementById("dayDetail");

function renderDetail(i) {
  const d = weekPlan[i];
  detailEl.innerHTML = `
    <h3>${d.icon} วัน${d.day} — ${d.title}</h3>
    <p>ระยะเวลา: ${d.time}</p>
    <ul>${d.items.map((it) => `<li>${it}</li>`).join("")}</ul>`;
  weekEl.querySelectorAll(".day").forEach((el, idx) => el.classList.toggle("active", idx === i));
}

weekPlan.forEach((d, i) => {
  const btn = document.createElement("button");
  btn.className = "day";
  btn.innerHTML = `<small>วันที่ ${i + 1}</small><strong>${d.day}</strong><em>${d.icon}</em>`;
  btn.addEventListener("click", () => renderDetail(i));
  weekEl.appendChild(btn);
});
renderDetail(0);

// ===== Testimonial slider =====
const track = document.getElementById("sliderTrack");
const dotsEl = document.getElementById("sliderDots");
const slides = track.children.length;
let current = 0;
let timer;

for (let i = 0; i < slides; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `สไลด์ที่ ${i + 1}`);
  dot.addEventListener("click", () => { goTo(i); restart(); });
  dotsEl.appendChild(dot);
}

function goTo(i) {
  current = (i + slides) % slides;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dotsEl.children].forEach((d, idx) => d.classList.toggle("active", idx === current));
}
function restart() {
  clearInterval(timer);
  timer = setInterval(() => goTo(current + 1), 5000);
}
goTo(0);
restart();

// ===== FAQ: open one at a time =====
const faqItems = document.querySelectorAll(".faq details");
faqItems.forEach((item) =>
  item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach((o) => o !== item && (o.open = false));
  })
);

// ===== Signup form =====
const form = document.getElementById("signupForm");
const emailInput = document.getElementById("email");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    formMsg.textContent = "กรุณากรอกอีเมลให้ถูกต้อง";
    emailInput.focus();
    return;
  }
  formMsg.textContent = `ขอบคุณ! เราจะส่งตารางไปที่ ${email} เร็ว ๆ นี้ 💜`;
  form.reset();
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
