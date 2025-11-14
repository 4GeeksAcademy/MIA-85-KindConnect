import os
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from .models import db, User, Post, Reply, Favorite
from .utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Dict

API_NINJAS_KEY = os.getenv("API_NINJAS_KEY")

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend."
    }
    return jsonify(response_body), 200


@api.get("/posts")
def list_posts():
    device_id = request.args.get("device_id", "")
    items = Post.query.order_by(Post.created_at.desc()).all()  # type: ignore
    zip_code = request.args.get("zip_code", "").strip() or None
    zip_filter = zip_code if zip_code else None

    q = Post.query
    if zip_filter:
        q = q.filter(Post.zip_code == zip_filter)
    items = q.order_by(Post.created_at.desc()).all()  # type: ignore

    out = []
    for p in items:
        fav_count = len(p.favorites)
        is_fav = False
        if device_id:
            is_fav = any(f.device_id == device_id for f in p.favorites)
        out.append({
            "id": p.id,
            "author": p.author,
            "body": p.body,
            "created_at": p.created_at.isoformat(),
            "replies_count": len(p.replies),
            "favorites_count": fav_count,
            "is_favorited": is_fav
        })
    return jsonify(out), 200


@api.post("/posts")
def create_post():
    data = request.get_json() or {}
    body = (data.get("body") or "").strip()
    author = (data.get("author") or "anon").strip() or "anon"
    zip_code = (data.get("zip_code") or "").strip() or None

    if not body:
        return jsonify({"error": "body required"}), 400

    # basic format check
    if zip_code and not (len(zip_code) == 5 and zip_code.isdigit()):
        return jsonify({"error": "invalid zip format"}), 400

    # external validation with API Ninjas
    if zip_code and not validate_zip_with_ninjas(zip_code):
        return jsonify({"error": "zip not found"}), 400

    p = Post(author=author, body=body, zip_code=zip_code)
    db.session.add(p)
    db.session.commit()
    return jsonify({"id": p.id, "zip_code": p.zip_code}), 201


@api.get("/posts/<int:pid>")
def get_post(pid):
    p = Post.query.get(pid)
    if not p:
        return jsonify({"error": "not found"}), 404
    return jsonify({
        "id": p.id,
        "author": p.author,
        "body": p.body,
        "created_at": p.created_at.isoformat(),
        "replies": [
            {
                "id": r.id,
                "author": r.author,
                "body": r.body,
                "created_at": r.created_at.isoformat()
            } for r in sorted(p.replies, key=lambda r: r.created_at)
        ],
        "favorites_count": len(p.favorites)
    }), 200


@api.post("/posts/<int:pid>/reply")
def reply_to_post(pid):
    p = Post.query.get(pid)
    if not p:
        return jsonify({"error": "not found"}), 404
    data = request.get_json() or {}
    body = (data.get("body") or "").strip()
    author = (data.get("author") or "anon").strip() or "anon"
    if not body:
        return jsonify({"error": "body required"}), 400
    r = Reply(post_id=p.id, author=author, body=body)
    db.session.add(r)
    db.session.commit()
    return jsonify({"id": r.id}), 201


@api.post("/posts/<int:pid>/favorite")
def toggle_favorite(pid):
    p = Post.query.get(pid)
    if not p:
        return jsonify({"error": "not found"}), 404
    data = request.get_json() or {}
    device_id = (data.get("device_id") or "").strip()

    if not device_id:
        return jsonify({"error": "device_id required"}), 400

    fav = Favorite.query.filter_by(post_id=p.id, device_id=device_id).first()
    if fav:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"favorited": False, "favorites_count": len(p.favorites)}), 200
    else:
        fav = Favorite(post_id=p.id, device_id=device_id)
        db.session.add(fav)
        db.session.commit()
        return jsonify({"favorited": True, "favorites_count": len(p.favorites)}), 201


@api.route('/signup', methods=['POST'])
def handle_signup():
    body: Dict = request.json  # type: ignore

    first_name = body.get("first_name")
    last_name = body.get("last_name")
    username = body.get("username")
    email = body.get("email")
    password = body.get("password", "")
    phone_number = body.get("phone_number")
    date_of_birth = body.get("date_of_birth")
    security_question = body.get("security_question")
    security_answer = body.get("security_answer")

    if not date_of_birth:
        date_of_birth = None

    if not all([first_name, last_name, username, email, password, security_question, security_answer]):
        return jsonify({"message": "Missing required fields..."}), 400

    # Check for existing user
    existing_user = db.session.scalars(
        select(User).where((User.email == email) | (User.username == username))
    ).one_or_none()
    if existing_user:
        return jsonify({"message": "User with this email or username already exists..."}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password=hashed_password,
        phone_number=phone_number,
        date_of_birth=date_of_birth,
        is_active=True,
        is_verified=False,
        security_question=security_question
    )

    new_user.set_password(password)
    new_user.set_security_answer(security_answer)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201


@api.route('/resetPassword/question', methods=['POST'])
def getSecurityQuestion():
    body = request.json or {}
    email = body.get("email")

    user = db.session.scalars(select(User).where(
        User.email == email)).one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"security_question": user.security_question}), 200


@api.route('/resetPassword/verify', methods=['POST'])
def verifyResetPassword():
    body = request.json or {}
    email = body.get("email")
    answer = body.get("security_answer")
    new_password = body.get("new_password")

    if not all([email, answer, new_password]):
        return jsonify({"message": "Missing required fields"}), 400

    user = db.session.scalars(select(User).where(
        User.email == email)).one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.check_security_answer(answer):
        return jsonify({"message": "Incorrect security answer"}), 403

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password reset successfully!"}), 200


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.json or {}
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"message": "Missing credentials..."}), 400

    user = db.session.scalars(select(User).where(
        User.email == email)).one_or_none()
    if user is None:
        return jsonify({"message": "No such user..."}), 401

    if not user.check_password(password):
        return jsonify({"message": "Invalid credentials..."}), 401

    user_token = create_access_token(identity=str(user.id))
    response_body = {
        "token": user_token,
        "user": user.serialize() if hasattr(user, "serialize") else {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    }
    return jsonify(response_body), 201


@api.route('/users', methods=['GET'])
def get_all_users():
    users = db.session.scalars(select(User)).all()
    if not users:
        return jsonify({"message": "No users found."}), 404

    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    body = request.json or {}
    user.first_name = body.get("first_name", user.first_name)
    user.last_name = body.get("last_name", user.last_name)
    user.username = body.get("username", user.username)
    user.email = body.get("email", user.email)
    user.phone_number = body.get("phone_number", user.phone_number)

    date_of_birth = body.get("date_of_birth")
    if date_of_birth:
        from datetime import datetime
        try:
            user.date_of_birth = datetime.strptime(
                date_of_birth, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "Invalid date format (expected YYYY-MM-DD)"}), 400

    db.session.commit()
    return jsonify(user.serialize()), 200
