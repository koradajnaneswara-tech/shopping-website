const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = products.find(p => p.id === productId);
if (product) {
  // Give every product a small gallery (reuse main image if no extras exist)
  const gallery = product.gallery || [product.image, product.image, product.image];

  document.getElementById("main-image").src = gallery[0];
  document.getElementById("main-image").alt = product.name;

  document.getElementById("thumbnails").innerHTML = gallery
    .map((img, i) => `<img src="${img}" class="thumb${i === 0 ? ' active' : ''}" data-src="${img}">`)
    .join("");

  document.getElementById("p-name").textContent = product.name;
  document.getElementById("p-rating").innerHTML = `★ ${product.rating} <span>(${product.reviews} reviews)</span>`;

  const discount = Math.round((product.price - product.salePrice) / product.price * 100);
  document.getElementById("p-price").innerHTML = `
    <span class="sale">₹${product.salePrice.toLocaleString('en-IN')}</span>
    <span class="original">₹${product.price.toLocaleString('en-IN')}</span>
    <span class="discount">${discount}% OFF</span>
  `;

  const stockEl = document.getElementById("p-stock");
  stockEl.textContent = product.stock > 0 ? "In Stock" : "Out of Stock";
  stockEl.className = "stock " + (product.stock > 0 ? "in-stock" : "out-stock");

  document.getElementById("p-desc").textContent = product.desc;

  document.getElementById("p-specs").innerHTML = `
    <li>Category: ${product.category}</li>
    <li>Rating: ${product.rating} / 5</li>
    <li>Stock available: ${product.stock}</li>
  `;

  if (product.stock === 0) {
    document.getElementById("add-to-cart-btn").disabled = true;
    document.getElementById("buy-now-btn").disabled = true;
  }
    // Switch main image when a thumbnail is clicked
  document.getElementById("thumbnails").addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
    document.getElementById("main-image").src = thumb.dataset.src;
    document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");
  });

  // Open zoom overlay when main image is clicked
  document.getElementById("main-image").addEventListener("click", () => {
    document.getElementById("zoom-image").src = document.getElementById("main-image").src;
    document.getElementById("zoom-overlay").classList.add("open");
  });

  document.getElementById("zoom-close").addEventListener("click", () => {
    document.getElementById("zoom-overlay").classList.remove("open");
  });

  // Quantity selector
  let qty = 1;
  document.getElementById("qty-plus").addEventListener("click", () => {
    if (qty < product.stock) {
      qty++;
      document.getElementById("qty-value").textContent = qty;
    }
  });
  document.getElementById("qty-minus").addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      document.getElementById("qty-value").textContent = qty;
    }
  });
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    addToCart(product.id, qty);
  });

  document.getElementById("buy-now-btn").addEventListener("click", () => {
    addToCart(product.id, qty);
    window.location.href = "cart.html";
  });
} else {
  document.getElementById("product-page").innerHTML = "<p>Product not found.</p>";
}