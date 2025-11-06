
import os
from flask import Flask, render_template

app = Flask(__name__)

# Ensure the templates directory exists
if not os.path.exists('templates'):
    os.makedirs('templates')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
