window.ROTATION_DATA        = false;
window.WEAPONS_URL          = "./tyrano/weapons.csv";
window.WIKIDATA_URL         = "./tyrano/weapons_wikidata.csv";
window.WEAPONS_AVERAGE      = {isCalced: false};
window.WEAPONS_STANDARD     = {isCalced: false};
window.WEAPONS_HENSACHI     = {};
window.SALMON_API_URL       = "https://splamp.info/salmon/api/now";
window.STORAGE_KEY_ROTETION = "rotation_data";
window.salmonrunAPI         = new SalmonrunAPI();
function SalmonrunAPI () {
	this.get = function (resolve, reject) {
		getWeaponsData()
		.then(getWeaponsWikiData)
		.then(getSalmonAPI)
		.then(resolve)
		.catch(reject);
	};
	this.render = function (data) {
		var latestData = data[0];
		var isOpening = UNIX.getTime() > latestData.start;
		renderRotation(data[0], $(".salmon_rotation_1"));
		renderRotation(data[1], $(".salmon_rotation_2"));
		$(".salmon_rotation_cloned").removeClass("hidden");
		if (isOpening) {
			$(".open_title").show(0).textillate({
		      loop: false,  
		      minDisplayTime: 3000,  
		      initialDelay: 0,  
		      autoStart: true,  
		      in: {
		        effect: "fadeInUp",  
		        delayScale: 1.5,  
		        delay: 50,  
		        sync: false,  
		        shuffle: false
		      }
		    });
		}
	};
	this.cloneRotationObj = function (name, x, y, w, h) {
		$(".salmon_rotation_origin").clone().removeClass("salmon_rotation_origin").addClass("salmon_rotation_cloned")
		.addClass(name)
		.css({
			top: y + "px",
			left: x + "px"
		}).appendTo(".0_fore");
	};
	function getWeaponsWikiData(){
		return new Promise(function(resolve, reject) {
			if (WEAPONS_WIKIDATA) {
				if (typeof resolve == "function") resolve();
			}
			else {
				$.get(WIKIDATA_URL, {dataType: "text", cache: false}).done(function(data){
					console.log("✅ Wikiデータを読み込みました.");
					var stringArray = data.split("\n");
					var jsonObject = csv2json(stringArray, true);
					WEAPONS_WIKIDATA = jsonObject;
					if (typeof resolve == "function") resolve();
				}).fail(function(){
					console.error("❌ Wikiデータを読み込めませんでした.");
					if (typeof reject == "function") reject();
				});
			}
		});
	}
	function getWeaponsData(){
		return new Promise(function(resolve, reject) {
			if (WEAPONS) {
				if (! WEAPONS_AVERAGE.isCalced) calcWeaponsAverage();
				if (typeof resolve == "function") resolve();
			}
			else {
				$.get(WEAPONS_URL, {dataType: "text", cache: false}).done(function(data){
					console.log("✅ ブキデータを読み込みました.");
					var stringArray = data.split("\n");
					var jsonObject = csv2json(stringArray, false);
					WEAPONS = jsonObject;
					if (! WEAPONS_AVERAGE.isCalced) calcWeaponsAverage();
					if (typeof resolve == "function") resolve();
				}).fail(function(){
					console.error("❌ ブキデータを読み込めませんでした.");
					if (typeof reject == "function") reject();
				});
			}
		});
	}
	//# getSalmonAPI
	function getSalmonAPI2 () {
		return new Promise(function(resolve, reject) {
			salmonrunRater.evalSalmonHistory();
			ROTATION_DATA = parseSalmonAPI([
			    {
			        "num": 396,
			        "start": 1562760000,
			        "end": 1562889600,
			        "stage": 4,
			        "stage_ja": "トキシラズいぶし工房",
			        "w1": "-2",
			        "w1_ja": "スプラローラー",
			        "w2": "-2",
			        "w2_ja": "シャープマーカー",
			        "w3": "-2",
			        "w3_ja": "エクスプロッシャー",
			        "w4": "-2",
			        "w4_ja": "デュアルスイーパー",
			    },
			    {
			        "num": 397,
			        "start": 1562911200,
			        "end": 1563040800,
			        "stage": 3,
			        "stage_ja": "海上集落シャケト場",
			        "w1": "50",
			        "w1_ja": ".52ガロン",
			        "w2": "10",
			        "w2_ja": "わかばシューター",
			        "w3": "200",
			        "w3_ja": "ノヴァブラスター",
			        "w4": "-1",
			        "w4_ja": "スプラチャージャー",
			    },
			    {
			        "num": 398,
			        "start": 1563062400,
			        "end": 1563213600
			    },
			    {
			        "num": 399,
			        "start": 1563235200,
			        "end": 1563364800
			    },
			    {
			        "num": 400,
			        "start": 1563379200,
			        "end": 1563530400
			    }
			]);
			if (typeof resolve == "function") resolve(ROTATION_DATA);
		});
	}
	//# getSalmonAPI
	function getSalmonAPI () {
		return new Promise(function(resolve, reject) {
			salmonrunRater.evalSalmonHistory();
			if (ROTATION_DATA && UNIX.getTime() < ROTATION_DATA[0].end) {
				if (typeof resolve == "function") resolve(ROTATION_DATA);
			}
			else {
				var isCached = false;
				var cache_data = localStorage.getItem(STORAGE_KEY_ROTETION);
				// キャッシュがあるなら
				if (cache_data != null) {
					console.log("✅ シフトデータをキャッシュから取得しました.");
					// JavaScriptの型に直す
					var data = cache_data;
					if (typeof cache_data == "string") data = JSON.parse(cache_data);
					// 期限切れでなければ
					if (UNIX.getTime() < data[0].end) {
						// キャッシュを返す
						isCached = true;
						console.log("✅ サーモンランAPIは実行しませんでした.");
						ROTATION_DATA = parseSalmonAPI(data);
						if (typeof resolve == "function") resolve(ROTATION_DATA);
					}
					else {
						console.log("❌ キャッシュの期限が切れていたので、サーモンランAPIを実行します.");
					}
				}
				if (! isCached) {
					$.get(SALMON_API_URL, {dataType: "text"}).done(function (data) {
						console.log("✅ サーモンランAPIを実行してシフトデータを取得しました.");
						var json_data = data;
						if (typeof data != "string") json_data = JSON.stringify(data);
						localStorage.setItem(STORAGE_KEY_ROTETION, json_data);
						ROTATION_DATA = parseSalmonAPI(data);
						if (typeof resolve == "function") resolve(ROTATION_DATA);
					}).fail(function (data) {
						console.error("❌ サーモンランAPIの実行に失敗しました.");
						if (typeof reject == "function") reject();
					});
				}
			}
		});
	}
	//# calcWeaponsAverage
	function calcWeaponsAverage () {
		window.WEAPONS_AVERAGE.isCalced = true;
		window.WEAPONS_STANDARD.isCalced = true;
		var keys = Object.keys(WEAPONS["0"]);
		keys.forEach(function(key){
			if (WEAPONS.type[key] == "number") {
				var arr = createArray(key);
				var avr = calcAverage(arr);
				var srd = calcStandard(arr, avr);
				WEAPONS_AVERAGE[key] = Math.myRound(avr);
				WEAPONS_STANDARD[key] = Math.myRound(srd);
			}
		});
		WEAPON_IDS.forEach(function(id){
			WEAPONS_HENSACHI[id] = {};
			var weapon = WEAPONS[id];
			keys.forEach(function(key){
				if (WEAPONS.type[key] == "number") {
					WEAPONS_HENSACHI[id][key] =
						Math.myRound(calcHensachi(weapon[key], WEAPONS_AVERAGE[key], WEAPONS_STANDARD[key]));
				}
				else {
					WEAPONS_HENSACHI[id][key] = weapon[key];
				}
			});
		});
		function createArray (key) {
			var ret = [];
			WEAPON_IDS.forEach(function(id){
				if (id > -1 && id < 7000) {
					ret.push(WEAPONS[id][key]);
				}
			});
			return ret;
		}
	}
	function renderRotation(data, $target, isOpening) {
		$target.find(".salmon_rotation_stage_name").text(data.stage_ja);	
		$target.find(".salmon_rotation_time").html(data.start_ja + " - " + data.end_ja);
		$target.find(".salmon_rotation_stage").attr("src", "./data/fgimage/stage_" + data.stage + ".png");
		$target.find(".salmon_rotation_weapon_1").attr("src", "./weapons/" + data.w1 + ".png");
		$target.find(".salmon_rotation_weapon_2").attr("src", "./weapons/" + data.w2 + ".png");
		$target.find(".salmon_rotation_weapon_3").attr("src", "./weapons/" + data.w3 + ".png");
		$target.find(".salmon_rotation_weapon_4").attr("src", "./weapons/" + data.w4 + ".png");
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
	function csv2json (csvArray, bool) {
		var jsonObject = {};
		var items = csvArray[0].split(',');
		for (var i = 1; i < csvArray.length; i++) {
			var a_line = {};
			var csvArrayD = csvArray[i].split(',');
			var key = csvArrayD[0];
			for (var j = 0; j < items.length - 1; j++) {
				a_line[items[j]] = csvArrayD[j];
			}
			jsonObject[key] = a_line;
		}
		if (bool) return jsonObject;
		var ids = Object.keys(jsonObject);
		items.forEach(function(key){
			switch (jsonObject.type[key]) {
			case "number":
				ids.forEach(function(id){
					if (id != "type") {
						jsonObject[id][key] = parseInt(jsonObject[id][key]);
					}
				});
				break;
			case "boolean":
				ids.forEach(function(id){
					if (id != "type") {
						jsonObject[id][key] = Boolean(parseInt(jsonObject[id][key]));
					}
				});
				break;
			case "string":
			default:
				break;
			}
		});
		ids.forEach(function(id){
			if (id != "type") {
				jsonObject[id].id = parseInt(jsonObject[id].id);
			}
		});
		return jsonObject;
	}
	return this;
}