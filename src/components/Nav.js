import { Container, Tab } from '@mui/material';
import React, { useState } from 'react';
import logo from '../images/logo.svg';

function Nav({username,children}) {
    const [shown,setShown] = useState(false);
    document.documentElement.addEventListener("click",(e) => e.target.closest('.dasher') != document.getElementsByClassName("dasher")[0] ? setShown(false) : null)

    return (
      <header id="top">
        <div className="site-title-nav" >
          <input type="checkbox" id="tn-tg" className="topnav-toggle fullscreen-toggle" autoComplete="off" aria-label="Navigation"/>
          <label htmlFor="tn-tg" className="fullscreen-mask"></label>
          <label htmlFor="tn-tg" className="hbg">
            <span className="hbg__in"></span>
          </label>
          <a className="site-title" href=""  >
              <svg className="site-icon csvg" width="39" height="39" viewBox="0 0 960 961" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M418.375 246.355C417.569 246.107 416.643 245.965 415.683 245.965C411.333 245.965 407.669 248.895 406.553 252.887L406.538 252.953C374.548 364.321 519.268 476.049 615.038 549.987C641.151 570.141 663.665 587.537 678.661 601.652C720.388 638.507 756.506 680.282 786.521 726.394L787.949 728.736C789.579 731.848 792.787 733.936 796.483 733.936C797.359 733.936 798.208 733.818 799.015 733.598L798.948 733.614C800.826 733.094 987.933 681.629 956.258 550.706C956.032 549.796 955.718 548.996 955.312 548.253L955.339 548.307L728.169 136.227L757.199 11.783C757.359 11.127 757.452 10.373 757.452 9.6C757.452 4.298 753.154 0 747.852 0C747.454 0 747.062 0.0239997 746.677 0.0699997L746.723 0.0659981C679.521 2.766 617.701 23.646 565.415 57.884L566.775 57.048C373.072 44.135 218.155 93.038 118.385 198.568C44.934 280.004 0 388.398 0 507.291C0 527.615 1.313 547.631 3.86 567.261L3.613 564.944C32.717 756.722 177.697 907.785 363.817 945.618L366.75 946.115C401.83 954.653 442.128 959.603 483.565 959.711H483.635C488.335 959.923 493.845 960.044 499.383 960.044C623.171 960.044 732.863 899.696 800.647 806.814L801.384 805.754C802.374 804.269 802.964 802.444 802.964 800.48C802.964 795.178 798.664 790.88 793.364 790.88C790.679 790.88 788.252 791.982 786.51 793.757C709.263 870.955 602.574 918.699 484.734 918.699C399.37 918.699 319.858 893.645 253.15 850.489L254.822 851.501C137.416 781.861 59.942 655.771 59.942 511.587C59.942 449.824 74.159 391.381 99.496 339.351L98.468 341.687C164.902 209.041 299.774 119.574 455.541 119.574C491.093 119.574 525.556 124.234 558.353 132.978L555.573 132.348C556.087 132.444 556.678 132.498 557.283 132.498C559.083 132.498 560.769 132.012 562.217 131.163L562.172 131.188L575.568 123.31C608.396 100.54 646.774 82.913 688.066 72.67L690.456 72.167L662.704 151.863C662.367 152.807 662.174 153.897 662.174 155.033C662.174 156.841 662.668 158.535 663.529 159.986L663.505 159.94L906.715 567.5C905.03 619.37 867.635 662.033 818.399 671.794L817.699 671.909C793.537 627.952 762.709 590.785 726.106 560.323L725.486 559.821C700.37 538.393 672.652 517.848 643.571 499.246L640.551 497.439C546.018 433.419 403.138 336.686 424.971 258.149C425.201 257.369 425.331 256.476 425.331 255.551C425.331 251.198 422.421 247.524 418.441 246.371L418.373 246.353L418.375 246.355Z" fill="#ACACAB"/></svg>
              <div className="site-name" >
                chessus<span>.org</span>
              </div>
          </a>
          <nav id="topnav" className="hover">
            <section>
              <a href="#">
                <span className="play">Игра</span>
                <span className="home">chessus.org</span>
              </a>
              <div role="group">
                <a href="#">Создать игру</a>
                <a href="#">Турниры «Арена»</a>
                <a href="#">Турниры по Швейцарской системе</a>
                <a href="#">Сеанс одновременной игры</a>
              </div>
            </section>
            <section>
              <a href="#">Задачи</a>
              <div role="group">
                <a href="#">Задачи</a>
                <a href="#">Темы задач</a>
                <a href="#">Панель задач</a>
                <a href="#">Puzzle Streak</a>
                <a href="#">Puzzle Storm</a>
                <a href="#">Puzzle Racer</a>
              </div>
            </section>
            <section>
              <a href="#">Обучение</a>
              <div role="group">
                <a href="#">Основы шахмат</a>
                <a href="#">Практика</a>
                <a href="#">Координаты</a>
                <a href="#">Студия</a>
                <a href="#">Тренеры</a>
                </div>
            </section>
            <section>
              <a href="#">Просмотр</a>
              <div role="group">
                <a href="#">Трансляции</a>
                  <a href="#">Lichess TV</a>
                    <a href="#">Текущие партии</a>
                    <a href="#">Стримеры</a>
                    <a href="#">Видеотека</a>
                </div>
            </section>
            <section>
                <a href="#">Сообщество</a>
                <div role="group">
                    <a href="#">Игроки</a>
                    <a href="#">Друзья</a>
                    <a href="#">Клубы</a>
                    <a href="#">Форум</a>
                    <a href="#">Блог</a>
                </div>
            </section>
            <section>
                <a href="#">Инструменты</a>
                <div role="group">
                    <a href="#">Анализировать партию</a>
                    <a href="#">Дебюты</a>
                    <a href="#">Редактор доски</a>
                    <a href="#">Импортировать партию</a>
                    <a href="#">Расширенный поиск</a>
                </div>
            </section>
          </nav>
        </div>
        <div className="site-buttons">
          <div id="warn-no-autoplay">
              <a data-icon="" target="_blank" href="#"></a>
          </div>
          <div id="clinput">
              <a className="link">
                  <span data-icon=""></span>
              </a>
              <input spellCheck="false" autoComplete="false" aria-label="Поиск" placeholder="Поиск" enterKeyHint="search"/>
          </div>
          <div>
              <button id="challenge-toggle" className="toggle link">
                  <span title="Вызовов: 0" role="status" aria-label="Вызовов: 0" className="data-count" data-count="0" data-icon=""></span>
              </button>
              <div id="challenge-app" className="dropdown"></div>
          </div>
          <div>
              <button id="notify-toggle" className="toggle link">
                  <span title="Уведомлений: 0" role="status" aria-label="Уведомлений: 0" className="data-count" data-count="0" data-icon=""></span>
              </button>
              <div id="notify-app" className="dropdown"></div>
          </div>
          <div className={shown ? "dasher shown" : "dasher"}>
              <a id="user_tag" className="toggle link" href="#" onClick={() => setShown((prev) => !prev)}>{username}</a>
              <div id="dasher_app" class="dropdown">
                <div>
                    <div class="links">
                        <a class="user-link online text is-green" href="#" data-icon="">Профиль</a>
                        <a class="text" href="#" data-icon="">Входящие</a>
                        <a class="text" href="#" data-icon="">Настройки</a>
                        <form class="logout" method="post" action="#">
                            <button class="text" type="submit" data-icon="">Выйти</button>
                        </form>
                    </div>
                    <div class="subs">
                        <button class="sub" data-icon="" type="button">Язык (Language)</button>
                        <button class="sub" data-icon="" type="button">Звук</button>
                        <button class="sub" data-icon="" type="button">Тема</button>
                        <button class="sub" data-icon="" type="button">Доска</button>
                        <button class="sub" data-icon="" type="button">Оформление фигур</button>
                    </div>
                    <a class="status" href="#">
                        <signal class="q3"><i></i><i></i><i></i><i class="off"></i></signal>
                        <span class="ping" title="PING: Задержки передачи данных между вами и серверами lichess"><em>PING</em><strong>181</strong><em>ms</em></span>
                        <span class="server" title="SERVER: Время обработки хода на сервере"><em>SERVER</em><strong>1</strong><em>ms</em></span>
                    </a>
                </div>
              </div>
          </div>
        </div>
      </header>
    );
}

export default Nav;







{/* <div className={shown ? "dasher shown" : "dasher"}>
<a id="user_tag" className="toggle link" href="#" onClick={() => setShown((prev) => !prev)}>{username}</a>
<div id="dasher_app" class="dropdown">
  <div>
      <div class="links">
          <a class="user-link online text is-green" href="/@/T_3Face" data-icon="">Профиль</a>
          <a class="text" href="/inbox" data-icon="">Входящие</a>
          <a class="text" href="/account/profile" data-icon="">Настройки</a>
          <form class="logout" method="post" action="/logout">
          <button class="text" type="submit" data-icon="">Выйти</button>
          </form>
      </div>
      <div class="subs">
          <button class="sub" data-icon="" type="button">Язык (Language)</button>
          <button class="sub" data-icon="" type="button">Звук</button>
          <button class="sub" data-icon="" type="button">Тема</button>
          <button class="sub" data-icon="" type="button">Доска</button>
          <button class="sub" data-icon="" type="button">Оформление фигур</button>
      </div>
      <a class="status" href="/lag">
          <signal class="q3"><i></i><i></i><i></i><i class="off"></i></signal>
          <span class="ping" title="PING: Задержки передачи данных между вами и серверами lichess"><em>PING</em><strong>181</strong><em>ms</em></span>
          <span class="server" title="SERVER: Время обработки хода на сервере"><em>SERVER</em><strong>1</strong><em>ms</em></span>
      </a>
  </div>
</div>
</div> */}




{/* <header id="top">
            <div className="site-title-nav">
              <input type="checkbox" id="tn-tg" className="topnav-toggle fullscreen-toggle" autoComplete="off" aria-label="Navigation"/>
                <label htmlFor="tn-tg" className="fullscreen-mask"></label>
                <label htmlFor="tn-tg" className="hbg">
                    <span className="hbg__in"></span>
                </label>
                <a className="site-title" href="/">
                    <div className="site-icon" data-icon=""></div>
                    <div className="site-name">
                        lichess<span>.org</span>
                    </div>
                </a>
                <nav id="topnav" className="hover">
                    <section>
                        <a href="/">
                            <span className="play">Игра</span>
                            <span className="home">lichess.org</span>
                        </a>
                        <div role="group">
                            <a href="/?any#hook">Создать игру</a>
                            <a href="/tournament">Турниры «Арена»</a>
                            <a href="/swiss">Турниры по Швейцарской системе</a>
                            <a href="/simul">Сеанс одновременной игры</a>
                        </div>
                    </section>
                    <section>
                        <a href="/training">Задачи</a>
                        <div role="group">
                            <a href="/training">Задачи</a>
                            <a href="/training/themes">Темы задач</a>
                            <a href="/training/dashboard/30">Панель задач</a>
                            <a href="/streak">Puzzle Streak</a>
                            <a href="/storm">Puzzle Storm</a>
                            <a href="/racer">Puzzle Racer</a>
                        </div>
                    </section>
                    <section>
                        <a href="/learn">Обучение</a>
                        <div role="group">
                            <a href="/learn">Основы шахмат</a>
                            <a href="/practice">Практика</a>
                            <a href="/training/coordinate">Координаты</a>
                            <a href="/study">Студия</a>
                            <a href="/coach">Тренеры</a>
                        </div>
                    </section>
                    <section>
                        <a href="/broadcast">Просмотр</a>
                        <div role="group">
                            <a href="/broadcast">Трансляции</a>
                            <a href="/tv">Lichess TV</a>
                            <a href="/games">Текущие партии</a>
                            <a href="/streamer">Стримеры</a>
                            <a href="/video">Видеотека</a>
                        </div>
                    </section>
                    <section>
                        <a href="/player">Сообщество</a>
                        <div role="group">
                            <a href="/player">Игроки</a>
                            <a href="/@/T_3Face/following">Друзья</a>
                            <a href="/team">Клубы</a>
                            <a href="/forum">Форум</a>
                            <a href="/blog/community">Блог</a>
                        </div>
                    </section>
                    <section>
                        <a href="/analysis">Инструменты</a>
                        <div role="group">
                            <a href="/analysis">Анализировать партию</a>
                            <a href="/opening">Дебюты</a>
                            <a href="/editor">Редактор доски</a>
                            <a href="/paste">Импортировать партию</a>
                            <a href="/games/search">Расширенный поиск</a>
                        </div>
                    </section>
                </nav>
            </div>
            <div className="site-buttons">
                <div id="warn-no-autoplay">
                    <a data-icon="" target="_blank" href="/faq#autoplay"></a>
                </div>
                <div id="clinput">
                    <a className="link">
                        <span data-icon=""></span>
                    </a>
                    <input spellCheck="false" autoComplete="false" aria-label="Поиск" placeholder="Поиск" enterKeyHint="search"/>
                </div>
                <div>
                    <button id="challenge-toggle" className="toggle link">
                        <span title="Вызовов: 0" role="status" aria-label="Вызовов: 0" className="data-count" data-count="0" data-icon=""></span>
                    </button>
                    <div id="challenge-app" className="dropdown"></div>
                </div>
                <div>
                    <button id="notify-toggle" className="toggle link">
                        <span title="Уведомлений: 0" role="status" aria-label="Уведомлений: 0" className="data-count" data-count="0" data-icon=""></span>
                    </button>
                    <div id="notify-app" className="dropdown"></div>
                </div>
                <div className="dasher">
                    <a id="user_tag" className="toggle link" href="/logout">T_3Face</a>
                    <div id="dasher_app" className="dropdown"></div>
                </div>
            </div>
        </header> */}