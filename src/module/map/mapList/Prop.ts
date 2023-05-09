import Physical from "../../physical/Physical";
import {Prop_type} from "../map-d";
import Store from "../../store/Store";
import Map from "../Map";
import Player from "../../protagonist/Player";
import store from "../../store/Store";

/**
 * 所有道具类，出现后蘑菇等道具会上升后移动。花朵等道具只会上升
 *  包含如：蘑菇、花朵之类
 */
export default class Prop extends Physical {
  // 几种道具的类型
  TYPE: Prop_type
  // 计时器ID
  timeId: number
  // 判断是否到指定值
  count: number

  constructor(x: number, y: number, type: Prop_type) {
    super(x, y, 5);
    this.count = 0
    this.timeId = 0
    this.TYPE = type
    this.w = Map.BASIC_WIDTH;
    this.h = Map.BASIC_HEIGHT
    // ‘道具’ 不为花朵才可以跑
    if (this.TYPE !== "$_") {
      setTimeout(() => {
        this.decline()
        this.move();
      }, 700)
    }
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
      switch (this.TYPE) {
        // 道具-红蘑菇
        case "^_": {
          ctx.drawImage(Store.materialImg, 71, 43, 16, 16, this.x, this.y, this.w, this.h)
          return;
        }
        // 道具-绿蘑菇
        case "*_": {
          ctx.drawImage(Store.materialImg, 52, 43, 16, 16, this.x, this.y, this.w, this.h)
          return;
        }
        // 道具-花朵
        case "$_": {
          const key = store.cutImages(3, 300, "prop_$");
          if (key === 0) {
            ctx.drawImage(Store.materialImg, 52, 64, 16, 16, this.x, this.y, this.w, this.h)
          } else if (key === 1) {
            ctx.drawImage(Store.materialImg, 71, 64, 16, 16, this.x, this.y, this.w, this.h)
          } else if (key === 2) {
            ctx.drawImage(Store.materialImg, 90, 64, 16, 16, this.x, this.y, this.w, this.h)
          } else {
            ctx.drawImage(Store.materialImg, 109, 64, 16, 16, this.x, this.y, this.w, this.h)
          }
          return;
        }
      }
    })
  }

  // 逐帧动画
  frameWise = (success?: Function) => {
    const frameWiseHandle = () => {
      this.timeId = requestAnimationFrame(frameWiseHandle);
      // 主角与道具之前的碰撞检测
      if (Store.hitDetection(Player, this)) {
        success && success();
        this.destroy()
      }
      this.draw()
    }
    frameWiseHandle();
  }

  // 销毁道具
  destroy() {
    super.destroy();
    cancelAnimationFrame(this.timeId)
  }
}
