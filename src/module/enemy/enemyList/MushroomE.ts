import Physical from "../../physical/Physical";
import Store from "../../store/Store";

/**
 * 敌人-蘑菇
 *  特性：
 *    1、可以被踩死
 *    2、撞到主角 - 主角死亡
 */
export default class MushroomE extends Physical{
  constructor(x: number, y: number) {
    super(x, y, 2)
    this.w = 30
    this.h = 15
    this.x = x
    this.y = y
    this.eMove()
    this.decline();
  }

  eMove() {
    const { dir, x, y, w, h } = this
    // this.move(hitRes => {
    //   console.log(hitRes)
    //   if (status === 1) {
    //     this.dir = dir === 'a' ? 'd' : 'a'
    //   }
    // })
  }

  draw() {
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.w, this.h);
    })
  }
}
