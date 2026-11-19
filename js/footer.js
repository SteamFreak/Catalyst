// js/footer.js — inject uniform footer into every page
// Usage: import and call initFooter(basePath)
// basePath: '' for root pages, '../' for subdirectory pages

export function initFooter(basePath = "") {
  const el = document.getElementById("main-footer");
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">Catalyst<span>.</span></div>
          <p class="footer-tagline" style="margin-bottom:0.75rem;">Discover. Explore. Build. Grow.<br>A student opportunity discovery and profile development platform.</p>
          <p class="footer-tagline">An initiative of <strong style="color:rgba(255,253,248,0.75);">Lotus Valley International School, Noida Extension</strong></p>
        </div>
        <div class="footer-col">
          <h4>Platform</h4>
          <a href="${basePath}discover.html">Discover Opportunities</a>
          <a href="${basePath}find-opportunity.html">Find My Opportunity</a>
          <a href="${basePath}profile-development.html">Profile Development</a>
          <a href="${basePath}dashboard.html">Dashboard</a>
          <a href="${basePath}my-opportunities.html">My Opportunities</a>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <a href="${basePath}faqs.html">FAQs</a>
          <a href="${basePath}contact.html">Contact Us</a>
          <a href="${basePath}auth/login.html">Sign In</a>
          <a href="${basePath}auth/register.html">Get Started</a>
        </div>
        <div class="footer-col">
          <h4>Admin</h4>
          <a href="${basePath}admin/login.html">Admin Login</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 Catalyst · Lotus Valley International School, Noida Extension. All rights reserved.</span>
        <span>Made with care by <strong style="color:rgba(255,253,248,0.6);">Madhav Batra</strong></span>
      </div>
    </div>`;
}
