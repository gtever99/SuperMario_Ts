import MushroomE from "./enemyList/MushroomE";
import {EnemyList} from "./enemy-d";
import Store from "../store/Store";
import Map from "../map/Map";
import Player from "../protagonist/Player";

/**
 * 敌人的工厂类，返回各种不同的敌人
 */
class EnemyPlant {
  enemyList: EnemyList[]

  constructor() {
    this.enemyList = [];
  }

  // 蘑菇
  '@'(x: number, y: number) {
    this.enemyList.push(new MushroomE(x, y))
  }

  // 绘制所有敌人
  drawAllEnemy() {
    this.enemyList.map((v, i) => {
      v.draw()
      // 敌人超出范围删除
      if (v.x < 0 || v.x > Map.boundaryX) {
        delete this.enemyList[i]
      }
      // 碰撞检测-对主角的碰撞检测，如果敌人碰撞到主角那么主角死亡
      const isHit = Store.hitDetection({
        x: Player.x, y: Player.y, h: Player.h, w: Player.w
      }, v)
      if (isHit) {
        Player.x = 0;
      }
    })
    // 清除false数据
    this.enemyList.filter(Boolean);
  }
}

export default new EnemyPlant();
