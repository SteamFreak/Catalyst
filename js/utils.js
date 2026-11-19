// ── HAMBURGER MENU ──
export function initHamburger() {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("navbar-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => links.classList.toggle("mobile-open"));
}

// ── USER DROPDOWN ──
export function initUserDropdown() {
  const btn = document.getElementById("user-menu-btn");
  const dropdown = document.getElementById("user-dropdown");
  if (!btn || !dropdown) return;
  btn.addEventListener("click", (e) => { e.stopPropagation(); dropdown.classList.toggle("open"); });
  document.addEventListener("click", () => dropdown.classList.remove("open"));
}

// ── TOAST ──
export function showToast(msg, type = "") {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = "toast " + type;
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => t.classList.remove("show"), 3200);
}

// ── FORMAT DATE ──
export function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ── DAYS UNTIL ──
export function daysUntil(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.ceil((d - Date.now()) / 86400000);
  return diff;
}

// ── DEADLINE LABEL ──
export function deadlineLabel(ts) {
  const days = daysUntil(ts);
  if (days === null) return "";
  if (days < 0) return "Expired";
  if (days === 0) return "Due today";
  if (days <= 7) return `${days}d left`;
  return `Apply by ${formatDate(ts)}`;
}

// ── CATEGORY BADGE CLASS ──
export function categoryBadgeClass(cat) {
  const map = {
    "Internship": "badge-internship",
    "Research": "badge-research",
    "Course": "badge-course",
    "Competition": "badge-competition",
    "Scholarship": "badge-scholarship",
    "Fellowship": "badge-fellowship",
    "Workshop": "badge-workshop",
    "Volunteering": "badge-volunteering",
    "Summer Programme": "badge-summer",
  };
  return map[cat] || "badge-other";
}

// ── TRUNCATE ──
export function truncate(str, n = 120) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

// ── SPINNER HTML ──
export function spinnerHTML() {
  return `<div class="loading-overlay"><div class="spinner"></div></div>`;
}

// ── CONFIRM DIALOG ──
export function confirmDialog(msg) {
  return window.confirm(msg);
}
