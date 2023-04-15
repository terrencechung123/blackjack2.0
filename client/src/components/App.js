import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "./Login";
import Blackjack from "./Blackjack";
import styled from "styled-components";
import Profile from "./Profile";
import GameHistory from "./GameHistory";
import NewLogIn from "./NewLogIn"

function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // auto-login
    fetch("/authorized").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    history.push('/blackjack');
  };

  if (!user) return <Login onLogin={handleLogin} setUser={setUser} />;

  return (
    <div>
      <NavBar user={user} setUser={setUser} />
      <MainContainer>
        <Switch>
          <Route path="/profile">
            <Profile user={user}/>
          </Route>
          <Route path="/game_history">
            <GameHistory user={user}/>
          </Route>
          <Route path="/blackjack">
            <Blackjack user={user}/>
          </Route>
          <Route path="/newLogin">
            <NewLogIn/>
          </Route>
        </Switch>
      </MainContainer>
    </div>
  );
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00734a;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height:100%;
  width:100%;
  max-height: 100vh;
  max-width: 100vw;
  overflow: auto;
`;



export default App;