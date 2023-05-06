/**
 * 主角类、主角各种控制，视角的切换
 */
import Store from "../store/Store";
import Map from "../map/Map";
import Physical from "../physical/Physical";
import EnemyPlant from "../enemy/EnemyPlant";
import {WallUnknown} from "../map/mapList/WallUnknown";
import CommonWall from "../map/mapList/CommonWall";
import {RenderMapData} from "../map/map-d";

class Player extends Physical{
  // 視口的X位置
  viewportX: number
  // 視口的Y位置
  viewportY: number
  // 防止 keydown事件 多次执行 -- 用于跳跃
  prevDown_jump: Boolean
  // 防止 keydown事件 多次执行 -- 用于移动
  prevDown_move: Boolean
  // 主角的级别 0=最小状态 1=变大 2=变大且发射子弹
  level: 0 | 1 | 2
  // 固定一级二级宽度
  WHALL: number[][]
  // 是否允许操作
  isOption: Boolean

  constructor() {
    super(0, 0, 7)
    this.viewportX = 0
    this.viewportY = 0
    this.WHALL = [[18, 25], [23, 42]]
    this.prevDown_jump = false
    this.prevDown_move = false
    this.level = 0
    this.isOption = true
    this.setWH()
  }

  // 初始化主角
  init() {
    // 事件初始化
    removeEventListener('keydown', this.moveHandle)
    addEventListener('keydown', this.moveHandle)
    addEventListener('keyup', this.upHandle)
    // 位置初始化
    this.viewportX = 0;
    this.viewportY = Map.boundaryY - Store.getCanvasInfo.h
    this.y = (Map.boundaryY - Map.BASIC_HEIGHT) - (this.h + 100)
    Store.ctx.translate(0, -this.viewportY)

    // 下降
    this.decline(() => {
      EnemyPlant.enemyList.find((v, i) => {
        // 只有在下降状态的时候才会走下面的逻辑
        if (!v || !this.isLevitation) return
        // 对敌人的碰撞检测
        if (Store.hitDetection(this as Physical, v)) {
          delete EnemyPlant.enemyList[i];
        }
      })
    });
  }

  // 用户操作
  moveHandle = (e: KeyboardEvent) => {
    if (!this.isOption) return;
    // 跳跃
    if (e.key === 'w') {
      this.playerJump()
    } else if (e.key === 'a' || e.key === 'd') {
      // 移动
      if (this.prevDown_move) return
      this.prevDown_move = true
      this.dir = e.key
      this.move((isHit: RenderMapData | undefined) => {
        if (!isHit) {
          // 只有主角位置在中间的时候才允许视口移动
          const flag = this.x > Store.getCanvasInfo.w / 2 && this.x < (Map.boundaryX - Store.getCanvasInfo.w / 2);
          // 左移
          if (e.key === 'a') {
            // 只有当前位置处于当前视口中间的时候才允许视口移动
            if (flag) {
              this.viewportX -= this.moveSpeed;
              Store.ctx.translate(this.moveSpeed, 0)
            }
          } else {
            // 右移
            if (flag) {
              this.viewportX += this.moveSpeed;
              Store.ctx.translate(-this.moveSpeed, 0)
            }
          }
        }
      });
    }
  }

  // 主角跳跃
  playerJump() {
    if (this.prevDown_jump) return
    // 父类的跳跃方法
    this.jump(420).then(hitRes => {
      // 墙区域
      if (hitRes!.TYPE === '#') {
        // 主角在最小状态，并且顶到了墙会使墙上移
        if (this.level === 0) return (hitRes! as CommonWall).top();
        // 主角在变大状态，并且顶到墙了会使墙碎裂
        if (this.level === 1) return (hitRes! as CommonWall).breach();
      }
      // 问号区域
      if (hitRes!.TYPE === '^' || hitRes!.TYPE === '$' || hitRes!.TYPE === '?' || hitRes!.TYPE === '*') {
        (hitRes! as WallUnknown).appear();
      }
    })
    this.prevDown_jump = true
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

  // 变身
  shapeshift(level: 0 | 1 | 2) {
    this.isOption = false
    this.endMove();
    this.level = level
    // 一个缓慢增长的效果
    setTimeout(() => {
      this.w = this.w + 2;
      this.h = this.h + 6;
    }, 400)
    setTimeout(() => {
      this.w = this.w + 2;
      this.h = this.h + 6;
    }, 600)
    setTimeout(() => {
      this.setWH()
      this.isOption = true;
    }, 1000)
  }

  // 绘制主角
  drawProtagonist() {
    const { ctx } = Store;
    const cs = [
      // 0、1、2、3、4 --- x, y, w, h顺序
      [[139, 506, 16, 16], [23, 506, 13, 16], [85, 506, 15, 16], [100, 506, 15, 16], [117, 506, 15, 16]], // 状态 0
      [[167, 546, 16, 32], [48, 546, 16, 32], [95, 547, 16, 31], [115, 547, 16, 30], [140, 546, 16, 32]], // 状态 1
      [[238, 630, 16, 32], [119, 630, 16, 32], [166, 630, 16, 31], [186, 630, 16, 30], [211, 630, 16, 32]]  // 状态 2
    ][this.level]
    Store.basicsDraw(() => {
      // 反转图片
      if (this.dir === 'a') {
        ctx.translate(this.w + this.x * 2, 0);
        ctx.scale(-1, 1);
      }
      // 跳跃或者悬空的时候
      if (this.isLevitation || this.isJump) {
        return ctx.drawImage(Store.materialImg, cs[0][0], cs[0][1], cs[0][2], cs[0][3], this.x, this.y, this.w, this.h) // 0
      }
      // 不在移动
      if (!this.prevDown_move) {
        return ctx.drawImage(Store.materialImg, cs[1][0], cs[1][1], cs[1][2], cs[1][3], this.x, this.y, this.w, this.h) // 1
      }
      // 在移动
      const cutNum = Store.cutImages(2, 180, "pMove");
      if (cutNum === 0) {
        ctx.drawImage(Store.materialImg, cs[2][0], cs[2][1], cs[2][2], cs[2][3], this.x, this.y, this.w, this.h) // 2
      } else if (cutNum === 1) {
        ctx.drawImage(Store.materialImg, cs[3][0], cs[3][1], cs[3][2], cs[3][3], this.x, this.y, this.w, this.h) // 3
      } else {
        ctx.drawImage(Store.materialImg, cs[4][0], cs[4][1], cs[4][2], cs[4][3], this.x, this.y, this.w, this.h) // 4
      }
    })
  }

  setWH() {
    this.w = this.WHALL[this.level === 0 ? 0 : 1][0];
    this.h = this.WHALL[this.level === 0 ? 0 : 1][1];
  }
}

export default new Player()
