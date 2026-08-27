from flask import Blueprint, request
from app import db
from app.models import Idea, Notification, RoadmapTask, User

tasks = Blueprint("tasks", __name__, url_prefix="/tasks")


def task_to_dict(task):
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "user_id": task.user_id,
        "idea_id": task.idea_id
    }


@tasks.post("")
def create_task():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    user_id = data.get("user_id")
    idea_id = data.get("idea_id")

    if not title or not description or not user_id:
        return {
            "error": "title, description and user_id are required"
        }, 400

    user = db.session.get(User, user_id)

    if not user:
        return {"error": "User not found"}, 404

    idea = None

    if idea_id:
        idea = db.session.get(Idea, idea_id)

        if not idea:
            return {"error": "Idea not found"}, 404

    task = RoadmapTask(
        title=title,
        description=description,
        user_id=user_id,
        idea_id=idea_id
    )

    db.session.add(task)
    db.session.flush()

    if idea and idea.user_id != user_id:
        notification = Notification(
            message=f"{user.username} created a roadmap task for your idea: {idea.title}",
            notification_type="task",
            is_read=False,
            user_id=idea.user_id,
            idea_id=idea.id,
            task_id=task.id
        )

        db.session.add(notification)

    db.session.commit()

    return {
        "message": "Task created successfully",
        "task": task_to_dict(task)
    }, 201


@tasks.get("")
def get_tasks():
    tasks_list = RoadmapTask.query.all()

    return [
        task_to_dict(task)
        for task in tasks_list
    ]


@tasks.get("/<int:task_id>")
def get_task(task_id):
    task = db.session.get(RoadmapTask, task_id)

    if not task:
        return {"error": "Task not found"}, 404

    return task_to_dict(task)


@tasks.put("/<int:task_id>")
def update_task(task_id):
    task = db.session.get(RoadmapTask, task_id)

    if not task:
        return {"error": "Task not found"}, 404

    data = request.get_json()

    if "title" in data:
        task.title = data["title"]

    if "description" in data:
        task.description = data["description"]

    if "status" in data:
        task.status = data["status"]

    db.session.commit()

    return {
        "message": "Task updated successfully",
        "task": task_to_dict(task)
    }


@tasks.delete("/<int:task_id>")
def delete_task(task_id):
    task = db.session.get(RoadmapTask, task_id)

    if not task:
        return {"error": "Task not found"}, 404

    db.session.delete(task)
    db.session.commit()

    return {"message": "Task deleted successfully"}