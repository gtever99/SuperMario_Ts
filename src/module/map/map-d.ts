// 地图信息
import Road from "./mapList/Road";
import BasicMapBack from "./mapList/BasicMapBack";
import CommonWall from "./mapList/CommonWall";
import {WallUnknown} from "./mapList/WallUnknown";

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
export type RenderMapData = Road | BasicMapBack | CommonWall | WallUnknown

// 敌人 @：蘑菇
export type Map_enemy = '@'
/** 背景
 * =：路
 * (#：墙
 * ?：金币
 * ^：红蘑菇，变大
 * *：绿蘑菇，加一条生命
 * $：花，可以发射子弹
 */
export type Map_back = '=' | '#' | Wu_back_type
// ? 方块的类型
export type Wu_back_type = '?' | '^' | '*' | '$'
// 道具的類型
export type Prop_type = '^_' | '*_' | '$_'

export type Map_Type = string // 完整的地图信息

// 墙碎裂
export interface WallDestroy {
  X: number,
  Y: number,
  XEnd: number,
  YEnd: number,
  loop: number,
  XSeed: number,
  A: number
}
