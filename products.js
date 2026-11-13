let cartIcon = document.getElementById("icon");
let yourCart = document.getElementById("your-cart");
let cartClose = document.getElementById("close-cart");
let cartOverlay = document.getElementById("cart-overlay");

function openCart() {
    yourCart.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
}

function closeCart() {
    yourCart.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}

cartIcon.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && yourCart.classList.contains("active")) {
        closeCart();
    }
});


// VARIABLES
const productsContainer = document.querySelector(".product-cards");
const cartCount = document.querySelector(".add-to-cart");

let products = [];
let cart = JSON.parse(localStorage.getItem("comfy-cart") || "[]");
let displayedProducts = [];


// ADD TO CART
function addToCart(id) {

    let item = products.find(product => product.id === id);

    if (!item) return;

    let product = item.fields;

    let existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: id,
            name: product.name,
            image: product.image[0].url,
            price: product.price / 100,
            quantity: 1

        });

    }

    displayCart();
    openCart();
}


// DISPLAY CART
function displayCart() {

    const cardHolder = document.querySelector(".card-holder");

    cardHolder.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="image-cart">
                    <img src="${item.image}" alt="${item.name}">
                </div>

                <div class="cards-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <button type="button" data-action="remove" data-index="${index}">Remove</button>
                </div>

                <div class="value">
                    <button type="button" data-action="increase" data-index="${index}" aria-label="Increase ${item.name} quantity">
                        <i class="fa-solid fa-chevron-up"></i>
                    </button>
                    <p>${item.quantity}</p>
                    <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease ${item.name} quantity">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
            </div>
        `).join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-total").textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
    cartCount.style.visibility = itemCount > 0 ? "visible" : "hidden";
    localStorage.setItem("comfy-cart", JSON.stringify(cart));
}

displayCart();

document.querySelector(".card-holder").addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    const item = cart[index];
    if (!item) return;

    if (button.dataset.action === "remove") {
        cart.splice(index, 1);
    } else if (button.dataset.action === "increase") {
        item.quantity++;
    } else if (button.dataset.action === "decrease") {
        item.quantity--;
        if (item.quantity === 0) cart.splice(index, 1);
    }

    displayCart();
});

// price filter



const range = document.getElementById("price-range");
const priceValue = document.getElementById("price-value");
const container = document.querySelector(".product-cards");


        // FETCH API

        async function loadProducts() {

            try {

                const response = await fetch(
                    "https://www.course-api.com/javascript-store-products"
                );

                if (!response.ok) {
                    throw new Error(`Products request failed: ${response.status}`);
                }

                products = await response.json();
                displayProducts(products);

            } catch (error) {

                container.textContent = "Products could not load.";
                console.error(error);

            }

        }


        // DISPLAY PRODUCTS

        function displayProducts(products) {

            displayedProducts = products;
            container.style.display = "grid";
            document.getElementById("product-details").style.display = "none";

            if (products.length === 0) {

                container.innerHTML = "<h3>No products found!</h3>";

                return;

            }

            container.innerHTML = products.map(item => {

                const product = item.fields;

                return `

                    <div class="card">

                        <div class="card-image">
                            <img src="${product.image[0].url}" alt="${product.name}">
                            <button type="button" aria-label="Add ${product.name} to cart" onclick="addToCart('${item.id}')">
                                <i class="fa-solid fa-cart-shopping"></i>
                            </button>
                            
                            <a class="search-product" href="./details.html?id=${encodeURIComponent(item.id)}" aria-label="View ${product.name} details">
                                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                            </a>
                    
                        </div>
                        <h2>${product.name}</h2>
                        <h4>$${(product.price / 100).toFixed(2)}</h4>
                    </div>

                `;

            }).join("");

        }


        // PRICE FILTER

        range.addEventListener("input", function () {

            const maxPrice = Number(this.value);

            priceValue.textContent = maxPrice;

            const filteredProducts = products.filter(item => {

                const price = item.fields.price / 100;

                return price <= maxPrice;

            });

            displayProducts(filteredProducts);

        });


        // LOAD PRODUCTS

        loadProducts();


        // INPUT SEARCH START HERE

        const searchInput = document.getElementById("search-input");

        searchInput.addEventListener("input", function () {

            const searchValue = this.value.toLowerCase().trim();

            const filteredProducts = products.filter(item => {

                const productName = item.fields.name.toLowerCase();

                return productName.includes(searchValue);

            });

            displayProducts(filteredProducts);

        });

// BUTTON CLICK FILTER CODE

document.querySelectorAll(".company-btn").forEach(button => {
    button.addEventListener("click", function () {
        const company = this.textContent.trim().toLowerCase();
        const filteredProducts = company === "all"
            ? products
            : products.filter(item => item.fields.company.toLowerCase() === company);

        displayProducts(filteredProducts);
    });
});

// PRODUCT DETAILS