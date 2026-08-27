from flask import Blueprint, request
from app import db
from app.models import Idea, Like, Notification, User

likes = Blueprint("likes", __name__, url_prefix="/ideas")


def like_to_dict(like):
    return {
        "id": like.id,
        "idea_id": like.idea_id,
        "user_id": like.user_id
    }


@likes.post("/<int:idea_id>/like")
def like_idea(idea_id):
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}, 400

    user = db.session.get(User, user_id)
    idea = db.session.get(Idea, idea_id)

    if not user:
        return {"error": "User not found"}, 404

    if not idea:
        return {"error": "Idea not found"}, 404

    existing_like = Like.query.filter_by(
        user_id=user_id,
        idea_id=idea_id
    ).first()

    if existing_like:
        return {"error": "Idea already liked"}, 409

    like = Like(
        user_id=user_id,
        idea_id=idea_id
    )

    db.session.add(like)
    db.session.flush()

    if idea.user_id != user_id:
        notification = Notification(
            message=f"{user.username} liked your idea: {idea.title}",
            notification_type="like",
            is_read=False,
            user_id=idea.user_id,
            idea_id=idea.id
        )

        db.session.add(notification)

    db.session.commit()

    return {
        "message": "Idea liked successfully",
        "like": like_to_dict(like)
    }, 201


@likes.delete("/<int:idea_id>/like")
def unlike_idea(idea_id):
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}, 400

    like = Like.query.filter_by(
        user_id=user_id,
        idea_id=idea_id
    ).first()

    if not like:
        return {"error": "Idea has not been liked by this user"}, 404

    db.session.delete(like)
    db.session.commit()

    return {"message": "Idea unliked successfully"}