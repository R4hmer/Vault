from flask import request
from app import db
from app.models import User, Idea, RoadmapTask
from app.routes import routes


@routes.post("/tasks")
def create_task():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")
    user_id = data.get("user_id")
    idea_id = data.get("idea_id")

    if not title or not description or not user_id:
        return {
            "error": "title, description, and user_id are required"
        }, 400

    user = User.query.get(user_id)

    if not user:
        return {"error": "User not found"}, 404

    if idea_id:
        idea = Idea.query.get(idea_id)

        if not idea:
            return {"error": "Idea not found"}, 404

    task = RoadmapTask(
        title=title,
        description=description,
        user_id=user_id,
        idea_id=idea_id
    )

    db.session.add(task)
    db.session.commit()

    return {
        "message": "Task created successfully",
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "idea_id": task.idea_id
        }
    }, 201


@routes.get("/tasks")
def get_tasks():
    tasks = RoadmapTask.query.all()

    return [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "idea_id": task.idea_id
        }
        for task in tasks
    ], 200


@routes.get("/tasks/<int:task_id>")
def get_task(task_id):
    task = RoadmapTask.query.get(task_id)

    if not task:
        return {"error": "Task not found"}, 404

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "user_id": task.user_id,
        "idea_id": task.idea_id
    }, 200


@routes.put("/tasks/<int:task_id>")
def update_task(task_id):
    task = RoadmapTask.query.get(task_id)

    if not task:
        return {"error": "Task not found"}, 404

    data = request.get_json()

    if "title" in data:
        task.title = data["title"]

    if "description" in data:
        task.description = data["description"]

    if "status" in data:
        task.status = data["status"]

    if "idea_id" in data:
        idea_id = data["idea_id"]

        if idea_id:
            idea = Idea.query.get(idea_id)

            if not idea:
                return {"error": "Idea not found"}, 404

        task.idea_id = idea_id

    db.session.commit()

    return {
        "message": "Task updated successfully",
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "user_id": task.user_id,
            "idea_id": task.idea_id
        }
    }, 200


@routes.delete("/tasks/<int:task_id>")
def delete_task(task_id):
    task = RoadmapTask.query.get(task_id)

    if not task:
        return {"error": "Task not found"}, 404

    db.session.delete(task)
    db.session.commit()

    return {"message": "Task deleted successfully"}, 200