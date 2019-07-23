
tyrano.base ={
    
    //読み込み対象のモジュール
    tyrano:null,
    modules:[],
    options:{
        
    },
    
    init:function(tyrano){
        this.tyrano = tyrano;
    },
    
    setBaseSize:function(width,height){
        
        this.tyrano.get(".tyrano_base").css("width",width).css("height",height).css("background-color","black");
        
        //NW.js 以外の場合。absolute
        if(!$.isNWJS()){
            $(".tyrano_base").css("position","absolute");
        }
        
    },
    
    //画面サイズをぴったりさせます
    fitBaseSize:function(width,height){
       
        if (typeof window.tyranoDivInfo == "undefined") {
        	window.tyranoDivInfo = {
        		left: 0,
        		top: 0,
        		scale: 1
        	};
        }
        var that = this;
      	var view_width = $.getViewPort().width;
        var view_height = $.getViewPort().height;
        
        var width_f = view_width / width ;
        var height_f = view_height / height;
        
        var scale_f = 0;
        
        var space_width = 0;
        
        var screen_ratio = this.tyrano.kag.config.ScreenRatio;
        
        //比率を固定にしたい場合は以下　以下のとおりになる
        if(screen_ratio =="fix"){
        	
        	if(width_f > height_f){
               scale_f = height_f;
             }else{
                scale_f = width_f;
        	}
        	
        	this.tyrano.kag.tmp.base_scale = scale_f;
        	window.tyranoDivInfo.scale = scale_f;

            setTimeout(function() {
                    
                   var x = 0, y = 0
                    
                   //中央寄せなら、画面サイズ分を引く。
                   if(that.tyrano.kag.config["ScreenCentering"] && that.tyrano.kag.config["ScreenCentering"]=="true"){
                       
                       $(".tyrano_base").css("position", "initial");
                       $(".tyrano_base").css("transform-origin","0 0");
                       $(".tyrano_base").css({
                           margin: 0
                       });
                       
                       var width = Math.abs(parseInt(window.innerWidth) - parseInt(that.tyrano.kag.config.scWidth*scale_f))/2;
                       var height = Math.abs(parseInt(window.innerHeight) - parseInt(that.tyrano.kag.config.scHeight*scale_f))/2;
                       
                       
                       if(width_f > height_f){
	                       window.tyranoDivInfo.left = width;
	                       window.tyranoDivInfo.top = 0;
                            x = width / scale_f;
                            y = 0;
                            /*
                            $(".tyrano_base").css("left",width+"px");
                            $(".tyrano_base").css("top","0px");
                            */
                       }else{
	                        window.tyranoDivInfo.left = 0;
	                        window.tyranoDivInfo.top = height;
                            x = 0;
                            y = height / scale_f;
                            /*
                            $(".tyrano_base").css("left","0px");
                            $(".tyrano_base").css("top",height+"px");
                            */
                       }
                       
                   }
                   
                   $(".tyrano_base").css("transform", "scale(" + scale_f + ") translate(" + x + "px, " + y + "px)");
                   if (parseInt(view_width) < parseInt(width)) {
                        if (scale_f < 1) {
                            window.scrollTo(width, height);
                        }
                   }

            }, 100);        	
            
        }else if(screen_ratio =="fit"){
            
            //スクリーンサイズに合わせて自動的に調整される
            setTimeout(function() {
                       $(".tyrano_base").css("transform","scaleX("+width_f+") scaleY("+height_f+")");
                       window.scrollTo(width, height);
            },100);
            
        }else{
        	
        	//スクリーンサイズ固定
        	
        }
       
        
    },
    
    test:function(){
        //alert("tyrano test");
    }
    
};
