/*
 * constants
 * 定数
 */
window.POS = {
  IKA_ICON: [       // 左上のイカ(タコ)アイコン
    {x: 20, y: 60}, // 1番目 
    {x: 44, y: 60}, // 2番目
    {x: 68, y: 60}, // 3番目
    {x: 92, y: 60}  // 4番目
  ],
  WAVE_NUM       : {x:  57, y: 12}, // 画面左上のWave数
  WAVE_NOTICE    : {x: 251, y: 45}, // Wave開始前の予告文字
  WAVE_NOTICE_NUM: {x: 308, y: 45}, // Wave開始前の予告文字の数字部分
  GOLDEN_IKURA   : {x:  78, y: 35}, // ノルマと残り時間の間にある金イクラ
  SPECIAL_ICON   : {x: 573, y: 32}, // スペシャルウェポンのアイコン
  SPECIAL_POUCH: [   // SPパウチのアイコン
    {x: 562, y: 24}, // 右
    {x: 533, y: 24}, // 左
  ],
  CENTER_COUNT_8: {x: 273, y: 137,  // Wave開始前の画面中央のカウントの8
    w: 91, h: 88},
  NORMA_BIG     : {x: 184, y:  73,  // ノルマ及び納品数の拡大表示
    w: 84, h: 18, dx: 0, dy: 100, dw: 84, dh: 18},
  LEFT_TIME_BIG : {x: 70, y:  66,  // 残り時間の拡大表示
    w: 45, h: 32, dx: 0, dy: 118, dw: 45, dh: 32},
  IKA_ICON_BIG  : {x: 39, y:  118,  // イカアイコンの拡大表示
    w: 183, h: 44, dx: 0, dy: 150, dw: 183, dh: 44},
  WAVE_NUM_BIG  : {x: 112, y:  23,  // Wave数の拡大表示
    w: 19, h: 30, dx: 0, dy: 194, dw: 19, dh: 30},
  NOUHIN_DIGIT_1: {x: 22, y: 100}, // 納品数1桁目
  NOUHIN_DIGIT_2: {x:  6, y: 100}, // 納品数2桁目
  NORMA_DIGIT_1 : {x: 74, y: 100}, // ノルマ1桁目
  NORMA_DIGIT_2 : {x: 58, y: 100}, // ノルマ2桁目
  WORKS_OVER    : {x: 0, y: 0},    // Work's Over
};
window.COLOR = {
  IKA: [
    [190,  40, 160], // 0: Magenta
    [ 50,  30, 170], // 1: Orange
    [190,  80,  20], // 2: Blue
    [ 30,  30,  30], // 3: Death
  ],
  WAVE_NOTICE  : [ 40, 220, 135], // Wave開始前の予告
  GOLDEN_IKURA : [235, 235,  40], // 金イクラ
  SPECIAL_POUCH: [230, 230, 230], // SPパウチ
  SPECIAL_BG   : [  0,   0,  40], // SP部分の背景
  CENTER_COUNT : [ 70, 160,  90], // Wave開始前の画面中央のカウント
  NORMA_NUM    : [255, 255, 240], // ノルマ
  NORMA_NUM_BG : [ 30,  30,  20], // ノルマ
  LEFT_TIME    : [237, 255, 13],  // 残り時間
  WORKS_OVER_TEXT: [241, 96, 54], // Work's Overの文字色
  WORKS_OVER_BG  : [10, 10, 0],   // Work's Overの背景色
};
window.BORDER = {
  NOUHIN_NUM   :  8000, // difがこれ以下なら納品数が表示されている
  WAVE_NOTICE  : 40000, // difがこれ以下ならWave予告が表示されている
  WAVE_NUM     :  4000, // difがこれ以下ならWaveが表示されている
  SPECIAL_POUCH:  2000, // difがこれ以下ならSPがある
  PLAYER       : 10000, // difがこれ以下ならイカアイコンがある
  PLAYER_DC    :   700, // difがこれ以下なら回線落ちである
  GOLDEN_IKURA :  4000, // difがこれ以下なら金イクラアイコンが表示されている
  WORKS_OVER   :  8000, // difがこれ以下ならWork's Overと表示されている
  LEFT_TIME    :  4000, // difがこれ以下なら残り時間に0と表示されている
};
window.NOUHIN_NUM_MARGIN = [
  0, 6, 0, 1, 1, 2, 1, 3, 1, 1
];
window.BW = {
  IKA_ICON: null,
  IKA_ICON_X: null,
  WAVE_NUM: [],
  WAVE_NOTICE: [],
  GOLDEN_IKURA: null,
  SPECIAL_ICON: [],
  SPECIAL_POUCH: null,
  CENTER_COUNT_8: null,
  NORMA_NUM: [],
  WORKS_OVER: null,
  LEFT_TIME: [],
};
window.LANG = {
  PLAYER: ['0', '生', '生', '生', '死', 'DC'],
  SPECIAL: ['0', 'ボムピ', 'チャクチ', 'ジェッパ', 'ハイプレ'],
  WORKS_OVER: ['no', 'yes'],
};

/* 
 * myData
 * とりあえずいろんなデータを突っ込む場所
 */
window.myData = {
  bufferAutoKeys: [
    'wave', 'waveNotice', 'goldenIkuraIcon', 'worksOver', 'timeUp', 'waveClear',
    'player0', 'player1', 'player2', 'player3', 'specialKind', 'specialNum',
  ],
  bufferKeys: [
    'wave', 'waveNotice', 'goldenIkuraIcon', 'worksOver', 'timeUp', 'waveClear',
    'player0', 'player1', 'player2', 'player3', 'specialKind', 'specialNum',
    'nouhinNum', 'normaNum', 'isWaveNow',
  ],
  soundKeys: [
    'wave-start', 'norma-ok', 'works-over',
    'wave-1-clear', 'wave-2-clear', 'wave-3-clear', 
  ],
  normaBGColor: [0, 0, 0],
  isPlayed: {},
  leftTime: 0,
  centerCount8Time: 0,
  centerCount8Flag: false,
  centerCount8Delay: 0,
  buffer: {},
  prev: {},
  bufferLength: 3 * window.updateRate,
  checkBufferLength: 2,
  leftTimeSlip: 100,
  debugNouhinImageData: null,
};

/* 
 * canvasForBWArray
 * BW配列作成用のキャンバス
 */
window.canvasForBWArray = document.createElement('canvas');
window.canvasForBWArray.ctx = window.canvasForBWArray.getContext('2d');

/* 
 * isEqualBuffer(key)
 * バッファが特定数一致するかどうかを調べる
 */
function isEqualBuffer(key, len) {
  if (typeof len === 'undefined') len = myData.checkBufferLength;
  for (var f, i = 1; i < len; i++) {
    if (myData.buffer[key][i - 1] === myData.buffer[key][i]) {
      f = true;
    } else {
      f = false;
      break;
    }
  }
  return f;
}

/* 
 * unshiftBuffer(key, value)
 * バッファにデータを入れる
 */
function unshiftBuffer(key, value) {
  myData.buffer[key].unshift(value);
  myData.buffer[key].pop();
}

/* 
 * getMinimam(array, key)
 * 配列から特定のプロパティが最小のアイテムを取得する
 */
function getMinimam(array, key) {
  var min = Infinity;
  var minIndex = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] < min) {
      min = array[i][key];
      minIndex = i;
    }
  }
  return array[minIndex];
}

/* 
 * calcDigit(dgt1, dgt2)
 * 各桁の数値を個別に受け取って実際の数値に直す
 */
function calcDigit(dgt1, dgt2) {
  if (dgt2 < 0) {
    if (dgt1 < 0) {
      return 0;
    } else {
      return dgt1;
    }
  } else {
    if (dgt1 < 0) {
      return 10 * dgt2;
    } else {
      return 10 * dgt2 + dgt1;
    }
  }
}

/* 
 * initBWData()
 * BWデータの初期化 他
 */
function initBWData() {
  
  // BWデータを作成する
  window.BW.IKA_ICON        = createBWObject('#img-ika-icon-bw');
  window.BW.IKA_ICON_X      = createBWObject('#img-ika-icon-bw-x');
  window.BW.WAVE_NUM[0]     = createBWObject('#img-wave-num-1');
  window.BW.WAVE_NUM[1]     = createBWObject('#img-wave-num-2');
  window.BW.WAVE_NUM[2]     = createBWObject('#img-wave-num-3');
  window.BW.WAVE_NOTICE[0]  = createBWObject('#img-notice-num-1');
  window.BW.WAVE_NOTICE[1]  = createBWObject('#img-notice-num-2');
  window.BW.WAVE_NOTICE[2]  = createBWObject('#img-notice-num-3');
  window.BW.WAVE_NOTICE[3]  = createBWObject('#img-notice-num-4');
  window.BW.GOLDEN_IKURA    = createBWObject('#img-golden-ikura');
  window.BW.SPECIAL_ICON[0] = createBWObject('#img-special-icon-1');
  window.BW.SPECIAL_ICON[1] = createBWObject('#img-special-icon-2');
  window.BW.SPECIAL_ICON[2] = createBWObject('#img-special-icon-3');
  window.BW.SPECIAL_ICON[3] = createBWObject('#img-special-icon-4');
  window.BW.SPECIAL_POUCH   = createBWObject('#img-special-pouch');
  window.BW.CENTER_COUNT_8  = createBWObject('#img-center-count-8');
  window.BW.NORMA_NUM[0]    = createBWObject('#img-norma-num-0');
  window.BW.NORMA_NUM[1]    = createBWObject('#img-norma-num-1');
  window.BW.NORMA_NUM[2]    = createBWObject('#img-norma-num-2');
  window.BW.NORMA_NUM[3]    = createBWObject('#img-norma-num-3');
  window.BW.NORMA_NUM[4]    = createBWObject('#img-norma-num-4');
  window.BW.NORMA_NUM[5]    = createBWObject('#img-norma-num-5');
  window.BW.NORMA_NUM[6]    = createBWObject('#img-norma-num-6');
  window.BW.NORMA_NUM[7]    = createBWObject('#img-norma-num-7');
  window.BW.NORMA_NUM[8]    = createBWObject('#img-norma-num-8');
  window.BW.NORMA_NUM[9]    = createBWObject('#img-norma-num-9');
  window.BW.WORKS_OVER      = createBWObject('#img-works-over');
  window.BW.LEFT_TIME[0]    = createBWObject('#img-left-time-0');
  window.BW.LEFT_TIME[1]    = createBWObject('#img-left-time-8');
  
  // デバッグ用のイメージデータを作成する
  if (window.debugMode >= 2) {
    createDebugImageData();
    
    var w = BW.NORMA_NUM[0].width;
    var h = BW.NORMA_NUM[0].height;
    window.nouhinCanvases[0].width = w * 11;
    window.nouhinCanvases[0].height = h;
    window.nouhinCanvases[1].width = w * 11;
    window.nouhinCanvases[1].height = h;
    window.nouhinCanvases[0].ctx.fillStyle = '#000';
    window.nouhinCanvases[0].ctx.fillRect(0, 0, w, h);
    for (var i = 0; i < 10; i++) {
      var img = document.querySelector('#img-norma-num-' + i);
      window.nouhinCanvases[0].ctx.drawImage(img, w * (i + 1), 0);
    }
    var imagedata = window.nouhinCanvases[0].ctx.getImageData(0, 0, 
      window.nouhinCanvases[0].width, window.nouhinCanvases[0].height);
    for (var k, r, g, b, i = 0, y = 0; y < imagedata.height; y++) {
      for (x = 0; x < imagedata.width; x++) {
        k = i << 2;
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        if (r < 200) {
          imagedata.data[k + 0] = 0;
          imagedata.data[k + 1] = 0;
          imagedata.data[k + 2] = 0;
          imagedata.data[k + 3] = 255;
        } else {
          imagedata.data[k + 0] = 0;
          imagedata.data[k + 1] = 0;
          imagedata.data[k + 2] = 0;
          imagedata.data[k + 3] = 0;
        }
        i++;
      }
    }
    myData.debugNouhinImageData = imagedata;
    window.nouhinCanvases[0].ctx.putImageData(myData.debugNouhinImageData, 0, 0);
    window.nouhinCanvases[1].ctx.putImageData(myData.debugNouhinImageData, 0, 0);
  }
  
  // myDataのバッファを確保する
  myData.bufferKeys.map(key => {
    myData[key] = 0;
    myData.prev[key] = 0;
    myData.buffer[key] = [];
    for (var i = 0; i < myData.bufferLength; i++) {
      myData.buffer[key][i] = 0;
    }
  });
  
}

/* 
 * createDebugImageData()
 * デバッグ用のimagedataを作成する
 */
function createDebugImageData() {
  
  // 白で塗りつぶす
  window.canvas.ctx.fillStyle = '#fff';
  window.canvas.ctx.fillRect(0, 0, 640, 360);
  
  // 使用しているBWデータを乗算で描き込んでいく
  function draw(img, x, y) {
    if (typeof img === 'string') {
      img = document.querySelector(img);
    }
    window.canvas.ctx.drawImage(img, x, y);
  }
  window.canvas.ctx.globalCompositeOperation = 'multiply';
  draw('#img-ika-icon-bw',    POS.IKA_ICON[0].x,  POS.IKA_ICON[0].y);
  draw('#img-ika-icon-bw',    POS.IKA_ICON[1].x,  POS.IKA_ICON[1].y);
  draw('#img-ika-icon-bw',    POS.IKA_ICON[2].x,  POS.IKA_ICON[2].y);
  draw('#img-ika-icon-bw',    POS.IKA_ICON[3].x,  POS.IKA_ICON[3].y);
  draw('#img-wave-num-1',     POS.WAVE_NUM.x,     POS.WAVE_NUM.y);
  draw('#img-wave-num-2',     POS.WAVE_NUM.x,     POS.WAVE_NUM.y);
  draw('#img-wave-num-3',     POS.WAVE_NUM.x,     POS.WAVE_NUM.y);
  draw('#img-notice-num-1',   POS.WAVE_NOTICE.x,  POS.WAVE_NOTICE.y);
  draw('#img-notice-num-2',   POS.WAVE_NOTICE.x,  POS.WAVE_NOTICE.y);
  draw('#img-notice-num-3',   POS.WAVE_NOTICE.x,  POS.WAVE_NOTICE.y);
  draw('#img-notice-num-4',   POS.WAVE_NOTICE.x,  POS.WAVE_NOTICE.y);
  draw('#img-golden-ikura',   POS.GOLDEN_IKURA.x, POS.GOLDEN_IKURA.y);
  draw('#img-special-icon-1', POS.SPECIAL_ICON.x, POS.SPECIAL_ICON.y);
  draw('#img-special-icon-2', POS.SPECIAL_ICON.x, POS.SPECIAL_ICON.y);
  draw('#img-special-icon-3', POS.SPECIAL_ICON.x, POS.SPECIAL_ICON.y);
  draw('#img-special-icon-4', POS.SPECIAL_ICON.x, POS.SPECIAL_ICON.y);
  draw('#img-special-pouch',  POS.SPECIAL_POUCH[0].x, POS.SPECIAL_POUCH[0].y);
  draw('#img-special-pouch',  POS.SPECIAL_POUCH[1].x, POS.SPECIAL_POUCH[1].y);
  
  // source-overに戻しておく
  window.canvas.ctx.globalCompositeOperation = 'source-over';
  
  // 白い部分を透明化する
  var w = 640, h = 360;
  var imagedata = window.canvas.ctx.getImageData(0, 0, w, h);
  var k, r, i, wh = w * h;
  for (i = 0; i < wh; i++) {
    k = i << 2;
    r = imagedata.data[k + 0];
    imagedata.data[k + 0] = 255;
    imagedata.data[k + 1] = 255;
    imagedata.data[k + 2] = 255;
    if (r < 127) {
      imagedata.data[k + 3] = 255;
    } else {
      imagedata.data[k + 3] = 0;
    }
  }
  
  // 以上の処理で出来上がったimagedataをグローバル変数に突っ込んでおく
  window.debugImageData = imagedata;
  
  // クリア
  window.canvas.ctx.clearRect(0, 0, w, h);
}

/* 
 * createBWObject()
 * BWオブジェクトを作成する
 */
function createBWObject(img) {
  var obj = {};
  if (typeof img === 'string') {
    img = document.querySelector(img);
  }
  // naturalWidthが使いたいので使えるかどうか確認する
  // 使えないならonloadにセットしておく
  if (img.naturalWidth) {
    obj.width = img.naturalWidth;
    obj.height = img.naturalHeight;
    var [array, blackNum] = createBWArray(img);
    obj.data = array;
    obj.blackNum = blackNum;
  } else {
    img.onload = function() {
      img.onload = null;
      obj.width = this.naturalWidth;
      obj.height = this.naturalHeight;
      var [array, blackNum] = createBWArray(img);
      obj.data = array;
      obj.blackNum = blackNum;
    };
    img.src = img.src;
  }
  
  // とりあえずオブジェクトだけ返す
  return obj;
}

/* 
 * createBWArray(img)
 * imgのBW配列を作成する
** BW配列: 画像の各ピクセルが白ならば0、黒ならば1が格納された配列
** 左上のピクセルを開始地点として右側に見ていく
** 右端に到達したら1段下の左端に移る
 */
function createBWArray(img) {
  var w = img.naturalWidth;
  var h = img.naturalHeight;
  window.canvasForBWArray.width = w;
  window.canvasForBWArray.height = h;
  window.canvasForBWArray.ctx.drawImage(img, 0, 0, w, h);
  var imagedata = window.canvasForBWArray.ctx.getImageData(0, 0, w, h);
  var buffer = new ArrayBuffer(w * h);
  var array = new Uint8Array(buffer);
  var x, y, wh = w * h, k, r, i, isBlack, blackNum = 0;
  for (x = 0; x < w; x++) {
    for (y = 0; y < h; y++) {
      i = x + y * w;
      k = 4 * i;
      r = imagedata.data[k + 0];
      if (r < 100) {
        array[i] = 1;
        blackNum++;
      } else if (r > 200) {
        array[i] = 0;
      } else {
        array[i] = 2;
        blackNum++;
      }
    }
  }
  return [array, blackNum];
}

/* 
 * synchronizeCanvas(video)
 * <video>と<canvas>を同期する
 */
function synchronizeCanvas(video) {
  window.syncVideo = video;
  logger.log('synchronizing canvas');
  updateCanvas();
}

/* 
 * ★updateCanvas()
 * <canvas>をアップデートする
 */
window.updateTimer = null;
function updateCanvas() {
  
  // 前回timeoutのキャンセルと次回timeoutの予約
  clearTimeout(window.updateTimer);
  var delay = window.updateDelay;
  if (myData.centerCount8Delay !== 0) {
    delay = (1000 + window.updateDelay - myData.centerCount8Delay -
      myData.leftTimeSlip) % 1000;
    myData.centerCount8Delay = 0;
  }
  window.updateTimer = setTimeout(updateCanvas, delay);
  
  //window.sound.play('cursor.mp3');
  
  // 描画する
  window.canvas.ctx.globalCompositeOperation = 'source-over';
  window.canvas.ctx.drawImage(window.syncVideo,
    0, 0, window.canvas.width, window.canvas.height);
  
  // ノルマ部分を拡大描画
  var rect = POS.NORMA_BIG;
  window.canvas.ctx.drawImage(window.syncVideo,
    rect.x, rect.y, rect.w, rect.h, rect.dx, rect.dy, rect.dw, rect.dh);
  
  // 残り時間を拡大描画
  rect = POS.LEFT_TIME_BIG;
  window.canvas.ctx.drawImage(window.syncVideo,
    rect.x, rect.y, rect.w, rect.h, rect.dx, rect.dy, rect.dw, rect.dh);
  
  // イカアイコンを拡大描画
  //rect = POS.IKA_ICON_BIG;
  //window.canvas.ctx.drawImage(window.syncVideo,
  //  rect.x, rect.y, rect.w, rect.h, rect.dx, rect.dy, rect.dw, rect.dh);
  
  // ノルマ部分の背景色を取得する
  var imagedata = window.canvas.ctx.getImageData(0, 100, 1, 1);
  myData.normaBGColor[0] = imagedata.data[0];
  myData.normaBGColor[1] = imagedata.data[1];
  myData.normaBGColor[2] = imagedata.data[2];
  
  //
  // 現在のフレームの各情報を取得する
  //
  var d = {};
  d.player0         = checkPlayerAlive(0);
  d.player1         = checkPlayerAlive(1);
  d.player2         = checkPlayerAlive(2);
  d.player3         = checkPlayerAlive(3);
  d.wave            = checkWaveNum();
  d.goldenIkuraIcon = checkGoldenIkuraIcon();
  d.specialNum      = checkSpecialNum();
  d.timeUp          = checkTimeUp();
  d.specialKind     = myData.buffer.specialKind[0];
  d.waveNotice      = myData.buffer.waveNotice[0];
  d.deathNum        = 0;
  d.worksOver       = 0;
  d.waveClear       = 0;
  //console.log(checkCenterCount8());
  
  
  //
  // いまウェーブ中かどうか
  //
  var isWaveNow = (d.wave !== 0 && d.goldenIkuraIcon !== 0);
  unshiftBuffer('isWaveNow', isWaveNow);
  var isStable = false;
  if (isEqualBuffer('isWaveNow', myData.bufferLength)) {
    myData.isWaveNow = isWaveNow;
    isStable = true;
  }
  
  
  
  //
  // ウェーブ中ではないとき
  //
  if (!myData.isWaveNow) {
    // 初期化
    initWaveData();
    // Wave開始予告が出ていないか確認する
    d.waveNotice = checkWaveNotice();
  }
  
  
  
  // スペシャルが特定できていないなら特定する
  if (myData.specialKind === 0) {
    d.specialKind = checkSpecialKind();
  }
  
  
  //
  // デス数の判定
  //
  var deathNum = 0;
  if (myData.player0 === 4) deathNum++;
  if (myData.player1 === 4) deathNum++;
  if (myData.player2 === 4) deathNum++;
  if (myData.player3 === 4) deathNum++;
  myData.deathNum = deathNum;
  
  
  
  //
  // ゲームオーバーの判定
  //
  // ひとり以上デスしているor残り時間が2秒を切ったときに判定する
  if (deathNum > 0 || myData.leftTime < 1) {
    d.worksOver = checkWorksOver();
  }
  
  
  
  //
  // Waveクリアの判定
  //
  if (myData.isWaveNow) {
    // 残り時間ゼロ
    if (d.timeUp === 1 && d.worksOver === 0) {
      d.waveClear = 1;
    }
  }
  
  
  
  // dをバッファに放り込んで
  // 同じdが連続していることを確認したら
  // dでmyDataを更新をするよ
  if (myData.isWaveNow) {
    myData.bufferAutoKeys.map(key => {
        unshiftBuffer(key, d[key]);
        if (isEqualBuffer(key)) {
          myData[key] = d[key];
        }
    });
  } else {
    ['waveNotice'].map(key => {
        unshiftBuffer(key, d[key]);
        if (isEqualBuffer(key)) {
          myData[key] = d[key];
        }
    });
  }
  
  //
  // 安定状態ならば
  //
  if (myData.isWaveNow) {
    //
    // 納品数
    //
    d.nouhinNum = checkNouhinNum();
    //console.log(myData.buffer.nouhinNum);
    if (myData.nouhinNum === 0) {
      // 現在myDataにゼロが入っているならば
      // とりあえずdをバッファに放り込んで
      // dがある程度連続しているならdをmyDataに入れる
      unshiftBuffer('nouhinNum', d.nouhinNum);
      if (isEqualBuffer('nouhinNum')) {
        myData.nouhinNum = d.nouhinNum;
      }
    } else {
      // 前回バッファとの差が-1～+9以内ならdをバッファに放り込む
      // →前回バッファとの差が-1～+1以内ならそれでmyDataを更新する
      // →前回バッファとの差が+2～ならmyDataの更新は保留、落ち着いたときに更新しよう
      // 前回バッファとの差が～-2、+10～ならバッファにすら入れない（認識エラーとみなす）
      var dif = d.nouhinNum - myData.buffer.nouhinNum[0];
      if (-1 <= dif && dif <= 9) {
        unshiftBuffer('nouhinNum', d.nouhinNum);
        if (-1 <= dif && dif <= 1) {
          //console.log(myData.buffer.nouhinNum[1] + ' -> ' + d.nouhinNum);
          myData.nouhinNum = d.nouhinNum;
        }
      }
    }
    //
    // ノルマ
    //
    // ノルマの更新はmyDataにゼロが入っているときだけでいい
    if (myData.normaNum === 0) {
      d.normaNum = checkNormaNum();
      unshiftBuffer('normaNum', d.normaNum);
      if (isEqualBuffer('normaNum', myData.bufferLength)) {
        myData.normaNum = myData.buffer.normaNum[0];
      }
    }
  }
  
  
  //
  // 納品数のリセットを行う
  //
  if (myData.leftTime >= 100) {
    myData.nouhinNum = 0;
    myData.buffer.nouhinNum[0] = 0;
  }
  
  
  
  //
  // Wave開始予告が出た瞬間に一度だけ処理を行う
  //
  if (!myData.centerCount8Flag && myData.waveNotice !== 0 &&
      myData.prev.waveNotice === 0) {
    
    initWaveData();
    
    myData.centerCount8Flag = true;
    myData.buffer.centerCount8 = [];
    updateCenterCount8();
    
    setTimeout(() => {
      myData.centerCount8Flag = false;
      clearTimeout(window.updateCenterCount8Timer);
      //console.log(myData.buffer.centerCount8);
      var minDif = getMinimam(myData.buffer.centerCount8, 'value');
      var flag = false;
      for (var i = 10; i < myData.buffer.centerCount8.length; i++) {
        var d = myData.buffer.centerCount8[i].value - minDif.value;
        if (myData.buffer.centerCount8[i].value < myData.buffer.centerCount8[i - 1].value * 0.2) {
          minDif = myData.buffer.centerCount8[i];
          flag = true;
          break;
        }
      }
      if (!flag) {
        for (var i = 0; i < myData.buffer.centerCount8.length; i++) {
          var d = myData.buffer.centerCount8[i].value - minDif.value;
          if (d < minDif.value * 0.2) {
            minDif = myData.buffer.centerCount8[i];
            break;
          }
        }
      }
      var dif = (new Date().getTime() - minDif.time) % Math.floor(window.updateDelay);
      myData.centerCount8Time = minDif.time;
      myData.centerCount8Delay = dif;
    }, window.updateCenterCount8Limit);
  }
  
  
  
  //
  // 残り時間
  //
  if (myData.centerCount8Time !== 0) {
    var dif = new Date().getTime() - myData.centerCount8Time;
    var leftTime = 108000 - dif - myData.leftTimeSlip;
    myData.leftTime = Math.round(
      window.updateRate * leftTime / 1000) / window.updateRate;
    if (myData.leftTime <= -5) {
      myData.centerCount8Time = 0;
    }
  }
  
  
  
  //
  // 効果音
  //
  if (myData.isWaveNow) {
    var sound = '';
    if (myData.leftTime === 100) {
      sound = 'wave-start';
    }
    if (myData.nouhinNum >= myData.normaNum &&
        0 <= myData.leftTime && myData.leftTime < 100 && myData.normaNum > 0) {
      sound = 'norma-ok';
    }
    if (myData.waveClear === 1) {
      if (myData.wave === 1) {
        sound = 'wave-1-clear';
      } else if (myData.wave === 2) {
        sound = 'wave-1-clear';
      } else if (myData.wave === 3) {
        sound = 'wave-3-clear';
      }
    }
    if (myData.worksOver === 1) {
      sound = 'works-over';
    }
    if (sound !== '') {
      if (myData.isPlayed[sound] !== true) {
        myData.isPlayed[sound] = true;
        window.sound.voice(sound);
      }
    }
    
    if (isWaveNow && myData.leftTime >= 0 && myData.waveClear !== 1) {
      if (myData.deathNum === 1 && myData.prev.deathNum < 1) {
        window.sound.voice('death-num-1');
      } else if (myData.deathNum === 2 && myData.prev.deathNum < 2) {
        window.sound.voice('death-num-2');
      } else if (myData.deathNum === 3 && myData.prev.deathNum < 3) {
        window.sound.voice('death-num-3');
      }
    }
  }
  
  
  
  //
  // デバッグモード
  //
  if (window.debugMode > 0) {
    var flag = !myData.isWaveNow;
    if (window.debugMode === 2) flag = false;
    setText('#is-wave-now',  myData.isWaveNow ? 'yes' : 'no');
    //setText('#is-stable',    isStable ? 'yes' : 'no');
    setText('#state-ika-0',  LANG.PLAYER[myData.player0], flag);
    setText('#state-ika-1',  LANG.PLAYER[myData.player1], flag);
    setText('#state-ika-2',  LANG.PLAYER[myData.player2], flag);
    setText('#state-ika-3',  LANG.PLAYER[myData.player3], flag);
    setText('#wave-num',     myData.wave, flag);
    setText('#special-kind', LANG.SPECIAL[myData.specialKind], flag);
    //setText('#wave-notice-num', myData.waveNotice);
    //setText('#golden-ikura-icon', myData.goldenIkuraIcon);
    setText('#special-num', myData.specialNum, flag);
    setText('#left-time',   myData.leftTime.toFixed(1), flag);
    setText('#norma-num',   myData.normaNum, flag);
    setText('#nouhin-num',  myData.nouhinNum, flag);
    setText('#wave-clear',  LANG.WORKS_OVER[myData.waveClear], flag);
    setText('#works-over',  LANG.WORKS_OVER[myData.worksOver], flag);
    function setText(slc, val, flag) {
      if (flag) val = '-';
      document.querySelector(slc).textContent = val;
    }
    
    //window.canvas.ctx.putImageData(window.debugImageData, 0, 0);
    //window.canvas.ctx.globalCompositeOperation = 'source-in';
    //window.canvas.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  
  //
  // myDataのバックアップ
  //
  myData.bufferKeys.map(key => {
    myData.prev[key] = myData[key];
  });
  myData.prev.leftTime  = myData.leftTime;
  myData.prev.deathNum  = myData.deathNum;
}

/* 
 * initWaveData()
 */
function initWaveData() {
  if (myData.normaNum === 0) return;
  console.log('init wave data');
  init('waveNotice');
  init('worksOver');
  init('specialKind');
  init('normaNum');
  init('nouhinNum');
  myData.leftTime = 0;
  myData.centerCount8Time = 0;
  myData.soundKeys.map(key => {
    myData.isPlayed[key] = false;
  });
  function init(key) {
    myData[key] = 0;
    myData.prev[key] = 0;
    for (var i = 0; i < myData.buffer[key].length; i++) {
      myData.buffer[key][i] = 0;
    }
  }
}

/* 
 * updateCenterCount8()
 * <canvas>をアップデートする その2
** 残り時間を簡便に計算するために
** Wave開始前の画面中央のカウントの
** 「8」のタイミングだけ特定したいと思う
 */
window.updateCenterCount8Timer = null;
window.updateCenterCount8Rate  = 15;
window.updateCenterCount8Delay = 1000 / window.updateCenterCount8Rate;
window.updateCenterCount8Limit = 3000;
function updateCenterCount8() {
  
  // 前回timeoutのキャンセルと次回timeoutの予約
  clearTimeout(window.updateCenterCount8Timer);
  window.updateCenterCount8Timer =
    setTimeout(updateCenterCount8, window.updateCenterCount8Delay);
  
  // 描画
  var rect = POS.CENTER_COUNT_8;
  window.canvas.ctx.globalCompositeOperation = 'source-over';
  //window.canvas.ctx.drawImage(window.syncVideo,
  //  546, 274, 182, 176, rect.x, rect.y, rect.w, rect.h);
  window.canvas.ctx.drawImage(window.syncVideo,
    420, 160, 440, 440, 210, 80, 220, 220);
  
  // value: どれだけ8っぽくないか（この値が小さいほど8っぽい）
  // time : そのときの時刻
  // というオブジェクトを作ってバッファに突っ込む
  var centerCount8 = checkCenterCount8();
  var data = {
    value: centerCount8,
    time: new Date().getTime()
  };
  myData.buffer.centerCount8.push(data);
}

/* 
 * debugImageData(imagedata)
 * imagedataを画面に出力する
 */
function debugImageData(imagedata) {
  if (true) {
  
    // debugCanvasにputする
    window.debugCanvas.width = imagedata.width;
    window.debugCanvas.height = imagedata.height;
    window.debugCanvas.ctx.putImageData(imagedata, 0, 0);
    
    // <img id="debug-img">のsrcを更新する
    document.querySelector('#debug-img').src =
      window.debugCanvas.toDataURL();
  }
}

/* 
 * checkTimeUp()
 */
function checkTimeUp(x, y) {
  var x = POS.LEFT_TIME_BIG.dx;
  var y = POS.LEFT_TIME_BIG.dy;
  var w = BW.LEFT_TIME[0].width;
  var h = BW.LEFT_TIME[0].height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, k, r = -1, g, b, bw, difs = [
    {label: 1, sum: 0},
    {label: 0, sum: 0},
  ];
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      BW.LEFT_TIME.map((bwObj, j) =>  {
        bw = bwObj.data[i];
        if (bw > 0) {
          k = i << 2;
          if (r < 0) {
            r = imagedata.data[k + 0];
            g = imagedata.data[k + 1];
            b = imagedata.data[k + 2];
          }
          if (bw === 1) {
            difs[j].sum += Math.max(0, -80 + 
              Math.abs(COLOR.LEFT_TIME[0] - r) + 
              Math.abs(COLOR.LEFT_TIME[1] - g) + 
              Math.abs(COLOR.LEFT_TIME[2] - b)
            );
          } else if (bw === 2) {
            difs[j].sum += Math.max(0, -80 + 
              Math.abs(myData.normaBGColor[0] - r) + 
              Math.abs(myData.normaBGColor[1] - g) + 
              Math.abs(myData.normaBGColor[2] - b)
            ) << 1;
          }
        }
      });
      i++;
      r = -1;
    }
  }
  var minDif = getMinimam(difs, 'sum');
  if (minDif.sum < BORDER.LEFT_TIME) {
    return minDif.label;
  } else {
    return 0;
  }
}

/* 
 * checkNouhinNum()
 */
function checkNouhinNum() {
  
  // 1桁目をチェックする
  var x = POS.NOUHIN_DIGIT_1.x;
  var y = POS.NOUHIN_DIGIT_1.y;
  var n1 = checkNouhinNumOne(x, y, 1);
  
  // -1が返ってきたら終了
  if (n1 < 0) return 0;
  
  // 納品数は右詰めで表示されているので
  // 2桁目の表示位置は1桁目の数によって変わってくる
  // その調整をしなければいけない
  var m = NOUHIN_NUM_MARGIN[n1];
  
  // 2桁目をチェックする
  x = POS.NOUHIN_DIGIT_2.x;
  y = POS.NOUHIN_DIGIT_2.y;
  var n2 = checkNouhinNumOne(x + m, y, 0);
  
  if (n2 < 0) return n1;
  return n2 * 10 + n1;
}

/* 
 * checkNouhinNumOne()
 */
function checkNouhinNumOne(_x, _y, n) {
  var w = BW.NORMA_NUM[0].width;
  var h = BW.NORMA_NUM[0].height;
  var imagedata = window.canvas.ctx.getImageData(_x, _y, w, h);
  var x, y, i, k, r = -1, g, b, d, bw, difs = [];
  for (i = 0; i < 10; i++) {
    difs.push({index: i, sum: 0});
  }
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      BW.NORMA_NUM.map((bwObj, j) =>  {
        bw = bwObj.data[i];
        if (bw > 0) {
          k = i << 2;
          if (r < 0) {
            r = imagedata.data[k + 0];
            g = imagedata.data[k + 1];
            b = imagedata.data[k + 2];
          }
          if (bw === 1) {
            d = 
              Math.abs(COLOR.NORMA_NUM[0] - r) + 
              Math.abs(COLOR.NORMA_NUM[1] - g) + 
              Math.abs(COLOR.NORMA_NUM[2] - b);
            if (d < 110) d = 0;
            difs[j].sum += d;
          } else if (bw === 2) {
            d = 
              Math.abs(myData.normaBGColor[0] - r) + 
              Math.abs(myData.normaBGColor[1] - g) + 
              Math.abs(myData.normaBGColor[2] - b);
            if (d < 110) d = 0;
            difs[j].sum += d;
          }
        }
      });
      i++;
      r = -1;
    }
  }
  var minDif = getMinimam(difs, 'sum');
  if (window.debugMode >= 2) {
    window.nouhinCanvases[n].ctx.putImageData(myData.debugNouhinImageData, 0, 0);
    window.nouhinCanvases[n].ctx.globalCompositeOperation = 'source-atop';
    for (var i = 0; i < 11; i++) {
      window.nouhinCanvases[n].ctx.drawImage(window.canvas, _x, _y, w, h, w * i, 0, w, h);
    }
    if (n === 1) {
      //console.log(difs);
    } else {
      //console.log(difs);
    }
  }
  if (minDif.sum < BORDER.NOUHIN_NUM) {
    return minDif.index;
  } else {
    return -1;
  }
}

/* 
 * checkNormaNum()
 */
function checkNormaNum() {
  
  // 2桁目をチェックする
  var x = POS.NORMA_DIGIT_2.x;
  var y = POS.NORMA_DIGIT_2.y;
  var n2 = checkNormaNumOne(x, y);
  
  // -1が返ってきたら終了
  if (n2 < 0) return 0;
  
  // ノルマは左詰めで表示されているので
  // 1桁目の表示位置は2桁目の数によって変わってくる
  // その調整をしなければいけない
  var m = NOUHIN_NUM_MARGIN[n2];
  
  // 1桁目をチェックする
  x = POS.NORMA_DIGIT_1.x;
  y = POS.NORMA_DIGIT_1.y;
  var n1 = checkNormaNumOne(x - m, y);
  
  if (n1 < 0) return n2;
  return n2 * 10 + n1;
}

/* 
 * checkNormaNumOne()
 */
function checkNormaNumOne(x, y) {
  var w = BW.NORMA_NUM[0].width;
  var h = BW.NORMA_NUM[0].height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, i2, w2, m, k, r = -1, g, b, d, bw, difs = [];
  for (i = 0; i < 10; i++) {
    difs.push({index: i, sum: 0});
  }
  // 数値ごとに…
  BW.NORMA_NUM.map((bwObj, j) =>  {
    // 余白を取得、横幅から差っ引く
    // ※数値のBWが右詰め（納品数用）で作成されているため
    m = NOUHIN_NUM_MARGIN[j];
    w2 = w - m;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w2; x++) {
        i  =      x  + (y * w);
        i2 = (m + x) + (y * w);
        bw = bwObj.data[i2];
        if (bw > 0) {
          k = i << 2;
          if (r < 0) {
            r = imagedata.data[k + 0];
            g = imagedata.data[k + 1];
            b = imagedata.data[k + 2];
          }
          if (bw === 1) {
            d = 
              Math.abs(COLOR.NORMA_NUM[0] - r) + 
              Math.abs(COLOR.NORMA_NUM[1] - g) + 
              Math.abs(COLOR.NORMA_NUM[2] - b);
            if (d < 110) d = 0;
            difs[j].sum += d;
          } else if (bw === 2) {
            d = 
              Math.abs(myData.normaBGColor[0] - r) + 
              Math.abs(myData.normaBGColor[1] - g) + 
              Math.abs(myData.normaBGColor[2] - b);
            if (d < 110) d = 0;
            difs[j].sum += d;
          }
        }
        r = -1;
      }
    }
  });
  var minDif = getMinimam(difs, 'sum');
  if (minDif.sum < BORDER.NOUHIN_NUM) {
    return minDif.index;
  } else {
    return -1;
  }
}

/* 
 * checkWaveNotice()
 */
function checkWaveNotice() {
  var x = POS.WAVE_NOTICE.x;
  var y = POS.WAVE_NOTICE.y;
  var w = BW.WAVE_NOTICE[2].width;
  var h = BW.WAVE_NOTICE[2].height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, k, r = -1, g, b, d, bw, bwObj, difs = [
    {wave: 3, sum: 0},
    {wave: 4, sum: 0}
  ];
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      [2, 3].map(j =>  {
        bwObj = BW.WAVE_NOTICE[j];
        bw = bwObj.data[i];
        if (bw === 1) {
          k = i << 2;
          if (r < 0) {
            r = imagedata.data[k + 0];
            g = imagedata.data[k + 1];
            b = imagedata.data[k + 2];
          }
          d = 
            Math.abs(COLOR.WAVE_NOTICE[0] - r) + 
            Math.abs(COLOR.WAVE_NOTICE[1] - g) + 
            Math.abs(COLOR.WAVE_NOTICE[2] - b);
          if (d < 60) d = 0;
          difs[j - 2].sum += d;
        }
      });
      i++;
      r = -1;
    }
  }
  var minDif = getMinimam(difs, 'sum');
  //debugImageData(imagedata);
  if (minDif.sum < BORDER.WAVE_NOTICE) {
    if (minDif.wave === 3) {
      logger.log('wave notice: 3, dif: ' + minDif.sum);
      return 3;
    } else if (minDif.wave === 4) {
      logger.log('wave notice: 1 or 2, dif: ' + minDif.sum);
      x = POS.WAVE_NOTICE_NUM.x;
      y = POS.WAVE_NOTICE_NUM.y;
      w = BW.WAVE_NOTICE[0].width;
      h = BW.WAVE_NOTICE[0].height;
      imagedata = window.canvas.ctx.getImageData(x, y, w, h);
      difs = [
        {wave: 1, sum: 0},
        {wave: 2, sum: 0}
      ];
      for (i = 0, y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
          [0, 1].map(j =>  {
            bwObj = BW.WAVE_NOTICE[j];
            bw = bwObj.data[i];
            if (bw === 1) {
              k = i << 2;
              if (r < 0) {
                r = imagedata.data[k + 0];
                g = imagedata.data[k + 1];
                b = imagedata.data[k + 2];
              }
              difs[j].sum += 
                Math.abs(COLOR.WAVE_NOTICE[0] - r) + 
                Math.abs(COLOR.WAVE_NOTICE[1] - g) + 
                Math.abs(COLOR.WAVE_NOTICE[2] - b);
            }
          });
          i++;
          r = -1;
        }
      }
      difs[0].sum = difs[0].sum << 1;
      minDif = getMinimam(difs, 'sum');
      logger.log('wave notice: ' + minDif.wave + ', dif: ' + minDif.sum);
      return minDif.wave;
    }
  } else {
    logger.log('wave notice: null, dif: ' + minDif.sum);
    return 0;
  }
}

/* 
 * checkWaveNum()
 */
function checkWaveNum() {
  var x = POS.WAVE_NUM.x;
  var y = POS.WAVE_NUM.y;
  var w = BW.WAVE_NUM[0].width;
  var h = BW.WAVE_NUM[0].height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, k, r = -1, g, b, d, bw, difs = [];
  for (i = 0; i < 3; i++) {
    difs.push({wave: i+1, sum: 0});
  }
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      BW.WAVE_NUM.map((bwObj, j) =>  {
        bw = bwObj.data[i];
        if (bw === 1) {
          k = i << 2;
          if (r < 0) {
            r = imagedata.data[k + 0];
            g = imagedata.data[k + 1];
            b = imagedata.data[k + 2];
          }
          d = 
            Math.abs(255 - r) + 
            Math.abs(255 - g) + 
            Math.abs(255 - b);
          if (d < 60) d = 0;
          difs[j].sum += d;
        }
      });
      i++;
      r = -1;
    }
  }
  //debugImageData(imagedata);
  var minDif = getMinimam(difs, 'sum');
  if (minDif.sum < BORDER.WAVE_NUM) {
    logger.log('wave: ' + minDif.wave + ', dif: ' + minDif.sum);
    return minDif.wave;
  } else {
    logger.log('wave: null, dif: ' + minDif.sum);
    return 0;
  }
}

/* 
 * checkWorksOver()
 */
function checkWorksOver() {
  var x = POS.WORKS_OVER.x;
  var y = POS.WORKS_OVER.y;
  var w = BW.WORKS_OVER.width;
  var h = BW.WORKS_OVER.height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, k, r, g, b, bw, dif = 0;
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      bw = BW.WORKS_OVER.data[i];
      if (bw >= 1) {
        k = i << 2;
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        if (bw === 1) {
          dif += Math.max(0, -60 + 
            Math.abs(COLOR.WORKS_OVER_BG[0] - r) + 
            Math.abs(COLOR.WORKS_OVER_BG[1] - g) + 
            Math.abs(COLOR.WORKS_OVER_BG[2] - b)
          );
        } else {
          dif += Math.max(0, -60 + 
            Math.abs(COLOR.WORKS_OVER_TEXT[0] - r) + 
            Math.abs(COLOR.WORKS_OVER_TEXT[1] - g) + 
            Math.abs(COLOR.WORKS_OVER_TEXT[2] - b)
          );
        }
      }
      i++;
    }
  }
  //debugImageData(imagedata);
  if (dif < BORDER.WORKS_OVER) {
    logger.log('works over, dif: ' + dif);
    return 1;
  } else {
    logger.log('during play, dif: ' + dif);
    return 0;
  }
}

/* 
 * checkGoldenIkuraIcon()
 */
function checkGoldenIkuraIcon() {
  var x = POS.GOLDEN_IKURA.x;
  var y = POS.GOLDEN_IKURA.y;
  var w = BW.GOLDEN_IKURA.width;
  var h = BW.GOLDEN_IKURA.height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, k, r, g, b, d, bw, dif = 0;
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      bw = BW.GOLDEN_IKURA.data[i];
      if (bw === 1) {
        k = i << 2;
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        d = 
          Math.abs(COLOR.GOLDEN_IKURA[0] - r) + 
          Math.abs(COLOR.GOLDEN_IKURA[1] - g) + 
          Math.abs(COLOR.GOLDEN_IKURA[2] - b);
        if (d < 60) d = 0;
        dif += d;
      }
      i++;
    }
  }
  //debugImageData(imagedata);
  if (dif < BORDER.GOLDEN_IKURA) {
    logger.log('golden ikura icon: exist, dif: ' + dif);
    return 1;
  } else {
    logger.log('golden ikura icon: not exist, dif: ' + dif);
    return 0;
  }
}

/* 
 * checkPlayerAlive(video)
 */
function checkPlayerAlive(index) {
  var x = POS.IKA_ICON[index].x;
  var y = POS.IKA_ICON[index].y;
  var w = BW.IKA_ICON.width;
  var h = BW.IKA_ICON.height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, k, r, g, b, d, bw, dif = 0, difs = [
    {index: 1, sum: 0},
    {index: 2, sum: 0},
    {index: 3, sum: 0},
    {index: 4, sum: 0},
  ];
  for (i = 0, y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      bw = BW.IKA_ICON.data[i];
      if (bw === 1) {
        k = i << 2;
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        COLOR.IKA.map((rgb, j) => {
          d = 
            Math.abs(rgb[0] - r) + 
            Math.abs(rgb[1] - g) + 
            Math.abs(rgb[2] - b);
          if (d < 60) d = 0;
          difs[j].sum += d;
        });
      }
      i++;
    }
  }
  var minDif = getMinimam(difs, 'sum');
  if (minDif.sum > BORDER.PLAYER) {
    logger.log('player ' + index + ': null, dif: ' + minDif.sum);
    return 0;
  } else if (minDif.index !== 4) {
    logger.log('player ' + index + ': alive, dif: ' + minDif.sum);
    return minDif.index;
  } else {
      logger.log('player ' + index + ': death or DC, dif: ' + minDif.sum);
    for (i = 0, y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        bw = BW.IKA_ICON_X.data[i];
        if (bw === 1) {
          r = imagedata.data[i << 2];
          dif += Math.abs(40 - r);
        }
        i++;
      }
    }
    if (dif < BORDER.PLAYER_DC) {
      logger.log('player ' + index + ': DC, dif: ' + dif);
      return 5; // DC
    } else {
      logger.log('player ' + index + ': Death, dif: ' + dif);
      return 4; // Death
    }
  }
}

/* 
 * checkSpecialKind()
 */
function checkSpecialKind() {
  var x = POS.SPECIAL_ICON.x;
  var y = POS.SPECIAL_ICON.y;
  var w = BW.SPECIAL_ICON[0].width;
  var h = BW.SPECIAL_ICON[0].height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, wh = w * h, k, r = -1, g, b, d, bw, difs = [
    {index: 1, sum: 0},
    {index: 2, sum: 0},
    {index: 3, sum: 0},
    {index: 4, sum: 0}
  ];
  for (i = 0; i < wh; i++) {
    BW.SPECIAL_ICON.map((bwObj, j) =>  {
      bw = bwObj.data[i];
      if (bw === 1) {
        k = i << 2;
        if (r < 0) {
          r = imagedata.data[k + 0];
          g = imagedata.data[k + 1];
          b = imagedata.data[k + 2];
        }
        d = 
          Math.abs(COLOR.SPECIAL_BG[0] - r) + 
          Math.abs(COLOR.SPECIAL_BG[1] - g) + 
          Math.abs(COLOR.SPECIAL_BG[2] - b);
        if (d < 60) d = 0;
        difs[j].sum += d;
      }
    });
    r = -1;
  }
  difs[3].sum = difs[3].sum >> 1;
  var minDif = getMinimam(difs, 'sum');
  logger.log('special kind: ' + minDif.index + ', dif: ' + minDif.sum);
  return minDif.index;
}

/* 
 * checkSpecialNum()
 */
function checkSpecialNum() {
  var n = checkSpecialNumOne(0);
  if (n) {
    n += checkSpecialNumOne(1);
  }
  return n;
}

/* 
 * checkSpecialNumOne(index)
 */
function checkSpecialNumOne(index) {
  var x = POS.SPECIAL_POUCH[index].x;
  var y = POS.SPECIAL_POUCH[index].y;
  var w = BW.SPECIAL_POUCH.width;
  var h = BW.SPECIAL_POUCH.height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, wh = w * h, k, r, g, b, d, bw, dif = 0;
  for (i = 0; i < wh; i++) {
    bw = BW.SPECIAL_POUCH.data[i];
    if (bw === 1) {
      k = i << 2;
      r = imagedata.data[k + 0];
      g = imagedata.data[k + 1];
      b = imagedata.data[k + 2];
      d = 
        Math.abs(COLOR.SPECIAL_POUCH[0] - r) + 
        Math.abs(COLOR.SPECIAL_POUCH[1] - g) + 
        Math.abs(COLOR.SPECIAL_POUCH[2] - b);
      if (d < 60) d = 0;
      dif += d;
    }
  }
  if (dif > BORDER.SPECIAL_POUCH) {
    logger.log('special ' + index + ': 0, dif: ' + dif);
    return 0;
  } else {
    logger.log('special ' + index + ': 1, dif: ' + dif);
    return 1;
  }
}

/* 
 * checkCenterCount8()
 */
function checkCenterCount8() {
  var x = POS.CENTER_COUNT_8.x;
  var y = POS.CENTER_COUNT_8.y;
  var w = BW.CENTER_COUNT_8.width;
  var h = BW.CENTER_COUNT_8.height;
  var imagedata = window.canvas.ctx.getImageData(x, y, w, h);
  var i, wh = w * h, k, r, g, b, d, bw, dif = 0;
  for (i = 0; i < wh; i++) {
    bw = BW.CENTER_COUNT_8.data[i];
    if (bw === 1) {
      k = i << 2;
      r = imagedata.data[k + 0];
      g = imagedata.data[k + 1];
      b = imagedata.data[k + 2];
      //d = 
      //  Math.abs(COLOR.CENTER_COUNT[0] - r) + 
      //  Math.abs(COLOR.CENTER_COUNT[1] - g) + 
      //  Math.abs(COLOR.CENTER_COUNT[2] - b);
      d = Math.abs(COLOR.CENTER_COUNT[1] - g);
      if (d < 20) d = 0;
      dif += d;
    }
  }
  return dif;
}