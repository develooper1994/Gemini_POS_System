import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200

def test_css_link_in_index_html(client):
    response = client.get('/')
    assert b'<link rel="stylesheet" href="/static/css/style.css">' in response.data

def test_product_display_in_index_html(client):
    response = client.get('/')
    assert b'<h2>Product Catalog</h2>' in response.data
    assert b'Laptop' in response.data
    assert b'Mouse' in response.data
    assert b'Keyboard' in response.data
    assert b'<button class="add-to-cart" data-product-id="1">Add to Cart</button>' in response.data
    assert b'<button class="add-to-cart" data-product-id="2">Add to Cart</button>' in response.data
    assert b'<button class="add-to-cart" data-product-id="3">Add to Cart</button>' in response.data

def test_main_js_link_in_index_html(client):
    response = client.get('/')
    assert b'<script src="/static/js/main.js"></script>' in response.data

def test_total_display_in_checkout_section(client):
    response = client.get('/')
    assert b'<div id="checkout-section">' in response.data

def test_discount_button_in_checkout_section(client):
    response = client.get('/')
    assert b'<div id="checkout-section">' in response.data
    assert b'<button id="apply-discount-btn">Apply 10% Discount</button>' in response.data

def test_generate_qr_route(client):
    response = client.get('/generate_qr?data=test_qr_data')
    assert response.status_code == 200
    assert response.content_type == 'image/png'
    assert response.data is not None
    assert len(response.data) > 0

def test_pay_with_qr_button_in_checkout_section(client):
    response = client.get('/')
    assert b'<div id="checkout-section">' in response.data
    assert b'<button id="pay-with-qr-btn">Pay with QR</button>' in response.data

def test_checkout_endpoint(client):
    # Simulate a cart with items and a total amount
    test_cart_items = [
        {"productId": "1", "name": "Laptop", "price": 1200.00, "quantity": 1},
        {"productId": "2", "name": "Mouse", "price": 25.00, "quantity": 2}
    ]
    test_total_amount = 1250.00

    response = client.post(
        '/checkout',
        json={'cartItems': test_cart_items, 'totalAmount': test_total_amount}
    )

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data['success'] == True
    assert 'transaction_id' in json_data
