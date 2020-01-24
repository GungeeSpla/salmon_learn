//window.localStorage.clear();
//window.localStorage.setItem('mk8dx-sokuji', '{"teamNum":6,"raceNum":12,"teamNames":["おかし","たまげた","CCC","DDD","EEE","FFF"],"shortCutKeys":["o","t","c","d","e","f"],"tallyConfig":{"onBeforeUnload":false,"isEnabledComplement":true,"latestScore":true,"latestScoreDif":false,"latestCource":true,"totalScoreDif":true,"leftRaceNum":true,"currentRank":true,"targetDistance":true,"emphasisStr":"【】","emphasisStart":"【","emphasisEnd":"】","splitStr":"／","teamSplitStr":"／","passRank":2}}');
'use strict';
var SCORES = [15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var version = '0.2.0';
var isTouchDevice = ('ontouchstart' in document);
var mousedownEvent = isTouchDevice ? 'touchstart' : 'mousedown';
var mouseChaserStyle = isTouchDevice ? 'none' : 'block';
var browser = (() => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('msie') > -1
     || userAgent.indexOf('trident') > -1) {
    return 'ie';
  } if (userAgent.indexOf('edge') > -1) {
    return 'edge';
  } if (userAgent.indexOf('chrome') > -1) {
    return 'chrome';
  } if (userAgent.indexOf('safari') > -1) {
    return 'safari';
  } if (userAgent.indexOf('firefox') > -1) {
    return 'firefox';
  } if (userAgent.indexOf('opera') > -1) {
    return 'opera';
  }
  return 'other';
})();
var os = (() => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('iphone') > -1) {
    return 'iphone';
  } if (userAgent.indexOf('ipad') > -1) {
    return 'ipad';
  } if (userAgent.indexOf('android') > -1) {
    if (userAgent.indexOf('mobile') > -1) {
      return 'android';
    }
    return 'android';
  } if (userAgent.indexOf('windows') > -1) {
    return 'windows';
  } if (userAgent.indexOf('mac os x') > -1) {
    return 'mac';
  }
  return 'other';
})();
var isPC = (os === 'windows' || os === 'mac');
var playerNum = 12;
var teamTableIndex = 10;
var scKeyIndex = 20;
var rankTableIndex = 30;
var teamMaxNum = 6;
var currentPen = -1;
var mouseChaser;
var penDown = false;
var rightDown = false;
var isCalculating = false;
var isInitialized = false;
var tallyForScoresTimer = 0;
var tallyForScoresDelay = 20;
var inputRankData;
var scanedNameData;
var sampleTeamData = null;
var storageKey = 'mk8dx-sokuji';
var saveTargetVariables = [
  'teamNum', 'raceNum', 'teamNames', 'shortCutKeys', 'tallyConfig', 'inputRankData'
];
var isEnabledSS = isPC;
var teamNum = 2;
var raceNum = 12;
var maxRaceNum = 12;
var maxPlayerNum = 12;
var teamNames = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF'];
var shortCutKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
var tallyConfig = {
  onBeforeUnload: false,     // ページ遷移時警告
  isEnabledComplement: true, // 自動補完
  latestScore: true,     // 最新レースの得点
  latestScoreDif: true,  // 最新レースの点差
  latestCource: true,    // 最新レースのコース
  totalScore: true,      // 合計得点
  totalScoreDif: true,   // 合計得点の点差
  leftRaceNum: true,     // 残りレース数
  currentRank: true,     // 現在の順位
  targetDistance: true,  // 目標順位との距離
  winDetermine: true,    // 勝利確定
  emphasisStr: '【】',   // 強調文字
  emphasisStart: '',     // 
  emphasisEnd: '',       // 
  splitStr: '／',        // 区切り文字
  teamSplitStr: '／',    // チームの区切り文字
  passRank: 2            // 目標順位
};

/* 
 * onload()
 */
window.addEventListener('load', function(){
  logger.log('document loaded');
  logger.log('initializing mk8dx-sokuji');
  
  initInputDataVariable();  // inputData変数
  loadStorage();            // ロード
  
  setEventShowMore('#input-rank-description-show');   // 説明を見るボタン  
  setEventShowMore('#input-rank-description-show-2'); // 説明を見るボタン  
  makeRadioButtons();       // ラジオボタン
  makeInputTeamNameTable(); // チームタグ/ショートカットキー入力
  
  makeInputRankPalette();   // タグパレット
  makeInputRankTable();     // 順位テーブル
  makeMouseChaser();        // マウスチェイサー
  
  makeZoomImage();          // 通知関数や画像ズーム関数
  
  initConfigElements();
  
  document.getElementById('reset-button').onclick = () => {
    var ret = window.confirm('順位テーブルをリセットします。よろしいですか？');
    if (ret) {
      sampleTeamData = null;
      initInputDataVariable();
      updateInputTeamNameTable();
    }
  };
  
  logger.log('initialized mk8dx-sokuji');
  isInitialized = true;
}, false);

/*
 * initConfigElements()
 */
function initConfigElements() {
  [
    {key: 'isEnabledComplement', id: 'cfg-auto-complement'},
    {key: 'latestScore',         id: 'cfg-latest-score'},
    {key: 'latestScoreDif',      id: 'cfg-latest-score-dif'},
    {key: 'totalScore',          id: 'cfg-total-score'},
    {key: 'totalScoreDif',       id: 'cfg-total-score-dif'},
    {key: 'latestCource',        id: 'cfg-latest-course'},
    {key: 'leftRaceNum',         id: 'cfg-left-race-num'},
    {key: 'currentRank',         id: 'cfg-current-rank'},
    {key: 'targetDistance',      id: 'cfg-target-distance'},
    {key: 'winDetermine',        id: 'cfg-win-determine'},
    {key: 'onBeforeUnload',      id: 'cfg-on-before-unload'}
  ].map(obj => {
    var elm = document.getElementById(obj.id);
    if (tallyConfig[obj.key] === true) {
      elm.setAttribute('checked', 'checked');
      if (obj.key === 'onBeforeUnload') {
        window.onbeforeunload = function() {
          return '本当に他のページに移動しますか?';
        };
      }
    }
    elm.addEventListener('change', function(e) {
      tallyConfig[obj.key] = this.checked;
      saveStorage();
      tallyForScores();
      if (this.id === 'cfg-on-before-unload') {
        if (this.checked) {
          window.onbeforeunload = function() {
            return '本当に他のページに移動しますか?';
          };
        } else {
          window.onbeforeunload = null;
        }
      }
    }, false);
  });
  [
    {key: 'passRank',     className: 'cfg-pass-rank'},
    {key: 'teamSplitStr', className: 'cfg-team-split'},
    {key: 'splitStr',     className: 'cfg-split'},
    {key: 'emphasisStr',  className: 'cfg-emphasis'}
  ].map(obj => {
    var elms = document.querySelectorAll('[name=' + obj.className + ']');
    for (var i = 0; i < elms.length; i++) {
      var elm = elms[i];
      if (('' + tallyConfig[obj.key]) === elm.getAttribute('value')) {
        elm.setAttribute('checked', 'checked');
      }
      elm.addEventListener('change', function(e) {
        tallyConfig[obj.key] = this.value;
        tallyConfig.passRank = parseInt(tallyConfig.passRank);
        saveStorage();
        tallyForScores();
      });
    }
  });
  updatePassRank();
  document.getElementById('copy-button').addEventListener(mousedownEvent, function(e) {
    execCopyResult();
  });
}

/*
 * initInputDataVariable()
 */
function initInputDataVariable() {
  inputRankData = [];
  scanedNameData = [];
  for (var i = 0; i < maxRaceNum; i++) {
    inputRankData[i] = [];
    scanedNameData[i] = [];
    for (var j = 0; j < maxPlayerNum; j++) {
      inputRankData[i][j] = '-1';
      scanedNameData[i][j] = null;
    }
  }
}

/*
 * setEventShowMore(slc)
 */
function setEventShowMore(slc) {
  var showButton = document.querySelector(slc);
  var target = showButton.getAttribute('show');
  var targetElement = document.querySelector('#' + target);
  showButton.addEventListener(mousedownEvent, function(e) {
    if (targetElement.style.display !== 'none') {
      targetElement.style.display = 'none';
      this.textContent = this.getAttribute('text1');
    } else {
      targetElement.style.display = 'block';
      this.textContent = this.getAttribute('text2');
    }
  });
  showButton.textContent = showButton.getAttribute('text1');
}

/*
 * makeRadioButtons()
 */
function makeRadioButtons() {
  setEventAll('.race-num-radio', 'raceNum');
  setEventAll('.race-type-radio', 'teamNum');
  return;
  function setEventAll(selector, key) {
    var radios = document.querySelectorAll(selector);
    for (var i = 0; i < radios.length; i++) {
      var radio = radios[i];
      setEventOne(radio, key);
    }
  }
  function setEventOne(radio, key) {
    radio.addEventListener('change', function(e) {
      var value = parseInt(this.value);
      if (window[key] !== value) {
        window[key] = value;
        updateInputTeamNameTable();
      }
    });
    if (window[key] === parseInt(radio.value)) {
      radio.setAttribute('checked', 'checked');
    } 
  }
}

/*
 * updateInputTeamNameTable()
 */
function updateInputTeamNameTable() {
  makeInputTeamNameTable();
  makeInputRankPalette();
  makeInputRankTable();
  updatePassRank();
}

/*
 * updatePassRank()
 */
function updatePassRank() {
  var elms = document.querySelectorAll('.cfg-pass-rank');
  for (var i = 0; i < elms.length; i++) {
    var elm = elms[i];
    if (parseInt(elm.getAttribute('rank')) >= teamNum) {
      elm.style.display = 'none';
    } else {
      elm.style.display = 'inline';
    }
  }
}

/*
 * makeInputTeamNameTable()
 */
function makeInputTeamNameTable() {
  var table  = document.querySelector('#table-team-name');
  table.innerHTML = '';
  var w = teamNum;
  var tr = document.createElement('tr');
  for (var x = 0; x < w; x++) {
    var td = document.createElement('td');
    var label = ['A', 'B', 'C', 'D', 'E', 'F'][x];
    var input = createInput({placeholder: label, value: teamNames[x]});
    input.setAttribute('tabIndex', teamTableIndex + x);
    input.setAttribute('id', 'input-team-name-' + x);
    input.addEventListener('input', makeInputRankPalette, false);
    td.appendChild(input);
    tr.appendChild(td);
  }
  table.appendChild(tr);
  
  var table2 = document.querySelector('#table-sc-key');
  table2.innerHTML = '';
  tr = document.createElement('tr');
  for (x = 0; x < w; x++) {
    var td = document.createElement('td');
    var label = shortCutKeys[x];
    var input = createInput({placeholder: label, value: label, maxlength: '1'});
    input.setAttribute('tabIndex', scKeyIndex + x);
    input.setAttribute('id', 'input-sc-key' + x);
    input.addEventListener('input', updateSCKey, false);
    td.appendChild(input);
    tr.appendChild(td);
  }
  table2.appendChild(tr);
}

function updateSCKey() {
  for (var i = 0; i < teamNum; i++) {
    var inpt = document.getElementById('input-sc-key' + i);
    var val = inpt.value;
    shortCutKeys[i] = val;
  }
  saveStorage();
}

/*
 * makeInputRankPalette()
 */
function makeInputRankPalette() {
  updateTeamNameVariable();
  changeInputedTeamNames();
  regeneratePalette();
  saveStorage();
  return;
  // 変数を更新する
  function updateTeamNameVariable() {
    for (var i = 0; i < teamNum; i++) {
      var inpt = document.getElementById('input-team-name-' + i);
      var val = inpt.value;
      teamNames[i] = val;
    }
  }
  // 入力済みのチーム順位を変更する
  function changeInputedTeamNames() {
    for (var race = 1; race <= raceNum; race++) {
      for (var rank = 1; rank <= playerNum; rank++) {
        var inpt = document.body.querySelector('.rank-' + rank + '.race-' + race);
        if (inpt) {
          var team = parseInt(inpt.getAttribute('team'));
          if (team !== -1) {
            inpt.value = teamNames[team];
          }
        }
      }
    }
  }
  // パレットを更新する
  function regeneratePalette() {
    var area = document.getElementById('input-rank-palette');
    area.innerHTML = '';
    for (var i = -1; i < teamNum + 1; i++) {
      var palette = document.createElement('div');
      var str;
      if (i < 0) {
        str = 'キー入力';
      } else if (i === teamNum) {
        str = '消す';
      } else {
        str = teamNames[i];
      }
      palette.innerHTML = '<p>' + str + '</p>';
      palette.setAttribute('id', 'palette-' + i);
      palette.setAttribute('team-index', i);
      if (i === teamNum) {
        palette.classList.add('team-' + teamMaxNum);
      } else {
        palette.classList.add('team-' + i);
      }
      // パレットクリック時の挙動
      setPaletteClickEvent(palette, i);
      area.appendChild(palette);
    }
    if (!isInitialized) {
      area.querySelector('#palette--1').classList.add('selected');
    }
    
  }
  function setPaletteClickEvent(elm, i) {
    elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
    elm.addEventListener(mousedownEvent, function (e) {
      selectPalette(i);
    }, false);
  }
}

/*
 * selectPalette(i)
 */
function selectPalette(id) {
  var area = document.getElementById('input-rank-palette');
  // 全員のクラスを剥ぐ
  var i, children = area.getElementsByTagName('div');
  for (i = 0; i < children.length; i++)
    children[i].classList.remove('selected');
  // クラスを付与する
  var self = document.getElementById('palette-' + id);
  self.classList.add('selected');
  var idx = parseInt(self.getAttribute('team-index'));
  currentPen = idx;
  if (idx > -1) {
    for (i = 0; i < teamMaxNum + 1; i++) mouseChaser.classList.remove('team-' + i);
    mouseChaser.classList.remove('hidden');
    if (idx === teamNum) {
      mouseChaser.textContent = '　';
      mouseChaser.classList.add('team-' + teamMaxNum);
    } else {
      mouseChaser.textContent = teamNames[idx];
      mouseChaser.classList.add('team-' + idx);
    }
    document.getElementById('input-rank-table').classList.add('pen-mode');
  } else {
    mouseChaser.classList.add('hidden');
    document.getElementById('input-rank-table').classList.remove('pen-mode');
  }
}

/*
 * makeMouseChaser()
 */
function makeMouseChaser() {
  var area = document.getElementById('input-rank-area');
  mouseChaser = document.getElementById('mouse-chaser');
  mouseChaser.classList.add('mouse-chase');
  mouseChaser.classList.add('hidden');
  mouseChaser.textContent = 'NX';
  // マウスムーブ
  area.addEventListener('mousemove', function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var w = mouseChaser.clientWidth;
    var h = mouseChaser.clientHeight;
    x -= w / 2;
    y -= h / 2 + 5;
    var css = 'translate(' + x + 'px, ' + y + 'px)';
    mouseChaser.style.transform = css;
    if (penDown && currentPen > -1) {
      getSelection().removeAllRanges();
    }
    return true;
  }, false);
  area.addEventListener('mouseenter', function (e) {
    mouseChaser.style.display = mouseChaserStyle;
    penDown = false;
    rightDown = false;
  });
  area.addEventListener('mouseleave', function (e) {
    mouseChaser.style.display = 'none';
    penDown = false;
    rightDown = false;
  });
}

/* 
 * makeInputRankTable(raceNum, playerNum)
 */
function makeInputRankTable() {
  var table = document.getElementById('input-rank-table');
  table.innerHTML = '';
  var MARGIN_TOP = 2;
  var MARGIN_LEFT = 1;
  var MARGIN_BOTTOM = isEnabledSS ? 5 : 3;
  var COURSE_LINE = 0;
  var LOCK_LINE = 1;
  var STATE_LINE = 2;
  var PASTE_LINE = 3;
  var PASTED_IMAGE_LINE = 4;
  var w = raceNum + MARGIN_LEFT;
  var h = playerNum + MARGIN_TOP + MARGIN_BOTTOM;
  for (var y = 0; y < h; y++) {
    var tr = document.createElement('tr');
    if (y === playerNum + MARGIN_TOP) tr.classList.add('rank-end-tr');
    for (var x = 0; x < w; x++) {
      if ((y === 0 && x > 1) || (x === 0 && y === 1)) {
      } else {
        var td = document.createElement('td');
        var input, str = '', caseType = '';
        var race = 1 + x - MARGIN_LEFT;
        var rank = 1 + y - MARGIN_TOP;
        var num = (race - 1) * (playerNum + 1) + (rank - 1);
        // 順位部分
        if (x >= MARGIN_LEFT && y >= MARGIN_TOP && y < playerNum + MARGIN_TOP) {
          makeRank(td, rank, race, num);
        } else if (x === 0 && y === 0) {
          td.setAttribute('rowspan', 2);
          str = '順位';
        } else if (x === 1 && y === 0) {
          td.setAttribute('colspan', 12);
          str = 'レース番号';
        } else if (y === 1 && x >= MARGIN_LEFT) {
          str = x;
        } else if (x === 0 && y >= MARGIN_TOP && y < playerNum + MARGIN_TOP) {
          str = y - 1;
        }
        // ロック
        else if (x === 0 && y === playerNum + MARGIN_TOP + LOCK_LINE) {
          str = '　';
        }
        else if (x  >  0 && y === playerNum + MARGIN_TOP + LOCK_LINE) {
          str = '';
          makeLock(td, rank, race, num);
        }
        // OK!かどうか
        else if (x === 0 && y === playerNum + MARGIN_TOP + STATE_LINE) {
        }
        else if (x  >  0 && y === playerNum + MARGIN_TOP + STATE_LINE) {
          makeState(td, rank, race, num);
        }
        // コース
        else if (x === 0 && y === playerNum + MARGIN_TOP + COURSE_LINE) {
          str = 'コース';
        }
        else if (x  >  0 && y === playerNum + MARGIN_TOP + COURSE_LINE) {
          makeCource(td, rank, race, num);
        }
        // スクショ
        else if (x === 0 && y === playerNum + MARGIN_TOP + PASTE_LINE) {
          str = 'スクショ';
        }
        else if (x  >  0 && y === playerNum + MARGIN_TOP + PASTE_LINE) {
          makePaste(td, rank, race, num);
        }
        // ペーストされた画像
        else if (x === 0 && y === playerNum + MARGIN_TOP + PASTED_IMAGE_LINE) {
          str = '　';
          td.classList.add('scanable-state');
        }
        else if (x  >  0 && y === playerNum + MARGIN_TOP + PASTED_IMAGE_LINE) {
          makePastedImage(td, rank, race, num);
        }
        if (str) {
          td.textContent = str;
          td.classList.add('label');
        }
        if (y >= 1) {
          td.classList.add('race-' + race);
          td.setAttribute('race', race);
        }
        tr.appendChild(td);
      }
    }
    table.appendChild(tr);
  }
  $('input.course-cell').MySuggest({
    msArrayList: MK8DX_COURSES
  });
  var rankEndTr = document.querySelector('.rank-end-tr'); 
  var hr = document.createElement('hr');
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  td.setAttribute('colspan', w);
  td.appendChild(hr);
  tr.appendChild(td);
  rankEndTr.parentNode.insertBefore(tr, rankEndTr); 
  for (var i = 1; i <= raceNum; i++) {
    updateRace(i);
  }
  tallyForScores();
  return;
  /*
   * makeState(td, rank, race, num)
   */
  function makeState(td, rank, race, num) {
    setEventDisablePen(td);
    td.classList.add('state-cell');
    td.setAttribute('state-type', 'lack');
    var stateImage = document.createElement('img');
    stateImage.setAttribute('src-complete', 'assets/state-complete.png');
    stateImage.setAttribute('src-error', 'assets/state-error.png');
    stateImage.setAttribute('src-lack', 'assets/transparent.png');
    stateImage.setAttribute('src', stateImage.getAttribute('src-lack'));
    td.appendChild(stateImage);
  }
  /*
   * makeLock(td, rank, race, num)
   */
  function makeLock(td, rank, race, num) {
    setEventDisablePen(td);
    var lockImage = document.createElement('img');
    var src1 = 'assets/lock-1.png';
    var src2 = 'assets/lock-2.png';
    lockImage.src = src1;
    td.appendChild(lockImage);
    td.classList.add('lock-cell');
    td.addEventListener("click", function(e) {
      var race = this.getAttribute('race');
      var all = document.querySelectorAll('.race-' + race);
      for (var i = 0; i < all.length; i++) {
        if (!all[i].classList.contains('locked')) {
          this.querySelector('img').src = src2;
          all[i].classList.add('locked');
        } else { 
          this.querySelector('img').src = src1;
          all[i].classList.remove('locked');
        }
      }
    }, true);
  }
  /*
   * makePaste(td, rank, race, num)
   */
  function makePaste(td, rank, race, num) {
    setEventDisablePen(td);
    input = document.createElement('div');
    input.setAttribute('race', 1+x - 1);
    input.classList.add('paste-input');
    input.classList.add('race-' + race);
    input.setAttribute('placeholder', 'paste');
    setEventPasteImage(input, function(pastedImage, input) {
      logger.log('🏞️image pasted');
      var race = parseInt(input.getAttribute('race'));
      var selector = '.pasted-image-cell.race-' + race + ' img';
      var targetImg = document.querySelector(selector);
      if (isCalculating) {
        notifyFooter('計算中のプロセスがあります。');
        return;
      }
      isCalculating = true;
      document.getElementById('mask-notice').style.setProperty('display', 'block');
      setTimeout(() => {
        // ゲーム画面をトリミングする
        trimGameScreen(pastedImage, (trimedCanvas) => {
          // ゲーム画面をスキャンする
          scanGameScreen(trimedCanvas, (scanedNameArr) => {
            isCalculating = false;
            document.getElementById('mask-notice').style.setProperty('display', 'none');
            // スキャンできた！
            // scanedNameDataに放り込む
            scanedNameData[race - 1] = scanedNameArr;
            // 画像ソースを代入する
            targetImg.style.setProperty('display', 'block');
            targetImg.src = trimedCanvas.toDataURL();
            var imageCell = document.querySelector(`.pasted-image-cell.race-${race}`);
            if (imageCell.classList.contains('specimen')) {
              sampleTeamData = null;
              imageCell.classList.remove('specimen');
            }
            if (existsSampleTeamData()) {
              scanTeamData(race);
            }
          });
        }, () => {
          alert('ゲーム画面の抽出に失敗しました。');
          isCalculating = false;
          document.getElementById('mask-notice').style.setProperty('display', 'none');
        });
      }, 50);
    });
    td.appendChild(input);
  }
  /*
   * makePastedImage(td, rank, race, num)
   */
  function makePastedImage(td, rank, race, num) {
    setEventDisablePen(td);
    td.classList.add('pasted-image-cell');
    var img = document.createElement('img');
    setEventZoomImage(img, race);
    td.appendChild(img);
  }
  /*
   * makeCource(td, rank, race, num)
   */
  function makeCource(td, rank, race, num) {
    setEventDisablePen(td);
    input = createInput({
      className: 'race-' + race + ' ' + 'course-cell',
      id: 'rank-input-' + num,
      race: race,
      placeholder: 'コース',
      tabIndex: rankTableIndex + num,
      'rank-input-id': num,
    });
    input.addEventListener('input', function (e) {
      var selectionEnd = this.selectionEnd;
      logger.log('inputed course [race ' + race + '][' + this.value + ']', 'gray');
      tallyForScores(() => {
        this.focus();
        this.setSelectionRange(selectionEnd, selectionEnd);
      });
    }, false);
    input.addEventListener('change', function (e) {
      setTimeout(() => {
        logger.log('inputed course [race ' + race + '][' + this.value + ']', 'gray');
      },1);
      tallyForScores();
    }, false);
    td.appendChild(input);
  }
  /*
   * makeRank(td, rank, race, num)
   */
  function makeRank(td, rank, race, num) {
    setEventEnablePen(td);
    input = createRankInput(rank, race, num);
    if (inputRankData[race - 1][rank - 1] !== '-1') {
      input.value = teamNames[inputRankData[race - 1][rank - 1]];
      resetRankInputClass(input);
    }
    td.appendChild(input);
    // セルクリック時の挙動
    var onmousedown = function (e) {
      switch (e.type.toLowerCase()) {
      case 'mousedown':
        penDown = true;
        break;
      case 'mousemove':
        if (!penDown) {
          return;
        }
        break;
      }
      if (!isTouchDevice && (rightDown || e.button === 2)) {
        rightDown = true;
        var input = this.querySelector('input');
        var team = parseInt(input.getAttribute('team'));
        if (team < 0) team = teamNum;
        selectPalette(team);
        return false;
      }
      if (currentPen > -1) {
        var input = this.querySelector('input');
        var isLocked = input.classList.contains('locked');
        var race = parseInt(this.getAttribute('race'));
        if (!isLocked) {
          var val;
          if (currentPen >= teamNum) val = '';
          else val = teamNames[currentPen];
          input.value = val;
          var isNull = (val === '');
          var isInputedTeam = resetRankInputClass(input);
          var [isComplemented, isChangeState] = updateRace(race, !isNull);
          if (isChangeState) {
            tallyForScores(() => {
              input.blur();
            });
          } else {
            setTimeout(() => {
              input.blur();
            },1);
          }
        }
      }
    };
    var onmouseup = function (e) {
      penDown = false;
      rightDown = false;
    };
    var oncontextmenu = function (e) {
      return false;
    };
    td.oncontextmenu = oncontextmenu;
    td.addEventListener(mousedownEvent, onmousedown, false);
    td.addEventListener('mousemove', onmousedown, false);
    td.addEventListener('mouseup', onmouseup, false);
    td.addEventListener('wheel', function (e) {
      if (currentPen < 0) {
        return true;
      }
      e.preventDefault();
      if (e.deltaY < 0){
          if (currentPen >= 1) {
            selectPalette(--currentPen);
          }
      } else {
          if (currentPen < teamNum) {
            selectPalette(++currentPen);
          }
      }
    });
  }
  function setEventDisablePen(td) {
    td.addEventListener('mouseenter', () => {
      mouseChaser.style.display = 'none';
    });
  }
  function setEventEnablePen(td) {
    td.addEventListener('mouseenter', () => {
      mouseChaser.style.display = mouseChaserStyle;
    });
  }
}

/* 
 * createInput(opt)
 */
function createInput(opt) {
  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('spellcheck', 'false');
  if (opt) {
    Object.keys(opt).map(key => {
      if (key === 'className') {
        opt[key].split(' ').map(cls => {
          input.classList.add(cls);
        });
      } else {
        input.setAttribute(key, opt[key]);
      }
    });
  }
  return input;
}

/*
 * createRankInput(rank, race, num)
 */
function createRankInput(rank, race, num) {
  var input = document.createElement('input');
  setAttributes(input);
  setEvents(input);
  return input;
  
  function setAttributes(input) {
    input.setAttribute('type', 'text');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('team', '-1');
    input.setAttribute('tabIndex', rankTableIndex + num);
    input.setAttribute('rank-input-id', num);
    input.setAttribute('id', 'rank-input-' + num);
    input.setAttribute('placeholder', rank);
    input.setAttribute('race', race);
    input.setAttribute('rank', rank);
    input.classList.add('race-' + race);
    input.classList.add('rank-' + rank);
  }
  
  function setEvents(input) {
    // clickイベント
    input.addEventListener(mousedownEvent, function (e) {
      if (this.classList.contains('locked')) {
        this.blur();
      }
    }, false);
    // inputイベント
    input.addEventListener('input', function(e) {
      logger.log('inputed [' + e.data + ']', 'gray');
      var selectionEnd = this.selectionEnd;
      var isNull = (e.data === null);
      var isParsed = applyShortCutKey(this, e.data);
      if (isParsed) {
        logger.log('parsed input [' + e.data + '] -> [' + this.value + ']', 'gray');
      } else {
        var index = teamNames.indexOf(this.value);
        if (index < 0) {
          var oldValue = this.value;
          isParsed = complementUpperCase(this);
          if (isParsed) {
            logger.log('parsed name [' + oldValue + '] -> [' + this.value + ']', 'gray');
          }
        }
      }
      var isInputedTeam = resetRankInputClass(this);
      var [isComplemented, isChangeState] = updateRace(race, !isNull);
      if (isChangeState) {
        tallyForScores(() => {
          this.blur();
        });
      } else {
        if (isComplemented) {
          this.blur();
          //var race = parseInt(this.getAttribute('race'));
          //var inputCourseId = (race - 1) * (playerNum + 1) + playerNum;
          //var inputCourse = document.querySelector('#rank-input-' + inputCourseId);
          //inputCourse.focus();
        } else if (isInputedTeam) {
          focusDownRankInput(this);
        } else {
          this.focus();
          this.setSelectionRange(selectionEnd, selectionEnd);
        }
      }
    });
    // keydownイベント
    input.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
      case 13:
        focusNextRankInput(this);
        break; 
      case 40:
        focusDownRankInput(this);
        break;
      case 38:
        focusUpRankInput(this);
        break;
      }
    }, false);
    // applyShortCutKey(input, str)
    function applyShortCutKey(input, str) {
      var index = shortCutKeys.indexOf(str);
      //var str2 = replaceHankaku(str);
      //var index2 = shortCutKeys.indexOf(str2);
      if (index > -1 && index < teamNum) {
        input.value = teamNames[index];
        return true;
      }
      //else if (index2 > -1 && index2 < teamNum) {
      //  input.value = teamNames[index2];
      //  return true;
      //}
      return false;
    }
    // complementUpperCase(input)
    function complementUpperCase(input) {
      var val = input.value.toLowerCase();
      for (var i = 0; i < teamNames.length; i++) {
        var name = teamNames[i];
        if (val === name.toLowerCase()) {
          input.value = name;
          return true;
        }
      }
      return false;
    }
    function replaceHankaku(str) {
      var index = zenkakuStrs.indexOf(str);
      if (index > -1) {
        return hankakuStrs[index];
      }
      return str;
    }
  }
}
  
/*
 * resetRankInputClass(elm, isParsed)
 */
function resetRankInputClass(elm) {
  // いったんクラスを全部剥ぐ
  for (var i = 0; i < teamNum + 1; i++) {
    elm.classList.remove('team-' + i);
  }
  elm.setAttribute('team', '-1');
  var race = parseInt(elm.getAttribute('race'));
  var rank = parseInt(elm.getAttribute('rank'));
  // チームタグ一覧に一致したらクラスをつける
  var val = elm.value;
  var idx = teamNames.indexOf(val);
  var isMatched = (0 <= idx && idx < teamNum);
  if (isMatched) {
    elm.classList.add('team-' + idx);
    elm.setAttribute('team', idx);
    inputRankData[race - 1][rank - 1] = idx;    
  }
  var rankStr = rankStrs[rank - 1];
  logger.log('inputed team [race ' + race + '][' +
    rankStr + '][' + elm.value + ']', 'gray');
  setSaveStorage();
  return isMatched;
}
  
/* 
 * focusNextRankInput(elm)
 */
function focusNextRankInput(elm) {
  var id = parseInt(elm.getAttribute('rank-input-id'));
  var next = document.getElementById('rank-input-' + (id + 1));
  if (next) next.focus();
}
  
/*
 * focusUpRankInput(elm)
 */
function focusUpRankInput(elm) {
  var next, id = parseInt(elm.getAttribute('rank-input-id'));
  if (id % (playerNum + 1) > 0)
    next = document.getElementById('rank-input-' + (id - 1));
  if (next) next.focus();
}
  
/*
 * focusDownRankInput(elm)
 */
function focusDownRankInput(elm) {
  var next, id = parseInt(elm.getAttribute('rank-input-id'));
  if (id % (playerNum + 1) < playerNum - 1)
    next = document.getElementById('rank-input-' + (id + 1));
  if (next) next.focus();
}

/* 
 * updateRace(race)
 */
function updateRace(race, doComplement) {
  if (doComplement === undefined) doComplement = true;
  doComplement = doComplement && window.tallyConfig.isEnabledComplement;
  var stateTd = document.body.querySelector('.state-cell.race-' + race);
  var stateImage = stateTd.querySelector('img');
  var beforeStateType = stateTd.getAttribute('state-type');
  
  // 正しく入力されているチームタグの数を数える
  var inputedRankNum = 0;
  var notInputedElements = [];
  var teamCounts = createArray(teamNum, 0);
  for (var rank = 1; rank <= playerNum; rank++) {
    var inpt = document.body.querySelector('.rank-' + rank + '.race-' + race);
    var team = inpt.getAttribute('team');
    inputRankData[race - 1][rank - 1] = team;
    if (team === '-1') {
      notInputedElements.push(inpt);
    } else {
      inputedRankNum++;
      teamCounts[parseInt(team)]++;
    }
  }
  // 補完可能かどうか調べる
  var isCanComplement = doComplement;
  if (doComplement) {
    var teamMenberNum = playerNum / teamNum; // eg. 4 = 12 / 3;
    var canComplementNum = teamMenberNum * (teamNum - 1); // eg. 8 = 4 * (3 - 1);
    var complementTeam = -1, complementTeamName;
    if (inputedRankNum >= canComplementNum && inputedRankNum < playerNum) {
      for (var i = 0; i < teamNum; i++) {
        if (teamCounts[i] === teamMenberNum) {
        } else if (teamCounts[i] < teamMenberNum) {
          if (complementTeam === -1) {
            complementTeam = i;
            complementTeamName = teamNames[complementTeam];
          } else {
            isCanComplement = false;
            break;
          }
        }
      }
    } else {
      isCanComplement = false;
    }
    if (isCanComplement) {
      logger.log('complemented ranks');
      notInputedElements.map(elm => {
        elm.value = complementTeamName;
        resetRankInputClass(elm);
        teamCounts[complementTeam]++;
      });
    }
  }
  // 入力が完了しているかどうか調べる
  // プレイヤーと同じ数のチームタグが入力されており
  // どのチームタグの数も等しいなら入力が完了している
  var stateType;
  if (isCanComplement) {
    stateType = 'complete';
  } else if (inputedRankNum === playerNum) {
    stateType = 'complete';
    for (i = 1; i < teamNum; i++) {
      if (teamCounts[0] !== teamCounts[i]) {
        stateType = 'error';
        break;
      }
    }
  } else {
    stateType = 'lack';
  }
  
  var isChangeState = (beforeStateType !== stateType);
  if (isChangeState) {
    logger.log('changed [race ' + race + '] state [' +
      beforeStateType + '] -> [' + stateType + ']');
  }
  var theRaceTds = document.querySelectorAll('.race-' + race);
  var len = Math.min(theRaceTds.length - 4);
  for (var i = 0; i < len; i++) {
    theRaceTds[i].classList.remove('complete');
    theRaceTds[i].classList.remove('error');
    theRaceTds[i].classList.remove('lack');
    theRaceTds[i].classList.add(stateType);
  }
  stateTd.setAttribute('state-type', stateType);
  stateImage.setAttribute('src', stateImage.getAttribute('src-' + stateType));
  stateTd.setAttribute('inputed', (stateType === 'complete') ? 'inputed' : '');
  
  return [isCanComplement, isChangeState];
}

/*
 * tallyForScores()
 */
function tallyForScores(callback) {
  clearTimeout(tallyForScoresTimer);
  tallyForScoresTimer = setTimeout(function() {
    logger.log('tallied scores');
    
    // 残りレース数を数えて
    // 最新レースのコース名も控えておく
    var states = document.body.querySelectorAll('.state-cell');
    var i;
    var sum = 0;
    var latestRace;
    var inputedRaces = [];
    for (i = 0; i < states.length; i++) {
      if (states[i].getAttribute('inputed') === 'inputed') {
        var race = states[i].getAttribute('race');
        latestRace = race;
        inputedRaces.push(race);
        sum++;
      }
    }
    var leftRace = raceNum - sum;
    var lastCourseStr = '';
    var lastCourse = document.body.querySelector('.course-cell.race-' + latestRace);
    if (lastCourse) lastCourseStr = lastCourse.value;
    
    // 点数を計算する
    var totalScores = [];
    var latestScores = [];
    var sortedScoreObjects = [];
    for (i = 0; i < teamNum; i++) {
      totalScores.push(0);
      latestScores.push(0);
      sortedScoreObjects.push({
        teamIndex: i,
        teamName: teamNames[i],
        totalScore: 0,
        latestScore: 0
      });
    }
    inputedRaces.map((race, raceIndex) => {
      for (var i = 1; i <= playerNum; i++) {
        var inpt = document.body.querySelector('.rank-' + i + '.race-' + race);
        var team = parseInt(inpt.getAttribute('team'));
        var point = SCORES[i - 1];
        totalScores[team] += point;
        sortedScoreObjects[team].totalScore += point;
        if (raceIndex === inputedRaces.length - 1) {
          latestScores[team] += point;
          sortedScoreObjects[team].latestScore += point;
        }
      }
    });
    sortedScoreObjects[0].latestScoreDif = 
      sortedScoreObjects[0].latestScore - sortedScoreObjects[1].latestScore;
    sortedScoreObjects.sort((a, b) => {
      if (a.totalScore > b.totalScore) return -1;
      else return 1;
    });
    sortedScoreObjects.map((scoreObj, i) => {
      scoreObj.teamRank = i + 1;
    });
    sortedScoreObjects.map((scoreObj, teamIndex) => {
      calcTargetDistance(sortedScoreObjects, teamIndex, tallyConfig.passRank)
    });
    //logger.log(sortedScoreObjects);
    
    // 文字列化する
    var tallyText = createTallyText(sortedScoreObjects, lastCourseStr, leftRace);
    
    document.getElementById('result').textContent = tallyText;
    if (isInitialized) {
      execCopy(tallyText);
    }
    
    if (callback) callback();
    
    setSaveStorage();    
    
  }, tallyForScoresDelay);
}

/*
 * getScoreObject(sortedScoreObjects, teamIndex)
 */
function getScoreObject(sortedScoreObjects, teamIndex) {
  for (var i = 0; i < teamNum; i++) {
    if (sortedScoreObjects[i].teamIndex === teamIndex) {
      return sortedScoreObjects[i];
    }
  }
}

/*
 * calcTargetDistance(sortedScoreObjects, teamIndex, passRank)
 */
function calcTargetDistance(sortedScoreObjects, teamIndex, passRank) {
  var scoreObj = getScoreObject(sortedScoreObjects, teamIndex);
  var myRank = scoreObj.teamRank;
  passRank = Math.max(1, Math.min(teamNum - 1, passRank));
  var targetRank;
  if (myRank <= passRank) targetRank = passRank + 1; // eg. 現在2位, 3組通過 → 4位との差
  else targetRank = passRank;                        // eg. 現在4位, 3組通過 → 3位との差
  scoreObj.targetDistance = sortedScoreObjects[myRank - 1].totalScore -
    sortedScoreObjects[targetRank - 1].totalScore;
  scoreObj.targetDistanceStr = targetRank + '位との点差:' +
    parseSignedNum(scoreObj.targetDistance);
}

/*
 * createTallyText(sortedScoreObjects, lastCourseStr, leftRace)
 */
function createTallyText(sortedScoreObjects, lastCourseStr, leftRace) {
  /*
  var tallyConfig = {
    latestScore: true,     // 最新レースの得点
    latestScoreDif: true,  // 最新レースの点差
    latestCource: true,    // 最新レースのコース
    totalScoreDif: true,   // 合計得点の点差
    leftRaceNum: true,     // 残りレース数
    currentRank: true,     // 現在の順位
    targetDistance: true,  // 目標順位との距離
    emphasisStr: '【】',   // 強調開始
    splitStr: '／',        // 区切り文字
    teamSplitStr: '／',    // チームの区切り文字
    passRank: 2,
  };
  */
  var cfg = tallyConfig;
  var tallyStrs = [];
  var myScoreObj = getScoreObject(sortedScoreObjects, 0);
  if (cfg.emphasisStr.length >= 2) {
    cfg.emphasisStart = cfg.emphasisStr.charAt(0);
    cfg.emphasisEnd = cfg.emphasisStr.charAt(1);
  } else {
    cfg.emphasisStart = '';
    cfg.emphasisEnd = '';
  }
  
  // 最新レースのスコア
  if (teamNum === 2) {
    var latestScoreStr = '';
    if (cfg.latestScore) {
      for (i = 0; i < teamNum; i++) {
        //var scoreObj = sortedScoreObjects[i];
        var scoreObj = getScoreObject(sortedScoreObjects, i);
        var latestScore = scoreObj.latestScore;
        if (i > 0) latestScoreStr += '-';
        latestScoreStr += latestScore;
      }
      if (cfg.latestScoreDif) {
        latestScoreStr += ' (' + parseSignedNum(myScoreObj.latestScoreDif) + ')';
      }
    } else if (cfg.latestScoreDif) {
      latestScoreStr += parseSignedNum(myScoreObj.latestScoreDif);
    }
    if (latestScoreStr) tallyStrs.push(latestScoreStr);
  }
  
  // 合計スコア
  var totalScoreStr = '';
  if (teamNum === 2) {
    // 66(交流戦)の場合
    if (cfg.totalScore) {
      totalScoreStr += '合計: ';
      for (i = 0; i < teamNum; i++) {
        //var scoreObj = sortedScoreObjects[i];
        var scoreObj = getScoreObject(sortedScoreObjects, i);
        var name = scoreObj.teamName;
        //if (scoreObj.teamIndex === 0) name = '【' + name + '】';
        //else name = name + ' ';
        var score = scoreObj.totalScore;
        var scoreStr = name + ' ' + score;
        if (i > 0) totalScoreStr += '-';
        if (i > 0) scoreStr = score + ' ' + name;
        totalScoreStr += scoreStr;
      }
    }
  } else {
    if (cfg.totalScore || cfg.totalScoreDif) {
      // タッグ/トリプルス/フォーマンの場合
      for (var i = 0; i < teamNum; i++) {
        var scoreObj = sortedScoreObjects[i];
        //var scoreObj = getScoreObject(sortedScoreObjects, i);
        var name = scoreObj.teamName;
        if (scoreObj.teamIndex === 0) {
          name = cfg.emphasisStart + name + cfg.emphasisEnd;
          if (i > 0 && cfg.emphasisStart !== '【' && cfg.teamSplitStr !== '／') name = ' ' + name;
          if (cfg.emphasisEnd !== '】') name += ' ';
        } else {
          if (i > 0 && cfg.teamSplitStr !== '／') name = ' ' + name;
          name += ' ';
        }
        var score = scoreObj.totalScore;
        var difScore = myScoreObj.totalScore - scoreObj.totalScore;
        difScore = (difScore > 0) ? '+' + difScore : (difScore === 0) ? '±0' : '' + difScore;
        if (cfg.totalScore) {
          if (cfg.totalScoreDif) {
            if (myScoreObj !== scoreObj) {
              score = score + ' (' + difScore + ')';
            }
          }
        } else {
          if (cfg.totalScoreDif) {
            if (myScoreObj !== scoreObj) {
              score = difScore;
            }
          }
        }
        var scoreStr = name + score;
        if (i > 0) totalScoreStr += cfg.teamSplitStr;
        totalScoreStr += scoreStr;
      }
    }
  }
  if (totalScoreStr) {
    tallyStrs.push(totalScoreStr);
  }
  
  if (teamNum === 2) {
    // 点差 66(交流戦)のみ
    if (cfg.totalScoreDif) {
      tallyStrs.push('点差: ' + parseSignedNum(myScoreObj.targetDistance));
    }
  } else {
    // 現在順位と目標距離 タッグ/トリプルス/フォーマンのみ
    if (cfg.currentRank) {
      var myRankStr = '現在' + myScoreObj.teamRank + '位';
      tallyStrs.push(myRankStr);
    }
    if (cfg.targetDistance) {
      tallyStrs.push(myScoreObj.targetDistanceStr);
    }
  }
  
  // コース名と残りレース数
  var leftRaceStr = '';
  if (cfg.latestCource) {
    leftRaceStr += lastCourseStr;
  }
  if (cfg.leftRaceNum) {
    leftRaceStr += '＠' + leftRace;
  }
  if (leftRaceStr) tallyStrs.push(leftRaceStr);
  
  // 1レースで付きうる最大の点差
  var oneRaceMaxDif = 0;
  switch (teamNum) {
    case 2: // 2チーム:交流戦
      oneRaceMaxDif = 40; // (15+12+10+9+8+7)-(1+2+3+4+5+6)
      break;
    case 3: // 3チーム:フォーマンセル
      oneRaceMaxDif = 36; // (15+12+10+9)-(1+2+3+4)
      break;
    case 4: // 4チーム:トリプルス
      oneRaceMaxDif = 31; // (15+12+10)-(1+2+3)
      break;
    case 6: // 6チーム:タッグ
      oneRaceMaxDif = 24; // (15+12)-(1+2)
      break;
  }
  // 残りのレースで付きうる最大の点差
  var possibleMaxDif = leftRace * oneRaceMaxDif;
  if (myScoreObj.teamRank === 1) {
    var dif = sortedScoreObjects[0].totalScore - sortedScoreObjects[1].totalScore;
    if (dif > possibleMaxDif) {
      if (cfg.winDetermine) {
        tallyStrs.push('勝利確定!');
      }
    }
  }
  
  // join
  if (cfg.splitStr === ' /') {
    cfg.splitStr = ' / ';
  }
  var tallyText = tallyStrs.join(cfg.splitStr);
  return tallyText;
}

/* 
 * parseSignedNum()
 */
function parseSignedNum(num) {
  var sign = (num >= 0) ? '+' : '';
  return sign + num;
}

/* 
 * logger()
 */
window.logger = {
  log: (str, colorKey) => {
    if (colorKey) {
      str = '%c' + str;
      var css = 'color: ' + logger.color[colorKey] + ';';
      console.log(str, css)
    }
    else console.log(str);
  },
  color: {
    'black': '#000',
    'gray': '#aaa'
  }
};

/*
 * execCopy(str)
** https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
 */
function execCopy(str) {
  
  var tmp = document.createElement('div');
  var pre = document.createElement('pre');
  pre.style.webkitUserSelect = 'auto';
  pre.style.userSelect = 'auto';
  tmp.appendChild(pre).textContent = str;
  var s = tmp.style;
  s.position = 'fixed';
  s.right = '200%';
  document.body.appendChild(tmp);
  document.getSelection().selectAllChildren(tmp);
  var result = document.execCommand('copy');
  document.body.removeChild(tmp);
  if (result) {
    notifyFooter('コピーしました: ' + str);
  }
  return result;
}

/*
 * execCopy(str)
** https://mamewaza.com/support/blog/javascript-copy.html
 */
/*
function execCopy(str) {
  if(!str || typeof(str) != "string") {
  return "";
  }
  $(document.body).append("<textarea id=\"tmp_copy\" style=\"position:fixed;right:100vw;font-size:16px;\" readonly=\"readonly\">" + str + "</textarea>");
  var elm = $("#tmp_copy")[0];
  elm.select();
  var range = document.createRange();
  range.selectNodeContents(elm);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  elm.setSelectionRange(0, 999999);
  document.execCommand("copy");
  $(elm).remove();
}
*/

/*
 * execCopyResult()
** https://naoyu.net/js-clipboard-copy/
 */
function execCopyResult() {
  var copyText = document.querySelector('#result');
  var range = document.createRange();
  range.selectNode(copyText);
  window.getSelection().addRange(range);
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    logger.log('copy command was ' + msg);
    notifyFooter('コピーしました: ' + copyText.textContent);
  } catch(err) {
    logger.log('unable to copy');
  }
  window.getSelection().removeAllRanges();
}

/*
 * trigger(element, eventType)
 */
function trigger(element, eventType) {
  var event = document.createEvent("Event");
  event.initEvent(eventType, true, true);
  element.dispatchEvent(event);
}

/*
 * setSaveStorage()
 */
var saveStorageTimer = null;
function setSaveStorage() {
  clearTimeout(saveStorageTimer);
  saveStorageTimer = setTimeout(function(){
    saveStorage();
  }, 2000);
}

/*
 * saveStorage()
 */
function saveStorage() {
  var saveDataObj = {};
  saveTargetVariables.map(varName => {
    saveDataObj[varName] = window[varName];
  });
  var jsonStr = JSON.stringify(saveDataObj);
  //logger.log(jsonStr);
  localStorage.setItem(storageKey, jsonStr);
  logger.log('set storage data');
}

/*
 * loadStorage()
 */
function loadStorage() {
  var jsonStr = localStorage.getItem(storageKey);
  if (jsonStr !== null) {
    logger.log('storage data exist');
    logger.log('merging variables to window');
    //logger.log(jsonStr);
    var saveDataObj = JSON.parse(jsonStr);
    saveTargetVariables.map(varName => {
      if (saveDataObj[varName] !== undefined) {
        if (varName === 'tallyConfig') {
          Object.keys(saveDataObj[varName]).forEach(key => {
            window[varName][key] = saveDataObj[varName][key];
          });
        } else {
          window[varName] = saveDataObj[varName];
        }
      }
    });
  } else {
    logger.log('storage data doesn\'t exist');
  }
}

/* 
 * scanTeamData(race)
 */
function scanTeamData(race) {
  if (!existsSampleTeamData()) {
    alert('標本の作成が済んでいません。');
    return false;
  }
  logger.log(`scaning race ${race}...`);
  var scanedNameArr = scanedNameData[race - 1];
  var teamArr = getTeamRankArray(scanedNameArr, sampleTeamData);
  logger.log('scaned!');
  logger.log(teamArr);
  for (var rank = 1; rank <= 12; rank++) {
    var slc = '.race-' + race + '.rank-' + rank;
    var input = document.querySelector(slc);
    input.value = teamArr[rank - 1];
    resetRankInputClass(input);
  }
  updateRace(race);
  tallyForScores();
  return true;
}

/* 
 * makeSampleTeamData(race)
 */
function makeSampleTeamData(race) {
  logger.log(`making specimen with race ${race}...`);
  //var stateElm = document.querySelector('.scanable-state');
  //stateElm.textContent = '　';
  // そのレースの順位が入力済みかチェック
  var stateRace = document.body.querySelector(`.state-cell.race-${race}`);
  var isInputedRace = (stateRace.getAttribute('inputed') === 'inputed');
  if (!isInputedRace) {
    // 順位が入力済みでないなら
    logger.log(`error! race ${race} rank is missing.`);
    alert('順位の入力が済んでいません。');
    return false;
  } else {
    // 順位が入力済みなら
    // スキャンデータがあるかどうかチェック
    var names = scanedNameData[race - 1];
    var isScanedNamesRace = true;
    for (var i = 0; i < names.length; i++) {
      if (names[i] === null) {
        isScanedNamesRace = false;
        break;
      }
    }
    if (!isScanedNamesRace) {
      // スキャンデータがないなら
      logger.log(`error! race ${race} scan data is missing.`);
      alert('スキャンデータがありません。');
      return false;
    } else {
      // スキャンデータがあるなら
      var teams = inputRankData[race - 1];
      sampleTeamData = [];
      names.forEach((name, i) => {
        sampleTeamData.push({
          id: i,
          name: name,
          teamName: teamNames[teams[i]]
        });
      });
      logger.log('maked!');
      logger.log(sampleTeamData);
      var $specimen = document.querySelector('.specimen');
      if ($specimen) {
        $specimen.classList.remove('specimen');
      }
      document.querySelector(`.pasted-image-cell.race-${race}`).classList.add('specimen');
      return true;
    }
  }
}

/*
 * existsSampleTeamData()
 */
function existsSampleTeamData() {
  return (sampleTeamData !== null);
}


/* 
 * constants
 */
var rankStrs = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
var hankakuStrs = ['1',  '2',  '3',  '4',  '5',  '6',  '7',  '8',  '9',  '0',  '-',  '^', '\\',  'q',  'w',  'e',  'r',  't',  'y',  'u',  'i',  'o',  'p',  '[',  'a',  's',  'd',  'f',  'g',  'h',  'j',  'k',  'l',  ';',  ':',  ']',  'z',  'x',  'c',  'v',  'b',  'n',  'm',  ',',  '.',  ',',  '.',  '/', '\\',  'a',  'i',  'u',  'e',  'o'];
var zenkakuStrs = ['１', '２', '３', '４', '５', '６', '７', '８', '９', '０', '－', '＾', '￥', 'ｑ', 'ｗ', 'ｅ', 'ｒ', 'ｔ', 'ｙ', 'ｕ', 'ｉ', 'ｏ', 'ｐ', '「', 'ａ', 'ｓ', 'ｄ', 'ｆ', 'ｇ', 'ｈ', 'ｊ', 'ｋ', 'ｌ', '；', '：', '」', 'ｚ', 'ｘ', 'ｃ', 'ｖ', 'ｂ', 'ｎ', 'ｍ', '，', '．', '、', '。', '・', '￥', 'あ', 'い', 'う', 'え', 'お'];
var MK8DX_COURSES = [
  ['マリカス', 'marikasu'],
  ['ウォタパ', 'whotapa', 'ulotapa', 'uxotapa'],
  ['ドッスン', 'dossun'],
  ['遺跡', 'いせき', 'iseki'],
  ['マリサ', 'marisa'],
  ['新マリサ', 'しんまりさ', 'sinmarisa', 'shinmarisa'],
  ['ねじれ', 'nejire', 'nejire'],
  ['ヘイ鉱', 'へいこう', 'heikou'],
  ['ヘイホー', 'heiho'],
  ['空港', 'くうこう', 'kuukou'],
  ['ドルみ', 'dorumi'],
  ['岬', 'みさき', 'misaki'],
  ['エレドロ', 'eredoro'],
  ['ワリスノ', 'warisuno'],
  ['雪山', 'ゆきやま', 'yukiyama'],
  ['スカガ', 'sukaga'],
  ['ホネホネ', 'honoehone'],
  ['骨々', 'ほねほね', 'honehone'],
  ['クパキャ', 'kupakya'],
  ['新虹', 'しんにじ', 'shinniji', 'sinniji'],
  ['ヨシサ', 'yoshisa', 'yosisa'],
  ['エキバ', 'ekiba'],
  ['ドラロ', 'doraro'],
  ['ミュート', 'myu-to'],
  ['ベビパ', 'bebipa'],
  ['チーズ', 'ti-zu', 'chi-zu'],
  ['ネイチャー', 'neitya-', 'neicha-'],
  ['どう森', 'doumori'],
  ['モモカン', 'momokan'],
  ['スイキャニ', 'suikyani'],
  'GBA',
  ['プクビ', 'pukubi'],
  ['プクプク', 'pukupuku'],
  ['ハイウェイ', 'haiwei'],
  ['カラカラ', 'karakara'],
  ['平野', 'へいや', 'heiya'],
  ['ピチサ', 'pitisa', 'pichisa'],
  'DKJ',
  ['ジャングル', 'janguru', 'zyanguru'],
  ['ワリスタ', 'warisuta'],
  ['シャベラン', 'shaberan', 'syaberan'],
  ['ミューパ', 'myu-pa'],
  ['ヨシバ', 'yoshiba', 'yosiba'],
  ['チクタク', 'chikutaku', 'tikutaku'],
  ['パクスラ', 'pakusura'],
  ['火山', 'かざん', 'kazan'],
  ['グラグラ', 'guragura'],
  '64虹',
  ['ワリ鉱', 'warikou'],
  'SFC虹',
  ['ツルツル', 'turuturu', 'tsurutsuru'],
  ['ハイラル', 'hairaru'],
  ['ネオパ', 'neopa'],
  ['リボン', 'ribon'],
  ['メトロ', 'metoro'],
  ['リンリン', 'rinrin'],
  'BB',
  ['ビッグブルー', 'bigguburu-'],
];