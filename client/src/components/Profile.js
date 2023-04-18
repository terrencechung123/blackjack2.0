import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";

const Profile = ({user}) => {
    console.log(user);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      fetch(`/users/${user.id}`)
        .then((response) => response.json())
        .then((data) => setUserData(data));
    }, [user]);
console.log('userData',userData)
  return (
    <Wrapper>
        <h1 style={{marginTop: "50px", fontSize: "2rem", fontFamily: "'Press Start 2P', cursive" }}>
          Hello, {user.username}
        </h1>
          {userData ? (
          <>
            <h2>Current Funds: ${userData.funds}</h2>
            <h2>Current Bet Amount: ${userData.betAmount}</h2>
            <h2>Amount of Games Played: {userData.games.length}</h2>
            <h2>Wins: {userData.games.filter((game) => game.result === "You Won!").length}, Losses: {userData.games.filter((game) => game.result === "You Lost!" || game.result ===
              "Bust!").length}, Ties: {userData.games.filter((game) => game.result === "Tie!").length} </h2>
          </>
        ) : (
          <p>Loading...</p>
        )}
    </Wrapper>
  )
}

const Wrapper = styled.section`
    color: white;
    max-width: 800px;
    margin: 40px auto;
    transform: translate(0, 3%);
`;

export default Profile