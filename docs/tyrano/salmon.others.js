window.UNIX = new Unix();
window.tyranoAPI = new TyranoAPI();
function Unix () {
	this.getTime = function () {
		return Math.floor(new Date().getTime()/1000);
	};
	this.getParsedTime = function () {
		return this.parse(this.getTime());
	};
	this.parse = function (intTime, type) {
		intTime = parseInt(intTime);
    var d, year, month, day, hour, min, sec, yobi;
		if (! type) type = 0;
		switch (type) {
		case 0:
			d = new Date(intTime * 1000);
			year  = d.getFullYear();
			month = d.getMonth() + 1;
			day   = d.getDate();
			hour  = d.getHours();
			min   = ('0' + d.getMinutes()).slice(-2);
			sec   = ('0' + d.getSeconds()).slice(-2);
			yobi  = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
			yobi = "<span class='rotation_yobi'>（" + yobi + "）</span>";
			return(month + '/' + day + yobi + hour + ':' + min);
		case 1:
			d = new Date(intTime * 1000);
			day   = d.getDate();
			hour  = d.getHours() + (day - 1) * 24;
			return hour + "時間";
		case 2:
			d = new Date(intTime * 1000);
			day   = d.getDate();
			hour  = d.getHours() + (day - 1) * 24;
			min   = d.getMinutes();
			return hour + "時間" + min + "分";
		}
	};
}
function TyranoAPI () {
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
function parseVersion (version) {
	var v = ("000000" + version).slice(-6);
	var a = parseInt(v[0] + v[1]);
	var b = parseInt(v[2] + v[3]);
	var c = parseInt(v[4] + v[5]);
	return "Ver." + a + "." + b + "." +  c;
}