/**
 * 游戏的关卡信息
 */

import Store from "../store/Store";
import {Map_back, RenderMapData} from './map-d'
import config from "../config";

class Map {
  // 要渲染的数据
  renderMapData: RenderMapData[]
  // 最大 Y 边界值
  boundaryY: number
  // 最大 Y 边界值
  boundaryX: number

  constructor() {
    this.renderMapData = []
    this.boundaryY = 0
    this.boundaryX = 0
  }

  // 初始化游戏关卡
  init() {
    const { bodyMap } = Store.getCurrentMapInfo
    const { map } = bodyMap
    const { basicWidth, basicHeight } = config
    const { h } = Store.getCanvasInfo
    // 计算最大边界的宽和高

    // console.log(map.length, (map.length * basicHeight))
    this.boundaryY = -((map.length * basicHeight) - h);
    this.boundaryX = map[0].length * basicWidth;
    // 1 层
    map.map((v1, i1) => {
      // 2 层
      v1.map((v2, i2) => {
        // 空数据没有插入的必要
        if (v2 === '') return
        // 将背景和敌人分离
        if (Store.backMnum.includes((<Map_back>v2))){
          // 背景 ---------
          this.renderMapData.push({
            x: i2 * basicWidth,
            y: (i1 * basicHeight),
            type: <Map_back>v2
          })
        } else {
          // 敌人 ---------
          console.log(v2)
        }
      })
    })
    // 渲染 ------------
    this.renderMap()
  }

  // 渲染游戏地图
  renderMap() {
    // 要绘制的元素方法，普遍为：[draw-当前的背景类型],如墙是q，那么绘制墙为 draw-q
    this.renderMapData.map(v => {
      this[`draw-${<'q'>v.type}`](v)
    })
    // console.log(this.renderMapData)
    // console.log('当前要渲染的关卡：', level)
  }

  /**
   * 绘制墙
   * @param rd
   */
  'draw-q'(rd: RenderMapData) {
    const { ctx } = Store;
    Store.basicsDraw(function () {
      ctx.fillRect(rd.x, rd.y, config.basicHeight, config.basicWidth)
    })
  }
}

export default new Map()
