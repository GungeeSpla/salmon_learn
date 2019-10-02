window.onload = function () {
	var j_avatar = $('.avatar');
	j_avatar.each(function(){
		speak($(this));
	});
	function speak (j_this) {
		var time_1 = 1000 + 3 * 1000 * Math.random();
		var time_2 = 1000 + 3 * 1000 * Math.random();
		setTimeout(function(){
			j_this.addClass('speaking');
			setTimeout(function(){
				j_this.removeClass('speaking');
				speak(j_this);
			}, time_2);
		}, time_1);
	}
	var j_button = $('.copy-button');
	j_button.click(function(){
		var j_this = $(this);
		var target_id = j_this.attr('target');
		copy(target_id);
	});
	function copy (id) {
	  var pre = document.getElementById(id);
	  pre.style.webkitUserSelect = 'auto';
	  pre.style.userSelect = 'auto';
	  document.getSelection().selectAllChildren(pre);
	  return document.execCommand("copy");
	}
};