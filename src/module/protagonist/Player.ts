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
import {CoorDetail, PlayerCoor, PlayerLevel, PlayerSize} from "./player.t";

class Player extends Physical{
  // 視口的X位置
  viewportX: number
  // 視口的Y位置
  viewportY: number
  // 防止 keydown事件 多次执行 -- 用于跳跃
  prevDown_jump: Boolean
  // 防止 keydown事件 多次执行 -- 用于移动
  prevDown_move: Boolean
  // 大小 状态 0=最小状态 1=变大状态
  playerSize: PlayerSize
  // 主角的级别 0=普通 1=发射子弹
  level: PlayerLevel
  // 固定一级二级宽度
  WHALL: number[][]
  // 是否允许操作
  isOption: Boolean
  // 绘制主角的图片坐标值
  playerCoor: PlayerCoor[]
  // 当前的坐标值
  cCoor: CoorDetail[]

  constructor() {
    super(0, 0, 7)
    this.viewportX = 0
    this.viewportY = 0
    this.WHALL = [[18, 25], [23, 42]]
    this.prevDown_jump = false
    this.prevDown_move = false
    this.level = 0
    this.playerSize = 0
    this.isOption = true
    // 坐标的初始位置
    this.playerCoor = [
      { startX: 23, startY: 507, playerSize: 0, level: 0 },
      { startX: 24, startY: 548, playerSize: 1, level: 0 },
      { startX: 94, startY: 589, playerSize: 0, level: 1 },
      { startX: 94, startY: 630, playerSize: 1, level: 1 }
    ]
    // 计算坐标
    this.playerCoor = this.playerCoor.map(v => {
      const { startX: x, startY: y } = v;
      v.coorDetail = []
      // 计算小的
      if (v.playerSize === 0) {
        // 0=跳跃 1=站立 2、3、4=移动
        v.coorDetail.push(
          { x: x + 116, y: y - 1, w: 16, h: 16 },
          { x: x, y: y - 1, w: 13, h: 16 },
          { x: x + 62, y: y - 1, w: 15, h: 16 },
          { x: x + 77, y: y - 1, w: 15, h: 16 },
          { x: x + 94, y: y - 1, w: 16, h: 16 },
        )
      } else {
        // 计算大的
        v.coorDetail.push(
          { x: x + 143, y: y - 2, w: 16, h: 32 },
          { x: x + 24, y: y - 2, w: 16, h: 32 },
          { x: x + 71, y: y - 1, w: 16, h: 31 },
          { x: x + 91, y: y - 1, w: 15, h: 30 },
          { x: x + 116, y: y - 2, w: 16, h: 32 },
        )
      }
      return v;
    })
    this.cCoor = this.getCCoor();
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
        if (this.playerSize === 0) return (hitRes! as CommonWall).top();
        // 主角在变大状态，并且顶到墙了会使墙碎裂
        if (this.playerSize === 1) return (hitRes! as CommonWall).breach();
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

  /**
   * 变身
   * @param level 0=普通，1=发射子弹 -1=不变
   * @param playerSize 0=小 1=大 -1=不变
   */
  shapeshift(level: PlayerLevel | -1, playerSize: PlayerSize | -1) {
    this.endMove();
    level !== -1 && (this.level = level)
    playerSize !== -1 && (this.playerSize = playerSize)
    this.cCoor = this.getCCoor();
    // 变大
    if (playerSize === 1) {
      this.isOption = false
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
    } else {
      this.setWH()
    }
  }

  // 绘制主角
  drawProtagonist() {
    const { ctx } = Store;
    const cs = this.cCoor
    Store.basicsDraw(() => {
      // 反转图片
      if (this.dir === 'a') {
        ctx.translate(this.w + this.x * 2, 0);
        ctx.scale(-1, 1);
      }
      // 跳跃或者悬空的时候
      if (this.isLevitation || this.isJump) {
        return ctx.drawImage(Store.materialImg, cs[0].x, cs[0].y, cs[0].w, cs[0].h, this.x, this.y, this.w, this.h) // 0
      }
      // 不在移动
      if (!this.prevDown_move) {
        return ctx.drawImage(Store.materialImg, cs[1].x, cs[1].y, cs[1].w, cs[1].h, this.x, this.y, this.w, this.h) // 1
      }
      // 在移动
      const cutNum = Store.cutImages(2, 180, "pMove");
      if (cutNum === 0) {
        ctx.drawImage(Store.materialImg, cs[2].x, cs[2].y, cs[2].w, cs[2].h, this.x, this.y, this.w, this.h) // 2
      } else if (cutNum === 1) {
        ctx.drawImage(Store.materialImg, cs[3].x, cs[3].y, cs[3].w, cs[3].h, this.x, this.y, this.w, this.h) // 3
      } else {
        ctx.drawImage(Store.materialImg, cs[4].x, cs[4].y, cs[4].w, cs[4].h, this.x, this.y, this.w, this.h) // 4
      }
    })
  }

  setWH() {
    this.w = this.WHALL[this.playerSize][0];
    this.h = this.WHALL[this.playerSize][1];
  }

  getCCoor() {
    return this.playerCoor.find(v => v.level === this.level && v.playerSize === this.playerSize)!.coorDetail!;
  }
}

export default new Player()
