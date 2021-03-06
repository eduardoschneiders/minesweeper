import { Component } from 'react';
import Cell from './Cell.js';
import {randomInt, clone, calculateBombs, revealAround, calculateWinner, revealBombs} from './helpers/BoardHelper.js'
import './Board.css'

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
      gameLost: false,
      currentGameId: null
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

        revealBombs(grid)

        status = 'hasBomb'
      } else {
        if (cell['value'] === 0) {
          grid = revealAround(i, j, grid, true)
        }

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
    let gameWin = calculateWinner(this.state.rows * this.state.collumns, this.state.bombs, grid)
    if (gameWin) { revealBombs(grid) }

    this.setState({ grid: grid, gameWin: gameWin })
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

    this.props.onStartGame({
      grid: grid,
      rows: this.state.targetRows,
      collumns: this.state.targetCollumns,
      bombs: this.state.targetBombs,
      gameStaredAt: new Date(),
      gameWin: false,
      gameLost: false,
      gridSeted: false
    })

    event.preventDefault();
  }

  resetGame(e) {
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

    e.preventDefault()
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

  componentDidUpdate(props){
    if (this.props.currentGame) {
      if (this.state.currentGameId !== this.props.currentGameId) {
        this.setState({
          currentGameId: this.props.currentGameId,
          rows: this.props.currentGame.rows,
          collumns: this.props.currentGame.collumns,
          bombs: this.props.currentGame.bombs,
          grid: this.props.currentGame.grid,
          gridSeted: this.props.currentGame.gridSeted,
          gameStaredAt: this.props.currentGame.gameStaredAt,
          gameWin: this.props.currentGame.gameWin,
          gameLost: this.props.currentGame.gameLost,
        })
      }
    }

  }

  render () {
    let status = null
    if (this.state.gameWin) {
      status = 'win'
    } else if (this.state.gameLost) {
      status = 'lost'
    }

    let timeStatus = null
    if (this.state.gameStaredAt) {
      timeStatus = parseInt((this.state.time - this.state.gameStaredAt) / 1000)
    } else {
      timeStatus = 0
    }

    return (
      <div>
        <form className="config" onSubmit={this.handleSubmit}>
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

          <input type="submit" value="New game" />
        </form>

        <div className="status">
          <div>
            bombs: {this.state.bombs - this.bombsFound(this.state.grid)}<br />
          </div>
          <div>
            <button
              className={'face-button ' + status}
              onClick={(e) => this.resetGame(e) }
            />
          </div>
          <div>
            Time: {timeStatus}
          </div>
        </div>

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

        <button className="save-game" onClick={(e) => this.props.onSaveGame(this.state)}>Save Game</button>
      </div>
    )
  }
}

export default Board;
