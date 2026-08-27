from flask import Blueprint

routes = Blueprint("routes", __name__, url_prefix="/api")

from app.routes.ideas import ideas
from app.routes.comments import comments
from app.routes.misc import misc
from app.routes.likes import likes
from app.routes.favourites import favourites
from app.routes.tasks import tasks
from app.routes.notifications import notifications

routes.register_blueprint(ideas)
routes.register_blueprint(comments)
routes.register_blueprint(likes)
routes.register_blueprint(favourites)
routes.register_blueprint(tasks)
routes.register_blueprint(notifications)
routes.register_blueprint(misc)