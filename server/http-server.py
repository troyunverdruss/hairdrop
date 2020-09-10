from flask import Flask
from flask import request
from flask import make_response

app = Flask(__name__)


@app.route('/', methods=("GET", "POST", "OPTIONS"))
def anything():
    with open("upload", "wb") as f:
        f.write(request.get_data())

    res = make_response('hi hi')
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Headers'] = '*'
    return res


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
