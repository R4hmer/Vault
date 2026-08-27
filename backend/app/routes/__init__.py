from flask import Blueprint

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


from app.routes import ideas
from app.routes import comments
from app.routes import likes
from app.routes import misc
from app.routes import favourites