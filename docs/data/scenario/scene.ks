[bg time=0 storage=bg.png]
[position width=640 height=240 frame=mw.png top=640 left=0 marginl=120 margint=54 marginr=40]

[glyph fix=true line=nextpage.png left=590 top=830]
[ptext name=cname size=34 color=0xFC780A face=Splatoon1 x=30 y=630 layer=message0]
[chara_config ptext=cname]
[deffont color=0xFFFFFF size=28 bold=true]
[resetfont]
[macro name=b]
[font color=0xFC780A]
[endmacro]
[macro name=/b]
[resetfont]
[endmacro]

[layermode graphic=screen.png mode=screen time=0]
[chara_new name=ika storage=chara/ika.png]
[chara_show name=ika]

#？？？

[jump target=a]

こんにちは。[r]
こんなところによく気が付いたね。[p]

……私がだれかって？[p]

私のことは……そうだな、[r]
[b]センパイ[/b]と呼んでくれたらいいよ。[p]

#センパイ

私はもうずっと[r]ここでバイトをしているんだ。[p]

まあ、長く続けているだけで、[r]
腕前のほうはからっきしなんだが。[p]

いやいや、本当さ。[p]

……。[p]

でもちょっとくらい、キミに[r]
センパイ風をふかせてみようか。[p]

そうだな……[r]
キミは[b]スプラッシュボム[/b]のことを[r]
知っているかい？[p]

……バカにするなって？[l][r]
もちろん、知っていることだろう。[p]

でも、いったいどれだけのことを[r]
しっているのか。[p]

……それを、[r]私が確かめてあげよう。[p]






さあ、まずは基礎の基礎から。[p]

スプラッシュボムが[r]
[b]爆発する条件[/b]は？[l]

[glink target=*scene10 color=shake2 height=100 width=600 text=投げてから1秒後]
[glink target=*scene11 color=shake2 height=100 width=600 text=壁や地面に接触した瞬間]
[glink target=*scene12 color=shake2 height=100 width=600 text=地面に接触してから1秒後]
[glink_show time=500]
[s]

*scene10

投げてから1秒後……[r]
では、ないんだ。[p]

そのほうが自然かも[r]
しれないけどね。[p]

正解は

[jump target=*scene13]
*scene11

む……それは[r]
[b]クイックボム[/b]の仕様だな。[p]

正解は

[jump target=*scene13]
*scene12

正解！　

[jump target=*scene13]
*scene13

[b]地面に落ちてから1秒後[/b]だ。[p]

だから、ボムが宙にあるうちは[r]
基本的には起爆しない。[p]

この性質を利用して、[r]
ボムを[b]高く放り投げる[/b]ことで[r]
起爆までの時間を稼ぐ、[p]

というテクニックがある。[p]

稼げる時間はだいたい[b]1.5秒[/b]。[r]
自分より低い位置に投げれば[r]
もっと稼げるな。[p]

このテクニックが有効に働く[r]
シーンも多いはずだ。[p]

たとえば、[r]
[b]コウモリが弱点をさらす前[/b]に[r]
ボムを放り投げておいて……[p]

コウモリが弱点をさらしたあとに[r]
爆発したボムが直撃するように[r]
工夫する。[p]

すかさず、メインウェポンで
攻撃をたたみかける。[p]

こうすることで、[r]
[b]火力の底上げ[/b]が見込めるな。[p]







つぎにダメージを確認しよう。[l][r]
スプラッシュボムのダメージは、[p]
近くで[b]直撃[/b]したときと[r]
遠くの[b]爆風[/b]が当たったときで[r]
きっぱりと分かれる。[p]
直撃ダメージと爆風ダメージの[r]
組み合わせとして正しいのは？[l]

[glink target=*scene7 color=shake height=100 width=400 text=180と30]
[glink target=*scene8 color=shake height=100 width=400 text=200と30 exp="f.a=200"]
[glink target=*scene8 color=shake height=100 width=400 text=220と30 exp="f.a=220"]
[glink_show time=500]
[s]

*scene7

ほう？[r]
よく勉強しているな、えらいぞ。[p]

そのとおり、[r]
[b]直撃180ダメージ[/b]、[r]
[b]爆風30ダメージ[/b]なんだ。[p]

[jump target=*scene9]
*scene8

ふむ。[p]

もし直撃[emb exp=f.a]ダメージあったら、[r]
このバイトはだいぶ楽になるな。[p]

じつは、スプラッシュボムは[r]
[b]直撃180ダメージ[/b]、[r]
[b]爆風30ダメージ[/b]しかないんだ。[p]

思ったより低いだろう？[p]

[jump target=*scene9]
*scene9







次に、攻撃範囲。[p]

直撃ダメージが入る範囲は[r]
あまり広くないが……[p]

[b]爆風ダメージが入る範囲[/b]は[r]
[b]見た目以上に広い[/b]ぞ！[p]

たとえば、[r]
タワーの足元に落ちたボム。[p]

タワーの[b]下から何段目[/b]まで[r]
爆風ダメージが入るだろう？[r]
タワーのナベは全部で7段だ。[l]

[glink target=*scene14 color=shake height=100 width=400 text=4]
[glink target=*scene14 color=shake height=100 width=400 text=5]
[glink target=*scene15 color=shake height=100 width=400 text=6]
[glink_show time=500]
[s]

*scene14

いや、もっと広いんだ。[p]
じつは

[jump target=*scene16]
*scene15

正解、

[jump target=*scene16]
*scene16

[b]下から6段目[/b]まで爆風が届く。[p]

[b]一番上以外は全部[/b]ということだね。[p]

それぞれのナベの耐久値は60だから[r]
ボム2個で一番上のナベ以外は全部[r]
吹き飛ぶ、ということになる。[p]

ずいぶん広いだろう？　なんと[r]
[b]バクダンの弱点部分[/b]にも[r]
爆風ダメージは届くぞ。[p]

爆風の30ダメージというのは[r]
思った以上に貧弱で、[p]

これではコジャケも倒せないし、[r]
シャケコプターも倒せない。[p]

とはいえ、[b]タワー[/b]を削ったり、[r]
[b]バクダン[/b]をわずかに削ったり、[r]
テッパンのターゲットを取ったり、[p]

[b]味方の浮き輪[/b]も爆風一発で助けたり[r]
できる。[p]

うまく使えると楽しいな！[p]








そして、使うインクの量。[p]

バイト専用のスプラッシュボムは[r]
[b]インクをどれくらい使う[/b]だろう？[l][r]
全回復した状態を100%として、

[glink target=*scene1 color=shake height=100 width=400 text=75%]
[glink target=*scene2 color=shake height=100 width=400 text=70% exp="f.a=70"]
[glink target=*scene2 color=shake height=100 width=400 text=65% exp="f.a=65"]
[glink_show time=500]
[s]

*scene1

正解！75%だ。[p]

[jump target=*scene3]
*scene2

……[emb exp=f.a]%かい？[p]

ふふ、意外と間違いやすいんだ。[p]

正解は、75%。[p]

バイト専用のスプラッシュボムは[r]

[jump target=*scene3]
*scene3

4分の3のインクを使うと思うと、[r]
なかなか贅沢なしろものだ。[p]

なぜなら、[r]
ほとんどのメインウェポンは、[p]

それだけのインクがあれば、[r]
2000以上のダメージを[r]
与えることができるからだ。[p]

……ホクサイ？[l][r]
ふむ、しらない子だな。[p]






次に、インク回復について。[p]

何もせず[b]ただ立っているだけ[/b]で[r]
キミのインクタンクは[r]
[b]10秒[/b]でゼロから満タンになる。[p]

[b]インクにセンプク[/b]していれば、[r]
もっと早い。[r]
[b]3秒[/b]で満タンになる。[p]

ボム1個分＝75%のインクが[r]
回復するのには、[r]
[b]2.25秒[/b]かかる計算だ。[p]

じゃあ、[r]
キミは2.25秒に1回のペースで[r]
ボムを投げることができるか？[p]

……というと、じつはできない。[p]
なぜなら、[r]
[b]インクロック[/b]があるからだ。[p]

スプラッシュボムを投げた後には[r]
[b]インクが回復しなくなる時間[/b][r]
というのがあるんだ。[p]

これが、インクロック。[p]

さて、ではスプラッシュボムの[r]
インクロックの時間は？[l]

[glink target=*scene5 color=shake height=100 width=400 text=1.5秒]
[glink target=*scene4 color=shake height=100 width=400 text=1秒]
[glink target=*scene5 color=shake height=100 width=400 text=0.5秒]
[glink_show time=500]
[s]

*scene4

1秒……？[p]

……ファイナルアンサー？[l][r]
なんてね。[p]

1秒、正解だ。[p]

[jump target=*scene6]
*scene5

……おしい！[p]

でもイイセンいってるぞ！[r]
正解は1秒だ。[p]

[jump target=*scene6]
*scene6

つまりボムで消費したインクを[r]
取り戻すには、2.25+1で、[r]
[b]3.25秒[/b]かかるわけだな。[p]

ここで、[b]インクの余剰回復[/b]、[r]
という言葉を出してみよう。[p]

キミのインクタンクは[r]
3秒で満タンになると言ったが……[p]

タンクが満タンになったら、[r]
いくらセンプクしてもそれ以上[r]
インクが増えることはない。[p]

これを[b]インクの余剰回復[/b]という。[l][r]
これはちょっと損なことなんだ。[p]

さて、さっきボム分のインクは[r]
3.25秒で取り戻せるといったね。[p]

だから、もしキミが、[r]
[b]インクが満タン[/b]の状態で[r]
[b]3秒間センプク[/b]していたら、[p]

それはだいたい[b]ボム1個分の[r]
インクを余剰回復している[/b]、[r]
ということになるんだ。[p]

シャケが寄るのを待つとき、[r]
イクラを拾って帰るとき……[p]

3秒間センプクするだけなら、[r]
とりあえず[b]ザコシャケに向かって[r]
ボムを投げておく[/b]といいだろう。[p]

そうすることで、[r]
キミはインクの余剰回復をなくし[r]
効率よくインクを消費できる。[p]

ただし、これはあくまで[r]
「何もしないくらいなら」[r]
という話で、[p]

他にインクを使うことがあるなら[r]
無理にボムを投げる必要はない。[p]

あんまり適当に投げていると[r]
むしろインクを大損してしまうから[r]
気をつけることだ。[p]

……難しいな！[p]
[s]