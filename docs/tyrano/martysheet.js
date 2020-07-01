google.load("visualization", "1");
window.martySheet = new MartySheet(); 

function MartySheet () {
	var self = this;
	this.json = "";
	this.make = function () {
		if (google && google.visualization) {
			this.getJson(function(){
				self.setEvents();
				$(".marty_sheet .page_1_button").trigger("click");
				$(".marty_sheet .stage_1_button").trigger("click");
			});
		}
	};
	this.setEvents = function () {
		$(".marty_sheet .page_buttons .button").on("click", function(){
			$(".marty_sheet .page_buttons .button").removeClass("selected");
			$(this).addClass("selected");
			var val = $(this).attr("val");
			$(".marty_sheet .page_1").hide(0);
			$(".marty_sheet .page_2").hide(0);
			$(".marty_sheet ." + val).show(0);
		});
		$(".marty_sheet .stage_buttons .button").on("click", function(){
			$(".marty_sheet .stage_buttons .button").removeClass("selected");
			$(this).addClass("selected");
			var stage = $(this).attr("val");
			var stage_jp = self.langJP.stage[stage];
			$(".marty_sheet .stage_name").text(stage_jp);
			self.langKeys.record.forEach(function(record){
				var tides = self.tidesOfEvents[record] || [""];
				tides.forEach(function(tide){
					var score = self.getScore(stage, record, tide);
					if (score < 0) score = "-";
					var selector = "." + record;
					if (tide !== "") selector += "_" + tide;
					$(selector).text(score);
				});
			});
		});
	}
	this.getJson = function (callback) {
	  	var url = "http://spreadsheets.google.com/tq";
	  	var key = "14x39JwJzgGJxFuN7UTQtIqbHJCQfHrYWCHgYzeLiook";
	  	var sheet = "English%20Records%20%28Normal%20Rotations%29";
	  	var range = "B5:H43";
	  	var gid = "1945984176";
	  	url += "?key=" + key;
	  	//url += "&gid=" + gid;
	  	url += "&sheet=" + sheet;
	  	url += "&range=" + range;
		query = new google.visualization.Query(url);
		// query.setQuery("select *");
		query.send(function(response){
			var data = response.getDataTable();
			var lines = [];
			var keys = [];
			for (var row = 0; row < data.getNumberOfRows(); row++) {
				var obj = {};
				if(row === 0) {
					for (var col = 0; col < data.getNumberOfColumns(); col++) {
						keys.push(data.getFormattedValue(row, col));
					}
				} else {
					for (var col = 0; col < data.getNumberOfColumns(); col++) {
						var key = keys[col];
						obj[key] = data.getFormattedValue(row, col);
					}
					lines.push(obj);
				}
			}
			self.json = lines;
			callback();
		});
	};
	this.tidesOfEvents = {
		"hiru"       : ["tsujo", "mancho", "kancho"],
		"hikaribae"  : ["tsujo", "mancho"          ],
		"kiri"       : ["tsujo", "mancho", "kancho"],
		"kanketsusen": ["tsujo", "mancho"          ],
		"guriru"     : ["tsujo", "mancho"          ],
		"hakobiya"   : ["tsujo", "mancho", "kancho"],
		"dosukoi"    : [                   "kancho"]
	};
	this.langKeys = {
		tide: [
			"tsujo",
			"mancho",
			"kancho"
		],
		record: [
			"yoruari",
			"hirunomi",
			"one_wave",
			"hime",
			
			"nora",
			"nora_hime",
			"norani",
			"norani_hime",
			
			"hiru",
			"hikaribae",
			"kiri",
			"kanketsusen",
			"guriru",
			"hakobiya",
			"dosukoi",
			
			"aka",
			"aka_hime",
			"aka_nora",
			"aka_norani",
			"aka_nora_hime",
			
			"kyujo_nora",
			"kyujo",
			"ukiwa"
		],
		stage: [
		    "damu",
		    "fune",
		    "toba",
		    "toki",
		    "pora"
		]
	};
	this.langJP = {
		tide: {
			"": "",
			"tsujo" : "通常",
			"mancho": "満潮",
			"kancho": "干潮"
		},
		record: {
			"yoruari"    : "Highest Golden Eggs in one shift",
			"hirunomi"   : "Highest Golden Eggs in one shift (All Normal Waves)",
			"one_wave"   : "Highest Golden Eggs in one wave",
			"hime"       : "Highest Golden Eggs obtained by a single player in one shift",
			
			"nora"       : "野良金イクラ",
			"nora_hime"  : "野良金イクラ(姫)",
			"norani"     : "野良2金イクラ",
			"norani_hime": "野良2金イクラ(姫)",
			
			"hiru"       : "昼",
			"hikaribae"  : "ラッシュ",
			"kiri"       : "霧",
			"kanketsusen": "間欠泉",
			"guriru"     : "グリル",
			"hakobiya"   : "ハコビヤ",
			"dosukoi"    : "ドスコイ",
			
			"aka"          : "赤イクラ",
			"aka_hime"     : "赤イクラ(姫)",
			"aka_nora"     : "野良赤イクラ",
			"aka_norani"   : "野良2赤イクラ",
			"aka_nora_hime": "野良赤イクラ(姫)",
			
			"kyujo_nora": "野良救助数",
			"kyujo"     : "救助数",
			"ukiwa"     : "死亡数"
		},
		stage: {
		    "damu": "シェケナダム",
		    "fune": "難破船ドン･ブラコ",
		    "toba": "海上集落シャケト場",
		    "toki": "トキシラズいぶし工房",
		    "pora": "朽ちた箱舟 ポラリス"
		}
	};
	this.langInSheet = {
		tide: {
			"": "",
			"tsujo" : "Normal Tide",
			"mancho": "High Tide",
			"kancho": "Low Tide"
		},
		record: {
			"yoruari"    : "Highest Golden Eggs in one shift",
			"hirunomi"   : "Highest Golden Eggs in one shift (All Normal Waves)",
			"one_wave"   : "Highest Golden Eggs in one wave",
			"hime"       : "Highest Golden Eggs obtained by a single player in one shift",
			
			"nora"       : "Highest Golden Eggs in one Freelance shift",
			"nora_hime"  : "Highest Golden Eggs obtained by a single player in one Freelance shift",
			"norani"     : "Highest Golden Eggs in one Twinlance shift",
			"norani_hime": "Highest Golden Eggs obtained by a single player in one Twinlance shift",
			
			"hiru"       : "Highest Golden Eggs on a single non-special wave",
			"hikaribae"  : "Highest Golden Eggs in Rush",
			"kiri"       : "Highest Golden Eggs in Fog",
			"kanketsusen": "Highest Golden Eggs in Goldie Seeking",
			"guriru"     : "Highest Golden Eggs in a Griller Wave",
			"hakobiya"   : "Highest Golden Eggs in Mothership",
			"dosukoi"    : "Highest Golden Eggs in Cohock Charge",
			
			"aka"          : "Most Power Eggs obtained in one shift",
			"aka_hime"     : "Most Power Eggs obtained by a single player in one shift",
			"aka_nora"     : "Most Power Eggs obtained in one Freelance shift",
			"aka_norani"   : "Most Power Eggs obtained in one Twinlance shift",
			"aka_nora_hime": "Most Power Eggs obtained by a single player in one Freelance shift",
			
			"kyujo_nora": "Most Revives in a Freelance shift",
			"kyujo"     : "Most Revives in a shift (With Friends)",
			"ukiwa"     : "Most Deaths in a shift"
		},
		stage: {
		    "damu": "Spawning Grounds",
		    "fune": "Marooner's Bay",
		    "toba": "Lost Outpost",
		    "toki": "Salmonid Smokeyard",
		    "pora": "Ruins of Ark Polaris"
		}
	};
	this.trim = function (str) {
		return str.replace(/\n/g, "");
	};
	this.getScore = function (_stage, _record, _tide) {
		if (! this.json) return;
		var targetStage = this.langInSheet.stage[_stage];
		var targetRecord = this.langInSheet.record[_record];
		var targetTide = this.langInSheet.tide[_tide];
		var stageJP = this.langJP.stage[_stage];
		var recordJP = this.langJP.record[_record];
		var tideJP = this.langJP.tide[_tide];
		var score = -1;
		var beforeRecord = "";
		for (var i = 0; i < this.json.length; i++) {
			var line = this.json[i];
			var theRecord = this.trim( line[""] || "" );
			if (theRecord === targetRecord || beforeRecord === targetRecord) {
				if (targetTide === "" || line["Tides"] === targetTide) {
					var str = this.trim( line[targetStage] || "" );
					score = parseInt( str.split(" ")[0] ) || -1;
					break;
				}
			}
			if (line[""] !== "") {
				beforeRecord = line[""];
			}
		}
		return score;
	};
}