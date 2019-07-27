// based on https://github.com/emaame/salmonrun_time_timer

window.stTimerApp = new StTimerApp();

//# StTimerApp ()
function StTimerApp () {
	var app = this;
	this.specialStTitle = "";
	this.mode        = "timer";
	this.isStarted   = false;
	this.stTimer     = new StTimer();
	this.list        = [];
	this.bEta        = 0;
	this.eta         = 0;
	this.nowDate     = null;
	this.etaDate     = null;
	this.bStageIndex = null;
	this.stageFrame  = 0;
	this.stageCounts = [0, 5, 10, 30, 60].map(time => time *= 1000);
	this.lastStageIndex = this.stageCounts.length - 1;
	this.stageIndex     = this.lastStageIndex;
	this.sound       = new StSound();
	this.isFreeSound = false;
	this.enableSound = false;
	this.isClearing  = false;
	this.enableNowMode = false;
	this.stTitle       = "ST";
	this.dateFormatter = new DateFormatter();
	this.framePerSec   = 60;
	this.loopTimerId   = -1;
	this.loopDuration  = 1000 / this.framePerSec;
	this.updateSttId       = -1;
	this.updateSttDuration = 60 * 1000;
	this.updateOffsetId       = -1;
	this.updateOffsetDuration = 60 * 60 * 1000;
	this.storageKey    = "st_timer_gungee";
	
	//## setStTitle ()
	this.setStTitle = function () {
		var str;
		if (this.enableNowMode) {
			var num = app.stTimer.timeOffset.friendOffset / 1000;
			var friend = this.stTimer.timeOffset.enableFriendOffset ? "<span style='color: Orange'>（" + num.toFixed(1) + "秒遅れ）</span>" : "";
			str = "現在時刻" + friend + "は";
		}
		else if (this.specialStTitle) {
			str = "<span style='color: Yellow;'>" + this.specialStTitle + "まで</span>";
		}
		else {
			var friend = this.stTimer.timeOffset.enableFriendOffset ? "（フレ部屋）" : "";
			var sign = app.stTimer.stOffset >= 0 ? "+" : "";
			var offset = app.stTimer.enableStOffset ? sign + app.stTimer.stOffset + "分" : "";
			str = this.stTitle + "<span style='color: Orange'>" + offset + friend + "</span>まで";
		}
		this.$description.html(str);
	}
	
	//## getJqueryObject ()
	this.getJqueryObject = function () {
		this.$allWrapper  = $(".all_wrapper");
		this.$eta         = $(".st_eta_count");
		this.$next        = $(".st_eta_next");
		this.$canvas      = $(".st_eta_canvas");
		this.ctx          = this.$canvas[0].getContext("2d");
		this.$checkSound  = $("#check_sound");
		this.$checkFriend = $("#check_friend");
		this.$checkNow    = $("#check_now");
		this.$checkStOffset = $("#check_st_offset");
		this.$stWrapper   = $(".st_eta");
		this.$correction  = $(".st_eta_correction");
		this.$description = $(".st_eta_description");
		this.$soundTest   = $(".sound_test_button");
		this.$friendPlus  = $(".friend_plus_button");
		this.$friendMinus = $(".friend_minus_button");
		this.$friendOffset= $(".friend_offset");
		this.$stPlus      = $(".st_plus_button");
		this.$stMinus     = $(".st_minus_button");
		this.$stOffset    = $(".st_offset");
		this.$soundDesc   = $(".st_eta_sound_desc");
		var clickEvent    = "ontouchstart" in window ? "touchstart" : "click";
		if (this.$checkSound.attr("is_set_event") != "true") {
			this.$checkSound.attr("is_set_event", "true");
			function activeButton (self) {
				var $self = $(self);
				$self.addClass("button_active");
				setTimeout(function () {
					$self.removeClass("button_active");
				}, 100);
			}
			//## * soundTest
			this.$soundTest.on(clickEvent, function (e) {
				e.preventDefault();
				activeButton(this);
				app.sound.play("manmenmi");
				return false;
			});
			//## * friendPlus
			this.$friendPlus.on(clickEvent, function (e) {
				e.preventDefault();
				activeButton(this);
				app.stTimer.timeOffset.friendOffset += 100;
				app.save();
				var num = app.stTimer.timeOffset.friendOffset / 1000;
				app.$friendOffset.text(num.toFixed(1));
				app.sound.play("click");
				return false;
			});
			//## * friendMinus
			this.$friendMinus.on(clickEvent, function (e) {
				e.preventDefault();
				activeButton(this);
				app.stTimer.timeOffset.friendOffset -= 100;
				app.save();
				var num = app.stTimer.timeOffset.friendOffset / 1000;
				app.$friendOffset.text(num.toFixed(1));
				app.sound.play("click");
				return false;
			});
			//## * stPlus
			this.$stPlus.on(clickEvent, function (e) {
				e.preventDefault();
				activeButton(this);
				app.stTimer.stOffset = Math.min(7, app.stTimer.stOffset + 1);
				app.save();
				var sign = app.stTimer.stOffset >= 0 ? "+" : "";
				var str = app.stTimer.enableStOffset ? "(" + sign + app.stTimer.stOffset + "分)" : "";
				if (app.stTimer.stOffset == 1) {
					app.$stPlus.removeClass("hidden_button");
					app.$stMinus.addClass("hidden_button");
				}
				else if (app.stTimer.stOffset == 7) {
					app.$stPlus.addClass("hidden_button");
					app.$stMinus.removeClass("hidden_button");
				}
				else {
					app.$stPlus.removeClass("hidden_button");
					app.$stMinus.removeClass("hidden_button");
				}
				app.$stOffset.text(str);
				app.stageIndex  = null;
				app.updateStList();
				app.setStTitle();
				app.sound.play("click");
				return false;
			});
			//## * stMinus
			this.$stMinus.on(clickEvent, function (e) {
				e.preventDefault();
				activeButton(this);
				app.stTimer.stOffset = Math.max(1, app.stTimer.stOffset - 1);
				app.save();
				var sign = app.stTimer.stOffset >= 0 ? "+" : "";
				var str = app.stTimer.enableStOffset ? "(" + sign + app.stTimer.stOffset + "分)" : "";
				if (app.stTimer.stOffset == 1) {
					app.$stPlus.removeClass("hidden_button");
					app.$stMinus.addClass("hidden_button");
				}
				else if (app.stTimer.stOffset == 7) {
					app.$stPlus.addClass("hidden_button");
					app.$stMinus.removeClass("hidden_button");
				}
				else {
					app.$stPlus.removeClass("hidden_button");
					app.$stMinus.removeClass("hidden_button");
				}
				app.$stOffset.text(str);
				app.stageIndex  = null;
				app.updateStList();
				app.setStTitle();
				app.sound.play("click");
				return false;
			});
			//## * checkSound
			if (! app.isFreeSound) {
				this.$checkSound.on(clickEvent, function (e) {
					if (! app.isFreeSound) {
						//app.sound.playSilent();
						app.sound.testPlaySilent();
						app.isFreeSound = true;
						console.log("✅ サウンドの再生制限を解除しました.");
						app.$soundDesc.css("display", "block");
						app.$canvas.css("display", "none");
						setTimeout(function(){
							app.$soundDesc.fadeOut(1000, function(){
								app.$canvas.css("display", "inline-block");
							});
						}, 12000);
					}
					$(this).off(clickEvent);
				});
			}
			this.$checkSound.on("change", function (e) {
				var isChecked = $(this).prop("checked");
				if (isChecked) {
					app.$soundTest.removeClass("hidden_button");
					app.sound.enable = true;
					app.enableSound = true;
					if (! e.isTrigger) app.sound.play("switch");
					/*
					setTimeout(function () {
						app.sound.play("switch");
					}, app.eta);
					*/
				}
				else {
					app.$soundTest.addClass("hidden_button");
					if (! e.isTrigger) app.sound.play("switch");
					app.enableSound = false;
					app.sound.enable = false;
				}
				if (! e.isTrigger) app.save();
				app.setStTitle();
				return false;
			});
			
			//## * checkFriend
			this.$checkFriend.on("change", function (e) {
				var isChecked = $(this).prop("checked");
				if (isChecked) {
					app.stTimer.timeOffset.enableFriendOffset = true;
					app.$stWrapper.addClass("st_friend_mode");
					$(".correction_friend").remove();
					var str = "フレンド部屋用に %dif 秒の補正をしています";
					    str = str.replace("%dif", Math.abs(app.stTimer.timeOffset.friendOffset / 1000));
					var $p = $("<p></p>").text(str).addClass("correction_friend");
					//app.$correction.append($p);
					app.$friendPlus.removeClass("hidden_button");
					app.$friendMinus.removeClass("hidden_button");
				}
				else {
					app.stTimer.timeOffset.enableFriendOffset = false;
					$(".correction_friend").remove();
					app.$stWrapper.removeClass("st_friend_mode");
					app.$friendPlus.addClass("hidden_button");
					app.$friendMinus.addClass("hidden_button");
				}
				var num = app.stTimer.timeOffset.friendOffset / 1000;
				app.$friendOffset.text(num.toFixed(1));
				if (! e.isTrigger) app.save();
				app.setStTitle();
				if (! e.isTrigger) app.sound.play("switch");
				return false;
			});
			
			//## * checkStOffset
			this.$checkStOffset.on("change", function (e) {
				var isChecked = $(this).prop("checked");
				if (isChecked) {
					app.stTimer.enableStOffset = true;
					app.$stPlus.removeClass("hidden_button");
					app.$stMinus.removeClass("hidden_button");
					var sign = app.stTimer.stOffset >= 0 ? "+" : "";
					var str = app.stTimer.stOffset != -1 ? "(" + sign + app.stTimer.stOffset + "分)" : "";
					app.$stOffset.text(str);
					if (app.stTimer.stOffset == 1) {
						app.$stPlus.removeClass("hidden_button");
						app.$stMinus.addClass("hidden_button");
					}
					else if (app.stTimer.stOffset == 7) {
						app.$stPlus.addClass("hidden_button");
						app.$stMinus.removeClass("hidden_button");
					}
					else {
						app.$stPlus.removeClass("hidden_button");
						app.$stMinus.removeClass("hidden_button");
					}
				}
				else {
					app.stTimer.enableStOffset = false;
					app.$stPlus.addClass("hidden_button");
					app.$stMinus.addClass("hidden_button");
					app.$stOffset.text("");
				}
				app.stageIndex = null;
				if (! e.isTrigger) app.updateStList();
				if (! e.isTrigger) app.save();
				app.setStTitle();
				if (! e.isTrigger) app.sound.play("switch");
				return false;
			});
			
			//## * checkNow
			this.$checkNow.on("change", function (e) {
				var isChecked = $(this).prop("checked");
				if (isChecked) {
					app.enableNowMode = true;
					app.$next.text("現在時刻を 時:分:秒.ミリ秒 で表示しています")
				}
				else {
					app.enableNowMode = false;
					app.updateStList();
				}
				if (! e.isTrigger) app.save();
				app.setStTitle();
				if (! e.isTrigger) app.sound.play("switch");
				return false;
			});
			
			this.$checkFriend.attr("is_set_event", "true");
		}
	};
	
	//## calcEta ()
	// 残りカウントを計算します
	this.calcEta = function () {
		var now        = this.stTimer.timeOffset.getTime();
		var next       = this.list[0];
		this.bEta      = this.eta;
		this.eta       = next - now;
		this.etaDate   = new Date(this.eta);
		this.nowDate   = new Date(now);
		this.etaMin    = this.etaDate.getMinutes();
		this.etaSec    = this.etaDate.getSeconds() + 1;
		this.etaMsec   = this.etaDate.getMilliseconds() + 1;
	};
	
	//## changeMode ()
	this.changeMode = function (target) {
		var theApp = window.smCountApp;
		theApp.mode = target;
		this.mode = target;
		switch (target) {
		case "counter":
			document.title = "サーモンラーン";
			this.framePerSec = 1;
			this.loopDuration = 1000 / this.framePerSec;
			theApp.framePerSec = 60;
			theApp.timeoutDuration = 1000 / theApp.framePerSec;
			if (theApp.$allWrapper) theApp.$allWrapper.css("transform", "translate(-640px)").attr("mode", "smcount");
			break;
		case "timer":
			this.framePerSec = 60;
			this.loopDuration = 1000 / this.framePerSec;
			theApp.framePerSec = 1;
			theApp.timeoutDuration = 1000 / theApp.framePerSec;
			if (theApp.$allWrapper) theApp.$allWrapper.css("transform", "translate(0px)").attr("mode", "sttimer");
			break;
		}
	};
	
	//## updateCountStage ()
	// stageIndexを更新します
	this.updateCountStage = function () {
		// 直前のstageIndexを保存
		this.bStageIndex = this.stageIndex;
		// 現在のstageIndexを特定
		for (var i = this.lastStageIndex; i >= 0; i--) {
			var stageCount = this.stageCounts[i];
			if (this.eta >= stageCount) break;
		}
		// this.etaがマイナスのときはi=-1となる→lastStageIndexに転換
		if (i < 0) i = this.lastStageIndex;
		this.stageIndex = i;
		// 直前のstageIndexと現在のstageIndexが違う＝stageIndexが変わった瞬間には
		// 特殊な処理を行う
		var charaName = settingApp.usingVoice + "/";
		if (this.bStageIndex != null && this.bStageIndex != this.stageIndex) {
			this.stageFrame = 0;
			switch (this.stageIndex) {
			case 0: // 残り5秒以内
				if (! this.enableNowMode && window.smCountApp.askStTimerCombined2()) {
					if (document.hasFocus && document.hasFocus()) app.sound.play(charaName + "54321");
					else app.sound.play(charaName + "5");
				}
				break;
			case 1: // 残り10秒以内
				if (! this.enableNowMode && window.smCountApp.askStTimerCombined2()) app.sound.play(charaName + "10");
				break;
			case 2: // 残り30秒以内
				if (! this.enableNowMode && window.smCountApp.askStTimerCombined2()) app.sound.play(charaName + "30");
				break;
			case 3: // 残り60秒以内
				if (! this.enableNowMode && window.smCountApp.askStTimerCombined2()) app.sound.play(charaName + "60");
				break;
			case this.lastStageIndex: // 残り60秒以上
				this.isClearing = true;
				this.updateStList();
				// SMcountと併用する場合は
				// SMcountに遷移する
				if (window.smCountApp.askStTimerCombined()) {
					this.changeMode("counter");
				}
				if (! this.enableNowMode && window.smCountApp.askStTimerCombined2()) app.sound.play("manmenmi");
				break;
			}
		}
		/*
		setInterval(function(){
			if (! window.stTimerApp.enableNowMode && window.smCountApp.askStTimerCombined2()) window.stTimerApp.sound.play("akira/10");
		},1000);
		*/
	};
	
	//## update ()
	// 情報の更新
	this.update = function () {
		// 残り時間の計算
		this.calcEta();
		// stageIndexの更新
		this.updateCountStage();
		if (window.smCountApp.mode == "timer") {
			if (! this.enableNowMode) {
				var sign = app.stTimer.stOffset >= 0 ? "+" : "";
				var offset = app.stTimer.enableStOffset ? sign + app.stTimer.stOffset + "分" : "";
				str = this.stTitle + offset;
				if (this.specialStTitle) str = this.specialStTitle;
				document.title = str + "まで " + this.dateFormatter.getMinText2(this.etaDate) + " - サーモンラーン ";
			} else {
				document.title = this.dateFormatter.getHourText2(this.nowDate) + " - サーモンラーン ";
			}
		}
		// console.log(this.stageIndex + ": " + this.stageFrame);
		
	};
	
	//## setCtx ()
	this.setCtx = function () {
		this.ctxWidth         = 100;
		this.ctxHeight        = 100;
		this.ctxRadius        = 40;
		this.ctxFontSize      = 34;
		this.ctxFontFamily    = "'メイリオ', sans-serif";
		this.ctxCx            = this.ctxWidth / 2;
		this.ctxCy            = this.ctxHeight / 2;
		this.ctxArcStart      = Math.PI * (-1/2);
		this.ctxArcRound      = - Math.PI * 2;
		this.ctx.fillStyle    = "#FFFFFF";
		this.ctx.strokeStyle  = "#FFFFFF";
		this.ctx.lineWidth    = 8;
		this.ctx.lineCap      = "butt";
		this.ctx.font         = "bold " + this.ctxFontSize + "px " + this.ctxFontFamily;
		this.ctx.textAlign    = "center";
		this.ctx.textBaseline = "middle";
	};
	
	//## render ()
	// 画面を描画する関数です
	this.render = function () {
		if (this.mode != "timer") return;
		
		var str = this.enableNowMode ? 
			app.dateFormatter.getHourText(this.nowDate):
			app.dateFormatter.getMinText(this.etaDate);
		this.$eta.text(str);
		
		this.clearCanvas();
		if (! this.enableNowMode) {
			// ゼロのフェードアウトを描画
			if (this.stageIndex == this.lastStageIndex) {
				if (this.stageFrame < this.framePerSec && this.isClearing && !window.smCountApp.askStTimerCombined()) {
					this.ctx.globalAlpha = 1 - this.stageFrame / this.framePerSec;
					this.renderCountdown(1, true, "0");
				}
				else this.isClearing = false;
			}
			// 残り10～0秒のカウントサークルを表示
			else if (this.stageIndex <= 1) {
				this.ctx.globalAlpha = 1;
				var progress = this.etaMsec / 1000;
				var isClockwise = (this.etaSec % 2 == 0);
				this.renderCountdown(progress, isClockwise, this.etaSec);
			}
		}
		
		this.stageFrame++;
	};
	
	//## renderOffset (json)
	this.renderOffset = function (json) {
		var str = (json.dif > 0) ?
		          "時計の %dif 秒の遅れを補正済み":
		          "時計の %dif 秒の進みを補正済み";
		    str = str.replace("%dif", Math.abs(json.dif / 1000));
		/*
		var sign = json.dif ? "+" : "";
		var str = "時刻補正 " + sign + (json.dif / 1000);
		*/
		var $p = $("<p></p>").text(str).addClass("correction_dif");
		this.$correction.empty();
		this.$correction.append($p);
	};
	
	//## clearCanvas ()
	// Canvasをクリアします
	this.clearCanvas = function () {
		this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
	};
	
	//## renderCountdown (progress, isClockwise, sec)
	// Canvasにカウントダウンサークルを描画します
	this.renderCountdown = function (progress, isClockwise, sec) {
		// サークルの描画
		this.ctx.beginPath();
		this.ctx.arc(this.ctxCx, this.ctxCy, this.ctxRadius,
		  this.ctxArcStart, this.ctxArcStart + this.ctxArcRound * progress, !isClockwise);  
		this.ctx.stroke();
		// テキストの描画
		this.ctx.fillText(sec, this.ctxCx, this.ctxCy);
	};
	
	//## loop ()
	// ループ関数です
	this.loop = function () {
		//console.log("looping.");
		// 次回を予約
		clearTimeout(app.loopTimerId);
		app.loopTimerId = setTimeout(app.loop, app.loopDuration);
		// アップデートと描画
		app.update();
		app.render();
	};
	
	//## updateStList ()
	// STリストを更新します
	this.updateStList = function () {
		if (app.list.length == 0) console.log("✅ STリストを作成しました.");
		else console.log("✅ STリストを更新しました.");
		// 次回を予約
		clearTimeout(app.updateSttId);
		app.updateSttId = setTimeout(app.updateStList, app.updateSttDuration);
		// リストを更新
		app.list = app.stTimer.listupNextSTT();
		if (! app.enableNowMode) {
			var date = app.dateFormatter.getMonthText(app.list[0]);
			var str = "%date までのカウントダウンを表示しています";
			    str = str.replace("%date", date);
			app.$next.text(str);
		}
	};
	
	//## updateOffset ()
	this.updateOffset = function () {
		// 次回を予約
		clearTimeout(app.updateOffsetId);
		app.updateOffsetId = setTimeout(app.updateOffset, app.updateOffsetDuration);
		// NICTにアクセス
		app.stTimer.timeOffset.getOffsetJST(function(json){
			app.updateStList();
			app.renderOffset(json);
		});
	};
	
	//## stopApp ()
	this.stopApp = function () {
		clearTimeout(this.loopTimerId);
		clearTimeout(this.updateSttId);
		clearTimeout(this.updateOffsetId);
	};
	
	//## resetApp ()
	this.resetApp = function () {
		this.stageFrame  = 0;
		this.stTimer.timeOffset.friendOffset = 2500;
		this.stTimer.stOffset = 1;
		this.sound.enable = false;	
		this.stTimer.timeOffset.enableFriendOffset = false;
		this.stTimer.enableStOffset = false;
		this.stopApp();
		this.getJqueryObject();
		this.setCtx();
		this.setStTitle();
		this.updateStList();
		setTimeout(this.updateOffset, 200);
		this.changeMode("timer");
		this.load();
		this.loop();
	};
	
	//## save ()
	this.save = function () {
		var saveData = {
			enableSound       : this.enableSound,
			enableFriendOffset: this.stTimer.timeOffset.enableFriendOffset,
			friendOffset      : this.stTimer.timeOffset.friendOffset,
			enableStOffset    : this.stTimer.enableStOffset,
			stOffset          : this.stTimer.stOffset,
			enableNowMode     : this.enableNowMode,
			volume            : window.smCountApp.sound.volume,
			normaType         : window.smCountApp.normaType,
			isUseStTimer      : window.smCountApp.isUseStTimer
		};
		var saveDataStr = JSON.stringify(saveData);
		localStorage.setItem(this.storageKey, saveDataStr);
	}
	
	//## load ()
	this.load = function () {
		var saveDataStr = localStorage.getItem(this.storageKey);
		if (saveDataStr) {
			var saveData = JSON.parse(saveDataStr);
			var defaultData = {
				enableSound       : false,
				enableFriendOffset: false,
				friendOffset      : 2500,
				enableStOffset    : false,
				stOffset          : 1,
				enableNowMode     : false,
				volume            : 0.5,
				normaType         : "middle",
				isUseStTimer      : false
			};
			saveData = $.extend({}, defaultData, saveData);
			this.stTimer.timeOffset.enableFriendOffset = saveData.enableFriendOffset;
			this.stTimer.timeOffset.friendOffset       = saveData.friendOffset;
			this.stTimer.enableStOffset                = saveData.enableStOffset;
			this.stTimer.stOffset                      = saveData.stOffset;
			this.sound.volume                          = saveData.volume;
			this.enableNowMode                         = saveData.enableNowMode;
			this.enableSound                           = saveData.enableSound;
			this.sound.enable                          = saveData.enableSound && this.isFreeSound;
			window.smCountApp.sound.volume             = saveData.volume;
			window.smCountApp.normaType                = saveData.normaType;
			window.smCountApp.isUseStTimer             = saveData.isUseStTimer;
			if (this.mode == "timer") {
				this.$checkFriend.prop("checked",   this.stTimer.timeOffset.enableFriendOffset).trigger("change");
				this.$checkStOffset.prop("checked", this.stTimer.enableStOffset).trigger("change");
				this.$checkNow.prop("checked",      this.enableNowMode).trigger("change");
				this.$checkSound.prop("checked",    this.sound.enable).trigger("change");
			}
			else if (this.mode == "counter") {
				window.smCountApp.$settingNorma.render();
				window.smCountApp.$settingVolume.render();
				window.smCountApp.$useStTimer.prop("checked", window.smCountApp.isUseStTimer).trigger("change");
			}
		}
	}
	
	//## startApp ()
	this.startApp = function () {
		
		if (window.queries && window.queries.test == "1") {
			if ($(".sttimer_test").size() < 1) {
				this.$test = $("<div></div>").addClass("sttimer_test");
				$("body").append(this.$test);
				var str = "テスト用の画面";
				this.$test.text(str);
			}
		}
		
		this.sound.disable = true;
		setTimeout(function(){
			app.sound.disable = false;
		},500);
		if (this.isStarted) return this.resetApp();
		// jQueryオブジェクトを取得する
		this.getJqueryObject();
		// Canvasのcontextの設定を行う
		this.setCtx();
		// STのタイトルを設定する
		this.setStTitle();
		// STリストを作成
		this.updateStList();
		// 音声のプリロード
		this.sound.loadAll();
		// NICTにアクセス
		setTimeout(this.updateOffset, 200);
		this.changeMode("timer");
		this.load();
		this.isStarted = true;
		// ループスタート
		this.loop();
	};
	
	return this;
}





//# DateFormatter ()
function DateFormatter () {
	
	//## getMonthText (d)
	this.getMonthText = function (d) {
		d.MM = (d.getMonth() + 1);
		d.DD = ("00" + d.getDate()).slice(-2);
		d.hh = d.getHours();
		d.mm = ("00" + d.getMinutes()).slice(-2);
		d.ss = ("00" + d.getSeconds()).slice(-2);
		var str = d.MM + "/" + d.DD + " " + d.hh + ":" + d.mm + ":" + d.ss;
		if (d.ss != "00") str += d.ss + "秒";
		return str;
	};
	
	//## getMinText (d)
	this.getMinText = function (d) {
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		d.SSS = ("000" + d.getMilliseconds()).slice(-3);
		return (d.mm + ":" + d.ss + "." + d.SSS);
	};
	
	//## getMinText2 (d)
	this.getMinText2 = function (d) {
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		return (d.mm + ":" + d.ss);
	};
	
	//## getMinText3 (d)
	this.getMinText3 = function (d) {
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		d.SSS = ("000" + d.getMilliseconds()).slice(-3);
		return (d.mm + "分" + d.ss + "秒" + d.SSS);
	};
	
	//## getHourText (d)
	this.getHourText = function (d) {
		d.h   = d.getHours();
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		d.SSS = ("000" + d.getMilliseconds()).slice(-3);
		return (d.h + ":" + d.mm + ":" + d.ss + "." + d.SSS);
	};
	
	//## getHourText2 (d)
	this.getHourText2 = function (d) {
		d.h   = d.getHours();
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		return (d.h + ":" + d.mm + ":" + d.ss);
	};
	
	return this;
}




//# SalmonrunTimeTimer ()
function StTimer () {
	
	this.timeOffset = new TimeOffset();
	this.firstST  = 2;
	this.duration = 8;
	this.stOffset = 1;
	this.offsetSec = 0;
	this.enableStOffset = false;
	this.numPerHour = Math.floor(60 / this.duration); // 60÷8 = 7.5 => 7
	
	//## listupNextSTT (intTime)
	this.listupNextSTT = function (intTime) {
		var list = [];
		
		var base;
		if (intTime) base = new Date(intTime);
		else base = new Date(this.timeOffset.getTime());
		
		var stOffset = this.enableStOffset ? this.stOffset : 0;
		var firstST = this.firstST + stOffset;
		
		// 現在のピリオドを取得
		// いま0-1分なら第0ピリオド、いま2-9分なら第1ピリオド…となる（第8ピリオドまで）
		// | period  |   0   |            1            | 2  ...  6 |            7            |   8   |
		// | minutes | 00 01 | 02 03 04 05 06 07 08 09 | 10 ... 49 | 50 51 52 53 54 55 56 57 | 58 59 |
		var period = Math.floor((base.getMinutes() - firstST) / this.duration) + 1;
		
		// 現在の時間を取得
		var hours = base.getHours();
			
		while (list.length < 7) {
			// ピリオドを増やしながらlistにpushしていく
			// 第7ピリオド以降はこのfor文は実行されない
			// listが7件埋まっているならばこのfor文は実行されな
			for (var i = period; i < this.numPerHour && list.length < this.numPerHour; ++i) {
				var minutes = firstST + i * this.duration;
				var d = new Date(base);
				d.setHours(hours);
				d.setMinutes(minutes);
				d.setSeconds(this.offsetSec);
				d.setMilliseconds(0);
				list.push( d );
			}
			// ピリオドのリセットと時間の増加
			period = 0;
			hours += 1;
		}
		return list;
	};
	
	return this;
}





//# TimeOffset
function TimeOffset () {
	var self              = this;
	this.resulat          = {};
	this.offsetJST        = 0;
	this.enableFriendOffset = false;
	this.friendOffset = 2500;
	this.serverUrls = [
		"https://ntp-a1.nict.go.jp/cgi-bin/json",
		"https://ntp-b1.nict.go.jp/cgi-bin/json",
		"https://ntp-a4.nict.go.jp/cgi-bin/json"
	];
	
	//## getJqueryObject ()
	this.getJqueryObject = function () {
	};
	
	//## getTime ()
	this.getTime = function () {
		var time = new Date().getTime();
		var offset = this.offsetJST;
		if (this.enableFriendOffset) offset -= this.friendOffset;
		return time + offset;
	};
	
	//## consoleOffset (json)
	this.consoleOffset = function (json) {
		
		var str  = "✅ NICTサーバにアクセスしました.";
		var str1 = "RTT = %rtt ms , (JST - PC Clock) = %dif ms";
		    str1 = str1.replace("%rtt", json.rtt).replace("%dif", json.dif);
		
		var str2 = (json.dif > 0) ?
		           "あなたのコンピュータの時計は %dif秒 遅れています.":
		           "あなたのコンピュータの時計は %dif秒 進んでいます.";
		    str2 = str2.replace("%dif", Math.abs(json.dif / 1000));
		
		console.log(str);
		console.log(str1);
		console.log(str2);
	};
	
	//## getOffsetJST ()
	this.getOffsetJST = function (callback) {
		
		var that = this;
		
		// アクセスするサーバーをランダムに決定し
		// ユニークなクエリパラメータを付けてキャッシュを防ぐ
		var randomIndex = Math.floor(Math.random() * 3); // 0, 1, 2
		var randomServerUrl = this.serverUrls[randomIndex];
		var uniqueQuery = "?" + ((new Date()).getTime() / 1000);
		
		// GET
		$.get(randomServerUrl + uniqueQuery, function (json) {
			// StringだったらJSONでオブジェクトにする
			if (typeof json == "string") json = JSON.parse(json);
			// オブジェクトが正常に取得でいていれば
			if( json && json.st && json.it && json.leap && json.next && json.step ) {
				json.rt = new Date().getTime();   // 受信時刻
				json.it = Number(json.it) * 1000; // 発信時刻
				json.st = Number(json.st) * 1000; // サーバ時刻
				json.rtt = json.rt - json.it;     // 応答時間
				json.dif = json.st - (json.it + json.rt) / 2; // JST - PC Clock
				json.dif = Math.round(json.dif);
		
				if (window.queries && window.queries.test == "1" && window.stTimerApp.$test) {
					var f = window.stTimerApp.dateFormatter.getHourText;
					var g = window.stTimerApp.dateFormatter.getMinText3;
					var sign = Math.sign(json.dif) > 0 ? "+" : "-";
					var strs = [
						"NICTサーバーへの発信時刻: " + f(new Date(json.it)),
						"NICTサーバーからの受信時刻: " + f(new Date(json.rt)),
						"NICTサーバーの時刻: " + f(new Date(json.st)),
						"送信から受信までにかかった時間: " + g(new Date(json.rtt)),
						"推定されるサーバー時刻との時差: " + sign + g(new Date(Math.abs(json.dif)))
					];
					var str = strs.join("<br>");
					window.stTimerApp.$test.html(str);
				}
				
				// 結果の格納
				that.result = json;
				that.offsetJST = json.dif;
				
				// 結果の表示
				that.consoleOffset(json);
				callback(json);
			}
			else {
				console.log("✖JSTの取得でエラーが発生しました.");
			}
		});
	};
	
	this.getJqueryObject();
	return this;
}







/*
 * @ref https://github.com/GoogleChromeLabs/airhorn/blob/master/app/scripts/main.min.js
 */

//# StSound ()
function StSound (urlBase, soundUrls, enable) {
	var self = this;
	
	// 引数を代入していく
	this.soundUrlBase = urlBase   || "./tyrano/sounds/";
	this.soundUrls    = soundUrls || [
		"bouyomichan/5",
		"bouyomichan/10",
		"bouyomichan/30",
		"bouyomichan/60",
		"bouyomichan/54321",
		"gungee/5.mp3",
		"gungee/10.mp3",
		"gungee/30.mp3",
		"gungee/60.mp3",
		"gungee/54321.mp3",
		"akira/5.mp3",
		"akira/10.mp3",
		"akira/30.mp3",
		"akira/60.mp3",
		"akira/54321.mp3",
		"switch", "click", "manmenmi"
	];
	this.enable       = enable    || false;
	this.disable      = false;
	
	// 初期化
	this.volume  = 0.5;
	this.isMuted = false;
	this.sources = new Array(this.soundUrls.length);
	this.buffers = new Array(this.soundUrls.length);
	this.playing = new Array(this.soundUrls.length, false)
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
	};
	
	//## testPlay ()
	this.testPlay = function () {
		this.isTested = true;
		var audio = document.getElementById("sound_switch");
		audio.volume = this.volume;
		audio.currentTime = 0;
		audio.play();
	};
	
	//## testPlaySilent ()
	this.testPlaySilent = function () {
		this.isTested = true;
		var audio = document.getElementById("sound_silent");
		audio.volume = this.volume;
		audio.currentTime = 0;
		audio.play();
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
	this.play = function (index, opt) {
		
		// サウンドが無効なら即return
		if (! this.enable || this.disable) return;
		
		stTimerApp.isFreeSound = true;
		
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
	this._load = function (index) {
		
		// urlを決定
		// indexは数値でなければならない
		var url = this.soundUrlBase + this.soundUrls[index];
		
		// urlに.mp3が含まれるなら
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