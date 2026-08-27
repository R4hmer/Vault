from flask import Blueprint, request
from app import db
from app.models import Notification

notifications = Blueprint("notifications", __name__, url_prefix="/notifications")


def notification_to_dict(notification):
    return {
        "id": notification.id,
        "message": notification.message,
        "notification_type": notification.notification_type,
        "is_read": notification.is_read,
        "user_id": notification.user_id,
        "idea_id": notification.idea_id,
        "comment_id": notification.comment_id,
        "task_id": notification.task_id
    }


@notifications.get("/user/<int:user_id>")
def get_user_notifications(user_id):
    user_notifications = Notification.query.filter_by(
        user_id=user_id
    ).order_by(Notification.id.desc()).all()

    return [
        notification_to_dict(notification)
        for notification in user_notifications
    ]


@notifications.get("/<int:notification_id>")
def get_notification(notification_id):
    notification = db.session.get(Notification, notification_id)

    if not notification:
        return {"error": "Notification not found"}, 404

    return notification_to_dict(notification)


@notifications.put("/<int:notification_id>/read")
def mark_notification_as_read(notification_id):
    notification = db.session.get(Notification, notification_id)

    if not notification:
        return {"error": "Notification not found"}, 404

    notification.is_read = True
    db.session.commit()

    return {
        "message": "Notification marked as read",
        "notification": notification_to_dict(notification)
    }


@notifications.delete("/<int:notification_id>")
def delete_notification(notification_id):
    notification = db.session.get(Notification, notification_id)

    if not notification:
        return {"error": "Notification not found"}, 404

    db.session.delete(notification)
    db.session.commit()

    return {"message": "Notification deleted successfully"}