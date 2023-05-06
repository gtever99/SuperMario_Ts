import Store from "../../store/Store";
import Map from "../Map";
import BasicMapBack from "./BasicMapBack";

/**
 *  '路' 类
 */
export default class Road extends BasicMapBack{
  constructor(x: number, y: number) {
    super(x, y, "=")
  }

  draw() {
    const { ctx } = Store;
    Store.basicsDraw(() => {
      ctx.drawImage(Store.materialImg, 373, 124, 16, 16, this.x, this.y, Map.BASIC_WIDTH, Map.BASIC_HEIGHT)
    })
  }
}
