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

function findCardIndex(deck, card) {
  return deck.findIndex((c) => c.name === card.name);
}

function removeCard(deck, card) {
  const index = findCardIndex(deck, card);
  if (index !== -1) {
    deck.splice(index, 1);
    deck.unshift(card);
  }
}

function hit(deck, newDealerHand, userHand) {
  const shuffledDeck = shuffleArray(deck);
  [...newDealerHand, ...userHand].forEach((card) => {
    removeCard(shuffledDeck, card);
  });
  const newUserHand = [...userHand];

  function isCardAlreadyDealt(card) {
    return newDealerHand.concat(userHand, newUserHand).some((existingCard) => existingCard.name === card.name);
  }

  let newCard;
  do {
    newCard = shuffledDeck.pop();
  } while (isCardAlreadyDealt(newCard));
  newUserHand.push(newCard);
  return newUserHand;
}

function Blackjack({ user }) {
  const [cards, setCards] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [userHand, setUserHand] = useState([]);
  // const [gameStart, setGameStart] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [isGameOver, setIsGameOver] = useState(true);
  const [game, setGame] = useState([]);
  const [betAmount, setBetAmount] = useState(0);
  const [funds, setFunds] = useState(1000);
  // const [deck,setDeck] = useState([]);


  useEffect(() => {
    fetch("/cards")
    .then((r) => r.json())
    .then((data) => {
      setCards(shuffleArray(data));
      console.log('hello')
    });
  }, []);

  useEffect(() => {
    fetch(`/games`)
    .then((response) => response.json())
    .then((games) => {
      const game = games
      .filter((game) =>(game.user.id === user.id && game.result === "In Progress"))
      .sort((a, b) => b.createdAt - a.createdAt)
      .pop();
      if (game) {
        // setDeck(JSON.parse(game.deck));
        // setGameStart(game.gameStart);
        setGame(game);
        setDealerHand(JSON.parse(game.dealer_hand));
        setUserHand(JSON.parse(game.user_hand));
        setGameResult(game.result);
        setIsGameOver(game.isGameOver);
      }
    });
    fetch(`/users/${user.id}`)
    .then((response)=>response.json())
    .then((user)=>{
      setBetAmount(user.betAmount);
      setFunds(user.funds);
    })
  }, [user.id]);

  async function updateBetAndFunds(newBet, newFunds){
      await fetch(`/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          betAmount: newBet,
          funds: newFunds
        }),
      });
  }

    async function startNewGame() {
      console.log('hi');
      const deck = shuffleArray([...cards]);
      // Remove the cards that have already been dealt in the current game
    const newDealerHand = [deck.pop(), "*"];
    const newUserHand = [deck.pop(), deck.pop()];
    const dealerHandNames = JSON.stringify(newDealerHand.map((card) => card));
    const userHandNames = JSON.stringify(newUserHand.map((card) => card));
    setDealerHand(newDealerHand);
    setUserHand(newUserHand);
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
        // gameStart: true,
        // deck: JSON.stringify(deck)
      }),
    });
    const data = await response.json(); // This will log the newly created game object
    setGame(data);
    // if (gameStart===false){
      // setGameStart(true);
      // window.location.reload()}
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
    const deck = shuffleArray([...cards]);
    [...dealerHand, ...userHand].forEach((card) => {
      const index = deck.findIndex((c) => c.code === card.code);
      if (index !== -1) {
        deck.splice(index, 1);
      }
    });

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
      await fetch(`/games/${game.id}`, {
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
        updateBetAndFunds(0,funds+3*betAmount)
        setFunds(funds + 3 * betAmount);
        setBetAmount(0);
        newFunds = funds + 3 * betAmount
      } else if (dealerHandValue > userHandValue) {
        result = "You Lost!";
        setBetAmount(0);
        updateBetAndFunds(0)
      } else if (userHandValue > dealerHandValue) {
        result = "You Won!";
        updateBetAndFunds(0,funds+3*betAmount)
        setFunds(funds + 3 * betAmount);
        setBetAmount(0);
        newFunds = funds + 3 * betAmount
      } else {
        result = "Tie!";
        updateBetAndFunds(0,funds+betAmount)
        setFunds(funds + betAmount);
        newFunds = funds + betAmount
        setBetAmount(0);
      }
      setGameResult(result);
      // betResult(result);
      setIsGameOver(true);
      const dealerHandNames = JSON.stringify(newDealerHand.map((card) => card));
      const userHandNames = JSON.stringify(newUserHand.map((card) => card));
      await fetch(`/games/${game.id}`, {
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
          // gameStart:true,
          // betAmount:0,
          funds: newFunds
        }),
      });
    }
  }

  async function handleHit() {
    //This modified code will keep drawing a new card from the deck until it finds one that is not already in any of the hands.
    // const deck = shuffleArray([...cards]);
    // [...dealerHand, ...userHand].forEach((card) => {
    //   const index = deck.findIndex((c) => c.name === card.name);
    //   if (index !== -1) {
    //     deck.splice(index, 1);
    //   }
    // });
    console.log('userHand',userHand)
    console.log('dealerHand',dealerHand)
    const deck = [...cards]
    const newDealerHand = [...dealerHand]
    const newUserHand = hit(deck,newDealerHand,userHand)
    // const userHandNames = JSON.stringify(newUserHand.map((card) => card));
    // const response = await fetch(`/games/${game.id}`, {
    //     method: "PATCH",
    //     headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //           user_hand: userHandNames,
    //           user_id: user.id,
    //           // deck: JSON.stringify(deck)
    //         }),
    //       });
          // setUserHand(newUserHand);
          // const data = await response.json();
          // setGame(data);
          updateGame(newUserHand, game.id, user.id);
          if (calculateHandValue(newUserHand) > 21) {
            // const result = "Bust!";
            setGameResult("Bust!");
            betResult("Bust!");
            setIsGameOver(true);
            setUserHand(newUserHand)
            const userHandNames = JSON.stringify(newUserHand.map((card) => card));
            await fetch(`/games/${game.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                result: "Bust!",
                user_hand: userHandNames,
                user_id: user.id,
                // betAmount: 0,
                // funds:'',
                isGameOver: true,
                // deck: JSON.stringify(deck)
              }),
            });
          }
          else{
            setUserHand(newUserHand);
          }
  }

  async function updateGame(userHand, gameId, userId) {
    const userHandNames = JSON.stringify(userHand.map((card) => card));
    const response = await fetch(`/games/${gameId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_hand: userHandNames,
        user_id: userId,
      }),
    });
    const data = await response.json();
    return data;
  }

  async function stand() {
    const deck = shuffleArray([...cards]);
    [...dealerHand, ...userHand].forEach((card) => {
      const index = deck.findIndex((c) => c.code === card.code);
      if (index !== -1) {
        deck.splice(index, 1);
      }
    });
    const newDealerHand = [...dealerHand];
    newDealerHand[1] = deck.pop(); // reveal the dealer's hidden card
    while (calculateHandValue(newDealerHand) < 17) {
      [newDealerHand, ...userHand].forEach((card) => {
        const index = deck.findIndex((c) => c.code === card.code);
        if (index !== -1) {
          deck.splice(index, 1);
        }
      });
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
    await fetch(`/games/${game.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dealer_hand: dealerHandNames,
        result: result,
        user_hand: userHandNames,
        user_id: user.id,
        // gameStart: true,
        isGameOver: true,
        // betAmount: 0,
        funds:newFunds
      }),
    });
  }

  async function betResult(result) {
    if (result === "You Lost!") {
      setBetAmount(0);
      updateBetAndFunds(0)
    } else if (result === "You Won!") {
      setFunds(funds + 2 * betAmount);
      updateBetAndFunds(0,funds+2*betAmount)
      setBetAmount(0);
    } else if (result === "Tie!") {
      setFunds(funds + betAmount);
      updateBetAndFunds(0,funds+betAmount)
      setBetAmount(0);
    } else {
      updateBetAndFunds(0)
      setBetAmount(0);
    }
  }

  //betting buttons
  async function bet20() {
    if (funds >= 20) {
      updateBetAndFunds(betAmount+20,funds-20)
      setBetAmount(betAmount + 20);
      setFunds(funds - 20);
    }
  }

  async function bet50() {
    if (funds >= 50) {
      updateBetAndFunds(betAmount+50,funds-50)
      setBetAmount(betAmount + 50);
      setFunds(funds - 50);
    }
  }

  async function bet100() {
    if (funds >= 100) {
      updateBetAndFunds(betAmount+100,funds-100)
      setBetAmount(betAmount + 100);
      setFunds(funds - 100);
    }
  }

  async function betAllIn() {
    updateBetAndFunds(betAmount+funds,0)
    setBetAmount(betAmount + funds);
    setFunds(0);
  }

  async function betReset() {
    updateBetAndFunds(0,funds+betAmount)
    setFunds(funds + betAmount);
    setBetAmount(0);
  }


  async function resetFunds(){
    if(window.confirm("Are you sure you want to reset your funds?")){
      updateBetAndFunds(0,1000)
      setBetAmount(0)
      setFunds(1000)
    }
  }

  return (
    <>
          <h1 style={{ marginTop: "100px", color: "white" }}>
        Bet Amount: ${betAmount}
      </h1>
      <h1 style={{ color: "white" }}>Funds: ${funds}</h1>
      <Wrapper style={{marginTop:"-70px"}}>
          <Box>
            <h1>Dealer: </h1>
            <p>
              {dealerHand.map((card, index) => (
                <img
                  key={index}
                  src={(card.image) ? card.image : backCard}
                  alt={card.name}
                />
              ))}
            </p>
            {isGameOver ? (
              <div>
                <h3>
                  {isNaN(calculateHandValue(dealerHand))||(calculateHandValue(dealerHand)===0)
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
                      marginBottom: "30px",
                      marginTop: "10px",
                      fontSize: "36px",
                    }}
                  >
                    {gameResult? gameResult+" Play Again?":null}
                  </h1>
                  <div style={{ marginBottom: "50px" }}>
                    <button
                      id="arcade-button"
                      onClick={() => {
                        startNewGame();
                        // setGameStart(true);
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
                      // marginBottom: "50px",
                      marginTop: "15px",
                    }}
                  >
                    <div style={{ marginRight: "40px" }}>
                      <Button onClick={betReset}>Reset Bet Amount</Button>
                    </div>
                    <div style={{ marginLeft: "40px" }}>
                      <Button onClick={resetFunds}>Reset Funds</Button>
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
                    marginTop: "40px",
                  }}
                >
                  <div style={{ marginBottom: "40px" }}>
                    <button id="arcade-button" onClick={handleHit}>
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
                  src={card.image}
                  alt={card.name}
                />
              ))}
            </p>
            <h3>{(calculateHandValue(dealerHand)===0)?null:"Hand Value: "+calculateHandValue(userHand)}</h3>
          </Box>
      </Wrapper>
      {/* <h1 style={{ marginTop: "60px", color: "white" }}>
        Bet Amount: ${betAmount}
      </h1>
      <h1 style={{ color: "white" }}>Funds: ${funds}</h1> */}
    </>
  );
}

const Wrapper = styled.section`
  max-width: 100vw;
  /* height:100vh; */
  /* height:100vh; */
  margin: 60px auto;
  margin-top: -60px;
  transform: translate(0,4.5%);
  
`;

export default Blackjack;
