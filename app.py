import os
from server import server  # Import your Flask app from server.py

if __name__ == "__main__":
    server.app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
