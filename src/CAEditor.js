import { Application, Rectangle, Container } from 'pixi.js'
import Grid from './Grid'
import Cell from './Cell'

export default class CAEditor {
  constructor () {
    this.canvasSize = Math.min(window.innerWidth, 600)
    this.lineWidth = 1
    this.size = this.canvasSize - this.lineWidth
    this.minSpacing = 15
    this.count = Math.floor(this.size / this.minSpacing)
    this.spacing = this.size / this.count
    this.x = this.y = (this.canvasSize - this.size) / 2
    this.cells = []
    this.cellContainer = new Container()
    this.isPlaying = false
    this.fps = 60
    this.maxDelta = 60 / this.fps
    this.delta = this.maxDelta

    this.app = new Application({
      width: this.canvasSize,
      height: this.canvasSize,
      view: document.getElementById('main'),
      transparent: true
    })

    this.grid = new Grid(this.x, this.y, this.size, this.count, this.lineWidth)

    this._init()
  }

  _init () {
    this.app.stage.addChild(this.cellContainer)
    this.app.stage.addChild(this.grid)

    this.app.stage.hitArea = new Rectangle(0, 0, this.canvasSize, this.canvasSize)
    this.app.stage.interactive = true
    this.app.stage.buttonMode = true

    // create all cells
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++) {
        if (!this.cells[x]) this.cells[x] = []
        this.cells[x][y] = new Cell(this.x + x * this.spacing, this.y + y * this.spacing, this.spacing)
        this.cellContainer.addChild(this.cells[x][y])
      }

    // events
    this.app.stage.on('click', (evt) => this._onClick(evt))
    this.app.stage.on('tap', (evt) => this._onClick(evt))
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
    const newState = []
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++) {
        let neighborCount = 0

        if (this.cells[x - 1] && this.cells[x - 1][y - 1] && this.cells[x - 1][y - 1].active) neighborCount++
        if (this.cells[x][y - 1] && this.cells[x][y - 1].active) neighborCount++
        if (this.cells[x + 1] && this.cells[x + 1][y - 1] && this.cells[x + 1][y - 1].active) neighborCount++
        if (this.cells[x - 1] && this.cells[x - 1][y] && this.cells[x - 1][y].active) neighborCount++
        if (this.cells[x + 1] && this.cells[x + 1][y] && this.cells[x + 1][y].active) neighborCount++
        if (this.cells[x - 1] && this.cells[x - 1][y + 1] && this.cells[x - 1][y + 1].active) neighborCount++
        if (this.cells[x][y + 1] && this.cells[x][y + 1].active) neighborCount++
        if (this.cells[x + 1] && this.cells[x + 1][y + 1] && this.cells[x + 1][y + 1].active) neighborCount++

        if (!this.cells[x][y].active && neighborCount === 3) {
          if (!newState[x]) newState[x] = []
          newState[x][y] = 1
        }
        else if (this.cells[x][y].active && (neighborCount < 2 || neighborCount > 3)) {
          if (!newState[x]) newState[x] = []
          newState[x][y] = 0
        }
      }

    newState.forEach((element, x) => {
      element.forEach((element, y) => {
        if (element === 0)
          this.cells[x][y].active = false
        else if (element === 1)
          this.cells[x][y].active = true
      })
    })
  }

  randomizeCells () {
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++)
        this.cells[x][y].active = Math.random() > 0.8
  }

  clear () {
    for (let x = 0; x < this.count; x++)
      for (let y = 0; y < this.count; y++)
        this.cells[x][y].active = false
  }

  _onClick (evt) {
    const point = evt.data.getLocalPosition(this.app.stage)
    const x = Math.floor(point.x / this.spacing)
    const y = Math.floor(point.y / this.spacing)
    this.cells[x][y].toggle()
  }
}
