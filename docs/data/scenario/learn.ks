[clearstack]
[call target=Define]

;=======================================
*Title
;=======================================

;[mask time=300]
[iscript]
if (! sf.last_visit_version) sf.last_visit_version = 0;
[endscript]
[if exp="sf.last_visit_version < 20000"]
	[preload wait=true storage=data/image/masking_image.png]
	[mask graphic=masking_image.png]
	[wait time=2000]
[else]
	[mask time=300]
[endif]
[layopt layer=0 visible=true]
[layopt layer=1 visible=true]
[layopt layer=message0 visible=false]
[bg time=0 storage=red_bg.png]
[image layer=1 zindex=100 x=40 y=20 storage=logo.png width=550 name=logo]
;[image layer=1 zindex=100 x=0 y=840 width=640 height=120 storage=../bgimage/black.png zindex=100]
[button fix=true graphic=panel_1.png  x=0   y=840 width=160 target=*Panel_1 name=panel,panel_1]
[button fix=true graphic=panel_2.png  x=160 y=840 width=160 target=*Panel_2 name=panel,panel_2]
[button fix=true graphic=panel_3.png  x=320 y=840 width=160 target=*Panel_3 name=panel,panel_3]
[button fix=true graphic=panel_4.png  x=480 y=840 width=160 target=*Panel_4 name=panel,panel_4]
[eval exp="tf.reseted=true"]
[iscript]
if (! sf.panel) sf.panel = 1;
tf.panel = "*Panel_" + sf.panel;
[endscript]
[call target=&tf.panel]
[eval exp="tf.reseted=false"]
[if exp="sf.last_visit_version < 20000"]
	[mask_off time=1000]
[else]
	[mask_off time=300]
[endif]
[eval exp="sf.last_visit_version = window.VERSION"]
[s]

;=======================================
*Panel_Reset
[return cond="tf.reseted"]
[cm]
[anim layer=1 name=logo opacity=255 time=0]
[freeimage layer=0 time=0]
[return]

;=======================================
*Panel_1
[eval exp="sf.panel = 1"]
[call target=*Panel_Reset]
[iscript]
tf.x = 40;
tf.y = 180;
$(".panel").removeClass("panel_now");
$(".panel_1").addClass("panel_now");
[endscript]
[image layer=0                           x=&tf.x+150  y=&tf.y+20 storage=goldie.png width=60]
[ptext layer=0 text=間欠泉 size=40       x=&tf.x+220 y=&tf.y+25 bold=bold]
[ptext layer=0 text=シェケナダム size=30 x=&tf.x+60  y=&tf.y+105]
[ptext layer=0 text=ドン･ブラコ  size=30 x=&tf.x+60  y=&tf.y+175]
[ptext layer=0 text=シャケト場   size=30 x=&tf.x+60  y=&tf.y+245]
[ptext layer=0 text=トキシラズ   size=30 x=&tf.x+60  y=&tf.y+315]
[ptext layer=0 text=ポラリス     size=30 x=&tf.x+60  y=&tf.y+385]
[glink text=通常 x=&tf.x+270 y=&tf.y+100 size=25 color=tsujo  target=Init exp="f.target='Define_Damu_Tsujo_Kanketsu'"]
[glink text=満潮 x=&tf.x+390 y=&tf.y+100 size=25 color=mancho target=Init exp="f.target='Define_Damu_Mancho_Kanketsu'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+170 size=25 color=tsujo  target=Init exp="f.target='Define_Burako_Tsujo_Kanketsu'"]
[glink text=満潮 x=&tf.x+390 y=&tf.y+170 size=25 color=mancho target=Init exp="f.target='Define_Burako_Mancho_Kanketsu'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+240 size=25 color=tsujo  target=Init exp="f.target='Define_Toba_Tsujo_Kanketsu'"]
[glink text=満潮 x=&tf.x+390 y=&tf.y+240 size=25 color=mancho target=Init exp="f.target='Define_Toba_Mancho_Kanketsu'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+310 size=25 color=tsujo  target=Init exp="f.target='Define_Toki_Tsujo_Kanketsu'"]
[glink text=満潮 x=&tf.x+390 y=&tf.y+310 size=25 color=mancho target=Init exp="f.target='Define_Toki_Mancho_Kanketsu'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+380 size=25 color=tsujo  target=Init exp="f.target='Define_Porarisu_Tsujo_Kanketsu'"]
[glink text=満潮 x=&tf.x+390 y=&tf.y+380 size=25 color=mancho target=Init exp="f.target='Define_Porarisu_Mancho_Kanketsu'"]
[return]

;=======================================
*Panel_2
[eval exp="sf.panel = 2"]
[call target=*Panel_Reset]
[iscript]
tf.x = 40;
tf.y = -280;
$(".panel").removeClass("panel_now");
$(".panel_2").addClass("panel_now");
[endscript]
[image layer=0                             x=&tf.x+80 y=&tf.y+460 storage=komori.png width=90]
[ptext layer=0 text=コウモリマップ size=40 x=&tf.x+160 y=&tf.y+480 bold=bold]
[ptext layer=0 text=シェケナダム   size=30 x=&tf.x+60 y=&tf.y+565]
[ptext layer=0 text=ドン･ブラコ    size=30 x=&tf.x+60 y=&tf.y+635]
[ptext layer=0 text=シャケト場     size=30 x=&tf.x+60 y=&tf.y+705]
[ptext layer=0 text=トキシラズ     size=30 x=&tf.x+60 y=&tf.y+775]
[ptext layer=0 text=ポラリス       size=30 x=&tf.x+60 y=&tf.y+845]
[glink text=通常 x=&tf.x+270 y=&tf.y+560 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Damu_Tsujo_Komori'"]
[glink text=干潮 x=&tf.x+390 y=&tf.y+560 size=25 color=kancho target=*InitKomori exp="f.target='Define_Damu_Kancho_Komori'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+630 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Burako_Tsujo_Komori'"]
[glink text=干潮 x=&tf.x+390 y=&tf.y+630 size=25 color=kancho target=*InitKomori exp="f.target='Define_Burako_Kancho_Komori'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+700 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Toba_Tsujo_Komori'"]
[glink text=干潮 x=&tf.x+390 y=&tf.y+700 size=25 color=kancho target=*InitKomori exp="f.target='Define_Toba_Kancho_Komori'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+770 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Toki_Tsujo_Komori'"]
[glink text=干潮 x=&tf.x+390 y=&tf.y+770 size=25 color=kancho target=*InitKomori exp="f.target='Define_Toki_Kancho_Komori'"]
[glink text=通常 x=&tf.x+270 y=&tf.y+840 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Pora_Tsujo_Komori'"]
[glink text=干潮 x=&tf.x+390 y=&tf.y+840 size=25 color=kancho target=*InitKomori exp="f.target='Define_Pora_Kancho_Komori'"]
[return]

;=======================================
*Panel_3
[eval exp="sf.panel = 3"]
[call target=*Panel_Reset]
;[anim layer=0 name=logo opacity=0 time=0]
[ptext layer=0 page=fore text=エラーが発生しました🤔     size=24 bold=bold x=0 y=350 width=640 align=center name=error_message,hidden]
[ptext layer=0 page=fore text=現在ご利用いただけません🙇 size=24 bold=bold x=0 y=400 width=640 align=center name=error_message,hidden]
[ptext layer=0 page=fore text=オープン! color=0x22FF22     size=24 bold=bold x=0 y=170 width=640 align=center name=open_title,hidden]
[glink text=»&nbsp;予報を見る x=1380 y=433 size=18 color=rotation_eval_button name=link target=Panel_3_Eval exp="f.select=0; f.noselect=1"]
[glink text=»&nbsp;予報を見る x=1380 y=743 size=18 color=rotation_eval_button name=link target=Panel_3_Eval exp="f.select=1; f.noselect=0"]
[iscript]
tf.x = 20;
tf.y = 120;
$(".panel").removeClass("panel_now");
$(".panel_3").addClass("panel_now");
salmonrunAPI.cloneRotationObj("salmon_rotation_1", 0, 200);
salmonrunAPI.cloneRotationObj("salmon_rotation_2", 0, 510);
salmonrunAPI.get(function (data) {
	salmonrunAPI.render(data);
	$(".rotation_eval_button").animate({left: "-=1000"}, 0);
}, function () {
	console.error("サーモンランAPIの実行に失敗しました。");
	$(".error_message").fadeIn(0);
});
[endscript]
[return]

*Panel_3_Eval
[iscript]
$('<div class="button_cover"></div>').appendTo(".tyrano_base");
[endscript]
[iscript]
$(".error_message").remove();
$(".open_title").remove();
$logo     = $(".logo");
$select   = $(".salmon_rotation_" + (f.select + 1));
$noselect = $(".salmon_rotation_" + (f.noselect + 1));
var time = 1200;
var ease = "easeInOutCubic";
$select.animate({"top": "6px"}, time, ease);
$logo.animate({"opacity": "0"}, time, ease);
$noselect.fadeOut(time, ease);
[endscript]
[wait time=1200]
[html name=html_space]
<div class="canvas_chart_wrapper">
	<canvas class="canvas_chart" id="canvas_chart" width="400" height="400"></canvas>
</div>
<div class="eval_score">
	<span class="eval_score_1">偏差値は…</span>
	<span class="eval_score_2">50</span>
	<span class="eval_score_3">.0!</span>
</div>
[endhtml]
[iscript]
$(".html_space").appendTo(".0_fore")
[endscript]
[wait time=1000]
[iscript]
var rater = salmonrunRater;
window.evalData   = ROTATION_DATA[f.select];
window.evalResult = rater.eval(evalData.w1, evalData.w2, evalData.w3, evalData.w4);
rater.showScore(evalResult.score);
rater.drawChart(evalResult.radarData);
[endscript]
[wait time=100]
[wait time=1200]
[glink text=次へ x=280 y=750 size=24 color=eval_next_button target=Panel_3_Message]
[iscript]
$(".button_cover").remove();
[endscript]
[s]

*Panel_3_Message

[iscript]
$(".canvas_chart_wrapper").css({"animation-fill-mode": "none"}).fadeOut(500, function(){$(this).remove()});
$(".eval_score"          ).css({"animation-fill-mode": "none"}).fadeOut(500, function(){
	$(this).remove()
	$('<div class="eval_fukidashi"></div>').appendTo(".0_fore");
	$('<img class="eval_ika" src="./data/fgimage/eval_ika.png">').appendTo(".0_fore");
	tf.messages = salmonrunRater.createEvalMessage(evalResult);
	tf.messageArea = $(".eval_fukidashi");
	tyranoAPI.jump("", "Panel_3_Message_Next", 300);
});
[endscript]
[s]

*Panel_3_Message_Next

[iscript]
$('<div class="button_cover"></div>').appendTo(".tyrano_base");
[endscript]
[iscript]
tf.wait = false;
var $p = tf.messageArea.find("p");
if ($p.size() > 0) {
	tf.wait = true;
	$p.css({"animation-name": "none"}).fadeOut(500, function(){$(this).remove()});
}
[endscript]
[wait time=500 cond=tf.wait]
[iscript]
var count = 0;
if (tf.messages.length > 0) {
	for (var i = 0; i < 3; i++) {
		if (tf.messages.length > 0) {
			var mes = tf.messages.shift();
			var delay = i * 300;
			tf.messageArea.append('<p style="animation-delay: ' + delay + 'ms">' + mes + '</p>');
			count++;
		}
	}
}
if (tf.messages.length > 0) {
	tf.end = false;
	tf.text = "次へ";
	tf.target = "Panel_3_Message_Next";
	tf.x = 280;
	tf.y = 750;
}
else {
	tf.x = 270;
	tf.y = 770;
	tf.end = true;
	tf.text = "終わる";
	tf.target = "Panel_3_Eval_End";
	if (evalResult.randomType > 1) {
		tf.end = false;
		tf.x = 280;
		tf.y = 750;
	}
}
tf.time = 300 + 300 * count;
[endscript]
[wait time=&tf.time]
[glink text=&tf.text x=&tf.x y=&tf.y size=24 color=eval_next_button target=&tf.target exp="tf.end2 = true"]
[glink text=ブキの個別パラメータを見る x=30 y=700 size=24 color=eval_next_button target=Panel_3_Eval_End cond="tf.end" exp="tf.end2 = false"]
[iscript]
$(".button_cover").remove();
[endscript]
[s]

*Panel_3_Eval_End
[iscript]
$('<div class="button_cover"></div>').appendTo(".tyrano_base");
[endscript]
[iscript]
tf.messageArea.css({"animation-fill-mode": "none"}).fadeOut(500, function(){$(this).remove()});
$(".eval_ika").css({"animation-fill-mode": "none"}).fadeOut(500, function(){$(this).remove()});
$(".salmon_rotation_cloned").css({"animation-fill-mode": "none"}).fadeOut(500, function(){$(this).remove()});
[endscript]
[wait time=800]
[iscript]
$(".button_cover").remove();
[endscript]
[jump cond="!tf.end2" target=Panel_3_Eval_Weapon]
[call target=Panel_3]
[s]

*Panel_3_Eval_Weapon
[cm]
[iscript]
weaponRater.make([
	parseInt(evalData.w1),
	parseInt(evalData.w2),
	parseInt(evalData.w3),
	parseInt(evalData.w4)
]);
$(".layer_free").show(0);
[endscript]
[s]

;=======================================
*Panel_4
[eval exp="sf.panel = 4"]
[call target=*Panel_Reset]
[iscript]
if (! tf.credit) tf.credit = "Panel_4_1";
tf.x = 40;
tf.y = 200;
$(".panel").removeClass("panel_now");
$(".panel_4").addClass("panel_now");
[endscript]
[jump target=&tf.credit]

*Panel_4_1
[html name=credit_wrapper]
<div class="credit about">
	<p>「SALMON LEARN -サーモンラーン-」は、<br>Nintendo Switch用のゲームソフト「Splatoon2」の<br>ゲームモード「サーモンラン」についての<br>情報を提供するWebアプリです。</p>
	<br>
	<p>間欠泉の開栓シミュレーション、<br>コウモリの誘導シミュレーション、<br>シフトの確認および予報のチェックを<br>することができます。</p>
	<br>
	<p>Ver.2.0.0</p>
</div>
[endhtml]
[glink text=作者と関連リンク x=060 width=200 y=730 size=24 color=credit_button target=Panel_4_Jump exp="tf.credit = 'Panel_4_2'"]
[glink text=クレジット       x=355 width=200 y=730 size=24 color=credit_button target=Panel_4_Jump exp="tf.credit = 'Panel_4_3'"]
[jump target=Panel_4_4]

*Panel_4_Jump
[call target=&tf.credit]
[eval exp="tf.credit = false"]
[s]

*Panel_4_2
[html name=credit_wrapper]
<div class="credit author">
	<h1>作者</h1>
	<br>
	<p>ガンジー (<a href="https://twitter.com/gungeespla">@GungeeSpla</a>)</p>
	<p>バグ報告などはTwitterまでお願いします。</p>
	<br>
	<h1>その他</h1>
	<br>
	<p><a href="javascript:void(0)" class="live2d">Live2Dのイカちゃんイラストを見る</a></p>
	<p>動作環境によっては、カクついたり、<br>真っ暗なまま表示されなったりします🙇</p>
	<br>
	<p><a href="http://amzn.asia/1OJG2pV">作者のWith List</a></p>
</div>
[endhtml]
[iscript]
$(".live2d").click(function(){
	f.target="Goto_Senpai";
	tyranoAPI.jump("", "Init");
});
[endscript]
[jump target=Panel_4_4]

*Panel_4_3
[html name=credit_wrapper]
<div class="credit">
	<h1>クレジット</h1>
	<h2>コウモリマップに関する知見の引用･参考</h2>
	<p>ザラメ (<a href="https://twitter.com/zarame2431">@zarame2431</a>)</p>
	<p>カトレア (<a href="https://twitter.com/ikatorea">@ikatorea</a>)</p>
	
	<h2>間欠泉の開栓手順に関する知見の引用･参考</h2>
	<p>いh7 (<a href="https://twitter.com/ultmis">@ultmis</a>)</p>
	<p>えむいー (<a href="https://twitter.com/tkgling">@tkgling</a>, <a href="https://tkgstrator.work/">https://tkgstrator.work/</a>)</p>
	<p><a href="https://splatoon-yoru.com/">https://splatoon-yoru.com/</a></p>
	
	<h2>サーモンランのシフト取得API</h2>
	<p>ウラル (<a href="https://twitter.com/barley_ural">@barley_ural</a>, <a href="https://splamp.info/">https://splamp.info/</a>)</p>
	
	<h2>その他画像や情報の引用など</h2>
	<p><a href="https://wikiwiki.jp/splatoon2mix/">https://wikiwiki.jp/splatoon2mix/</a></p>
	<p><a href="https://splatoonwiki.org/wiki/">https://splatoonwiki.org/wiki/</a></p>
</div>
[endhtml]
[jump target=Panel_4_4]

/*
[ptext layer=0 text=引用･参考･協力 bold=bold                     size=40 x=0   y=200 width=640 align=center]
[ptext layer=0 text=ザラメ&nbsp;(@zarame2431)                    size=20 x=160 y=270]
[ptext layer=0 text=カトレア&nbsp;(@ikatorea)                    size=20 x=160 y=300]
[ptext layer=0 text=いh7&nbsp;(@ultmis)                          size=20 x=160 y=330]
[ptext layer=0 text=えむいー&nbsp;(@tkgling)                     size=20 x=160 y=360]
[ptext layer=0 text=https://splatoon-yoru.com/                   size=20 x=160 y=410]
[ptext layer=0 text=https://wikiwiki.jp/splatoon2mix/            size=20 x=160 y=440]
[ptext layer=0 text=https://splatoonwiki.org/wiki/               size=20 x=160 y=470]
[ptext layer=0 text=https://splamp.info/                         size=20 x=160 y=500]
[ptext layer=0 text=制作 bold=bold                               size=40 x=0   y=560 width=640 align=center]
[ptext layer=0 text=ガンジー&nbsp;(@GungeeSpla)                  size=20 x=160 y=630]
;[glink text=作者のWish&nbsp;List x=240 y=873 size=18.6 color=black name=link target=Link]
;[iscript]
;$(".link").off("click").wrap('<a href="http://amzn.asia/1OJG2pV"></a>');
;[endscript]
[mylink link=https://twitter.com/GungeeSpla text=作者のTwitterへ x=155 y=666 size=19 color=black name=link target=Link]
[glink text=たわむれ x=155 y=716 size=19 color=black name=link target=Init exp="f.target='Goto_Senpai'"]
*/
*Panel_4_4
[return]











;=======================================
*OldTitle
;=======================================

[layopt layer=0 visible=true]
[layopt layer=1 visible=true]
[layopt layer=message0 visible=false]

[mask time=300]
[bg time=0 storage=red_bg.png]

[image layer=0 x=50 y=20 storage=goldie.png width=60]
[ptext layer=0 text=間欠泉 size=40 x=120 y=25 bold=bold]
[ptext layer=0 text=シェケナダム size=30 x=60 y=105]
[ptext layer=0 text=ドン･ブラコ  size=30 x=60 y=175]
[ptext layer=0 text=シャケト場   size=30 x=60 y=245]
[ptext layer=0 text=トキシラズ   size=30 x=60 y=315]
[ptext layer=0 text=ポラリス     size=30 x=60 y=385]
[glink text=通常 x=270 y=100 size=25 color=tsujo  target=Init exp="f.target='Define_Damu_Tsujo_Kanketsu'"]
[glink text=満潮 x=390 y=100 size=25 color=mancho target=Init exp="f.target='Define_Damu_Mancho_Kanketsu'"]
[glink text=通常 x=270 y=170 size=25 color=tsujo  target=Init exp="f.target='Define_Burako_Tsujo_Kanketsu'"]
[glink text=満潮 x=390 y=170 size=25 color=mancho target=Init exp="f.target='Define_Burako_Mancho_Kanketsu'"]
[glink text=通常 x=270 y=240 size=25 color=tsujo  target=Init exp="f.target='Define_Toba_Tsujo_Kanketsu'"]
[glink text=満潮 x=390 y=240 size=25 color=mancho target=Init exp="f.target='Define_Toba_Mancho_Kanketsu'"]
[glink text=通常 x=270 y=310 size=25 color=tsujo  target=Init exp="f.target='Define_Toki_Tsujo_Kanketsu'"]
[glink text=満潮 x=390 y=310 size=25 color=mancho target=Init exp="f.target='Define_Toki_Mancho_Kanketsu'"]
[glink text=通常 x=270 y=380 size=25 color=tsujo  target=Init exp="f.target='Define_Porarisu_Tsujo_Kanketsu'"]
[glink text=満潮 x=390 y=380 size=25 color=mancho target=Init exp="f.target='Define_Porarisu_Mancho_Kanketsu'"]

[glink text=THANKS x=500 y=30 size=20 color=blue target=Thanks]

[image layer=0 x=40 y=460 storage=komori.png width=90]
[ptext layer=0 text=コウモリマップ size=40 x=120 y=480 bold=bold]
[ptext layer=0 text=シェケナダム size=30 x=60 y=565]
[ptext layer=0 text=ドン･ブラコ  size=30 x=60 y=635]
[ptext layer=0 text=シャケト場   size=30 x=60 y=705]
[ptext layer=0 text=トキシラズ   size=30 x=60 y=775]
[ptext layer=0 text=ポラリス     size=30 x=60 y=845]
[glink text=通常 x=270 y=560 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Damu_Tsujo_Komori'"]
[glink text=干潮 x=390 y=560 size=25 color=kancho target=*InitKomori exp="f.target='Define_Damu_Kancho_Komori'"]
[glink text=通常 x=270 y=630 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Burako_Tsujo_Komori'"]
[glink text=干潮 x=390 y=630 size=25 color=kancho target=*InitKomori exp="f.target='Define_Burako_Kancho_Komori'"]
[glink text=通常 x=270 y=700 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Toba_Tsujo_Komori'"]
[glink text=干潮 x=390 y=700 size=25 color=kancho target=*InitKomori exp="f.target='Define_Toba_Kancho_Komori'"]
[glink text=通常 x=270 y=770 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Toki_Tsujo_Komori'"]
[glink text=干潮 x=390 y=770 size=25 color=kancho target=*InitKomori exp="f.target='Define_Toki_Kancho_Komori'"]
[glink text=通常 x=270 y=840 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Pora_Tsujo_Komori'"]
[glink text=干潮 x=390 y=840 size=25 color=kancho target=*InitKomori exp="f.target='Define_Pora_Kancho_Komori'"]

[iscript]
var s = location.search;
f.bool = (s.indexOf("test") > -1);
[endscript]
;[if exp=f.bool]
[glink text=？ x=555 y=902 size=25 color=myblack target=Init exp="f.target='Goto_Senpai'"]
;[endif]

[mask_off time=300]
[s]

*Goto_Eval

[mask time=300]
[clearfix]
[cm]
[bg storage=black.png time=0]
[freelayer layer=0]
[wait time=100]
[mask_off time=0]
[jump storage=eval.ks]
[s]

*Goto_Senpai

[mask time=300]
[clearfix]
[cm]
[bg storage=black.png time=0]
[freelayer layer=0]
[wait time=100]
[mask_off time=0]
[jump storage=scene.ks]
[s]


*Thanks

[cm]
[mask time=300]
[freelayer layer=0]
[ptext layer=0 text=THANKS bold=bold                             size=60 x=60 y=100]
[ptext layer=0 text=コウモリマップ bold=bold                     size=30 x=60 y=210]
[ptext layer=0 text=ザラメ(@zarame2431)                          size=20 x=60 y=260]
[ptext layer=0 text=カトレア(@ikatorea)                          size=20 x=60 y=290]

[ptext layer=0 text=間欠泉         bold=bold                     size=30 x=60 y=350]
[ptext layer=0 text=https://splatoon-yoru.com/                   size=20 x=60 y=400]
[ptext layer=0 text=いh7(@ultmis)                                size=20 x=60 y=430]
[ptext layer=0 text=えむいー(@tkgling)                           size=20 x=60 y=460]

[ptext layer=0 text=画像ソース               bold=bold           size=30 x=60 y=520]
[ptext layer=0 text=https://wikiwiki.jp/splatoon2mix/            size=20 x=60 y=570]
[ptext layer=0 text=https://splatoonwiki.org/wiki/               size=20 x=60 y=600]
[ptext layer=0 text=And&nbsp;You!                                size=20 x=60 y=670]

[glink text=もどる x=240 y=730 size=35 color=blue target=Retitle]
/*
[glink text=作者のWish&nbsp;List x=240 y=873 size=18.6 color=black name=link target=Link]
[iscript]
$(".link").off("click").wrap('<a href="http://amzn.asia/1OJG2pV"></a>');
[endscript]
*/
[glink text=作者のTwitter x=240 y=873 size=18.6 color=black name=link target=Link]
[iscript]
$(".link").off("click").wrap('<a href="https://twitter.com/GungeeSpla"></a>');
[endscript]
[mask_off time=300]
[s]

;=======================================
*InitKomori
;=======================================
[mask time=300]
[cm]
[clearfix]
[freelayer layer=0]
[freelayer layer=1]
[call target=&f.target]
[bg storage=&f.bg x=0 y=0 time=0]
;[image layer=0 zindex=1 x=0 y=0 storage=&f.suimyaku name=suimyaku]
[ptext layer=0 color=0x000000 text=イカやコウモリのアイコンをタップで動かせます。黒の矢印はコウモリがいったん攻撃態勢に入り雨弾を2回射出してからその方向へ飛ぶことを、青の矢印はコウモリが攻撃態勢に入らず速やかに飛んでくることを意味します。 size=20 x=40 y=10 width=570]
[foreach name=f.item array=f.kanketsusen]
[image layer=0 x=&f.item.x-f.radius-2 y=&f.item.y-f.radius-2 width=&f.radius*2 height=&f.radius*2 storage=komori_circle.png zindex=1 name="&'komori_circle,'+f.item.label"]
[image layer=0 x=&f.item.x-11 y=&f.item.y-11 storage=komori_parking.png zindex=2 name=park]
[ptext layer=0 x=&f.item.x-26 y=&f.item.y+5 edge=0x000000 text=&f.item.label size=24 name=park color=rgb(173,255,255) bold=bold align=center width=50]
[nextfor]
[iscript]
f.bakudanWidth = f.radius*2*0.74
f.kPos = getKomoriPos(f.komoriLabel);
[endscript]
[image layer=0 zindex=1 x=0 y=0 storage=&f.suimyaku name=suimyaku]
[image layer=1 zindex=200 x=250 y=400 storage=ika.png?2 width=&f.ikaDx*2 name=ika]
[image layer=1 zindex=200 x=80 y=80 storage=ika.png?2 width=&f.ikaDx*2 name=ika2]
[image layer=1 zindex=150 x=0 y=0 storage=bakudan_circle.png width=&f.bakudanWidth name=bakudan]
[image layer=1 zindex=100 x="&f.kPos.x-f.komoriDx" y="&f.kPos.y-f.komoriDy" storage=komori.png width=&f.komoriDx*2 name=komori]
[button fix=true graphic=tobasu.png  x=220 y=800 target=*KomoriTobasu name=fixbutton]
[button fix=true graphic=keiro.png   x=40  y=800 target=*Suimyaku     name=fixbutton]
[button fix=true graphic=modoru2.png x=440 y=800 target=*KomoriTitle  name=fixbutton]
[button fix=true graphic=bakudan.png x=40 y=880  target=*ToggleBakudan name=fixbutton]
[button fix=true graphic=komori.png  x=260 y=880 target=*ToggleKomori  name=fixbutton]
[button fix=true graphic=ika2.png  x=484 y=880   target=*ToggleIka     name=fixbutton]
[mask_off time=300]
;[call target=Set_Kotae]
;[jump target=Start]
[iscript]
$(".ika2").hide();
$(".bakudan").appendTo("#tyrano_base").draggable();
var timer;
$(".ika,.ika2").appendTo("#tyrano_base").draggable({
    drag: function (e) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            updateKomoriArrow();
        }, 32);
    }
});
$(".komori").appendTo("#tyrano_base").draggable({
    stop: function (e, ui) {
        var offset = ui.position;
        var minDis = 9999;
        var nextLabel;
        for (var i = 0; i < f.kanketsusen.length; i++) {
            var k = f.kanketsusen[i];
            var dis = calcDistance(offset.left, offset.top, k.x, k.y);
            if (dis < minDis) {
                minDis = dis;
                nextLabel = k.label;
            }
        }
        var nextPos = getKomoriPos(nextLabel);
        $(this).css({
            left: (nextPos.x - f.komoriDx) + "px",
            top: (nextPos.y - f.komoriDy) + "px",
        });
        f.komoriLabel = nextLabel;
        updateKomoriArrow();
        $(".komori_circle").hide();
        $(".komori_circle." + f.komoriLabel).show();
    }
});
$(".komori_circle." + f.komoriLabel).fadeIn(300);
window.updateKomoriArrow = function () {
    var dis = getDisIkaKomori(f.komoriLabel, "auto");
    var next = getKomoriNextLabel(f.komoriLabel);
    ctx.clearRect(0, 0, 640, 960);
    ctx.fillStyle = (dis < f.radius) ? "Black" : "Blue";
    ctx.fillArrowKomori(f.komoriLabel, next);
};
updateKomoriArrow();
[endscript]
[s]

*KomoriTobasu
[iscript]
var nextLabel = getKomoriNextLabel(f.komoriLabel);
var nextPos = getKomoriPos(nextLabel);
f.komoriLabel = nextLabel;
$(".komori").animate({
    left: (nextPos.x - f.komoriDx) + "px",
    top : (nextPos.y - f.komoriDy) + "px",
}, 600, "easeInOutQuad", function () {
    updateKomoriArrow();
    $(".komori_circle").hide();
    $(".komori_circle." + f.komoriLabel).show();
});

[endscript]
[return]

*KomoriTitle
[clearstack]
[iscript]
$(".ika").remove();
$(".ika2").remove();
$(".komori").remove();
$(".bakudan").remove();
ctx.clearRect(0, 0, 640, 960);
[endscript]
[jump target=*Retitle]

;=======================================
*Init
;=======================================
[mask time=300]
[cm]
[clearfix]
[freelayer layer=0]
[freelayer layer=1]
[call target=&f.target]
[bg storage=&f.bg x=0 y=0 time=0]
[image layer=0 zindex=1 x=0 y=0 storage=&f.suimyaku name=suimyaku]
[foreach name=f.item array=f.kanketsusen]
[image layer=0 x=&f.item.x-60 y=&f.item.y-130 storage=kanketsu_sen.png zindex=2]
[ptext layer=0 x=&f.item.x-25 y=&f.item.y+15 edge=0x000000 text=&f.item.label size=24 color=0x2AD600 bold=bold align=center width=50]
[nextfor]
[button fix=true graphic=suimyaku.png x=50  y=20 target=*Suimyaku name=fixbutton]
[button fix=true graphic=kotae.png    x=250 y=20 target=*Kotae    name=fixbutton]
[button fix=true graphic=joseki.png   x=450 y=20 target=*Joseki   name=fixbutton cond="f.josekidata.length > 0"]
[button fix=true graphic=modoru2.png   x=450 y=870 target=*Retitle   name=fixbutton]
[mask_off time=300]
[call target=Set_Kotae]
[jump target=Start]

;=======================================
*Set_Kotae
;=======================================
[iscript]
if (f.random) {
    var r = Math.floor(Math.random() * f.kanketsusen.length)
    f.answer = f.kanketsusen[r].label;
}
f.random = true;
[endscript]
[if exp="$('.kotae').size() == 0"]
[kotae_image k=&f.answer]
[else]
[kotae_image_move k=&f.answer]
[endif]
[return]

;=======================================
*Suimyaku
;=======================================
[iscript]
$(".suimyaku").fadeToggle(300);
[endscript]
[return]

;=======================================
*ToggleIka
;=======================================
[iscript]
$(".ika2").fadeToggle(300, function() {
    updateKomoriArrow();    
});
[endscript]
[return]

;=======================================
*ToggleBakudan
;=======================================
[iscript]
$(".bakudan").fadeToggle(300);
[endscript]
[return]

;=======================================
*ToggleKomori
;=======================================
[iscript]
var c = ".park,.canvas,.komori,.komori_circle." + f.komoriLabel;
$(c).fadeToggle(300);
[endscript]
[return]

;=======================================
*Kotae
;=======================================
[iscript]
$(".kotae").fadeToggle(300);
[endscript]
[return]

;=======================================
*Joseki
;=======================================

[clearstack]
[cm]
[glink text=定石なし                 x=60  y=300 width=450 target=Restart exp="f.random = false; f.joseki=''"]
[foreach name=f.item array=f.josekidata]
[glink text="&f.item[0]" x=60  y=&400+tf.index*100 width=450 target=Restart exp="&f.item[1]"]
[nextfor]
[s]

;=======================================
*BaMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "BaMK_Joseki_A"
[endscript]

[k_button  k=C target=*BaMK_Joseki_A_1]
[yajirushi k=C]
[s]

*BaMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=B]
    [k_button       k=B target=*BaMK_Joseki_A_2]
[else]
    [yajirushi_move k=H]
    [k_button       k=H target=*BaMK_Joseki_A_3]
[endif]
[s]

*BaMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaMK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

;=======================================
*BaTK_Joseki_B
;=======================================
[cm]
[iscript]
f.joseki = "BaTK_Joseki_B"
[endscript]

[k_button  k=H target=*BaTK_Joseki_B_1]
[yajirushi k=H]
[s]

*BaTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('H', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*BaTK_Joseki_B_2]
[else]
	[ptext layer=1 color=0x000000 text=※奥は後回しにするほうが手数的には最短 name=hosoku size=20 x=50 y=110 width=570]
    [yajirushi_move k=D]
    [k_button       k=D target=*BaTK_Joseki_B_4]
[endif]
[s]

*BaTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('G', f.answer)"]
    [yajirushi_move k=I]
    [k_button       k=I target=*Kakutei]
[else]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_B_3]
[endif]
[s]

*BaTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*BaTK_Joseki_B_5]
[s]

*BaTK_Joseki_B_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*BaTK_Joseki_B_6]
[s]

*BaTK_Joseki_B_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

;=======================================
*BaTK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "BaTK_Joseki_A"
[endscript]

[k_button  k=A target=*BaTK_Joseki_A_1]
[yajirushi k=A]
[s]

*BaTK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('A', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=*BaTK_Joseki_A_2]
[else]
    [yajirushi_move k=D]
    [k_button       k=D target=*BaTK_Joseki_A_3]
[endif]
[s]

*BaTK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

*BaTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('D', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_A_4]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*BaTK_Joseki_A_5]
[endif]
[s]

*BaTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaTK_Joseki_A_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=H]
[k_button       k=H target=*BaTK_Joseki_A_6]
[s]

*BaTK_Joseki_A_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

;=======================================
*SheTK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "SheTK_Joseki_A"
[endscript]

[k_button  k=E target=*SheTK_Joseki_A_1]
[yajirushi k=E]
[s]

*SheTK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('E', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*SheTK_Joseki_A_2]
[else]
    [yajirushi_move k=H]
    [k_button       k=H target=*SheTK_Joseki_A_4]
[endif]
[s]

*SheTK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*SheTK_Joseki_A_3]
[s]

*SheTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*Kakutei]
[s]

*SheTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('H', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*SheTK_Joseki_A_5]
[else]
    [yajirushi_move k=I]
    [k_button       k=I target=*SheTK_Joseki_A_6]
[endif]
[s]

*SheTK_Joseki_A_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*Kakutei]
[s]

*SheTK_Joseki_A_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

;=======================================
*SheTK_Joseki_B
;=======================================
[cm]
[iscript]
f.joseki = "SheTK_Joseki_B"
[endscript]

[k_button  k=F target=*SheTK_Joseki_B_1]
[yajirushi k=F]
[s]

*SheTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('F', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*SheTK_Joseki_B_2]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*SheTK_Joseki_B_4]
[endif]
[s]

*SheTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*SheTK_Joseki_B_3]
[s]

*SheTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*Kakutei]
[s]

*SheTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('G', f.answer)"]
    [yajirushi_move k=H]
    [k_button       k=H target=*SheTK_Joseki_B_5]
[else]
    [yajirushi_move k=I]
    [k_button       k=I target=*Kakutei]
[endif]
[s]

*SheTK_Joseki_B_5
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('H', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
[endif]
[s]


;=======================================
*BaTK_Joseki_C
;=======================================
[cm]
[iscript]
f.joseki = "BaTK_Joseki_C"
[endscript]

[k_button  k=D target=*BaTK_Joseki_C_1]
[yajirushi k=D]
[s]

*BaTK_Joseki_C_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('D', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_C_2]
[else]
    [yajirushi_move k=H]
    [k_button       k=H target=*BaTK_Joseki_C_4]
[endif]
[s]

*BaTK_Joseki_C_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=E]
[k_button       k=E target=*Kakutei]
[s]

*BaTK_Joseki_C_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('H', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*BaTK_Joseki_C_5]
[else]
    [yajirushi_move k=A]
    [k_button       k=A target=*BaTK_Joseki_C_6]
[endif]
[s]

*BaTK_Joseki_C_5
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

*BaTK_Joseki_C_6
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*BaTK_Joseki_C_7]
[s]

*BaTK_Joseki_C_7
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]


;=======================================
*SheMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "SheMK_Joseki_A"
[endscript]

[k_button  k=F target=*SheMK_Joseki_A_1]
[yajirushi k=F]
[s]

*SheMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('F', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=*Kakutei]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*SheMK_Joseki_A_2]
[endif]
[s]

*SheMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*SheMK_Joseki_A_3]
[s]

*SheMK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]


;=======================================
*BuTK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "BuTK_Joseki_A"
[endscript]

[k_button  k=B target=*BuTK_Joseki_A_1a]
[yajirushi k=B]
[k_button  k=C target=*BuTK_Joseki_A_1b]
[yajirushi k=C]
[s]

;B開け
*BuTK_Joseki_A_1a
[free layer=1 name=B]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=C target=*BuTK_Joseki_A_2]
[s]

;C開け
*BuTK_Joseki_A_1b
[free layer=1 name=C]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=B target=*BuTK_Joseki_A_2]
[s]

;どっちも開けた
*BuTK_Joseki_A_2
[iscript]
f.B = isBrother('B', f.answer);
f.C = isBrother('C', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
;B大C小
[if    exp="f.B && !f.C"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
;B大C大
[elsif exp="f.B && f.C"]
    [yajirushi_move k=D]
    [k_button       k=D target=*BuTK_Joseki_A_3]
;B小C大
[elsif exp="!f.B && f.C"]
    [yajirushi_move k=F]
    [k_button       k=F target=*Kakutei]
;B小C小
[elsif exp="!f.B && !f.C"]
    [yajirushi_move k=G]
    [k_button       k=G target=*BuTK_Joseki_A_4]
[endif]
[s]

*BuTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=A]
[k_button       k=A target=*Kakutei]
[s]

*BuTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=H]
[k_button       k=H target=*Kakutei]
[s]

;=======================================
*BuMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "BuMK_Joseki_A"
[endscript]

[k_button  k=H target=*BuMK_Joseki_A_1]
[yajirushi k=H]
[s]

*BuMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('H', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BuMK_Joseki_A_2]
[else]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

*BuMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*Kakutei]
[s]

;=======================================
*PoMK_Joseki_A
;=======================================
[cm]
[iscript]
f.joseki = "PoMK_Joseki_A"
[endscript]

[k_button  k=E target=*PoMK_Joseki_A_1]
[yajirushi k=E]
[s]

*PoMK_Joseki_A_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('E', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=*PoMK_Joseki_A_2]
[endif]
[s]

*PoMK_Joseki_A_2
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*Kakutei]
[s]

;=======================================
*PoTK_Joseki_B
;=======================================

[cm]
[iscript]
f.joseki = "PoTK_Joseki_B"
[endscript]

[k_button  k=F target=*PoTK_Joseki_B_1]
[yajirushi k=F]
[s]

*PoTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('F', f.answer)"]
    [yajirushi_move k=G]
    [k_button       k=G target=*PoTK_Joseki_B_3]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=*PoTK_Joseki_B_2]
[endif]
[s]

*PoTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('B', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[else]
[endif]
[s]

*PoTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('G', f.answer)"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
[else]
    [yajirushi_move k=C]
    [k_button       k=C target=*PoTK_Joseki_B_4]
[endif]
[s]

*PoTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*Kakutei]
[else]
[endif]
[s]

;=======================================
*ToTK_Joseki_B
;=======================================

[cm]
[iscript]
f.joseki = "ToTK_Joseki_B"
[endscript]

[k_button  k=F target=*ToTK_Joseki_B_1]
[yajirushi k=F]
[s]

*ToTK_Joseki_B_1
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('F', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*ToTK_Joseki_B_2]
[else]
    [yajirushi_move k=E]
    [k_button       k=E target=*ToTK_Joseki_B_3]
[endif]
[s]

*ToTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('D', f.answer)"]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*Kakutei]
[endif]
[s]

*ToTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('E', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=*Kakutei]
[else]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

;=======================================
*ToTK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "ToTK_Joseki_A"
[endscript]

[k_button  k=F target=*ToTK_Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=*ToTK_Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*ToTK_Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=G target=*ToTK_Joseki_A_2]
[s]

;G開け
*ToTK_Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=F target=*ToTK_Joseki_A_2]
[s]

;どっちも開けた
*ToTK_Joseki_A_2
[iscript]
f.F = isBrother('F', f.answer);
f.G = isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
;F大G小
[if    exp="f.F && !f.G"]
    [yajirushi_move k=D]
    [k_button       k=D target=*ToTK_Joseki_A_3]
;F大G大
[elsif exp="f.F && f.G"]
;F小G大
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=E]
    [k_button       k=E target=*ToTK_Joseki_A_4]
;F小G小
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

*ToTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=B]
[k_button       k=B target=*Kakutei]
[s]

*ToTK_Joseki_A_4
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=C]
[k_button       k=C target=*Kakutei]
[s]

;=======================================
*ToMK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "ToMK_Joseki_A"
[endscript]

[k_button  k=F target=*ToMK_Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=*ToMK_Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*ToMK_Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=G target=*ToMK_Joseki_A_2]
[s]

;G開け
*ToMK_Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=F target=*ToMK_Joseki_A_2]
[s]

;どっちも開けた
*ToMK_Joseki_A_2
[iscript]
f.F = isBrother('F', f.answer);
f.G = isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
;F大G小
[if    exp="f.F && !f.G"]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
;F大G大
[elsif exp="f.F && f.G"]
;F小G大
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=C]
    [k_button       k=C target=*Kakutei]
;F小G小
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[endif]
[s]

;=======================================
*PoTK_Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "PoTK_Joseki_A"
[endscript]

[k_button  k=F target=*PoTK_Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=*PoTK_Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*PoTK_Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=G target=*PoTK_Joseki_A_2]
[s]

;G開け
*PoTK_Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=*Atari][cm]
[k_button  k=F target=*PoTK_Joseki_A_2]
[s]

;どっちも開けた
*PoTK_Joseki_A_2
[iscript]
f.F = isBrother('F', f.answer);
f.G = isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=*Atari][cm]
[if    exp="f.F && !f.G"]
    [yajirushi_move k=C]
    [k_button       k=C target=*PoTK_Joseki_A_3]
[elsif exp="f.F && f.G"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=*Kakutei]
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=B]
    [k_button       k=B target=*Kakutei]
[endif]
[s]

*PoTK_Joseki_A_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=*Kakutei]
[s]

*Kakutei
[k_check][jump target=*Atari]
[s]

;=======================================
*Start
;=======================================
;ボタン設置
[iscript]
f.joseki = ""
[endscript]
[foreach name=f.item array=f.kanketsusen]
[button graphic=toumei.png width=80 height=80 x=&f.item.x-40 y=&f.item.y-40 preexp=f.item.label exp="f.choice=preexp" target=*Check]
[nextfor]
[s]

;=======================================
*Check
;=======================================
[k_check]
[jump cond=f.atari target=*Atari]
[s]

;=======================================
*Atari
;=======================================
[cm]
[free layer=1 name=hosoku]
[free layer=1 name=yajirushi]
[iscript]
$(".fixbutton").hide();
[endscript]
[image layer=1 storage=atari.png x=0 y=0]

[glink text=もう1回               x=60  size=28 y=740 width=450 target=Restart]
[glink text=答えを指定してもう1回 x=60  size=28 y=815 width=450 target=RestartB]
[glink text=もどる                x=60  size=28 y=890 width=450 target=Retitle]
[s]

;=======================================
*Restart
;=======================================
[cm]
[iscript]
$(".fixbutton").show();
[endscript]
[freelayer layer=1]
[call target=Set_Kotae]
[jump target=Start cond="!f.joseki"]
[jump target=&f.joseki]
[s]

;=======================================
*RestartB
;=======================================

[cm]
[freelayer layer=1]
[foreach name=f.item array=f.kanketsusen]
[button graphic=toumei.png width=80 height=80 x=&f.item.x-40 y=&f.item.y-40 preexp=f.item.label exp="f.random = false; f.answer = preexp" target=RestartB2]
[nextfor]
[s]
*RestartB2
[iscript]
$(".fixbutton").show();
[endscript]
[call target=Set_Kotae]
[jump target=Start cond="!f.joseki"]
[jump target=&f.joseki]
[s]

;=======================================
*Retitle
;=======================================
[cm]
[clearfix]
[clearstack]
[mask time=300]
[bg time=0 storage=black.png]
[freelayer layer=0]
[freelayer layer=1]
[iscript]
$("canvas")[0].getContext("2d").clearRect(0, 0, 640, 960);
[endscript]
[mask_off time=200]
[jump target=Title]
[s]

;=======================================
*Define
;=======================================

[macro name=mylink]
[glink *]
[iscript]
$("."+mp.name).off("click").wrap('<a href="'+mp.link+'"></a>');
[endscript]
[endmacro]

[iscript]
f.ikaDx = 40;
f.ikaDy = 40;
f.komoriDx = 30;
f.komoriDy = 35;
f.bg = "black.png";
[endscript]
[iscript]
(function(target) {
  if (!target || !target.prototype)
    return;
  target.prototype.arrow = function(startX, startY, endX, endY, controlPoints) {
    var dx = endX - startX;
    var dy = endY - startY;
    var len = Math.sqrt(dx * dx + dy * dy);
    var sin = dy / len;
    var cos = dx / len;
    var a = [];
    a.push(0, 0);
    for (var i = 0; i < controlPoints.length; i += 2) {
      var x = controlPoints[i];
      var y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (var i = controlPoints.length; i > 0; i -= 2) {
      var x = controlPoints[i - 2];
      var y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (var i = 0; i < a.length; i += 2) {
      var x = a[i] * cos - a[i + 1] * sin + startX;
      var y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) this.moveTo(x, y);
      else this.lineTo(x, y);
    }
  };
})(CanvasRenderingContext2D);
var $canvas = $("<canvas width='640' height='960' style='position: absolute; z-index: 10;' class='canvas'></canvas>");
var $root = $("#root_layer_game");
$root.append($canvas);
window.canvas = $canvas[0];
window.ctx = canvas.getContext("2d");
ctx.fillArrow = function (x1, y1, x2, y2) {
    if (typeof x1 !== "number") {
        y2 = y1.y;
        x2 = y1.x;
        y1 = x1.y;
        x1 = x1.x;
    }
    ctx.beginPath();
    ctx.arrow(x1, y1, x2, y2, [0, 3, -20, 3, -20, 11]);
    ctx.fill();
};
ctx.fillArrowKomori = function (a, b) {
    var aData = getKanketsusen(a);
    var bData = getKanketsusen(b);
    ctx.fillArrow(aData, bData);
};
window.calcDistance = function (x1, y1, x2, y2) {
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
window.getIkaPos = function (num) {
    if (!num) num = "";
    else num = "" + num;
    var $ika = $(".ika" + num);
    var x = parseInt($ika.css("left")) + f.ikaDx;
    var y = parseInt($ika.css("top")) + f.ikaDy;
    return {
        x: x,
        y: y
    };
};
window.getKomoriPos = function (label) {
    var data = getKanketsusen(label);
    return {
        x: data.x,
        y: data.y
    };
};
window.getDisIkaKomori = function (label, opt) {
    var iPos;
    if (opt === "auto") {
        if ($(".ika2").css("display") == "block" && getDisIkaKomori(label) > getDisIkaKomori(label, 2)) {
            iPos = getIkaPos(2)
        }
        else {
            iPos = getIkaPos()
        }
    }
    else {
        iPos = getIkaPos(opt);
    }
    var kPos = getKomoriPos(label);
    return calcDistance(iPos, kPos);
};
window.getKomoriNextLabel = function (label) {
    var iPos;
    if ($(".ika2").css("display") == "block" && getDisIkaKomori(label) > getDisIkaKomori(label, 2)) {
        iPos = getIkaPos(2)
    }
    else {
        iPos = getIkaPos()
    }
    var data = getKanketsusen(label);
    var minDis = 9999;
    var nextLabel;
    for (var i = 0; i < data.brothers.length; i++) {
        var k = data.brothers[i];
        var kPos = getKomoriPos(k);
        var dis = calcDistance(iPos, kPos);
        if (dis < minDis) {
            minDis = dis;
            nextLabel = k;
        }
    }
    return nextLabel;
}
[endscript]
[iscript]
window.Kanketsusen = function (label, x, y, brothers) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.brothers = brothers;
};
window.getKanketsusen = function (label) {
    var ret;
    var arr = TYRANO.kag.stat.f.kanketsusen;
    for (var i = 0; i < arr.length; i++) {
        ret = arr[i];
        if (ret.label == label) {
            break;
        }
    }
    return ret;
};
window.isBrother = function (A, B) {
    if (typeof A == "string") A = getKanketsusen(A);
    if (typeof B == "string") B = getKanketsusen(B);
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
f.target = "Define_Porarisu_Tsujo_Kanketsu";
f.random = true;
f.joseki = ""
f.choice = "";
f.answer = "";
[endscript]

[keyframe name=float]
[frame p=0% y=0]
[frame p=100% y=-8]
[endkeyframe]

[macro name=k_check]
[iscript]
var Q = getKanketsusen(f.choice);
var A = getKanketsusen(f.answer);
var bool1 = (Q.label == A.label);
var bool2 = isBrother(Q, A);
if (bool1) {
    f.atari = true;
    f.zindex = 10;
    f.storage = "kanketsu_atari.png";
}
else if (bool2) {
    f.atari = false;
    f.zindex = 1;
    f.storage = "kanketsu_dai.png";
}
else {
    f.atari = false;
    f.zindex = 1;
    f.storage = "kanketsu_shou.png";
}
f.item = Q;
[endscript]
[image layer=1 x=&f.item.x-60 y=&f.item.y-130 storage=&f.storage zindex=&f.zindex]
[endmacro]

[macro name=k_button]
[iscript]
var a = getKanketsusen(mp.k);
f.x = a.x - 40;
f.y = a.y - 40;
f.preexp = a.label;
[endscript]
[button graphic=toumei.png width=80 height=80 x=&f.x y=&f.y preexp=f.preexp exp="f.choice=preexp" target=%target]
[endmacro]

[macro name=kotae_image]
[iscript]
var a = getKanketsusen(mp.k);
f.x = a.x - 40;
f.y = a.y - 40;
[endscript]
[image layer=0 zindex=1 storage=kotae.png x=&f.x y=&f.y name=kotae]
[endmacro]

[macro name=kotae_image_move]
[iscript]
var a = getKanketsusen(mp.k);
f.x = a.x - 40;
f.y = a.y - 40;
[endscript]
[anim layer=0 left=&f.x top=&f.y name=kotae time=0]
[endmacro]

[macro name=yajirushi]
[iscript]
var a = getKanketsusen(mp.k);
f.x = a.x + 20;
f.y = a.y - 70;
f.name = "yajirushi," + mp.k;
[endscript]
[image layer=1 name=&f.name x=&f.x y=&f.y storage=yajirushi.png]
[kanim name=yajirushi keyframe=float time=1000 count=infinite easing=ease-in-out direction=alternate]
[endmacro]

[macro name=yajirushi_move]
[iscript]
var a = getKanketsusen(mp.k);
f.x = a.x + 20;
f.y = a.y - 70;
[endscript]
[anim name=yajirushi left=&f.x top=&f.y time=600 effect=easeInOutQuad]
[endmacro]
[return]

;=======================================
*Define_Pora_Kancho_Komori
;=======================================
[iscript]
f.radius = 189;
f.komoriLabel = "H";
f.suimyaku = "pora_komorikeiro_k.png";
f.bg = "../fgimage/pora_komori_k.png";
f.kanketsusen = [
    new Kanketsusen("A", 276, 422, ["B", "C", "I", "K"]),
    new Kanketsusen("B", 412, 420, ["A", "G", "C", "E"]),
    new Kanketsusen("C", 339, 533, ["A", "B", "L", "D", "E"]),
    new Kanketsusen("D", 448, 591, ["C", "E"]),
    new Kanketsusen("E", 580, 521, ["C", "D", "F", "B"]),
    new Kanketsusen("F", 577, 411, ["E", "G"]),
    new Kanketsusen("G", 524, 228, ["F", "H", "B"]),
    new Kanketsusen("H", 438, 201, ["G", "I"]),
    new Kanketsusen("I", 251, 223, ["H", "A", "J"]),
    new Kanketsusen("J", 124, 312, ["I", "K"]),
    new Kanketsusen("K",  95, 470, ["J", "L", "A"]),
    new Kanketsusen("L", 222, 609, ["K", "C"])
];
[endscript]
[return]

;=======================================
*Define_Pora_Tsujo_Komori
;=======================================
[iscript]
f.radius = 212;
f.komoriLabel = "T";
f.suimyaku = "pora_komorikeiro.png";
f.bg = "../fgimage/pora_komori.png";
f.kanketsusen = [
    new Kanketsusen("A", 272, 471, ["O", "H", "C"]),
    new Kanketsusen("B", 157, 514, ["C", "G", "K"]),
    new Kanketsusen("C", 220, 408, ["A", "B", "D", "Q"]),
    new Kanketsusen("D", 243, 323, ["C", "E", "T"]),
    new Kanketsusen("E", 186, 268, ["D", "F"]),
    new Kanketsusen("F",  52, 260, ["E", "G"]),
    new Kanketsusen("G",  52, 410, ["B", "F"]),
    new Kanketsusen("H", 236, 557, ["A", "I"]),
    new Kanketsusen("I", 285, 596, ["H", "O", "L", "J"]),
    new Kanketsusen("J", 218, 689, ["K", "I"]),
    new Kanketsusen("K",  89, 540, ["B", "J"]),
    new Kanketsusen("L", 444, 594, ["O", "M", "I"]),
    new Kanketsusen("M", 579, 603, ["N", "L"]),
    new Kanketsusen("N", 579, 462, ["P", "M"]),
    new Kanketsusen("O", 452, 538, ["P", "L", "I", "A"]),
    new Kanketsusen("P", 447, 420, ["O", "Q", "R", "N"]),
    new Kanketsusen("Q", 397, 378, ["C", "P"]),
    new Kanketsusen("R", 522, 320, ["P", "S"]),
    new Kanketsusen("S", 494, 198, ["R", "T"]),
    new Kanketsusen("T", 370, 195, ["D", "S"])
];
[endscript]
[return]

;=======================================
*Define_Toki_Kancho_Komori
;=======================================
[iscript]
f.radius = 250;
f.komoriLabel = "G";
f.suimyaku = "toki_komorikeiro_k.png";
f.bg = "../fgimage/toki_komori_k.png";
f.kanketsusen = [
    new Kanketsusen("A", 316, 554, ["B", "N"]),
    new Kanketsusen("B", 449, 503, ["A", "C", "D", "E"]),
    new Kanketsusen("C", 464, 677, ["O", "B"]),
    new Kanketsusen("D", 466, 364, ["B", "E", "F"]),
    new Kanketsusen("E", 580, 420, ["B", "D", "F"]),
    new Kanketsusen("F", 524, 259, ["D", "E", "G"]),
    new Kanketsusen("G", 428, 220, ["F", "H"]),
    new Kanketsusen("H", 232, 218, ["G", "I"]),
    new Kanketsusen("I", 146, 259, ["H", "J", "K"]),
    new Kanketsusen("J",  52, 298, ["I", "K"]),
    new Kanketsusen("K", 116, 377, ["I", "J", "N", "L"]),
    new Kanketsusen("L",  44, 508, ["M", "K"]),
    new Kanketsusen("M", 164, 522, ["L", "N", "O"]),
    new Kanketsusen("N", 214, 435, ["K", "M", "A"]),
    new Kanketsusen("O", 251, 677, ["M", "C"])
];
[endscript]
[return]

;=======================================
*Define_Toki_Tsujo_Komori
;=======================================
[iscript]
f.radius = 250;
f.komoriLabel = "J";
f.suimyaku = "toki_komorikeiro.png";
f.bg = "../fgimage/toki_komori.png";
f.kanketsusen = [
    new Kanketsusen("A", 359, 518, ["B", "M"]),
    new Kanketsusen("B", 234, 602, ["A", "C", "D"]),
    new Kanketsusen("C", 203, 725, ["B"]),
    new Kanketsusen("D", 209, 479, ["B", "E", "G"]),
    new Kanketsusen("E", 136, 427, ["D", "F"]),
    new Kanketsusen("F", 184, 254, ["E", "G"]),
    new Kanketsusen("G", 278, 279, ["F", "D", "H"]),
    new Kanketsusen("H", 351, 240, ["I", "G"]),
    new Kanketsusen("I", 423, 257, ["H", "J"]),
    new Kanketsusen("J", 490, 312, ["I", "K", "M"]),
    new Kanketsusen("K", 555, 371, ["J", "L"]),
    new Kanketsusen("L", 560, 469, ["K", "M"]),
    new Kanketsusen("M", 457, 533, ["J", "L", "N", "A"]),
    new Kanketsusen("N", 508, 673, ["M"])
];
[endscript]
[return]

;=======================================
*Define_Toba_Kancho_Komori
;=======================================
[iscript]
f.radius = 237;
f.komoriLabel = "D";
f.suimyaku = "toba_komorikeiro_k.png";
f.bg = "../fgimage/toba_komori_k.png";
f.kanketsusen = [
    new Kanketsusen("A", 273, 479, ["B", "D", "H", "I", "J"]),
    new Kanketsusen("B", 186, 472, ["A", "J", "C", "D"]),
    new Kanketsusen("C", 101, 276, ["B", "D"]),
    new Kanketsusen("D", 262, 328, ["C", "E", "F", "H", "A", "B"]),
    new Kanketsusen("E", 258, 193, ["D"]),
    new Kanketsusen("F", 508, 255, ["D", "G"]),
    new Kanketsusen("G", 539, 380, ["F", "H"]),
    new Kanketsusen("H", 433, 479, ["G", "L", "I", "A", "D"]),
    new Kanketsusen("I", 345, 606, ["H", "L", "A", "K"]),
    new Kanketsusen("J", 217, 592, ["A", "K", "B"]),
    new Kanketsusen("K", 266, 623, ["I", "J"]),
    new Kanketsusen("L", 542, 602, ["H", "I"])
];
[endscript]
[return]

;=======================================
*Define_Toba_Tsujo_Komori
;=======================================
[iscript]
f.radius = 183;
f.komoriLabel = "H";
f.suimyaku = "toba_komorikeiro.png";
f.bg = "../fgimage/toba_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 423, 542, ["B", "R"]),
    new Kanketsusen("B", 370, 500, ["A", "C", "M"]),
    new Kanketsusen("C", 292, 563, ["B", "G"]),
    new Kanketsusen("D", 286, 694, ["E", "T"]),
    new Kanketsusen("E", 238, 677, ["D", "F", "G", "H"]),
    new Kanketsusen("F", 100, 743, ["E"]),
    new Kanketsusen("G", 201, 564, ["C", "E", "H", "J"]),
    new Kanketsusen("H",  38, 586, ["E", "G", "I"]),
    new Kanketsusen("I",  88, 470, ["H", "J"]),
    new Kanketsusen("J", 266, 439, ["G", "I", "K", "M"]),
    new Kanketsusen("K", 274, 291, ["J", "L", "N"]),
    new Kanketsusen("L", 340, 227, ["K", "N"]),
    new Kanketsusen("M", 381, 408, ["B", "J", "N", "O"]),
    new Kanketsusen("N", 438, 338, ["K", "L", "M", "O"]),
    new Kanketsusen("O", 498, 432, ["M", "N", "P", "Q", "R"]),
    new Kanketsusen("P", 627, 418, ["O"]),
    new Kanketsusen("Q", 587, 479, ["O", "R"]),
    new Kanketsusen("R", 479, 538, ["O", "Q", "A", "S", "T"]),
    new Kanketsusen("S", 573, 559, ["R", "T"]),
    new Kanketsusen("T", 495, 675, ["R", "S", "D"]),
];
[endscript]
[return]

;=======================================
*Define_Burako_Kancho_Komori
;=======================================
[iscript]
f.radius = 190;
f.komoriLabel = "C";
f.suimyaku = "burako_komorikeiro_k.png";
f.bg = "../fgimage/burako_komori_k.png";
f.kanketsusen = [
    new Kanketsusen("A", 177, 413, ["F", "I", "L", "B"]),
    new Kanketsusen("B",  70, 280, ["A", "C"]),
    new Kanketsusen("C",  98, 192, ["B", "D"]),
    new Kanketsusen("D", 193, 182, ["C", "E"]),
    new Kanketsusen("E", 323, 205, ["D", "F"]),
    new Kanketsusen("F", 356, 352, ["E", "G", "A"]),
    new Kanketsusen("G", 420, 418, ["H", "I", "K", "F"]),
    new Kanketsusen("H", 600, 386, ["G"]),
    new Kanketsusen("I", 456, 523, ["G"]),
    new Kanketsusen("J", 309, 509, ["K", "A"]),
    new Kanketsusen("K", 405, 509, ["G", "J"]),
    new Kanketsusen("L", 199, 509, ["A"])
];
[endscript]
[return]

;=======================================
*Define_Burako_Tsujo_Komori
;=======================================
[iscript]
f.radius = 205;
f.komoriLabel = "C";
f.suimyaku = "burako_komorikeiro.png";
f.bg = "../fgimage/burako_komori.png";
f.kanketsusen = [
    new Kanketsusen("A", 338, 718, ["B", "C"]),
    new Kanketsusen("B", 428, 584, ["A", "C", "D", "T"]),
    new Kanketsusen("C", 326, 497, ["A", "B", "D", "E", "J"]),
    new Kanketsusen("D", 418, 458, ["B", "C", "E", "F"]),
    new Kanketsusen("E", 351, 389, ["D", "C", "N", "G"]),
    new Kanketsusen("F", 442, 364, ["S", "D", "G", "H"]),
    new Kanketsusen("G", 393, 319, ["H", "F", "E", "N"]),
    new Kanketsusen("H", 511, 255, ["R", "F", "G", "Q"]),
    new Kanketsusen("I", 149, 635, ["J"]),
    new Kanketsusen("J", 232, 566, ["C", "I", "K", "L"]),
    new Kanketsusen("K", 101, 536, ["J"]),
    new Kanketsusen("L", 232, 360, ["N", "J", "M"]),
    new Kanketsusen("M", 108, 318, ["L"]),
    new Kanketsusen("N", 314, 283, ["G", "E", "L", "O", "P"]),
    new Kanketsusen("O", 276, 203, ["P", "N"]),
    new Kanketsusen("P", 358, 166, ["Q", "N", "O"]),
    new Kanketsusen("Q", 479, 163, ["R", "H", "P"]),
    new Kanketsusen("R", 551, 199, ["S", "H", "Q"]),
    new Kanketsusen("S", 557, 367, ["R", "T", "F"]),
    new Kanketsusen("T", 510, 518, ["S", "U", "B"]),
    new Kanketsusen("U", 589, 624, ["T", "V"]),
    new Kanketsusen("V", 564, 717, ["U"])
];
[endscript]
[return]

;=======================================
*Define_Damu_Kancho_Komori
;=======================================
[iscript]
f.radius = 229;
f.komoriLabel = "G";
f.suimyaku = "damu_komorikeiro_k.png";
f.bg = "../fgimage/damu_komori_k.png";
f.kanketsusen = [
    new Kanketsusen("A", 317, 356, ["B", "C", "D", "E", "F", "G"]),
    new Kanketsusen("B", 527, 274, ["C", "A"]),
    new Kanketsusen("C", 490, 443, ["A", "B", "D"]),
    new Kanketsusen("D", 309, 568, ["A", "C", "E", "H", "I"]),
    new Kanketsusen("E", 156, 472, ["A", "D", "F", "G"]),
    new Kanketsusen("F",  84, 297, ["A", "E"]),
    new Kanketsusen("G", 264, 237, ["A", "E"]),
    new Kanketsusen("H", 237, 655, ["D", "I"]),
    new Kanketsusen("I", 427, 716, ["D", "H"])
];
[endscript]
[return]

;=======================================
*Define_Damu_Tsujo_Komori
;=======================================
[iscript]
f.radius = 233;
f.komoriLabel = "C";
f.suimyaku = "damu_komorikeiro.png";
f.bg = "../fgimage/damu_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 279, 425, ["B", "D", "F", "I", "K"]),
    new Kanketsusen("B", 380, 248, ["A", "C", "D"]),
    new Kanketsusen("C", 533, 257, ["B", "D", "E"]),
    new Kanketsusen("D", 436, 458, ["A", "B", "C", "E", "F"]),
    new Kanketsusen("E", 564, 513, ["C", "D", "F"]),
    new Kanketsusen("F", 284, 605, ["A", "D", "E", "G", "I"]),
    new Kanketsusen("G", 212, 692, ["F", "H", "I"]),
    new Kanketsusen("H", 105, 670, ["G", "I"]),
    new Kanketsusen("I",  67, 479, ["A", "F", "G", "H", "J", "K"]),
    new Kanketsusen("J",  23, 392, ["I", "K", "L"]),
    new Kanketsusen("K", 133, 358, ["A", "I", "J", "L"]),
    new Kanketsusen("L",  41, 265, ["J", "K"])
];
[endscript]
[return]

;=======================================
*Define_Toki_Tsujo_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["とりあえず二つ開けるやつ", "f.random = false; f.joseki='ToTK_Joseki_A'"],
    ["Fから開ける最少手数のやつ", "f.random = false; f.joseki='ToTK_Joseki_B'"]
];
f.suimyaku = "toki_suimyaku.png";
f.bg = "../fgimage/toki_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 208, 666, ["B", "C", "D"]),
    new Kanketsusen("B", 194, 532, ["A", "C", "D", "F"]),
    new Kanketsusen("C", 447, 585, ["A", "B", "E", "G"]),
    new Kanketsusen("D",  75, 412, ["A", "B", "F"]),
    new Kanketsusen("E", 554, 532, ["C", "G"]),
    new Kanketsusen("F", 261, 212, ["B", "D", "G"]),
    new Kanketsusen("G", 488, 318, ["C", "E", "F"])
];
[endscript]
[return]

;=======================================
*Define_Toki_Mancho_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["とりあえず二つ開けるやつ", "f.random = false; f.joseki='ToMK_Joseki_A'"]
];
f.suimyaku = "toki_suimyaku_m.png";
f.bg = "../fgimage/toki_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 208, 666, ["B", "C", "D"]),
    new Kanketsusen("B", 194, 532, ["A", "C", "D", "F"]),
    new Kanketsusen("C", 447, 585, ["A", "B", "E", "G"]),
    new Kanketsusen("F", 261, 212, ["B", "D", "G"]),
    new Kanketsusen("G", 488, 318, ["C", "E", "F"])
];
[endscript]
[return]

;=======================================
*Define_Burako_Tsujo_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["とりあえず二つ開けるやつ", "f.random = false; f.joseki='BuTK_Joseki_A'"],
];
f.suimyaku = "burako_suimyaku.png";
f.bg = "../fgimage/burako_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 312, 728, ["B", "C", "D"]),
    new Kanketsusen("B", 143, 595, ["A", "C", "D", "E"]),
    new Kanketsusen("C", 433, 595, ["A", "B", "D", "F"]),
    new Kanketsusen("D", 313, 547, ["A", "B", "C", "E", "F", "H"]),
    new Kanketsusen("E", 143, 342, ["B", "D", "F", "G", "H"]),
    new Kanketsusen("F", 313, 342, ["C", "D", "E", "G", "H"]),
    new Kanketsusen("G", 276, 209, ["E", "F", "H"]),
    new Kanketsusen("H", 445, 294, ["D", "E", "F", "G"])
];
[endscript]
[return]

;=======================================
*Define_Burako_Mancho_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["Hから開けるやつ", "f.random = false; f.joseki='BuMK_Joseki_A'"],
];
f.suimyaku = "burako_suimyaku_m.png";
f.bg = "../fgimage/burako_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 312, 728, ["B", "C", "D"]),
    new Kanketsusen("D", 313, 547, ["A", "B", "C", "E", "F", "H"]),
    new Kanketsusen("F", 313, 342, ["C", "D", "E", "G", "H"]),
    new Kanketsusen("H", 445, 294, ["D", "E", "F", "G"])
];
[endscript]
[return]

;=======================================
*Define_Toba_Tsujo_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["桟橋から開けていくやつ",      "f.random = false; f.joseki='BaTK_Joseki_A'"],
    ["正面から開けていくやつ",      "f.random = false; f.joseki='BaTK_Joseki_C'"],
    ["右斜め前から開けていくやつ", "f.random = false; f.joseki='BaTK_Joseki_B'"]
];
f.suimyaku = "toba_suimyaku.png";
f.bg = "../fgimage/toba_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A",  41, 586, ["B", "C"]),
    new Kanketsusen("B", 223, 569, ["A", "C", "E"]),
    new Kanketsusen("C", 170, 499, ["A", "B", "E"]),
    new Kanketsusen("D", 334, 232, ["E", "F"]),
    new Kanketsusen("E", 334, 413, ["B", "C", "D", "F", "H", "I"]),
    new Kanketsusen("F", 386, 309, ["D", "E", "H"]),
    new Kanketsusen("G", 577, 559, ["H", "I"]),
    new Kanketsusen("H", 525, 447, ["E", "F", "G", "I"]),
    new Kanketsusen("I", 473, 560, ["E", "G", "H"])
];
[endscript]
[return]

;=======================================
*Define_Toba_Mancho_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["Cから開けるやつ", "f.random = false; f.joseki='BaMK_Joseki_A'"],
];
f.suimyaku = "toba_suimyaku_m.png";
f.bg = "../fgimage/toba_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("B", 223, 569, ["A", "C", "E"]),
    new Kanketsusen("C", 170, 499, ["A", "B", "E"]),
    new Kanketsusen("E", 334, 413, ["B", "C", "D", "F", "H", "I"]),
    new Kanketsusen("H", 525, 447, ["E", "F", "G", "I"]),
    new Kanketsusen("I", 473, 560, ["E", "G", "H"])
];
[endscript]
[return]

;=======================================
*Define_Damu_Tsujo_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["Eから開けるやつ", "f.random = false; f.joseki='SheTK_Joseki_A'"],
    ["Fから開けるやつ(早い)", "f.random = false; f.joseki='SheTK_Joseki_B'"]
];
f.suimyaku = "damu_suimyaku.png";
f.bg = "../fgimage/damu_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A",  55, 471, ["B", "D", "G", "H"]),
    new Kanketsusen("B", 133, 404, ["A", "C", "D", "G", "I"]),
    new Kanketsusen("C", 388, 350, ["B", "D", "E", "F", "G"]),
    new Kanketsusen("D", 332, 406, ["A", "B", "C", "E", "F", "G"]),
    new Kanketsusen("E", 576, 262, ["C", "D", "F"]),
    new Kanketsusen("F", 565, 516, ["C", "D", "E"]),
    new Kanketsusen("G", 279, 605, ["A", "B", "C", "D", "H"]),
    new Kanketsusen("H", 210, 693, ["A", "G"]),
    new Kanketsusen("I",  55, 238, ["B"])
];
[endscript]
[return]

;=======================================
*Define_Damu_Mancho_Kanketsu
;=======================================
[iscript]
f.suimyaku = "damu_suimyaku_m.png";
f.josekidata = [
    ["Fから開けるやつ", "f.random = false; f.joseki='SheMK_Joseki_A'"]
];
f.bg = "../fgimage/damu_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A",  55, 471, ["B", "D", "G", "H"]),
    new Kanketsusen("B", 133, 404, ["A", "C", "D", "G", "I"]),
    new Kanketsusen("C", 388, 350, ["B", "D", "E", "F", "G"]),
    new Kanketsusen("F", 565, 516, ["C", "D", "E"]),
    new Kanketsusen("G", 279, 605, ["A", "B", "C", "D", "H"])
];
[endscript]
[return]

;=======================================
*Define_Porarisu_Tsujo_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["とりあえず二つ開けるやつ", "f.random = false; f.joseki='PoTK_Joseki_A'"],
    ["Fから開けるやつ", "f.random = false; f.joseki='PoTK_Joseki_B'"]
];
f.suimyaku = "pora_suimyaku.png";
f.bg = "../fgimage/pora_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 385, 535, ["B", "C", "D", "E", "G"]),
    new Kanketsusen("B", 236, 618, ["A", "C", "D", "E"]),
    new Kanketsusen("C", 154, 535, ["A", "B", "D", "E", "F"]),
    new Kanketsusen("D", 154, 387, ["A", "B", "C", "E", "F"]),
    new Kanketsusen("E", 454, 428, ["A", "B", "C", "D", "F", "G"]),
    new Kanketsusen("F", 236, 225, ["C", "D", "E", "G"]),
    new Kanketsusen("G", 535, 360, ["A", "E", "F"])
];
[endscript]
[return]

;=======================================
*Define_Porarisu_Mancho_Kanketsu
;=======================================
[iscript]
f.josekidata = [
    ["Eから開けるやつ", "f.random = false; f.joseki='PoMK_Joseki_A'"],
];
f.suimyaku = "pora_suimyaku_m.png";
f.bg = "../fgimage/pora_kanketsu.png";
f.kanketsusen = [
    new Kanketsusen("A", 385, 535, ["B", "E"]),
    new Kanketsusen("B", 236, 618, ["A"]),
    new Kanketsusen("D", 154, 387, []),
    new Kanketsusen("E", 454, 428, ["A"]),
];
[endscript]
[return]