import { Component } from 'react';
import './GameList.css'
class GameList extends Component {
  render () {
    let status = null
    if (this.props.games.length === 0) { status = 'No games saved yet' }
    return(
      <div className="game-list">
        Saved Games: {status}

        <ul>
          {
            this.props.games.map((game, i) => {
              return  <li onClick={() => this.props.onSelectGame(i, game)} key={i}>Game {i}</li>
            })
          }
        </ul>
      </div>
    )
  }
}

export default GameList
