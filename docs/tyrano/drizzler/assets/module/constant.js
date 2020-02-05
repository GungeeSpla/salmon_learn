/** - 全般設定 -
 */
// フレームレート（リアルタイムモード時）
export const FRAME_RATE = 60;
// フレームレート（非リアルタイムモード時）
export const FRAME_RATE_NOT_RT = 30;
// キャンバスの横幅
export const CANVAS_WIDTH = 640;
// キャンバスの高さ
export const CANVAS_HEIGHT = 960;
// キャンバスの中央X座標
export const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
// キャンバスの中央Y座標
export const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
// キャンバスの背景色
export const BACKGROUND_COLOR = '#f2f2f2';
// キャンバスのレイヤー
export const CANVAS_LAYERS = [
  'course', 'drizzler', 'tool',
];
// StageGLを利用するか
export const IS_STAGEGL = false;

/** - ボロノイ図 -
 */
// ボロノイ図の不透明度
export const VORONOI_ALPHA = 0.25;
// ボロノイ図の配色
export const VORONOI_COLORS = [
  [255, 255, 1],
  [255, 1, 255],
  [1, 255, 255],
  [255, 1, 1],
  [1, 1, 255],
  [1, 255, 1],
  [255, 127, 1],
  [1, 255, 127],
  [127, 1, 255],
  [127, 255, 1],
  [1, 127, 255],
  [255, 1, 127],
];

/** - ゴミ箱 -
 */
export const TRASH_IMAGE_CLOSE = 'assets/piece/trash-close.png';
export const TRASH_IMAGE_OPEN = 'assets/piece/trash-open.png';
export const TRASH_TOP = 0;
export const TRASH_LEFT = 0;
export const TRASH_WIDTH = 100;
export const TRASH_HEIGHT = 100;
export const TRASH_NATURAL_WIDTH = 100;
export const TRASH_NATURAL_HEIGHT = 100;

/** - コウモリマップ -
 */
export const PARK_RADIUS = 13;
export const PARK_COLOR = '#2196f3';
export const PARK_FONT_SIZE = 20;
export const PARK_FONT_STYLE = `bold ${PARK_FONT_SIZE}px sans-serif`;
export const PARK_FONT_COLOR = '#ffffff';
export const SIDE_WIDTH = 2;
export const SIDE_COLOR = '#00bcd4';

/** - グラフィックその他 -
 */
export const CLEAR_COLOR = '#ffffff';
export const BORDER_WIDTH = 1;
export const BORDER_COLOR = '#ffffff';
export const STROKE_LINECAP = 'round';

/** - 矢印 -
 */
export const ARROW_WIDTH = 2;
export const ARROW_STROKE_WIDTH = 8;
export const ARROW_COLOR = '#aaa485';
export const ARROW_STROKE_COLOR = '#605b3e';

/** - イカ -
 */
export const SQUID_IMAGE = 'assets/piece/squid.png';
export const OCTA_IMAGE = 'assets/piece/octa.png';
export const SQUID_MAX_NUM = 4;
export const SQUID_WIDTH = 50;
export const SQUID_HEIGHT = 50;
export const SQUID_NATURAL_WIDTH = 128;
export const SQUID_NATURAL_HEIGHT = 128;
export const SQUID_REG_X = SQUID_NATURAL_WIDTH / 2;
export const SQUID_REG_Y = SQUID_NATURAL_HEIGHT / 2;
export const SQUID_SCALE = SQUID_WIDTH / SQUID_NATURAL_HEIGHT;

/** - コウモリ -
 */
export const DRIZZLER_IMAGE = 'assets/piece/drizzler.png';
export const DRIZZLER_WIDTH = 60;
export const DRIZZLER_HEIGHT = 60;
export const DRIZZLER_NATURAL_WIDTH = 128;
export const DRIZZLER_NATURAL_HEIGHT = 128;
export const DRIZZLER_REG_X = DRIZZLER_NATURAL_WIDTH / 2;
export const DRIZZLER_REG_Y = DRIZZLER_NATURAL_HEIGHT / 2;
export const DRIZZLER_SCALE = DRIZZLER_WIDTH / DRIZZLER_NATURAL_HEIGHT;
export const DRIZZLER_POS_BG_COLOR = '#d8d4c7';
export const DRIZZLER_POS_TEXT_COLOR = '#28331f';
export const DRIZZLER_TWEEN_BASE_D = 100;
export const DRIZZLER_TWEEN_TIME_MIN = 100;
export const DRIZZLER_TWEEN_TIME = 300;
export const DRIZZLER_TWEEN_EASE = 'cubicOut';
export const DRIZZLER_CIRCLE_COLOR = 'rgb(180, 230, 255)';
export const DRIZZLER_CIRCLE_STROKE_COLOR = 'rgb(180, 230, 255)';
export const DRIZZLER_CIRCLE_STROKE_WIDTH = 1;
// コウモリのスポーン時の透明度
export const DRIZZLER_ALPHA_WHEN_SPAWN = 0.3;
// コウモリの攻撃回数
export const DRIZZLER_ATTACK_NUM = 2;
// コウモリの索敵範囲
export const DRIZZLER_CIRCLE_RADIUS = 322;
// コウモリの体力
export const DRIZZLER_HP = 900;
// コウモリがひっくり返っているフレーム
export const DRIZZLER_HEADSTAND_FRAME = 180;
// コウモリが飛行するのにかかるフレーム
export const DRIZZLER_FLY_FRAME = 180;
// コウモリが攻撃態勢に入ることが確定してから弾を撃つまでの待機フレーム
export const DRIZZLER_ATTACK_PREPARATION_FRAME = 220;
// コウモリが飛翔耐性に入ることが確定してから飛びたつまでの待機フレーム
export const DRIZZLER_FLY_PREPARATION_FRAME = 80;
// コウモリが受けるデフォルトダメージ
export const DRIZZLER_DEFAULT_DAMAGE = 85;

/** - ロケット -
 */
export const ROCKET_IMAGE = 'assets/piece/rocket.png';
export const ROCKET_MEAT_IMAGE = 'assets/piece/rocket-meat.png';
export const ROCKET_WIDTH = 40;
export const ROCKET_HEIGHT = 40;
export const ROCKET_NATURAL_WIDTH = 128;
export const ROCKET_NATURAL_HEIGHT = 128;
export const ROCKET_REG_X = ROCKET_NATURAL_WIDTH / 2;
export const ROCKET_REG_Y = ROCKET_NATURAL_HEIGHT / 2;
export const ROCKET_SCALE = ROCKET_WIDTH / ROCKET_NATURAL_HEIGHT;
// コウモリが乗り越えられるzMapの段差
export const ROCKET_DEAD_SLIP = 35;
// コウモリの初速を何倍にするか
export const ROCKET_INITIAL_VELOCITY_RATIO = 2;
// ロケットの射程
export const ROCKET_RANGE = 180;
// ロケットをはじき返したときの速度
export const ROCKET_TURN_SPEED = 250;
// ロケットをはじき返したときに消失するまでの時間
export const ROCKET_TURN_FRAME = 50;
// ロケットの耐久値
export const ROCKET_HP = 100;
// ロケットの弾ブレの角度
export const ROCKET_SHAKE_DEGREE = 40;
// 雨が降るまでの時間
export const ROCKET_WAIT_DIE_FRAME = 140;
// ロケットが目的地に飛ぶのにかかる時間(アーマーが外れるまでの時間でもある）
export const ROCKET_MOVE_FRAME = 60;

/** - HPバー -
 */
export const HP_BAR_BORDER_COLOR = '#000000';
export const HP_BAR_COLOR = '#00ff00';
export const HP_BAR_BORDER_WIDTH = 2;
export const HP_BAR_MARGIN = 34;
export const HP_BAR_WIDTH = 40;
export const HP_BAR_HEIGHT = 10;

/** - 敵駒 -
 */
export const ENEMY_PIECE_DATA = {
  steelhead: { range: 186, blast: 51 },
  scrapper: {},
  maws: {},
  stinger: {},
  flyfish: {},
  goldie: {},
  chum: {},
};
export const ENEMY_PIECE_NATURAL_WIDTH = 128;
export const ENEMY_PIECE_WIDTH = 50;
export const ENEMY_PIECE_CIRCLE_COLORS = [
  'rgb(150,220,150)',
  'rgb(217,255,217)',
  'rgb(217,255,217)',
];

/** - ブキ -
 */
export const WEAPON_WIDTH = 50;
export const WEAPON_HEIGHT = 50;
export const WEAPON_NATURAL_WIDTH = 128;
export const WEAPON_NATURAL_HEIGHT = 128;
export const WEAPON_HANDLE_COLOR = 'rgba(170, 170, 170, 0.7)';
export const WEAPON_HANDLE_MARGIN = 2;
export const WEAPON_CIRCLE_RATIO = 220 / 44;
export const WEAPON_CIRCLE_COLORS = [
  'rgb(255,160,255)',
  'rgb(255,200,255)',
  'rgb(255,200,255)',
];

/** - ブキ･敵駒の追加ツール -
 */
export const ADDTOOL_WIDTH = 64;
export const ADDTOOL_TOP = 30;
export const ADDTOOL_LEFT = 30;
export const ADDTOOL_MARGIN = 20;
export const ADDTOOL_COLUMN_NUM = 7;

/** - その他 -
 */
export const CHAR_CODE_OF_A = ('A').charCodeAt();
export const DO_LOG_CLICK_POS = false;
export const DO_LOG_OBJECT_COUNT = false;
export const LOG_OBJECT_COUNT_INTERVAL = 120;
export const IS_DRAGGABLE_PARK = false;
export const BOSS_ONE_KIND_MAX_NUM = 3;
export const ONE_WAVE_SECONDS = 100;
export const LEFT_TIME_FONT_STYLE = 'bold 30px sans-serif';
export const LEFT_TIME_X = 20;
export const LEFT_TIME_Y = 20;
export const RTMODE_WAVE_START_SECONDS = 1;
export const RTMODE_WAVE_START_FRAME = Math.floor(RTMODE_WAVE_START_SECONDS * FRAME_RATE);

/** - コースデータ -
 */
export const COURSE_DATA = {

  /** - シェケナダム -
   */
  shekenadamu: {

    /** - 通常 -
     */
    normal: {
      parks: [
        [279, 425], [380, 248], [533, 257], [436, 458], [564, 513], [284, 605],
        [212, 692], [105, 670], [67, 479], [23, 392], [133, 358], [41, 265],
      ],
      lines: [
        'LK', 'LJ', 'JK', 'IJ', 'IK', 'IA', 'IF', 'IG', 'IH', 'KA', 'AF', 'FG',
        'GH', 'AB', 'BD', 'DA', 'DF', 'FE', 'ED', 'CB', 'CD', 'CE',
      ],
      width: 2000,
      height: 2000,
      scale: 0.73,
      x: 82,
      y: 404,
      rotation: 0,
      homes: [[217, 450], [180, 450], [180, 495], [217, 495]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[257, 896], [150, 828], [43, 785]],
        },
        {
          name: 'kanaami',
          probability: 35,
          vertexes: [[521, 218], [567, 335], [421, 578]],
        },
        {
          name: 'kancho',
          probability: 30,
          vertexes: [[123, 153], [11, 216], [-50, 381]],
        },
      ],
    },

    /** - 満潮 -
     */
    high: {
      excludeParks: ['L', 'J', 'H', 'G', 'B', 'C', 'D'],
      additionalLines: ['EA'],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[87, 499], [126, 547], [225, 547]],
        },
        {
          name: 'kanaami',
          probability: 35,
          vertexes: [[385, 301], [526, 476]],
        },
        {
          name: 'kancho',
          probability: 30,
          vertexes: [[94, 436], [178, 358], [90, 310]],
        },
      ],
    },

    /** - 干潮 -
     */
    low: {
      parks: [
        [317, 356], [535, 270], [490, 443], [309, 568], [156, 472], [80, 266],
        [274, 222], [237, 655], [427, 716], [484, 636],
      ],
      lines: [
        'FE', 'FA', 'GA', 'GE', 'BA', 'BC', 'AE', 'AD', 'AC', 'ED', 'CD', 'DH',
        'DI', 'DJ', 'HI', 'JI',
      ],
      width: 2000,
      height: 2000,
      scale: 0.721,
      x: 303,
      y: 638,
      rotation: 57.5,
      homes: [[340, 390], [290, 390], [290, 435], [340, 435]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[207, 137], [281, 63], [386, 147]],
        },
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[36, 310], [22, 203], [103, 177]],
        },
        {
          name: 'migi',
          probability: 30,
          vertexes: [[502, 231], [577, 207], [633, 308]],
        },
      ],
    },
  },

  /** - 難破船ドン･ブラコ -
   */
  domburako: {

    /** - 通常 -
     */
    normal: {
      parks: [
        [338, 718], [438, 584], [326, 497], [428, 458], [351, 389], [442, 364],
        [393, 319], [511, 255], [149, 635], [232, 566], [101, 536], [232, 360],
        [108, 318], [314, 283], [276, 203], [358, 166], [479, 163], [551, 199],
        [557, 367], [510, 518], [589, 624], [564, 717],
      ],
      lines: [
        'ML', 'KJ', 'IJ', 'LJ', 'JC', 'CA', 'LN', 'ON', 'OP', 'PN', 'PQ', 'QR',
        'QH', 'HR', 'HG', 'GF', 'FH', 'SR', 'SF', 'ST', 'GN', 'NE', 'EG', 'DE',
        'DF', 'DC', 'DB', 'TU', 'UV', 'BA', 'EC', 'BT',
      ],
      width: 2000,
      height: 2000,
      scale: 0.653,
      x: 381,
      y: 647,
      rotation: 0,
      homes: [[341, 717], [367, 738], [408, 738], [448, 717]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[240, 162], [427, 122], [606, 205]],
        },
        {
          name: 'hidari',
          probability: 30,
          vertexes: [[108, 242], [68, 518], [110, 641]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[530, 772], [621, 682], [615, 531]],
        },
      ],
    },

    /** - 満潮 -
     */
    high: {
      excludeParks: ['K', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
      additionalLines: [],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[487, 225], [401, 224], [380, 283]],
        },
        {
          name: 'hidari',
          probability: 30,
          vertexes: [[387, 283], [346, 281], [346, 340]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[486, 225], [474, 322], [477, 405]],
        },
      ],
    },

    /** - 干潮 -
     */
    low: {
      parks: [
        [187, 393], [85, 286], [122, 201], [192, 156], [331, 136], [358, 341],
        [441, 378], [565, 262], [486, 487], [309, 509], [405, 509], [199, 509],
      ],
      lines: [
        'AB', 'BC', 'CD', 'DE', 'EF', 'FA', 'AL', 'AJ', 'JK', 'KG', 'GF', 'GI', 'GH',
      ],
      width: 2000,
      height: 2000,
      scale: 0.591,
      x: 365,
      y: 570,
      rotation: 180,
      homes: [[310, 335], [260, 335], [260, 380], [310, 380]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[272, 86], [333, 72], [380, 108]],
        },
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[123, 140], [58, 191], [26, 246]],
        },
        {
          name: 'migi',
          probability: 30,
          vertexes: [[510, 212], [600, 198], [626, 297]],
        },
      ],
    },
  },

  /** - 海上集落シャケト場 -
   */
  shaketoba: {

    /** - 通常 -
     */
    normal: {
      parks: [
        [423, 542], [370, 500], [292, 563], [286, 694], [238, 677], [100, 743],
        [201, 564], [38, 586], [88, 470], [266, 439], [274, 291], [340, 227],
        [381, 408], [438, 338], [498, 432], [627, 418], [587, 479], [479, 538],
        [573, 559], [495, 675],
      ],
      lines: [
        'FE', 'ED', 'DT', 'TR', 'TS', 'RS', 'RO', 'OQ', 'QR', 'OP', 'RA', 'AB',
        'BC', 'CG', 'GE', 'EH', 'HG', 'HI', 'IJ', 'JG', 'JM', 'MB', 'MO', 'ON',
        'LK', 'LN', 'KN', 'KJ', 'NM',
      ],
      width: 2000,
      height: 2000,
      scale: 0.569,
      x: 347,
      y: 613,
      rotation: 0,
      homes: [[337, 505], [337, 530], [370, 530], [370, 505]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[253, 173], [338, 197], [415, 196]],
        },
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[46, 460], [8, 583], [68, 722]],
        },
        {
          name: 'migi',
          probability: 30,
          vertexes: [[647, 437], [632, 501], [606, 573]],
        },
      ],
    },

    /** - 満潮 -
     */
    high: {
      excludeParks: ['I', 'H', 'F', 'E', 'D', 'S', 'Q', 'P', 'N', 'L', 'K'],
      additionalLines: [],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[304, 366], [365, 367], [419, 367]],
        },
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[167, 460], [166, 568], [223, 639]],
        },
        {
          name: 'migi',
          probability: 30,
          vertexes: [[555, 449], [512, 547], [456, 675]],
        },
      ],
    },

    /** - 干潮 -
     */
    low: {
      parks: [
        [273, 479], [186, 472], [101, 276], [278, 330], [272, 197], [508, 255],
        [539, 380], [433, 479], [345, 606], [217, 592], [266, 623], [542, 602],
      ],
      lines: [
        'DE', 'DC', 'DB', 'DA', 'DH', 'DF', 'CB', 'BA', 'AH', 'HG', 'GF', 'AJ',
        'AI', 'BJ', 'JK', 'KI', 'IH', 'HL', 'HI',
      ],
      width: 2000,
      height: 2000,
      scale: 0.737,
      x: 461,
      y: 709,
      rotation: 180,
      homes: [[315, 431], [365, 431], [365, 478], [315, 478]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[218, 116], [273, 115], [315, 116]],
        },
        {
          name: 'hidari',
          probability: 30,
          vertexes: [[46, 218], [78, 217], [108, 217]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[452, 118], [537, 121], [577, 121]],
        },
      ],
    },
  },

  /** - トキシラズいぶし工房 -
   */
  tokishirazu: {

    /** - 通常 -
     */
    normal: {
      parks: [
        [359, 518], [234, 602], [203, 725], [209, 479], [136, 427], [184, 254],
        [278, 279], [351, 240], [423, 257], [490, 312], [555, 371], [560, 469],
        [457, 533], [508, 673],
      ],
      lines: [
        'CB', 'BA', 'AM', 'MN', 'ML', 'LK', 'KJ', 'JM', 'JI', 'IH', 'HG', 'GF',
        'FE', 'ED', 'GD', 'DB',
      ],
      width: 2000,
      height: 2000,
      scale: 0.777,
      x: 539,
      y: 497,
      rotation: 0,
      homes: [[350, 545], [280, 545], [280, 470], [350, 470]],
      spawners: [
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[181, 112], [58, 212], [61, 417]],
        },
        {
          name: 'ura',
          probability: 30,
          vertexes: [[638, 525], [501, 800], [182, 791]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[548, 105], [633, 248], [636, 380]],
        },
      ],
    },

    /** - 満潮 -
     */
    high: {
      excludeParks: ['C', 'E', 'F', 'K', 'L', 'N'],
      additionalLines: [],
      spawners: [
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[219, 169], [161, 209], [178, 290]],
        },
        {
          name: 'ura',
          probability: 30,
          vertexes: [[141, 537], [342, 649], [495, 474]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[506, 169], [566, 237], [540, 316]],
        },
      ],
    },

    /** - 干潮 -
     */
    low: {
      parks: [
        [316, 554], [449, 503], [464, 677], [466, 364], [580, 420], [524, 259],
        [428, 220], [232, 218], [146, 259], [52, 298], [116, 377], [44, 508],
        [164, 522], [214, 435], [251, 677],
      ],
      lines: [
        'GH',
        'HI',
        'IJ',
        'IK',
        'KJ',
        'KL',
        'KN',
        'NM',
        'LM',
        'MO',
        'OC',
        'CB',
        'BA',
        'AN',
        'GF',
        'FD',
        'FE',
        'ED',
        'DB',
        'BE',
      ],
      width: 2000,
      height: 2000,
      scale: 0.777,
      x: 404,
      y: 697,
      rotation: -90,
      homes: [[290, 520], [350, 520], [230, 520], [410, 520]],
      spawners: [
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[70, 90], [140, 90], [210, 90]],
        },
        {
          name: 'chuo',
          probability: 30,
          vertexes: [[220, 90], [320, 90], [420, 90]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[420, 90], [490, 90], [560, 90]],
        },
      ],
    },
  },

  /** - 朽ちた箱舟 ポラリス -
   */
  porarisu: {

    /** - 通常 -
     */
    normal: {
      parks: [
        [272, 471], [157, 514], [220, 408], [243, 323], [186, 268], [52, 260],
        [52, 410], [236, 557], [285, 596], [218, 689], [89, 540], [444, 594],
        [579, 603], [579, 462], [452, 538], [447, 420], [397, 378], [522, 320],
        [494, 198], [370, 195],
      ],
      lines: [
        'TS', 'SR', 'RP', 'PN', 'NM', 'ML', 'LO', 'OP', 'PQ', 'QC', 'CA', 'AO',
        'OI', 'IH', 'HA', 'IL', 'IJ', 'JK', 'KB', 'BC', 'BG', 'GF', 'FE', 'ED',
        'DC', 'DT',
      ],
      width: 2000,
      height: 2000,
      scale: 0.659,
      x: 297,
      y: 648,
      rotation: 0,
      homes: [[367, 455], [307, 455], [307, 510], [367, 510]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[382, 97], [291, 212], [223, 210]],
        },
        {
          name: 'ura',
          probability: 30,
          vertexes: [[262, 717], [71, 641], [67, 482]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[510, 100], [563, 296], [566, 387]],
        },
      ],
    },

    /** - 満潮 -
     */
    high: {
      excludeParks: ['F', 'E', 'D', 'T', 'S', 'R', 'N', 'M', 'L', 'J', 'K', 'B', 'G'],
      additionalLines: [],
      spawners: [
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[197, 456]],
        },
        {
          name: 'ura',
          probability: 30,
          vertexes: [[405, 581]],
        },
        {
          name: 'migi',
          probability: 35,
          vertexes: [[433, 371]],
        },
      ],
    },

    /** - 干潮 -
     */
    low: {
      parks: [
        [276, 422], [412, 420], [339, 533], [448, 591], [580, 521], [577, 411],
        [524, 228], [438, 201], [251, 223], [124, 312], [95, 470], [222, 609],
      ],
      lines: [
        'LC', 'CD', 'DE', 'EC', 'CB', 'BE', 'EF', 'FG', 'GB', 'GH', 'HI', 'IJ',
        'JK', 'KL', 'KA', 'AC', 'AI', 'AB',
      ],
      width: 2000,
      height: 2000,
      scale: 0.584,
      x: 374,
      y: 627,
      rotation: 180,
      homes: [[360, 432], [300, 432], [300, 487], [360, 487]],
      spawners: [
        {
          name: 'shomen',
          probability: 35,
          vertexes: [[223, 161], [353, 110], [483, 148]],
        },
        {
          name: 'hidari',
          probability: 35,
          vertexes: [[170, 161], [61, 281], [30, 417]],
        },
        {
          name: 'migi',
          probability: 30,
          vertexes: [[578, 198], [627, 310], [618, 452]],
        },
      ],
    },
  },
};

/** - ブキデータ -
 */
export const WEAPON_DATA = {
  0: { jp: 'ボールドマーカー', en: 'Sploosh-o-matic', range: 16 },
  10: { jp: 'わかばシューター', en: 'Splattershot Jr.', range: 23 },
  20: { jp: 'シャープマーカー', en: 'Splash-o-matic', range: 24 },
  30: { jp: 'プロモデラーMG', en: 'Aerospray MG', range: 23 },
  40: { jp: 'スプラシューター', en: 'Splattershot', range: 26 },
  50: { jp: '.52ガロン', en: '.52 Gal', range: 28 },
  60: { jp: 'N-ZAP85', en: 'N-ZAP \'85', range: 26 },
  70: { jp: 'プライムシューター', en: 'Splattershot Pro', range: 34 },
  80: { jp: '.96ガロン', en: '.96 Gal', range: 34 },
  90: { jp: 'ジェットスイーパー', en: 'Jet Squelcher', range: 44 },
  200: {
    jp: 'ノヴァブラスター', en: 'Luna Blaster', range: 15, blast: 7,
  },
  210: {
    jp: 'ホットブラスター', en: 'Blaster', range: 21, blast: 7,
  },
  220: {
    jp: 'ロングブラスター', en: 'Range Blaster', range: 28, blast: 7,
  },
  230: {
    jp: 'クラッシュブラスター', en: 'Clash Blaster', range: 19, blast: 7,
  },
  240: {
    jp: 'ラピッドブラスター', en: 'Rapid Blaster', range: 31, blast: 7,
  },
  250: {
    jp: 'Rブラスターエリート', en: 'Rapid Blaster Pro', range: 36, blast: 7,
  },
  300: { jp: 'L3リールガン', en: 'L-3 Nozzlenose', range: 30 },
  310: { jp: 'H3リールガン', en: 'H-3 Nozzlenose', range: 34 },
  400: { jp: 'ボトルガイザー', en: 'Squeezer', range: 41 },
  1000: { jp: 'カーボンローラー', en: 'Carbon Roller', range: 16 },
  1010: { jp: 'スプラローラー', en: 'Splat Roller', range: 25 },
  1020: { jp: 'ダイナモローラー', en: 'Dynamo Roller', range: 31 },
  1030: { jp: 'ヴァリアブルローラー', en: 'Flingza Roller', range: 20 },
  1100: { jp: 'パブロ', en: 'Inkbrush', range: 16 },
  1110: { jp: 'ホクサイ', en: 'Octobrush', range: 21 },
  2000: { jp: 'スクイックリンα', en: 'Classic Squiffer', range: 38 },
  2010: { jp: 'スプラチャージャー', en: 'Splat Charger', range: 52 },
  2020: { jp: 'スプラスコープ', en: 'Splatterscope', range: 56 },
  2030: { jp: 'リッター4K', en: 'E-liter 4K', range: 62 },
  2040: { jp: '4Kスコープ', en: 'E-liter 4K Scope', range: 66 },
  2050: { jp: '14式竹筒銃・甲', en: 'Bamboozler 14 Mk I', range: 43 },
  2060: { jp: 'ソイチューバー', en: 'Goo Tuber', range: 42 },
  3000: { jp: 'バケットスロッシャー', en: 'Slosher', range: 30 },
  3010: { jp: 'ヒッセン', en: 'Tri-Slosher', range: 24 },
  3020: {
    jp: 'スクリュースロッシャー', en: 'Sloshing Machine', range: 30, blast: 3,
  },
  3030: {
    jp: 'オーバーフロッシャー', en: 'Bloblobber', range: 39, blast: 11,
  },
  3040: {
    jp: 'エクスプロッシャー', en: 'Explosher', range: 42, blast: 5,
  },
  4000: { jp: 'スプラスピナー', en: 'Mini Splatling', range: 30 },
  4010: { jp: 'バレルスピナー', en: 'Heavy Splatling', range: 42 },
  4020: { jp: 'ハイドラント', en: 'Hydra Splatling', range: 50 },
  4030: { jp: 'クーゲルシュライバー', en: 'Ballpoint Splatling', range: 50 },
  4040: { jp: 'ノーチラス47', en: 'Nautilus 47', range: 36 },
  5000: { jp: 'スパッタリー', en: 'Dapple Dualies', range: 19 },
  5010: { jp: 'スプラマニューバー', en: 'Splat Dualies', range: 26 },
  5020: {
    jp: 'ケルビン525', en: 'Glooga Dualies', range: 31, blast: 4,
  },
  5030: { jp: 'デュアルスイーパー', en: 'Dualie Squelchers', range: 34 },
  5040: { jp: 'クアッドホッパーブラック', en: 'Dark Tetra Dualies', range: 28 },
  6000: { jp: 'パラシェルター', en: 'Splat Brella', range: 26 },
  6010: { jp: 'キャンピングシェルター', en: 'Tenta Brella', range: 32 },
  6020: { jp: 'スパイガジェット', en: 'Undercover Brella', range: 26 },
  7000: { jp: 'クマサン印のブラスター', en: 'Grizzco Blaster', range: 19 },
  7010: { jp: 'クマサン印のシェルター', en: 'Grizzco Brella', range: 26 },
  7020: { jp: 'クマサン印のチャージャー', en: 'Grizzco Charger', range: 62 },
  7030: {
    jp: 'クマサン印のスロッシャー', en: 'Grizzco Slosher', range: 42, blast: 3,
  },
  8000: {
    jp: 'スプラッシュボム', en: 'Bomb', range: 48, blast: 10,
  },
  8010: {
    jp: 'ボムピッチャー', en: 'Bomb Rush', range: 60, blast: 10,
  },
  8020: { jp: 'ジェットパック', en: 'Inkjet', range: 62 },
  8030: { jp: 'スーパーチャクチ', en: 'Splashdown', range: 29 },
};
