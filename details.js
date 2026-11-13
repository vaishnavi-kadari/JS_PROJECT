const productId = new URLSearchParams(window.location.search).get("id");
const status = document.getElementById("details-status");
const details = document.getElementById("product-details");
const productDescriptions = {
    "high-back bench": "A high-back bench that adds practical seating and a distinctive profile to your home.",
    "albany table": "A versatile table with a clean look and a practical surface for everyday use.",
    "accent chair": "An accent chair that adds extra seating and a distinctive touch to your room.",
    "wooden table": "A wooden table that brings a natural look and a useful surface to your space.",
    "dining table": "A dining table that creates a welcoming place for meals and gatherings.",
    "sofa set": "A coordinated sofa set that gives family and guests a place to relax together.",
    "modern bookshelf": "A modern bookshelf to organize books and display favorite items.",
    "emperor bed": "A bed that creates a comfortable focal point for your bedroom.",
    "utopia sofa": "A sofa that brings relaxed seating and an inviting look to your living room.",
    "entertainment center": "An entertainment center to organize media equipment and accessories.",
    "albany sectional": "A sectional sofa that provides generous seating for relaxing and gathering.",
    "leather sofa": "A leather sofa that pairs a classic look with practical living-room seating."
};

function addToCart(product, fields) {
    let cart;
    try {
        cart = JSON.parse(localStorage.getItem("comfy-cart") || "[]");
        if (!Array.isArray(cart)) {
            throw new Error("Saved cart data is invalid.");
        }
    } catch (error) {
        status.textContent = "Your cart could not be loaded.";
        console.error(error);
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: fields.name,
            image: fields.image[0].url,
            price: fields.price / 100,
            quantity: 1
        });
    }

    try {
        localStorage.setItem("comfy-cart", JSON.stringify(cart));
        status.hidden = false;
        status.textContent = `${fields.name} added to your cart.`;
    } catch (error) {
        status.textContent = "Your cart could not be updated.";
        console.error(error);
    }
}

async function loadProduct() {
    if (!productId) {
        status.textContent = "No product was selected.";
        return;
    }

    try {
        const response = await fetch("https://www.course-api.com/javascript-store-products");
        if (!response.ok) {
            throw new Error(`Products request failed: ${response.status}`);
        }

        const products = await response.json();
        const product = products.find(item => item.id === productId);
        if (!product) {
            status.textContent = "Product not found.";
            return;
        }

        const fields = product.fields;
        document.getElementById("breadcrumb-product-name").textContent = fields.name;

        const image = document.createElement("img");
        image.src = fields.image[0].url;
        image.alt = fields.name;

        const info = document.createElement("div");
        const name = document.createElement("h1");
        name.textContent = fields.name;

        const company = document.createElement("p");
        company.className = "product-company";
        company.textContent = `by ${fields.company}`;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = `$${(fields.price / 100).toFixed(2)}`;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent =`Cloud bread VHS hell of banjo bicycle rights jianbing umami mumblecore etsy 8-bit pok pok +1 wolf. Vexillologist yr dreamcatcher waistcoat, authentic chillwave trust fund. Viral typewriter fingerstache pinterest pork belly narwhal. Schlitz venmo everyday carry kitsch pitchfork chillwave iPhone taiyaki trust fund hashtag kinfolk microdosing gochujang live-edge.`;

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-to-cart-button";
        addButton.textContent = "ADD TO CART";
        addButton.addEventListener("click", () => addToCart(product, fields));

        info.append(name, company, price, description, addButton);
        details.append(image, info);
        document.title = `${fields.name} | Comfy`;
        status.hidden = true;
    } catch (error) {
        status.textContent = "Product details could not load.";
        console.error(error);
    }
}

loadProduct();