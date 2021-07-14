import { Component } from 'react';
import GameList from './GameList.js';
import Board from './Board.js';
import User from './User.js';
import './Game.css'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      games: [],
      initialState: null,
      currentGameId: null,
      currentUser: null
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

    if (this.state.currentUser) {
      let id = this.state.currentUser.id
      fetch('http://localhost:5000/api/v1/users/' + id + '/games',
          {
            method: "post",
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({games: games})
          }
        )
          .then(data => data.json())
          .then(data => {
            alert('Game saved')
          })
          .catch(function(error) {
            alert('Error saving the game: ' + error.message);
          });
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

  onSignup(user) {
    this.setState({
      currentUser: user
    })
  }

  onSignin(user) {
    let games = JSON.parse(user.games)

    this.setState({
      currentUser: user,
      games: games
    })
  }

  render () {
    return(
      <div className="game">
        <div className="blur">
          <div className="game-board">
            <Board
              onSaveGame={(state) => this.onSaveGame(state) }
              currentGameId={this.state.currentGameId}
              currentGame={this.state.games[this.state.currentGameId]}
              onStartGame={this.onStartGame.bind(this)}
            />
          </div>

          <User onSignup={this.onSignup.bind(this)} onSignin={this.onSignin.bind(this)} />
          <GameList games={this.state.games} onSelectGame={this.onSelectGame.bind(this)}/>
        </div>
      </div>
    )
  }
}

export default Game
