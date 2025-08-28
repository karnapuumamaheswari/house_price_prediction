import logging
from flask import Flask, render_template, request, jsonify
import util


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    try:
        locations = util.get_location_names()
        response = jsonify({
            'locations': locations
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        logger.error(f"Error in get_location_names: {e}")
        return jsonify({'error': 'Failed to retrieve location names'}), 500

@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    try:
        if request.method == 'POST':
            total_sqft = float(request.form['total_sqft'])
            location = request.form['location']
            bhk = int(request.form['bhk'])
            bath = int(request.form['bath'])
        else: 
            total_sqft = float(request.args.get('total_sqft'))
            location = request.args.get('location')
            bhk = int(request.args.get('bhk'))
            bath = int(request.args.get('bath'))

        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        response = jsonify({
            'estimated_price': estimated_price
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        logger.error(f"Error in predict_home_price: {e}")
        return jsonify({'error': 'Failed to predict home price'}), 500

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    try:
        util.load_saved_artifacts()
        app.run(host="0.0.0.0", port=5000, debug=True)
    except Exception as e: