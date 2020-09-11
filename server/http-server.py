from flask import Flask
from flask import request
from flask import make_response
from werkzeug.utils import secure_filename

app = Flask(__name__)


@app.route('/upload/<filename>', methods=["POST", "OPTIONS"])
def upload(filename):
    if request.method == 'POST':
        safe_filename = secure_filename(filename)
        with open(safe_filename, "wb") as f:
            f.write(request.get_data())

    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
