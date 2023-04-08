// import React, { useState, useEffect } from "react";
// import { Route, Switch } from "react-router-dom";

// import Login from "./Login.js";
// import Blackjack from "./Blackjack.js";
// import NavBar from "./NavBar.js";
// // import Home from "./Home.js";
// import UserList from "./UserList.js";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const fetchUser = () =>
//   fetch("/authorized").then((res) => {
//     if (res.ok) {
//       res.json().then((data) => {
//         setUser(data);
//       });
//     } else {
//       setUser(null);
//     }
//   });
  
// //   const handleLogin = (user) => {
// //     setUser(user);
// //     history.push('/tickets');
// // };
  
//   // if (!user) return <Login onLogin={handleLogin} />;

//   return (
//     <>
//       <NavBar user={user} setUser={setUser}></NavBar>
//       <div className="body">
//         <Switch>
//           {/* <Route path="/" exact>
//             <Home user={user} />
//           </Route> */}
//           <Route path="/login" exact>
//             <Login setUser={setUser} />
//           </Route>
//           <Route path="/users" exact>
//             <UserList user={user} />
//           </Route>
//           <Route path="" exact>
//             <Blackjack user={user} />
//           </Route>
//         </Switch>
//       </div>
//     </>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import NavBar from "./NavBar";
import Login from "./Login";
import Blackjack from "./Blackjack";
import styled from "styled-components";
import Profile from "./Profile";
import GameHistory from "./GameHistory";

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
            <GameHistory/>
          </Route>
          <Route path="/blackjack">
            <Blackjack user={user}/>
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

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100%;
  width: 100vw;
`;



export default App;