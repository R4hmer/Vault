from app.models import Comment, Idea, RoadmapTask


def user_owns_idea(user_id, idea_id):
    idea = Idea.query.get(idea_id)

    if idea is None:
        return False

    return idea.user_id == user_id


def user_owns_comment(user_id, comment_id):
    comment = Comment.query.get(comment_id)

    if comment is None:
        return False

    return comment.user_id == user_id


def user_owns_task(user_id, task_id):
    task = RoadmapTask.query.get(task_id)

    if task is None:
        return False

    return task.user_id == user_id