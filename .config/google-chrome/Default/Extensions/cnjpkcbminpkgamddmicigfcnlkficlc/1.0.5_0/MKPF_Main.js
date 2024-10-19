// バージョン情報設定処理
function init() {
	var checkExtensionInstall = document.createElement("input");
	checkExtensionInstall.id = "mkpf-extension-is-installed";
	checkExtensionInstall.type = "hidden";
	checkExtensionInstall.value =  chrome.runtime.getManifest().version;
	document.body.appendChild(checkExtensionInstall);
	document.addEventListener("launchMKPFApp", content, false);
	window.addEventListener("beforeunload", close, false);
}

// マイキーID作成・登録準備ソフト開始要求処理
function content(event) {
	chrome.runtime.sendMessage(
		{
			type: "launch",
			message: event.detail
		},
		callback
	);
}

// メッセージ受信処理
function callback(response) {
	var cevent = new CustomEvent("recvMKPFMsg",{"bubbles":true,"detail":JSON.stringify(response)});
	window.document.dispatchEvent(cevent);
}

// マイキーID作成・登録準備ソフト終了要求処理
function close(event){
   chrome.runtime.sendMessage(
        {
           type: "close", 
           message: "99"
        }, 
        res => {}
    );
}

init();
