from sqlalchemy import Column, Table, String
from sqlalchemy.orm import declarative_base
from sqlalchemy.engine import Engine

Base = declarative_base()


class CheckedGame(Base):
    __tablename__ = "checked_game"

    gamename = Column(String, primary_key=True)


class GameRole(Base):
    __tablename__ = "game_role"

    gamename = Column(String, primary_key=True)
    rolename = Column(String)


def create_tables(engine: Engine) -> None:
    Base.metadata.create_all(engine)
