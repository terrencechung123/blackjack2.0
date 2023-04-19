import React, { useState, useEffect } from "react";
import styled from "styled-components";

const LeaderBoards = ({ user }) => {
const [users, setUsers] = useState(null);

useEffect(() => {
    fetch(`/users`)
    .then((response) => response.json())
    .then((data) => {
        const sortedData = data.sort((a, b) => b.funds - a.funds);
        setUsers(sortedData);
    });
}, []);

return (
    <Wrapper>
    <h1
        style={{
        textDecoration: "underline",
        marginTop: "50px",
        fontSize: "2rem",
        fontFamily: "'Press Start 2P', cursive",
        color:"white"
        }}
    >
        Leader Board
    </h1>
    {users ? (
        <Table>
        <thead>
            <tr>
            <th>Username</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Win Percentage</th>
            <th>Funds</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) => (
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.games.filter((game) => game.result === "You Won!").length}</td>
                <td>{user.games.filter((game) => game.result === "You Lost!" || game.result ===
            "Bust!").length}</td>
                <td>
                {user.games.filter((game) => game.result === "You Won!").length > 0
                    ? ((user.games.filter((game) => game.result === "You Won!").length / (user.games.filter((game) => game.result === "You Won!").length + user.games.filter((game) => game.result === "You Lost!" || game.result ===
            "Bust!").length)) * 100).toFixed(2) +
                    "%"
                    : "0%"}
                </td>
                <td>${user.funds}</td>
            </tr>
            ))}
        </tbody>
        </Table>
    ) : (
        <div>Loading...</div>
    )}
    </Wrapper>
);
};

const Wrapper = styled.section`
color: black;
max-width: 800px;
margin: 40px auto;
transform: translate(0, 3%);
`;

const Table = styled.table`
width: 100%;
border-collapse: collapse;
margin-top: 30px;

th,
td {
    padding: 10px;
    text-align: center;
}

th {
    background-color: #4caf50;
    color: white;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

tr:hover {
    background-color: #ddd;
}
`;

export default LeaderBoards;