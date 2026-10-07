// ---------- Mobile menu ----------
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// ---------- Header search (works from any page) ----------
const globalSearch = document.getElementById("global-search");
if (globalSearch) {
  globalSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && globalSearch.value.trim()) {
      window.location.href = "shop.html?q=" + encodeURIComponent(globalSearch.value.trim());
    }
  });
}

// ---------- Newsletter form ----------
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector("input[type='email']").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Please enter a valid email");
      return;
    }
    showToast("Subscribed! Thanks for joining UrbanCart.");
    newsletterForm.reset();
  });
}

// ---------- Contact form ----------
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    function check(id, errId, test, msg) {
      const val = document.getElementById(id).value.trim();
      const errEl = document.getElementById(errId);
      if (!test(val)) { errEl.textContent = msg; errEl.style.display = "block"; ok = false; }
      else { errEl.style.display = "none"; }
    }

    check("contact-name", "err-contact-name", v => v.length >= 2, "Please enter your name.");
    check("contact-email", "err-contact-email", v => /^\S+@\S+\.\S+$/.test(v), "Enter a valid email address.");
    check("contact-phone", "err-contact-phone", v => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit phone number.");
    check("contact-subject", "err-contact-subject", v => v.length >= 2, "Please enter a subject.");
    check("contact-message", "err-contact-message", v => v.length >= 10, "Message should be at least 10 characters.");

    if (!ok) return;

    showToast("Message sent! We'll get back to you soon.");
    contactForm.reset();
  });
}
