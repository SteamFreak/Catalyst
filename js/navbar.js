// js/navbar.js — inject uniform navbar into every page
// Usage: import and call initNavbar(activePage, basePath)
// activePage: 'discover' | 'find' | 'profile' | 'faqs' | 'contact' | ''
// basePath: '' for root pages, '../' for subdirectory pages

import { initHamburger, initUserDropdown } from "./utils.js";
import { initNavAuth, logoutUser } from "./auth.js";

export function initNavbar(activePage = "", basePath = "") {
  const nav = document.getElementById("main-navbar");
  if (!nav) return;

  const links = [
    { id: "discover", href: `${basePath}discover.html`, label: "Discover" },
    { id: "find", href: `${basePath}find-opportunity.html`, label: "Find My Opportunity" },
    { id: "profile", href: `${basePath}profile-development.html`, label: "Profile Development" },
    { id: "faqs", href: `${basePath}faqs.html`, label: "FAQs" },
    { id: "contact", href: `${basePath}contact.html`, label: "Contact" },
  ];

  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="${basePath}index.html" class="navbar-brand">Catalyst<span>.</span></a>
      <ul class="navbar-links" id="navbar-links">
        ${links.map(l => `<li><a href="${l.href}"${l.id === activePage ? ' class="active"' : ''}>${l.label}</a></li>`).join("")}
      </ul>
      <div class="navbar-actions">
        <div id="nav-guest" style="gap:0.5rem;align-items:center;">
          <a href="${basePath}auth/login.html" class="btn-nav-signin">Sign In</a>
          <a href="${basePath}auth/register.html" class="btn-nav-cta">Get Started</a>
        </div>
        <div id="nav-user" style="position:relative;">
          <button class="user-menu-btn" id="user-menu-btn"><span id="user-initial">S</span></button>
          <div class="user-dropdown" id="user-dropdown">
            <a href="${basePath}dashboard.html">Dashboard</a>
            <a href="${basePath}my-opportunities.html">My Opportunities</a>
            <a href="${basePath}profile-development.html">Profile Development</a>
            <div class="divider"></div>
            <button class="signout" id="signout-btn">Sign Out</button>
          </div>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>`;

  initNavAuth();
  initHamburger();
  initUserDropdown();
  document.getElementById("signout-btn")?.addEventListener("click", logoutUser);

  // Smooth page transitions for all internal links
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || !a.href) return;
    // Only same-origin, non-hash, non-external links
    if (a.origin !== location.origin) return;
    if (a.target === "_blank") return;
    if (a.href === location.href || a.href === location.href + "#") return;
    if (a.hash && a.pathname === location.pathname) return;
    // Skip if browser handles it natively via View Transitions
    if (document.startViewTransition) return;
    e.preventDefault();
    const dest = a.href;
    document.body.style.transition = "opacity 0.15s ease-in";
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = dest; }, 150);
  });
}
