import { Application, Graphics, Rectangle } from 'pixi.js'

export default class CAEditor {
  constructor () {
    this.canvasSize = 400
    this.canvasBackgroundColor = 0xFFFFFF
    this.lineWidth = 2
    this.lineColor = 0xCCCCCC
    this.activeCellColor = 0xCCCCCC
    this.gridSize = this.canvasSize - this.lineWidth
    this.count = 20
    this.spacing = this.gridSize / this.count
    this.offset = (this.canvasSize - this.gridSize) / 2
    this.cells = {
      '0,0': 1,
      '1,5': 1,
      '9,8': 1
    }
    this.app = new Application({
      width: this.canvasSize,
      height: this.canvasSize,
      backgroundColor: this.canvasBackgroundColor
    })

    this._init()
  }

  _init () {
    this.app.view.style.userSelect = 'none'
    document.body.appendChild(this.app.view)

    this._drawActiveCells()
    this._drawGrid()

    this.app.stage.hitArea = new Rectangle(0, 0, this.canvasSize, this.canvasSize)
    this.app.stage.interactive = true
    this.app.stage.buttonMode = true
    this.app.stage.on('click', (evt) => this._onClick(evt))
    this.app.stage.on('tap', (evt) => this._onClick(evt))
  }

  play () {

  }

  pause () {

  }

  randomizeCells () {

  }

  _onClick (evt) {
    const point = evt.data.getLocalPosition(this.app.stage)
    const x = Math.floor(point.x / this.spacing)
    const y = Math.floor(point.y / this.spacing)
    this._toggleCellAt(x, y)
  }

  _drawGrid () {
    const grid = new Graphics()
    grid.x = grid.y = this.offset
    grid.lineStyle(this.lineWidth, this.lineColor, 1)

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

  _drawActiveCells () {
    for (const k in this.cells)
      if (this.cells.hasOwnProperty(k) && this.cells[k]) {
        const coordinate = k.split(',')
        const x = coordinate[0]
        const y = coordinate[1]
        this.cells[this._format(x, y)] = this._drawActiveCellAt(x, y)
      }
  }

  _drawActiveCellAt (x, y) {
    const active = new Graphics()
    active.beginFill(this.activeCellColor)
    active.drawRect(
      this.offset + x * this.spacing,
      this.offset + y * this.spacing,
      this.spacing,
      this.spacing)
    active.endFill()

    this.app.stage.addChild(active)
    return active
  }

  _toggleCellAt (x, y) {
    if (this.cells[this._format(x, y)]) {
      this.app.stage.removeChild(this.cells[this._format(x, y)])
      delete this.cells[this._format(x, y)]
    }
    else
      this.cells[this._format(x, y)] = this._drawActiveCellAt(x, y)
  }

  _format (x, y) {
    return `${x},${y}`
  }
}
