# UrbanCart — Shopping Website

A complete, responsive, frontend-only e-commerce website built as a web development internship project. UrbanCart lets customers browse products, search and filter, manage a cart and wishlist, and complete a simulated checkout — all using plain HTML, CSS and JavaScript with LocalStorage for data persistence.

## Live Demo
*(Add your GitHub Pages link here once deployed — see Deployment below)*

## Features

- **Home page** — hero banner, category cards, special offers, featured products, best sellers, customer reviews, newsletter signup
- **Shop page** — live search, category/price/rating/stock filters, sorting (price, newest, rating, popularity), "No products found" state
- **Product details** — image gallery with thumbnails and click-to-zoom, quantity selector, specifications, recently viewed products
- **Cart** — add/remove items, change quantity, automatic subtotal/shipping/tax/total calculation, persists across page refresh
- **Wishlist** — save products for later, toggle from any product card or the detail page
- **Checkout** — delivery address form, simulated UPI/Card/Cash on Delivery payment, full form validation, order confirmation screen
- **Accounts** — register, login (with Remember Me), account dashboard, change password, logout
- **Orders** — order history with items, totals, payment method and status
- **Responsive design** — mobile hamburger menu, collapsible filters panel, adaptive product grid, works on phone/tablet/desktop
- **Other** — toast notifications, header search from any page, SEO meta tags, favicon, lazy-loaded images

## Technologies

- HTML5, CSS3 (Flexbox & Grid, CSS variables, media queries)
- Vanilla JavaScript (ES6+, no frameworks)
- Browser LocalStorage for cart, wishlist, recently viewed, users, orders and session

## Project Structure

```
shopping website/
├── index.html / shop.html / product.html / cart.html / checkout.html
├── wishlist.html / login.html / register.html / account.html / orders.html
├── about.html / contact.html
├── css/style.css
├── js/
│   ├── products.js        product data, product cards, search/filter/sort
│   ├── cart.js             cart engine + cart page
│   ├── wishlist.js         wishlist engine + recently viewed
│   ├── product-details.js  product detail page logic
│   ├── checkout.js         checkout validation, payment, order confirmation
│   ├── auth.js              register/login/account/orders
│   └── script.js           mobile menu, header search, contact/newsletter forms
└── images/
    ├── products/ categories/ banners/ users/
```

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/YOUR-USERNAME/shopping-website.git
   ```
2. Open the folder in VS Code.
3. Install the **Live Server** extension if you don't have it.
4. Right-click `index.html` → **Open with Live Server**.

No build step, no dependencies to install — it's a static site.

## Database

This is a frontend-only implementation. All data (cart, wishlist, user accounts, orders) is stored in the browser's LocalStorage rather than a real database, as described in the project brief for the frontend track.

## Deployment (GitHub Pages)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under "Branch," choose `main` and `/ (root)`.
4. Save — your live link appears at `https://YOUR-USERNAME.github.io/shopping-website/` within a minute.

## Developer

Built as part of a web development internship project (UrbanCart — Online Multi-Category Shopping Store scenario).
