/**
 * 主角类、主角各种控制，视角的切换
 */
import Store from "../store/Store";
import Map from "../map/Map";
import Physical from "../physical/Physical";
import EnemyPlant from "../enemy/EnemyPlant";
import loadImages from "../loadImages/LoadImages";

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
    super(0, 0, 5)
    this.viewportX = 0
    this.viewportY = 0
    this.w = 20;
    this.h = 20
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

    // 下降
    this.decline(() => {
      EnemyPlant.enemyList.find((v, i) => {
        // 只有在下降状态的时候才会走下面的逻辑
        if (!v || !this.isLevitation) return
        if (Store.hitDetection(this as Physical, v)) {
          delete EnemyPlant.enemyList[i];
        }
      })
    });
  }

  // 用户操作
  moveHandle = (e: KeyboardEvent) => {
    // 跳跃
    if (e.key === 'w') {
      if (this.prevDown_jump) return
      this.jump(380).then(hitRes => {
        console.log(hitRes);
      })
      this.prevDown_jump = true
    } else if (e.key === 'a' || e.key === 'd') {
      // 移动
      if (this.prevDown_move) return
      this.prevDown_move = true
      this.dir = e.key
      this.move((isHit: 0 | 1) => {
        if (isHit === 0) {
          // 只有主角位置在中间的时候才允许视口移动
          const flag = this.x > Store.getCanvasInfo.w / 2 && this.x < (Map.boundaryX - Store.getCanvasInfo.w / 2);
          // 左移
          if (e.key === 'a') {
            // 只有当前位置处于当前视口中间的时候才允许视口移动
            if (flag) Store.ctx.translate(this.moveSpeed, 0)
          } else {
            // 右移
            if (flag) Store.ctx.translate(-this.moveSpeed, 0)
          }
        }
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
    const { ctx } = Store;
    Store.basicsDraw(() => {
      // 反转图片
      if (this.dir === 'a') {
        ctx.translate(this.w + this.x * 2, 0);
        ctx.scale(-1, 1);
      }
      // 不在移动
      if (!this.prevDown_move) {
        return ctx.drawImage(loadImages.playerImg, 1, 60, 12, 16, this.x, this.y, this.w, this.h)
      }
      // 在移动
      if (Store.cutImages(1, 180, "pMove")) {
        ctx.drawImage(loadImages.playerImg, 16, 60, 16, 16, this.x, this.y, this.w, this.h)
      } else {
        ctx.drawImage(loadImages.playerImg, 34, 60, 16, 18, this.x, this.y, this.w, this.h)
      }
    })
  }
}

export default new Player()
