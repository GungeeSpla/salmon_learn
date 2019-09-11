
window.settingApp = new SettingApp();

//# SettingApp ()
function SettingApp () {
	var app = this;
	
	// ローカルストレージに保存する際に使用するキー
	this.storageKey = "learn_setting";
	
	// デフォルトのセーブデータ
	this.defaultSaveData = {
		isUsableBouyomichanVoice: true,
		isUsableAkiraVoice: false,
		isUsableGungeeVoice: false,
		isUsableStVoice: false,
		isUsableKenshiroVoice: false,
		isUsableAmaneVoice: false,
		usingVoice: "bouyomichan"
	};
	
	// ボイスIDとその日本語文字列
	this.voiceNameMap = {
		"bouyomichan": "棒読みちゃん",
		"akira": "あきらさん",
		"gungee": "ガンジー",
		"st": "STさん",
		"kenshiro": "けんしろさん",
		"amane": "あまねさん"
	};
	
	// セーブ対象のキー
	this.savingKeys = [
		"isUsableBouyomichan",
		"isUsableAkiraVoice",
		"isUsableGungeeVoice",
		"isUsableStVoice",
		"isUsableKenshiroVoice",
		"isUsableAmaneVoice",
		"usingVoice"
	];
	
	//## load ()
	this.load = function () {
		var saveData;
		var saveDataStr = localStorage.getItem(this.storageKey);
		// ローカルストレージから取得できた値があればパースしてデフォルトセーブデータにマージ
		// なければデフォルトセーブデータの複製を作成
		if (saveDataStr) {
			saveData = JSON.parse(saveDataStr);
			saveData = $.extend({}, this.defaultSaveData, saveData);
		} else saveData = $.extend({}, this.defaultSaveData);
		// thisにマージする
		$.extend(this, saveData);
	}
	
	//## save ()
	this.save = function () {
		var saveData = {};
		// セーブ対象のキーを走査して値を入れていく
		this.savingKeys.forEach(function(key){
			saveData[key] = app[key];
		});
		// デフォルトセーブデータにマージ
		saveData = $.extend({}, this.defaultSaveData, saveData);
		// 文字列にパースして保存
		var saveDataStr = JSON.stringify(saveData);
		localStorage.setItem(this.storageKey, saveDataStr);
	}
	
	//## getUsableVoices ()
	this.getUsableVoices = function () {
		var ret = [];
		if (this.isUsableBouyomichanVoice) ret.push("bouyomichan");
		if (this.isUsableAkiraVoice) ret.push("akira");
		if (this.isUsableGungeeVoice) ret.push("gungee");
		if (this.isUsableStVoice) ret.push("st");
		if (this.isUsableKenshiroVoice) ret.push("kenshiro");
		if (this.isUsableAmaneVoice) ret.push("amane");
		return ret;
	};
	
	// SettingAppを初期化
	//## init ()
	this.init = function () {
		this.load();
	};
	
	// SettingAppを起動
	//## startApp ()
	this.startApp = function () {
		this.getJqueryObject();
		this.$usingVoiceProf.text(this.voiceNameMap[this.usingVoice]);
	};
	
	//## getJqueryObject ()
	this.getJqueryObject = function () {
		
		this.$settingWrapper    = $(".learn_setting_wrapper");
		this.$gotoPassword      = this.$settingWrapper.find(".goto_password");
		this.$passwordWrapper   = this.$settingWrapper.find(".input_password_wrapper");
		this.$usingVoiceProf    = this.$settingWrapper.find(".learn_setting_item_prof");
		this.$inputPassword     = this.$passwordWrapper.find(".input_text");
		this.$inputPasswordOK   = this.$passwordWrapper.find(".input_ok");
		this.$alertWrapper      = this.$settingWrapper.find(".alert_wrapper_normal");
		this.$alertText         = this.$alertWrapper.find(".alert_text");
		this.$alertOK           = this.$alertWrapper.find(".input_ok");
		this.$radioAlertWrapper = this.$settingWrapper.find(".alert_wrapper_radio");
		this.$radioAlertText    = this.$radioAlertWrapper.find(".radio_area");
		this.$radioAlertOK      = this.$radioAlertWrapper.find(".input_ok");
		this.$changeVoice       = this.$settingWrapper.find(".learn_setting_change");
		var clickEvent = "ontouchend" in window ? "touchend" : "click";
		
			
		if (this.$changeVoice.attr("is_set_event") != "true") {
			this.$changeVoice.attr("is_set_event", "true");
			
			// ラジオボタン画面を表示
			this.$changeVoice.on(clickEvent, function (e) {
				// ラジオボタンのHTMLを作成
				var html = "";
				// 使用可能なボイス一覧
				var usableVoices = app.getUsableVoices();
				usableVoices.forEach(function(voice, i) {
					var checked = '';
					if (voice == app.usingVoice) checked = 'checked="checked"'
					var str1 = '<input  id="radio_' + i + '" type="radio" name="radio" value="' + voice + '" class="radio_input" ' + checked + '>';
					var str2 = '<label for="radio_' + i + '">' + app.voiceNameMap[voice] + '</label>';
					html += str1 + str2;
				});
				// 作成したHTMLを放り込む
				app.$radioAlertText.html(html);
				// ラジオボタン画面を表示
				app.$radioAlertWrapper.show(0);
				app.$radioAlertWrapper.removeClass("setting_hidden");
				return false;
			});
			
			// ラジオボタン画面のOKをクリック
			this.$radioAlertOK.on(clickEvent, function (e) {
				var $checkedInput = app.$radioAlertText.find("input:checked");
				var checkedValue = $checkedInput.val();
				// usingVoiceに代入
				app.usingVoice = checkedValue;
				// テキストを更新する
				app.$usingVoiceProf.text(app.voiceNameMap[app.usingVoice]);
				// セーブする
				app.save();
				// 結果アラートを消す
				app.$radioAlertWrapper.addClass("setting_hidden");
				setTimeout(function(){
					app.$radioAlertWrapper.hide(0);
				},300);
			});
			
			// パスワード入力画面を表示
			this.$gotoPassword.on(clickEvent, function (e) {
				// 入力を空にする
				app.$inputPassword.val("");
				app.$passwordWrapper.show(0);
				app.$passwordWrapper.removeClass("setting_hidden");
				app.$inputPassword.focus();
				return false;
			});
			
			// パスワードを送信
			this.$inputPasswordOK.on(clickEvent, function (e) {
				// 送信されたパスワードを取得
				var value = app.$inputPassword.val();
				// 空白の削除など
				value = value.replace(/\s*/g, "")
				             .replace(/っ/g, "つ")
				             .replace(/ぇ/g, "え")
				             .replace(/ぃ/g, "い");
				// 判定
				var str = "何も起こりませんでした。";
				switch (value) {
				case "あきらさけがり":
				case "くあつすまねえ":
					app.isUsableAkiraVoice = true;
					str = "おめでとう！<br>「<b>あきらさん</b>」ボイスを<br>ゲットしました！"
					break;
				case "みどりのたまご":
					app.isUsableGungeeVoice = true;
					str = "おめでとう！<br>「<b>ガンジー</b>」ボイスを<br>ゲットしました！"
					break;
				case "まおうえすていー":
					app.isUsableStVoice = true;
					str = "おめでとう！<br>「<b>STさん</b>」ボイスを<br>ゲットしました！"
					break;
				case "ぁ":
					app.isUsableKenshiroVoice = true;
					str = "おめでとう！<br>「<b>けんしろさん</b>」ボイスを<br>ゲットしました！"
					break;
				case "ぁ":
					app.isUsableAmaneVoice = true;
					str = "おめでとう！<br>「<b>あまねさん</b>」ボイスを<br>ゲットしました！"
					break;
				}
				// パスワード入力画面を消す
				app.$passwordWrapper.addClass("setting_hidden");
				setTimeout(function(){
					app.$passwordWrapper.hide(0);
					// 何かを入力していた場合は
					if (value) {
						// 結果を反映
						app.$alertText.html(str);
						// 結果アラートを表示
						app.$alertWrapper.show(0);
						app.$alertWrapper.removeClass("setting_hidden");
					}
				},300);
				return false;
			});
			
			// アラート画面のOKをクリック
			this.$alertOK.on(clickEvent, function (e) {
				// 結果アラートを消す
				app.$alertWrapper.addClass("setting_hidden");
				setTimeout(function(){
					app.$alertWrapper.hide(0);
				},300);
			});
		}
	};
	
	this.init();
	return this;
}