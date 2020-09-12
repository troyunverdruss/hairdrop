import os

from flask import Blueprint, jsonify, make_response, request
from flask_cors import cross_origin
from werkzeug.utils import secure_filename

from database import Database
from models import Entry, EntryType

database = Database()
api = Blueprint('api', __name__)

if 'UPLOAD_PATH' in os.environ:
    upload_path = os.environ['UPLOAD_PATH']
else:
    upload_path = '/uploads'


@api.route(f'{upload_path}/<filename>', methods=["POST"])
@cross_origin()
def upload(filename):
    safe_filename = secure_filename(filename)
    entry = Entry(type=EntryType.FILE, data=safe_filename)
    database.save(entry)
    with open(f'{upload_path}/{safe_filename}', "wb") as f:
        f.write(request.get_data())
    return ""


@api.route('/entry', methods=["POST"])
@cross_origin()
def create_entry():
    entry = Entry(type=EntryType.TEXT, data=request.json['data'])
    database.save(entry)
    return ""


@api.route('/entries', methods=["GET"])
@cross_origin()
def list_entries():
    entries = database.get_entries()
    return jsonify(list(map(lambda e: e.to_dict(), entries)))


@api.route('/file/<filename>', methods=["GET"])
@cross_origin()
def get_file(filename):
    with open(f'{upload_path}/{filename}', "rb") as f:
        response = make_response(f.read())
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response
