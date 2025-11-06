
import os
from flask import Flask, render_template

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

if __name__ == '__main__':
    app.run(debug=True)
