import waitress
from flask import Flask

from api import api

app = Flask(__name__)
app.register_blueprint(api)

# https://www.compose.com/articles/using-postgresql-through-sqlalchemy/

if __name__ == "__main__":
    waitress.serve(app, port=8080)
