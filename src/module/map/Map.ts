/**
 * 游戏的关卡信息
 */

import Store from "../store/Store";
import {Map_back, RenderMapData} from './map-d'
import enemyPlant from "../enemy/EnemyPlant";
import Player from "../protagonist/Player";
import Road from "./mapList/Road";
import {WallUnknown} from "./mapList/WallUnknown";
import CommonWall from "./mapList/CommonWall";
import BasicMapBack from "./mapList/BasicMapBack";

class Map {
  // 要渲染的数据
  renderMapData: RenderMapData[]
  // 最大 Y 边界值
  boundaryY: number
  // 最大 Y 边界值
  boundaryX: number
  // 每一个地图上块的宽度
  BASIC_WIDTH: number
  // 每一个地图上块的高度
  BASIC_HEIGHT: number

  constructor() {
    this.renderMapData = []
    this.boundaryY = 0
    this.boundaryX = 0
    this.BASIC_WIDTH = 35
    this.BASIC_HEIGHT = 35
  }

  // 初始化游戏关卡
  init() {
    const { bodyMap } = Store.getCurrentMapInfo
    const { map } = bodyMap
    const { BASIC_WIDTH, BASIC_HEIGHT } = this
    // 计算最大边界的宽和高

    this.boundaryY = map.length * BASIC_HEIGHT;
    this.boundaryX = map[0].length * BASIC_HEIGHT;

    // 1 层
    map.map((v1, i1) => {
      let i2 = -1;
      for (const v2 of v1) {
        i2 ++
        // 空数据没有插入的必要
        if (v2.trim() === '') continue
        const x = i2 * BASIC_WIDTH, y = i1 * BASIC_HEIGHT
        // 将背景和敌人数据分离
        if (Store.backMnum.includes((<Map_back>v2))){
          // 背景 ---------
          this.renderMapData.push(this.mapPlant(<Map_back>v2, x, y)!)
        } else {
          // 敌人 ---------
          enemyPlant[v2 as '@'](x, y)
        }
      }
    })
    // 渲染 ------------
    this.renderMap()
  }

  // 返回各种地图类
  mapPlant (type: Map_back, x: number, y: number) {
    // 这几种是道具，返回位置方块类
    if (type === '^' || type === '$' || type === '?' || type === '*') {
      return new WallUnknown(x, y, type)
    }
    // 根据type返回对应地图
    switch (type) {
      case "=": {
        return new Road(x, y)
      }
      case "#": {
        return new CommonWall(x, y)
      }
    }
  }

  // 渲染游戏地图
  renderMap() {
    this.getMapData.map(v => v.draw())
  }

  // 获取地图元素数据，只会返回在当前视口内的数据
  get getMapData() {
    return this.renderMapData.filter(v => {
      return Store.hitDetection({
        ...v,
        w: this.BASIC_WIDTH,
        h: this.BASIC_HEIGHT
      }, {
        x: Player.viewportX,
        y: Player.viewportY,
        ...Store.getCanvasInfo
      })
    })
  }

  /**
   * 销毁地图元素
   * @param dGoal 销毁目标
   */
  destroyMapItem(dGoal: BasicMapBack) {
    // 传进的目标值 x、y、TYPE 类型和地图上的一直就过滤掉
    this.renderMapData = this.renderMapData.filter(v => !(v.x === dGoal.x && v.y === dGoal.y && v.TYPE === dGoal.TYPE))
  }
}

export default new Map()
