/***********************************************************
*修正履歴：
*          新規作成(D19GK002)      保科　裕
*                                  2011/11/20       001/000
*
*          B20GK002                保科　裕
*                                  2020/06/12       002/000
*
*          D20GK001                保科　裕
*                                  2020/07/10       003/000
*
*          D22GK001                保科　裕
*                                  2022/09/20       004/000
*
*          D22CO001                保科　裕
*                                  2023/02/14       005/000
*
*          D23GK002                保科　裕
*                                  2023/05/08       006/000
*
***********************************************************/

// このChrome機能拡張自身のバージョン番号を埋め込む
var elemVer = document.createElement("input");
elemVer.type = "hidden";
elemVer.name = "NtaChromeExt";
elemVer.id = "NtaChromeExt";
elemVer.value = chrome.runtime.getManifest().version;
elemVer.style = "DISPLAY: none";

// Event制御用のタグ（処理状況を自由にValueに書き込むためのタグ）を埋め込む
var elemEve = document.createElement("input");
elemEve.type = "hidden";
elemEve.name = "NtaChromeLaunch";
elemEve.id = "NtaChromeLaunch";
elemEve.value = "";
elemEve.style = "DISPLAY: none";

// Chrome拡張のON/OFFチェックをするためのタグを埋め込む
var elemEveCk = document.createElement("input");
elemEveCk.type = "hidden";
elemEveCk.name = "NtaChromeCheck";
elemEveCk.id = "NtaChromeCheck";
elemEveCk.value = "";
elemEveCk.style = "DISPLAY: none";

// D20GK001 2020/07/10 追加開始
// Chrome拡張の初期化チェックをするためのタグを埋め込む
var elemInitCk = document.createElement("input");
elemInitCk.type = "hidden";
elemInitCk.name = "NtaChromeInitialize";
elemInitCk.id = "NtaChromeInitialize";
elemInitCk.value = "0";    // 0:未初期化 1:初期化完了
elemInitCk.style = "DISPLAY: none";
// D20GK001 2020/07/10 追加終了

var bodyDom = document.body;
bodyDom.appendChild(elemVer);
bodyDom.appendChild(elemEve);
bodyDom.appendChild(elemEveCk);
// D20GK001 2020/07/10 追加開始
bodyDom.appendChild(elemInitCk);
// D20GK001 2020/07/10 追加終了

// D22CO001 2023/02/14 追加開始
var elemUnload = document.createElement("input");
elemUnload.type = "hidden";
elemUnload.name = "NtaChromeUnload";
elemUnload.id = "NtaChromeUnload";
elemUnload.value = "FALSE";    // FALSE:通常 TRUE:1回飛ばす
elemUnload.style = "DISPLAY: none";
bodyDom.appendChild(elemUnload);
// D22CO001 2023/02/14 追加終了

// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//// 連携用メッセージタイプ
//var IPC_MessageType = "";
//
//// サーバーのIPCID
//var connectIPCid = generateRandomUuid();
//
//var swTime = 0;
//
//var timeoutID = 0;
//var timeoutID_Retry = 0;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了


// 該当ページがロードされたらWin32アプリと接続する
window.addEventListener("load", connectNativeApp);

// 該当のページから離れる際に、Win32アプリと切断する
// D22GK001 2022/09/20 削除開始
//window.addEventListener("beforeunload", disconnectNativeApp);
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
window.addEventListener("beforeunload", exitNativeApp);
// D22GK001 2022/09/20 追加終了


// 分割データの結合用
var ChExt_divideData = "";

// 【追加開始】故 B20GK002 2020/06/12
// クラスIDホワイトリスト
// D20GK001 2020/07/10 削除開始
//var clsIdWhitelist = ['025C9843-D96A-4310-AB41-639BE6FA1759','5481160D-367F-4869-BC3A-62E7202A2D2C','62B35ADC-1F8D-4A92-932C-F1E3C695E095','177B7BF8-EEB5-4416-96C3-0C099EF24EF4'];
// D20GK001 2020/07/10 削除終了
// D20GK001 2020/07/10 追加開始
var clsIdWhitelist = [
'025C9843-D96A-4310-AB41-639BE6FA1759',
'5481160D-367F-4869-BC3A-62E7202A2D2C',
'62B35ADC-1F8D-4A92-932C-F1E3C695E095',
'177B7BF8-EEB5-4416-96C3-0C099EF24EF4',
'5250844A-31C5-4580-8055-C35B7C91CC1E',
'AE4A4583-A51F-4848-A491-B5FA0A7194AA',
'BCD5FD1D-BAC3-4817-9502-251DDE63FDDD',
'1B215896-E804-4B22-807D-A4435B6452AD',
'9AC54E3B-E926-40B9-8836-FC1C858C0052',
'3BA45A83-62E0-48E7-B1F4-359F18C3E4F9',
'273EBFE2-4D32-492F-B545-92EB0617A279',
'1E142FAB-020D-4350-8C0F-90CDF3811CBD',
'29796111-D695-48B2-8140-8BF4E8B08D33',
'A2D341FA-984F-4FFE-9941-13DA5E81F24A',
'40F53BFE-11F3-4DAC-ACC9-0B2FC94ABEA0',
'54275066-FA21-482B-8FE5-414C4DA1047F',
'C4DB1235-BA82-4D56-BC9B-6EBD8A4B235F',
'CDCD1A02-C10B-4854-8AF5-836A506A74DE',
'94CBBEAE-44B4-47B2-BD92-D1C60752D8C0',
'CE2B2CC7-36E5-46D2-A24E-2571F7A7650C',
'63CD67D1-6254-4766-B015-90CF350DDF97',
'E1726FCD-2F76-49DE-87D6-E5D234128F9F',
'A1EE0E29-0E7C-40ED-B373-75F99428AC94',
'B0D0FF8B-923A-43FF-9BF3-CB25EC260E6A',
'9855924C-AA0C-4023-A546-060269F53AE7',
'70945B1B-AA72-4463-A6F8-16D571D765E2',
'6B878AD4-1546-43D8-9488-549CD3AFB4D7'
];
// D20GK001 2020/07/10 追加終了
// 【追加終了】故 B20GK002 2020/06/12

/**
 * Win32アプリとの接続処理.<br>
 *
 * @param なし
 * @return なし
 * @type void
 * @since 001
 */
function connectNativeApp() {
    // content.jsまでアクセスができていることを通知
    document.getElementById("NtaChromeCheck").value = "1";

    var request = new Object();
    request.type = 'connect';

    try {
        chrome.runtime.sendMessage(request,
            function (response) {
            });
    } catch(e) {
    }

// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//    // サーバー延命用のポーリング開始
//    setInterval(IPC_ServerPolling, 60000);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了

}

// D22GK001 2022/09/20 追加開始
/**
 * Win32アプリ終了処理.<br>
 *
 * @param なし
 * @return なし
 * @type void
 * @since 001
 */
function exitNativeApp() {
// D22CO001 2023/02/14 追加開始
    // 1回スキップするかどうか
    if(document.getElementById("NtaChromeUnload").value == "TRUE") {
        // フラグを書き換えておく
        document.getElementById("NtaChromeUnload").value = "FALSE";
        return;
    }
// D22CO001 2023/02/14 追加終了

// D23GK002 2023/05/08 削除開始
//    var request = new Object();
//    request.type = 'exit';
//    if(connectIPCid != null && connectIPCid != ""){
//        request.ipcid = connectIPCid;
//    }
//    try {
//        chrome.runtime.sendMessage(request,
//            function (response) {
//            });
//    } catch(e) {
//    }
// D23GK002 2023/05/08 削除終了
    
    disconnectNativeApp();
}
// D22GK001 2022/09/20 追加終了



/**
 * Win32アプリとの切断処理.<br>
 *
 * @param なし
 * @return なし
 * @type void
 * @since 001
 */
function disconnectNativeApp() {
    var request = new Object();
    request.type = 'disconnect';

    try {
        chrome.runtime.sendMessage(request,
            function (response) {
            });
    } catch(e) {
    }
}

// 画面から発行されるイベントを待ち受けるため、リスナーを登録
document.addEventListener("NtaChromeLaunch", NtaChromeFunc);


/**
 * Background.jsへの送信処理.<br>
 *
 * @param {Event} event 画面から受信するイベント
 * @return なし
 * @type void
 * @since 001
 */
function NtaChromeFunc(event) {
    var request = new Object();
    var MessageType;
    try {
// D20GK001 2020/07/10 削除開始
//        // ステータスをチェックし、ステータスが「3」ではない場合はエラーを返却してなにもしない
//        if(document.getElementById("NtaChromeCheck").value != "3") {
//            var eventName = "recv" + event.detail.MessageType;
//            var response = new Object();
//            response.NtaCh_CallResult = "E_FAIL";
//            response.DetailErrorInfo = "CH00002E";
//            if(document.getElementById("NtaChromeCheck").value == "-1") {
//                // 機能拡張アプリが不在
//                response.DetailErrorMessage = "chrome extension port not exist.";
//            } else {
//                // 機能拡張アプリがまだ呼出できない
//                response.DetailErrorMessage = "chrome extension status not ready.";
//            }
//
//            var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
//            window.document.dispatchEvent(errevent);
//            return;
//        }
//
//        // content.jsまでアクセスができていることを通知
//        document.getElementById("NtaChromeCheck").value = "1";
// D20GK001 2020/07/10 削除終了
// D20GK001 2020/07/10 追加開始
        // 緊急指定がある場合はステータス管理を飛ばす(主にqueue関連で指定される)
        if(event.detail.urgent == undefined) {
            // ステータスをチェックし、ステータスが「3」ではない場合はエラーを返却してなにもしない
            if(document.getElementById("NtaChromeCheck").value != "3") {
                var eventName = "recv" + event.detail.MessageType;
                var response = new Object();
                response.NtaCh_CallResult = "E_FAIL";
                response.DetailErrorInfo = "CH00002E";
                if(document.getElementById("NtaChromeCheck").value == "-1") {
                    // 機能拡張アプリが不在
                    response.DetailErrorMessage = "chrome extension port not exist.";
                } else {
                    // 機能拡張アプリがまだ呼出できない
                    response.DetailErrorMessage = "chrome extension status not ready.";
                }

                var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
                window.document.dispatchEvent(errevent);
                return;
            }

            // content.jsまでアクセスができていることを通知
            document.getElementById("NtaChromeCheck").value = "1";
        }
// D20GK001 2020/07/10 追加終了
        request = event.detail;
        MessageType = request.MessageType;
// 【追加開始】故 B20GK002 2020/06/12
        // クラスIDホワイトリストチェック
        var clsID = "";
        if(MessageType == "OBJECTREFLECTION") {
            clsID = request.args1[0];
        }else if(MessageType == "CALLRESERVEOBJ") {
            clsID = request.args1[1];
        }
        if( clsID != "" ){
            var result = clsIdWhitelist.indexOf(clsID);
            if( result == -1 ){
                var eventName = "recv" + MessageType;
                var response = new Object();
                response.NtaCh_CallResult = "E_FAIL";
                response.DetailErrorInfo = "CH00001E";
                response.DetailErrorMessage = "not support clsID.";

                var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
                window.document.dispatchEvent(errevent);
                return;
            }
        }
// 【追加終了】故 B20GK002 2020/06/12

        if(MessageType != "OBJECTREFLECTION") {
            if(request.args1 != null) {
                for(let j=0 ; j < request.args1.length ; j++) {
                    if(isNaN(request.args1[j])) {
                        request.args1[j] = encodeURIComponent(request.args1[j]);
                    }
                }
            }
        }

        if(request.args2 != null) {
            for(let j=0 ; j < request.args2.length ; j++) {
                if(isNaN(request.args2[j])) {
                      request.args2[j] = encodeURIComponent(request.args2[j]);
                }
            }
        }
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//        if(connectIPCid != null && connectIPCid != ""){
//            request.ipcid = connectIPCid;
//        }
//        
//        // タイマーのリセット
//        resetSw();
// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
        
        // 結合データを初期化
        ChExt_divideData = "";

        chrome.runtime.sendMessage(request,
            function (response) {
            });
    } catch (e) {
        var eventName = "recv" + MessageType;
        var response = new Object();
        response.NtaCh_CallResult = "E_FAIL";
// D20GK001 2020/07/10 削除開始
//        response.DetailErrorInfo = "CH00001E";
// D20GK001 2020/07/10 削除終了
// D20GK001 2020/07/10 追加開始
        if(e.message == "Extension context invalidated."){
            // Chrome拡張機能がOFFの可能性
            response.DetailErrorInfo = "CH00004E";
        } else {
            // 想定外エラー
            response.DetailErrorInfo = "CH00001E";
        }
// D20GK001 2020/07/10 追加終了
        response.DetailErrorMessage = e;

        var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
        window.document.dispatchEvent(errevent);
    }
}

// background.js --> content.js のイベントのlistener
chrome.runtime.onMessage.addListener(onNtaBackgroundToContentEvent);

/**
 * background.js --> content.js のイベントの処理.<br>
 *
 * @param request イベント
 * @return なし
 * @type void
 * @since 001
 */
function onNtaBackgroundToContentEvent(request) {
    postMessageToPageJs(request);
}

/**
 * content.js-->ページのイベントを飛び.<br>
 *
 * @param param イベント
 * @return なし
 * @type void
 * @since 001
 */
function postMessageToPageJs(param) {
    var cevent;
    var MessageType = param.MessageType;
    var Message = param.Message;

    // Chrome拡張がOFFの場合はbackground.jsから受け取った値を設定して終了
    if (MessageType == "BGNTACHEXTCHECK") {
        // 呼び出されたことを示す値に変更
        document.getElementById("NtaChromeCheck").value = Message;
// D23GK002 2023/05/08 削除開始
//        if(param.Notreturn == true) {
//            if(timeoutSw()){
//                disconnectNativeApp();
//            }
//        }
// D23GK002 2023/05/08 削除終了
        return;
// D20GK001 2020/07/10 追加開始
    } else if (MessageType == "BGNTACHEXTINIT") {
        // 初期化を示す値に変更
        document.getElementById("NtaChromeInitialize").value = Message;
// D23GK002 2023/05/08 削除開始
//        if(Message == "1" && param.ChkUpdate == true) {
//            // 同時更新要求時、初期化完了の場合、Check側のステータスを同時に"3"（呼び出し可能）にする
// D23GK002 2023/05/08 削除終了
        if(Message == "1") {
            // Check側のステータスを同時に"3"（呼び出し可能）にする
            document.getElementById("NtaChromeCheck").value = "3";
        }
        return;
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//    } else if(MessageType == "BGNTAIPCSERVERCOMP") {
//        // Serverスタート
//        {
//            var IPCRequest = new Object();
//            IPCRequest.MessageType = "SETIPCMODE";
//            IPCRequest.args1 = new Array(2);
//            IPCRequest.args1[0] = "1";      // SERVER
//            
//            // GUIDの生成
//            IPCRequest.ipcid = connectIPCid;
//            
//            // タイマーのリセット
//            resetSw();
//            
//            chrome.runtime.sendMessage(IPCRequest,
//                function (response) {
//                });
//        }
//        return;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D20GK001 2020/07/10 追加終了
    } else {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//        if(Message["JSONDATA"] != undefined
//            && Message["JSONDATA"] == "_[CLIENT]Wait") {
//            // 機能拡張IPCサーバー処理中
//            IPC_MessageType = param.MessageType;
//
//            // 現在のポートを削除し、新しいコネクションで接続する（5分対策）
//            if(timeoutSw()){
//                disconnectNativeApp();
//                setTimeout("IPC_ClientPolling()", 5);
//            } else {
//                setTimeout("IPC_ClientPolling()", 1);
//            }
//            return;
//        }
//// D22GK001 2022/09/20 追加終了
//// D22GK001 2022/09/20 削除開始
////        if(param.exceptionreturn != undefined) {
//// D22GK001 2022/09/20 削除終了
//        else if(param.exceptionreturn != undefined) {
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
        if(param.exceptionreturn != undefined) {
// D23GK002 2023/05/08 追加終了
            // 想定外エラー系
            ChExt_divideData = Message;
            
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//        }
//        else if(param.MessageType == "SETIPCMODE") {
//            // ステータス更新
//            document.getElementById("NtaChromeCheck").value = "3";
//            
//            // 切断する(IPCサーバー側との接続を切る)
//            disconnectNativeApp();
//            
//            return;
//        }
//        else if(Message["JSONDATA"] == "IPC_SERVER_NOT_READY") {
//            // サーバーが閉じている
//            document.getElementById("NtaChromeCheck").value = "-1";
//            var eventName = "recv" + MessageType;
//            var response = new Object();
//            response.NtaCh_CallResult = "E_FAIL";
//
//            // 想定外エラー
//            response.DetailErrorInfo = "CH00001E";
//            response.DetailErrorMessage = "IPC server not ready.";
//
//            var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
//            window.document.dispatchEvent(errevent);
//            return;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
        }
        else if(divideContinue(Message)) {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//        IPC_MessageType = param.MessageType;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
            ChExt_divideData += Message["JSONDATA"];
            
            var request = new Object();
            var MessageType;
            try {
                // 分割取得中
                var request = new Object();
                request.MessageType = MessageType;
// D23GK002 2023/05/08 削除開始
//                // 分割取得中は ipcid を設定しない
// D23GK002 2023/05/08 削除終了
                chrome.runtime.sendMessage(request,
                    function (response) {
                    });
                return;
            } catch (e) {
                var eventName = "recv" + MessageType;
                var response = new Object();
                response.NtaCh_CallResult = "E_FAIL";
// D20GK001 2020/07/10 削除開始
//                response.DetailErrorInfo = "CH00001E";
// D20GK001 2020/07/10 削除終了
// D20GK001 2020/07/10 追加開始
                if(e.message == "Extension context invalidated."){
                    // Chrome拡張機能がOFFの可能性
                    response.DetailErrorInfo = "CH00004E";
                } else {
                    // 想定外エラー
                    response.DetailErrorInfo = "CH00001E";
                }
// D20GK001 2020/07/10 追加終了
                response.DetailErrorMessage = e;

                var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
                window.document.dispatchEvent(errevent);
                return;
            }
        }
    }

    // 分割取得完了
    if(param.exceptionreturn == undefined) {
        // 想定外エラー系以外
        document.getElementById("NtaChromeCheck").value = "3";
    }

// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//    IPC_MessageType = "";
//    // 切断する(ManifestVersion3 の 5分制限対策)
//    if(timeoutSw()){
//       disconnectNativeApp();
//    }
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了

    // 半角スペース対応
    ChExt_divideData = ChExt_divideData.replace(/\+/g,'%20');

    // URIデコード
    var decodeData = decodeURIComponent(ChExt_divideData);
    ChExt_divideData = "";

    // JSONパース
    try{
        var resultObj = JSON.parse(decodeData);
    } catch(e) {
        var eventName = "recv" + MessageType;
        var response = new Object();
        response.NtaCh_CallResult = "E_FAIL";
        response.DetailErrorInfo = e;

        var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
        window.document.dispatchEvent(errevent);
        return;
    }


    // 返却を行う
    var eventName = "recv" + MessageType;
    try {
        cevent = new CustomEvent(eventName, { "bubbles": true, "detail": resultObj });
    } catch (e) {
        cevent = document.createEvent(eventName);
        cevent.initCustomEvent(eventName, true, false, Message);
    }
    window.document.dispatchEvent(cevent);
}

// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//// サーバー延命用ポーリング（強制復帰を含む）
//function IPC_ServerPolling() {
//    var request = new Object();
//    try {
//    
//        if(document.getElementById("NtaChromeCheck").value == "3") {
//            // content.jsまでアクセスができていることを通知
//            document.getElementById("NtaChromeCheck").value = "1";
//
//            // 呼び出し可能ステータスの場合、発行する
//            // ID情報の更新
//            // ポーリング取得中
//            var request = new Object();
//            request.MessageType = "POLLING";
//
//            if(connectIPCid != null && connectIPCid != ""){
//                request.ipcid = connectIPCid;
//            } else {
//                return;
//            }
//
//            // タイマーのリセット
//            resetSw();
//
//            chrome.runtime.sendMessage(request,
//                function (response) {
//                });
//        }
//        return;
//    } catch (e) {
//        var eventName = "recv" + IPC_MessageType;
//        var response = new Object();
//        response.NtaCh_CallResult = "E_FAIL";
//        // 想定外エラー
//        response.DetailErrorInfo = "CH00001E";
//        response.DetailErrorMessage = e;
//
//        var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
//        window.document.dispatchEvent(errevent);
//        return;
//    }
//}
//
// クライアント側結果取得ポーリング
//function IPC_ClientPolling() {
//    var request = new Object();
//    try {
//        // ポーリング取得中
//        // 実施中の結果を取得する
//        request.MessageType = IPC_MessageType;
//
//        if(connectIPCid != null && connectIPCid != ""){
//            request.ipcid = connectIPCid;
//        }
//        
//        // タイマーのリセット
//        resetSw();
//
//        chrome.runtime.sendMessage(request,
//            function (response) {
//            });
//        return;
//    } catch (e) {
//        var eventName = "recv" + IPC_MessageType;
//        var response = new Object();
//        response.NtaCh_CallResult = "E_FAIL";
//        if(e.message == "Extension context invalidated."){
//            // Chrome拡張機能がOFFの可能性
//            response.DetailErrorInfo = "CH00004E";
//        } else {
//            // 想定外エラー
//            response.DetailErrorInfo = "CH00001E";
//        }
//        response.DetailErrorMessage = e;
//
//        var errevent = new CustomEvent(eventName, { "bubbles": true, "detail": response });
//        window.document.dispatchEvent(errevent);
//        return;
//    }
//}
//
///**
// * ランダムUUID生成
// *
// * @param なし
// * @return 生成したUUID
// * @since 001
// */
//function generateRandomUuid(){
//    var _1=16;
//    function _2(){
//        var _3=Math.floor((Math.random()%1)*Math.pow(2,32));
//        var _4=_3.toString(_1);
//        while(_4.length<8){
//            _4="0"+_4;
//        }
//        return _4;
//    };
//    var _5="-";
//    var _6="4";
//    var _7="8";
//    var a=_2();
//    var b=_2();
//    b=b.substring(0,4)+_5+_6+b.substring(5,8);
//    var c=_2();
//    c=_7+c.substring(1,4)+_5+c.substring(4,8);
//    var d=_2();
//    var _c=a+_5+b+_5+c+d;
//    _c=_c.toLowerCase();
//    return _c;
//};
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了


/**
 * 分割取得継続判定.
 *
 * @param message イベントオブジェクト
 * @return true 継続 false 終了
 * @since 001
 */
function divideContinue(message) {
    try{
        var isContinue = true;
        if(message["JSONDATA"] != undefined) {
            if(message["JSONDATA"] == "") {
                isContinue = false;
            }
        } else {
            isContinue = false;
        }
    } catch (e) {
        isContinue = false;
    }
    return isContinue;
}

// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
///**
// * ストップウォッチリセット
// *
// * @param なし
// * @since 001
// */
//function resetSw() {
//    if(swTime == 0) {
//        // 起点となるタイマーを更新
//        swTime = Date.now();
//        
//        // 別途、3分間のタイマーを仕込む
//        timeoutID = setTimeout("timeoutDisconnect()", 180000);
//    }
//}
//
///**
// * タイムアウト時の切断処理
// *
// * @param なし
// * @since 001
// */
//function timeoutDisconnect() {
//    if(document.getElementById("NtaChromeCheck").value == "3") {
//        // 呼び出し可能ステータスの場合、切断する
//        swTime = 0;
//        disconnectNativeApp();
//        // タイマー関連を止める
//        if(timeoutID != 0) {
//            clearTimeout(timeoutID);
//            timeoutID = 0;
//        }
//        if(timeoutID_Retry != 0) {
//            clearTimeout(timeoutID_Retry);
//            timeoutID_Retry = 0;
//        }
//    } else {
//        // 処理中の場合、リトライする
//        timeoutID_Retry = setTimeout("timeoutDisconnect()", 100);
//    }
//}
//
///**
// * タイムアウト判定
// *
// * @param なし
// * @return true：タイムアウト発生 false：タイムアウトなし
// * @since 001
// */
//function timeoutSw() {
//    var diffTime = swTime - Date.now();
//    if((Math.abs(diffTime) / (60 * 1000)) > 3 ) {
//        // 3分経過している
//        swTime = 0;
//        
//        // タイマー関連を止める
//        if(timeoutID != 0) {
//            clearTimeout(timeoutID);
//            timeoutID = 0;
//        }
//        if(timeoutID_Retry != 0) {
//            clearTimeout(timeoutID_Retry);
//            timeoutID_Retry = 0;
//        }
//        return true;
//    }
//    return false;
//}
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
