function init () {
	window.sound = new Sound ();
	sound.loadAll();
	var click      = "click";
	var touchend   = "ontouchend"   in window ? "touchend"   : "mouseup";
	var touchstart = "ontouchstart" in window ? "touchstart" : "mousedown";
	
	createjs.Sound.registerSound("./test.wav","sound");
	createjs.Sound.registerSound("./test.mp3","sound2");
	createjs.Sound.registerSound("./test.ogg","sound3");
	
	$("#sound_item_01").on(touchend, function(e){
		sound.play("test");
	});
		
	$("#sound_item_02").on(touchend, function(e){
		sound.play("test.mp3");
	});
		
	$("#sound_item_03").on(touchend, function(e){
		sound.play("test.ogg");
	});
		
	$("#sound_item_04").on(touchstart, function(e){
		sound.play("test");
	});
		
	$("#sound_item_05").on(click, function(e){
		sound.play("test");
	});
		
	$("#sound_item_06").on(touchend, function(e){
		sound.play("test", {doUseGainNode: false});
	});
		
	$("#sound_item_07").on(touchend, function(e){
		sound.play("test", {doUseAudioContext: false});
	});
		
	$("#sound_item_08").on(touchstart, function(e){
		sound.play("test", {doUseGainNode: false});
	});
	
	$("#sound_item_09").on(touchstart, function(e){
		var instance = createjs.Sound.play("sound");
		instance.play();
	});
	
	$("#sound_item_10").on(touchend, function(e){
		var instance = createjs.Sound.play("sound");
		instance.play();
	});
	
	$("#sound_item_11").on(touchend, function(e){
		var instance = createjs.Sound.play("sound2");
		instance.play();
	});
	
	$("#sound_item_12").on(touchend, function(e){
		var instance = createjs.Sound.play("sound2");
		instance.volume = 0.3;
		instance.play();
	});
}



//# StSound ()
function Sound (urlBase, soundUrls, enable) {
	var self = this;
	
	// 引数を代入していく
	this.soundUrlBase = urlBase   || "./";
	this.soundUrls    = soundUrls || [
		"test",
		"test.mp3",
		"test.ogg"
	];
	this.enable       = true;
	this.disable      = false;
	
	// 初期化
	this.volume  = 1;
	this.isMuted = false;
	this.sources = new Array(this.soundUrls.length);
	this.buffers = new Array(this.soundUrls.length);
	this.playing = new Array(this.soundUrls.length, false)
	this.audioContext = (window.AudioContext || window.webkitAudioContext);
	this.noAudioContext = false;
	this.fallbackAudio = document.createElement("audio");;
	
	// AudioContextが使用可能ならそのコンテキストを使う
	if (this.audioContext !== undefined) {
		this.audioCtx = new this.audioContext();
		this.audioCtx.createGain = this.audioCtx.createGain || this.audioCtx.createGainNode;
	}
	
	// AudioContextが使用不可ならば<audio>エレメントを使う
	else {
		this.noAudioContext = true;
	}
	
	//## loadAll ()
	this.loadAll = function () {
		return Promise.all(this.soundUrls.map((v, index, a) =>
			this._load(index)
				.then((buffer) => {
					if (! buffer) return;
					this.buffers[index] = buffer;
				}))).then(function () {
					console.log("✅ 音声データをすべてプリロードしました.");
				});
	};
	
	//## playSilent ()
	this.playSilent = function () {
		// 無音のBufferを生成して再生する
		// iOSやChromeのサウンド再生制限の解除に用いる
		this.audioCtx.resume();
		var buf = this.audioCtx.createBuffer(1, 1, 22050);
		var src = this.audioCtx.createBufferSource();
		src.buffer = buf;
		src.connect(this.audioCtx.destination);
		src.start(0);
	}
	
	
	//## filename2index (filename)
	this.filename2index = function (filename) {
		
		// filenameが文字列じゃなければfilenameをそのまま返す
		if (typeof filename != "string") return filename;
		
		// soundUrlsの中をサーチ
		var idx = this.soundUrls.indexOf(filename);
		
		// 見つかったらそれを返す
		if (idx > -1) {
			return idx;
		}
		
		// 見つからなかったら
		else {
			// filenameに".mp3"を加えてもう一度サーチし
			// その結果を返す（これでも見つからなければ-1が返る）
			return this.soundUrls.indexOf(filename + ".mp3");
		}
	};
	
	//## defaultOpt
	// play()のデフォルトオプションを新設
	this.defaultOpt = {
		volume: 1,
		loop: false,
		doUseGainNode: true,
		doUseAudioContext: true
	};
	
	//## play (index)
	this.play = function (index, opt) {
		
		// サウンドが無効なら即return
		if (! this.enable || this.disable) return;
		
		// オプションをデフォルトオプションに統合する
		opt = $.extend({}, this.defaultOpt, opt);
		
		// indexが文字列（＝ファイル名）だった場合にそれを真のindexに変換する
		index = this.filename2index(index);
		
		// indexが0未満ならば何もできない
		if (index < 0) return ;
		
		/*
		// 再生中だったら停止する処理を入れようと思ったが
		// どうも動作がおかしくなるので廃止
		if (this.playing[index]) {
			this.stop(index);
		}
		*/
		
		// _loadを呼び出してbufferの準備ができたら
		return this._load(index, opt).then(buffer => {
			
			// AudioContextがなければfallbackを実行
			if (this.noAudioContext || !opt.doUseAudioContext) {
				this.fallbackAudio.volume = this.volume;
				this.fallbackAudio.currentTime = 0;
				this.fallbackAudio.play();
				return;
			}
			
			// AudioContextを再開する
			this.audioCtx.resume();
			
			// AudioBufferSourceNodeを生成するが
			var source = this.audioCtx.createBufferSource();
			
			// なんかfalseになっちゃったら何もできない
			if (! source) return;

			// GainNodeを生成（音量の調節）
			if (opt.doUseGainNode) {
				var gainNode = this.audioCtx.createGain();
				var volume = this.volume * opt.volume;
				if (this.isMuted) volume = 0;
				gainNode.gain.value = volume;
			}

			// SourceNodeにループ設定を加える
			source.loop = opt.loop;
			
			// SourceNodeにbufferを代入する
			source.buffer = buffer;
			
			// SourceNode - GainNode - AudioContext.destinationの経路で接続する
			if (opt.doUseGainNode) {
				source.connect(gainNode).connect(this.audioCtx.destination);
			} else {
				source.connect(this.audioCtx.destination);
			}
			
			// 再生が終わったら
			// 注1: ループ再生の場合はonendedは呼ばれない。また
			// 注2: 外部からstopをかけられた場合も呼ばれる
			source.onended = function () {
				this.stop(index);
			};
			
			// フラグを立てる
			this.sources[index] = source;
			this.playing[index] = true;
			
			// 再生を開始する
			source.start(0);
		});
	}
	
	//## stop (index)
	this.stop = function (index) {
		
		// indexが文字列（＝ファイル名）だった場合にそれを真のindexに変換する
		index = this.filename2index(index);
		
		// indexが0未満ならば何もできない
		if (index < 0) return ;
		
		// playing配列のindex番目にアクセスしフラグを折る
		this.playing[index] = false;
		
		// ソースがあればストップをかける
		if (this.sources[index]) {
			this.sources[index].stop(0);
		}
		
		// AudioContextがなければfallbackを実行
		if (this.noAudioContext) {
			fallbackAudio.pause();
		}
	}
	
	//## stopAll ()
	// 再生中のすべての音声を停止する
	this.stopAll = function () {
		for (var i = 0; i < this.playing.length; i++) {
			if (this.playing[i]) {
				this.stop(i);
			}
		}
	};
	
	//## _load (index)
	this._load = function (index, opt) {
		
		// オプションをデフォルトオプションに統合する
		opt = $.extend({}, this.defaultOpt, opt);
		
		// urlを決定
		// indexは数値でなければならない
		var url = this.soundUrlBase + this.soundUrls[index];
		
		// urlに.mp3が含まれるなら
		if (url.lastIndexOf(".mp3") > -1) ;
		
		// urlに.oggが含まれるなら
		else if (url.lastIndexOf(".ogg") > -1) ;
		
		// .mp3が含まれないなら.wavを足す
		else url += ".wav";
		
		// AudioContextがなければfallbackを実行
		if (this.noAudioContext || !opt.doUseAudioContext) {
			this.fallbackAudio.src = url;
			return new Promise((resolve, reject) => {
				resolve(null);
			});
		}
		
		// AudioContextを再開する
		this.audioCtx.resume();
		
		// まずはキャッシュをチェックする
		var buffer = this.buffers[index];
		
		// キャッシュにあればそれを返せばいい
		if (!! buffer == true) {
			return new Promise((resolve, reject) => {
				resolve(buffer);
			});
		}
		
		// キャッシュになければXMLHttpRequestを生成
		// @ref https://qiita.com/cortyuming/items/b6e3784d08d7a90b3614
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.responseType = "arraybuffer";
			xhr.onload = () => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					this.audioCtx.decodeAudioData(xhr.response, function (decodedBuffer) {
						resolve(decodedBuffer);
					});
				} else {
					reject(new Error(xhr.statusText));
				}
			};
			xhr.onerror = () => {
				reject(new Error(xhr.statusText));
			};
			xhr.send(null);
		});
	}
	
	return this;
}