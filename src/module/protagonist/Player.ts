/**
 * 主角类、主角各种控制，视角的切换
 */
import Store from "../store/Store";
import Map from "../map/Map";
import Config from "../config";

class Player {

  // 視口的X位置
  viewportX: number
  // 視口的Y位置
  viewportY: number
  // 主角的X位置
  playerX: number
  // 主角的Y位置
  playerY: number
  // 主角是否在在跳跃状态
  isJump: Boolean
  // 主角左移的定时器
  leftTime: NodeJS.Timer | undefined
  // 主角右移的定时器
  rightTime: NodeJS.Timer | undefined
  // 主角跳跃的定时器
  jumpTime: NodeJS.Timer | undefined
  // 主角下降的定时器
  declineTime: NodeJS.Timer | undefined
  // 主角是否在悬空状态
  isLevitation: Boolean

  constructor() {
    this.viewportX = 0
    this.viewportY = 0
    this.playerX = 0
    this.playerY = 0
    this.isJump = false
    this.isLevitation = false
    this.declineTime = undefined
    this.jumpTime = undefined
    this.leftTime = undefined
    this.rightTime = undefined
  }

  // 初始化主角
  init() {
    // 事件初始化
    removeEventListener('keydown', this.moveHandle)
    addEventListener('keydown', this.moveHandle)
    addEventListener('keyup', this.upHandle)
    addEventListener('keyup', this.upHandle)
    // 位置初始化
    this.viewportX = 0;
    this.viewportY = Map.boundaryY
    this.playerY = -Map.boundaryY + 280
    Store.ctx.translate(0, this.viewportY)
  }

  // 移动操作
  moveHandle = (e: KeyboardEvent) => {
    // 阻止默认行为
    e.preventDefault();
    const { ctx } = Store;
    let { viewportY, viewportX } = this

    switch (e.key) {
      // 上
      case 'w':
        // 主角不在悬空状态的时候才可以'跳跃'
        if (this.isLevitation) return
        this.isJump = true
        this.jumpTime = setInterval(() => {
          this.playerY -= 2;
        }, 1)
        setTimeout(() => {
          clearInterval(this.jumpTime)
          this.isJump = false
        }, 200)
        // if (this.viewportY < 0) {
        //   ctx.translate(0, 10);
        //   this.viewportY += 10
        // }
        break;
      //  下
      case 's':
        // if (this.viewportY > Map.boundaryY) {
        //   ctx.translate(0, -10);
        //   this.viewportY -= 10
        // }
        break;
      //  左
      case 'a':
        this.leftTime = setInterval(() => {
          this.playerX -= 1;
        }, 2)
        // if (this.viewportX > 0) {
        //   ctx.translate(10, 0);
        //   this.viewportX -= 10
        // }
        break;
      //  右
      case 'd':
        this.rightTime = setInterval(() => {
          this.playerX += 1;
        }, 2)
        // console.log(this.viewportX, Map.boundaryX)
        // if (this.viewportX < Map.boundaryX) {
        //   ctx.translate(-10, 0);
        //   this.viewportX += 10
        // }
        break;
    }
  }

  // 键盘抬起的操作
  upHandle = (e: KeyboardEvent) => {
    switch (e.key) {
      // 上
      case 'w':
        clearInterval(this.jumpTime!)
        this.isJump = false
        break;
      //  下
      case 's':
        break;
      //  左
      case 'a':
        clearInterval(this.leftTime!)
        break;
      //  右
      case 'd':
        clearInterval(this.rightTime!)
        break;
    }
  }

  // 绘制主角
  drawProtagonist() {
    let { playerY, playerX } =  this

    playerY -= 4
    // 如果没碰到返回undefined，不然返回 RenderMapData
    let hitRes = Map.renderMapData.find(v => {
      // 碰撞检测
      return Store.hitDetection({
        x: playerX, y: playerY, h: 20, w: 20
      }, {
        x: v.x, y: v.y, h: Config.basicHeight, w: Config.basicWidth
      })
    })
    // 只有没碰到的时候主角才会一直下降
    if (!hitRes && !this.isJump) {
      this.isLevitation = true
      this.playerY += 4
    } else {
      this.isLevitation = false
      clearInterval(this.declineTime)
    }
    // 绘制
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.playerX, this.playerY, 20, 20);
    })
  }
}

export default new Player()
