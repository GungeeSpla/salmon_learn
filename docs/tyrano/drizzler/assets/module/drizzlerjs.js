import * as constants from './constant.js?Ver.0.1.1';
import * as utilities from './function.js?Ver.0.1.1';
import Course from './Course.js?Ver.0.1.1';
import Drizzler from './Drizzler.js?Ver.0.1.1';
import Xors from './Xors.js?Ver.0.1.1';
import Squid from './Squid.js?Ver.0.1.1';
import DraggableBitmap from './DraggableBitmap.js?Ver.0.1.1';
import ZMap from './ZMap.js?Ver.0.1.1';

/** drizzlerjs
 */
window.drizzlerjs = (() => {
  /** - instance -
   */

  // CreateJSのステージ
  let stage;
  // CreateJS用のキャンバス要素
  let $canvas;
  // 初期化時のオプション
  let initializationOptions;
  // 現在選択中のコース
  let currentCourse;
  // コウモリの格納配列
  let drizzlers;
  // イカの格納配列
  let squids;
  // イカの格納配列
  let rockets;
  // その他のビットマップの格納配列
  let bitmaps;
  // スポーンキュー
  let bossSpawningQueue;
  // 湧き方向の変化キュー
  let spnDirChangingQueue;
  // 現在のフレーム
  let frame;
  // 乱数生成器
  let xors;
  // CreateJSのコンテナ
  let $$layers;
  // drizzlerjsが稼働中かどうか
  let isPlaying;
  // 残り秒数
  let beforeLeftSeconds;
  // 現在のスポナー
  let currentSpnDir;
  // 乱数の種
  let randomSeed;
  // コースデータのキャッシュ
  const courseCaches = [];

  /** - functions -
   */

  /** spawnDrizzler(queueData)
   * リアルタイムモードにおいてコウモリを出現させます。
   */
  const spawnDrizzler = (queueData) => {
    // リアルタイムモードでなければ何もしない
    if (!initializationOptions.isRTMode) {
      return;
    }
    // コウモリの同時存在限界数を超えることはできない
    if (drizzlers.length >= constants.BOSS_ONE_KIND_MAX_NUM) {
      return;
    }
    // 湧き座標を決定
    const spnVtxIdx = queueData.randomScore % currentSpnDir.vertexes.length;
    // 湧き場所を決定
    const spawnPosition = {
      x: currentSpnDir.vertexes[spnVtxIdx][0],
      y: currentSpnDir.vertexes[spnVtxIdx][1],
    };
    // コウモリインスタンスを作成
    const drizzler = new Drizzler(
      spawnPosition,
      {
        xors,
        stage,
        squids,
        rockets,
        drizzlers,
        currentCourse,
        $$lowerLayer: $$layers.course,
        $$parentLayer: $$layers.drizzler,
        isRTMode: initializationOptions.isRTMode,
        assetsPath: initializationOptions.assetsPath,
      },
    );
    // push
    drizzlers.push(drizzler);
  };

  /** addDrizzler()
   * 非リアルタイムモードにおいてコウモリを追加します。
   */
  const addDrizzler = () => {
    // リアルタイムモードならspawnDrizzler()で代替する
    if (initializationOptions.isRTMode) {
      spawnDrizzler();
      return;
    }
    // コースの駐車場の数を超えることはできない
    if (drizzlers.length + 1 > currentCourse.parks.length) {
      return;
    }
    // コウモリを追加することができるようだ！
    // このコウモリの位置を決定する
    let alphabet = null;
    // 駐車場を走査する
    for (let i = currentCourse.parks.length - 1; i >= 0; i -= 1) {
      // とりあえずi番目の駐車場に停まってみる
      let isUniquePosition = true;
      alphabet = currentCourse.parks[i].alphabet;
      // すでにそこに停まっているコウモリがいたらフラグを折ってbreak
      for (let j = 0; j < drizzlers.length; j += 1) {
        if (alphabet === drizzlers[j].currentPark.alphabet) {
          isUniquePosition = false;
          break;
        }
      }
      // この時点でフラグがtrueかどうか
      if (isUniquePosition) {
        // trueならこの駐車場に停まることができる
        break;
      } else {
        // trueでないならこの駐車場に停まることはできないので次のalphabetへ
        alphabet = null;
      }
    }
    // この時点でalphabetがnullなら何もできない
    if (alphabet === null) {
      return;
    }
    // コウモリインスタンスを作成
    const drizzler = new Drizzler(
      currentCourse.getPark(alphabet),
      {
        xors,
        stage,
        squids,
        rockets,
        drizzlers,
        currentCourse,
        $$lowerLayer: $$layers.course,
        $$parentLayer: $$layers.drizzler,
        isRTMode: initializationOptions.isRTMode,
        assetsPath: initializationOptions.assetsPath,
      },
    );
    // push
    drizzlers.push(drizzler);
    // リアルタイムモードでなければ
    if (!initializationOptions.isRTMode) {
      // コウモリの矢印をアップデートする
      currentCourse.updateDrizzlerArrows(true);
      // 1匹目のコウモリならばボロノイ図を塗る
      // if (drizzlers.length === 1) {
        currentCourse.paintVoronoi();
      // }
    }
  };

  /** addSquid()
   * イカを追加します。
   */
  const addSquid = () => {
    // イカの同時存在限界数を超えることはできない
    if (squids.length >= constants.SQUID_MAX_NUM) {
      return;
    }
    // イカ番号およびそれに基づく出現位置を取得
    const index = squids.length;
    const home = currentCourse.homes[index];
    // イカインスタンスを作成
    const squid = new Squid(
      ...home,
      squids.length,
      {
        stage,
        squids,
        currentCourse,
        $$parentLayer: $$layers.drizzler,
        isRTMode: initializationOptions.isRTMode,
        assetsPath: initializationOptions.assetsPath,
      },
    );
    // push
    squids.push(squid);
    // リアルタイムモードでなければ矢印とボロノイ図を更新
    if (!initializationOptions.isRTMode) {
      currentCourse.updateDrizzlerArrows(true);
      currentCourse.paintVoronoi();
    }
  };

  /** addWeaponPiece(key)
   * ブキの駒をマップ上に置きます。
   */
  const addWeaponPiece = (key) => {
    // データを取得
    const data = constants.WEAPON_DATA[key];
    // ビットマップインスタンスを作成
    const bitmap = new DraggableBitmap(
      `${initializationOptions.weaponsPath}/weapons/${key}.png`,
      constants.CANVAS_CENTER_X,
      constants.CANVAS_CENTER_Y,
      constants.WEAPON_NATURAL_WIDTH / 2,
      constants.WEAPON_WIDTH / constants.WEAPON_NATURAL_WIDTH,
      (data.range || 0) * constants.WEAPON_CIRCLE_RATIO,
      (data.blast || 0) * constants.WEAPON_CIRCLE_RATIO,
      constants.WEAPON_CIRCLE_COLORS,
      {
        stage,
        bitmaps,
        currentCourse,
        $$lowerLayer: $$layers.course,
        $$parentLayer: $$layers.drizzler,
        isRTMode: initializationOptions.isRTMode,
        assetsPath: initializationOptions.assetsPath,
      },
    );
    // push
    bitmaps.push(bitmap);
  };

  /** removeAllPieces()
   * すべての駒を取り除きます。
   */
  const removeAllPieces = () => {
    // インスタンスを全部削除する
    [drizzlers, squids, rockets, bitmaps].forEach((arr) => {
      while (arr.length > 0) {
        arr[arr.length - 1].remove();
      }
    });
    // ボロノイ図を描き直す
    currentCourse.paintVoronoi();
  };

  /** addEnemyPiece(key)
   * 敵の駒をマップ上に置きます。
   */
  const addEnemyPiece = (key) => {
    // データを取得
    const data = constants.ENEMY_PIECE_DATA[key];
    // ビットマップインスタンスを作成
    const bitmap = new DraggableBitmap(
      `${initializationOptions.assetsPath}/assets/piece/${key}.png`,
      constants.CANVAS_CENTER_X,
      constants.CANVAS_CENTER_Y,
      constants.ENEMY_PIECE_NATURAL_WIDTH / 2,
      constants.ENEMY_PIECE_WIDTH / constants.ENEMY_PIECE_NATURAL_WIDTH,
      (data.range || 0),
      (data.blast || 0),
      constants.ENEMY_PIECE_CIRCLE_COLORS,
      {
        stage,
        bitmaps,
        currentCourse,
        $$lowerLayer: $$layers.course,
        $$parentLayer: $$layers.drizzler,
        isRTMode: initializationOptions.isRTMode,
        assetsPath: initializationOptions.assetsPath,
      },
    );
    // push
    bitmaps.push(bitmap);
  };

  /** toggleDrizzlerCircle()
   * コウモリの索敵円の表示･非表示を切り替えます。
   */
  const toggleDrizzlerCircle = () => {
    // フラグを切り替える
    currentCourse.isVisibleDrizzlerCircle = !currentCourse.isVisibleDrizzlerCircle;
    // 目標とする拡大率
    const alpha = (currentCourse.isVisibleDrizzlerCircle) ? 1 : 0;
    // アニメーション
    const $$circles = [];
    drizzlers.forEach((drizzler) => {
      $$circles.push(drizzler.$$circle);
    });
    utilities.instantTween(
      $$circles,
      { alpha },
      constants.DRIZZLER_TWEEN_TIME,
      constants.DRIZZLER_TWEEN_EASE,
    );
  };

  /** toggleConnectMap()
   * コネクトマップの表示･非表示を切り替えます。
   */
  const toggleConnectMap = () => {
    // フラグを切り替える
    currentCourse.isVisibleConnectMap = !currentCourse.isVisibleConnectMap;
    // 目標とする不透明度
    const alpha = (currentCourse.isVisibleConnectMap) ? 1 : 0;
    // アニメーション
    utilities.instantTween(
      currentCourse.$$connectMapContainer,
      { alpha },
      constants.DRIZZLER_TWEEN_TIME,
      constants.DRIZZLER_TWEEN_EASE,
    );
  };

  /** toggleVoronoi()
   * ボロノイ図の表示･非表示を切り替えます。
   */
  const toggleVoronoi = (target) => {
    // 切り替えアニメーション中なら何もしない
    // if (currentCourse.isTogglingVoronoi) {
    //   return;
    // }
    if (target !== undefined && target === currentCourse.isVisibleVoronoi) {
      return;
    }
    // 切り替え中
    // currentCourse.isTogglingVoronoi = true;
    // フラグを切り替える
    currentCourse.isVisibleVoronoi = !currentCourse.isVisibleVoronoi;
    // 目標とする不透明度
    const alpha = (currentCourse.isVisibleVoronoi) ? constants.VORONOI_ALPHA : 0;
    // ボロノイ図をアップデートすべきなら描き直す
    if (currentCourse.isVisibleVoronoi && currentCourse.shouldUpdateVoronoi) {
      currentCourse.paintVoronoi();
    }
    // 透明度を変化
    currentCourse.$$paint.set({ alpha });
    // disable
    if (!currentCourse.isVisibleVoronoi) {
      drizzlers.forEach((drizzler) => {
        drizzler.disableVoronoi();
      });
    }
    // アニメーション
    // utilities.instantTween(
    //   currentCourse.$$paint,
    //   { alpha },
    //   constants.DRIZZLER_TWEEN_TIME,
    //   constants.DRIZZLER_TWEEN_EASE,
    //   () => {
    //     // 切り替え中ではなくする
    //     currentCourse.isTogglingVoronoi = false;
    //   },
    // );
  };

  /** selectStartVoronoi()
   */
  const selectStartVoronoi = () => {
    document.getElementById('drizzlerjs-voronoi-desc').style.setProperty('display', 'none');
    if (currentCourse.isVisibleVoronoi) {
      toggleVoronoi(false);
      return;
    }
    const ctx = currentCourse.$$paint.image.getContext('2d');
    if (currentCourse.isSelectingVoronoi) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      toggleVoronoi(false);
      currentCourse.isSelectingVoronoi = false;
    } else {
      currentCourse.$$paint.set({ alpha: constants.VORONOI_ALPHA });
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      currentCourse.isSelectingVoronoi = true;
      document.getElementById('drizzlerjs-voronoi-desc').style.setProperty('display', 'block');
    }
  };

  /** toggleArrow()
   * コウモリの矢印の表示･非表示を切り替えます。
   */
  const toggleArrow = () => {
    currentCourse.isVisibleArrow = !currentCourse.isVisibleArrow;
    if (currentCourse.isVisibleArrow) {
      currentCourse.showDrizzlerArrows(false);
    } else {
      currentCourse.hideDrizzlerArrows();
    }
  };

  /** stepDrizzlers()
   * いま目的地を保有するコウモリを一手分進めます。
   */
  const stepDrizzlers = () => {
    drizzlers.forEach((drizzler) => {
      if (drizzler.targetPark) {
        drizzler.move(drizzler.targetPark);
      }
    });
    currentCourse.updateDrizzlerArrows(true);
  };
  /** createBossSpawningQueue()
   * オオモノ湧きのキューを作成します。
   */
  const createBossSpawningQueue = (norma = 25, hazardLevel = 200) => {
    bossSpawningQueue = [];
    // WAVEが開始されるフレーム
    const startFrame = constants.RTMODE_WAVE_START_FRAME;
    // 1WAVEの秒数
    const oneWaveSeconds = constants.ONE_WAVE_SECONDS;
    // オオモノシャケの合計数 たとえば21-1=20匹
    const bossCount = Math.max(2, Math.min(99, norma - 1));
    // ラスト湧き(Last Spawning)が始まる残り秒数 たとえば28秒
    const lastSpawningLeftSeconds = 28;
    // ラスト湧きに至るまでの1単位湧きの数
    // たとえばキケン度MAXなら7回(100-, 90-, 80-, 69-. 59-, 49-, 38-)
    const spawningCountUntilLS = Math.floor(3 + hazardLevel / 50);
    // ラスト湧きに至るまでの秒数 たとえば100-28=72秒
    // 1WAVEあたりの秒数を100秒から変更している場合は100に対する比をかける
    const lastSpawningSeconds = (100 - lastSpawningLeftSeconds) * (oneWaveSeconds / 100);
    // 1単位湧きの秒数 たとえば72/7=10.285
    const oneSpawningSeconds = lastSpawningSeconds / spawningCountUntilLS;
    // 1単位湧きが何回生じるか たとえばceil(100/10.285)=10
    const spawningCount = Math.ceil(oneWaveSeconds / oneSpawningSeconds);
    // 1単位湧きあたりのオオモノシャケの最低数 たとえばfloor(20/(7+1))=floor(2.5)=2
    const bossMinCountPerSpawning = Math.floor(bossCount / (spawningCountUntilLS + 1));
    // 1単位湧きあたりのオオモノシャケの数の配列
    // とりあえず最小値で埋めておこう たとえば[2,2,2,2,2,2,2,2]
    const bossCountsOfOneSpawning = utilities.createArray(
      spawningCountUntilLS + 1,
      bossMinCountPerSpawning,
    );
    // 足りないオオモノシャケの数 たとえば20-(2*(7+1))=4匹
    const shouldAddNumber = bossCount
      - (spawningCountUntilLS + 1) * bossMinCountPerSpawning;
    // 足りないオオモノシャケが湧くタイミングをランダムに決めて補充することを考えよう
    // それぞれの単位湧きに乱数でスコアを与える
    const randomScores = [];
    for (let i = 0; i < spawningCountUntilLS + 1; i += 1) {
      randomScores.push({
        spawningIndex: i,
        score: xors.getRandom(100),
      });
    }
    // スコアを降順で並べ替える
    randomScores.sort((a, b) => ((a.score > b.score) ? -1 : 1));
    // 足りないオオモノシャケの数だけ
    for (let i = 0; i < shouldAddNumber; i += 1) {
      // 乱数スコアの高かった湧きタイミングにオオモノを足す
      const index = randomScores[i].spawningIndex;
      bossCountsOfOneSpawning[index] += 1;
    }
    // 1単位湧きあたりのオオモノシャケの数の配列が決定できた！
    // たとえば [3, 2, 2, 2, 3, 3, 3, 2]
    // それぞれの単位湧きについて
    for (let i = 0; i < bossCountsOfOneSpawning.length; i += 1) {
      // その単位湧きが始まる秒数 たとえば2*10.285=20.57秒
      const startSeconds = i * oneSpawningSeconds;
      // 今回の単位湧きで湧くオオモノの数だけ
      for (let j = 0; j < bossCountsOfOneSpawning[i]; j += 1) {
        // 湧きタイミングを決定する係数
        let timingCoefficient;
        // 場合分け
        if (i === 0 && j === 0) {
          // 一番最初の1匹ならば係数は0固定
          timingCoefficient = 0;
        } else if (i < bossCountsOfOneSpawning.length - 1) {
          // 2匹目以降ラスト湧きまでの係数は0-100から決定する
          timingCoefficient = xors.getRandom(100) / 100;
        } else if (j === 0) {
          // ラスト湧きの1匹目の係数は0固定
          timingCoefficient = 0;
        } else {
          // ラスト湧きの2匹目以降の係数は0-20から決定する
          // 20は適当に決めた
          timingCoefficient = xors.getRandom(20) / 100;
        }
        // そのオオモノが湧く秒数を決定する たとえば 20.57+10.285*0.5=25.7125秒
        const spawningSeconds = startSeconds + oneSpawningSeconds * timingCoefficient;
        // フレームに直す たとえばfloor(25.7125*60)=floor(1542.75)=1542フレーム
        const spnFrame = Math.floor(spawningSeconds * constants.FRAME_RATE);
        // オオモノの種類を選択する
        const bossKind = 'drizzler';
        // スポーン位置を決めるのに用いるランダムスコア
        const randomScore = xors.getRandom(100);
        const boss = {
          frame: startFrame + spnFrame,
          bossKind,
          randomScore,
        };
        bossSpawningQueue.push(boss);
      }
    }
    // キューをフレーム昇順で並べ替える
    bossSpawningQueue.sort((a, b) => ((a.frame < b.frame) ? -1 : 1));
    // オオモノ湧きキューが完成したよ！
    // 湧き方角変化キューも併せて作成しよう
    spnDirChangingQueue = [];
    // 単位湧きの数だけ
    for (let i = 0; i < spawningCount; i += 1) {
      // 0-100のランダムスコアを取得
      let randomScore = xors.getRandom(100);
      // 今回の単位湧きの湧き方角
      let spnDir = null;
      // 現在のコースが保有する湧き方角を走査
      for (let j = 0; j < currentCourse.spawners.length; j += 1) {
        // ランダムスコアがその湧き方角の確率スコアより低い値かどうか
        if (randomScore < currentCourse.spawners[j].probability) {
          // もしそうならその湧き方角に決定する
          spnDir = currentCourse.spawners[j];
          break;
        } else {
          // 違ったならランダムスコアから確率スコアを引く
          randomScore -= currentCourse.spawners[j].probability;
        }
      }
      // 湧き方角が決まったか
      if (spnDir !== null) {
        // 湧き方角が決まっていればそれをpushする
        spnDirChangingQueue.push({
          frame: startFrame + Math.floor((i * oneSpawningSeconds) * constants.FRAME_RATE),
          spnDir,
        });
      } else {
        // 湧き方角が決まっていない！本来ありえないのでログを出しておく
        console.log('spawning direction error!');
      }
    }
    // 最初の湧き方角変化キューはもう受け取ってしまおう！
    currentSpnDir = spnDirChangingQueue[0].spnDir;
    spnDirChangingQueue.shift();
  };

  /** handleTick()
   * 非リアルタイムモードにおけるtickerです。
   */
  const handleTick = () => {
    stage.update();
  };

  /** handleTickRT()
   * リアルタイムモードにおけるtickerです。
   */
  const handleTickRT = () => {
    // CreateJSがステージに保有しているオブジェクトの数を表示する
    if (constants.DO_LOG_OBJECT_COUNT && frame % constants.LOG_OBJECT_COUNT_INTERVAL === 0) {
      utilities.logObjectCount(stage);
    }
    // スポーンキューが存在し、かつ、先頭のキューのframeが現在のframeと一致する限り
    while (bossSpawningQueue.length !== 0 && frame === bossSpawningQueue[0].frame) {
      // コウモリを出現させてキューを削除する
      spawnDrizzler(bossSpawningQueue[0]);
      bossSpawningQueue.shift();
    }
    // 湧き方角変更キューが存在し、かつ、先頭のキューのframeが現在のframeと一致する限り
    while (spnDirChangingQueue.length !== 0 && frame === spnDirChangingQueue[0].frame) {
      // 湧き方角を変化させてキューを削除する
      currentSpnDir = spnDirChangingQueue[0].spnDir;
      spnDirChangingQueue.shift();
    }
    // 残り時間を計算
    const waveFrame = Math.max(0, frame - constants.RTMODE_WAVE_START_FRAME);
    const parsedFrame = Math.floor(waveFrame / constants.FRAME_RATE);
    const leftSeconds = Math.max(0, constants.ONE_WAVE_SECONDS - parsedFrame);
    if (beforeLeftSeconds !== leftSeconds) {
      currentCourse.$$leftSeconds.text = leftSeconds;
      beforeLeftSeconds = leftSeconds;
    }
    // コウモリをtick
    drizzlers.forEach((drizzler) => {
      drizzler.tick();
    });
    // ロケットをtick
    rockets.forEach((rocket) => {
      rocket.tick();
    });
    // CreateJSのステージをアップデート
    stage.update();
    // フレームを増加させる
    frame += 1;
  };

  /** selectCourse()
   * コースを選択します。非同期。
   */
  const selectCourse = async (course, tide) => {
    // キャッシュに格納するキーを作成
    const key = `${course}-${tide}`;
    // console.log(key);
    // 参照用オブジェクト
    const pointer = {
      stage,
      squids,
      drizzlers,
      $$parentLayer: $$layers.course,
      isRTMode: initializationOptions.isRTMode,
      assetsPath: initializationOptions.assetsPath,
    };
    // キャッシュにインスタンスが存在しないならば新しく作る！
    if (courseCaches[key] === undefined) {
      // 使用するzMapの水位
      const zMapTide = (tide === 'high') ? 'normal' : tide;
      // 使用するzMapの画像データの場所
      const zMapPath = `${initializationOptions.assetsPath}/assets/zmap/${course}-${zMapTide}.png`;
      // zMapインスタンスを作成する
      const zMap = new ZMap(zMapPath);
      // zMapのロードを行う
      await zMap.load();
      // コースの定義データを作成する
      let def;
      // 満潮かどうか
      if (tide !== 'high') {
        // 満潮でないならば単にconstantsから持ってくるだけでいいのだが
        def = constants.COURSE_DATA[course][tide];
      } else {
        // 満潮ならば
        // とりあえず満潮のデータをconstantsから持ってくる
        // ただし、これはすかすかのデータである
        const highDef = constants.COURSE_DATA[course][tide];
        // 通常水位のコピーデータも持ってくる
        const normalDef = JSON.parse(JSON.stringify(constants.COURSE_DATA[course].normal));
        // 通常水位のコピーデータから「満潮には存在しない駐車場」を除外する
        highDef.excludeParks.forEach((park) => {
          for (let i = 0; i < normalDef.lines.length; i += 1) {
            if (normalDef.lines[i].indexOf(park) > -1) {
              normalDef.lines.splice(i, 1);
              i -= 1;
            }
          }
        });
        // 通常水位のコピーデータに「満潮でのみ追加される経路」を追加する
        highDef.additionalLines.forEach((line) => {
          normalDef.lines.push(line);
        });
        // その他、満潮のデータが持っているプロパティを通常水位のコピーデータに上書きする
        Object.keys(highDef).forEach((defKey) => {
          normalDef[defKey] = highDef[defKey];
        });
        // 一連の処理を行った通常水位のコピーデータを定義として使用する
        def = normalDef;
      }
      // 使用するコース画像ファイルの場所
      def.image = `${initializationOptions.assetsPath}/assets/course/${course}-${tide}.png`;
      // コースインスタンスを作成してキャッシュに放り込む
      courseCaches[key] = new Course(
        def,
        zMap,
        pointer,
      );
    }
    // キャッシュからインスタンスを持ってきて代入する
    currentCourse = courseCaches[key];
    currentCourse.pointer = pointer;
    // コースを描画する
    currentCourse.draw();
  };

  /** addToolForPieces(options)
   * ブキの追加ツールをDOMに追加します。
   */
  const addToolForPieces = (options) => {
    // ラッパーを取得
    const $wrapper = document.getElementById(options.pieceToolsWrapperId);
    // 段の情報
    let row;
    let column;
    let startRow = 0;
    let startColumn = 0;
    // 横幅および高さ
    const width = constants.ADDTOOL_WIDTH + constants.ADDTOOL_MARGIN;
    // 敵駒データについて走査
    Object.keys(constants.ENEMY_PIECE_DATA).forEach((key, i) => {
      // 画像ファイルの場所
      const path = `${initializationOptions.assetsPath}/assets/piece/${key}.png`;
      // 位置を決定
      row = startRow + Math.floor((startColumn + i) / constants.ADDTOOL_COLUMN_NUM);
      column = (startColumn + i) % constants.ADDTOOL_COLUMN_NUM;
      const x = constants.ADDTOOL_LEFT + column * width;
      const y = constants.ADDTOOL_TOP + row * width;
      // <img>要素を作成
      const $image = document.createElement('img');
      $image.src = path;
      $image.style.setProperty('left', `${x}px`);
      $image.style.setProperty('top', `${y}px`);
      // クリックしたとき
      $image.addEventListener('click', () => {
        // ラッパーを隠して
        $wrapper.style.setProperty('display', 'none');
        // 駒を追加する
        addEnemyPiece(key);
      }, false);
      // <img>要素をラッパーに追加
      $wrapper.appendChild($image);
    });
    // startRowの更新
    startRow = row;
    startColumn = column + 1;
    // ブキ駒データについて走査
    Object.keys(constants.WEAPON_DATA).forEach((key, i) => {
      const path = `${initializationOptions.weaponsPath}/weapons/${key}.png`;
      row = startRow + Math.floor((i + startColumn) / constants.ADDTOOL_COLUMN_NUM);
      column = (i + startColumn) % constants.ADDTOOL_COLUMN_NUM;
      const x = constants.ADDTOOL_LEFT + column * width;
      const y = constants.ADDTOOL_TOP + row * width;
      const $image = document.createElement('img');
      $image.src = path;
      $image.style.setProperty('left', `${x}px`);
      $image.style.setProperty('top', `${y}px`);
      $image.addEventListener('click', () => {
        $wrapper.style.setProperty('display', 'none');
        addWeaponPiece(key);
      }, false);
      $wrapper.appendChild($image);
    });
  };

  /** initializeVariables()
   * 変数に初期値を代入します。
   */
  const initializeVariables = () => {
    // stage = null;
    // $canvas = null;
    // $$layers = {};
    initializationOptions = null;
    currentCourse = null;
    squids = [];
    rockets = [];
    bitmaps = [];
    drizzlers = [];
    currentSpnDir = null;
    bossSpawningQueue = [];
    spnDirChangingQueue = [];
    frame = 0;
    xors = null;
    isPlaying = false;
    beforeLeftSeconds = null;
    randomSeed = 0;
  };

  /** initialize(options)
   + drizzlerjsの初期化を行います。
   */
  const initialize = (options) => {
    // 初期化済みならば何もしない
    if (initializationOptions) {
      return;
    }
    // 変数を初期化
    initializeVariables();
    // 初期化時のオプションを保存しておく
    initializationOptions = options;
    // キャンバスをまだ作成したことがないなら作成する
    if (!$canvas) {
      // <canvas>要素を作成
      $canvas = utilities.create$canvas(constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
      // CreateJSのステージを作成
      if (constants.IS_STAGEGL) {
        stage = new createjs.StageGL($canvas);
        stage.setClearColor(constants.CLEAR_COLOR);
      } else {
        stage = new createjs.Stage($canvas);
      }
      // タッチイベントが発火するかどうか
      if (createjs.Touch.isSupported()) {
        // タッチイベントが発火するなら
        // CreateJSのタッチ操作を有効にする
        createjs.Touch.enable(stage);
      } else {
        // タッチイベントが発火しないなら
        // マウスオーバーを有効化する
        stage.enableMouseOver();
      }
      // レイヤーを作成して追加する
      $$layers = {};
      constants.CANVAS_LAYERS.forEach((key) => {
        $$layers[key] = new createjs.Container();
        stage.addChild($$layers[key]);
      });
    }
    // $canvasをDOMに追加する
    document.getElementById(options.canvasWrapperId).append($canvas);
    // Tickerについて、リアルタイムモードかどうか
    if (options.isRTMode) {
      // リアルタイムモードならば
      // FPSが60以上かどうか
      if (constants.FRAME_RATE >= 60) {
        // 60以上ならばRAF(requestAnimationFrameをそのまま使用)
        // FPSを設定する必要はない(というか、設定しても無視される)
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
      } else {
        // 60FPSでないならばRAF_SYNCHED(requestAnimationFrameを使用しつつFPSに従う)
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        // FPSを設定する
        createjs.Ticker.framerate = constants.FRAME_RATE;
      }
    } else {
      // 非リアルタイムモードならばRAF_SYNCHEDを使用
      createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
      // FPSは30くらいでいいだろう
      createjs.Ticker.framerate = constants.FRAME_RATE_NOT_RT;
    }
    // ツール要素を追加
    addToolForPieces(options);
    // ツールの切り替え
    if (options.isRTMode) {
      document.getElementById(options.rtModeToolsWrapperId)
        .style.setProperty('display', 'block');
      document.getElementById(options.notRtModeToolsWrapperId)
        .style.setProperty('display', 'none');
    } else {
      document.getElementById(options.rtModeToolsWrapperId)
        .style.setProperty('display', 'none');
      document.getElementById(options.notRtModeToolsWrapperId)
        .style.setProperty('display', 'block');
    }
    // console.log('drizzlerjs initialized.');
  };

  /** finalize()
   * drizzlerjsの終了処理を行います。
   */
  const finalize = () => {
    // 初期化がされていないならば何もしない
    if (!initializationOptions) {
      return;
    }
    // 稼働中なら止める
    if (isPlaying) {
      stop();
    }
    // 初期化時のオプションを取得
    const options = initializationOptions;
    // 追加したDOM要素を削除
    utilities.empty$element(options.canvasWrapperId);
    utilities.empty$element(options.pieceToolsWrapperId);
    // 変数を初期化
    initializeVariables();
    // console.log('drizzlerjs finalized.');
  };

  /** start(options)
   * drizzlerjsを開始します。非同期。
   */
  const start = async (options = initializationOptions) => {
    // 初期化が済んでいなければ初期化する
    if (!initializationOptions) {
      initialize(options);
    }
    // 乱数生成器を作成
    randomSeed = Math.floor(utilities.getTime());
    xors = new Xors(randomSeed);
    // コースを選択する
    await selectCourse(options.course, options.tide);
    // リアルタイムモードかどうか
    if (options.isRTMode) {
      // リアルタイムモードならば
      // イカを追加
      addSquid();
      // オオモノ湧きキューおよび湧き方角の変化キューを作成
      createBossSpawningQueue();
      // tickハンドラを登録
      createjs.Ticker.on('tick', handleTickRT);
    } else {
      // リアルタイムモードならば
      // コウモリを追加
      addDrizzler();
      // イカを追加
      addSquid();
      // tickハンドラを登録
      createjs.Ticker.on('tick', handleTick);
    }
    // フラグを立てる
    isPlaying = true;
    // console.log('drizzlerjs started.');
  };

  /** stop()
   * drizzlerjsをいったん停止します。
   */
  const stop = () => {
    // tickerをリセット(tick停止+ハンドラ削除)
    createjs.Ticker.reset();
    // インスタンスを全部削除する
    removeAllPieces();
    // CreateJSのステージをまっさらにする
    Object.keys($$layers).forEach((key) => {
      $$layers[key].removeAllChildren();
    });
    stage.update();
    // コースのメモリを開放
    currentCourse.setNull();
    // フレームをリセット
    frame = 0;
    // フラグを折る
    isPlaying = false;
    // console.log('drizzlerjs stopped.');
  };

  /** - return -
   */
  return {
    stop,
    start,
    initialize,
    finalize,
    addSquid,
    addDrizzler,
    toggleArrow,
    toggleVoronoi,
    stepDrizzlers,
    removeAllPieces,
    toggleConnectMap,
    toggleDrizzlerCircle,
    selectStartVoronoi,
  };
})();
