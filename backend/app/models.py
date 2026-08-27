from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    ideas = db.relationship(
        "Idea",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    comments = db.relationship(
        "Comment",
        back_populates="author",
        cascade="all, delete-orphan"
    )

    likes = db.relationship(
        "Like",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    favourites = db.relationship(
        "Favourite",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    notifications = db.relationship(
        "Notification",
        back_populates="recipient",
        cascade="all, delete-orphan"
    )

    tasks = db.relationship(
        "RoadmapTask",
        back_populates="owner",
        cascade="all, delete-orphan"
    )


class Idea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Draft")
    privacy = db.Column(db.String(20), nullable=False, default="public")

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    owner = db.relationship(
        "User",
        back_populates="ideas"
    )

    comments = db.relationship(
        "Comment",
        back_populates="idea",
        cascade="all, delete-orphan"
    )

    likes = db.relationship(
        "Like",
        back_populates="idea",
        cascade="all, delete-orphan"
    )

    favourites = db.relationship(
        "Favourite",
        back_populates="idea",
        cascade="all, delete-orphan"
    )

    tasks = db.relationship(
        "RoadmapTask",
        back_populates="idea",
        cascade="all, delete-orphan"
    )


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    idea_id = db.Column(
        db.Integer,
        db.ForeignKey("idea.id"),
        nullable=False
    )

    author = db.relationship(
        "User",
        back_populates="comments"
    )

    idea = db.relationship(
        "Idea",
        back_populates="comments"
    )

    likes = db.relationship(
        "Like",
        back_populates="comment",
        cascade="all, delete-orphan"
    )


class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    idea_id = db.Column(
        db.Integer,
        db.ForeignKey("idea.id"),
        nullable=True
    )

    comment_id = db.Column(
        db.Integer,
        db.ForeignKey("comment.id"),
        nullable=True
    )

    user = db.relationship(
        "User",
        back_populates="likes"
    )

    idea = db.relationship(
        "Idea",
        back_populates="likes"
    )

    comment = db.relationship(
        "Comment",
        back_populates="likes"
    )


class Favourite(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    idea_id = db.Column(
        db.Integer,
        db.ForeignKey("idea.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="favourites"
    )

    idea = db.relationship(
        "Idea",
        back_populates="favourites"
    )


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    message = db.Column(db.String(255), nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    idea_id = db.Column(
        db.Integer,
        db.ForeignKey("idea.id"),
        nullable=True
    )

    comment_id = db.Column(
        db.Integer,
        db.ForeignKey("comment.id"),
        nullable=True
    )

    task_id = db.Column(
        db.Integer,
        db.ForeignKey("roadmap_task.id"),
        nullable=True
    )

    recipient = db.relationship(
        "User",
        back_populates="notifications"
    )


class RoadmapTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Pending")

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    idea_id = db.Column(
        db.Integer,
        db.ForeignKey("idea.id"),
        nullable=True
    )

    owner = db.relationship(
        "User",
        back_populates="tasks"
    )

    idea = db.relationship(
        "Idea",
        back_populates="tasks"
    )