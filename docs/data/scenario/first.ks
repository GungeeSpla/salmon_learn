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
[endscript]
[plugin name=for]


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
[image layer=0 x=&f.item.x-60 y=&f.item.y-130 storage=kanketsu_sen.png zindex=1]
[ptext layer=0 x=&f.item.x-25 y=&f.item.y+15 edge=0x000000 text=&f.item.label size=24 color=0x2AD600 bold=bold align=center width=50]
[nextfor]
[button fix=true graphic=suimyaku.png x=40 y=20 target=Suimyaku name=fixbutton]
[mask_off time=300]
[jump target=Start]

;=======================================
*Suimyaku
;=======================================
[iscript]
$(".suimyaku").fadeToggle(300);
[endscript]
[return]

;=======================================
*Start
;=======================================
[iscript]
f.choice = "";
var r = Math.floor(Math.random() * f.kanketsusen.length)
f.answer = f.kanketsusen[r].label;
[endscript]

[foreach name=f.item array=f.kanketsusen]
[button graphic=toumei.png width=80 height=80 x=&f.item.x-40 y=&f.item.y-40 preexp=f.item.label exp="f.choice=preexp" target=*Check]
[nextfor]
[s]

;=======================================
*Check
;=======================================
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

; 描画
[image layer=1 x=&f.item.x-60 y=&f.item.y-130 storage=&f.storage zindex=&f.zindex]
[jump cond=f.atari target=Atari]
[s]

;=======================================
*Atari
;=======================================
[cm]
[iscript]
$(".fixbutton").hide();
[endscript]
[image layer=1 storage=atari.png x=0 y=0]
[button graphic=modoru.png x=40 y=730 target=*Retitle]
[button graphic=mouikkai.png   x=340 y=730 target=*Restart]
[s]

;=======================================
*Restart
;=======================================
[cm]
[iscript]
$(".fixbutton").show();
[endscript]
[freelayer layer=1]
[jump target=Start]

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