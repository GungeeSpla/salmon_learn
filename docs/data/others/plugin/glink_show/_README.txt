========== ========== ========== ==========
     [glink_show]タグ追加プラグイン
========== ========== ========== ==========

【最終更新日】2018/01/04 23:12
【  名  称  】[glink_show]タグ追加プラグイン
【  種  別  】ティラノスクリプト用の外部プラグイン
【 製 作 者 】荻原（おぎはら）
【 開発環境 】64bit版Windows10, ティラノスクリプトv460, ティラノライダーv200 
【 動作環境 】上記開発環境にて確認
【 連 絡 先 】Twitterまでどうぞ（@tempura17654）
【 配 布 元 】http://tempura9357.blog.fc2.com
【ライセンス】MIT

---------- ----------



◇ 概要 ◇

ティラノスクリプトのグラフィカルリンク（[glink]タグで出すやつ）を
その個数に応じて自動で画面に並べる機能を持つ独自タグ[glink_show]を
ティラノスクリプトに追加するプラグインです。

また上記タグの追加に伴って、[glink]タグにvisible属性を追加し、
visible=falseを指定することでグラフィカルリンクを
「非表示状態で出す」ことができるようにしています。



◇ ファイル構成 ◇

glink_show
 ├ glink_show.js
 ├ init.ks
 ├ _SAMPLE.ks
 └ _README.txt



◇ 導入方法 ◇

解凍して出てきた「glink_show」フォルダを、
「data/others/plugin/」下にコピーしてください。
その後、first.ksに以下のタグを記述してください。

    [plugin name=glink_show]



◇ pluginタグに指定できるパラメータ ◇

-



◇ タグリファレンス ◇

◆ [glink_show] グラフィカルリンクの自動配置及び表示
    
    |概要
    直前に配置した任意の数のグラフィカルリンクを自動で画面中央に並べ直し、
    さらにアニメーション効果付きで表示します。
    
    |指定できるパラメータ
    dx          : ボタン全体を横方向に一定量ずらすことができます。pxで指定します。
    dy          : ボタン全体を縦方向に一定量ずらすことができます。pxで指定します。
    margin      : 個々のボタンを並べるときの余白をpxで指定します。デフォルトは20。
    slip        : 個々のボタンを並べるときの垂直方向のずれをpxで指定します。デフォルトは0。
    wait        : アニメーションの完了を待つか否かをtrueかfalseで指定できます。デフォルトはtrueです。
    time        : アニメーションにかかる時間をミリ秒で指定できます。デフォルトは1000です。
    delay       : 個々のボタンのアニメーションに生じる遅延をミリ秒で指定できます。
    method      : アニメーション効果を指定できます。none/fadeIn/crossIn/crossInBig/
                : puffIn/puffInDown/fadeInLeft/fadeInRight/fadeInUp/fadeInDown/
                : fadeInLeftBig/fadeInRightBig/fadeInUpBig/fadeInDownBigが指定できます。
                : デフォルトはpuffInです。
    vertical    : trueで縦並び、falseで横並び。デフォルトはtrueです。
    centering   : trueでセンタリングが有効、falseで無効。デフォルトはtrueです。
    fadein      : trueでフェードインが有効、falseで無効。デフォルトはtrueです。
    
    |サンプルコード
    [plugin name=glink_show]
    [glink target=*scene1 text=シーン1 visible=false]
    [glink target=*scene2 text=シーン2 visible=false]
    [glink target=*scene3 text=シーン3 visible=false]
    [glink_show]
    [s]



◇ FAQ・既知のバグ等 ◇

-



◇ 履歴 ◇

2018/01/04 22:02 配布開始
2018/01/04 23:12 dx･dyパラメータを指定した際puffInアニメーションがおかしくなる問題を修正