import Physical from "../../physical/Physical";
import {Map_back, Prop_type} from "../map-d";
import Store from "../../store/Store";
import Map from "../Map";
import BasicMapBack from "./BasicMapBack";
import Player from "../../protagonist/Player";

/**
 * 所有道具类
 *  包含如：蘑菇、花朵之类
 */
export default class Prop extends Physical {
  TYPE: Prop_type
  timeId: number
  count: number

  constructor(x: number, y: number, type: Prop_type) {
    super(x, y, 5);
    this.count = 0
    this.timeId = 0
    this.TYPE = type
    this.w = Map.BASIC_WIDTH;
    this.h = Map.BASIC_HEIGHT
    setTimeout(() => {
      this.decline()
      this.move();
    }, 700)
  }

  draw() {
    // 判断上移动是否到指定值
    if (this.count < this.h) {
      this.count += 1
      this.y -= 1
    }
    const { ctx } = Store
    // 绘制
    Store.basicsDraw(() => {
      ctx.globalCompositeOperation = "destination-over"
      ctx.drawImage(Store.materialImg, 71, 43, 16, 16, this.x, this.y, this.w, this.h)
    })
  }

  frameWise = (success?: Function) => {
    const frameWiseHandle = () => {
      this.timeId = requestAnimationFrame(frameWiseHandle);
      // 主角与道具之前的碰撞检测
      if (Store.hitDetection(Player, this)) {
        success && success();
        this.destroy()
        Player.shapeshift(1)
      }
      this.draw()
    }
    frameWiseHandle();
  }

  destroy() {
    super.destroy();
    cancelAnimationFrame(this.timeId)
  }
}
