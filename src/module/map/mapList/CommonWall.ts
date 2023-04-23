import BasicMapBack from "./BasicMapBack";
import Store from "../../store/Store";
import Map from "../Map";


export default class CommonWall extends BasicMapBack {
  constructor(x: number, y: number) {
    super(x, y, "#");
  }

  draw() {
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.drawImage(Store.materialImg, 374, 102, 13, 17, this.x, this.y, Map.BASIC_WIDTH, Map.BASIC_HEIGHT)
    })
  }

  appear() {
    super.top(() => {
      console.log(this.TYPE)
    })
  }
}
