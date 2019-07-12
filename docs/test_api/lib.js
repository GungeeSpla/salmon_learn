function getWeaponsData(){
	return new Promise(function(resolve, reject) {
		$.get(WEAPONS_URL, {dataType: "text"}).done(function(data){
			console.log("✅ ブキデータを読み込みました.");
			var stringArray = data.split("\n");
			var jsonObject = csv2json(stringArray);
			WEAPONS = jsonObject;
			if (typeof resolve == "function") resolve();
		}).fail(function(){
			console.error("❌ ブキデータを読み込めませんでした.");
			if (typeof reject == "function") reject();
		});
	});
}
function getSalmonAPI () {
	return new Promise(function(resolve, reject) {
		var isCached = false;
		var cache_data = localStorage.getItem(STORAGE_KEY_ROTETION);
		// キャッシュがあるなら
		if (cache_data != null) {
			console.log("✅ キャッシュを取得しました.");
			// JavaScriptの型に直す
			var data = cache_data;
			if (typeof cache_data == "string") data = JSON.parse(cache_data);
			// 期限切れでなければ
			if (UNIX.getTime() < data[0].end) {
				// キャッシュを返す
				isCached = true;
				console.log("✅ サーモンランAPIの実行を抑制しました.");
				data = parseSalmonAPI(data);
				if (typeof resolve == "function") resolve(data);
			}
			else {
				console.log("❌ キャッシュの期限が切れていたので、サーモンランAPIを実行します.");
			}
		}
		if (! isCached) {
			$.get(SALMON_API_URL, {dataType: "text"}).done(function (data) {
				console.log("✅ サーモンランAPIの実行に成功しました.");
				
				var json_data = data;
				if (typeof data != "string") json_data = JSON.stringify(data);
				localStorage.setItem(STORAGE_KEY_ROTETION, json_data);
				
				data = parseSalmonAPI(data);
				if (typeof resolve == "function") resolve(data);
			}).fail(function (data) {
				console.error("❌ サーモンランAPIの実行に失敗しました.");
				if (typeof reject == "function") reject();
			});
		}
	});
}
function renderRotation(data, $target, next) {
	$target.find(".salmon_rotation_stage_name").text(data.stage_ja);
	$target.find(".salmon_rotation_title").text(next);
	$target.find(".salmon_rotation_time").text(data.start_ja + " - " + data.end_ja);
	$target.find(".salmon_rotation_stage").attr("src", "../data/fgimage/stage_" + data.stage + ".png");
	$target.find(".salmon_rotation_weapon_1").attr("src", data.w1_img);
	$target.find(".salmon_rotation_weapon_2").attr("src", data.w2_img);
	$target.find(".salmon_rotation_weapon_3").attr("src", data.w3_img);
	$target.find(".salmon_rotation_weapon_4").attr("src", data.w4_img);
}
function render (data) {
	var latestData = data[0];
	var isOpening = UNIX.getTime() > latestData.start;
	renderRotation(data[0], $(".salmon_rotation_1"), isOpening ? "オープン!" : "もうすぐ");
	renderRotation(data[1], $(".salmon_rotation_2"), "つぎ");
}
function parseSalmonAPI (data) {
	var now = UNIX.getTime();
	var keys = ["start", "end", "duration", "dif_start", "dif_end"];
	var opts = [0, 0, 1, 2, 2];
	data = eval(data);
	data.forEach(function(theRotation) {
		theRotation.duration    = Math.abs(theRotation.end   - theRotation.start);
		theRotation.dif_start   = Math.abs(theRotation.start - now);
		theRotation.dif_end     = Math.abs(theRotation.end   - now);
		keys.forEach(function(key, i){
			theRotation[key + "_ja"] = UNIX.parse(theRotation[key], opts[i]);
		});
	});
	return data;
}
function csv2json(csvArray){
	var jsonObject = {};
	var items = csvArray[0].split(',');
	for (var i = 1; i < csvArray.length - 1; i++) {
		var a_line = {};
		var csvArrayD = csvArray[i].split(',');
		var key = csvArrayD[0];
		for (var j = 1; j < items.length; j++) {
			a_line[items[j]] = csvArrayD[j];
		}
		jsonObject[key] = a_line;
	}
	return jsonObject;
}
function Unix () {
	this.getTime = function () {
		return Math.floor(new Date().getTime()/1000);
	};
	this.getParsedTime = function () {
		return this.parse(this.getTime());
	};
	this.parse = function (intTime, type) {
		intTime = parseInt(intTime);
		if (! type) type = 0;
		switch (type) {
		case 0:
			var d = new Date(intTime * 1000);
			var year  = d.getFullYear();
			var month = d.getMonth() + 1;
			var day   = d.getDate();
			var hour  = ('0' + d.getHours()).slice(-2);
			var min   = ('0' + d.getMinutes()).slice(-2);
			var sec   = ('0' + d.getSeconds()).slice(-2);
			var yobi  = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
			return(month + '/' + day + '(' + yobi + ') ' + hour + ':' + min);
		case 1:
			var d = new Date(intTime * 1000);
			var day   = d.getDate();
			var hour  = d.getHours() + (day - 1) * 24;
			return hour + "時間";
		case 2:
			var d = new Date(intTime * 1000);
			var day   = d.getDate();
			var hour  = d.getHours() + (day - 1) * 24;
			var min   = d.getMinutes();
			return hour + "時間" + min + "分";
		}
	};
}