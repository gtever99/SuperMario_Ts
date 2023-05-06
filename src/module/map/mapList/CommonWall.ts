import BasicMapBack from "./BasicMapBack";
import Store from "../../store/Store";
import Map from "../Map";
import {WallDestroy} from "../map-d";
import Player from "../../protagonist/Player";

/**
 * 普通的墙
 */
export default class CommonWall extends BasicMapBack {
  // 墙是否破裂
  isBreach: boolean
  WallBreachAll: WallDestroy[]
  timeId: number

  constructor(x: number, y: number) {
    super(x, y, "#")
    this.isBreach = false
    this.WallBreachAll = []
    this.timeId = 0
  }

  draw() {
    const { ctx } = Store;
    if (this.isBreach) {
      // 劈裂状态的墙
      this.WallBreachAll.map(v => {
        Store.basicsDraw(() => {
          ctx.drawImage(Store.materialImg, 374, 102, 13, 15, v.X, v.Y, Map.BASIC_WIDTH / 2, Map.BASIC_HEIGHT / 2)
        })
      })
    } else {
      // 完整状态的墙
      Store.basicsDraw(() => {
        ctx.drawImage(Store.materialImg, 374, 102, 13, 17, this.x, this.y, Map.BASIC_WIDTH, Map.BASIC_HEIGHT)
      })
    }
  }

  // 破坏这个墙
  breach() {
    if (this.isBreach) return;
    const { x, y , WallBreachAll: wba } = this;
    const Time = 30;
    const distance = 800;
    const w = Map.BASIC_WIDTH
    const h = Map.BASIC_WIDTH
    this.isBreach = true
    // 初始化值
    for (let i = 0; i < 4; i ++) {
      wba[i] = { A: 0, XEnd: 0, XSeed: 0, X: 0, YEnd: 0, Y: 0, loop: 0 };
    }
    // 绘制初始位置
    wba[0]['X'] = x
    wba[0]['Y'] = y
    wba[1]['X'] = x + w / 2
    wba[1]['Y'] = y
    wba[2]['X'] = x
    wba[2]['Y'] = y + h / 2
    wba[3]['X'] = x + w / 2
    wba[3]['Y'] = y + w / 2
    // 绘制结束位置
    wba.forEach((v, i) => {
      switch (i) {
        case 0:
          v.YEnd = v.Y - ((distance * 1.8))
          v.XEnd = v.X + distance
          break;
        case 1:
          v.YEnd = v.Y - (distance / 2)
          v.XEnd = (v.X + distance) - (w / 2)
          break;
        case 2:
          v.YEnd = v.Y - ((distance * 1.8) + h / 2)
          v.XEnd = v.X - distance
          break;
        case 3:
          v.YEnd = (v.Y - (distance / 2)) - h / 2
          v.XEnd = (v.X - (distance)) - w / 2
          break;
      }
      v.XSeed = (v.XEnd - v.X) / Time
      v.A = 2 * (v.YEnd - v.Y) / (Time * Time)
    })
    // 墙 ‘破裂’ 的动画
    const aimHandle = () => {
      this.timeId = requestAnimationFrame(aimHandle)
      wba.map(v => {
        if (Math.abs(v.XEnd - v.X) >= 1 && Math.abs(v.YEnd - v.Y) >= 1) {
          v.X += v.XSeed;
          v.Y += v.A * v.loop
          v.loop ++;
        } else {
          cancelAnimationFrame(this.timeId)
          Map.destroyMapItem(this);
        }
      })
    }
    aimHandle()
  }

}
