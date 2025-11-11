"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Project, ProjectUpdate, Comment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend."
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.json

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
    body = request.json
    email = body.get("email")

    user = db.session.scalars(select(User).where(User.email == email)).one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"security_question": user.security_question}), 200

@api.route('/resetPassword/verify', methods=['POST'])
def verifyResetPassword():
    body = request.json
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


@api.route('/login', methods=['POST'])
def handle_login():
    body = request.json
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

    body = request.json
    user.first_name = body.get("first_name", user.first_name)
    user.last_name = body.get("last_name", user.last_name)
    user.username = body.get("username", user.username)
    user.email = body.get("email", user.email)
    user.phone_number = body.get("phone_number", user.phone_number)

    date_of_birth = body.get("date_of_birth")
    if not date_of_birth:
        user.date_of_birth = None
    else:
        from datetime import datetime
        try:
            user.date_of_birth = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"message": "Invalid date format (expected YYYY-MM-DD)"}), 400

    db.session.commit()
    return jsonify(user.serialize()), 200
