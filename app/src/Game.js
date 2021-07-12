import { Component } from 'react';
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

export default Game
