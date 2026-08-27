from app import create_app, db
from app.models import User, Idea, Comment, Like, Favourite, Notification, RoadmapTask

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully")

    tables = [
        User.__tablename__,
        Idea.__tablename__,
        Comment.__tablename__,
        Like.__tablename__,
        Favourite.__tablename__,
        Notification.__tablename__,
        RoadmapTask.__tablename__,
    ]

    print("Tables:")
    for table in tables:
        print(f"- {table}")