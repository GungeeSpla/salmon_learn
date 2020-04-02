import * as constants from './constant.js?Ver.0.1.2';
import * as utilities from './function.js?Ver.0.1.2';

/** Park(alphabet, x, y)
 * 駐車場クラス。
 */
const Park = function Park(alphabet, x, y) {
  this.alphabet = alphabet;
  this.x = x;
  this.y = y;
  this.connectParks = [];
};

/** Course
 */
export default class Course {
  /** .constructor(def, zMap, pointer)
   */
  constructor(def, zMap, pointer) {
    // defのプロパティを自身に上書きする
    Object.keys(def).forEach((key) => {
      this[key] = def[key];
    });
    // プロパティ初期化
    this.zMap = zMap;
    this.parks = [];
    this.pointer = pointer;
    this.isTrashEnabled = false;
    this.isVisibleArrow = true;
    this.isSelectingVoronoi = false;
    this.isVisibleVoronoi = false;
    this.isTogglingVoronoi = false;
    this.shouldUpdateVoronoi = true;
    this.isVisibleConnectMap = true;
    this.isArrowUpdateStopped = false;
    this.isVisibleDrizzlerCircle = false;
    this.timerOfArrowUpdate = null;
    this.$$parentLayer = pointer.$$parentLayer;
    // 定義defを解釈する
    this.parseDefine(def);
  }

  /** .parseDefine(def)
   * 定義を解釈します。
   */
  parseDefine(def) {
    // 駐車場を作成
    def.parks.forEach((pos, i) => {
      // インデックスをアルファベット(A, B, ...)に変換
      const alphabet = utilities.number2alphabet(i);
      // Parkインスタンスを作成
      this.parks.push(new Park(alphabet, pos[0], pos[1]));
    });
    // 駐車場と駐車場を繋げる
    // 'AB', 'BC', 'CD', ... などのデータからコネクトデータを作成
    def.lines.forEach((line) => {
      const strParkA = line.charAt(0).toUpperCase(); // eg. 'A'
      const strParkB = line.charAt(1).toUpperCase(); // eg. 'B'
      const parkA = this.getPark(strParkA);
      const parkB = this.getPark(strParkB);
      parkA.connectParks.push(parkB); // Park AにとってPark Bは繋がっている
      parkB.connectParks.push(parkA); // Park BにとってPark Aは繋がっている
    });
    // 繋がりを持たない駐車場を削除する
    for (let i = 0; i < this.parks.length; i += 1) {
      const park = this.parks[i];
      if (park.connectParks.length === 0) {
        this.parks.splice(i, 1);
        i -= 1;
      }
    }
  }

  /** .getPark(str)
   * 駐車場をアルファベットから取得します。
   */
  getPark(str) {
    // strを数値データにパースしてみる
    const parsed = parseInt(str, 10);
    // パースの結果次第
    if (Number.isNaN(parsed)) {
      // 数値にならなかった(アルファベットだった)場合
      // そのアルファベットが設定された駐車場をして返す
      for (let i = 0; i < this.parks.length; i += 1) {
        if (this.parks[i].alphabet === str) {
          return this.parks[i];
        }
      }
    } else {
      // 数字になった場合それをインデックスにしてparkを取得
      return this.parks[parsed];
    }
    // この期に及んで何も返せていないならしょうがないnullを返す
    return null;
  }

  /** .paintVoronoi()
   * ボロノイ図を塗ります。
   */
  paintVoronoi() {
    // ボロノイ図表示が有効でないならば
    if (!this.isVisibleVoronoi) {
      // ボロノイ図をアップデートすべきだというフラグだけ立てて帰る
      this.shouldUpdateVoronoi = true;
      return;
    }
    // 2dContextと色を取得
    const ctx = this.$$paint.image.getContext('2d');
    const col = constants.VORONOI_COLORS;
    // とりあえず白色で塗っておく
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    // ボロノイターゲットのコウモリを取得する
    let drizzler = null;
    this.pointer.drizzlers.forEach((dzr) => {
      if (dzr.isEnabledVoronoi) {
        drizzler = dzr;
      }
    });
    // コウモリがいなければ何もしない
    // if (this.pointer.drizzlers.length === 0) {
    if (!drizzler) {
      return;
    }
    // コウモリがいても、そのコウモリの飛び先がなければ何もしない
    // const drizzler = this.pointer.drizzlers[0];
    const connectParks = utilities.excludeParkDrizzlerExists(
      drizzler.currentPark.connectParks,
      this.pointer.drizzlers,
    );
    if (connectParks.length === 0) {
      return;
    }
    // コウモリがいてしかもその飛び先があっても、飛び先がひとつしかないなら1色で塗って終わり
    if (connectParks.length === 1) {
      ctx.fillStyle = `rgb(${col[0][0]}, ${col[0][1]}, ${col[0][2]})`;
      ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      return;
    }
    // 少なくとも2色以上の色でボロノイ図を塗る必要があるようだ！
    // イカが複数体いるかどうか
    const pluralSquidsExists = (this.pointer.squids.length >= 2);
    // イカの座標をコピーする
    const tempSquids = [];
    this.pointer.squids.forEach((squid, i) => {
      tempSquids[i] = {
        x: squid.x,
        y: squid.y,
      };
    });
    // ImageDataのすべてのピクセルについて走査する
    const imagedata = ctx.getImageData(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    for (let x = 0; x < constants.CANVAS_WIDTH; x += 1) {
      for (let y = 0; y < constants.CANVAS_HEIGHT; y += 1) {
        // 何色で塗るか
        let idx;
        // イカが複数体いるかどうか
        if (!pluralSquidsExists) {
          // 1匹しかいないならば
          // このピクセルx, yに最も近い駐車場のインデックスを取得 それで塗る色を決めよう
          [, idx] = utilities.getMinDistancePark({ x, y }, connectParks);
        } else {
          // 複数体いるならば
          // 1匹目のイカがこのピクセルx, yにいると仮定して
          tempSquids[0].x = x;
          tempSquids[0].y = y;
          // 最もコウモリに近いイカを取得
          const squid = utilities.getMinDistancePark(drizzler, tempSquids)[0];
          // そのイカに最も近い駐車場のインデックスを取得 それで塗る色を決めよう
          [, idx] = utilities.getMinDistancePark(squid, connectParks);
        }
        // ピクセルx, yのImageDataにおけるインデックス
        const i = (x + y * constants.CANVAS_WIDTH) * 4;
        // 塗る
        [
          imagedata.data[i + 0],
          imagedata.data[i + 1],
          imagedata.data[i + 2],
        ] = col[idx];
      }
    }
    // ImageDataをctxに置く
    ctx.putImageData(imagedata, 0, 0);
    // アップデートの必要はなし(いまアップデートしたので)
    this.shouldUpdateVoronoi = false;
  }

  /** .updateDrizzlerArrows(isAnimation)
   * コウモリの矢印をアップデートします。
   */
  updateDrizzlerArrows(isAnimation) {
    clearTimeout(this.timerOfArrowUpdate);
    this.timerOfArrowUpdate = setTimeout(() => {
      this.pointer.drizzlers.forEach((drizzler) => {
        drizzler.updateArrow(isAnimation);
      });
    }, 10);
  }

  /** .hideDrizzlerArrows()
   */
  hideDrizzlerArrows() {
    this.pointer.drizzlers.forEach((drizzler) => {
      drizzler.hideArrow();
    });
  }

  /** .showDrizzlerArrows()
   */
  showDrizzlerArrows() {
    this.pointer.drizzlers.forEach((drizzler) => {
      drizzler.showArrow();
    });
  }

  /** .setNull()
   * プロパティにnullを設定します。
   */
  setNull() {
    this.$$leftSeconds = null;
    this.$$paint = null;
    this.$$trashOpen = null;
    this.$$trashClose = null;
    this.$$connectMapContainer = null;
  }

  /** .draw()
   * 描画します。
   */
  draw() {
    /** - グラフィック:コース背景色 -
     */
    const $$backgroundColor = new createjs.Shape();
    $$backgroundColor.graphics
      .beginFill(constants.BACKGROUND_COLOR)
      .rect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    this.$$parentLayer.addChild($$backgroundColor);
    if (constants.DO_LOG_CLICK_POS) {
      $$backgroundColor.on('mousedown', () => {
        const x = Math.floor(this.pointer.stage.mouseX);
        const y = Math.floor(this.pointer.stage.mouseY);
        console.log(`[${x}, ${y}]`);
      });
    }

    /** - グラフィック:コース画像 -
     */
    const $$background = utilities.create$$bitmap({
      src: this.image,
      regX: this.width / 2,
      regY: this.height / 2,
      scale: this.scale,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
    });
    this.$$parentLayer.addChild($$background);

    /** - グラフィック:残り秒数 -
     */
    this.$$leftSeconds = new createjs.Text(
      '',
      constants.LEFT_TIME_FONT_STYLE,
      constants.LEFT_TIME_FONT_COLOR,
    );
    this.$$leftSeconds.x = constants.LEFT_TIME_X;
    this.$$leftSeconds.y = constants.LEFT_TIME_Y;
    this.$$parentLayer.addChild(this.$$leftSeconds);

    /** - グラフィック:ゴミ箱 -
     */
    this.isTrashEnabled = false;
    if (!this.pointer.isRTMode) {
      this.isTrashEnabled = true;
      this.$$trashOpen = new createjs.Bitmap(
        `${this.pointer.assetsPath}/${constants.TRASH_IMAGE_OPEN}`,
      );
      this.$$trashOpen.set({
        alpha: 0,
        x: constants.TRASH_LEFT,
        y: constants.TRASH_TOP,
      });
      this.$$parentLayer.addChild(this.$$trashOpen);
      this.$$trashClose = new createjs.Bitmap(
        `${this.pointer.assetsPath}/${constants.TRASH_IMAGE_CLOSE}`,
      );
      this.$$trashClose.set({
        alpha: 1,
        x: constants.TRASH_LEFT,
        y: constants.TRASH_TOP,
      });
      this.$$parentLayer.addChild(this.$$trashClose);
    }

    /** - グラフィック:コウモリマップのContainer -
     */
    this.$$connectMapContainer = new createjs.Container();
    this.$$parentLayer.addChild(this.$$connectMapContainer);

    /** - グラフィック:駐車場のボーダー -
     */
    const $$parkBorders = new createjs.Shape();
    this.parks.forEach((park) => {
      const g = $$parkBorders.graphics;
      g.beginFill(constants.BORDER_COLOR);
      g.drawCircle(park.x, park.y, constants.PARK_RADIUS + constants.BORDER_WIDTH);
    });
    $$parkBorders.cache(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    this.$$connectMapContainer.addChild($$parkBorders);

    /** - グラフィック:コネクトラインとそのボーダー -
     */
    const $$sides = new createjs.Shape();
    this.lines.forEach((line) => {
      const alphabet1 = line.charAt(0).toUpperCase();
      const alphabet2 = line.charAt(1).toUpperCase();
      const park1 = this.getPark(alphabet1);
      const park2 = this.getPark(alphabet2);
      const g = $$sides.graphics;
      g.setStrokeStyle(
        constants.SIDE_WIDTH + (constants.BORDER_WIDTH * 2),
        constants.STROKE_LINECAP,
      );
      g.beginStroke(constants.BORDER_COLOR);
      g.moveTo(park1.x, park1.y);
      g.lineTo(park2.x, park2.y);
      g.endStroke();
    });
    this.lines.forEach((line) => {
      const alphabet1 = line.charAt(0).toUpperCase();
      const alphabet2 = line.charAt(1).toUpperCase();
      const park1 = this.getPark(alphabet1);
      const park2 = this.getPark(alphabet2);
      const g = $$sides.graphics;
      g.setStrokeStyle(constants.SIDE_WIDTH, constants.STROKE_LINECAP);
      g.beginStroke(constants.SIDE_COLOR);
      g.moveTo(park1.x, park1.y);
      g.lineTo(park2.x, park2.y);
      g.endStroke();
    });
    $$sides.cache(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    this.$$connectMapContainer.addChild($$sides);

    /** - グラフィック:駐車場 -
     */
    this.parks.forEach((park) => {
      const $$park = new createjs.Shape();
      const g = $$park.graphics;
      // g.beginFill(constants.BORDER_COLOR);
      // g.drawCircle(0, 0, constants.PARK_RADIUS + constants.BORDER_WIDTH);
      g.beginFill(constants.PARK_COLOR);
      g.drawCircle(0, 0, constants.PARK_RADIUS);
      $$park.x = park.x;
      $$park.y = park.y;
      let r = constants.PARK_RADIUS + constants.BORDER_WIDTH;
      $$park.cache(-r, -r, r * 2, r * 2);
      this.$$connectMapContainer.addChild($$park);
      const $$text = new createjs.Text(
        park.alphabet, constants.PARK_FONT_STYLE, constants.PARK_FONT_COLOR,
      );
      r = Math.ceil(constants.PARK_FONT_SIZE / 2);
      $$text.textAlign = 'center';
      $$text.textBaseline = 'middle';
      $$text.x = park.x;
      $$text.y = park.y;
      $$text.cache(-r, -r, r * 2, r * 2);
      this.$$connectMapContainer.addChild($$text);
      // ドラッガブル
      if (constants.IS_DRAGGABLE_PARK) {
        utilities.draggable$$object(this.pointer.stage, $$park, [$$park, $$text], {
          onMouseMove: () => {
            const x = Math.floor($$park.x);
            const y = Math.floor($$park.y);
            console.log(`${park.alphabet} [${x}, ${y}]`);
          },
        });
      }
    });
    this.$$connectMapContainer.cache(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

    /** - グラフィック:ボロノイ図 -
     */
    this.$$paint = utilities.create$$bitmap({
      src: utilities.create$canvas(constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT),
      alpha: constants.VORONOI_ALPHA,
      compositeOperation: 'multiply',
    });
    this.$$parentLayer.addChild(this.$$paint);
  }
}
