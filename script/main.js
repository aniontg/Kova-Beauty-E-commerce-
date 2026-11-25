// ==========================================
// KOVA BEAUTY STORE - PRODUCT, CART & WISHLIST
// ==========================================

// DOM Elements
const productsContainer = document.querySelector("#product-container");
const cartCount = document.querySelector("#cart-count");
const wishlistCount = document.querySelector("#wishlist-count");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

// Store Data
let products = [];
let cart = readStorage("kovaCart", []);
let wishlist = readStorage("kovaWishlist", []);

// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ==========================================
// PRICE FORMATTING
// ==========================================

function formatPrice(price) {
  return `$${Number(price || 0).toFixed(2)}`;
}

// ==========================================
// CART COUNT
// ==========================================

function updateCartCount() {
  if (!cartCount) return;

  let total = 0;

  cart.forEach(function (item) {
    total += Number(item.quantity || 0);
  });

  cartCount.textContent = total;
}

// ==========================================
// WISHLIST COUNT
// ==========================================

function updateWishlistCount() {
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length;
  }
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message) {
  let toast = document.querySelector("#store-toast");

  if (!toast) {
    toast = document.createElement("div");

    toast.id = "store-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    toast.className =
      "fixed bottom-4 left-4 right-4 z-[3000] mx-auto w-fit max-w-[calc(100%-2rem)] rounded-xl bg-burgundy px-5 py-3 text-center text-sm text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6";

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("hidden");

  window.clearTimeout(window.kovaToastTimer);

  window.kovaToastTimer = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}

// ==========================================
// PROMOTIONAL BANNER
// ==========================================

function displayPromoBanner() {
  const banner = document.createElement("a");

  banner.href = "#products";

  banner.className =
    "group col-span-full block overflow-hidden rounded-2xl border border-[#F0D9DF] bg-blush";

  banner.setAttribute("aria-label", "Explore the Kova Beauty collection");

  banner.innerHTML = `
    <img
      src="./assets/images/Promotion-banner.jpg"
      alt="Kova Beauty — reveal your natural radiance"
      loading="lazy"
      class="aspect-16/5 max-h-56 w-full object-cover transition duration-500 group-hover:scale-[1.01] sm:aspect-16/4"
    >
  `;

  productsContainer.appendChild(banner);
}

// ==========================================
// PRODUCT CARD
// ==========================================

function productCard(product) {
  const discount = Math.round(Number(product.discountPercentage || 0));

  const hasDiscount = discount > 0 && discount < 100;

  const oldPrice = hasDiscount
    ? Number(product.price) / (1 - discount / 100)
    : null;

  const wishlisted = wishlist.includes(product.id);

  const outOfStock = Number(product.stock) < 1;

  return `
    <article class="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#F0D9DF] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <!-- Product Image -->
      <div class="relative flex h-48 items-center justify-center overflow-hidden bg-blush/50 p-4 sm:h-56 lg:h-60">

        <img
          src="${product.thumbnail}"
          alt="${product.title}"
          loading="lazy"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-105"
        >

        ${
          hasDiscount
            ? `<span class="absolute left-3 top-3 rounded-full bg-burgundy px-3 py-1 text-[10px] font-bold text-white">${discount}% OFF</span>`
            : ""
        }

        <!-- Wishlist Button -->
        <button
          type="button"
          data-action="wishlist"
          data-id="${product.id}"
          aria-label="${wishlisted ? "Remove from wishlist" : "Add to wishlist"}"
          aria-pressed="${wishlisted}"
          class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-burgundy shadow transition hover:bg-blush focus:outline-none focus:ring-2 focus:ring-rose"
        >

          <i
            class="${wishlisted ? "fa-solid" : "fa-regular"} fa-heart"
            aria-hidden="true"
          ></i>

        </button>

      </div>

      <!-- Product Information -->
      <div class="flex flex-1 flex-col p-4">

        <p class="text-[10px] uppercase tracking-[0.18em] text-rose">
          ${product.brand || "Kova Beauty"}
        </p>

        <h3 class="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-burgundy">
          ${product.title}
        </h3>

        <p class="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
          ${product.description}
        </p>

        <!-- Rating and Stock -->
        <div class="mt-3 flex items-center gap-2 text-xs">

          <span class="text-amber-500">
            <i class="fa-solid fa-star" aria-hidden="true"></i>
          </span>

          <span class="font-semibold">
            ${Number(product.rating || 0).toFixed(1)}
          </span>

          <span class="text-gray-400">
            ${Number(product.stock || 0)} in stock
          </span>

        </div>

        <!-- Product Price -->
        <div class="mt-3 flex flex-wrap items-center gap-2">

          <span class="text-base font-bold text-burgundy">
            ${formatPrice(product.price)}
          </span>

          ${
            hasDiscount
              ? `<span class="text-xs text-gray-400 line-through">${formatPrice(oldPrice)}</span>`
              : ""
          }

        </div>

        <!-- Product Actions -->
        <div class="mt-auto pt-4">

          <button
            type="button"
            data-action="details"
            data-id="${product.id}"
            class="w-full rounded-full border border-burgundy py-2.5 text-xs font-semibold text-burgundy transition hover:bg-blush focus:outline-none focus:ring-2 focus:ring-rose"
          >
            VIEW DETAILS
          </button>

          <button
            type="button"
            data-action="cart"
            data-id="${product.id}"
            ${outOfStock ? "disabled" : ""}
            class="mt-2 w-full rounded-full bg-burgundy py-2.5 text-xs font-semibold text-white transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2"
          >
            ${outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </button>

        </div>

      </div>

    </article>
  `;
}

// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(list, includeBanner = true) {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  if (!list.length) {
    productsContainer.innerHTML = `
      <p class="col-span-full rounded-2xl bg-white px-5 py-12 text-center text-sm text-gray-500">
        No products found. Try another search.
      </p>
    `;

    return;
  }

  productsContainer.innerHTML = list.map(productCard).join("");

  if (includeBanner && list.length > 4) {
    displayPromoBanner();
  }
}

// ==========================================
// SEARCH AND FILTER PRODUCTS
// ==========================================

function filterProducts(query) {
  const term = query.trim().toLowerCase();

  if (!term) return products;

  return products.filter((product) =>
    [product.title, product.brand, product.category, product.description].some(
      (value) =>
        String(value || "")
          .toLowerCase()
          .includes(term),
    ),
  );
}

// ==========================================
// LOAD PRODUCTS FROM API
// ==========================================

async function loadProducts() {
  if (!productsContainer) return;

  try {
    const response = await fetch("https://dummyjson.com/products?limit=30");

    if (!response.ok) {
      throw new Error("Could not load products.");
    }

    const data = await response.json();

    products = Array.isArray(data.products) ? data.products : [];

    displayProducts(products);
  } catch (error) {
    console.error(error);

    productsContainer.innerHTML = `
      <div class="col-span-full rounded-2xl border border-[#F0D9DF] bg-white px-5 py-12 text-center">

        <p class="font-semibold text-burgundy">
          We couldn't load the products.
        </p>

        <p class="mt-2 text-sm text-gray-500">
          Please check your internet connection and refresh the page.
        </p>

        <button
          id="retry-products"
          class="mt-4 rounded-full bg-burgundy px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose"
        >
          Try again
        </button>

      </div>
    `;
  }
}

// ==========================================
// SEARCH FORM EVENT
// ==========================================

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  displayProducts(filterProducts(searchInput?.value || ""));
});

// ==========================================
// LIVE SEARCH EVENT
// ==========================================

searchInput?.addEventListener("input", () => {
  displayProducts(filterProducts(searchInput.value));
});

// ==========================================
// PRODUCT ACTIONS
// CART, WISHLIST AND PRODUCT DETAILS
// ==========================================

productsContainer?.addEventListener("click", (e) => {
  // Retry Loading Products
  const retryButton = e.target.closest("#retry-products");

  if (retryButton) {
    loadProducts();
    return;
  }

  // Find Product Action Button
  const button = e.target.closest("button[data-action]");

  if (!button) return;

  const productId = Number(button.dataset.id);

  const product = products.find((item) => item.id === productId);

  if (!product) return;

  const action = button.dataset.action;

  // ========================================
  // VIEW PRODUCT DETAILS
  // ========================================

  if (action === "details") {
    window.location.href = `product-details.html?id=${productId}`;
    return;
  }

  // ========================================
  // ADD PRODUCT TO CART
  // ========================================

  if (action === "cart") {
    const existing = cart.find((item) => item.id === productId);

    const currentQuantity = existing?.quantity || 0;

    // Check Available Stock
    if (currentQuantity >= product.stock) {
      showToast("You have reached the available stock.");
      return;
    }

    // Update Existing Cart Item
    if (existing) {
      existing.quantity += 1;
    } else {
      // Add New Cart Item
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }

    // Save Cart
    saveStorage("kovaCart", cart);

    updateCartCount();

    showToast(`${product.title} added to your cart.`);

    return;
  }

  // ========================================
  // ADD OR REMOVE FROM WISHLIST
  // ========================================

  if (action === "wishlist") {
    if (wishlist.includes(productId)) {
      // Remove From Wishlist
      wishlist = wishlist.filter((id) => id !== productId);

      showToast("Removed from your wishlist.");
    } else {
      // Add To Wishlist
      wishlist.push(productId);

      showToast(`${product.title} added to your wishlist.`);
    }

    // Save Wishlist
    saveStorage("kovaWishlist", wishlist);

    updateWishlistCount();

    displayProducts(filterProducts(searchInput?.value || ""), false);
  }
});

// ==========================================
// INITIALIZE STORE
// ==========================================

// Update Cart Count
updateCartCount();

// Update Wishlist Count
updateWishlistCount();

// Load Products
loadProducts();
