let canvasSize = 400
let gridSize = 200
let count = 10
let spacing = gridSize / count
let offset = (canvasSize - gridSize) / 2


let app = new PIXI.Application(canvasSize, canvasSize)
document.body.appendChild(app.view)


let grid = new PIXI.Graphics()
grid.x = grid.y = offset
grid.lineStyle(2, 0xCCCCCC, 1)

//inner grid
for (let i = 1; i < count; i++) {
  grid.moveTo(i*spacing, 0)
  grid.lineTo(i*spacing, gridSize)
  grid.moveTo(0, i*spacing)
  grid.lineTo(gridSize, i*spacing)
}

//frame
grid.drawRect(0, 0, gridSize, gridSize)

app.stage.addChild(grid)