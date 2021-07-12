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

    let defaultRows = 10
    let defaultCollumns = 15
    let grid = []

    for (let i = 0; i < defaultRows; i++) {
      let row = Array(defaultCollumns).fill({ value: 0, status: 'covered'})
      grid.push(row)
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeRows = this.handleChangeRows.bind(this);
    this.handleChangeCollumns = this.handleChangeCollumns.bind(this);
    this.handleChangeBombs = this.handleChangeBombs.bind(this);

    this.state = {
      targetRows: 10,
      targetCollumns: 15,
      targetBombs: 10,
      rows: 10,
      collumns: 15,
      bombs: 10,
      grid: grid,
      gridSeted: false,
      gameStaredAt: null,
      gameWin: false,
      gameLost: false
    }
  }

  setGrid(rowClicked, collumnClicked){
    let grid = this.state.grid.slice();

    for (let i = 0; i < this.state.bombs; i++) {
      let row = randomInt(0, this.state.rows - 1)
      let collumn = randomInt(0, this.state.collumns - 1)
      let cell = clone(grid[row][collumn])

      if (cell['hasBomb'] || (row === rowClicked && collumn === collumnClicked)) {
        i--
        continue
      }

      cell['hasBomb'] = true
      grid[row][collumn] = cell
    }

    grid.forEach((row, i) => {
      row.forEach((collumn, j) => {
        let cell = clone(collumn)
        cell['value'] = calculateBombs(i, j, grid)
        grid[i][j] = cell
      })
    });

    this.setState({
      grid: grid,
      gridSeted: true,
    })

    if (!this.state.gameStaredAt) {
      this.setState({
        gameStaredAt: new Date()
      })
    }
  }

  handleClick(buttons, i, j) {
    if (!this.state.gridSeted) {
      this.setGrid(i, j)
    }

    if (this.state.gameLost) { return }
    if (buttons === 2 && !this.state.gridSeted) { return }

    let grid = this.state.grid.slice();
    let status = null
    let cell = clone(grid[i][j])

    if (buttons === 1) {
      if (cell['hasBomb']) {
        this.setState({gameLost: true})

        grid.forEach((row, i) => {
          row.forEach((collumn, j) => {
            let newCell = clone(collumn)
            if (newCell['hasBomb']) {
              newCell['status'] = 'hasBomb'
              grid[i][j] = newCell
            }
          })
        });

        status = 'hasBomb'
      } else {
        status = 'uncovered'
      }
    } else if (buttons === 2) {
      if (cell['status'] === 'uncovered') { return }

      if (cell['status'] === 'flagged') {
        status = 'covered'
      } else {
        status = 'flagged'
      }
    } else if (buttons === 4) {
      if (cell['status'] === 'covered' || cell['value'] !== 0) { return }

      grid = revealAround(i, j, grid, true)
    }


    if (status) { cell['status'] = status }

    grid[i][j] = cell

    this.setState({ grid: grid, gameWin: calculateWinner(this.state.rows * this.state.collumns, this.state.bombs, grid) })
  }

  handleChangeRows(event) {
    this.setState({targetRows: parseInt(event.target.value)});
  }

  handleChangeCollumns(event) {
    this.setState({targetCollumns: parseInt(event.target.value)});
  }

  handleChangeBombs(event) {
    this.setState({targetBombs: parseInt(event.target.value)});
  }

  handleSubmit(event) {
    this.setState({
      rows: this.state.targetRows,
      collumns: this.state.targetCollumns,
      bombs: this.state.targetBombs,
      gameStaredAt: new Date(),
      gameWin: false,
      gameLost: false,
      gridSeted: false
    })

    let grid = []

    for (let i = 0; i < this.state.targetRows; i++) {
      let row = Array(this.state.targetCollumns).fill({ value: 0, status: 'covered'})
      grid.push(row)
    }

    this.setState({
      grid: grid
    })

    event.preventDefault();
  }

  bombsFound(grid){
    let total = 0

    grid.forEach((row, i) => {
      row.forEach((collumn, j) => {
        if (collumn['status'] === 'flagged') { total++ }
      })
    });

    return total
  }

  componentDidMount() {
    this.interval = setInterval(
      () => {
        if (!this.state.gameWin && !this.state.gameLost) {
          this.setState({ time: Date.now() })
        }
      }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  render () {
    let status = null
    if (this.state.gameWin) {
      status = 'Victory'
    } else if (this.state.gameLost) {
      status = 'Lost the game'
    }

    let timeStatus = null
    if (this.state.gameStaredAt) {
      timeStatus = parseInt((this.state.time - this.state.gameStaredAt) / 1000)
    } else {
      timeStatus = 0
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Rows:
            <input type="text" value={this.state.targetRows} onChange={this.handleChangeRows} />
          </label>

          <label>
            Collumns:
            <input type="text" value={this.state.targetCollumns} onChange={this.handleChangeCollumns} />
          </label>

          <label>
            Bombs:
            <input type="text" value={this.state.targetBombs} onChange={this.handleChangeBombs} />
          </label>

          <input type="submit" value="Start new game" />
        </form>

        Time: {timeStatus}<br />
        bombs: {this.state.bombs - this.bombsFound(this.state.grid)}<br />


        <strong>{status}</strong>
        <table>
          <tbody>
            {
              this.state.grid.map((row, i) => {
                  return(
                    <tr className="row" key={i}>
                      {
                        row.map((cel, j) => {
                            return(
                              <td key={j}>
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
                              </td>
                            )
                          }
                        )
                      }
                    </tr>
                  )
                }
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}


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

function clone(hash) {
  var json = JSON.stringify(hash);
  var object = JSON.parse(json);

  return object;
}

function calculateBombs(row, collumn, grid) {
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

function revealAround(i, j, grid, first) {
  let cell = fetchCell(i, j, grid)
  if (first || (cell && cell['status'] !== 'uncovered')) {
    cell['status'] = 'uncovered'
    grid[i][j] = cell

    if (cell['value'] === 0) {
      grid = revealAround(i - 1, j - 1, grid, false)
      grid = revealAround(i - 1, j - 0, grid, false)
      grid = revealAround(i - 1, j + 1, grid, false)
      grid = revealAround(i - 0, j + 1, grid, false)
      grid = revealAround(i + 1, j + 1, grid, false)
      grid = revealAround(i + 1, j + 0, grid, false)
      grid = revealAround(i + 1, j - 1, grid, false)
      grid = revealAround(i + 0, j - 1, grid, false)
    }
  }

  return grid
}

function fetchCell(i, j, grid){
  try {
    return grid[i][j]
  } catch (TypeError) {
    return false
  }
}

function calculateWinner(totalCells, totalBombs, grid) {
  let cellsRevealed = 0

  grid.forEach((row, i) => {
    row.forEach((collumn, j) => {
      if (collumn['status'] === 'uncovered') { cellsRevealed++ }
    })
  });

  return cellsRevealed === totalCells - totalBombs
}
