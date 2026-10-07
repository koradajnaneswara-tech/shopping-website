function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentUser"));
}

function showFieldError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.display = message ? "block" : "none";
}

// ---------- Register ----------
if (document.getElementById("register-form")) {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const mobile = document.getElementById("reg-mobile").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;

    let ok = true;
    if (name.length < 2) { showFieldError("err-reg-name", "Please enter your full name."); ok = false; }
    else showFieldError("err-reg-name", "");

    if (!/^\S+@\S+\.\S+$/.test(email)) { showFieldError("err-reg-email", "Enter a valid email address."); ok = false; }
    else showFieldError("err-reg-email", "");

    if (!/^[6-9]\d{9}$/.test(mobile)) { showFieldError("err-reg-mobile", "Enter a valid 10-digit mobile number."); ok = false; }
    else showFieldError("err-reg-mobile", "");

    if (password.length < 8) { showFieldError("err-reg-password", "Password must be at least 8 characters."); ok = false; }
    else showFieldError("err-reg-password", "");

    if (confirm !== password) { showFieldError("err-reg-confirm", "Passwords do not match."); ok = false; }
    else showFieldError("err-reg-confirm", "");

    if (!ok) return;

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      showFieldError("err-reg-email", "An account with this email already exists.");
      return;
    }

    users.push({ name, email, mobile, password });
    saveUsers(users);
    showToast("Account created! Please log in.");
    window.location.href = "login.html";
  });
}

// ---------- Login ----------
if (document.getElementById("login-form")) {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const remember = document.getElementById("login-remember").checked;

    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) {
      showFieldError("err-login", "Incorrect email or password.");
      return;
    }
    showFieldError("err-login", "");

    const payload = JSON.stringify({ name: user.name, email: user.email, mobile: user.mobile });
    if (remember) {
      localStorage.setItem("currentUser", payload);
    } else {
      sessionStorage.setItem("currentUser", payload);
    }
    showToast("Logged in successfully");
    window.location.href = "account.html";
  });
}

// ---------- Account page ----------
if (document.getElementById("account-page")) {
  const user = getCurrentUser();
  const loggedOutView = document.getElementById("account-logged-out");
  const loggedInView = document.getElementById("account-logged-in");

  if (!user) {
    loggedOutView.style.display = "block";
    loggedInView.style.display = "none";
  } else {
    loggedOutView.style.display = "none";
    loggedInView.style.display = "block";
    document.getElementById("acc-name").textContent = user.name;
    document.getElementById("acc-email").textContent = user.email;
    document.getElementById("acc-mobile").textContent = user.mobile;

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
      showToast("Logged out");
      window.location.href = "index.html";
    });

    const pwForm = document.getElementById("change-password-form");
    if (pwForm) {
      pwForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newPw = document.getElementById("new-password").value;
        const confirmPw = document.getElementById("confirm-password").value;
        if (newPw.length < 8) { showFieldError("err-new-password", "Must be at least 8 characters."); return; }
        if (newPw !== confirmPw) { showFieldError("err-confirm-password", "Passwords do not match."); return; }
        showFieldError("err-new-password", "");
        showFieldError("err-confirm-password", "");

        const users = getUsers();
        const u = users.find(u => u.email === user.email);
        if (u) { u.password = newPw; saveUsers(users); }
        showToast("Password updated");
        pwForm.reset();
      });
    }
  }
}

// ---------- Orders page ----------
if (document.getElementById("orders-page")) {
  const orders = getOrders();
  const listEl = document.getElementById("orders-list");
  const emptyEl = document.getElementById("orders-empty");

  if (orders.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
    listEl.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-card-head">
          <span><strong>${o.id}</strong></span>
          <span>${new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span class="order-status">${o.status}</span>
        </div>
        <div class="order-card-body">
          ${o.items.map(i => `<span>${i.name} × ${i.qty}</span>`).join(", ")}
        </div>
        <div class="order-card-foot">
          <span>Payment: ${o.payment}</span>
          <span>Total: ${money(o.total)}</span>
        </div>
      </div>
    `).join("");
  }
}
