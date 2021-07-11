import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import randomInt from './randomInt';


class Cell extends Component {
  render () {
    let content = null

    if (this.props.status === 'covered') {
      content = 'C'
    } else if (this.props.status === 'flagged') {
      content = 'F'
    } else if (this.props.status === 'hasBomb') {
      content = 'B'
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
    let bombsCount = 10
    let grid = []
    for (let i = 0; i < rowsCount; i++) {
      let row = Array(collumnsCount).fill({ value: 0, status: 'covered'})
      grid.push(row)
    }

    this.state = {
      grid: grid,
      rowsCount: rowsCount,
      collumnsCount: collumnsCount,
      bombsCount: bombsCount,
      gridSeted: false,
      gameInGoodCondition: true
    }
  }

  setGrid(rowClicked, collumnClicked){
    let grid = this.state.grid.slice();

    for (let i = 0; i < this.state['bombsCount']; i++) {
      let row = randomInt(0, this.state['rowsCount'] - 1)
      let collumn = randomInt(0, this.state['collumnsCount'] - 1)
      let cell = clone(grid[row][collumn])

      if (cell['hasBomb'] || (row === rowClicked && collumn === collumnClicked)) {
        i--
        continue
      }

      cell['hasBomb'] = true
      console.log(i, row, collumn)
      grid[row][collumn] = cell
    }

    grid.forEach((row, i) => {
      row.forEach((collumn, j) => {
        let cell = clone(collumn)
        cell['value'] = calculateBombs(i, j, this.state.rowsCount, this.state.collumnsCount, grid)
        grid[i][j] = cell
      })
    });

    this.setState({
      grid: grid,
      gridSeted: true
    })
  }

  handleClick(buttons, i, j) {
    if (!this.state.gameInGoodCondition) { return }
    let grid = this.state.grid.slice();
    let status = null
    let cell = clone(grid[i][j])

    if (!this.state.gridSeted) {
      this.setGrid(i, j)
    }

    if (cell['hasBomb']) {
      this.setState({gameInGoodCondition: false})
    }

    if (cell['hasBomb']) {
      status = 'hasBomb'
    } else if (buttons === 1) {
      status = 'uncovered'
    } else if (buttons === 2) {
      if (cell['status'] === 'flagged') {
        status = 'covered'
      } else {
        status = 'flagged'
      }
    }

    cell['status'] = status

    grid[i][j] = cell

    this.setState({ grid: grid })
  }


  render () {
    let status = this.state.gameInGoodCondition ? 'Good conditions' : 'Lost the game'

    return (
      <div>
        Status: {status}
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
                            hasBomb={cel['hasBomb']}
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
// reportWebVitals();

function clone(hash) {
  var json = JSON.stringify(hash);
  var object = JSON.parse(json);

  return object;
}

function calculateBombs(row, collumn, maxRows, maxCollumns, grid) {
  let total = 0

  total += fetchCellBomb(row - 1, collumn - 1, grid)
  total += fetchCellBomb(row - 1, collumn - 0, grid)
  total += fetchCellBomb(row - 1, collumn + 1, grid)
  total += fetchCellBomb(row - 0, collumn + 1, grid)
  total += fetchCellBomb(row + 1, collumn + 1, grid)
  total += fetchCellBomb(row + 1, collumn + 0, grid)
  total += fetchCellBomb(row + 1, collumn - 1, grid)
  total += fetchCellBomb(row + 0, collumn - 1, grid)


  return total
}

function fetchCellBomb(i, j, grid){
  try {
    return grid[i][j]['hasBomb'] ? 1 : 0
  } catch (TypeError) {
    return 0
  }
}


