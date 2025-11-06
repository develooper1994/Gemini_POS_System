# Gemini POS: Akıllı Kasa Sistemi - Sunum ve Prompt Akışı

Bu döküman, "Gemini POS" uygulamasını canlı olarak geliştirirken kullanacağınız adımları ve Gemini CLI'a vereceğiniz komutları (prompt'ları) içermektedir.

---

### Aşama 0: Hazırlık (Sizin Tarafınızdan Yapılacak)

* **Komut:** `mkdir Gemini_POS_System && cd Gemini_POS_System`
* **Açıklama:** Bu komutla sunuma başlamadan önce proje dizinini oluşturup içine girin. (Bu adımı az önce Gemini'ye yaptırdınız).

---

### Aşama 1: Projenin Temellerini Atma (Scaffolding)

Bu aşamada, projenin iskeletini (boş dosyalar ve temel bağlantılar) oluşturacağız.

* **Prompt 1.1 (Python Backend):**
    > "Create a basic Flask application in a file named `app.py`. It should create a `templates` directory if it doesn't exist. The main route `/` should render an HTML file named `index.html`."

* **Prompt 1.2 (HTML Frontend):**
    > "Create an `index.html` file inside the `templates` directory. The HTML should have the title 'Gemini POS System'. The body should contain a main container with three main sections (divs): one for the 'Product Catalog' with id `product-catalog`, one for the 'Shopping Cart' with id `cart`, and one for the 'Checkout' with id `checkout-section`."

* **Prompt 1.3 (CSS ile Stillendirme):**
    > "Create a `static/css` directory and inside it, a `style.css` file. Add modern, clean styling to `style.css` for the main container and the `product-catalog`, `cart`, and `checkout-section` divs. Use a flexbox or grid layout to arrange them neatly. Finally, link this stylesheet in the `<head>` of `index.html`."

---

### Aşama 2: Temel Mantığı Ekleme (Core Logic)

Uygulamanın temel işlevselliğini (ürünleri gösterme, sepete ekleme) ekliyoruz.

* **Prompt 2.1 (Ürün Verisi ve Gösterimi):**
    > "In `app.py`, create a simple in-memory JSON array of product objects. Each object should have an `id`, `name`, and `price` (e.g., Laptop, Mouse, Keyboard). Pass this product list to the `index.html` template. Then, in `index.html`, use a template loop to render each product in the 'product-catalog' section. Each product display should include its name, price, and an 'Add to Cart' button."

* **Prompt 2.2 (Sepete Ekleme Fonksiyonu - JavaScript):**
    > "Create a new file `static/js/main.js` and link it at the bottom of the `body` in `index.html`. In `main.js`, write the necessary JavaScript code to manage a shopping cart. When an 'Add to Cart' button is clicked, the corresponding product (name and price) should be added to a JavaScript array called `cartItems` and dynamically displayed as a list item in the 'cart' section of the page."

---

### Aşama 3: Etkileşimli Özellikler (Canlı Kodlama Kısmı)

Sunumun bu kısmında, uygulamanın interaktif yeteneklerini geliştireceğiz.

* **Prompt 3.1 (Toplam Tutar Hesaplama):**
    > "In `main.js`, create a function called `updateTotal()`. This function should calculate the total price of all items in the `cartItems` array and display it in the 'checkout-section'. Call this function every time a new item is added to the cart."

* **Prompt 3.2 (İndirim Özelliği - *İnteraktif Kısım*):**
    > "In `index.html`, add a new button with the text 'Apply 10% Discount' inside the 'checkout-section'. In `main.js`, add an event listener for this new button. When clicked, it should reduce the calculated total by 10% and update the displayed total. Ensure the discount can only be applied once."

---

### Aşama 4: Modern Dokunuş (Etkileyici Final)

Uygulamaya modern ve görsel bir özellik ekleyerek sunumu bitiriyoruz.

* **Prompt 4.1 (QR Kod Backend):**
    > "First, create a `requirements.txt` file and add `Flask` and `qrcode[pil]` to it. Then, explain that I need to run `pip install -r requirements.txt` in my virtual environment. After that, modify `app.py` to add a new route `/generate_qr`. This route will accept a `data` parameter from the request arguments. It should use the 'qrcode' library to generate a QR code image containing this data, save it to a byte stream, and return it as a PNG image response."

* **Prompt 4.2 (QR Kod Frontend):**
    > "In `index.html`, add a 'Pay with QR' button to the 'checkout-section'. In `main.js`, add a click event listener for this button. When clicked, it should get the final total amount, construct a URL to fetch from the `/generate_qr` endpoint with the total as data, and then display the returned QR code image on the page, for example, by creating an `<img>` element."

---
