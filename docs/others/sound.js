function Sound () {
	var self = this;
	this.soundUrls = ["./sound.mp3"];
	this.volume  = 1;
	this.sources = new Array(this.soundUrls.length);
	this.buffers = new Array(this.soundUrls.length);
	this.playing = new Array(this.soundUrls.length, false)
	this.audioContext = (window.AudioContext || window.webkitAudioContext);
	this.noAudioContext = false;
	this.fallbackAudio = document.createElement("audio");
	if (this.audioContext !== undefined) {
		this.audioCtx = new this.audioContext();
		this.audioCtx.createGain = this.audioCtx.createGain || this.audioCtx.createGainNode;
	} else {
		this.noAudioContext = true;
	}
	this.loadAll = function () {
		return Promise.all(this.soundUrls.map((v, index, a) =>
			this._load(index)
				.then((buffer) => {
					if (! buffer) return;
					this.buffers[index] = buffer;
				}))).then(function () {
				});
	};
	this.playSilent = function () {
		this.audioCtx.resume();
		var buf = this.audioCtx.createBuffer(1, 1, 22050);
		var src = this.audioCtx.createBufferSource();
		src.buffer = buf;
		src.connect(this.audioCtx.destination);
		src.start(0);
	};
	this.defaultOpt = {
		volume: 1,
		loop: false
	};
	this.play = function (index, opt) {
		opt = $.extend({}, this.defaultOpt, opt);
		return this._load(index).then(buffer => {
			if (this.noAudioContext) {
				this.fallbackAudio.volume = this.volume;
				this.fallbackAudio.currentTime = 0;
				this.fallbackAudio.play();
				return;
			}
			this.audioCtx.resume();
			var source = this.audioCtx.createBufferSource();
			if (! source) return;
			var gainNode = this.audioCtx.createGain();
			var volume = this.volume * opt.volume;
			if (this.isMuted) volume = 0;
			gainNode.gain.value = volume;
			source.loop = opt.loop;
			source.buffer = buffer;
			source.connect(gainNode);
			gainNode.connect(this.audioCtx.destination);
			source.onended = function () {
				this.stop(index);
			};
			this.sources[index] = source;
			this.playing[index] = true;
			source.start(0);
		});
	}
	
	//## stop (index)
	this.stop = function (index) {
		this.playing[index] = false;
		if (this.sources[index]) {
			this.sources[index].stop(0);
		}
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
	this._load = function (index) {
		var url = this.soundUrls[index];
		if (this.noAudioContext) {
			this.fallbackAudio.src = url;
			return new Promise((resolve, reject) => {
				resolve(null);
			});
		}
		this.audioCtx.resume();
		var buffer = this.buffers[index];
		if (!! buffer == true) {
			return new Promise((resolve, reject) => {
				resolve(buffer);
			});
		}
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