from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from config import config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # 初始化擴展
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # CORS設置
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # 註冊藍圖
    from .routes import auth, appointments, services, portfolio, members
    app.register_blueprint(auth.bp)
    app.register_blueprint(appointments.bp)
    app.register_blueprint(services.bp)
    app.register_blueprint(portfolio.bp)
    app.register_blueprint(members.bp)

    # 註冊錯誤處理
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': str(error)
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            'error': 'Unauthorized',
            'message': '請先登入'
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            'error': 'Forbidden',
            'message': '無權限執行此操作'
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': '找不到請求的資源'
        }), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        db.session.rollback()
        return jsonify({
            'error': 'Internal Server Error',
            'message': '服務器內部錯誤'
        }), 500

    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.error(f'未處理的異常: {str(error)}')
        return jsonify({
            'error': 'Internal Server Error',
            'message': '發生未預期的錯誤'
        }), 500

    # 註冊命令
    from .commands import register_commands
    register_commands(db)(app)
    
    return app