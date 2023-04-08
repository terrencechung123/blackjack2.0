from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from sqlalchemy.ext.associationproxy import association_proxy


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-_password_hash','-games')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)

    games = db.relationship('Game', backref='user')
    cards = association_proxy('games', 'card')


    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.id}>'

class Game(db.Model, SerializerMixin):
    __tablename__='games'

    serialize_rules = ('-card_id','-user_id','-cards','-card')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    result = db.Column(db.String)
    user_hand = db.Column(db.String)
    dealer_hand = db.Column(db.String)

    cards = db.relationship('Card', secondary='game_cards', back_populates='_game_cards')

class Game_Cards(db.Model,SerializerMixin):
    __tablename__='game_cards'

    serialize_rules = ()

    id = db.Column(db.Integer, primary_key=True)
    game_id=db.Column(db.Integer, db.ForeignKey('games.id'))
    card_id=db.Column(db.Integer, db.ForeignKey('cards.id'))





class Card(db.Model, SerializerMixin):
    __tablename__ = 'cards'

    serialize_rules = ('-games','-_game_cards','-game_id')

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    value = db.Column(db.Integer)
    suit = db.Column(db.String)
    name = db.Column(db.String)
    image = db.Column(db.String)

    games = db.relationship('Game', backref='card')
    users = association_proxy('games', 'user')

    _game_cards = db.relationship('Game', secondary='game_cards', back_populates='cards')



