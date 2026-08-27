from flask import Blueprint, request

from app import db
from app.models import Comment, Idea, User

comments = Blueprint("comments", __name__)


@comments.get("/comments")
def get_comments():
    comments = db.session.execute(
        db.select(Comment)
    ).scalars().all()

    return [
        {
            "id": comment.id,
            "text": comment.text,
            "user_id": comment.user_id,
            "idea_id": comment.idea_id
        }
        for comment in comments
    ]


@comments.get("/comments/<int:comment_id>")
def get_comment(comment_id):
    comment = db.session.get(Comment, comment_id)

    if comment is None:
        return {
            "error": "Comment not found"
        }, 404

    return {
        "id": comment.id,
        "text": comment.text,
        "user_id": comment.user_id,
        "idea_id": comment.idea_id
    }


@comments.post("/comments")
def create_comment():
    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    required_fields = [
        "text",
        "user_id",
        "idea_id"
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in data
    ]

    if missing_fields:
        return {
            "error": "Missing required fields",
            "fields": missing_fields
        }, 400

    user = db.session.get(User, data["user_id"])

    if user is None:
        return {
            "error": "User not found"
        }, 404

    idea = db.session.get(Idea, data["idea_id"])

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    if not str(data["text"]).strip():
        return {
            "error": "Comment text cannot be empty"
        }, 400

    comment = Comment(
        text=str(data["text"]).strip(),
        user_id=data["user_id"],
        idea_id=data["idea_id"]
    )

    db.session.add(comment)
    db.session.commit()

    return {
        "message": "Comment created successfully",
        "comment": {
            "id": comment.id,
            "text": comment.text,
            "user_id": comment.user_id,
            "idea_id": comment.idea_id
        }
    }, 201


@comments.put("/comments/<int:comment_id>")
def update_comment(comment_id):
    comment = db.session.get(Comment, comment_id)

    if comment is None:
        return {
            "error": "Comment not found"
        }, 404

    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    if "text" in data:
        text = str(data["text"]).strip()

        if not text:
            return {
                "error": "Comment text cannot be empty"
            }, 400

        comment.text = text

    if "idea_id" in data:
        idea = db.session.get(Idea, data["idea_id"])

        if idea is None:
            return {
                "error": "Idea not found"
            }, 404

        comment.idea_id = data["idea_id"]

    db.session.commit()

    return {
        "message": "Comment updated successfully",
        "comment": {
            "id": comment.id,
            "text": comment.text,
            "user_id": comment.user_id,
            "idea_id": comment.idea_id
        }
    }


@comments.delete("/comments/<int:comment_id>")
def delete_comment(comment_id):
    comment = db.session.get(Comment, comment_id)

    if comment is None:
        return {
            "error": "Comment not found"
        }, 404

    db.session.delete(comment)
    db.session.commit()

    return {
        "message": "Comment deleted successfully"
    }