from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from flask_cors import cross_origin
from app import db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if request.method == 'OPTIONS':
        # 處理預檢請求
        return jsonify({"msg": "OK"}), 200

    try:
        print("Received headers:", dict(request.headers))  # 打印請求頭
        print("Received data:", request.get_json())  # 打印請求數據
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        username = data.get('username')
        password = data.get('password')
        
        print(f"Attempting login for user: {username}")  # 調試信息
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
            return jsonify({
                "status": "success",
                "token": access_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role
                }
            }), 200
        
        return jsonify({"error": "Invalid username or password"}), 401
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # 調試信息
        return jsonify({"error": str(e)}), 500

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(username=data.get('username')).first():
            return jsonify({'status': 'error', 'message': '使用者名稱已存在'}), 400
            
        user = User(
            username=data.get('username'),
            password_hash=generate_password_hash(data.get('password')),
            role=data.get('role', 'staff')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'status': 'success', 'message': '註冊成功'}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@bp.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test successful"}), 200

@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"}), 200