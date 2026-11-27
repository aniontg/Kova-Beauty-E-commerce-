// KOVA BEAUTY - PRODUCT PAGE

const productsContainer = document.querySelector("#product-container");
const cartCount = document.querySelector("#cart-count");
const wishlistCount = document.querySelector("#wishlist-count");
const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");

let products = [];
let cart = JSON.parse(localStorage.getItem("kovaCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("kovaWishlist")) || [];

// FORMAT PRICE

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

// SAVE CART AND WISHLIST

function saveData() {
  localStorage.setItem("kovaCart", JSON.stringify(cart));
  localStorage.setItem("kovaWishlist", JSON.stringify(wishlist));
}

// UPDATE COUNTS

function updateCounts() {
  let total = 0;

  cart.forEach((item) => {
    total += item.quantity;
  });

  cartCount.textContent = total;
  wishlistCount.textContent = wishlist.length;
}

// SHOW TOAST MESSAGE

function showToast(message) {
  let toast = document.querySelector("#store-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "store-toast";

    toast.className =
      "fixed bottom-4 left-4 right-4 z-[3000] mx-auto w-fit rounded-xl bg-burgundy px-5 py-3 text-sm text-white shadow-xl";

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(window.kovaToastTimer);

  window.kovaToastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}

// DISPLAY PROMOTIONAL BANNER

function displayPromoBanner() {
  const banner = document.createElement("a");

  banner.href = "#products";
  banner.className = "col-span-full block overflow-hidden rounded-2xl h-57.5";

  banner.innerHTML = `
    <img
      src="./assets/images/Promotion-banner.jpg"
      alt="Kova Beauty Promotion"
      class="w-full rounded-2xl"
    >
  `;

  productsContainer.appendChild(banner);
}

// CREATE PRODUCT CARD

function productCard(product) {
  const discount = Math.round(product.discountPercentage || 0);
  const hasDiscount = discount > 0 && discount < 100;

  const oldPrice = product.price / (1 - discount / 100);

  const wishlisted = wishlist.includes(product.id);

  return `
    <article class="group flex flex-col overflow-hidden rounded-2xl border border-[#F0D9DF] bg-white">

      <div class="relative flex h-48 items-center justify-center bg-blush/50 p-4 sm:h-56">

        <img
          src="${product.thumbnail}"
          alt="${product.title}"
          class="h-full w-full object-contain"
          loading="lazy"
        >

        ${
          hasDiscount
            ? `
          <span class="absolute left-3 top-3 rounded-full bg-burgundy px-3 py-1 text-xs text-white">
            ${discount}% OFF
          </span>
        `
            : ""
        }

        <button
          type="button"
          data-action="wishlist"
          data-id="${product.id}"
          aria-label="${wishlisted ? "Remove from wishlist" : "Add to wishlist"}"
          aria-pressed="${wishlisted}"
          class="absolute right-3 top-3 rounded-full bg-white p-3 text-burgundy shadow"
        >
          <i class="${wishlisted ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>

      </div>

      <div class="flex flex-1 flex-col p-4">

        <p class="text-xs uppercase text-rose">
          ${product.brand || "Kova Beauty"}
        </p>

        <h3 class="mt-2 text-sm font-semibold text-burgundy">
          ${product.title}
        </h3>

        <p class="mt-2 text-xs text-gray-500">
          ${product.description}
        </p>

        <div class="mt-3 flex gap-2 text-xs">
          <span class="text-amber-500">★</span>
          <span>${product.rating}</span>
          <span class="text-gray-400">${product.stock} in stock</span>
        </div>

        <div class="mt-3 flex items-center gap-2">

          <span class="font-bold text-burgundy">
            ${formatPrice(product.price)}
          </span>

          ${
            hasDiscount
              ? `
            <span class="text-xs text-gray-400 line-through">
              ${formatPrice(oldPrice)}
            </span>
          `
              : ""
          }

        </div>

        <div class="mt-auto pt-4">

          <button
            type="button"
            data-action="details"
            data-id="${product.id}"
            class="w-full rounded-full border border-burgundy py-2 text-xs text-burgundy"
          >
            VIEW DETAILS
          </button>

          <button
            type="button"
            data-action="cart"
            data-id="${product.id}"
            ${product.stock < 1 ? "disabled" : ""}
            class="mt-2 w-full rounded-full bg-burgundy py-2 text-xs text-white disabled:opacity-50"
          >
            ${product.stock < 1 ? "OUT OF STOCK" : "ADD TO CART"}
          </button>

        </div>

      </div>
    </article>
  `;
}

// DISPLAY PRODUCTS

function displayProducts(list, showBanner = true) {
  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = `
      <p class="col-span-full py-12 text-center text-gray-500">
        No products found. Try another search.
      </p>
    `;
    return;
  }

  productsContainer.innerHTML = list.map(productCard).join("");

  if (showBanner && list.length > 4) {
    displayPromoBanner();
  }
}

// SEARCH PRODUCTS

function filterProducts(query) {
  const term = query.toLowerCase().trim();

  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term),
  );
}

// LOAD PRODUCTS FROM API

async function loadProducts() {
  const response = await fetch(
    "https://dummyjson.com/products/category/beauty?limit=12",
  );

  const data = await response.json();

  products = data.products;

  displayProducts(products);
}

// SEARCH EVENTS

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = filterProducts(searchInput.value);

  displayProducts(results);
});

searchInput.addEventListener("input", () => {
  const results = filterProducts(searchInput.value);

  displayProducts(results);
});

// PRODUCT BUTTON EVENTS

productsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);

  const product = products.find((item) => item.id === id);

  const action = button.dataset.action;

  // VIEW PRODUCT DETAILS

  if (action === "details") {
    window.location.href = `product-details.html?id=${id}`;
  }

  // ADD TO CART

  if (action === "cart") {
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        showToast("You have reached the available stock.");
        return;
      }

      existing.quantity++;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      });
    }

    saveData();
    updateCounts();

    showToast(`${product.title} added to your cart.`);
  }

  // ADD OR REMOVE FROM WISHLIST

  if (action === "wishlist") {
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((item) => item !== id);

      showToast("Removed from your wishlist.");
    } else {
      wishlist.push(id);

      showToast(`${product.title} added to your wishlist.`);
    }

    saveData();
    updateCounts();

    displayProducts(filterProducts(searchInput.value), false);
  }
});

// START STORE

updateCounts();
loadProducts();
