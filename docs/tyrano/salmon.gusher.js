
window.gusherApp = new GusherApp();

function GusherApp () {
	var app = this;
	this.updateKomoriArrowTimerId = -1;
	
	//# Canvas.context.arrow を追加
	(function(target) {
		if (!target || !target.prototype)
			return;
		target.prototype.arrow = function(startX, startY, endX, endY, controlPoints) {
			var dx = endX - startX;
			var dy = endY - startY;
			var len = Math.sqrt(dx * dx + dy * dy);
			var sin = dy / len;
			var cos = dx / len;
			var i, x, y, a = [];
			a.push(0, 0);
			for (i = 0; i < controlPoints.length; i += 2) {
				x = controlPoints[i];
				y = controlPoints[i + 1];
				a.push(x < 0 ? len + x : x, y);
			}
			a.push(len, 0);
			for (i = controlPoints.length; i > 0; i -= 2) {
				x = controlPoints[i - 2];
				y = controlPoints[i - 1];
				a.push(x < 0 ? len + x : x, -y);
			}
			a.push(0, 0);
			for (i = 0; i < a.length; i += 2) {
				x = a[i] * cos - a[i + 1] * sin + startX;
				y = a[i] * sin + a[i + 1] * cos + startY;
				if (i === 0) this.moveTo(x, y);
				else this.lineTo(x, y);
			}
		};
	})(CanvasRenderingContext2D);
	
	
	//## addCanvas ()
	var isAddedCanvas = false;
	this.addCanvas = function () {
		if (isAddedCanvas) return;
		else isAddedCanvas = true;
		
		var $canvas = $("<canvas width='640' height='960' style='position: absolute; z-index: 10;' class='canvas'></canvas>");
		var $root = $("#root_layer_game");
		$root.append($canvas);
		this.$canvas = $canvas;
		this.canvas = $canvas[0];
		this.ctx = this.canvas.getContext("2d");

		this.ctx.clear = function () {
			app.ctx.clearRect(0, 0, 640, 960);
		};

		//# fillArrow (x1, y1, x2, y2)
		this.ctx.fillArrow = function (x1, y1, x2, y2) {
			if (typeof x1 !== "number") {
					y2 = y1.y;
					x2 = y1.x;
					y1 = x1.y;
					x1 = x1.x;
			}
			app.ctx.beginPath();
			app.ctx.arrow(x1, y1, x2, y2, [0, 3, -20, 3, -20, 11]);
			app.ctx.fill();
		};

		//# fillArrowKomori (a, b)
		this.ctx.fillArrowKomori = function (a, b) {
			var aData = app.getKanketsusen(a);
			var bData = app.getKanketsusen(b);
			app.ctx.fillArrow(aData, bData);
		};
	};
	
	//## updateKomoriArrow ()
	this.updateKomoriArrow = function () {
		var f = window.TYRANO.kag.stat.f;
	    var dis = this.getDisIkaKomori(f.komoriLabel, "auto");
	    var next = this.getKomoriNextLabel(f.komoriLabel);
	    this.ctx.clearRect(0, 0, 640, 960);
	    this.ctx.fillStyle = (dis < f.radius) ? "Black" : "Blue";
	    this.ctx.fillArrowKomori(f.komoriLabel, next);
	};

	//## calcDistance (x1, y1, x2, y2)
	this.calcDistance = function (x1, y1, x2, y2) {
		if (typeof x1 !== "number") {
			y2 = y1.y;
			x2 = y1.x;
			y1 = x1.y;
			x1 = x1.x;
		}
		var w = x2 - x1;
		var h = y2 - y1;
		var r = Math.sqrt(w*w + h*h);
		return r;
	};

	//## getIkaPos (num)
	this.getIkaPos = function (num) {
		if (!num) num = "";
		else num = "" + num;
		var $ika = $(".ika" + num);
		var x = parseInt($ika.css("left")) + window.TYRANO.kag.stat.f.ikaDx;
		var y = parseInt($ika.css("top")) + window.TYRANO.kag.stat.f.ikaDy;
		return {
			x: x,
			y: y
		};
	};

	//## getKomoriPos (label)
	this.getKomoriPos = function (label) {
		var data = this.getKanketsusen(label);
		return {
			x: data.x,
			y: data.y
		};
	};

	//## getIkaPos (label, opt)
	this.getDisIkaKomori = function (label, opt) {
		var iPos;
		if (opt === "auto") {
			if ($(".ika2").css("display") == "block" && this.getDisIkaKomori(label) > this.getDisIkaKomori(label, 2)) {
				iPos = this.getIkaPos(2);
			}
			else {
				iPos = this.getIkaPos();
			}
		}
		else {
			iPos = this.getIkaPos(opt);
		}
		var kPos = this.getKomoriPos(label);
		return this.calcDistance(iPos, kPos);
	};

	//## getKomoriNextLabel (label)
	this.getKomoriNextLabel = function (label) {
		var iPos;
		if ($(".ika2").css("display") == "block" && this.getDisIkaKomori(label) > this.getDisIkaKomori(label, 2)) {
			iPos = this.getIkaPos(2);
		}
		else {
			iPos = this.getIkaPos();
		}
		var data = this.getKanketsusen(label);
		var minDis = 9999;
		var nextLabel;
		for (var i = 0; i < data.brothers.length; i++) {
			var k = data.brothers[i];
			var kPos = this.getKomoriPos(k);
			var dis = this.calcDistance(iPos, kPos);
			if (dis < minDis) {
				minDis = dis;
				nextLabel = k;
			}
		}
		return nextLabel;
	};

	//## Kanketsusen (label, x, y, brothers)
	this.Kanketsusen = function (label, x, y, brothers) {
		this.label = label;
		this.x = x;
		this.y = y;
		this.brothers = brothers;
	};

	//## getKanketsusen (label)
	this.getKanketsusen = function (label) {
		var ret;
		var arr = window.TYRANO.kag.stat.f.kanketsusen;
		for (var i = 0; i < arr.length; i++) {
			ret = arr[i];
			if (ret.label == label) {
					break;
			}
		}
		return ret;
	};

	//## isBrother (A, B)
	this.isBrother = function (A, B) {
		if (typeof A == "string") A = this.getKanketsusen(A);
		if (typeof B == "string") B = this.getKanketsusen(B);
		var ret = false;
		var arr = B.brothers;
		for (var i = 0; i < arr.length; i++) {
			if (A.label == arr[i]) {
				ret = true;
				break;
			}
		}
		return ret;
	};
	
	this.save = function () {
		//data-html2canvas-ignore = true
		html2canvas($("#tyrano_base")[0], {
			width: 640,
			height: 960,
			onrendered: function(canvas) {
	    		var imgdata  = canvas.toDataURL("image/png");
			    var name     = "screenshot";
			    var date     = $.getNowDate().replace(/\//g, "");
			    var time     = $.getNowTime().replace(/:|：/g, "");
			    var filename = name + "_" + date + "_" + time + ".png";
	    		var type     = "image/png";
	    		var bin = atob(imgdata.split(",")[1]);
	    		var buffer = new Uint8Array(bin.length);
	    		for (var i = 0; i < bin.length; i++) {
	    			  buffer[i] = bin.charCodeAt(i);
	    		}
	    		var blob = new Blob([buffer.buffer], {type: type});
	    		if (window.navigator.msSaveBlob) { 
	    			  window.navigator.msSaveBlob(blob, filename);
	    		}
	    		else {
	      			var a = document.createElement("a");
	      			a.download = filename;
	      			a.href = window.URL.createObjectURL(blob);
	      			a.click();
	    		}
			}
		});
	};
	
	//## copyDefineData
	this.copyDefineData = function (key) {
		$.extend(window.TYRANO.kag.stat.f, this.defineData[key]);
	};
	
	//## defineData
	this.defineData = {
	
		//## ポラリス【干潮】
		Define_Pora_Kancho_Komori: {
			radius: 189,
			komoriLabel: "H",
			suimyaku: "pora_komorikeiro_k.png",
			bg: "../fgimage/pora_komori_k.png",
			kanketsusen: [
				new this.Kanketsusen("A", 276, 422, ["B", "C", "I", "K"]),
				new this.Kanketsusen("B", 412, 420, ["A", "G", "C", "E"]),
				new this.Kanketsusen("C", 339, 533, ["A", "B", "L", "D", "E"]),
				new this.Kanketsusen("D", 448, 591, ["C", "E"]),
				new this.Kanketsusen("E", 580, 521, ["C", "D", "F", "B"]),
				new this.Kanketsusen("F", 577, 411, ["E", "G"]),
				new this.Kanketsusen("G", 524, 228, ["F", "H", "B"]),
				new this.Kanketsusen("H", 438, 201, ["G", "I"]),
				new this.Kanketsusen("I", 251, 223, ["H", "A", "J"]),
				new this.Kanketsusen("J", 124, 312, ["I", "K"]),
				new this.Kanketsusen("K",  95, 470, ["J", "L", "A"]),
				new this.Kanketsusen("L", 222, 609, ["K", "C"])
			]
		},

		//## ポラリス【通常】
		Define_Pora_Tsujo_Komori: {
			radius: 212,
			komoriLabel: "T",
			suimyaku: "pora_komorikeiro.png",
			bg: "../fgimage/pora_komori.png",
			kanketsusen: [
				new this.Kanketsusen("A", 272, 471, ["O", "H", "C"]),
				new this.Kanketsusen("B", 157, 514, ["C", "G", "K"]),
				new this.Kanketsusen("C", 220, 408, ["A", "B", "D", "Q"]),
				new this.Kanketsusen("D", 243, 323, ["C", "E", "T"]),
				new this.Kanketsusen("E", 186, 268, ["D", "F"]),
				new this.Kanketsusen("F",  52, 260, ["E", "G"]),
				new this.Kanketsusen("G",  52, 410, ["B", "F"]),
				new this.Kanketsusen("H", 236, 557, ["A", "I"]),
				new this.Kanketsusen("I", 285, 596, ["H", "O", "L", "J"]),
				new this.Kanketsusen("J", 218, 689, ["K", "I"]),
				new this.Kanketsusen("K",  89, 540, ["B", "J"]),
				new this.Kanketsusen("L", 444, 594, ["O", "M", "I"]),
				new this.Kanketsusen("M", 579, 603, ["N", "L"]),
				new this.Kanketsusen("N", 579, 462, ["P", "M"]),
				new this.Kanketsusen("O", 452, 538, ["P", "L", "I", "A"]),
				new this.Kanketsusen("P", 447, 420, ["O", "Q", "R", "N"]),
				new this.Kanketsusen("Q", 397, 378, ["C", "P"]),
				new this.Kanketsusen("R", 522, 320, ["P", "S"]),
				new this.Kanketsusen("S", 494, 198, ["R", "T"]),
				new this.Kanketsusen("T", 370, 195, ["D", "S"])
			]
		},

		//## トキシラズ【干潮】
		Define_Toki_Kancho_Komori: {
			radius: 250,
			komoriLabel: "G",
			suimyaku: "toki_komorikeiro_k.png",
			bg: "../fgimage/toki_komori_k.png",
			kanketsusen: [
				new this.Kanketsusen("A", 316, 554, ["B", "N"]),
				new this.Kanketsusen("B", 449, 503, ["A", "C", "D", "E"]),
				new this.Kanketsusen("C", 464, 677, ["O", "B"]),
				new this.Kanketsusen("D", 466, 364, ["B", "E", "F"]),
				new this.Kanketsusen("E", 580, 420, ["B", "D", "F"]),
				new this.Kanketsusen("F", 524, 259, ["D", "E", "G"]),
				new this.Kanketsusen("G", 428, 220, ["F", "H"]),
				new this.Kanketsusen("H", 232, 218, ["G", "I"]),
				new this.Kanketsusen("I", 146, 259, ["H", "J", "K"]),
				new this.Kanketsusen("J",  52, 298, ["I", "K"]),
				new this.Kanketsusen("K", 116, 377, ["I", "J", "N", "L"]),
				new this.Kanketsusen("L",  44, 508, ["M", "K"]),
				new this.Kanketsusen("M", 164, 522, ["L", "N", "O"]),
				new this.Kanketsusen("N", 214, 435, ["K", "M", "A"]),
				new this.Kanketsusen("O", 251, 677, ["M", "C"])
			]
		},

		//## トキシラズ【通常】
		Define_Toki_Tsujo_Komori: {
			radius: 250,
			komoriLabel: "J",
			suimyaku: "toki_komorikeiro.png",
			bg: "../fgimage/toki_komori.png",
			kanketsusen: [
				new this.Kanketsusen("A", 359, 518, ["B", "M"]),
				new this.Kanketsusen("B", 234, 602, ["A", "C", "D"]),
				new this.Kanketsusen("C", 203, 725, ["B"]),
				new this.Kanketsusen("D", 209, 479, ["B", "E", "G"]),
				new this.Kanketsusen("E", 136, 427, ["D", "F"]),
				new this.Kanketsusen("F", 184, 254, ["E", "G"]),
				new this.Kanketsusen("G", 278, 279, ["F", "D", "H"]),
				new this.Kanketsusen("H", 351, 240, ["I", "G"]),
				new this.Kanketsusen("I", 423, 257, ["H", "J"]),
				new this.Kanketsusen("J", 490, 312, ["I", "K", "M"]),
				new this.Kanketsusen("K", 555, 371, ["J", "L"]),
				new this.Kanketsusen("L", 560, 469, ["K", "M"]),
				new this.Kanketsusen("M", 457, 533, ["J", "L", "N", "A"]),
				new this.Kanketsusen("N", 508, 673, ["M"])
			]
		},
		
		//## シャケト場【干潮】
		Define_Toba_Kancho_Komori: {
			radius: 237,
			komoriLabel: "D",
			suimyaku: "toba_komorikeiro_k.png",
			bg: "../fgimage/toba_komori_k.png",
			kanketsusen: [
				new this.Kanketsusen("A", 273, 479, ["B", "D", "H", "I", "J"]),
				new this.Kanketsusen("B", 186, 472, ["A", "J", "C", "D"]),
				new this.Kanketsusen("C", 101, 276, ["B", "D"]),
				new this.Kanketsusen("D", 262, 328, ["C", "E", "F", "H", "A", "B"]),
				new this.Kanketsusen("E", 258, 193, ["D"]),
				new this.Kanketsusen("F", 508, 255, ["D", "G"]),
				new this.Kanketsusen("G", 539, 380, ["F", "H"]),
				new this.Kanketsusen("H", 433, 479, ["G", "L", "I", "A", "D"]),
				new this.Kanketsusen("I", 345, 606, ["H", "L", "A", "K"]),
				new this.Kanketsusen("J", 217, 592, ["A", "K", "B"]),
				new this.Kanketsusen("K", 266, 623, ["I", "J"]),
				new this.Kanketsusen("L", 542, 602, ["H", "I"])
			]
		},

		//## シャケト場【通常】
		Define_Toba_Tsujo_Komori: {
			radius: 183,
			komoriLabel: "H",
			suimyaku: "toba_komorikeiro.png",
			bg: "../fgimage/toba_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 423, 542, ["B", "R"]),
				new this.Kanketsusen("B", 370, 500, ["A", "C", "M"]),
				new this.Kanketsusen("C", 292, 563, ["B", "G"]),
				new this.Kanketsusen("D", 286, 694, ["E", "T"]),
				new this.Kanketsusen("E", 238, 677, ["D", "F", "G", "H"]),
				new this.Kanketsusen("F", 100, 743, ["E"]),
				new this.Kanketsusen("G", 201, 564, ["C", "E", "H", "J"]),
				new this.Kanketsusen("H",  38, 586, ["E", "G", "I"]),
				new this.Kanketsusen("I",  88, 470, ["H", "J"]),
				new this.Kanketsusen("J", 266, 439, ["G", "I", "K", "M"]),
				new this.Kanketsusen("K", 274, 291, ["J", "L", "N"]),
				new this.Kanketsusen("L", 340, 227, ["K", "N"]),
				new this.Kanketsusen("M", 381, 408, ["B", "J", "N", "O"]),
				new this.Kanketsusen("N", 438, 338, ["K", "L", "M", "O"]),
				new this.Kanketsusen("O", 498, 432, ["M", "N", "P", "Q", "R"]),
				new this.Kanketsusen("P", 627, 418, ["O"]),
				new this.Kanketsusen("Q", 587, 479, ["O", "R"]),
				new this.Kanketsusen("R", 479, 538, ["O", "Q", "A", "S", "T"]),
				new this.Kanketsusen("S", 573, 559, ["R", "T"]),
				new this.Kanketsusen("T", 495, 675, ["R", "S", "D"]),
			]
		},
		
		//## ドンブラコ【干潮】
		Define_Burako_Kancho_Komori: {
			radius: 190,
			komoriLabel: "C",
			suimyaku: "burako_komorikeiro_k.png",
			bg: "../fgimage/burako_komori_k.png",
			kanketsusen: [
				new this.Kanketsusen("A", 177, 413, ["F", "I", "L", "B"]),
				new this.Kanketsusen("B",  70, 280, ["A", "C"]),
				new this.Kanketsusen("C",  98, 192, ["B", "D"]),
				new this.Kanketsusen("D", 193, 182, ["C", "E"]),
				new this.Kanketsusen("E", 323, 205, ["D", "F"]),
				new this.Kanketsusen("F", 356, 352, ["E", "G", "A"]),
				new this.Kanketsusen("G", 420, 418, ["H", "I", "K", "F"]),
				new this.Kanketsusen("H", 600, 386, ["G"]),
				new this.Kanketsusen("I", 456, 523, ["G"]),
				new this.Kanketsusen("J", 309, 509, ["K", "A"]),
				new this.Kanketsusen("K", 405, 509, ["G", "J"]),
				new this.Kanketsusen("L", 199, 509, ["A"])
			]
		},

		//## ドンブラコ【通常】
		Define_Burako_Tsujo_Komori: {
			radius: 205,
			komoriLabel: "C",
			suimyaku: "burako_komorikeiro.png",
			bg: "../fgimage/burako_komori.png",
			kanketsusen: [
				new this.Kanketsusen("A", 338, 718, ["B", "C"]),
				new this.Kanketsusen("B", 428, 584, ["A", "C", "D", "T"]),
				new this.Kanketsusen("C", 326, 497, ["A", "B", "D", "E", "J"]),
				new this.Kanketsusen("D", 418, 458, ["B", "C", "E", "F"]),
				new this.Kanketsusen("E", 351, 389, ["D", "C", "N", "G"]),
				new this.Kanketsusen("F", 442, 364, ["S", "D", "G", "H"]),
				new this.Kanketsusen("G", 393, 319, ["H", "F", "E", "N"]),
				new this.Kanketsusen("H", 511, 255, ["R", "F", "G", "Q"]),
				new this.Kanketsusen("I", 149, 635, ["J"]),
				new this.Kanketsusen("J", 232, 566, ["C", "I", "K", "L"]),
				new this.Kanketsusen("K", 101, 536, ["J"]),
				new this.Kanketsusen("L", 232, 360, ["N", "J", "M"]),
				new this.Kanketsusen("M", 108, 318, ["L"]),
				new this.Kanketsusen("N", 314, 283, ["G", "E", "L", "O", "P"]),
				new this.Kanketsusen("O", 276, 203, ["P", "N"]),
				new this.Kanketsusen("P", 358, 166, ["Q", "N", "O"]),
				new this.Kanketsusen("Q", 479, 163, ["R", "H", "P"]),
				new this.Kanketsusen("R", 551, 199, ["S", "H", "Q"]),
				new this.Kanketsusen("S", 557, 367, ["R", "T", "F"]),
				new this.Kanketsusen("T", 510, 518, ["S", "U", "B"]),
				new this.Kanketsusen("U", 589, 624, ["T", "V"]),
				new this.Kanketsusen("V", 564, 717, ["U"])
			]
		},

		//## シェケナダム【干潮】
		Define_Damu_Kancho_Komori: {
			radius: 229,
			komoriLabel: "G",
			suimyaku: "damu_komorikeiro_k.png",
			bg: "../fgimage/damu_komori_k.png",
			kanketsusen: [
				new this.Kanketsusen("A", 317, 356, ["B", "C", "D", "E", "F", "G"]),
				new this.Kanketsusen("B", 527, 274, ["C", "A"]),
				new this.Kanketsusen("C", 490, 443, ["A", "B", "D", "J"]),
				new this.Kanketsusen("D", 309, 568, ["A", "C", "E", "H", "I", "J"]),
				new this.Kanketsusen("E", 156, 472, ["A", "D", "F", "G"]),
				new this.Kanketsusen("F",  84, 297, ["A", "E"]),
				new this.Kanketsusen("G", 264, 237, ["A", "E"]),
				new this.Kanketsusen("H", 237, 655, ["D", "I"]),
				new this.Kanketsusen("I", 427, 716, ["D", "H", "J"]),
				new this.Kanketsusen("J", 484, 636, ["C", "D", "I"])
			]
		},

		//## シェケナダム【通常】
		Define_Damu_Tsujo_Komori: {
			radius: 233,
			komoriLabel: "C",
			suimyaku: "damu_komorikeiro.png",
			bg: "../fgimage/damu_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 279, 425, ["B", "D", "F", "I", "K"]),
				new this.Kanketsusen("B", 380, 248, ["A", "C", "D"]),
				new this.Kanketsusen("C", 533, 257, ["B", "D", "E"]),
				new this.Kanketsusen("D", 436, 458, ["A", "B", "C", "E", "F"]),
				new this.Kanketsusen("E", 564, 513, ["C", "D", "F"]),
				new this.Kanketsusen("F", 284, 605, ["A", "D", "E", "G", "I"]),
				new this.Kanketsusen("G", 212, 692, ["F", "H", "I"]),
				new this.Kanketsusen("H", 105, 670, ["G", "I"]),
				new this.Kanketsusen("I",  67, 479, ["A", "F", "G", "H", "J", "K"]),
				new this.Kanketsusen("J",  23, 392, ["I", "K", "L"]),
				new this.Kanketsusen("K", 133, 358, ["A", "I", "J", "L"]),
				new this.Kanketsusen("L",  41, 265, ["J", "K"])
			]
		},
		
		//## --------------
		//## ここから間欠泉
		//## --------------
		//## トキシラズ【通常】
		Define_Toki_Tsujo_Kanketsu: {
			josekidata: [
				["とりあえず二つ開けるやつ", "f.random = false; f.joseki='ToTK_Joseki_A'"],
				["Fから開ける最少手数のやつ", "f.random = false; f.joseki='ToTK_Joseki_B'"]
			],
			suimyaku: "toki_suimyaku.png",
			bg: "../fgimage/toki_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 208, 666, ["B", "C", "D"]),
				new this.Kanketsusen("B", 194, 532, ["A", "C", "D", "F"]),
				new this.Kanketsusen("C", 447, 585, ["A", "B", "E", "G"]),
				new this.Kanketsusen("D",  75, 412, ["A", "B", "F"]),
				new this.Kanketsusen("E", 554, 532, ["C", "G"]),
				new this.Kanketsusen("F", 261, 212, ["B", "D", "G"]),
				new this.Kanketsusen("G", 488, 318, ["C", "E", "F"])
			]
		},

		//## トキシラズ【満潮】
		Define_Toki_Mancho_Kanketsu: {
			josekidata: [
				["とりあえず二つ開けるやつ", "f.random = false; f.joseki='ToMK_Joseki_A'"]
			],
			suimyaku: "toki_suimyaku_m.png",
			bg: "../fgimage/toki_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 208, 666, ["B", "C", "D"]),
				new this.Kanketsusen("B", 194, 532, ["A", "C", "D", "F"]),
				new this.Kanketsusen("C", 447, 585, ["A", "B", "E", "G"]),
				new this.Kanketsusen("F", 261, 212, ["B", "D", "G"]),
				new this.Kanketsusen("G", 488, 318, ["C", "E", "F"])
			]
		},

		//## ドンブラコ【通常】
		Define_Burako_Tsujo_Kanketsu: {
			josekidata: [
				["とりあえず二つ開けるやつ", "f.random = false; f.joseki='BuTK_Joseki_A'"],
			],
			suimyaku: "burako_suimyaku.png",
			bg: "../fgimage/burako_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 312, 728, ["B", "C", "D"]),
				new this.Kanketsusen("B", 143, 595, ["A", "C", "D", "E"]),
				new this.Kanketsusen("C", 433, 595, ["A", "B", "D", "F"]),
				new this.Kanketsusen("D", 313, 547, ["A", "B", "C", "E", "F", "H"]),
				new this.Kanketsusen("E", 143, 342, ["B", "D", "F", "G", "H"]),
				new this.Kanketsusen("F", 313, 342, ["C", "D", "E", "G", "H"]),
				new this.Kanketsusen("G", 276, 209, ["E", "F", "H"]),
				new this.Kanketsusen("H", 445, 294, ["D", "E", "F", "G"])
			]
		},

		//## ドンブラコ【満潮】
		Define_Burako_Mancho_Kanketsu: {
			josekidata: [
				["Hから開けるやつ", "f.random = false; f.joseki='BuMK_Joseki_A'"],
			],
			suimyaku: "burako_suimyaku_m.png",
			bg: "../fgimage/burako_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 312, 728, ["B", "C", "D"]),
				new this.Kanketsusen("D", 313, 547, ["A", "B", "C", "E", "F", "H"]),
				new this.Kanketsusen("F", 313, 342, ["C", "D", "E", "G", "H"]),
				new this.Kanketsusen("H", 445, 294, ["D", "E", "F", "G"])
			]
		},

		//## シャケト場【通常】
		Define_Toba_Tsujo_Kanketsu: {
			josekidata: [
				["桟橋から開けていくやつ",      "f.random = false; f.joseki='BaTK_Joseki_A'"],
				["正面から開けていくやつ",      "f.random = false; f.joseki='BaTK_Joseki_C'"],
				["右斜め前から開けていくやつ", "f.random = false; f.joseki='BaTK_Joseki_B'"]
			],
			suimyaku: "toba_suimyaku.png",
			bg: "../fgimage/toba_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A",  41, 586, ["B", "C"]),
				new this.Kanketsusen("B", 223, 569, ["A", "C", "E"]),
				new this.Kanketsusen("C", 170, 499, ["A", "B", "E"]),
				new this.Kanketsusen("D", 334, 232, ["E", "F"]),
				new this.Kanketsusen("E", 334, 413, ["B", "C", "D", "F", "H", "I"]),
				new this.Kanketsusen("F", 386, 309, ["D", "E", "H"]),
				new this.Kanketsusen("G", 577, 559, ["H", "I"]),
				new this.Kanketsusen("H", 525, 447, ["E", "F", "G", "I"]),
				new this.Kanketsusen("I", 473, 560, ["E", "G", "H"])
			]
		},

		//## シャケト場【満潮】
		Define_Toba_Mancho_Kanketsu: {
			josekidata: [
				["Cから開けるやつ", "f.random = false; f.joseki='BaMK_Joseki_A'"],
				["Hから開けるやつ", "f.random = false; f.joseki='BaMK_Joseki_B'"],
			],
			suimyaku: "toba_suimyaku_m.png",
			bg: "../fgimage/toba_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("B", 223, 569, ["A", "C", "E"]),
				new this.Kanketsusen("C", 170, 499, ["A", "B", "E"]),
				new this.Kanketsusen("E", 334, 413, ["B", "C", "D", "F", "H", "I"]),
				new this.Kanketsusen("H", 525, 447, ["E", "F", "G", "I"]),
				new this.Kanketsusen("I", 473, 560, ["E", "G", "H"])
			]
		},

		//## シェケナダム【通常】
		Define_Damu_Tsujo_Kanketsu: {
			josekidata: [
				["Eから開けるやつ", "f.random = false; f.joseki='SheTK_Joseki_A'"],
				["Fから開けるやつ(早い)", "f.random = false; f.joseki='SheTK_Joseki_B'"]
			],
			suimyaku: "damu_suimyaku.png",
			bg: "../fgimage/damu_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A",  55, 471, ["B", "D", "G", "H"]),
				new this.Kanketsusen("B", 133, 404, ["A", "C", "D", "G", "I"]),
				new this.Kanketsusen("C", 388, 350, ["B", "D", "E", "F", "G"]),
				new this.Kanketsusen("D", 332, 406, ["A", "B", "C", "E", "F", "G"]),
				new this.Kanketsusen("E", 576, 262, ["C", "D", "F"]),
				new this.Kanketsusen("F", 565, 516, ["C", "D", "E"]),
				new this.Kanketsusen("G", 279, 605, ["A", "B", "C", "D", "H"]),
				new this.Kanketsusen("H", 210, 693, ["A", "G"]),
				new this.Kanketsusen("I",  55, 238, ["B"])
			]
		},

		//## シェケナダム【満潮】
		Define_Damu_Mancho_Kanketsu: {
			suimyaku: "damu_suimyaku_m.png",
			josekidata: [
				["Fから開けるやつ", "f.random = false; f.joseki='SheMK_Joseki_A'"]
			],
			bg: "../fgimage/damu_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A",  55, 471, ["B", "D", "G", "H"]),
				new this.Kanketsusen("B", 133, 404, ["A", "C", "D", "G", "I"]),
				new this.Kanketsusen("C", 388, 350, ["B", "D", "E", "F", "G"]),
				new this.Kanketsusen("F", 565, 516, ["C", "D", "E"]),
				new this.Kanketsusen("G", 279, 605, ["A", "B", "C", "D", "H"])
			]
		},

		//## ポラリス【通常】
		Define_Porarisu_Tsujo_Kanketsu: {
			josekidata: [
				["とりあえず二つ開けるやつ", "f.random = false; f.joseki='PoTK_Joseki_A'"],
				["Fから開けるやつ", "f.random = false; f.joseki='PoTK_Joseki_B'"]
			],
			suimyaku: "pora_suimyaku.png",
			bg: "../fgimage/pora_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 385, 535, ["B", "C", "D", "E", "G"]),
				new this.Kanketsusen("B", 236, 618, ["A", "C", "D", "E"]),
				new this.Kanketsusen("C", 154, 535, ["A", "B", "D", "E", "F"]),
				new this.Kanketsusen("D", 154, 387, ["A", "B", "C", "E", "F"]),
				new this.Kanketsusen("E", 454, 428, ["A", "B", "C", "D", "F", "G"]),
				new this.Kanketsusen("F", 236, 225, ["C", "D", "E", "G"]),
				new this.Kanketsusen("G", 535, 360, ["A", "E", "F"])
			]
		},

		//## ポラリス【満潮】
		Define_Porarisu_Mancho_Kanketsu: {
			josekidata: [
				["Eから開けるやつ", "f.random = false; f.joseki='PoMK_Joseki_A'"],
			],
			suimyaku: "pora_suimyaku_m.png",
			bg: "../fgimage/pora_kanketsu.png",
			kanketsusen: [
				new this.Kanketsusen("A", 385, 535, ["B", "E"]),
				new this.Kanketsusen("B", 236, 618, ["A"]),
				new this.Kanketsusen("D", 154, 387, []),
				new this.Kanketsusen("E", 454, 428, ["A"]),
			]
		}
	
	};
	
	return this;
}


//# Define_Komori
window.Define_Komori = {
};