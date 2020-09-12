from flask import Flask

from api import api

import waitress

app = Flask(__name__)
app.register_blueprint(api)

# https://www.compose.com/articles/using-postgresql-through-sqlalchemy/

if __name__ == "__main__":
    waitress.serve(app, port=8080)
    # app.run(host="0.0.0.0", port=8080)
