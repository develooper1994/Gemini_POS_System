document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const productCatalog = document.getElementById('product-catalog');
    const cartSection = document.getElementById('cart');

    productCatalog.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.dataset.productId;
            // In a real application, you would fetch product details from a backend
            // For this example, we'll use dummy data or data embedded in the HTML
            const productElement = event.target.closest('.product-item');
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('Price: $', ''));

            const item = { id: productId, name: productName, price: productPrice };
            cartItems.push(item);
            updateCartDisplay();
        }
    });

    function updateCartDisplay() {
        cartSection.innerHTML = '<h2>Shopping Cart</h2>';
        if (cartItems.length === 0) {
            cartSection.innerHTML += '<p>Your cart is empty.</p>';
            return;
        }

        const ul = document.createElement('ul');
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            ul.appendChild(li);
        });
        cartSection.appendChild(ul);
    }
});
