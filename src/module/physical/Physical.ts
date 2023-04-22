import Map from "../map/Map";
import Store from "../store/Store";

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
  // 是否在移动状态
  isMove: Boolean
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
  // 移动的方向
  dir: 'a' | 'd'
  // 初始速率
  private readonly SPEED: number;
  // 跳跃速率
  jumpSpeed: number
  // 移动速率 -- 值为跳跃速率 / 2 再下取整
  moveSpeed: number

  constructor(x: number, y: number, seed: number) {
    this.isLevitation = false
    this.isJump = false
    this.isMove = false
    this.dir = 'd'
    this.x = x
    this.y = y
    this.w = 0
    this.h = 0
    this.jumpTimer = undefined
    this.moveTimer = undefined;
    this.SPEED = seed
    this.jumpSpeed = this.SPEED
    this.moveSpeed = Math.floor(this.SPEED / 2)
  }

  // 下降
  decline(fn?: Function) {
    const declineHandle = () => {
      let { x, y } = this;
      y += this.jumpSpeed
      // 如果没碰到返回undefined，不然返回 RenderMapData
      let hitRes = this.mapHit(x, y)
      // 只有没碰到的时候物体会一直下降，或者不在跳跃状态下
      if (!hitRes && !this.isJump) {
        this.isLevitation = true
        this.y = y;
      } else {
        /**
         * 如果当前 y 值为 497，目标值为500，速率为4，当前碰撞检测就为true
         * 但是这样会发生 当前y值一直在497的情况，这样会会出现3px的悬空，所以要减去误差值
         */
        hitRes && (this.y += hitRes!.y - (this.y + this.h))
        // 只有被碰撞才会进入此条件
        this.isLevitation = false
      }
      fn && fn()
      requestAnimationFrame(declineHandle)
    }
    declineHandle()
  }

  /**
   * 跳跃
   * @param time 跳跃的持续时间
   * @return promise--碰撞到的时候返回的回调(参数1：碰撞到的地图对象)
   */
  jump(time: number) {
    return new Promise(resolve => {
      let { y } = this;
      // 在降落的时候无法跳跃
      if (this.isLevitation) return;
      const dateNow = Date.now();
      this.isJump = true;
      // 此事件会一直执行
      const jumpHandle = () => {
        if (!this.isJump) return;
        y -= this.jumpSpeed
        const isHit = this.mapHit(this.x, y)
        // 没碰到
        if (!isHit) {
          this.y = y
        } else {
          resolve(isHit)
          this.endJump();
        }
        // 递归执行
        this.jumpTimer = requestAnimationFrame(jumpHandle)
        // 如果超出规定事件会停止该事件
        if (Date.now() - dateNow > time) {
          this.endJump();
        }
      }
      jumpHandle()
    }).catch(err => {
      console.log(err)
    })
  }

  // 结束跳跃
  endJump() {
    window.cancelAnimationFrame(this.jumpTimer!)
    this.isJump = false;
  }

  /**
   * 移动
   * @param moveFn 移动回调
   */
  move = (moveFn?: Function) => {
    const moveHandle = () => {
      let { x, y } = this;
      // 移动计算
      if (this.dir === 'a') {
        x -= this.moveSpeed
      } else {
        x += this.moveSpeed
      }
      // 碰撞检测
      let hitRes = this.mapHit(x, y);
      if (!hitRes) {
        // 没撞到
        this.x = x
        if (moveFn) moveFn(0);
      } else {
        if (moveFn) moveFn(1);
      }
      this.moveTimer = requestAnimationFrame(moveHandle)
    }
    moveHandle()
  }

  /**
   * 对地图元素的碰撞检测
   * @param x 要检测的X位置
   * @param y 要检测的Y位置
   * @return 碰撞到的地图元素
   */
  mapHit(x: number, y: number) {
    return Map.getMapData.find(v => {
      // 碰撞检测
      return Store.hitDetection({
        x: x, y: y, h: this.h, w: this.w
      }, {
        x: v.x, y: v.y, h: Map.BASIC_HEIGHT, w: Map.BASIC_WIDTH
      })
    })
  }

  // 结束移动
  endMove() {
    window.cancelAnimationFrame(this.moveTimer!)
  }
}
