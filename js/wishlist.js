// getWishlist() and isWishlisted() are already defined in products.js
// because product cards need them the moment they're drawn.

function saveWishlist(list) {
  localStorage.setItem("wishlist", JSON.stringify(list));
}

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
  } else {
    list.push(id);
  }
  saveWishlist(list);
  updateWishlistBadge();
  return list.includes(id);
}

function updateWishlistBadge() {
  const badge = document.getElementById("wishlist-count");
  if (!badge) return;
  badge.textContent = getWishlist().length;
}

updateWishlistBadge();

// Heart buttons anywhere on the site (event delegation)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".wishlist-btn");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const nowWishlisted = toggleWishlist(id);

  btn.classList.toggle("active", nowWishlisted);
  btn.textContent = nowWishlisted ? "♥" : "♡";
  showToast(nowWishlisted ? "Added to wishlist" : "Removed from wishlist");

  // If we're on the wishlist page itself, re-render so removed items disappear
  if (document.getElementById("wishlist-items")) renderWishlistPage();
});

// ---------- Wishlist page ----------

function wishlistRow(p) {
  return `
    <div class="cart-row" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}">
      <div class="cart-row-info">
        <a href="product.html?id=${p.id}" class="card-name">${p.name}</a>
        <p class="card-rating">★ ${p.rating} <span>(${p.reviews})</span></p>
        <p class="cart-row-price">${money(p.salePrice)}</p>
      </div>
      <button class="btn add-btn" data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>Add to Cart</button>
      <button class="wishlist-btn active" data-id="${p.id}" aria-label="Remove from wishlist">♥</button>
    </div>
  `;
}

function renderWishlistPage() {
  const ids = getWishlist();
  const itemsEl = document.getElementById("wishlist-items");
  const emptyEl = document.getElementById("wishlist-empty");
  if (!itemsEl) return;

  const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

  if (items.length === 0) {
    itemsEl.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";
  itemsEl.innerHTML = items.map(wishlistRow).join("");
}

if (document.getElementById("wishlist-items")) {
  renderWishlistPage();
}

// ---------- Recently viewed ----------

function addRecentlyViewed(id) {
  let list = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  list = list.filter(x => x !== id);
  list.unshift(id);
  list = list.slice(0, 4);
  localStorage.setItem("recentlyViewed", JSON.stringify(list));
}

function renderRecentlyViewed(excludeId) {
  const container = document.getElementById("recently-viewed");
  if (!container) return;
  const list = (JSON.parse(localStorage.getItem("recentlyViewed")) || [])
    .filter(id => id !== excludeId)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const section = document.getElementById("recently-viewed-section");
  if (list.length === 0) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "block";
  container.innerHTML = list.map(productCard).join("");
}
