import { Graphics } from 'pixi.js'

export default class Cell extends Graphics {
  constructor (x, y, w) {
    super()

    this.x = x
    this.y = y
    this.w = w

    this._color = Cell.inactiveCellColor
    this._active = false

    this._draw()
  }

  static get inactiveCellColor () {
    return 0xEEEEEE
  }

  static get activeCellColor () {
    return 0xBBBBBB
  }

  get active () {
    return this._active
  }

  set active (value) {
    if (this._active !== value) {
      this._active = value

      this.color = this.active
        ? Cell.activeCellColor
        : Cell.inactiveCellColor
    }
  }

  get color () {
    return this._color
  }

  set color (value) {
    this._color = value
    this._draw()
  }

  toggle () {
    this.active = !this.active
  }

  _draw () {
    this.clear()
    this.beginFill(this.color)
    this.drawRect(0, 0, this.w, this.w)
    this.endFill()
  }
}
