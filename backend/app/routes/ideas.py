from flask import Blueprint, request

from app import db
from app.models import Idea, User


ideas = Blueprint("ideas", __name__)


def idea_to_dict(idea):
    return {
        "id": idea.id,
        "title": idea.title,
        "description": idea.description,
        "category": idea.category,
        "status": idea.status,
        "privacy": idea.privacy,
        "user_id": idea.user_id,
        "likes_count": len(idea.likes),
        "favourites_count": len(idea.favourites),
        "comments_count": len(idea.comments)
    }


@ideas.get("/ideas")
def get_ideas():
    ideas_list = db.session.execute(
        db.select(Idea)
    ).scalars().all()

    return [
        idea_to_dict(idea)
        for idea in ideas_list
    ]


@ideas.get("/ideas/<int:idea_id>")
def get_idea(idea_id):
    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    return idea_to_dict(idea)


@ideas.get("/users/<int:user_id>/public-ideas")
def get_public_user_ideas(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return {
            "error": "User not found"
        }, 404

    public_ideas = Idea.query.filter_by(
        user_id=user_id,
        privacy="public"
    ).all()

    return [
        idea_to_dict(idea)
        for idea in public_ideas
    ]


@ideas.post("/ideas")
def create_idea():
    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    required_fields = [
        "title",
        "description",
        "category",
        "user_id"
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

    idea = Idea(
        title=data["title"],
        description=data["description"],
        category=data["category"],
        status=data.get("status", "Draft"),
        privacy=data.get("privacy", "public"),
        user_id=data["user_id"]
    )

    db.session.add(idea)
    db.session.commit()

    return {
        "message": "Idea created successfully",
        "idea": idea_to_dict(idea)
    }, 201


@ideas.put("/ideas/<int:idea_id>")
def update_idea(idea_id):
    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    user_id = data.get("user_id")

    if user_id is None:
        return {
            "error": "user_id is required"
        }, 400

    if idea.user_id != user_id:
        return {
            "error": "You cannot modify someone else's idea"
        }, 403

    if "title" in data:
        idea.title = data["title"]

    if "description" in data:
        idea.description = data["description"]

    if "category" in data:
        idea.category = data["category"]

    if "status" in data:
        idea.status = data["status"]

    if "privacy" in data:
        idea.privacy = data["privacy"]

    db.session.commit()

    return {
        "message": "Idea updated successfully",
        "idea": idea_to_dict(idea)
    }


@ideas.delete("/ideas/<int:idea_id>")
def delete_idea(idea_id):
    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    data = request.get_json()

    if not data:
        return {
            "error": "Request body is required"
        }, 400

    user_id = data.get("user_id")

    if user_id is None:
        return {
            "error": "user_id is required"
        }, 400

    if idea.user_id != user_id:
        return {
            "error": "You cannot delete someone else's idea"
        }, 403

    db.session.delete(idea)
    db.session.commit()

    return {
        "message": "Idea deleted successfully"
    }