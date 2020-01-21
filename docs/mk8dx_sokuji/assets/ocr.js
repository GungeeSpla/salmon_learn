'use strict';

/*
 * makeDebugArea(elm)
 */
window.isDebugMode = false;
window.debugArea = null;
function makeDebugArea(elm) {
  if (typeof elm === 'string') elm = document.querySelector(elm);
  debugArea = elm;
  isDebugMode = true;
}

/* 
 * makeTesseract(callback)
 */
window.isEnabledTesseractLog = true;
function makeTesseract(img, callback) {
  if (typeof img === 'string') img = document.querySelector(img);
  var isVisibleCanvas = false;
  window.canvas1 = createCanvas(isVisibleCanvas, 1280, 720);
  window.canvas2 = createCanvas(isVisibleCanvas, 230 * 2, 25 * 2);
  window.canvas3 = createCanvas(isVisibleCanvas, 230 * 2, 25 * 2 * 12);
  window.canvas4 = createCanvas(isVisibleCanvas,  54 * 2, 25 * 2 * 12);
  window.canvas5 = createCanvas(isVisibleCanvas, 100, 100);
  window.canvas6 = createCanvas(isVisibleCanvas, 66, 623);
  return;
}

/* 
 * scanGameScreen(img, callback)
 */
function scanGameScreen(img, callback) {
  console.log('recognizing 1st - 12th player names');
  canvas1.ctx.burnImage(img, 0, 0, canvas1.width, canvas1.height);
  canvas1.debugImage('焼き付け結果');
  var i, j, len, imagedata, scanedNameArray = [];
  for (i = 0; i < 12; i++) {
    canvas2.width = canvas3.width;
    imagedata = parseNameImage(canvas1, canvas2, i, 678, 62+i*52, 230, 25);
    len = imagedata.width * imagedata.height;
    var rs = new Uint8Array(new ArrayBuffer(len));;
    for (j = 0; j < len; j++) {
      rs[j] = imagedata.data[j * 4];
    }
    scanedNameArray.push(rs);
    canvas3.ctx.putImageData(imagedata, 0, i * 25 * 2);
  }
  for (i = 0; i < 12; i++) {
    canvas2.width = canvas4.width;
    imagedata = parseNameImage(canvas1, canvas2, i, 1164, 65+i*52, 54, 25);
    canvas4.ctx.putImageData(imagedata, 0, i * 25 * 2);
  }
  canvas3.debugImage('順位部分');
  var rects = [];
  for (i = 0; i < 12; i++) {
    rects.push({
      top: 50 * i, left: 0, width: 460, height: 50
    });
  }
  if (typeof callback === 'function') callback(scanedNameArray);
  return;
  
  // 順位imgから文字の部分を切り抜いてcanvasに写す
  function parseNameImage(img, canvas, i, sx, sy, sw, sh) {
    var w = canvas.width;
    var h = canvas.height;
    canvas.ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    var imagedata = canvas.ctx.getImageData(0, 0, w, h);
    var f = isYellowZone(w, h);
    var x, y, k, r, g, b, p;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        k = 4 * (x + y * w);
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        if (f) {
          p = 550 - r - g - b; // 黄色との距離
          if (p < 120) r = 255;
          fill(k, r);
        } else {
          p = 765 - r - g - b; // 白との距離
          if (p > 500) r = 255;
          else r = 255 - (r + g + b) / 3;
          fill(k, r);
        }
      }
    }
    return imagedata;
    // kマス目をrgbで塗りつぶす
    function fill(k, rgb) {
      imagedata.data[k + 0] = rgb;
      imagedata.data[k + 1] = rgb;
      imagedata.data[k + 2] = rgb;
    }
    // 黄色いゾーンですか？
    function isYellowZone(w, h) {
      var p = 0;
      for (var y = 0, y = 0; y < h; y++) p += getYellowPoint(x, y, w);
      for (var x = 0, y = 0; x < w; x++) p += getYellowPoint(x, y, w);
      return (p > 100);
    }
    // 黄色っぽさを取得する
    function getYellowPoint(x, y, w) {
      var k = 4 * (x + y * w);
      var r = imagedata.data[k + 0];
      var g = imagedata.data[k + 1];
      var b = imagedata.data[k + 2];
      return (r > 180 && g > 180 && b < 100) ? 1 : 0;
    }
  }
}

/*
 * getTeamRankArray(scanedNameArr)
 */
function getTeamRankArray(scanedNameArr, sampleTeamData) {
  var arr = [];
  // 名前の配列要素それぞれについて
  scanedNameArr.forEach((name, i) => {
    // 見本を一周して似ている順位に並べて候補配列を作る
    // 候補配列は類似度が高い順
    var candidates = [];
    sampleTeamData.forEach(sampleData => {
      var score = getNameSimilarity(name, sampleData.name);
      candidates.push({
        id: sampleData.id,
        team: sampleData.teamName,
        score: score
      });
    });
    candidates.sort(function(a, b) {
      if (a.score > b.score) return -1;
      else return 1;
    });
    arr.push({
      name: name,
      rank: i + 1,
      topId: candidates[0].id,
      topScore: candidates[0].score,
      candidates: candidates,
    });
  });
  //「候補配列内の最高類似度」が高い順に並べる
  arr.sort(function(a, b) {
    if (a.topScore > b.topScore) return -1;
    else return 1;
  });
  // 名前を確定していく
  // 重複が生じないように決定済みの名前をdeterminedNamesで管理する
  var determinedNames = [];
  arr.forEach(obj => {
    for (var i = 0; i < obj.candidates.length; i++) {
      var cnd = obj.candidates[i];
      if (determinedNames.indexOf(cnd.id) < 0) {
        obj.topId = cnd.id;
        obj.topScore = cnd.score;
        obj.team = cnd.team;
        determinedNames.push(cnd.id);
        break;
      }
    };
  });
  // rankの数値が低い順（＝順位が高い順）に並べて
  // チームタグを新規配列に放り込んでいく
  arr.sort(function(a, b) {
    if (a.rank < b.rank) return -1;
    else return 1;
  });
  var teamArr = [];
  arr.forEach(obj => {
    teamArr.push(obj.team);
  });
  return teamArr;

  /*
   * getNameSimilarity(_name, _sampleName)
   */
  function getNameSimilarity(_name, _sampleName) {
    var i = 0, score = 0, len = _name.length;
    for (var i = 0; i < len; i++) {
      score -= Math.abs(_name[i] - _sampleName[i]);
    }
  }
}

/*
 * test()
 */
function test() {
  var sampleTeamData = {
    'NX ぉまえモナー': 'NX',
    'NX*<さぁん': 'NX',
    'AST': 'LAST',
    'ALーア': 'LAST',
    'とっとこーはしるよお': 'とっとこ',
    'とっととーはしれよ!': 'とっとこ',
    'よもきさま': 'さま',
    'けけはらさま': 'さま',
    'つけめんたベたい': 'つけめん',
    'ぁぶらつけめん': 'つけめん',
    'ゃきとりディナー': 'やきとり',
    'ゃきとりは66': 'やきとり'
  };
  var sampleRaceData = [
    'よもきさま',
    'ゃきとりディナー',
    'やきとりは66',
    'AST',
    'NX ぉまえモナー',
    'ぁぶらつけめん',
    'とっととーはしれよ!',
    'けけはらさま',
    'つけめんたベたい',
    'とつとこーはしるよヵ',
    'NXー;た<さぁん',
    'ALーァ'
  ];
  getTeamRankArray(sampleRaceData, sampleTeamData);
}

/* 
 * checkScanable(ssImage, callback)
 */
function checkScanable(ssImage, callback) {
  if (typeof ssImage === 'string') ssImage = document.querySelector(ssImage);
  
  console.log('checking necessity of trimming');
  var canvas = canvas5;
  var w = ssImage.naturalWidth;
  var h = ssImage.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  canvas.ctx.globalAlpha = '1';
  canvas.ctx.globalCompositeOperation = 'source-over';
  canvas.ctx.drawImage(ssImage, 0, 0);
  
  var scale = w / 1280;
  var _rect = {}, rect = {x: 555, y: 50, w: 66, h: 623};
  canvas6.width = rect.w;
  canvas6.height = rect.h;
  Object.keys(rect).forEach(key => {
    _rect[key] = rect[key];
    rect[key] = Math.round(rect[key] * scale);
  });
  
  canvas6.ctx.fillStyle = '#000';
  canvas6.ctx.clearRect(0, 0, _rect.w, _rect.h);
  canvas6.ctx.burnImage(ssImage, rect.x, rect.y, rect.w, rect.h, 0, 0, _rect.w, _rect.h);
  var lineHeight = Math.round(_rect.h / 12);
  var marginBottom = 5;
  var blackHeight = 6;
  var isFindedYellow = false;
  for (var i = 0; i < 12; i++) {
    var imagedata = canvas6.ctx.getImageData(0, i * lineHeight, _rect.w, lineHeight);
    var x, y, k, r, g, b, d, db, dw, p, f = false, w = _rect.w;
    if (!isFindedYellow) {
      k = 4 * (4 + 25 * w);
      r = imagedata.data[k + 0];
      g = imagedata.data[k + 1];
      b = imagedata.data[k + 2];
      p = 100;
      d = 510 - r - g + b;
      if (d < p) {
        f = true;
        isFindedYellow = true;
      }
    }
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        k = 4 * (x + y * w);
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        db = r + g + b;
        dw = 765 - r - g - b;
        if (f) {
          if (db < p) r = g = b = 255;
          else r = g = b = 0;
        } else {
          if (dw < p) r = g = b = 255;
          else if (db < p) r = g = b = 0;
          else r = g = b = 255;
        }
        imagedata.data[k + 0] = r;
        imagedata.data[k + 1] = g;
        imagedata.data[k + 2] = b;
      }
    }
    canvas6.ctx.putImageData(imagedata, 0, i * lineHeight);
  }
  for (var i = 0; i < 12; i++) {
    canvas6.ctx.fillRect(0, i * lineHeight - marginBottom, _rect.w, blackHeight);
  }
  
  var sampleImage = document.querySelector('#rank-image-mono');
  var imagedata1 = canvas6.ctx.getImageData(0, 0, _rect.w, _rect.h);
  canvas6.ctx.drawImage(sampleImage, 0, 0);
  var imagedata2 = canvas6.ctx.getImageData(0, 0, _rect.w, _rect.h);
  var x, y, k, r1, g1, b1, r2, g2, b2, d = 0, w = _rect.w;
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      k = 4 * (x + y * w);
      r1 = imagedata1.data[k + 0];
      g1 = imagedata1.data[k + 1];
      b1 = imagedata1.data[k + 2];
      r2 = imagedata2.data[k + 0];
      g2 = imagedata2.data[k + 1];
      b2 = imagedata2.data[k + 2];
      if (r1 === r2 && g1 === g2 && b1 === b2) {
      } else {
        d++;
      }
    }
  }
  var isScanable = (d < 2000);
  if (isScanable) console.log('no need to trim');
  else console.log('please trim');
  return isScanable;
}

/* 
 * trimGameScreen(ssImage, success, error)
 */
function trimGameScreen(ssImage, success, error) {
  var isScanable = checkScanable(ssImage);
  if (isScanable) {
    if (typeof success === 'function') success(ssImage, false);
  } else {
    trimGameScreenByRect(ssImage, success, error);
  }
}


/* 
 * makeZoomImage(img)
 */
function makeZoomImage() {
  window.viewerWrapper = document.querySelector('#image-viewer-wrapper');
  window.viewerClose = document.querySelector('#image-viewer-close');
  window.viewerInner = document.querySelector('#image-viewer-inner');
  window.viewerImage = document.querySelector('#image-viewer-image');
  window.footerNotice = document.querySelector('#footer-notice');
  window.noticeTimer = null;
  viewerClose.addEventListener('click', function(e) {
    viewerWrapper.style.opacity = 0;
    setTimeout(function(){
      viewerWrapper.style.display = 'none';
    }, 300);
  });
}

/*
 * setEventZoomImage(img)
 */
function setEventZoomImage(img) {
  if (typeof img === 'string') img = document.querySelector(img);
  img.style.cursor = 'pointer';
  img.addEventListener('click', function() {
    viewerImage.src = img.src;
    viewerWrapper.style.display = 'block';
    var r1 = img.naturalHeight / img.naturalWidth;
    var r2 = viewerInner.clientHeight / viewerInner.clientWidth;
    if (r1 > r2) {
      viewerImage.style.width = 'auto';
      viewerImage.style.height = '100%';
    } else {
      viewerImage.style.width = '100%';
      viewerImage.style.height = 'auto';
    }
    setTimeout(function(){
      viewerWrapper.style.opacity = 1;
    },1);
  });
}

/*
 * notifyFooter(img)
 */
function notifyFooter(text) {
  var p = document.createElement('p');
  p.textContent = text;
  p.style.transition = 'none';
  p.style.display = 'block';
  footerNotice.innerHTML = '';
  footerNotice.appendChild(p);
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(function(){
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(function(){
      p.style.transition = '';
      p.style.opacity = 0;
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(function(){
        footerNotice.innerHTML = '';
      },600);
    },2000);
  },1);
}

/*
 * setEventPasteImage(elm, img)
 * https://qiita.com/tatesuke/items/00de1c6be89bad2a6a72
 */
function setEventPasteImage(elm, callback) {
  if (typeof elm === 'string')
    elm = document.querySelector(elm);
  
  var defaultText = '<span>paste</span>';
  elm.setAttribute('contenteditable', 'true');
  elm.innerHTML = defaultText;
  
  elm.addEventListener("paste", function(e){
    var self = this;
    if (!e.clipboardData 
      || !e.clipboardData.types
      || (e.clipboardData.types.length != 1)
      || (e.clipboardData.types[0] != "Files")) {
      return true;
    }
    var imageFile = e.clipboardData.items[0].getAsFile();
    var fr = new FileReader();
    fr.onload = function(e) {
      var base64 = e.target.result;
      var img = document.createElement('img');
      img.onload = function(e) {
        img.onload = null;
        if (callback) callback(this, self);
      }
      img.setAttribute('src', base64);
    };
    fr.readAsDataURL(imageFile);
    this.innerHTML = defaultText;
    return false;
  });
  
  elm.addEventListener('input', function(e){
    var self = this;
  	var temp = document.createElement('div');
  	temp.innerHTML = this.innerHTML;
  	var pastedImage = temp.querySelector('img');
  	if (pastedImage) {
      if (callback) callback(pastedImage, self);
  	} else {
  	  notifyFooter('画像データではありません.');
  	}
    this.innerHTML = defaultText;
  })
}


/* 
 * createTitledImage(img, title)
 */
function createTitledImage(img, title) {
  var div = document.createElement('div');
  div.classList.add('titled-image-wrapper');
  var p = document.createElement('p');
  p.textContent = title;
  div.appendChild(img);
  div.appendChild(p);
  return div;
}

/*
 * createCanvas(w, h)
 */
function createCanvas(flag, w, h) {
  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.ctx = canvas.getContext('2d');
  canvas.ctx.clear = function(){
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  canvas.ctx.myDrawImage = function(img){
    canvas.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  canvas.ctx.burnImage = function(img) {
    var args = arguments;
    draw("source-over", 1);
    draw("multiply",    5);
    draw("overlay",     5);
    draw("source-over", 0);
    function draw(mode, len) {
      if (mode !== undefined) canvas.ctx.globalCompositeOperation = mode;
      if (len  === undefined) len = 1;
      for (var i = 0; i < len; i++) {
        canvas.ctx.drawImage.apply(canvas.ctx, args);
      }
    }
  };
  canvas.fill = function(color) {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  };
  canvas.init = function (w, h, img) {
    this.width = w;
    this.height = h;
    this.ctx.globalAlpha = '1';
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clear();
    this.ctx.drawImage(img, 0, 0, w, h);
  };
  canvas.debugImage = function(str, imageData) {
    if (!isDebugMode) return;
    if (imageData) this.ctx.putImageData(imageData, 0, 0);
    var img = document.createElement('img');
    img.onload = function() {
      if (this.naturalWidth / this.naturalHeight < 16 / 9) {
        this.style.height = '100%';
        this.style.width = 'auto';
      }
      setEventZoomImage(this);
      var div = createTitledImage(this, str);
      debugArea.appendChild(div);
    }
    img.src = this.toDataURL();
  };
  if (flag) document.body.appendChild(canvas);
  return canvas;
}

/*
 * createArray(length, value)
 */
function createArray(length, value) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr[i] = value;
  }
  return arr;
}

/*
 * createInt16Array(length)
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Typed_arrays
 */
function createInt16Array(length) {
  var buffer = new ArrayBuffer(length << 1);
  var int16View = new Int16Array(buffer);
  for (var i = 0; i < int16View.length; i++) {
    int16View[i] = 0;
  }
  return int16View;
}

/*
 * getRatio(a, b)
 */
function getRatio(a, b) {
  var isBigA = (a > b);
  var max = 64;
  var big   = isBigA ? a : b;
  var small = isBigA ? b : a;
  return (small * max < big) ? max : big / small;
}

/* 
** trimGameScreenByRect(ssImage, success, error)
** 
*/
function trimGameScreenByRect(ssImage, success, error) {
  if (typeof ssImage === 'string')
    ssImage = document.querySelector(ssImage);
  
  console.log('trimming the game screen');
  var canvas = canvas5;
  var w = ssImage.naturalWidth;
  var h = ssImage.naturalHeight;
  console.info('the image is (w, h) = (' + w + ', ' + h + ')');
  canvas.init(w, h, ssImage);
  
  var recordNum = 2;
  var linePropertiesNum = 2;
  var horizontalStraightLines = getStraightLines('horizontal');
  var verticalStraightLines = getStraightLines('vertical');
  if (isDebugMode) {
    canvas.fill('#000');
    drawStraightLines('horizontal', horizontalStraightLines);
    canvas.debugImage('ピクセルが無変化な直線部を白色化(横)');
    canvas.fill('#000');
    drawStraightLines('vertical', verticalStraightLines);
    canvas.debugImage('ピクセルが無変化な直線部を白色化(縦)');
    canvas.fill('#000');
    drawStraightLines('vertical', verticalStraightLines);
    canvas.debugImage('ピクセルが無変化な直線部を白色化(縦+横)');
  }
  
  var slipValueRate = 15;
  var slipValueW = Math.floor(w * slipValueRate / 100);
  var slipValueH = Math.floor(h * slipValueRate / 100);
  var [doubtfulXs, doubtfulStartXs, doubtfulEndXs] = 
    getDoubtfulPoints('vertical', verticalStraightLines, slipValueW);
  var [doubtfulYs, doubtfulStartYs, doubtfulEndYs] = 
    getDoubtfulPoints('horizontal', horizontalStraightLines, slipValueH);
  if (isDebugMode) {
    drawDoubtfulPoints('vertical', doubtfulStartXs, '#f0f');
    drawDoubtfulPoints('horizontal', doubtfulStartYs, '#f0f');
    drawDoubtfulPoints('vertical', doubtfulEndXs, '#f00');
    drawDoubtfulPoints('horizontal', doubtfulEndYs, '#f00');
    canvas.debugImage('怪しい輪郭部を赤色の直線で表示');
  }
    
  var doubtfulRects = getDoubtfulRects(doubtfulXs, doubtfulYs);
  if (isDebugMode) {
    drawDoubtfulRects(doubtfulRects);
    canvas.debugImage('怪しい矩形を表示（青色）');
  }
  
  var narrowDownNum = 3;
  var narrowDownedRects = narrowDownDoubtfulRects(doubtfulRects);
  if (isDebugMode) {
    drawDoubtfulRects(narrowDownedRects, 'hsl(120, 100%, 70%)');
    canvas.debugImage('怪しい矩形を絞り込む（緑色）');
    console.log(narrowDownedRects);
  }
  
  var widenedRects = widenDoubtfulRects(doubtfulRects, doubtfulStartXs,
    doubtfulEndXs, doubtfulStartYs, doubtfulEndYs);
  var bestRect = widenedRects[0];
    
  if (isDebugMode) {
    canvas.ctx.globalAlpha = '0.8';
    canvas.ctx.fillStyle = '#ff0';
    canvas.ctx.fillRect(bestRect.x, bestRect.y, bestRect.w, bestRect.h);
    canvas.ctx.globalAlpha = '1';
    canvas.debugImage('ゲーム画面と思われる領域（黄色）');
    
    canvas.ctx.drawImage(ssImage, 0, 0, w, h);
    canvas.ctx.globalAlpha = '0.4';
    canvas.ctx.fillStyle = '#ff0';
    canvas.ctx.fillRect(bestRect.x, bestRect.y, bestRect.w, bestRect.h);
    canvas.ctx.globalAlpha = '1';
    canvas.debugImage('元画像に重ねる');
  }
  
  if (bestRect) {
    canvas6.width = 1280;
    canvas6.height = 720;
    canvas6.ctx.drawImage(ssImage, bestRect.x, bestRect.y, bestRect.w, bestRect.h,
      0, 0, 1280, 720);
    console.log('trimed the game screen');
    console.log('the game screen is (x, y, w, h) = (' +
      bestRect.x + ', ' + bestRect.y + ', ' + bestRect.w + ', ' + bestRect.h + ')');
    if (typeof success === 'function') success(canvas6, true);
  } else {
    console.log('sorry, trimming failed');
    if (typeof error === 'function') error();
  }
  return;
  
  /*
   * getStraightLines(direction)
   */
  function getStraightLines(direction) {
    var isVertical = (direction === 'vertical');
    var _w, _h, w = canvas.width, h = canvas.height;
    if (isVertical) { _w = w; _h = h; } else { _w = h; _h = w; }
    var imagedata = canvas.ctx.getImageData(0, 0, w, h);
    var x, y, k, r, g, b;
    var straightLines = createInt16Array(recordNum * _w * linePropertiesNum);
    for (x = 0; x < _w; x++) {
      var _r = -1, _g = -1, _b = -1;
      var whiteStart = 0;
      var whiteLength = 0;
      var maxWhiteStarts = createArray(recordNum, 0);
      var maxWhiteLengths = createArray(recordNum, 0);
      var maxWhiteStart = 0;
      var maxWhiteLength = 0;
      for (y = 0; y < _h; y++) {
        k = (isVertical) ? (x + y * w) * 4 : (y + x * w) * 4;
        r = imagedata.data[k + 0];
        g = imagedata.data[k + 1];
        b = imagedata.data[k + 2];
        if (r === _r && g === _g && b === _b) {
          whiteLength++;
        } else {
          if (whiteLength) update();
          _r = r; _g = g; _b = b;
        }
      }
      update();
      for (var j = 0; j < recordNum; j++) {
        straightLines[0 + (x * recordNum + j) * linePropertiesNum] = maxWhiteStarts[j];
        straightLines[1 + (x * recordNum + j) * linePropertiesNum] = maxWhiteLengths[j];
      }
    }
    return straightLines;
    
    function update() {
      for (var i = 0; i < recordNum; i++) {
        if (whiteLength > maxWhiteLengths[i]) {
          for (var j = i; j + 1 < recordNum; j++) {
            maxWhiteLengths[j + 1] = maxWhiteLengths[j];
            maxWhiteStarts[j + 1] = maxWhiteStarts[j];
          }
          maxWhiteLengths[i] = whiteLength;
          maxWhiteStarts[i] = whiteStart;
          break;
        }
      };
      whiteLength = 0;
      whiteStart = y + 1;
    }
  }
  
  /*
   * drawStraightLines(direction, data)
   */
  function drawStraightLines(direction, data) {
    canvas.ctx.globalCompositeOperation = 'source-over';
    canvas.ctx.fillStyle = '#fff';
    canvas.ctx.globalAlpha = '1';
    var isVertical = (direction === 'vertical');
    var _w, _h, w = canvas.width, h = canvas.height;
    if (isVertical) { _w = w; _h = h; } else { _w = h; _h = w; }
    for (var i = 0; i < _w; i++) {
      for (var j = 0; j < recordNum; j++) {
        var start  = data[0 + (i * recordNum + j) * linePropertiesNum];
        var length = data[1 + (i * recordNum + j) * linePropertiesNum];
        if (j === 0) canvas.ctx.fillStyle = '#fff';
        else canvas.ctx.fillStyle = '#eee';
        if (isVertical) canvas.ctx.fillRect(i, start, 1, length);
        else canvas.ctx.fillRect(start, i, length, 1);
      }
    }
  }
  
  /*
   * getDoubtfulPoints(direction, data, slipValue)
   */
  function getDoubtfulPoints(direction, data, slipValue) {
    var isVertical = (direction === 'vertical');
    var _w, _h, w = canvas.width, h = canvas.height;
    if (isVertical) { _w = w; _h = h; } else { _w = h; _h = w; }
    var doubtfulPoints = [-1]
    var doubtfulStartPoints = [-1];
    var doubtfulEndPoints = [];
    var _length;
    var dataLength = data.length / (linePropertiesNum * recordNum);
    for (var i = 0; i < dataLength; i++) {
      var length = 0;
      for (var j = 0; j < recordNum; j++) {
        length += data[1 + (i * recordNum + j) * linePropertiesNum];
      }
      if (i > 0 && Math.abs(length - _length) > slipValue) {
        var p = {};
        if (length < _length) {
          doubtfulPoints.push(i - 1);
          doubtfulStartPoints.push(i - 1);
        } else {
          doubtfulPoints.push(i);
          doubtfulEndPoints.push(i);
        }
      }
      _length = length;
    }
    doubtfulPoints.push(_w + 1);
    doubtfulEndPoints.push(_w + 1);
    return [doubtfulPoints, doubtfulStartPoints, doubtfulEndPoints];
  }
  
  /*
   * drawDoubtfulPoints(direction, color)
   */
  function drawDoubtfulPoints(direction, points, color) {
    canvas.ctx.globalCompositeOperation = 'source-over';
    canvas.ctx.fillStyle = color;
    canvas.ctx.globalAlpha = '1';
    var isVertical = (direction === 'vertical');
    if (isVertical) {
      _w = w; _h = h;
    } else {
      _w = h; _h = w;
    }
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (isVertical) canvas.ctx.fillRect(p, 0, 1, _w);
      else canvas.ctx.fillRect(0, p, _h, 1);
    }
  }
  
  /*
   * getDoubtfulRects(Xs, Ys)
   */
  function getDoubtfulRects(Xs, Ys) {
    var doubtfulRects = [];
    var minRectWidth = Math.floor(w * 0.05);
    var minRectHeight = Math.floor(h * 0.05);
    for (var i = 0; i + 1 < Xs.length; i++) {
      var x1 = Xs[i + 0] + 1;
      var x2 = Xs[i + 1];
      var rw = x2 - x1;
      if (rw > minRectWidth) {
        for (var j = 0; j + 1 < Ys.length; j++) {
          var y1 = doubtfulYs[j + 0] + 1;
          var y2 = doubtfulYs[j + 1];
          var rh = y2 - y1;
          if (rh > minRectHeight) {
            doubtfulRects.push({
              x: x1, y: y1, w: rw, h: rh, s: rw * rh
            });
          }
        }
      }
    }
    doubtfulRects.sort(function(a, b) {
      if (a.s > b.s) return -1;
      else return 1;
    });
    return doubtfulRects;
  }
  
  /*
   * drawDoubtfulRects(rects)
   */
  function drawDoubtfulRects(rects, color) {
    canvas.ctx.globalCompositeOperation = 'source-over';
    if (color) {
      canvas.ctx.globalAlpha = '0.7';
      canvas.ctx.fillStyle = color;
    } else {
      canvas.ctx.globalAlpha = '0.5';
      canvas.ctx.fillStyle = 'hsl(220, 50%, 50%)';
    
    }
    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      canvas.ctx.fillRect(r.x, r.y, r.w, r.h);
    }
    canvas.ctx.globalAlpha = '1';
  }
  
  /*
   * narrowDownDoubtfulRects(rects)
   */
  function narrowDownDoubtfulRects(rects) {
    narrowDownNum = Math.min(rects.length, narrowDownNum);
    var targetRects = [];
    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i];
      var isUnique = true;
      for (var j = 0; j < targetRects.length; j++) {
        var tRect = targetRects[j];
        var f1 = (tRect.x === rect.x && tRect.w === rect.w);
        var f2 = (tRect.y === rect.y && tRect.h === rect.h);
        if (f1 || f2) {
          isUnique = false;
          break;
        }
      }
      if (isUnique) {
        targetRects.push(rect);
      }
      if (targetRects.length >= narrowDownNum) {
        break;
      }
    }
    return targetRects;
  }
  
  /*
   * widenDoubtfulRects(rects, startXs, endXs, startYs, endYs)
   */
  function widenDoubtfulRects(rects, startXs, endXs, startYs, endYs) {
    var w = canvas.width, h = canvas.height;
    var minRectWidth = Math.floor(w * 0.05);
    var minRectHeight = Math.floor(h * 0.05);
    var newRects = [];
    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i];
      newRects.push(rect);
      widen(true, newRects, rect, startXs, endXs);
      widen(false, newRects, rect, startYs, endYs);
    }
    calc(newRects);
    sort(newRects);
    return newRects;
    
    function sort(rects) {
      rects.sort(function(a, b) {
        if (a.score > b.score) return -1;
        else return 1;
      });
    }
    function calc(rects) {
      var targetRatio = 9 / 16;
      rects.forEach(rect => {
        var ratio = rect.h / rect.w;
        var difRatio = Math.abs(targetRatio - ratio);
        if (ratio < targetRatio) difRatio = difRatio * 2;
        /*
        var vMax = -1;
        for (var x = rect.x, xEnd = rect.x + rect.w; x < xEnd; x++) {
          var _v = vLines[1 + (x * recordNum * linePropertiesNum)];
          if (_v > vMax) vMax = _v;
        }
        var hMax = -1;
        for (var y = rect.y, yEnd = rect.y + rect.h; y < yEnd; y++) {
          var _h = hLines[1 + (y * recordNum * linePropertiesNum)];
          if (_h > hMax) hMax = _h;
        }
        */
        rect.score = (rect.w / w) - (difRatio * 100)
      });
    }
    function widen(doWidenX, rects, originRect, startPoints, endPoints) {
      for (var isp = 0; isp < startPoints.length; isp++) {
        var startPoint = startPoints[isp] + 1;
        for (var iep = 0; iep < endPoints.length; iep++) {
          var endPoint = endPoints[iep];
          var pointRange = endPoint - startPoint;
          var newRect;
          if (doWidenX) {
            newRect = {
              x: startPoint,
              y: originRect.y,
              w: pointRange,
              h: originRect.h,
              s: pointRange * originRect.h
            };
          } else {
            newRect = {
              x: originRect.x,
              y: startPoint,
              w: originRect.w,
              h: pointRange,
              s: pointRange * originRect.w
            };
          }
          if (newRect.w > minRectWidth && newRect.h > minRectHeight &&
              newRect.w > newRect.h && newRect.w < newRect.h * 2) {
            rects.push(newRect);
          }
        }
      }
    }
  }
}
