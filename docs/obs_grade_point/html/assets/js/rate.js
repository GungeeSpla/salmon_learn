/*
 * Copyright (c) 2019 @GungeeSpla
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
 
/* 
 * onload()
 */
window.onload = function() {
  console.log('loaded');
  get_first_id(() => {
    latest_eval_id = window.first_id - 1;
    latest_id = window.first_id - 1;
    window.kuma_point_target = '' + (window.kuma_point_target || 0);
    get_json_all(window.first_id, last_id, function (json_array) {
      if (json_array && json_array.length) {
        //console.log(json_array);
      }
      update();
      setInterval(update, update_time);
    });
    render({
      grade_point: grade_point,
      kuma_point_sum: 0,
    });
  });
};

window.config_url = '../config.json';
window.json_url = '../json';
window.last_id = 99999;
window.latest_eval_id = 0;
window.latest_id = 0;
window.json_cache = {};
window.update_time = 3000;
window.kuma_point_sum = 0;
window.star_length = 16;
window.is_clear_array = [];
window.shift_num = 0;
window.win_num = 0;
window.lose_num = 0;
window.save_kuma_point = 0;
window.is_local_file = location.origin.indexOf('file://') > -1;
window.base_kuma_points = {
  '8000': [
      182,   371,   569,   770,   977,
     1194,  1415,  1642,  1879,  2120,
     2378,  2640,  2906,  3176,  3449,
     3726,  4007,  4292,  4580,  4872,
     5168,  5468,  5771,  6078,  6389,
     6704,  7022,  7344,  7670,  8000,
  ],
  '18000': [
      427,   868,  1322,  1790,  2271,
     2770,  3283,  3811,  4353,  4910,
     5486,  6070,  6662,  7263,  7872,
     8489,  9115,  9749, 10391, 11042,
    11701, 12369, 13045, 13729, 14422,
    15123, 15832, 16550, 17276, 18000,
  ],
  '19000': [
      454,   922,  1403,  1902,  2415,
     2943,  3485,  4042,  4614,  5202,
     5809,  6425,  7049,  7682,  8324,
     8975,  9635, 10303, 10980, 11666,
    12361, 13065, 13777, 14498, 15228,
    15967, 16715, 17471, 18236, 19000,
  ],
  '20000': [
      483,   981,  1493,  2020,  2561,
     3117,  3689,  4276,  4879,  5497,
     6135,  6782,  7438,  8104,  8779,
     9463, 10156, 10859, 11571, 12292,
    13022, 13762, 14511, 15269, 16036,
    16813, 17599, 18394, 19198, 20000,
  ],
};

/* 
 * update()
 */
function update() {
  console.log('update');
  get_json_all(window.first_id, last_id, function (arr) {
    //console.log('最後に計算したバイトID: ' + latest_eval_id)
    //console.log('取得した最新のバイトID: ' + latest_id)
    var new_count = latest_id - latest_eval_id;
    if (new_count <= 0) {
      console.info('新着リザルトはありません');
    } else {
      console.info(new_count + '件の新着リザルトがあります');
      while (latest_eval_id < latest_id) {
        latest_eval_id++;
        eval_json(latest_eval_id);
      }
      render({
        grade_point: grade_point,
        kuma_point_sum: kuma_point_sum,
        save_kuma_point: save_kuma_point,
      });
    }
  });
}

/* 
 * eval_json(id)
 */
function eval_json(id) {
  // id が未定義ならば latest_id を持ってくる
  if (typeof id === 'undefined') id = latest_id;
  get_json(id, function (json) {
    // そのjsonが現在オープン中のバイトのものでなければ処理を止める
    if (! ask_opening(json)) {
      return;
    }
    // バイト後の評価
    grade_point = json.grade_point;
    // クマサンポイント
    kuma_point_sum += json.kuma_point;
    // 白星･黒星配列へのpushとshift
    is_clear_array.push(json.job_result.is_clear);
    if (is_clear_array.length > star_length) is_clear_array.shift();
    // 成功回数と失敗回数のカウント
    if (json.job_result.is_clear) win_num++;
    else lose_num++;
    // 目標クマサンポイントとの差
    if (typeof base_kuma_points[kuma_point_target] !== 'undefined' &&
        typeof base_kuma_points[kuma_point_target][shift_num] !== 'undefined' &&
        lose_num === 0) {
      save_kuma_point = base_kuma_points[kuma_point_target][shift_num] - kuma_point_sum;
      if (window.kuma_point_target !== '8000') {
        save_kuma_point *= -1;
      }
    } else {
      save_kuma_point = NaN;
    }
    shift_num++;
  });
}

/* 
 * ask_opening(json)
 */
function ask_opening(json) {
  // jsonにはそのバイトの開始時刻t1と終了時刻t2の情報が入っている
  // 現在時刻がt1とt2の間にあるならjsonは現在開催中のバイトである
  var offset = 0; //-1 * 60 * 60;
  var now_time = Math.floor(new Date().getTime() / 1000) + offset;
  var start_time = json.start_time;
  var end_time = json.end_time;
  return (start_time < now_time) && (now_time < end_time);
}

/* 
 * render(data)
 * dataを受け取ってそれをhtmlとして描画する
** data.grade_point    ... 現在の評価
** data.kuma_point_sum ... 合計クマサンポイント
** is_clear_array      ... 白星･黒星の配列
 */
function render(data) {
  console.log('render');
  var star_html = '';
  for (var i = 0; i < is_clear_array.length; i++) {
    var bool = is_clear_array[i];
    var class_name = '';
    if (bool) class_name = 'winstar';
    else class_name = 'losestar';
    var star = ('<span class="%class_name">●</span>').replace('%class_name', class_name);
    star_html += star;
  }
  var grade_html = 'RATE<span class="number">%grade_point</span>';
      grade_html = grade_html.replace('%grade_point', data.grade_point);
  var point_html = '<span class="number">%kuma_point_sum</span>p';
      point_html = point_html.replace('%kuma_point_sum', data.kuma_point_sum);
  var save_html  = "　 (貯金 <span class='number'>%save_kuma_point</span>p)";
      save_html  = save_html.replace("%save_kuma_point", data.save_kuma_point);
  if (isNaN(data.save_kuma_point)) save_html = "";
  if (window.kuma_point_target !== '0') {
    document.querySelector('.rate').innerHTML = grade_html + "　 " + point_html + save_html;
  } else {
    document.querySelector('.rate').innerHTML = grade_html;
  }
  if (window.is_star_visible) {
    document.querySelector('.star').innerHTML = star_html;
  }
}

/* 
 * get_json_all(first_job_id, final_job_id, call_back)
 */
function get_json_all(first_job_id, final_job_id, call_back) {
  var json_data_array = [];
  var job_id = first_job_id;
  // エラーが発生したら即座にcall_backを実行
  var error = function(){
    if (call_back) call_back(json_data_array);
  };
  // 取得に成功したらjob_idをインクリメントして次のjsonを取得しようとする
  var success = function(res) {
    json_data_array.push(res);
    latest_id = job_id;
    job_id++;
    if (job_id <= final_job_id) {
      get_json(job_id, success, error);
    } else {
      if (call_back) call_back(json_data_array);
    }
  };
  // スタート
  get_json(job_id, success, error);
}

/* 
 * get_first_id(call_back)
 */
function get_first_id(call_back) {
  if (window.first_id !== 0) {
    console.log('latest id is ' + window.first_id);
    if (call_back) call_back();
    return;
  }
  ajax({
    url: config_url,
    success: function (res) {
      console.log('get config.json');
      window.first_id = res.latest;
      console.log('latest id is ' + res.latest);
      if (call_back) call_back();
    },
    error: function () {
      console.error('can\'t get config.json');
      alert('config.jsonが取得できませんでした');
    }
  });
}

/* 
 * get_json(job_id, success, error)
 */
function get_json(job_id, success, error) {
  // キャッシュが存在するなら即座にsuccessを実行する
  if (typeof json_cache[job_id] !== 'undefined') {
    return success(json_cache[job_id]);
  }
  // ajaxでjsonを取得する
  ajax({
    url: json_url + '/' + job_id + '.json',
    success: function (res) {
      console.log('get ' + job_id);
      json_cache[job_id] = res;
      if (success) success(res);
    },
    error: function () {
      console.error('can\'t get ' + job_id);
      if (error) error();
    }
  });
}

/* 
 * ajax(opt)
 */
function ajax(opt) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', opt.url, true);
  xhr.responseType = 'text';
  xhr.onreadystatechange = function (event) {
    if (xhr.readyState === 4) {
      if (is_local_file || xhr.status === 200) {
        var data = xhr.responseText;
        if (typeof data === 'string') data = JSON.parse(data);
        if (opt.success) return opt.success(data);
      } else {
        if (opt.error) return opt.error();
      }
    }
  };
  xhr.onerror = function (event) {
    if (opt.error) opt.error();
  };
  xhr.send(null);
}