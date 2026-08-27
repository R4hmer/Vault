from flask import Blueprint, request
from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from app.models import User


auth = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


def user_to_dict(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }


@auth.post("/register")
def register():
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return {
            "error": "Username, email and password are required"
        }, 400

    existing_username = User.query.filter_by(
        username=username
    ).first()

    if existing_username:
        return {
            "error": "Username already exists"
        }, 409

    existing_email = User.query.filter_by(
        email=email
    ).first()

    if existing_email:
        return {
            "error": "Email already exists"
        }, 409

    user = User(
        username=username,
        email=email,
        password=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "Registration successful",
        "user": user_to_dict(user)
    }, 201


@auth.post("/login")
def login():
    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "error": "Email and password are required"
        }, 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return {
            "error": "Invalid email or password"
        }, 401

    if not check_password_hash(
        user.password,
        password
    ):
        return {
            "error": "Invalid email or password"
        }, 401

    return {
        "message": "Login successful",
        "user": user_to_dict(user)
    }


@auth.put("/profile/<int:user_id>")
def update_profile(user_id):
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")

    if not username or not email:
        return {
            "error": "Username and email are required"
        }, 400

    user = db.session.get(User, user_id)

    if not user:
        return {
            "error": "User not found"
        }, 404

    existing_username = User.query.filter(
        User.username == username,
        User.id != user_id
    ).first()

    if existing_username:
        return {
            "error": "Username already exists"
        }, 409

    existing_email = User.query.filter(
        User.email == email,
        User.id != user_id
    ).first()

    if existing_email:
        return {
            "error": "Email already exists"
        }, 409

    user.username = username
    user.email = email

    db.session.commit()

    return {
        "message": "Profile updated successfully",
        "user": user_to_dict(user)
    }