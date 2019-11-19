window.useVideoInputId = 'none';
window.useAudioInputId = 'none';
window.soundVolume     = '100';
window.videoContrast   = '100';
window.debugMode       = 0;
//window.useVideoInputId = '378be3040bee297c25559a0f83b26dbdaa4e50843ef7f8b102b99540661ede93';
//window.useAudioInputId = '760fd3d81dc40653a491b92a8827f5bda396581f8320a863421cc897c8fde642';
window.videoWidth     = 1280;
window.videoHeight    = 720;
window.updateRate     = 2;
window.updateInterval = 1000 / window.updateRate;
window.queries        = getUrlQueries();
window.storageKey     = 'salmonitor';
window.saveVariables  = [
  'useVideoInputId', 'useAudioInputId', 'soundVolume', 'videoContrast', 'debugMode',
];
/*
 * onload()
 */
window.onload = () => {
  console.log('hello!');
  console.log('initializing');
  
  loadStorage();
  //window.debugMode = 2;
  
  //if (useVideoInputId !== 'none') {
  //  synchronizeVideo(window.video);
  //}
  
  window.sound = new Sound('./assets/', [
    'silent', 'death-num-1', 'death-num-2', 'death-num-3', 'death-me',
    'wave-start', 'norma-ok',
  ]);
  
  window.video = document.querySelector("#sync-video");
  window.videoWrapper = document.querySelector("#sync-video-wrapper");
  window.videoWrapper.style.width = window.videoWidth + 'px';
  window.videoWrapper.style.height = window.videoHeight + 'px';
  window.video.setAttribute('width', window.videoWidth);
  window.video.setAttribute('height', window.videoHeight);
  window.canvas = document.querySelector("#canvas");
  window.canvas.ctx = window.canvas.getContext("2d");
  window.debugCanvas = document.createElement('canvas');
  window.debugCanvas.ctx = window.debugCanvas.getContext("2d");
  
  window.addEventListener('click', () => {
    window.sound.loadAll(() => {
      window.sound.testPlay();
    });
  }, {once: true});
  
  getCaptureDevices();
  setSelectEvent();
  setVolumeSelect();
  setContrastSelect();
  setDebugSelect();
  initBWData();
  
  var cover = document.querySelector('#cover');
  cover.style.opacity = '0';
  setTimeout(() => {
    cover.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
  
  console.log('initialized!');
};

/* 
 * getCaptureDevices()
 * 映像･音声入力デバイスを取得する
 * 取得したデバイスを<select>にぶち込む
 */
function getCaptureDevices() {
  var videoSelect = document.querySelector('#video-input-select');
  var audioSelect = document.querySelector('#audio-input-select');
  // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/enumerateDevices
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    console.log('get devices');
    console.log(devices);
    var defaultVideoInputIndex = 0;
    var defaultAudioInputIndex = 0;
    var videoInputIndex = 1;
    var audioInputIndex = 1;
    var defaultVideoOption = createOption('未使用', 'none');
    var defaultAudioOption = createOption('未使用', 'none');
    videoSelect.appendChild(defaultVideoOption);
    audioSelect.appendChild(defaultAudioOption);
    devices.map(device => {
      var targetSelect = null;
      var label = device.label;
      // よくわからないが末尾の(07ca:3510)みたいな記号を消す
      var dust = label.match(/\([0-9a-zA-Z]{4}:[0-9a-zA-Z]{4}\)/);
      if (dust) {
        label = label.substr(0, dust.index);
      }
      switch (device.kind.toLowerCase()) {
      // 音声出力デバイス
      case 'audiooutput':
        break;
      // 映像入力デバイス
      case 'videoinput':
        targetSelect = videoSelect;
        //if (device.deviceId === useVideoInputId) {
        //  console.log('found use-video-input-id');
        //  defaultVideoInputIndex = videoInputIndex;
        //}
        label = videoInputIndex + ': ' + label;
        videoInputIndex++;
        break;
      // 音声入力デバイス
      case 'audioinput':
        targetSelect = audioSelect;
        //if (device.deviceId === useAudioInputId) {
        //  console.log('found use-audio-input-id');
        //  defaultAudioInputIndex = audioInputIndex;
        //}
        label = audioInputIndex + ': ' + label;
        audioInputIndex++;
        break;
      }
      if (targetSelect && label.toLowerCase().indexOf('webcam') < 0) {
        var option = createOption(label, device.deviceId);
        targetSelect.appendChild(option);
      }
    });
    videoSelect.selectedIndex = defaultVideoInputIndex;
    audioSelect.selectedIndex = defaultAudioInputIndex;
    addSampleVideos();
  })
  .catch(function(err) {
    var defaultVideoOption = createOption('映像入力デバイスを取得できませんでした', 'none');
    var defaultAudioOption = createOption('音声入力デバイスを取得できませんでした', 'none');
    videoSelect.appendChild(defaultVideoOption);
    audioSelect.appendChild(defaultAudioOption);
    console.log(err.name + ": " + err.message);
  });
}

/* 
 * createOption(label, value)
 * <option>を作成する
 */
function createOption(label, value) {
  var option = document.createElement('option');
  option.textContent = label;
  option.setAttribute('value', value);
  return option;
}

/* 
 * addSampleVideos()
 * サンプル動画を<select>に追加する
 */
function addSampleVideos() {
  if (window.debugMode >= 2) {
    var videoSelect = document.querySelector('#video-input-select');
    var sampleVideos = document.querySelectorAll('#materials video');
    if (sampleVideos) {
      for (var i = 0; i < sampleVideos.length; i++) {
        var sampleVideo = sampleVideos[i];
        var label = sampleVideo.src.split('/').pop();
        var value = 'sample: ' + sampleVideo.src;
        var option = createOption(label, value);
        videoSelect.appendChild(option);
      }
    }
  }
}

/* 
 * setSampleVideo(src)
 * サンプル動画を<video>にセットする
 */
function setSampleVideo(src) {
  window.video.pause();
  window.video.srcObject = null;
  window.video.src = src;
  window.video.play();
  synchronizeCanvas(window.video);
}

/* 
 * setDebugSelect()
 * デバッグモード変更用の<select>を準備する
 */
function setDebugSelect() {
  var debugSelect = document.querySelector('#debug-mode-select');
  debugSelect.appendChild(createOption('OFF', 0));
  debugSelect.appendChild(createOption('ON', 1));
  debugSelect.selectedIndex = window.debugMode;
  debugSelect.addEventListener('change', function(e) {
    var index = this.selectedIndex;
    var option = this.options[index];
    var value = option.getAttribute('value');
    window.debugMode = parseInt(value);
    saveStorage();
    apply();
  });
  apply();
  function apply() {
    switch (window.debugMode) {
    case 0:
      document.querySelector('#debug').style.display = 'none';
      document.querySelector('#debug-variable').style.display = 'none';
      break;
    case 1:
      document.querySelector('#debug').style.display = 'none';
      document.querySelector('#debug-variable').style.display = 'inline-block';
      break;
    case 2:
      document.querySelector('#debug').style.display = 'block';
      document.querySelector('#debug-variable').style.display = 'inline-block';
    }
  }
}

/* 
 * setContrastSelect()
 * コントラスト調節用の<select>を準備する
 */
function setContrastSelect() {
  var contrastSelect = document.querySelector('#video-contrast-select');
  var defaultIndex = 0;
  for (var i = 0; i < 5; i++) {
    var p = (i + 8) * 10;
    var option = createOption(p + '%', p);
    contrastSelect.appendChild(option);
    if (p === parseInt(window.videoContrast)) {
      defaultIndex = i;
    }
  }
  contrastSelect.selectedIndex = defaultIndex;
  contrastSelect.addEventListener('change', function(e) {
    var index = this.selectedIndex;
    var option = this.options[index];
    var value = option.getAttribute('value');
    window.videoContrast = value;
    document.querySelector('#sync-video').style.filter =
      'contrast(' + (parseInt(window.videoContrast)/100) + ')';
    saveStorage();
  });
  document.querySelector('#sync-video').style.filter =
    'contrast(' + (parseInt(window.videoContrast)/100) + ')';
}

/* 
 * setVolumeSelect()
 * 音量調節用の<select>を準備する
 */
function setVolumeSelect() {
  var volumeSelect = document.querySelector('#sound-volume-select');
  var defaultIndex = 0;
  for (var i = 0; i < 11; i++) {
    var p = i * 10;
    var option = createOption(p + '%', p);
    volumeSelect.appendChild(option);
    if (p === parseInt(window.soundVolume)) {
      defaultIndex = i;
    }
  }
  volumeSelect.selectedIndex = defaultIndex;
  volumeSelect.addEventListener('change', function(e) {
    var index = this.selectedIndex;
    var option = this.options[index];
    var value = option.getAttribute('value');
    window.soundVolume = value;
    window.sound.volume = parseInt(window.soundVolume) / 100;
    saveStorage();
  });
  document.querySelector('#sound-test').addEventListener('click', function(e) {
    if (window.sound.isLoaded) {
      window.sound.play('death-num-1');
    } else {
      window.sound.onload = () => {
        window.sound.play('death-num-1');
      };
    }
  });
  window.sound.volume = parseInt(window.soundVolume) / 100;
}

/* 
 * setSelectEvent()
 * <select>にイベントをセットする
** 値が変更されたら<video>の同期を更新する
 */
function setSelectEvent() {
  var videoSelect = document.querySelector('#video-input-select');
  var audioSelect = document.querySelector('#audio-input-select');
  videoSelect.addEventListener('change', function(e) {
    var index = this.selectedIndex;
    var option = this.options[index];
    var value = option.getAttribute('value');
    if (value.indexOf('sample: ') === 0) {
      setSampleVideo(value.replace('sample: ', ''));
    } else {
      useVideoInputId = value;
      synchronizeVideo(window.video);
      synchronizeCanvas(window.video);
      saveStorage();
    }
  });
  audioSelect.addEventListener('change', function(e) {
    var index = this.selectedIndex;
    var option = this.options[index];
    var value = option.getAttribute('value');
    useAudioInputId = value;
    synchronizeVideo();
    saveStorage();
  });
}

/* 
 * synchronizeVideo()
 * 映像･音声入力デバイスと<video>を同期する
 */
function synchronizeVideo(video) {
  console.log('synchronizing video');
  video.pause();
  video.src = '';
  video.srcObject = null;
  var constraints = {
    audio: false,
    video: false
  };
  if (window.useAudioInputId !== 'none') {
    constraints.audio = {
      deviceId: {exact: window.useAudioInputId}
    };
  }
  if (window.useVideoInputId !== 'none') {
    constraints.video = {
      width: videoWidth,
      heiht: videoHeight,
      deviceId: {exact: window.useVideoInputId}
      //facingMode: 'user'
      //facingMode: {exact: 'environment'}
    };
  }
  // https://developer.mozilla.org/ja/docs/Web/API/MediaDevices/getUserMedia
  if (constraints.audio || constraints.video) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = (e) => {
        video.play();
      };
    })
    .catch((err) => {
      console.log(err.name + ": " + err.message);
    });
  }
}

/* 
 * logger
 */
window.logger = {
  log (str) {
    if (false && window.debugMode) console.log(str);
  }
};

/*
 * saveStorage()
 */
function saveStorage() {
  var saveDataObj = {};
  window.saveVariables.map(varName => {
    saveDataObj[varName] = window[varName];
  });
  var jsonStr = JSON.stringify(saveDataObj);
  //console.log(jsonStr);
  localStorage.setItem(window.storageKey, jsonStr);
  console.log('set storage data');
}

/*
 * loadStorage()
 */
function loadStorage() {
  var jsonStr = localStorage.getItem(window.storageKey);
  if (jsonStr !== null) {
    console.log('storage data exist');
    console.log('merging variables to window');
    //console.log(jsonStr);
    var saveDataObj = JSON.parse(jsonStr);
    window.saveVariables.map(varName => {
      window[varName] = saveDataObj[varName];
    });
  } else {
    console.log('storage data doesn\'t exist');
  }
}

/*
 * getUrlQueries()
 */
function getUrlQueries() {
	var queryStr = window.location.search.slice(1);
			queries = {};
	if (!queryStr) {
		return queries;
	}
	queryStr.split('&').forEach(function(queryStr) {
		var queryArr = queryStr.split('=');
		if (queryArr[1]) {
			queries[queryArr[0]] = queryArr[1];
		}
		else {
			queries[queryArr[0]] = '';
		}
	});
	return queries;
}