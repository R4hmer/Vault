from flask import request
from app import db
from app.models import User, Idea, Favourite
from app.routes import routes


@routes.post("/ideas/<int:idea_id>/favourite")
def favourite_idea(idea_id):
    data = request.get_json()

    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}, 400

    user = User.query.get(user_id)
    idea = Idea.query.get(idea_id)

    if not user:
        return {"error": "User not found"}, 404

    if not idea:
        return {"error": "Idea not found"}, 404

    existing_favourite = Favourite.query.filter_by(
        user_id=user_id,
        idea_id=idea_id
    ).first()

    if existing_favourite:
        return {"error": "Idea already favourited"}, 409

    favourite = Favourite(
        user_id=user_id,
        idea_id=idea_id
    )

    db.session.add(favourite)
    db.session.commit()

    return {
        "message": "Idea favourited successfully",
        "favourite": {
            "id": favourite.id,
            "user_id": favourite.user_id,
            "idea_id": favourite.idea_id
        }
    }, 201


@routes.delete("/ideas/<int:idea_id>/favourite")
def unfavourite_idea(idea_id):
    data = request.get_json()

    user_id = data.get("user_id")

    if not user_id:
        return {"error": "user_id is required"}, 400

    favourite = Favourite.query.filter_by(
        user_id=user_id,
        idea_id=idea_id
    ).first()

    if not favourite:
        return {"error": "Idea has not been favourited by this user"}, 404

    db.session.delete(favourite)
    db.session.commit()

    return {"message": "Idea unfavourited successfully"}, 200