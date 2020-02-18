window.EVAL_HISTORY   = [];                   // 
window.EVAL_AVERAGE   = {isCalced: false};    // 
window.EVAL_STANDARD  = {isCalced: false};    // 
window.salmonrunRater = new SalmonrunRater(); // 
window.EVAL_LANG = {                          // 
	"runk": "ブキスペック",
	"powerInWinning": "押しているときの強さ",
	"powerInLosing": "押されているときの強さ",
	"stability": "安定性",
	"firePower": "処理力",
	"range": "射程",
	"handling": "扱いやすさ",
	"mobility": "機動力",
	"flexibility": "柔軟性",
	"paintabilityFloor": "塗り",
	"paintabilityWall": "壁塗り",
	"isCharge": "チャージブキ",
	"isPenetrateFriend": "味方を貫通するブキ",
	"stingers": "タワー",
	"steelheads": "バクダン",
	"drizzlers": "コウモリ",
	"scrappers": "テッパン",
	"grillers": "グリル",
	"mothership": "ハコビヤ",
	"rush": "ラッシュ",
	"goldieSeeking": "間欠泉",
	"smalls": "コジャケ",
	"fats": "ドスコイ"
};



//# SalmonrunRater ()
function SalmonrunRater () {
	
	
	
	this.chart = null;
	
	
	
	//## .calcScore (evalObject)
	// 編成のスコアを計算します
	this.calcScore = function (evalObject) {
		var h = evalObject.hensachi;
		var score = calcWeightingAverage([
			h["runk"],
			h["firePower"],
			h["flexibility"],
			h["handling"],
			h["stability"],
			h["mobility"]
		], [4, 1, 1, 3, 1, 1]);
		return Math.myRound(score);
	};
	
	
	
	//## .evalSalmonHistory ()
	// 過去の編成履歴をまとめて評価します
	this.evalSalmonHistory = function () {
		// 計算済みならばreturn
		if (EVAL_AVERAGE.isCalced) return;
		
		console.time("Evaluation of past rotation");
		var that = this;
		
		// 編成履歴をevalした結果を配列に放り込んでいく
		SALMON_HISTORY.forEach(function(weaponArray){
			EVAL_HISTORY.push(that.eval(weaponArray));
		});
		// 平均と標準偏差を計算
		var keys = Object.keys(EVAL_HISTORY[0].avr);
		EVAL_HISTORY.forEach(function(evalObject){
			var avrs = createArrayByOneKey(EVAL_HISTORY, "avr");
			keys.forEach(function(key) {
				var values = createArrayByOneKey(avrs, key);
				var avr = calcAverage(values);
				EVAL_AVERAGE[key] = Math.myRound(avr);
				EVAL_STANDARD[key] = Math.myRound(calcStandard(values, avr));
			});
		});
		// 偏差値とスコアを計算
		EVAL_HISTORY.forEach(function(evalObject){
			evalObject.hensachi = {};
			var keys = Object.keys(evalObject.weapons[0]);
			keys.forEach(function(key){
				if (WEAPONS.type[key] == "number") {
					//var arr = createArrayByOneKey(evalObject.weapons, key);
					evalObject.hensachi[key] = Math.myRound(calcHensachi(evalObject.avr[key], EVAL_AVERAGE[key], EVAL_STANDARD[key]));
				}
			});
			evalObject.score = that.calcScore(evalObject);
		});
		// スコアの配列を作って、スコアの平均と標準偏差を計算
		var arr = createArrayByOneKey(EVAL_HISTORY, "score");
		var avr = calcAverage(arr);
		var std = calcStandard(arr, avr);
		EVAL_AVERAGE.score  = Math.myRound(avr);
		EVAL_STANDARD.score = Math.myRound(std);
		EVAL_AVERAGE.isCalced = true;
		EVAL_STANDARD.isCalced = true;
		console.log("✅ これまでの編成の評価が終わりました.");
		console.log("平均値: " + EVAL_AVERAGE.score + ", 標準偏差: " + EVAL_STANDARD.score);
		console.timeEnd("Evaluation of past rotation");
	};
	
	
	
/*
salmonrunRater.createEvalMessage(EVAL_HISTORY[1])
for (var i = 0; i < 100; i++) {
	salmonrunRater.createEvalMessage(EVAL_HISTORY[i])
}
*/
	
	
	
	//## .createEvalMessage (ret)
	// 寸評を作成する
	this.createEvalMessage = function (ret) {
		var mess = [], mes, arr, arr2, str, len;
		
		// コンソール
		arr = [];
		ret.weapons.forEach(function(weapon){
			arr.push(weapon);
		});
		
		switch (ret.randomType) {
		case 0:
			str = [arr[0].ja, arr[1].ja, arr[2].ja, arr[3].ja].join(", ");
			break;
		case 1:
			str = [arr[0].ja, arr[1].ja, arr[2].ja, "緑ランダム"].join(", ");
			break;
		case 2:
			str = "オールランダム（緑）";
			break;
		case 3:
			str = "オールランダム（金）";
			break;
		}
		console.log("✅ この編成を評価してみます.");
		console.log("%c" + str, "color: blue;");
		
		if (ret.randomType == 2) {
			push("緑のオールランダム編成です。今回はどんなブキが紛れ込んでいるのか…楽しみですね。");
			push("オールランダムということで、ときにはとんでもないヘンテコ編成になることもあります。");
			push("Waveのたびに編成を確認して、味方は何が苦手で、自分は何が得意なのか、考えてみるとよいでしょう。");
			push("とはいえ、オールランダムは一種のお祭り！");
			push("ぜひ、楽しみながらバイトしてください！");
			return mess;
		}
		else if (ret.randomType == 3) {
			push("金のオールランダム編成です。なんと、クマサン印のブキしか支給されません！");
			push("<b>クマサン印のブラスター</b>は高い処理力と機動力を持っており、安定して動けるバランスの良いブキです。");
			push("<b>クマサン印のシェルター</b>はいささか心もとない性能ですが、塗りは抜群です。床も壁もびっちり塗りましょう。");
			push("<b>クマサン印のチャージャー</b>や<b>クマサン印のスロッシャー</b>は凶悪な性能を持っています。");
			push("クマサン印はスロッシャーは地形以外のすべてを貫通します。カタパやバクダンの本体をぶち抜いたり、閉じているコウモリを倒したり！");
			push("インク管理にだけ注意しつつ戦えば、向かうところ敵なしでしょう！");
			return mess;
		}
		
		if (ret.randomType == 1) {
			push("1枠ランダム編成ですね！");
		}
		
		// スコアを明示
		mes = "この編成のスコアは%score%!<br>"
		.replace("%score%", b(ret.score));
		if        (ret.score < 43) { mes += "かなり厳しい編成です。";
		} else if (ret.score < 47) { mes += "あまり強くない編成です。";
		} else if (ret.score < 53) { mes += "平均的な強さの編成です。";
		} else if (ret.score < 58) { mes += "強めの編成です!";
		} else {                     mes += "かなり強い編成です!!";
		}
		push(mes);
		
		// 優れているところと難があるところ
		arr = getSortedEvalArray([
			"paintabilityFloor",
			"range",
			"stability",
			"handling",
			"mobility",
			"flexibility",
			"firePower"
		]);
		len = arr.length;
		var good1 = EVAL_LANG[arr[0].key];
		var good2 = EVAL_LANG[arr[1].key];
		var bad1  = EVAL_LANG[arr[len - 1].key];
		var bad2  = EVAL_LANG[arr[len - 2].key];
		if (arr[len - 1].value > 47) {
			mes = "%good1%と%good2%に優れる隙のない編成です。";
		} else if (arr[len - 2].value > 47) {
			mes = "%good1%と%good2%に優れる一方で、%bad1%に難があります。";
		} else {
			mes = "%good1%と%good2%に優れる一方で、%bad1%と%bad2%に難があります。";
		}
		push(mes.replace("%good1%", b(good1))
		.replace("%good2%",         b(good2))
		.replace("%bad1%",          b(bad1))
		.replace("%bad2%",          b(bad2)));	
		
		if (ret.hensachi.runk > 54) {
			str = "";
			// 弱強強強みたいな編成
			arr = getSortedWepons123("runk");
			if (arr[0].runk < 45 && arr[1].runk > 51) {
				str += b(arr[0].ja) + "以外の";
			}
			if (ret.hensachi.handling > 55) {
				str += "ブキ性能が高い上に扱いやすいブキが揃っており、かなり強い編成と言っていいでしょう！";
			} else if (ret.hensachi.handling < 45) {
				str += "ブキ性能は高いものの、クセが全体的に強いので、印象ほど楽ではないかもしれません。";
			} else {
				str += "ブキ性能は比較的高めです。";
			}
			push(str);
		} else if (ret.hensachi.runk < 46) {
			if (ret.hensachi.handling > 55) {
				push("ブキの性能は控えめですが、クセがなく扱いやすいブキが多いので、とても軽快に動けるでしょう！");
			} else if (ret.hensachi.handling < 45) {
				push("ブキの性能的にも、扱いやすさ的にも、厳しいと言わざるを得ません。");
			} else {
			}
		} else {
			push("編成の強さは総合的に見て平均的といったところです。");
		}
		
		if (ret.hensachi.paintabilityFloor < 45) {
			arr = getSortedWepons321("paintabilityFloor");
			str = b(arr[0].ja);
			if (arr[1]["paintabilityFloor"] > 50) str = str + "や" + b(arr[1].ja); 
			push("塗りが弱めのようです。比較的塗りが強めの%weapon%が周りをしっかり塗り固めると、味方が動きやすくなります。"
			.replace("%weapon%", str));
		}
		
		if (ret.hensachi.stability < 45) {
			push("押されだすと辛く打開が難しい編成です。早め早めの処理を心がけましょう。");
		}
		
		arr = getSortedWepons123("runk");
		arr2 = [];
		arr.forEach(function(weapon){
			if (weapon.runk < 48) arr2.push(b(weapon.ja));
		});
		if (arr2.length > 0) {
			str = arr2.join("、");
			push("安定したキャリーが難しいブキとして、%weapon%が挙げられます。これを持ったときはSPを早めに切るとよいでしょう。"
			.replace("%weapon%", str));
		}
		
		if (ret.hensachi.flexibility < 45) {
			push("ブキの柔軟性に懸念があり、自分が持ったブキの得意なこと・苦手なことに気を配るとよさそうです。");
		}
		
		arr = [];
		arr2 = [
			"stingers",
			"steelheads",
			"drizzlers",
			"scrappers",
			"grillers",
//			"mothership",
			"rush",
			"goldieSeeking",
			"smalls",
			"fats"
		];
		var line = 45;
		arr2.forEach(function(key){
			if (ret.hensachi[key] <= line) arr.push(b(EVAL_LANG[key]));
		});
		if (arr.length > 0) {
			mes = "またこの編成は、%enemy%に弱いようです。"
			.replace("%enemy%", arr.join("、"));
			push(mes);
			if (ret.randomType == 1) {
				push("%weapon%では、このあたりをカバーできるブキを引きたいところですね。"
				.replace("%weapon%", b("ランダム枠")));
			}
			if (arr.indexOf(b("コウモリ")) > -1) {
				push("コウモリに対しては、しっかり雨を返していくことが重要になるでしょう。");
			}
			if (arr.indexOf(b("タワー")) > -1) {
				arr2 = getSortedWepons321("stingers");
				push("タワーを倒しやすいのは%weapon1%、%weapon2%です。これらを持ったときは積極的にタワーを見ましょう。"
				.replace("%weapon1%", b(arr2[0].ja))
				.replace("%weapon2%", b(arr2[1].ja)));
			}
			if (arr.indexOf(b("バクダン")) > -1) {
				arr2 = getSortedWepons321("steelheads");
				push("バクダンを倒しやすいのは%weapon1%、%weapon2%です。"
				.replace("%weapon1%", b(arr2[0].ja))
				.replace("%weapon2%", b(arr2[1].ja)));
				push("バクダンが苦手なブキを持った場合でも、ちょっとずつ削ったり、バクダンを外側に向けて被害を減らしたりすると良いでしょう。");
			}
			if (arr.indexOf(b("グリル")) > -1) {
				push("グリルは難しいので、グリルをスタンさせるために積極的にSPを使いましょう。");
			}
			if (arr.indexOf(b("ラッシュ")) > -1) {
				push("ラッシュは苦戦が予想されます。使えるSPはなんでも使うのがよいでしょう。ハイプレやボムピも味方の納品の助けとなります。");
			}
			if (arr.indexOf(b("コジャケ")) > -1) {
				arr2 = getSortedWepons321("smalls");
				push("コジャケは%weapon1%、%weapon2%が積極的に見てあげると味方が楽になるでしょう。"
				.replace("%weapon1%", b(arr2[0].ja))
				.replace("%weapon2%", b(arr2[1].ja)));
			}
			if (arr.indexOf(b("ドスコイ")) > -1) {
				arr2 = getSortedWepons321("fats");
				push("ドスコイは%weapon1%、%weapon2%あたりが積極的に見たいところです。"
				.replace("%weapon1%", b(arr2[0].ja))
				.replace("%weapon2%", b(arr2[1].ja)));
			}
		}
		
		return mess;
		function b (str) {
			return "<b>" + str + "</b>";
		}
		function push (mes) {
			mess.push(mes + "\n");
		}
		function getSortedEvalArray (targetKeys) {
			var evalArray = [];
			targetKeys.forEach(function(key){
				evalArray.push({
					key: key,
					value: ret.hensachi[key]
				});
			});
			evalArray.sort(function(a, b){
				if (a.value < b.value) return 1;
				return -1;
			});
			return evalArray;
		}
		function getSortedWepons123 (key) {
			return getSortedWepons(key, 1);
		}
		function getSortedWepons321 (key) {
			return getSortedWepons(key, -1);
		}
		function getSortedWepons (key, type) {
			if (! type) type = 1;
			var arr = [];
			ret.weapons.forEach(function(weapon){
				arr.push(weapon);
			});
			arr.sort(function(a, b){
				if (a[key] < b[key]) return -1 * type;
				return 1 * type;
			});
			return arr;
		}
	};
	
	
	
	//## .showScore (score)
	// 偏差値は 55.1! みたいな表示をします
	this.showScore = function (score) {
		var score2, score3;
		if (score > 0) {
			score2 = Math.floor(score);
			score3 = Math.round((score - score2)*10);
			$(".eval_score_2").text(score2);
			$(".eval_score_3").text("." + score3 + "!");
		}
		else {
			$(".eval_score_2").text("??");
			$(".eval_score_3").text(".??");
		}
	};
	
	
	
	//## .fixChartData (data)
	// レーダーチャート用にデータを加工
	this.fixChartData = function (data) {
		var STD = 40;
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			d = d - 50;
			if (d > 0) d = d * 2.2;
			d = d + STD;
			data[i] = d;
		}
	};
	
	
	
	//## .drawChart (data)
	// レーダーチャートを描画します
	this.drawChart = function (data) {
		var MAX = 120;
		var MIN = 0;
		if (! data) data = [95, 75, 15, 65, 150, 30];
		this.fixChartData(data);
		var ctx = document.getElementById("canvas_chart");
		window.myChart = new Chart(ctx, {
			type: 'radar',
	    data: {
				labels: ['', '', '', '', '', ''],
				datasets: [{
					label: "",
					data: [0, 0, 0, 0, 0, 0],
					pointRadius: 0,
					borderWidth: 1,
					borderColor: "rgba(126, 73, 65, 0.80)",
					backgroundColor: "rgba(255, 255, 0, 0.80)",
				},{
					label: "",
					data: data,
					pointBackgroundColor: "#000000",
					pointRadius: 0,
					borderColor: "rgba(0, 0, 0, 0)",
					backgroundColor: "rgba(0, 255, 0, 0.72)",
				},{
					label: "",
					data: [MIN, MIN, MIN, MIN, MIN, MAX],
					pointRadius: 0,
					borderColor: "rgba(0, 0, 0, 0)",
					backgroundColor: "rgba(0, 0, 0, 0)",
				}]
			},
			options: {
				animation: {
					duration: 1200,
					easing: "easeOutElastic"
				},
				legend: {
					display: false
				},
				scale: {
					pointLabels: {
						display: false
					},
					ticks: {
						display: false,
						min: MIN
					},
					angleLines: {
						color: "rgba(255,255,255,0)",
						display: true
					},
					gridLines: {
						color: "rgba(255,255,255,0)",
						display: true
					}
				}
			}
		});
	};
	
	
	
	//## .eval (id1, id2, id3, id4)
	// ブキデータを4つ受け取って評価します
	this.eval = function (id1, id2, id3, id4) {
		var arr, keys;
		if (Array.isArray(id1)) {
			arr = id1;
		}
		else {
			arr = [id1, id2, id3, id4];
		}
		// 戻り値
		var ret = {
			weapons: [],
			avr: {},
			max: {},
			min: {},
			hensachi: {},
			score: 0,
			randomType: 0,
			radarData: []
		};
		
		// randomTypeを判定
		// 0: 通常, 1: 1枠ランダム, 2: オール緑ランダム, 3: オール金ランダム
		arr.forEach(function(id){
			if (id < -1) {
				ret.randomType = 3;
			} else if (id < 0) {
				ret.randomType = 1;
			} else {
				ret.weapons.push(WEAPONS[id]);
			}
		});
		if (ret.randomType == 1 && ret.weapons.length < 1) {
			ret.randomType = 2;
		}
		
		// オールランダムならば専用の処理をしてreturnしちゃう
		if (ret.randomType > 1) {
			var x = ret.randomType - 2;
			var score = [50, 70][x];
			var weapon = WEAPONS[["-1", "-2"][x]];
			keys = Object.keys(WEAPONS["0"]);
			keys.forEach(function(key){
				if (WEAPONS.type[key] == "number") {
					ret.avr[key] = score;
					ret.hensachi[key] = score;
				}
			});
			ret.radarData = [
				[50, 50, 50, 50, 50, 50],
				[79, 75, 62, 50, 60, 57]
			][x];
			ret.score = [-1, 70][x];
			ret.weapons = [weapon, weapon, weapon, weapon];
			return ret;
		}
		// アベレージの計算
		keys = Object.keys(ret.weapons[0]);
		keys.forEach(function(key){
			if (WEAPONS.type[key] == "number") {
				var arr = createArrayByOneKey(ret.weapons, key);
				ret.avr[key] = calcAverage(arr);
				ret.max[key] = calcMax(arr);
				ret.min[key] = calcMin(arr);
				if (EVAL_AVERAGE.isCalced) {
					ret.hensachi[key] = Math.myRound(calcHensachi(ret.avr[key], EVAL_AVERAGE[key], EVAL_STANDARD[key]));
				}
			}
		});
		
		// このeval関数はevalSalmonHistory()内でも呼ばれる
		// そのときはEVAL_AVERAGE.isCalcedはfalseだからここは実行されない
		// レーダーチャート用のデータと、スコアを計算する
		if (EVAL_AVERAGE.isCalced) {
			// レーダーチャート用のデータを用意
			ret.radarData = [
				ret.hensachi["runk"],
				ret.hensachi["firePower"],
				ret.hensachi["flexibility"],
				ret.hensachi["handling"],
				ret.hensachi["stability"],
				ret.hensachi["mobility"]
			];
			// スコアの計算
			ret.score = this.calcScore(ret);
		}
		return ret;
	};
	
	
	
	//## .chartKeys
	this.chartKeys = ["runk", "firePower", "flexibility", "handling", "stability", "mobility"];
	
	
	
	return this;
}



//# calcWeightingAverage (numberArray, weightArray)
function calcWeightingAverage (numberArray, weightArray) {
	var weightSum = 0;
	weightArray.forEach(function(weight){
		weightSum += weight;
	});	
	var sum = 0;
	numberArray.forEach(function(num, i){
		sum += num * weightArray[i];
	});	
	return sum / weightSum;
}



//# createArrayByOneKey (objectArray, key)
// オブジェクトの配列を受け取って、特定のキーの値を取り出して配列にする
function createArrayByOneKey (objectArray, key) {
	var ret = [];
	objectArray.forEach(function(obj){
		ret.push(obj[key]);
	});
	return ret;
}



//# calcAverage (numberArray)
// 配列を受け取って、平均値を返す
function calcAverage (numberArray) {
	var sum = 0;
	numberArray.forEach(function(num){
		sum += num;
	});
	return sum / numberArray.length;
}



//# calcMax (numberArray)
// 配列を受け取って、ひとつの最大値を返す
function calcMax (numberArray) {
	var max = -8192;
	numberArray.forEach(function(num){
		if (max < num) max = num;
	});
	return max;
}



//# calcMin (numberArray)
// 配列を受け取って、ひとつの最少値を返す
function calcMin (numberArray) {
	var min = 8192;
	numberArray.forEach(function(num){
		if (min > num) min = num;
	});
	return min;
}



//# calcStandard (numberArray, avr)
// 配列を受け取って、ひとつの標準偏差を返す
function calcStandard (numberArray, avr) {
	if (! avr) avr = calcAverage(numberArray);
	var difAvrs = [];
	numberArray.forEach(function(num){
		var difAvr  = num - avr;
		var difAvr2 = difAvr * difAvr;
		difAvrs.push(difAvr2);
	});
	var ret = Math.sqrt(calcAverage(difAvrs));
	return ret;
}



// 配列を受け取って、中身を偏差値化した配列を作って返す
/*
function createHensachiArray (numberArray, avr, standard) {
	if (! avr) avr = calcAverage(numberArray);
	if (! standard) avr = calcStandard(numberArray, avr);
	var ret = [];
	numberArray.forEach(function(num){
		ret.push(calcHensachi(num, avr, standard));
	});
}
*/



//# calcHensachi (num, avr, standard)
// 数値と平均値と標準偏差を受け取って、ひとつの偏差値を返す
function calcHensachi (num, avr, standard) {
	var a = 50;
	var b = (num - avr) * 10 / standard;
	return a + b;
}



//# Math.myRound
// 小数点第一位までに丸めます 12.345... -> 12.3
Math.myRound = function (num) {
	num = num * 10;
	num = Math.round(num);
	return num / 10;
};



window.weaponRater = new WeaponRater();



//# WeaponRater ()
// 寸評のブキ個別データを表示する機能関連
function WeaponRater () {
	
	
	
	var TARGET_WRAPPER = ".layer_free";
	var WEAPONS_TRANSPARENT_BOTTOM = {"0":63,"10":47,"20":65,"30":34,"40":51,"50":56,"60":67,"70":79,"80":56,"90":71,"200":47,"210":69,"220":67,"230":35,"240":62,"250":52,"300":60,"310":62,"400":63,"1000":28,"1010":24,"1020":9,"1030":13,"1100":5,"1110":5,"2000":80,"2010":85,"2020":85,"2030":87,"2040":87,"2050":76,"2060":43,"3000":27,"3010":45,"3020":24,"3030":50,"3040":31,"4000":62,"4010":66,"4020":46,"4030":71,"4040":71,"5000":32,"5010":6,"5020":15,"5030":11,"5040":8,"6000":31,"6010":11,"6020":38,"7000":49,"7010":17,"7020":71,"7030":9,"-2":17,"-1":17};
	    WEAPONS_TRANSPARENT_BOTTOM = {"0":44,"10":33,"20":46,"30":24,"40":36,"50":39,"60":47,"70":56,"80":39,"90":50,"200":33,"210":49,"220":47,"230":25,"240":44,"250":37,"300":42,"310":44,"400":44,"1000":20,"1010":17,"1020":6,"1030":9,"1100":4,"1110":4,"2000":56,"2010":60,"2020":60,"2030":61,"2040":61,"2050":53,"2060":30,"3000":19,"3010":32,"3020":17,"3030":35,"3040":22,"4000":44,"4010":46,"4020":32,"4030":50,"4040":50,"5000":23,"5010":4,"5020":11,"5030":8,"5040":6,"6000":22,"6010":8,"6020":27,"7000":34,"7010":12,"7020":50,"7030":6,"-2":12,"-1":12};
	var chartKeys                  = ["runk", "firePower", "flexibility", "handling", "stability", "mobility"];
	this.WEAPONS_IMAGE_URL          = "./data/weapons_big/";
	
	
	
	//## .make (weaponIds)
	this.make = function (weaponIds) {
		// 引数がなかったら適当なダミーデータを入れる
		if (! weaponIds) weaponIds = [0, 10, 20, 30];
		// 最初は配列の先頭のブキを表示する
		var id = weaponIds[0];
		var that = this;
		// DOMを作ってラッパーに放り込む
		var $wrapper = $(TARGET_WRAPPER);
		var $html = $(''
		+ '<div class="weapon_menu"></div>'
		+ '<div class="canvas_chart_weapon_wrapper"><canvas class="canvas_chart_weapon" id="canvas_chart" width="320" height="320"></canvas></div>'
		+ '<div class="weapon_comment_wrapper"><h1 class="weapon_name"></h1><div class="weapon_comment_main"></div></div>');
		$wrapper.append($html);
		// 上部のブキメニューを作ってこれも放り込む
		var $menu = $(".weapon_menu");
		var $menuInner = $("<div></div>");
		weaponIds.forEach(function(id, i){
			if (id > -1) {
			  if (i >= 5 && i % 5 === 0) {
				  //$menuInner.append($("<br>"));
			  }
				var src = that.WEAPONS_IMAGE_URL + id + ".png";
				var $image = $('<img src="' + src + '">');
				$image.attr('index', i);
				$image.click(function(){
					that.changeWeapon(id);
      		if (weaponIds.length > 4) {
            var index = $(this).attr('index');
            var row = Math.floor(index / 5);
            var margin = row > 0 ? -100.5 * row - 4 : 0;
            $menuInner.css('margin-top', margin + 'px');
      		  $menu.css({
      		    'width': '510px',
      		    'height': '84px',
              'line-height': '80px',
      		  });
      		}
				});
				$menuInner.append($image);
			}
		});
		$menu.append($menuInner);
		if (weaponIds.length > 4) {
		  var $opener = $('<div class="weapon_menu_opener">OPEN</div>');
		  $opener.click(function(){
        $menuInner.css('margin-top', '0px');
  		  $menu.css({
          'width': '610px',
  		    'height': '810px',
          'line-height': '58px',
          'z-index': '9999'
  		  });
		  });
		  $wrapper.append($opener);
		  $menu.css({
		    'overflow': 'hidden',
        'line-height': '80px',
		    'width': '510px',
		    'height': '84px',
        'left': '15px',
		  });
		}
		var weapon = WEAPONS[id];
		var hensachi = WEAPONS_HENSACHI[id];
		// ブキの名前
		var $name = $(".weapon_name");
		$name.text(weapon.ja);
		// ブキの説明文
		var $comment = $(".weapon_comment_main");
		var comment = this.createWeaponComment(id);
		$comment.append(comment);
		// ブキの画像
		var $weapon = this.createWeaponDiv(id);
		$wrapper.append($weapon);
		// レーダーチャートを描画
		var chartArray = [];
		chartKeys.forEach(function(key){
			chartArray.push(hensachi[key]);
		});
		this.drawChart(chartArray);
	};
	
	
	
	//## .createWeaponComment (id)
	// ブキの説明文を生成
	this.createWeaponComment = function (id) {
		// wikiデータを取得
		var wikidata = WEAPONS_WIKIDATA[id];
		var comment = "";
		Object.keys(wikidata).forEach(function(key){
			switch (key) {
			case "id": break;
			case "ja": break;
			default:
				// idとja以外を全部放り込む
				if (wikidata[key] != "x") {
					comment += '<span class="weapon_comment_a"><span class="weapon_comment_b">【%key%】</span><span class="weapon_comment_c">%data%</span>　</span>'
					.replace("%key%", key)
					.replace("%data%", wikidata[key]);
				}
				break;
			}
		});
		return comment;
	};
	
	
	
	//## .createWeaponDiv (id)
	// ブキの画像DOMを生成
	this.createWeaponDiv = function (id) {
		var bottom = WEAPONS_TRANSPARENT_BOTTOM[id];
		var src = this.WEAPONS_IMAGE_URL + id + ".png";
		var $weapon = $("<div></div>").addClass("weapon_image").css({
			"background-image": "url(" + src + ")",
			"background-position-y": bottom + "px"
		});
		var $shadow = $("<img>").addClass("weapon_image_shadow").attr("src", this.WEAPONS_IMAGE_URL + "shadow.png");
		$weapon.append($shadow);
		return $weapon;
	};
	
	
	
	//## .chart
	// レーダーチャートオブジェクトを格納します
	this.chart = null;
	
	
	
	//## .changeWeapon (id)
	// 個別パラメータを表示しているブキを変更します
	this.changeWeapon = function (id) {
		// 画像の変更
		this.changeWeaponImage(id);
		// グラフの変更
		this.changeWeaponChart(id);
		// コメントの変更
		var $name = $(".weapon_name");
		$name.text(WEAPONS[id].ja);
		var $comment = $(".weapon_comment_main");
		var comment = this.createWeaponComment(id);
		$comment.empty();
		$comment.append(comment);
	};
	
	
	
	//## .changeWeaponImage (id)
	// ブキの画像を変更します
	this.changeWeaponImage = function (id) {
		var $weapon = $(".weapon_image");
		var bottom = WEAPONS_TRANSPARENT_BOTTOM[id];
		var src = this.WEAPONS_IMAGE_URL + id + ".png";
		$weapon.css({
			"background-image": "url(" + src + ")",
			"background-position-y": bottom + "px"
		});
	};
	
	
	
	//## .changeWeaponChart (id)
	// レーダーチャートを変更します
	this.changeWeaponChart = function (id) {
		var newData = [];
		chartKeys.forEach(function(key){
			newData.push(WEAPONS_HENSACHI[id][key]);
		});
		this.fixChartData(newData);	
		this.chart.data.datasets[0].data = newData;
		this.chart.update();
	};
	
	
	
	//## .fixChartData (data)
	// レーダーチャートの見た目をちょっと加工するためにデータに手を加えます
	this.fixChartData = function (data) {
		var STD = 40;
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			d = d - 50;
			if (d > 0) d = d * 1.5;
			d = d + STD;
			data[i] = d;
		}
	};
	
	
	
	//## .drawChart (data)
	// チャートを描画します
	this.drawChart = function (data) {
		var MAX = 100;
		var MIN = 0;
		if (! data) data = [95, 75, 15, 65, 150, 30];
		this.fixChartData(data);
		var ctx = document.getElementById("canvas_chart");
		this.chart = new Chart(ctx, {
			type: 'radar',
	    	data: {
				labels: ['', '', '', '', '', ''],
				datasets: [
					{
						label: "",
						data: data,
						pointBackgroundColor: "#000000",
						pointRadius: 0,
						borderColor: "rgba(0, 0, 0, 0)",
						backgroundColor: "rgba(0, 255, 0, 0.72)",
					},
					{
						label: "",
						data: [MIN, MIN, MIN, MIN, MIN, MAX],
						pointRadius: 0,
						borderColor: "rgba(0, 0, 0, 0)",
						backgroundColor: "rgba(0, 0, 0, 0)",
					}
				]
			},
			options: {
				animation: {
					duration: 1200,
					easing: "easeOutElastic"
				},
				legend: {
					display: false
				},
				scale: {
					pointLabels: {
						display: false
					},
					ticks: {
						display: false,
						min: MIN
					},
					angleLines: {
						color: "rgba(255,255,255,0)",
						display: true
					},
					gridLines: {
						color: "rgba(255,255,255,0)",
						display: true
					}
				}
			}
		});
	};
	
	
	
	return this;
}