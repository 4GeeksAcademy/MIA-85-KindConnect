from sqlalchemy import UniqueConstraint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from typing import List
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    username: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=True)
    date_of_birth: Mapped[datetime] = mapped_column(nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "email": self.email,
            "phone_number": self.phone_number,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def set_password(self, pwd):
        self.password = generate_password_hash(pwd)

    def check_password(self, pwd):
        return check_password_hash(self.password, pwd)


class Post(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    author: str = db.Column(db.String(80), default="anon")
    body: str = db.Column(db.Text, nullable=False)
    created_at: datetime = db.Column(db.DateTime, default=datetime)
    replies: Mapped[List["Reply"]] = db.relationship(
        "Reply", backref="post", cascade="all, delete-orphan")  # type: ignore
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
    id: int = db.Column(db.Integer, primary_key=True)
    post_id: int = db.Column(db.Integer, db.ForeignKey(
        "post.id"), nullable=False, index=True)
    device_id: int = db.Column(db.String(120), nullable=False)
    created_at: datetime = db.Column(db.DateTime, default=datetime)
    __table_args__ = (UniqueConstraint(
        "post_id", "device_id", name="uq_post_device"),)

    def serialize(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "device_id": self.device_id,
            "created_at": self.created_at.isoformat()
        }
