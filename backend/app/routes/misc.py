from flask import Blueprint

misc = Blueprint("misc", __name__)


@misc.get("/users")
def users_endpoint():
    return {
        "message": "Users endpoint is ready",
        "status": "ok"
    }


@misc.get("/notifications")
def notifications_endpoint():
    return {
        "message": "Notifications endpoint is ready",
        "status": "ok"
    }


@misc.get("/tasks")
def tasks_endpoint():
    return {
        "message": "Tasks endpoint is ready",
        "status": "ok"
    }