
import os
import io
import qrcode
import sqlite3
import json
import time

from flask import Flask, render_template, request, send_file, jsonify, g

app = Flask(__name__)

# Ensure the templates directory exists
if not os.path.exists('templates'):
    os.makedirs('templates')

# Database initialization
DATABASE = 'transactions.db'

def init_db():
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT NOT NULL UNIQUE,
                timestamp REAL NOT NULL,
                total_amount REAL NOT NULL,
                items_json TEXT NOT NULL
            );
        ''')
        conn.commit()

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row # This makes the rows behave like dicts
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Call init_db when the app starts
with app.app_context():
    init_db()

products = [
    {"id": 1, "name": "Laptop", "price": 1200.00},
    {"id": 2, "name": "Mouse", "price": 25.00},
    {"id": 3, "name": "Keyboard", "price": 75.00},
    {"id": 4, "name": "Monitor", "price": 300.00},
    {"id": 5, "name": "Webcam", "price": 50.00},
]

@app.route('/')
def index():
    return render_template('index.html', products=products)

@app.route('/generate_qr')
def generate_qr():
    data = request.args.get('data', '')
    if not data:
        return "No data provided for QR code", 400

    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, 'PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

@app.route('/checkout', methods=['POST'])
def checkout():
    try:
        data = request.get_json()
        cart_items = data.get('cartItems')
        total_amount = data.get('totalAmount')

        if not cart_items or total_amount is None:
            return jsonify({"success": False, "message": "Invalid transaction data"}), 400

        transaction_id = str(int(time.time() * 1000)) # Simple unique ID
        timestamp = time.time()
        items_json = json.dumps(cart_items)

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO transactions (transaction_id, timestamp, total_amount, items_json) VALUES (?, ?, ?, ?)",
            (transaction_id, timestamp, total_amount, items_json)
        )
        conn.commit()

        return jsonify({"success": True, "message": "Transaction recorded successfully", "transaction_id": transaction_id})

    except Exception as e:
        print(f"Error during checkout: {e}")
        return jsonify({"success": False, "message": "An error occurred during checkout"}), 500

if __name__ == '__main__':
    app.run(debug=True)
