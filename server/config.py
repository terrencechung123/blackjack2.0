from flask import Flask, request, make_response, session, jsonify, abort
from flask_migrate import Migrate
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask import render_template
load_dotenv()
import os
db = SQLAlchemy()
app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)
bcrypt = Bcrypt(app)

# @app.route('/blackjack')
# def serve_blackjack_js():
#     return app.send_static_file('../src/components/Blackjack.js')

@app.route('/')
@app.route('/blackjack')
@app.route('/<int:id>')
def index(id=0):
    return render_template("index.html")

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

app.secret_key = 'mysecretlittlekey'

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)