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
  // 跳跃
  isJump: Boolean
  // x位置
  x: number
  // y位置
  y: number
  // 宽度
  w: number
  // 高度
  h: number

  constructor(x: number, y: number, w: number, h: number) {
    this.isLevitation = false
    this.isJump = false
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  // 下降
  decline() {

  }

  /**
   * 跳跃
   * @param time 跳跃的持续时间
   */
  jump(time: number) {

  }

  /**
   * 移动
   * @param location w=上，s=下，a=左，d=右
   */
  move(location: 'w' | 's' | 'a' | 'd') {

  }
}
