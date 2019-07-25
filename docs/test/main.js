function init () {
	var $settingWrapper = $(".learn_setting_wrapper");
	var $gotoPassword = $settingWrapper.find(".goto_password");
	var $passwordWrapper = $settingWrapper.find(".input_password_wrapper");
	var $inputPassword   = $passwordWrapper.find(".input_text");
	var $inputPasswordOK = $passwordWrapper.find(".input_ok");
	var $alertWrapper = $settingWrapper.find(".alert_wrapper_normal");
	var $alertText    = $alertWrapper.find(".alert_text");
	var $alertOK      = $alertWrapper.find(".input_ok");
	var $radioAlertWrapper = $settingWrapper.find(".alert_wrapper_radio");
	var $radioAlertText    = $radioAlertWrapper.find(".radio_area");
	var $radioAlertOK      = $radioAlertWrapper.find(".input_ok");
	var $changeVoice = $settingWrapper.find(".learn_setting_change");
	var clickEvent = "ontouchend" in window ? "touchend" : "click";
	
	// ラジオボタン画面を表示
	$changeVoice.on(clickEvent, function (e) {
		var data = ["棒読みちゃん", "あきら", "ガンジー"];
		var html = "";
		/*
		<input type="radio" name="radio" class="radio_input" id="radio_1" checked="checked">
		<label for="radio_1">棒読みちゃん</label>
		*/
		data.forEach(function(d, i) {
			var checked = '';
			if (i == 0) checked = 'checked="checked"'
			var str1 = '<input  id="radio_' + i + '" type="radio" name="radio" class="radio_input" ' + checked + '>';
			var str2 = '<label for="radio_' + i + '">' + d + '</label>';
			html += str1 + str2;
		});
		$radioAlertText.html(html);
		$radioAlertWrapper.show(0);
		$radioAlertWrapper.removeClass("setting_hidden");
		return false;
	});
	
	// ラジオボタン画面のOKをクリック
	$radioAlertOK.on(clickEvent, function (e) {
		// 結果アラートを消す
		$radioAlertWrapper.addClass("setting_hidden");
		setTimeout(function(){
			$radioAlertWrapper.hide(0);
		},300);
	});
	
	// パスワード入力画面を表示
	$gotoPassword.on(clickEvent, function (e) {
		$passwordWrapper.show(0);
		$passwordWrapper.removeClass("setting_hidden");
		return false;
	});
	
	// パスワードを送信
	$inputPasswordOK.on(clickEvent, function (e) {
		var value = $inputPassword.val();
		var str = "何も起こりませんでした。";
		if (value == "please-akira") {
			str = "「<b>あきら</b>」ボイスをゲットしました！"
		}
		
		// パスワード入力画面を消す
		$passwordWrapper.addClass("setting_hidden");
		setTimeout(function(){
			$passwordWrapper.hide(0);
			// 結果アラートを表示
			$alertText.html(str);
			$alertWrapper.show(0);
			$alertWrapper.removeClass("setting_hidden");
		},300);
		return false;
	});
	
	// アラート画面のOKをクリック
	$alertOK.on(clickEvent, function (e) {
		// 結果アラートを消す
		$alertWrapper.addClass("setting_hidden");
		setTimeout(function(){
			$alertWrapper.hide(0);
		},300);
	});
	
	
	
	
	
	
}