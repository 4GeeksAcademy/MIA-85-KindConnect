import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from src.api.utils import APIException, generate_sitemap
from src.api.models import db, User, Post, Reply, Favorite
from src.api.routes import api as api_bp
from src.api.admin import setup_admin
from src.api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_cors import CORS

NINJA_API_KEY = os.getenv("NINJA_API_KEY")

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
}, supports_credentials=True)
app.url_map.strict_slashes = False

# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
migrate = Migrate(app, db, compare_type=True)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = os.environ.get("FLASK_APP_KEY", "dev-secret")
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 57
jwt = JWTManager(app)

# add admin and CLI commands
setup_admin(app)
setup_commands(app)

# register the API blueprint from src/api/routes.py
app.register_blueprint(api_bp, url_prefix='/api')


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# fallback static file handler


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response


if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    # Run without the Flask debugger/reloader in production or when requested
    app.run(host='0.0.0.0', port=PORT, debug=False)
