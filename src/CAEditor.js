import { Application, Graphics, Rectangle, Container } from 'pixi.js'

export default class CAEditor {
  constructor () {
    this.canvasSize = 400
    this.canvasBackgroundColor = 0xFFFFFF
    this.lineWidth = 2
    this.lineColor = 0xAAAAAA
    this.activeCellColor = 0xCCCCCC
    this.gridSize = this.canvasSize - this.lineWidth
    this.count = 20
    this.spacing = this.gridSize / this.count
    this.offset = (this.canvasSize - this.gridSize) / 2
    this.cells = {}
    this.state = {}
    this.cellContainer = new Container()
    this.isPlaying = false
    this.fps = 4
    this.maxDelta = 60 / this.fps
    this.delta = this.maxDelta


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
    this.app.stage.addChild(this.cellContainer)

    this.app.stage.hitArea = new Rectangle(0, 0, this.canvasSize, this.canvasSize)
    this.app.stage.interactive = true
    this.app.stage.buttonMode = true
    this.app.stage.on('click', (evt) => this._onClick(evt))
    this.app.stage.on('tap', (evt) => this._onClick(evt))

    this._drawGrid()
  }

  play () {
    this.isPlaying = true

    this.playFunction = (delta) => {
      this.delta += delta
      if (this.delta >= this.maxDelta) {
        this.delta = 0
        this.nextStep()
      }
    }

    this.app.ticker.add(this.playFunction)
  }

  pause () {
    this.isPlaying = false
    this.delta = this.maxDelta
    this.app.ticker.remove(this.playFunction)
  }

  nextStep () {
    const newState = {}
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++) {
        let neighborCount = 0

        if (this.state[CAEditor._format(x - 1, y - 1)]) neighborCount++
        if (this.state[CAEditor._format(x, y - 1)]) neighborCount++
        if (this.state[CAEditor._format(x + 1, y - 1)]) neighborCount++
        if (this.state[CAEditor._format(x - 1, y)]) neighborCount++
        if (this.state[CAEditor._format(x + 1, y)]) neighborCount++
        if (this.state[CAEditor._format(x - 1, y + 1)]) neighborCount++
        if (this.state[CAEditor._format(x, y + 1)]) neighborCount++
        if (this.state[CAEditor._format(x + 1, y + 1)]) neighborCount++

        if (!this.state[CAEditor._format(x, y)] && (neighborCount === 3))
          newState[CAEditor._format(x, y)] = 1
        else if (this.state[CAEditor._format(x, y)] && (neighborCount < 2 || neighborCount > 3)) {
        }
        else if (this.state[CAEditor._format(x, y)])
          newState[CAEditor._format(x, y)] = this.state[CAEditor._format(x, y)]
      }
    this.state = newState
    this._drawCells()
  }

  randomizeCells () {
    this.clear()
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++)
        if (Math.random() > 0.5)
          this._drawActiveCellAt(x, y)
  }

  clear () {
    this.cellContainer.removeChildren()
    this.cells = {}
    this.state = {}
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

  _drawActiveCellAt (x, y) {
    console.log('new')
    const active = new Graphics()
    active.beginFill(this.activeCellColor)
    active.drawRect(
      this.offset + x * this.spacing,
      this.offset + y * this.spacing,
      this.spacing,
      this.spacing)
    active.endFill()

    this.cellContainer.addChild(active)
    this.cells[CAEditor._format(x, y)] = active
    this.state[CAEditor._format(x, y)] = 1
  }

  _removeActiveCellAt (x, y) {
    this.cellContainer.removeChild(this.cells[CAEditor._format(x, y)])
    delete this.cells[CAEditor._format(x, y)]
    delete this.state[CAEditor._format(x, y)]
  }

  _toggleCellAt (x, y) {
    if (this.state[CAEditor._format(x, y)])
      this._removeActiveCellAt(x, y)
    else
      this._drawActiveCellAt(x, y)
  }

  _drawCells () {
    for (const a in this.state)
      if (this.state.hasOwnProperty(a) && this.state[a] && !this.cells[a]) {
        const c = a.split(',')
        this._drawActiveCellAt(c[0], c[1])
      }

    for (const b in this.cells)
      if (this.cells.hasOwnProperty(b) && !this.state[b] && this.cells[b]) {
        const c = b.split(',')
        this._removeActiveCellAt(c[0], c[1])
      }
  }

  static _format (x, y) {
    return `${x},${y}`
  }
}
