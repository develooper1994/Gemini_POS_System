document.addEventListener('DOMContentLoaded', () => {
    // cartItems will now store unique products with their quantities
    const cartItems = []; // { productId, name, price, quantity }
    const productCatalog = document.getElementById('product-catalog');
    const cartSection = document.getElementById('cart');
    const checkoutSection = document.getElementById('checkout-section');
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
    const payWithQrBtn = document.getElementById('pay-with-qr-btn');
    const completePurchaseBtn = document.getElementById('complete-purchase-btn');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    const totalAmountDisplay = document.getElementById('total-amount-display'); // Get reference to the new total display div
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
            discountApplied = true;
            applyDiscountBtn.disabled = true; // Disable button after one use
            updateTotal(); // Recalculate and display total with discount
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

    completePurchaseBtn.addEventListener('click', async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add items before completing the purchase.');
            return;
        }

        let totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (discountApplied) {
            totalAmount *= 0.9;
        }

        try {
            const response = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartItems: cartItems,
                    totalAmount: totalAmount.toFixed(2) // Send formatted total
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert('Alışverişiniz için teşekkürler! Transaction ID: ' + result.transaction_id);
                // Clear cart and reset state
                cartItems.length = 0; // Clear the array
                discountApplied = false;
                applyDiscountBtn.disabled = false;
                updateCartDisplay();
                updateTotal();
                qrCodeDisplay.innerHTML = ''; // Clear any displayed QR code
            } else {
                alert('Bir sorun oluştu, tekrar deneyiniz: ' + result.message);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Bir sorun oluştu, tekrar deneyiniz.');
        }
    });

    function updateCartDisplay() {
        // Clear only the list of items, not the entire cartSection
        let ul = cartSection.querySelector('ul');
        if (!ul) {
            ul = document.createElement('ul');
            cartSection.appendChild(ul);
        }
        ul.innerHTML = ''; // Clear existing list items

        if (cartItems.length === 0) {
            cartSection.innerHTML = '<h2>Shopping Cart</h2><p>Your cart is empty.</p>';
            completePurchaseBtn.disabled = true; // Disable button when cart is empty
        } else {
            cartSection.innerHTML = '<h2>Shopping Cart</h2>'; // Re-add title if it was removed
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
            completePurchaseBtn.disabled = false; // Enable button when cart has items
        }

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
        if (discountApplied) {
            total *= 0.9; // Apply 10% discount if already applied
        }
        totalAmountDisplay.innerHTML = `Total: $${total.toFixed(2)}`; // Update only the total display
    }

    updateTotal(); // Initial call to display total on page load
    updateCartDisplay(); // Initial call to set button state
});
