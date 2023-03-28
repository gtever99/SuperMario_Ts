/**
 * 游戏的控制器，将所有类连接起来的桥梁
 */

import Map from "../map/Map";
import Protagonist from "../protagonist/Player";
import Store from "../store/Store";

class Controller {
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
    Store.ctx.clearRect(0, 0, Map.boundaryX, Map.boundaryX)
    Map.renderMap()
    requestAnimationFrame(this.draw)
  }
}

export default new Controller()
