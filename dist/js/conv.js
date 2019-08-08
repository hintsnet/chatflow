// 定义正则替换函数, 注意这是多行替换.
function regexReplS(orig_str, regex_str, subst_str) {
	const regex = new RegExp(regex_str, 'ms');
	return orig_str.replace(regex, subst_str);
}

function regexReplG(orig_str, regex_str, subst_str) {
	const regex = new RegExp(regex_str, 'gm');
	return orig_str.replace(regex, subst_str);
}

// 定义 URL 参数获取函数
function getQueryVariable(url_params, var_name) {
	if (url_params.length < 1) return false;
  var vars = url_params.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == var_name){ return pair[1]; }
  }
  return false;
}

// 定义 Web 访问路径获取函数
function getBaseURL() {
	return window.location.host + window.location.pathname;
}

// 定义 URL 参数获取函数
function getURLParams() {
	return window.location.search.substring(1);
}

function clearURLParams() {
	var base_url = getBaseURL();
	if (window.history.pushState) {
		window.history.pushState('', '', '');
	}
	return base_url;
}

function clearInnerHTML(domElement) {
	domElement.innerHTML = '';
	return domElement;
}

function isEmpty(text) {
	var regex = new RegExp('[\r\n\t ]+');
	var result = regex.exec(text);
	if (result) {
		return false;
	} else {
		return true;
	}
}

function encodeURLParams(str){
	return LZString.compressToEncodedURIComponent(str);
}

function decodeURLParams(code) {
	return LZString.decompressFromEncodedURIComponent(code);
}

// 定义从 Chatlog 获取谈话人昵称列表的函数
function getUsersFromChatlog(chatlog) {
	var messages = chatlog.split('[$end$]');
	var regex = new RegExp('^([^:\r\n]+):$','ms');
	var users = [];
	for (var message of messages) {
		var result = regex.exec(message);
		if (result && result.length > 0) {
			var username = result[1];
			if (users.indexOf(username) == -1) {
				users.push(username);
			}
		}
	}
	return users;
}

// 为每一位谈话人分配头像
function genUserAvatars(chatlog) {
	var users = getUsersFromChatlog(chatlog);
	var user_dict = {};
	var idx = 1;
	for (var username of users) {
		user_dict[username] = idx;
		idx++;
	}
	for (var key of Object.keys(user_dict)) {
		user_dict[key] = './dist/avatars/' + user_dict[key] + '.png';
	}
	return user_dict;
}

// 为不同谈话人的消息设置分隔符 [$end$]
function chatlogSeparate(chatlog) {
	var regex_str = '[\r\n]{2,}^([^:\r\n]+):$';
	var subst_str = '[\$end\$]\n$1:';
	var separated_chatlog = 
		regexReplG(chatlog, regex_str, subst_str) + '\n';
	return separated_chatlog;
}

function textIndent(text) {
	var lines = text.split('\n');
	var indented_text = '';
	for (var line of lines) {
		indented_text += '      ' + line.trim() + '\n';
	}
	return indented_text;
}

function chatlog2Yaml(chatlog) {
	var user_dict = genUserAvatars(chatlog);
	var yaml_user_def = 'npcs:\n';
	for (var key of Object.keys(user_dict)) {
		yaml_user_def += 
			"  - id: " + key + "\n" +
			"    name: " + key + "\n" +
			"    avatar: " + user_dict[key] + "\n\n";
	}
	var messages = chatlog.split('[$end$]');
	var yaml_chatlog = 'scripts:\n';
	for (var message of messages) {
		var regex = new RegExp('^([^:\r\n]+):[\r\n ]+(.+)$', 'ms');
		var result = regex.exec(message);
		var username = result[1];
		var indented_text = textIndent(result[2]);
		var output_str = '- npc: ' + username + '\n' +
			'  sentences:\n' +
			'  - text: |-\n' + indented_text +
			'    speed: 20\n' +
			'    style:\n' +
			'      display: block\n' +
			'      margin-top: 16px\n' +
			'    delay: 800\n' +
			'  clear: false\n';
		yaml_chatlog += output_str;
	}
	return yaml_user_def + yaml_chatlog;
}
