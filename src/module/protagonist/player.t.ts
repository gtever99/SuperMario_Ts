// 主角的级别 0=普通 1=发射子弹
export type PlayerLevel = 0 | 1
// 主角的大小状态 0=小 1=大
export type PlayerSize = 0 | 1

// 主角坐标
export interface PlayerCoor {
  // 根据开始坐标和结束坐标计算出四个值
  startX: number;
  startY: number;
  playerSize: PlayerSize;
  level: PlayerLevel;
  coorDetail?: CoorDetail[]
}

// 坐标值
export interface CoorDetail {
  x: number;
  y: number;
  w: number;
  h: number;
}
