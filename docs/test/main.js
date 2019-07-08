window.WEAPONS        = false;
window.WEAPONS_URL    = "./weapons.csv";
window.SALMON_API_URL = "https://splamp.info/salmon/api/now";
window.UNIX           = new Unix();
window.initCount      = 0;
function init() {
	getWeaponsData()
	.then(getSalmonAPI)
	.then(render)
	.catch(function(error){
		if (initCount == 0) {
			initCount++;
			console.log("　");
			console.log("APIを叩く代わりにサンプルデータを取得してリトライします...");
			console.log("　");
			window.SALMON_API_URL = "./testapi.html";
			init();
		}
		else {
			console.error("処理を中断します.");
		}
	});
}