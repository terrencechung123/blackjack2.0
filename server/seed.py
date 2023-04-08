from config import db
from models import User, Card, Game, Game_Cards
from app import app

with app.app_context():

    Game.query.delete()
    User.query.delete()
    Card.query.delete()
    Game_Cards.query.delete()

    # create users
    users = [
        User(username='player1', _password_hash='password1'),
        User(username='player2', _password_hash='password2'),
        User(username='player3', _password_hash='password3'),
        User(username='player4', _password_hash='password4')
    ]
    db.session.add_all(users)
    db.session.commit()

    # create cards
    cards = [
        Card(name='Ace', value=11, suit='H', image='https://deckofcardsapi.com/static/img/AH.png'),
        Card(name='Two', value=2, suit='H', image = 'https://deckofcardsapi.com/static/img/2H.png'),
        Card(name='Three', value=3, suit='H', image = 'https://deckofcardsapi.com/static/img/3H.png'),
        Card(name='Four', value=4, suit='H', image = 'https://deckofcardsapi.com/static/img/4H.png'),
        Card(name='Five', value=5, suit='H', image = 'https://deckofcardsapi.com/static/img/5H.png'),
        Card(name='Six', value=6, suit='H', image = 'https://deckofcardsapi.com/static/img/6H.png'),
        Card(name='Seven', value=7, suit='H', image = 'https://deckofcardsapi.com/static/img/7H.png'),
        Card(name='Eight', value=8, suit='H', image = 'https://deckofcardsapi.com/static/img/8H.png'),
        Card(name='Nine', value=9, suit='H', image = 'https://deckofcardsapi.com/static/img/9H.png'),
        Card(name='Ten', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/10H.png'),
        Card(name='Jack', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/JH.png'),
        Card(name='Queen', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/QH.png'),
        Card(name='King', value=10, suit='H', image = 'https://deckofcardsapi.com/static/img/KH.png'),

        Card(name='Ace', value=11, suit='D', image = 'https://deckofcardsapi.com/static/img/AD.png'),
        Card(name='Two', value=2, suit='D', image = 'https://deckofcardsapi.com/static/img/2D.png'),
        Card(name='Three', value=3, suit='D', image = 'https://deckofcardsapi.com/static/img/3D.png'),
        Card(name='Four', value=4, suit='D', image = 'https://deckofcardsapi.com/static/img/4D.png'),
        Card(name='Five', value=5, suit='D', image = 'https://deckofcardsapi.com/static/img/5D.png'),
        Card(name='Six', value=6, suit='D', image = 'https://deckofcardsapi.com/static/img/6D.png'),
        Card(name='Seven', value=7, suit='D', image = 'https://deckofcardsapi.com/static/img/7D.png'),
        Card(name='Eight', value=8, suit='D', image = 'https://deckofcardsapi.com/static/img/8D.png'),
        Card(name='Nine', value=9, suit='D', image = 'https://deckofcardsapi.com/static/img/9D.png'),
        Card(name='Ten', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/10D.png'),
        Card(name='Jack', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/JD.png'),
        Card(name='Queen', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/QD.png'),
        Card(name='King', value=10, suit='D', image = 'https://deckofcardsapi.com/static/img/KD.png'),

        Card(name='Ace', value=11, suit='C', image = 'https://deckofcardsapi.com/static/img/AC.png'),
        Card(name='Two', value=2, suit='C', image = 'https://deckofcardsapi.com/static/img/2C.png'),
        Card(name='Three', value=3, suit='C', image = 'https://deckofcardsapi.com/static/img/3C.png'),
        Card(name='Four', value=4, suit='C', image = 'https://deckofcardsapi.com/static/img/4C.png'),
        Card(name='Five', value=5, suit='C', image = 'https://deckofcardsapi.com/static/img/5C.png'),
        Card(name='Six', value=6, suit='C', image = 'https://deckofcardsapi.com/static/img/6C.png'),
        Card(name='Seven', value=7, suit='C', image = 'https://deckofcardsapi.com/static/img/7C.png'),
        Card(name='Eight', value=8, suit='C', image = 'https://deckofcardsapi.com/static/img/8C.png'),
        Card(name='Nine', value=9, suit='C', image = 'https://deckofcardsapi.com/static/img/9C.png'),
        Card(name='Ten', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/10C.png'),
        Card(name='Jack', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/JC.png'),
        Card(name='Queen', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/QC.png'),
        Card(name='King', value=10, suit='C', image = 'https://deckofcardsapi.com/static/img/KC.png'),

        Card(name='Ace', value=11, suit='S', image = 'https://deckofcardsapi.com/static/img/AS.png'),
        Card(name='Two', value=2, suit='S', image = 'https://deckofcardsapi.com/static/img/2S.png'),
        Card(name='Three', value=3, suit='S', image = 'https://deckofcardsapi.com/static/img/3S.png'),
        Card(name='Four', value=4, suit='S', image = 'https://deckofcardsapi.com/static/img/4S.png'),
        Card(name='Five', value=5, suit='S', image = 'https://deckofcardsapi.com/static/img/5S.png'),
        Card(name='Six', value=6, suit='S', image = 'https://deckofcardsapi.com/static/img/6S.png'),
        Card(name='Seven', value=7, suit='S', image = 'https://deckofcardsapi.com/static/img/7S.png'),
        Card(name='Eight', value=8, suit='S', image = 'https://deckofcardsapi.com/static/img/8S.png'),
        Card(name='Nine', value=9, suit='S', image = 'https://deckofcardsapi.com/static/img/9S.png'),
        Card(name='Ten', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/10S.png'),
        Card(name='Jack', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/JS.png'),
        Card(name='Queen', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/QS.png'),
        Card(name='King', value=10, suit='S', image = 'https://deckofcardsapi.com/static/img/KS.png'),
    ]
    db.session.add_all(cards)
    db.session.commit()

    # create games
    games = [
        Game(user_id=1, result='Win'),
        Game(user_id=1, result='Loss'),
        Game(user_id=3, result='Tie'),
        Game(user_id=4, result='Win')
    ]
    games[0].cards = [cards[0], cards[15], cards[20]]
    games[1].cards = [cards[0], cards[4], cards[5]]
    games[2].cards = [cards[10], cards[11], cards[6]]
    games[3].cards = [cards[9], cards[7], cards[8]]
    db.session.add_all(games)
    db.session.commit()

    print("Database seeded successfully!")