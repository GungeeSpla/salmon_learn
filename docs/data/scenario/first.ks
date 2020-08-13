[eval exp="loadPlugin()"]
;[plugin name=for]
;[plugin name=glink_show]
[iscript]
fixFitBaseSize();

// navigatorの言語
const NAVIGATOR_LANG = navigator.language || navigator.userLanguage || 'ja';

// locationのクエリパラメータ
const LOCATION_QUERIES = ((url) => {
	const urlStr = String(url);
	const queryStr = urlStr.slice(urlStr.indexOf('?') + 1);
	const queries = {};
	if (!queryStr) {
		return queries;
	}
	queryStr.split('&').forEach((queryStr) => {
		const queryArr = queryStr.split('=');
		queries[queryArr[0]] = queryArr[1];
	});
	return queries;
})(window.location);

// locationのクエリパラメータもしくはnavigatorから言語を日本語か英語のどちらかひとつに決定
window.LANG_KEY = (LOCATION_QUERIES.lang === 'ja')
	? 'ja'
	: (LOCATION_QUERIES.lang === 'en')
		? 'en'
		: (NAVIGATOR_LANG.indexOf('ja') > -1)
			? 'ja'
			: 'en';

window.LANG = {
	'g-map': {
		'ja': '間欠泉マップ',
		'en': 'Gusher Map',
	},
	'd-map': {
		'ja': 'コウモリマップ',
		'en': 'Drizzler Map',
	},
	'h-tide': {
		'ja': '満潮',
		'en': 'HT',
	},
	'n-tide': {
		'ja': '通常',
		'en': 'NT',
	},
	'l-tide': {
		'ja': '干潮',
		'en': 'LT',
	},
	'stage-1': {
		'ja': 'シェケナダム',
		'en': 'Grounds',
	},
	'stage-2': {
		'ja': 'ドンブラコ',
		'en': 'Bay',
	},
	'stage-3': {
		'ja': 'シャケト場',
		'en': 'Outpost',
	},
	'stage-4': {
		'ja': 'トキシラズ',
		'en': 'Yard',
	},
	'stage-5': {
		'ja': 'ポラリス',
		'en': 'Ark',
	},
	'rt-mode': {
		'ja': 'リアルタイムモード',
		'en': 'Real-time mode',
	},
	'toggle': {
		'ja': '切替',
		'en': 'toggle',
	},
};
window.getLang = function(key) {
	return LANG[key][LANG_KEY];
};

[endscript]
[jump storage=learn.ks]
[s]