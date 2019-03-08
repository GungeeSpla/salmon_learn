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


;=======================================
*Title
;=======================================
[layopt layer=0 visible=true]
[layopt layer=1 visible=true]
[layopt layer=message0 visible=false]

[bg time=0 storage=black.png]
[ptext layer=0 text=-間欠泉当て- size=40 x=200 y=20]
[glink text=ポラリス通常水位 x=60 y=100 width=300 target=Init exp="f.target='Define_Porarisu_Tsujo_Kanketsu'"]
[glink text=満潮             x=440 y=100          target=Init exp="f.target='Define_Porarisu_Mancho_Kanketsu'"]
[s]
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
[button fix=true graphic=suimyaku.png x=50  y=20 target=Suimyaku name=fixbutton]
[button fix=true graphic=kotae.png    x=250 y=20 target=Kotae    name=fixbutton]
[button fix=true graphic=joseki.png   x=450 y=20 target=Joseki   name=fixbutton cond="f.target == 'Define_Porarisu_Tsujo_Kanketsu'"]
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
[glink text=とりあえず二つ開けるやつ x=60  y=400 width=450 target=Restart exp="f.random = false; f.joseki='Joseki_A'"]
[glink text=Fから開けるやつ          x=60  y=500 width=450 target=Restart exp="f.random = false; f.joseki='Joseki_B'"]
[s]

;=======================================
*Joseki_B
;=======================================

[cm]
[iscript]
f.joseki = "Joseki_B"
[endscript]

[k_button  k=F target=Joseki_B_1]
[yajirushi k=F]
[s]

*Joseki_B_1
[k_check][jump cond=f.atari target=Atari][cm]
[if exp="isBrother('F', f.answer)"]
    [yajirushi_move k=C]
    [k_button       k=C target=Joseki_B_3]
[else]
    [yajirushi_move k=B]
    [k_button       k=B target=Joseki_B_2]
[endif]
[s]

*Joseki_B_2
[k_check][jump cond=f.atari target=Atari][cm]
[if exp="isBrother('B', f.answer)"]
    [yajirushi_move k=A]
    [k_button       k=A target=Kakutei]
[else]
[endif]
[s]

*Joseki_B_3
[k_check][jump cond=f.atari target=Atari][cm]
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=D]
    [k_button       k=D target=Joseki_B_4]
[else]
    [yajirushi_move k=G]
    [k_button       k=G target=Kakutei]
[endif]
[s]

*Joseki_B_4
[k_check][jump cond=f.atari target=Atari][cm]
[if exp="isBrother('C', f.answer)"]
    [yajirushi_move k=E]
    [k_button       k=E target=Kakutei]
[else]
[endif]
[s]



;=======================================
*Joseki_A
;=======================================

[cm]
[iscript]
f.joseki = "Joseki_A"
[endscript]

[k_button  k=F target=Joseki_A_1a]
[yajirushi k=F]
[k_button  k=G target=Joseki_A_1b]
[yajirushi k=G]
[s]

;F開け
*Joseki_A_1a
[free layer=1 name=F]
[k_check][jump cond=f.atari target=Atari][cm]
[k_button  k=G target=Joseki_A_2]
[s]

;G開け
*Joseki_A_1b
[free layer=1 name=G]
[k_check][jump cond=f.atari target=Atari][cm]
[k_button  k=F target=Joseki_A_2]
[s]

;どっちも開けた
*Joseki_A_2
[iscript]
f.F = isBrother('F', f.answer);
f.G = isBrother('G', f.answer);
[endscript]
[k_check][jump cond=f.atari target=Atari][cm]
[if    exp="f.F && !f.G"]
    [yajirushi_move k=C]
    [k_button       k=C target=Joseki_A_3]
[elsif exp="f.F && f.G"]
    [yajirushi_move k=E]
    [k_button       k=E target=Kakutei]
[elsif exp="!f.F && f.G"]
    [yajirushi_move k=A]
    [k_button       k=A target=Kakutei]
[elsif exp="!f.F && !f.G"]
    [yajirushi_move k=B]
    [k_button       k=B target=Kakutei]
[endif]
[s]

*Joseki_A_3
[k_check][jump cond=f.atari target=Atari][cm]
[yajirushi_move k=D]
[k_button       k=D target=Kakutei]
[s]

*Kakutei
[k_check][jump target=Atari]
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
[jump cond=f.atari target=Atari]
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
*Define_Porarisu_Tsujo_Kanketsu
;=======================================
[iscript]
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