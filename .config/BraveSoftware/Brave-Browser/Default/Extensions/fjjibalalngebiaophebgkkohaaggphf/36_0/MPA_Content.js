var checkExtensionInstall = document.createElement("input");
checkExtensionInstall.id = "extension-is-installed";
checkExtensionInstall.type = "hidden";
var extensionVersion = chrome.runtime.getManifest().version;
var versionArray = extensionVersion.split(".");
checkExtensionInstall.value = versionArray[0];
document.body.appendChild(checkExtensionInstall);

var ua = window.navigator.userAgent;

var divCheckInstall = document.createElement("input");
divCheckInstall.id = "app-is-installed";
divCheckInstall.type="hidden";
if(ua.indexOf("Intel Mac OS X") == -1) {
   divCheckInstall.value = "23";
} else {
   divCheckInstall.value = "24";
}
document.body.appendChild(divCheckInstall);

document.addEventListener("launchApp",
   function(event) {
         chrome.runtime.sendMessage({
            type: "launch",
            message: event.detail
         },
         function(response) {
            if(response != null) {
               var cevent = new CustomEvent("recvMsg",{"bubbles":true,"detail":JSON.stringify(response)});
            } else {
               var replacer = ['mode'];
               try {
                  var json = JSON.parse(event.detail);
                  var obj = JSON.stringify(json, replacer, "\t");
                  var jsonMessage = JSON.parse(obj);
                  jsonMessage.result = "1";
                  if(ua.indexOf("Intel Mac OS X") == -1) {
                     jsonMessage.errcode = "EW044-C300";
                  } else {
                     jsonMessage.errcode = "EM044-C300";
                  }
               } catch(e) {
                  if(ua.indexOf("Intel Mac OS X") == -1) {
                     var jsonMessage = {"result":"1","errcode":"EW044-C300"};
                  } else {
                     var jsonMessage = {"result":"1","errcode":"EM044-C300"};
                  }
               }
               var cevent = new CustomEvent("recvMsg",{"bubbles":true,"detail":JSON.stringify(jsonMessage)});
            }
            window.document.dispatchEvent(cevent);
         });
   }, false);

window.addEventListener("beforeunload", event => {
   chrome.runtime.sendMessage({type: "close", message: "05"}, res => {});
}, false);