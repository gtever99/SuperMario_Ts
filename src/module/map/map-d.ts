// 地图信息
export interface MapInfo {
  // 主地图
  bodyMap: MainMap,
  // 隐藏地图
  hideMap?: MainMap
}

// 一个完整地图
export interface MainMap {
  // 地图信息
  map: Map_Type[],
  // 背景色 白 或者 黑
  backColor: '白' | '黑',
}

// 要渲染的数据
export interface RenderMapData {
  x: number,
  y: number,
  type: Map_back
}

// 敌人 @：蘑菇
export type Map_enemy = '@'
// 背景 =：墙
export type Map_back = '='

export type Map_Type = string // 完整的地图信息
