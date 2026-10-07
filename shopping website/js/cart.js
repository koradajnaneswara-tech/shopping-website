// Get the cart array from LocalStorage (or an empty array if nothing saved yet)
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save the cart array back to LocalStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add a product to the cart, or increase its quantity if already in there
function addToCart(id, qty = 1) {
  const product = products.find(p => p.id === id);
  if (!product || product.stock === 0) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty = Math.min(existing.qty + qty, product.stock);
  } else {
    cart.push({ id: id, qty: Math.min(qty, product.stock) });
  }

  saveCart(cart);
  updateCartBadge();
  showToast("Added to cart");
}

// Update the little number badge in the header on every page
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalQty;
}

// Show a small temporary message at the bottom of the screen
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// Run on every page load, so the badge is always correct
updateCartBadge();
// Event delegation: listen on the whole page, check if an "Add to Cart" button was clicked
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (!btn || btn.disabled) return;
  const id = Number(btn.dataset.id);
  addToCart(id, 1);
});