// KOVA BEAUTY — product details page
const detailsContainer = document.querySelector("#product-details-container");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");



function showMessage(message) {
  if (!detailsContainer) return;
  detailsContainer.innerHTML = `
    <div class="col-span-full py-16 text-center">
      <p class="font-semibold text-burgundy">${message}</p>
      <a href="index.html#products" class="mt-4 inline-block text-sm font-semibold text-rose underline">Return to shop</a>
    </div>`;
}

function showToast(message) {
  let toast = document.querySelector("#store-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "store-toast";
    toast.setAttribute("role", "status");
    toast.className =
      "fixed bottom-4 left-4 right-4 z-[3000] mx-auto w-fit max-w-[calc(100%-2rem)] rounded-xl bg-burgundy px-5 py-3 text-center text-sm text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(window.kovaToastTimer);
  window.kovaToastTimer = setTimeout(() => toast.classList.add("hidden"), 2600);
}

function updateCartCount() {
  const countElement = document.querySelector("#cart-count");
  if (!countElement) return;

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("kovaCart")) || [];
  } catch {
    cart = [];
  }

  countElement.textContent = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
}

function renderProduct(product) {
  const discount = Number(product.discountPercentage || 0);
  const oldPrice =
    discount > 0 && discount < 100
      ? product.price / (1 - discount / 100)
      : null;
  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.thumbnail];
  let quantity = 1;

  detailsContainer.innerHTML = `
    <section class="min-w-0">
      <div class="flex min-h-70 items-center justify-center overflow-hidden rounded-2xl bg-blush/60 p-5 sm:min-h-105 lg:min-h-130">
        <img id="main-product-image" src="${images[0]}" alt="${product.title}" class="max-h-120 w-full object-contain">
      </div>
      <div id="product-thumbnails" class="mt-3 flex gap-3 overflow-x-auto pb-2">
        ${images
          .map(
            (image, index) => `
          <button type="button" data-image-index="${index}" aria-label="Show product image ${index + 1}"
            class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${index === 0 ? "border-burgundy" : "border-[#F0D9DF]"} bg-white p-1 sm:h-20 sm:w-20">
            <img src="${image}" alt="" loading="lazy" class="h-full w-full object-contain">
          </button>`,
          )
          .join("")}
      </div>
    </section>

    <section class="flex min-w-0 flex-col justify-center py-2 sm:py-5">
      <p class="text-xs uppercase tracking-[0.2em] text-rose">${product.category || "Beauty"}</p>
      <h1 class="mt-3 wrap-break-word text-2xl font-bold leading-tight text-burgundy sm:text-3xl lg:text-4xl">${product.title}</h1>
      <p class="mt-3 text-sm text-gray-500">Brand: ${product.brand || "Kova Beauty"}</p>

      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span class="text-amber-500"><i class="fa-solid fa-star" aria-hidden="true"></i></span>
        <strong>${Number(product.rating || 0).toFixed(1)}</strong>
        <span class="text-gray-500">${product.reviews?.length || 0} reviews</span>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-3">
        <span class="text-2xl font-bold text-burgundy sm:text-3xl">$${Number(product.price).toFixed(2)}</span>
        ${oldPrice ? `<span class="text-sm text-gray-400 line-through">$${oldPrice.toFixed(2)}</span><span class="rounded-full bg-blush px-3 py-1 text-xs font-bold text-burgundy">${Math.round(discount)}% OFF</span>` : ""}
      </div>

      <div class="mt-6 border-t border-[#F0D9DF] pt-5">
        <h2 class="font-semibold text-charcoal">Product description</h2>
        <p class="mt-2 text-sm leading-7 text-gray-600">${product.description}</p>
      </div>

      <div class="mt-5 space-y-3 border-t border-[#F0D9DF] pt-5 text-sm">
        <p><strong class="text-burgundy">Availability:</strong> ${product.availabilityStatus || `${product.stock} in stock`}</p>
        <p><strong class="text-burgundy">Shipping:</strong> ${product.shippingInformation || "Information unavailable"}</p>
        <p><strong class="text-burgundy">Returns:</strong> ${product.returnPolicy || "Information unavailable"}</p>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-4">
        <span class="text-sm font-semibold">Quantity</span>
        <div class="flex items-center rounded-full border border-[#E8CDD4]">
          <button type="button" id="quantity-minus" aria-label="Decrease quantity" class="px-4 py-3 text-burgundy hover:text-rose"><i class="fa-solid fa-minus"></i></button>
          <span id="quantity-value" class="min-w-8 text-center text-sm font-semibold">1</span>
          <button type="button" id="quantity-plus" aria-label="Increase quantity" class="px-4 py-3 text-burgundy hover:text-rose"><i class="fa-solid fa-plus"></i></button>
        </div>
        <span class="text-xs text-gray-500">${Number(product.stock)} available</span>
      </div>

      <button type="button" id="details-add-to-cart" ${product.stock < 1 ? "disabled" : ""}
        class="mt-6 w-full rounded-full bg-burgundy px-6 py-4 text-sm font-semibold tracking-wider text-white transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-md">
        <i class="fa-solid fa-bag-shopping mr-2" aria-hidden="true"></i>
        ${product.stock < 1 ? "OUT OF STOCK" : "ADD TO CART"}
      </button>
    </section>
  `;

  const mainImage = document.querySelector("#main-product-image");
  const thumbnails = document.querySelector("#product-thumbnails");

  thumbnails.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-image-index]");
    if (!button) return;
    mainImage.src = images[Number(button.dataset.imageIndex)];
    thumbnails.querySelectorAll("button").forEach((item) => {
      item.classList.remove("border-burgundy");
      item.classList.add("border-[#F0D9DF]");
    });
    button.classList.add("border-burgundy");
    button.classList.remove("border-[#F0D9DF]");
  });

  const quantityValue = document.querySelector("#quantity-value");

  document.querySelector("#quantity-minus").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    quantityValue.textContent = quantity;
  });

  document.querySelector("#quantity-plus").addEventListener("click", () => {
    quantity = Math.min(Number(product.stock), quantity + 1);
    quantityValue.textContent = quantity;
  });

  document
    .querySelector("#details-add-to-cart")
    .addEventListener("click", () => {
      let cart = [];
      try {
        cart = JSON.parse(localStorage.getItem("kovaCart")) || [];
      } catch {
        cart = [];
      }

      const existing = cart.find((item) => item.id === product.id);
      const alreadyInCart = existing?.quantity || 0;

      if (alreadyInCart + quantity > product.stock) {
        showToast("There isn't enough stock for that quantity.");
        return;
      }

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity,
        });
      }

      localStorage.setItem("kovaCart", JSON.stringify(cart));
      updateCartCount();
      showToast(`${product.title} added to your cart.`);
    });
}

async function loadProduct() {
  if (!detailsContainer) return;

  if (!productId || !/^\d+$/.test(productId)) {
    showMessage("Invalid product selection.");
    return;
  }

  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) throw new Error("Product not found.");

    const product = await response.json();
    if (!product?.id) throw new Error("Product not found.");

    renderProduct(product);
  } catch (error) {
    console.error(error);
    showMessage("We couldn't load this product. Please try again.");
  }
}

updateCartCount();
loadProduct();
