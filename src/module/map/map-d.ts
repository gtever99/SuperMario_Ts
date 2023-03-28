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
  map: Map_Type[][],
  // 背景色 白 或者 黑
  backColor: '白' | '黑',
}

// 要渲染的数据
export interface RenderMapData {
  x: number,
  y: number,
  type: Map_back
}

// 敌人
export type Map_enemy =
  'd-mo' // d-mo = 敌人-蘑菇
  | 'd-gui' // d-gui = 敌人-乌龟
// 背景
export type Map_back =
  ''  // '' = 空
  | 'q' // q = 墙-可以被销毁
  | 'm-bd' // m-bd = 可以变大的蘑菇
  | 'm-gj' // m-gj = 可以攻击的蘑菇
  | 'd' // d = 普通下水道
  | 'lu' // lu = 道路
  | 'd-sh' // d-sh = 出食人花的下水道
  | `q-jinbi-${number | '?'}`; // q-jin-number = 只有一个墙，顶可以获得金币,后缀是获得几个金币

export type Map_Type = Map_enemy | Map_back // 完整的地图信息
