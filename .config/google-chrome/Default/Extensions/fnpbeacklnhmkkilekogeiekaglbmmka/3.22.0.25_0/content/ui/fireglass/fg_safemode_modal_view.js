!function(e){"use strict";(e.FG=e.FG||{}).safeModeModalDlgView=function(e,t){let s=e.utils.isNil,d=e.utils.isntNil,n=e.utils.isString,a=e.extensionAdapter,l=e.logger,o=t.config,i={init:function(){this.dialogProps={};var e=document.getElementById("help"),e=(d(e)&&(e.addEventListener("contextmenu",function(e){e.isTrusted&&e.preventDefault()}),e.addEventListener("click",function(e){e.isTrusted&&i._sendMessage("help","click",null)})),document.getElementById("help_2")),e=(d(e)&&(e.addEventListener("contextmenu",function(e){e.isTrusted&&e.preventDefault()}),e.addEventListener("click",function(e){e.isTrusted&&i._sendMessage("help_2","click",null)})),document.getElementById("fg_leavefeedback_text")),e=(null!==e&&(e.addEventListener("contextmenu",function(e){e.isTrusted&&e.preventDefault()}),e.addEventListener("click",function(e){e.isTrusted&&i._sendMessage("leavefeedback","click",null)})),document.getElementById("footer_link")),e=(d(e)&&(e.addEventListener("contextmenu",function(e){e.isTrusted&&e.preventDefault()}),e.addEventListener("click",function(e){e.isTrusted&&(i._sendMessage("footer_link","click",null),e.preventDefault())})),document.getElementById("default_ok")),e=(d(e)&&e.addEventListener("click",function(e){e.isTrusted&&i._sendMessage("default_ok","click",null)}),document.getElementById("default_cancel")),e=(d(e)&&e.addEventListener("click",function(e){e.isTrusted&&i._sendMessage("default_cancel","click",null)}),document.getElementById("fg_check_01")),e=(null!==e&&e.addEventListener("change",function(e){e.isTrusted&&(e={value:this.checked},i._sendMessage("fg_check_01","click",e))}),document.getElementById("default_close"));d(e)&&e.addEventListener("click",function(e){e.isTrusted&&i._sendMessage("default_close","click",null)}),document.onkeyup=e=>{!e.isTrusted||"Esc"!==e.key&&"Escape"!==e.key||i._sendMessage("default_close","click",null)},i._sendMessage(null,"show",null)}},c=a.getExtensionURL("");return i.initDocumentData=function(e){if(!s(e))for(var t in e){var n=e[t];if(s(n)||s(n.value))l.debug("No data configuration for "+t);else{var i=document.getElementById(t);if(s(i))l.debug("Element "+t+"not found in document ");else switch(i.type){case"checkbox":case"radio":i.checked=!0===n.value;break;default:i.value=n.value}}}},i.setDefaultButton=function(){let e="default_ok";o.safeModeDialog.dialogType.onlineBanking===this.dialogProps.dialogType&&(e="default_cancel");var t=document.getElementById(e);d(t)&&t.setAttribute("default_button",""),t.focus()},i.initDialog=function(e){o.safeModeDialog.dialogType.onlineBanking===e.dialogType?document.body.setAttribute("category","banking"):document.body.setAttribute("category","general"),o.safeModeDialog.dialogMode.interstitial===e.dialogMode?document.body.setAttribute("mode","interstitial"):document.body.setAttribute("mode","signin"),this.dialogProps=e,this.initDocumentData(e.dialogData),this.setDefaultButton()},i._sendMessage=function(e,t,n){var i={};d(n)&&(i.element=n),i.dialog={},i.dialog.type=this.dialogProps.dialogType,a.sendMessage({type:"fg_message_proxy",id:o.uiMessageProxy.EVENT_ID,realId:o.dialogRenderer.EVENT_ID,data:{id:e,type:t,evtData:i}})},i._msgEventProc=function(e){var t=e.data;if(!s(t)){e=t.origin;if(0!=n(e)&&e==c)switch(t.state){case o.safeModeDialog.displayState.show:i.initDialog(t.props);break;case o.safeModeDialog.displayState.hide:i._sendMessage(null,"close",null)}}},window.addEventListener("message",i._msgEventProc,!1),window.onload=function(){i.init(),a.sendMessage({type:"fg_get_strings",ui_type:"safemode_dialog"},function(e){for(var t=Object.keys(e),n=Object.values(e),i=0;i<t.length;i++){var s=document.getElementById(t[i]);d(s)&&(s.innerHTML=n[i])}})},i}(e.SymBfw,e.FG)}(this);