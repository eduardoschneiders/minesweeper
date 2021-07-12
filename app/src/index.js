import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board.js';








class Game extends Component {
  render () {
    return(
      <div className="game">
        <div className="game-form">

        </div>
        <div className="game-board">
          <Board/>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


