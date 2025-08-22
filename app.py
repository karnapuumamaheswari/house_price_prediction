from flask import Flask, request, render_template
app = Flask(__name__)

@app.route('/')
def home():
    return "House Price Prediction App is Running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
