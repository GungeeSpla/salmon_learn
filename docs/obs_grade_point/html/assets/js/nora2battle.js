/*
 * Copyright (c) 2019 @GungeeSpla
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
 
/* 
 * onload()
 */
window.onload = () => {
  console.log('loaded');
  get_first_id(() => {
    window.latest_calc_id = window.first_id - 1;
    window.latest_id = window.first_id - 1;
    get_json_all(window.first_id, last_id, () => {
      update();
      setInterval(update, update_time);
    });
  });
};

window.config_url = '../config.json';
window.json_url = '../json';
window.last_id = 99999;
window.json_cache = {};
window.p1_score = 0;
window.p2_score = 0;
window.nora_num = 2;
window.update_time = 3000;
window.is_local_file = location.origin.indexOf('file://') > -1;
window.boss_define = {
  "6" : {"name": "バクダン", "key": "sakelien-bomber"},
  "9" : {"name": "カタパッド", "key": "sakelien-cup-twins"},
  "12": {"name": "テッパン", "key": "sakelien-shield"},
  "13": {"name": "ヘビ", "key": "sakelien-snake"},
  "14": {"name": "タワー", "key": "sakelien-tower"},
  "15": {"name": "モグラ", "key": "sakediver"},
  "21": {"name": "コウモリ", "key": "sakerocket"},
  "3" : {"name": "キンシャケ", "key": "sakelien-golden"},
  "16": {"name": "グリル", "key": "sakedozer"}
};
window.boss_define_keys = Object.keys(boss_define);



/* 
 * update()
 */
function update() {
  console.log('update');
  get_json_all(window.first_id, last_id, () => {
    //console.log("最後に計算したバイトID: " + latest_calc_id)
    //console.log("取得した最新のバイトID: " + latest_id)
    var new_count = latest_id - latest_calc_id;
    if (new_count <= 0) {
      //console.log("新着リザルトはありません.");
    } else {
      //console.info(new_count + "件の新着リザルトがあります.");
      while (latest_calc_id < latest_id) {
        latest_calc_id++;
        eval_json(latest_calc_id);
      }
    }
  });
}

/* 
 * eval_json(id)
 */
function eval_json(id) {
  if (typeof id === "undefined") id = latest_id;
  get_json(id, (json) => {
    if (!ask_opening(json)) {
      return;
    }
    var grade_point_delta = json.grade_point_delta;
    var grade_point_after = json.grade_point;
    $(".grade_point .before").text(grade_point);
    $(".grade_point .after").text(grade_point_after);
    grade_point = grade_point_after;
    var p1 = json.my_result;
    var p2 = json.other_results[0];
    var $p1 = $(".result_line_a");
    var $p2 = $(".result_line_b");
    $p1.find(".player_name").text(p1.name);
    $p2.find(".player_name").text(p2.name);
    $p1.find(".golden_ikura .num").text(p1.golden_ikura_num);
    $p1.find(".ikura .num").text(p1.ikura_num);
    $p1.find(".help .num").text(p1.help_count);
    $p1.find(".dead .num").text(p1.dead_count);
    $p1.find(".kill .num").text(p1.boss_kill_count);
    $p2.find(".golden_ikura .num").text(p2.golden_ikura_num);
    $p2.find(".ikura .num").text(p2.ikura_num);
    $p2.find(".help .num").text(p2.help_count);
    $p2.find(".dead .num").text(p2.dead_count);
    $p2.find(".kill .num").text(p2.boss_kill_count);
    var p1_score_delta = 0;
    var p2_score_delta = 0;
    var keys = [
      "golden_ikura_num",
      "ikura_num",
      "boss_kill_count",
      "help_count",
      "dead_count"
    ];
    keys.forEach(function(key){
      if (key === "dead_count") {
        if (p1[key] < p2[key]) p1_score_delta += 2;
        else if (p1[key] > p2[key]) p2_score_delta += 2;
        else {
          p1_score_delta += 1;
          p2_score_delta += 1;
        }
      } else {
        if (p1[key] > p2[key]) p1_score_delta += 2;
        else if (p1[key] < p2[key]) p2_score_delta += 2;
        else {
          p1_score_delta += 1;
          p2_score_delta += 1;
        }
      }
    });
    var p1_score_after = p1_score + p1_score_delta;
    var p2_score_after = p2_score + p2_score_delta;
    $p1.find(".point .delta").text(p1_score_delta);
    $p1.find(".point .sum_before").text(p1_score);
    $p1.find(".point .sum").text(p1_score_after);
    $p2.find(".point .delta").text(p2_score_delta);
    $p2.find(".point .sum_before").text(p2_score);
    $p2.find(".point .sum").text(p2_score_after);
    p1_score = p1_score_after;
    p2_score = p2_score_after;
  });
}

/* 
 * ask_opening(json)
 */
function ask_opening(json) {
  var offset = 0; //-1 * 60 * 60;
  var now_time = Math.floor(new Date().getTime() / 1000) + offset;
  var start_time = json.start_time;
  var end_time = json.end_time;
  return (start_time < now_time) && (now_time < end_time);
}

/* 
 * get_json_all(first_job_id, final_job_id, call_back)
 */
function get_json_all(first_job_id, final_job_id, call_back) {
  //console.time("get_json_all");
  //var json_data_array = [];
  var job_id = first_job_id;
  var error = function(){
    //console.timeEnd("get_json_all");
    call_back();
  };
  var success = function(res){
    //json_data_array.push(res);
    latest_id = job_id;
    job_id++;
    if (job_id <= final_job_id) {
      get_json(job_id, success, error);
    } else {
      error();
    }
  };
  get_json(job_id, success, error);
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
      calc_boss_kill_count(res);
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
 * calc_boss_kill_count(json_data)
 */
function calc_boss_kill_count(json_data) {
	var player_data = [json_data.my_result];
	for (var i_player = 0; i_player < json_data.other_results.length; i_player++) {
		player_data.push(json_data.other_results[i_player]);
	}
	for (var i_player = 0; i_player < player_data.length; i_player++) {
		var p_data = player_data[i_player];
		p_data.boss_kill_count = 0;
		for (var i_key = 0; i_key < boss_define_keys.length; i_key++) {
			var key = boss_define_keys[i_key];
			var count = p_data.boss_kill_counts[key].count;
			p_data.boss_kill_count += count;
		}
	}
}

/* 
 * get_first_id(call_back)
 */
function get_first_id(call_back) {
  if (window.first_id !== 0) {
    console.log('latest id is ' + window.first_id);
    return call_back();
  }
  ajax({
    url: config_url,
    success: function (res) {
      console.log('get config.json');
      window.first_id = res.latest;
      console.log('latest id is ' + res.latest);
      call_back();
      
    },
    error: function () {
      console.error('can\'t get config.json');
      alert('config.jsonが取得できませんでした');
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
        if (typeof data === 'string' && data) data = JSON.parse(data);
        if (opt.success && data) return opt.success(data);
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