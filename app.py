
import os
import io
import qrcode
from flask import Flask, render_template, request, send_file

app = Flask(__name__)

# Ensure the templates directory exists
if not os.path.exists('templates'):
    os.makedirs('templates')

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

if __name__ == '__main__':
    app.run(debug=True)
