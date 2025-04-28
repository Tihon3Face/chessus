import { Button, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomDialog from "./CustomDialog";
import socket from './socket';
import { DockOutlined } from "@mui/icons-material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function InitGame({ setIs2Players,setRoom, room, setOrientation, setPlayers, setTime }) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState(''); // input state
  const [roomError, setRoomError] = useState('');
  const [disabled,setDisabled] = useState(false)
  const [created,setCreated] = useState([])
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [TVRoom,setTVRoom] = useState(null)

  const [whiteTime,setWhiteTime] = useState('no games');
  const [blackTime,setBlackTime] = useState('');

  const formatTime = (ms) => {
    if(ms === 'disconnected') return 'disconnected';
    if(ms === 'draw') return 'draw';
    if(ms === 'winner') return 'winner';
    if(typeof(ms) === 'string') return ms && 'no games';
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

  useEffect(() => {
    function getRoom(r) {
      setCreated(r);
    }
  
    socket.emit('freeRoom', getRoom);
    socket.on('newRoom', getRoom);
  
    socket.on('TVGame', (room,winner,disconnect) => {
      if(room){
        if(room.moves[0]) setFen(room.moves[room.moves.length - 1].after);
      }else{
        setFen(chess.fen());
      }
      if(winner == 'white' || winner == 'black'){
        if(winner == 'white'){
          setWhiteTime('winner');
          setBlackTime(disconnect ? 'disconnected' : '');
        }else{
          setBlackTime('winner');
          setWhiteTime(disconnect ? 'disconnected' : '');
        }
      }else if(winner == "draw" || winner == "game over"){
          if(room.players[0].orientation == 'white'){
            setBlackTime('draw');
            setWhiteTime('');
          }else{
            setWhiteTime('draw');
            setBlackTime('');
          }
      }else{
        setWhiteTime(room ? room.timeControl.white.time : 'no games');
        setBlackTime(room ? room.timeControl.black.time : '');
      }
      setTVRoom(room);
    });
    // Убираем подписки при размонтировании компонента
    // return () => {
    //   socket.off('newRoom', getRoom);
    //   socket.off('TVGame');
    //   socket.off('TVGameMove');
    // };
  }, []);

  const startTheGame = (time,addTime) => {
    setTime(time)
    setDisabled(true)
    let index = created.findIndex((e) => e.timeControl.time === time && e.timeControl.addTime === addTime);
    console.log(index)
    if (index == -1) {
      socket.emit("createRoom",{time,addTime},(r,orientation) => {
        setRoom(r);
        setOrientation(orientation);
      });
    } else {
      socket.emit("joinRoom", { roomId: created[index].roomId, orientation:created[index].opponentOrientation }, (r) => {
        // r is the response from the server
        if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
        // console.log("response:", r);
        setIs2Players(true)
        setRoom(r?.roomId); // set room to the room ID
        setPlayers(r?.players); // set players array to the array of players in the room
        setOrientation(created[index].opponentOrientation); // set orientation as black
        setRoomDialogOpen(false); // close dialog
      });
    }
  }


  const handleClick = (e) => {
    const contentElement = e.target.closest('.timeR');

    if (contentElement) {
      document.querySelectorAll('.spinner').forEach((element)=> element.classList.remove('loop'))
      document.querySelectorAll('.active').forEach((element)=> element.classList.remove('active'))
      contentElement.classList.remove('transp')

      contentElement.querySelector('.spinner').classList.add('loop');
      document.querySelectorAll('.timeR').forEach((element)=> element != contentElement ? element.classList.add('transp') : element.classList.add('active'))
      document.querySelector('.custom').classList.add('transp')
    }else if(e.target == document.querySelector('.custom')){
      document.querySelector('.custom').classList.remove('transp')
      document.querySelectorAll('.spinner').forEach((element)=> element.classList.remove('loop'))
      document.querySelectorAll('.active').forEach((element)=> element.classList.remove('active'))
      document.querySelectorAll('.timeR').forEach((element) => element.classList.remove('transp'))
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClick, {once: true})
  },[disabled])

  return (
    <div id="main-wrap" class="is2d addwid">
      <main class="lobby">
        <div class="lobby__table">
        <div class="lobby__start">
          <button class="button button-metal config_hook" type="button">Создать игру</button>
          <button class="button button-metal config_friend" type="button">Сыграть с другом</button>
          <button class="button button-metal config_ai" type="button">Сыграть с компьютером</button>
        </div>
        <div class="lobby__counters">
          <a href="/player"><strong data-count="114000">114&nbsp;387</strong> игроков</a>
          <a href="/games"><strong data-count="48456">48&nbsp;492</strong> партий</a>
        </div>
        </div>
        <div class="lobby__app lobby__app-pools">
          <div class="tabs-horiz" role="tablist">
            <span class="active" role="tab">Быстрый старт</span>
            <span role="tab">Зал ожидания</span>
            <span role="tab">Игра по переписке</span>
          </div>
          <div class="lobby__app__content lpools">
            <div role="button" data-id="1+0" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(60*1000,0)}><div class="clock">1+0</div><div class="perf">Bullet</div> <div className='spinner'></div> </div>
            <div role="button" data-id="2+1" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(2*60*1000,1*1000)}><div class="clock">2+1</div><div class="perf">Bullet</div> <div className='spinner'></div> </div>
            <div role="button" data-id="3+0" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(3*60*1000,0)}><div class="clock">3+0</div><div class="perf">Blitz</div> <div className='spinner'></div> </div>
            <div role="button" data-id="3+2" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(3*60*1000,2*1000)}><div class="clock">3+2</div><div class="perf">Blitz</div> <div className='spinner'></div> </div>
            <div role="button" data-id="5+0" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(5*60*1000,0)}><div class="clock">5+0</div><div class="perf">Blitz</div> <div className='spinner'></div> </div>
            <div role="button" data-id="5+3" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(5*60*1000,3*1000)}><div class="clock">5+3</div><div class="perf">Blitz</div> <div className='spinner'></div> </div>
            <div role="button" data-id="10+0" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(10*60*1000,0)}><div class="clock">10+0</div><div class="perf">Rapid</div> <div className='spinner'></div> </div>
            <div role="button" data-id="10+5" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(10*60*1000,5*1000)}><div class="clock">10+5</div><div class="perf">Rapid</div> <div className='spinner'></div> </div>
            <div role="button" data-id="15+10" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(15*60*1000,10*1000)}><div class="clock">15+10</div><div class="perf">Rapid</div> <div className='spinner'></div> </div>
            <div role="button" data-id="30+0" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(30*60*1000,0)}><div class="clock">30+0</div><div class="perf">Classical</div> <div className='spinner'></div> </div>
            <div role="button" data-id="30+20" tabindex="0" class="timeR" onClick={disabled ? null : () => startTheGame(30*60*1000,20*1000)}><div class="clock">30+20</div><div class="perf">Classical</div> <div className='spinner'></div> </div>
            <div class="custom" role="button" data-id="custom" tabindex="0">Своя игра</div>
          </div>
        </div>
        {/* <div class="lobby__side">
            <section class="lobby__streams">
              <a href="#" target="_blank" rel="nofollow" class="stream highlight" title="Winning Quickly with AGGRESSIVE Chess Openings | lichess.org !stl !aco !chessmood"><strong class="text" data-icon="">IM Eric Rosen</strong> Winning Quickly with AGGRESSIVE Chess Openings | lichess.org !stl !aco !chessmood</a>
              <a href="#" class="more">Стримеры »</a>
            </section>
            <div class="lobby__spotlights">
              <a href="#" class="tour-spotlight event-spotlight relay-spotlight id_ti2oVwA9"><i class="img" data-icon=""></i><span class="content"><span class="name">European Championship 2025</span><span class="more">Deac, Sarana, Van Foreest, Navara • Идёт прямо сейчас</span></span></a>
              <a href="#" class="tour-spotlight event-spotlight relay-spotlight id_iKyh0heF"><i class="img" data-icon=""></i><span class="content"><span class="name">FIDE Women's GP Nicosia</span><span class="more">Goryachkina, Muzychuk, Dzagnidze • Идёт прямо сейчас</span></span></a>
              <a href="#" class="tour-spotlight id_Rsizxglc Shield Blitz racingKings invert"><i data-icon="" class="img"></i><span class="content"><span class="name">Racing Kings Арена за Щит</span><span class="headline">Battle for the Racing Kings Shield</span><span class="more">153 игрока • <time class="timeago remaining set" datetime="2025-03-19T22:00:00Z" title="20 мар. 2025 г., 03:00">осталось 13 часов</time></span></span></a>
              <a href="#" class="tour-spotlight little"><i data-icon="" class="img icon"></i><span class="content"><span class="name">SuperBlitz Swiss</span><span class="more">33 игрока • Идёт прямо сейчас</span></span></a>
            </div>
          </div> */}
          <div class="lobby__tv">
            <span class="mini-game mini-game-TejRFasw standard is2d" data-live="TejRFasw" data-tc="60+0" data-state="rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b,white,c2c4">
              <span class="mini-game__player">
                <span class="mini-game__user">anonymous<span class="rating">3004</span></span><span class="mini-game__clock mini-game__clock--black" data-time="60">
                  {
                    TVRoom?.players[0].orientation == 'white' ? formatTime(blackTime) : formatTime(whiteTime)
                  }
                </span>
              </span>
              <span class="cg-wrap orientation-white">
              <div className="round__app__board main-board">
                <div className="cg-wrap orientation-black manipulable">
                    <Chessboard 
                      position={fen}
                      boardOrientation={TVRoom?.players[0].orientation}
                      customBoardStyle={{
                        pointerEvents: "none"
                      }}
                    />
                </div>
              </div>
              </span>
              <span class="mini-game__player">
                <span class="mini-game__user"><span class="utitle" title="Grandmaster">GM</span>&nbsp;anonymous<span class="rating">3124</span></span>
                <span class="mini-game__clock mini-game__clock--white" data-time="60">
                  {
                  TVRoom?.players[0].orientation == 'white' ? formatTime(whiteTime) : formatTime(blackTime)
                  }
                </span>
              </span>
            </span>
          </div>
          <span title="Нажмите, чтобы начать решать" class="lobby__puzzle">
            <span class="text">Задача дня</span>
            <span class="mini-board cg-wrap is2d orientation-white" data-state="1rr3k1/pbR3pp/1p1q1p2/3pp3/8/4B1P1/PP1QPP1P/2R3K1,white,f8c8">
            <div className="round__app__board main-board">
                <div className="cg-wrap orientation-black manipulable">
                    <Chessboard />
                </div>
              </div>
            </span>
            <span class="text">Ход белых</span>
          </span>
      </main>
  {/* <Button
    variant="contained"
    onClick={startTheGame}
  >
    Start a game
  </Button>
  <Button
    onClick={() => {
      setRoomDialogOpen(true)
    }}
  >
    Join a game
  </Button> */}
  </div>
  );
}




    // <Stack
    //   justifyContent="center"
    //   alignItems="center"
    //   sx={{height: "calc(100vh - 40px)"}}
    // >
    //   <CustomDialog
    //     open={roomDialogOpen}
    //     handleClose={() => setRoomDialogOpen(false)}
    //     title="Select Room to Join"
    //     contentText="Enter a valid room ID to join the room"
    //     handleContinue={() => {
    //         // join a room
    //         if (!roomInput) return; // if given room input is valid, do nothing.
    //         socket.emit("joinRoom", { roomId: roomInput }, (r) => {
    //           // r is the response from the server
    //           if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
    //           console.log("response:", r);
    //           setRoom(r?.roomId); // set room to the room ID
    //           setPlayers(r?.players); // set players array to the array of players in the room
    //           setOrientation("black"); // set orientation as black
    //           setRoomDialogOpen(false); // close dialog
    //         });
    //       }}
    //   >
    //     <TextField
    //       autoFocus
    //       margin="dense"
    //       id="room"
    //       label="Room ID"
    //       name="room"
    //       value={roomInput}
    //       required
    //       onChange={(e) => setRoomInput(e.target.value)}
    //       type="text"
    //       fullWidth
    //       variant="standard"
    //       error={Boolean(roomError)}
    //       helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}` }
    //     />
    //   </CustomDialog>
    //   {/* Button for starting a game */}
    //   <Button
    //     variant="contained"
    //     onClick={() => {
    //         socket.emit("createRoom", (r) => {
    //         console.log(r);
    //         setRoom(r);
    //         setOrientation("white");
    //         });
    //     }}
    //     >
    //     Start a game
    //     </Button>
    //   {/* Button for joining a game */}
    //   <Button
    //     onClick={() => {
    //       setRoomDialogOpen(true)
    //     }}
    //   >
    //     Join a game
    //   </Button>
    // </Stack>











  //   <CustomDialog
  //   open={roomDialogOpen}
  //   handleClose={() => setRoomDialogOpen(false)}
  //   title="Select Room to Join"
  //   contentText="Enter a valid room ID to join the room"
  //   handleContinue={() => {
  //       // join a room
  //       if (!roomInput) return; // if given room input is valid, do nothing.
  //       socket.emit("joinRoom", { roomId: roomInput }, (r) => {
  //         // r is the response from the server
  //         if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
  //         console.log("response:", r);
  //         setRoom(r?.roomId); // set room to the room ID
  //         setPlayers(r?.players); // set players array to the array of players in the room
  //         setOrientation("black"); // set orientation as black
  //         setRoomDialogOpen(false); // close dialog
  //       });
  //     }}
  // >
  //   <TextField
  //     autoFocus
  //     margin="dense"
  //     id="room"
  //     label="Room ID"
  //     name="room"
  //     value={roomInput}
  //     required
  //     onChange={(e) => setRoomInput(e.target.value)}
  //     type="text"
  //     fullWidth
  //     variant="standard"
  //     error={Boolean(roomError)}
  //     helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}` }
  //   />
  // </CustomDialog>
  // {/* Button for starting a game */}
  // <Button
  //   variant="contained"
  //   onClick={() => {
  //     if(!created){
  //       socket.emit("createRoom", (r) => {
  //         setIs2Players(true)
  //         // console.log(r);
  //         setRoom(r);
  //         setOrientation("white");
  //       });
  //     }
  //     if(created){
  //       socket.emit("joinRoom", { roomId: created.roomId, room: created.newobj }, (r) => {
  //         // r is the response from the server
  //         if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
  //         // console.log("response:", r);
  //         setIs2Players(true)
  //         setRoom(r?.roomId); // set room to the room ID
  //         setPlayers(r?.players); // set players array to the array of players in the room
  //         setOrientation("black"); // set orientation as black
  //         setRoomDialogOpen(false); // close dialog
  //       });
  //     }
      
  //   }}
  //   >
  //   Start a game
  //   </Button>
  // {/* Button for joining a game */}
  // <Button
  //   onClick={() => {
  //     setRoomDialogOpen(true)
  //   }}
  // >
  //   Join a game
  // </Button>








































    // <div id="main-wrap" class="is2d addwid">
    //   <main class="lobby">
    //     <div class="lobby__table">
    //     <div class="lobby__start">
    //       <button class="button button-metal config_hook" type="button">Создать игру</button>
    //       <button class="button button-metal config_friend" type="button">Сыграть с другом</button>
    //       <button class="button button-metal config_ai" type="button">Сыграть с компьютером</button>
    //     </div>
    //     <div class="lobby__counters">
    //       <a href="/player"><strong data-count="114000">114&nbsp;387</strong> игроков</a>
    //       <a href="/games"><strong data-count="48456">48&nbsp;492</strong> партий</a>
    //     </div>
    //   </div>
    //   <div class="lobby__app lobby__app-pools">
    //     <div class="tabs-horiz" role="tablist">
    //       <span class="active" role="tab">Быстрый старт</span>
    //       <span role="tab">Зал ожидания</span>
    //       <span role="tab">Игра по переписке</span>
    //     </div>
    //     <div class="lobby__app__content lpools">
    //       <div role="button" data-id="1+0" tabindex="0"><div class="clock">1+0</div><div class="perf">Bullet</div></div>
    //       <div role="button" data-id="2+1" tabindex="0"><div class="clock">2+1</div><div class="perf">Bullet</div></div>
    //       <div role="button" data-id="3+0" tabindex="0"><div class="clock">3+0</div><div class="perf">Blitz</div></div>
    //       <div role="button" data-id="3+2" tabindex="0"><div class="clock">3+2</div><div class="perf">Blitz</div></div>
    //       <div role="button" data-id="5+0" tabindex="0"><div class="clock">5+0</div><div class="perf">Blitz</div></div>
    //       <div role="button" data-id="5+3" tabindex="0"><div class="clock">5+3</div><div class="perf">Blitz</div></div>
    //       <div role="button" data-id="10+0" tabindex="0"><div class="clock">10+0</div><div class="perf">Rapid</div></div>
    //       <div role="button" data-id="10+5" tabindex="0"><div class="clock">10+5</div><div class="perf">Rapid</div></div>
    //       <div role="button" data-id="15+10" tabindex="0"><div class="clock">15+10</div><div class="perf">Rapid</div></div>
    //       <div role="button" data-id="30+0" tabindex="0"><div class="clock">30+0</div><div class="perf">Classical</div></div>
    //       <div role="button" data-id="30+20" tabindex="0"><div class="clock">30+20</div><div class="perf">Classical</div></div>
    //       <div class="custom" role="button" data-id="custom" tabindex="0">Своя игра</div>
    //     </div>
    //   </div>
          {/* <div class="lobby__side"> */}
            {/* <section class="lobby__streams">
              <a href="/streamer/ericrosen/redirect" target="_blank" rel="nofollow" class="stream highlight" title="Winning Quickly with AGGRESSIVE Chess Openings | lichess.org !stl !aco !chessmood"><strong class="text" data-icon="">IM Eric Rosen</strong> Winning Quickly with AGGRESSIVE Chess Openings | lichess.org !stl !aco !chessmood</a>
              <a href="/streamer" class="more">Стримеры »</a>
            </section>
            <div class="lobby__spotlights">
              <a href="/broadcast/european-championship-2025/round-5/acBi2qan" class="tour-spotlight event-spotlight relay-spotlight id_ti2oVwA9"><i class="img" data-icon=""></i><span class="content"><span class="name">European Championship 2025</span><span class="more">Deac, Sarana, Van Foreest, Navara • Идёт прямо сейчас</span></span></a>
              <a href="/broadcast/fide-womens-grand-prix-202425--nicosia/round-5/Gd2xuCTY" class="tour-spotlight event-spotlight relay-spotlight id_iKyh0heF"><i class="img" data-icon=""></i><span class="content"><span class="name">FIDE Women's GP Nicosia</span><span class="more">Goryachkina, Muzychuk, Dzagnidze • Идёт прямо сейчас</span></span></a>
              <a href="/tournament/Rsizxglc" class="tour-spotlight id_Rsizxglc Shield Blitz racingKings invert"><i data-icon="" class="img"></i><span class="content"><span class="name">Racing Kings Арена за Щит</span><span class="headline">Battle for the Racing Kings Shield</span><span class="more">153 игрока • <time class="timeago remaining set" datetime="2025-03-19T22:00:00Z" title="20 мар. 2025 г., 03:00">осталось 13 часов</time></span></span></a>
              <a href="/swiss/VnYBEK77" class="tour-spotlight little"><i data-icon="" class="img icon"></i><span class="content"><span class="name">SuperBlitz Swiss</span><span class="more">33 игрока • Идёт прямо сейчас</span></span></a>
            </div> */}
          {/* </div> */}
          {/* <div class="lobby__tv">
            <a href="/tv" class="mini-game mini-game-TejRFasw standard is2d" data-live="TejRFasw" data-tc="60+0" data-state="rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b,white,c2c4">
              <span class="mini-game__player"><span class="mini-game__user">ZH1END<span class="rating">3004</span></span><span class="mini-game__clock mini-game__clock--black" data-time="60">0:56</span></span>
              <span class="cg-wrap orientation-white"> */}
                {/* <cg-container style="width: 360px; height: 360px;">
                  <cg-board>
                    <square class="last-move" style="transform: translate(135px, 45px);"></square>
                    <square class="last-move" style="transform: translate(45px, 0px);"></square>
                    <piece class="black rook" style="transform: translate(0px, 0px);"></piece>
                    <piece class="black knight" style="transform: translate(135px, 45px);"></piece>
                    <piece class="black bishop" style="transform: translate(225px, 135px);"></piece>
                    <piece class="black queen" style="transform: translate(135px, 0px);"></piece>
                    <piece class="black king" style="transform: translate(180px, 0px);"></piece>
                    <piece class="black bishop" style="transform: translate(225px, 0px);"></piece>
                    <piece class="black knight" style="transform: translate(225px, 90px);"></piece>
                    <piece class="black rook" style="transform: translate(315px, 0px);"></piece>
                    <piece class="black pawn" style="transform: translate(0px, 45px);"></piece>
                    <piece class="black pawn" style="transform: translate(45px, 45px);"></piece>
                    <piece class="black pawn" style="transform: translate(90px, 90px);"></piece>
                    <piece class="black pawn" style="transform: translate(135px, 135px);"></piece>
                    <piece class="black pawn" style="transform: translate(225px, 45px);"></piece>
                    <piece class="black pawn" style="transform: translate(270px, 45px);"></piece>
                    <piece class="black pawn" style="transform: translate(315px, 45px);"></piece>
                    <piece class="white pawn" style="transform: translate(0px, 270px);"></piece>
                    <piece class="white pawn" style="transform: translate(45px, 270px);"></piece>
                    <piece class="white pawn" style="transform: translate(135px, 180px);"></piece>
                    <piece class="white pawn" style="transform: translate(180px, 225px);"></piece>
                    <piece class="white pawn" style="transform: translate(225px, 270px);"></piece>
                    <piece class="white pawn" style="transform: translate(270px, 270px);"></piece>
                    <piece class="white pawn" style="transform: translate(315px, 270px);"></piece>
                    <piece class="white rook" style="transform: translate(0px, 315px);"></piece>
                    <piece class="white knight" style="transform: translate(90px, 225px);"></piece>
                    <piece class="white bishop" style="transform: translate(270px, 135px);"></piece>
                    <piece class="white queen" style="transform: translate(135px, 315px);"></piece>
                    <piece class="white king" style="transform: translate(180px, 315px);"></piece>
                    <piece class="white bishop" style="transform: translate(225px, 315px);"></piece>
                    <piece class="white knight" style="transform: translate(225px, 225px);"></piece>
                    <piece class="white rook" style="transform: translate(315px, 315px);"></piece>
                  </cg-board>
                <piece class="ghost" style="visibility: hidden;"></piece>
              </cg-container> */}
              {/* </span>
              <span class="mini-game__player">
                <span class="mini-game__user"><span class="utitle" title="Grandmaster">GM</span>&nbsp;Rakhmanov_Aleksandr<span class="rating">3124</span></span>
                <span class="mini-game__clock mini-game__clock--white clock--run" data-time="60">0:57</span>
              </span>
            </a>
          </div>
          <a href="/training/daily" title="Нажмите, чтобы начать решать" class="lobby__puzzle">
            <span class="text">Задача дня</span>
            <span class="mini-board cg-wrap is2d orientation-white" data-state="1rr3k1/pbR3pp/1p1q1p2/3pp3/8/4B1P1/PP1QPP1P/2R3K1,white,f8c8"> */}
              {/* <cg-container style="width: 360px; height: 360px;"> */}
                {/* <cg-board>
                  <square class="last-move" style="transform: translate(90px, 0px);"></square>
                  <square class="last-move" style="transform: translate(225px, 0px);"></square>
                  <piece class="black rook" style="transform: translate(45px, 0px);"></piece>
                  <piece class="black rook" style="transform: translate(90px, 0px);"></piece>
                  <piece class="black king" style="transform: translate(270px, 0px);"></piece>
                  <piece class="black pawn" style="transform: translate(0px, 45px);"></piece>
                  <piece class="black bishop" style="transform: translate(45px, 45px);"></piece>
                  <piece class="white rook" style="transform: translate(90px, 45px);"></piece>
                  <piece class="black pawn" style="transform: translate(270px, 45px);"></piece>
                  <piece class="black pawn" style="transform: translate(315px, 45px);"></piece>
                  <piece class="black pawn" style="transform: translate(45px, 90px);"></piece>
                  <piece class="black queen" style="transform: translate(135px, 90px);"></piece>
                  <piece class="black pawn" style="transform: translate(225px, 90px);"></piece>
                  <piece class="black pawn" style="transform: translate(135px, 135px);"></piece>
                  <piece class="black pawn" style="transform: translate(180px, 135px);"></piece>
                  <piece class="white bishop" style="transform: translate(180px, 225px);"></piece>
                  <piece class="white pawn" style="transform: translate(270px, 225px);"></piece>
                  <piece class="white pawn" style="transform: translate(0px, 270px);"></piece>
                  <piece class="white pawn" style="transform: translate(45px, 270px);"></piece>
                  <piece class="white queen" style="transform: translate(135px, 270px);"></piece>
                  <piece class="white pawn" style="transform: translate(180px, 270px);"></piece>
                  <piece class="white pawn" style="transform: translate(225px, 270px);"></piece>
                  <piece class="white pawn" style="transform: translate(315px, 270px);"></piece>
                  <piece class="white rook" style="transform: translate(90px, 315px);"></piece>
                  <piece class="white king" style="transform: translate(270px, 315px);"></piece>
                </cg-board>
                <piece class="ghost" style="visibility: hidden;"></piece> */}
              {/* </cg-container> */}
            {/* </span>
            <span class="text">Ход белых</span>
          </a> */}
          {/* <div class="lobby__blog ublog-post-cards" style="grid-template-columns: repeat(7, 236.16px);">
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-fla2021" href="/@/fla2021/blog/the-greek-gift-sacrifice-good-sacrifices-and-bad-sacrifices/yC70MkAK" style="transform: translateX(0px);">
              <span class="ublog-post-card__top"><img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:yC70MkAK:sYzJCUPu.webp&amp;w=400&amp;sig=539a55e30f16a76370b7ad921d3a9cec62763de6"/>
                <time datetime="2025-03-11T19:16:48.983Z" class="ublog-post-card__over-image">11 мар. 2025 г.</time>
                <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/fla2021"><span class="utitle" title="Woman FIDE Master">WFM</span>&nbsp;fla2021</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">The Greek Gift sacrifice: good sacrifices and bad sacrifices</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-jk_182" href="/@/jk_182/blog/comparing-the-rise-of-3-generations-of-chess-prodigies/WWdQusCn" style="transform: translateX(0px);">
              <span class="ublog-post-card__top"><img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:WWdQusCn:gEsIypkH.png&amp;w=400&amp;sig=f8190ed7d48d1be0b5e23d477ac01762ce3beb50"/>
                <time datetime="2025-03-09T15:38:54.069Z" class="ublog-post-card__over-image">9 мар. 2025 г.</time>
                <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/jk_182">jk_182</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">Comparing the Rise of 3 Generations of Chess Prodigies</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-ebk1976" href="/@/ebk1976/blog/the-top-players-of-the-future/pi2LIgt2" style="transform: translateX(0px);">
              <span class="ublog-post-card__top">
                <img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:pi2LIgt2:I8WYKhBZ.webp&amp;w=400&amp;sig=145375a24993ea0a4673a30fa8b648cfcb4172fb"/>
                <time datetime="2025-03-17T15:37:43.394Z" class="ublog-post-card__over-image">17 мар. 2025 г.</time>
                <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/ebk1976">ebk1976</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">The Top Players of the Future</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-ledger4545" href="/@/Ledger4545/blog/lichess4545-interview-from-random-coffee-shop-encounter-to-a-chess-club-owner/qjmL6nME" style="transform: translateX(0px);">
              <span class="ublog-post-card__top">
              <img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:qjmL6nME:td7z6Vt0.webp&amp;w=400&amp;sig=f1fd6cc63c7fe959201bb82a26f6a20960356393"/>
              <time datetime="2025-03-16T20:05:40.937Z" class="ublog-post-card__over-image">16 мар. 2025 г.</time>
              <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/Ledger4545">Ledger4545</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">Lichess4545 Interview: From random coffee shop encounter to a chess club owner</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-craze" href="/@/Craze/blog/brand-new-gambit-vs-the-caro-kann/Azk2dFbt" style="transform: translateX(0px);">
              <span class="ublog-post-card__top">
                <img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:Azk2dFbt:blKgyydM.webp&amp;w=400&amp;sig=da818c7994d8634a7f653b408747a100a1c31c4b"/>
                <time datetime="2025-03-14T13:44:04.358Z" class="ublog-post-card__over-image">14 мар. 2025 г.</time>
                <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/Craze"><span class="utitle" title="Grandmaster">GM</span>&nbsp;Craze</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">Brand New Gambit vs. The Caro-Kann!</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-onthequeenside" href="/@/OnTheQueenside/blog/2025-womens-top-25-rankings-fear-goryachkina/LdbdeJQi" style="transform: translateX(0px);">
              <span class="ublog-post-card__top">
                <img class="ublog-post-image ublog-post-card__image" width="400" height="250" alt="Collage of Goryachkina, Shuvalova, &amp; Injac" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:LdbdeJQi:e4DqPLlB.webp&amp;w=400&amp;sig=2eaa752737746f6a60b95c0f24295e41de25ed1e"/>
                <time datetime="2025-03-08T17:58:24.057Z" class="ublog-post-card__over-image">8 мар. 2025 г.</time>
                <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/OnTheQueenside">OnTheQueenside</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">2025 Women's Top 25 Rankings: Fear Goryachkina!</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-sphynx" href="/@/sphynx/blog/classical-online-tournaments/8wwgfcRK" style="transform: translateX(0px);">
              <span class="ublog-post-card__top">
                <img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:8wwgfcRK:bg9FpDK4.webp&amp;w=400&amp;sig=36afee93d9c922b26f8752bdb60ca9fa8b1048f9"/>
                <time datetime="2025-03-17T10:10:50.408Z" class="ublog-post-card__over-image">17 мар. 2025 г.</time>
                <span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/sphynx">sphynx</span>
              </span>
              <span class="ublog-post-card__content"><h2 class="ublog-post-card__title">Classical Online Tournaments</h2></span>
            </a>
            <a class="ublog-post-card ublog-post-card--link ublog-post-card--by-checkraisemate" href="/@/CheckRaiseMate/blog/should-you-play-up/3SQpheOH" style="transform: translateX(0px);"><span class="ublog-post-card__top"><img class="ublog-post-image ublog-post-card__image" width="400" height="250" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:3SQpheOH:O0k5mkPG.webp&amp;w=400&amp;sig=17bd516dd627f39d6230760e76a3053a2fbdab99"/><time datetime="2025-03-11T18:10:20.085Z" class="ublog-post-card__over-image">11 мар. 2025 г.</time><span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/CheckRaiseMate"><span class="utitle" title="FIDE Master">FM</span>&nbsp;CheckRaiseMate</span></span><span class="ublog-post-card__content"><h2 class="ublog-post-card__title">Should You Play Up?</h2></span></a><a class="ublog-post-card ublog-post-card--link ublog-post-card--by-jjpl03" href="/@/JJPL03/blog/goats-catalan-classical-model-games/0PZyEd0O" style="transform: translateX(0px);"><span class="ublog-post-card__top"><img class="ublog-post-image ublog-post-card__image" width="400" height="250" alt="GOAT + Catalan Model Game screenshot" src="https://image.lichess1.org/display?fmt=webp&amp;h=250&amp;op=thumbnail&amp;path=ublog:0PZyEd0O:wMSSPZCC.webp&amp;w=400&amp;sig=4d5e01d0ddc50efa8c68e2752db23e5518a78f5d"/><time datetime="2025-03-16T22:24:52.735Z" class="ublog-post-card__over-image">16 мар. 2025 г.</time><span class="user-link ulpt ublog-post-card__over-image pos-bottom" data-href="/@/JJPL03"><span class="utitle" title="International Master">IM</span>&nbsp;JJPL03</span></span><span class="ublog-post-card__content"><h2 class="ublog-post-card__title">GOAT's Catalan - Classical Model Games</h2></span></a>
            </div> */}
            {/* <div class="lobby__tournaments-simuls">
              <div class="lobby__tournaments lobby__box">
                <a class="lobby__box__top" href="/tournament">
                  <h2 class="title text" data-icon="">Открытые турниры</h2>
                  <span class="more">Ещё »</span>
                </a>
                <div class="lobby__box__content">
                  <table class="tournaments">
                    <tbody>
                      <tr>
                        <td>
                          <a class="text" data-icon="" href="/tournament/Rsizxglc">Щит по Racing Kings</a>
                        </td>
                        <td class="progress-td">
                          <span class="progress">
                            <time class="timeago remaining progress__text set" datetime="2025-03-19T22:00:00Z" title="20 мар. 2025 г., 03:00">осталось 13 часов</time>
                            <span class="progress__bar" style="width:18%"></span>
                          </span>
                        </td>
                        <td>6h</td>
                        <td data-icon="" class="text">153</td>
                      </tr>
                      <tr>
                        <td><a class="text" data-icon="" href="/tournament/Ivqqx4Kk">Ежечасный Рапид</a></td>
                        <td class="progress-td">
                          <span class="progress">
                            <time class="timeago remaining progress__text set" datetime="2025-03-19T17:57:35Z" title="19 мар. 2025 г., 22:57">осталось 9 часов</time>
                            <span class="progress__bar" style="width:53%"></span>
                          </span>
                        </td>
                        <td>1h 57m</td>
                        <td data-icon="" class="text">737</td>
                      </tr>
                      <tr>
                        <td><a class="text" data-icon="" href="/tournament/LX2mhHkY">Еженедельный Блиц</a></td>
                        <td class="progress-td"><span class="progress">
                        <time class="timeago remaining progress__text set" datetime="2025-03-19T20:00:00Z" title="20 мар. 2025 г., 01:00">осталось 11 часов</time><span class="progress__bar" style="width:1%"></span></span></td><td>3h</td><td data-icon="" class="text">291</td></tr><tr><td>
                        <a class="text" data-icon="" href="/tournament/3Md1R0NY">Ежечасный Antichess</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:57:02.5Z" title="19 мар. 2025 г., 22:57">осталось 9 часов</time><span class="progress__bar" style="width:3%"></span></span></td><td>57m</td><td data-icon="" class="text">36</td></tr><tr><td>
                        <a class="text" data-icon="" href="/tournament/pjxZEpcd">Ежечасный HyperBullet</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:27:05Z" title="19 мар. 2025 г., 22:27">осталось 8 часов</time><span class="progress__bar" style="width:7%"></span></span></td><td>27m</td><td data-icon="" class="text">47</td></tr><tr><td><a class="text" data-icon="" href="/tournament/kggbyciw">≤1700 Рапид</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:57:10Z" title="19 мар. 2025 г., 22:57">осталось 9 часов</time><span class="progress__bar" style="width:3%"></span></span></td><td>57m</td><td data-icon="" class="text">88</td></tr><tr><td><a class="text" data-icon="" href="/tournament/DFuwzZIl">Ежечасный Пуля</a></td><td class="progress-td"><span class="progress">
                        <time class="timeago remaining progress__text set" datetime="2025-03-19T17:27:15Z" title="19 мар. 2025 г., 22:27">осталось 8 часов</time><span class="progress__bar" style="width:6%"></span></span></td><td>27m</td><td data-icon="" class="text">116</td></tr><tr><td><a class="text" data-icon="" href="/tournament/fAuVqn8G">≤2000 Блиц</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:57:20Z" title="19 мар. 2025 г., 22:57">осталось 9 часов</time><span class="progress__bar" style="width:3%"></span></span></td><td>57m</td><td data-icon="" class="text">108</td></tr><tr><td><a class="text" data-icon="" href="/tournament/mhBrIzFh">≤1300 SuperBlitz</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:57:25Z" title="19 мар. 2025 г., 22:57">осталось 9 часов</time><span class="progress__bar" style="width:3%"></span></span></td><td>57m</td><td data-icon="" class="text">21</td></tr><tr><td><a class="text" data-icon="" href="/tournament/74DJaboD">≤1500 Пуля</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:27:30Z" title="19 мар. 2025 г., 22:27">осталось 8 часов</time><span class="progress__bar" style="width:5%"></span></span></td><td>27m</td><td data-icon="" class="text">30</td></tr><tr><td><a class="text" data-icon="" href="/tournament/OLVu5pWw">Ежечасный Crazyhouse</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T17:57:35Z" title="19 мар. 2025 г., 22:57">осталось 9 часов</time><span class="progress__bar" style="width:2%"></span></span></td><td>57m</td><td data-icon="" class="text">18</td></tr><tr><td><a class="text" data-icon="" href="/tournament/Ar9Hly7Z">Ежедневный SuperBlitz</a></td><td class="progress-td"><span class="progress"><time class="timeago remaining progress__text set" datetime="2025-03-19T18:30:40Z" title="19 мар. 2025 г., 23:30">осталось 9 часов</time><span class="progress__bar" style="width:2%"></span></span></td><td>1h 30m</td><td data-icon="" class="text">261</td></tr></tbody></table></div></div>
            </div>
            <div class="lobby__feed"><div class="daily-feed__updates"><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/activity.party-popper.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#raIF8N"><time class="set" datetime="2025-03-17T22:15:00Z" title="18 мар. 2025 г., 03:15">34 часа назад</time></a><p>Congratulations to <a href="https://lichess.org/team/veer-shah--friends" target="_blank" rel="nofollow noreferrer">VEER SHAH &amp; FRIENDS</a> for winning our <a href="https://lichess.org/tournament/mar25str" target="_blank" rel="nofollow noreferrer">Streamers Battle March 2025</a>! Congrats also to <a href="https://lichess.org/team/moon-club" target="_blank" rel="nofollow noreferrer">Moon Club</a> for taking 2nd place, to <a href="https://lichess.org/team/zhigalko_sergei-fan-club" target="_blank" rel="nofollow noreferrer">Zhigalko_Sergei &amp; Friends</a> for 3rd place, and to <a href="https://lichess.org/team/4WJHSeyU" target="_blank" rel="nofollow noreferrer">Полина Янученко1</a> for 4th place. Thanks to all participating <a href="https://lichess.org/streamer" target="_blank" rel="nofollow noreferrer">streamers</a> and 2,026 registered players!</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/activity.party-popper.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#sLvZ3E"><time class="set" datetime="2025-03-17T04:20:00Z" title="17 мар. 2025 г., 09:20">2 дня назад</time></a><p>Congrats <a href="/@/jan6363" target="_blank" rel="nofollow noreferrer">@jan6363</a> on winning the <a href="https://lichess.org/viuP7RGf/black" target="_blank" rel="nofollow noreferrer">Lichess Game of the Month February 2025</a>! Thank you for all your <a href="https://lichess.org/forum/general-chess-discussion/lichess-game-of-the-month-february-2025-contest" target="_blank" rel="nofollow noreferrer">countless submissions</a>!</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/activity.chess.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#zAlaGC"><time class="set" datetime="2025-03-15T12:55:00Z" title="15 мар. 2025 г., 17:55">3 дня назад</time></a><p>The <a href="https://lichess.org/broadcast/european-championship-2025--boards-1-100/ti2oVwA9" target="_blank" rel="nofollow noreferrer">European Championship</a>, featuring GMs <a href="https://lichess.org/fide/1226380/Deac_Bogdan-Daniel" target="_blank" rel="nofollow noreferrer">Bogdan-Daniel Deac</a>, <a href="https://lichess.org/fide/24133795/Sarana_Alexey" target="_blank" rel="nofollow noreferrer">Alexey Sarana</a>, <a href="https://lichess.org/fide/309095/Navara_David" target="_blank" rel="nofollow noreferrer">David Navara</a> and more, as well as the 4th <a href="https://lichess.org/broadcast/fide-womens-grand-prix-202425--nicosia/iKyh0heF" target="_blank" rel="nofollow noreferrer">FIDE Women's Grand Prix 2024-25</a> tournament in Nicosia, with GMs <a href="https://lichess.org/fide/4147103/Goryachkina_Aleksandra" target="_blank" rel="nofollow noreferrer">Aleksandra Goryachkina</a>, <a href="https://lichess.org/fide/14111330/Muzychuk_Anna" target="_blank" rel="nofollow noreferrer">Anna Muzychuk</a>, and <a href="https://lichess.org/fide/8608059/Zhu_Jiner" target="_blank" rel="nofollow noreferrer">Zhu Jiner</a> among others, are both about to start at 13:00 UTC! Follow all the games in our <a href="https://lichess.org/broadcast" target="_blank" rel="nofollow noreferrer">broadcasts</a>.</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/objects.studio-microphone.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#XMS8Ac"><time class="set" datetime="2025-03-13T13:10:00Z" title="13 мар. 2025 г., 18:10">5 дней назад</time></a><p>The second ChessMood 20/20 Grand Prix Qualifier Arena - again featuring a $1,000 prize fund - will be held on <a href="https://lichess.org/tournament/CMQ20Mar" target="_blank" rel="nofollow noreferrer">20th March at 20:00 UTC</a>! The event is open to all Lichess streamer teams. Read our <a href="https://lichess.org/@/Lichess/blog/announcing-the-chessmood-2020-grand-prix/88JtiVlR" target="_blank" rel="nofollow noreferrer">full announcement</a> and <a href="https://lichess.org/@/Lichess/blog/announcing-the-chessmood-2020-grand-prix/88JtiVlR#registration" target="_blank" rel="nofollow noreferrer">register</a> now until 17th March.</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/objects.studio-microphone.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#XpQ408"><time class="set" datetime="2025-03-11T17:15:00Z" title="11 мар. 2025 г., 22:15">1 неделю назад</time></a><p>Streamers and communities, get ready for the next Streamers Battles on <a href="https://lichess.org/tournament/mar25str" target="_blank" rel="nofollow noreferrer">17th March at 16:00 UTC</a> and <a href="https://lichess.org/tournament/apr25str" target="_blank" rel="nofollow noreferrer">14th April at 15:00 UTC</a>, with <a href="https://lichess.org/page/streamer-arena" target="_blank" rel="nofollow noreferrer">prizes</a> for streamers whose teams finish in the top 4!</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/activity.artist-palette.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#U0XTeb"><time class="set" datetime="2025-03-09T20:00:00Z" title="10 мар. 2025 г., 01:00">1 неделю назад</time></a><p>The <a href="https://xkcd.com/3045/" target="_blank" rel="nofollow noreferrer">xkcd</a> piece set is now available on Lichess: Select it from the <em>Piece set</em> option in your account menu. Many thanks to <a href="https://github.com/detroyejr" target="_blank" rel="nofollow noreferrer">detroyejr</a> for recreating and contributing it!</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/activity.confetti-ball.webp" class="daily-feed__update__marker  nobg"/><div><a class="daily-feed__update__day" href="/feed#tnpYy7"><time class="set" datetime="2025-03-08T09:15:00Z" title="8 мар. 2025 г., 14:15">1 неделю назад</time></a><p>Happy International Women's Day! Let's celebrate together in our thematic <a href="https://lichess.org/tournament/women025" target="_blank" rel="nofollow noreferrer">Women's Day Arena</a> today at 14:00 UTC, with all games starting from a position of GM <a href="https://en.wikipedia.org/wiki/Judit_Polg%C3%A1r" target="_blank" rel="nofollow noreferrer">Judit Polgár</a>'s famous <a href="https://lichess.org/m4N5Qwyg" target="_blank" rel="nofollow noreferrer">win</a> against GM <a href="https://lichess.org/fide/5000017/Anand_Viswanathan" target="_blank" rel="nofollow noreferrer">Vishy Anand</a> in 1999.</p>
      </div></div><div class="daily-feed__update"><img src="https://lichess1.org/assets/______2/flair/img/symbols.white-star.webp" class="daily-feed__update__marker "/><div><a class="daily-feed__update__day" href="/feed">All updates »</a></div></div></div></div><div class="lobby__support"><a href="/patron"><i data-icon=""></i><span class="lobby__support__text"><strong>Поддержать проект</strong><span>Стать спонсором Lichess</span></span></a><a href="/swag"><i data-icon=""></i><span class="lobby__support__text"><strong>Swag Store</strong><span>В шахматном стиле</span></span></a></div><div class="lobby__about"><a href="/about">О Lichess</a><a href="/faq">ЧаВо</a><a href="/contact">Контакты</a><a href="/mobile">Мобильное приложение</a><a href="/terms-of-service">Пользовательское соглашение</a><a href="/privacy">Конфиденциальность</a><a href="/source">Исходный код</a><a href="/ads">Ads</a><div class="connect-links"><a href="/run/external-link/mastodon" target="_blank" rel="nofollow me">Mastodon</a><a href="/run/external-link/github" target="_blank" rel="nofollow">GitHub</a><a href="/run/external-link/discord" target="_blank" rel="nofollow">Discord</a><a href="/run/external-link/bluesky" target="_blank" rel="nofollow">Bluesky</a><a href="/run/external-link/youtube" target="_blank" rel="nofollow">YouTube</a><a href="/run/external-link/twitch" target="_blank" rel="nofollow">Twitch</a></div></div><div class="lobby__timeline"><div class="entries"></div></div> */}
      {/* </main></div> */}