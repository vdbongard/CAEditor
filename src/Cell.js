import { Graphics } from 'pixi.js'

export default class Cell extends Graphics {
  constructor (x, y, w, colorActive, colorInactive, trajectorySize) {
    super()

    this.x = x
    this.y = y
    this.w = w

    this._colorActive = colorActive
    this._colorInactive = colorInactive
    this._color = colorInactive
    this._active = false

    this.trajectorySize = trajectorySize

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
      this.trajectory = 0

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

  nextStep () {
    if (this.trajectory) {
      this.trajectory--

      const step = Math.max(this.trajectorySize - this.trajectory, 0)

      this.color = this._calcGradientColor(this.colorActive, this.colorInactive, this.trajectorySize, step)
    }
  }

  _calcGradientColor (color1, color2, steps, currentStep) {
    const rgb = []
    let tmp = 0
    let hexString = ''

    let hexStringColor1 = color1.toString(16)
    let hexStringColor2 = color2.toString(16)

    hexStringColor1 = ('000000' + hexStringColor1).substring(hexStringColor1.length)
    hexStringColor2 = ('000000' + hexStringColor2).substring(hexStringColor2.length)

    for (let i = 0; i < 3; i++) {
      const colorActive = parseInt('0x' + hexStringColor1.slice(i * 2, i * 2 + 2))
      const colorInactive = parseInt('0x' + hexStringColor2.slice(i * 2, i * 2 + 2))
      const abs = Math.abs(colorActive - colorInactive)

      if (colorActive > colorInactive)
        rgb[i] = colorActive - Math.round(abs / steps * currentStep)
      else
        rgb[i] = colorActive + Math.round(abs / steps * currentStep)
    }

    for (let i = 0; i < 3; i++) {
      tmp = rgb[i].toString(16)
      hexString += ('00' + tmp).substring(tmp.length)
    }

    return parseInt('0x' + hexString)
  }

  reset () {
    this.active = false
    this.color = this.colorInactive
    this.trajectory = 0
  }

  _draw () {
    this.clear()
    this.beginFill(this.color)
    this.drawRect(0, 0, this.w, this.w)
    this.endFill()
  }
}
