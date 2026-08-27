from flask import Blueprint

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
def ideas_endpoint():
    return {
        "message": "Ideas endpoint is ready",
        "status": "ok"
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