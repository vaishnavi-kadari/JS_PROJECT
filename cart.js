const productId = new URLSearchParams(window.location.search).get("id");

async function loadProduct() {
    const status = document.getElementById("details-status");
    const details = document.getElementById("product-details");

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

        details.innerHTML = `
            <div class="product-details">
                <img src="${fields.image[0].url}" alt="${fields.name}">
            </div>

            <div class="product-details">
                <h2>${fields.name}</h2>
                <p id="p1">by ${fields.company}</p>
                <p id="p2">$${(fields.price / 100).toFixed(2)}</p>
                <div class="colors">
                    ${fields.colors.map(color => `
                        <button type="button" aria-label="${color}" style="background:${color}"></button>
                    `).join("")}
                </div>
                 <p id="p3">Cloud bread VHS hell of banjo bicycle rights jianbing<br>
                  umami mumblecore etsy 8-bit pok pok +1 wolf. <br>
                  Vexillologist yr dreamcatcher waistcoat, authentic<br>
                   chillwave trust fund. Viral typewriter fingerstache<br>
                    pinterest pork belly narwhal. Schlitz venmo everyday<br>
                     carry kitsch pitchfork chillwave iPhone taiyaki trust <br>
                     fund hashtag kinfolk microdosing gochujang live-edge</p>
                <button type="button">ADD TO CART</button>
            </div>
        `;

        status.hidden = true;
    } catch (error) {
        status.textContent = "Product details could not load.";
        console.error(error);
    }
}

loadProduct();