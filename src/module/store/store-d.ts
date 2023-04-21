// 地图的数据信息
import { Map_Type } from '../map/map-d'
export interface MapData {
  // 地图类型
  type: Map_Type,
}

// 碰撞检测对象
export interface HitItem {
  x: number,
  y: number,
  w: number,
  h: number,
}

// 切换
export interface CutObj {
  [key: string]: {
    // 切换状态
    status: number,
    // 当前时间
    currentTime: number
  }
}
