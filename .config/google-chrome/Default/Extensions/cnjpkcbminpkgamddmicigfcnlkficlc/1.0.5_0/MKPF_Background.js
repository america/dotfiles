var portDict = {};
var resultMessageDict = {};
var callbackDict = {};

chrome.runtime.onMessage.addListener(selectEvent);

// イベント設定
function selectEvent(request, sender, sendResponse) {
	callbackDict[sender.tab.id] = sendResponse;
	if(request.type == "launch") {
		postToNativeHost(sender.tab.id, request.message);
	}else if(request.type == "close") {
		closeApp(sender.tab.id, request.message);
	}
	return true;
}

// メッセージ送信処理
function postToNativeHost(tabId, msg) {
	var nativeMessagingHost = "jp.go.soumu.mykey.id";
	var port = chrome.runtime.connectNative(nativeMessagingHost);
	resultMessageDict[tabId] = null;
	
	// マイキーID作成・登録準備ソフト終了監視処理
	port.onDisconnect.addListener(() => {
		portDict[tabId] = null;
		if(resultMessageDict[tabId] == null) {
			var errMsg = "エラー[MKEC101E]アプリケーション起動失敗";
			createErrMsg(errMsg, callbackDict[tabId]);
		}
	});
	// メッセージ受信処理
	port.onMessage.addListener(message => {
		resultMessageDict[tabId] = message;
		if(resultMessageDict[tabId] == null){
			var errMsg = "エラー[MKEC201E]メッセージ取得失敗";
			createErrMsg(errMsg, callbackDict[tabId]);
		}else{
			var jsonMessage = { "extResult":"0", "extMsg":"", "resultData":message };
			callbackDict[tabId](jsonMessage);
		}
		var port = portDict[tabId];
		port.disconnect();
		portDict[tabId] = null;
	});
	
	portDict[tabId] = port;
	try {
		port.postMessage(JSON.parse(msg));
	}catch(e){
		portDict[tabId] = null;
		var errMsg = "エラー[MKEC102E]メッセージ送信失敗";
		createErrMsg(errMsg, callbackDict[tabId]);
	}
}

// マイキーID作成・登録準備ソフト終了要求処理
function closeApp(tabId, msg) {
	var port = portDict[tabId];
	if (port != null) {
		port.postMessage({ mode: msg });
		var ua = window.navigator.userAgent;
		// 終了要求の送信後、100ミリ秒待ってからポートを切断する
		setTimeout(() => {
			// macOSの場合、ポートを切断するとアプリケーションが終了してしまうため、OSのチェックを行なう
			if(ua.indexOf("Intel Mac OS X") == -1) {
				// macOS以外の場合、ポートを切断
				port.disconnect();
			}
			portDict[tabId] = null;
		}, 100);
	}
}

// エラーメッセージ作成
function createErrMsg(errMsg, callback){
	var jsonMessage = { "extResult":"1", "extMsg":errMsg, "resultData":"" };
	callback(jsonMessage);
}
