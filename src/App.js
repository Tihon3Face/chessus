import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./components/Homepage";
import { CookiesProvider, useCookies } from 'react-cookie'
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';


function App() {
  // const [cookies, setCookie] = useCookies(['username'])
  // console.log(cookies)
  // function sendCookie(username) {
  //   setCookie('username', username, { path: '/' })
  // }
{/*sendCookie={sendCookie}*/};
  return (     
    <BrowserRouter basename="/lichessus">

      <Routes>
        <Route path="/" element={<Homepage username={'anonymous'}/>} />
         <Route path="/sign-up" element={<SignUp/>} /> 
        <Route path="/sign-in" element={<SignIn/>} />
      </Routes>

    </BrowserRouter>     
  );
}

export default App;




























// <body class="dark coords-in simple-board zenable" data-vapid="BGr5CL0QlEYa7qW7HLqe7DFkCeTsYMLsi1Db-5Vwt1QBIs6-WxN8066AjtP8S9u-w-CbleE8xWY-qQaNEMs7sAs" data-user="t_3face" data-username="T_3Face" data-sound-set="standard" data-socket-domains="socket0.lichess.org,socket3.lichess.org,socket1.lichess.org,socket4.lichess.org,socket2.lichess.org,socket5.lichess.org" data-asset-url="https://lichess1.org" data-asset-version="KQT1bN" data-theme="dark" data-board="brown" data-piece-set="cburnett" data-board3d="Woodi" data-piece-set3d="Basic">
//     <form id="blind-mode" action="/run/toggle-blind-mode" method="POST">
//         <input type="hidden" name="enable" value="1"/>
//         <input type="hidden" name="redirect" value="/tv"/>
//         <button type="submit">Accessibility: Enable blind mode</button>
//     </form>
//     <div id="zenzone">
//         <a href="/" class="zen-home"></a>
//         <a data-icon="" id="zentog" class="text fbt active">Режим Дзен</a>
//     </div>
//     <header id="top">
//         <div class="site-title-nav">
//             <input type="checkbox" id="tn-tg" class="topnav-toggle fullscreen-toggle" autocomplete="off" aria-label="Navigation"/>
//             <label for="tn-tg" class="fullscreen-mask"></label>
//             <label for="tn-tg" class="hbg">
//                 <span class="hbg__in"></span>
//             </label>
//             <a class="site-title" href="/">
//                 <div class="site-icon" data-icon=""></div>
//                 <div class="site-name">
//                     lichess<span>.org</span>
//                 </div>
//             </a>
//             <nav id="topnav" class="hover">
//                 <section>
//                     <a href="/">
//                         <span class="play">Игра</span>
//                         <span class="home">lichess.org</span>
//                     </a>
//                     <div role="group">
//                         <a href="/?any#hook">Создать игру</a>
//                         <a href="/tournament">Турниры «Арена»</a>
//                         <a href="/swiss">Турниры по Швейцарской системе</a>
//                         <a href="/simul">Сеанс одновременной игры</a>
//                     </div>
//                 </section>
//                 <section>
//                     <a href="/training">Задачи</a>
//                     <div role="group">
//                         <a href="/training">Задачи</a>
//                         <a href="/training/themes">Темы задач</a>
//                         <a href="/training/dashboard/30">Панель задач</a>
//                         <a href="/streak">Puzzle Streak</a>
//                         <a href="/storm">Puzzle Storm</a>
//                         <a href="/racer">Puzzle Racer</a>
//                     </div>
//                 </section>
//                 <section>
//                     <a href="/learn">Обучение</a>
//                     <div role="group">
//                         <a href="/learn">Основы шахмат</a>
//                         <a href="/practice">Практика</a>
//                         <a href="/training/coordinate">Координаты</a>
//                         <a href="/study">Студия</a>
//                         <a href="/coach">Тренеры</a>
//                     </div>
//                 </section>
//                 <section>
//                     <a href="/broadcast">Просмотр</a>
//                     <div role="group">
//                         <a href="/broadcast">Трансляции</a>
//                         <a href="/tv">Lichess TV</a>
//                         <a href="/games">Текущие партии</a>
//                         <a href="/streamer">Стримеры</a>
//                         <a href="/video">Видеотека</a>
//                     </div>
//                 </section>
//                 <section>
//                     <a href="/player">Сообщество</a>
//                     <div role="group">
//                         <a href="/player">Игроки</a>
//                         <a href="/@/T_3Face/following">Друзья</a>
//                         <a href="/team">Клубы</a>
//                         <a href="/forum">Форум</a>
//                         <a href="/blog/community">Блог</a>
//                     </div>
//                 </section>
//                 <section>
//                     <a href="/analysis">Инструменты</a>
//                     <div role="group">
//                         <a href="/analysis">Анализировать партию</a>
//                         <a href="/opening">Дебюты</a>
//                         <a href="/editor">Редактор доски</a>
//                         <a href="/paste">Импортировать партию</a>
//                         <a href="/games/search">Расширенный поиск</a>
//                     </div>
//                 </section>
//             </nav>
//         </div>
//         <div class="site-buttons">
//             <div id="warn-no-autoplay">
//                 <a data-icon="" target="_blank" href="/faq#autoplay"></a>
//             </div>
//             <div id="clinput">
//                 <a class="link">
//                     <span data-icon=""></span>
//                 </a>
//                 <input spellcheck="false" autocomplete="false" aria-label="Поиск" placeholder="Поиск" enterkeyhint="search"/>
//             </div>
//             <div>
//                 <button id="challenge-toggle" class="toggle link">
//                     <span title="Вызовов: 0" role="status" aria-label="Вызовов: 0" class="data-count" data-count="0" data-icon=""></span>
//                 </button>
//                 <div id="challenge-app" class="dropdown"></div>
//             </div>
//             <div>
//                 <button id="notify-toggle" class="toggle link">
//                     <span title="Уведомлений: 0" role="status" aria-label="Уведомлений: 0" class="data-count" data-count="0" data-icon=""></span>
//                 </button>
//                 <div id="notify-app" class="dropdown"></div>
//             </div>
//             <div class="dasher">
//                 <a id="user_tag" class="toggle link" href="/logout">T_3Face</a>
//                 <div id="dasher_app" class="dropdown"></div>
//             </div>
//         </div>
//     </header>
//     <div id="main-wrap" class="is2d">
//         <main class="round tv-single">
//             <aside class="round__side">
//                 <div class="game__meta">
//                     <section>
//                         <div class="game__meta__infos" data-icon="">
//                             <div class="header">
//                                 <div class="setup">
//                                     1+0 • Рейтинговая • <span title="Очень быстрые игры: менее 3 минут">Пуля</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="game__meta__players">
//                             <div class="player color-icon is white text">
//                                 <a class="user-link ulpt" href="/@/Vishyking64">
//                                     <span class="utitle" title="FIDE Master">FM</span>
//                                     &nbsp;Vishyking64<img class="uflair" src="https://lichess1.org/assets/______2/flair/img/people.person-rowing-boat-medium-dark-skin-tone.webp"/>
//                                     <span class="rating">(3054)</span>
//                                 </a>
//                             </div>
//                             <div class="player color-icon is black text">
//                                 <a class="user-link ulpt" href="/@/K-Georgiev">
//                                     <span class="utitle" title="Grandmaster">GM</span>
//                                     &nbsp;K-Georgiev<span class="rating">(2922)</span>
//                                 </a>
//                             </div>
//                         </div>
//                     </section>
//                 </div>
//                 <aside class="subnav">
//                     <nav class="subnav__inner">
//                         <a href="/tv/best" class="tv-channel best active">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Top Rated</strong>
//                                     <span class="champion">
//                                         GM &nbsp;K-Georgiev<rating>2922</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/bullet" class="tv-channel bullet">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Bullet</strong>
//                                     <span class="champion">
//                                         GM &nbsp;K-Georgiev<rating>2922</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/blitz" class="tv-channel blitz">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Blitz</strong>
//                                     <span class="champion">
//                                         vistagausta<rating>2845</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/rapid" class="tv-channel rapid">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Rapid</strong>
//                                     <span class="champion">
//                                         FM &nbsp;bolus2<rating>2565</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/classical" class="tv-channel classical">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Classical</strong>
//                                     <span class="champion">
//                                         Phillip_Shabelnikov<rating>2187</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/chess960" class="tv-channel chess960">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Chess960</strong>
//                                     <span class="champion">
//                                         ENGLISHENGLISH<rating>2234</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/kingOfTheHill" class="tv-channel kingOfTheHill">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>King of the Hill</strong>
//                                     <span class="champion">
//                                         anhtai2503<rating>2243</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/threeCheck" class="tv-channel threeCheck">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Three-check</strong>
//                                     <span class="champion">
//                                         guzmanelbueno<rating>1949</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/antichess" class="tv-channel antichess">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Antichess</strong>
//                                     <span class="champion">
//                                         GrohochetGrom<rating>2449</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/atomic" class="tv-channel atomic">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Atomic</strong>
//                                     <span class="champion">
//                                         Love_is_4ever<rating>2173</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/horde" class="tv-channel horde">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Horde</strong>
//                                     <span class="champion">
//                                         Mirdaz<rating>1771</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/racingKings" class="tv-channel racingKings">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Racing Kings</strong>
//                                     <span class="champion">
//                                         MQHO<rating>1500</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/crazyhouse" class="tv-channel crazyhouse">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Crazyhouse</strong>
//                                     <span class="champion">
//                                         elbjj<rating>2252</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/ultraBullet" class="tv-channel ultraBullet">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>UltraBullet</strong>
//                                     <span class="champion">
//                                         CM &nbsp;OlegPro1<rating>2304</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/bot" class="tv-channel bot">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Bot</strong>
//                                     <span class="champion">
//                                         BOT &nbsp;que-encrypt<rating>3218</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                         <a href="/tv/computer" class="tv-channel computer">
//                             <span data-icon="">
//                                 <span>
//                                     <strong>Computer</strong>
//                                     <span class="champion">
//                                         KrivovS<rating>2009</rating>
//                                     </span>
//                                 </span>
//                             </span>
//                         </a>
//                     </nav>
//                 </aside>
//             </aside>
//             <div class="round__app">
//                 <div class="round__app__board main-board">
//                     <div class="cg-wrap">
//                         <cg-container>
//                             <cg-board>
//                                 <square class="last-move" style={{top:"0.0%",left:"12.5%"}}></square>
//                                 <square class="last-move" style={{top:"25.0%",left:"25.0%"}}></square>
//                                 <piece class="white rook" style={{top:"87.5%",left:"0.0%"}}></piece>
//                                 <piece class="white rook" style={{top:"87.5%",left:"62.5%"}}></piece>
//                                 <piece class="white bishop" style={{top:"75.0%",left:"75.0%"}}></piece>
//                                 <piece class="white knight" style={{top:"62.5%",left:"62.5%"}}></piece>
//                                 <piece class="white pawn" style={{top:"75.0%",left:"62.5%"}}></piece>
//                                 <piece class="white bishop" style={{top:"87.5%",left:"25.0%"}}></piece>
//                                 <piece class="black knight" style={{top:"25.0%",left:"62.5%"}}></piece>
//                                 <piece class="black pawn" style={{top:"12.5%",left:"25.0%"}}></piece>
//                                 <piece class="black pawn" style={{top:"12.5%",left:"87.5%"}}></piece>
//                                 <piece class="white pawn" style={{top:"75.0%",left:"0.0%"}}></piece>
//                                 <piece class="white pawn" style={{top:"62.5%",left:"37.5%"}}></piece>
//                                 <piece class="white pawn" style={{top:"75.0%",left:"87.5%"}}></piece>
//                                 <piece class="white pawn" style={{top:"75.0%",left:"25.0%"}}></piece>
//                                 <piece class="black rook" style={{top:"0.0%",left:"0.0%"}}></piece>
//                                 <piece class="black knight" style={{top:"25.0%",left:"25.0%"}}></piece>
//                                 <piece class="black bishop" style={{top:"37.5%",left:"62.5%"}}></piece>
//                                 <piece class="black bishop" style={{top:"0.0%",left:"62.5%"}}></piece>
//                                 <piece class="white knight" style={{top:"87.5%",left:"12.5%"}}></piece>
//                                 <piece class="white king" style={{top:"87.5%",left:"75.0%"}}></piece>
//                                 <piece class="black king" style={{top:"0.0%",left:"50.0%"}}></piece>
//                                 <piece class="white pawn" style={{top:"75.0%",left:"12.5%"}}></piece>
//                                 <piece class="black pawn" style={{top:"12.5%",left:"62.5%"}}></piece>
//                                 <piece class="white pawn" style={{top:"62.5%",left:"75.0%"}}></piece>
//                                 <piece class="black pawn" style={{top:"25.0%",left:"50.0%"}}></piece>
//                                 <piece class="black queen" style={{top:"0.0%",left:"37.5%"}}></piece>
//                                 <piece class="white pawn" style={{top:"75.0%",left:"50.0%"}}></piece>
//                                 <piece class="black pawn" style={{top:"12.5%",left:"75.0%"}}></piece>
//                                 <piece class="black pawn" style={{top:"12.5%",left:"12.5%"}}></piece>
//                                 <piece class="white queen" style={{top:"87.5%",left:"37.5%"}}></piece>
//                                 <piece class="black pawn" style={{top:"37.5%",left:"37.5%"}}></piece>
//                                 <piece class="black pawn" style={{top:"12.5%",left:"0.0%"}}></piece>
//                                 <piece class="black rook" style={{top:"0.0%",left:"87.5%"}}></piece>
//                             </cg-board>
//                         </cg-container>
//                     </div>
//                 </div>
//                 <div class="col1-rmoves-preload"></div>
//             </div>
//             <div class="round__underboard">
//                 <div class="crosstable">
//                     <fill style={{flex:"12.75 1 auto"}}></fill>
//                     <povs>
//                         <a href="/CF5pmFer?pov=k-georgiev" class="glpt loss">0</a>
//                         <a href="/CF5pmFer?pov=vishyking64" class="glpt win">1</a>
//                     </povs>
//                     <povs>
//                         <a href="/37G3yh0G?pov=k-georgiev" class="glpt">½</a>
//                         <a href="/37G3yh0G?pov=vishyking64" class="glpt">½</a>
//                     </povs>
//                     <povs>
//                         <a href="/AupqNJri?pov=k-georgiev" class="glpt win">1</a>
//                         <a href="/AupqNJri?pov=vishyking64" class="glpt loss">0</a>
//                     </povs>
//                     <div class="crosstable__users">
//                         <a class="user-link ulpt" href="/@/K-Georgiev">
//                             <span class="utitle" title="Grandmaster">GM</span>
//                             &nbsp;K-Georgiev
//                         </a>
//                         <a class="user-link ulpt" href="/@/Vishyking64">
//                             <span class="utitle" title="FIDE Master">FM</span>
//                             &nbsp;Vishyking64<img class="uflair" src="https://lichess1.org/assets/______2/flair/img/people.person-rowing-boat-medium-dark-skin-tone.webp"/>
//                         </a>
//                     </div>
//                     <div class="crosstable__score force-ltr" title="Счёт за всё время">
//                         <span>1½</span>
//                         <span>1½</span>
//                     </div>
//                 </div>
//                 <div class="tv-history">
//                     <h2>Ранее на Lichess TV</h2>
//                     <div class="now-playing">
//                         <a href="/JIBu7V81/black" class="mini-game mini-game-JIBu7V81 mini-game--init standard is2d" data-tc="60+0" data-state="6k1/p3npb1/2R3p1/1Q6/4PPq1/3p2Pp/1B5P/6K1 b,black,c1c6">
//                             <span class="mini-game__player">
//                                 <span class="mini-game__user">
//                                     CGK_ARCA<img class="uflair" src="https://lichess1.org/assets/______2/flair/img/symbols.japanese-secret-button.webp"/>
//                                     <span class="rating">3110</span>
//                                 </span>
//                                 <span class="mini-game__result">0</span>
//                             </span>
//                             <span class="cg-wrap">
//                                 <cg-container>
//                                     <cg-board></cg-board>
//                                 </cg-container>
//                             </span>
//                             <span class="mini-game__player">
//                                 <span class="mini-game__user">
//                                     <span class="utitle" title="International Master">IM</span>
//                                     &nbsp;rob188<span class="rating">3118</span>
//                                 </span>
//                                 <span class="mini-game__result">1</span>
//                             </span>
//                         </a>
//                         <a href="/WsHv5Cef/black" class="mini-game mini-game-WsHv5Cef mini-game--init standard is2d" data-tc="60+0" data-state="8/1KN5/1b6/8/P6k/8/8/8 b,black,a7b7">
//                             <span class="mini-game__player">
//                                 <span class="mini-game__user">
//                                     <span class="utitle" title="Grandmaster">GM</span>
//                                     &nbsp;ChessPathshala<span class="rating">2896</span>
//                                 </span>
//                                 <span class="mini-game__result">1</span>
//                             </span>
//                             <span class="cg-wrap">
//                                 <cg-container>
//                                     <cg-board></cg-board>
//                                 </cg-container>
//                             </span>
//                             <span class="mini-game__player">
//                                 <span class="mini-game__user">
//                                     ReluctantCannibal<span class="rating">3017</span>
//                                 </span>
//                                 <span class="mini-game__result">0</span>
//                             </span>
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     </div>
//     <div id="friend_box">
//         <div class="friend_box_title">
//             <i data-icon=""></i>
//             друзей онлайн
//         </div>
//         <div class="content_wrap none">
//             <div class="content list"></div>
//         </div>
//     </div>
//     <a id="network-status" class="link text" data-icon=""></a>
//     <svg width="0" height="0">
//         <mask id="mask">
//             <path fill="#fff" stroke="#fff" stroke-linejoin="round" d="M38.956.5c-3.53.418-6.452.902-9.286 2.984C5.534 1.786-.692 18.533.68 29.364 3.493 50.214 31.918 55.785 41.329 41.7c-7.444 7.696-19.276 8.752-28.323 3.084C3.959 39.116-.506 27.392 4.683 17.567 9.873 7.742 18.996 4.535 29.03 6.405c2.43-1.418 5.225-3.22 7.655-3.187l-1.694 4.86 12.752 21.37c-.439 5.654-5.459 6.112-5.459 6.112-.574-1.47-1.634-2.942-4.842-6.036-3.207-3.094-17.465-10.177-15.788-16.207-2.001 6.967 10.311 14.152 14.04 17.663 3.73 3.51 5.426 6.04 5.795 6.756 0 0 9.392-2.504 7.838-8.927L37.4 7.171z"/>
//         </mask>
//     </svg>
    
    
// </body>