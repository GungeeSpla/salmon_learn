import * as constants from './constant.js?Ver.0.0.0';

/** easing
 * 参考: http://gizma.com/easing/
 */
const easing = {
  cubicIn(t, b, c, d) {
    t /= d;
    return c * t * t * t + b;
  },
  cubicOut(t, b, c, d) {
    t /= d;
    t -= 1;
    return c * (t * t * t + 1) + b;
  },
  cubicInOut(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  },
};

/** instantAnim(obj, param, time, easing)
 */
export function instantTween(objcetsArg, params, duration, easingType, callback) {
  let timer = null;
  let currentFrame = 0;
  const objects = Array.isArray(objcetsArg) ? objcetsArg : [objcetsArg];
  const paramKeys = Object.keys(params);
  const startValues = {};
  const changeInValues = {};
  const timeStep = 1000 / 60;
  const totalFrame = Math.floor(duration / timeStep);
  paramKeys.forEach((key) => {
    startValues[key] = objects[0][key];
    changeInValues[key] = params[key] - objects[0][key];
  });
  const tick = () => {
    currentFrame += 1;
    if (currentFrame < totalFrame) {
      timer = setTimeout(tick, timeStep);
    } else {
      if (callback) {
        callback();
      }
      clearTimeout(timer);
      return;
    }
    const currentParams = {};
    paramKeys.forEach((key) => {
      if (currentFrame < totalFrame) {
        const currentValue = easing[easingType](
          currentFrame,
          startValues[key],
          changeInValues[key],
          totalFrame,
        );
        currentParams[key] = currentValue;
      } else {
        currentParams[key] = params[key];
      }
    });
    objects.forEach((obj) => {
      obj.set(currentParams);
    });
  };
  tick();
}

/** isTrashPosition(x, y)
 */
export function isTrashPosition(x, y) {
  return x > constants.TRASH_LEFT
    && x < constants.TRASH_LEFT + constants.TRASH_WIDTH
    && y > constants.TRASH_TOP
    && y < constants.TRASH_TOP + constants.TRASH_HEIGHT;
}

/** create$canvas(width, height)
 * <cavnas>要素を作ります。
 */
export function create$canvas(width, height) {
  const $canvas = document.createElement('canvas');
  $canvas.setAttribute('width', width);
  $canvas.setAttribute('height', height);
  return $canvas;
}

/** create$$arrow()
 * 矢印用のShapeオブジェクトを作ります。
 * graphicsにmoveToLineToメソッドを持たせています。
 */
export function create$$arrow() {
  const $$arrow = new createjs.Shape();
  $$arrow.graphics.moveToLineTo = (x1, y1, x2, y2) => {
    $$arrow.graphics
      .moveTo(x1, y1)
      .lineTo(x1 + x2, y1 + y2);
    return $$arrow.graphics;
  };
  return $$arrow;
}

/** set$$arrow($$arrow, vtx1, vtx2, isAnimation, isTwoWay)
 * 矢印用のオブジェクト$$arrowに、vtx1からvtx2へ向かう矢印を描画します。
 * isAnimation=trueでアニメーションします。
 * isTwoWay=trueで両方向に矢が向きます。
 */
export function set$$arrow($$arrow, vtx1, vtx2, margin, isAnimation, isTwoWay) {
  // vtx1からvtx2へ向かう矢印ベクトル
  const vec = getRelativeVector(vtx1, vtx2);
  // 矢印ベクトルの長さ
  const vecLen = Math.sqrt(vec.x ** 2 + vec.y ** 2);
  // 矢印ベクトルの長さから駐車場の半径などを引く
  const arrowLen = vecLen - (margin * 2);
  // 矢印ベクトルの角度
  const sin = vec.y / vecLen;
  const asin = Math.asin(sin) * (180 / Math.PI);
  // 矢を水平右向きに描画するときの先端の高さ
  const headHeight = 10;
  // 矢を水平右向きに描画するときの先端の横幅
  const headWidth = 30;
  // 引くべき線
  const lines = [
    [margin, 0, arrowLen, 0],
    [margin + arrowLen, 0, -headWidth, headHeight],
    [margin + arrowLen, 0, -headWidth, -headHeight],
  ];
  // 逆向きにも矢を描く場合
  if (isTwoWay) {
    lines.push([margin, 0, headWidth, headHeight]);
    lines.push([margin, 0, headWidth, -headHeight]);
  }
  // ボーダー
  $$arrow.graphics
    .clear()
    .setStrokeStyle(constants.ARROW_STROKE_WIDTH, constants.STROKE_LINECAP)
    .beginStroke(constants.ARROW_STROKE_COLOR);
  lines.forEach((line) => {
    $$arrow.graphics.moveToLineTo(...line);
  });
  // 主線
  $$arrow.graphics
    .endStroke()
    .setStrokeStyle(constants.ARROW_WIDTH, constants.STROKE_LINECAP)
    .beginStroke(constants.ARROW_COLOR);
  lines.forEach((line) => {
    $$arrow.graphics.moveToLineTo(...line);
  });
  $$arrow.graphics
    .endStroke();
  // キャッシュを取る
  const m = 30;
  $$arrow.cache(-m, -headHeight - m, arrowLen + (m * 2), (m + headHeight) * 2);
  // 回転量のセット
  $$arrow.set({ rotation: (vec.x > 0) ? asin : 180 - asin });
  // アニメーションするならば
  if (isAnimation) {
    // scakeXを0→1にアニメーションさせる
    $$arrow.set({ scaleX: 0 });
    instantTween(
      $$arrow,
      { scaleX: 1 },
      constants.DRIZZLER_TWEEN_TIME,
      constants.DRIZZLER_TWEEN_EASE,
    );
  }
}

/** draggable$$object($$object, $$objects, options)
 * $$objectにマウスイベントを設定してドラッグで動かせるようにします。
 * 配列$$objectsに含まれるすべてのオブジェクトの座標をマウス座標と同期させます。
 * onMouseDown - マウスダウン時に実行
 * onMouseMoveStart - マウスムーブ開始時に実行
 * onMouseMove - マウスムーブのたびに実行
 * onMouseUpQuick - すばやくマウスアップしたときに実行(onMouseUpが一緒に実行されることはない)
 * onMouseUp - マウスアップしたときに実行(onMouseUpQuickが一緒に実行されることはない)
 * onThrow - ゴミ箱に捨てたときに実行
 * throwTarget - ゴミ箱に捨てるターゲット
 */
export function draggable$$object(stage, $$object, $$objects, options) {
  let now;
  let isMove = false;
  let isCatch = false;
  let marginX = 0;
  let marginY = 0;
  let startX = 0;
  let startY = 0;
  $$object.set({ cursor: 'pointer' });
  /** - mousedown -
   */
  $$object.on('mousedown', () => {
    if (!options.isDraggable || options.isDraggable()) {
      // いま掴んでいるか
      isCatch = true;
      // 動かしているか
      isMove = false;
      // マウスダウンした時間
      now = getTime();
      // マウスダウンした瞬間の座標
      startX = stage.mouseX;
      startY = stage.mouseY;
      // そこからオブジェクトの座標を引く
      marginX = stage.mouseX - $$objects[0].x;
      marginY = stage.mouseY - $$objects[0].y;
      // onMouseDownオプションがあれば実行する
      if (options.onMouseDown) {
        options.onMouseDown();
      }
    }
  });
  /** - pressmove -
   */
  $$object.on('pressmove', () => {
    // 掴んでいないならば何もしない
    if (!isCatch) {
      return;
    }
    // 粘着質オプションかどうか？
    // 粘着質オプションがついている場合は
    // マウスを一定ピクセル以上動かして初めて「動かした」と認識される
    if (options.isSticky) {
      // 粘着質オプションがついている場合
      // 動かした量を先ず計算する
      const move = Math.abs(stage.mouseX - startX) + Math.abs(stage.mouseY - startY);
      // moveが10を超えたならば動いている！
      if (!isMove && move > 10) {
        isMove = true;
        marginX = stage.mouseX - $$objects[0].x;
        marginY = stage.mouseY - $$objects[0].y;
        // onMouseMoveStartオプションがあれば実行する
        if (options.onMouseMoveStart) {
          options.onMouseMoveStart();
        }
      }
      // 動いているならば
      if (isMove) {
        // 座標の同期をとる
        let x = stage.mouseX - marginX;
        let y = stage.mouseY - marginY;
        x = Math.max(0, Math.min(constants.CANVAS_WIDTH, x));
        y = Math.max(0, Math.min(constants.CANVAS_HEIGHT, y));
        $$objects.forEach(($$obj) => {
          $$obj.set({ x, y });
        });
        // ゴミ箱のぱかぱか切り替え
        if (options.throwTarget && options.currentCourse.isTrashEnabled) {
          if (isTrashPosition(stage.mouseX, stage.mouseY)) {
            options.currentCourse.$$trashClose.set({ alpha: 0 });
            options.currentCourse.$$trashOpen.set({ alpha: 1 });
          } else {
            options.currentCourse.$$trashClose.set({ alpha: 1 });
            options.currentCourse.$$trashOpen.set({ alpha: 0 });
          }
        }
        // onMouseMoveオプションがあれば実行する
        if (options.onMouseMove) {
          options.onMouseMove();
        }
      }
    } else {
      if (!isMove) {
        isMove = true;
        // onMouseMoveStartオプションがあれば実行する
        if (options.onMouseMoveStart) {
          options.onMouseMoveStart();
        }
      }
      if (isMove) {
        // 座標の同期をとる
        let x = stage.mouseX - marginX;
        let y = stage.mouseY - marginY;
        x = Math.max(0, Math.min(constants.CANVAS_WIDTH, x));
        y = Math.max(0, Math.min(constants.CANVAS_HEIGHT, y));
        $$objects.forEach(($$obj) => {
          $$obj.set({ x, y });
        });
        // ゴミ箱のぱかぱか切り替え
        if (options.throwTarget && options.currentCourse.isTrashEnabled) {
          if (isTrashPosition(stage.mouseX, stage.mouseY)) {
            options.currentCourse.$$trashClose.set({ alpha: 0 });
            options.currentCourse.$$trashOpen.set({ alpha: 1 });
          } else {
            options.currentCourse.$$trashClose.set({ alpha: 1 });
            options.currentCourse.$$trashOpen.set({ alpha: 0 });
          }
        }
        // onMouseMoveオプションがあれば実行する
        if (options.onMouseMove) {
          options.onMouseMove();
        }
      }
    }
  });
  /** - pressup -
   */
  $$object.on('pressup', () => {
    // 掴んでいないなら何もしない
    if (!isCatch) {
      return;
    }
    isCatch = false;
    const p = { x: stage.mouseX, y: stage.mouseY };
    // 動かしておらず、すばやくマウスアップを行った場合で、
    if (!isMove && options.onMouseUpQuick && performance.now() - now < 200) {
      // onMouseUpQuickオプションがあれば実行する
      options.onMouseUpQuick();
    } else if (options.onMouseUp) {
      // そうではなくonMouseUpオプションがあれば実行する
      options.onMouseUp(p);
    }
    // ゴミ箱関連
    if (options.throwTarget && options.currentCourse.isTrashEnabled) {
      if (isTrashPosition(stage.mouseX, stage.mouseY)) {
        options.throwTarget.remove();
        options.currentCourse.$$trashClose.set({ alpha: 1 });
        options.currentCourse.$$trashOpen.set({ alpha: 0 });
      }
      if (options.onThrow) {
        options.onThrow();
      }
    }
  });
}

/** set$$properties($$object, options)
 * CreateJSのオブジェクトにプロパティを設定します。
 */
export function set$$properties($$object, options) {
  const mergedOptions = {
    x: 0,
    y: 0,
    regX: 0,
    regY: 0,
    rotation: 0,
    scale: 1,
    alpha: 1,
    compositeOperation: 'source-over',
    ...options,
  };
  mergedOptions.originScale = mergedOptions.scale;
  mergedOptions.originAlpha = mergedOptions.alpha;
  $$object.set(mergedOptions);
}

/** cache$$object($$object, harfWidth, harfHeightArg)
 * キャッシュを取ります。
 * キャッシュサイズは「基準点から左右にharfWidth、上下にharfHeightArg」です。
 * harfHeightArgが省略された場合、代わりにharfWidthが使われます。
 */
export function cache$$object($$object, harfWidth, harfHeightArg) {
  const harfHeight = (harfHeightArg) || harfWidth;
  $$object.cache(-harfWidth, -harfHeight, harfWidth * 2, harfHeight * 2);
}

/** create$$bitmap(options)
 * Bitmapオブジェクトを作ります。
 */
export function create$$bitmap(options) {
  const $$bitmap = new createjs.Bitmap(options.src);
  set$$properties($$bitmap, options);
  return $$bitmap;
}

/** create$$gradCircle(options)
 * 円形グラデーションで塗られたShapeオブジェクトを作ります。
 */
export function create$$gradCircle(options) {
  // オプションを作成
  const mergedOptions = {
    compositeOperation: 'multiply',
    strokeColor: options.colors[options.colors.length - 1],
    ...options,
  };
  // Shapeを作成
  const $$gardCircle = new createjs.Shape();
  $$gardCircle.graphics
    // ボーダーの幅
    .setStrokeStyle(mergedOptions.strokeWidth)
    // ボーダーの色
    .beginStroke(mergedOptions.strokeColor)
    // 円状グラデーション
    .beginRadialGradientFill(
      mergedOptions.colors,
      mergedOptions.colorRates,
      0, 0, 0,
      0, 0, mergedOptions.radius,
    )
    // 円を描画
    .drawCircle(0, 0, mergedOptions.radius);
  // プロパティを設定
  set$$properties($$gardCircle, mergedOptions);
  // キャッシュを取る
  cache$$object(
    $$gardCircle,
    mergedOptions.radius,
  );
  return $$gardCircle;
}

/** create$$circle(options)
 * 円形のShapeオブジェクトを返します。
 */
export function create$$circle(options) {
  // オプションを作成
  const mergedOptions = {
    color: '#000000',
    strokeWidth: 0,
    strokeColor: options.color,
    ...options,
  };
  // Shapeを作成
  const $$circle = new createjs.Shape();
  $$circle.graphics
    // ボーダーの幅
    .setStrokeStyle(mergedOptions.strokeWidth)
    // ボーダーの色
    .beginStroke(mergedOptions.strokeColor)
    // 塗りつぶしの色
    .beginFill(mergedOptions.color)
    // 円を描画
    .drawCircle(0, 0, mergedOptions.radius);
  // プロパティを設定
  set$$properties($$circle, mergedOptions);
  // キャッシュを取る
  cache$$object(
    $$circle,
    mergedOptions.radius,
  );
  return $$circle;
}

/** create$$centeringText(options)
 * センタリングされたTextを返します。
 */
export function create$$centeringText(options) {
  // オプションを作成
  const mergedOptions = {
    textAlign: 'center',
    textBaseline: 'middle',
    ...options,
  };
  // create$$text()にたらい流しする
  return create$$text(mergedOptions);
}

/** create$$text(options)
 * Textを返します。
 */
export function create$$text(options) {
  // オプションを作成
  const mergedOptions = {
    text: '',
    style: 'bold 20px sans-serif',
    color: '#000000',
    textAlign: 'left',
    textBaseline: 'top',
    ...options,
  };
  // Textを作成
  const $$text = new createjs.Text(
    mergedOptions.text,
    mergedOptions.style,
    mergedOptions.color,
  );
  // プロパティを設定
  set$$properties($$text, mergedOptions);
  // キャッシュを取る
  if (mergedOptions.cacheRadius !== undefined) {
    cache$$object($$text, mergedOptions.cacheRadius);
  }
  return $$text;
}

/** create$$lifeBars()
 * ライフバーとなるShapeオブジェクト(背景＋バー)を作ります。
 */
export function create$$lifeBars() {
  // ライフバー(背景)
  const $$lifeBarBg = new createjs.Shape();
  $$lifeBarBg.graphics
    .beginFill(constants.HP_BAR_BORDER_COLOR)
    .drawRect(
      0,
      0,
      constants.HP_BAR_WIDTH + constants.HP_BAR_BORDER_WIDTH * 2,
      constants.HP_BAR_HEIGHT + constants.HP_BAR_BORDER_WIDTH * 2,
    );
  set$$properties(
    $$lifeBarBg,
    {
      regX: Math.floor((constants.HP_BAR_WIDTH + constants.HP_BAR_BORDER_WIDTH * 2) / 2),
      regY: Math.floor(constants.HP_BAR_MARGIN
        + (constants.HP_BAR_HEIGHT + constants.HP_BAR_BORDER_WIDTH * 2) / 2),
    },
  );
  // ライフバー(ゲージ部分)
  const $$lifeBar = new createjs.Shape();
  $$lifeBar.graphics
    .beginFill(constants.HP_BAR_COLOR)
    .drawRect(0, 0, constants.HP_BAR_WIDTH, constants.HP_BAR_HEIGHT);
  set$$properties(
    $$lifeBar,
    {
      regX: Math.floor((constants.HP_BAR_WIDTH) / 2),
      regY: constants.HP_BAR_MARGIN + Math.floor((constants.HP_BAR_HEIGHT / 2)),
    },
  );
  return [$$lifeBarBg, $$lifeBar];
}

/** getRelativeVector(vertexA, vertexB)
 * vertexAからvertexBに向かう相対ベクトルを返します。
 */
export function getRelativeVector(vertexA, vertexB) {
  return {
    x: vertexB.x - vertexA.x,
    y: vertexB.y - vertexA.y,
  };
}

/** getAbsoluteVector(vectorA, vectorB)
 * vectorAにvectorBを足したベクトルを返します。
 */
export function getAbsoluteVector(vectorA, vectorB) {
  return {
    x: vectorB.x + vectorA.x,
    y: vectorB.y + vectorA.y,
  };
}

/** getRotatedVector(vector, degree)
 * ベクトルをdegree度だけ回転させたベクトルを返します。
 */
export function getRotatedVector(vector, degree) {
  const rad = degree * (Math.PI / 180);
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  return {
    x: -sin * vector.y + cos * vector.x,
    y: sin * vector.x + cos * vector.y,
  };
}

/** getVectorAngle(vector)
 * ベクトルの角度(0～360)を返します。
 * 水平右向きが0度、反時計回りがプラスです。
 */
export function getVectorAngle(vector) {
  // アークサイン（-180～180）を取得
  const asin = Math.asin(vector.y / Math.sqrt(vector.x ** 2 + vector.y ** 2)) * (180 / Math.PI);
  let deg;
  if (vector.y > 0) {
    if (vector.x > 0) {
      deg = asin;
    } else {
      deg = 180 - asin;
    }
  } else if (vector.x > 0) {
    deg = 360 - Math.abs(asin);
  } else {
    deg = 180 + Math.abs(asin);
  }
  return deg % 360;
}

/** createArray(length, initialValue)
 * 指定の長さと初期値の配列を作ります。
 */
export function createArray(length, initialValue) {
  const arr = [];
  for (let i = 0; i < length; i += 1) {
    arr[i] = initialValue;
  }
  return arr;
}

/** getTime()
 * 現在時刻を取得します。
 * performance.nowが使えるならそちらを、使えなければDateを使います。
 */
const canUsePerformance = (window.performance !== undefined);
export function getTime() {
  if (canUsePerformance) {
    return window.performance.now();
  }
  return new Date().getTime();
}

/** alphabet2number(str)
 * たとえば 'A', 'B', 'C', ... を 0, 1, 2, ... に変換します。
 */
export function alphabet2number(str) {
  return str.toUpperCase().charCodeAt() - constants.CHAR_CODE_OF_A;
}

/** number2alphabet(idx)
 * たとえば 0, 1, 2, ... を 'A', 'B', 'C', ... に変換します。
 */
export function number2alphabet(idx) {
  return String.fromCharCode(constants.CHAR_CODE_OF_A + idx);
}

/** getDistance(vertexA, vertexB)
 * 座標vertexAから座標vertexBまでの距離を返します。
 */
export function getDistance(vertexA, vertexB) {
  return Math.sqrt((vertexA.x - vertexB.x) ** 2 + (vertexA.y - vertexB.y) ** 2);
}


/** getMinDistancePark(potision, parks)
 * 駐車場群parksのうち、座標positionに最も近いものを調べます。
 */
export function getMinDistancePark(potision, parks) {
  // positionがfalse、あるいはparksが空ならnullを返す
  if (!potision || parks.length === 0) {
    return [null, null];
  }
  let minDistance = Infinity;
  let minDistanceIndex = 0;
  let minDistancePark = parks[0];
  parks.forEach((park, i) => {
    const distance = getDistance(potision, park);
    if (distance < minDistance) {
      minDistance = distance;
      minDistanceIndex = i;
      minDistancePark = park;
    }
  });
  // 最短park、parksにおける最短parkのインデックス、最短距離
  return [minDistancePark, minDistanceIndex, minDistance];
}

/** excludeParkDrizzlerExists(parks, drizzlers)
 * 駐車場群parksから、コウモリ群drizzlersが滞在しているものを除外した配列を作ります。
 */
export function excludeParkDrizzlerExists(parks, drizzlers) {
  const candidates = [];
  // parksを走査
  parks.forEach((park) => {
    // drizzlersを走査
    for (let i = 0; i < drizzlers.length; i += 1) {
      // コウモリがこのparkに滞在しているなら次のparkへ
      if (park === drizzlers[i].currentPark) {
        return;
      }
    }
    // ここにコウモリはいないようだ！
    candidates.push(park);
  });
  return candidates;
}

/** excludeParkDrizzlerExistsOld(parks, drizzlers)
 * むかし使っていた関数です。
 * currentParkではなくtargetParkを優先して照合するようにしていました。
 */
export function excludeParkDrizzlerExistsOld(parks, drizzlers) {
  const candidates = [];
  parks.forEach((park) => {
    for (let i = 0; i < drizzlers.length; i += 1) {
      const drizzler = drizzlers[i];
      if (drizzler.targetPark) {
        if (park === drizzler.targetPark) {
          return;
        }
      } else if (park === drizzler.currentPark) {
        return;
      }
    }
    candidates.push(park);
  });
  return candidates;
}

/** empty$element(id)
 * idから取得したDOM要素を空にします。（子要素の全削除）
 */
export function empty$element(arg) {
  const $origin = (typeof arg === 'string') ? document.getElementById(arg) : arg;
  const $clone = $origin.cloneNode(false);
  $origin.parentNode.replaceChild($clone, $origin);
}


/** logObjectCount($$container)
 * StageあるいはContainerが含むすべてのDisplayObjectの数を数えます。
 */
export function logObjectCount($$container, depth = 0) {
  let count = 0;
  $$container.children.forEach((child) => {
    if (child instanceof createjs.Container) {
      count += logObjectCount(child, depth + 1);
    } else {
      count += 1;
    }
  });
  if (depth === 0) {
    console.log(`${count} display obejcts exist.`);
  }
  return count;
}

/** updateChildIndexes()
 * むかし使っていた関数です。
 * Containerを使わずに自力でzIndexの調整を行っていました。
 */
export function updateChildIndexes() {
  const myChildIndexes = [];
  const myChllds = {};
  stage.children.forEach((child) => {
    const myIndex = child.myIndex || 0;
    if (myChildIndexes.indexOf(myIndex) < 0) {
      myChildIndexes.push(myIndex);
    }
    if (myChllds[myIndex] === undefined) {
      myChllds[myIndex] = [];
    }
    myChllds[myIndex].push(child);
  });
  myChildIndexes.sort((a, b) => ((a <= b) ? -1 : 1));
  let index = 0;
  myChildIndexes.forEach((myChildIndex) => {
    myChllds[myChildIndex].sort((a, b) => ((a.id > b.id) ? -1 : 1));
    myChllds[myChildIndex].forEach((child) => {
      stage.setChildIndex(child, index);
    });
    index += myChllds[myChildIndex].length;
  });
}
