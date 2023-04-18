import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Button } from "../styles";
const backCard = "https://deckofcardsapi.com/static/img/back.png";
// import style from './index.css'
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
  const [gameResult, setGameResult] = useState("");
  const [isGameOver, setIsGameOver] = useState(true);
  const [game, setGame] = useState([]);
  const [games, setGames] = useState([]);
  const [betAmount, setBetAmount] = useState(0);
  const [funds, setFunds] = useState(1000);
  const [deck,setDeck] = useState([]);

  
  useEffect(() => {
    fetch("/cards")
    .then((r) => r.json())
    .then((data) => {
      setCards(data);
      console.log('hello')
    });
  }, []);
  // console.log(cards)
  
  useEffect(() => {
    fetch(`/games`)
    .then((response) => response.json())
    .then((games) => {
      const game = games
      .filter((game) => game.user.id === user.id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .pop();
      if (game) {
        setDeck(JSON.parse(game.deck));
        setGameStart(game.gameStart);
        setGame(game);
        setDealerHand(JSON.parse(game.dealer_hand));
        setUserHand(JSON.parse(game.user_hand));
        setGameResult(game.result);
        setIsGameOver(game.isGameOver);
        // setBetAmount(game.betAmount);
        // setFunds(game.funds);
      }

      console.log("game", game);
      // console.log(
      //   "gamesResult",
      //   games.filter((game) => game.result)
      //   );
      });
      fetch(`/users/${user.id}`)
      .then((response)=>response.json())
      .then((user)=>{
        setBetAmount(user.betAmount);
        setFunds(user.funds);
      })
    }, []);

    useEffect(()=>{
      fetch(`/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betAmount: betAmount,
          funds: funds
        }),
      })
    }, [betAmount, funds]);

    async function startNewGame() {
      console.log('hi');
      const deck = shuffleArray([...cards]);
      // Remove the cards that have already been dealt in the current game
      [...dealerHand, ...userHand].forEach((card) => {
        const index = deck.findIndex((c) => c.code === card.code);
      if (index !== -1) {
        deck.splice(index, 1);
      }
    });
    const newDealerHand = [deck.pop(), "*"];
    const newUserHand = [deck.pop(), deck.pop()];
    const dealerHandNames = JSON.stringify(newDealerHand.map((card) => card));
    const userHandNames = JSON.stringify(newUserHand.map((card) => card));
    setDealerHand(newDealerHand);
    setUserHand(newUserHand);
    setGameStart(true);
    setIsGameOver(false);
    const response = await fetch("/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealer_hand: dealerHandNames,
        user_hand: userHandNames,
        result: "In Progress",
        user_id: user.id,
        isGameOver: false,
        betAmount,
        funds,
        gameStart: true,
        deck: JSON.stringify(deck)
      }),
    });
    const data = await response.json(); // This will log the newly created game object
    setGame(data);
  }

  function calculateHandValue(cards) {
    let sum = 0;
    let numAces = 0;
    cards.forEach((card) => {
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

  async function doubleDown() {
    const newUserHand = [...userHand];
    newUserHand.push(deck.pop());
    const userHandValue = calculateHandValue(newUserHand);
    let result;
    let newFunds;
    if (userHandValue > 21) {
      result = "Bust!";
      setFunds(funds - betAmount);
      setBetAmount(0);
      setGameResult(result);
      newFunds = funds - betAmount
      // betResult(result);
      setIsGameOver(true);
      const userHandNames = JSON.stringify(newUserHand.map((card) => card));
      const response = await fetch(`/games/${game.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // dealer_hand: dealerHandNames,
          result: result,
          user_hand: userHandNames,
          user_id: user.id,
          isGameOver: true,
          // betAmount: 0,
          funds: newFunds
        }),
      });
    } else {
      const newDealerHand = [...dealerHand];
      newDealerHand[1] = deck.pop(); // reveal the dealer's hidden card
      while (calculateHandValue(newDealerHand) < 17) {
        newDealerHand.push(deck.pop()); // keep drawing cards until the dealer's hand value is at least 17
      }
      setDealerHand(newDealerHand);
      setUserHand(newUserHand);
      const dealerHandValue = calculateHandValue(newDealerHand);
      if (dealerHandValue > 21) {
        result = "You Won!";
        setFunds(funds + 3 * betAmount);
        setBetAmount(0);
        newFunds = funds + 3 * betAmount
      } else if (dealerHandValue > userHandValue) {
        result = "You Lost!";
        setFunds(funds - betAmount);
        setBetAmount(0);
        newFunds = funds - betAmount
      } else if (userHandValue > dealerHandValue) {
        result = "You Won!";
        setFunds(funds + 3 * betAmount);
        setBetAmount(0);
        newFunds = funds + 3 * betAmount
      } else {
        result = "Tie!";
        setFunds(funds + betAmount);
        setBetAmount(0);
        newFunds = funds + betAmount
      }
      setGameResult(result);
      // betResult(result);
      setIsGameOver(true);
      const dealerHandNames = JSON.stringify(newDealerHand.map((card) => card));
      const userHandNames = JSON.stringify(newUserHand.map((card) => card));
      const response = await fetch(`/games/${game.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealer_hand: dealerHandNames,
          result: result,
          user_hand: userHandNames,
          user_id: user.id,
          isGameOver: true,
          gameStart:true,
          // betAmount:0,
          funds: newFunds
        }),
      });
    }
  }

  async function hit() {
    const newUserHand = [...userHand];
    newUserHand.push(deck.pop());
    // Update the game state to reflect the new card being added to the user's hand
    const userHandNames = JSON.stringify(newUserHand.map((card) => card));
    const response = await fetch(`/games/${game.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_hand: userHandNames,
        user_id: user.id,
        deck: JSON.stringify(deck)
      }),
    });
    const data = await response.json();
    setGame(data);
    setUserHand(newUserHand);
    if (calculateHandValue(newUserHand) > 21) {
      const result = "Bust!";
      betResult(result);
      const userHandNames = JSON.stringify(newUserHand.map((card) => card));
      const response = await fetch(`/games/${game.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          result: JSON.stringify(result),
          user_hand: userHandNames,
          user_id: user.id,
          // betAmount: 0,
          // funds:'',
          isGameOver: true,
          deck: JSON.stringify(deck)
        }),
      });
      setGameResult(result);
      setIsGameOver(true);
    }
  }

  async function stand() {
    const newDealerHand = [...dealerHand];
    newDealerHand[1] = deck.pop(); // reveal the dealer's hidden card
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(deck.pop()); // keep drawing cards until the dealer's hand value is at least 17
    }
    setDealerHand(newDealerHand);
    const userHandValue = calculateHandValue(userHand);
    const dealerHandValue = calculateHandValue(newDealerHand);
    let result;
    let newFunds;
    if (userHandValue > 21) {
      result = "Bust!";
      newFunds = funds
    } else if (dealerHandValue > 21) {
      result = "You Won!";
      newFunds = funds + 2 * betAmount
    } else if (dealerHandValue > userHandValue) {
      result = "You Lost!";
      newFunds = funds
    } else if (userHandValue > dealerHandValue) {
      result = "You Won!";
      newFunds = funds + 2 * betAmount
    } else {
      result = "Tie!";
      newFunds = funds + betAmount
    }
    setGameResult(result);
    await betResult(result);
    setIsGameOver(true);
    const dealerHandNames = JSON.stringify(newDealerHand.map((card) => card));
    const userHandNames = JSON.stringify(userHand.map((card) => card));
    const response = await fetch(`/games/${game.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealer_hand: dealerHandNames,
        result: result,
        user_hand: userHandNames,
        user_id: user.id,
        gameStart: true,
        isGameOver: true,
        // betAmount: 0,
        funds: newFunds,
      }),
    });
  }

  async function betResult(result) {
    if (result == "You Lost!") {
      setBetAmount(0);
    } else if (result == "You Won!") {
      setFunds(funds + 2 * betAmount);
      setBetAmount(0);

    } else if (result == "Tie!") {
      setFunds(funds + betAmount);
      setBetAmount(0);
    } else {
      setBetAmount(0);
    }
  }

  //betting buttons
  async function bet20() {
    if (funds >= 20) {
      setBetAmount(betAmount + 20);
      setFunds(funds - 20);
    }
  }

  async function bet50() {
    if (funds >= 50) {
      setBetAmount(betAmount + 50);
      setFunds(funds - 50);
    }
  }

  async function bet100() {
    if (funds >= 100) {
      setBetAmount(betAmount + 100);
      setFunds(funds - 100);
    }
  }

  async function betAllIn() {
    setBetAmount(betAmount + funds);
    setFunds(0);
  }

  async function betReset() {
    setFunds(funds + betAmount);
    setBetAmount(0);
  }

  async function addFunds() {
    setFunds(funds + 100);
  }

  async function takeFunds() {
    if (funds >= 100) {
      setFunds(funds - 100);
    }
  }



  return (
    <>
      <Wrapper>
        {gameStart ? (
          <Box>
            <h1>Dealer: </h1>
            <p>
              {dealerHand.map((card, index) => (
                <img
                  key={index}
                  src={card.image ? card.image : backCard}
                  alt={`${card.value} of ${card.suit}`}
                />
              ))}
            </p>
            {isGameOver ? (
              <div>
                <h3>
                  {isNaN(calculateHandValue(dealerHand))
                    ? ""
                    : "Hand Value: " + calculateHandValue(dealerHand)}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <h1
                    style={{
                      marginBottom: "40px",
                      marginTop: "40px",
                      fontSize: "36px",
                    }}
                  >
                    {gameResult} Play Again?
                  </h1>
                  <div style={{ marginBottom: "50px" }}>
                    <button
                      id="arcade-button"
                      onClick={() => {
                        startNewGame();
                        setGameStart(true);
                      }}
                    >
                      Deal Cards
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ marginRight: "40px" }}>
                      <Button onClick={bet20}>Bet $20</Button>
                    </div>
                    <div style={{ marginLeft: "20px" }}>
                      <Button onClick={bet50}>Bet $50</Button>
                    </div>
                    <div style={{ marginLeft: "60px" }}>
                      <Button onClick={bet100}>Bet $100</Button>
                    </div>
                    <div style={{ marginLeft: "80px" }}>
                      <Button onClick={betAllIn}>All In</Button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "50px",
                      marginTop: "20px",
                    }}
                  >
                    <div style={{ marginRight: "40px" }}>
                      <Button onClick={betReset}>Reset Bet Amount</Button>
                    </div>
                    <div style={{ marginLeft: "40px" }}>
                      <Button onClick={addFunds}>Cash In $100</Button>
                    </div>
                    <div style={{ marginLeft: "60px" }}>
                      <Button onClick={takeFunds}>Cash Out $100</Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "50px",
                  }}
                >
                  <div style={{ marginBottom: "40px" }}>
                    <button id="arcade-button" onClick={hit}>
                      Hit
                    </button>
                  </div>
                  <div style={{ marginLeft: "60px" }}>
                    <button id="arcade-button" onClick={stand}>
                      Stand
                    </button>
                  </div>
                  <div style={{ marginLeft: "60px" }}>
                    {calculateHandValue(userHand) <= 11 ? (
                      <button id="arcade-button" onClick={doubleDown}>
                        Double Down
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            <h1>{user.username}: </h1>
            <p>
              {userHand.map((card, index) => (
                <img
                  key={index}
                  src={card.image ? card.image : backCard}
                  alt={`${card.value} of ${card.suit}`}
                />
              ))}
            </p>
            <h3>Hand Value: {calculateHandValue(userHand)}</h3>
          </Box>
        ) : (
          <Box style={{ marginTop: "50px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "50px",
              }}
            >
              <button
                id="arcade-button"
                onClick={() => {
                  startNewGame();
                  setGameStart(true);
                }}
              >
                Deal Cards
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ marginRight: "40px" }}>
                <Button onClick={bet20}>Bet $20</Button>
              </div>
              <div style={{ marginLeft: "20px" }}>
                <Button onClick={bet50}>Bet $50</Button>
              </div>
              <div style={{ marginLeft: "60px" }}>
                <Button onClick={bet100}>Bet $100</Button>
              </div>
              <div style={{ marginLeft: "80px" }}>
                <Button onClick={betAllIn}>All In</Button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "50px",
                marginTop: "20px",
              }}
            >
              <div style={{ marginLeft: "40px" }}>
                <Button onClick={betReset}>Reset Bet Amount</Button>
              </div>
              <div style={{ marginLeft: "40px" }}>
                <Button onClick={addFunds}>Add $100 To Funds</Button>
              </div>
              <div style={{ marginLeft: "60px" }}>
                <Button onClick={takeFunds}>Take $100 From Funds</Button>
              </div>
            </div>
          </Box>
        )}
      </Wrapper>
      <h1 style={{ marginTop: "60px", color: "white" }}>
        Bet Amount: ${betAmount}
      </h1>
      <h1 style={{ color: "white" }}>Funds: ${funds}</h1>
    </>
  );
}

const Wrapper = styled.section`
  max-width: 100%;
  /* height:100vh; */
  margin: 40px auto;
  transform: translate(0, 4.5%);
`;

export default Blackjack;
