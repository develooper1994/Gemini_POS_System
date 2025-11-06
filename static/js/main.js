document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const productCatalog = document.getElementById('product-catalog');
    const cartSection = document.getElementById('cart');
    const checkoutSection = document.getElementById('checkout-section');
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    const payWithQrBtn = document.getElementById('pay-with-qr-btn');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    let discountApplied = false;

    productCatalog.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.productId;
            const productElement = event.target.closest('.product-item');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('Price: $', ''));

            const item = { id: productId, name: productName, price: productPrice };
            cartItems.push(item);
            updateCartDisplay();
            updateTotal();
        }
    });

    applyDiscountBtn.addEventListener('click', () => {
        if (!discountApplied) {
            let currentTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
            currentTotal *= 0.9; // Apply 10% discount
            checkoutSection.innerHTML = `<h2>Checkout</h2><p>Total: $${currentTotal.toFixed(2)}</p>`;
            discountApplied = true;
            applyDiscountBtn.disabled = true; // Disable button after one use
        }
    });

    payWithQrBtn.addEventListener('click', async () => {
        let total = cartItems.reduce((sum, item) => sum + item.price, 0);
        if (discountApplied) {
            total *= 0.9;
        }
        const qrData = `Total: $${total.toFixed(2)}`;
        const qrUrl = `/generate_qr?data=${encodeURIComponent(qrData)}`;

        try {
            const response = await fetch(qrUrl);
            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = 'QR Code';
                qrCodeDisplay.innerHTML = ''; // Clear previous QR code
                qrCodeDisplay.appendChild(imgElement);
            } else {
                qrCodeDisplay.innerHTML = '<p>Error generating QR code.</p>';
            }
        } catch (error) {
            console.error('Error fetching QR code:', error);
            qrCodeDisplay.innerHTML = '<p>Error fetching QR code.</p>';
        }
    });

    function updateCartDisplay() {
        cartSection.innerHTML = '<h2>Shopping Cart</h2>';
        if (cartItems.length === 0) {
            cartSection.innerHTML += '<p>Your cart is empty.</p>';
        }

        const ul = document.createElement('ul');
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            ul.appendChild(li);
        });
        cartSection.appendChild(ul);
    }

    function updateTotal() {
        let total = cartItems.reduce((sum, item) => sum + item.price, 0);
        checkoutSection.innerHTML = `<h2>Checkout</h2><p>Total: $${total.toFixed(2)}</p>`;
    }

    updateTotal(); // Initial call to display total on page load
});
