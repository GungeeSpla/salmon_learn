
window.smCountApp = new SmCountApp();

//# SmCountApp ()
// SMcountを動かすオブジェクトを作成するコンストラクタ
function SmCountApp () {
	
	var app = this;
	
	this.uniqueSoundNames = [];
	this.noSoundName_    = "bgmtest.mp3";
	this.noSoundName     = "nosound.mp3";
	this.isBookedStop    = false;
	this.mode            = "counter";
	this.isRunning       = false;
	this.isStarted       = false;
	this.isUseStTimer    = false;
	this.isDebug         = false;
	this.frame           = 0;
	this.frameWave       = 0;
	this.frameCycle      = 0;
	this.bWave           = 0;
	this.wave            = 0;
	this.bCycle          = 0;
	this.cycle           = 0;
	this.nextCycle       = 0;
	this.isPlaying       = false;
	this.isChangingWave  = false;
	this.isChangingCycle = false;
	this.isChangingSec   = false;
	this.secWave         = 0;
	this.bTime           = 0;
	this.bTimeWave       = 0;
	this.time            = 0;
	this.timeWave        = 0;
	this.timeWaveLeft    = 0;
	this.timeCycle       = 0;
	this.timeCycleLeft   = 0;
	this.startTime       = 0;
	this.normaType       = "middle";
	this.useDefine       = null;
	this.useCycle        = null;
	this.startDate       = null;
	this.nowDate         = null;
	this.timeoutId       = -1;
	this.framePerSec     = 60;
	this.timeoutDuration = 1000 / this.framePerSec;
	this.waveTimes       = [3348, 123383, 243597, 355000];
	this.clickEvent      = "ontouchend" in window ? "touchend" : "click";
	this.sound           = null;
	this.soundParty      = {};
	
	//## init ()
	// このコンストラクタが呼ばれたときに一度だけ呼び出す関数
	this.init = function () {
		
		// SMcountの定義を行う
		this.defineSmCount();
		
		// Soundオブジェクトを作る
		this.soundParty["bouyomichan"] = this.createSmSound("bouyomichan", false, "wav");
		this.soundParty["gungee"]      = this.createSmSound("gungee", false, "mp3");
		this.soundParty["akira"]       = this.createSmSound("akira", false, "mp3");
		
		// 使うサウンドを決定
		this.sound = this.soundParty[settingApp.usingVoice];
	};
	
	//## loop ()
	// ループ関数です
	this.loop = function () {
		app.debugLog("looping.");
		// 次回を予約
		clearTimeout(app.timeoutId);
		app.timeoutId = setTimeout(app.loop, app.timeoutDuration);
		// アップデートと描画
		if (app.isPlaying) {
			app.update();  // 情報のアップデート
			app.render();  // 画面の更新
			app.sounder(); // 効果音の再生
			// 終了判定
			if (app.wave >= 4 && app.secWave >= 2) {
				app.isPlaying = false;
				app.isBookedStop = true;
				setTimeout(function () {
					app.isBookedStop = false;
					app.isPlaying = true;
					app.$buttonStart.trigger(app.clickEvent);
					// STタイマーと併用する場合
					// STタイマーの画面に遷移する
					if (app.isUseStTimer) {
						window.stTimerApp.changeMode("timer");
					}
				}, 1000);
			}
		}
	};
	
	//## update ()
	// 情報のアップデート
	this.update = function () {
		this.isChangingSec = false;
		this.isChangingWave = false;
		this.isChangingCycle = false;
		
		// 直前のデータを保存
		this.bTime     = this.time;
		this.bWave     = this.wave;
		this.bTimeWave = this.timeWave;
		this.bCycle    = this.cycle;
		
		// 時刻の計算
		this.nowDate = new Date();
		this.time = this.nowDate - this.startDate;
		
		// フレームの増加
		this.frame++;
		this.frameWave++;
		this.frameCycle++;
		
		// 現在のWave判定
		this.updateWave();
		
		// 現在のCycle判定
		this.updateCycle();
		
		// フレームのリセット
		// Waveが切り替わったら
		if (this.wave != this.bWave) {
			this.isChangingWave = true;
			this.frameWave = 0;
		}
		if (this.cycle != this.bCycle) {
			this.frameCycle = 0;
		}
	};
	
		//## updateWave ()
		this.updateWave = function () {
			var isDecided = false;
			var start = 110000;
			var waveTime, waveTimeB;
			for (var i = 0; i < this.waveTimes.length; i++) {
				waveTime = this.waveTimes[i];
				if (this.time < waveTime) {
					isDecided = true;
					this.wave = i;
					waveTimeB = i > 0 ? this.waveTimes[i - 1] : 0;
					this.timeWave = this.time - waveTimeB;
					this.timeWaveLeft = start - this.timeWave;
					break;
				}
			}
			if (! isDecided) {
				this.wave = 4;
				this.timeWave = this.time - waveTime;
				this.timeWaveLeft = 0;
			}
			
			// 直前及び現在の残り秒数（小数点以下切り捨て）を計算する
			var time1 = Math.floor(this.bTimeWave / 1000);
			var time2 = Math.floor(this.timeWave / 1000);
			// これが異なるということはちょうど秒数が切り替わったということ
			this.isChangingSec = (time1 != time2);
			this.secWave = time2;
		};
	
		//## updateCycle ()
		this.updateCycle = function () {
			// eg. useCycle = [100 000, 88 000, 76 000, ... , 0]
			var isDecided = false;
			var start = 110000;
			for (var i = 0; i < this.useCycle.length; i++) {
				var cycleTime = this.useCycle[i];
				var cycleTimeB = i > 0 ? this.useCycle[i - 1] : start;
				var timeLeft = start - this.timeWave;
				if (timeLeft > cycleTime) {
					isDecided = true;
					this.cycle = i;
					this.nextCycle = this.useCycle[i];
					this.timeCycle = cycleTimeB - cycleTime;
					this.timeCycleLeft = timeLeft - cycleTime;
					break;
				}
			}
			if (! isDecided) {
				this.cycle = i;
				this.nextCycle = 0;
				this.timeCycle = 0;
				this.timeCycleLeft = 0;
			}
		};
	
	//## sounder ()
	// 効果音を鳴らす
	this.sounder = function () {
		// Waveが始まる前ならば
		if (this.wave == 0) {
			// frameWave==1でswitchを鳴らす
			if (this.frameWave == 1) {
				// this.sound.play("switch");
			}
		}
		// Wave1以降ならば
		else {
			// Wave 1, 2, 3ならば
			if (this.wave <= 3 && this.isChangingSec) {
				// useDefineから取り出すkeyを計算
				var key = 110 - this.secWave;
				var soundName = this.useDefine[key];
				// soundNameが空ではない文字列ならば
				if (typeof soundName == "string" && soundName != "") {
					// もしコンマが含まれるならコンマでsplitしてwave数で取り出す
					if (soundName.indexOf(",") > -1) {
						soundName = soundName.split(",")[this.wave - 1];
					}
					// 再生
					this.sound.play(soundName);
				}
			}
			// Wave3が終わった後ならば
			else if (this.isChangingSec) {
				switch (this.secWave) {
				case 1:
					this.sound.play("otsukare");
					break;
				}
			}
		}
	};
	
	//## render ()
	// 画面の更新
	this.render = function () {
		if (this.mode != "counter") return;
		this.renderDOM();
		this.ctx.globalAlpha = 1;
		this.clearCanvas();
		this.renderCanvas();
	};
		
		//## clearRender ()
		this.clearRender = function () {
			this.$wave.text(1);
			this.$sec.text(100);
			this.clearCanvas();
		};
		
		//## renderDOM ()
		this.renderDOM = function () {
			var wave = this.wave;
			var sec = Math.floor(this.timeWaveLeft / 1000) + 1;
			if (wave <= 0) sec = 110;
			else if (wave >= 4) sec = 0;
			this.$sec.text(Math.max(0, sec));
			this.$wave.text(Math.min(3, Math.max(1, wave)));
			//var time = this.wave == 0 ? 110000 + this.wave1Time : this.wave < 4 ? 110000 : 0;
			//    time = (0, (time - this.timeWave)/1000).toFixed(3);
			if (this.isDebug) {
				this.$debug.html(""
					+ "<span style='color: Orange'>wave</span> " + this.wave + "<br>"
					+ "<span style='color: Orange'>frameWave</span> " + this.frameWave + "<br>"
					+ "<span style='color: Orange'>timeWave</span> " + this.timeWave + "<br>"
					+ "<span style='color: Orange'>secWave</span> " + this.secWave + "<br>"
					/*
					+ "<span style='color: Orange'>norma</span> " + this.getNorma(this.wave, this.normaType) + "<br>"
					+ "<span style='color: Orange'>timeWave</span> " + this.timeWave + "<br>"
					+ "<span style='color: Orange'>timeWaveLeft</span> " + this.timeWaveLeft + "<br>"
					+ "<span style='color: Orange'>cycle</span> " + this.cycle + "<br>"
					+ "<span style='color: Orange'>timeCycle</span> " + this.timeCycle + "<br>"
					+ "<span style='color: Orange'>timeCycleLeft</span> " + this.timeCycleLeft + "<br>"
					+ "<span style='color: Orange'>音量</span> " + this.sound.volume.toFixed(1) + "<br>"
					*/
				);
			}
		};
		
		//## renderCanvas ()
		this.renderCanvas = function () {
			var progress, isClockwise, sec;
			if (this.wave <= 1 && this.cycle == 0) {
				var timeWave = Math.max(0, this.time - this.waveTimes[0]);
				progress = 1 - this.time / (10000 + this.waveTimes[0]);
				isClockwise = false;
				sec = Math.floor(10 - timeWave / 1000) + 1;
				// if (sec > 10) sec = 10;
				if (sec > 10) sec = "";
			}
			else if (1 <= this.wave && this.wave <= 3 && this.timeWaveLeft >= 0) {
				progress = this.timeCycleLeft / this.timeCycle;
				isClockwise = (this.cycle % 2 == 1);
				sec = Math.floor(this.timeCycleLeft / 1000) + 1;
			}
			else {
				progress = 1;
				isClockwise = (this.cycle % 2 == 1);
				sec = 0;
			}
			if (sec == 0 && this.cycle == this.useCycle.length) {
				this.ctx.globalAlpha = Math.max(0, 1 - this.frameCycle / this.framePerSec);
			}
			if (this.wave == 4) {
				this.ctx.globalAlpha = 0;
			}
			this.renderCountdown(progress, isClockwise, sec, this.nextCycle);
		};
		
		//## clearCanvas ()
		// Canvasをクリアします
		this.clearCanvas = function () {
			this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
		};
	
		//## renderCountdown (progress, isClockwise, sec)
		// Canvasにカウントダウンサークルを描画します
		this.renderCountdown = function (progress, isClockwise, sec, next) {
			// サークルの描画
			this.ctx.beginPath();
			this.ctx.arc(this.ctxCx, this.ctxCy, this.ctxRadius,
			  this.ctxArcStart, this.ctxArcStart + this.ctxArcRound * progress, !isClockwise);  
			this.ctx.stroke();
			// テキストの描画
			this.ctx.font = "bold " + this.ctxFontSize + "px " + this.ctxFontFamily;
			this.ctx.fillText(sec, this.ctxCx, this.ctxCy);
			if (typeof next != "undefined") {
				next = (next / 1000).toFixed(0);
				this.ctx.font = "bold " + 24 + "px " + this.ctxFontFamily;
				this.ctx.fillText("Next " + next, this.ctxCx, this.ctxCy + 70);
			}
		};
	
	//## getNorma ()
	// 現在のWaveとノルマタイプを受け取って
	// ありえるノルマ数を文字列で返す
	this.getNorma = function (wave, normaType) {
		switch (wave) {
		case 0:
		case 1:
			switch (normaType) {
			case "low":
				return "11～16";
			case "middle":
				return "17～20";
			case "high":
				return "21";
			}
		case 2:
			switch (normaType) {
			case "low":
				return "12～18";
			case "middle":
				return "18～22";
			case "high":
				return "23";
			}
		case 3:
		case 4:
			switch (normaType) {
			case "low":
				return "14～20";
			case "middle":
				return "20～24";
			case "high":
				return "25";
			}
		default:
			return "";
		}
	};
	
	//## setCtx ()
	// CanvasのContextにいろいろ設定する
	// 毎フレーム設定すると処理が無駄に重くなるので、初期化時に1回だけでいい
	this.setCtx = function () {
		this.ctxWidth         = this.$canvas[0].width;
		this.ctxHeight        = this.$canvas[0].height;
		this.ctxRadius        = 120;
		this.ctxFontSize      = 120;
		this.ctxFontFamily    = "'メイリオ', sans-serif";
		this.ctxCx            = this.ctxWidth / 2;
		this.ctxCy            = this.ctxHeight / 2;
		this.ctxArcStart      = Math.PI * (-1/2);
		this.ctxArcRound      = - Math.PI * 2;
		this.ctx.fillStyle    = "#FFFFFF";
		this.ctx.strokeStyle  = "#FFFFFF";
		this.ctx.lineWidth    = 26;
		this.ctx.lineCap      = "butt";
		this.ctx.font         = "bold " + this.ctxFontSize + "px " + this.ctxFontFamily;
		this.ctx.textAlign    = "center";
		this.ctx.textBaseline = "middle";
	};
	
	//## setIsUseStTimer (bool)
	this.setIsUseStTimer = function (bool) {
		this.isUseStTimer = bool;
	}
	
	//## getJqueryObject ()
	// jQueryオブジェクトの取得とイベントの設定
	this.getJqueryObject = function () {
		this.$wrapper       = $(".smcount_wrapper");
		this.$waveWrapper   = $(".smcount_wave_wrapper");
		this.$kasokuWrapper = $(".smcount_kasoku_wrapper");
		this.$canvas        = $(".smcount_canvas");
		this.ctx            = this.$canvas[0].getContext("2d");
		this.$startDate     = $(".smcount_start_date");
		this.$debug         = $(".smcount_debug");
		this.$wave          = $(".smcount_wave").find(".smcount_wave_span");
		this.$sec           = $(".smcount_sec");
		this.$buttonStart        = $(".smcount_button_start");
		this.$buttonKasoku       = $(".smcount_button_kasoku");
		this.$settingNormaSpan   = $(".smcount_setting_norma_span");
		this.$settingNorma       = $(".smcount_setting_norma");
		this.$allWrapper         = $(".all_wrapper");
		this.$translate          = $(".smcount_translate");
		this.$settingVolumeShitei= $(".smcount_setting_volume_shitei");
		this.$settingVolumePlus  = $(".smcount_setting_volume_plus");
		this.$settingVolumeMinus = $(".smcount_setting_volume_minus");
		this.$settingVolumeMute  = $(".smcount_setting_volume_mute");
		this.$settingVolumeSpan  = $(".smcount_setting_volume_span");
		this.$settingVolume      = $(".smcount_setting_volume_plus, .smcount_setting_volume_minus");
		this.$useStTimer         = $("#use_st_timer");
		
		// デバッグ用のDOMを作る
		if (this.isDebug) {
			this.$debug = $("<div></div>").addClass("smcount_debug");
			this.$wrapper.append(this.$debug);
		}
		
		if (this.$wrapper.attr("is_set_event") != "true") {
			this.$wrapper.attr("is_set_event", "true");
		
			// スタートボタン
			this.$buttonStart.on(this.clickEvent, function (e) {
				var $this = $(this);
				
				// stopが予約されている場合何もしない
				if (app.isBookedStop) return;
				
				// いまカウント中かどうかの判定
				// カウント中ならそれを止めるし
				// カウント中でなければ新規にカウントを始める
				var isStarted = $this.hasClass("started") && app.isPlaying;
				if (isStarted) {
					app.stop();
				} else {
					app.start();
				}
				
				// 見た目の調整
				app.$buttonStart.render(isStarted);
				
				// サウンド再生
				if (app.sound.isTested) {
					app.sound.play("switch");
				} else {
					app.sound.testPlay();
				}
				return false;
			});
			
			this.$buttonStart.render = function (isStarted) {
				var text, className;
				
				// もしカウント中なら現在はStop表示になっている
				// それを押したらStart表記に戻さねばならない
				if (isStarted) {
					text = "Start";
					className = "";
				}
				// その逆
				else {
					text = "Stop";
					className = "started";
				}
				
				app.$buttonStart.text(text);
				app.$buttonStart.removeClass("started").addClass(className);
			};
			
			// 加速減速ボタン
			this.$buttonKasoku.each(function(){
				var $this = $(this);
				var move = parseInt($this.attr("move"));
				$this.on(app.clickEvent, function (e) {
					active($this);
					if (app.isPlaying) {
						app.startTime = app.startTime + move;
						app.startDate = new Date(app.startTime);
					}
					return false;
				});
			});
			
			// ノルマ
			this.$settingNorma.each(function(){
				var $this = $(this);
				var normaTypeJP = $this.text();
				var normaType = $this.attr("norma");
				$this.on(app.clickEvent, function (e) {
					if (app.normaType == normaType) return;
					active($this);
					app.normaType  = normaType;
					app.$settingNorma.render(normaTypeJP);
					app.useDefine = app.SMCOUNT_DEFINE[app.normaType];
					app.useCycle  = app.SMCOUNT_CYCLE[app.normaType];
					app.save();
					app.sound.play("switch");
					return false;
				});
			});
			this.$settingNorma.render = function () {
				app.$settingNorma.addClass("no_select");
				var $select = app.$settingNorma.filter("[norma=" + app.normaType + "]").removeClass("no_select");
				app.$settingNormaSpan.text($select.text());
			}
			
			// 画面の横移動
			this.$translate.each(function(){
				var $this = $(this);
				var target = $this.attr("target");
				$this.on(app.clickEvent, function (e) {
					window.stTimerApp.changeMode(target);
					return false;
				});
			});
			
			/*
			this.$settingVolumeShitei.each(function(){
				var $this = $(this);
				var value = parseFloat($this.attr("value"));
				$this.on(app.clickEvent, function (e) {
					active($this);
					app.sound.volume = value;
					app.sound.volume = Math.max(0, Math.min(1, app.sound.volume));
					window.stTimerApp.sound.volume = app.sound.volume;
					app.$settingVolume.render();
					app.save();
					app.sound.play("switch");
					return false;
				});
			});
			*/
			
			this.$settingVolumeMute.on(app.clickEvent, function (e) {
				var isMuted = app.sound.isMuted;
				var newIsMuted = !isMuted;
				app.sound.isMuted = newIsMuted;
				app.$settingVolume.render();
			});
			
			// 音量
			this.$settingVolume.each(function(){
				var $this = $(this);
				var move = parseFloat($this.attr("move"));
				$this.on(app.clickEvent, function (e) {
					active($this);
					app.sound.volume = app.sound.volume + move;
					app.sound.volume = Math.round(app.sound.volume * 10) / 10;
					app.sound.volume = Math.max(0, Math.min(1, app.sound.volume));
					window.stTimerApp.sound.volume = app.sound.volume;
					app.$settingVolume.render();
					app.save();
					app.sound.play("switch");
					return false;
				});
			});
			
			this.$settingVolume.render = function () {
				var isMuted = app.sound.isMuted;
				if (isMuted) {
					hide(app.$settingVolumePlus);
					hide(app.$settingVolumeMinus);
				}
				else if (app.sound.volume == 0) {
					show(app.$settingVolumePlus);
					hide(app.$settingVolumeMinus);
				}
				else if (app.sound.volume == 1) {
					hide(app.$settingVolumePlus);
					show(app.$settingVolumeMinus);
				}
				else {
					show(app.$settingVolumePlus);
					show(app.$settingVolumeMinus);
				}
				
				var percent = (app.sound.volume * 100).toFixed(0);
				var text = percent + "%";
				if (isMuted) {
					text = "Muted";
				}
				app.$settingVolumeSpan.text(text);
				
				var muteText = "Mute";
				if (isMuted) {
					muteText = "Play";
				}
				app.$settingVolumeMute.text(muteText);
			};
			
			// STタイマーを併用するか
			this.$useStTimer.on("change", function(){
				var $this = $(this);
				var isChecked = $this.prop("checked");
				if (isChecked) {
					app.isUseStTimer = true;
					app.$translate.css("display", "block");
				}
				else {
					app.isUseStTimer = false;
					app.$translate.css("display", "none");
				}
				app.save();
				app.sound.play("switch");
				return false;
			});
		}
			
		//## active, show, hide
		var activeClass = "smcount_button_active";
		var hiddenClass = "smcount_hidden";
		var activeTime = 100;
		function active ($self, callback) {
			$self.addClass(activeClass);
			setTimeout(function () {
				$self.removeClass(activeClass);
				if (callback) callback();
			}, activeTime);
		}
		
		function show ($self) {
			$self.removeClass(hiddenClass);
		}
		function hide ($self) {
			$self.addClass(hiddenClass);
		}
	};
	
	//## playNoSound ()
	this.playNoSound = function () {
		this.sound.play(this.noSoundName, {
			volume: 0.2,
			loop: true
		});
	};
	
	//## stopNoSound ()
	this.stopNoSound = function () {
		this.sound.stop(this.noSoundName);
	};
	
	//## start ()
	// SMcountを始める
	this.start = function () {
	
		// すでに再生中だったらいったんstop()する
		if (this.isPlaying) this.stop();
		
		// 初期化地獄
		this.debugLog("start.");
		this.$waveWrapper.css("opacity", "1");
		this.$kasokuWrapper.css("opacity", "1");
		this.frame         = 0;
		this.frameWave     = 0;
		this.frameCycle    = 0;
		this.bTime         = 0;
		this.bTimeWave     = 0;
		this.time          = 0;
		this.timeWave      = 0;
		this.timeWaveLeft  = 0;
		this.timeCycle     = 0;
		this.timeCycleLeft = 0;
		this.bCycle        = 0;
		this.cycle         = 0;
		this.nextCycle     = 0;
		this.bWave         = 0;
		this.wave          = 0;
		this.isChangingSec = false;
		this.secWave       = 0;
		this.useDefine     = this.SMCOUNT_DEFINE[this.normaType];
		this.useCycle      = this.SMCOUNT_CYCLE[this.normaType];
		/*
		this.startDate     = new Date(new Date().getTime() - this.waveTimes[1] + this.waveTimes[0] - 500);
		this.startDate     = new Date(new Date().getTime() - this.waveTimes[2] + this.waveTimes[0] - 500);
		*/
		this.startDate     = new Date();
		this.startTime     = this.startDate.getTime();
		this.wave1Date     = new Date(this.startTime + this.waveTimes[0]);
		this.wave2Date     = new Date(this.startTime + this.waveTimes[1]);
		this.wave3Date     = new Date(this.startTime + this.waveTimes[2]);
		
		// isPlayingのフラグを立ててloopスタート
		this.isPlaying = true;
		this.loop();
		
		// 無音BGMを再生しておくことで
		// スマホがスリープしなくなる
		this.playNoSound();
	};
	
	//## stop ()
	// SMcountを止める
	this.stop = function () {
		
		// 初期化や画面のクリアなど
		this.debugLog("stop.");
		this.$waveWrapper.css("opacity", "0");
		this.$kasokuWrapper.css("opacity", "0");
		this.clearRender();
		this.startDate = null;
		if (this.isDebug) {
			this.$debug.empty();
		}
		
		// isPlayingのフラグを折ってloopを停止
		this.isPlaying = false;
		clearTimeout(this.timeoutId);
		
		// 再生していた無音BGMを止める
		this.stopNoSound();
		
		//this.sound.stop();
	};
	
	//## save ()
	this.save = function () {
		window.stTimerApp.save();
	};
	
	//## load ()
	this.load = function () {
		window.stTimerApp.load();
	};
	
	//## askStTimerCombined ()
	this.askStTimerCombined = function () {
		return (window.smCountApp.isUseStTimer && window.smCountApp.isRunning);
	};
	
	//## askStTimerCombined2 ()
	this.askStTimerCombined2 = function () {
		return (! window.smCountApp.isRunning) || (window.smCountApp.$allWrapper.attr("mode") == "sttimer");
	};
	
	//## stopApp ()
	this.stopApp = function () {
		this.isRunning = false;
		if (this.isPlaying) {
			this.stop();
		} else clearTimeout(this.timeoutId);
	};
	
	//## resetApp ()
	this.resetApp = function () {
		this.stopApp();
		this.isRunning = true;
		this.getJqueryObject();
		this.setCtx();
		window.stTimerApp.changeMode("counter");
		this.load();
		this.sound.loadAll();
	};
	
	//## startApp ()
	this.startApp = function () {
		this.isRunning = true;
		this.sound.disable = true;
		setTimeout(function(){
			app.sound.disable = false;
		},500);
		this.sound = this.soundParty[settingApp.usingVoice];
		if (this.isStarted) return this.resetApp();
		this.getJqueryObject();
		this.setCtx();
		window.stTimerApp.changeMode("counter");
		this.load();
		this.sound.loadAll();
		this.isStarted = true;
	};
	
	//## debugLog (str)
	this.debugLog = function (str) {
		if (this.isDebug) console.log(str);
	};
	
	//## createSmSound ()
	// StSoundを流用してサウンドオブジェクトを作成する
	this.createSmSound = function (charaName, shouldPreload, extension) {
		if (! charaName) charaName = "bouyomichan";
		
		// SMcountの音声定義オブジェクトからユニークな値を抽出した配列を作る
		var soundArray = this.getUniqueValueArrayOfSmCount();
		
		// そこに必要な音声を加える
		this.margeArray(soundArray, [
			"otsukare", "switch", "nosound.mp3"
		]);
		
		if (extension == "mp3") {
			soundArray.forEach(function(d, i){
				if (d.lastIndexOf("mp3") < 0) soundArray[i] = d + ".mp3";
			});
		}
		
		// StSoundコンストラクタから作成
		var stSound = new StSound("./tyrano/countsounds/" + charaName + "/", soundArray, true);
		
		// プリロードすべきならロードを始める
		if (shouldPreload) stSound.loadAll();
		
		return stSound;
		
	};
	
	//## margeArray (array, margedArray)
	this.margeArray = function (array, margedArray) {
		margedArray.forEach(function (value) {
			if (array.indexOf(value) < 0) {
				array.push(value);
			}
		});
	}
	
	//## getUniqueValueArrayOfSmCount ()
	// Defineからユニークな値を取り出して配列にして返す
	this.getUniqueValueArrayOfSmCount = function () {
		if (this.uniqueSoundNames.length > 0) {
			return this.uniqueSoundNames.concat();
		}
		var uniqueArray = [];
		var defineObjectArray = [
			this.SMCOUNT_DEFINE.high,
			this.SMCOUNT_DEFINE.middle,
			this.SMCOUNT_DEFINE.low
		];
		// 各定義オブジェクトに対して
		defineObjectArray.forEach(function(defineObject){
			// 各キーに対して
			var keys = Object.keys(defineObject);
			keys.forEach(function(key){
				// 値を取得
				var valueArray;
				var value = defineObject[key];
				if (typeof value != "string") return;
				// 値にコンマが含まれるならコンマでsplitする
				// 含まれないならそのまま長さ1の配列にする
				if (value.indexOf(",") > -1) {
					valueArray = value.split(",");
				} else valueArray = [value];
				// 作成した配列の各値に対して
				valueArray.forEach(function(v){
					// 空でなくuniqueArrayに含まれないならばpushする
					if (v && uniqueArray.indexOf(v) < 0) {
						uniqueArray.push(v);
					}
				});
			});
		});
		
		this.uniqueSoundNames = uniqueArray;
		return this.uniqueSoundNames.concat();
	};
	
	//## defineSmCount ()
	// SMcountの定義
	this.defineSmCount = function () {
		this.SMCOUNT_CYCLE = {
			"high"  : [100, 90, 80, 70, 59, 49, 39, 28, 18, 8, 0],
			"middle": [100, 88, 76, 64, 52, 40, 28, 16, 4, 0],
			"low"   : [100, 86, 72, 57, 43, 28, 14, 0]
		};
		Object.keys(this.SMCOUNT_CYCLE).forEach(function (key) {
			app.SMCOUNT_CYCLE[key].forEach(function(value, index, array){
				app.SMCOUNT_CYCLE[key][index] *= 1000;
			});
		});
		this.SMCOUNT_DEFINE = {
			"high": {
				"110": "10,wave2,wave3",
				"109": "9,,",
				"108": "8,8,sp",
				"107": "7,7,",
				"106": "6",
				"105": "5",
				"104": "4",
				"103": "3",
				"102": "2",
				"101": "1",
				"100": "start",
				"99": "",
				"98": "spcheck,,",
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
				"54": "norma",
				"53": "",
				"52": "3",
				"51": "2",
				"50": "1",
				"49": "49b",
				"48": "",
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
				"26": "lastboss",
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
				"0" : "wave1end,wave2end,wave3end"
			},
			"middle": {
				"110": "10,wave2,wave3",
				"109": "9,,",
				"108": "8,8,sp",
				"107": "7,7,",
				"106": "6",
				"105": "5",
				"104": "4",
				"103": "3",
				"102": "2",
				"101": "1",
				"100": "start",
				"99": "",
				"98": "spcheck,,",
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
				"26": "lastboss",
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
				"3" : "",
				"2" : "",
				"1" : "",
				"0" : "wave1end,wave2end,wave3end"
			},
			"low": {
				"110": "10,wave2,wave3",
				"109": "9,,",
				"108": "8,8,sp",
				"107": "7,7,",
				"106": "6",
				"105": "5",
				"104": "4",
				"103": "3",
				"102": "2",
				"101": "1",
				"100": "start",
				"99": "",
				"98": "spcheck,,",
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
				"26": "lastboss",
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
				"0" : "wave1end,wave2end,wave3end"
			}
		};
	};
	
	//## finish
	this.init();
	
	return this;
}