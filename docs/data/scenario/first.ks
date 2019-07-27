[eval exp="console.log('first.ks')"]
[eval exp="console.log('Live2Dプラグイン')"]
[call storage="live2d/live2d.ks"]
[eval exp="console.log('その他プラグイン')"]
[plugin name=for]
[plugin name=glink_show]
[plugin name=html2canvas_update]
[iscript]
fixFitBaseSize();
console.log(queries);
[endscript]
[eval exp="console.log('learn.ksにジャンプ')"]
[jump storage=learn.ks]
[s]