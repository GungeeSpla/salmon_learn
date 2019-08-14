// based on https://github.com/emaame/salmonrun_time_timer

function init () {
	window.stTimerApp = new StTimerApp("OT", 6, 6).startApp();
	
	$(window).bind("orientationchange resize", function () {
		fitWindow();
		setTimeout(fitWindow, 250);
		setTimeout(fitWindow, 500);
		setTimeout(fitWindow, 1000);
	}).trigger("resize");
	
	/*
	$("#mask").fadeOut(1000, function () {
		$(this).remove();
	});
	*/
	
	var image = new Image();
	image.id = "mask_obake";
	image.onload = function () {
		var windowW = getWindowWidth();
		var windowH = getWindowHeight();
		var obakeW = 400 * 5;
		var obakeH = 400 * 5;
		var R = Math.floor(50 + obakeW / windowW * 50);
		var B = Math.floor(50 + obakeH / windowH * 50);
		var L = 100 - R;
		var T = 100 - B;
		setTimeout(function() {
			$("#mask_obake").css({
				"left": Math.floor(windowW / 2 - 400) + "px",
				"top": Math.floor(windowH / 2 - 400) + "px",
				"transform": "scale(5) rotate(720deg)"
			});
			$("#mask_black_left"  ).css("clip-path", "polygon(-100% 0%, "+L+"% 0%, "+L+"% 100%, -100% 100%)");
			$("#mask_black_right" ).css("clip-path", "polygon("+R+"% 0%, 200% 0%, 200% 100%, "+R+"% 100%)");
			$("#mask_black_top"   ).css("clip-path", "polygon(0% -100%, 100% -100%, 100% "+T+"%, 0% "+T+"%)");
			$("#mask_black_bottom").css("clip-path", "polygon(0% "+B+"%, 100% "+B+"%, 100% 200%, 0% 200%)");
			$("#mask_white").css("opacity", "0");
		}, 100);
		setTimeout(function() {
			$("#mask_wrapper").css("opacity", "0");
		}, 1100);
		setTimeout(function() {
			$("#mask_wrapper").css("display", "none");
		}, 1600);
	};
	$("#mask_wrapper").append(image);
	image.src = "./img/obake.png";
}


//# StTimerApp ()
function StTimerApp (stTitle, firstSt, stInterval) {
	var app = this;
	
	this.stTitle       = stTitle;
	this.stTimer       = new StTimer(app, firstSt, stInterval);
	this.sound         = new StSound(app);
	this.dateFormatter = new DateFormatter();
	this.isFreeSound   = false;
	
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
	this.isClearing  = false;
	this.framePerSec   = 60;
	this.loopTimerId   = -1;
	this.loopDuration  = 1000 / this.framePerSec;
	this.updateSttId       = -1;
	this.updateSttDuration = 60 * 1000;
	this.updateOffsetId       = -1;
	this.updateOffsetDuration = 60 * 60 * 1000;
	this.storageKey    = "st_timer_gungee_ott";
	
	//## setStTitle ()
	this.setStTitle = function () {
		var str;
		// フレ部屋モード用の文字列
		var friend = this.stTimer.timeOffset.isEnabledFriendOffset ? "（フレ部屋）" : "";
		// STの時刻をずらしているとき用の文字列
		var sign = app.stTimer.stOffset >= 0 ? "+" : "";
		var offset = app.stTimer.isEnableStOffset ? sign + app.stTimer.stOffset + "分" : "";
		// 文字列の決定
		str = this.stTitle + "<span style='color: Orange'>" + offset + friend + "</span>まで";
		// 文字列を放り込む
		this.$description.html(str);
	};
	
	//## getJqueryObject ()
	this.getJqueryObject = function () {
		this.$allWrapper  = $(".all_wrapper");
		this.$eta         = $(".st_eta_count");
		this.$next        = $(".st_eta_next");
		this.$canvas      = $(".st_eta_canvas");
		this.ctx          = this.$canvas[0].getContext("2d");
		this.$checkSound  = $("#check_sound");
		this.$stWrapper   = $(".st_eta");
		this.$correction  = $(".st_eta_correction");
		this.$description = $(".st_eta_description");
		this.$soundTest   = $(".sound_test_button");
		this.$soundDesc   = $(".st_eta_sound_desc");
		this.$settingVolumePlus  = $(".st_setting_volume_plus");
		this.$settingVolumeMinus = $(".st_setting_volume_minus");
		this.$settingVolumeMute  = $(".st_setting_volume_mute");
		this.$settingVolumeSpan  = $(".st_setting_volume_span");
		this.$settingVolume      = $(".st_setting_volume_plus, .st_setting_volume_minus");
		var clickEvent    = "ontouchstart" in window ? "touchstart" : "click";
		
		//## 音量の調節
		this.$settingVolume.each(function(){
			var $this = $(this);
			var move = parseFloat($this.attr("move"));
			$this.on(clickEvent, function (e) {
				activeButton(this);
				app.sound.volume = app.sound.volume + move;
				app.sound.volume = Math.round(app.sound.volume * 10) / 10;
				app.sound.volume = Math.max(0, Math.min(1, app.sound.volume));
				app.$settingVolume.render();
				app.save();
				app.sound.play("switch");
				return false;
			});
		});
		this.$settingVolume.render = function () {
			var isMuted = app.sound.isMuted;
			/*
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
			*/
			show(app.$settingVolumePlus);
			show(app.$settingVolumeMinus);
			var percent = (app.sound.volume * 100).toFixed(0);
			var text = percent + "%";
			if (isMuted) {
				text = "Muted";
			}
			app.$settingVolumeSpan.text(text);
			function show ($self) {
				$self.removeClass("st_hidden");
			}
			function hide ($self) {
				$self.addClass("st_hidden");
			}
		};
		this.$settingVolume.render();
		
		//## サウンドテスト
		this.$soundTest.on(clickEvent, function (e) {
			e.preventDefault();
			activeButton(this);
			app.sound.play("60");
			return false;
		});
		
		//## サウンドの有効化
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
					}, 8000);
				}
				$(this).off(clickEvent);
			});
		}
		
		//## サウンドのオンオフ		
		this.$checkSound.on("change", function (e) {
			var isChecked = $(this).prop("checked");
			if (isChecked) {
				app.$soundTest.removeClass("hidden_button");
				app.sound.isEnabled = true;
				if (! e.isTrigger) app.sound.play("switch");
			}
			else {
				app.$soundTest.addClass("hidden_button");
				if (! e.isTrigger) app.sound.play("switch");
				app.sound.isEnabled = false;
			}
			if (! e.isTrigger) app.save();
			app.setStTitle();
			return false;
		});
		
		function activeButton (self) {
			var $self = $(self);
			$self.addClass("button_active");
			setTimeout(function () {
				$self.removeClass("button_active");
			}, 100);
		}
	};
	
	//## calcEta ()
	// 残りカウントを計算します
	this.calcEta = function () {
		var now      = this.stTimer.timeOffset.getTime();
		var next     = this.list[0];
		this.bEta    = this.eta;
		this.eta     = next - now;
		this.etaDate = new Date(this.eta);
		this.nowDate = new Date(now);
		this.etaMin  = this.etaDate.getMinutes();
		this.etaSec  = this.etaDate.getSeconds() + 1;
		this.etaMsec = this.etaDate.getMilliseconds() + 1;
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
		if (this.bStageIndex != null && this.bStageIndex != this.stageIndex) {
			this.stageFrame = 0;
			switch (this.stageIndex) {
			case 0: // 残り5秒以内
				if (document.hasFocus && document.hasFocus()) app.sound.play("54321");
				else app.sound.play("5");
				break;
			case 1: // 残り10秒以内
				app.sound.play("10");
				break;
			case 2: // 残り30秒以内
				app.sound.play("30");
				break;
			case 3: // 残り60秒以内
				app.sound.play("60");
				break;
			case this.lastStageIndex: // 残り60秒以上
				this.isClearing = true;
				this.updateStList();
				app.sound.play("switch");
				break;
			}
		}
	};
	
	//## update ()
	// 情報の更新
	this.update = function () {
		// 残り時間の計算
		this.calcEta();
		// stageIndexの更新
		this.updateCountStage();
		var sign = app.stTimer.stOffset >= 0 ? "+" : "";
		var offset = app.stTimer.isEnableStOffset ? sign + app.stTimer.stOffset + "分" : "";
		var str = this.stTitle + offset;
		document.title = str + "まで " + this.dateFormatter.getMinText2(this.etaDate);
		
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
		var str = app.dateFormatter.getMinText(this.etaDate);
		this.$eta.text(str);
		this.clearCanvas();
		// ゼロのフェードアウトを描画
		if (this.stageIndex == this.lastStageIndex) {
			if (this.stageFrame < this.framePerSec && this.isClearing) {
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
		this.stageFrame++;
	};
	
	//## renderOffset (json)
	this.renderOffset = function (json) {
		var str = (json.dif > 0) ?
		          "端末の %dif 秒の遅れを補正済み":
		          "端末の %dif 秒の進みを補正済み";
		    str = str.replace("%dif", Math.abs(json.dif / 1000));
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
		console.log("✅ STリストを更新しました.");
		// 次回を予約
		clearTimeout(app.updateSttId);
		app.updateSttId = setTimeout(app.updateStList, app.updateSttDuration);
		// リストを更新
		app.list = app.stTimer.listupNextSTT();
		// 文字を更新
		var date = app.dateFormatter.getMonthText(app.list[0]);
		var str = "%date までのカウントダウンを表示しています";
		    str = str.replace("%date", date);
		app.$next.text(str);
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
	
	//## save ()
	this.save = function () {
		var saveData = {
			isEnabledSound: this.sound.isEnabled,
			volume        : this.sound.volume
		};
		var saveDataStr = JSON.stringify(saveData);
		localStorage.setItem(this.storageKey, saveDataStr);
	};
	
	//## load ()
	this.load = function () {
		var saveDataStr = localStorage.getItem(this.storageKey);
		if (saveDataStr) {
			var saveData = JSON.parse(saveDataStr);
			var defaultData = {
				isEnabledSound: false,
				volume        : 0.5
			};
			saveData = $.extend({}, defaultData, saveData);
			this.sound.volume = saveData.volume;
			this.sound.isEnabled = saveData.isEnabledSound;
			this.$checkSound.prop("checked", this.sound.enable).trigger("change");
			this.$settingVolume.render();
		}
	};
	
	//## startApp ()
	this.startApp = function () {
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
		setTimeout(this.updateOffset, 100);
		// ロード
		this.load();
		// ループスタート
		this.loop();
		return this;
	};
	
	return this;
}





//# DateFormatter ()
function DateFormatter () {
	
	//## getMonthText (d)
	this.getMonthText = function (d) {
		d.MM = (d.getMonth() + 1);
		d.DD = d.getDate();
		d.hh = d.getHours();
		d.mm = ("00" + d.getMinutes()).slice(-2);
		d.ss = ("00" + d.getSeconds()).slice(-2);
		return d.MM + "/" + d.DD + " " + d.hh + ":" + d.mm + ":" + d.ss;
		// 12/31 23:59:59
	};
	
	//## getMinText (d)
	this.getMinText = function (d) {
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		d.SSS = ("000" + d.getMilliseconds()).slice(-3);
		return (d.mm + ":" + d.ss + "." + d.SSS);
		// 59:59.999
	};
	
	//## getMinText2 (d)
	this.getMinText2 = function (d) {
		d.mm  = ("00" + d.getMinutes()).slice(-2);
		d.ss  = ("00" + d.getSeconds()).slice(-2);
		return (d.mm + ":" + d.ss);
		// 59:59
	};
	
	return this;
}




//# StTimer ()
function StTimer (app, firstSt, stInterval) {
	var self = this;
	
	this.app              = app;
	this.firstSt          = firstSt || 2;
	this.interval         = stInterval || 8;
	this.timeOffset       = new TimeOffset();
	this.stOffset         = 1;
	this.offsetSec        = 0;
	this.isEnableStOffset = false;
	
	//## listupNextSTT (intTime)
	this.listupNextSTT = function (intTime) {
		var list = [];
			
		var queries    = window.queries || {};
		var stOffset   = this.isEnableStOffset ? this.stOffset : 0;
		var firstSt    = parseInt(queries.firstSt)    || this.firstSt;
		    firstSt   += stOffset;
		var interval   = parseInt(queries.STinterval) || this.interval;
		var a          = Math.max(0, interval - firstSt);
		var numPerHour = Math.floor((59 - firstSt - a) / interval) + 1;
		
		var base;
		if (intTime) base = new Date(intTime);
		else base = new Date(this.timeOffset.getTime());
		
		// 現在のピリオドを取得
		// いま0-1分なら第0ピリオド、いま2-9分なら第1ピリオド…となる（第8ピリオドまで）
		// | period  |   0   |            1            | 2  ...  6 |            7            |   8   |
		// | minutes | 00 01 | 02 03 04 05 06 07 08 09 | 10 ... 49 | 50 51 52 53 54 55 56 57 | 58 59 |
		var period = Math.floor((base.getMinutes() - firstSt) / interval) + 1;
		
		// 現在の時間を取得
		var hours = base.getHours();
			
		while (list.length < numPerHour) {
			// ピリオドを増やしながらlistにpushしていく
			// 第7ピリオド以降はこのfor文は実行されない
			// listが7件埋まっているならばこのfor文は実行されな
			for (var i = period; i < numPerHour && list.length < numPerHour; ++i) {
				var minutes = firstSt + i * interval;
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
		
		list.map(st => console.log("- " + this.app.dateFormatter.getMonthText(st)) );
		return list;
	};
	
	return this;
}





//# TimeOffset
function TimeOffset () {
	var self                   = this;
	this.resulat               = {};
	this.offsetJST             = 0;
	this.isEnabledFriendOffset = false;
	this.friendOffset          = 2500;
	this.serverUrls            = [
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
		if (this.isEnabledFriendOffset) offset -= this.friendOffset;
		return time + offset;
	};
	
	//## consoleOffset (json)
	this.consoleOffset = function (json) {
		console.log("✅ NICTサーバにアクセスしました.");
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
				// 結果の格納
				that.result = json;
				that.offsetJST = json.dif;
				// 結果の表示
				that.consoleOffset(json);
				callback(json);
			}
			else {
				console.log("✖ JSTの取得でエラーが発生しました.");
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
function StSound (app) {
	var self = this;
	
	this.app          = app;
	this.isEnabled    = false;
	this.soundUrlBase = "./sounds/";
	this.soundUrls    = [
		"5",
		"10",
		"30",
		"60",
		"54321",
		"switch",
		"click"
	];
	
	// 初期化
	this.volume  = 0.8;
	this.isMuted = false;
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
		if (! this.isEnabled) return;
		
		// オプションをデフォルトオプションに統合する
		opt = $.extend({}, this.defaultOpt, opt);
		
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
	};
	
	return this;
}


//# getWindowWidth()
function getWindowWidth() {
	var w1 = window ? window.innerWidth : 0;
	var w2 = document.documentElement ? document.documentElement.clientWidth : 0;
	var w3 = document.body ? document.body.clientWidth : 0;
	return w1 || w2 || w3;
}

//# getWindowHeight()
function getWindowHeight() {
	var h1 = window ? window.innerHeight : 0;
	var h2 = document.documentElement ? document.documentElement.clientHeight : 0;
	var h3 = document.body ? document.body.clientHeight : 0;
	return h1 || h2 || h3;
		
}

//# fitWindow()
function fitWindow() {
	var GAME_WIDTH = 640;
	var GAME_HEIGHT = 800;
	var GAME_ASPECT = GAME_WIDTH / GAME_HEIGHT;
	var gameScale = 1;
	var gameOffsetLeft = 0;
	var gameOffsetTop = 0;
	
	// ウィンドウの横幅と高さを取得して縦横比を計算
	var windowWidth = getWindowWidth();
	var windowHeight = getWindowHeight();
	var windowAspect = windowWidth / windowHeight;
	
	var bg = document.getElementById("bg");
	var bgHeight = windowHeight;
	var bgWidth = Math.floor(windowHeight * 409 / 230);
	if (bgWidth < windowWidth) {
		bgWidth = windowWidth;
		bgHeight = Math.floor(windowWidth * 230 / 409);
	}
	bg.style.backgroundSize = bgWidth + "px " + bgHeight + "px";
	
	// wapperDivのスタイルにtransformを設定
	// scaleでウィンドウにぴったりさせる translateX, Yでウィンドウ中央に置く
	// ゲーム画面よりもブラウザウィンドウのほうがワイドであるならば
	if (windowAspect > GAME_ASPECT) {
		// 高さをぴっちりさせる
		gameScale = windowHeight / GAME_HEIGHT;
		// 幅が余っているので横に余白が生じる
		var margin = (windowWidth - GAME_WIDTH * gameScale) / 2;
		gameOffsetLeft =  Math.floor(margin);
		gameOffsetTop = 0;
	}
	// ゲーム画面よりもブラウザウィンドウのほうが縦長であるならば
	else {
		// 幅をぴっちりさせる
		gameScale = windowWidth /  GAME_WIDTH;
		// 高さが余っているので縦に余白が生じる
		margin = (windowHeight - GAME_HEIGHT * gameScale) / 2;
		gameOffsetLeft = 0;
		gameOffsetTop = Math.floor(margin);
	}
	setTransform(document.getElementById("main"), gameOffsetLeft, gameOffsetTop, gameScale);
	function setTransform (elm, x, y, scale) {
		scale = "scale(" + scale + ")";
		x = "translateX(" + x + "px)";
		y = "translateY(" + y + "px)";
		var css = [x, y, scale].join(" ");
		elm.style.transform = css;
		elm.style.transformOrigin = "left top";
	}
};