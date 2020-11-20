(function(window, document, undefined) {
	function WwLogin(data) {
		var frame = document.createElement("iframe");
		var url = "http://10.81.71.38/wwopen/sso/qrConnect?appid=" + data.appid + "&agentid=" + data.agentid + "&redirect_uri=" + data.redirect_uri + "&state=" + data.state + "&login_type=jssdk";
		url += data.style ? ("&style=" + data.style) : "";
		url += data.href ? ("&href=" + data.href) : "";
		frame.src = url;
		frame.frameBorder = "0";
		frame.allowTransparency="true";
		frame.scrolling = "no";
		frame.width = "300px";
		frame.height = "400px";
		var el = document.getElementById(data.id);
		el.innerHTML = "";
		el.appendChild(frame);

		frame.onload = function() {
			if(frame.contentWindow.postMessage && window.addEventListener){
				window.addEventListener("message", function (event) {
          console.log('login data',event.data)
				});
				frame.contentWindow.postMessage("ask_usePostMessage" , "*")
			}
		};
	}

	window.WwLogin = WwLogin;
})(window, document);