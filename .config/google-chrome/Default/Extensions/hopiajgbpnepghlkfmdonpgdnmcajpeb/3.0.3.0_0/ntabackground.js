var portDict = {};
var especialMessageType = ["FILEINITIALIZE"];
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////var notReturnMessageType = ["OBJECTRELEASE", "RESERVEOBJRELEASE", "QUIT"];
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//var notReturnMessageType = ["OBJECTRELEASE", "RESERVEOBJRELEASE", "QUIT", "POLLING"];
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
var notReturnMessageType = ["OBJECTRELEASE", "RESERVEOBJRELEASE", "QUIT"];
// D23GK002 2023/05/08 追加終了

// D20GK001 2020/07/10 追加開始
var backGroundQueue = {};
var targetQueuePortID = "";
// D20GK001 2020/07/10 追加終了

// content.js --> background.jsイベントのListener
chrome.runtime.onMessage.addListener(onNtaContentToBackgroundEvent);

/**
 * content.js --> background.jsイベントの処理.<br>
 *
 * @param request リクエスト
 * @param sender 送信元
 * @param sendResponse 返信オブジェクト
 * @return なし
 * @type void
 * @since 001
 */
function onNtaContentToBackgroundEvent(request, sender, sendResponse) {

// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//    request.tabid = sender.tab.id;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
    if (request.type) {
        if ("connect" === request.type) {
// D23GK002 2023/05/08 削除開始
// D22GK001 2022/09/20 削除開始
////// D20GK001 2020/07/10 追加開始
////            connectWrapperExe(sender.tab.id);
////// D20GK001 2020/07/10 追加終了
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            connectWrapperExe(sender.tab.id, false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
            connectWrapperExe(sender.tab.id, true);
// D23GK002 2023/05/08 追加終了

// D20GK001 2020/07/10 削除開始
//            // 既にポートが存在する場合は作成しない
//            if(portDict[sender.tab.id] == null) {
//                var port = chrome.runtime.connectNative("nta.chrome.ext");
//                
//                // ポートの準備ができている場合
//                if(port) {
//                    // 意図せず切断された場合のリスナー
//                    port.onDisconnect.addListener(function fn_onD() {
//                        // NtaChromeWebWrapper が 先に落とされた場合
//                        if(portDict[sender.tab.id] != null) {
//                            port.onDisconnect.removeListener(fn_onD);
//
//                            // 既にDisconnectされている場合は意味がないが、一応呼び出す
//                            port.disconnect();
//
//                            // ステータスを-1にする
//                            backgroundCheck(sender.tab.id, "-1");
//
//                            delete portDict[sender.tab.id];
//                        }
//                        return;
//                    });
//                    portDict[sender.tab.id] = port;
//                    // ポートの準備ができたため、3を設定する
//                    backgroundCheck(sender.tab.id, "3");
//                } else {
//                    // port の準備ができていないため、-1を設定する
//                    backgroundCheck(sender.tab.id, "-1");
//                }
//            }
// D20GK001 2020/07/10 削除終了

// D22GK001 2022/09/20 削除開始
//            // 終了
//            return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
// D23GK002 2023/05/08 削除開始
//            // IPC通信のセットアップ
//            IPCServerSetup(sender.tab.id);
// D23GK002 2023/05/08 削除終了
            // 終了
            sendResponse();
            return;
// D22GK001 2022/09/20 追加終了

// D23GK002 2023/05/08 削除開始
//        } else if ("exit" === request.type) {
//            var bgrequest = new Object();
//            bgrequest.MessageType = "IPCEXIT";
//            bgrequest.type = "addqueue";
//// D22GK001 2022/12/16 追加開始
//            bgrequest.executePort = "callIPCEXIT" + request.ipcid;
//// D22GK001 2022/12/16 追加終了
//            bgrequest.urgent = true;
//            if(request.ipcid != null) {
//                // IPCIDがある場合は設定する（クライアント⇒サーバー接続のキー）
//                bgrequest.ipcid = request.ipcid;
//            }
//            
//            backGroundAddQueue(bgrequest);
//            backGroundExecuteQueue();
//
//// D22GK001 2022/09/20 削除開始
////            // 終了
////            return true;    // Chrome に SendResponse を 遅延させるよう通知する
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            // 終了
//            sendResponse();
//            return;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
        } else if ("disconnect" === request.type) {
            if(portDict[sender.tab.id] == null) {
                // 既に削除済み
// D22GK001 2022/09/20 削除開始
//                return false;
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
                sendResponse();
                return;
// D22GK001 2022/09/20 追加終了
            }
            var port = portDict[sender.tab.id];

            port.disconnect();
            delete portDict[sender.tab.id];
            
            // 終了
// D22GK001 2022/09/20 削除開始
//            return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
            sendResponse();
            return;
// D22GK001 2022/09/20 追加終了
        }
// D20GK001 2020/07/10 追加開始
        else if("addqueue" === request.type) {
            backGroundAddQueue(request);
// D22GK001 2022/09/20 削除開始
//            return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
            sendResponse();
            return;
// D22GK001 2022/09/20 追加終了
        } else if("execqueue" === request.type) {
            backGroundExecuteQueue();
// D22GK001 2022/09/20 削除開始
//            return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
            sendResponse();
            return;
// D22GK001 2022/09/20 追加終了
        }
// D20GK001 2020/07/10 追加終了
    }
    
    if (especialMessageType.indexOf(request.MessageType) > -1) {
        // 特定のメッセージタイプに対して、コネクションをイベント単位で管理する
        var port = chrome.runtime.connectNative("nta.chrome.ext");
        // Chrome拡張がOFFの場合は-1を応答して終了
        if (!port) {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////            backgroundCheck(sender.tab.id, "-1");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            backgroundCheck(sender.tab.id, "-1", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
            backgroundCheck(sender.tab.id, "-1");
// D23GK002 2023/05/08 追加終了
            {
                var response = new Object();
                response.MessageType = request.MessageType;
                response.Message = "{\"NtaCh_CallResult\":\"E_FAIL\",\"DetailErrorInfo\":\"CH00001E\",\"DetailErrorMessage\":\"port connect fail.\"}";
                response.exceptionreturn = true;

                postMessageToContentJsToTab(sender.tab, response);
            }
// D22GK001 2022/09/20 削除開始
//            return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
            sendResponse();
            return;
// D22GK001 2022/09/20 追加終了
            
        } else {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////            backgroundCheck(sender.tab.id, "2");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            backgroundCheck(sender.tab.id, "2", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
            backgroundCheck(sender.tab.id, "2");
// D23GK002 2023/05/08 追加終了
        }

        if (notReturnMessageType.indexOf(request.MessageType) <= -1) {
            port.onMessage.addListener(function fn(responseMsg) {
                var response = new Object();
                response.MessageType = request.MessageType;
                response.Message = responseMsg;
                response.TabId = sender.tab.id;

                postMessageToContentJsToTab(sender.tab, response);

                port.onMessage.removeListener(fn);
                
// D22GK001 2022/09/20 追加開始
                sendResponse();
// D22GK001 2022/09/20 追加終了
                return true;    // Chrome に SendResponse を 遅延させるよう通知する
            });
        } else {
            // 返却イベントが無いMessageTypeの場合、ステータスを3にする
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////            backgroundCheck(sender.tab.id, "3");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            // notReturnではあるが、別ポート管理のため、第三引数はFalse
//            backgroundCheck(sender.tab.id, "3", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
            backgroundCheck(sender.tab.id, "3");
// D23GK002 2023/05/08 追加終了
        }
        port.postMessage(request);
// D22GK001 2022/09/20 削除開始
//        return true;
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
        return;
// D22GK001 2022/09/20 追加終了
    } else {
        // 一般的なメッセージタイプのコネクションを画面ページ単位で管理する
        var port = portDict[sender.tab.id];
        // Chrome拡張がOFFの場合は-1を応答して終了
        if (!port) {
// D20GK001 2020/07/10 削除開始
//            backgroundCheck(sender.tab.id, "-1");
//            {
//                var response = new Object();
//                response.MessageType = request.MessageType;
//                response.Message = "{\"NtaCh_CallResult\":\"E_FAIL\",\"DetailErrorInfo\":\"CH00001E\",\"DetailErrorMessage\":\"port has exited.\"}";
//                response.exceptionreturn = true;
//
//                postMessageToContentJsToTab(sender.tab, response);
//            }
//            return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D20GK001 2020/07/10 削除終了
// D20GK001 2020/07/10 追加開始
            // リコネクト処理
            connectWrapperExe(sender.tab.id, true);
            port = portDict[sender.tab.id];
            if (!port) {
                // リコネクトでダメだった場合
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////                backgroundCheck(sender.tab.id, "-1");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//                backgroundCheck(sender.tab.id, "-1", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
                backgroundCheck(sender.tab.id, "-1");
// D23GK002 2023/05/08 追加終了
                {
                    var response = new Object();
                    response.MessageType = request.MessageType;
                    response.Message = "{\"NtaCh_CallResult\":\"E_FAIL\",\"DetailErrorInfo\":\"CH00001E\",\"DetailErrorMessage\":\"port has exited.\"}";
                    response.exceptionreturn = true;

                    postMessageToContentJsToTab(sender.tab, response);
                }
                
// D22GK001 2022/09/20 削除開始
//                return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
                sendResponse();
                return;
// D22GK001 2022/09/20 追加終了
            } else {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////                backgroundCheck(sender.tab.id, "2");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//                // 初期化完了として、1を設定する
//                backgroundInitialize(sender.tab.id, "1", false);
//                backgroundCheck(sender.tab.id, "2", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
                backgroundCheck(sender.tab.id, "2");
// D23GK002 2023/05/08 追加終了

            }
// D20GK001 2020/07/10 追加終了
        } else {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////            backgroundCheck(sender.tab.id, "2");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            // 初期化完了として、1を設定する
//            backgroundInitialize(sender.tab.id, "1", false);
//            backgroundCheck(sender.tab.id, "2", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
            backgroundCheck(sender.tab.id, "2");
// D23GK002 2023/05/08 追加終了
        }
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//        if(request.MessageType == "SETIPCMODE") {
//            request.args1[1] = sender.tab.id;       // TAB ID
//        }
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
        if (notReturnMessageType.indexOf(request.MessageType) <= -1) {
            port.onMessage.addListener(function fn(responseMsg) {
                var response = new Object();
                response.MessageType = request.MessageType;
                response.Message = responseMsg;
                response.TabId = sender.tab.id;

                postMessageToContentJsToTab(sender.tab, response);

                port.onMessage.removeListener(fn);
// D22GK001 2022/09/20 削除開始
//                return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
                sendResponse();
                return;
// D22GK001 2022/09/20 追加終了
            });
        } else {
            // 返却イベントが無いMessageTypeの場合、ステータスを3にする
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////            backgroundCheck(sender.tab.id, "3");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//            backgroundCheck(sender.tab.id, "3", true);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
            backgroundCheck(sender.tab.id, "3");
// D23GK002 2023/05/08 追加終了
        }
        port.postMessage(request);
// D22GK001 2022/09/20 削除開始
//        return true;    // Chrome に SendResponse を 遅延させるよう通知する
// D22GK001 2022/09/20 削除終了
// D22GK001 2022/09/20 追加開始
        sendResponse();
        return;
// D22GK001 2022/09/20 追加終了
    }
}

// D20GK001 2020/07/10 追加開始
/**
 * Wrapperアプリと接続する.<br>
 *
 * @param sender 送信者情報
 * @return なし
 * @type void
 * @since 001
 */
function connectWrapperExe(tabid, messageSend) {
    // 既にポートが存在する場合は作成しない
    if(portDict[tabid] == null) {
        var port = chrome.runtime.connectNative("nta.chrome.ext");
        
        // ポートの準備ができている場合
        if(port) {
            // 意図せず切断された場合のリスナー
            port.onDisconnect.addListener(function fn_onD() {
                // NtaChromeWebWrapper が 先に落とされた場合
                if(portDict[tabid] != null) {
                    port.onDisconnect.removeListener(fn_onD);
// D22GK001 2022/09/20 削除開始
//                    // 既にDisconnectされている場合は意味がないが、一応呼び出す
//                    port.disconnect();
// D22GK001 2022/09/20 削除終了
                    if(messageSend == true) {
                        // ステータスを-1にする
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////                        backgroundCheck(tabid, "-1");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//                        backgroundCheck(tabid, "-1", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
                        backgroundCheck(tabid, "-1");
// D23GK002 2023/05/08 追加終了
                    }

                    delete portDict[tabid];
                }
                return;
            });
            portDict[tabid] = port;
            if(messageSend == true) {
                // 初期化完了として、1を設定する(イベント回数節約の為、Check側のステータスもこれで3にする)
// D23GK002 2023/05/08 削除開始
//                backgroundInitialize(tabid, "1", true);
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
                backgroundInitialize(tabid, "1");
// D23GK002 2023/05/08 追加終了
            }
            // 
        } else {
            if(messageSend == true) {
                // port の準備ができていないため、-1を設定する
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////                backgroundCheck(tabid, "-1");
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//                backgroundCheck(tabid, "-1", false);
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
                backgroundCheck(tabid, "-1");
// D23GK002 2023/05/08 追加終了
            }
        }
    } else {
        // 初期化完了として、1を設定する(イベント回数節約の為、Check側のステータスもこれで3にする)
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/12/16 追加開始
//        if(messageSend == true) {
//            backgroundInitialize(tabid, "1", true);
//        }
//// D22GK001 2022/12/16 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
        if(messageSend == true) {
            backgroundInitialize(tabid, "1");
        }
// D23GK002 2023/05/08 追加終了
    }
}
// D20GK001 2020/07/10 追加終了


/**
 * background.js --> content.js のイベントを飛び(tabを指定する).<br>
 *
 * @param tab リクエスト
 * @param param 返信メッセージオブジェクト
 * @return なし
 * @type void
 * @since 001
 */
function postMessageToContentJsToTab(tab, param) {
// D22GK001 2022/12/16 追加開始
    // V3 Promise対応
    let rtnPromise = chrome.tabs.sendMessage(tab.id, param);
    rtnPromise
        .then((response)=> {
            // コールバック処理
            return true;
        })
        .catch((error)=> {
            // エラー処理
        });
// D22GK001 2022/12/16 追加終了
}

/**
 * background.js --> content.js のイベントを飛び(tabを指定しない).<br>
 *
 * @param param 返信メッセージオブジェクト
 * @return なし
 * @type void
 * @since 001
 */
function postMessageToContentJs(param) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var lastTabId = tabs[0].id;
// D22GK001 2022/12/16 追加開始
        // V3 Promise対応
        let rtnPromise = chrome.tabs.sendMessage(lastTabId, param);
        rtnPromise
            .then((response)=> {
                // コールバック処理
                return true;
            })
            .catch((error)=> {
                // エラー処理
            });
// D22GK001 2022/12/16 追加終了
    });
}

/**
 * background.jsの状況送信.<br>
 *
 * @param tab 送信元のタブ
 * @param bgStatus 現在のステータス
 * @return なし
 * @type void
 * @since 001
 */
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 削除開始
////function backgroundCheck(id, bgStatus) {
//// D22GK001 2022/09/20 削除終了
//// D22GK001 2022/09/20 追加開始
//function backgroundCheck(id, bgStatus, notReturn) {
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
function backgroundCheck(id, bgStatus) {
// D23GK002 2023/05/08 追加終了

    var res = new Object();
    res.MessageType = "BGNTACHEXTCHECK";
    res.Message = bgStatus;
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/09/20 追加開始
//    res.Notreturn = notReturn;
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除終了
// D22GK001 2022/12/16 追加開始
    // V3 Promise対応
    let rtnPromise = chrome.tabs.sendMessage(id, res);
    rtnPromise
        .then((response)=> {
            // コールバック処理
            return true;
        })
        .catch((error)=> {
            // エラー処理
        });
// D22GK001 2022/12/16 追加終了
}

// D20GK001 22020/07/10 追加開始
/**
 * 初期化の状況送信.<br>
 *
 * @param id 送信元のタブ
 * @param initStatus 現在のステータス
// D23GK002 2023/05/08 削除開始
// * @param chkUpdate 呼び出し可能ステータスに更新するか
// D23GK002 2023/05/08 削除終了
 * @return なし
 * @type void
 * @since 001
 */
// D23GK002 2023/05/08 削除開始
//function backgroundInitialize(id, initStatus, chkUpdate) {
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
function backgroundInitialize(id, initStatus) {
// D23GK002 2023/05/08 追加終了
    var res = new Object();
    res.MessageType = "BGNTACHEXTINIT";
    res.Message = initStatus;
// D23GK002 2023/05/08 削除開始
//    res.ChkUpdate = chkUpdate;
// D23GK002 2023/05/08 削除終了
// D22GK001 2022/12/16 追加開始
    // V3 Promise対応
    let rtnPromise = chrome.tabs.sendMessage(id, res);
    rtnPromise
        .then((response)=> {
            // コールバック処理
            return true;
        })
        .catch((error)=> {
            // エラー処理
        });
// D22GK001 2022/12/16 追加終了
}

// D23GK002 2023/05/08 削除開始
// D22GK001 2022/09/20 追加開始
///**
// * IPC通信のサーバーセットアップ.<br>
// *
// * @param id 送信元のタブ
// * @return なし
// * @type void
// * @since 001
// */
//function IPCServerSetup(id) {
//    var res = new Object();
//    res.MessageType = "BGNTAIPCSERVERCOMP";
//// D22GK001 2022/12/16 追加開始
//    // V3 Promise対応
//    let rtnPromise = chrome.tabs.sendMessage(id, res);
//    rtnPromise
//        .then((response)=> {
//            // コールバック処理
//            return true;
//        })
//        .catch((error)=> {
//            // エラー処理
//        });
//// D22GK001 2022/12/16 追加終了
//}
//// D22GK001 2022/09/20 追加終了
// D23GK002 2023/05/08 削除開始

function backGroundAddQueue(request) {
    // 拡張ポートが登録されていない場合は無視する
    if(request.executePort != undefined) {
        // ミリ秒_配列格納数 でユニークなkeyを生成して入れる
        var datetime = new Date();
        var addkey = datetime.getTime() + "_" + Object.keys(backGroundQueue).length;
        backGroundQueue[addkey] = request;
    }
}

function backGroundExecuteQueue() {
    // キューに登録があればやる
    if(Object.keys(backGroundQueue).length != 0) {
// D23GK002 2023/05/08 削除開始
//// D22GK001 2022/12/16 削除開始
////        // キューの1番目のRequestを取得
////        var targetQueueKey = Object.keys(backGroundQueue)[0];
////
////        targetQueuePortID = backGroundQueue[targetQueueKey].executePort;
////        connectWrapperExe(targetQueuePortID, false);
////        var port = portDict[targetQueuePortID];
////        if (port) {
////            // ポートに対して処理を行う
////            port.onMessage.addListener(function fn(responseMsg) {
////                port.onMessage.removeListener(fn);
////                backGroundExecuteQueueCallBack(responseMsg);
////
////                return true;    // Chrome に SendResponse を 遅延させるよう通知する
////            });
////            port.postMessage(backGroundQueue[targetQueueKey]);
////        }
////    } else {
////    
////        // queue処理に使用したポートを閉じる
////        var disconnectPort = portDict[targetQueuePortID];
////        
////        if(disconnectPort) {
////            disconnectPort.disconnect();
////            delete portDict[targetQueuePortID];
////        }
////        targetQueuePortID = "";
//// D22GK001 2022/12/16 削除終了
//// D22GK001 2022/12/16 追加開始
//        // キューの1番目のRequestを取得
//        var targetQueueKey = Object.keys(backGroundQueue)[0];
//        var targetObj = backGroundQueue[targetQueueKey];
//        
//        // sendNativeMessageを利用し、ポートを作成しない
//        chrome.runtime.sendNativeMessage(
//            "nta.chrome.ext",
//            targetObj,
//            function(responseMsg)
//            {
//                backGroundExecuteQueueCallBack(responseMsg);
//            }
//        );
//// D22GK001 2022/12/16 追加終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
        // キューの1番目のRequestを取得
        var targetQueueKey = Object.keys(backGroundQueue)[0];

        targetQueuePortID = backGroundQueue[targetQueueKey].executePort;
        connectWrapperExe(targetQueuePortID, false);
        var port = portDict[targetQueuePortID];
        if (port) {
            // ポートに対して処理を行う
            port.onMessage.addListener(function fn(responseMsg) {
                port.onMessage.removeListener(fn);
                backGroundExecuteQueueCallBack(responseMsg);

                return true;    // Chrome に SendResponse を 遅延させるよう通知する
            });
            port.postMessage(backGroundQueue[targetQueueKey]);
        }
    } else {
    
        // queue処理に使用したポートを閉じる
        var disconnectPort = portDict[targetQueuePortID];
        
        if(disconnectPort) {
            disconnectPort.disconnect();
            delete portDict[targetQueuePortID];
        }
        targetQueuePortID = "";
// D23GK002 2023/05/08 追加終了

    }
}

function backGroundExecuteQueueCallBack(Message){
// D23GK002 2023/05/08 削除開始
//// D22CO001 2023/02/14 削除開始
////    if(backGround_divideContinue(Message)) {
////        // 分割取得中
////        backGroundExecuteQueue();
////        return;
////    }
//// D22CO001 2023/02/14 削除終了
// D23GK002 2023/05/08 削除終了
// D23GK002 2023/05/08 追加開始
    if(backGround_divideContinue(Message)) {
        // 分割取得中
        backGroundExecuteQueue();
        return;
    }
// D23GK002 2023/05/08 追加終了
    
    // 分割取得完了
    // キューの1番目のRequestを削除
    var targetkey = Object.keys(backGroundQueue)[0];
    delete backGroundQueue[targetkey];
    
    // Queueの続きを行う
    backGroundExecuteQueue();
}

/**
 * 分割取得継続判定.
 *
 * @param message イベントオブジェクト
 * @return true 継続 false 終了
 * @since 001
 */
function backGround_divideContinue(message) {
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
// D20GK001 22020/07/10 追加終了

