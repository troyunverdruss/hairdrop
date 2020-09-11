import enum

from flask import Flask, make_response, request
from sqlalchemy import Column, DateTime, Enum, String, func
from sqlalchemy import Integer
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from werkzeug.utils import secure_filename

app = Flask(__name__)

# https://www.compose.com/articles/using-postgresql-through-sqlalchemy/

db_string = f"postgres://{user}:{pw}@{url}/{db}"
db_engine = create_engine(db_string)
base = declarative_base()


class EntryType(enum.Enum):
    TEXT = 1
    FILE = 2


# @dataclass
class Entry(base):
    __tablename__ = 'entries'

    id = Column(Integer, primary_key=True)
    created = Column(DateTime, server_default=func.now())
    type = Column(Enum(EntryType))
    data = Column(String)


Session = sessionmaker(db_engine)
session = Session()
base.metadata.create_all(db_engine)

entry = Entry(type=EntryType.FILE, data="123")
session.add(entry)
session.commit()

stuff = session.query(Entry).order_by(Entry.created.desc()).limit(2).all()
for x in stuff:
    print(x.id)


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
