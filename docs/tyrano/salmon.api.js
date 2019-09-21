window.ROTATION_DATA        = false;                                // APIで取得したシフトデータを格納する
window.GEARDATA             = false;
window.GEARDATA_URL         = "./tyrano/reward_gear.json";          // 今回のギア のデータ
window.WEAPONS_URL          = "./tyrano/weapons.csv?21000";         // ブキの評価データシートのcsv
window.WIKIDATA_URL         = "./tyrano/weapons_wikidata.csv?21000";// Wikiに基づくブキの基礎データシートのcsv
window.WEAPONS_AVERAGE      = {isCalced: false};                    // ブキの各項目の評価の平均値
window.WEAPONS_STANDARD     = {isCalced: false};                    // ブキの各項目の評価の標準偏差
window.WEAPONS_HENSACHI     = {};                                   // ブキの各項目の評価の偏差値
window.SALMON_API_URL       = "https://splamp.info/salmon/api/all"; // APIのURL
window.STORAGE_KEY_ROTETION = "rotation_data_20700";                // localStorageに保存する際のキー
window.salmonrunAPI         = new SalmonrunAPI();                   // SalmonrunAPIオブジェクト

//# SalmonrunAPI ()
function SalmonrunAPI () {
	//## .get (resolve, reject)
	// ブキ評価データ･ブキ基礎データ･シフトデータを順に取得して
	// コールバックを実行します
	this.get = function (resolve, reject) {
		getWeaponsData()
		.then(getGearData)
		.then(getWeaponsWikiData)
		.then(getSalmonAPI)
		.then(resolve)
		.catch(reject);
	};
	//## .render (data, target)
	// シフトデータを受け取って結果を描画します
	this.render = function (data, target) {
		// 現在時刻が直近のシフトの開始時刻よりも進んでいるならばオープン中である
        var isOpening = false;
        var data1 = null;
        var data2 = null;
        if (target == "now") {
			// 現在のシフトを描画する場合
            data1 = getLatestRotation(data, 0)
            data2 = getLatestRotation(data, 1)
    		// 現在時刻が直近のシフトの開始時刻よりも進んでいるならばオープン中である
    		isOpening = UNIX.getTime() > data1.start;
        } else {
			// 特定のシフトを描画する場合
            data1 = data[target];
        }
        if (data1 != null)  {
            renderRotation(data1, $(".salmon_rotation_1"));
        }
        if (data2 != null)  {
            renderRotation(data2, $(".salmon_rotation_2"));
        }
		$(".salmon_rotation_cloned").removeClass("hidden");
		// サーモンランが現在オープン中の場合はアニメーション
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
	//## .hideRotation
	// シフトデータの結果を非表示にします
	this.hideRotation = function () {
		$(".salmon_rotation_cloned").addClass("hidden");
	};
	//## .cloneRotationObj (name, x, y, w, h)
	// シフト表示用のDOMをクローニングします
	// nameはクラス名、xとyは座標、wとhは幅と高さ
	this.cloneRotationObj = function (name, x, y, w, h) {
		$(".salmon_rotation_origin").clone()
		.removeClass("salmon_rotation_origin")
		.addClass("salmon_rotation_cloned")
		.addClass(name)
		.css({
			top: y + "px",
			left: x + "px"
		}).appendTo(".0_fore");
	};
	//## getGearData ()
	// ブキの基礎データを取得します
	function getGearData(){
		return new Promise(function(resolve, reject) {
			if (GEARDATA) {
				if (typeof resolve == "function") resolve();
			}
			// そうでなければ$.get()する
			else {
				$.get(GEARDATA_URL, {dataType: "text", cache: false}).done(function(data){
					console.log("✅ ギアデータを読み込みました.");
					if (typeof data == "string") data = JSON.parse(data);
					GEARDATA = data;
					if (typeof resolve == "function") resolve();
				}).fail(function(){
					console.error("❌ ギアデータを読み込めませんでした.");
					if (typeof reject == "function") reject();
				});
			}
		});
	}
	//## getWeaponsWikiData ()
	// ブキの基礎データを取得します
	function getWeaponsWikiData(){
		return new Promise(function(resolve, reject) {
			// WEAPONS_WIKIDATA が定義済みならばresolve
			if (WEAPONS_WIKIDATA) {
				if (typeof resolve == "function") resolve();
			}
			// そうでなければ$.get()する
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
	//## getWeaponsData ()
	// ブキの評価データを取得します
	function getWeaponsData(){
		return new Promise(function(resolve, reject) {
			// WEAPONS が定義済みならばresolve
			if (WEAPONS) {
				if (! WEAPONS_AVERAGE.isCalced) calcWeaponsAverage();
				if (typeof resolve == "function") resolve();
			}
			// そうでなければ$.get()する
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
	//## getSalmonAPI
	// シフトデータを取得します
	// これはテスト用のダミー関数
	function getSalmonAPI () {
		return new Promise(function(resolve, reject) {
			salmonrunRater.evalSalmonHistory();
			ROTATION_DATA = parseSalmonAPI([
			    {
			        "num": 396,
			        "start": 1562760000-60*60*24*(3+18/24),
			        "end": 1562889600-60*60*24*(3+12/24),
			        "stage": 1,
			        "stage_ja": "シェケナダム",
			        "w1": "60",
			        "w2": "5000",
			        "w3": "1000",
			        "w4": "1110",
			    },
			    {
			        "num": 397,
			        "start": 1562911200,
			        "end": 1563040800,
			        "stage": 3,
			        "stage_ja": "海上集落シャケト場",
			        "w1": "50",
			        "w2": "10",
			        "w3": "200",
			        "w4": "-1",
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
			ROTATION_DATA = parseSalmonAPI(ROTATION_DATA);
			if (typeof resolve == "function") resolve(ROTATION_DATA);
		});
	}
	//## getSalmonAPI
	// シフトデータを取得します
	function getSalmonAPI () {
		return new Promise(function(resolve, reject) {
			// いままでのシフト履歴を評価します
			salmonrunRater.evalSalmonHistory();
			// シフトデータが取得済み、かつ、現在時刻が直近のシフトの終了時刻より前であるならば
			// 更新の必要がないのでresolve
			if (ROTATION_DATA && UNIX.getTime() < getLatestRotation(ROTATION_DATA, 0).end) {
				if (typeof resolve == "function") resolve(ROTATION_DATA);
			}
			// それ以外
			else {
				var isCached = false;
				// localStorageからデータを持ってくる
				var cache_data = localStorage.getItem(STORAGE_KEY_ROTETION);
				// キャッシュがあるなら
				if (cache_data != null) {
					console.log("✅ シフトデータをキャッシュから取得しました.");
					// JavaScriptの型に直す
					var data = cache_data;
					if (typeof cache_data == "string") data = JSON.parse(cache_data);
					// 現在時刻が直近のシフトの終了時刻より前であるならば期限は切れていない
					if (UNIX.getTime() < getLatestRotation(data, 0).end) {
						// キャッシュが有効なのでisCachedをtrueにしてresolve
						isCached = true;
						console.log("✅ サーモンランAPIは実行しませんでした.");
						ROTATION_DATA = parseSalmonAPI(data);
						if (typeof resolve == "function") resolve(ROTATION_DATA);
					}
					else {
						console.log("❌ キャッシュの期限が切れていたので、サーモンランAPIを実行します.");
					}
				}
				// isCachedがfalseのままならば（キャッシュがなかったか、期限が切れていたならば）
				if (! isCached) {
					// $.get()する
					$.get(SALMON_API_URL, {dataType: "text"}).done(function (data) {
						console.log("✅ サーモンランAPIを実行してシフトデータを取得しました.");
						if (typeof data == "string") data = JSON.parse(data);
						// 全件取得のAPIは最新の5件取得のAPIとシフトデータの新旧の並びが逆順なので、並びを反転させる
                        data.reverse()
						var json_data = data;
						if (typeof data != "string") json_data = JSON.stringify(data);
						// localStorageに入れる
						localStorage.setItem(STORAGE_KEY_ROTETION, json_data);
						// parseSalmonAPIでパースしてからROTATION_DATAに入れる
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
	//## calcWeaponsAverage ()
	// ブキの各項目の評価の平均値を求める
	function calcWeaponsAverage () {
		// 計算済みだという印をつける
		window.WEAPONS_AVERAGE.isCalced = true;
		window.WEAPONS_STANDARD.isCalced = true;
		// 各項目のキー名を配列で取得
		var keys = Object.keys(WEAPONS["0"]);
		keys.forEach(function(key){
			// 数値型のものについてのみ、平均値と標準偏差を計算
			if (WEAPONS.type[key] == "number") {
				var arr = createArray(key);
				var avr = calcAverage(arr);
				var srd = calcStandard(arr, avr);
				WEAPONS_AVERAGE[key] = Math.myRound(avr);
				WEAPONS_STANDARD[key] = Math.myRound(srd);
			}
		});
		// すべての武器について
		WEAPON_IDS.forEach(function(id){
			// 偏差値用のオブジェクトを作成し
			WEAPONS_HENSACHI[id] = {};
			var weapon = WEAPONS[id];
			keys.forEach(function(key){
				// 数値型の項目について偏差値を計算
				if (WEAPONS.type[key] == "number") {
					WEAPONS_HENSACHI[id][key] =
						Math.myRound(calcHensachi(weapon[key], WEAPONS_AVERAGE[key], WEAPONS_STANDARD[key]));
				}
				else {
					WEAPONS_HENSACHI[id][key] = weapon[key];
				}
			});
		});
		//### createArray (key)
		// すべてのブキの特定の評価項目を取り出して配列にして返す
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
	//## renderRotation (data, $target, isOpening)
	// シフトデータを描画する
	function renderRotation(data, $target, isOpening) {
		$target.find(".salmon_rotation_stage_name").text(data.stage_ja);	
		$target.find(".salmon_rotation_time").html(data.start_ja + " - " + data.end_ja);
		$target.find(".salmon_rotation_stage").attr("src", "./data/fgimage/stage_" + data.stage + ".png");
		$target.find(".salmon_rotation_weapon_1").attr("src", "./weapons/" + data.w1 + ".png");
		$target.find(".salmon_rotation_weapon_2").attr("src", "./weapons/" + data.w2 + ".png");
		$target.find(".salmon_rotation_weapon_3").attr("src", "./weapons/" + data.w3 + ".png");
		$target.find(".salmon_rotation_weapon_4").attr("src", "./weapons/" + data.w4 + ".png");
	}
	//## parseSalmonAPI (data)
	// APIで取得したデータをちょっと加工する
	function parseSalmonAPI (data) {
		var now = UNIX.getTime();
		var keys = ["start", "end", "duration", "dif_start", "dif_end"];
		var opts = [0, 0, 1, 2, 2];
		data = eval(data);
		data.forEach(function(theRotation) {
			// 開催時間、開始時刻との差、終了時刻との差を計算
			theRotation.duration    = Math.abs(theRotation.end   - theRotation.start);
			theRotation.dif_start   = Math.abs(theRotation.start - now);
			theRotation.dif_end     = Math.abs(theRotation.end   - now);
			// 開始時刻と終了時刻を見やすい日本語にする
			keys.forEach(function(key, i){
				theRotation[key + "_ja"] = UNIX.parse(theRotation[key], opts[i]);
			});
		});
		return data;
	}
	//## csv2json (csvArray, bool)
	// csvをjsonに加工します
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
	//## getLatestRotation (data, index)
    // 直近のシフトを示すシフトデータを取得する
    function getLatestRotation(data, index) {
        return data[data.length - 5 + index];
    }
	return this;
}