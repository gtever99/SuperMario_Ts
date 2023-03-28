/**
 * 主角类、主角各种控制，视角的切换
 */
import Store from "../store/Store";
import Map from "../map/Map";

class Player {

  // 主角的X位置
  playerX: number
  // 主角的Y位置
  playerY: number

  constructor() {
    this.playerX = 0;
    this.playerY = 0
  }

  // 初始化主角
  init() {
    // 事件初始化
    removeEventListener('keydown', this.moveHandle)
    addEventListener('keydown', this.moveHandle)
    // 位置初始化
    this.playerX = 0;
    this.playerY = Map.boundaryY
    Store.ctx.translate(0, this.playerY)
  }

  /**
   * 用canvas的translate方法移动整个画布来实现视口的改变
   */
  // 移动操作
  moveHandle = (e: KeyboardEvent) => {
    const { ctx } = Store;
    let { playerY, playerX } = this

    switch (e.key) {
      // 上
      case 'w':
        if (this.playerY < 0) {
          ctx.translate(0, 10);
          this.playerY += 10
        }
        break;
      //  下
      case 's':
        if (this.playerY > Map.boundaryY) {
          ctx.translate(0, -10);
          this.playerY -= 10
        }
        break;
      //  左
      case 'a':
        if (this.playerX > 0) {
          ctx.translate(10, 0);
          this.playerX -= 10
        }
        break;
      //  右
      case 'd':
        console.log(this.playerX, Map.boundaryX)
        if (this.playerX < Map.boundaryX) {
          ctx.translate(-10, 0);
          this.playerX += 10
        }
        break;
    }
  }

  // 绘制主角
  drawProtagonist() {
    Store.basicsDraw(() => {

    })
  }
}

export default new Player()
