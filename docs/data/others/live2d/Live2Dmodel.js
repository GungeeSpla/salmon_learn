// プリロードするモーショングループ
// (尺が長いモーションは事前ロードするのでmodel.jsonのidleグループに入れて下さい)
var PRELOAD_GROUP = "idle";

// Live2Dモデルの配列
var LIVE2D_MODEL = [];

// Live2Dモデル（ikachan）
LIVE2D_MODEL['ikachan'] = {
    "filepath":"data/others/live2d/assets/ikachan/",
    "modeljson":"ikachan.model.json"
};