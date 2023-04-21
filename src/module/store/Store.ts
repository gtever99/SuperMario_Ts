// 此处存放所有类共用的属性或方法
import {MapData, HitItem, CutObj} from "./store-d"
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
  // 防抖的定时器ID
  debunceTimeId: NodeJS.Timer | undefined
  cutObj: CutObj

  constructor() {
    this.isStart = false
    this.level = 0
    this.mapData = []
    this.enemyEnum = ['@']
    this.backMnum = ['=']
    this.canvas = document.querySelector('canvas')!
    this.ctx = this.canvas.getContext('2d')!
    this.debunceTimeId = undefined;
    this.cutObj = {}
  }

  /**
   * 切换切图，每隔 gapTime 毫秒，当前状态会 ++,到了max会重置为0
   * 状态从0开始
   * @param max 当前状态的最大值，如果当前max为2，那么status为0、1、2、0、1、2...
   * @param gapTime 间隔时间
   * @param key 一个唯一的key值 -- 这个方法可能会调用很多次，用于记录私有状态
   * @return Promise 返回当前状态的值
   */
  cutImages(max: number, gapTime: number, key: string) {
    if (!(key in this.cutObj)) {
      this.cutObj[key] = {
        status: 0,
        currentTime: 0
      };
    }
    let { currentTime, status } = this.cutObj[key];
    if (Date.now() - gapTime > currentTime) {
      this.cutObj[key].currentTime = Date.now()
      this.cutObj[key].status = status >= max ? 0 : ++status
    }
    return status;
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
    return hitObj1.x + hitObj1.w > hitObj2.x &&
      hitObj1.x < hitObj2.x + hitObj2.w &&
      hitObj1.y + hitObj1.h > hitObj2.y &&
      hitObj1.y < hitObj2.y + hitObj2.h;
  }

  // 防抖函数
  debunce(fn:Function, delay: number): Function {
    return (...arg: any[]) => {
      if (this.debunceTimeId) {
        clearInterval(this.debunceTimeId);
      }
      this.debunceTimeId = setTimeout(() => {
        fn(...arg)
        this.debunceTimeId = undefined;
      }, delay)
    }
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
