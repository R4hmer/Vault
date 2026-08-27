from flask import Blueprint

from app.routes.comments import comments
from app.routes.ideas import ideas
from app.routes.misc import misc

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


routes.register_blueprint(ideas)
routes.register_blueprint(comments)
routes.register_blueprint(misc)
