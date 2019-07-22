function init2 () {
	window.smCountApp = new SmCountApp();
}

//# SmCountApp ()
function SmCountApp () {
	
	var app = this;
	this.frame           = 0;
	this.frameWave       = 0;
	this.bWave           = 0;
	this.wave            = 0;
	this.isPlaying       = false;
	this.isChanging      = false;
	this.bTime           = 0;
	this.bTimeWave       = 0;
	this.time            = 0;
	this.timeWave        = 0;
	this.startTime       = 0;
	this.norma           = "middle";
	this.useDefine       = null;
	this.startDate       = null;
	this.nowDate         = null;
	this.timeoutId       = -1;
	this.framePerSec     = 30;
	this.timeoutDuration = 1000 / this.framePerSec;
	this.wave1Time       = 3548;
	this.wave2Time       = 123583;
	this.wave3Time       = 243797;
	this.wave4Time       = 355000;;
	this.clickEvent       = "ontouchstart" in window ? "touchstart" : "click";
	
	//## getJqueryObject ()
	this.getJqueryObject = function () {
		this.$buttonStart = $(".smcount_button_start");
		this.$buttonStart.on(this.clickEvent, function (e) {
			app.start();
		});
		this.$buttonStop = $(".smcount_button_stop");
		this.$buttonStop.on(this.clickEvent, function (e) {
			app.stop();
		});
		this.$buttonVplus = $(".smcount_button_vplus");
		this.$buttonVplus.on(this.clickEvent, function (e) {
			var move = + 0.1;
			app.sound.volume = Math.min(1, app.sound.volume + move);
			if (! app.isPlaying) {
				app.sound.play("start");
			}
		});
		this.$buttonVminus = $(".smcount_button_vminus");
		this.$buttonVminus.on(this.clickEvent, function (e) {
			var move = - 0.1;
			app.sound.volume = Math.max(0, app.sound.volume + move);
			if (! app.isPlaying) {
				app.sound.play("start");
			}
		});
		this.$buttonKasoku = $(".smcount_button_kasoku");
		this.$buttonKasoku.on(this.clickEvent, function (e) {
			if (app.isPlaying) {
				var move = - 200;
				app.startTime = app.startTime + move;
				app.startDate = new Date(app.startTime);
			}
		});
		this.$buttonGensoku = $(".smcount_button_gensoku");
		this.$buttonGensoku.on(this.clickEvent, function (e) {
			if (app.isPlaying) {
				var move = + 200;
				app.startTime = app.startTime + move;
				app.startDate = new Date(app.startTime);
			}
		});
		this.$buttonMiddle = $(".smcount_button_middle");
		this.$buttonMiddle.on(this.clickEvent, function (e) {
			app.norma     = "middle";
			app.useDefine = app.getUseDefine(app.norma);
		});
		this.$buttonHigh = $(".smcount_button_high");
		this.$buttonHigh.on(this.clickEvent, function (e) {
			app.norma     = "high";
			app.useDefine = app.getUseDefine(app.norma);
		});
		this.$buttonLow = $(".smcount_button_low");
		this.$buttonLow.on(this.clickEvent, function (e) {
			app.norma     = "low";
			app.useDefine = app.getUseDefine(app.norma);
		});
		this.$startDate = $(".smcount_start_date");
		this.$debug = $(".smcount_debug");
	};
	
	//## start ()
	this.start = function () {
		if (this.isPlaying) this.stop();
		this.frame     = 0;
		this.frameWave = 0;
		this.bTime     = 0;
		this.bTimeWave = 0;
		this.time      = 0;
		this.timeWave  = 0;
		this.bWave     = 0;
		this.wave      = 0;
		this.useDefine = this.getUseDefine(this.norma);
		this.isPlaying = true;
		this.startDate = new Date();
		this.startTime = this.startDate.getTime();
		this.wave1Date = new Date(this.startTime + this.wave1Time);
		this.wave1Date = new Date(this.startTime + this.wave2Time);
		this.wave1Date = new Date(this.startTime + this.wave3Time);
		this.loop();
	};
	
	//## getUseDefine ()
	this.getUseDefine = function (norma) {
		switch (norma) {
		case "high":
			return this.SMCOUNT_DEFINE_HIGH;
			break;
		case "low":
			return this.SMCOUNT_DEFINE_LOW;
			break;
		default:
		case "middle":
			return this.SMCOUNT_DEFINE_MIDDLE;
			break;
		}
	};
	
	//## stop ()
	this.stop = function () {
		clearTimeout(this.timeoutId);
		this.$debug.empty();
		this.startDate = null;
		this.isPlaying = false;
		this.sound.stop();
	};
	
	//## init ()
	this.init = function () {
		this.defineSmCount();
		this.getJqueryObject();
		this.sound = this.createSmSound();
		this.sound.loadAll();
	};
	
	//## update ()
	this.update = function () {
		this.isChanging = false;
		// 直前のデータを保存
		this.bTime = this.time;
		this.bWave = this.wave;
		this.bTimeWave = this.timeWave;
		// 時刻の計算
		this.nowDate = new Date();
		this.time = this.nowDate - this.startDate;
		// フレームの増加
		this.frame++;
		this.frameWave++;
		// 現在のWave判定
		if (this.time < this.wave1Time) {
			this.wave = 0;
			this.timeWave = this.time;
		}
		else if (this.time < this.wave2Time) {
			this.wave = 1;
			this.timeWave = this.time - this.wave1Time;
		}
		else if (this.time < this.wave3Time) {
			this.wave = 2;
			this.timeWave = this.time - this.wave2Time;
		}
		else if (this.time < this.wave4Time) {
			this.wave = 3;
			this.timeWave = this.time - this.wave3Time;
		}
		else {
			this.wave = 4;
			this.timeWave = this.time - this.wave4Time;
		}
		// フレームのリセット
		if (this.wave != this.bWave) {
			this.isChanging = true;
			this.frameWave = 0;
		}
	};
	
	//## sounder ()
	this.sounder = function () {
		if (this.wave == 0) {
			if (this.frameWave == 1) {
				this.sound.play("switch");
			}
		}
		else if (this.wave < 4) {
			var time1 = Math.floor(this.bTimeWave / 1000);
			var time2 = Math.floor(this.timeWave / 1000);
			if (time1 != time2) {
				var key = 110 - time2;
				var soundName = this.useDefine[key];
				if (typeof soundName == "string") {
					if (soundName.indexOf(",") > -1) {
						soundName = soundName.split(",")[this.wave - 1];
					}
					this.sound.play(soundName);
				}
			}
		}
		else {
			if (this.frameWave == 30) {
				this.sound.play("otsukare");
			}
			if (this.frameWave > 100) {
				this.stop();
			}
		}
	};
	
	//## render ()
	this.render = function () {
		var norma = this.norma;
		var wave = this.wave;
		var volume = this.sound.volume.toFixed(1);
		var time = wave ? ((110000 - this.timeWave)/1000).toFixed(3): "";
		this.$debug.html(""
			+ "volume: " + volume + "<br>"
			+ "norma: " + norma + "<br>"
			+ "wave: " + wave + "<br>"
			+ "time: " + time + "<br>"
		);
	};
	
	//## loop ()
	// ループ関数です
	this.loop = function () {
		// console.log("looping.");
		// 次回を予約
		clearTimeout(app.timeoutId);
		app.timeoutId = setTimeout(app.loop, app.timeoutDuration);
		// アップデートと描画
		if (app.isPlaying) {
			app.update();
			app.render();
			app.sounder();
		}
	};

	//## createSmSound ()
	this.createSmSound = function () {
		var smSound = new StSound();
		smSound.soundUrlBase = "./countsounds/";
		smSound.soundUrls = this.getUniqueValueArrayOfSmCount();
		smSound.soundUrls.push("switch");
		smSound.soundUrls.push("otsukare");
		smSound.enable  = true;
		smSound.sources = new Array(smSound.soundUrls.length);
		smSound.buffers = new Array(smSound.soundUrls.length);
		smSound.playing = new Array(smSound.soundUrls.length, false);
		return smSound;
	};

	//## getUniqueValueArrayOfSmCount ()
	this.getUniqueValueArrayOfSmCount = function () {
		var uniqueArray = [];
		var defineObjectArray = [
			this.SMCOUNT_DEFINE_HIGH,
			this.SMCOUNT_DEFINE_MIDDLE,
			this.SMCOUNT_DEFINE_LOW
		];
		defineObjectArray.forEach(function(defineObject){
			var keys = Object.keys(defineObject);
			keys.forEach(function(key){
				var valueArray;
				var value = defineObject[key];
				if (value.indexOf(",") > -1) {
					valueArray = value.split(",");
				} else valueArray = [value];
				valueArray.forEach(function(v){
					if (v && uniqueArray.indexOf(v) < 0) {
						uniqueArray.push(v);
					}
				});
			});
		});
		return uniqueArray;
	};
	
	//## defineSmCount ()
	this.defineSmCount = function () {
		this.SMCOUNT_DEFINE_HIGH = {
			"110": "10,wave2,wave3",
			"109": "9,,",
			"108": "8,,",
			"107": "7,,",
			"106": "6,,",
			"105": "5,,",
			"104": "4,,",
			"103": "3,3,3",
			"102": "2,2,2",
			"101": "1,1,1",
			"100": "start",
			"99": "",
			"98": "",
			"97": "",
			"96": "",
			"95": "",
			"94": "",
			"93": "3",
			"92": "2",
			"91": "1",
			"90": "90b",
			"89": "",
			"88": "",
			"87": "",
			"86": "",
			"85": "",
			"84": "",
			"83": "3",
			"82": "2",
			"81": "1",
			"80": "80b",
			"79": "",
			"78": "",
			"77": "",
			"76": "",
			"75": "",
			"74": "",
			"73": "3",
			"72": "2",
			"71": "1",
			"70": "70b",
			"69": "",
			"68": "",
			"67": "",
			"66": "",
			"65": "",
			"64": "",
			"63": "",
			"62": "3",
			"61": "2",
			"60": "1",
			"59": "59b",
			"58": "",
			"57": "",
			"56": "",
			"55": "",
			"54": "",
			"53": "",
			"52": "3",
			"51": "2",
			"50": "1",
			"49": "49b",
			"48": "norma",
			"47": "",
			"46": "",
			"45": "",
			"44": "",
			"43": "",
			"42": "3",
			"41": "2",
			"40": "1",
			"39": "39b",
			"38": "",
			"37": "",
			"36": "",
			"35": "",
			"34": "",
			"33": "",
			"32": "",
			"31": "3",
			"30": "2",
			"29": "1",
			"28": "28b",
			"27": "",
			"26": "",
			"25": "",
			"24": "",
			"23": "",
			"22": "",
			"21": "3",
			"20": "2",
			"19": "1",
			"18": "18b",
			"17": "",
			"16": "",
			"15": "",
			"14": "",
			"13": "",
			"12": "",
			"11": "3",
			"10": "2",
			"9" : "1",
			"8" : "8b",
			"7" : "",
			"6" : "",
			"5" : "",
			"4" : "",
			"3" : "3",
			"2" : "2",
			"1" : "1",
			"0" : "finish"
		};
		this.SMCOUNT_DEFINE_MIDDLE = {
			"110": "10,wave2,wave3",
			"109": "9,,",
			"108": "8,,",
			"107": "7,,",
			"106": "6,,",
			"105": "5,,",
			"104": "4,,",
			"103": "3,3,3",
			"102": "2,2,2",
			"101": "1,1,1",
			"100": "start",
			"99": "",
			"98": "",
			"97": "",
			"96": "",
			"95": "",
			"94": "",
			"93": "",
			"92": "",
			"91": "3",
			"90": "2",
			"89": "1",
			"88": "88b",
			"87": "",
			"86": "",
			"85": "",
			"84": "",
			"83": "",
			"82": "",
			"81": "",
			"80": "",
			"79": "3",
			"78": "2",
			"77": "1",
			"76": "76b",
			"75": "",
			"74": "",
			"73": "",
			"72": "",
			"71": "",
			"70": "",
			"69": "",
			"68": "",
			"67": "3",
			"66": "2",
			"65": "1",
			"64": "64b",
			"63": "",
			"62": "",
			"61": "",
			"60": "",
			"59": "",
			"58": "",
			"57": "",
			"56": "",
			"55": "3",
			"54": "2",
			"53": "1",
			"52": "52b",
			"51": "",
			"50": "norma",
			"49": "",
			"48": "",
			"47": "",
			"46": "",
			"45": "",
			"44": "",
			"43": "3",
			"42": "2",
			"41": "1",
			"40": "40b",
			"39": "",
			"38": "",
			"37": "",
			"36": "",
			"35": "",
			"34": "",
			"33": "",
			"32": "",
			"31": "3",
			"30": "2",
			"29": "1",
			"28": "28b",
			"27": "",
			"26": "",
			"25": "",
			"24": "",
			"23": "",
			"22": "",
			"21": "",
			"20": "",
			"19": "3",
			"18": "2",
			"17": "1",
			"16": "16b",
			"15": "",
			"14": "",
			"13": "",
			"12": "",
			"11": "",
			"10": "",
			"9" : "",
			"8" : "",
			"7" : "3",
			"6" : "2",
			"5" : "1",
			"4" : "4b",
			"3" : "3",
			"2" : "2",
			"1" : "1",
			"0" : "finish"
		};
		this.SMCOUNT_DEFINE_LOW = {
			"110": "10",
			"109": "9",
			"108": "8",
			"107": "7",
			"106": "6",
			"105": "5",
			"104": "4",
			"103": "3,3,3",
			"102": "2,2,2",
			"101": "1,1,1",
			"100": "100b",
			"99": "",
			"98": "",
			"97": "",
			"96": "",
			"95": "",
			"94": "",
			"93": "",
			"92": "",
			"91": "",
			"90": "",
			"89": "3",
			"88": "2",
			"87": "1",
			"86": "86b",
			"85": "",
			"84": "",
			"83": "",
			"82": "",
			"81": "",
			"80": "",
			"79": "",
			"78": "",
			"77": "",
			"76": "",
			"75": "3",
			"74": "2",
			"73": "1",
			"72": "72b",
			"71": "",
			"70": "",
			"69": "",
			"68": "",
			"67": "",
			"66": "",
			"65": "",
			"64": "",
			"63": "",
			"62": "",
			"61": "",
			"60": "3",
			"59": "2",
			"58": "1",
			"57": "57b",
			"56": "",
			"55": "",
			"54": "",
			"53": "",
			"52": "",
			"51": "",
			"50": "norma",
			"49": "",
			"48": "",
			"47": "",
			"46": "3",
			"45": "2",
			"44": "1",
			"43": "43b",
			"42": "",
			"41": "",
			"40": "",
			"39": "",
			"38": "",
			"37": "",
			"36": "",
			"35": "",
			"34": "",
			"33": "",
			"32": "",
			"31": "3",
			"30": "2",
			"29": "1",
			"28": "28b",
			"27": "",
			"26": "",
			"25": "",
			"24": "",
			"23": "",
			"22": "",
			"21": "",
			"20": "",
			"19": "",
			"18": "",
			"17": "3",
			"16": "2",
			"15": "1",
			"14": "14b",
			"13": "",
			"12": "",
			"11": "",
			"10": "",
			"9": "",
			"8": "",
			"7": "",
			"6": "",
			"5": "",
			"4": "",
			"3" : "3",
			"2" : "2",
			"1" : "1",
			"0" : "finish"
		};
	};
	
	this.init();
	
	return this;
}