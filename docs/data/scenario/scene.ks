*start

/*
s001 待機中 視線を漂わせる
s002 こちらを見る
s003 └→待機
s004 顔を傾けてにっこり笑う
s005 └→待機
s006 体を引きながら照れる
s007 └→待機
s008 左上を見上げながら考える（wait=1300）
*/

[call target=init_macro]
[call target=init_setting]

;立ち絵表示(LIVE2D)
[live2d_new        name="ikachan" left=-160 top=0 width=960 height=960 gltop=0.4 glleft=0 glscale=1.4]
[live2d_motion     name="ikachan" filenm="s001.mtn" idle="ON"]
[live2d_show       name="ikachan" time=1800]

;[jump target=visited cond="sf.visited==1"]
[eval exp="sf.visited=1"]

;メッセージウィンドウ
[mw_on]
[free  layer=message0 name=name]
[image layer=message0 left=30 top=648 zindex=10000 storage=name_hatena.png name=name]

......[p]
[mo f=s002]
こんにちは。[r]
こんなところによく気が付いたね。
[mo f=s003 i=ON]
[myp]

[<]
……私がだれかって？[myp]

[mo f=s004]
私のことは……そうだな、[r]
[b]センパイ[/b]と呼んでくれたらいいよ。
[mo f=s005 i=ON]
[myp]

[free  layer=message0 name=name]
[image layer=message0 left=30 top=648 zindex=10000 storage=name_senpai.png name=name]

[<]
このページにアクセスしてくれて[r]
ありがとう。[myp]

[mo f=s002]
[b]ガンジー[/b]とかいうやつが[r]
作ったものをまとめておくよ。
[mo f=s003 i=ON]
[myp]

[<]
クリックするとそこに飛ぶように[r]
なっているから、
[myp]

[mo f=s006]
まあ、興味があれば……[r]
ぜひ見てやってくれ。
[mo f=s007 i=ON]
[myp]
[jump target=choice]

*visited

;メッセージウィンドウ
[mw_on]
[free  layer=message0 name=name]
[image layer=message0 left=30 top=648 zindex=10000 storage=name_senpai.png name=name]

[mo f=s002]
おや、こんにちは。[r]
バイト、楽しんでるかい？
[mo f=s003 i=ON]
[jump target=choice]


*choice
[glink target=*choice1 color=shake2 height=120 width=600 text=Salmon&nbsp;Learn]
[glink target=*choice2 color=shake2 height=120 width=600 text=STタイマー&nbsp;Ver.ガンジー]
[glink target=*choice3 color=shake2 height=120 width=600 text=鮭ブキランキングメーカー]
[glink target=*choice4 color=shake2 height=120 width=600 text=センパイのLive2Dモデル]
[glink_show time=500 dy=-170]
[s]

*choice1

[mo f=s004]
キミがいま見ているここが[r]
まさにSalmon Learnだ！
[mo f=s005 i=ON]
[myp]

[<]
もとの場所に戻るよ。[myp]
[jump target=back_title]
[s]

*back_title

[cm]
[mask time=500]
[bg time=0 storage=black.png]
[free  layer=message0 name=name]
[live2d_hide name=ikachan time=0]
[live2d_delete name=ikachan]
;[free_layermode time=0]
[layopt layer=message0 visible=false]
[wait time=100]
[mask_off time=0]
[jump storage=learn.ks]
[s]

*choice4


[mo f=s006]
私のLive2Dモデルに[r]
興味があるのか？
[mo f=s007 i=ON]
[myp]

[<<]
zipを公開しておくから、[r]
知識のある方はPCからどうぞ。
[myp]

[web url=https://www.axfc.net/u/3979915]
[jump target=back_title]
[s]

*choice3

[mo f=s002]
ちょっと前に、[r]
ブキランキング作りが[r]
流行ったことがあった。
[mo f=s003 i=ON]
[myp]

[<<]
そのときに用意してみた[r]
ランキングメーカーだな。
[myp]

[<<]
興味があれば、どうぞ。
[myp]

[web url=https://tiermaker.com/create/splatoon-2-salmon-run-weapons]
[jump target=back_title]
[s]

*choice2

[mo f=s008]
これはだな……[r][wait time=1300]
[mo f=s002]
STタイマーをちょこっとだけ[r]
改造したやつだ。
[mo f=s003 i=ON]
[myp]

[<<]
とはいっても、[r]
効果音を出せるように[r]
したくらいだが。
[myp]

[mo f=s004]
使えそうなら、どうぞ。
[mo f=s005 i=ON]
[myp]

[web url=https://gungeespla.github.io/salmonrun_time_timer/]
[jump target=back_title]
[s]







*init_setting


[if exp=f.bool]
[ptext x=100 y=100 layer=0 color=0xffffff bold=bold size=24 text=111111]
[endif]

; プリロード
[load_start cond="!f.bool"]

[if exp=f.bool]
[ptext x=100 y=200 layer=0 color=0xffffff bold=bold size=24 text=222222]
[endif]

/*
[preload wait=true storage=data/others/live2d/assets/ikachan/ikachan.1024/texture_00.png]
[preload wait=true storage=data/bgimage/bg.png]
[preload wait=true storage=data/fgimage/name_hatena.png]
[preload wait=true storage=data/fgimage/name_senpai.png]
[preload wait=true storage=data/image/mw.png]
[preload wait=true storage=tyrano/images/system/sentaku.png]
[preload wait=true storage=tyrano/images/system/sentaku2.png]
[preload wait=true storage=tyrano/images/system/nextpage.png]
[preload wait=true storage=data/image/screen.png]
*/

[load_end cond="!f.bool"]

[if exp=f.bool]
[ptext x=100 y=200 layer=0 color=0xffffff bold=bold size=24 text=333333]
[endif]

; 背景
[mask time=100]
[bg time=0 storage=bg.png]
;[layermode graphic=screen.png mode=screen time=0]
[mask_off time=800]

; メッセージウィンドウの調整
[layopt layer=message0 visible=false]
[position width=640 height=240 frame=mw.png top=640 left=0 marginl=120 margint=54 marginr=40 opacity=220]
[glyph fix=true line=nextpage.png left=590 top=830]

;フォント設定
[deffont color=0xFFFFFF size=28 bold=true]
[resetfont]
[return]







*init_macro

;[b]
[macro name=b]
[font color=0xFC780A]
[endmacro]

;[/b]
[macro name=/b]
[resetfont]
[endmacro]

;[load_start]
[macro name=load_start]
[mask time=0]
[bg time=0 storage=black.png]
[layopt layer=message visible=false]
[layopt layer=0 visible=true]
[image layer=0 left=270 y=430 storage=loading.gif]
[mask_off time=800]
[endmacro]

;[load_end]
[macro name=load_end]
[mask time=800]
[freelayer layer=0 time=0]
[mask_off time=0]
[endmacro]

;[mw_on]
[macro name=mw_on]
[iscript]
$(".message0_fore").fadeIn(500)
[endscript]
[wait time=600]
[endmacro]

;[mw_off]
[macro name=mw_off]
[iscript]
$(".message0_fore").fadeOut(500);
[endscript]
[wait time=500]
[endmacro]

;[mo]
[macro name=mo]
[live2d_motion     name="ikachan" filenm="&mp.f+'.mtn'" idle=&mp.i]
[endmacro]

;[<]
[macro name=<]
[live2d_motion name="ikachan" filenm="m10.mtn"]
[endmacro]

;[<<]
[macro name=<<]
[live2d_motion name="ikachan" filenm="m11.mtn"]
[endmacro]

;[>]
[macro name=>]
[live2d_motion name="ikachan" filenm="m00.mtn"]
[endmacro]

;[myp]
[macro name=myp]
[live2d_motion name="ikachan" filenm="m00.mtn"]
[p]
[endmacro]

;[myl]
[macro name=myl]
[live2d_motion name="ikachan" filenm="m00.mtn"]
[l]
[endmacro]

[return]