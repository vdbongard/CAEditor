let canvasSize = 400
let gridSize = 200
let count = 10
let spacing = gridSize / count
let offset = (canvasSize - gridSize) / 2

let activeCells = [[0, 0], [1,5], [9, 8]]

let app = new PIXI.Application(canvasSize, canvasSize)
document.body.appendChild(app.view)

function drawGrid () {
  let grid = new PIXI.Graphics()
  grid.x = grid.y = offset
  grid.lineStyle(2, 0xCCCCCC, 1)

//inner grid
  for (let i = 1; i < count; i++) {
    grid.moveTo(i * spacing, 0)
    grid.lineTo(i * spacing, gridSize)
    grid.moveTo(0, i * spacing)
    grid.lineTo(gridSize, i * spacing)
  }

//frame
  grid.drawRect(0, 0, gridSize, gridSize)

  app.stage.addChild(grid)
}

function drawActiveCells () {
  activeCells.map(function (coordinate) {
    drawActiveCellAt(coordinate[0], coordinate[1])
  })
}

function drawActiveCellAt (x, y) {
  let radius = spacing / 3
  let active = new PIXI.Graphics()
  active.beginFill(0xCCCCCC)
  active.drawCircle(
    offset + x * spacing + spacing / 2,
    offset + y * spacing + spacing / 2,
    radius)
  active.endFill()

  app.stage.addChild(active)
}


drawGrid()
drawActiveCells()