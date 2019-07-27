function loadPlugin() {
	loadPlugin1();
	loadPlugin2();
	loadPlugin3();
}

function loadPlugin1() {
	tyrano.plugin.kag.stat.stack["for"] = [];
	tyrano.plugin.kag.tag["for"] = {
	    
	    vital: ["name"],
	    
	    pm : {
	        name: "",
	        from: "0",
	        to: "3",
	        len: "",
	        array: "",
	        deep: "0",
	    },
	    
	    start : function(pm) {
	        
	        //スコープを確保
	        var TG = this.kag;
	        var f = TG.stat.f;
	        var sf = TG.variable.sf;
	        var tf = TG.variable.tf;
	        var mp = TG.stat.mp;
	        
	        //name属性にtf.indexは指定できない
	        if (pm.name === "tf.index") {
	            alert("申し訳ございませんが、[for][foreach]のnameパラメータにtf.indexは指定できません。");
	            return false;
	        }
	        
	        //pm.lenが指定されていない場合はpm.fromとpm.toから計算する
	        if (pm.len === "") {
	            pm.len = parseInt(pm.to) - parseInt(pm.from) + 1;
	        }
	        
	        //数値変換
	        pm.from = parseInt(pm.from);
	        pm.to   = parseInt(pm.to);
	        pm.len  = parseInt(pm.len);
	        
	        //スタックを作って格納
	        var stk = {
	            return_index: this.kag.ftag.current_order_index,
	            return_scenario: this.kag.stat.current_scenario,
	            is_loop: true,
	            index: 0,
	            length: parseInt(pm.len),
	            pm: pm
	        };
	        this.kag.pushStack("for", stk);
	        
	        // 配列用の文字列
	        var array_str = stk.pm.array + "[" + (stk.pm.from + stk.index) + "]";
	        
	        //継続条件をいきなりチェック
	        if (eval(stk.index + " < " + stk.length) && (stk.pm.array === "" || typeof eval(array_str) !== "undefined")) {
	            //満たしていれば初期値を格納して次のタグへ
	            if (stk.pm.array !== "") {
	                eval(stk.pm.name + " = " + array_str);
	            }else{
	                eval(stk.pm.name + " = " + stk.pm.from);
	            }
	            tf.index = 0;
	            this.kag.ftag.nextOrder();
	        }else{
	            //満たしていないならfor文の中身は一度も実行しない
	            //次に現れるnextforを探してdeppを照合する、forのdeepとnextforのdeepが一致したらok
	            for (var i = 0; i < 2000; i++) {
	                this.kag.ftag.current_order_index++;
	                var tag = this.kag.ftag.array_tag[this.kag.ftag.current_order_index];
	                if (tag.name == "nextfor") {
	                    var the_deep = tag.pm.deep || "0";
	                    if (the_deep == pm.deep) {
	                        break;
	                    }
	                    if (i > 1900) {
	                        alert("[nextfor]が見つかりませんでした。");
	                        break;
	                    }
	                }
	            }
	            this.kag.ftag.nextOrder();
	        }
	        
	    }

	};

	tyrano.plugin.kag.tag.foreach = {
	    
	    vital: ["name", "array"],
	    
	    pm : {
	        name: "",
	        from: "0",
	        to: "",
	        len: "",
	        array: ""
	    },
	    
	    start : function(pm) {
	        
	        //スコープを確保
	        var TG = this.kag;
	        var f = TG.stat.f;
	        var sf = TG.variable.sf;
	        var tf = TG.variable.tf;
	        var mp = TG.stat.mp;
	        
	        //pm.lenが指定されていないなら
	        if (pm.len === "") {
	            //pm.toも指定されていないなら
	            if (pm.to === "") {
	                pm.len = eval(pm.array).length;
	            }
	            //pm.toは指定されているなら
	            else {
	                pm.len = parseInt(pm.to) - parseInt(pm.from) + 1;
	            }
	        }
	        
	        //後の処理はforタグに丸投げ
	        this.kag.ftag.startTag("for", pm);
	        
	    }

	};

	tyrano.plugin.kag.tag.breakfor = {
	    
	    pm : {
	        deep: ""
	    },
	    
	    start : function(pm) {
	        
	        //forスタックを取得
	        var stk = this.kag.getStack("for");
	        
	        //ループを打ち切る
	        stk.is_loop = false;
	        
	        //次の[nextfor]を探して実行する
	        for (var ret, i = 0; i < 2000; i++) {
	            
	            ret = this.kag.ftag.nextOrderWithTag({
	                "nextfor" : ""
	            });
	            
	            if (ret == true) {
	                break;
	            }
	            
	            if (i > 1900) {
	                alert("[nextfor]が見つかりませんでした。");
	                break;
	            }
	            
	        }
	        
	    }

	};

	tyrano.plugin.kag.tag.nextfor = {
	    
	    pm : {
	        deep: "0"
	    },
	    
	    start : function(pm) {
	        
	        //スコープを確保
	        var TG = this.kag;
	        var f = TG.stat.f;
	        var sf = TG.variable.sf;
	        var tf = TG.variable.tf;
	        var mp = TG.stat.mp;
	        
	        //forスタックの取得
	        var stk = this.kag.getStack("for");
	        
	        //インクリメント
	        stk.index++;
	        tf.index = stk.index;
	        
	        // 配列用の文字列
	        var array_str = stk.pm.array + "[" + (stk.pm.from + stk.index) + "]";
	        
	        //ループ継続条件を満たしているか
	        if (stk.is_loop && eval(stk.index + " < " + stk.length) && (stk.pm.array === "" || typeof eval(array_str) !== "undefined")) {
	            //満たしているなら変数を更新してループ
	            if (stk.pm.array !== "") {
	                eval(stk.pm.name + " = " + array_str);
	            }else{
	                eval(stk.pm.name + "++");
	            }
	            this.kag.ftag.nextOrderWithIndex(stk.return_index, stk.return_scenario);
	        }else{
	            //満たしていないならスタックを削除して次のタグへ
	            this.kag.popStack("for");
	            this.kag.ftag.nextOrder();
	        }
	        
	    }

	};

	(function(tag_names){
	    for (var tag_name, i = 0; i < tag_names.length; i++) {
	        tag_name = tag_names[i];
	        tyrano.plugin.kag.ftag.master_tag[tag_name] = object(tyrano.plugin.kag.tag[tag_name]);
	        tyrano.plugin.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
	    }
	}(["for", "foreach", "breakfor", "nextfor"]));

	TYRANO.kag.ftag.master_tag.clearstack.start = function (pm) {
	    if (pm.stack == "") {
	        for (var key in this.kag.stat.stack) {
	            this.kag.stat.stack[key] = [];
	        }
	    } else {
	        this.kag.stat.stack[pm.stack] = [];
	    }
	    this.kag.ftag.nextOrder();
	};

}













function loadPlugin2() {

	//glink_show.js

	//glinkタグにvisibleパラメータを追加
	tyrano.plugin.kag.tag.glink.start = function (pm) {

	    var that = this;
	    var target_layer = null;
	    target_layer = this.kag.layer.getFreeLayer();
	    target_layer.css("z-index", 999999);

	    var j_button = $("<div class='glink_button'>" + pm.text + "</div>");
	    j_button.css("position", "absolute");
	    j_button.css("cursor", "pointer");
	    j_button.css("z-index", 99999999);
	    j_button.css("font-size", pm.size + "px");
	    
	    //初期状態で表示か非表示か
	    if(pm.visible!="false"){
	        j_button.show();
	    }else{
	        j_button.hide();
	    }
	    
	    if(pm.font_color !=""){
	        j_button.css("color",$.convertColor(pm.font_color));
	    }
	    
	    if (pm.height != "") {
	        j_button.css("height", pm.height + "px");
	    }

	    if (pm.width != "") {
	        j_button.css("width", pm.width + "px");
	    }
	    
	    //graphic 背景画像を指定できます。
	    if(pm.graphic !=""){
	        
	        //画像の読み込み
	        
	        j_button.removeClass("glink_button").addClass("button_graphic");
	        var img_url = "./data/image/" + pm.graphic ;
	        j_button.css("background-image","url("+img_url+")");
	        j_button.css("background-repeat","no-repeat");
	        j_button.css("background-position","center center");
	        j_button.css("background-size","100% 100%");
	        
	    }else{
	        j_button.addClass(pm.color);
	    }
	    
	    if(pm.face !=""){
	        j_button.css("font-family", pm.face);
	    }else if(that.kag.stat.font.face !=""){
	        j_button.css("font-family", that.kag.stat.font.face);
	    }

	    if (pm.x == "auto") {
	        var sc_width = parseInt(that.kag.config.scWidth);
	        var center = Math.floor(parseInt(j_button.css("width")) / 2);
	        var base = Math.floor(sc_width / 2);
	        var first_left = base - center;
	        j_button.css("left", first_left + "px");

	    } else if (pm.x == "") {
	        j_button.css("left", this.kag.stat.locate.x + "px");
	    } else {
	        j_button.css("left", pm.x + "px");
	    }

	    if (pm.y == "") {
	        j_button.css("top", this.kag.stat.locate.y + "px");
	    } else {
	        j_button.css("top", pm.y + "px");
	    }

	    //オブジェクトにクラス名をセットします
	    $.setName(j_button, pm.name);
	    
	    that.kag.event.addEventElement({
	        "tag":"glink",
	        "j_target":j_button, //イベント登録先の
	        "pm":pm
	    });
	    this.setEvent(j_button,pm);

	    target_layer.append(j_button);
	    target_layer.show();
	    this.kag.ftag.nextOrder();

	};

	//glink_showタグを追加
	tyrano.plugin.kag.tag.glink_show = {

	    pm : {
	        dx: "0", //difference x 全体を中央からどれだけずらすか
	        dy: "0", //difference y (同上)
	        slip: "0",
	        margin: "20",
	        wait: "true",
	        time: "1000",
	        delay: "0",
	        method: "puffIn",
	        vertical: "true",
	        centering: "true",
	        fadein: "true"
	    },

	    start : function(pm) {

	        var that = this;
	        
	        //自動配置の対象
	        var j_targets = $("div[data-event-tag='glink']");
	        
	        //縦並びか横並びか
	        var is_vertical = (pm.vertical == "true");
	        var a = 1 * is_vertical;
	        var b = 1 * !is_vertical;
	        if (!is_vertical) {
	            var t = pm.slip;
	            pm.slip = pm.margin;
	            pm.margin = t;
	        }
	        
	        //いろいろ初期化
	        var margin_left = parseInt(pm.slip);
	        var margin_top  = parseInt(pm.margin);
	        var total_height = - margin_top;
	        var total_width  = - margin_left;
	        var total_slip = 0;
	        var screen_width  = parseInt(this.kag.config.scWidth);
	        var screen_height = parseInt(this.kag.config.scHeight);
	        var j_this, offset, x, y, target, targets = [], destinations = [], froms = [];
	        destinations[0] = {left: 0, top: 0, opacity: 1};
	        
	        //j_targetsの位置や大きさを取得しながら目標位置の基礎データを作成していく
	        j_targets.each(function(i){
	            
	            j_this = $(this);
	            offset = j_this.offset();
	            
	            //なんかこれを入れないとうまく動かないケースがある
	            j_this.css("width", j_this.css("width"));
	            j_this.css("height", j_this.css("height"));
	            
	            //jQueryオブジェクトとxy座標,幅,高さのpx値をまとめておく
	            target = {
	                j_target: j_this,
	                left: offset.left,
	                top: offset.top,
	                width: j_this.outerWidth(),
	                height: j_this.outerHeight()
	            };
	            
	            // 幅,高さの合計に加算
	            total_width  += b * target.width  + margin_left;
	            total_height += a * target.height + margin_top;
	            
	            if (i + 1 < j_targets.length) {
	                //目標位置をざっくり決める
	                //ここで決めているのは1個目のボタンをx,y=0,0としたときの相対的な位置
	                x  = destinations[i].left;
	                x += b * target.width;
	                x += margin_left;
	                y  = destinations[i].top;
	                y += a * target.height;
	                y += margin_top;
	                total_slip = a * margin_left + b * margin_top;
	                destinations[i + 1] = {
	                    left: x,
	                    top:  y,
	                    opacity: 1
	                };
	            }
	            
	            targets.push(target);
	        });
	        
	        //目標位置の補正,開始位置の作成
	        var i, destination, from, len = targets.length;
	        for (i = 0; i < len; i++) {
	            target = targets[i];
	            destination = destinations[i];
	            
	            //目標位置の補正
	            destination.left += parseInt(pm.dx);
	            if (pm.centering == "true") {
	                destination.left += (- b * total_width  / 2);
	                destination.left += (- a * target.width  / 2);
	                destination.left += (screen_width  / 2);
	                destination.left += (- a * margin_left * len / 2);
	                destination.left += a * total_slip / 2;
	            }
	            destination.top += parseInt(pm.dy);
	            if (pm.centering == "true") {
	                destination.top += (- a * total_height / 2);
	                destination.top += (- b * target.height / 2);
	                destination.top += (screen_height / 2);
	                destination.top += (- b * margin_top * len / 2);
	                destination.top += b * total_slip / 2;
	            }
	            
	            //開始位置の作成
	            from = froms[i] = {};
	            from.display = "block";
	            from.opacity = 0;
	            from.left = destination.left;
	            from.top  = destination.top;
	            if (pm.fadein == "false") {
	                from.opacity = 1;
	            }
	            var small_move = 50;
	            var lefttop_x = destinations[0].left
	            var lefttop_y = destinations[0].top
	            var center_x = lefttop_x + total_width / 2;
	            var center_y = lefttop_y + total_height / 2;
	            //methodで分岐
	            switch(pm.method){
	            case "crossIn":
	                from.left += a * small_move * Math.pow(-1, i);
	                from.top  += b * small_move * Math.pow(-1, i);
	                break;
	            case "crossInBig":
	                from.left += a * screen_width * Math.pow(-1, i);
	                from.top  += b * screen_width * Math.pow(-1, i);
	                break;
	            case "puffIn":
	                if (pm.centering == "true") {
	                    from.top = parseInt(pm.dy) + screen_height / 2 - target.height / 2;
	                    from.left = parseInt(pm.dx) + screen_width / 2 - target.width / 2;
	                } else {
	                    from.left  = destinations[0].left;
	                    from.left += (b * total_width / 2);
	                    from.left += (-b * target.width / 2);
	                    from.left += (a * margin_left * ((len / 2)|0));
	                    from.left += parseInt(pm.dx);
	                    from.top  = destinations[0].top;
	                    from.top += (a * total_height / 2);
	                    from.top += (-a * target.height / 2);
	                    from.top += (b * margin_top * ((len / 2)|0));
	                    from.top += parseInt(pm.dy);
	                }
	                break;
	            case "puffInDown":
	                if (is_vertical) {
	                    from.left = destination.left;
	                    from.top  = destinations[0].top;
	                } else {
	                    from.left = destinations[0].left;
	                    from.top  = destinations[0].top;
	                }
	                break;
	            case "fadeInLeft":
	                from.left += - small_move;
	                break;
	            case "fadeInRight":
	                from.left += small_move;
	                break;
	            case "fadeInUp":
	                from.top += small_move;
	                break;
	            case "fadeInDown":
	                from.top += - small_move;
	                break;
	            case "fadeInLeftBig":
	                from.left += - screen_width;
	                break;
	            case "fadeInRightBig":
	                from.left += screen_width;
	                break;
	            case "fadeInUpBig":
	                from.top += screen_height;
	                break;
	            case "fadeInDownBig":
	                from.top += - screen_height;
	                break;
	            case "fadeIn":
	                break;
	            case "none":
	            default:
	                from.opacity = 1;
	                break;
	            }
	        }
	        
	        //アニメーションのセット
	        var cnt = 0;
	        for (i = 0; i < len; i++) {
	            targets[i].j_target
	            .css(froms[i])
	            .delay(i * parseInt(pm.delay))
	            .animate(
	                destinations[i],
	                parseInt(pm.time),
	                function(){
	                    cnt++;
	                    if(cnt==len){
	                        if(pm.wait=="true"){
	                            that.kag.ftag.nextOrder();
	                        }
	                    }
	                }
	            );
	        }
	        
	        if(pm.wait!="true"){
	            that.kag.ftag.nextOrder();
	        }

	    }
	};

	//マスタータグに追加
	tyrano.plugin.kag.ftag.master_tag["glink_show"] = object(tyrano.plugin.kag.tag["glink_show"]);
	tyrano.plugin.kag.ftag.master_tag["glink_show"].kag = TYRANO.kag;

}




function loadPlugin3() {
	(function (TYRANO) {
	    var html2canvasOrigin = window.html2canvas;
	    window.html2canvas = function (target, config) {
	        var onrendered = config.onrendered;
	        delete config.onrendered;
	        config.logging = false;
	        config.isDisableTransformOfWrapper = true;
	        html2canvasOrigin(target, config).then(onrendered);
	    };
	}(window.TYRANO));
}





