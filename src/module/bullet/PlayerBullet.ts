import Physical from "../physical/Physical";
import Store from "../store/Store";
import Player from "../protagonist/Player";

// 主角的子弹
export default class PlayerBullet extends Physical {
  W: number
  H: number
  constructor(x: number, y: number) {
    super(x, y, 5);
    this.move((hitRes) => {
      if (hitRes) {
        this.endMove()
      }
    })
    this.decline(hitRes => {
      if (!hitRes) return
      this.jump(100);
    })
    this.W = 8
    this.H = 8
    this.x = x + (Player.w - this.W / 2)
    this.y = y + (Player.h - (this.H + this.H / 2))
  }

  draw() {
    const { W, H, x, y } = this
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.fillRect(x, y, W, H);
      ctx.fill()
    })
  }

  destroy() {
    super.destroy();
  }
}
