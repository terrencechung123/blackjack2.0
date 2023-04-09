import React, { useEffect, useState } from 'react';
import styled from "styled-components";
// import { useParams} from "react-router-dom";
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
  const [gameResult, setGameResult] = useState('In Progress');
  const [isGameOver, setIsGameOver] = useState(false);
  const [game, setGame] = useState([])

  const loadGameStateFromLocalStorage = () => {
    const gameState = JSON.parse(localStorage.getItem('blackjack-game')) || {
      cards: [],
      dealerHand: [],
      userHand: [],
      gameStart: false,
      gameResult: 'In Progress',
    };

    setCards(gameState.cards);
    setDealerHand(gameState.dealerHand);
    setUserHand(gameState.userHand);
    setGameStart(gameState.gameStart !== undefined ? gameState.gameStart : !!gameState.userHand.length);
    setGameResult(gameState.gameResult);
  };

  // Call the loadGameStateFromLocalStorage function whenever the component mounts
  useEffect(() => {
    loadGameStateFromLocalStorage();
  }, []);

  // Save the game state to localStorage whenever it changes
  useEffect(() => {
    const gameState = {
      cards,
      dealerHand,
      userHand,
      gameStart,
      gameResult,
    };
    localStorage.setItem('blackjack-game', JSON.stringify(gameState));
  }, [cards, dealerHand, userHand, gameStart, gameResult]);


  useEffect(() => {
    fetch("/cards")
    .then((r) => r.json())
    .then((data) => {
      setCards(shuffleArray(data));
      // setGameStart(false);
    });
  }, []);


  console.log("deck",cards)
  console.log("dealerHand",dealerHand);
  console.log("userHand",userHand);
  console.log("gameStart",gameStart);

  async function startNewGame() {
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
    setUserHand(newUserHand);
    if (calculateHandValue(newUserHand) > 21) {
      setIsGameOver(true);
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
      result = 'Tie';
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
            <p>
              Dealer:{" "}
              {dealerHand.map((card, index) => (
                <img
                  key={index}
                  src={card.image ? card.image : backCard}
                  alt={`${card.value} of ${card.suit}`}
                />
              ))}
            </p>
            <p>
              User:{" "}
              {userHand.map((card, index) => (
                <img
                  key={index}
                  src={card.image ? card.image : backCard}
                  alt={`${card.value} of ${card.suit}`}
                />
              ))}
            </p>
            {isGameOver ? (
              <>
              <h1>{gameResult}</h1>
              </>
            ) : (
              <>
            <Button onClick={hit}>Hit</Button>
            <Button onClick={stand}>Stand</Button>

              </>
            )}
            <Button onClick={() => {
            startNewGame();
            setGameStart(true);
          }}>Start new game</Button>
            </Box>
      ) : (
        <Box>
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
  max-width: 800px;
  margin: 40px auto;
  transform: translate(0, 4.5%);
  `;

export default Blackjack;


// useEffect(()=>{

  //   fetch('/games', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
      //           user_id: user.id,
      //           dealer_hand: dealerHand,
      //           user_hand: userHand,
      //         })
      //       });
      // },[]);



      // async function hit() {
        //   const newUserHand = [...userHand];
        //   newUserHand.push(cards.pop());
        //   setUserHand(newUserHand);
        //   if (calculateHandValue(newUserHand) > 21) {
          //     setIsGameOver(true);
          //   }
          //   await fetch('/games', {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ user_hand:newUserHand })
            //   });
            // }

            // async function stand() {
              //   const newDealerHand = [...dealerHand];
              //   newDealerHand[1] = cards.pop(); // reveal the second card
              //   while (calculateHandValue(newDealerHand) < 17) {
                //     newDealerHand.push(cards.pop());
                //   }
                //   setDealerHand(newDealerHand);
                //   setIsGameOver(true);
                // }
                //   await fetch('/cards', {
                  //     method: 'PUT',
                  //     headers: { 'Content-Type': 'application/json' },
                  //     body: JSON.stringify({ cards })
                  //   });

                  // function calculateHandValue(cards) {
                    //   let sum = 0;
                    //   let numAces = 0;
                    //   cards.forEach(card => {
                      //     const value = card.value;
                      //     if (value === 11) {
                        //       numAces++;
                        //     }
                        //     sum += value;
                        //   });
                        //   while (sum > 21 && numAces > 0) {
                          //     sum -= 10;
                          //     numAces--;
                          //   }
                          //   return sum;
                          // }

                          // function getGameResult() {
                            //   const userValue = calculateHandValue(userHand);
                            //   const dealerValue = calculateHandValue(dealerHand);

                            //   if (isGameOver) {
                              //     if (userValue > 21) {
                                //       return 'You went over 21. You lose.';
                                //     } else if (dealerValue > 21) {
                                  //       return 'Dealer went over 21. You win!';
                                  //     } else if (userValue > dealerValue) {
                                    //       return 'You win!';
                                    //     } else if (dealerValue > userValue) {
                                      //       return 'You lose.';
                                      //     } else {
                                        //       return 'It\'s a tie!';
                                        //     }
                                        //   }
                                        // }


                                        // return (
                                          // <Wrapper>
                                          //   <h1>Hello</h1>
                                          // </Wrapper>
                                          //   <Wrapper>
                                          //     {isGameOver ? (
                                            //       <Box>
                                            //         <p>Dealer: {dealerHand.join(', ')}</p>
                                            //         <p>User: {userHand.join(', ')}</p>
                                            //         {/* <p>Sum of user's cards: {calculateHandValue(userHand)}</p> */}
                                            //         {/* <p>{getGameResult()}</p> */}
                                            //         {/* <Button onClick={getCards}>Deal again</Button> */}
                                            //       </Box>
                                            //     ) : (
                                              //       <Box>
                                              //         <p>Dealer: {dealerHand[0]} _</p>
                                              //         <p>User: {userHand.join(', ')}</p>
                                              //         {/* <p>Sum of user's cards: {calculateHandValue(userHand)}</p> */}
                                              //         {/* <Button onClick={hit}>Hit</Button>
                                            //         <Button onClick={stand}>Stand</Button> */}
                                            //       </Box>
                                            //     )}
                                            //     {/* <p>Remaining cards: {cards.length}</p> */}
                                            //   </Wrapper>
                                            // );
                                            /* {isGameOver ? (
                                              <Box> */
                                                /* <p>{gameResult}</p> */
                                                /* <Button onClick={getCards}>Deal again</Button> */
                                              /* </Box>
                                            ) : (
                                              <Box>
                                                <p>Dealer: {dealerHand[0]} _</p>
                                                <p>User: {userHand.join(', ')}</p> */
                                                /* <Button onClick={hit}>Hit</Button>
                                                <Button onClick={stand}>Stand</Button> */
                                              /* </Box>
                                            )} */