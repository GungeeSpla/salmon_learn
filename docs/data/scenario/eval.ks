*start

[iscript]
if (! f.rotation_index) f.rotation_index = 0;
f.data = ROTATION_DATA[f.rotation_index];
[endscript]

[call target=init_macro   storage=scene.ks]
[call target=init_setting storage=scene.ks]
[eval exp="tf.debug = true"]

[mw_on]
[free  layer=message0 name=name]
[image layer=message0 left=30 top=648 zindex=10000 storage=name_hatena.png name=name]


ステージは[r]
[b][emb exp="f.data.stage_ja"][/b]…
[p]

支給ブキは[r]
[b]●[emb exp="f.data.w1_ja"][/b][r]
[b]●[emb exp="f.data.w2_ja"][/b]
[p]

[b]●[emb exp="f.data.w3_ja"][/b][r]
[b]●[emb exp="f.data.w4_ja"][/b][r]
…だね。
[p]
[s]