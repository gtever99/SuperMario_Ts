export default class Wall {
  TYPE: "="
  x: number
  y: number
  w: number
  h: number

  constructor(x: number, y: number, w: number, h: number) {
    this.TYPE = "="
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    console.log("我是墙")
  }
}
