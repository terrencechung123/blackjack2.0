import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";

function GameHistory() {
  const [games, setGames] = useState([]);


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

  // function handleUpdateGame(newGame){
  //   setGames(games => [...games, newGame])
  // }

  // async function updateGame(){
  //   const updateData = {
  //     result: formData.result,
  //     card_id: formData.card_id,
  //     user_id: formData.user_id
  //   }
  // }






  return (

    <Wrapper>
    <h1 style={{ fontSize: "2rem", fontFamily: "'Press Start 2P', cursive" }}>Games</h1>
      {games.length > 0 ? (
        games.map((game) => (
          <Game key={game.id}>
            <Box>
              <h2>{"Game "+game.id}</h2>
              <h3>{"User: "+game.user.username}</h3>
              <h3>{"Dealer Hand: "+game.dealer_hand}</h3>
              <h3>{"User Hand: "+game.user_hand}</h3>
              <h3>{"Result: "+game.result}</h3>
              <Button onClick={() => handleDeleteGame(game.id)} style={{marginRight: "10px", backgroundColor: "#4E79D4", color: "white"}}>
                Delete game
              </Button>
              {/* <Button as={Link} to={`/update/${game.id}/edit`}>
                Update Game
              </Button> */}
            </Box>
          </Game>
        ))
      ) : (
        <>
          <h3>No Games Found</h3>
          <Button as={Link} to="/blackjack">
          Go To Game Page
          </Button>
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