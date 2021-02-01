window.UNIX      = new Unix();      //
window.tyranoAPI = new TyranoAPI(); //
window.queries   = getUrlQueries();

//# Unix ()
function Unix () {
	//## .getTime ()
	this.getTime = function () {
		return Math.floor(new Date().getTime()/1000);
	};
	//## .getParsedTime ()
	this.getParsedTime = function () {
		return this.parse(this.getTime());
	};
	//## .parse (intTime, type)
	this.parse = function (intTime, type) {
		intTime = parseInt(intTime);
		var d, year, month, day, hour, min, sec, yobi;
		if (! type) type = 0;
		switch (type) {
		case 0:
			d = new Date(intTime * 1000);
			year = d.getFullYear();
			month = d.getMonth() + 1;
			day = d.getDate();
			hour = d.getHours();
			min = ('0' + d.getMinutes()).slice(-2);
			sec = ('0' + d.getSeconds()).slice(-2);
			yobi = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
			yobi = "<span class='rotation_yobi'>（" + yobi + "）</span>";
			return(month + '/' + day + yobi + hour + ':' + min);
		case 1:
			d = new Date(intTime * 1000);
			day	 = d.getDate();
			hour	= d.getHours() + (day - 1) * 24;
			return hour + "時間";
		case 2:
			d = new Date(intTime * 1000);
			day	 = d.getDate();
			hour	= d.getHours() + (day - 1) * 24;
			min	 = d.getMinutes();
			return hour + "時間" + min + "分";
		}
	};
}
//# TyranoAPI ()
function TyranoAPI () {
	//## .jump (storage, target, time)
	this.jump = function (storage, target, time) {
		setTimeout(function () {
			TYRANO.kag.ftag.startTag("jump", {
				storage: storage,
				target: target
			});
		}, time || 0);
	};
	return this;
}
//# parseVersion (version)
function parseVersion (version) {
	var v = ("000000" + version).slice(-6);
	var a = parseInt(v[0] + v[1]);
	var b = parseInt(v[2] + v[3]);
	var c = parseInt(v[4] + v[5]);
	return "Ver." + a + "." + b + "." +	c;
}
//# fixFitBaseSize ()
function fixFitBaseSize () {
	this.timer1 = -1;
	this.timer2 = -1;
	var that = this;
	var origin = TYRANO.base.fitBaseSize;
	TYRANO.base.fitBaseSize = function () {
		origin.apply(TYRANO.kag, [TYRANO.kag.config.scWidth, TYRANO.kag.config.scHeight]);
		clearTimeout(that.timer1);
		clearTimeout(that.timer2);
		that.timer1 = setTimeout(function(){
			origin.apply(TYRANO.kag, [TYRANO.kag.config.scWidth, TYRANO.kag.config.scHeight]);
		}, 500);
		that.timer2 = setTimeout(function(){
			origin.apply(TYRANO.kag, [TYRANO.kag.config.scWidth, TYRANO.kag.config.scHeight]);
		}, 1000);
	};
	
	TYRANO.kag.ftag.master_tag.button.start = function (pm) {
		var that = this;
		var target_layer = null;
		if (pm.role != "") pm.fix = "true";
		if (pm.fix == "false") {
			target_layer = this.kag.layer.getFreeLayer();
			target_layer.css("z-index", 999999)
		} else target_layer = this.kag.layer.getLayer("fix");
		var storage_url = "";
		if ($.isHTTP(pm.graphic)) storage_url = pm.graphic;
		else storage_url = "./data/" + pm.folder + "/" + pm.graphic;
		if (pm.text) {
			var j_button = $("<div></div>");
			j_button.css({
				"background-image": "url(" + storage_url + ")",
				"background-size": pm.width + "px " + pm.height + "px",
				"background-repeat": "no-repeat"
			});
			j_button.html(pm.text);
		} else {
			j_button = $("<img />");
			j_button.attr("src", storage_url);
		}
		j_button.css("position", "absolute");
		j_button.css("cursor", "pointer");
		j_button.css("z-index", 99999999);
		if (pm.visible == "true") j_button.show();
		else j_button.hide();
		if (pm.x == "") j_button.css("left", this.kag.stat.locate.x + "px");
		else j_button.css("left", pm.x + "px");
		if (pm.y == "") j_button.css("top", this.kag.stat.locate.y + "px");
		else j_button.css("top", pm.y + "px");
		if (pm.fix != "false") j_button.addClass("fixlayer");
		if (pm.width != "") j_button.css("width", pm.width + "px");
		if (pm.height != "") j_button.css("height", pm.height + "px");
		if (pm.hint != "") j_button.attr({
			"title": pm.hint,
			"alt": pm.hint
		});
		$.setName(j_button, pm.name);
		that.kag.event.addEventElement({
			"tag": "button",
			"j_target": j_button,
			"pm": pm
		});
		that.setEvent(j_button, pm);
		target_layer.append(j_button);
		if (pm.fix == "false") target_layer.show();
		this.kag.ftag.nextOrder()
	};
}
//# getUrlQueries ()
function getUrlQueries() {
	var queryStr = window.location.search.slice(1);
			queries = {};
	if (!queryStr) {
		return queries;
	}
	queryStr.split('&').forEach(function(queryStr) {
		var queryArr = queryStr.split('=');
		if (queryArr[1]) {
			queries[queryArr[0]] = queryArr[1];
		}
		else {
			queries[queryArr[0]] = '';
		}
	});
	return queries;
}
//# addFixButton ()
function addFixButton () {
	var $wrapper = $("<div></div>");
	$wrapper.addClass("fixlayer");
	$wrapper.css({
		"position": "absolute",
		"width": "100%",
		"height": "120px",
		"top": "840px",
		"left": "0px",
		"z-index": "99999999"
	});
	for (var i = 0; i < 4; i++) {
		var x = 160 * i;
		var y = 0;
		var name = "panel_" + (i + 1);
		var $img = $("<img>");
		$img.addClass("panel " + name);
		$img.attr("id", name);
		$img.attr("src", "./data/image/" + name + ".png");
		$img.css({
			"width": "160px",
			"left": x + "px",
			"top": y + "px"
		});
		(function($obj, num){
			$obj.click(function(){
				var stack_pm = TYRANO.kag.getStack("call");
				if (stack_pm != null) {
					return false;
				} else {
					TYRANO.kag.ftag.startTag("call", {
						storage: "learn.ks",
						target: "Panel_" + num,
						auto_next: "stop"
					});
				}
			});
		}($img, i + 1));
		$wrapper.append($img);
	}
	$("#tyrano_base").append($wrapper);
}
//# changeCurrentFixButton (num)
function changeCurrentFixButton (num) {
	var id = "#panel_" + num;
	$(".panel").removeClass("panel_now").filter(id).addClass("panel_now");
}