# Project: Gemini POS System

## Project Overview

This project is a "Gemini POS (Point of Sale)" system. The goal is to build a web application with a Python Flask backend and a standard HTML/CSS/JavaScript frontend. The development process follows a detailed plan outlined in `SUNUM_PLANI.md`, which involves creating the application scaffold, adding core logic for a shopping cart, implementing interactive features like discounts, and adding a modern QR code payment feature.

**Key Technologies:**
*   **Backend:** Python (Flask)
*   **Frontend:** HTML, CSS, JavaScript
*   **Testing:** Pytest
*   **Version Control:** Git
*   **Additional Libraries:** `qrcode[pil]`

## Development Workflow

This project follows a Test-Driven Development (TDD) approach. Each new feature or function is developed in the following sequence:

1.  **Write a Test:** Before implementing a feature, a corresponding test is created to define the expected behavior and output. Python tests will be managed using the `pytest` framework.
2.  **Run the Test (and Watch It Fail):** The new test is run to ensure it fails as expected, confirming that the feature is not yet implemented.
3.  **Implement the Feature:** The code for the new feature or function is written.
4.  **Run the Test (and Watch It Pass):** The test is run again. A successful pass indicates that the feature has been implemented correctly according to the test's specifications.
5.  **Commit to Version Control:** Once the tests pass, the changes are committed to the Git repository with a descriptive message.

## Building and Running

1.  **Install Dependencies:**
    *   A `requirements.txt` file will be created. To install the necessary Python packages, run:
        ```bash
        pip install -r requirements.txt
        ```

2.  **Run Tests:**
    *   To execute the test suite, run:
        ```bash
        pytest
        ```

3.  **Run the Application:**
    *   The main application is in `app.py`. To start the Flask development server, run:
        ```bash
        python app.py
        ```
    *   The application will be accessible at `http://127.0.0.1:5000`.

## Project Structure

*   `app.py`: The main Flask application file.
*   `tests/`: Directory containing all project tests.
*   `templates/index.html`: The primary HTML file for the user interface.
*   `static/css/style.css`: For styling the application.
*   `static/js/main.js`: For client-side interactivity.
*   `SUNUM_PLANI.md`: Contains the step-by-step development plan for the live coding presentation.
*   `GEMINI.md`: This file, providing an overview and instructions for the project.