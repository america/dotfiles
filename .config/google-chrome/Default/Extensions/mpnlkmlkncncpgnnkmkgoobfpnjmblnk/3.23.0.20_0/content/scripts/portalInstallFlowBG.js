(e=>{(e.NSSS=e.NSSS||{}).portalInstallFlowBG=((s,e)=>{let r=s.utils,n=s.utils.isNil,l=s.utils.isntNil,o=s.extensionAdapter,S=e.constants,i=e.NSSSHelper,{uiConstants:E,uiConstants:{MESSAGES:_}}=e,T={_isCurrentExtensionsStoreURL:e=>!(!s.utils.isStorePageURL(e)||!i.isCurrentExtensionURL(e)),_updateTabUrlFlow:(e,a)=>{var t;n(e)||n(a)||(t=o.getWindowIDForTab(e),l(t)&&o.focusWindow(t,()=>{let t=s.extensionAdapter.getTabID(e);l(t)&&o.updateTabUrl(t,a,e=>{o.activateTab(t)})}))},_closeTabUrlFlow:e=>{n(e)||(e=s.extensionAdapter.getTabID(e),l(e)&&o.closeTab(e))},_canUpdateOrCloseTab:e=>{var{BROWSER_TYPE:t}=s.constants;if(s.globals.BROWSER!==t.EDGE_CHROMIUM||E.EXTENSION_TYPE!==E.SAFEWEB_EXTENSION)return T._isCurrentExtensionsStoreURL(e);if(!r.isStorePageURL(e))return!1;let a=new URL(e).pathname;return S.NORTON_EXTENSION_IDS.some(e=>a.includes(e))},_updateOrCloseExtensionStoreURL:(t,a)=>{t!==_.LOAD_STORE_URL&&t!==_.CLOSE_STORE_PAGE||o.getActiveTab(e=>{l(e)&&(T._canUpdateOrCloseTab(e.url)||i.isChromeInterstitialPageURL(e.url))?t===_.LOAD_STORE_URL?T._updateTabUrlFlow(e,a):T._closeTabUrlFlow(e):o.getAllTabs(e=>{e.forEach(e=>{l(e)&&(T._canUpdateOrCloseTab(e.url)||i.isChromeInterstitialPageURL(e.url))&&(t===_.LOAD_STORE_URL?T._updateTabUrlFlow(e,a):T._closeTabUrlFlow(e))})})})},handleMessage:(e,t,a)=>{var s=e.name;T;switch(s){case _.LOAD_STORE_URL:var r=e.message;T._updateOrCloseExtensionStoreURL(_.LOAD_STORE_URL,r);break;case _.CLOSE_STORE_PAGE:T._updateOrCloseExtensionStoreURL(_.CLOSE_STORE_PAGE)}}};return o.addMessageListener(T.handleMessage),T})(e.SymBfw,e.NSSS)})(executionContext);