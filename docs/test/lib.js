function getWeaponsData(){
	return new Promise(function(resolve, reject) {
		$.get(WEAPONS_URL, {}).done(function(data){
			console.log("✅ ブキデータの読み込みに成功しました.");
			var stringArray = data.split("\n");
			var jsonObject = csv2json(stringArray);
			WEAPONS = jsonObject;
			if (typeof resolve == "function") resolve();
		}).fail(function(){
			console.error("❌ ブキデータの読み込みに失敗しました.");
			if (typeof reject == "function") reject();
		});
	});
}
function getSalmonAPI () {
	return new Promise(function(resolve, reject) {
		$.get(SALMON_API_URL, {}).done(function (data) {
			console.log("✅ サーモンランAPIの実行に成功しました.");
			data = parseSalmonAPI(data);
			if (typeof resolve == "function") resolve(data);
		}).fail(function (data) {
			console.error("❌ サーモンランAPIの実行に失敗しました.");
			if (typeof reject == "function") reject();
		});
	});
}
function renderRotation(data, $target, next) {
	$target.find(".salmon_rotation_stage_name").text(data.stage_ja);
	$target.find(".salmon_rotation_title").text(next);
	$target.find(".salmon_rotation_time").text(data.start_ja + " - " + data.end_ja);
	$target.find(".salmon_rotation_stage").attr("src", "stage_" + data.stage + ".png");
	$target.find(".salmon_rotation_weapon_1").attr("src", data.w1_img);
	$target.find(".salmon_rotation_weapon_2").attr("src", data.w2_img);
	$target.find(".salmon_rotation_weapon_3").attr("src", data.w3_img);
	$target.find(".salmon_rotation_weapon_4").attr("src", data.w4_img);
}
function render (data) {
	renderRotation(data[0], $(".salmon_rotation_1"), "もうすぐ");
	renderRotation(data[1], $(".salmon_rotation_2"), "つぎ");
	/*
	var latestData = data[0];
	var latestStartTime = UNIX.parse(latestData.start);
	var nowTime = UNIX.getParsedTime();
	var isHold = nowTime > latestStartTime;
	if (isHold) {
		console.log("現在サーモンラン開催中です.");
		console.log("このシフトは残り" + latestData.dif_end_ja + "です.");
	}
	else {
		console.log("現在サーモンラン開催中ではありません.");
		console.log("次のシフトはいまから" + latestData.dif_start_ja + "後に開催されます.");
	}
	console.log(latestData.start_ja + " - " + latestData.end_ja);
	console.log(latestData.stage_ja);
	console.log(latestData.w1_ja);
	console.log(latestData.w2_ja);
	console.log(latestData.w3_ja);
	console.log(latestData.w4_ja);
	*/
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
function addText (text) {
	var $p = $("<p>" + text + "</p>");
	$("#message").append($p);
}