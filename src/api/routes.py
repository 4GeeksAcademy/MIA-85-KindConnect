"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
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


    if not all([first_name, last_name, username, email, password]):
        return jsonify({"message": "Missing required fields..."}), 400

    # Check for existing user
    existing_user = db.session.scalars(
        select(User).where((User.email == email) | (User.username == username))
    ).one_or_none()
    if existing_user:
        return jsonify({"message": "User with this email or username already exists..."}), 400

    hashed_password = generate_password_hash(password, method='scrypt', salt_length=16)

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
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.json
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"message": "Missing credentials..."}), 400

    user = db.session.scalars(select(User).where(User.email == email)).one_or_none()
    if user is None:
        return jsonify({"message": "No such user..."}), 400
 
    if not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials..."}), 400

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
    user.date_of_birth = body.get("date_of_birth", user.date_of_birth)

    db.session.commit()
    return jsonify(user.serialize()), 200
