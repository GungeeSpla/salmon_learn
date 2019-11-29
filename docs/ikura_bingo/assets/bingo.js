//window.localStorage.clear();
window.bingo_card_width = 5;
window.bingo_card_height = 5;
window.bingo_card_cell_num = bingo_card_width * bingo_card_height;
window.bingo_card_center_y = Math.floor(bingo_card_height / 2) * bingo_card_width; 
window.bingo_card_center_x = Math.floor(bingo_card_width / 2);
window.bingo_card_center_index = bingo_card_center_y + bingo_card_center_x;
window.queries = get_queries();
window.bingo_num_min = 0;
window.bingo_num_max = 99;
window.card = [];
window.card_holes = [];
window.card_bingo_num = 0;
window.card_reach_num = 0;
window.card_reach_indexes = 0;
window.player_name = '';
window.player_code = 0;
window.balls = [];
window.card_step = 0;
window.card_step_max = 999;
window.with_replacement = true;
window.is_daily = true;
window.free_str = 'FREE';
window.bingo_clear_steps = [];
window.dom = {};
window.is_created_card = false;
window.is_enabled_alert = true;
window.is_enabled_center_free = true;
window.is_enabled_stream_mode = false;
window.hidden_card_timer = 0;
window.hidden_card_delay = 8000;
window.click_event = 'ontouchend' in window ? 'ontouchend' : 'onclick';
window.last_hide_type = 'hidden-1';
window.storage_key = 'ikura-bingo';
window.save_variables = [
  'card', 'card_holes', 'player_name', 'player_code',
  'is_enabled_center_free', 'bingo_num_min', 'bingo_num_max',
];
window.check_bingo_configs = [
  {
    line_num: bingo_card_width,
    start: (i) => {return i},
    step: bingo_card_width,
    len: bingo_card_height,
  },
  {
    line_num: bingo_card_height,
    start: (i) => {return i * bingo_card_width},
    step: 1,
    len: bingo_card_width,
  },
  {
    line_num: 1,
    start: (i) => {return 0},
    step: bingo_card_width + 1,
    len: bingo_card_width,
  },
  {
    line_num: 1,
    start: (i) => {return bingo_card_width - 1},
    step: bingo_card_width - 1,
    len: bingo_card_width,
  },
];

/* 
 * onload()
 */
window.onload = () => {
  console.log('loaded');
  
  load_storage();
  
  dom.player_name_input = document.querySelector('.name-input');
  dom.config = document.querySelector('.config');
  dom.config_max_num = document.querySelector('.config-max-num');
  dom.config_min_num = document.querySelector('.config-min-num');
  dom.config_free = document.querySelector('.config-free');
  dom.controler_1 = document.querySelector('.controler-1');
  dom.controler_1 = document.querySelector('.controler-1');
  dom.controler_1 = document.querySelector('.controler-1');
  dom.controler_2 = document.querySelector('.controler-2');
  dom.bingo_card_table = document.querySelector('.bingo-card-table-wrapper table');
  dom.bingo_card_outer = document.querySelector('.bingo-card-outer');
  dom.bingo_card_name = document.querySelector('.bingo-card-name');
  dom.alert_wrapper = document.querySelector('.alert-wrapper');
  dom.alert_outer = document.querySelector('.alert-outer');
  dom.alert_inner = document.querySelector('.alert-inner');
  dom.alert_title = document.querySelector('.alert-title');
  dom.alert_message = document.querySelector('.alert-message');
  dom.alert_ok = document.querySelector('.alert-button-wrapper-ok-cancel .alert-button-ok');
  dom.alert_cancel = document.querySelector('.alert-button-wrapper-ok-cancel .alert-button-cancel');
  dom.alert_only_ok = document.querySelector('.alert-button-wrapper-only-ok .alert-button-ok');
  dom.alert_ok_cancel_wrapper = document.querySelector('.alert-button-wrapper-ok-cancel');
  dom.alert_only_ok_wrapper = document.querySelector('.alert-button-wrapper-only-ok');
  dom.bingo_card_cells = dom.bingo_card_table.querySelectorAll('td');
  dom.stream_mode_button = document.querySelector('.stream-mode-button');
  dom.n_test_button = document.querySelector('.n-test-button');
  dom.create_card_button = document.querySelector('.create-card-button');
  dom.create_card_daily_button = document.querySelector('.create-card-daily-button');
  for (var i = 0; i < bingo_card_cell_num; i++) {
    dom.bingo_card_cells[i].setAttribute('cell-index', i);
    dom.bingo_card_cells[i][click_event] = cell_click;
  }
  dom.player_name_input.value = player_name;
  dom.create_card_button[click_event] = create_card_button_click;
  dom.create_card_daily_button[click_event] = create_card_button_click;
  
  if (queries) {
    if (queries.stream === '1') {
      dom.stream_mode_button.style.display = 'block';
      dom.stream_mode_button[click_event] = enable_stream_mode;
      dom.n_test_button.style.display = 'block';
      dom.n_test_button[click_event] = () => {
        N_test(300);
      };
    }
    if (queries.free) {
      is_enabled_center_free = (queries.free !== '0');
    }
    if (queries.max) {
      bingo_num_max = parseInt(queries.max);
    }
    if (queries.min) {
      bingo_num_min = parseInt(queries.min);
    }
    if (queries.config === '1') {
      dom.config.style.display = 'block';
    }
  }
  
  dom.config_free.checked = is_enabled_center_free;
  dom.config_max_num.value = bingo_num_max;
  dom.config_min_num.value = bingo_num_min;
  dom.config_free.onchange = function(e) {
    is_enabled_center_free = this.checked;
    console.log('is_enabled_center_free: ' + is_enabled_center_free);
    save_storage();
  };
  dom.config_max_num.onchange = function(e) {
    var val = this.value;
    if (typeof val === 'string') {
      val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      val = parseInt(val);
      if (typeof val === 'number') {
        bingo_num_max = val;
        console.log('bingo_num_max: ' + bingo_num_max);
        save_storage();
      }
    }
  };
  dom.config_min_num.onchange = function(e) {
    var val = this.value;
    if (typeof val === 'string') {
      val = val.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
      });
      val = parseInt(val);
      if (typeof val === 'number') {
        bingo_num_min = val;
        console.log('bingo_num_min: ' + bingo_num_min);
        save_storage();
      }
    }
  };
  
  if (player_code !== 0) {
    init_bingo(true);
    for (var i = 0; i < bingo_card_cell_num; i++) {
      if (card_holes[i]) {
        dom.bingo_card_cells[i].classList.add('hole');
      }
    }
  }
}

/* 
 * create_card_button_click()
 */
function create_card_button_click() {
  if (bingo_num_max - bingo_num_min + 1 < 25) {
    my_alert({
      title: 'エラー',
      message: 'ビンゴカードの数字は<br>25個通り以上必要です。',
    });
    return;
  }
  
  is_daily = this.getAttribute('daily') === 'true';
  
  var _player_name = dom.player_name_input.value;
  var _player_code = str_2_int(_player_name);
  if (_player_code === 0) {
    _player_code = new Date().getTime();
  }
  if (is_daily) {
    _player_code += get_date_code();
  }
  if (player_code === _player_code) {
    my_alert({
      title: 'ビンゴカードの初期化',
      message: 'ビンゴカードが初期化されます。<br>よろしいですか？',
      ok: init_bingo,
    });
  } else {
    my_alert({
      title: 'ビンゴカードの新規作成',
      message: 'ビンゴカードが新しく作られます。<br>数字の並びが変化しますが<br>よろしいですか？',
      ok: init_bingo,
    });
  }
  
}

/* 
 * cell_click()
 */
function cell_click() {
  if (!is_created_card) {
    return;
  }
  var cell_index = parseInt(this.getAttribute('cell-index'));
  if (this.textContent === free_str) {
    return;
  }
  var is_hole = card_holes[cell_index];
  if (!is_hole) {
    card_holes[cell_index] = true;
    this.classList.add('hole');
    update(true);
  } else {
    card_holes[cell_index] = false;
    this.classList.remove('hole');
    update(false);
  }
  function update(is_create_hole) {
    save_storage();
    var [bingo_num, reach_num, reach_indexes] = check_bingo(card_holes);
    if (is_create_hole && bingo_num > 0 && card_bingo_num < bingo_num) {
      var message = bingo_num + 'ビンゴです！';
      if (bingo_num === 1) message = 'おめでとうございます！';
      my_alert({
        title: 'BINGO!',
        message: message,
      });
    } else if (is_create_hole && reach_num > 0 && card_reach_num < reach_num) {
      my_alert({
        title: 'REACH!',
        message: reach_num + 'リーチになりました！'
      });
    }
    for (var i = 0; i < bingo_card_cell_num; i++) {
      dom.bingo_card_cells[i].classList.remove('reach');
      if (reach_indexes.indexOf(i) > -1) {
        dom.bingo_card_cells[i].classList.add('reach');
      }
    }
    card_bingo_num = bingo_num;
    card_reach_num = reach_num;
    card_reach_indexes = reach_indexes;
    if (is_enabled_stream_mode) {
      clearTimeout(hidden_card_timer);
      hidden_card_timer = setTimeout(hide_card, hidden_card_delay);
    }
  }
}

/* 
 * enable_stream_mode(e)
 */
function enable_stream_mode(e) {
  e.stopPropagation();
  dom.n_test_button.style.display = 'none';
  dom.stream_mode_button.style.display = 'none';
  document.body.classList.add('stream');
  dom.controler_1[click_event] = (e) => {
    if (dom.bingo_card_outer.classList.contains('hidden')) {
      dom.bingo_card_outer.classList.remove('hidden');
      dom.bingo_card_outer.classList.remove('hidden-1');
      dom.bingo_card_outer.classList.remove('hidden-2');
      clearTimeout(hidden_card_timer);
      hidden_card_timer = setTimeout(hide_card, hidden_card_delay);
    } else {
      dom.bingo_card_outer.classList.add('hidden');
      dom.bingo_card_outer.classList.add('hidden-1');
      last_hide_type = 'hidden-1';
    }
  };
  dom.controler_2[click_event] = (e) => {
    if (dom.bingo_card_outer.classList.contains('hidden')) {
      dom.bingo_card_outer.classList.remove('hidden');
      dom.bingo_card_outer.classList.remove('hidden-1');
      dom.bingo_card_outer.classList.remove('hidden-2');
      clearTimeout(hidden_card_timer);
      hidden_card_timer = setTimeout(hide_card, 10000);
    } else {
      dom.bingo_card_outer.classList.add('hidden');
      dom.bingo_card_outer.classList.add('hidden-2');
      last_hide_type = 'hidden-2';
    }
  };
  dom.bingo_card_outer[click_event] = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  dom.bingo_card_name.style.cursor = 'crosshair';
  dom.bingo_card_name[click_event] = (e) => {
    dom.bingo_card_outer.classList.remove('hidden');
    dom.bingo_card_outer.classList.remove('hidden-1');
    dom.bingo_card_outer.classList.remove('hidden-2');
    clearTimeout(hidden_card_timer);
  };
  dom.bingo_card_outer.appendChild(dom.alert_wrapper);
  is_enabled_stream_mode = true;
  //is_enabled_alert = false;
};

/* 
 * hide_card()
 */
function hide_card() {
  dom.bingo_card_outer.classList.add(last_hide_type);
}

/* 
 * Xors(n)
 */
function Xors(n) {
	var x, y, z, w;
	this.seed = function(n) {
		x = 123456789;
		y = 362436069;
		z = 521288629;
		w = n || 88675123;
	};
	this.random = function() {
		var t;
		t = x ^ (x << 11);
		x = y; y = z; z = w;
		w = (w^(w>>19))^(t^(t>>8));
		return (w % 1E5) / 1E5;
	};
	this.seed(n);
};

/* 
 * init_bingo()
 */
function init_bingo(is_load) {
  console.log('init bingo');
  if (bingo_num_max - bingo_num_min + 1 < 25) {
    my_alert({
      title: 'エラー',
      message: 'ビンゴカードの数字は<br>25個通り以上必要です。',
    });
    return;
  }
  player_name = dom.player_name_input.value;
  if (!is_load) {
    player_code = str_2_int(player_name);
    if (player_code === 0) {
      player_code = new Date().getTime();
    }
    if (is_daily) {
      player_code += get_date_code();
    }
  }
  console.log('player_name: ' + player_name);
  console.log('player_code: ' + player_code);
  dom.bingo_card_name.textContent = player_name;
  var xors = new Xors(player_code);
  init_card(xors, is_load);
  is_created_card = true;
  card_bingo_num = 0;
  card_reach_num = 0;
  card_reach_indexes = 0;
  save_storage();
}

/* 
 * N_test(N)
 */
function N_test(N) {
  init_bingo();
  bingo_clear_steps = [];
  for (var i = 0; i < N; i++) {
    var step = one_play();
    bingo_clear_steps.push(step);
  }
  var sum = 0;
  var min = 9999;
  var max = 0;
  for (var i = 0; i < N; i++) {
    var num = bingo_clear_steps[i];
    sum += num;
    if (num < min) min = num;
    if (num > max) max = num;
  }
  my_alert({
    title: 'シミュレーション結果',
    message: 'ビンゴするまでの抽選回数は<br>' +
      '平均値: ' + (sum/N).toFixed(0) + '<br>'+
      '最小値: ' + (min) + '<br>'+
      '最大値: ' + (max) + '<br>'+
      '(' + N + '人中)',
  });
}

/* 
 * render_card(_card)
 */
function render_card(_card) {
  var html = '';
  for (var i = 0; i < _card.length; i++) {
    var str = _card[i];
    if (bingo_num_min === 0 && bingo_num_max === 99 && str !== free_str) {
      str = ('00' + str).slice(-2);
    }
    dom.bingo_card_cells[i].textContent = str;
  }
}

/* 
 * one_play()
 */
function one_play() {
  init_card(Math);
  while (true) {
    card_step++;
    drill(card, card_holes, open_ball(balls));
    var [bingo_num, reach_num, reach_indexes] = check_bingo(card_holes);
    if (bingo_num > 0 || card_step > card_step_max) {
      break;
    }
  }
  render_card(card);
  return card_step;
}

/* 
 * init_card()
 */
function init_card(xors, is_load) {
  card = create_card(xors);
  if (!is_load) {
    card_holes = create_card_holes();
  }
  if (is_enabled_center_free) {
    card_holes[bingo_card_center_index] = true;
  }
  balls = create_balls();
  card_step = 0;
  for (var i = 0; i < bingo_card_cell_num; i++) {
    dom.bingo_card_cells[i].classList.remove('hole');
    dom.bingo_card_cells[i].classList.remove('reach');
  }
  render_card(card);
}

/* 
 * create_balls()
 */
function create_balls() {
  var arr = [];
  for (var i = bingo_num_min; i <= bingo_num_max; i++) {
    arr.push(i);
  }
  return arr;
}

/* 
 * open_ball(_balls)
 */
function open_ball(_balls) {
  if (with_replacement) {
    return bingo_num_min + Math.floor(Math.random() * (bingo_num_max - bingo_num_min + 1));
  } else {
    var r = Math.floor(Math.random() * _balls.length);
    var num = _balls[r];
    _balls.splice(r, 1);
    return num;
  }
}

/* 
 * create_card()
 */
function create_card(xors) {
  var balls_for_card = [];
  for (var i = 0; i < bingo_card_width; i++) {
    balls_for_card[i] = [];
  }
  var len = bingo_num_max - bingo_num_min + 1;
  for (var i = 0; i < len; i++) {
    var x = Math.floor(i / (len / bingo_card_width));
    x = Math.min(bingo_card_width - 1, Math.max(0, x));
    balls_for_card[x].push(bingo_num_min + i);
  }
  var new_card = [];
  for (var i = 0; i < bingo_card_width; i++) {
    for (var j = 0; j < bingo_card_height; j++) {
      var r = Math.floor(xors.random() * balls_for_card[i].length);
      var num = balls_for_card[i][r];
      balls_for_card[i].splice(r, 1);
      new_card[j * bingo_card_width + i] = num;
    }
  }
  dom.bingo_card_cells[bingo_card_center_index].classList.remove('free');
  if (is_enabled_center_free) {
    dom.bingo_card_cells[bingo_card_center_index].classList.add('free');
    new_card[bingo_card_center_index] = free_str;
  }
  return new_card;
}

/* 
 * create_card_holes()
 */
function create_card_holes() {
  var new_card_holes = [];
  for (var i = 0; i < bingo_card_width; i++) {
    for (var j = 0; j < bingo_card_height; j++) {
      new_card_holes[i * bingo_card_width + j] = false;
    }
  }
  return new_card_holes;
}

/* 
 * drill(_card, _card_holes, _num)
 */
function drill(_card, _card_holes, _num) {
  for (var i = 0; i < _card.length; i++) {
    if (_card[i] === _num) {
      _card_holes[i] = true;
      dom.bingo_card_cells[i].classList.add('hole');
    }
  }
}

/* 
 * check_bingo(_card_holes)
 */
function check_bingo(_card_holes) {
  var bingo_num = 0;
  var reach_num = 0;
  var reach_indexes = [];
  for (var i_cfg = 0; i_cfg < check_bingo_configs.length; i_cfg++) {
    var cfg = check_bingo_configs[i_cfg];
    for (var i = 0; i < cfg.line_num; i++) {
      var flag = true;
      var hole_num = 0;
      var not_hole_index = -1;
      for (var j = 0; j < cfg.len; j++) {
        var index = cfg.start(i) + j * cfg.step;
        if (!_card_holes[index]) {
          not_hole_index = index;
        } else {
          hole_num++;
        }
      }
      if (hole_num === cfg.len) {
        bingo_num++;
      } else if (hole_num === cfg.len - 1) {
        reach_indexes.push(not_hole_index);
        reach_num++;
      }
    }
  }
  // ビンゴせず
  return [bingo_num, reach_num, reach_indexes];
}

/* 
 * save_storage()
 */
function save_storage() {
  var save_data_obj = {};
  window.save_variables.map(var_name => {
    save_data_obj[var_name] = window[var_name];
  });
  var json_str = JSON.stringify(save_data_obj);
  //console.log(json_str);
  localStorage.setItem(window.storage_key, json_str);
  console.log('-- save variables');
}

/* 
 * load_storage()
 */
function load_storage() {
  var json_str = localStorage.getItem(window.storage_key);
  if (json_str !== null) {
    console.log('-- storage data exist');
    console.log('-- merging storage variables to window');
    //console.log(json_str);
    var save_data_obj = JSON.parse(json_str);
    window.save_variables.map(var_name => {
      if (typeof save_data_obj[var_name] !== 'undefined') {
        window[var_name] = save_data_obj[var_name];
      }
    });
  } else {
    console.log('-- storage data doesn\'t exist');
  }
}

/* 
 * str_2_int()
 */
function str_2_int(str) {
  var ret = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    ret += c * (i << 10);
  }
  return ret;
}

/* 
 * get_date_code()
 */
function get_date_code() {
  var offset_time = new Date().getTime() - 3 * 60 * 60 * 1000;
  var offset_date = new Date(offset_time);
  var str = '' +
    offset_date.getFullYear() + 
    (offset_date.getMonth() + 1) + 
    offset_date.getDate();
  return parseInt(str);
}

/* 
 * get_queries()
 */
function get_queries() {
	var query_str = window.location.search.slice(1);
			queries = {};
	if (!query_str) {
		return queries;
	}
	query_str.split('&').forEach(function(query_str) {
		var query_arr = query_str.split('=');
		if (query_arr[1]) {
			queries[query_arr[0]] = query_arr[1];
		}
		else {
			queries[query_arr[0]] = '';
		}
	});
	return queries;
}

/* 
 * my_alert(opt)
 */
function my_alert(opt) {
  if (opt === undefined) opt = {};
  if (opt.title === undefined) opt.title = 'Title';
  if (opt.message === undefined) opt.message = '';
  if (opt.ok === undefined) {
    opt.is_only_ok = true;
  } else {
    opt.is_only_ok = false;
  }
  if (!is_enabled_alert) {
    if (opt.ok) return opt.ok();
    else return false;
  }
  var time = 200;
  var hide = () => {
    dom.alert_inner.style.transform = 'scale(0.95)';
    dom.alert_wrapper.style.opacity = 0;
    setTimeout(() => {
      dom.alert_wrapper.style.display = 'none';
    }, time);
  };
  var show = () => {
    dom.alert_wrapper.style.display = 'block';
    setTimeout(() => {
      dom.alert_inner.style.transform = 'scale(1)';
      dom.alert_wrapper.style.opacity = 1;
    },10);
  };
  var cancel = () => {
    hide();
  };
  var return_false = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  var ok = () => {
    if (opt.ok) opt.ok();
    hide();
  };
  if (opt.is_only_ok) {
    dom.alert_only_ok_wrapper.style.display = 'flex';
    dom.alert_ok_cancel_wrapper.style.display = 'none';
  } else {
    dom.alert_only_ok_wrapper.style.display = 'none';
    dom.alert_ok_cancel_wrapper.style.display = 'flex';
  
  }
  dom.alert_title.innerHTML = opt.title;
  dom.alert_message.innerHTML = opt.message;
  dom.alert_outer[click_event] = cancel;
  dom.alert_inner[click_event] = return_false;
  dom.alert_ok[click_event] = ok;
  dom.alert_cancel[click_event] = cancel;
  dom.alert_only_ok[click_event] = cancel;
  show();
}