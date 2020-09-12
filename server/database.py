import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from models import Entry


class Database:
    def __init__(self):
        db_user = os.environ['DB_USER']
        db_pass = os.environ['DB_PASS']
        db_host = os.environ['DB_HOST']
        db_name = os.environ['DB_NAME']

        db_url = f"postgres://{db_user}:{db_pass}@{db_host}/{db_name}"

        self.db_engine = create_engine(db_url)

        self.session = sessionmaker(self.db_engine)()

    def create_all(self):
        base = declarative_base()
        base.metadata.create_all(self.db_engine)

    def save(self, entry):
        try:
            self.session.add(entry)
            self.session.commit()
        except Exception as e:
            print(f"Encountered exception: {e}")

    def get_entries(self):
        try:
            return self.session.query(Entry).order_by(Entry.created.desc()).limit(100).all()
        except Exception as e:
            print(f"Encountered exception: {e}")
