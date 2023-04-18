/**
 * 主角类、主角各种控制，视角的切换
 */
import Store from "../store/Store";
import Map from "../map/Map";
import Config from "../config";
import Physical from "../physical/Physical";

class Player extends Physical{
  // 視口的X位置
  viewportX: number
  // 視口的Y位置
  viewportY: number
  // 防止 keydown事件 多次执行 -- 用于跳跃
  prevDown_jump: Boolean
  // 防止 keydown事件 多次执行 -- 用于移动
  prevDown_move: Boolean

  constructor() {
    super(20, 20)
    this.viewportX = 0
    this.viewportY = 0
    this.prevDown_jump = false
    this.prevDown_move = false
  }

  // 初始化主角
  init() {
    // 事件初始化
    removeEventListener('keydown', this.moveHandle)
    addEventListener('keydown', this.moveHandle)
    addEventListener('keyup', this.upHandle)
    // 位置初始化
    this.viewportX = 0;
    this.viewportY = Map.boundaryY
    this.y = -Map.boundaryY + 280
    Store.ctx.translate(0, this.viewportY)
  }

  // 移动操作
  moveHandle = (e: KeyboardEvent) => {
    if (e.key === 'w') {
      if (this.prevDown_jump) return
      // 开始跳跃
      this.jump(300);
      this.prevDown_jump = true
    } else if (e.key === 'a' || e.key === 'd') {
      if (this.prevDown_move) return
      // 开始移动
      this.prevDown_move = true
      this.move(e.key, (isHit: 0 | 1) => {
        if (isHit === 0) {
          // 左移
          if (e.key === 'a') {
            // 只有当前位置处于当前视口中间的时候才允许视口移动
            if (this.x > Store.getCanvasInfo.w / 2) {
              Store.ctx.translate(this.moveSpeed, 0)
            }
          } else {
            // 右移
            if (this.x > Store.getCanvasInfo.w / 2) {
              Store.ctx.translate(-this.moveSpeed, 0)
            }
          }
        } else {
          // 停止移动
          // this.prevDown_move = false
          // this.endMove()
        }
        // console.log(this.viewportX, this.x, Map.boundaryX, Store.getCanvasInfo.w / 2)
      });
    }
  }

  // 键盘抬起的操作
  upHandle = (e: KeyboardEvent) => {
    if (e.key === 'w') {
      // 停止跳跃
      this.endJump();
      this.prevDown_jump = false
    } else if (e.key === 'a' || e.key === 'd') {
      // 停止移动
      this.prevDown_move = false
      this.endMove()
    }
  }

  // 绘制主角
  drawProtagonist() {
    this.decline();
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    })
  }
}

export default new Player()
