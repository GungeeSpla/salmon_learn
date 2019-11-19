//# Sound
// STタイマーのものをそのまま流用
function Sound (base, urls) {
	console.log('initializing sound');
	
	var self = this;
	
	this.soundUrlBase = base;
	this.soundUrls    = urls;
	
	// 初期化
	this.volume  = 1;
	this.isMuted = false;
	this.isLoaded = false;
	this.sources = new Array(this.soundUrls.length);
	this.buffers = new Array(this.soundUrls.length);
	this.playing = new Array(this.soundUrls.length, false);
	this.audioContext = (window.AudioContext || window.webkitAudioContext);
	this.noAudioContext = false;
	this.fallbackAudio = document.createElement("audio");
	this.isTested = false;
	
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
	this.loadAll = function (callback) {
		return Promise.all(this.soundUrls.map((v, index, a) =>
			this._load(index)
				.then((buffer) => {
					if (! buffer) return;
					this.buffers[index] = buffer;
				}))).then(function () {
					console.log("preloaded all sounds");
	        self.isLoaded = true;
				  if (callback) callback();
				  if (self.onload) self.onload();
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
	};
	
	//## testPlay ()
	this.testPlay = function () {
		this.isTested = true;
		this.play('silent');
	};
	
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
		loop: false
	};
	
	//## play (index)
	this.play = function (index, _opt) {
		console.log('playing sound ' + index);
		
		// サウンドが無効なら即return
		if (! this.isTested) return;
		
		// オプションをデフォルトオプションに統合する
		opt = {};
		opt.volume = this.defaultOpt.volume;
		opt.loop   = this.defaultOpt.loop;
		if (_opt && typeof _opt.volume !== 'undefined') opt.volume = _opt.volume;
		if (_opt && typeof _opt.loop   !== 'undefined') opt.loop   = _opt.loop;
		
		// indexが文字列（＝ファイル名）だった場合にそれを真のindexに変換する
		index = this.filename2index(index);
		
		// indexが0未満ならば何もできない
		if (index < 0) return ;
		
		
		// _loadを呼び出してbufferの準備ができたら
		return this._load(index).then(buffer => {
			
			// AudioContextがなければfallbackを実行
			if (this.noAudioContext) {
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
			var gainNode = this.audioCtx.createGain();
			var volume = this.volume * opt.volume;
			if (this.isMuted) volume = 0;
			gainNode.gain.value = volume;

			// SourceNodeにループ設定を加える
			source.loop = opt.loop;
			
			// SourceNodeにbufferを代入する
			source.buffer = buffer;
			
			// SourceNode - GainNode - AudioContext.destinationの経路で接続する
			source.connect(gainNode);
			gainNode.connect(this.audioCtx.destination);
			
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
	};
	
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
			this.fallbackAudio.pause();
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
	this._load = function (index) {
		
		// urlを決定
		// indexは数値でなければならない
		var url = this.soundUrlBase + this.soundUrls[index];
		
		// urlに.mp3が含まれるなら何もしない
		if (url.lastIndexOf(".mp3") > -1) ;
		
		// .mp3が含まれないなら.wavを足す
		else url += ".wav";
		
		// AudioContextがなければfallbackを実行
		if (this.noAudioContext) {
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
				if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
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
	};
	
	console.log('initialized sound');
	return this;
}