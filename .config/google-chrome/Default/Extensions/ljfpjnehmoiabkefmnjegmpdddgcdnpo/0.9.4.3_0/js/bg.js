//(Ultimate User Agent Switcher, URL sniffer), All rights reserved.

importScripts("common.js");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
chrome.tabs.getSelected=function(windowId,callback){
	chrome.tabs.query({active:true, currentWindow:true},function(tab){
		if(tab && tab.length>0) callback(tab[0]);
		else callback();
	})
};
chrome.extension.onRequest={};
chrome.extension.onRequest.addListener=function(p1){
	chrome.runtime.onMessage.addListener(p1);
};
				
var i18n_messages_json={};
var get_i18n_messages_json_end=false, i18n_messages_need=false;
async function get_i18n_messages_json(){
	if(get_i18n_messages_json_end)return;
	//var lang=chrome.i18n.getUILanguage() || 'en';
	var lang='en'; if(manifest) lang=manifest.default_locale || 'en';
	lang=lang.replace(/(\-)/g,'_');
	var json={};
	await fetch(chrome.runtime.getURL('_locales/'+lang+'/messages.json')).then(function(resp){
		return resp.json();
	}).then(function(data){
		json=data;
	}).catch(async function(err){
		await fetch(chrome.runtime.getURL('_locales/en/messages.json')).then(function(resp){
			return resp.json();
		}).then(function(data){
			json=data;
		}).catch(function(err){
			json={};
		});
	});
	i18n_messages_json=json;
	get_i18n_messages_json_end=true;
}
if(!chrome.i18n.getMessage){
	i18n_messages_need=true;
	chrome.i18n.getMessage=function(s){
		if(s=='@@extension_id') return chrome.runtime.id;
		else return i18n_messages_json[s].message || '';
	};
}

//https://developer.chrome.com/docs/extensions/reference/storage/
var localStorage={};
var localStorage_load_all_end=false;
async function localStorage_load_all(){
	if(localStorage_load_all_end)return;
	function getall() {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(null, (items) => {
				resolve(items);
			});
		});
	}
	var data={};
	await getall().then(items => {
		data=items;
	});
	for(x in data){
		localStorage[x]=data[x];
	}
	localStorage_load_all_end=true;
}
function localStorage_save_all(){
	localStorage['g_current_tabid']=g_current_tabid; //keepalive
	chrome.storage.local.set(localStorage, function(){});	
}

var manifest;
var getmanifest_end=false;
async function getmanifest(){
	if(getmanifest_end)return;
	await fetch(chrome.runtime.getURL('manifest.json')).then(function(resp){
		return resp.json();
	}).then(function(data){
		manifest=data;
	}).catch(function(err){
	});	
	getmanifest_end=true;
}
var screen={availWidth:1024, availHeight:768};
var getothers_end=false;
async function getothers(){
	if(getothers_end)return;
	getothers_end=true;
	/*await chrome.system.display.getInfo().then(function(a){
		if(a && a[0] && a[0].workArea){		
			screen.availWidth=a[0].workArea.width;
			screen.availHeight=a[0].workArea.height;
		}	
	}).catch(function(err){
	});	*/
}
async function load_resource_all(){
	await localStorage_load_all();
	await getmanifest();
	if(i18n_messages_need) await get_i18n_messages_json();
	await getothers();
}
var gmessageactive=false;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	if(request.type=='active'){
		sendResponse(gmessageactive);	
	}
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var g_extensionid=chrome.i18n.getMessage("@@extension_id");
var g_current_tabid;
var g_config;

chrome.runtime.onInstalled.addListener(async function(details){
	await load_resource_all();
	if(details && details.reason=='install'){ //install, update, chrome_update
		if(navigator.language!="ja"){
			open_newtab('https://iblogbox.com/chrome/useragent/alert.php',true);
			localStorage["installcheck2"]=(new Date()).getTime();	
		}
	}
	//localStorage['transv2']='';
	if(details && details.reason=='update' && details.previousVersion && details.previousVersion<="0.9.4.3" && localStorage['transv2']!=1){
		open_newtab('options.html?transv2=ok',true);
	}
});


async function _main(){
await load_resource_all();
setInterval(function(){	
	localStorage_save_all();
},2000);

var storagedefault = {	
	"installcheck2": [false,0],
	"change_enable": [false,0],
	"log_enable": [false,0],
	//"log_data": ['[]',0],
	"log_config": ['{"type":[],"method":""}',0],
	
	//"change_mode": [1,0], //0:all, 1:selected tab
	"change_type": ['[]',0],
	
	"ua_data": ['[{"ab":"IE6","name":"Internet Explorer 6","uastring":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)"},{"ab":"IE7","name":"Internet Explorer 7","uastring":"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)"},{"ab":"IE8","name":"Internet Explorer 8","uastring":"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)"},{"ab":"IE9","name":"Internet Explorer 9","uastring":"Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; Trident/5.0)"},{"ab":"IE10","name":"Internet Explorer 10","uastring":"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)"},{"ab":"F3.6","name":"Firefox 3.6","uastring":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.4410) Gecko/20110902 Firefox/3.6"},{"ab":"F9.0","name":"Firefox 9.0","uastring":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:9.0) Gecko/20100101 Firefox/9.0"},{"ab":"SF5","name":"Safari 5.0.4","uastring":"Mozilla/5.0 (Windows; U; Windows NT 6.1; tr-TR) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27"},{"ab":"O12","name":"Opera 12.00","uastring":"Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00"},{"ab":"iPad","name":"iPad","uastring":"Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10"},{"ab":"iPh4","name":"iPhone 4","uastring":"Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5"},{"ab":"A2.3","name":"Android 2.3","uastring":"Mozilla/5.0 (Linux; U; Android 2.3; en-us) AppleWebKit/999+ (KHTML, like Gecko) Safari/999.9"},{"ab":"AT","name":"Android Tablet (Galaxy)","uastring":"Mozilla/5.0 (Linux; U; Android 2.2; en-gb; GT-P1000 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"},{"ab":"AD2","name":"Android (Droid 2)","uastring":"Mozilla/5.0 (Linux; U; Android 2.2; en-us; DROID2 GLOBAL Build/S273) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"},{"ab":"KIN","name":"Kindle","uastring":"Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0 (screen 600X800; rotate)"},{"ab":"WP7","name":"Windows Phone 7","uastring":"Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0) Asus;Galaxy6"},{"ab":"NK7","name":"Nokia 7110","uastring":"Nokia 7110/1.0"},{"ab":"Gbot","name":"Googlebot","uastring":"Googlebot/2.1 (+http://www.googlebot.com/bot.html)","hide":true},{"ab":"Ybot","name":"Yahoobot","uastring":"Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)","hide":true},{"ab":"Bbot","name":"BingBot","uastring":"Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)","hide":true}]',0],	
	
	"current_uastring": ['',0],
	"current_uaab": ['',0],
	"current_uaidx": [-1,0],

	"viewlog_refreshhotkey": ["",0],	
	"viewlog_refreshhotkey2": [118,0],	
	"viewlog_clearhotkey": ["",0],	
	"viewlog_clearhotkey2": [120,0],	
	
	"viewlog_viewheaderautoclose": [false,0],
	
	"other_autorefresh": [true,0],
			
	"req_pattern_enable2": [false,0],
	"req_pattern": ['[{"pattern":"http*://www.google.*/*","type":[],"data":[{"name":"User-Agent","value":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)"}],"active":true}]',0]
	
	
	/*"last_version_time": [0,0],	
	"last_version_data": ['',0],	
	
	"version_checkenable": [false,0],
	"version_checktype": [1,0],
	"version_type2": ['windows_sver',0],
	"version_type2_last": ['',0],
	"version_type2_onlyone": [false,0],
	
	"check_windows_sver": [false,0],
	"check_windows_bver": [false,0],
	"check_windows_dver": [false,0],
	"check_windows_cver": [false,0],
	"check_mac_sver": [false,0],
	"check_mac_dver": [false,0],
	"check_linux_sver": [false,0],
	"check_linux_dver": [false,0],
	"check_portable_sver": [false,0],
	
	"extension_lastcheck": [0,0],	
	"extension_version": ['',0],
	"chromeoption_width": ["0",0],
	"chromeoption_height": ["0",0],
	"chromeoption_cachedata": ["",0],
	"chromeoption_url": ["",0],
	"chromepopup_width": ["0",0],
	"chromepopup_height": ["0",0],
	"chromepopup_cachedata": ["",0],
	"chromepopup_url": ["",0],
	"chromepopup2_width": ["0",0],
	"chromepopup2_height": ["0",0],
	"chromepopup2_cachedata": ["",0],
	"chromepopup2_url": ["",0],
	
	"etc_bginterval": [20,0],			
	"etc_popupinterval": [2,0],			
	
	"etc_support": ["",0],			
	"etc_disable": ["",0],			
	"etc_exlib": ["",0],
	"etc_exlib2": ["",0]*/
}

function setStorageDefaults2(name){		
	if (localStorage[name]==null) localStorage[name]=storagedefault[name][0];
}
function setStorageDefaults_int(name){		
	s=localStorage[name];
	if ((s==null) || isNaN(parseInt(s))) localStorage[name]=storagedefault[name][0];
}	

function getStorageDefaults(name){	
	return storagedefault[name][0];	
}

function setStorageDefaults(){	
	for (var a in storagedefault){
		if (storagedefault[a][1]==1)
			setStorageDefaults_int(a);
		else
			setStorageDefaults2(a);
	}		
}
	
try{
	setStorageDefaults();
} catch(err) {}	

var config = function () {
	 this.log_data=[];
	 
    this.load = function () {    	    	
    	/*localStorage['change_enable']=true;
    	localStorage['change_type']='["main_frame"]';//'["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]';
    	
    	localStorage['ua_data']='[{"ab":"FF8","name":"Firefox 8 (Mac OS X 10.6)","uastring":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:8.0.1) Gecko/20100101 Firefox/8.0.1"},{"ab":"GN1","name":"Google Nexus One (Android 2.2)","uastring":"Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"}]';
    	localStorage['req_pattern_enable']=false;
    	localStorage['req_pattern']='[{"pattern":"http*naver.com*","type":["main_frame", "sub_frame"],"data":[{"name":"User-Agent", "value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:8.0.1) Gecko/20100101 Firefox/8.0.1"}]}]';
    	localStorage['current_uaidx']=0;*/

    	this.change_enable=toBool(localStorage['change_enable']);
    	this.log_enable=toBool(localStorage['log_enable']);
    	
    	/*try{
    		this.log_data=JSON.parse(localStorage['log_data']); 
    	}catch(err){}*/
    	
    	//this.change_mode=localStorage['change_mode'];    	    	
    	this.change_type=[];
    	try{
    		this.change_type=JSON.parse(localStorage['change_type']); 
    	}catch(err){}
    	
    	this.ua_data=[];
    	try{
    		this.ua_data=JSON.parse(localStorage['ua_data']);     	
    	}catch(err){}
    	
    	this.current_uastring='';
    	this.current_uaab='';
    	this.current_uaidx=parseInt(localStorage['current_uaidx']);
    	
    	if ((this.current_uaidx>=0) && (this.current_uaidx<=this.ua_data.length-1)){
    		var a=this.ua_data[this.current_uaidx];
    		this.current_uastring=a.uastring;
    		this.current_uaab=a.ab;    		
    	} else {
    		this.current_uaidx=-1;
    	}
    	   	
    	this.req_pattern_enable2=toBool(localStorage['req_pattern_enable2']);
    	
    	this.req_pattern=[];
    	try{
    		this.req_pattern=JSON.parse(localStorage['req_pattern']); 
    	}catch(err){}    	
    	var s,b;
    	for (var i = 0; i < this.req_pattern.length; ++i) {    	
    		b=this.req_pattern[i];
    		s=b.pattern;
    		
			if(s.indexOf("r/")==0) {
				s=s.substr(2,s.length);
			} else {
				s=s.replace(/\./g, "\\.").replace(/\?/g, "\\\?").replace(/\x2a/g, "(.*)");
				s="^" + s + "$";
			}	
			b.re=null;
			try {
				b.re=new RegExp(s);
 			} catch (err) {}					
    	}   	    	
    	//alert(g_config.req_pattern[0].data[0].value);    	
	}
}

g_config=new config();
try{
	g_config.load();
} catch(err) {}		

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		switch (request.type) {
			case 'set':
				localStorage[request.key] = request.value;
				if(request.key=='change_enable'){
					g_config.change_enable=request.value;
				}else if(request.key=='req_pattern_enable2'){
					g_config.req_pattern_enable2=request.value;
					if(request.proc_uastring) proc_uastring();
				}else if(request.key=='log_enable'){
					if(g_config.log_enable!=request.value){
						g_config.log_enable=request.value;
						proc_init(true);
					}
				}
				sendResponse();	
				break;
			case 'get':
				s=localStorage[request.key];
				if ((request.value!=null) && (s==null)) s=request.value;
				sendResponse(s);
				break;
			case 'getdefault':
				sendResponse(getStorageDefaults(request.key));
				break;
			case 'bgaction':
				if(request.value==10){
					var k=0;
					if(localStorage['transv2']!=1){
						for (var a in storagedefault){
							if(/^(extension\_)/.test(a) || request.data[a]==null || request.data[a]==undefined)continue;					
							localStorage[a]=request.data[a]; k++;							
							//console.log(a,localStorage[a]);
						}				
						localStorage['transv2']=1;						
					}			
					if(k==0){
						sendResponse();return;
					}
					request.value=1;
				}
				if(request.value==1){
					g_config.load();
					proc_updatecurrent(null);
					localStorage_save_all();
					sendResponse();
				}else if(request.value==2){
					try{
						setStorageDefaults();
					}catch(err){}	
					try{
						g_config.load();
					}catch(err){}	
					g_current_tabid=null;
					proc_init();			
					localStorage_save_all();
					sendResponse();					
				}else if(request.value==3){
					sendResponse(g_config.req_pattern_enable2);
				}else if(request.value==4){
					var list=[];
					for(x in localStorage){
						list[list.length]={name: x, data: localStorage[x]};
					}
					sendResponse(JSON.stringify(list));
				}else if(request.value==5){
					chrome.windows.getLastFocused( function(win) {
						var windowId=win.id;							
						chrome.tabs.getSelected(windowId, function(tab) { 					
							chrome.tabs.remove(tab.id);
						});    	
					});
					sendResponse();
				}								
				break;

			case 'get_bgstorage':
				if (request.setdefault) {
					setStorageDefaults();
				}				
				var b={};
				for (var a in storagedefault){
					b[a]=localStorage[a];
				}				
				var r={};
				r.bgstorage=b;		
				r.bgdata={};
				r.bgdata.g_extensionid=g_extensionid;
				r.bgdata.g_current_tabid=g_current_tabid;
				r.config={};
				r.config.change_enable=g_config.change_enable;
				r.config.req_pattern_enable2=g_config.req_pattern_enable2;
				r.config.log_enable=g_config.log_enable;
				r.config.current_uaidx=g_config.current_uaidx;
				r.config.ua_data=g_config.ua_data;
				r.config.change_type=g_config.change_type;			

				sendResponse(r);
				break;

			case 'get_g_config':
				if(request.name=='log_enable'){
					//sendResponse(g_config.log_enable);
					chrome.tabs.sendMessage(sender.tab.id, {action: "log_enable", value:g_config.log_enable, change_enable:g_config.change_enable}); //keepalive
				}else if(request.name=='change_enable'){
					sendResponse(g_config.change_enable);
				}else if(request.name=='log_data'){
					sendResponse(g_config.log_data.slice(0));
				}
				break;
			case 'set_g_config':
				if(request.name=='log_data'){
					g_config.log_data=[];
				}else if(request.name=='log_enable'){
					if(g_config.log_enable!=request.value){
						g_config.log_enable=request.value;
						proc_init(true);
					}
				}else if(request.name=='g_current_tabid'){
					g_current_tabid=request.value;
					proc_updateicon();
				}else if(request.name=='proc_updatecurrent'){
					proc_updatecurrent(request.value);
				}else if(request.name=='proc_init'){
					proc_init();
				}				
				localStorage_save_all();
				sendResponse();				
				break;
			default:
				sendResponse();
				break;
		}
	}
);

function proc_intercept(details) {
	function checktype(a){
		var flag=false;		
		if (a.length==0) {
			flag=true;
		}else{
			for (var i = 0; i < a.length; ++i) {    	
				if (a[i]==details.type){
					flag=true;
					break;
				}
			}		
		}
		return flag;		
	}
	
	function setua(uastring){
		//if (!uastring && !g_config.log_enable) return;
		if (!g_config.log_enable) return;
				
		for (var i = 0; i < details.requestHeaders.length; ++i) {    	
			if (details.requestHeaders[i].name=='User-Agent') {
				if (g_config.log_enable){
					var a={};
					var b={};
					a.details=details;
					a.data=[];
					b.name='User-Agent';
					//b.value=details.requestHeaders[i].value;
					b.value=uastring;
					a.data[0]=b;
					
					if (g_config.log_data.length > 300) {
						g_config.log_data.splice(0,1);
					}
					g_config.log_data[g_config.log_data.length]=a;
				}				
				//if (uastring) details.requestHeaders[i].value=uastring;
				//console.error(details.type+', '+details.tabId+', '+details.url);
				break;
			}
		}		
	}
		//console.error(details.url);
		if (!g_config.change_enable) return;		
		/*if (g_config.change_mode==1){
			if (details.tabId!=current_tabid) return;
		}	*/			
		if (g_config.req_pattern_enable2){
			var surl=details.url;
			var flag;
			var uastring='';			
			flag=false;		
			
			for(var i = 0; i < g_config.req_pattern.length; i++){
				if (g_config.req_pattern[i].active && g_config.req_pattern[i].re) {
					if (surl.match(g_config.req_pattern[i].re)) {
						if (checktype(g_config.req_pattern[i].type)) {
							flag=true;
							var c=g_config.req_pattern[i].data;
							if (c && (c.length>0))
								uastring=c[0].value || '';
						}
						break;
					}
				}
			}				
			if (flag){
				setua(uastring);	
				return {requestHeaders: details.requestHeaders};
			}
			//return;
		}
		
		if (g_current_tabid && details.tabId!=g_current_tabid) return;
		//if (g_config.current_uaidx<0) return;										
		if (!checktype(g_config.change_type)) return;				
		setua(g_config.current_uastring);				
		return {requestHeaders: details.requestHeaders};
}

var filter={urls: ["<all_urls>"]};
//var opt_extraInfoSpec=["blocking", "requestHeaders"];		
var opt_extraInfoSpec=["requestHeaders"];

function proc_init(onlylog){
	if (chrome.webRequest.onBeforeSendHeaders.hasListener(proc_intercept, filter, opt_extraInfoSpec)){
		chrome.webRequest.onBeforeSendHeaders.removeListener(proc_intercept, filter, opt_extraInfoSpec);
	}	
	if (g_config.change_enable && g_config.log_enable){
		chrome.webRequest.onBeforeSendHeaders.addListener(proc_intercept, filter, opt_extraInfoSpec);
	}	
	if(onlylog)return;
	proc_updateicon();
}

var lastidcount=1;
function proc_uastring(){
	var rule_basic={
      id: 1, priority: 1,
	  action: {
		  type: 'modifyHeaders', requestHeaders:[{header: 'user-agent', operation: 'set', value: ''}],
      },
      condition: {
		resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
      },
    };
	var rules={};
	rules.removeRuleIds=[];
	for(var i=1; i<=lastidcount; i++) rules.removeRuleIds.push(i);
	if(g_config.change_enable){
		rules.addRules=[];
		var idcount=0;
		var pcount=g_config.req_pattern.length+5;
		if (g_config.req_pattern_enable2){
			for(var i = 0; i < g_config.req_pattern.length; i++){
				if (g_config.req_pattern[i].active && g_config.req_pattern[i].pattern){
					var rule=JSON.parse(JSON.stringify(rule_basic));
					idcount++; rule.id=idcount;
					pcount--; rule.priority=pcount;
					if (g_config.req_pattern[i].data && g_config.req_pattern[i].data[0]){
						rule.action.requestHeaders[0].value=g_config.req_pattern[i].data[0].value || '';		
					}
					if(g_config.req_pattern[i].type && g_config.req_pattern[i].type.length>0){
						rule.condition.resourceTypes=g_config.req_pattern[i].type;
					}
					if(g_current_tabid) rule.condition.tabIds=[g_current_tabid];				
					if(g_config.req_pattern[i].pattern.indexOf("r/")==0){
						rule.condition.regexFilter=g_config.req_pattern[i].pattern.substr(2,g_config.req_pattern[i].pattern.length);
					}else{
						rule.condition.urlFilter=g_config.req_pattern[i].pattern;
					}				
					rules.addRules.push(rule);
				}
			}
		}
		if(g_config.current_uastring){
			var rule=JSON.parse(JSON.stringify(rule_basic));
			idcount++; rule.id=idcount;
			pcount--; rule.priority=pcount;
			rule.action.requestHeaders[0].value=g_config.current_uastring;		
			if(g_config.change_type && g_config.change_type.length>0){
				rule.condition.resourceTypes=g_config.change_type;
			}
			if(g_current_tabid) rule.condition.tabIds=[g_current_tabid]; //Only supported for session-scoped rules
			rule.condition.urlFilter='*';
			rules.addRules.push(rule);
		}		
		if(rules.addRules.length>0){
			if(idcount>lastidcount){
				rules.removeRuleIds=[];
				for(var i=1; i<=idcount; i++){
					rules.removeRuleIds.push(i);
				}
			}
			lastidcount=idcount;
			//console.log(rules);		
			chrome.declarativeNetRequest.updateSessionRules(rules);		
			//chrome.declarativeNetRequest.updateDynamicRules(rules);
			return;
		}
	}	
	rules={}
	rules.removeRuleIds=[];
	for(var i=1; i<=lastidcount; i++) rules.removeRuleIds.push(i);
	//console.log(rules);
	chrome.declarativeNetRequest.updateSessionRules(rules);		
}

function proc_updateicon(){
	proc_uastring();

	var s='';
	if (g_config.change_enable){
		if (g_config.current_uaidx>=0) s=g_config.current_uaab;		
		else s='-';
		//if (g_config.req_pattern_enable) s='P';
	}				
	if (g_current_tabid){
		//chrome.action.setBadgeBackgroundColor({color:[201, 175, 30, 255]});	//green
		chrome.action.setBadgeBackgroundColor({color:[0, 128, 192, 255]}); //blue
	}else{
		chrome.action.setBadgeBackgroundColor({color:[198, 63, 28, 255]});	
	}	
	chrome.action.setBadgeText({text: s});
}

function proc_updatecurrent(idx){
	idx=parseInt(idx);
	if (idx==null || isNaN(idx)) idx=g_config.current_uaidx;
	
	if ((idx>=0) && (idx<=g_config.ua_data.length-1)) {
		var a=g_config.ua_data[idx];
		g_config.current_uaidx=idx;
		g_config.current_uaab=a.ab;
		g_config.current_uastring=a.uastring;   		
	} else {		
		g_config.current_uaidx=-1;
		g_config.current_uaab='';
		g_config.current_uastring='';
	}
   	localStorage['current_uaidx']=g_config.current_uaidx;
   	localStorage['current_uaab']=g_config.current_uaab;
   	localStorage['current_uastring']=g_config.current_uastring;
   	
   	proc_updateicon();
}

function proc_update_tab(tabId) {
	if (g_current_tabid && g_current_tabid==tabId){
		g_current_tabid=null;
		localStorage['change_enable']=false;
		g_config.change_enable=false;
		proc_init();		
	}	
}
chrome.tabs.onRemoved.addListener(proc_update_tab);
if(localStorage['g_current_tabid']){
	g_current_tabid=localStorage['g_current_tabid'];
	chrome.tabs.get(g_current_tabid, function(tab){
		if(!tab) proc_update_tab(g_current_tabid);
	});
}

proc_init();

gmessageactive=true;
}//_main()
_main();
