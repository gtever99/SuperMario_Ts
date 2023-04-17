import Map from "../map/Map";
import Store from "../store/Store";
import Config from "../config";

/**
 * 物体类，所有物体(如：敌人、主角、蘑菇)的父类
 *    此类包含功能：
 *     1、基本物理规则
 *     2、跳跃
 *     3、左右移动
 */
export default class Physical {
  // 是否在掉落状态
  isLevitation: Boolean
  // 是否在跳跃状态
  isJump: Boolean
  // x位置
  x: number
  // y位置
  y: number
  // 宽度
  w: number
  // 高度
  h: number
  // 跳跃的定时器
  jumpTimer: number | undefined
  // 移动的定时器
  moveTimer: number | undefined
  // 速率-不会更改
  SPEED: number;
  // 速率
  speed: number

  constructor(w: number, h: number) {
    this.isLevitation = false
    this.isJump = false
    this.x = 0
    this.y = 0
    this.w = w
    this.h = h
    this.jumpTimer = undefined
    this.moveTimer = undefined;
    this.SPEED = 8
    this.speed = this.SPEED
  }

  // 下降
  decline() {
    let { x, y } = this;
    y += this.speed
    // 如果没碰到返回undefined，不然返回 RenderMapData
    let hitRes = Map.renderMapData.find(v => {
      // 碰撞检测
      return Store.hitDetection({
        x: x, y: y, h: this.h, w: this.w
      }, {
        x: v.x, y: v.y, h: Config.basicHeight, w: Config.basicWidth
      })
    })
    // 只有没碰到的时候主角才会一直下降，或者不在跳跃状态下
    if (!hitRes && !this.isJump) {
      this.isLevitation = true
      this.y = y;
    } else {
      // 只有被碰撞才会进入此条件
      this.isLevitation = false
      // 如果速率设置太高那么可能会出现不贴近的情况
      // 此段代码规定：在碰撞到的情况下，会将速率设置成可以贴近其它块的值，如果跳跃的时候会将值回复
      if (!this.isJump) {
        this.speed = 1;
      } else {
        this.speed = this.SPEED;
      }
    }
  }

  /**
   * 跳跃
   * @param time 跳跃的持续时间
   */
  jump(time: number) {
    // 在降落的时候无法跳跃
    if (this.isLevitation) return;
    const dateNow = Date.now();
    this.isJump = true;
    // 此事件会一直执行
    const jumpHandle = () => {
      // 递归执行
      this.jumpTimer = requestAnimationFrame(jumpHandle)
      // 如果超出规定事件会停止该事件
      if (Date.now() - dateNow > time) {
        this.endJump();
      }
      this.y -= this.speed
    }
    jumpHandle()
  }

  // 结束跳跃
  endJump() {
    window.cancelAnimationFrame(this.jumpTimer!)
    this.isJump = false;
  }

  /**
   * 移动
   * @param location a=左，d=右
   * @param hitFn 撞到之后的回调
   */
  move = (location: 'a' | 'd', hitFn?: Function) => {
    const moveHandle = () => {
      let { x, y } = this;
      // 将速率重置
      this.speed = this.SPEED;
      // 移动计算
      if (location === 'a') {
        x -= this.SPEED / 2
      } else {
        x += this.SPEED / 2
      }
      // 碰撞检测
      let hitRes = Map.renderMapData.find(v => {
        // 只会检测 '墙'
        if (v.type !== '=') return
        // 碰撞检测
        return Store.hitDetection({
          x: x, y: y, h: this.h, w: this.w
        }, {
          x: v.x, y: v.y, h: Config.basicHeight, w: Config.basicWidth
        })
      })
      if (!hitRes) {
        // 没撞到
        this.x = x
      } else {
        // 撞到了
        if (hitFn) hitFn();
      }
      this.moveTimer = requestAnimationFrame(moveHandle)
    }
    moveHandle()
  }

  // 结束移动
  endMove() {
    window.cancelAnimationFrame(this.moveTimer!)
  }
}
