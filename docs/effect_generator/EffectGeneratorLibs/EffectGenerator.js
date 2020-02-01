/*
 * HTML5 Effect Generator
 *
 * Copyright (c) 2019 @GungeeSpla
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
window.init = function() {
  console.log('* Hello!');
  var $ = window.$;
  var TxtFormat = {};
  var startTime = Math.floor(new Date().getTime() / 1000);
  var errorCount = 0;
  var startNo = -1;
  var registeredEffects = [];
  var registeredElements = [];
  var waitingEffects = [];
  var registeredSoundEffects = {};
  var isRegisteredEffects = false;
  var commentLines = [];
  var commentHeight;
  var commentTime = 4;
  var maxCommentLine = 8;
  var $canvasArea = $('#canvas-area');
  var canvas = $('canvas')[0];
  var canvas2d = createCanvas2d('canvas2d', true);
  var hiddenCanvas2d = createCanvas2d('hiddenCanvas2d', false);
  var seriously = null;
  var currentEffect = null;
  var canGetImageData = true;
  var canAjax = true;
  var isEnabledFlushComment = false;
  var canvasManager = null;
  var isEnabledWebGL = false; // Browser Source on OBS doesn't support WebGL... (;_;)
  var isLocalFile = location.origin.indexOf('file://') > -1;
  var transparent = createTransparent();
  var defaultEffectConfig = {
    index: 0,
    elm: null,
    $elm: null,
    word: '',
    regexp: '',
    fuzzy: 'false',
    priority: 0,
    src: '',
    type: '',
    id: 'asset-',
    width: null,
    height: null,
    x: null,
    y: null,
    volume: 100,
    loop: 1,
    time: 2,
    fade: 0,
    se: '',
    keycolor: 'none',
    match: 'include'
  };
  var globalVolume = 50;
  var isPlaying = false;
  var buttingType = 'ignore';
  var FPS = 30;
  var isDemoPlay = true;
  var isWaitBoyomi = false;
  var boyomiSpeed = 100;
  run();
  /** run()
   * $.ajax()でcomment.xmlを取得しに行く。
   * 中身を分析し、新たに取得したコメントについてそれぞれreadComment()が呼ばれる。
   */
  function run() {
    // String.prototypeに自前のメソッドを追加する
    addStringMethod();
    // Seriouslyライブラリを呼び出す
    if (isEnabledWebGL) seriously = new window.Seriously();
    else seriously = {target(){}};
    // キャンバスマネージャを生成
    canvasManager = new CanvasManager();
    // getImageDataメソッドが使用可能かを確かめる
    // サーバーを経由せずにローカルで開いているとcross-domainで使用できない
    tryGettingImageData();
    // キャンバス設定を読み取る
    readCanvasConfig();
    // エフェクトを登録する
    registerEffects();
    // log
    console.log('* ' + registeredEffects.length + ' effects are registered.');
    console.log(registeredEffects);
    // テスト用のボタンを追加する
    addTestButtons();
    // 1秒毎にupdateCommentsを呼び出す
    setInterval(updateComments, 1000);
    // 自動クロマキーを設定する
    var autoChromaKeyNum = setAutoChromaKeys();
    if (autoChromaKeyNum) {
      console.log('* Calculating ' + autoChromaKeyNum + ' auto chroma key.');
    } else console.log('* Ready!');
  }
  /** updateComments()
   * $.ajax()でcomment.xmlを取得しに行く。
   * 中身を分析し、新たに取得したコメントについてそれぞれreadComment()が呼ばれる。
   */
  function updateComments() {
    // エフェクトが登録済みでajaxが使用可能…でないならば何もしない
    if(!(isRegisteredEffects && canAjax)) return;
    ajax({
      url: 'comment.xml',
      type: 'GET',
      dataType: 'xml',
      timeout: 5000,
      success:function(xml) {
        errorCount = 0;
        //console.log('.');
        xml = xml.getElementsByTagName('comment');
        var nextStartTime = null;
        var nextStartNo = null;
        // すべてのコメントについて…
        for (var i = 0; i < xml.length; i++) {
          // time属性とno属性を読む
          var _time = parseInt(xml[i].getAttributeNode('time').value, 10);
          var _no = parseInt(xml[i].getAttributeNode('no').value, 10);
          // 初期値は次のようになっている
          // startTime ... コメントジェネレータを開いた時間
          // startNo ... -1
          // bool1: time属性がstartTimeよりも大きいか
          var bool1 = (startTime < _time);
          // bool2: time属性がstartTimeと同じでもno属性がstartNo属性より大きいか
          var bool2 = (startTime == _time) && (startNo < _no);
          // bool1またはbool2が満たされるならこのコメントを処理する 
          if(bool1 || bool2) {
            // startTime, startNoの更新用の値を保存する
            // (!) 更新自体はfor文を回してから行う
            nextStartTime = _time;
            nextStartNo   = _no;
            // このあたりのコードは読むのが面倒で何をしているのかよくわかっていないが
            // 消したときにどう動作するかもわからないので元のコードをそのまま残している
            // たぶん特殊なコメントかどうかを判定している
            var SlashComment = 0;
            var BSPComment = 0;
            var OwnerComment = 0;
            if(isComment(xml[i].firstChild.nodeValue, SlashComment, BSPComment)) {
              if(OwnerComment==1 || ((OwnerComment==0)&&(xml[i].getAttributeNode('owner').value!=1))) {
                var handle='';
                if(xml[i].getAttributeNode('handle') != null) {
                  handle = xml[i].getAttributeNode('handle').value;
                } else {
                  if(xml[i].getAttributeNode('no') != null) {
                    if(TxtFormat['NoHandleType']==0) {
                      handle = _no+'コメ';
                    } else if(TxtFormat['NoHandleType']==1) {
                      handle = TxtFormat['NoHandleName'];
                    }
                  }
                }
                // このコメントは処理すべきだ！
                // コメント流しが有効なら流す
                if (isEnabledFlushComment) flushComment(xml[i].firstChild.nodeValue);
                // コメントをfixする
                var comment = fixComment(xml[i].firstChild.nodeValue);
                // このコメントを読む
                readComment(comment);
              }
            }
            // 元のコードではここでbreakしている
            // ここでbreakすると同一時刻に複数のコメントが投稿された場合に対応できない
            //break;
          }
        }
        if (nextStartTime !== null) {
          startTime = nextStartTime;
          startNo   = nextStartNo;
        }
      },
      error: function(e) {
        console.log('%c* Failed to get comment.xml. ('+(1+errorCount)+'/3)', 'color: red;');
        errorCount++;
        if (errorCount === 3) {
          var time = Math.floor(new Date().getTime() / 1000);
          if (time - startTime === 3) {
            canAjax = false;
            console.log('%c* Disabled ajax.', 'color: red;');
          }
        }
      }
    });
  }
  /** readComment(comment, effect)
   * 受け取ったコメントに対してどのエフェクトで反応すべきか判断し、
   * そのエフェクトを生成する。effectを指定すると、コメントに依らず強制的にそのエフェクトを使用する。
   */
  function readComment(comment, effect, delay) {
    console.log('%c「' + comment + '」',
      'color: Green; font-weight: bold; margin-top: 10px; margin-bottom: 10px;');
    // コメントから反応すべきエフェクトを選択する
    if (!effect) effect = selectEffect(comment);
    // effectがtrue判定にならないならば何もしない
    if (!effect) return;
    // 棒読みちゃんの読み上げを待ちたいが…
    if (isWaitBoyomi) delay = 1000 * (comment.length/10) / (boyomiSpeed/100);
    else delay = 0;
    // エフェクトを生成する
    if (!delay) generateEffect(effect);
    else setTimeout(function(){ generateEffect(effect); }, delay);
  }
  /** selectEffect(_comment)
   * コメントからエフェクトを選ぶ。
   */
  function selectEffect(_comment) {
    var fixedComment = _comment.toFuzzy();
    var matchingEffects = [];
    registeredEffects.map(effect => {
      var shouldPush = false;
      var comment = (effect.fuzzy === 'true') ? fixedComment : _comment;
      var match;
      if (effect.regExp) {
        // 正規表現
        match = comment.match(effect.regExp);
        shouldPush = !!match;
        if (shouldPush) effect.wordLength = match[0].length;
      } else {
        match = matchString(comment, effect.word);
        switch (effect.match) {
        case 'first':
          shouldPush = match.isFirst;
          break;
        case 'last':
          shouldPush = match.isLast;
          break;
        case 'equal':
          shouldPush = match.isEqual;
          break;
        default:
        case 'include':
          shouldPush = match.isInclude;
          break;
        }
      }
      // 追加する
      if (shouldPush) {
        matchingEffects.push(effect);
      }
    });
    // 何もヒットしなければ終了
    if (matchingEffects.length === 0) return false;
    // 優先度
    matchingEffects.sort(function(a,b){
      if (a.priority > b.priority) return -1;
      else return 1;
    });
    matchingEffects.sort(function(a,b){
      if (a.priority === b.priority && a.wordLength > b.wordLength) return -1;
      else return 1;
    });
    // 一番高い優先度を取得
    // それと同じ優先度のエフェクトを全部放り込んでいく
    var plongest = matchingEffects[0].priority;
    var plongestEffects = [];
    matchingEffects.map(effect => {
      if (effect.priority === plongest) plongestEffects.push(effect);
    });
    // ひとつしかなければそれを返すだけ
    // 複数あればさらに文字数を見る
    var ret;
    if (plongestEffects.length === 1) {
      ret = plongestEffects[0];
    } else {
      // 一番多い一致文字数を取得
      // それと同じ一致文字数のエフェクトを全部放り込んでいく
      var longest = matchingEffects[0].wordLength;
      var longestEffects = [];
      matchingEffects.map(effect => {
        if (effect.wordLength === longest) longestEffects.push(effect);
      });
      // ひとつしかなければそれを返すだけ
      // 複数あればランダムに決定する
      if (longestEffects.length === 1) {
        ret = longestEffects[0];
      } else {
        var rand = Math.floor(Math.random() * longestEffects.length);
        ret = longestEffects[rand];
      }
    }
    console.info('* \'' + ret.word + '\' is matched!');
    console.info('* -> will play ' + ret.src);
    return ret;
  }
  /** matchString(str, searchStr)
   * 文字列がマッチしているかを判定して結果となるオブジェクトを返す。
   */
  function matchString(str, searchStr) {
     var idx = str.indexOf(searchStr);
     var idx2 = str.lastIndexOf(searchStr);
     return {
       isInclude: (idx >= 0),
       isFirst  : (idx === 0),
       isLast   : (idx2 + searchStr.length === str.length),
       isEqual  : (str === searchStr)
     };
  }
  /** generateEffect(effect)
   * エフェクトを生成する。
   */
  function generateEffect(effect) { 
    // プレイ中のエフェクトがある場合
    // エフェクトを待つ設定ならwaitingEffectsにぶち込んで待機
    // エフェクトを待たない設定なら強制終了する
    if (isPlaying) {
      switch (buttingType) {
      case 'ignore':
        return;
      case 'wait':
        console.log('エフェクトを待機させました.');
        return waitingEffects.push(effect);
      case 'stop':
        console.log('エフェクトを強制終了させます.');
        currentEffect.elm.currentLoop = 998;
        if (currentEffect.elm.pause) currentEffect.elm.pause();
        currentEffect.elm.currentTime = 0;
        currentEffect.$elm.trigger('ended');
        break;
      }
    }
    var $elm = effect.$elm;
    var elm = effect.elm;    
    switch (effect.type) {
    case 'img':
      if (effect.ext === 'gif') {
        elm.src = elm.src + '1';
      }
      $elm.trigger('play');
      $elm.on('ended.one',function(){
        $elm.clearQueue();
        $elm.stop();
        $elm.css('display', 'none');
        $elm.off('ended.one');
      });
      $elm.fadeIn(effect.fade * 1000)
      .delay(effect.time * 1000)
      .fadeOut(effect.fade * 1000,function(){
        $elm.trigger('ended');
      });
      // 効果音が設定してあれば再生する
      if (effect.se !== '') {
        registeredSoundEffects[effect.se].elm.currentTime = 0;
        registeredSoundEffects[effect.se].elm.play();
      }
      break;
    case 'audio':
      elm.play();
      break;
    case 'video':
      effect.elm.currentLoop = 0;
      // 再生終了時にどうするか
      $elm.on('ended.one',function(){
        effect.elm.currentLoop++;
        console.log('(' + effect.elm.currentLoop + '/' + effect.loop + ')');
        // 所定回数のループをこなしていないならば
        if (effect.elm.currentLoop < effect.loop) {
          // もう一度再生する
          elm.play();
        } else {
          // 所定回数ループしたならばエフェクトの再生を終わる
          canvasManager.stopVideo(elm);
          $elm.off('ended.one');
          shiftWaitingEffects();
        }
      });
      canvasManager.playVideo(effect.elm, effect);
      break;
    }
  }
  /** readCanvasConfig()
   * キャンバス設定を読み取る。
   */
  function readCanvasConfig() {
    var get = getCanvasConfigValue;
    globalVolume = fitNumber(0, 100, get('volume', 50, 'int'));
    FPS          = fitNumber(1, 60, get('FPS', 30, 'int'));
    buttingType  = get('butting', 'ignore', 'str');
    isDemoPlay   = get('demo', true, 'bool');
    isWaitBoyomi = get('waitboyomi', false, 'bool');
    boyomiSpeed  = get('boyomispeed', 100, 'int');
    isEnabledFlushComment = get('flushcomment', false, 'bool');
    addCommentStyle();
    var w = get('width', 1280, 'int');
    var h = get('height', 720, 'int');
    canvas2d.width = w;
    canvas2d.height = h;
    hiddenCanvas2d.width = w;
    hiddenCanvas2d.height = h;
    $canvasArea.css('width', w + 'px');
    $canvasArea.css('height', h + 'px');
    $('#buttons').css('top', (h + 20) + 'px');
    /** getCanvasConfigValue(key, defaultValue, type)
     */
    function getCanvasConfigValue(key, defaultValue, type) {
      var val = canvas.getAttribute(key);
      if (!val) {
        val = defaultValue;
      } else {
        switch (type) {
        case 'bool':
          val = (val === 'true');
          break;
        case 'int':
          val = parseInt(val);
          break;
        case 'str':
          break;
        case 'double':
          val = parseFloat(val);
          break;
        default:
          break;
        }
      }
      return val;
    }
  }
  /** registerEffects()
   * エフェクトを登録する。
   */
  function registerEffects() {
    $('#materials').children().each(function(i){
      registerEffect(this, i);
    });
    isRegisteredEffects = true;
    return;
    
    function registerEffect(elm, i) {
      var $elm = $(elm);
      var effect = $.extend({}, defaultEffectConfig);
      Object.keys(effect).map(key => {
        var val = elm.getAttribute(key);
        if (val) {
          effect[key] = val;
        }
      });
      effect.priority = parseInt(effect.priority);
      effect.loop = fitNumber(1,10, parseInt(effect.loop));
      effect.time = fitNumber(1,10, parseFloat(effect.time));
      effect.fade = fitNumber(0, 3, parseFloat(effect.fade));
      effect.volume = fitNumber(0, 100, parseFloat(effect.volume));
      effect.elm = elm;
      effect.filename = elm.src ? elm.src.split('/').pop() : '';
      effect.ext = effect.filename.split('.').pop().split('?')[0];
      effect.$elm = $elm;
      effect.type = elm.tagName.toLowerCase();
      effect.index = i;
      effect.id += i;
      effect.$elm.attr('id', effect.id);
      effect.elm.currentLoop = 0;
      if (effect.regexp) effect.regExp = new RegExp(effect.regexp);
      if (effect.x) $elm.css('left', effect.x + 'px');
      if (effect.y) $elm.css('top', effect.y + 'px');
      if (effect.width) $elm.css('width', effect.width + 'px');
      if (effect.height) $elm.css('height', effect.height + 'px');
      if (effect.type === 'video' && effect.keycolor.charAt(0) === '#') {
        effect.keyColor = parseColor(effect.keycolor);
      }
      elm.volume = effect.volume * globalVolume / 10000;
      $elm.attr('width', '');
      $elm.attr('height', '');
      $elm.attr('loop', false);
      if (typeof elm.play !== 'function') elm.play = function(){};
      if (typeof elm.pause !== 'function') elm.pause = function(){};
      // 画像エフェクト用効果音
      if (effect.type === 'audio' && effect.se !== '') {
        registeredSoundEffects[effect.se] = effect;
        return;
      }
      // エフェクト開始時と終了時のイベントを登録
      $elm.on('play',function(){
        console.log('* play ' + effect.filename);
        currentEffect = effect;
        isPlaying = true;
      });
      $elm.on('ended',function(){
        console.log('* stop ' + effect.filename);
        isPlaying = false;
        if (effect.type !== 'video')
          shiftWaitingEffects();
      });
      // 正規表現使用
      if (effect.regexp) {
        effect.word = effect.regexp;
        registeredEffects.push(effect);
        return;
      }
      elm.effects = [];
      // wordはカンマ区切りで複数設定できるので
      effect.word.split(',').map(word => {
        var _effect = $.extend({}, effect);
        if (effect.fuzzy === 'true') {
          _effect.word = word.toFuzzy();
        } else {
          _effect.word = word;
        }
        _effect.wordLength = word.length;
        registeredEffects.push(_effect);
        elm.effects.push(_effect);
      });
      registeredElements.push(elm);
    }
  }
  /** shiftWaitingEffects()
   * 待機エフェクトをシフトする。
   */
  function shiftWaitingEffects() {
    if (buttingType === 'wait') {
      if (waitingEffects.length > 0) {
        var nextEffect = waitingEffects.shift();
        setTimeout(function(){
          generateEffect(nextEffect);
        }, 1000 / FPS);
      }
    }
  }
  /** addTestButtons()
   * テスト用のボタン群を追加する。
   */
  function addTestButtons() {
    var $buttons = $('#buttons');
    // ボタン群
    var addedIds = [];
    var addedWords = [];
    registeredEffects.map(effect => {
      // 重複防止の処理
      var b1 = (addedIds.indexOf(effect.id) >= 0);
      var b2 = (addedWords.indexOf(effect.word) >= 0);
      if (b1) return;
      if (b2) return;
      $('<button class="button-1">'+effect.word+'</button>')
      .on('click', function(e){
        if (effect.regexp) {
          flushComment('(' + effect.regexp + ' にマッチするような文章)');
        } else {
          flushComment(effect.word);
        }
        readComment(effect.word);
      })
      .appendTo($buttons);
      addedIds.push(effect.id);
      addedWords.push(effect.word);
    });
    $('<br>').appendTo($buttons);
    // 任意コメント投稿用
    var $input = $('<input type="text">').appendTo($buttons);
    var $commentButton = $('<button class="button-2">コメント投稿テスト</button>')
    .on('click', function(){
      var val = $input.val();
      if (val) {
        flushComment(val);
        readComment(val);
      }
    })
    .appendTo($buttons);
    $input.on('keypress', function(e){
      if (e.which === 13) $commentButton.trigger('click');
    });
    // コメント投稿エリア
    $('<br><div id="comment"></div>').appendTo('body');
    // 背景
    $('<button class="button-2">サンプル背景表示</button>')
    .on('click', function(){
      $canvasArea.css({
        'background-image': 'url(EffectGeneratorLibs/sample-bg.jpg)',
        'border-bottom': '1px solid #666',
        'border-right': '1px solid #666'
      });
    })
    .appendTo($buttons);
    // デモプレイ
    if (isDemoPlay) {
      var $testAudio = $('#test-audio');
      var isPlayed = false;
      $testAudio.on('play', function(){
        console.log('* Successed to play test-audio.');
        isPlayed = true;
        demoPlay();
        $testAudio.off('play');
      });
      setTimeout(function(){
        if (!isPlayed) console.log('%c* Failed to play test-audio.', 'color: red;');
        $testAudio.off('play');
      },300);
      $testAudio[0].play();
      $('<button class="button-2">自動デモ</button>')
      .on('click', demoPlay)
      .appendTo($buttons);
    }
    $('<p style="color: #888;">テスト用のボタンとコメント投稿欄です。ここがOBSで見えている場合は、'
      +'画面サイズの設定が間違っている可能性があります。<br>設定と取扱説明書を見直してみてください。</p>')
      .appendTo($buttons);
    var timerDemo;
    function demoPlay() {
      console.log('* start demo.');
      var $testButtons = $('#buttons').find('.button-1');
      var demoNum = 0;
      var demoLength = $testButtons.length;
      timerDemo = setTimeout(demo, 600);
      function demo() {
        console.log('* demo (' + (demoNum + 1) + '/' + demoLength + ')');
        clearTimeout(timerDemo);
        $testButtons.eq(demoNum).trigger('click');
        demoNum++;
        if (demoNum < demoLength) {
          timerDemo = setTimeout(demo, 3000);
        } else {
          console.log('* finish demo.');
        }
      }
    }
    function pushComment(text) {
      var $p = $('<br><p>サンプルさん「'+text+'」</p>');
      $('#comment').prepend($p);
      setTimeout(function(){
        $p.fadeOut(700, function(){
          $p.remove();
        });
      },5000);
    }
  }
  /** parseColor(str)
   * #000000を{r: 0, g: 0, b: 0}に変換する。
   */
  function parseColor(str) {
    var color = str.replace('#', '').toLowerCase();
    var r = parseInt(color.substr(0, 2), 16);
    var g = parseInt(color.substr(2, 2), 16);
    var b = parseInt(color.substr(4, 2), 16);
    return {
      r: r, g: g, b: b
    };
  }
  /** setAutoChromaKeys()
   * クロマキー色の自動選択処理。
   */
  function setAutoChromaKeys() {
    var autoChroma = {};
    var autoChromaElements = [];
    var autoChromaKeyNum = 0;
    registeredEffects.map(e => {
      if (e.keycolor === 'auto') {
        var src = e.elm.src;
        autoChromaKeyNum++;
        if (typeof autoChroma[src] !== 'undefined') {
          autoChroma[src].effects.push(e);
        } else {
          autoChroma[src] = {
            elm: e.elm,
            effects: [e]
          };
          autoChromaElements.push(e.elm);
        }
      }
    });
    var index = 0;
    Object.keys(autoChroma).map(key => {
      setChromaKeyColor(++index, autoChroma[key].elm, autoChroma[key].effects, autoChromaElements);
    });
    return autoChromaKeyNum;
  }
  /** setChromaKeyColor()
   * クロマキーのカラーを取得する。
   */
  function setChromaKeyColor(index, elm, effects, chromaElements) {
    var ctx = canvas2d.context;
    var src = elm.src.split('/').pop();
    var keyColor = {
      r: 255, g: 255, b: 255, isFixed: false
    };
    // ロードが完了していないと1コマ目を描画することができないので
    // canplayイベントにセットしておく
    elm.isLoaded = false;
    $(elm).on('canplay', function(e){
      // イベントハンドラを削除する
      // これをしないと再生終了するたびにcanplayが発火してしまうので
      $(this).off('canplay');
      console.log('* Loaded '+src+'.');
      // 全部読込終わったか
      elm.isLoaded = true;
      var isLoadedAll = true;
      chromaElements.map(e => {
        if (!e.isLoaded) isLoadedAll = false;
      });
      if (isLoadedAll) {
        console.log('* Ready!');
      }
      // 自動で決定する場合は
      // キャンバスに映像の1コマ目を描画して
      // 外周1pxをぐるっと回って最も多かった色をキーカラーとする
      var video = elm;
      var w = canvas.width;
      var h = canvas.height;
      ctx.clear();
      ctx.drawImage(video, 0, 0, w, h);
      try {
        var imagedata = ctx.getImageData(0, 0, w, h);
        var colors = {};
        var x, y;
        for (x = 0, y = 0; x < w; x++) pickColor(x, y);
        for (x = 0, y = h; x < w; x++) pickColor(x, y);
        for (x = 0, y = 0; y < h; y++) pickColor(x, y);
        for (x = w, y = 0; y < h; y++) pickColor(x, y);
        var max = -1, maxKey, maxCols;
        Object.keys(colors).map(key => {
          if (colors[key] > max) {
            max = colors[key];
            maxKey = key;
          }
        });
        maxCols = maxKey.split(',');
        ctx.clear();
        keyColor.r = parseInt(maxCols[0]);
        keyColor.g = parseInt(maxCols[1]);
        keyColor.b = parseInt(maxCols[2]);
        keyColor.isFixed = true;
      } catch (error) {
        // cross-originのエラーが出ている場合、上記処理は失敗に終わる
        if (canGetImageData) {
          canvasManager.disableGettingImageData();
        }
        ctx.clear();
      }
      function pickColor(x, y) {
        var r = imagedata.data[x + y * w + 0];
        var g = imagedata.data[x + y * w + 1];
        var b = imagedata.data[x + y * w + 2];
        var key = r + ',' + g + ',' + b;
        if (typeof colors[key] === 'undefined') colors[key] = 0;
        else colors[key]++;
      }
    });
    // 500ms待ってまだキーカラーの計算が行われていないなら、
    // A. 単に読込が完了していないだけである
    // B. 上のイベントハンドラをセットしたときには既に読込完了しており、canplayが発火済みだった
    // どちらかが考えれるが、ローカルファイルからの読込なので、Aはあまりありそうではない
    // ほとんどBだと思われる。その場合は手動で発火してやる必要がある
    setTimeout(function(){
      if (!keyColor.isFixed) {
        if (elm.videoWidth) { //読込が完了していればこれがゼロではない数値として取得できる
          $(elm).trigger('canplay');
        } else {
        }
      }
    }, 500 + index);
    effects.map(effect => {
      effect.keyColor = keyColor;
    });
  }
  /** isComment(comment, Slash, BSP)
   * コメントかどうか判定する。
   */
  function isComment(comment, Slash, BSP) {
    if(comment.substring(0,11)=='/press show') {
      if(BSP==1) {
        return true;
      } else {
        return false;
      }
    } else if(comment.substring(0,1)=='/') {
      if(Slash==1) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  /** fixComment(comment)
   * コメントを整形する。
   */
  function fixComment(comment) {
    if(comment.substring(0,11)=='/press show') {
      var bsp_array = comment.split(' ');
      var bsp = '';
      for(var i=3; i<bsp_array.length; i++) {
        bsp += bsp_array[i]+ ' ';
      }
      comment = bsp;
    } else if(comment.substring(0,5)=='/perm') {
      var perm_array = comment.split(' ');
      var perm = '';
      for(var i=1; i<perm_array.length; i++) {
        perm += perm_array[i]+ ' ';
      }
      comment = perm;
    } else if(comment.substring(0,1)=='/') {
      comment = comment.substr(1);
    }
    comment = comment.replace(/&amp;/g,'&');
    comment = comment.replace(/&lt;/g,'<');
    comment = comment.replace(/&gt;/g,'>');
    var pattern = /<("[^"]*"|'[^']*'|[^'">])*>/g;
    comment = comment.replace(pattern,'');
    return comment.trim();
  }
  /** drawVideo(video, effect)
   * <video>のフレームを<canvas>に描画する。
   * なぜだかOBSのブラウザソースは<video>をただ表示するだけだと
   * やたらカクカクになるが、<canvas>に描画してやると滑らかになる。
   * ついでに、クロマキーも適用できるようにする。
   */
  function drawVideo(video, effect) {
    // ビデオが停止中なら何もしない
    if (video.paused) return;
    var x = effect.x || 0;
    var y = effect.y || 0;
    var w = effect.width || video.videoWidth;
    var h = effect.height || video.videoHeight;
    var alpha = getVideoAlpha(video, effect);
    if (effect.keycolor !== 'none' && canGetImageData) {
      // クロマキー処理
      // クロマキー適用前の真っ青な画面が配信に映ってしまうと大変まずいので
      // 非表示のキャンバスに描画しクロマキー処理を施したimagedataを持ってきて
      // 表示しているキャンバスに置き換える
      hiddenCanvas2d.context.clear();
      hiddenCanvas2d.context.globalAlpha = alpha;
      hiddenCanvas2d.context.drawImage(video, x, y, w, h);
      var imagedata = getChromaImageData(hiddenCanvas2d, effect.keyColor, alpha);
      if (imagedata) canvas2d.context.putImageData(imagedata, 0, 0);
    } else {
      // クロマキーが無効ならただ描画するだけでいい
      canvas2d.context.clear();
      canvas2d.context.globalAlpha = alpha;
      canvas2d.context.drawImage(video, x, y, w, h);
    }
  }
  /** getVideoAlpha(video, effect)
   * 動画の不透明度を決定する。
   */
  function getVideoAlpha(video, effect) {
    if (effect.fade === 0) {
      return 1;
    } else {
      var restTime = video.duration - video.currentTime;
      if (video.currentLoop === 0 && video.currentTime < effect.fade) {
        return video.currentTime / effect.fade;
      } else if (video.currentLoop + 1 === effect.loop && restTime < effect.fade) {
        return restTime / effect.fade;
      } else {
        return 1;
      }
    }
  }
  
  /** getChromaImageData(canvas, color, alpha)
   * クロマキーを適用したimgaedataを取得する
   */
  function getChromaImageData(canvas, color, alpha) {
    var w = canvas.width,
        h = canvas.height,
        kr = color.r,
        kg = color.g,
        kb = color.b,
        x, y, k, p = 50, q = 150, a,
        dr, dg, db, dif,
        sr, sg, sb, sa;
    try {
      var imagedata = canvas.context.getImageData(0, 0, w, h);
      for (y = 0 ; y < h ; y++) {
        for (x = 0 ; x < w ; x++) {
          k = 4 * (x + y * w);
          sr = imagedata.data[k + 0];
          sg = imagedata.data[k + 1];
          sb = imagedata.data[k + 2];
          sa = imagedata.data[k + 3];
          dr = Math.abs(sr - kr);
          dg = Math.abs(sg - kg);
          db = Math.abs(sb - kb);
          dif = dr + dg + db;
          if (dif <= p) {
            imagedata.data[k + 3] = 0;
          } else if (dif <= q) {
            a = ((dif - p) / (q - p));
            imagedata.data[k + 0] = (sr * a)|0;
            imagedata.data[k + 1] = (sg * a)|0;
            imagedata.data[k + 2] = (sb * a)|0;
            imagedata.data[k + 3] = (sa * a)|0;
          } else {
          }
        }
      }
      return imagedata;
    } catch (e) {
      return false;
    }
  }
  /** fitNumber(a, b, c)
   * 数値cを最小値a～最大値bの範囲に収める。
   */
  function fitNumber(a, b, c) {
    return Math.min(b, Math.max(a, c));
  }
  /** tryGettingImageData()
   * canvasのgetImageDataが使用可能か？
   * ローカルファイルを直接ブラウザで開いている場合
   * cross-domainに引っかかるので使えない。
   */
  function tryGettingImageData() {
    var img = new Image();
    img.onload = function () {
      var ctx = canvas2d.context;
      ctx.drawImage(img, 0, 0);
      ctx.clear();
      try {
        ctx.getImageData(0, 0, canvas2d.width, canvas2d.height);
        canGetImageData = true;
        console.log('* Successed to execute \'getImageData\'');
      } catch(e) {
        if (canGetImageData) {
          canvasManager.disableGettingImageData();
        }
      }
    };
    img.src = 'EffectGeneratorLibs/sample-bg.jpg';
  }
  /** CanvasManager()
   * 動画の再生と停止を管理するマネージャを作る。
   * WebGLコンテキストが使用できなければ2dコンテキストを使用する。
   */
  function CanvasManager() {
    var self = this;
    this.faderTimer = -1;
    this.canUseWebGL = isEnabledWebGL && !!canvas.getContext('webgl');
    this.chromaTarget = seriously.target(canvas);
    // 動画の停止(WebGL)
    this.stopVideoWebGL = function() {
      self.chromaTarget.source.destroy();
      setTimeout(function(){
        self.chromaTarget.source = seriously.source(transparent);
        self.chromaTarget.go();
      }, 1000 / FPS);
      clearInterval(self.faderTimer);
    };
    // 動画の停止(context2d)
    this.stopVideo2d = function(elm) {
      if (FPS === 60) {
        cancelAnimationFrame(canvas2d.timer);
        canvas2d.timer = requestAnimationFrame(clear);
      } else {
        clearTimeout(canvas2d.timer);
        canvas2d.timer = setTimeout(clear, 1000 / FPS);
      }
      elm.currentTime = 0;
      clear();
      function clear() {
        canvas2d.context.clear();
      }
    };
    var applyChromaKeySetting = function (chroma, color) {
      chroma.screen = [color.r/255, color.g/255, color.b/255, 1]; // [0～1, 0～1, 0～1, 0～1]
      chroma.weight = 1; // 半透明のピクセルから削除する画面の色の量 0～1
      chroma.balance = 1; // 0～1
      chroma.clipBlack = 0.1; // キー付きピクセルの最小結果アルファ値 0～1
      chroma.clipWhite = 1; // キー付きピクセルの最大結果アルファ値 0～1
    };
    // 動画の再生(WebGL)
    this.playVideoWebGL = function(video, effect) {
      setTimeout(function(){
        var target = self.chromaTarget;
        var _video = seriously.source(video);
        if (effect.keycolor !== 'none') {
          var chroma = seriously.effect("chroma");
          applyChromaKeySetting(chroma, effect.keyColor);
          chroma.source = _video;
          target.source = chroma;
        } else {
          target.source = _video;
        }
        target.go();
        video.play();
        clearInterval(self.faderTimer);
        self.faderTimer = setInterval(function(){
          chroma.amount = getVideoAlpha(video, effect);
        }, 1000 / 60);
      }, 1000 / FPS);
    };
    // 動画の再生(context2d)
    this.playVideo2d = function(video, effect) {
      video.frame = 0;
      video.play();
      update();
      function update() {
        if (FPS === 60) {
          cancelAnimationFrame(canvas2d.timer);
          canvas2d.timer = requestAnimationFrame(update);
        } else {
          clearTimeout(canvas2d.timer);
          canvas2d.timer = setTimeout(update, 1000 / FPS);
        }
        drawVideo(video, effect);
      }
    };
    this.playVideo = this.canUseWebGL ? this.playVideoWebGL : this.playVideo2d;
    this.stopVideo = this.canUseWebGL ? this.stopVideoWebGL : this.stopVideo2d;
    this.disableGettingImageData = function() {
      canGetImageData = false;
      this.canUseWebGL = false;
      this.stopVideo = canvasManager.stopVideo2d;
      this.playVideo = canvasManager.playVideo2d;
      console.log('%c* Failed to execute \'getImageData\'', 'color: red;');
    };
    if (!this.canUseWebGL) {
      canvas.style.display = 'none';
    }
  }
  /** addStringMethod()
   * 文字列の変換
   */
  function addStringMethod() {
    window.requestAnimationFrame = 
      window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(callback, element) {
        return window.setTimeout(callback, 1000 / FPS);
      };
    window.cancelAnimationFrame =
      window.cancelAnimationFrame              ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame    ||
      window.oCancelRequestAnimationFrame      ||
      window.msCancelRequestAnimationFrame     ||
      function(id) {
        clearTimeout(id);
      };
    String.prototype.toFuzzy = function(){
      return this
        .toHankakuEisuu()    // 全角の英数記号を半角にする
        .toZenkakuKatakana() // 半角のカタカナを全角にする
        .toKatakana()        // ひらがなをカタカナにする
        .toLowerCase();      // 大文字のアルファベットを小文字にする
    };
    String.prototype.toHankakuEisuu = function(){
      var str = this.replace(/[！-～]/g,
        function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        }
      );
      return str.replace(/”/g, '"')
        .replace(/’/g, '\'')
        .replace(/‘/g, '`')
        .replace(/￥/g, '\\')
        .replace(/　/g, ' ')
        .replace(/〜/g, '~');
    };
    String.prototype.kanaMap = {
      'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
      'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
      'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
      'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
      'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
      'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
      'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
      'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
      'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
      'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
      'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
      'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
      'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
      'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
      'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
      'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
      'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
      'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
      '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
    };
    String.prototype.toZenkakuKatakana = function(){
      var kanaMap = this.kanaMap;
      var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
      return this
          .replace(reg, function (match) {
            return kanaMap[match];
          })
          .replace(/ﾞ/g, '゛')
          .replace(/ﾟ/g, '゜');
    };
    String.prototype.toKatakana = function(){
      return this
        .replace(/[ぁ-ゔ]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0x60);
        })
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜')
        .replace(/(ウ゛)/g, 'ヴ')
        .replace(/(ワ゛)/g, 'ヷ')
        .replace(/(ヰ゛)/g, 'ヸ')
        .replace(/(ヱ゛)/g, 'ヹ')
        .replace(/(ヲ゛)/g, 'ヺ')
        .replace(/(ゝ゛)/g, 'ヾ')
        .replace(/ゝ/g, 'ヽ')
        .replace(/ゞ/g, 'ヾ');
    };
  }
  /** createCanvas2d(id, isDisplay)
   * キャンバスエレメントを作成する。
   */
  function createCanvas2d(id, isDisplay) {
    var cvs = document.createElement('canvas');
    if (!isDisplay) cvs.style.display = 'none';
    cvs.id = id;
    cvs.timer = -1;
    cvs.context = cvs.getContext('2d');
    cvs.context.clear = function() {
      cvs.context.clearRect(0, 0, cvs.width, cvs.height);
    };
    $('#canvas-area').append(cvs);
    return cvs;
  }
  /** createTransparent()
   * 透明1pxの画像を作成する。
   */
  function createTransparent() {
    var img = new Image();
    img.src = 'data:image/png;base64,'
      +'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
    return img;
  }
  /** addCommentStyle()
   * コメントを流す。
   */
  function addCommentStyle() {
    commentHeight = (canvas.height / maxCommentLine)|0;
    var commentSize = (0.74 * commentHeight)|0;
    var commentMargin = (0.12 * commentHeight)|0;
    var css = '.flush-comment{';
    css += 'left:' + canvas.width + 'px;';
    css += 'font-size:' + commentSize + 'px;';
    css += 'transition: transform ' + commentTime + 's linear;';
    css += '-webkit-transition: transform ' + commentTime + 's linear;';
    css += 'line-height:' + commentSize + 'px;';
    css += 'margin-top:' + commentMargin + 'px;}';
    var $head = $('head').eq(0);
    $head.append('<style>'+css+'</style>');
  }
  /** flushComment(comment)
   */
  function flushComment(comment) {
    var iUse = 0;
    for (var i = 0; i < 32; i++) {
      if (!commentLines[i]) {
        iUse = i;
        break;
      }
    }
    commentLines[iUse] = true;
    comment = htmlEscape(comment);
    var $p = $('<p">'+comment+'</p>');
    $p.addClass('flush-comment');
    $p.css('top', (iUse % maxCommentLine) * commentHeight + 'px');
    $canvasArea.append($p);
    var viewTime = 8000;
    var width = $p.width();
    var moveX = canvas.width + width + 20;
    var inTime = viewTime * (width/moveX);
    $p.css('transform', 'translateX(-' + moveX + 'px');
    setTimeout(function(){
      $p.remove();
    }, viewTime);
    setTimeout(function(){
      commentLines[iUse] = false;
    }, inTime);
  }
  /** htmlEscape(str)
   */
  function htmlEscape(str) {
    if (!str) return;
    return str.replace(/[<>&"'`]/g, (match) => {
      const escape = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
      };
      return escape[match];
    });
  }
  /** ajax(opt)
   */
  function ajax(opt) {
    var xhr = new XMLHttpRequest();
    var type = opt.dataType || 'text';
    xhr.open('GET', opt.url, true);
    xhr.responseType = (type === 'xml') ? 'document' : 'text';
    xhr.onreadystatechange = function (event) {
      if (xhr.readyState === 4) {
        if (isLocalFile || xhr.status === 200) {
          if (type === 'xml') {
            var xml = xhr.responseXML;
            if (opt.success) return opt.success(xml);
          } else {
          var data = xhr.responseText;
          if (typeof data === 'string') data = JSON.parse(data);
          if (opt.success) return opt.success(data);
          }
        } else {
          if (opt.error) return opt.error();
        }
      }
    };
    xhr.onerror = function (event) {
      if (opt.error) opt.error();
    };
    xhr.send(null);
  }
};
/** checkMaterials()
 */
window.checkMaterials = function() {
  var materials = document.getElementById('materials');
  var videos = materials.getElementsByTagName('video');
  var imgs = materials.getElementsByTagName('img');
  var sources = [];
  var idx = 0;
  var i, src, ext, video, img;
  for (i = 0; i < videos.length; i++) {
    video = videos[i];
    src = video.src;
    if (src) {
      if (sources.indexOf(src) < 0) {
        sources.push(src);
      } else {
        if (src.lastIndexOf('?') < 0) {
          video.src = src + '?' + (++idx);
        } else {
          video.src = src + (++idx);
        }
      }
    }
  }
  for (i = 0; i < imgs.length; i++) {
    img = imgs[i];
    src = img.src;
    if (src) {
      ext = src.split('.').pop();
      if (ext === 'gif') {
        if (src.indexOf('?') < 0) {
          img.src = src + '?';
        }
      }
    }
  }
};