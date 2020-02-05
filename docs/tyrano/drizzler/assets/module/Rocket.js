import * as constants from './constant.js?Ver.0.0.0';
import * as utilities from './function.js?Ver.0.0.0';

/** Rocket
 */
export default class Rocket {
  /** .constructor(pos, vec, rotation, pointer)
   */
  constructor(pos, vec, rotation, pointer) {
    // プロパティ1
    this.pointer = pointer;
    this.brothers = pointer.rockets;
    this.$$parentLayer = pointer.$$parentLayer;
    // プロパティ2
    this.frame = 0;
    this.isAlive = true;
    this.next = { frame: -1, func: null };
    this.maxLife = constants.ROCKET_HP;
    this.currentLife = constants.ROCKET_HP;
    // プロパティ3
    this.isFirstMove = true;
    this.isTurned = false;
    this.hasArmor = true;
    // 描画
    this.draw(pos, rotation);
    // イベントハンドラを登録
    this.setEvent();
    // 速度を決定
    this.setVelocity(vec);
    // 一定時間後
    this.setNext(constants.ROCKET_MOVE_FRAME, () => {
      // 弾を停止
      this.vx = 0;
      this.vy = 0;
      this.ax = 0;
      this.ay = 0;
      // アーマーを剥がす
      this.removeArmor();
      // ファーストムーブフラグを折る
      this.isFirstMove = false;
      // さらに一定時間後
      this.setNext(constants.ROCKET_WAIT_DIE_FRAME, () => {
        // ロケットが生きていて、かつ、打ち返されていなければ
        if (this.isAlive && !this.isTurned) {
          // 雨を降らせる
          this.generateRain();
        }
      });
    });
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

  /** .z
   */
  get z() {
    return this.$$container.z;
  }

  set z(value) {
    this.$$container.z = value;
  }

  /** .scale
   */
  get scale() {
    return this.$$container.scale;
  }

  set scale(value) {
    this.$$container.scale = value;
  }

  /** .alpha
   */
  get alpha() {
    return this.$$container.alpha;
  }

  set alpha(value) {
    this.$$container.alpha = value;
  }

  /** .set(x, y)
   */
  set(x, y) {
    this.x = x;
    this.y = y;
  }

  /** .draw(pos, rotation)
   * 描画します。
   */
  draw(pos, rotation) {
    /** - グラフィック:Container -
     */
    this.$$container = new createjs.Container();
    this.$$rocketContainer = new createjs.Container();
    this.$$lifeBarContainer = new createjs.Container();
    this.$$container.addChild(this.$$rocketContainer, this.$$lifeBarContainer);
    this.$$container.x = pos.x;
    this.$$container.y = pos.y;
    this.$$container.z = this.pointer.currentCourse.zMap.get(pos.x, pos.y);
    this.$$rocketContainer.rotation = rotation;
    this.$$lifeBarContainer.alpha = 0;
    this.$$lifeBarContainer.originAlpha = 0;
    this.$$parentLayer.addChild(this.$$container);

    /** - グラフィック:ロケット画像 -
     */
    this.$$rocket = utilities.create$$bitmap({
      src: `${this.pointer.assetsPath}/${constants.ROCKET_IMAGE}`,
      regX: constants.ROCKET_REG_X,
      regY: constants.ROCKET_REG_Y,
      scale: constants.ROCKET_SCALE,
    });
    this.$$rocketContainer.addChild(this.$$rocket);

    /** - グラフィック:ロケット画像(アーマーが剥げた肉の部分) -
     */
    this.$$rocketMeat = utilities.create$$bitmap({
      src: `${this.pointer.assetsPath}/${constants.ROCKET_MEAT_IMAGE}`,
      regX: constants.ROCKET_REG_X,
      regY: constants.ROCKET_REG_Y,
      scale: constants.ROCKET_SCALE,
      alpha: 0,
    });
    this.$$rocketContainer.addChild(this.$$rocketMeat);

    /** - グラフィック:ライフバー -
     */
    [
      this.$$lifeBarBg,
      this.$$lifeBar,
    ] = utilities.create$$lifeBars();
    this.$$lifeBarContainer.addChild(this.$$lifeBarBg);
    this.$$lifeBarContainer.addChild(this.$$lifeBar);
  }

  /** .setEvent()
   * イベントをセットします。
   */
  setEvent() {
    this.$$rocketContainer.cursor = 'pointer';
    // マウスダウン時に 生きていて アーマーを持っていなければ ダメージを与える
    this.$$rocketContainer.on('mousedown', () => {
      if (this.isAlive) {
        if (!this.hasArmor) {
          this.receiveDamage(constants.DRIZZLER_DEFAULT_DAMAGE);
        }
      }
    });
  }

  /** .setVelocity(vec)
   * 初速を与えます。最終的な移動量がvec。
   */
  setVelocity(vec) {
    // 移動にかける時間
    const f = constants.ROCKET_MOVE_FRAME;
    // 初速を適当な割合で増やす
    const vx = constants.ROCKET_INITIAL_VELOCITY_RATIO * (vec.x / f);
    const vy = constants.ROCKET_INITIAL_VELOCITY_RATIO * (vec.y / f);
    // どれくらいのペースで減速させればよいか計算する
    let an = 0;
    for (let i = 1; i <= constants.ROCKET_MOVE_FRAME; i += 1) {
      an += i;
    }
    const ax = (vec.x - vx * f) / an;
    const ay = (vec.y - vy * f) / an;
    // 速度と加速度を代入
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.vscale = 0;
    this.valpha = 0;
  }

  /** .tick()
   */
  tick() {
    this.frame += 1;
    if (this.isFirstMove) {
      this.vx += this.ax;
      this.vy += this.ay;
      this.pointer.currentCourse.zMap.moveObjectWithZMap(this, constants.ROCKET_DEAD_SLIP);
    } else if (this.isTurned) {
      const ret = this.pointer.currentCourse.zMap.moveObjectWithZMap(
        this,
        constants.ROCKET_DEAD_SLIP,
      );
      this.pointer.drizzlers.forEach((drizzler) => {
        const d = utilities.getDistance(this, drizzler);
        const r = constants.DRIZZLER_WIDTH / 2;
        if (d < r) {
          this.die();
          drizzler.die();
        }
      });
      if (ret < 1) {
        this.die();
      }
    }
    this.alpha += this.valpha;
    this.scale += this.vscale;
    if (this.next.frame > -1 && this.frame >= this.next.frame) {
      this.next.frame = -1;
      this.next.func();
    }
  }

  /** .removeArmor()
   */
  removeArmor() {
    this.hasArmor = false;
    this.$$rocketMeat.alpha = 1;
  }

  /** .receiveDamage(dmg)
   */
  receiveDamage(dmg) {
    this.currentLife = Math.max(0, this.currentLife - dmg);
    const lifeRate = this.currentLife / this.maxLife;
    if (lifeRate !== 1) {
      this.$$lifeBarContainer.alpha = 1;
    }
    const g = this.$$lifeBar.graphics;
    g.clear();
    g.beginFill(constants.HP_BAR_COLOR);
    g.drawRect(0, 0, constants.HP_BAR_WIDTH * lifeRate, constants.HP_BAR_HEIGHT);
    if (this.currentLife === 0) {
      this.$$lifeBarContainer.alpha = 0;
      this.turn();
    }
  }

  /** .turn()
   */
  turn() {
    this.isTurned = true;
    // ロケットを返したイカ
    const turner = this.pointer.squids[0] || { x: 0, y: 0 };
    // イカからロケットへのベクトル
    const vectorToRocket = utilities.getRelativeVector(turner, this);
    // そのベクトルの角度（水平右向きが0、反時計回りが+、単位は°）
    const vectorToRocketDegree = utilities.getVectorAngle(vectorToRocket);
    // ロケットの射程
    const rocketRange = constants.ROCKET_TURN_SPEED * this.pointer.currentCourse.scale;
    // ロケットベクトルを作成、とりあえず水平右向き
    const rocketVector = { x: rocketRange, y: 0 };
    // 回転させたロケットベクトル
    const rotatedRocketVector = utilities.getRotatedVector(rocketVector, vectorToRocketDegree);
    this.$$rocketContainer.rotation = vectorToRocketDegree;
    // 速度を与える
    this.vx = rotatedRocketVector.x / constants.ROCKET_TURN_FRAME;
    this.vy = rotatedRocketVector.y / constants.ROCKET_TURN_FRAME;
    this.setNext(constants.ROCKET_TURN_FRAME, () => {
      if (this.isAlive) {
        this.die();
      }
    });
  }

  /** .generateRain()
   */
  generateRain() {
    this.hasArmor = true;
    this.vscale = 0.02;
    this.valpha = -0.05;
    this.setNext(20, () => {
      this.die();
    });
  }

  /** .setNext(frame, func)
   */
  setNext(frame, func) {
    this.next.frame = this.frame + frame;
    this.next.func = func;
  }

  /** .die()
   */
  die() {
    this.isAlive = false;
    this.remove();
  }

  /** .remove()
   */
  remove() {
    this.removeGraphics();
    this.removeMeFromBrothers();
  }

  /** .removeMeFromBrothers()
   */
  removeMeFromBrothers() {
    const thisIndex = this.brothers.indexOf(this);
    if (thisIndex > -1) {
      this.brothers.splice(thisIndex, 1);
    }
  }

  /** .removeGraphics()
   */
  removeGraphics() {
    this.$$parentLayer.removeChild(this.$$container);
  }
}
