

const randomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const clone = function (hash) {
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

function revealBombs(grid) {
  grid.forEach((row, i) => {
    row.forEach((collumn, j) => {
      let newCell = clone(collumn)
      if (newCell['hasBomb']) {
        newCell['status'] = 'hasBomb'
        grid[i][j] = newCell
      }
    })
  });
}

export {randomInt, clone, calculateBombs, revealAround, fetchCell, calculateWinner, revealBombs}
