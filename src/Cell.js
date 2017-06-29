import { Graphics } from 'pixi.js'

export default class Cell extends Graphics {
  constructor (x, y, w, colorActive, colorInactive) {
    super()

    this.x = x
    this.y = y
    this.w = w

    this._colorActive = colorActive
    this._colorInactive = colorInactive
    this._color = colorInactive
    this._active = false

    this._draw()
  }

  get colorActive () {
    return this._colorActive
  }

  set colorActive (value) {
    if (this._colorActive !== value) {
      this._colorActive = value
      if (this.active)
        this.color = value
    }
  }

  get colorInactive () {
    return this._colorInactive
  }

  set colorInactive (value) {
    if (this._colorInactive !== value) {
      this._colorInactive = value
      if (!this.active)
        this.color = value
    }
  }

  get active () {
    return this._active
  }

  set active (value) {
    if (this._active !== value) {
      this._active = value

      this.color = this.active
        ? this.colorActive
        : this.colorInactive
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
