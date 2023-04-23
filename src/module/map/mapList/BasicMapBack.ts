import { Map_back } from "../map-d";

/**
 * 所有地图背景的基类
 */
export default class BasicMapBack {
  TYPE: Map_back
  Y: number
  X: number
  x: number
  y: number
  topTimeId: number

  constructor(x: number, y: number, type: Map_back) {
    this.TYPE = type
    this.Y = y;
    this.X = x;
    this.x = x
    this.y = y
    this.topTimeId = 0
  }

  draw() {}

  /**
   * 方块被顶效果
   * @param finish 顶完了的回调
   */
  top(finish?: Function) {
    let count = 0;
    // 防止多次调用
    this.y = this.Y;
    cancelAnimationFrame(this.topTimeId)
    const topHandle = () => {
      this.topTimeId = requestAnimationFrame(topHandle)
      count++
      // 如果上升到的距离 >= 10px就归位
      if (count >= 10) {
        this.y ++
        // 已经归位
        if (this.y === this.Y) {
          cancelAnimationFrame(this.topTimeId)
          finish && finish()
        }
      } else {
        // 上升
        this.y--
      }
    }
    topHandle()
  }
}

