;=======================================
*Title
;=======================================
[call target=Define]

[layopt layer=0 visible=true]
[layopt layer=1 visible=true]
[layopt layer=message0 visible=false]

[bg time=0 storage=black.png]

[image layer=0 x=50 y=20 storage=goldie.png width=60]
[image layer=0 x=40 y=480 storage=komori.png width=90]
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
[ptext layer=0 text=※定石未実装 size=20 x=510 y=185]
[ptext layer=0 text=※定石未実装 size=20 x=510 y=325]

[iscript]
var s = location.search;
f.bool = (s.indexOf("test") > -1);
[endscript]
;[if exp=f.bool]
[ptext layer=0 text=コウモリマップ size=40 x=120 y=500 bold=bold]
[ptext layer=0 text=シェケナダム size=30 x=60 y=585]
[ptext layer=0 text=シャケト場   size=30 x=60 y=655]
[glink text=通常 x=270 y=580 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Damu_Tsujo_Komori'"]
[glink text=通常 x=270 y=650 size=25 color=tsujo  target=*InitKomori exp="f.target='Define_Toba_Tsujo_Komori'"]
;[endif]
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
[ptext layer=0 color=0x000000 text=イカやコウモリのアイコンをタップで動かせます。赤の矢印はコウモリがいったん攻撃態勢に入り雨弾を2回射出してからその方向へ飛ぶことを、青の矢印はコウモリが攻撃態勢に入らず速やかに飛んでくることを意味します。 size=20 x=40 y=10 width=570]
[foreach name=f.item array=f.kanketsusen]
[image layer=0 x=&f.item.x-f.radius y=&f.item.y-f.radius width=&f.radius*2 height=&f.radius*2 storage=komori_circle.png zindex=1 name="&'komori_circle,'+f.item.label"]
[image layer=0 x=&f.item.x-11 y=&f.item.y-11 storage=komori_parking.png zindex=2]
[ptext layer=0 x=&f.item.x-26 y=&f.item.y+5 edge=0x000000 text=&f.item.label size=24 color=0x22DDCC bold=bold align=center width=50]
[nextfor]
[iscript]
f.kPos = getKomoriPos(f.komoriLabel);
[endscript]
[image layer=0 zindex=1 x=0 y=0 storage=&f.suimyaku name=suimyaku]
[image layer=1 zindex=200 x=250 y=400 storage=ika.png width=40 name=ika]
[image layer=1 zindex=100 x="&f.kPos.x-f.komoriDx" y="&f.kPos.y-f.komoriDy" storage=komori.png width=50 name=komori]
[button fix=true graphic=tobasu.png  x=220 y=800 target=*KomoriTobasu name=fixbutton]
[button fix=true graphic=keiro.png   x=40  y=800 target=*Suimyaku     name=fixbutton]
[button fix=true graphic=modoru2.png x=440 y=800 target=*KomoriTitle  name=fixbutton]
[mask_off time=300]
;[call target=Set_Kotae]
;[jump target=Start]
[iscript]
var timer;
$(".ika").appendTo("#tyrano_base").draggable({
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
    var dis = getDisIkaKomori(f.komoriLabel);
    var next = getKomoriNextLabel(f.komoriLabel);
    ctx.clearRect(0, 0, 640, 960);
    ctx.fillStyle = (dis < f.radius) ? "Red" : "Blue";
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
$(".komori").remove();
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
    [yajirushi_move k=E]
    [k_button       k=E target=*BaTK_Joseki_B_2]
[else]
    [yajirushi_move k=C]
    [k_button       k=C target=*BaTK_Joseki_B_4]
[endif]
[s]

*BaTK_Joseki_B_2
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('E', f.answer)"]
    [yajirushi_move k=F]
    [k_button       k=F target=*BaTK_Joseki_B_3]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*Kakutei]
[endif]
[s]

*BaTK_Joseki_B_3
[k_check][jump cond=f.atari target=*Atari][cm]
[yajirushi_move k=I]
[k_button       k=I target=*Kakutei]
[s]

*BaTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=*BaTK_Joseki_B_5]
[else]
    [yajirushi_move k=D]
    [k_button       k=D target=*Kakutei]
[endif]
[s]

*BaTK_Joseki_B_5
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
    [yajirushi_move k=C]
    [k_button       k=C target=*PoTK_Joseki_B_3]
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
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=*PoTK_Joseki_B_4]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=*Kakutei]
[endif]
[s]

*PoTK_Joseki_B_4
[k_check][jump cond=f.atari target=*Atari][cm]
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=E]
    [k_button       k=E target=*Kakutei]
[else]
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
[free layer=1 name=yajirushi]
[iscript]
$(".fixbutton").hide();
[endscript]
[image layer=1 storage=atari.png x=0 y=0]

[glink text=もう1回               x=60  y=680 width=450 target=Restart]
[glink text=答えを指定してもう1回 x=60  y=760 width=450 target=RestartB]
[glink text=もどる                x=60  y=840 width=450 target=Retitle]
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
[mask time=300]
[bg time=0 storage=black.png]
[freelayer layer=0]
[freelayer layer=1]
[mask_off time=300]
[jump target=Title]
[s]

;=======================================
*Define
;=======================================

[iscript]
f.ikaDx = 30;
f.ikaDy = 30;
f.komoriDx = 30;
f.komoriDy = 35;
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
var $canvas = $("<canvas width='640' height='960' style='position: absolute; z-index: 10;'></canvas>");
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
window.getIkaPos = function () {
    var $ika = $(".ika");
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
window.getDisIkaKomori = function (label) {
    var iPos = getIkaPos();
    var kPos = getKomoriPos(label);
    return calcDistance(iPos, kPos);
};
window.getKomoriNextLabel = function (label) {
    var iPos = getIkaPos();
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

[plugin name=for]
[plugin name=glink_show]
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
*Define_Damu_Tsujo_Komori
;=======================================
[iscript]
f.radius = 207;
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
    ["各方面の先端から開けるやつ", "f.random = false; f.joseki='BaTK_Joseki_A'"],
    ["Hから開ける最少手数のやつ", "f.random = false; f.joseki='BaTK_Joseki_B'"]
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
    ["Eから開けるやつ", "f.random = false; f.joseki='SheTK_Joseki_A'"]
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