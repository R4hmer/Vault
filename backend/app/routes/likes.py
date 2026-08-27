from flask import Blueprint, request

from app import db
from app.models import Comment, Idea, Like, Notification, User

likes = Blueprint("likes", __name__, url_prefix="/ideas")


def like_to_dict(like):
    return {
        "id": like.id,
        "idea_id": like.idea_id,
        "comment_id": like.comment_id,
        "user_id": like.user_id
    }


@likes.get("/<int:idea_id>/engagement")
def get_idea_engagement(idea_id):
    user_id = request.args.get("user_id", type=int)

    idea = db.session.get(Idea, idea_id)

    if not idea:
        return {"error": "Idea not found"}, 404

    likes_count = Like.query.filter_by(
        idea_id=idea_id
    ).count()

    is_liked = False
    is_favourited = False

    if user_id:
        is_liked = Like.query.filter_by(
            user_id=user_id,
            idea_id=idea_id
        ).first() is not None

        from app.models import Favourite

        is_favourited = Favourite.query.filter_by(
            user_id=user_id,
            idea_id=idea_id
        ).first() is not None

    return {
        "idea_id": idea_id,
        "likes_count": likes_count,
        "is_liked": is_liked,
        "is_favourited": is_favourited
    }


@likes.post("/<int:idea_id>/like")
def like_idea(idea_id):
    data = request.get_json() or {}
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
    data = request.get_json() or {}
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


@likes.get(
    "/<int:idea_id>/comments/<int:comment_id>/engagement"
)
def get_comment_engagement(idea_id, comment_id):
    user_id = request.args.get("user_id", type=int)

    comment = db.session.get(Comment, comment_id)

    if not comment or comment.idea_id != idea_id:
        return {"error": "Comment not found"}, 404

    likes_count = Like.query.filter_by(
        comment_id=comment_id
    ).count()

    is_liked = False

    if user_id:
        is_liked = Like.query.filter_by(
            user_id=user_id,
            comment_id=comment_id
        ).first() is not None

    return {
        "comment_id": comment_id,
        "likes_count": likes_count,
        "is_liked": is_liked
    }


@likes.post(
    "/<int:idea_id>/comments/<int:comment_id>/like"
)
def like_comment(idea_id, comment_id):
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}, 400

    user = db.session.get(User, user_id)
    idea = db.session.get(Idea, idea_id)
    comment = db.session.get(Comment, comment_id)

    if not user:
        return {"error": "User not found"}, 404

    if not idea:
        return {"error": "Idea not found"}, 404

    if not comment or comment.idea_id != idea_id:
        return {"error": "Comment not found"}, 404

    existing_like = Like.query.filter_by(
        user_id=user_id,
        comment_id=comment_id
    ).first()

    if existing_like:
        return {"error": "Comment already liked"}, 409

    like = Like(
        user_id=user_id,
        comment_id=comment_id
    )

    db.session.add(like)
    db.session.commit()

    return {
        "message": "Comment liked successfully",
        "like": like_to_dict(like)
    }, 201


@likes.delete(
    "/<int:idea_id>/comments/<int:comment_id>/like"
)
def unlike_comment(idea_id, comment_id):
    data = request.get_json() or {}
    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}, 400

    comment = db.session.get(Comment, comment_id)

    if not comment or comment.idea_id != idea_id:
        return {"error": "Comment not found"}, 404

    like = Like.query.filter_by(
        user_id=user_id,
        comment_id=comment_id
    ).first()

    if not like:
        return {
            "error": "Comment has not been liked by this user"
        }, 404

    db.session.delete(like)
    db.session.commit()

    return {"message": "Comment unliked successfully"}