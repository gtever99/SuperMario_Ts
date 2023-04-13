// 此处存放所有类共用的属性或方法

import { MapData, HitItem } from "./store-d"
import mapInfo from "../map/mapInfo"
import { Map_enemy, Map_back } from '../map/map-d'

class Store {
  // 游戏是否开始
  isStart: Boolean
  // 当前游戏的关卡，从 0 开始
  level: number
  // 地图的数据
  mapData: MapData[]
  // 所有敌人的枚举值
  enemyEnum: Map_enemy[]
  // 所有背景的枚举值
  backMnum: Map_back[]
  // canvas元素
  canvas: HTMLCanvasElement
  // canvas的2d上下文对象
  ctx: CanvasRenderingContext2D

  constructor() {
    this.isStart = false
    this.level = 0
    this.mapData = []
    this.enemyEnum = ['d-mo', 'd-gui']
    this.backMnum = ['', 'q', 'm-bd', 'm-gj', 'd', 'lu', 'd-sh', `q-jinbi-?`]
    this.canvas = document.querySelector('canvas')!
    this.ctx = this.canvas.getContext('2d')!
  }

  // 绘制的基礎方法
  basicsDraw(callback: Function) {
    this.ctx.beginPath()
    this.ctx.save()
    callback()
    this.ctx.restore()
    this.ctx.beginPath()
  }

  /**
   * 碰撞检测
   * @param hitObj1 第一个需要检测碰撞的x，y，w，h
   * @param hitObj2 第二个需要检测碰撞的x，y，w，h
   * @return Boolean
   */
  hitDetection(hitObj1: HitItem, hitObj2: HitItem) {
    return hitObj1.x + hitObj1.w >= hitObj2.x &&
      hitObj1.x <= hitObj2.x + hitObj2.w &&
      hitObj1.y + hitObj1.h >= hitObj2.y &&
      hitObj1.y <= hitObj2.y + hitObj2.h;
  }

  // 获取当前关卡信息
  get getCurrentMapInfo() {
    return mapInfo[this.level]
  }

  // 获取canvas的基本信息
  get getCanvasInfo() {
    return {
      w: this.canvas.offsetWidth,
      h: this.canvas.offsetHeight
    }
  }
}

export default new Store()
