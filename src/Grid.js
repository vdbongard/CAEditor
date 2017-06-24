import { Graphics } from 'pixi.js'

export default class Grid extends Graphics {
  constructor (x, y, size, count, lineWidth) {
    super()

    this.x = x
    this.y = y
    this.size = size
    this.count = count
    this.lineWidth = lineWidth

    this.spacing = this.size / this.count

    if (this.lineWidth > 0) {
      this.lineStyle(this.lineWidth, Grid.COLOR, 1)

      // inner grid
      for (let i = 1; i < this.count; i++) {
        this.moveTo(i * this.spacing, 0)
        this.lineTo(i * this.spacing, this.size)
        this.moveTo(0, i * this.spacing)
        this.lineTo(this.size, i * this.spacing)
      }

      // frame
      this.drawRect(0, 0, this.size, this.size)
    }
  }

  static get COLOR () {
    return 0xAAAAAA
  }
}
