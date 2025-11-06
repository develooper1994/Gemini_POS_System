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
    assert b'<script src="/static/js/main.js"></script>\n</body>' in response.data

def test_total_display_in_checkout_section(client):
    response = client.get('/')
    assert b'<div id="checkout-section">' in response.data

def test_discount_button_in_checkout_section(client):
    response = client.get('/')
    assert b'<div id="checkout-section">' in response.data
    assert b'<button id="apply-discount-btn">Apply 10% Discount</button>' in response.data
