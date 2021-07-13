import { Component } from 'react';
import GameList from './GameList.js';
import Board from './Board.js';

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      games: [],
      initialState: null,
      currentGameId: null
    }
  }

  onStartGame(game_state) {
    let games = this.state.games
    games.push(game_state)

    let currentGameId = games.length -1
    this.setState({
      games: games,
      currentGameId: currentGameId
    })

  }

  onSaveGame(game_state) {
    let games = this.state.games
    let currentGameId

    if (this.state.currentGameId !== null) {
      games[this.state.currentGameId] = game_state
      currentGameId = this.state.currentGameId
    } else {
      games.push(game_state)
      currentGameId = games.length -1
    }

    this.setState({
      games: games,
      currentGameId: currentGameId
    })
  }

  onSelectGame(id, game) {
    this.setState({
      currentGameId: id,
      currentGame: game
    })

  }

  render () {
    return(
      <div className="game">
        <button onClick={() => console.log(this.state)}>state</button>
        <GameList games={this.state.games} onSelectGame={this.onSelectGame.bind(this)}/>
        <div className="game-form">

        </div>
        <div className="game-board">
          <Board
            onSaveGame={(state) => this.onSaveGame(state) }
            currentGameId={this.state.currentGameId}
            currentGame={this.state.games[this.state.currentGameId]}
            onStartGame={this.onStartGame.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default Game
