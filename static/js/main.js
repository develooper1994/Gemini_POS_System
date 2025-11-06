document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const productCatalog = document.getElementById('product-catalog');
    const cartSection = document.getElementById('cart');
    const checkoutSection = document.getElementById('checkout-section');
    const applyDiscountBtn = document.getElementById('apply-discount-btn');
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
