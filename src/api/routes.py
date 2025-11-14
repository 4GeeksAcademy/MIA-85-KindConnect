"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
""" API routes: auth, users, and Honey Do endpoints """

from flask import Flask, request, jsonify, url_for, Blueprint
from flask_cors import CORS
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash

from api.utils import generate_sitemap, APIException
from api.models import db, User, Project, ProjectUpdate, Comment, HoneyPost
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

api = Blueprint("api", __name__)
CORS(api)  # Allow CORS requests to this API


# Health check
# ---------------------------------------------------------------------
@api.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "kindconnect-api"}), 200


# Hello (sample)
# ---------------------------------------------------------------------
@api.route("/hello", methods=["GET", "POST"])
def handle_hello():
    response_body = {"message": "Hello! I'm a message that came from the backend."}
    return jsonify(response_body), 200


# Auth: Sign up / Login / Profile / Reset password (security Q&A)
# ---------------------------------------------------------------------
@api.route("/signup", methods=["POST"])
def handle_signup():
    body = request.get_json(silent=True) or {}

    first_name = body.get("first_name")
    last_name = body.get("last_name")
    username = body.get("username")
    email = body.get("email")
    password = body.get("password")
    phone_number = body.get("phone_number")
    date_of_birth = body.get("date_of_birth")
    security_question = body.get("security_question")
    security_answer = body.get("security_answer")

    if not date_of_birth:
        date_of_birth = None

    if not all(
        [
            first_name,
            last_name,
            username,
            email,
            password,
            security_question,
            security_answer,
        ]
    ):
        return jsonify({"message": "Missing required fields..."}), 400

    # Check for existing user by email OR username
    existing_user = db.session.scalars(
        select(User).where((User.email == email) | (User.username == username))
    ).one_or_none()
    if existing_user:
        return jsonify({"message": "User with this email or username already exists..."}), 400

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        phone_number=phone_number,
        date_of_birth=date_of_birth,
        is_active=True,
        is_verified=False,
        security_question=security_question,
    )
    new_user.set_password(password)
    new_user.set_security_answer(security_answer)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201


@api.route("/resetPassword/question", methods=["POST"])
def getSecurityQuestion():
    body = request.get_json(silent=True) or {}
    email = body.get("email")

    user = db.session.scalars(select(User).where(User.email == email)).one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"security_question": user.security_question}), 200


@api.route("/resetPassword/verify", methods=["POST"])
def verifyResetPassword():
    body = request.get_json(silent=True) or {}
    email = body.get("email")
    answer = body.get("security_answer")
    new_password = body.get("new_password")

    if not all([email, answer, new_password]):
        return jsonify({"message": "Missing required fields"}), 400

    user = db.session.scalars(select(User).where(User.email == email)).one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user.check_security_answer(answer):
        return jsonify({"message": "Incorrect security answer"}), 403

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password reset successfully!"}), 200


@api.route("/login", methods=["POST"])
def handle_login():
    body = request.get_json(silent=True) or {}
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"message": "Missing credentials..."}), 400

    user = db.session.scalars(select(User).where(User.email == email)).one_or_none()
    if user is None:
        return jsonify({"message": "No such user..."}), 401

    if not user.check_password(password):
        return jsonify({"message": "Invalid credentials..."}), 401

    user_token = create_access_token(identity=str(user.id))
    response_body = {
        "token": user_token,
        "user": user.serialize()
        if hasattr(user, "serialize")
        else {"id": user.id, "email": user.email, "username": user.username},
    }
    return jsonify(response_body), 201


@api.route("/users", methods=["GET"])
def get_all_users():
    users = db.session.scalars(select(User)).all()
    if not users:
        return jsonify({"message": "No users found."}), 404

    users_list = [user.serialize() for user in users]
    return jsonify(users_list), 200


@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    body = request.get_json(silent=True) or {}

    user.first_name = body.get("first_name", user.first_name)
    user.last_name = body.get("last_name", user.last_name)
    user.username = body.get("username", user.username)
    user.email = body.get("email", user.email)
    user.phone_number = body.get("phone_number", user.phone_number)

    date_of_birth = body.get("date_of_birth")
    if not date_of_birth:
        user.date_of_birth = None
    else:
        from datetime import datetime as _dt
        try:
            user.date_of_birth = _dt.strptime(date_of_birth, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "Invalid date format (expected YYYY-MM-DD)"}), 400

    db.session.commit()
    return jsonify(user.serialize()), 200


# ---------------------------------------------------------------------
# Honey Do: CRUD
# ---------------------------------------------------------------------
@api.route("/honeydo/posts", methods=["GET"])
def list_honey_posts():
    """List posts with optional filters."""
    q_type = request.args.get("type")  # wanted | offer | None
    q_zip = request.args.get("zip")
    limit = int(request.args.get("limit", 20))
    offset = int(request.args.get("offset", 0))

    query = HoneyPost.query
    if q_type in ("wanted", "offer"):
        query = query.filter(HoneyPost.type == q_type)
    if q_zip:
        query = query.filter(HoneyPost.zip == q_zip)

    total = query.count()
    items = (
        query.order_by(HoneyPost.created_at.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    return (
        jsonify(
            {
                "items": [p.serialize() for p in items],
                "total": total,
                "limit": limit,
                "offset": offset,
            }
        ),
        200,
    )


@api.route("/honeydo/posts", methods=["POST"])
def create_honey_post():
    """Create a new Honey Do post."""
    data = request.get_json(silent=True) or {}
    p_type = data.get("type")
    title = (data.get("title") or "").strip()
    zipc = (data.get("zip") or "").strip()
    desc = data.get("description")
    media = data.get("media_urls", [])

    if p_type not in ("wanted", "offer"):
        return jsonify({"message": "type must be 'wanted' or 'offer'"}), 422
    if len(title) < 4:
        return jsonify({"message": "title must be at least 4 characters"}), 422
    if not zipc:
        return jsonify({"message": "zip is required"}), 422

    post = HoneyPost(
        user_id=None,  
        type=p_type,
        title=title,
        description=desc,
        zip=zipc,
        media_urls=media,
        status="active",
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({"post": post.serialize()}), 201


@api.route("/honeydo/posts/<int:post_id>", methods=["GET"])
def get_honey_post(post_id: int):
    post = db.session.get(HoneyPost, post_id)
    if not post:
        return jsonify({"message": "Not found"}), 404
    return jsonify({"post": post.serialize()}), 200


@api.route("/honeydo/posts/<int:post_id>", methods=["PATCH"])
def update_honey_post(post_id: int):
    post = db.session.get(HoneyPost, post_id)
    if not post:
        return jsonify({"message": "Not found"}), 404

    data = request.get_json(silent=True) or {}

    if "type" in data:
        if data["type"] not in ("wanted", "offer"):
            return jsonify({"message": "invalid type"}), 422
        post.type = data["type"]

    for k in ("title", "description", "zip", "status"):
        if k in data and isinstance(data[k], str):
            setattr(post, k, data[k].strip())

    if "media_urls" in data:
        post.media_urls = data["media_urls"]

    db.session.commit()
    return jsonify({"post": post.serialize()}), 200


@api.route("/honeydo/posts/<int:post_id>", methods=["DELETE"])
def delete_honey_post(post_id: int):
    post = db.session.get(HoneyPost, post_id)
    if not post:
        return jsonify({"message": "Not found"}), 404
    db.session.delete(post)
    db.session.commit()
    return "", 204
