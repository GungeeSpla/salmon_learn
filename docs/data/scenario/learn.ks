;=======================================
;# 初期化
;=======================================

[clearstack]
[call target=Init_Preload]
[call target=Init_Iscript]
[call target=Init_Macro]
[jump target=Title]
[s]



;=======================================
*Init_Preload
;=======================================
[iscript]
f.preloadImages = [
	"data/bgimage/red_bg.png",
	"data/fgimage/logo.png",
	"data/fgimage/goldie.png",
	"data/fgimage/komori.png",
	"tyrano/images/rotation_bg.png",
	"data/image/panel_1a.png",
	"data/image/panel_2a.png",
	"data/image/panel_3a.png",
	"data/image/panel_4a.png",
	"data/image/panel_5a.png",
	"data/image/panel_6a.png",
	"data/image/panel_7a.png",
	"data/image/panel_8a.png",
	"data/image/panel_1ab.png",
	"data/image/panel_2ab.png",
	"data/image/panel_3ab.png",
	"data/image/panel_4ab.png",
	"data/image/panel_5ab.png",
	"data/image/panel_6ab.png",
	"data/image/panel_7ab.png",
	"data/image/panel_8ab.png"
];
[endscript]
[preload storage=&f.preloadImages wait=false]
[return]

;=======================================
*Init_Iscript
;=======================================
[iscript]
tf.reset_count = 0;
gusherApp.addCanvas();
f.ikaDx = 40;
f.ikaDy = 40;
f.komoriDx = 30;
f.komoriDy = 35;
f.bg = "black.png";
f.target = "Define_Porarisu_Tsujo_Kanketsu";
f.random = true;
f.joseki = ""
f.choice = "";
f.answer = "";
[endscript]
[return]



;=======================================
*Init_Macro
;=======================================
[macro name=mylink]
[glink *]
[iscript]
$("."+mp.name).off("click").wrap('<a href="'+mp.link+'"></a>');
[endscript]
[endmacro]

[keyframe name=float]
[frame p=0% y=0]
[frame p=100% y=-8]
[endkeyframe]

[macro name=k_check]
[iscript]
var Q = gusherApp.getKanketsusen(f.choice);
var A = gusherApp.getKanketsusen(f.answer);
var bool1 = (Q.label == A.label);
var bool2 = gusherApp.isBrother(Q, A);
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
var a = gusherApp.getKanketsusen(mp.k);
f.x = a.x - 40;
f.y = a.y - 40;
f.preexp = a.label;
[endscript]
[button graphic=toumei.png width=80 height=80 x=&f.x y=&f.y preexp=f.preexp exp="f.choice=preexp" target=%target]
[endmacro]

[macro name=kotae_image]
[iscript]
var a = gusherApp.getKanketsusen(mp.k);
f.x = a.x - 40;
f.y = a.y - 40;
[endscript]
[image layer=0 zindex=1 storage=kotae.png x=&f.x y=&f.y name=kotae]
[endmacro]

[macro name=kotae_image_move]
[iscript]
var a = gusherApp.getKanketsusen(mp.k);
f.x = a.x - 40;
f.y = a.y - 40;
[endscript]
[anim layer=0 left=&f.x top=&f.y name=kotae time=0]
[endmacro]

[macro name=yajirushi]
[iscript]
var a = gusherApp.getKanketsusen(mp.k);
f.x = a.x + 20;
f.y = a.y - 70;
f.name = "yajirushi," + mp.k;
[endscript]
[image layer=1 name=&f.name x=&f.x y=&f.y storage=yajirushi.png]
[kanim name=yajirushi keyframe=float time=1000 count=infinite easing=ease-in-out direction=alternate]
[endmacro]

[macro name=yajirushi_move]
[iscript]
var a = gusherApp.getKanketsusen(mp.k);
f.x = a.x + 20;
f.y = a.y - 70;
[endscript]
[anim name=yajirushi left=&f.x top=&f.y time=600 effect=easeInOutQuad]
[endmacro]
[return]



;=======================================
;# タイトル画面
;=======================================

;=======================================
*Title
;=======================================

; 最後に訪れたバージョンが未定義ならゼロにしておく
[iscript]
if (! sf.last_visit_version) sf.last_visit_version = 0;
[endscript]

; 最後に訪れたバージョンが20000(2.0.0)以下ならばロゴを見せる
; 20000以降のバージョンに訪れたことがあれば300ミリ秒のマスク
[if exp="sf.last_visit_version < 20000"]
	[preload wait=true storage=data/image/masking_image.png]
	[mask graphic=masking_image.png]
	[wait time=2000]
[else]
	[mask time=10]
[endif]

; レイヤー設定
[layopt layer=0 visible=true]
[layopt layer=1 visible=true]
[layopt layer=message0 visible=false]

; 背景とロゴ
[bg time=0 storage=red_bg.png]
[image layer=1 zindex=100 x=40 y=20 storage=logo.png width=550 name=logo]

[iscript]
// リセットはされている
tf.reseted = true;
// sf.panelが未定義ならばsf.panelは1
if (! sf.panel) sf.panel = 1;
// クエリパラメータを取得
if (getUrlQueries) tf.queries = getUrlQueries();
else tf.queries = {};
// クエリパラメータにpanelがあればそれをsf.panelに代入する
if (tf.queries.panel) sf.panel = parseInt(tf.queries.panel) || 1;
// 飛ぶべきラベルを決定
tf.panel = "*Panel_" + sf.panel;
// PCか？
tf.isPC    = ($.userenv() == "pc");
// スマホのPWAか？
tf.isPWA   = (tf.queries.utm_source == "homescreen");
// 最後に訪れたバージョンを保存しておく
tf.version = sf.last_visit_version;
[endscript]

; 固定ボタンを出す
[call target=Panel_Fix_Button]

; パネルラベルに飛んで画面を作る
[call target=&tf.panel]

; リセットはまだされていない
[eval exp="tf.reseted = false"]

; ここで画面が完成したのでマスクを外したいのだが
; Ver.2.0.0以降に訪れたことがない人にはゆっくりタイトル画面を見せよう
[if exp="sf.last_visit_version < 20000"]
	[mask_off time=1000]
[else]
	[mask_off time=300]
[endif]

; 最後に訪れたバージョンの保存
[eval exp="sf.last_visit_version = window.VERSION"]

; ダイアログがあれば出す
[call target="Dialog"]
[s]



;=======================================
*Dialog
;=======================================
[iscript]
var isRemodal = false;
// スマホのブラウザから見ていてVer.2.1.2以降を訪れたことがない人には
//「ホーム画面に追加」対応のアナウンスを出そう
if (! tf.isPWA && ! tf.isPC && tf.version < 20102) {
	isRemodal = true;
	var title = "スマホのブラウザ(Safari等)でご覧の方へ";
	var text = "Ver.2.1.0より「<b>ホーム画面に追加</b>」ができるようになりました！";
}
if (isRemodal) {
	var $modal = $(".remodal");
	$modal.find(".remodal_title").html(title);
	$modal.find(".remodal_txt").html(text);
	$modal.find(".remodal-cancel").hide(0);
	$modal.remodal().open();
}
[endscript]
[return]



;=======================================
;# パネル群
;=======================================

;=======================================
*Panel_Reset
;=======================================
[return cond="tf.reseted"]
[call target=Panel_Fix_Button]
[cm]
[freeimage layer=0 time=0]
[bg time=0 storage=red_bg.png]
[iscript]
tf.reset_count++;
stTimerApp.stopApp();
smCountApp.stopApp();
document.title = "サーモンラーン";
stTimerApp.specialStTitle = "";
[endscript]
[return]



;=======================================
*Panel_Fix_Button
;=======================================
[clearfix]
[button fix=true graphic=panel_1a.png   x=&128*0 y=840 width=&128 storage=learn.ks target=*Panel_1 cond="sf.panel != 1"]
[button fix=true graphic=panel_1ab.png  x=&128*0 y=840 width=&128 storage=learn.ks target=*Panel_1 cond="sf.panel == 1"]
[button fix=true graphic=panel_2a.png   x=&128*1 y=840 width=&128 storage=learn.ks target=*Panel_2 cond="sf.panel != 2"]
[button fix=true graphic=panel_2ab.png  x=&128*1 y=840 width=&128 storage=learn.ks target=*Panel_2 cond="sf.panel == 2"]
[button fix=true graphic=panel_3a.png   x=&128*2 y=840 width=&128 storage=learn.ks target=*Panel_3 cond="sf.panel != 3"]
[button fix=true graphic=panel_3ab.png  x=&128*2 y=840 width=&128 storage=learn.ks target=*Panel_3 cond="sf.panel == 3"]
[button fix=true graphic=panel_5a.png   x=&128*3 y=840 width=&128 storage=learn.ks target=*Panel_5 cond="sf.panel != 5"]
[button fix=true graphic=panel_5ab.png  x=&128*3 y=840 width=&128 storage=learn.ks target=*Panel_5 cond="sf.panel == 5"]
[button fix=true graphic=panel_7a.png   x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_7 cond="sf.panel != 7" name=fix_sonota_tab]
[button fix=true graphic=panel_4a.png   x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_4 cond="sf.panel != 4" name=fix_sonota_item]
[button fix=true graphic=panel_4ab.png  x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_4 cond="sf.panel == 4" name=fix_sonota_item]
[button fix=true graphic=panel_6a.png   x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_6 cond="sf.panel != 6" name=fix_sonota_item]
[button fix=true graphic=panel_6ab.png  x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_6 cond="sf.panel == 6" name=fix_sonota_item]
[button fix=true graphic=panel_10a.png   x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_10 cond="sf.panel != 10" name=fix_sonota_item]
[button fix=true graphic=panel_10ab.png  x=&128*4 y=840 width=&128 storage=learn.ks target=*Panel_10 cond="sf.panel == 10" name=fix_sonota_item]

[return]



;=======================================
*Panel_Reload
;=======================================
[iscript]
tf.target = "*Panel_" + sf.panel;
[endscript]
[call storage=learn.ks target=Panel_Fix_Button]
[call storage=learn.ks target=&tf.target]
[clearstack]
[s]



;=======================================
*Panel_7
;=======================================
[iscript]
var state = $(".fix_sonota_tab").attr("state");
var isOpening = (state == "opening");
if (isOpening) {
	$(".fix_sonota_tab").attr("src", "./data/image/panel_7a.png").attr("state", "closing");
	$(".fix_sonota_item").each(function(i){
		$(this).css("transform", "translateY(0px)");
	});
} else {
	$(".fix_sonota_tab").attr("src", "./data/image/panel_8a.png").attr("state", "opening");
	$(".fix_sonota_item").each(function(i){
		var y = -120 * (i + 1);
		$(this).css("transform", "translateY(" + y + "px)");
	});
}
[endscript]
[return]



;=======================================
*Panel_6
;=======================================
[eval exp="sf.panel = 6"]
[call target=*Panel_Reset]
[anim layer=1 name=logo opacity=0 time=0]
[iscript]
if (! sf.sm_count_step) sf.sm_count_step = 1;
[endscript]
[jump target=Panel_6_1 cond="sf.sm_count_step <= 1"]
[jump target=Panel_6_2 cond="sf.sm_count_step <= 2"]
[jump target=Panel_6_3 cond="sf.sm_count_step <= 3"]

;=======================================
*Panel_6_1
;=======================================
[anim layer=1 name=logo opacity=255 time=0]
[html name=html_space]
<div class="st_description">
	<h1>SMcountとは</h1>
	<b>SMcount</b>は，サーモンランにおいて、<br>
	シャケの湧いてくる方向が一定の時刻で切り替わることを<br>
	理解するための<b>アシスタントボイス</b>です。<br><br>
	<h1>使い方</h1>
	バイトが始まると、ステージの風景映像が流れて<br>
	（キケン度MAXの場合はここで特殊な演出が入ります）<br>
	ホワイトアウトしたあとアルバイターたちが飛んできますね。<br><br>
	そのアルバイターたちが<b>着地してチャポンと音が鳴るのと同時</b>に<br>
	SMcountの「<b>Start</b>」を押してみましょう。<br><br>
	すると、あとはバイトの時間経過に合わせて<br>
	Wave3の終了までSMcountがカウントを行ってくれます。<br><br>
</div>
[endhtml]
[glink text=次へ x=191 width=200 y=761 size=24 color=credit_button target=Panel_Reload exp="sf.sm_count_step = 2"]
[return]

;=======================================
*Panel_6_2
;=======================================
[anim layer=1 name=logo opacity=255 time=0]
[html name=html_space]
<div class="st_description">
	<h1>詳しい使い方</h1>
	シャケの湧いてくる方向が変わる時刻はノルマによって変わります。<br>
	それを判別するために<b>Wave1のノルマ</b>を見てください。<br><br>
	画面下側にあるノルマ設定について、<br>
	<div style="display: inline-block; width: 420px; text-align: left;">
	●Wave1のノルマが <b>11～16</b> ならば、<b>Low</b><br>
	●Wave1のノルマが <b>17～20</b> ならば、<b>Middle</b><br>
	●Wave1のノルマが <b>21　 　</b> ならば、<b>High</b><br>
	</div><br>
	を、選ぶようにしてください。<br><br>
	（キケン度MAXの演出があればHigh、<br>
	なければMiddleにすれば大体合うと思います）<br><br>
	Startボタンを押すタイミングが最適ではなかった、<br>
	処理落ちが発生したなどの理由で<b>カウントがズレた</b>場合、<br>
	カウンターの下にあるボタンで<b>微調整</b>を行ってください。<br><br>
	なお、タブが非アクティブだと、カウントがズレることがあります。<br>
[endhtml]
[glink text=OK! x=191 width=200 y=761 size=24 color=credit_button target=Panel_Reload exp="sf.sm_count_step = 3"]
[return]

;=======================================
*Panel_6_3
;=======================================
[anim layer=1 name=logo opacity=0 time=0]
[eval exp="sf.sm_count_step = 3"]
[html name=html_space]
	<div class="all_wrapper">
		<div class="smcount_button smcount_translate translate_right" style="display: none;" target="counter">→</div>
		<div class="smcount_button smcount_translate translate_left"  style="display: none;" target="timer">←</div>
		<div class="smcount_wrapper">
			<div class="smcount_button smcount_button_start">Start</div>
			<canvas class="smcount_canvas" width="260" height="260" style=""></canvas>
			<div class="smcount_wave_wrapper" style="opacity: 0;">
				<div class="smcount_wave">Wave<span class="smcount_wave_span">1</span></div>
				<div class="smcount_sec">100</div>
			</div>
			<div class="smcount_kasoku_wrapper" style="opacity: 0;">
				<div class="smcount_button smcount_button_kasoku  next3 prev" move=" 115000"></div>
				<div class="smcount_button smcount_button_kasoku  next2 prev" move="   1000"></div>
				<div class="smcount_button smcount_button_kasoku  next1 prev" move="    200"></div>
				<div class="smcount_button smcount_button_kasoku  next1"      move="   -200"></div>
				<div class="smcount_button smcount_button_kasoku  next2"      move="  -1000"></div>
				<div class="smcount_button smcount_button_kasoku  next3"      move="-115000"></div>
			</div>
			<div class="smcount_setting_wrapper">
				<div class="smcount_setting_item">
					<p>ノルマ <span class="smcount_setting_norma_span">Middle</span></p>
					<div class="smcount_setting_button_wrapper">
						<div class="smcount_setting_button smcount_setting_norma no_select" norma="low">Low</div>
						<div class="smcount_setting_button smcount_setting_norma" norma="middle">Middle</div>
						<div class="smcount_setting_button smcount_setting_norma no_select" norma="high">High</div>
					</div>
				</div>
				<div class="smcount_setting_item">
					<p>音量 <span class="smcount_setting_volume_span">50%</span></p>
					<div class="smcount_setting_button_wrapper">
						<!--
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_shitei" value="0.00"  >0</div>
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_shitei" value="0.25" >25</div>
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_shitei" value="0.50" >50</div>
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_shitei" value="0.75" >75</div>
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_shitei" value="1.00">100</div>
						-->
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_mute">Mute</div>
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_minus" move="-0.1">－</div>
						<div class="smcount_setting_button smcount_setting_volume smcount_setting_volume_plus" move=" 0.1">＋</div>
					</div>
				</div>
				<div class="smcount_setting_item">
					<input type="checkbox" class="input_st" style="left: 0px; top: 0px;" id="use_st_timer"  />
					<label for="use_st_timer" data-on-label="On" data-off-label="Off"><p>STタイマーと併用</p></label>
				</div>
			</div>
		</div>
		<div class="st_eta">
			<div class="st_eta_description">　</div>
			<div class="st_eta_count">　</div>
			<div class="st_eta_correction"><p>NICTサーバに時刻を問い合わせ中</p></div>
			<div class="st_eta_next">　</div>
			<div class="st_eta_sound_desc">【サウンドに関する注意】<br>タブが非アクティブの場合は、<br>サウンドの再生が遅れることがあるため、<br>最後の5･4･3･2･1のカウントを行いません。</div>
			<canvas class="st_eta_canvas" width="100" height="100"></canvas>
			<div class="input_st_wrapper">
				<div class="input_st_item">
					<input type="checkbox" class="input_st" id="check_friend"  />
					<label for="check_friend" data-on-label="On" data-off-label="Off"><div class="button hidden_button friend_plus_button plus_button">＋</div><div class="button hidden_button friend_minus_button minus_button">－</div><p>フレ部屋用(<span class="friend_offset">2.5</span>秒遅れ)</p></label>
				</div>
				<div class="input_st_item">	
					<input type="checkbox" class="input_st" id="check_sound"  />
					<label for="check_sound" data-on-label="On" data-off-label="Off"><div class="button hidden_button sound_test_button">Test</div><p>サウンド</p></label>
				</div>
				<div class="input_st_item">	
					<input type="checkbox" class="input_st" id="check_now"  />
					<label for="check_now" data-on-label="On" data-off-label="Off"><p>現在時刻表示</p></label>
				</div>
				<div class="input_st_item">	
					<input type="checkbox" class="input_st" id="check_st_offset"  />
					<label for="check_st_offset" data-on-label="On" data-off-label="Off"><div class="button hidden_button st_plus_button plus_button">＋</div><div class="button hidden_button st_minus_button minus_button">－</div><p>STをずらす<span class="st_offset"></span></p></label>
				</div>
			</div>
			<div class="credit_emaame"><a href="https://emaame.github.io/salmonrun_time_timer/">@emaameさんのSTタイマー</a>を元に作成しています</div>
		</div>
	</div>
[endhtml]
[iscript]
stTimerApp.startApp();
smCountApp.startApp();
[endscript]
[glink text=SMcountの使い方 x=216 width=170 y=21 size=16 color=st_glink_button target=Panel_Reload exp="sf.sm_count_step = 1"]
[return]



;=======================================
*Panel_5
;=======================================
[eval exp="sf.panel = 5"]
[call target=*Panel_Reset]
[iscript]
if (! sf.st_step) sf.st_step = 1;
if (queries.stfest && tf.reset_count < 1) sf.st_step = 3;
[endscript]
[jump target=Panel_5_1 cond="sf.st_step <= 1"]
[jump target=Panel_5_2 cond="sf.st_step <= 2"]
[jump target=Panel_5_3 cond="sf.st_step >= 3"]

;=======================================
*Panel_5_1
;=======================================
[anim layer=1 name=logo opacity=255 time=0]
[html name=html_space]
<div class="st_description">
<h1>STとは</h1>
<b>ST（サーモンランタイム）</b>とは，
<br>@rayudne75 さんが興した草の根運動です。
<br>
<br>「<b>野良でも誘導理解者同士で組みたい</b>」という人たちが
<br>みんなで既定の時刻にマッチングを開始することで
<br>お互いをスナイプしあう、という仕組みです。
<br>
<br>名前の最後に「<b>/</b>」「<b>/ST</b>」などを付けることが
<br>参加者の目印になります。
<br>
<br>ただし、手軽にポイントを稼ぎたい、簡単にクリアしたい、
<br>といった目的での参加は<b>推奨されていません</b>。
<br>
<br>「/ST」は上手さを誇示するタグではなく
<br>あくまで誘導の意思を示すものであり、
<br>クリア率はノルマの増加によって低くなりうる旨を
<br>理解した上で参加しましょう！
</div>
[endhtml]
[glink text=次へ x=191 width=200 y=761 size=24 color=credit_button target=Panel_Reload exp="sf.st_step = 2"]
[return]

;=======================================
*Panel_5_2
;=======================================
[anim layer=1 name=logo opacity=255 time=0]
[html name=html_space]
<div class="st_description">
<h1>STタイマーとは</h1>
STタイマーは、
<br>STへの参加をより<b>簡単かつ確実</b>に行うためのツールで、
<br>もとは @emaame さんが開発したものです。
<br>
<br>STタイマーでは、次のSTまでの時間が
<br><b>カウントダウン形式</b>で表示されるため、
<br>カウントがゼロになった瞬間に「<b>参加する!</b>」を押すことで
<br>簡単にSTに参加することができます。
<br>
<br>NICTのサービスを利用して
<br>コンピュータの時刻のずれを修正するため
<br>ただ時計を見て参加するより確実にスナイプできます。
<br>
<br>なお、フレンド部屋を作って「他の仲間をあつめる」場合は
<br>マッチングの開始タイミングが野良と異なるため
<br><b>フレ部屋モードを有効</b>にしてください。
<br>
<!--
<br>このアプリにおけるSTタイマーは、
<br>本家である @emaame さんのSTタイマー <br><span style="font-size: 100%;">(クリエイティブ･コモンズ･ライセンス 表示4.0 国際)</span> を
<br>改変して作成しました。
-->
</div>
[endhtml]
[glink text=OK! x=191 width=200 y=761 size=24 color=credit_button target=Panel_Reload exp="sf.st_step = 3"]
[return]

;=======================================
*Panel_5_3
;=======================================
[anim layer=1 name=logo opacity=0 time=0]
[iscript]
stTimerApp.specialStTitle = "";
[endscript]
[html name=html_space]
	<div class="all_wrapper" style="transform: translate(0)">
		<div class="st_eta">
			<div class="st_eta_description">　</div>
			<div class="st_eta_count">　</div>
			<div class="st_eta_correction"><p>NICTサーバに時刻を問い合わせ中</p></div>
			<div class="st_eta_next">　</div>
			<div class="st_eta_sound_desc">【サウンドに関する注意】<br>タブが非アクティブの場合は、<br>サウンドの再生が遅れることがあるため<br>最後の5･4･3･2･1のカウントを行いません。</div>
			<canvas class="st_eta_canvas" width="100" height="100"></canvas>
			<div class="input_st_wrapper">
				<div class="input_st_item">
					<input type="checkbox" class="input_st" id="check_friend"  />
					<label for="check_friend" data-on-label="On" data-off-label="Off"><div class="button hidden_button friend_plus_button plus_button">＋</div><div class="button hidden_button friend_minus_button minus_button">－</div><p>フレ部屋用(<span class="friend_offset">2.5</span>秒遅れ)</p></label>
				</div>
				<div class="input_st_item">	
					<input type="checkbox" class="input_st" id="check_sound"  />
					<label for="check_sound" data-on-label="On" data-off-label="Off"><div class="button hidden_button sound_test_button">Test</div><p>サウンド</p></label>
				</div>
				<div class="input_st_item">	
					<input type="checkbox" class="input_st" id="check_now"  />
					<label for="check_now" data-on-label="On" data-off-label="Off"><p>現在時刻表示</p></label>
				</div>
				<div class="input_st_item">	
					<input type="checkbox" class="input_st" id="check_st_offset"  />
					<label for="check_st_offset" data-on-label="On" data-off-label="Off"><div class="button hidden_button st_plus_button plus_button">＋</div><div class="button hidden_button st_minus_button minus_button">－</div><p>STをずらす<span class="st_offset"></span></p></label>
				</div>
			</div>
			<div class="stfest_duration">2019/8/3 17:00 ～ 2019/8/3 25:00</div>
			<div class="credit_emaame">@emaameさんのSTタイマー (CC 表示4.0 国際) を改変しています</div>
		</div>
	</div>
[endhtml]
[iscript]
stTimerApp.startApp();
[endscript]
[call target=Panel_5_Check_STFest]
[glink text=STについて x=246 width=110 y=21 size=16 color=st_glink_button target=Panel_Reload exp="sf.st_step = 1"]
[return]

;=======================================
*Panel_5_Check_STFest
;=======================================

[iscript]
tf.isSTFest = false;
var now = new Date();
var STFEST_DATA = [
	{
		name           : "test",
		buttonTitle    : "Test<br>ver.",
		buttonGraphic  : "stfest_button.png",
		titleColor     : "Yellow",
		startDate      : new Date(2019, 8 -1, 2,  22, 0, 0),
		endDate        : new Date(2019, 8 -1, 2,  23, 0, 0),
		isShowingButton: true,
		bgStorage      : "GT_bg.jpg",
		title          : "TEST (ST+3分)",
		offset         : 3,
		css            : {
			                 "text-shadow": "5px 5px 5px black"
		                 }
	},
	{
		name           : "tt",
		buttonTitle    : "TT<br>ver.",
		titleColor     : "Yellow",
		startDate      : new Date(2019, 8 -1, 3, 19, 0, 0),
		endDate        : new Date(2019, 8 -1, 4,  1, 0, 0),
		isShowingButton: true,
		buttonGraphic  : "stfest_button.png",
		bgStorage      : "GT_bg.jpg",
		title          : "TT祭り (ST+2分) ",
		offset         : 2,
		css            : {
			                 "text-shadow": "5px 5px 5px black"
		                 }
	},
	{
		name           : "sz",
		buttonTitle    : "SZ<br>ver.",
		buttonGraphic  : "stfest_button.png",
		titleColor     : "Yellow",
		startDate      : new Date(2019, 8 -1,  9, 19, 0, 0),
		endDate        : new Date(2019, 8 -1,  9, 23, 0, 0),
		isShowingButton: true,
		bgStorage      : "GT_bg.jpg",
		title          : "SZ祭り (ST+1分) ",
		offset         : 1,
		css            : {
			                 "text-shadow": "5px 5px 5px black"
		                 }
	},
	{
		name           : "sz",
		buttonTitle    : "SZ<br>ver.",
		buttonGraphic  : "stfest_button.png",
		titleColor     : "Yellow",
		startDate      : new Date(2019, 8 -1, 10, 17, 0, 0),
		endDate        : new Date(2019, 8 -1, 10, 21, 0, 0),
		isShowingButton: true,
		bgStorage      : "GT_bg.jpg",
		title          : "SZ祭り (ST+1分) ",
		offset         : 1,
		css            : {
			                 "text-shadow": "5px 5px 5px black"
		                 }
	}
];

// クエリパラメータで指定されているものをピックアップ
var isSTFest, isFiltering = false, dataArray = [], data;
for (var i = 0; i < STFEST_DATA.length; i++) {
	var data = STFEST_DATA[i];
	if (queries.stfest == data.name) {
		dataArray.push(data);
	}
}

// ピックアップしたものがなかったら
if (dataArray.length == 0) {
	// データを直接dataArrayに代入して次の処理へ
	dataArray = STFEST_DATA;
}
// ピックアップしたものが1つだけあったら
else if (dataArray.length == 1) {
	// フェスモード確定、dataにはdataArrayの要素を代入
	isSTFest = true;
	data = dataArray[0];
}
// ピックアップしたものが2つ以上あったら
else {
	// isFiltering を true にして次の処理へ
	isFiltering = true;
}

// この時点でフェスモードが確定していなければ日時でチェック
if (! isSTFest) {
	for (var i = dataArray.length - 1; i >= 0; i--) {
		data = dataArray[i];
		var marginTime =  1000 * 60 * 60;
		var time1 = data.startDate.getTime();
		var time2 = now.getTime();
		var time3 = data.endDate.getTime();
		var bool1 = time1 - marginTime < time2 && time2 < time3 + marginTime;
		var bool2 = isFiltering && i == 0;
		if (false) {
			var duration = (time3 - time1) / 1000 / 60 / 60;
			var str1 = stTimerApp.dateFormatter.getMonthText2(data.startDate);
			var str2 = stTimerApp.dateFormatter.getMonthText2(data.endDate);
			var str = data.title + ": " + str1 + " ～ " + str2 + " (" + duration + "時間)";
			console.log(str);
		}
		if (bool1 || bool2) {
			isSTFest = true;
			break;
		}
	}
}

// フェスモードが確定しているならば
if (isSTFest && data) {
	var str1 = stTimerApp.dateFormatter.getMonthText2(data.startDate);
	var str2 = stTimerApp.dateFormatter.getMonthText2(data.endDate);
	data.durationText = "開催期間: " + str1 + " ～ " + str2;
	tf.isSTFest = true;
	tf.STFestData = data;
}
[endscript]
[return cond=!tf.isSTFest]
[button cond=tf.STFestData.isShowingButton  target=Panel_5_Mode_STFest fix=true text=&tf.STFestData.buttonTitle graphic=&tf.STFestData.buttonGraphic x=20 y=20 width=100 height=100 name=STFest]
[jump   cond=!tf.STFestData.isShowingButton target=Panel_5_Mode_STFest]
[return]

;=======================================
*Panel_5_Mode_STFest
;=======================================

[clearfix name=STFest]
[iscript]
//$(".stfest_duration").css("color", tf.STFestData.titleColor).text(tf.STFestData.durationText).fadeIn(1000);
stTimerApp.specialStColor = tf.STFestData.titleColor;
stTimerApp.specialStTitle = tf.STFestData.title;
stTimerApp.setStTitle();
stTimerApp.stTimer.enableStOffset = true;
stTimerApp.stTimer.stOffset = tf.STFestData.offset;
stTimerApp.$checkStOffset.prop("checked", stTimerApp.stTimer.enableStOffset).trigger("change");
$(".html_space").css(tf.STFestData.css);
$("#check_st_offset").parent().hide(0);
stTimerApp.updateStList();
[endscript]
[bg storage=&tf.STFestData.bgStorage time=1000]
[return]



;=======================================
*Panel_1
;=======================================
[eval exp="sf.panel = 1"]
[call target=*Panel_Reset]
[anim layer=1 name=logo opacity=255 time=0]
[iscript]
tf.x = 40;
tf.y = 180;
//changeCurrentFixButton(1);
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
;=======================================
[eval exp="sf.panel = 2"]
[call target=*Panel_Reset]
[anim layer=1 name=logo opacity=255 time=0]
[iscript]
tf.x = 40;
tf.y = -280;
//changeCurrentFixButton(2);
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
;=======================================
[eval exp="sf.panel = 3"]
[call target=*Panel_Reset]
[anim layer=1 name=logo opacity=255 time=0]
[ptext layer=0 page=fore text=エラーが発生しました🤔     size=24 bold=bold x=0 y=350 width=640 align=center name=error_message,hidden]
[ptext layer=0 page=fore text=現在ご利用いただけません🙇 size=24 bold=bold x=0 y=400 width=640 align=center name=error_message,hidden]
[ptext layer=0 page=fore text=オープン! color=0x22FF22     size=24 bold=bold x=0 y=170 width=640 align=center name=open_title,hidden]
[glink text=»&nbsp;予報を見る x=1380 y=433 size=18 color=rotation_eval_button name=link target=Panel_3_Eval exp="f.select=0; f.noselect=1"]
[glink text=»&nbsp;予報を見る x=1380 y=743 size=18 color=rotation_eval_button name=link target=Panel_3_Eval exp="f.select=1; f.noselect=0"]
[iscript]
tf.x = 20;
tf.y = 120;
//changeCurrentFixButton(3);
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

;=======================================
*Panel_3_Eval
;=======================================
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

;=======================================
*Panel_3_Message
;=======================================
[iscript]
$(".canvas_chart_wrapper").css({"animation-fill-mode": "none"}).fadeOut(500, function(){$(this).remove()});
$(".eval_score"          ).css({"animation-fill-mode": "none"}).fadeOut(500, function(){
	$(this).remove()
	$('<div class="eval_fukidashi"></div>').appendTo(".0_fore");
	$('<img class="eval_ika" src="./data/fgimage/eval_ika.png">').appendTo(".0_fore");
	tf.messages = salmonrunRater.createEvalMessage(evalResult);
	tf.messageArea = $(".eval_fukidashi");
	/*
	テスト用
	tf.messages = [
		"ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ。",
		"ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ。",
		"あああああああああああああああああああああああああああああああああああああああああああああああああああ。"
	];
	*/
	tyranoAPI.jump("", "Panel_3_Message_Next", 300);
});
[endscript]
[s]

;=======================================
*Panel_3_Message_Next
;=======================================
[iscript]
$('<div class="button_cover"></div>').appendTo(".tyrano_base");
[endscript]
[iscript]
tf.wait = false;
var $p = tf.messageArea.find("p");
// もし<p>要素があれば
if ($p.size() > 0) {
	// tf.wait に true を代入して
	tf.wait = true;
	// <p>要素をフェードアウトして消去する
	$p.css({"animation-name": "none"}).fadeOut(500, function(){$(this).remove()});
}
[endscript]
[wait time=500 cond=tf.wait]
[iscript]
var count = 0;
var totalHeight = 40;
// もし表示すべきメッセージがあれば
if (tf.messages.length > 0) {
	// 先頭から3つ取り出す
	for (var i = 0; i < 3; i++) {
		if (tf.messages.length > 0) {
			var mes = tf.messages.shift();
			var delay = i * 300;
			var $p = $('<p style="animation-delay: ' + delay + 'ms">' + mes + '</p>')
			tf.messageArea.append($p);
			var height = $p.height();
			totalHeight += height;
			count++;
		}
	}
	// フォントサイズの設定
	var fontSize = 20;
	if (totalHeight >= 340) {
		fontSize = 16;
	}
	else if (totalHeight >= 280) {
		fontSize = 18;
	}
	tf.messageArea.css("font-size", fontSize + "px");
}
// 先頭から3つ取り出す作業を行ってなお表示すべきメッセージがあれば
if (tf.messages.length > 0) {
	// "次へ"ボタンを表示するための作業を行う
	tf.end = false;
	tf.text = "次へ";
	// もう一度Panel_3_Message_Nextラベルに飛びなおす
	tf.target = "Panel_3_Message_Next";
	tf.x = 280;
	tf.y = 750;
}
// もう次に表示すべきメッセージがないならば
else {
	// "終わる"ボタンを表示するための作業を行う
	tf.x = 270;
	tf.y = 770;
	tf.end = true;
	tf.text = "終わる";
	// もう用は済んだのでPanel_3_Eval_Endに飛んでしまう
	tf.target = "Panel_3_Eval_End";
	// オールランダムのときには特殊な処理をしていたが廃止
	if (evalResult.randomType > 1) {
		/*
		tf.end = false;
		tf.x = 280;
		tf.y = 750;
		*/
		/*
		evalData.w1 = 7000;
		evalData.w2 = 7010;
		evalData.w3 = 7020;
		evalData.w4 = 7030;
		*/
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

;=======================================
*Panel_3_Eval_End
;=======================================
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

;=======================================
*Panel_3_Eval_Weapon
;=======================================
[cm]
[iscript]
if (evalResult.randomType > 1) {
	weaponRater.make([7000, 7010, 7020, 7030]);
}
else {
	weaponRater.make([
		parseInt(evalData.w1),
		parseInt(evalData.w2),
		parseInt(evalData.w3),
		parseInt(evalData.w4)
	]);
}
$(".layer_free").show(0);
[endscript]
[s]



;=======================================
*Panel_4
;=======================================
[eval exp="sf.panel = 4"]
[call target=*Panel_Reset]
[anim layer=1 name=logo opacity=255 time=0]
[iscript]
if (! tf.credit) tf.credit = "Panel_4_1";
tf.x = 40;
tf.y = 200;
//changeCurrentFixButton(4);
[endscript]
[jump target=&tf.credit]

;=======================================
*Panel_4_1
;=======================================
[html name=credit_wrapper]
<div class="credit about">
	<br><br>このアプリについて<br><br>
	<p>「<b>SALMON LEARN -サーモンラーン-</b>」は、<br>
	Nintendo Switch用のゲームソフト「Splatoon2」の<br>
	ゲームモード「サーモンラン」についての<br>
	情報を提供するWebアプリです。</p><br>
	<p>間欠泉の開栓シミュレーション、<br>
	コウモリの誘導シミュレーション、<br>
	シフトの確認および予報のチェックを<br>
	することができます。</p><br>
	<p>[emb exp="VERSION_STR"]</p>
</div>
[endhtml]
[glink text=リロード x=412 width=130 y=563 size=18 color=credit_button target=Panel_4_Reload cond="getUrlQueries && getUrlQueries().utm_source=='homescreen'"]
[jump target=Panel_4_5]

;=======================================
*Panel_4_2
;=======================================
[html name=credit_wrapper]
<div class="credit author">
	<br>
	<h2>作者</h2><br>
	<p>ガンジー (<a href="https://twitter.com/gungeespla" target="_black">@GungeeSpla</a>)</p>
	<p>バグ報告などはTwitterまでお願いします。</p><br>
	<h2>関連リンク</h2><br>
	<p><a href="javascript:void(0)" class="live2d">Live2Dのイカちゃんイラスト</a></p><br>
	<p><a href="https://tiermaker.com/create/splatoon-2-salmon-run-weapons" target="_black">鮭ブキランキングメーカー</a></p><br>
	<p><a href="http://amzn.asia/1OJG2pV" target="_black">作者のWish List</a></p><br>
</div>
[endhtml]
[iscript]
$(".live2d").click(function(){
	tyranoAPI.jump("", "Goto_Senpai");
});
[endscript]
[jump target=Panel_4_5]

;=======================================
*Panel_4_3
;=======================================
[html name=credit_wrapper]
<div class="credit">
	<h2>コウモリマップに関する知見の引用･参考</h2>
	<p>ザラメ (<a href="https://twitter.com/zarame2431" target="_black">@zarame2431</a>)</p>
	<p>カトレア (<a href="https://twitter.com/ikatorea" target="_black">@ikatorea</a>)</p>
	
	<h2>間欠泉の開栓手順に関する知見の引用･参考</h2>
	<p>いh7 (<a href="https://twitter.com/ultmis" target="_black">@ultmis</a>)</p>
	<p>えむいー (<a href="https://twitter.com/tkgling" target="_black">@tkgling</a>, <a href="https://tkgstrator.work/" target="_black">https://tkgstrator.work/</a>)</p>
	<p><a href="https://splatoon-yoru.com/" target="_black">https://splatoon-yoru.com/</a></p>
	
	<h2>サーモンランのシフト取得API</h2>
	<p>ウラル (<a href="https://twitter.com/barley_ural" target="_black">@barley_ural</a>, <a href="https://splamp.info/" target="_black">https://splamp.info/</a>)</p>
	
	<h2>STタイマーの改変元</h2>
	<p>ema (<a href="https://twitter.com/emaame" target="_black">@emaame</a>, <a href="https://emaame.github.io/salmonrun_time_timer/" target="_black">https://emaame.github.io/...</a>)</p>
</div>
[endhtml]
[jump target=Panel_4_5]

;=======================================
*Panel_4_4
;=======================================
[html name=credit_wrapper]
<div class="credit">
	
	<h2>STの提唱及びSMcountの着想</h2>
	<p>鮭走情報専 (<a href="https://twitter.com/rayudne75" target="_black">@rayudne75</a>)</p>
	
	<h2>その他画像や情報の引用など</h2>
	<p><a href="https://wikiwiki.jp/splatoon2mix/" target="_black">https://wikiwiki.jp/splatoon2mix/</a></p>
	<p><a href="https://splatoonwiki.org/wiki/" target="_black">https://splatoonwiki.org/wiki/</a></p>
</div>
[endhtml]
[jump target=Panel_4_5]

;=======================================
*Panel_4_5
;=======================================
[glink text=アプリについて   x=060 width=200 y=690 size=24 color=credit_button target=Panel_4_Jump exp="tf.credit = 'Panel_4_1'"]
[glink text=作者と関連リンク x=330 width=200 y=690 size=24 color=credit_button target=Panel_4_Jump exp="tf.credit = 'Panel_4_2'"]
[glink text=クレジット１     x=060 width=200 y=760 size=24 color=credit_button target=Panel_4_Jump exp="tf.credit = 'Panel_4_3'"]
[glink text=クレジット２     x=330 width=200 y=760 size=24 color=credit_button target=Panel_4_Jump exp="tf.credit = 'Panel_4_4'"]
[return]

;=======================================
*Panel_4_Jump
;=======================================
[call target=&tf.credit]
[eval exp="tf.credit = false"]
[s]

;=======================================
*Panel_4_Reload
;=======================================
[mask time=300]
[iscript]
sf.panel = 1;
location.reload(true);
[endscript]




;=======================================
*Panel_10
;=======================================
[eval exp="sf.panel = 10"]
[call target=*Panel_Reset]
[anim layer=1 name=logo opacity=255 time=0]
[html name=html_space]
	<div class="learn_setting_wrapper">
		<div class="input_password_wrapper setting_hidden">
			<div class="input_password_outer"></div>
			<div class="input_password_inner">
				<p>パスワードを入力してください。</p>
				<form>
				<p><input type="text" class="input_text" placeholder="password"></input></p>
				<p><input type="submit" class="input_ok" value="OK"></input></p>
				</form>
			</div>
		</div>
		<div class="alert_wrapper alert_wrapper_normal setting_hidden">
			<div class="alert_outer"></div>
			<div class="alert_inner">
				<p class="alert_text">何も起こりませんでした。</p>
				<input type="button" class="input_ok" value="OK"></input>
			</div>
		</div>
		<h2>SMcount</h2>
		<div class="learn_setting_item">
			<div class="learn_setting_item_title">読み上げ</div>
			<div class="learn_setting_item_prof">棒読みちゃん</div>
			<input type="button" class="learn_setting_change" value="変更">
		</div>
		
		<div class="alert_wrapper alert_wrapper_radio setting_hidden">
			<div class="alert_outer"></div>
			<div class="alert_inner">
				<p class="radio_area"></p>
				<input type="button" class="input_ok" value="OK"></input>
			</div>
		</div>
		<p class="goto_password_wrapper"><input type="button" class="goto_password" value="パスワードを入力"></input></p>
	</div>
[endhtml]
[iscript]
settingApp.startApp();
[endscript]
[return]



;=======================================
;# コウモリ
;=======================================

;=======================================
*InitKomori
;=======================================
[mask time=300]
[cm]
[clearfix]
[freelayer layer=0]
[freelayer layer=1]

[iscript]
gusherApp.copyDefineData(f.target);
[endscript]

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
f.kPos = gusherApp.getKomoriPos(f.komoriLabel);
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
$(".ika,.ika2").appendTo("#tyrano_base").draggable({
    drag: function (e) {
        clearTimeout(gusherApp.updateKomoriArrowTimerId);
        gusherApp.updateKomoriArrowTimerId = setTimeout(function () {
            gusherApp.updateKomoriArrow();
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
            var dis = gusherApp.calcDistance(offset.left, offset.top, k.x, k.y);
            if (dis < minDis) {
                minDis = dis;
                nextLabel = k.label;
            }
        }
        var nextPos = gusherApp.getKomoriPos(nextLabel);
        $(this).css({
            left: (nextPos.x - f.komoriDx) + "px",
            top: (nextPos.y - f.komoriDy) + "px",
        });
        f.komoriLabel = nextLabel;
        gusherApp.updateKomoriArrow(f);
        $(".komori_circle").hide();
        $(".komori_circle." + f.komoriLabel).show();
    }
});
$(".komori_circle." + f.komoriLabel).fadeIn(300);
gusherApp.updateKomoriArrow(f);
[endscript]
[s]



;=======================================
*KomoriTobasu
;=======================================
[iscript]
var nextLabel = gusherApp.getKomoriNextLabel(f.komoriLabel);
var nextPos = gusherApp.getKomoriPos(nextLabel);
f.komoriLabel = nextLabel;
$(".komori").animate({
    left: (nextPos.x - f.komoriDx) + "px",
    top : (nextPos.y - f.komoriDy) + "px",
}, 600, "easeInOutQuad", function () {
    gusherApp.updateKomoriArrow();
    $(".komori_circle").hide();
    $(".komori_circle." + f.komoriLabel).show();
});

[endscript]
[return]



;=======================================
*KomoriTitle
;=======================================
[clearstack]
[iscript]
$(".ika").remove();
$(".ika2").remove();
$(".komori").remove();
$(".bakudan").remove();
clearTimeout(gusherApp.updateKomoriArrowTimerId);
gusherApp.ctx.clearRect(0, 0, 640, 960);
[endscript]
[jump target=*Retitle]



;=======================================
*ToggleIka
;=======================================
[iscript]
$(".ika2").fadeToggle(300, function() {
    gusherApp.updateKomoriArrow();    
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
;# センパイ行き
;=======================================

;=======================================
*Goto_Senpai
;=======================================
[iscript]
var s = location.search;
f.bool = (s.indexOf("test") > -1);
[endscript]
[mask time=300]
[clearstack]
[cm]
[clearfix]
[freelayer layer=0 time=0]
[freelayer layer=1 time=0]
[bg storage=black.png time=0]
[wait time=1000]
[mask_off time=50]
[jump storage=scene.ks]
[s]



;=======================================
;# 間欠泉
;=======================================

;=======================================
*Init
;=======================================
[mask time=300]
[cm]
[clearfix]
[freelayer layer=0]
[freelayer layer=1]
[iscript]
gusherApp.copyDefineData(f.target);
[endscript]
[bg storage=&f.bg x=0 y=0 time=0]
[image layer=0 zindex=1 x=0 y=0 storage=&f.suimyaku name=suimyaku]
[foreach name=f.item array=f.kanketsusen]
[image layer=0 x=&f.item.x-60 y=&f.item.y-130 storage=kanketsu_sen.png zindex=2]
[ptext layer=0 x=&f.item.x-25 y=&f.item.y+15 edge=0x000000 text=&f.item.label size=24 color=0x2AD600 bold=bold align=center width=50]
[nextfor]
[button fix=true graphic=suimyaku.png  x=50  y=20  storage=learn.ks target=*Suimyaku  name=fixbutton]
[button fix=true graphic=kotae.png     x=250 y=20  storage=learn.ks target=*Kotae     name=fixbutton]
[button fix=true graphic=joseki.png    x=450 y=20  storage=learn.ks target=*Joseki    name=fixbutton cond="f.josekidata.length > 0"]
[button fix=true graphic=modoru2.png   x=450 y=870 storage=learn.ks target=*Retitle   name=fixbutton]
[mask_off time=300]
[call target=Set_Kotae]
[jump target=Start]
[s]



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
[glink text=定石なし x=60  y=300 width=450 target=Restart exp="f.random = false; f.joseki=''"]
[foreach name=f.item array=f.josekidata]
[glink text="&f.item[0]" x=60  y=&400+tf.index*100 width=450 target=Restart exp="&f.item[1]"]
[nextfor]
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
[jump target=&f.joseki storage=joseki.ks]
[s]

;=======================================
*RestartB
;=======================================

[cm]
[freelayer layer=1]
[foreach name=f.item array=f.kanketsusen]
[button graphic=toumei.png width=80 height=80 x=&f.item.x-40 y=&f.item.y-40 preexp=f.item.label exp="f.random = false; f.answer = preexp" storage=learn.ks target=RestartB2]
[nextfor]
[s]

;=======================================
*RestartB2
;=======================================
[iscript]
$(".fixbutton").show();
[endscript]
[call storage=learn.ks  target=Set_Kotae]
[jump storage=learn.ks  target=Start cond="!f.joseki"]
[jump storage=joseki.ks target=&f.joseki]
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
gusherApp.ctx.clearRect(0, 0, 640, 960);
[endscript]
[mask_off time=200]
[jump target=Title storage=learn.ks]
[s]