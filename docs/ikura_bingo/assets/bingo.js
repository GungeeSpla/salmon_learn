//window.localStorage.clear();
window.bingo_card_width = 5;
window.bingo_card_height = 5;
window.bingo_card_cell_num = bingo_card_width * bingo_card_height;
window.bingo_card_center_y = Math.floor(bingo_card_height / 2) * bingo_card_width; 
window.bingo_card_center_x = Math.floor(bingo_card_width / 2);
window.bingo_card_center_index = bingo_card_center_y + bingo_card_center_x;
window.bingo_num_min = 0;
window.bingo_num_max = 99;
window.queries = get_queries();
window.card = [];
window.card_holes = [];
window.player_name = '';
window.player_code = 0;
window.balls = [];
window.card_step = 0;
window.hole_str = 'FREE';
window.bingo_clear_steps = [];
window.dom = {};
window.is_created_card = false;
window.is_enabled_alert = true;
window.storage_key = 'ikura-bingo';
window.save_variables = [
  'card', 'card_holes', 'player_name', 'player_code',
];

/* 
 * onload()
 */
window.onload = () => {
  console.log('loaded');
  
  load_storage();
  
  dom.player_name_input = document.querySelector('.name-input');
  dom.bingo_card_table = document.querySelector('.bingo-card-table-wrapper table');
  dom.bingo_card_outer = document.querySelector('.bingo-card-outer');
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
  for (var i = 0; i < bingo_card_cell_num; i++) {
    dom.bingo_card_cells[i].setAttribute('cell-index', i);
    dom.bingo_card_cells[i].onclick = function() {
      if (!is_created_card) {
        return;
      }
      var cell_index = parseInt(this.getAttribute('cell-index'));
      if (cell_index === bingo_card_center_index) {
        return;
      }
      var is_hole = card_holes[cell_index];
      if (!is_hole) {
        card_holes[cell_index] = true;
        this.classList.add('hole');
        save_storage();
        if (check(card_holes)) {
          my_alert({
            title: 'BINGO!',
          });
        }
      } else {
        card_holes[cell_index] = false;
        this.classList.remove('hole');
        save_storage();
      }
    }
  }
  dom.bingo_card_cells[bingo_card_center_index].classList.add('free');
  dom.bingo_card_cells[bingo_card_center_index].textContent = hole_str;
  dom.player_name_input.value = player_name;
  
  document.querySelector('.create-card-button').onclick = () => {
    my_alert({
      title: 'ビンゴカードの初期化',
      message: 'ビンゴカードを初期化します。よろしいですか？',
      ok: init_bingo,
    });
  };
  if (player_code !== 0) {
    init_bingo(true);
    for (var i = 0; i < bingo_card_cell_num; i++) {
      if (card_holes[i]) {
        dom.bingo_card_cells[i].classList.add('hole');
      }
    }
  }
  if (window.queries.stream === '1') {
    dom.stream_mode_button.style.display = 'block';
    dom.stream_mode_button.onclick = enable_stream_mode;
  }
}


/* 
 * enable_stream_mode(e)
 */
function enable_stream_mode(e) {
  e.stopPropagation();
  dom.stream_mode_button.style.display = 'none';
  document.body.classList.add('stream');
  document.body.onclick = (e) => {
    if (dom.bingo_card_outer.classList.contains('hidden')) {
      dom.bingo_card_outer.classList.remove('hidden');
    } else {
      dom.bingo_card_outer.classList.add('hidden');
    }
  };
  dom.bingo_card_outer.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  is_enabled_alert = false;
};

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
  player_name = dom.player_name_input.value;
  if (!is_load) {
    player_code = str_2_int(player_name);
    if (player_code === 0) {
      player_code = new Date().getTime();
    }
  }
  console.log('player_name: ' + player_name);
  console.log('player_code: ' + player_code);
  var xors = new Xors(player_code);
  init_card(xors, is_load);
  is_created_card = true;
  save_storage();
}

/* 
 * N_test(N)
 */
function N_test(N) {
  bingo_clear_steps = [];
  for (var i = 0; i < N; i++) {
    one_play();
  }
  var sum = 0;
  for (var i = 0; i < N; i++) {
    sum += bingo_clear_steps[i];
  }
  console.log(sum / N);
  console.log(bingo_clear_steps);
}

/* 
 * rand()
 */
function rand() {
  return bingo_num_min + Math.floor(Math.random() * (bingo_num_max - bingo_num_min + 1));
}

/* 
 * render_card(_card)
 */
function render_card(_card) {
  var html = '';
  for (var i = 0; i < _card.length; i++) {
    dom.bingo_card_cells[i].textContent = _card[i];
  }
}

/* 
 * one_play()
 */
function one_play() {
  init_card();
  while (true) {
    card_step++;
    drill(card, card_holes, open_ball(balls));
    drill(card, card_holes, open_ball(balls));
    drill(card, card_holes, open_ball(balls));
    drill(card, card_holes, open_ball(balls));
    render_card(card);
    if (check(card_holes)) {
      //console.log(card_step);
      bingo_clear_steps.push(card_step);
      break;
    }
  }
}

/* 
 * init_card()
 */
function init_card(xors, is_load) {
  card = create_card(xors);
  if (!is_load) {
    card_holes = create_card_holes();
  }
  balls = create_balls();
  card_step = 0;
  for (var i = 0; i < bingo_card_cell_num; i++) {
    dom.bingo_card_cells[i].classList.remove('hole');
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
  return rand();
  var r = Math.floor(Math.random() * _balls.length);
  var num = _balls[r];
  _balls.splice(r, 1);
  //console.log(num);
  return num;
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
  new_card[bingo_card_center_index] = hole_str;
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
  new_card_holes[bingo_card_center_index] = true;
  return new_card_holes;
}

/* 
 * drill(_card, _card_holes, _num)
 */
function drill(_card, _card_holes, _num) {
  for (var i = 0; i < _card.length; i++) {
    if (_card[i] === _num) {
      //_card[i] = hole_str;
      _card_holes[i] = true;
      dom.bingo_card_cells[i].classList.add('hole');
    }
  }
}

/* 
 * check(_card_holes)
 */
function check(_card_holes) {
  // 縦
  for (var i = 0; i < bingo_card_width; i++) {
    var flag = true; start = i, step = bingo_card_width;
    for (var j = 0; j < bingo_card_height; j++) {
      if (!_card_holes[start + j * step]) {
        flag = false;
        break;
      }
    }
    if (flag) return true;
  }
  // 横
  for (var i = 0; i < bingo_card_height; i++) {
    var flag = true; start = i * bingo_card_width, step = 1;
    for (var j = 0; j < bingo_card_width; j++) {
      if (!_card_holes[start + j * step]) {
        flag = false;
        break;
      }
    }
    if (flag) return true;
  }
  // 斜め 左上から右下
  var flag = true; start = 0, step = bingo_card_width + 1;
  for (var j = 0; j < bingo_card_width; j++) {
    if (!_card_holes[start + j * step]) {
      flag = false;
      break;
    }
  }
  if (flag) return true;
  // 斜め 右上から左下
  var flag = true; start = bingo_card_width - 1, step = bingo_card_width - 1;
  for (var j = 0; j < bingo_card_width; j++) {
    if (!_card_holes[start + j * step]) {
      flag = false;
      break;
    }
  }
  if (flag) return true;
  // ビンゴせず
  return false;
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
      window[var_name] = save_data_obj[var_name];
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
    },1);
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
  dom.alert_title.textContent = opt.title;
  dom.alert_message.textContent = opt.message;
  dom.alert_outer.onclick = cancel;
  dom.alert_inner.onclick = return_false;
  dom.alert_ok.onclick = ok;
  dom.alert_cancel.onclick = cancel;
  dom.alert_only_ok.onclick = cancel;
  show();
}