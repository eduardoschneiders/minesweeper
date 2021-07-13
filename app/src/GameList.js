import { Component } from 'react';

class GameList extends Component {
  render () {
    return(
      <ul>
        {
          this.props.games.map((game, i) => {
            return  <li onClick={() => this.props.onSelectGame(i, game)} key={i}>{i}</li>
          })
        }
      </ul>
    )
  }
}

export default GameList
