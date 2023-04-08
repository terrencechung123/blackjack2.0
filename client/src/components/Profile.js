import React from 'react'
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Button } from "../styles";

const Profile = ({user}) => {
    console.log(user);

  return (
    <Wrapper>
        <h1>Hello, {user.username}</h1>
    </Wrapper>
  )
}

const Wrapper = styled.section`
    max-width: 800px;
    margin: 40px auto;
    transform: translate(0, 3%);
`;

export default Profile