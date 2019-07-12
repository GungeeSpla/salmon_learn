function init() {
	salmonrunAPI.get(function(){
		weaponRater.make();
	});
}

window.weaponRater = new WeaponRater();
function WeaponRater () {
	var TARGET_WRAPPER = "#main";
	var WEAPONS_TRANSPARENT_BOTTOM = {"0":63,"10":47,"20":65,"30":34,"40":51,"50":56,"60":67,"70":79,"80":56,"90":71,"200":47,"210":69,"220":67,"230":35,"240":62,"250":52,"300":60,"310":62,"400":63,"1000":28,"1010":24,"1020":9,"1030":13,"1100":5,"1110":5,"2000":80,"2010":85,"2020":85,"2030":87,"2040":87,"2050":76,"2060":43,"3000":27,"3010":45,"3020":24,"3030":50,"3040":31,"4000":62,"4010":66,"4020":46,"4030":71,"4040":71,"5000":32,"5010":6,"5020":15,"5030":11,"5040":8,"6000":31,"6010":11,"6020":38,"7000":49,"7010":17,"7020":71,"7030":9,"-2":17,"-1":17};
	    WEAPONS_TRANSPARENT_BOTTOM = {"0":44,"10":33,"20":46,"30":24,"40":36,"50":39,"60":47,"70":56,"80":39,"90":50,"200":33,"210":49,"220":47,"230":25,"240":44,"250":37,"300":42,"310":44,"400":44,"1000":20,"1010":17,"1020":6,"1030":9,"1100":4,"1110":4,"2000":56,"2010":60,"2020":60,"2030":61,"2040":61,"2050":53,"2060":30,"3000":19,"3010":32,"3020":17,"3030":35,"3040":22,"4000":44,"4010":46,"4020":32,"4030":50,"4040":50,"5000":23,"5010":4,"5020":11,"5030":8,"5040":6,"6000":22,"6010":8,"6020":27,"7000":34,"7010":12,"7020":50,"7030":6,"-2":12,"-1":12};
	var chartKeys                  = ["runk", "firePower", "flexibility", "handling", "stability", "mobility"];
	this.WEAPONS_IMAGE_URL          = "../weapons_big/";
	this.make = function (weaponIds) {
		
		if (! weaponIds) weaponIds = [0, 10, 20, 30];
		
		var id = weaponIds[0];
		var that = this;
		var $wrapper = $(TARGET_WRAPPER);
		var $html = $(''
		+ '<div class="weapon_menu"></div>'
		+ '<div class="canvas_chart_weapon_wrapper"><canvas class="canvas_chart_weapon" id="canvas_chart" width="320" height="320"></canvas></div>'
		+ '<div class="weapon_comment_wrapper"><h1 class="weapon_name"></h1><div class="weapon_comment_main"></div></div>');
		$wrapper.append($html);
		
		var $menu = $(".weapon_menu");
		weaponIds.forEach(function(id){
			if (id > -1) {
				var src = that.WEAPONS_IMAGE_URL + id + ".png";
				var $image = $('<img src="' + src + '">');
				$image.click(function(){
					that.changeWeapon(id);
				});
				$menu.append($image);
			}
		});
		
		var weapon = WEAPONS[id];
		var hensachi = WEAPONS_HENSACHI[id];
		
		var $name = $(".weapon_name");
		$name.text(weapon.ja);
		
		var $comment = $(".weapon_comment_main");
		var comment = this.createWeaponComment(id);
		$comment.append(comment);
		
		var $weapon = this.createWeaponDiv(id);
		$wrapper.append($weapon);
		
		this.drawChart([
			hensachi.runk,
			hensachi.firePower,
			hensachi.flexibility,
			hensachi.handling,
			hensachi.stability,
			hensachi.mobility
		]);
	};
	this.createWeaponComment = function (id) {
		var wikidata = WEAPONS_WIKIDATA[id];
		var comment = "";
		Object.keys(wikidata).forEach(function(key){
			switch (key) {
			case "id": break;
			case "ja": break;
			default:
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
	this.chart = null;
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
	this.changeWeaponImage = function (id) {
		var $weapon = $(".weapon_image");
		var bottom = WEAPONS_TRANSPARENT_BOTTOM[id];
		var src = this.WEAPONS_IMAGE_URL + id + ".png";
		$weapon.css({
			"background-image": "url(" + src + ")",
			"background-position-y": bottom + "px"
		});
	};
	this.changeWeaponChart = function (id) {
		var newData = [];
		chartKeys.forEach(function(key){
			newData.push(WEAPONS_HENSACHI[id][key]);
		});
		this.fixChartData(newData);	
		this.chart.data.datasets[0].data = newData;
		this.chart.update();
	};
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
}






/*
function init() {
	salmonrunAPI.get(function(){
		var keys = WEAPON_IDS;
		keys.forEach(function(key, i){
			setTimeout(function(){
				var src = "../weapons_big/" + key + ".png";
				checkImage(src, key);
			}, i * 100);
		});
	
	
		var keys = WEAPON_IDS;
		keys.forEach(function(id){
			createWeaponDiv(id).appendTo("body");
		});
	});
}
window.checkImage = function(src, key){
    var img = new Image();
    img.src = src;
    img.onload = function(){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
	    var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	    var newData = ctx.createImageData(canvas.width, canvas.height);
	    var transparent_bottom = binary(data, newData);
	    result[key] = transparent_bottom;
	    ctx.putImageData(newData, 0, 0);
    }
}
window.binary = function(data, newData){
    rawData = newData.data;
    var count = 0;
    var isTransparent = true;
    // iはy座標 下から見ていく
    for(var i = data.height - 1; i >= 0; i--){
        // jはx座標 左から見ていく
        for(var j = 0; j < data.width; j++){
            var idx = (j + i * data.width) * 4;
            // 透明部分
            if (data.data[idx + 3] == 0) {
                rawData[idx + 0] =   0; // R
                rawData[idx + 1] =   0; // G
                rawData[idx + 2] =   0; // B
                rawData[idx + 3] = 255; // A
            }
            // 透明ではない部分
            else {
            	isTransparent = false;
                rawData[idx + 0] = 255;
                rawData[idx + 1] =   0;
                rawData[idx + 2] =   0;
                rawData[idx + 3] = 255;
            }
        }
        if (isTransparent) count++;
    }
    return count;
}
*/