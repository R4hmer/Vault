from flask import Blueprint, request
from app import db
from app.models import Comment, Idea, Notification, User

comments = Blueprint("comments", __name__, url_prefix="/comments")


def comment_to_dict(comment):
    return {
        "id": comment.id,
        "text": comment.text,
        "user_id": comment.user_id,
        "idea_id": comment.idea_id
    }


@comments.post("")
def create_comment():
    data = request.get_json()

    text = data.get("text")
    user_id = data.get("user_id")
    idea_id = data.get("idea_id")

    if not text or not user_id or not idea_id:
        return {
            "error": "text, user_id and idea_id are required"
        }, 400

    user = db.session.get(User, user_id)
    idea = db.session.get(Idea, idea_id)

    if not user:
        return {"error": "User not found"}, 404

    if not idea:
        return {"error": "Idea not found"}, 404

    comment = Comment(
        text=text,
        user_id=user_id,
        idea_id=idea_id
    )

    db.session.add(comment)
    db.session.flush()

    if idea.user_id != user_id:
        notification = Notification(
            message=f"{user.username} commented on your idea: {idea.title}",
            notification_type="comment",
            is_read=False,
            user_id=idea.user_id,
            idea_id=idea.id,
            comment_id=comment.id
        )

        db.session.add(notification)

    db.session.commit()

    return {
        "message": "Comment created successfully",
        "comment": comment_to_dict(comment)
    }, 201


@comments.get("")
def get_comments():
    comments_list = Comment.query.all()

    return [
        comment_to_dict(comment)
        for comment in comments_list
    ]


@comments.get("/<int:comment_id>")
def get_comment(comment_id):
    comment = db.session.get(Comment, comment_id)

    if not comment:
        return {"error": "Comment not found"}, 404

    return comment_to_dict(comment)


@comments.put("/<int:comment_id>")
def update_comment(comment_id):
    comment = db.session.get(Comment, comment_id)

    if not comment:
        return {"error": "Comment not found"}, 404

    data = request.get_json()

    if "text" in data:
        comment.text = data["text"]

    db.session.commit()

    return {
        "message": "Comment updated successfully",
        "comment": comment_to_dict(comment)
    }


@comments.delete("/<int:comment_id>")
def delete_comment(comment_id):
    comment = db.session.get(Comment, comment_id)

    if not comment:
        return {"error": "Comment not found"}, 404

    db.session.delete(comment)
    db.session.commit()

    return {"message": "Comment deleted successfully"}