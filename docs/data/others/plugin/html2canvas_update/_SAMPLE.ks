; プラグイン読み込み
[plugin name=html2canvas_update]
; 動作チェッカーでこのサンプルを見ている場合、上の行を削除してから
;「強制再実行」ボタンを押すことで、プラグインを読み込まなかった場合のサンプルを
; 見ることができます。


; セーブデータ削除
[eval exp=localStorage.clear()]


; メニューボタンを隠してセーブボタンを出す
[hidemenubutton]
[button role=save graphic=../../tyrano/images/system/button_menu.png x=455 y=470]


; 背景と立ち絵を出す
[bg storage=room.jpg time=0]
[image name=akane layer=0 x=0 y=50 storage=chara/akane/normal.png]
[layopt layer=0 visible=true]
[position width=920 height=161 top=451 left=20 margint=45 marginl=10 marginr=20 marginb=10 vertical=false opacity=180 color=0x000000]
[delay speed=1]


～html2canvasアップデートプラグイン～[r]
メッセージウィンドウ中央のボタンからセーブしてみてください。[p]


kanim中…kanimがサムネイルに反映されるかテストしてください。
[keyframe name=hoge]
[frame p=0% x=0]
[frame p=100% x=600 y=-200 rotate=180deg scale=0.5]
[endkeyframe]
[kanim name=akane keyframe=hoge time=1000 count=1]
[p][stop_kanim name=akane]


glink中…glinkがサムネイルに反映されるかテストしてください。
[glink color=blue size=20 x=260 width=400 y=100 text=a target=*after ]
[glink color=blue size=20 x=260 width=400 y=170 text=b target=*after ]
[glink color=blue size=20 x=260 width=400 y=240 text=c target=*after ]
[s]


*after
camera中…cameraがサムネイルに反映されるかテストしてください。
[camera layer=base x=50   y=50 zoom=1.0 rotate=-30 time=300 wait=false]
[camera layer=0    x=-300 y=50 zoom=2.0 rotate=30  time=300]
[wait_camera]
[p]



[reset_camera time=0 layer=base]
[reset_camera time=0 layer=0]
wait=falseでcamera中…変化している最中のcameraがサムネイルに反映されるかテストしてください。
[camera x=-100 y=-100 zoom=0.6 rotate=180 time=20000 wait=false]
[l]


[s]