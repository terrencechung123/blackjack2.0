import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";

function GameHistory({user}) {
  console.log('user',user)
  const [games, setGames] = useState([]);

  const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 24px;
`;

  const GameBox = styled(Box)`
    h2 {
      margin-bottom: 8px;
    }
  `;

  useEffect(() => {
    fetch("/games")
    .then((r) => r.json())
    .then(setGames);
  }, []);


  function handleDeleteGame(id) {
    fetch(`/games/${id}`, {
      method: "DELETE",
    }).then((r) => {
      if (r.ok) {
        setGames((games) =>
        games.filter((game) => game.id !== id)
        );
      }
    });
  }
  const filteredGames = games.filter((game) => game.user.id === user.id);
  const game = filteredGames.map((game)=>game)
  // console.log('game',(JSON.parse(game[0].dealer_hand)).map(card=>card.image))

  function handleDeleteAllGames() {
    const gameIdsToDelete = games
      .filter((game) => game.user.id === user.id)
      .map((game) => game.id);
    gameIdsToDelete.forEach((id) => {
      fetch(`/games/${id}`, {
        method: "DELETE",
      }).then((r) => {
        if (r.ok) {
          setGames((games) =>
            games.filter((game) => game.id !== id)
          );
        }
      });
    });
  }

  
  return (
    <Wrapper>
      <h1
        style={{
          marginTop: "50px",
          fontSize: "3.5rem",
          fontFamily: "'Press Start 2P', cursive",
          color:"white"
        }}
      >
        Games
      </h1>
      <Button
        onClick={() => handleDeleteAllGames()}
        style={{
          marginRight: "10px",
          backgroundColor: "#d12d36",
          color: "white",
          marginTop: "20px",
        }}
      >
        Delete All Games
      </Button>
      {filteredGames.length > 0 ? (
        <Grid>
          {filteredGames.map((game) => (
            <GameBox key={game.id}>
              <h1 style={{fontSize:"35px", textDecoration: "underline"}}>{"Game " + game.id}</h1>
              {/* <h3>{"User: " + game.user.username}</h3> */}
              &nbsp;
              <h1 style={{fontSize:"27px", textDecoration: "underline"}}>Dealer Hand:</h1>
              <h2 style={{color:"black"}}>
                {
                  JSON.parse(game.dealer_hand)
                    .map((card) => card.name)
                    .join(", ")
                }
              </h2>
              &nbsp;
              <h1 style={{textDecoration: "underline"}}>User Hand:</h1>
              <h2 style={{color:"black"}}>
                {
                  JSON.parse(game.user_hand)
                  .map((card) => card.name)
                  .join(", ")
                }
              </h2>
              &nbsp;
              <h1 style={{fontSize:"27px",textDecoration: "underline"}}>Result:</h1>
              <h2 style={{color:"black"}}>{game.result}</h2>
              &nbsp;
              <h1 style={{fontSize:"27px",textDecoration: "underline"}}>Bet Amount:</h1>
              <h2 style={{color:"black"}}>{game.betAmount}</h2>
              &nbsp;
              <h1 style={{fontSize:"27px",textDecoration: "underline"}}>Funds:</h1>
              <h2 style={{color:"black"}}>{game.funds}</h2>
              <Button
                onClick={() => handleDeleteGame(game.id)}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#d12d36",
                  color: "white",
                  marginTop: "20px",
                }}
              >
                Delete game
              </Button>
            </GameBox>
          ))}
        </Grid>
      ) : (
        <>
          <h3>No Games Found</h3>
          <div style={{ marginTop: "20px" }}>
            <Button as={Link} to="/blackjack">
              Go To Game Page
            </Button>
          </div>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 800px;
  margin: 40px auto;
  transform: translate(0, 4.5%);
`;

const Game = styled.article`
  margin-bottom: 24px;
  margin-right: 10px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.2);
`;


export default GameHistory;
