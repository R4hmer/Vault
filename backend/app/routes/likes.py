from flask import Blueprint, request

from app import db
from app.models import Idea, Like, User

likes = Blueprint("likes", __name__)


@likes.post("/ideas/<int:idea_id>/like")
def like_idea(idea_id):
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")

    if user_id is None:
        return {
            "error": "user_id is required"
        }, 400

    user = db.session.get(User, user_id)

    if user is None:
        return {
            "error": "User not found"
        }, 404

    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    existing_like = db.session.execute(
        db.select(Like).where(
            Like.user_id == user_id,
            Like.idea_id == idea_id
        )
    ).scalar_one_or_none()

    if existing_like is not None:
        return {
            "error": "Idea already liked"
        }, 409

    like = Like(
        user_id=user_id,
        idea_id=idea_id
    )

    db.session.add(like)
    db.session.commit()

    return {
        "message": "Idea liked successfully",
        "like": {
            "id": like.id,
            "user_id": like.user_id,
            "idea_id": like.idea_id
        }
    }, 201


@likes.delete("/ideas/<int:idea_id>/like")
def unlike_idea(idea_id):
    data = request.get_json(silent=True) or {}
    user_id = data.get("user_id")

    if user_id is None:
        return {
            "error": "user_id is required"
        }, 400

    user = db.session.get(User, user_id)

    if user is None:
        return {
            "error": "User not found"
        }, 404

    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    existing_like = db.session.execute(
        db.select(Like).where(
            Like.user_id == user_id,
            Like.idea_id == idea_id
        )
    ).scalar_one_or_none()

    if existing_like is None:
        return {
            "error": "Idea has not been liked by this user"
        }, 404

    db.session.delete(existing_like)
    db.session.commit()

    return {
        "message": "Idea unliked successfully"
    }