import * as constants from './constant.js?Ver.0.1.2';
import * as utilities from './function.js?Ver.0.1.2';
import Rocket from './Rocket.js?Ver.0.1.2';
import Animater from './Animater.js?Ver.0.1.2';

/** Drizzler
 */
export default class Drizzler {
  /** .constructor(pos, pointer)
   * リアルタイムモード時にはposをスポーン座標と解釈してそこからコウモリを出現させます。
   * 非リアルタイムモード時にはposを駐車場と解釈してそこに直接コウモリを置きます。
   */
  constructor(pos, pointer) {
    // プロパティ1
    this.pointer = pointer;
    this.brothers = pointer.drizzlers;
    this.$$parentLayer = pointer.$$parentLayer;
    this.$$lowerLayer = pointer.$$lowerLayer;
    // プロパティ2
    this.frame = 0;
    this.isAlive = true;
    this.next = { frame: -1, func: null };
    this.maxLife = constants.DRIZZLER_HP;
    this.currentLife = constants.DRIZZLER_HP;
    // プロパティ3
    this.arrowExists = false;
    this.currentPark = null;
    this.oldTargetPark = null;
    this.targetPark = null;
    this.isSearching = true;
    this.isHeadstand = false;
    this.attackCount = 0;
    this.targetSquid = null;
    this.animaters = [];
    this.isEnabledVoronoi = false;
    // 描画
    this.draw(pos);
    // アニメーターの作成
    this.animaters.push(new Animater(this.$$drizzler));
    this.animaters.push(new Animater(this.$$container));
    // イベントハンドラの登録
    this.setEvent();
    // リアルタイムモードかどうか
    if (this.pointer.isRTMode) {
      // そうならスポーンする
      this.spawn(pos);
    } else {
      // そうでないなら現在の駐車場を設定する
      this.currentPark = pos;
    }
  }

  /** .draw
   * 描画します。
   */
  draw(pos) {
    /** - グラフィック:コンテナ -
     */
    this.$$container = new createjs.Container();
    this.$$container.x = pos.x;
    this.$$container.y = pos.y;
    this.$$lifeBarContainer = new createjs.Container();
    this.$$lifeBarContainer.alpha = 0;
    this.$$lifeBarContainer.originAlpha = 0;
    this.$$container.addChild(this.$$lifeBarContainer);
    this.$$parentLayer.addChild(this.$$container);

    /** - グラフィック:索敵円 -
     */
    this.$$circle = utilities.create$$gradCircle({
      x: pos.x,
      y: pos.y,
      radius: constants.DRIZZLER_CIRCLE_RADIUS * this.pointer.currentCourse.scale,
      colors: ['#fff', constants.DRIZZLER_CIRCLE_COLOR],
      colorRates: [0.7, 1],
      strokeWidth: constants.DRIZZLER_CIRCLE_STROKE_WIDTH,
      strokeColor: constants.DRIZZLER_CIRCLE_STROKE_COLOR,
    });
    this.$$lowerLayer.addChild(this.$$circle);

    /** - グラフィック:矢印 -
     */
    this.$$arrow = utilities.create$$arrow();
    this.$$container.addChild(this.$$arrow);

    /** - グラフィック:コウモリ画像 -
     */
    this.$$drizzler = utilities.create$$bitmap({
      src: `${this.pointer.assetsPath}/${constants.DRIZZLER_IMAGE}`,
      regX: constants.DRIZZLER_REG_X,
      regY: constants.DRIZZLER_REG_Y,
      scale: constants.DRIZZLER_SCALE,
    });
    this.$$container.addChild(this.$$drizzler);

    /** - グラフィック:三角形 -
     */
    this.$$drizzlerTriangle = utilities.create$$bitmap({
      src: `${this.pointer.assetsPath}/${constants.DRIZZLER_TRIANGLE_IMAGE}`,
      y: - constants.DRIZZLER_WIDTH,
      regX: constants.DRIZZLER_REG_X,
      regY: constants.DRIZZLER_REG_Y,
      scale: constants.DRIZZLER_SCALE,
      alpha: 0,
    });
    this.$$container.addChild(this.$$drizzlerTriangle);

    /** - グラフィック:駐車場ラベル背景 -
     */
    const labelAlpha = (this.pointer.isRTMode) ? 0 : 1;
    this.$$drizzlerPosBg = utilities.create$$circle({
      radius: constants.PARK_RADIUS,
      color: constants.DRIZZLER_POS_BG_COLOR,
      alpha: labelAlpha,
    });
    this.$$container.addChild(this.$$drizzlerPosBg);

    /** - グラフィック:駐車場ラベルテキスト -
     */
    this.$$drizzlerPosText = utilities.create$$centeringText({
      text: (pos.alphabet !== undefined) ? pos.alphabet : '',
      style: constants.PARK_FONT_STYLE,
      color: constants.DRIZZLER_POS_TEXT_COLOR,
      alpha: labelAlpha,
      cacheRadius: Math.ceil(constants.PARK_FONT_SIZE / 2),
    });
    this.$$container.addChild(this.$$drizzlerPosText);

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
   * イベントハンドラを登録します。
   */
  setEvent() {
    // リアルタイムモードかどうか
    if (this.pointer.isRTMode) {
      // リアルタイムモードなら
      this.$$drizzler.cursor = 'pointer';
      // マウスダウン時
      this.$$drizzler.on('mousedown', () => {
        // 生きているなら
        if (this.isAlive) {
          // 逆立ち状態ならば
          if (this.isHeadstand) {
            // ダメージを与える
            this.receiveDamage(constants.DRIZZLER_DEFAULT_DAMAGE);
          }
        }
      });
    } else {
      // 非リアルタイムモードなら
      // ドラッガブルにする
      utilities.draggable$$object(
        this.pointer.stage,
        this.$$drizzler,
        [this.$$container, this.$$circle],
        {
          // 粘着質
          isSticky: true,
          // マウスムーブ開始時
          onMouseMoveStart: () => {
            // 矢印を隠す
            this.hideArrow();
          },
          // クイックマウスアップ時
          onMouseUpQuick: () => {
            if (this.pointer.currentCourse.isSelectingVoronoi) {
              this.enableVoronoi();
            } else {
              // 索敵円表示をトグルする
              this.toggleSearching();
            }
          },
          // マウスアップ時
          onMouseUp: (p) => {
            // コウモリを動かす！
            // 現在コウモリが停まっていないすべての駐車場のうち自分に最も近い駐車場を取得
            const candidates = utilities.excludeParkDrizzlerExists(
              this.pointer.currentCourse.parks, this.pointer.drizzlers,
            );
            candidates.push(this.currentPark);
            const minDistancePark = utilities.getMinDistancePark(p, candidates)[0];
            // そこに飛ばす
            this.move(minDistancePark);
            // コウモリの矢印をアップデート
            this.pointer.currentCourse.updateDrizzlerArrows(true);
          },
          throwTarget: this,
          currentCourse: this.pointer.currentCourse,
        },
      );
    }
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

  /** .spawn()
   * 湧きの処理を行います。コンストラクタのなかで呼ばれます。
   */
  spawn(spawnPosition) {
    // いったん自身を透明にする
    this.$$container.children.forEach(($$object) => {
      // originAlphaに0が設定されているものはそのままにしておく
      if ($$object.originAlpha !== 0) {
        $$object.set({ alpha: constants.DRIZZLER_ALPHA_WHEN_SPAWN });
      }
    });
    // 索敵サークルをしまう
    if (!this.pointer.currentCourse.isVisibleDrizzlerCircle) {
      this.isSearching = false;
      this.$$circle.alpha = 0;
    }
    // 「現在コウモリが停まっていないすべての駐車場」を取得する。接続関係は考慮しなくていい
    const freeParks = utilities.excludeParkDrizzlerExists(
      this.pointer.currentCourse.parks, this.pointer.drizzlers,
    );
    // そのうち最も自分に近い駐車場を取得する
    const minDistanceFreePark = utilities.getMinDistancePark(spawnPosition, freeParks)[0];
    // そこに飛ぶ
    this.fly(minDistanceFreePark);
    // 内部的にはもうここにいることにする
    this.currentPark = minDistanceFreePark;
  }

  /** .tick()
   */
  tick() {
    this.frame += 1;
    this.animaters.forEach((animater) => animater.tick());
    if (this.next.frame > -1 && this.frame >= this.next.frame) {
      this.next.frame = -1;
      this.next.func();
    }
  }

  /** .tryFlying()
   * 飛ぼうとしてみます。（飛び先を探すところから）
   * 飛び先があるなら、一定時間後にfly()を呼びます。
   * 飛び先がないなら、一定時間後に再帰します。
   */
  tryFlying() {
    // いま自分が停まっている駐車場に接続されている(A)駐車場群を取得
    const { connectParks } = this.currentPark;
    // そのうち他のコウモリが停まっている(B)駐車場を除外する
    const freeConnectParks = utilities.excludeParkDrizzlerExists(
      connectParks, this.pointer.drizzlers,
    );
    // 目的地になれる駐車場の数で場合分け
    if (freeConnectParks.length > 0) {
      // 目的地になれる駐車場がひとつ以上ある場合は動くことが可能だ！その場所を決定しよう
      if (freeConnectParks.length === 1) {
        // 目的地になれる駐車場がひとつだけの場合
        // 迷うことはない、そこを目的地にする
        [this.targetPark] = freeConnectParks;
      } else if (this.pointer.squids.length > 0) {
        // 目的地になれる駐車場がふたつ以上あってイカが存在する場合
        // 「自身に最も近いイカ」を取得
        const [minDistanceSquid] = utilities.getMinDistancePark(
          this, this.pointer.squids,
        );
        // 「「自身に最も近いイカ」に最も近い駐車場」を次の目的地にする
        [this.targetPark] = utilities.getMinDistancePark(
          minDistanceSquid, freeConnectParks,
        );
      } else {
        // 目的地になれる駐車場がふたつ以上あってイカが存在しない場合
        // 自分に一番近い駐車場を目的地にする
        [this.targetPark] = utilities.getMinDistancePark(
          this, freeConnectParks,
        );
      }
      // 一定時間後に動く
      this.setNext(constants.DRIZZLER_FLY_PREPARATION_FRAME, () => {
        this.fly(this.targetPark);
      });
      // 内部的にはすでにその駐車場にいることにする
      this.currentPark = this.targetPark;
    } else {
      // 目的地になれる条件を満たしている駐車場がひとつもない場合飛ぶことができない！
      // 一定時間後にもう一度この関数を呼んでみよう
      this.setNext(constants.DRIZZLER_FLY_PREPARATION_FRAME, () => {
        this.tryFlying();
      });
    }
  }

  /** .fly(targetPark)
   * 特定の駐車場に飛びます。
   */
  fly(targetPark) {
    // 駐車場のテキストを更新
    this.$$drizzlerPosText.text = targetPark.alphabet;
    // 索敵円の位置を更新
    this.$$circle.x = targetPark.x;
    this.$$circle.y = targetPark.y;
    // 目的地を消去する
    this.targetPark = null;
    // ターゲットイカを消去する
    this.targetSquid = null;
    // 逆立ち(攻撃受付)状態にする
    this.isHeadstand = true;
    // フライアニメーションをセットする
    this.setFlyAnimation(targetPark.x, targetPark.y, () => {
      // 生きていたら
      if (this.isAlive) {
        // 攻撃回数をゼロにする
        this.attackCount = 0;
        // 逆立ち状態ではなくする
        this.isHeadstand = false;
        // 自分に最も最も近いイカおよびそのイカへの距離を取得
        const [squid, , distance] = utilities.getMinDistancePark(this, this.pointer.squids);
        // 自分に最も近いイカは後々攻撃する時に使うデータなので保存しておく
        this.targetSquid = squid;
        // この次に取る行動を「最も近いイカへの距離」によって場合分け
        if (distance <= constants.DRIZZLER_CIRCLE_RADIUS * this.pointer.currentCourse.scale) {
          // 索敵半径以下の近い場合
          // 一定時間後に攻撃行動を取る
          this.setNext(constants.DRIZZLER_ATTACK_PREPARATION_FRAME, () => {
            this.attack();
          });
        } else {
          // 索敵半径超過の場合
          // もう一度飛ぼうとする
          this.tryFlying();
        }
      }
    });
  }

  /** .attack()
   * 攻撃(ロケットの射出)を行います。
   * 所定回数攻撃するまでは、一定時間後に再帰します。
   * 所定回数攻撃したらtryFlying()に以降します。
   */
  attack() {
    // 逆立ち状態にする
    this.isHeadstand = true;
    // 画像を180°回転させる
    this.$$drizzler.rotation = 180;
    // 攻撃回数を1増加させる
    this.attackCount += 1;
    // ロケットの発射ベクトルを計算する
    // 自分→ターゲットイカの相対ベクトルを取得
    const vectorToSquid = utilities.getRelativeVector(
      this.currentPark,
      this.targetSquid || { x: 0, y: 0 },
    );
    // そのベクトルの角度を取得（単位は°/水平右向きが0°/反時計回りが＋）
    const vectorToSquidDegree = utilities.getVectorAngle(vectorToSquid);
    // ロケットの射程を取得
    const rocketRange = constants.ROCKET_RANGE * this.pointer.currentCourse.scale;
    // ロケットベクトルを作成する とりあえず水平右向き
    const rocketVector = { x: rocketRange, y: 0 };
    // 乱数で弾ブレを発生させる
    const shakeDegree = this.pointer.xors.getRandom(constants.ROCKET_SHAKE_DEGREE)
      - constants.ROCKET_SHAKE_DEGREE / 2;
    // イカちゃんへの角度＋乱数
    const rocketVectorDegree = vectorToSquidDegree + shakeDegree;
    // イカちゃんへの角度＋乱数 の分だけロケットベクトルを回転させる
    const rotatedRocketVector = utilities.getRotatedVector(
      rocketVector, rocketVectorDegree,
    );
    // ロケットインスタンスを作ってpushする
    const rocket = new Rocket(
      this.currentPark,
      rotatedRocketVector,
      rocketVectorDegree,
      this.pointer,
    );
    this.pointer.rockets.push(rocket);
    // 一定時間後に
    this.setNext(constants.DRIZZLER_HEADSTAND_FRAME, () => {
      // 生きていたら
      if (this.isAlive) {
        // 逆立ち状態を解除
        this.isHeadstand = false;
        // 画像の回転も元に戻す
        this.$$drizzler.rotation = 0;
        // 攻撃した回数で場合分け
        if (this.attackCount < constants.DRIZZLER_ATTACK_NUM) {
          // 所定回数に満たない場合
          // 一定時間後にもう一度この関数を呼ぶ
          this.setNext(constants.DRIZZLER_ATTACK_PREPARATION_FRAME, () => {
            this.attack();
          });
        } else {
          // 所定回数攻撃した場合
          // 飛ぼうとする
          this.tryFlying();
        }
      }
    });
  }

  /** .receiveDamage(dmg)
   * ダメージを受けます。
   */
  receiveDamage(dmg) {
    // 現在のライフを減らす(0未満になることはない)
    this.currentLife = Math.max(0, this.currentLife - dmg);
    // 最大ライフに対する割合を計算
    const lifeRate = this.currentLife / this.maxLife;
    // 最大ライフに対する割合が0から1の間ならば
    if (lifeRate > 0 && lifeRate < 1) {
      // ライフバーグラフィックのアルファを1にする
      this.$$lifeBarContainer.alpha = 1;
    }
    // ライフバーグラフィックのゲージを縮める
    const g = this.$$lifeBar.graphics;
    g.clear();
    g.beginFill(constants.HP_BAR_COLOR);
    g.drawRect(0, 0, constants.HP_BAR_WIDTH * lifeRate, constants.HP_BAR_HEIGHT);
    // 現在のライフが0ならば
    if (this.currentLife === 0) {
      // ライフバーグラフィックのアルファを0にする
      this.$$lifeBarContainer.alpha = 0;
      // die() を呼ぶ
      this.die();
    }
  }

  /** .setNext(frame, func)
   * 一定時間後にfunc()を呼び出します。
   */
  setNext(frame, func) {
    // nextプロパティの値を更新
    this.next.frame = this.frame + frame;
    this.next.func = func;
  }

  /** .toggleSearching()
   * 索敵サークルのグラフィックの表示･非表示を切り替えます。
   */
  toggleSearching() {
    this.isSearching = !this.isSearching;
    const alpha = (this.isSearching) ? 1 : 0;
    // 不透明度をアニメーションさせる
    utilities.instantTween(
      this.$$circle,
      { alpha },
      constants.DRIZZLER_TWEEN_TIME,
      constants.DRIZZLER_TWEEN_EASE,
    );
  }

  /** .setFlyAnimation(x, y, callback)
   * 飛び立つアニメーションをセットします。
   */
  setFlyAnimation(x, y, callback) {
    // コウモリ本体のグラフィックとそれ以外のグラフィックでアニメーションを分ける
    // コウモリ本体についてはアニメーションの時間を半分に分けて「前半は拡大」「後半は縮小」する
    // 最終的な目標となるプロパティを作成
    const scale = this.$$drizzler.originScale;
    const alpha = this.$$drizzler.originAlpha;
    const target = { alpha, scale };
    // 半分時点での目標となるプロパティを作成
    const harfTarget = {
      alpha: (alpha + this.$$drizzler.alpha) / 2,
      scale: scale * 1.5,
    };
    // 前半のイージング
    const types1 = {
      alpha: 'easeInCubic',
      scale: 'easeOutCubic',
    };
    // 後半のイージング
    const types2 = {
      alpha: 'easeOutCubic',
      scale: 'easeInCubic',
    };
    // 前半後半のアニメーションを登録
    this.animaters[0].addAnim(
      harfTarget, constants.DRIZZLER_FLY_FRAME / 2, { types: types1 },
    );
    this.animaters[0].addAnim(
      target, constants.DRIZZLER_FLY_FRAME / 2, { types: types2 },
    );
    // コウモリ本体以外のグラフィックについてはふつうにx, yだけ動かしてやればいい
    this.animaters[1].addAnim(
      { x, y }, constants.DRIZZLER_FLY_FRAME, 'easeInOutCubic',
    );
    // callbackを登録
    if (callback) {
      this.animaters[1].onComplete = callback;
    }
  }

  /** .updateArrow()
   * (非リアルタイムモード時)どこに飛ぶかを示す矢印をアップデートします。
   */
  updateArrow(isAnimation) {
    // 現在の目的地がないなら何もしない
    if (this.currentPark === null) {
      return;
    }
    // 現在の目的地を古い目的値に格納する
    this.oldTargetPark = this.targetPark;
    // 「自身に最も近いイカ」を取得
    const squid = utilities.getMinDistancePark(this, this.pointer.squids)[0];
    // 「自身がいる駐車場に接続された駐車場群」を取得
    const connectParks = utilities.excludeParkDrizzlerExists(
      this.currentPark.connectParks, this.pointer.drizzlers,
    );
    // 「自身がいる駐車場に接続された駐車場群」のうち「自身に最も近いイカ」最も近い駐車場を取得
    const targetPark = utilities.getMinDistancePark(squid, connectParks)[0];
    // 目的地が決定できたかどうか
    if (targetPark) {
      // 目的地が決定できたなら
      // targetParkを更新
      this.targetPark = targetPark;
      // 前回この関数が呼ばれたときからtargetParkが変わっており矢印がまだ描かれていないならば
      if (this.targetPark !== this.oldTargetPark || !this.arrowExists) {
        // 矢印を描いてフラグを立てる
        utilities.set$$arrow(
          this.$$arrow,
          this.currentPark,
          targetPark,
          constants.PARK_RADIUS + constants.ARROW_STROKE_WIDTH,
          isAnimation && this.pointer.currentCourse.isVisibleArrow,
          false,
        );
        if (!this.pointer.currentCourse.isVisibleArrow) {
          this.hideArrow();
        }
        this.arrowExists = true;
      }
    } else if (this.arrowExists) {
      // 目的地が決定できなかったなら
      // targetParkを更新
      this.targetPark = targetPark;
      // 矢印を隠す
      this.hideArrow();
    }
  }

  /** .hideArrow()
   * (非リアルタイムモード時)どこに飛ぶかを示す矢印を隠します。
   */
  hideArrow() {
    this.$$arrow.scaleX = 0;
    this.arrowExists = false;
  }

  /** .showArrow()
   */
  showArrow() {
    this.$$arrow.scaleX = 1;
    this.arrowExists = true;
  }

  /** .enableVoronoi()
   */
  enableVoronoi() {
    this.pointer.currentCourse.shouldUpdateVoronoi = true;
    this.pointer.currentCourse.isSelectingVoronoi = false;
    this.pointer.drizzlers.forEach((drizzler) => {
      drizzler.disableVoronoi();
    });
    this.isEnabledVoronoi = true;
    this.$$drizzlerTriangle.set({ alpha: 1 });
    window.drizzlerjs.toggleVoronoi(true);
    document.getElementById('drizzlerjs-voronoi-desc').style.setProperty('display', 'none');
  }

  /** .disableVoronoi()
   */
  disableVoronoi() {
    this.isEnabledVoronoi = false;
    this.$$drizzlerTriangle.set({ alpha: 0 });
  }

  /** .move(targetPark)
   * (非リアルタイムモード時)コウモリを特定の駐車場に移動させます。
   */
  move(targetPark) {
    this.currentPark = targetPark;
    this.$$drizzlerPosText.text = targetPark.alphabet;
    this.targetPark = null;
    this.hideArrow();
    this.setMoveAnimation(targetPark.x, targetPark.y, () => {
      if (this.$$arrow) {
        this.$$arrow.alpha = 1;
      }
      if (this.pointer.currentCourse.isVisibleVoronoi) {
        this.pointer.currentCourse.paintVoronoi();
      } else {
        this.pointer.currentCourse.isPaintedVoronoi = false;
      }
    });
    utilities.cache$$object(
      this.$$drizzlerPosText,
      Math.ceil(constants.PARK_FONT_SIZE / 2),
    );
  }

  /** .setMoveAnimation(x, y, callback)
   * (非リアルタイムモード時)コウモリを特定のx, yに移動させるアニメーションをセットします。
   */
  setMoveAnimation(x, y, callback) {
    // 移動距離を取得
    const d = utilities.getDistance({
      x: this.$$drizzler.x,
      y: this.$$drizzler.y,
    }, { x, y });
    // 距離によってアニメーション時間を調整しようとしている
    let time = constants.DRIZZLER_TWEEN_TIME;
    time *= Math.min(1, (d / constants.DRIZZLER_TWEEN_BASE_D));
    time = Math.max(constants.DRIZZLER_TWEEN_TIME_MIN, Math.floor(time));
    // 本体と索敵円にそれぞれアニメーションをセット
    utilities.instantTween(
      [this.$$container, this.$$circle],
      { x, y },
      time,
      constants.DRIZZLER_TWEEN_EASE,
      callback,
    );
  }

  /** .die()
   * 自身を死なせる関数です。
   * 攻撃を受けてライフが0になった場合か、ロケットに衝突された場合に呼ばれます。
   */
  die() {
    this.isAlive = false;
    this.remove();
  }

  /** .remove()
   * 自身を抹消します。
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
