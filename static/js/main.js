document.addEventListener('DOMContentLoaded', () => {
    // cartItems will now store unique products with their quantities
    const cartItems = []; // { productId, name, price, quantity }
    const productCatalog = document.getElementById('product-catalog');
    const cartSection = document.getElementById('cart');
    const checkoutSection = document.getElementById('checkout-section');
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    const payWithQrBtn = document.getElementById('pay-with-qr-btn');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    let discountApplied = false;

    // Function to add or increment item in cart
    function addItemToCart(productId, productName, productPrice) {
        const existingItem = cartItems.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ productId: productId, name: productName, price: productPrice, quantity: 1 });
        }
        updateCartDisplay();
        updateTotal();
    }

    // Function to remove or decrement item from cart
    function removeItemFromCart(productIdToRemove) {
        const itemIndex = cartItems.findIndex(item => item.productId === productIdToRemove);
        if (itemIndex > -1) {
            if (cartItems[itemIndex].quantity > 1) {
                cartItems[itemIndex].quantity--;
            } else {
                cartItems.splice(itemIndex, 1); // Remove item if quantity is 1
            }
            updateCartDisplay();
            updateTotal();
        }
    }

    productCatalog.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.productId;
            const productElement = event.target.closest('.product-item');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('Price: $', ''));
            addItemToCart(productId, productName, productPrice);
        }
    });

    applyDiscountBtn.addEventListener('click', () => {
        if (!discountApplied) {
            // Calculate total based on quantities
            let currentTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            currentTotal *= 0.9; // Apply 10% discount
            checkoutSection.innerHTML = `<h2>Checkout</h2><p>Total: $${currentTotal.toFixed(2)}</p>`;
            discountApplied = true;
            applyDiscountBtn.disabled = true; // Disable button after one use
        }
    });

    payWithQrBtn.addEventListener('click', async () => {
        let total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
            li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.classList.add('remove-from-cart'); // Add a class for styling/identification
            removeBtn.dataset.productId = item.productId; // Identify which product to remove
            li.appendChild(removeBtn);
            ul.appendChild(li);
        });
        cartSection.appendChild(ul);

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productIdToRemove = event.target.dataset.productId;
                removeItemFromCart(productIdToRemove);
            });
        });
    }

    function updateTotal() {
        // Calculate total based on quantities
        let total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutSection.innerHTML = `<h2>Checkout</h2><p>Total: $${total.toFixed(2)}</p>`;
    }

    updateTotal(); // Initial call to display total on page load
});
