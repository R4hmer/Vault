from flask import Blueprint

routes = Blueprint("routes", __name__, url_prefix="/api")


@routes.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Vault backend is running"
    }