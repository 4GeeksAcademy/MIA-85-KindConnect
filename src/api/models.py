from sqlalchemy import UniqueConstraint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date as datetime_date
from typing import List
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func

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
    date_of_birth: Mapped[datetime_date] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    security_question: Mapped[str] = mapped_column(String(255), nullable=True)
    security_answer_hash: Mapped[str] = mapped_column(
        String(255), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "email": self.email,
            "phone_number": self.phone_number,
            "date_of_birth": (
                self.date_of_birth.strftime(
                    "%Y-%m-%d") if self.date_of_birth else None
            ),
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def set_password(self, pwd):
        self.password = generate_password_hash(pwd)

    def check_password(self, pwd):
        return check_password_hash(self.password, pwd)

    def set_security_answer(self, answer):
        self.security_answer_hash = generate_password_hash(answer)

    def check_security_answer(self, answer):
        return check_password_hash(self.security_answer_hash, answer)

    def __init__(self, first_name, last_name, username, email, password, phone_number=None,
                 date_of_birth=None, is_active=True, is_verified=False,
                 security_question=None):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.email = email
        self.password = password
        if phone_number:
            self.phone_number = phone_number
        if date_of_birth:
            self.date_of_birth = date_of_birth
        self.is_active = is_active
        self.is_verified = is_verified
        if security_question:
            self.security_question = security_question

        db.session.add(self)
        db.session.commit()


class Post(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    author: str = db.Column(db.String(80), default="anon")
    body: str = db.Column(db.Text, nullable=False)
    created_at: datetime = db.Column(db.DateTime, server_default=func.now())
    status: str = db.Column(db.String(20), nullable=False, default="open")
    type: str = db.Column(db.String(20), nullable=False)
    zip_code: str = db.Column(db.String(10), index=True)
    category: str = db.Column(db.String(20), nullable=False)
    lat = db.Column(db.Float())
    lon = db.Column(db.Float())
    replies: Mapped[List["Reply"]] = relationship(
        "Reply", backref="post", cascade="all, delete-orphan")
    favorites: Mapped[List["Favorite"]] = relationship(
        "Favorite", backref="post", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "author": self.author,
            "body": self.body,
            "favorites_count": len(self.favorites),
            "replies_count": len(self.replies),
            "status": self.status,
            "type": self.type,
            "category": self.category,
            "zip_code": self.zip_code,
            "created_at": self.created_at.isoformat()
        }

    def __init__(self, author, body, zip_code="", type="", category=""):
        self.author = author
        self.body = body
        self.zip_code = zip_code or ""
        self.type = type or ""
        self.category = category or ""
        db.session.add(self)
        db.session.commit()


class Reply(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    post_id: int = db.Column(db.Integer, db.ForeignKey(
        "post.id"), nullable=False, index=True)
    author: str = db.Column(db.String(80), default="anon")
    body: str = db.Column(db.Text, nullable=False)
    created_at: datetime = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "body": self.body,
            "author": self.author,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __init__(self, author, body, post_id):
        self.author = author
        self.body = body
        self.post_id = post_id
        db.session.add(self)
        db.session.commit()


class Favorite(db.Model):
    id: int = db.Column(db.Integer, primary_key=True)
    post_id: int = db.Column(db.Integer, db.ForeignKey(
        "post.id"), nullable=False, index=True)
    device_id: int = db.Column(db.String(120), nullable=False)
    created_at: datetime = db.Column(db.DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint(
        "post_id", "device_id", name="uq_post_device"),)

    def serialize(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "device_id": self.device_id,
            "created_at": self.created_at.isoformat()
        }

    def __init__(self, post_id, device_id):
        self.post_id = post_id
        self.device_id = device_id
        db.session.add(self)
        db.session.commit()
