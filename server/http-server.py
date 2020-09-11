import enum

from flask import Flask, jsonify, make_response, request
from flask_cors import cross_origin
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


class Entry(base):
    __tablename__ = 'entries'

    id = Column(Integer, primary_key=True)
    created = Column(DateTime, server_default=func.now())
    type = Column(Enum(EntryType))
    data = Column(String)

    def to_dict(self):
        return {
            'id': self.id,
            'created': self.created,
            'type': self.type.name,
            'data': self.data
        }


Session = sessionmaker(db_engine)
session = Session()
base.metadata.create_all(db_engine)


@app.route('/upload/<filename>', methods=["POST"])
@cross_origin()
def upload(filename):
    if request.method == 'POST':
        safe_filename = secure_filename(filename)
        entry = Entry(type=EntryType.FILE, data=safe_filename)
        session.add(entry)
        session.commit()
        with open(f'uploads/{safe_filename}', "wb") as f:
            f.write(request.get_data())
        return ""


@app.route('/entry', methods=["POST"])
@cross_origin()
def create_entry():
    entry = Entry(type=EntryType.TEXT, data=request.json['data'])
    session.add(entry)
    session.commit()
    return ""


@app.route('/entries', methods=["GET"])
@cross_origin()
def list_entries():
    entries = session.query(Entry).order_by(Entry.created.desc()).limit(100).all()
    return jsonify(list(map(lambda e: e.to_dict(), entries)))


@app.route('/file/<filename>', methods=["GET"])
@cross_origin()
def get_file(filename):
    with open(f'uploads/{filename}', "rb") as f:
        response = make_response(f.read())
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
