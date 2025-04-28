import { io } from "socket.io-client"; // import connection function

const socket = io('https://comebackend-1.onrender.com'); // initialize websocket connection

export default socket;