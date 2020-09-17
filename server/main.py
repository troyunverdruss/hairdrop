import waitress
from flask import Flask

from api import api

app = Flask(__name__)

megabyte = 1024 * 1024
app.config['MAX_CONTENT_LENGTH'] = 50 * megabyte

app.register_blueprint(api)

# https://www.compose.com/articles/using-postgresql-through-sqlalchemy/

if __name__ == "__main__":
    waitress.serve(app, port=8080)
