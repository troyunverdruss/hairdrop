import enum

from sqlalchemy import Column, DateTime, Enum, String, func
from sqlalchemy import Integer
from sqlalchemy.ext.declarative import declarative_base

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
