"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Post, Reply, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.get("/posts")
def list_posts():
    device_id = request.args.get("device_id", "")
    items = Post.query.order_by(Post.created_at.desc()).all()
    out = []
    for p in items:
        fav_count = len(p.favorites)
        is_fav = False
        if device_id:
            is_fav = any(f.device_id == device_id for f in p.favorites)
        out.append({
            "id": p.id,
            "author": p.author,
            "body": p.body,
            "created_at": p.created_at.isoformat(),
            "replies_count": len(p.replies),
            "favorites_count": fav_count,
            "is_favorited": is_fav
        })
    return jsonify(out), 200


@api.post("/posts")
def create_post():
    data = request.get_json() or {}
    body = (data.get("body") or "").strip()
    author = (data.get("author") or "anon").strip() or "anon"
    if not body:
        return jsonify({"error": "body required"}), 400
    p = Post(author=author, body=body)
    db.session.add(p)
    db.session.commit()
    return jsonify({"id": p.id}), 201


@api.get("/posts/<int:pid>")
def get_post(pid):
    p = Post.query.get(pid)
    if not p:
        return jsonify({"error": "not found"}), 404
    return jsonify({
        "id": p.id,
        "author": p.author,
        "body": p.body,
        "created_at": p.created_at.isoformat(),
        "replies": [
            {
                "id": r.id,
                "author": r.author,
                "body": r.body,
                "created_at": r.created_at.isoformat()
            } for r in sorted(p.replies, key=lambda r: r.created_at)
        ],
        "favorites_count": len(p.favorites)
    }), 200


@api.post("/posts/<int:pid>/reply")
def reply_to_post(pid):
    p = Post.query.get(pid)
    if not p:
        return jsonify({"error": "not found"}), 404
    data = request.get_json() or {}
    body = (data.get("body") or "").strip()
    author = (data.get("author") or "anon").strip() or "anon"
    if not body:
        return jsonify({"error": "body required"}), 400
    r = Reply(post_id=p.id, author=author, body=body)
    db.session.add(r)
    db.session.commit()
    return jsonify({"id": r.id}), 201


@api.post("/posts/<int:pid>/favorite")
def toggle_favorite(pid):
    p = Post.query.get(pid)
    if not p:
        return jsonify({"error": "not found"}), 404
    data = request.get_json() or {}
    device_id = (data.get("device_id") or "").strip()

    if not device_id:
        return jsonify({"error": "device_id required"}), 400

    fav = Favorite.query.filter_by(post_id=p.id, device_id=device_id).first()
    if fav:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"favorited": False, "favorites_count": len(p.favorites)}), 200
    else:
        fav = Favorite(post_id=p.id, device_id=device_id)
        db.session.add(fav)
        db.session.commit()
        return jsonify({"favorited": True, "favorites_count": len(p.favorites)}), 201
