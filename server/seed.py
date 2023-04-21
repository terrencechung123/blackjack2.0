from config import db
from models import User, Card, Game, Game_Cards
from app import app

with app.app_context():

    Game.query.delete()
    User.query.delete()
    Card.query.delete()
    Game_Cards.query.delete()

    # create cards
    cards = [
        Card(name='Ace of Hearts', value=11, suit='H', image='https://deckofcardsapi.com/static/img/AH.png'),
        Card(name='Two of Hearts', value=2, suit='H', image = 'https://deckofcardsapi.com/static/img/2H.png'),
        Card(name='Three of Hearts', value=3, suit='H', image = 'https://deckofcardsapi.com/static/img/3H.png'),
        Card(name='Four of Hearts', value=4, suit='H', image = 'https://deckofcardsapi.com/static/img/4H.png'),
        Card(name='Five of Hearts', value=5, suit='H', image = 'https://deckofcardsapi.com/static/img/5H.png'),
        Card(name='Six of Hearts', value=6, suit='H', image = 'https://deckofcardsapi.com/static/img/6H.png'),
        Card(name='Seven of Hearts', value=7, suit='H', image = 'https://deckofcardsapi.com/static/img/7H.png'),
        Card(name='Eight of Hearts', value=8, suit='H', image = 'https://deckofcardsapi.com/static/img/8H.png'),
        Card(name='Nine of Hearts', value=9, suit='H', image = 'https://deckofcardsapi.com/static/img/9H.png'),
        Card(name='Ten of Hearts', value=10, suit='H', image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/10H.svg/225px-10H.svg.png'),
        Card(name='Jack of Hearts', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/JH.png'),
        Card(name='Queen of Hearts', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/QH.png'),
        Card(name='King of Hearts', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/KH.png'),

        Card(name='Ace of Diamonds', value=11, suit='D', image = 'https://deckofcardsapi.com/static/img/AD.png'),
        Card(name='Two of Diamonds', value=2, suit='D', image = 'https://deckofcardsapi.com/static/img/2D.png'),
        Card(name='Three of Diamonds', value=3, suit='D', image = 'https://deckofcardsapi.com/static/img/3D.png'),
        Card(name='Four of Diamonds', value=4, suit='D', image = 'https://deckofcardsapi.com/static/img/4D.png'),
        Card(name='Five of Diamonds', value=5, suit='D', image = 'https://deckofcardsapi.com/static/img/5D.png'),
        Card(name='Six of Diamonds', value=6, suit='D', image = 'https://deckofcardsapi.com/static/img/6D.png'),
        Card(name='Seven of Diamonds', value=7, suit='D', image = 'https://deckofcardsapi.com/static/img/7D.png'),
        Card(name='Eight of Diamonds', value=8, suit='D', image = 'https://deckofcardsapi.com/static/img/8D.png'),
        Card(name='Nine of Diamonds', value=9, suit='D', image = 'https://deckofcardsapi.com/static/img/9D.png'),
        Card(name='Ten of Diamonds', value=10, suit='D', image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/10D.svg/225px-10D.svg.png'),
        Card(name='Jack of Diamonds', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/JD.png'),
        Card(name='Queen of Diamonds', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/QD.png'),
        Card(name='King of Diamonds', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/KD.png'),

        Card(name='Ace of Clovers', value=11, suit='C', image = 'https://deckofcardsapi.com/static/img/AC.png'),
        Card(name='Two of Clovers', value=2, suit='C', image = 'https://deckofcardsapi.com/static/img/2C.png'),
        Card(name='Three of Clovers', value=3, suit='C', image = 'https://deckofcardsapi.com/static/img/3C.png'),
        Card(name='Four of Clovers', value=4, suit='C', image = 'https://deckofcardsapi.com/static/img/4C.png'),
        Card(name='Five of Clovers', value=5, suit='C', image = 'https://deckofcardsapi.com/static/img/5C.png'),
        Card(name='Six of Clovers', value=6, suit='C', image = 'https://deckofcardsapi.com/static/img/6C.png'),
        Card(name='Seven of Clovers', value=7, suit='C', image = 'https://deckofcardsapi.com/static/img/7C.png'),
        Card(name='Eight of Clovers', value=8, suit='C', image = 'https://deckofcardsapi.com/static/img/8C.png'),
        Card(name='Nine of Clovers', value=9, suit='C', image = 'https://deckofcardsapi.com/static/img/9C.png'),
        Card(name='Ten of Clovers', value=10, suit='C', image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/10C.svg/225px-10C.svg.png'),
        Card(name='Jack of Clovers', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/JC.png'),
        Card(name='Queen of Clovers', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/QC.png'),
        Card(name='King of Clovers', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/KC.png'),

        Card(name='Ace of Spades', value=11, suit='S', image = 'https://deckofcardsapi.com/static/img/AS.png'),
        Card(name='Two of Spades', value=2, suit='S', image = 'https://deckofcardsapi.com/static/img/2S.png'),
        Card(name='Three of Spades', value=3, suit='S', image = 'https://deckofcardsapi.com/static/img/3S.png'),
        Card(name='Four of Spades', value=4, suit='S', image = 'https://deckofcardsapi.com/static/img/4S.png'),
        Card(name='Five of Spades', value=5, suit='S', image = 'https://deckofcardsapi.com/static/img/5S.png'),
        Card(name='Six of Spades', value=6, suit='S', image = 'https://deckofcardsapi.com/static/img/6S.png'),
        Card(name='Seven of Spades', value=7, suit='S', image = 'https://deckofcardsapi.com/static/img/7S.png'),
        Card(name='Eight of Spades', value=8, suit='S', image = 'https://deckofcardsapi.com/static/img/8S.png'),
        Card(name='Nine of Spades', value=9, suit='S', image = 'https://deckofcardsapi.com/static/img/9S.png'),
        Card(name='Ten of Spades', value=10, suit='S', image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/10S.svg/225px-10S.svg.png'),
        Card(name='Jack of Spades', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/JS.png'),
        Card(name='Queen of Spades', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/QS.png'),
        Card(name='King of Spades', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/KS.png'),
    ]
    db.session.add_all(cards)
    db.session.commit()

    print("Database seeded successfully!")