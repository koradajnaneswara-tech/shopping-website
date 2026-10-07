function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

if (document.getElementById("checkout-form")) {

  const cart = getCart();
  const form = document.getElementById("checkout-form");
  const summaryEl = document.getElementById("checkout-summary");

  // If the cart is empty, there's nothing to check out
  if (cart.length === 0) {
    document.getElementById("checkout-page").innerHTML =
      "<p class='empty-msg'>Your cart is empty. <a href='shop.html'>Go shopping</a> before checking out.</p>";
  } else {

    // Render the order summary beside the form
    function renderSummary() {
      const { subtotal, shipping, tax, total } = calculateTotals(cart);
      summaryEl.innerHTML = `
        <h3>Order Summary</h3>
        ${cart.map(item => {
          const p = products.find(pr => pr.id === item.id);
          return `<div class="summary-line"><span>${p.name} × ${item.qty}</span><span>${money(p.salePrice * item.qty)}</span></div>`;
        }).join("")}
        <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${shipping === 0 ? "FREE" : money(shipping)}</span></div>
        <div class="summary-line"><span>Tax</span><span>${money(tax)}</span></div>
        <div class="summary-line total"><span>Total</span><span>${money(total)}</span></div>
      `;
    }
    renderSummary();

    // Show the right dummy payment fields for the chosen method
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const upiFields = document.getElementById("upi-fields");
    const cardFields = document.getElementById("card-fields");

    function togglePaymentFields() {
      const method = document.querySelector('input[name="payment"]:checked').value;
      upiFields.style.display = method === "upi" ? "block" : "none";
      cardFields.style.display = method === "card" ? "block" : "none";
    }
    paymentRadios.forEach(r => r.addEventListener("change", togglePaymentFields));
    togglePaymentFields();

    // ---------- Validation ----------
    function showError(id, message) {
      const el = document.getElementById(id);
      el.textContent = message;
      el.style.display = message ? "block" : "none";
    }

    function validateField(id, errorId, test, message) {
      const value = document.getElementById(id).value.trim();
      if (!test(value)) {
        showError(errorId, message);
        return false;
      }
      showError(errorId, "");
      return true;
    }

    function validateForm() {
      let ok = true;
      ok = validateField("full-name", "err-full-name", v => v.length >= 2, "Please enter your full name.") && ok;
      ok = validateField("mobile", "err-mobile", v => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit mobile number.") && ok;
      ok = validateField("email", "err-email", v => /^\S+@\S+\.\S+$/.test(v), "Enter a valid email address.") && ok;
      ok = validateField("house", "err-house", v => v.length >= 1, "Required.") && ok;
      ok = validateField("street", "err-street", v => v.length >= 2, "Required.") && ok;
      ok = validateField("city", "err-city", v => v.length >= 2, "Required.") && ok;
      ok = validateField("state", "err-state", v => v.length >= 2, "Required.") && ok;
      ok = validateField("pincode", "err-pincode", v => /^\d{6}$/.test(v), "Enter a valid 6-digit PIN code.") && ok;
      ok = validateField("country", "err-country", v => v.length >= 2, "Required.") && ok;

      const method = document.querySelector('input[name="payment"]:checked').value;
      if (method === "upi") {
        ok = validateField("upi-id", "err-upi-id", v => /^[\w.\-]{2,}@[\w]{2,}$/.test(v), "Enter a valid UPI ID, e.g. name@bank.") && ok;
      }
      if (method === "card") {
        ok = validateField("card-number", "err-card-number", v => /^\d{16}$/.test(v.replace(/\s/g, "")), "Enter a valid 16-digit card number (test data only).") && ok;
        ok = validateField("card-expiry", "err-card-expiry", v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v), "Use MM/YY format.") && ok;
        ok = validateField("card-cvv", "err-card-cvv", v => /^\d{3}$/.test(v), "Enter a 3-digit CVV (test data only).") && ok;
      }
      return ok;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const method = document.querySelector('input[name="payment"]:checked').value;
      const { subtotal, shipping, tax, total } = calculateTotals(cart);

      const order = {
        id: "UC" + Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => {
          const p = products.find(pr => pr.id === item.id);
          return { id: p.id, name: p.name, qty: item.qty, price: p.salePrice };
        }),
        subtotal, shipping, tax, total,
        customer: {
          name: document.getElementById("full-name").value.trim(),
          mobile: document.getElementById("mobile").value.trim(),
          email: document.getElementById("email").value.trim(),
        },
        address: {
          house: document.getElementById("house").value.trim(),
          street: document.getElementById("street").value.trim(),
          city: document.getElementById("city").value.trim(),
          state: document.getElementById("state").value.trim(),
          pincode: document.getElementById("pincode").value.trim(),
          country: document.getElementById("country").value.trim(),
        },
        payment: method.toUpperCase(),
        status: "Order Placed",
      };

      const orders = getOrders();
      orders.unshift(order);
      saveOrders(orders);
      clearCart();

      showConfirmation(order);
    });
  }
}

function showConfirmation(order) {
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  document.getElementById("checkout-page").innerHTML = `
    <div class="confirmation">
      <h2>✅ Order Placed Successfully</h2>
      <p class="order-id">Order ID: <strong>${order.id}</strong></p>
      <p>Thank you, ${order.customer.name}! A confirmation has been recorded for your order.</p>

      <div class="confirmation-box">
        <h3>Items</h3>
        ${order.items.map(i => `<div class="summary-line"><span>${i.name} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
        <div class="summary-line total"><span>Total Paid</span><span>${money(order.total)}</span></div>
      </div>

      <div class="confirmation-box">
        <h3>Delivery Address</h3>
        <p>${order.address.house}, ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}, ${order.address.country}</p>
      </div>

      <div class="confirmation-box">
        <h3>Payment Method</h3>
        <p>${order.payment}</p>
      </div>

      <p>Estimated delivery: <strong>${deliveryDate}</strong></p>

      <div class="product-actions">
        <a href="orders.html" class="btn">View My Orders</a>
        <a href="shop.html" class="btn btn-outline">Continue Shopping</a>
      </div>
    </div>
  `;
}
