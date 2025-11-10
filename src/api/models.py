from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    date_of_birth: Mapped[datetime.date] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    security_question: Mapped[str] = mapped_column(String(255), nullable=True)
    security_answer_hash: Mapped[str] = mapped_column(String(255), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "username": self.username,
            "email": self.email,
            "phone_number": self.phone_number,
            "date_of_birth": (
            self.date_of_birth.strftime("%Y-%m-%d") if self.date_of_birth else None
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


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(20), nullable=False, index=True)
    city = db.Column(db.String(80))
    state = db.Column(db.String(2))
    status = db.Column(db.String(20), default="open", index=True)
    kind = db.Column(db.String(12), default="need", index=True)
    image_url = db.Column(db.String(500))
    favorites_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    requester_id = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'))  # nullable until claimed

    requester = db.relationship('User', foreign_keys=[requester_id])
    volunteer = db.relationship('User', foreign_keys=[volunteer_id])


class ProjectUpdate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    note = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False, index=True)
    author_name = db.Column(db.String(120), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# db = SQLAlchemy()

# class User(db.Model):
#     id: Mapped[int] = mapped_column(primary_key=True)
#     email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
#     password: Mapped[str] = mapped_column(nullable=False)
#     is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # def serialize(self):
    #     return {
    #         "id": self.id,
    #         "email": self.email,
    #         # do not serialize the password, its a security breach
    #     }
