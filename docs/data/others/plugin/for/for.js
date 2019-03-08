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