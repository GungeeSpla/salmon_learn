import * as constants from './constant.js?Ver.0.1.2';
import * as utilities from './function.js?Ver.0.1.2';

/** DraggableBitmap
 */
export default class DraggableBitmap {
  /** .constructor(src, x, y, reg, scale, range, blast, colors, pointer)
   */
  constructor(src, x, y, reg, scale, range, blast, colors, pointer) {
    // プロパティ
    this.pointer = pointer;
    this.brothers = pointer.bitmaps;
    this.$$parentLayer = pointer.$$parentLayer;
    this.$$lowerLayer = pointer.$$lowerLayer;
    this.isSearching = true;
    // 描画
    this.draw(src, x, y, reg, scale, range, blast, colors);
    // イベントハンドラの登録
    this.setEvent();
  }

  /** .draw(src, x, y, reg, scale, range, blast, colors)
   * 描画します。
   * rangeは直撃射程、blastは爆風射程。
   */
  draw(src, x, y, reg, scale, range, blast, colors) {
    /** - グラフィック:Container -
     */
    this.$$container = new createjs.Container();
    this.$$container.x = x;
    this.$$container.y = y;
    this.$$parentLayer.addChild(this.$$container);

    /** - グラフィック:索敵円 -
     */
    // 爆風射程があるかどうか、そもそも射程があるかどうかで場合分け
    if (blast) {
      // 爆風射程がある場合
      // 直撃射程、爆風射程、その比
      const radiusDirect = range * this.pointer.currentCourse.scale;
      const radiusBlast = (range + blast) * this.pointer.currentCourse.scale;
      const radiusRatio = radiusDirect / radiusBlast;
      const little = 0.001;
      // グラデーションオブジェクトを作成
      this.$$circle = utilities.create$$gradCircle({
        x,
        y,
        radius: radiusBlast,
        colors: ['#fff', ...colors],
        colorRates: [0.6, radiusRatio, radiusRatio + little, 1],
      });
      // 下のレイヤーに追加
      this.$$lowerLayer.addChild(this.$$circle);
    } else if (range) {
      // グラデーションオブジェクトを作成
      this.$$circle = utilities.create$$gradCircle({
        x,
        y,
        radius: range * this.pointer.currentCourse.scale,
        colors: ['#fff', colors[0]],
        colorRates: [0.7, 1],
      });
      // 下のレイヤーに追加
      this.$$lowerLayer.addChild(this.$$circle);
    } else {
      // そもそも射程がない場合
      this.$$circle = new createjs.Shape();
      this.$$lowerLayer.addChild(this.$$circle);
    }

    /** - グラフィック:背景 -
     */
    this.$$handle = new createjs.Shape();
    this.$$handle.graphics.beginFill(constants.WEAPON_HANDLE_COLOR);
    this.$$handle.graphics.drawCircle(0, 0, (reg * scale) + constants.WEAPON_HANDLE_MARGIN);
    this.$$container.addChild(this.$$handle);

    /** - グラフィック:画像 -
     */
    this.$$bitmap = utilities.create$$bitmap({
      src,
      regX: reg,
      regY: reg,
      scale,
    });
    this.$$container.addChild(this.$$bitmap);
  }

  /** .setEvent()
   * イベントハンドラを登録します。
   */
  setEvent() {
    // ドラッガブルにする
    utilities.draggable$$object(
      this.pointer.stage,
      this.$$handle,
      [this.$$container, this.$$circle],
      {
        onMouseUpQuick: () => {
          this.toggleSearching();
        },
        throwTarget: this,
        currentCourse: this.pointer.currentCourse,
      },
    );
  }

  /** .x
   */
  get x() {
    return this.$$container.x;
  }

  set x(value) {
    this.$$container.x = value;
  }

  /** .y
   */
  get y() {
    return this.$$container.y;
  }

  set y(value) {
    this.$$container.y = value;
  }

  /** .toggleSearching()
   */
  toggleSearching() {
    this.isSearching = !this.isSearching;
    const alpha = (this.isSearching) ? 1 : 0;
    utilities.instantTween(
      this.$$circle,
      { alpha },
      constants.DRIZZLER_TWEEN_TIME,
      constants.DRIZZLER_TWEEN_EASE,
    );
  }

  /** .remove()
   */
  remove() {
    this.removeGraphics();
    this.removeMeFromBrothers();
  }

  /** .removeGraphics()
   */
  removeGraphics() {
    this.$$parentLayer.removeChild(this.$$container);
    this.pointer.$$lowerLayer.removeChild(this.$$circle);
  }

  /** .removeMeFromBrothers()
   */
  removeMeFromBrothers() {
    const thisIndex = this.brothers.indexOf(this);
    if (thisIndex > -1) {
      this.brothers.splice(thisIndex, 1);
    }
  }
}
