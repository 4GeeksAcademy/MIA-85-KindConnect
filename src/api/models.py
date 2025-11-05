from sqlalchemy import UniqueConstraint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


def serialize(self):
    return {
        "id": self.id,
        "email": self.email,
    }


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(80), default="anon")
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime)
    replies = db.relationship("Reply", backref="post",
                              cascade="all, delete-orphan")
    favorites = db.relationship(
        "Favorite", backref="post", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author,
            "body": self.body,
            "created_at": self.created_at.isoformat()
        }

    def __init__(self, author, body):
        self.author = author
        self.body = body
        db.session.add(self)
        db.session.commit()


class Reply(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    post_id: int = db.Column(db.Integer, db.ForeignKey(
        "post.id"), nullable=False, index=True)
    author: str = db.Column(db.String(80), default="anon")
    body: str = db.Column(db.Text, nullable=False)
    created_at: datetime = db.Column(db.DateTime, default=datetime)

    def serialize(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "author": self.author,
            "body": self.body,
            "created_at": self.created_at.isoformat()
        }


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey(
        "post.id"), nullable=False, index=True)
    device_id = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime)
    __table_args__ = (UniqueConstraint(
        "post_id", "device_id", name="uq_post_device"),)

    def serialize(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "device_id": self.device_id,
            "created_at": self.created_at.isoformat()
        }
