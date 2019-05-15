[call target=init_macro]

; プリロード
[load_start]
[preload wait=true storage=data/others/live2d/assets/ikachan/ikachan.1024/texture_00.png]
[preload wait=true storage=data/bgimage/bg.png]
[preload wait=true storage=data/fgimage/name_hatena.png]
[preload wait=true storage=data/fgimage/name_senpai.png]
[preload wait=true storage=data/image/mw.png]
[preload wait=true storage=tyrano/images/system/sentaku.png]
[preload wait=true storage=tyrano/images/system/sentaku2.png]
[preload wait=true storage=tyrano/images/system/nextpage.png]
[preload wait=true storage=data/image/screen.png]
[load_end]

; 背景
[mask time=0]
[bg time=0 storage=bg.png]
[layermode graphic=screen.png mode=screen time=0]
[mask_off time=800]

; メッセージウィンドウの調整
[layopt layer=message0 visible=false]
[position width=640 height=240 frame=mw.png top=640 left=0 marginl=120 margint=54 marginr=40 opacity=220]
[glyph fix=true line=nextpage.png left=590 top=830]

;フォント設定
[deffont color=0xFFFFFF size=28 bold=true]
[resetfont]

;立ち絵表示(LIVE2D)
[live2d_new        name="ikachan" left=-160 top=0 width=960 height=960 gltop=0.4 glleft=0 glscale=1.4]
[live2d_motion     name="ikachan" filenm="s001.mtn" idle="ON"]
[live2d_show       name="ikachan" time=1800]

;メッセージウィンドウ
[mw_on]
[free  layer=message0 name=name]
[image layer=message0 left=30 top=648 zindex=10000 storage=name_hatena.png name=name]








[jump target=visited cond="sf.visited==1"]
[eval exp="sf.visited=1"]






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

[mask time=500]
[free  layer=message0 name=name]
[live2d_delete name=ikachan]
[free_layermode time=0]
[bg time=0 storage=black.png]
[wait time=500]
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
[wait time=500]
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

/*
[<]
……私がだれかって？[myp]

;[<]
[live2d_motion     name="ikachan" filenm="s004.mtn"]
私のことは……そうだな、[r]
[b]センパイ[/b]と呼んでくれたらいいよ。
[live2d_motion     name="ikachan" filenm="s005.mtn" idle="ON"]
[myp]

[free  layer=message0 name=name]
[image layer=message0 left=30 top=648 zindex=10000 storage=name_senpai.png name=name]

[<]
私はもうずっと[r]ここでバイトをしているんだ。[myp]

;[<]
[live2d_motion     name="ikachan" filenm="s006.mtn"]
まあ、長く続けているだけで、[r]
腕前のほうはからっきしなんだが。
[live2d_motion     name="ikachan" filenm="s007.mtn" idle="ON"]
[myp]

[<<]いやいや、本当さ。[myp]

……。[myp]

*a

;[<]
[live2d_motion     name="ikachan" filenm="s002.mtn"]
でもちょっとくらい、キミに[r]
センパイ風をふかせてみようか。
[live2d_motion     name="ikachan" filenm="s003.mtn" idle="ON"]
[myp]

[live2d_motion     name="ikachan" filenm="s008.mtn"]
そうだな……[r][wait time=1300]
[live2d_motion     name="ikachan" filenm="s002.mtn"]
キミは[b]スプラッシュボム[/b]のことを[r]
知っているかい？
[live2d_motion     name="ikachan" filenm="s003.mtn" idle="ON"]
[myp]

[s]

……バカにするなって？[myl][r]
もちろん、知っていることだろう。[myp]

でも、いったいどれだけのことを[r]
しっているのか。[myp]

……それを、[r]私が確かめてあげよう。[myp]






さあ、まずは基礎の基礎から。[myp]

スプラッシュボムが[r]
[b]爆発する条件[/b]は？[myl]

[glink target=*scene10 color=shake2 height=100 width=600 text=投げてから1秒後]
[glink target=*scene11 color=shake2 height=100 width=600 text=壁や地面に接触した瞬間]
[glink target=*scene12 color=shake2 height=100 width=600 text=地面に接触してから1秒後]
[glink_show time=500]
[s]

*scene10

投げてから1秒後……[r]
では、ないんだ。[myp]

そのほうが自然かも[r]
しれないけどね。[myp]

正解は

[jump target=*scene13]
*scene11

む……それは[r]
[b]クイックボム[/b]の仕様だな。[myp]

正解は

[jump target=*scene13]
*scene12

正解！　

[jump target=*scene13]
*scene13

[b]地面に落ちてから1秒後[/b]だ。[myp]

だから、ボムが宙にあるうちは[r]
基本的には起爆しない。[myp]

この性質を利用して、[r]
ボムを[b]高く放り投げる[/b]ことで[r]
起爆までの時間を稼ぐ、[myp]

というテクニックがある。[myp]

稼げる時間はだいたい[b]1.5秒[/b]。[r]
自分より低い位置に投げれば[r]
もっと稼げるな。[myp]

このテクニックが有効に働く[r]
シーンも多いはずだ。[myp]

たとえば、[r]
[b]コウモリが弱点をさらす前[/b]に[r]
ボムを放り投げておいて……[myp]

コウモリが弱点をさらしたあとに[r]
爆発したボムが直撃するように[r]
工夫する。[myp]

すかさず、メインウェポンで
攻撃をたたみかける。[myp]

こうすることで、[r]
[b]火力の底上げ[/b]が見込めるな。[myp]







つぎにダメージを確認しよう。[myl][r]
スプラッシュボムのダメージは、[myp]
近くで[b]直撃[/b]したときと[r]
遠くの[b]爆風[/b]が当たったときで[r]
きっぱりと分かれる。[myp]
直撃ダメージと爆風ダメージの[r]
組み合わせとして正しいのは？[myl]

[glink target=*scene7 color=shake height=100 width=400 text=180と30]
[glink target=*scene8 color=shake height=100 width=400 text=200と30 exp="f.a=200"]
[glink target=*scene8 color=shake height=100 width=400 text=220と30 exp="f.a=220"]
[glink_show time=500]
[s]

*scene7

ほう？[r]
よく勉強しているな、えらいぞ。[myp]

そのとおり、[r]
[b]直撃180ダメージ[/b]、[r]
[b]爆風30ダメージ[/b]なんだ。[myp]

[jump target=*scene9]
*scene8

ふむ。[myp]

もし直撃[emb exp=f.a]ダメージあったら、[r]
このバイトはだいぶ楽になるな。[myp]

じつは、スプラッシュボムは[r]
[b]直撃180ダメージ[/b]、[r]
[b]爆風30ダメージ[/b]しかないんだ。[myp]

思ったより低いだろう？[myp]

[jump target=*scene9]
*scene9







次に、攻撃範囲。[myp]

直撃ダメージが入る範囲は[r]
あまり広くないが……[myp]

[b]爆風ダメージが入る範囲[/b]は[r]
[b]見た目以上に広い[/b]ぞ！[myp]

たとえば、[r]
タワーの足元に落ちたボム。[myp]

タワーの[b]下から何段目[/b]まで[r]
爆風ダメージが入るだろう？[r]
タワーのナベは全部で7段だ。[myl]

[glink target=*scene14 color=shake height=100 width=400 text=4]
[glink target=*scene14 color=shake height=100 width=400 text=5]
[glink target=*scene15 color=shake height=100 width=400 text=6]
[glink_show time=500]
[s]

*scene14

いや、もっと広いんだ。[myp]
じつは

[jump target=*scene16]
*scene15

正解、

[jump target=*scene16]
*scene16

[b]下から6段目[/b]まで爆風が届く。[myp]

[b]一番上以外は全部[/b]ということだね。[myp]

それぞれのナベの耐久値は60だから[r]
ボム2個で一番上のナベ以外は全部[r]
吹き飛ぶ、ということになる。[myp]

ずいぶん広いだろう？　なんと[r]
[b]バクダンの弱点部分[/b]にも[r]
爆風ダメージは届くぞ。[myp]

爆風の30ダメージというのは[r]
思った以上に貧弱で、[myp]

これではコジャケも倒せないし、[r]
シャケコプターも倒せない。[myp]

とはいえ、[b]タワー[/b]を削ったり、[r]
[b]バクダン[/b]をわずかに削ったり、[r]
テッパンのターゲットを取ったり、[myp]

[b]味方の浮き輪[/b]も爆風一発で助けたり[r]
できる。[myp]

うまく使えると楽しいな！[myp]








そして、使うインクの量。[myp]

バイト専用のスプラッシュボムは[r]
[b]インクをどれくらい使う[/b]だろう？[myl][r]
全回復した状態を100%として、

[glink target=*scene1 color=shake height=100 width=400 text=75%]
[glink target=*scene2 color=shake height=100 width=400 text=70% exp="f.a=70"]
[glink target=*scene2 color=shake height=100 width=400 text=65% exp="f.a=65"]
[glink_show time=500]
[s]

*scene1

正解！75%だ。[myp]

[jump target=*scene3]
*scene2

……[emb exp=f.a]%かい？[myp]

ふふ、意外と間違いやすいんだ。[myp]

正解は、75%。[myp]

バイト専用のスプラッシュボムは[r]

[jump target=*scene3]
*scene3

4分の3のインクを使うと思うと、[r]
なかなか贅沢なしろものだ。[myp]

なぜなら、[r]
ほとんどのメインウェポンは、[myp]

それだけのインクがあれば、[r]
2000以上のダメージを[r]
与えることができるからだ。[myp]

……ホクサイ？[myl][r]
ふむ、しらない子だな。[myp]






次に、インク回復について。[myp]

何もせず[b]ただ立っているだけ[/b]で[r]
キミのインクタンクは[r]
[b]10秒[/b]でゼロから満タンになる。[myp]

[b]インクにセンプク[/b]していれば、[r]
もっと早い。[r]
[b]3秒[/b]で満タンになる。[myp]

ボム1個分＝75%のインクが[r]
回復するのには、[r]
[b]2.25秒[/b]かかる計算だ。[myp]

じゃあ、[r]
キミは2.25秒に1回のペースで[r]
ボムを投げることができるか？[myp]

……というと、じつはできない。[myp]
なぜなら、[r]
[b]インクロック[/b]があるからだ。[myp]

スプラッシュボムを投げた後には[r]
[b]インクが回復しなくなる時間[/b][r]
というのがあるんだ。[myp]

これが、インクロック。[myp]

さて、ではスプラッシュボムの[r]
インクロックの時間は？[myl]

[glink target=*scene5 color=shake height=100 width=400 text=1.5秒]
[glink target=*scene4 color=shake height=100 width=400 text=1秒]
[glink target=*scene5 color=shake height=100 width=400 text=0.5秒]
[glink_show time=500]
[s]

*scene4

1秒……？[myp]

……ファイナルアンサー？[myl][r]
なんてね。[myp]

1秒、正解だ。[myp]

[jump target=*scene6]
*scene5

……おしい！[myp]

でもイイセンいってるぞ！[r]
正解は1秒だ。[myp]

[jump target=*scene6]
*scene6

つまりボムで消費したインクを[r]
取り戻すには、2.25+1で、[r]
[b]3.25秒[/b]かかるわけだな。[myp]

ここで、[b]インクの余剰回復[/b]、[r]
という言葉を出してみよう。[myp]

キミのインクタンクは[r]
3秒で満タンになると言ったが……[myp]

タンクが満タンになったら、[r]
いくらセンプクしてもそれ以上[r]
インクが増えることはない。[myp]

これを[b]インクの余剰回復[/b]という。[myl][r]
これはちょっと損なことなんだ。[myp]

さて、さっきボム分のインクは[r]
3.25秒で取り戻せるといったね。[myp]

だから、もしキミが、[r]
[b]インクが満タン[/b]の状態で[r]
[b]3秒間センプク[/b]していたら、[myp]

それはだいたい[b]ボム1個分の[r]
インクを余剰回復している[/b]、[r]
ということになるんだ。[myp]

シャケが寄るのを待つとき、[r]
イクラを拾って帰るとき……[myp]

3秒間センプクするだけなら、[r]
とりあえず[b]ザコシャケに向かって[r]
ボムを投げておく[/b]といいだろう。[myp]

そうすることで、[r]
キミはインクの余剰回復をなくし[r]
効率よくインクを消費できる。[myp]

ただし、これはあくまで[r]
「何もしないくらいなら」[r]
という話で、[myp]

他にインクを使うことがあるなら[r]
無理にボムを投げる必要はない。[myp]

あんまり適当に投げていると[r]
むしろインクを大損してしまうから[r]
気をつけることだ。[myp]

……難しいな！[myp]
[s]

*/