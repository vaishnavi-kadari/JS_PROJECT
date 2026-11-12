let cartIcon = document.getElementById("icon");
let yourCart = document.getElementById("your-cart");
let cartClose = document.getElementById("close-cart");

cartIcon.addEventListener("click", () => {
    yourCart.classList.add("active");
});

cartClose.addEventListener("click", () => {
    yourCart.classList.remove("active");
});