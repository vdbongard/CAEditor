import { Application, Graphics } from 'pixi.js'

export default class CAEditor {
  constructor () {
    this.canvasSize = 400
    this.gridSize = 200
    this.count = 10
    this.spacing = this.gridSize / this.count
    this.offset = (this.canvasSize - this.gridSize) / 2
    this.activeCells = [[0, 0], [1, 5], [9, 8]]
    this.app = new Application(this.canvasSize, this.canvasSize)

    document.body.appendChild(this.app.view)

    this.drawGrid()
    this.drawActiveCells()
  }

  drawGrid () {
    const grid = new Graphics()
    grid.x = grid.y = this.offset
    grid.lineStyle(2, 0xCCCCCC, 1)

    // inner grid
    for (let i = 1; i < this.count; i++) {
      grid.moveTo(i * this.spacing, 0)
      grid.lineTo(i * this.spacing, this.gridSize)
      grid.moveTo(0, i * this.spacing)
      grid.lineTo(this.gridSize, i * this.spacing)
    }

    // frame
    grid.drawRect(0, 0, this.gridSize, this.gridSize)

    this.grid = grid

    this.app.stage.addChild(this.grid)
  }

  drawActiveCells () {
    this.activeCells.map((coordinate) => {
      this.drawActiveCellAt(coordinate[0], coordinate[1])
    })
  }

  drawActiveCellAt (x, y) {
    const radius = this.spacing / 3
    const active = new Graphics()
    active.beginFill(0xCCCCCC)
    active.drawCircle(
      this.offset + x * this.spacing + this.spacing / 2,
      this.offset + y * this.spacing + this.spacing / 2,
      radius)
    active.endFill()

    this.app.stage.addChild(active)
  }
}
