const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 3999, salePrice: 2999, rating: 4.5, reviews: 120, stock: 10, image: "images/products/p1.jpg", desc: "Over-ear wireless headphones with noise cancellation.", date: "2026-01-10", popularity: 90 },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 5999, salePrice: 4499, rating: 4.2, reviews: 85, stock: 6, image: "images/products/p2.jpg", desc: "Fitness tracking smart watch with heart-rate monitor.", date: "2026-02-15", popularity: 78 },
  { id: 3, name: "Men's Denim Jacket", category: "Fashion", price: 2499, salePrice: 1799, rating: 4.0, reviews: 40, stock: 15, image: "images/products/p3.jpg", desc: "Classic slim-fit denim jacket.", date: "2026-03-01", popularity: 55 },
  { id: 4, name: "Women's Floral Dress", category: "Fashion", price: 1899, salePrice: 1299, rating: 4.6, reviews: 96, stock: 0, image: "images/products/p4.jpg", desc: "Lightweight summer floral dress.", date: "2026-03-10", popularity: 88 },
  { id: 5, name: "Running Shoes", category: "Footwear", price: 3499, salePrice: 2799, rating: 4.3, reviews: 150, stock: 20, image: "images/products/p5.jpg", desc: "Breathable running shoes with cushioned sole.", date: "2026-01-25", popularity: 95 },
  { id: 6, name: "Leather Sandals", category: "Footwear", price: 1499, salePrice: 999, rating: 3.9, reviews: 30, stock: 12, image: "images/products/p6.jpg", desc: "Genuine leather everyday sandals.", date: "2026-02-05", popularity: 40 },
  { id: 7, name: "Table Lamp", category: "Home & Living", price: 1299, salePrice: 899, rating: 4.4, reviews: 55, stock: 8, image: "images/products/p7.jpg", desc: "Modern minimalist table lamp.", date: "2026-01-05", popularity: 60 },
  { id: 8, name: "Cotton Bedsheet Set", category: "Home & Living", price: 1999, salePrice: 1499, rating: 4.1, reviews: 70, stock: 0, image: "images/products/p8.jpg", desc: "100% cotton bedsheet with 2 pillow covers.", date: "2026-02-20", popularity: 65 },
  { id: 9, name: "Face Serum", category: "Beauty", price: 899, salePrice: 649, rating: 4.7, reviews: 200, stock: 25, image: "images/products/p9.jpg", desc: "Vitamin C brightening face serum.", date: "2026-03-15", popularity: 99 },
  { id: 10, name: "Matte Lipstick Set", category: "Beauty", price: 799, salePrice: 549, rating: 4.3, reviews: 110, stock: 18, image: "images/products/p10.jpg", desc: "Set of 3 long-lasting matte lipsticks.", date: "2026-02-10", popularity: 72 },
  { id: 11, name: "Leather Wallet", category: "Accessories", price: 1199, salePrice: 899, rating: 4.0, reviews: 45, stock: 14, image: "images/products/p11.jpg", desc: "Slim genuine leather bifold wallet.", date: "2026-01-18", popularity: 50 },
  { id: 12, name: "Sunglasses", category: "Accessories", price: 1599, salePrice: 1099, rating: 4.5, reviews: 130, stock: 9, image: "images/products/p12.jpg", desc: "UV-protected polarized sunglasses.", date: "2026-03-05", popularity: 84 },
];
function productCard(p) {
  const discount = Math.round((p.price - p.salePrice) / p.price * 100);
  const stockLabel = p.stock > 0 ? "In Stock" : "Out of Stock";
  const stockClass = p.stock > 0 ? "in-stock" : "out-stock";

  return `
    <article class="card">
      <a href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </a>
      <div class="card-body">
        <a href="product.html?id=${p.id}" class="card-name">${p.name}</a>
        <p class="card-rating">★ ${p.rating} <span>(${p.reviews})</span></p>
        <p class="card-price">
          <span class="sale">₹${p.salePrice.toLocaleString('en-IN')}</span>
          <span class="original">₹${p.price.toLocaleString('en-IN')}</span>
          <span class="discount">${discount}% OFF</span>
        </p>
        <p class="stock ${stockClass}">${stockLabel}</p>
        <div class="card-actions">
          <button class="btn add-btn" data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>Add to Cart</button>
          <button class="wishlist-btn" data-id="${p.id}" aria-label="Add to wishlist">♡</button>
        </div>
      </div>
    </article>
  `;
}
function render(list, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = list.length
    ? list.map(productCard).join("")
    : "<p>No products found</p>";
}

// Run only on pages that have these containers
if (document.getElementById("featured")) {
  const featured = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
  render(featured, "featured");
}

if (document.getElementById("bestsellers")) {
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  render(bestSellers, "bestsellers");
}
if (document.getElementById("all-products")) {
  render(products, "all-products");
}