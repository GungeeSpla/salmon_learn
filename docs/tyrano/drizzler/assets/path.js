
(() => {
  /** CONSTANTS
   */
  const CANVAS_WIDTH = 2000;
  const CANVAS_HEIGHT = 2000;
  const DIRS_4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const DIRS_5 = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
  const DIRS_8 = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]];
  const LINE_TYPE_TWOWAY = Symbol('connect');
  const LINE_TYPE_ONEWAY = Symbol('oneway');
  const LINE_TYPE_WALL = Symbol('connect');
  const COLOR_TYPE_EMPTY = Symbol('empty');
  const COLOR_TYPE_UNION = Symbol('union');
  const COLOR_TYPE_VERTEX = Symbol('vertex');
  const COLOR_TYPE_TWOWAY = Symbol('connect');
  const COLOR_TYPE_ONEWAY = Symbol('oneway');
  const COLOR_TYPE_WALL_VERTEX = Symbol('wall-vertex');
  const COLOR_TYPE_WALL_TWOWAY = Symbol('wall-connect');
  const COLOR_TYPES = {
    union: {
      value: COLOR_TYPE_UNION,
      color: [0, 255, 0],
    },
    vertex: {
      value: COLOR_TYPE_VERTEX,
      color: [255, 95, 0],
    },
    connect: {
      value: COLOR_TYPE_TWOWAY,
      color: [255, 167, 0],
    },
    oneway: {
      value: COLOR_TYPE_ONEWAY,
      color: [255, 245, 0],
    },
    wallVertex: {
      value: COLOR_TYPE_WALL_VERTEX,
      color: [0, 160, 255],
    },
    wallConnect: {
      value: COLOR_TYPE_WALL_TWOWAY,
      color: [0, 88, 255],
    },
  };
  const COLOR_TYPES_KEYS = Object.keys(COLOR_TYPES);
  
  /** INSTANCES
   */
  let stage;
  let pathData;
  let $$lines;
  let startVertex;
  // = new Vtx(...START_DEF, 'S');
  let goalVertex;
  // = new Vtx(...GOAL_DEF, 'G');
  
  /** getShortestRoot(rootVertexes, startVertex, goalVertex, allLines)
   */
  const getShortestRoot = (rootVertexes, startVertex, goalVertex, allLines, forStart, forGoal) => {
    rootVertexes.forEach(vertex => {
      vertex.isConnectedStart = false;
      vertex.score = - Infinity;
      vertex.fromVertex = null;
    });
    startVertex.initializeConnects();
    goalVertex.initializeConnects();
    // 直線で行けるならそれが最善ルートとなる
    if (testGoableStraight(startVertex, goalVertex, allLines)) {
      return [startVertex, goalVertex]
    }
    startVertex.createConnects(forStart, true);
    goalVertex.createConnects(forGoal, false);
    if (startVertex.connecteds.length === 0 ||
        goalVertex.connecteds.length === 0) {
      return null;
    }
    return new Explorer(startVertex, goalVertex).go().rootVertexes;
  };
  
  /** Explorer(startVertex, goalVertex)
   */
  const Explorer = function (startVertex, goalVertex) {
    const getScore = (vtxA, vtxB, depth) => {
      const distance = getDistance(vtxA, vtxB);
      const score = - distance;// + depth * 2;
      return score;
    };
    const explore = (vtxA, vtxFrom, scoreFrom, depth) => {
      vtxA.connecteds.forEach(vtxB => {
        // もともと来たところに帰ることはない
        if (vtxB === vtxFrom) {
          return;
        }
        // 距離をもとにスコアを計算
        const score = getScore(vtxA, vtxB, depth) + scoreFrom;
        // スコアを更新したら
        if (score > vtxB.score) {
          //console.log(`スコア更新: ${vtxB.id} は ${vtxA.id} から来ると早い (${score})`);
          vtxB.score = score;
          vtxB.fromVertex = vtxA;
          // 終わりへとつながっていれば
          if (vtxB.isConnectedStart) {
            // 終わりとのスコアを計算する
            const finalScore = getScore(vtxB, startVertex, depth) + score;
            if (finalScore > startVertex.score) {
              //console.log(`スコア更新: ${startVertex.id} は ${vtxB.id} から来ると早い (${score})`);
              startVertex.score = finalScore;
              startVertex.fromVertex = vtxB;
            }
          } else {
            // 終わりに繋がっていなければ再帰する
            explore(vtxB, vtxA, score, depth + 1);
          }
        } else {
          //console.log(`スコア更新不可: ${vtxB.id} で探索を打ち切ります`);
        }
      });
    };
    this.rootVertexes = [];
    this.go = function go() {
      // ゴールを出発地点にして探検する
      explore(goalVertex, null, 0, 0);
      // スタートを代入
      let vertex = startVertex;
      // ゴールにたどり着くまでの間
      while (vertex !== goalVertex) {
        // vertex.fromVertexをたどっていく
        this.rootVertexes.push(vertex);
        vertex = vertex.fromVertex;
      }
      this.rootVertexes.push(goalVertex);
      return this;
    };
  };
  
  /** createVertexesFromDefs(vertexDefs, connectDefs, type)
   */
  const createVertexesFromDefs = (vertexDefs, connectDefs, type) => {
    // 頂点配列を作成
    const vertexes = [];
    vertexDefs.forEach((def, i) => {
      vertexes.push(new Vtx2(...def, i, type, vertexes));
    });
    const allLines = [];
    const twowayLines = [];
    const onewayLines = [];
    const twowayLineStrs = [];
    const onewayLineStrs = [];
    // 頂点の関係性を作成
    connectDefs.forEach((def, i) => {
      // '*'が付いていれば一方通行とみなす
      const isOneway = (def.indexOf('*') > -1);
      const _def = def.replace('*', '').split('-');
      for (let i = 1; i < _def.length; i += 1) {
        let charA = _def[i - 1];
        let charB = _def[i];
        let indexA = parseInt(charA, 10);
        let indexB = parseInt(charB, 10);
        let lineStrAB = charA + '-' + charB;
        let lineStrBA = charB + '-' + charA;
        let vertexA = vertexes[indexA];
        let vertexB = vertexes[indexB];
        let line = [
          vertexA,
          vertexB
        ];
        if (isOneway) {
          // 一方通行フラグが立っていれば
          vertexA.connectTo(    vertexB);
          //vertexA.connectedFrom(vertexB);
          //vertexB.connectTo(    vertexA);
          vertexB.connectedFrom(vertexA);
        } else {
          vertexA.connectTo(    vertexB);
          vertexA.connectedFrom(vertexB);
          vertexB.connectTo(    vertexA);
          vertexB.connectedFrom(vertexA);
        }
        // twowayLineStrs / onewayLineStrsに登録する
        if (isOneway) {
          if (onewayLineStrs.indexOf(lineStrAB) < 0) {
            onewayLineStrs.push(lineStrAB);
            onewayLines.push(line);
            allLines.push(line);
          }
        } else {
          if (twowayLineStrs.indexOf(lineStrAB) < 0 && twowayLineStrs.indexOf(lineStrBA) < 0) {
            twowayLineStrs.push(lineStrAB);
            twowayLines.push(line);
            allLines.push(line);
          }
        }
      }
    });
    return [vertexes, twowayLines, onewayLines];
  };
  
  /** createPathDataFromDefs(pathDataDefs)
   */
  const createPathDataFromDefs = (pathDataDefs) => {
    const [
      rootVertexes,
      rootTLines,
      rootOLines,
    ] = createVertexesFromDefs(
      pathDataDefs.rootVertexDefs,
      pathDataDefs.rootConnectDefs,
      COLOR_TYPE_VERTEX,
    );
    const [
      wallVertexes,
      wallTLines,
      wallOLines,
    ] = createVertexesFromDefs(
      pathDataDefs.wallVertexDefs,
      pathDataDefs.wallConnectDefs,
      COLOR_TYPE_WALL_VERTEX,
    );
    return {
      rootVertexes,
      rootTLines,
      rootOLines,
      rootLineStrs: pathDataDefs.rootConnectDefs,
      wallVertexes,
      wallTLines,
      wallOLines,
      wallLineStrs: pathDataDefs.wallConnectDefs,
      unionAreas: pathDataDefs.unionAreaDefs || [],
    };
  }
  
  /** createPathDataFromImage(image, tryCount)
   * @param {String|Element} image - 画像ファイルの場所、あるいは<img>要素
   * @param {Number} tryCount - 再帰回数
   */
  const createPathDataFromImage = (image, tryCount = 0) => new Promise((resolve) => {
    let $image;
    // imageが文字列かどうか
    if (typeof image === 'string') {
      // 文字列なら<img>要素を作ってsrcにぶち込む
      $image = document.createElement('img');
      $image.src = image;
    } else {
      // 文字列ではないなら<img>要素と解釈して代入
      $image = image;
    }
    // この時点で$imageには<img>要素が入っている
    // naturalWidthが取得できないならば
    if ($image.naturalWidth === 0) {
      // 画像の読み込みが完了していないようだ！これでは作業できない
      // tryCountが0か？
      if (tryCount === 0) {
        // tryCountが0ならば画像読み込み完了イベントにハンドラを取り付ける
        $image.addEventListener('load', () => {
          // <img>要素を第一引数にして、tryCountを1増やしながら再帰する
          resolve(createPathDataFromImage($image, 1));
        }, { once: true });
        // ここで帰ろう
        return;
      }
      // tryCountが1以上なのにnaturalWidthが取れないというのは変だ
      console.log('error!');
      // ここで帰ろう
      return;
    }
    // 画像の読み込みが完了しているようだ！
    // 画像と同じ大きさの<canvas>要素を作成する
    const $canvas = document.createElement('canvas');
    const width = $image.naturalWidth;
    const height = $image.naturalHeight;
    $canvas.setAttribute('width', width);
    $canvas.setAttribute('height', height);
    const ctx = $canvas.getContext('2d');
    // 画像を描画する
    ctx.drawImage($image, 0, 0, width, height);
    // イメージデータを作る
    const imagedata = ctx.getImageData(0, 0, width, height);
    // 道頂点群と壁頂点群をサーチ
    const [rootVertexes, wallVertexes, unionAreas] = searchVertexes(imagedata);
    // 道頂点群について接続をチェック
    const [rootTLines, rootOLines, rootLineStrs] = checkConnect(
      imagedata,
      rootVertexes,
      {
        vertex: COLOR_TYPE_VERTEX,
        twoway: COLOR_TYPE_TWOWAY,
        oneway: COLOR_TYPE_ONEWAY,
      }
    );
    // 壁頂点群について接続をチェック
    const [wallTLines, wallOLines, wallLineStrs] = checkConnect(
      imagedata,
      wallVertexes,
      {
        vertex: COLOR_TYPE_WALL_VERTEX,
        twoway: COLOR_TYPE_WALL_TWOWAY,
      }
    );
    // 結果を返す
    resolve({
      rootVertexes,
      rootTLines,
      rootOLines,
      rootLineStrs,
      wallVertexes,
      wallTLines,
      wallOLines,
      wallLineStrs,
      unionAreas,
    });
  });

  /** buildPathDataFloors(floors)
   */
  const buildPathDataFloors = (floors) => {
    floors.forEach(floor => {
      floor.pathData = createPathDataFromDefs(floor.pathDataDefs);
    });
    const buildData = {
      floors,
      getWallLines(z) {
        for (let i = 0; i < this.floors.length; i += 1) {
          if (z > this.floors[i].zIndex) {
            return this.floors[i].pathData.wallTLines;
          }
          return this.floors[this.floors.length - 1].pathData.wallTLines;
        }
      },
    };
    Object.keys(floors[0].pathData).forEach(key => {
      buildData[key] = floors[0].pathData[key];
    });
    for (let i = floors.length - 1; i >= 1; i -= 1) {
      let upperFloor = floors[i - 1];
      let lowerFloor = floors[i];
      lowerFloor.pathData.unionAreas.forEach((area) => {
        const unionVertexes = [];
        upperFloor.pathData.rootVertexes.forEach(vtx => {
          if (area[0] < vtx.x && vtx.x < area[0] + area[2]
              && area[1] < vtx.y && vtx.y < area[1] + area[3]) {
            unionVertexes.push(vtx);
          }
        });
        lowerFloor.pathData.rootVertexes.forEach(vtx => {
          if (area[0] < vtx.x && vtx.x < area[0] + area[2]
              && area[1] < vtx.y && vtx.y < area[1] + area[3]) {
            unionVertexes.push(vtx);
          }
        });
        for (let j = 0; j < unionVertexes.length; j += 1) {
          unionVertexes[i - 0].connectTo(unionVertexes[i - 1]);
          unionVertexes[i - 1].connectTo(unionVertexes[i - 0]);
          unionVertexes[i - 0].connectedFrom(unionVertexes[i - 1]);
          unionVertexes[i - 1].connectedFrom(unionVertexes[i - 0]);
        }
      });
      buildData.rootVertexes.push(...lowerFloor.pathData.rootVertexes);
      buildData.rootTLines.push(...lowerFloor.pathData.rootTLines);
      buildData.rootOLines.push(...lowerFloor.pathData.rootOLines);
    }
    buildData.rootVertexes.forEach((vtx, i) => {
      vtx.id = i;
    });
    return buildData;
  }
  
  /** Vtx2(x, y, id, type, vertexes)
   */
  const Vtx2 = function(x, y, id, type, vertexes) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.type = type;
    this.connectsStr = '';
    this.connects = [];
    this.connectedsStr = '';
    this.connecteds = [];
    this.$$objects = [];
    this.vertexes = vertexes;
    this.score = - Infinity;
    this.fromVertex = null;
    this.isConnectedStart = false;
  };
  
  /** .setXY(x, y)
   */
  Vtx2.prototype.setXY = function setXY(x, y) {
    this.x = x;
    this.y = y;
    this.$$objects.forEach($$object => {
      $$object.x = x;
      $$object.y = y;
    });
    return this;
  };
  
  /** .connectsExists()
   */
  Vtx2.prototype.connectsExists = function connectExists() {
    return (this.connects.length !== 0 || this.connecteds.length !== 0);
  };
  
  /** .connectTo(vtx)
   */
  Vtx2.prototype.connectTo = function connectTo(vtx) {
    this.connects.push(vtx);
    this.connectsStr += vtx.id;
    return this;
  };
  
  /** .connectedFrom(vtx)
   */
  Vtx2.prototype.connectedFrom = function connectedFrom(vtx) {
    this.connecteds.push(vtx);
    this.connectedsStr += vtx.id;
    return this;
  };
  
  /** .initializeConnects(lines, isStart)
   */
  Vtx2.prototype.initializeConnects = function initializeConnects(lines, isStart) {
    this.connectsStr = '';
    this.connects = [];
    this.connectedsStr = '';
    this.connecteds = [];
    this.score = - Infinity;
    this.fromVertex = null;
    return this;
  };
  
  /** .createConnects(lines, isStart)
   */
  Vtx2.prototype.createConnects = function createConnects(lines, isStart) {
    // 自身以外の、少なくともひとつの接続を持つすべての頂点xについて
    this.vertexes.forEach(vtx => {
      if (this !== vtx && vtx.connectsExists()) {
        // 自身から頂点xに直線で行くことができるなら接続する
        if (testGoableStraight(this, vtx, lines)) {
          this.connectedFrom(vtx);
          if (isStart) {
            vtx.isConnectedStart = true;
          }
        }
      }
    });
    return this;
  };
  
  /** .drawVertex()
   */
  Vtx2.prototype.drawVertex = function drawVertex() {
    const size = 6;
    const str = this.id;
    let color = '#000;';
    if (this.type === COLOR_TYPE_VERTEX) {
      color = parseColorStr(COLOR_TYPES.vertex.color);
    }
    if (this.type === COLOR_TYPE_WALL_VERTEX) {
      color = parseColorStr(COLOR_TYPES.wallVertex.color);
    }
    const $$container = new createjs.Container();
    $$container.x = this.x;
    $$container.y = this.y;
    const $$text = new createjs.Text(str, `${size}px sans-serif`, color);
    $$text.textBaseline = 'middle';
    $$text.textAlign = 'center';
    const $$shape = new createjs.Shape();
    //$$shape.graphics.beginFill(color).drawCircle(0, 0, size);
    $$shape.graphics.beginFill(color).rect(-size, -size, size*2, size*2);
    stage.addChild($$container);
    $$container.addChild($$shape);
    $$container.addChild($$text);
    this.$$objects = [$$text, $$shape];
    let isCatch = false;
    let marginX = 0;
    let marginY = 0;
    $$container.cursor = 'pointer';
    $$container.on('mousedown', () => {
      isCatch = true;
      marginX = stage.mouseX - $$container.x;
      marginY = stage.mouseY - $$container.y;
    });
    $$container.on('pressmove', () => {
      if (isCatch) {
        this.x = stage.mouseX - marginX;
        this.y = stage.mouseY - marginY;
        $$container.x = this.x;
        $$container.y = this.y;
        myUpdate();
      }
    });
    $$container.on('pressup', () => {
      isCatch = false;
    });
  };
  
  /** .drawLine()
   */
  Vtx2.prototype.drawLine = function drawLine(vtxA, vtxB, type, color, weight = 8) {
    // 線の色を決定
    let col1 = 'Black';
    if (color !== undefined) {
      col1 = color;
    } else {
      switch (vtxA.type) {
        default:
        case COLOR_TYPE_VERTEX:
          col1 = parseColorStr(COLOR_TYPES.connect.color);
          break;
        case COLOR_TYPE_WALL_VERTEX:
          col1 = parseColorStr(COLOR_TYPES.wallConnect.color);
          break;
      }
    }
    // 一方通行時の色
    const col2 = parseColorStr(COLOR_TYPES.oneway.color);
    // Shapeインスタンスを作成
    const shape = new createjs.Shape();
    // draw関数を生成する
    const draw = this.createLineDrawer(
      shape.graphics, vtxA, vtxB, type, weight
    );
    // 1回描く
    draw(col1, col2);
    // マウスオーバー時に緑色にする
    shape.on('mouseover', () => {
      draw('Green', 'Lime');
    });
    // マウスアウト時に元に戻す
    shape.on('mouseout', () => {
      draw(col1, col2);
    });
    // Stageに追加、zindexは最低にする
    stage.addChild(shape);
    stage.setChildIndex(shape, 0);
    return shape;
  };
  /** .createLineDrawer(g, vtxA, vtxB, type, weight)
   */
  Vtx2.prototype.createLineDrawer = function createLineDrawer(g, vtxA, vtxB, type, weight) {
    const harf = getHarfVector(vtxA, vtxB);
    const draw = (col1, col2) => {
      g.setStrokeStyle(weight);
      g.beginStroke(col1);
      g.moveTo(vtxA.x, vtxA.y);
      g.lineTo(vtxB.x, vtxB.y);
      g.endStroke();
      if (type === LINE_TYPE_ONEWAY) {
        g.beginStroke(col2);
        g.moveTo(harf.x, harf.y);
        g.lineTo(vtxB.x, vtxB.y);
        g.endStroke();
      }
    };
    return draw;
  };
  
  /** Vtx(id, pixels, arounds, type) 
   */
  const Vtx = function Vtx(id, pixels, arounds, type) {
    this.id = id;
    this.type = type;
    this.pixels = pixels;
    this.arounds = arounds;
    let num = 0;
    let xSum = 0;
    let ySum = 0;
    this.xMin = Infinity;
    this.yMin = Infinity;
    this.xMax = -Infinity;
    this.yMax = -Infinity;
    pixels.forEach((p) => {
      xSum += p.x;
      ySum += p.y;
      if (p.x < this.xMin) this.xMin = p.x;
      if (p.y < this.yMin) this.yMin = p.y;
      if (p.x > this.xMax) this.xMax = p.x;
      if (p.y > this.yMax) this.yMax = p.y;
      num += 1;
    });
    this.width = this.xMax - this.xMin;
    this.height = this.yMax - this.yMin;
    this.radius = Math.floor((this.xMax - this.xMin) / 2);
    this.x = Math.floor(xSum / num);
    this.y = Math.floor(ySum / num);
    this.connects = [];
    this.connecteds = [];
  };
  
  /** .connectTo(vtx)
   */
  Vtx.prototype.connectTo = function connectTo(vtx) {
    if (this.connects.indexOf(vtx) < 0) {
      this.connects.push(vtx);
      return true;
    }
    return false;
  };
  
  /** .connectedFrom(vtx)
   */
  Vtx.prototype.connectedFrom = function connectedFrom(vtx) {
    if (this.connecteds.indexOf(vtx) < 0) {
      this.connecteds.push(vtx);
      return true;
    }
    return false;
  };
  
  /** .drawVertex()
   */
  Vtx.prototype.drawVertex = function drawVertex() {
    const size = 6;
    const str = this.id;
    let color = '#000;';
    if (this.type === COLOR_TYPE_VERTEX) {
      color = parseColorStr(COLOR_TYPES.vertex.color);
    }
    if (this.type === COLOR_TYPE_WALL_VERTEX) {
      color = parseColorStr(COLOR_TYPES.wallVertex.color);
    }
    const $$container = new createjs.Container();
    $$container.x = this.x;
    $$container.y = this.y;
    const $$text = new createjs.Text(str, `${size}px sans-serif`, color);
    $$text.textBaseline = 'middle';
    $$text.textAlign = 'center';
    const $$shape = new createjs.Shape();
    //$$shape.graphics.beginFill(color).drawCircle(0, 0, size);
    $$shape.graphics.beginFill(color).rect(-size, -size, size*2, size*2);
    stage.addChild($$container);
    $$container.addChild($$shape);
    $$container.addChild($$text);
    this.$$objects = [$$text, $$shape];
    let isCatch = false;
    let marginX = 0;
    let marginY = 0;
    $$container.cursor = 'pointer';
    $$container.on('mousedown', () => {
      isCatch = true;
      marginX = stage.mouseX - $$container.x;
      marginY = stage.mouseY - $$container.y;
    });
    $$container.on('pressmove', () => {
      if (isCatch) {
        this.x = stage.mouseX - marginX;
        this.y = stage.mouseY - marginY;
        $$container.x = this.x;
        $$container.y = this.y;
        myUpdate();
      }
    });
    $$container.on('pressup', () => {
      isCatch = false;
    });
  };
  
  /** .drawLine()
   */
  Vtx.prototype.drawLine = function drawLine(vtxA, vtxB, type, color = '#000', weight = 8) {
    // 線の色を決定
    let col1;
    switch (vtxA.type) {
      default:
        col1 = color;
        break;
      case COLOR_TYPE_VERTEX:
        col1 = parseColorStr(COLOR_TYPES.connect.color);
        break;
      case COLOR_TYPE_WALL_VERTEX:
        col1 = parseColorStr(COLOR_TYPES.wallConnect.color);
        break;
    }
    // 一方通行時の色
    const col2 = parseColorStr(COLOR_TYPES.oneway.color);
    // Shapeインスタンスを作成
    const shape = new createjs.Shape();
    // draw関数を生成する
    const draw = this.createLineDrawer(
      shape.graphics, vtxA, vtxB, type, weight
    );
    // 1回描く
    draw(col1, col2);
    // マウスオーバー時に緑色にする
    shape.on('mouseover', () => {
      draw('Green', 'Lime');
    });
    // マウスアウト時に元に戻す
    shape.on('mouseout', () => {
      draw(col1, col2);
    });
    // Stageに追加、zindexは最低にする
    stage.addChild(shape);
    stage.setChildIndex(shape, 0);
    return shape;
  };
  /** .createLineDrawer(g, vtxA, vtxB, type, weight)
   */
  Vtx.prototype.createLineDrawer = function createLineDrawer(g, vtxA, vtxB, type, weight) {
    const harf = getHarfVector(vtxA, vtxB);
    const draw = (col1, col2) => {
      g.setStrokeStyle(weight);
      g.beginStroke(col1);
      g.moveTo(vtxA.x, vtxA.y);
      g.lineTo(vtxB.x, vtxB.y);
      g.endStroke();
      if (type === LINE_TYPE_ONEWAY) {
        g.beginStroke(col2);
        g.moveTo(harf.x, harf.y);
        g.lineTo(vtxB.x, vtxB.y);
        g.endStroke();
      }
    };
    return draw;
  };
  
  /** searchVertexes(imagedata)
   */
  function searchVertexes(imagedata) {
    const rootVertexes = [];
    const wallVertexes = [];
    const unionAreas = [];
    const search = createVertexSearcher(imagedata);
    // y座標中央を取得
    const halfHeight = Math.floor(imagedata.height / 2);
    // 「y座標中央から-1方向に探索」「y座標中央+1から+1方向に探索」の2回に分けよう
    for (let i = 0; i < 2; i += 1) {
      // 探索開始y座標 halfHeight + (0 or 1)
      const startY = halfHeight + i;
      // y座標移動量 -1 or 1
      const deltaY = (i === 0) ? -1 : 1;
      // 継続するかどうかをチェックする関数
      // 「上に探索」のときはy座標が0以上であることが継続条件だし
      // 「下に探索」のときはy座標が画像の高さ未満であることが継続条件
      const doContinue = (y) => ((i === 0) ? (y >= 0) : (y < imagedata.height));
      // さあ、探索しよう！
      // 上で作った条件でy座標を走査
      for (let y = startY; doContinue(y); y += deltaY) {
        // この行が「有意味なピクセルが何もない行」であるかどうか
        // とりあえずtrue 有意味なピクセルがひとつでもあればfalseにすることにしよう
        let isNullLine = true;
        // x座標を走査
        for (let x = 0; x < imagedata.width; x += 1) {
          // 変数を用意してサーチ用のジェネレータ関数を実行する
          const pixels = [];
          const arounds = [];
          const type = runRecursive(search, x, y, 0, pixels, arounds, null);
          // 無意味なピクセルではなかったならば、この行には意味があったのだ！
          if (type !== COLOR_TYPE_EMPTY) {
            isNullLine = false;
          }
          // 頂点ピクセル座標配列にひとつでも座標が入っていれば
          if (pixels.length !== 0) {
            // カラータイプによって分岐
            switch (type) {
              // カラータイプ：頂点ならば
              default:
              case COLOR_TYPE_VERTEX:
                // Vtxインスタンスを作成してrootVertexesに追加
                rootVertexes.push(new Vtx(
                  rootVertexes.length,
                  pixels,
                  arounds,
                  COLOR_TYPE_VERTEX,
                ));
                break;
              // カラータイプ：壁頂点ならば
              case COLOR_TYPE_WALL_VERTEX:
                // Vtxインスタンスを作成してwallVertexesに追加
                wallVertexes.push(new Vtx(
                  wallVertexes.length,
                  pixels,
                  arounds,
                  COLOR_TYPE_WALL_VERTEX,
                ));
                break;
              // カラータイプ：ユニオンならば
              case COLOR_TYPE_UNION:
                // Vtxインスタンスを作成してwallVertexesに追加
                unionAreas.push(new Vtx(
                  unionAreas.length,
                  pixels,
                  arounds,
                  COLOR_TYPE_UNION,
                ));
                break;
            }
          }
        } // x座標の走査終わり
        // 無意味な行ならばy座標の走査を打ち切ってしまおう！
        if (isNullLine) {
          break;
        }
      }
    } // y座標の走査終わり
    return [rootVertexes, wallVertexes, unionAreas];
  }
  
  /** createVertexSearcher(imagedata)
   */
  function createVertexSearcher(imagedata) {
    // すべてのピクセルに「訪れたことがあるかどうか」のフラグを用意する
    const visitedPixels = createArray(imagedata.width, imagedata.height, false);
    
    /** search(x, y, depth, pixels, arounds, searchingColorType)
       * @param {Number} x - x座標 0～width-1
       * @param {Number} y - y座標 0～height-1
       * @param {Number} depth - 再帰回数
       * @param {Array} pixels - 頂点のピクセル座標配列
       * @param {Array} arounds - 頂点の周辺のピクセル座標配列
       * @param {Symbol} searchingColorType - 現在探そうとしている頂点カラータイプ
       */
    return function* search(x, y, depth, pixels, arounds, searchingColorType) {
      // このピクセルのカラータイプを取得
      const colorType = getColorType(imagedata, x, y);
      // ここに訪れたことがあるならカラータイプを返して終わる
      if (visitedPixels[y][x]) {
        return colorType;
      }
      // ここには訪れたことがないようだ！
      // フラグを立ててやろう
      visitedPixels[y][x] = true;
      // 頂点であるかどうか
      const isVertex = (colorType === COLOR_TYPE_VERTEX)
          || (colorType === COLOR_TYPE_WALL_VERTEX)
          || (colorType === COLOR_TYPE_UNION);
      // 深さ0で、頂点であるかどうか
      const isInitialVertex = (depth === 0) && isVertex;
      // 深さ1以上で、探し求めている頂点であるかどうか
      const isSearchingVertex = (depth > 0) && (colorType === searchingColorType);
      // 初めての頂点でもないし、探し求めている頂点でもないならば
      if (!(isInitialVertex || isSearchingVertex)) {
        // ここは無意味なピクセルのようだ！
        // 深さ1以上なら、ここは頂点の周辺ピクセル、ということになる
        if (depth > 0) {
          arounds.push({ x, y });
        }
        // colorTypeを返して終わり
        return colorType;
      }
      // ここは初めての頂点であるか深さ1以上で探し求めていた頂点ピクセル、
      // つまり探索を続ける価値のあるピクセルのようだ！
      // とりあえずここを頂点ピクセルに追加
      pixels.push({ x, y });
      // 上下左右を探索する
      for (const [dx, dy] of DIRS_4) {
        // 次の場所
        const nx = x + dx;
        const ny = y + dy;
        // はみ出したら次の方向へ
        if (nx < 0 || ny < 0 || nx >= imagedata.width || ny >= imagedata.height) {
          continue;
        }
        // はみ出してはいないようだ！
        // yieldで再帰する
        yield [nx, ny, depth + 1, pixels, arounds, colorType];
      }
      // 上下左右の探索が終わったようだ！
      // カラータイプを返す
      return colorType;
    }
  }
  
  /** checkConnect(imagedata, vertexes, colorTypes)
   */
  function checkConnect(imagedata, vertexes, colorTypes) {
    const twowayLines = [];
    const onewayLines = [];
    const lineStrs = [];
    vertexes.forEach((vertexA, iVertexA) => {
      vertexes.forEach((vertexB, iVertexB) => {
        if (vertexA !== vertexB && iVertexB >= iVertexA) {
          // 頂点Aと頂点Bのすべての組み合わせについて調査しよう！
          // A→Bを調査済みの場合B→Aは調査しなくてよい
          // 頂点Aと頂点Bの距離、半距離(ともに整数)
          const distance = Math.floor(getDistance(vertexA, vertexB));
          const harfDistance = Math.floor(distance / 2);
          // 頂点Aと頂点Bのx距離とy距離
          const distanceX = vertexB.x - vertexA.x;
          const distanceY = vertexB.y - vertexA.y;
          // 距離(dirtance)を1詰めるたびにx, yはどれだけ詰まるか(小数)
          const deltaX = distanceX / distance;
          const deltaY = distanceY / distance;
          // 頂点Aの半径と頂点Bの半径の和
          const rr = vertexA.radius + vertexB.radius;
          // それを頂点の距離から引く。それが実質的な線の長さになる
          const lineLength = Math.max(1, distance - rr);
          // 頂点Aから頂点Bに向かってdeltaX, deltaYずつ動いてピクセルを調査することを考える
          // 念のため開始位置をずらして複数回チェックしてみよう
          // □■□
          // ■■■
          // □■□
          const startXYs = DIRS_5;
          // カウンタ変数
          let countEmpty = 0;
          let countTwoway = 0;
          let countVertex = 0;
          let countOnewayAtoB = 0;
          let countOnewayBtoA = 0;
          // - 頂点Aの座標からstartX, startYの値だけズレたところを開始地点にする。
          // -「頂点Aの半径」分の距離はあらかじめ詰める。
          // - lineLength回だけ距離を詰める。
          // - 距離を詰めながら、そのピクセルのカラータイプを調査して、
          //   対応するカウンタ変数を増加させる。
          for (const [startX, startY] of startXYs) {
            for (let i = 0; i < lineLength; i += 1) {
              // 調査するピクセル
              const x = startX + vertexA.x + (deltaX * (i + vertexA.radius));
              const y = startY + vertexA.y + (deltaY * (i + vertexA.radius));
              // そのピクセルのカラータイプを取得
              const colorType = getColorType(imagedata, x, y);
              // 対応するカウンタ変数を増加させる
              switch (colorType) {
                case colorTypes.vertex:
                  countVertex += 1;
                  break;
                case colorTypes.twoway:
                  countTwoway += 1;
                  break;
                case colorTypes.oneway:
                  if (i < harfDistance) {
                    countOnewayAtoB += 1;
                  } else {
                    countOnewayBtoA += 1;
                  }
                  break;
                default:
                  countEmpty += 1;
                  break;
              }
            }
          }
          // カウンタ変数の値を調査ラインの数で割る(平均化する)
          // 判定が甘めになるように係数1.5をかけてやる(適当に決めた)
          const a = 1.5;
          countEmpty *= a / startXYs.length;
          countTwoway *= a / startXYs.length;
          countVertex *= a / startXYs.length;
          countOnewayAtoB *= a / startXYs.length;
          countOnewayBtoA *= a / startXYs.length;
          // カウンタ変数の状況から頂点Aと頂点Bの関係を推察する
          if (countVertex > rr) {
            // Ⓐ――〇―――Ⓑ
            // A⇔B上に他の頂点が乗っていた！
            // このようなケースでは、頂点Aと頂点Bが繋がっているとは認めない
            return;
          } else if (countOnewayAtoB > lineLength / 2) {
            // Ⓐ―――………Ⓑ
            // A→Bは一方通行だ！
            if (vertexA.connectTo(vertexB)) { // AをBに繋ぐ
              vertexB.connectedFrom(vertexA); // BはAに繋がれる
              lineStrs.push(`${vertexA.id}-${vertexB.id}*`); // たとえば'0-1*'
              onewayLines.push([vertexA, vertexB]);
            }
            return;
          } else if (countOnewayBtoA > lineLength / 2) {
            // Ⓐ………―――Ⓑ
            // B→Aは一方通行だ！
            if (vertexB.connectTo(vertexA)) { // BをAに繋ぐ
              vertexA.connectedFrom(vertexB); // AはBに繋がれる
              lineStrs.push(`${vertexB.id}-${vertexA.id}*`); // たとえば'1-0*'
              onewayLines.push([vertexB, vertexA]);
            }
            return;
          } else if (countTwoway > lineLength) {
            // Ⓐ――――――Ⓑ
            // A⇔Bは繋がっている！
            if (vertexA.connectTo(vertexB)) { // AをBに繋ぐ
              vertexB.connectedFrom(vertexA); // BはAに繋がれる
              vertexB.connectTo(vertexA); // BをAに繋ぐ
              vertexA.connectedFrom(vertexB); // AはBに繋がれる
              lineStrs.push(`${vertexA.id}-${vertexB.id}`); // たとえば'0-1'
              twowayLines.push([vertexA, vertexB]);
            }
            return;
          }
        } // end if (vertexA !== vertexB && iVertexB >= iVertexA)
      }); // end vertexes.forEach((vertexB, iVertexB)
    }); // end vertexes.forEach((vertexA, iVertexA)
    return [twowayLines, onewayLines, lineStrs];
  }
  
  /** getDistance(v1, v2)
   */
  const getDistance = (v1, v2) => Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
  
  /** getHarfVector(v1, v2)
   */
  const getHarfVector = (v1, v2) => ({
    x: Math.floor((v2.x + v1.x) / 2),
    y: Math.floor((v2.y + v1.y) / 2),
  });

  /** getProduct(v1, v2, v3)
   */
  const getProduct = (a, b, c) => {
    const VectorA = {
      x: b.x - a.x,
      y: b.y - a.y,
    };
    const VectorB = {
      x: c.x - a.x,
      y: c.y - a.y,
    };
    const vectorProduct = VectorA.x * VectorB.y - VectorB.x * VectorA.y;
    return Math.sign(vectorProduct);
  };
  
  /** getRelativeVector(v1, v2)
   */
  const getRelativeVector = (v1, v2) => {
    return {
      x: v2.x - v1.x,
      y: v2.y - v1.y,
    };
  };
  
  /** getAbsoluteVector(v1, v2)
   */
  const getAbsoluteVector = (v1, v2) => {
    return {
      x: v2.x + v1.x,
      y: v2.y + v1.y,
    };
  };
  
  /** getRotatedVector(vec, deg)
   */
  const getRotatedVector = (vec, deg) => {
    const rad = deg * (Math.PI / 180);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    return {
      x: - sin * vec.y + cos * vec.x,
      y: sin * vec.x + cos * vec.y,
    };
  };
  
  /** getVectorAngle(vec)
   */
  const getVectorAngle = (vec) => {
    // アークサイン（-180°～180°）を取得
    const asin = Math.asin(vec.y / Math.sqrt(vec.x ** 2 + vec.y ** 2)) * (180 / Math.PI);
    let deg;
    if (vec.y > 0) {
      if (vec.x > 0) {
        deg = asin;
      } else {
        deg = 180 - asin;
      };
    } else {
      if (vec.x > 0) {
        deg = 360 - Math.abs(asin);
      } else {
        deg = 180 + Math.abs(asin);
      };
    };
    return deg;
  };
  const drawBLine = (g, v1, v2) => {
    g.beginStroke('#000000');
    g.moveTo(v1.x, v1.y);
    g.lineTo(v2.x, v2.y);
    g.endStroke();
    const harf = {
      x: (v1.x + v2.x) / 2,
      y: (v1.y + v2.y) / 2,
    };
    const vec = getRelativeVector(v1, v2);
    const angle = getVectorAngle(vec);
    const vec2 = getRotatedVector({ x: 0, y: 20 }, angle);
    g.beginStroke('#000000');
    g.moveTo(harf.x, harf.y);
    g.lineTo(harf.x + vec2.x, harf.y + vec2.y);
    g.endStroke();
  };
  
  /** testLineHits
   */
  const testLineHits = (root, line, lineType) => {
    if (lineType === 2) {
      return false;
    }
    // 直線→CD→からみて点Aはどちら側にあるだろうか？
    const signAfromCD = getProduct(line[0], line[1], root[0]);
    if (lineType === 1 && signAfromCD <= 0) {
      return false;
    }
    // 直線→AB→からみて点Cはどちら側にあるだろうか？
    const signCfromAB = getProduct(root[0], root[1], line[0]);
    // 直線→AB→からみて点Dはどちら側にあるだろうか？
    const signDfromAB = getProduct(root[0], root[1], line[1]);
    // 直線→CD→からみて点Bはどちら側にあるだろうか？
    const signBfromCD = getProduct(line[0], line[1], root[1]);
    const isIntersectCDandAB = (signCfromAB !== signDfromAB);// && (signCfromAB * signDfromAB !== 0);
    const isIntersectABandCD = (signAfromCD !== signBfromCD);// && (signAfromCD * signBfromCD !== 0);
    return (isIntersectCDandAB && isIntersectABandCD);
  };
  /** testGoableStraight(vtxA, vtxB)
   */
  const testGoableStraight = (vtxA, vtxB, lines) => {
    const line = [vtxA, vtxB];
    let isBlocked = false;
    for (let i = 0; i < lines.length; i += 1) {
      if (vtxA === lines[i][0] ||
          vtxA === lines[i][1] ||
          vtxB === lines[i][0] ||
          vtxB === lines[i][1]) {
      } else {
        if (testLineHits(line, lines[i])) {
          isBlocked = true;
          break;
        }
      }
    }
    return !isBlocked;
  };

  /** getColorType(imagedata, x, y)
   */
  const getColorType = (imagedata, x, y) => {
    const i = 4 * (Math.floor(x) + Math.floor(y) * imagedata.width);
    const r = imagedata.data[i + 0];
    const g = imagedata.data[i + 1];
    const b = imagedata.data[i + 2];
    let dMin = Infinity;
    let dMinType = null;
    COLOR_TYPES_KEYS.forEach((key) => {
      const colorType = COLOR_TYPES[key];
      let d = 0;
      d += Math.abs(r - colorType.color[0]);
      d += Math.abs(g - colorType.color[1]);
      d += Math.abs(b - colorType.color[2]);
      if (d < dMin) {
        dMin = d;
        dMinType = colorType.value;
      }
    });
    if (dMin > 10) {
      return COLOR_TYPE_EMPTY;
    }
    return dMinType;
  };
  
  /** parseColorStr(rgb)
   */
  const parseColorStr = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  
  /** createArray(width, height, initialValue)
   */
  const createArray = (width, height, initialValue) => {
    const array = [];
    for (let y = 0; y < height; y += 1) {
      array[y] = [];
      for (let x = 0; x < width; x += 1) {
        array[y][x] = initialValue;
      }
    }
    return array;
  };
  
  /** logPathData(pathData)
   */
  const logPathData = (pathData) => {
    const jsonPathDataDefs = {
      rootVertexDefs: [],
      rootConnectDefs: [],
      wallVertexDefs: [],
      wallConnectDefs: [],
      unionAreaDefs: [],
    };
    pathData.rootVertexes.forEach((vtx) => {
      jsonPathDataDefs.rootVertexDefs.push([vtx.x, vtx.y]);
    });
    pathData.wallVertexes.forEach((vtx) => {
      jsonPathDataDefs.wallVertexDefs.push([vtx.x, vtx.y]);
    });
    pathData.rootLineStrs.forEach((str) => {
      jsonPathDataDefs.rootConnectDefs.push(str);
    });
    pathData.wallLineStrs.forEach((str) => {
      jsonPathDataDefs.wallConnectDefs.push(str);
    });
    pathData.unionAreas.forEach((area) => {
      jsonPathDataDefs.unionAreaDefs.push([area.xMin, area.yMin, area.width, area.height]);
    });
    console.log(JSON.stringify(jsonPathDataDefs));
  };
  
  /** runRecursive(func, ...args)
   * https://qiita.com/uhyo/items/21e2dc2b9b139473d859
   */
  const runRecursive = (func, ...args) => {
    const rootCaller = {
      lastReturnValue: null,
    };
    const callStack = [];
    callStack.push({
      iterator: func(...args),
      lastReturnValue: null,
      caller: rootCaller,
    });
    while (callStack.length > 0) {
      const stackFrame = callStack[callStack.length - 1];
      const { iterator, lastReturnValue, caller } = stackFrame;
      const { value, done } = iterator.next(lastReturnValue);
      if (done) {
        caller.lastReturnValue = value;
        callStack.pop();
      } else {
        callStack.push({
          iterator: func(...value),
          lastReturnValue: null,
          caller: stackFrame,
        });
      }
    }
    return rootCaller.lastReturnValue;
  };
  
  /** myUpdate
   */
  const myUpdate = () => {
    // 最短ルートの計算 */
    const time1 = performance.now();
    const shortestRoot = getShortestRoot(
      pathData.rootVertexes,
      startVertex,
      goalVertex,
      [
        ...pathData.rootTLines,
        ...pathData.rootOLines,
        ...pathData.getWallLines(0),
      ],
      [
        ...pathData.rootTLines,
        ...pathData.rootOLines,
        ...pathData.getWallLines(200),
      ],
      [
        ...pathData.rootTLines,
        ...pathData.rootOLines,
        ...pathData.getWallLines(0),
      ],
    );
    const time2 = performance.now();
    console.log(time2 - time1);
    // リセット
    while ($$lines.length > 0) {
      const $$line = $$lines.pop();
      stage.removeChild($$line);
    }
    // スタートからゴールへの最短ルートを描く
    if (shortestRoot !== null) {
      for (let i = 1; i < shortestRoot.length; i += 1) {
        $$lines.push(
          Vtx2.prototype.drawLine(shortestRoot[i], shortestRoot[i - 1], null, 'Green', 14)
        );
      }
    }
    // 道を描く
    pathData.rootTLines.forEach((line) => {
      $$lines.push(Vtx.prototype.drawLine(...line, LINE_TYPE_TWOWAY));
    });
    pathData.rootOLines.forEach((line) => {
      $$lines.push(Vtx.prototype.drawLine(...line, LINE_TYPE_ONEWAY));
    });
    pathData.wallTLines.forEach((line) => {
      $$lines.push(Vtx.prototype.drawLine(...line, LINE_TYPE_WALL));
    });
    stage.update();
  };
  
  /** showSamplePathData(options)
   */
  const showSamplePathData = async (options) => {
    const $canvas = document.createElement('canvas');
    $canvas.setAttribute('width', CANVAS_WIDTH);
    $canvas.setAttribute('height', CANVAS_HEIGHT);
    document.querySelector(options.canvasWrapper).append($canvas);
    stage = new createjs.Stage($canvas);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    // const $$image = new createjs.Bitmap('./assets/path/sample-path-map.png');
    // stage.addChild($$image);
    
    if (options.imageSrc !== undefined) {
      pathData = await createPathDataFromImage(options.imageSrc);
      //logPathData(pathData);
    }
    
    if (options.pathDataDefs !== undefined) {
      pathData = createPathDataFromDefs(options.pathDataDefs);
      //logPathData(pathData);
    }
    
    if (options.pathDataFloorDefs !== undefined) {
      pathData = buildPathDataFloors(options.pathDataFloorDefs);
      //logPathData(pathData);
    }
    
    startVertex = new Vtx2(100, 100, 'S', null, pathData.rootVertexes);
    goalVertex = new Vtx2(200, 200, 'G', null, pathData.rootVertexes);
    /*
    createjs.Ticker.on('tick', () => {
      stage.update();
    });
    */
    pathData.rootVertexes.forEach((vtx) => {
      vtx.drawVertex();
    });
    pathData.wallVertexes.forEach((vtx) => {
      vtx.drawVertex();
    });
    [startVertex, goalVertex].forEach(vtx => {
      vtx.drawVertex()
    });
    $$lines = [];
    myUpdate();
  };
  /** - グローバル領域にマージ -
   */
  window.showSamplePathData = showSamplePathData;
  window.buildPathDataFloors = buildPathDataFloors;
})();
