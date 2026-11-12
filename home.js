let cartIcon = document.getElementById("icon")
let cart = document.getElementById("your-cart")
let cartClose = document.getElementById("close-cart")
let cartOverlay = document.getElementById("cart-overlay")

function openCart() {
    cart.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
}

function closeCart() {
    cart.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}

cartIcon.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cart.classList.contains("active")) {
        closeCart();
    }
});

// ENDS

const cartItems = [];
const cartHolder = document.querySelector(".card-holder");
const cartTotal = document.querySelector(".total h5");
const cartCount = document.querySelector(".add-to-cart");

function addToCart(button) {
    const card = button.closest(".box");
    const name = card.querySelector("p").textContent.trim();
    const existingItem = cartItems.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            name,
            image: card.querySelector("img").getAttribute("src"),
            price: Number(card.querySelector("h4").textContent.replace(/[^\d.]/g, "")),
            quantity: 1
        });
    }

    displayCart();
    openCart();
}

function displayCart() {
    cartHolder.innerHTML = cartItems.map((item, index) => `
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

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = itemCount;
    cartCount.style.visibility = itemCount > 0 ? "visible" : "hidden";
}

// INCREASE AND DECREASE AND REMOVE FUNTIONALITY

cartHolder.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const index = Number(button.dataset.index);
    const item = cartItems[index];
    if (!item) return;

    if (button.dataset.action === "remove") {
        cartItems.splice(index, 1);
    } else if (button.dataset.action === "increase") {
        item.quantity++;
    } else if (button.dataset.action === "decrease") {
        item.quantity--;
        if (item.quantity === 0) cartItems.splice(index, 1);
    }

    displayCart();
});