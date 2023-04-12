import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { Box, Button } from "../styles";

const backCard = 'https://deckofcardsapi.com/static/img/back.png'

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function Blackjack({ user }) {
  const [cards, setCards] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [userHand, setUserHand] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [game, setGame] = useState([])

  const [games,setGames] = useState([])

  useEffect(() => {
    const gameState = JSON.parse(localStorage.getItem('blackjack-game'));

    if (gameState) {
      fetch(`/games/${gameState.game.id}`)
        .then(r => r.json())
        .then(data => {
          console.log('gameState data', data);
          setGames(data);
          if (data.id === gameState.game.id) {
            setCards(gameState.cards);
            setDealerHand(gameState.dealerHand);
            setUserHand(gameState.userHand);
            setGameResult(gameState.gameResult);
            setIsGameOver(gameState.isGameOver);
            setGame(gameState.game);
          } else {
            setGameStart(false);
            setIsGameOver(true);
          }
        });
    }
  }, []);

  useEffect(() => {
    const storedGame = JSON.parse(localStorage.getItem('blackjack-game'))?.game;
    if (storedGame) {
      setGame(storedGame);
      setGameStart(true);
    }
  }, []);
  // Save the game state to localStorage whenever it changes
  useEffect(() => {
    if (game) {
      const gameState = {
        cards,
        dealerHand,
        userHand,
        gameStart,
        gameResult,
        game,
        isGameOver,
      };
      localStorage.setItem('blackjack-game', JSON.stringify(gameState));
    }
  }, [cards, dealerHand, userHand, gameResult, isGameOver, game, gameStart]);



  useEffect(() => {
    fetch("/cards")
    .then((r) => r.json())
    .then((data) => {
      setCards(shuffleArray(data));
    });
  }, []);


  console.log("deck",cards)
  console.log("dealerHand",dealerHand);
  console.log("userHand",userHand);
  console.log("gameStart",gameStart);

  async function startNewGame() {
    const deck = [...cards];

    // Remove the cards that have already been dealt in the current game
    [...dealerHand, ...userHand].forEach(card => {
      const index = deck.findIndex(c => c.code === card.code);
      if (index !== -1) {
        deck.splice(index, 1);
      }
    });

    const newDealerHand = [cards.pop(), '*'];
    const newUserHand = [cards.pop(), cards.pop()];
    const dealerHandNames = JSON.stringify(newDealerHand.map(card => card.name));
    const userHandNames = JSON.stringify(newUserHand.map(card => card.name));

    setDealerHand(newDealerHand);
    setUserHand(newUserHand);
    console.log('newDealerHand', newDealerHand)
    console.log('newUserHand', newUserHand)
    const response = await fetch('/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dealer_hand: dealerHandNames,
        user_hand: userHandNames,
        result:'In Progress',
        user_id:user.id
      })
    });
    const data = await response.json();
    console.log('startingData',data); // This will log the newly created game object
    setGame(data);
    setGameStart(true);
    setIsGameOver(false);
  }

  async function hit() {
    const newUserHand = [...userHand];
    newUserHand.push(cards.pop());

    // Update the game state to reflect the new card being added to the user's hand
    const userHandNames = JSON.stringify(newUserHand.map(card => card.name));
    const response = await fetch(`/games/${game.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_hand: userHandNames,
        user_id: user.id
      })
    });
    const data = await response.json();
    setGame(data);
    setUserHand(newUserHand);

    if (calculateHandValue(newUserHand) > 21) {
      const result = 'Bust!'
      setGameResult(result);
      console.log('hitUser', user)
      console.log('newUserHandHit', newUserHand)
      setIsGameOver(true);
      const userHandNames = JSON.stringify(newUserHand.map(card => card.name));
      const response = await fetch(`/games/${game.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          result: result,
          user_hand: userHandNames,
          user_id: user.id
        })
      });
      const data = await response.json();
      console.log(data);
    }
  }


  function calculateHandValue(cards) {
    let sum = 0;
    let numAces = 0;
    cards.forEach(card => {
        const value = card.value;
        if (value === 11) {
            numAces++;
          }
          sum += value;
        });
        while (sum > 21 && numAces > 0) {
            sum -= 10;
            numAces--;
          }
          return sum;
        }

  async function stand() {
    const newDealerHand = [...dealerHand];
    newDealerHand[1] = cards.pop(); // reveal the dealer's hidden card
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(cards.pop()); // keep drawing cards until the dealer's hand value is at least 17
    }
    setDealerHand(newDealerHand);
    const userHandValue = calculateHandValue(userHand);
    const dealerHandValue = calculateHandValue(newDealerHand);
    let result;
    if (userHandValue > 21) {
      result = 'You Lost.';
    } else if (dealerHandValue > 21) {
      result = 'You Won!';
    } else if (dealerHandValue > userHandValue) {
      result = 'You Lost.';
    } else if (userHandValue > dealerHandValue) {
      result = 'You Won!';
    } else {
      result = 'Tie!';
    }
    setGameResult(result);
    setIsGameOver(true);
    const dealerHandNames = JSON.stringify(newDealerHand.map(card => card.name));
    const userHandNames = JSON.stringify(userHand.map(card => card.name));
    console.log('standDealerHand', dealerHandNames)
    console.log('standUserHand', userHandNames)
    console.log('game',game)
    const response = await fetch(`/games/${game.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dealer_hand: dealerHandNames,
        result: result,
        user_hand: userHandNames,
        user_id: user.id
      })
    });
      const data = await response.json();
      console.log(data);
        }

  return (
    <>

        <Wrapper>
          {gameStart ? (
            <Box>
            {/* <Button onClick={() => {
            startNewGame();
            setGameStart(true);
          }}>Start new game</Button> */}
            <h3>Dealer: </h3>
            <p>
              {dealerHand.map((card, index) => (
                <img
                  key={index}
                  src={card.image ? card.image : backCard}
                  alt={`${card.value} of ${card.suit}`}
                />
              ))}
            </p>
            <h3>{user.username}: </h3>
            <p>
              {userHand.map((card, index) => (
                <img
                  key={index}
                  src={card.image ? card.image : backCard}
                  alt={`${card.value} of ${card.suit}`}
                />
              ))}
            </p>
            {isGameOver ? (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <h1>{gameResult}</h1>
    <Button onClick={() => {
      startNewGame();
      setGameStart(true);
    }}>Start new game</Button>
  </div>
) : (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ marginRight: "20px" }}>
      <Button onClick={hit}>Hit</Button>
    </div>
    <div style={{ marginLeft: "20px" }}>
      <Button onClick={stand}>Stand</Button>
    </div>
  </div>
)}

            </Box>
      ) : (
        <Box style ={{marginTop:"50px"}}>
          <Button onClick={() => {
            startNewGame();
            setGameStart(true);
          }}>Start new game</Button>
        </Box>
      )}
    </Wrapper>
  </>
  );
}

const Wrapper = styled.section`
  max-width: 100%;
  margin: 40px auto;
  transform: translate(0, 4.5%);
  `;

export default Blackjack;
