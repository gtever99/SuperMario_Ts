/**
 * 加载所有图片
 */
class LoadImages {
  // 主角图片
  playerImg: HTMLImageElement

  constructor() {
    const images1 = new Image();
    images1.src = require("../../../public/images/protagonist.png").default;
    this.playerImg = images1;
  }
}
export default new LoadImages();
