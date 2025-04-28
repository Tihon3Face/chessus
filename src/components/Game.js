import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./CustomDialog";
import socket from "./socket";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
  Box,
  Container,
  Grid2,
  Grid,
} from "@mui/material";
import Nav from "./Nav";
import zIndex from "@mui/material/styles/zIndex";

function Game({ players, room, orientation, cleanup, time }) {

  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");

  const [whiteTime,setWhiteTime] = useState(time);
  const [blackTime,setBlackTime] = useState(time);

  useEffect(() => {
    socket.on("timer",(time,side)=>{
      if(side === 'black'){
        setBlackTime(time);
      }else{
        setWhiteTime(time);
      }
    })
  },[])

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render
  
        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            socket.emit('gameover', chess.turn() === orientation[0] ? { roomId: room, reason: "checkmate", winner: chess.turn() === "w" ? "black" : "white" } : { roomId: room })
            // Set message to checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) { // if it is a draw
            socket.emit('gameover', chess.turn() === orientation[0] ? { roomId: room, reason: "draw", winner: "draw" } : { roomId: room })
            setOver("Draw"); // set message to "Draw"
          } else {
            socket.emit('gameover', chess.turn() === orientation[0] ? { roomId: room, reason: "game over", winner: "game over" } : { roomId: room })
            setOver("Game over");
          }
        }
  
        return result;
      } catch (e) {
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {

    // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
    if (chess.turn() !== orientation[0]) return false; // <- 1 prohibit player from moving piece of other player

    if (players.length < 2) return false; // <- 2 disallow a move if the opponent has not joined

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      promotion: "q", // promote to queen where possible
    };

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    socket.emit("move", { // <- 3 emit a move event.
      move,
      room,
    }); // this event will be transmitted to the opponent via the server
    return true;
  } // <- 3

  useEffect(() => {
    socket.on("move", (move) => {
      makeAMove(move); //
    });
  }, []);

  useEffect(() => {
    socket.on('playerDisconnected', (player) => {
      setOver(`${player.username} has disconnected`); // set game over
    });
  }, []);

  useEffect(() => {
    socket.on('closeRoom', ({ roomId }) => {
      if (roomId === room) {
        cleanup();
      }
    });
  }, [room, cleanup]);


  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    const sep = <sep>:</sep>;
  
    if (hours > 0) {
      return (
        <>
          {hours.toString().padStart(2, '0')}
          {sep}
          {minutes.toString().padStart(2, '0')}
          {sep}
          {seconds.toString().padStart(2, '0')}
        </>
      );
    } else {
      return (
        <>
          {minutes.toString().padStart(2, '0')}
          {sep}
          {seconds.toString().padStart(2, '0')}
        </>
      );
    }
  };

  
  // Game component returned jsx
  return (
    <div id="main-wrap" class="is2d">
      {/* <Card>
        <CardContent>
          <Typography variant="h5">Room ID: {room}</Typography>
        </CardContent>
      </Card> */}
      <main class="round boardd">
        <aside class="round__side">
          <div class="game__meta">
            <section>
            <div class="game__meta__infos" data-icon="">
              <div>
                <div class="header">
                  <div class="setup">
                    15+10 • Товарищеская • <span title="Быстрые игры: от 8 до 25 минут">Рапид</span>
                  </div>
                  <time class="timeago set" datetime="2025-04-24T13:30:09.922Z" title="24 апр. 2025 г., 18:30">1 минуту назад</time>
                </div>
              </div>
            </div>
            <div class="game__meta__players">
              <div class="player color-icon is white text"><span class="user-link">Аноним</span></div>
              <div class="player color-icon is black text"><span class="user-link">Аноним</span></div>
            </div>
            </section>
          </div>
          <section class="mchat mchat-optional">
            <div class="mchat__tabs nb_1" role="tablist">
              <div class="mchat__tab discussion mchat__tab-active" role="tab">
                <span>Чат</span>
                <div class="switch">
                  <input id="chat-toggle-FUxw8f4C" class="cmn-toggle cmn-toggle--subtle" type="checkbox" checked=""/>
                  <label for="chat-toggle-FUxw8f4C" title="Показывать окно чата"></label>
                </div>
              </div>
            </div>
            <div class="mchat__content discussion">
              <ol class="mchat__messages chat-v-1" role="log" aria-live="polite" aria-atomic="false">
                <li class="system"><t>Takeback sent</t></li>
                <li class="system"><t>Takeback accepted</t></li>
              </ol><input class="mchat__say" placeholder="Войдите, чтобы общаться в чате" disabled=""/>
            </div>
          </section>
        </aside>
        <div class="round__app variant-standard">
          <div class="round__app__board main-board">
            <div class="cg-wrap orientation-black manipulable">
              <Chessboard 
                  position={fen}
                  onPieceDrop={onDrop}
                  boardOrientation={orientation}
                  customBoardStyle={{
                    zIndex: "0"
                  }}
                />
            </div>
          </div>
          <div class="material material-top"></div>
          <div class="round__app__table"></div>
          <div class="ruser-top ruser user-link online"><i class="line" title="Joined the game"></i><name>Аноним</name></div>
          <rm6>
            <rb1>
              <div class="noop"></div>
              <button class="fbt repeatable" data-icon="" data-ply="0"></button>
              <button class="fbt repeatable" data-icon="" data-ply="12"></button>
              <button class="fbt repeatable" disabled="" data-icon="" data-ply="-"></button>
              <button class="fbt repeatable" disabled="" data-icon="" data-ply="-"></button>
              <button class="fbt board-menu-toggle" title="Меню" data-icon=""></button>
            </rb1>
            <l4x>
              <i5z>1</i5z>
              <kwdb class="">e4</kwdb>
              <kwdb class="">c5</kwdb>
              <i5z>2</i5z>
              <kwdb class="">Nc3</kwdb>
              <kwdb class="">d6</kwdb>
              <i5z>3</i5z>
              <kwdb class="">Bc4</kwdb>
              <kwdb class="">Nc6</kwdb>
              <i5z>4</i5z>
              <kwdb class="">a3</kwdb>
              <kwdb class="">Nf6</kwdb>
              <i5z>5</i5z>
              <kwdb class="">d3</kwdb>
              <kwdb class="">g6</kwdb>
              <i5z>6</i5z>
              <kwdb class="">Nf3</kwdb>
              <kwdb class="">Bg7</kwdb>
              <i5z>7</i5z>
              <kwdb class="a1t">Be3</kwdb>
            </l4x>
          </rm6>
          <div class="rcontrols">
            <div class="ricons">
              <button class="fbt takeback-yes" title="Попросить соперника вернуть ход"><span data-icon=""></span></button>
              <button class="fbt draw-yes" title="Предложить ничью"><span data-icon=""></span></button>
              <button class="fbt resign" title="Сдаться"><span data-icon=""></span></button>
              <button class="fbt board-menu-toggle" title="Меню" data-icon=""></button>
            </div>
          </div>
          <div class="ruser-bottom ruser user-link online"><i class="line" title="Joined the game"></i><name>Аноним</name></div>
          <div className="rclock rclock-top rclock-white running">
            <div className="bar"></div>
            <div className="time">
              {
                orientation == 'white' ? formatTime(blackTime) : formatTime(whiteTime)
              }
            </div> 
          </div>
          <div className="rclock rclock-bottom rclock-black">
            <div className="bar"></div>
            <div className="time">
              {
                orientation == 'white' ? formatTime(whiteTime) : formatTime(blackTime)
              }
            </div> 
          </div>
        </div>
        <div class="round__underboard"></div>
        <div class="round__underchat">
          <div class="chat__members none" aria-live="off" aria-relevant="additions removals text" data-watched="1">
            <div class="chat__members__inner">
              <div class="chat__members__number" data-icon="" title="Spectators"></div>
              <div></div>
            </div>
          </div>
        </div>
      </main>
      <CustomDialog // Game Over CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          cleanup();
        }}
        isForm={false}
      />
    </div>
  );
}

export default Game;   



{/* <Card>
        <CardContent>
          <Typography variant="h5">Room ID: {room}</Typography>
        </CardContent>
      </Card> */}
      //         <Chessboard 
      //           position={fen}
      //           onPieceDrop={onDrop}
      //           boardOrientation={orientation}
      //           customBoardStyle={{
      //             zIndex: "0"
      //           }}
      //         />
              
      //         <CustomDialog // Game Over CustomDialog
      //   open={Boolean(over)}
      //   title={over}
      //   contentText={over}
      //   handleContinue={() => {
      //     socket.emit("closeRoom", { roomId: room });
      //     cleanup();
      //   }}
      //   isForm={false}
      // />
      
      
          // <div className="rclock rclock-top rclock-white running">
          //   <div className="bar"></div>
          //   <div className="time">
          //     {
          //       orientation == 'white' ? formatTime(blackTime) : formatTime(whiteTime)
          //     }
          //   </div> 
          // </div>
          // <div className="rclock rclock-bottom rclock-black">
          //   <div className="bar"></div>
          //   <div className="time">
          //     {
          //       orientation == 'white' ? formatTime(whiteTime) : formatTime(blackTime)
          //     }
          //   </div> 
          // </div>





























// import { useState, useMemo, useCallback, useEffect } from "react";
// import { Chessboard } from "react-chessboard";
// import { Chess } from "chess.js";
// import CustomDialog from "./CustomDialog";
// import socket from "./socket";
// import {
//   Card,
//   CardContent,
//   List,
//   ListItem,
//   ListItemText,
//   ListSubheader,
//   Stack,
//   Typography,
//   Box,
//   Container,
//   Grid2,
//   Grid,
// } from "@mui/material";
// import Nav from "./Nav";
// import zIndex from "@mui/material/styles/zIndex";

// function Game({ players, room, orientation, cleanup, time }) {

//   const chess = useMemo(() => new Chess(), []); // <- 1
//   const [fen, setFen] = useState(chess.fen()); // <- 2
//   const [over, setOver] = useState("");

//   const [whiteTime,setWhiteTime] = useState(time);
//   const [blackTime,setBlackTime] = useState(time);

//   useEffect(() => {
//     socket.on("timer",(time,side)=>{
//       if(side === 'black'){
//         setBlackTime(time);
//       }else{
//         setWhiteTime(time);
//       }
//     })
//   },[])

//   const makeAMove = useCallback(
//     (move) => {
//       try {
//         const result = chess.move(move); // update Chess instance
//         setFen(chess.fen()); // update fen state to trigger a re-render
  
//         console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
//         if (chess.isGameOver()) { // check if move led to "game over"
//           if (chess.isCheckmate()) { // if reason for game over is a checkmate
//             socket.emit('gameover', chess.turn() === orientation[0] ? { roomId: room, reason: "checkmate", winner: chess.turn() === "w" ? "black" : "white" } : { roomId: room })
//             // Set message to checkmate. 
//             setOver(
//               `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
//             ); 
//             // The winner is determined by checking which side made the last move
//           } else if (chess.isDraw()) { // if it is a draw
//             socket.emit('gameover', chess.turn() === orientation[0] ? { roomId: room, reason: "draw", winner: "draw" } : { roomId: room })
//             setOver("Draw"); // set message to "Draw"
//           } else {
//             socket.emit('gameover', chess.turn() === orientation[0] ? { roomId: room, reason: "game over", winner: "game over" } : { roomId: room })
//             setOver("Game over");
//           }
//         }
  
//         return result;
//       } catch (e) {
//         return null;
//       } // null if the move was illegal, the move object if the move was legal
//     },
//     [chess]
//   );

//   function onDrop(sourceSquare, targetSquare) {

//     // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
//     if (chess.turn() !== orientation[0]) return false; // <- 1 prohibit player from moving piece of other player

//     if (players.length < 2) return false; // <- 2 disallow a move if the opponent has not joined

//     const moveData = {
//       from: sourceSquare,
//       to: targetSquare,
//       color: chess.turn(),
//       promotion: "q", // promote to queen where possible
//     };

//     const move = makeAMove(moveData);

//     // illegal move
//     if (move === null) return false;

//     socket.emit("move", { // <- 3 emit a move event.
//       move,
//       room,
//     }); // this event will be transmitted to the opponent via the server
//     return true;
//   } // <- 3

//   useEffect(() => {
//     socket.on("move", (move) => {
//       makeAMove(move); //
//     });
//   }, []);

//   useEffect(() => {
//     socket.on('playerDisconnected', (player) => {
//       setOver(`${player.username} has disconnected`); // set game over
//     });
//   }, []);

//   useEffect(() => {
//     socket.on('closeRoom', ({ roomId }) => {
//       if (roomId === room) {
//         cleanup();
//       }
//     });
//   }, [room, cleanup]);


//   const formatTime = (ms) => {
//     const totalSeconds = Math.floor(ms / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
  
//     const sep = <sep>:</sep>;
  
//     if (hours > 0) {
//       return (
//         <>
//           {hours.toString().padStart(2, '0')}
//           {sep}
//           {minutes.toString().padStart(2, '0')}
//           {sep}
//           {seconds.toString().padStart(2, '0')}
//         </>
//       );
//     } else {
//       return (
//         <>
//           {minutes.toString().padStart(2, '0')}
//           {sep}
//           {seconds.toString().padStart(2, '0')}
//         </>
//       );
//     }
//   };

  
//   // Game component returned jsx
//   return (
//     <div id="main-wrap" className="is2d">
//       {/* <Card>
//         <CardContent>
//           <Typography variant="h5">Room ID: {room}</Typography>
//         </CardContent>
//       </Card> */}
//       <main className="round tv-single boardd">
//         <aside className="round__side">
//           <div className="game__meta">
//             <section>
//               <div className="game__meta__infos" data-icon="">
//                 <div className="header">
//                   <div className="setup">
//                     1+0 • Рейтинговая • <span title="Очень быстрые игры: менее 3 минут">Пуля</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="game__meta__players">
//                 <div className="player color-icon is white text">
//                   <a className="user-link ulpt" href="#">nekitka0525<span className="rating"> (2901)</span></a>
//                 </div>
//                 <div className="player color-icon is black text">
//                   <a className="user-link ulpt" href="#"><span className="utitle" title="Grandmaster">GM</span>&nbsp;Ediz_Gurel<span className="rating"> (3235)</span></a>
//                 </div>
//               </div>
//             </section>
//           </div>
//           <aside className="subnav">
//             <nav className="subnav__inner">
//               <a href="#" className="tv-channel best active"><span data-icon=""><span><strong>Top Rated</strong><span className="champion">GM&nbsp;Ediz_Gurel<rating> 3235</rating></span></span></span></a>
//               <a href="#" className="tv-channel bullet"><span data-icon=""><span><strong>Bullet</strong><span className="champion">GM&nbsp;Ediz_Gurel<rating> 3235</rating></span></span></span></a>
//               <a href="#" className="tv-channel blitz"><span data-icon=""><span><strong>Blitz</strong><span className="champion">dimaM666<rating> 2777</rating></span></span></span></a>
//               <a href="#" className="tv-channel rapid"><span data-icon=""><span><strong>Rapid</strong><span className="champion">macalmisu<rating> 2473</rating></span></span></span></a>
//               <a href="#" className="tv-channel classical"><span data-icon=""><span><strong>Classical</strong><span className="champion">estradasilaen15<rating> 1969</rating></span></span></span></a>
//               <a href="#" className="tv-channel chess960"><span data-icon=""><span><strong>Chess960</strong><span className="champion">FM&nbsp;josefghng<rating> 2127</rating></span></span></span></a>
//               <a href="#" className="tv-channel kingOfTheHill"><span data-icon=""><span><strong>King of the Hill</strong><span className="champion">ringscore<rating> 2048</rating></span></span></span></a>
//               <a href="#" className="tv-channel threeCheck"><span data-icon=""><span><strong>Three-check</strong><span className="champion">Kirillok28<rating> 1481</rating></span></span></span></a>
//               <a href="#" className="tv-channel antichess"><span data-icon=""><span><strong>Antichess</strong><span className="champion">MiladLouak0<rating> 2125</rating></span></span></span></a>
//               <a href="#" className="tv-channel atomic"><span data-icon=""><span><strong>Atomic</strong><span className="champion">NM&nbsp;InterstellarOvercoat<rating> 2098</rating></span></span></span></a>
//               <a href="#" className="tv-channel horde"><span data-icon=""><span><strong>Horde</strong><span className="champion">King-of-Horde<rating> 2508</rating></span></span></span></a>
//               <a href="#" className="tv-channel racingKings"><span data-icon=""><span><strong>Racing Kings</strong><span className="champion">peppeagropoli2<rating> 1801</rating></span></span></span></a>
//               <a href="#" className="tv-channel crazyhouse"><span data-icon=""><span><strong>Crazyhouse</strong><span className="champion">dominrus1<rating> 2242</rating></span></span></span></a>
//               <a href="#" className="tv-channel ultraBullet"><span data-icon=""><span><strong>UltraBullet</strong><span className="champion">Podluzan_Prusanky<rating> 2364</rating></span></span></span></a>
//               <a href="#" className="tv-channel bot"><span data-icon=""><span><strong>Bot</strong><span className="champion">BOT&nbsp;KunkkaBot<rating> 3169</rating></span></span></span></a>
//               <a href="#" className="tv-channel computer"><span data-icon=""><span><strong>Computer</strong><span className="champion">ThinkAboutThisMove<rating> 2487</rating></span></span></span></a>
//             </nav>
//           </aside>
//         </aside>
//         <div className="round__app variant-standard">
//           <div className="round__app__board main-board">
//             <div className="cg-wrap orientation-black manipulable">
//               <Chessboard 
//                 position={fen}
//                 onPieceDrop={onDrop}
//                 boardOrientation={orientation}
//                 customBoardStyle={{
//                   zIndex: "0"
//                 }}
//               />
//             </div>
//           </div>
//           <div className="material material-top"><div><mpiece className="bishop"></mpiece></div></div>
//           <div className="round__app__table"></div>
//           <div className="ruser-top ruser user-link online"><i className="line" title="Joined the game"></i><a className="user-link ulpt" href="#" data-pt-pos="s">nekitka0525</a><rating>2901</rating></div>
//           <rm6>
//             <rb1><a className="fbt analysis" title="Анализировать партию" href="#" data-icon=""></a>
//               <button className="fbt repeatable" data-icon="" data-ply="0"></button>
//               <button className="fbt repeatable" data-icon="" data-ply="37"></button>
//               <button className="fbt repeatable" disabled="" data-icon="" data-ply="-"></button>
//               <button className="fbt repeatable" disabled="" data-icon="" data-ply="-"></button>
//               <button className="fbt board-menu-toggle" title="Меню" data-icon=""></button>
//             </rb1>
//             <l4x>
//               <i5z>1</i5z>
//               <kwdb className="">d4</kwdb>
//               <kwdb className="">Nf6</kwdb>
//               <i5z>2</i5z>
//               <kwdb className="">c4</kwdb>
//               <kwdb className="">e5</kwdb>
//               <i5z>3</i5z>
//               <kwdb className="">dxe5</kwdb>
//               <kwdb className="">Ng4</kwdb>
//               <i5z>4</i5z>
//               <kwdb className="">Nf3</kwdb>
//               <kwdb className="">Nc6</kwdb>
//               <i5z>5</i5z>
//               <kwdb className="">Bf4</kwdb>
//               <kwdb className="">Bb4+</kwdb>
//               <i5z>6</i5z>
//               <kwdb className="">Nbd2</kwdb>
//               <kwdb className="">Qe7</kwdb>
//               <i5z>7</i5z>
//               <kwdb className="">e3</kwdb>
//               <kwdb className="">Ngxe5</kwdb>
//               <i5z>8</i5z>
//               <kwdb className="">Nxe5</kwdb>
//               <kwdb className="">Nxe5</kwdb>
//               <i5z>9</i5z>
//               <kwdb className="">Be2</kwdb>
//               <kwdb className="">O-O</kwdb>
//               <i5z>10</i5z>
//               <kwdb className="">O-O</kwdb>
//               <kwdb className="">Bxd2</kwdb>
//               <i5z>11</i5z>
//               <kwdb className="">Qxd2</kwdb>
//               <kwdb className="">d6</kwdb>
//               <i5z>12</i5z>
//               <kwdb className="">h3</kwdb>
//               <kwdb className="">b6</kwdb>
//               <i5z>13</i5z>
//               <kwdb className="">Rac1</kwdb>
//               <kwdb className="">Bb7</kwdb>
//               <i5z>14</i5z>
//               <kwdb className="">b4</kwdb>
//               <kwdb className="">a5</kwdb>
//               <i5z>15</i5z>
//               <kwdb className="">a3</kwdb>
//               <kwdb className="">axb4</kwdb>
//               <i5z>16</i5z>
//               <kwdb className="">axb4</kwdb>
//               <kwdb className="">Rfe8</kwdb>
//               <i5z>17</i5z>
//               <kwdb className="">c5</kwdb>
//               <kwdb className="">bxc5</kwdb>
//               <i5z>18</i5z>
//               <kwdb className="">bxc5</kwdb>
//               <kwdb className="">dxc5</kwdb>
//               <i5z>19</i5z>
//               <kwdb className="">Qc3</kwdb>
//               <kwdb className="a1t">Ng6</kwdb>
//             </l4x>
//           </rm6>
//           <div className="ruser-bottom ruser user-link online">
//             <i className="line" title="Joined the game"></i>
//             <a className="user-link" href="#" data-pt-pos="s"><span className="utitle">GM&nbsp;</span>Ediz_Gurel</a>
//             <rating>3235</rating>
//           </div>
//           <div className="rclock rclock-top rclock-white running">
//             <div className="bar"></div>
//             <div className="time">
//               {
//                 orientation == 'white' ? formatTime(blackTime) : formatTime(whiteTime)
//               }
//             </div> 
//           </div>
//           <div className="rclock rclock-bottom rclock-black">
//             <div className="bar"></div>
//             <div className="time">
//               {
//                 orientation == 'white' ? formatTime(whiteTime) : formatTime(blackTime)
//               }
//             </div> 
//           </div>
//           <div className="material material-bottom"><div><mpiece className="knight"></mpiece></div><div><mpiece className="pawn"></mpiece></div><score>+1</score></div>
//         </div>
//         <div className="round__underboard">
//           <div className="crosstable">
//             <fill style={{flex:"8.25 1 auto"}}></fill>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs className="sep">
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <povs>
//               <a href="#" className="glpt win">1</a>
//               <a href="#" className="glpt loss">0</a>
//             </povs>
//             <div className="crosstable__matchup force-ltr" title="Счёт в текущем матче"><span className="win">3</span><span className="loss">0</span></div>
//             <div className="crosstable__users">
//               <a className="user-link" href="#"><span className="utitle" title="Grandmaster">GM</span>&nbsp;Ediz_Gurel</a><a className="user-link" href="#">nekitka0525</a>
//             </div>
//             <div className="crosstable__score force-ltr" title="Счёт за всё время"><span className="win">9</span><span className="loss">0</span></div>
//           </div>
//           <div className="tv-history">
//             <h2>Ранее на Lichess TV</h2>
//             <div className="now-playing">
//               <a href="#" className="mini-game mini-game-Dk27V3LJ standard is2d" data-tc="60+0" data-state="8/6pQ/5p2/6k1/5P2/2B1P1PP/7K/2rq4 b,white,f2f4">
//                 <span className="mini-game__player">
//                   <span className="mini-game__user">nekitka0525<span className="rating">2903</span></span>
//                   <span className="mini-game__result">0</span>
//                 </span>
//                 <span className="cg-wrap orientation-white">
//                   <cg-container style={{width: "344px", height: "344px"}}>
//                     <cg-board>
//                       <square className="last-move" style={{transform: "translate(215px, 172px)"}}></square>
//                       <square className="last-move" style={{transform: "translate(215px, 258px)"}}></square>
//                       <piece className="black pawn" style={{transform: "translate(258px, 43px)"}}></piece>
//                       <piece className="white queen" style={{transform: "translate(301px, 43px)"}}></piece>
//                       <piece className="black pawn" style={{transform: "translate(215px, 86px)"}}></piece>
//                       <piece className="black king" style={{transform: "translate(258px, 129px)"}}></piece>
//                       <piece className="white pawn" style={{transform: "translate(215px, 172px)"}}></piece>
//                       <piece className="white bishop" style={{transform: "translate(86px, 215px)"}}></piece>
//                       <piece className="white pawn" style={{transform: "translate(172px, 215px)"}}></piece>
//                       <piece className="white pawn" style={{transform: "translate(258px, 215px)"}}></piece>
//                       <piece className="white pawn" style={{transform: "translate(301px, 215px)"}}></piece>
//                       <piece className="white king" style={{transform: "translate(301px, 258px)"}}></piece>
//                       <piece className="black rook" style={{transform: "translate(86px, 301px)"}}></piece>
//                       <piece className="black queen" style={{transform: "translate(129px, 301px)"}}></piece>
//                     </cg-board><piece className="ghost" style={{visibility: "hidden"}}></piece>
//                   </cg-container>
//                 </span>
//                 <span className="mini-game__player">
//                   <span className="mini-game__user"><span className="utitle" title="Grandmaster">GM</span>&nbsp;Ediz_Gurel<span className="rating">3233</span></span>
//                   <span className="mini-game__result">1</span>
//                 </span>
//               </a>
//               <a href="#" className="mini-game mini-game-MOY4e7tC standard is2d" data-tc="60+0" data-state="8/8/2p5/8/PP3k2/1K1q4/8/8 w,black,a6d3">
//                 <span className="mini-game__player">
//                   <span className="mini-game__user">thelighter<span className="rating">2837</span></span>
//                   <span className="mini-game__result">0</span>
//                 </span>
//                 <span className="cg-wrap orientation-black">
//                   <cg-container style={{width: "344px", height: "344px"}}>
//                     <cg-board>
//                       <square className="last-move" style={{transform: "translate(172px, 86px)"}}></square>
//                       <square className="last-move" style={{transform: "translate(301px, 215px)"}}></square>
//                       <piece className="black pawn" style={{transform: "translate(215px, 215px)"}}></piece>
//                       <piece className="white pawn" style={{transform: "translate(301px, 129px)"}}></piece>
//                       <piece className="white pawn" style={{transform: "translate(258px, 129px)"}}></piece>
//                       <piece className="black king" style={{transform: "translate(86px, 129px)"}}></piece>
//                       <piece className="white king" style={{transform: "translate(258px, 86px)"}}></piece>
//                       <piece className="black queen" style={{transform: "translate(172px, 86px)"}}></piece>
//                     </cg-board>
//                     <piece className="ghost" style={{visibility: "hidden"}}></piece>
//                   </cg-container>
//                 </span>
//                 <span className="mini-game__player">
//                   <span className="mini-game__user"><span className="utitle" title="Grandmaster">GM</span>&nbsp;HomayooonT<span className="rating">3001</span></span>
//                   <span className="mini-game__result">1</span>
//                 </span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </main>
//       <CustomDialog // Game Over CustomDialog
//         open={Boolean(over)}
//         title={over}
//         contentText={over}
//         handleContinue={() => {
//           socket.emit("closeRoom", { roomId: room });
//           cleanup();
//         }}
//         isForm={false}
//       />
//     </div>
//   );
// }

// export default Game;      
