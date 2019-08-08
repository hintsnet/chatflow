(function() {
	// 从页面中获取相关对象
  var manual_input_box = document.getElementById('manual_input');
  var chatbbl_box = document.getElementById('chatbbl');
  var replay_btn = document.getElementById('replay_btn');
  var share_btn = document.getElementById('share_btn');
  // 获取 URL 参数, 并尝试读取 chatlog 变量值
	var base_url = getBaseURL();
	var url_params = getURLParams();
	var url_input = getQueryVariable(url_params, 'chatlog');

	// 页面完全加载后的事件
  jQuery(document).on('ready page:load', function() {
		var chatlog = '';
		if (url_input != false) {
			chatlog = decodeURLParams(url_input);
			manual_input_box.value = chatlog;
		} else {
      chatlog = manual_input_box.value;
		}
		var separated_chatlog = chatlogSeparate(chatlog);
		var yaml = chatlog2Yaml(separated_chatlog);
		var story_data = jsyaml.load(yaml);
		return window.game = new Game(story_data);
  });
	
	// 回放按钮点击事件
  replay_btn.addEventListener('click', function() {
		clearURLParams();
		clearInnerHTML(chatbbl_box);
		var manual_input = manual_input_box.value;
    var chatlog = '';
    if (manual_input.trim().length > 0) {
			chatlog = manual_input;
    } else {
      chatlog = 'pimgeek: 没有对话记录可以回放... \n[$end$]\n';
    }
		var separated_chatlog = chatlogSeparate(chatlog);
		var yaml = chatlog2Yaml(separated_chatlog);
    var story_data = jsyaml.load(yaml);
    return window.game = new Game(story_data);
  });
	
	// 分享按钮点击事件
  share_btn.addEventListener('click', function() {
    var manual_input = manual_input_box.value;
		var chatlog = '';
		var coded_chatlog = '';
		var exported_url = '';
		if (manual_input.trim().length > 0) {
			chatlog = manual_input;
		} else {
			chatlog = 'pimgeek: 没有对话记录可以回放... \n[$end$]\n';
		}
		coded_chatlog = encodeURLParams(chatlog);
		exported_url = getBaseURL() + "?chatlog=" + coded_chatlog;
		prompt("请复制下面的 URL", exported_url);
    return exported_url;
  });
}).call(this);

//# sourceMappingURL=../maps/ui.js.map