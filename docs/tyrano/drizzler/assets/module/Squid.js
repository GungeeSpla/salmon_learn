import * as constants from './constant.js?Ver.0.1.2';
import * as utilities from './function.js?Ver.0.1.2';

/** Squid
 */
export default class Squid {
  /** .constructor(x, y, index, pointer)
   */
  constructor(x, y, index, pointer) {
    // プロパティ
    this.pointer = pointer;
    this.brothers = pointer.squids;
    this.$$parentLayer = pointer.$$parentLayer;
    // グラフィック
    this.draw(x, y, index);
    // イベントハンドラ
    this.setEvent();
  }

  /** .draw(x, y, index)
   * イカを描きます。（描き直す際にもそのまま使われます）
   */
  draw(x = this.x, y = this.y, index = this.index) {
    // 画像素材を決定 イカかタコか
    const image = (index > 0) ? constants.OCTA_IMAGE : constants.SQUID_IMAGE;
    // グラフィックを削除
    this.removeGraphics();
    // グラフィックを作り直す
    this.$$squid = utilities.create$$bitmap({
      src: `${this.pointer.assetsPath}/${image}`,
      regX: constants.SQUID_REG_X,
      regY: constants.SQUID_REG_Y,
      scale: constants.SQUID_SCALE,
      x,
      y,
    });
    // レイヤーに追加
    this.$$parentLayer.addChild(this.$$squid);
  }

  /** .setEvent()
   * イベントハンドラを登録します。
   */
  setEvent() {
    // ドラッグできるようにする
    utilities.draggable$$object(
      this.pointer.stage,
      this.$$squid,
      [this.$$squid],
      {
        // マウスを動かすたびに
        onMouseMove: () => {
          // リアルタイムモードでなければコウモリの矢印のアップデートを行う
          if (!this.pointer.isRTMode) {
            this.pointer.currentCourse.updateDrizzlerArrows(false);
          }
        },
        // マウスボタンを上げたときに
        onMouseUp: () => {
          // リアルタイムモードでなければ
          if (!this.pointer.isRTMode) {
            // コウモリの矢印のアップデートを行う
            this.pointer.currentCourse.updateDrizzlerArrows(false);
            // このイカが2番目以降ならば
            if (this.index > 0) {
              // ボロノイ図を塗る
              this.pointer.currentCourse.paintVoronoi();
            }
          }
        },
        // 捨てたときに
        onThrow: () => {
          // リアルタイムモードでなければ
          if (!this.pointer.isRTMode) {
            // コウモリの矢印のアップデートを行う
            this.pointer.currentCourse.updateDrizzlerArrows(false);
            // ボロノイ図を塗る
            this.pointer.currentCourse.paintVoronoi();
          }
        },
        throwTarget: this,
        currentCourse: this.pointer.currentCourse,
      },
    );
  }

  /** .index
   */
  get index() {
    return this.brothers.indexOf(this);
  }

  /** .x
   */
  get x() {
    return this.$$squid.x;
  }

  set x(value) {
    this.$$squid.x = value;
  }

  /** .y
   */
  get y() {
    return this.$$squid.y;
  }

  set y(value) {
    this.$$squid.y = value;
  }

  /** .remove()
   * 自身を抹消します。
   */
  remove() {
    // グラフィックを削除
    this.removeGraphics();
    // 兄弟配列から自身を削除
    this.removeMeFromBrothers();
    // 生き残りの兄弟についてグラフィックとイベントハンドラをリセット
    this.brothers.forEach((squid) => {
      squid.draw();
      squid.setEvent();
    });
  }

  /** .removeGraphics()
   */
  removeGraphics() {
    this.$$parentLayer.removeChild(this.$$squid);
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
