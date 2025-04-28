import { useEffect, useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Game from "./Game";
import InitGame from "./InitGame";
import socket from "./socket";
import Nav from "./Nav";
import { Stack } from "@mui/material";

export default function Homepage({username}) {
  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players,setPlayers] = useState([])
  const [is2Players, setIs2Players] = useState(false);
  const [time,setTime] = useState(0)

  // resets the states responsible for initializing a game
  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setIs2Players(false)
  }, []);

  useEffect(() => {
    // const username = prompt("Username");
    // setUsername(username);
    // socket.emit("username", username);

    socket.on("opponentJoined", (roomData) => {
      console.log("roomData", roomData)
      setIs2Players(true)
      setPlayers(roomData.players);
    });
  }, []);

  return (
    <Stack>
      <Nav username={username}/>
      {is2Players ? (
        <Game
          room={room}
          players={players}
          orientation={orientation}
          // the cleanup function will be used by Game to reset the state when a game is over
          cleanup={cleanup}
          time={time}
        />
      ) : (
        <InitGame
          setRoom={setRoom}
          setPlayers={setPlayers}
          setIs2Players={setIs2Players}
          setOrientation={setOrientation}
          setTime={setTime}
        />
      )}
    </Stack>
  );
}








