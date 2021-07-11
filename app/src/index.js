import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';


class Cell extends Component {
  render () {
    let content = null

    if (this.props.status === 'covered') {
      content = 'C'
    } else if (this.props.status === 'flagged' ) {
      content = 'F'
    } else {
      content = this.props.value
    }

    return (
      <div
        className="cell"
        onContextMenu={ (e) => e.preventDefault() }
        onMouseDown={
          (e) => {
            this.props.onClick(e.buttons)
          }
        }
      >
        {content}
      </div>
    )
  }
}

class Board extends Component {
  constructor(props) {
    super(props)

    let rowsCount = 10
    let collumnsCount = 15
    let grid = []
    for (let i = 0; i < rowsCount; i++) {
      let row = Array(collumnsCount).fill({ value: 0, status: 'covered'})
      grid.push(row)
    }

    this.state = {
      grid: grid
    }
  }

  handleClick(buttons, i, j) {
    let grid = this.state.grid.slice();
    let status = null

    if (buttons === 1) {
      status = 'uncovered'
    } else if (buttons === 2) {
      if (grid[i][j]['status'] === 'flagged') {
        status = 'covered'
      } else {
        status = 'flagged'
      }
    }

    grid[i][j] = { value: 2, status: status }

    this.setState({ grid: grid })
  }

  render () {
    return (
      <div>
        {
          this.state.grid.map((row, i) => {
              return(
                <ul className="row" key={i}>
                  {
                    row.map((cel, j) => {
                        return(
                          <Cell
                            key={j}
                            value={cel['value']}
                            status={cel['status']}
                            onClick = {
                              (buttons) => {
                                this.handleClick(buttons, i, j)
                              }
                            }
                          />
                        )
                      }
                    )
                  }
                </ul>
              )
            }
          )
        }
      </div>
    )
  }
}

class Game extends Component {
  render () {
    return(
      <div className="game">
        <div className="game-board">
            <Board />
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
reportWebVitals();
