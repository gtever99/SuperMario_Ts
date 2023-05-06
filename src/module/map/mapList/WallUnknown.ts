import BasicMapBack from "./BasicMapBack";
import Store from "../../store/Store";
import Map from "../Map";
import {Wu_back_type, Prop_type} from "../map-d";
import Physical from "../../physical/Physical";
import Prop from "./Prop";

/**
 * '未知方块' 类
 */
export class WallUnknown extends BasicMapBack {
  // 内部的道具是否还存在
  isExist: Boolean

  constructor(x: number, y: number, type: Wu_back_type) {
    super(x, y, type);
    this.isExist = true
  }

  draw() {
    const { ctx } = Store;
    Store.basicsDraw(() => {
      // 道具存在的绘制样式
      if (this.isExist) {
        const currentF = Store.cutImages(3, 220, "wn");
        // 第一帧的时间比其它帧的时间长
        if (currentF === 0) {
          ctx.drawImage(Store.materialImg, 372, 160, 16, 16, this.x, this.y, Map.BASIC_WIDTH, Map.BASIC_HEIGHT)
          return
        }
        // 绘制剩余帧
        ctx.drawImage(
          Store.materialImg,
          372 + (currentF - 1) * 18,
          160,
          16,
          16,
          this.x,
          this.y,
          Map.BASIC_WIDTH, Map.BASIC_HEIGHT
        )
        return;
      }
      // 道具不存在的绘制样式
      ctx.drawImage(Store.materialImg, 373, 84, 16, 16, this.x, this.y, Map.BASIC_WIDTH, Map.BASIC_HEIGHT)
    })
  }

  appear() {
    if (!this.isExist) return;
    super.top()
    switch (this.TYPE) {
      // 金币
      case "?": {
        this.appearGold()
        return;
      }
      case "^": {
        this.appearMushroom_big()
      }
    }
  }

  // 出现金币
  appearGold() {
    const { ctx } = Store;
    const seed = 7;
    const top = 150;
    const x = this.X + (Map.BASIC_WIDTH / 2) - 5;
    let y = this.Y, timeId = 0, count = 0;
    // 已经使用过该道具
    this.isExist = false
    const goldAnim = () => {
      timeId = requestAnimationFrame(goldAnim)
      // 辅助变量、记录用
      count += seed
      if (count > top) {
        // 下落
        y += seed
        // 到了金币的最大高度后，金币会往下落，落到一定范围取消动画
        if (y >= this.Y - top / 1.5) {
          cancelAnimationFrame(timeId)
        }
      } else {
        // 上升
        y -= seed
      }
      // 绘制动画
      Store.basicsDraw(() => {
        // 防止覆盖
        ctx.globalCompositeOperation = "destination-over"
        const currentF = Store.cutImages(3, 50, "gold");
        if (currentF === 0) {
          ctx.drawImage(Store.materialImg, 434, 145, 1, 14, x, y, 6, Map.BASIC_HEIGHT)
        } else if (currentF === 1) {
          ctx.drawImage(Store.materialImg, 440, 145, 4, 14, x, y, 6, Map.BASIC_HEIGHT)
        } else if (currentF === 2) {
          ctx.drawImage(Store.materialImg, 448, 145, 8, 14, x, y, 12, Map.BASIC_HEIGHT)
        } else {
          ctx.drawImage(Store.materialImg, 461, 145, 4, 14, x, y, 6, Map.BASIC_HEIGHT)
        }
      })
    }
    goldAnim()
   }

  // 出现道具-变大蘑菇
  appearMushroom_big() {
    this.isExist = false
    let p: null | Prop = new Prop(this.x, this.y, <Prop_type>(this.TYPE + '_'))
    p.frameWise(() => {
      p = null
    })
  }
}
