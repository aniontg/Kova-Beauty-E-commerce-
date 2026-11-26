
// KOVA BEAUTY - PRODUCT DETAILS PAGE


// 1. SELECT HTML ELEMENTS
const detailsContainer = document.querySelector("#product-details-container");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");


// 2. SHOW MESSAGE
function showMessage(message) {
  detailsContainer.innerHTML = `
    <div class="col-span-full py-16 text-center">
      <p class="font-semibold text-burgundy">${message}</p>

      <a href="index.html#products"
        class="mt-4 inline-block text-sm font-semibold text-rose underline">
        Return to shop
      </a>
    </div>
  `;
}


// 3. SHOW TOAST MESSAGE
function showToast(message) {
  let toast = document.querySelector("#store-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "store-toast";

    toast.className =
      "fixed bottom-4 left-4 right-4 z-[3000] mx-auto w-fit max-w-[calc(100%-2rem)] rounded-xl bg-burgundy px-5 py-3 text-center text-sm text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6";

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(window.kovaToastTimer);

  window.kovaToastTimer = setTimeout(function () {
    toast.classList.add("hidden");
  }, 2600);
}


// 4. UPDATE CART COUNT
function updateCartCount() {
  const countElement = document.querySelector("#cart-count");

  if (!countElement) return;

  const cart = JSON.parse(localStorage.getItem("kovaCart")) || [];

  let totalItems = 0;

  cart.forEach(function (item) {
    totalItems += Number(item.quantity || 0);
  });

  countElement.textContent = totalItems;
}


// 5. DISPLAY PRODUCT DETAILS
function renderProduct(product) {

  // Product discount
  const discount = Number(product.discountPercentage || 0);

  let oldPrice = null;

  if (discount > 0 && discount < 100) {
    oldPrice = product.price / (1 - discount / 100);
  }


  // Product images
  let images = product.images || [product.thumbnail];

  let quantity = 1;


  // Display product information
  detailsContainer.innerHTML = `
    <section class="min-w-0">

      <!-- Main Product Image -->
      <div class="flex min-h-70 items-center justify-center overflow-hidden rounded-2xl bg-blush/60 p-5 sm:min-h-105 lg:min-h-130">

        <img
          id="main-product-image"
          src="${images[0]}"
          alt="${product.title}"
          class="max-h-120 w-full object-contain"
        >

      </div>


      <!-- Product Thumbnails -->
      <div id="product-thumbnails"
        class="mt-3 flex gap-3 overflow-x-auto pb-2">

        ${images.map(function (image, index) {

          let border = "border-[#F0D9DF]";

          if (index === 0) {
            border = "border-burgundy";
          }

          return `
            <button
              type="button"
              data-image-index="${index}"
              class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${border} bg-white p-1 sm:h-20 sm:w-20"
            >

              <img
                src="${image}"
                alt=""
                class="h-full w-full object-contain"
              >

            </button>
          `;

        }).join("")}

      </div>

    </section>


    <!-- PRODUCT INFORMATION -->
    <section class="flex min-w-0 flex-col justify-center py-2 sm:py-5">

      <!-- Category -->
      <p class="text-xs uppercase tracking-[0.2em] text-rose">
        ${product.category || "Beauty"}
      </p>


      <!-- Product Name -->
      <h1 class="mt-3 wrap-break-word text-2xl font-bold leading-tight text-burgundy sm:text-3xl lg:text-4xl">
        ${product.title}
      </h1>


      <!-- Brand -->
      <p class="mt-3 text-sm text-gray-500">
        Brand: ${product.brand || "Kova Beauty"}
      </p>


      <!-- Rating -->
      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">

        <span class="text-amber-500">
          <i class="fa-solid fa-star"></i>
        </span>

        <strong>${Number(product.rating || 0).toFixed(1)}</strong>

        <span class="text-gray-500">
          ${(product.reviews || []).length} reviews
        </span>

      </div>


      <!-- Price -->
      <div class="mt-5 flex flex-wrap items-center gap-3">

        <span class="text-2xl font-bold text-burgundy sm:text-3xl">
          $${Number(product.price).toFixed(2)}
        </span>

        ${oldPrice !== null ? `
          <span class="text-sm text-gray-400 line-through">
            $${oldPrice.toFixed(2)}
          </span>

          <span class="rounded-full bg-blush px-3 py-1 text-xs font-bold text-burgundy">
            ${Math.round(discount)}% OFF
          </span>
        ` : ""}

      </div>


      <!-- Description -->
      <div class="mt-6 border-t border-[#F0D9DF] pt-5">

        <h2 class="font-semibold text-charcoal">
          Product description
        </h2>

        <p class="mt-2 text-sm leading-7 text-gray-600">
          ${product.description}
        </p>

      </div>


      <!-- Additional Information -->
      <div class="mt-5 space-y-3 border-t border-[#F0D9DF] pt-5 text-sm">

        <p>
          <strong class="text-burgundy">Availability:</strong>
          ${product.availabilityStatus || `${product.stock} in stock`}
        </p>

        <p>
          <strong class="text-burgundy">Shipping:</strong>
          ${product.shippingInformation || "Information unavailable"}
        </p>

        <p>
          <strong class="text-burgundy">Returns:</strong>
          ${product.returnPolicy || "Information unavailable"}
        </p>

      </div>


      <!-- Quantity -->
      <div class="mt-6 flex flex-wrap items-center gap-4">

        <span class="text-sm font-semibold">
          Quantity
        </span>

        <div class="flex items-center rounded-full border border-[#E8CDD4]">

          <button
            type="button"
            id="quantity-minus"
            class="px-4 py-3 text-burgundy hover:text-rose"
          >
            <i class="fa-solid fa-minus"></i>
          </button>

          <span id="quantity-value"
            class="min-w-8 text-center text-sm font-semibold">
            1
          </span>

          <button
            type="button"
            id="quantity-plus"
            class="px-4 py-3 text-burgundy hover:text-rose"
          >
            <i class="fa-solid fa-plus"></i>
          </button>

        </div>

        <span class="text-xs text-gray-500">
          ${Number(product.stock)} available
        </span>

      </div>


      <!-- Add to Cart -->
      <button
        type="button"
        id="details-add-to-cart"
        ${product.stock < 1 ? "disabled" : ""}
        class="mt-6 w-full rounded-full bg-burgundy px-6 py-4 text-sm font-semibold tracking-wider text-white transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-md"
      >

        <i class="fa-solid fa-bag-shopping mr-2"></i>

        ${product.stock < 1 ? "OUT OF STOCK" : "ADD TO CART"}

      </button>

    </section>
  `;


  // 6. CHANGE PRODUCT IMAGES
  const mainImage = document.querySelector("#main-product-image");
  const thumbnails = document.querySelector("#product-thumbnails");

  thumbnails.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-image-index]");

    if (!button) return;

    const index = Number(button.dataset.imageIndex);

    mainImage.src = images[index];

    const buttons = thumbnails.querySelectorAll("button");

    buttons.forEach(function (item) {
      item.classList.remove("border-burgundy");
      item.classList.add("border-[#F0D9DF]");
    });

    button.classList.add("border-burgundy");
    button.classList.remove("border-[#F0D9DF]");

  });


  // 7. INCREASE AND DECREASE QUANTITY
  const quantityValue = document.querySelector("#quantity-value");

  const minusButton = document.querySelector("#quantity-minus");
  const plusButton = document.querySelector("#quantity-plus");


  // Decrease quantity
  minusButton.addEventListener("click", function () {

    if (quantity > 1) {
      quantity--;
    }

    quantityValue.textContent = quantity;

  });


  // Increase quantity
  plusButton.addEventListener("click", function () {

    if (quantity < product.stock) {
      quantity++;
    }

    quantityValue.textContent = quantity;

  });


  // 8. ADD PRODUCT TO CART
  const addToCartButton = document.querySelector("#details-add-to-cart");

  addToCartButton.addEventListener("click", function () {

    let cart = JSON.parse(localStorage.getItem("kovaCart")) || [];


    // Check if product is already in cart
    const existingProduct = cart.find(function (item) {
      return item.id === product.id;
    });


    let alreadyInCart = 0;

    if (existingProduct) {
      alreadyInCart = Number(existingProduct.quantity || 0);
    }


    // Check product stock
    if (alreadyInCart + quantity > product.stock) {
      showToast("There isn't enough stock for that quantity.");
      return;
    }


    // Update existing product
    if (existingProduct) {

      existingProduct.quantity += quantity;

    } else {

      // Add new product
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: quantity
      });

    }


    // Save cart
    localStorage.setItem("kovaCart", JSON.stringify(cart));

    updateCartCount();

    showToast(`${product.title} added to your cart.`);

  });

}


// 9. LOAD PRODUCT FROM API
async function loadProduct() {

  if (!detailsContainer) return;

  const response = await fetch(
    `https://dummyjson.com/products/${productId}`
  );

  const product = await response.json();

  renderProduct(product);

}


// 10. START THE PAGE
updateCartCount();

loadProduct();
