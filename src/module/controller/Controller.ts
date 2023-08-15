/**
 * 游戏的控制器，将所有类连接起来的桥梁
 */

import Map from "../map/Map";
import Protagonist from "../protagonist/Player";
import Store from "../store/Store";
import EnemyPlant from "../enemy/EnemyPlant";
import Player from "../protagonist/Player";
import {BulletAll} from "../bullet/bullet-d";

class Controller {
  bulletArr: BulletAll[]

  constructor() {
    this.bulletArr = []
  }

  // 初始化整个游戏
  init () {
    this.start()
  }

  // 开始游戏
  start(): void {
    Map.init()
    Protagonist.init()
    this.draw()
  }

  // 绘制所有
  draw = () => {
    const { w, h } = Store.getCanvasInfo
    // 清除画布
    Store.ctx.clearRect(Player.viewportX, Player.viewportY, w, h)
    // 地图的绘制
    Map.renderMap()
    // 主角的绘制
    Protagonist.drawProtagonist()
    // 敌人的绘制
    EnemyPlant.drawAllEnemy();
    // 子弹绘制
    this.bulletArr.map(v => v.draw())
    requestAnimationFrame(this.draw)
  }
}

export default new Controller()
