from flask import Blueprint, request
from app import db
from app.models import Idea

routes = Blueprint("routes", __name__, url_prefix="/api")


@routes.get("/")
def api_home():
    return {
        "message": "Vault API is running",
        "status": "ok"
    }


@routes.get("/health")
def health():
    return {
        "message": "Vault backend is running",
        "status": "ok"
    }


@routes.get("/ideas")
def get_ideas():
    ideas = db.session.execute(
        db.select(Idea)
    ).scalars().all()

    return [
        {
            "id": idea.id,
            "title": idea.title,
            "description": idea.description,
            "category": idea.category,
            "status": idea.status,
            "privacy": idea.privacy,
            "user_id": idea.user_id
        }
        for idea in ideas
    ]


@routes.get("/ideas/<int:idea_id>")
def get_idea(idea_id):
    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    return {
        "id": idea.id,
        "title": idea.title,
        "description": idea.description,
        "category": idea.category,
        "status": idea.status,
        "privacy": idea.privacy,
        "user_id": idea.user_id
    }


@routes.post("/ideas")
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
        "idea": {
            "id": idea.id,
            "title": idea.title,
            "description": idea.description,
            "category": idea.category,
            "status": idea.status,
            "privacy": idea.privacy,
            "user_id": idea.user_id
        }
    }, 201


@routes.put("/ideas/<int:idea_id>")
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
        "idea": {
            "id": idea.id,
            "title": idea.title,
            "description": idea.description,
            "category": idea.category,
            "status": idea.status,
            "privacy": idea.privacy,
            "user_id": idea.user_id
        }
    }


@routes.delete("/ideas/<int:idea_id>")
def delete_idea(idea_id):
    idea = db.session.get(Idea, idea_id)

    if idea is None:
        return {
            "error": "Idea not found"
        }, 404

    db.session.delete(idea)
    db.session.commit()

    return {
        "message": "Idea deleted successfully"
    }


@routes.get("/comments")
def comments_endpoint():
    return {
        "message": "Comments endpoint is ready",
        "status": "ok"
    }


@routes.get("/users")
def users_endpoint():
    return {
        "message": "Users endpoint is ready",
        "status": "ok"
    }


@routes.get("/notifications")
def notifications_endpoint():
    return {
        "message": "Notifications endpoint is ready",
        "status": "ok"
    }


@routes.get("/tasks")
def tasks_endpoint():
    return {
        "message": "Tasks endpoint is ready",
        "status": "ok"
    }