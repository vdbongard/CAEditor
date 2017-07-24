import { Application, Rectangle, Container, Point } from 'pixi.js'
import Grid from './Grid'
import Cell from './Cell'

export default class CAEditor {
  constructor () {
    // UI default values
    this._cellColorActive = 0x555555
    this._cellColorInactive = 0xFFFFFF
    this._showGrid = true
    this._minSpacing = 10
    this._defaultLineWidth = 1
    this._defaultCellCount = 30

    // Rules default values
    this.survives = [2, 3]
    this.born = [3]
    this.overlappingEdge = true

    // Other default values
    this.randomProbability = 20
    this._fps = 20
    this._trajectorySize = 1

    // attributes
    this._domWrapper = document.getElementsByClassName('canvas')[0]
    this._domPadding = parseFloat(window.getComputedStyle(this._domWrapper, null).getPropertyValue('padding-top') || 0)
    this._domButtonRow = document.querySelector('.content > .buttonRow')
    this.canvasSize = this._calcCanvasSize()
    this.lineWidth = this._defaultLineWidth
    this.size = this.canvasSize - this.lineWidth
    this._count = Math.min(Math.floor(this.size / this._minSpacing), this._defaultCellCount)
    this.spacing = this.size / this._count
    this.x = this.y = (this.canvasSize - this.size) / 2
    this.cells = []
    this.cellContainer = new Container()
    this.isPlaying = false
    this.maxDelta = 60 / this._fps
    this.delta = this.maxDelta
    this.previousPoint = new Point(-1, -1)
    this.grid = null
    this.app = new Application({
      width: this.canvasSize,
      height: this.canvasSize,
      view: document.getElementById('main'),
      transparent: true
    })

    this._init()
  }

  get count () {
    return this._count
  }

  set count (value) {
    if (typeof value === 'number' && value >= 1 && this._count !== value) {
      this._count = value
      this.spacing = this.size / this._count
      this._redraw()
    }
  }

  get showGrid () {
    return this._showGrid
  }

  set showGrid (value) {
    if (typeof value === 'boolean' && this._showGrid !== value) {
      this._showGrid = value
      this.lineWidth = value ? this._defaultLineWidth : 0
      this._redraw()
    }
  }

  get cellColorActive () {
    return this._cellColorActive
  }

  set cellColorActive (value) {
    if (typeof value === 'number' && this._cellColorActive !== value) {
      this._cellColorActive = value

      for (let x = 0; x < this.count; x++)
        for (let y = 0; y < this.count; y++)
          this.cells[x][y].colorActive = value
    }
  }

  get cellColorInactive () {
    return this._cellColorInactive
  }

  set cellColorInactive (value) {
    if (typeof value === 'number' && this._cellColorInactive !== value) {
      this._cellColorInactive = value

      for (let x = 0; x < this.count; x++)
        for (let y = 0; y < this.count; y++)
          this.cells[x][y].colorInactive = value
    }
  }

  get trajectorySize () {
    return this._trajectorySize
  }

  set trajectorySize (value) {
    if (typeof value === 'number' && value >= 0 && this._trajectorySize !== value) {
      this._trajectorySize = value

      for (let x = 0; x < this.count; x++)
        for (let y = 0; y < this.count; y++)
          this.cells[x][y].trajectorySize = value
    }
  }

  get fps () {
    return this._fps
  }

  set fps (value) {
    if (typeof value === 'number' && value >= 0 && this._fps !== value) {
      this._fps = value
      this.maxDelta = 60 / this._fps
    }
  }

  _init () {
    this.app.stage.addChild(this.cellContainer)

    this.app.stage.hitArea = new Rectangle(0, 0, this.canvasSize, this.canvasSize)
    this.app.stage.interactive = true
    this.app.stage.buttonMode = true

    this._onDragMove = this._onDragMove.bind(this)
    this._onDragEnd = this._onDragEnd.bind(this)

    // events
    this.app.stage
      .on('pointerdown', (evt) => this._onDragStart(evt))

    window.addEventListener('resize', () => {
      const newCanvasSize = this._calcCanvasSize()
      if (this.canvasSize !== newCanvasSize) {
        this.canvasSize = newCanvasSize
        this.app.renderer.resize(this.canvasSize, this.canvasSize)
        this._redraw()
      }
    })

    this._redraw()
  }

  _redraw () {
    const savedCells = this.cells

    // reset
    this.cellContainer.removeChildren()
    this.cells = []
    this.app.stage.removeChild(this.grid)

    // calc new values
    this.size = this.canvasSize - this.lineWidth
    this.spacing = this.size / this._count
    this.x = this.y = (this.canvasSize - this.size) / 2

    // create grid
    this.grid = new Grid(this.x, this.y, this.size, this.count, this.lineWidth)
    this.app.stage.addChild(this.grid)

    // create all cells
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++) {
        if (!this.cells[x]) this.cells[x] = []
        this.cells[x][y] = new Cell(
          this.x + x * this.spacing,
          this.y + y * this.spacing,
          this.spacing,
          this.cellColorActive,
          this.cellColorInactive,
          this.trajectorySize)
        if (savedCells && savedCells[x] && savedCells[x][y] && savedCells[x][y].active) this.cells[x][y].active = true
        this.cellContainer.addChild(this.cells[x][y])
      }
  }

  _calcCanvasSize () {
    return Math.min(
      this._domWrapper.clientWidth - 2 * this._domPadding,
      this._domWrapper.clientHeight - 2 * this._domPadding -
      (window.innerWidth <= 992 ? this._domButtonRow.clientHeight : 0))
  }

  play () {
    if (!this.isPlaying) {
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
  }

  pause () {
    if (this.isPlaying) {
      this.isPlaying = false
      this.delta = this.maxDelta
      this.app.ticker.remove(this.playFunction)
    }
  }

  nextStep () {
    const newState = []
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++) {
        let neighborCount = 0

        if (this.overlappingEdge) {
          if (this.cells[CAEditor.mod(x - 1, this.count)][CAEditor.mod(y - 1, this.count)].active) neighborCount++
          if (this.cells[x][CAEditor.mod(y - 1, this.count)].active) neighborCount++
          if (this.cells[(x + 1) % this.count][CAEditor.mod(y - 1, this.count)].active) neighborCount++
          if (this.cells[CAEditor.mod(x - 1, this.count)][y].active) neighborCount++
          if (this.cells[(x + 1) % this.count][y].active) neighborCount++
          if (this.cells[CAEditor.mod(x - 1, this.count)][(y + 1) % this.count].active) neighborCount++
          if (this.cells[x][(y + 1) % this.count].active) neighborCount++
          if (this.cells[(x + 1) % this.count][(y + 1) % this.count].active) neighborCount++
        }
        else {
          if (this.cells[x - 1] && this.cells[x - 1][y - 1] && this.cells[x - 1][y - 1].active) neighborCount++
          if (this.cells[x][y - 1] && this.cells[x][y - 1].active) neighborCount++
          if (this.cells[x + 1] && this.cells[x + 1][y - 1] && this.cells[x + 1][y - 1].active) neighborCount++
          if (this.cells[x - 1] && this.cells[x - 1][y] && this.cells[x - 1][y].active) neighborCount++
          if (this.cells[x + 1] && this.cells[x + 1][y] && this.cells[x + 1][y].active) neighborCount++
          if (this.cells[x - 1] && this.cells[x - 1][y + 1] && this.cells[x - 1][y + 1].active) neighborCount++
          if (this.cells[x][y + 1] && this.cells[x][y + 1].active) neighborCount++
          if (this.cells[x + 1] && this.cells[x + 1][y + 1] && this.cells[x + 1][y + 1].active) neighborCount++
        }

        if (!this.cells[x][y].active && this.born.indexOf(neighborCount) >= 0) {
          if (!newState[x]) newState[x] = []
          newState[x][y] = 1
        }
        else if (this.cells[x][y].active && this.survives.indexOf(neighborCount) < 0) {
          if (!newState[x]) newState[x] = []
          newState[x][y] = 0
        }
      }

    newState.forEach((element, x) => {
      element.forEach((element, y) => {
        if (element === 0) {
          this.cells[x][y].active = false
          this.cells[x][y].trajectory = this.cells[x][y].trajectorySize
        }
        else if (element === 1)
          this.cells[x][y].active = true
      })
    })

    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++)
        this.cells[x][y].nextStep()
  }

  randomizeCells () {
    this.clear()
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++)
        this.cells[x][y].active = Math.random() > (1 - this.randomProbability / 100)
  }

  clear () {
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++)
        this.cells[x][y].reset()
  }

  setPreset (preset) {
    this.cellColorActive = preset.cellColorActive
    this.cellColorInactive = preset.cellColorInactive
    this.showGrid = preset.showGrid
    this.trajectorySize = preset.trajectorySize
    this.count = preset.count

    if (preset.survives)
      this.survives = preset.survives

    if (preset.born)
      this.born = preset.born

    if (preset.cells) {
      this.clear()

      let sizeX = 0
      let sizeY = 0

      preset.cells.forEach(cell => {
        if (cell[0] > sizeX) sizeX = cell[0]
        if (cell[1] > sizeY) sizeY = cell[1]
      })

      const offsetX = Math.max(Math.floor((this.count - sizeX - 1) / 2), 0)
      const offsetY = Math.max(Math.floor((this.count - sizeY - 1) / 2), 0)

      preset.cells.forEach(cell => {
        if (this.cells[cell[0] + offsetX] && this.cells[cell[0] + offsetX][cell[1] + offsetY])
          this.cells[cell[0] + offsetX][cell[1] + offsetY].active = true
      })
    }
  }

  _onDragStart (evt) {
    if (this.isPlaying) {
      this.wasPlaying = true
      this.pause()
    }
    this.app.stage
      .on('pointermove', this._onDragMove)
      .on('pointerup', this._onDragEnd)
      .on('pointerupoutside', this._onDragEnd)

    const startingPoint = this._evtToGridPoint(evt)
    this.startingState = this.cells[startingPoint.x][startingPoint.y].active
  }

  _onDragEnd (evt) {
    if (this.wasPlaying) {
      this.wasPlaying = false
      this.play()
    }
    this.app.stage
      .off('pointermove', this._onDragMove)
      .off('pointerup', this._onDragEnd)
      .off('pointerupoutside', this._onDragEnd)

    if (this.previousPoint.equals(new Point(-1, -1))) {
      const point = this._evtToGridPoint(evt)
      this.cells[point.x][point.y].active = !this.startingState
    }

    this.previousPoint.x = this.previousPoint.y = -1
  }

  _onDragMove (evt) {
    const currentPoint = this._evtToGridPoint(evt)

    if (currentPoint && !currentPoint.equals(this.previousPoint)) {
      this.previousPoint = currentPoint
      this.cells[currentPoint.x][currentPoint.y].active = !this.startingState
    }
  }

  _evtToGridPoint (evt) {
    const point = evt.data.getLocalPosition(this.app.stage)

    point.x = Math.floor(point.x / this.spacing)
    point.y = Math.floor(point.y / this.spacing)

    if (point.x >= this.count || point.x < 0 || point.y >= this.count || point.y < 0)
      return null

    return point
  }

  static mod (n, m) {
    return ((n % m) + m) % m
  }
}
