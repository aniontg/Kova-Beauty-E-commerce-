
const detailsContainer = document.querySelector("#product-details-container");

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");


// 2. SHOW ERROR MESSAGE
// ==========================================

function showMessage(message) {
  if (!detailsContainer) return;

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
// ==========================================

function showToast(message) {
  let toast = document.querySelector("#store-toast");

  // Creates the toast if it does not exist
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

  // Clear the previous timer
  clearTimeout(window.kovaToastTimer);

  // Hide the toast after 2.6 seconds
  window.kovaToastTimer = setTimeout(function () {
    toast.classList.add("hidden");
  }, 2600);
}


// 4. UPDATE CART COUNT
// ==========================================

function updateCartCount() {
  const countElement = document.querySelector("#cart-count");

  if (!countElement) return;

  let cart = [];

  // Get cart data from localStorage
  try {
    cart = JSON.parse(localStorage.getItem("kovaCart")) || [];
  } catch (error) {
    cart = [];
  }

  // Calculate the total quantity of products
  let totalItems = 0;

  cart.forEach(function (item) {
    totalItems += Number(item.quantity || 0);
  });

  countElement.textContent = totalItems;
}


// 5. DISPLAY PRODUCT DETAILS
// ==========================================

function renderProduct(product) {

  // Get product discount
  const discount = Number(product.discountPercentage || 0);

  // Calculate the original price
  let oldPrice = null;

  if (discount > 0 && discount < 100) {
    oldPrice = product.price / (1 - discount / 100);
  }

  // Get product images
  let images = [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    images = product.images;
  } else {
    images = [product.thumbnail];
  }

  // Starting quantity
  let quantity = 1;


  // DISPLAY PRODUCT HTML
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


      <!-- Product Image Thumbnails -->
      <div id="product-thumbnails"
        class="mt-3 flex gap-3 overflow-x-auto pb-2">

        ${images.map(function (image, index) {

          let borderClass = "border-[#F0D9DF]";

          if (index === 0) {
            borderClass = "border-burgundy";
          }

          return `
            <button
              type="button"
              data-image-index="${index}"
              aria-label="Show product image ${index + 1}"
              class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${borderClass} bg-white p-1 sm:h-20 sm:w-20"
            >

              <img
                src="${image}"
                alt=""
                loading="lazy"
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


      <!-- Product Rating -->
      <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">

        <span class="text-amber-500">
          <i class="fa-solid fa-star" aria-hidden="true"></i>
        </span>

        <strong>
          ${Number(product.rating || 0).toFixed(1)}
        </strong>

        <span class="text-gray-500">
          ${(product.reviews || []).length} reviews
        </span>

      </div>


      <!-- Product Price -->
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


      <!-- Product Description -->
      <div class="mt-6 border-t border-[#F0D9DF] pt-5">

        <h2 class="font-semibold text-charcoal">
          Product description
        </h2>

        <p class="mt-2 text-sm leading-7 text-gray-600">
          ${product.description}
        </p>

      </div>


      <!-- Product Information -->
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


      <!-- PRODUCT QUANTITY -->
      <div class="mt-6 flex flex-wrap items-center gap-4">

        <span class="text-sm font-semibold">
          Quantity
        </span>

        <div class="flex items-center rounded-full border border-[#E8CDD4]">

          <button
            type="button"
            id="quantity-minus"
            aria-label="Decrease quantity"
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
            aria-label="Increase quantity"
            class="px-4 py-3 text-burgundy hover:text-rose"
          >
            <i class="fa-solid fa-plus"></i>
          </button>

        </div>

        <span class="text-xs text-gray-500">
          ${Number(product.stock)} available
        </span>

      </div>


      <!-- ADD TO CART BUTTON -->
      <button
        type="button"
        id="details-add-to-cart"
        ${product.stock < 1 ? "disabled" : ""}
        class="mt-6 w-full rounded-full bg-burgundy px-6 py-4 text-sm font-semibold tracking-wider text-white transition hover:bg-rose disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-md"
      >

        <i class="fa-solid fa-bag-shopping mr-2" aria-hidden="true"></i>

        ${product.stock < 1 ? "OUT OF STOCK" : "ADD TO CART"}

      </button>

    </section>
  `;


  // 6. CHANGE PRODUCT IMAGES
  // ==========================================

  const mainImage = document.querySelector("#main-product-image");

  const thumbnails = document.querySelector("#product-thumbnails");

  thumbnails.addEventListener("click", function (event) {

    const button = event.target.closest("button[data-image-index]");

    if (!button) return;

    // Get the selected image
    const imageIndex = Number(button.dataset.imageIndex);

    mainImage.src = images[imageIndex];


    // Reset all thumbnail borders
    const allButtons = thumbnails.querySelectorAll("button");

    allButtons.forEach(function (item) {
      item.classList.remove("border-burgundy");
      item.classList.add("border-[#F0D9DF]");
    });


    // Highlight the selected thumbnail
    button.classList.add("border-burgundy");
    button.classList.remove("border-[#F0D9DF]");

  });


  // 7. INCREASE AND DECREASE QUANTITY
  // ==========================================

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
  // ==========================================

  const addToCartButton = document.querySelector("#details-add-to-cart");

  addToCartButton.addEventListener("click", function () {

    let cart = [];

    // Get existing cart
    try {
      cart = JSON.parse(localStorage.getItem("kovaCart")) || [];
    } catch (error) {
      cart = [];
    }


    // Check if the product is already in the cart
    const existingProduct = cart.find(function (item) {
      return item.id === product.id;
    });


    // Get the quantity already in the cart
    let alreadyInCart = 0;

    if (existingProduct) {
      alreadyInCart = Number(existingProduct.quantity || 0);
    }


    // Check available stock
    if (alreadyInCart + quantity > product.stock) {

      showToast("There isn't enough stock for that quantity.");

      return;
    }


    // Update existing product quantity
    if (existingProduct) {

      existingProduct.quantity += quantity;

    } else {

      // Add a new product to the cart
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: quantity
      });

    }


    // Save cart to localStorage
    localStorage.setItem("kovaCart", JSON.stringify(cart));


    // Update cart count
    updateCartCount();


    // Show success message
    showToast(`${product.title} added to your cart.`);

  });

}


// 9. LOAD PRODUCT FROM API
// ==========================================

async function loadProduct() {

  if (!detailsContainer) return;


  // Check if the product ID is valid
  if (!productId || !/^\d+$/.test(productId)) {

    showMessage("Invalid product selection.");

    return;
  }


  try {

    // Request product information from the API
    const response = await fetch(
      `https://dummyjson.com/products/${productId}`
    );


    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Product not found.");
    }


    // Convert response to JavaScript data
    const product = await response.json();


    // Check if product exists
    if (!product.id) {
      throw new Error("Product not found.");
    }


    // Display product information
    renderProduct(product);


  } catch (error) {

    console.error(error);

    showMessage("We couldn't load this product. Please try again.");

  }

}


// 10. START THE PAGE
// ==========================================

// Update shopping cart count
updateCartCount();

// Load the selected product
loadProduct();
