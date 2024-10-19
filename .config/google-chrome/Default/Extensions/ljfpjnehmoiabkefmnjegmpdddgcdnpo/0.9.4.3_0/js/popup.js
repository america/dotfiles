//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
chrome.extension.sendRequest=function(p1, p2){	
	var retryactivecount=0,retryactivetimer;
	function check_active(){
		chrome.runtime.sendMessage({type:'active'}, function(response){
			if(!response && retryactivecount<20){
				retryactivecount++;	
				clearTimeout(retryactivetimer);
				retryactivetimer=setTimeout(function(){
					check_active();
				},400);
				return;
			}
			chrome.runtime.sendMessage(p1, p2);
		});
	}
	try{
		check_active();
	}catch(err){
		if(p2) p2();
	}
}
chrome.tabs.getSelected=function(windowId,callback){
	chrome.tabs.query({active:true, currentWindow:true},function(tab){
		if(tab && tab.length>0) callback(tab[0]);
		else callback();
	})
};
var bgstorage={};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var config={};
var bgdata={};

var type_default=["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"];
var type_default_text=["Main frame", "Sub frame", "Stylesheet", "Script", "Image", "Object", "xmlhttprequest", "Other"];

function init(){		
	var a=document.getElementById("change_enable");				
	a.checked=config.change_enable;
	
	var a=document.getElementById("req_pattern_enable2");				
	a.checked=config.req_pattern_enable2;

	var a=document.getElementById("log_enable");				
	a.checked=config.log_enable;

	var a=document.getElementById("other_autorefresh");				
	a.checked=toBool(bgstorage['other_autorefresh']);	

	//var a=document.getElementById("change_mode");				
	//if (a) a.value=config.change_mode;	
	
	if (config.current_uaidx<0) var s="<label><input type='radio' name='ua_data_sel' id='fix1_3' value='-1' checked>"+_i18n('msg_defaultchrome')+"</label>";
	else var s="<label><input type='radio' name='ua_data_sel' id='fix1_3' value='-1'>"+_i18n('msg_defaultchrome')+"</label>";
	var s1;
	for(var i = 0; i < config.ua_data.length; i++){
		var a=config.ua_data[i];
		if (a.hide) continue;
		if (config.current_uaidx==i){
			s1=' checked';
		} else {
			s1='';
		}		
		if (s!='') s=s+'<br>';		
		s=s+"<label><input type='radio' name='ua_data_sel' id='fix1_4_"+i+"' value='"+i+"'"+s1+">"+a.name+"</label>";		
	}
	
	var a=document.getElementById("ua_data");						
	a.innerHTML=s;
	
	_getid('fix1_3').onclick=function(){ua_data_sel_onclick(this);}
	for(var i = 0; i < config.ua_data.length; i++){
		var a=_getid('fix1_4_'+i);
		if (a) a.onclick=function(){ua_data_sel_onclick(this);}
	}	

	var a=config.change_type;
	var s1='';
	for (var j = 0; j < a.length; ++j) {    	
		for (var k = 0; k < type_default.length; ++k) {    	
			if (a[j]==type_default[k]){
				if (s1!='') s1=s1+', ';
				s1=s1+type_default_text[k];
				break;
			}
		}
	}
	if (s1=='') s1=_i18n('conf_none');
	var a=document.getElementById("change_type");						
	a.innerHTML='&nbsp;'+_i18n('msg_filter')+': <font color=green>'+s1+'</font>';	
	
	proc_updateui();	
}

function ua_data_sel_onclick(f){
	chrome.extension.sendRequest({type:'set_g_config', name:'proc_updatecurrent', value:f.value}, function(response){
		proc_refreshtab();
	});
}

function proc_refreshtab(){
	if (!toBool(bgstorage['other_autorefresh'])) return;	
	chrome.windows.getLastFocused( function(win) {
		chrome.tabs.getSelected(win.id, function(tab) { 	
			chrome.tabs.reload(tab.id, {bypassCache:false});
			//chrome.tabs.update(tab.id, {'url': tab.url});
		});
	});
}

function proc_refreshalltabs(){
	chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
		for( i = 0; i < tabs.length; i++){
			var tab=tabs[i];
			if (tab && tab.id){ //tab.url
				chrome.tabs.reload(tab.id, {bypassCache:false});
				//chrome.tabs.update(tab.id, {url: tab.url});						
			}
		}
	});
	/*chrome.windows.getLastFocused( function(win) {
		chrome.tabs.getAllInWindow(win.id, function(tabs) {
			for( i = 0; i < tabs.length; i++){
				var tab=tabs[i];
				if (tab && tab.url) chrome.tabs.update(tab.id, {url: tab.url});						
			}
		});
	});*/
}			

function proc_updateui(){
	var a=document.getElementById("change_enable");				
	var flag=true;	
	if (a.checked) flag=false;
	
	var flag2=false;
	if (_getid("btn_gocurrenttab").style.display=="") flag2=true;

	var b=document.getElementsByTagName('*');
	for(var i = 0; i < b.length; i++){    
		if (b[i]==a) continue;
		switch(b[i].tagName) {
			case "INPUT":
			case "SELECT":
			case "BUTTON":
				b[i].disabled=flag;
				if (flag2){
					switch(b[i].id) {
						case "other_currettab":
						case "btn_gocurrenttab":
						case "other_autorefresh":
						case "req_pattern_enable2":
						case "log_enable":						
							break;
						default:
							b[i].disabled=true;
							break;
					}
				}
				/*if (flag2 && b[i]!=_getid("other_currettab") && b[i]!=_getid("btn_gocurrenttab") && b[i]!=_getid("req_pattern_enable2")){
					b[i].disabled=true;
				}*/
				break;
		}
	}		
	
	/*if (!flag){
		var a=document.getElementById("req_pattern_enable")
		var flag=false;	
		if (a.checked) flag=true;
		
		var b=document.getElementById("ua_data").getElementsByTagName('*');
		for(var i = 0; i < b.length; i++){    
			if (b[i]==a) continue;
			switch(b[i].tagName) {
				case "INPUT":
				case "SELECT":
					b[i].disabled=flag;
					break;
			}
		}		
	}*/
}

function other_autorefresh_onchange(){
	var a=document.getElementById("other_autorefresh");
	bgstorage['other_autorefresh']=a.checked;
	chrome.extension.sendRequest({type:'set', key:'other_autorefresh', value:a.checked}, function(response){
		if (a.checked) proc_refreshtab();
	});	
}

function change_enable_onchange(){
	var a=document.getElementById("change_enable");				
	bgstorage['change_enable']=a.checked;
	chrome.extension.sendRequest({type:'set', key:'change_enable', value:a.checked}, function(response){
	});
	config.change_enable=a.checked;	
	
	other_currettab_onclick();	
	chrome.extension.sendRequest({type:'set_g_config', name:'proc_init'}, function(response){
		proc_updateui();
		proc_updateconfig();	
		proc_refreshtab();
	});
}

function req_pattern_enable_onchange(){
	var a=document.getElementById("req_pattern_enable2");				
	bgstorage['req_pattern_enable2']=a.checked;
	config.req_pattern_enable2=a.checked;

	chrome.extension.sendRequest({type:'set', key:'req_pattern_enable2', value:a.checked, proc_uastring:true}, function(response){		
		//proc_updateui();
		//bgmodule.proc_updatecurrent(null);
		proc_updateconfig();
		proc_refreshtab();
	});
}

function log_enable_onchange(){
	var a=document.getElementById("log_enable");				
	bgstorage['log_enable']=a.checked;
	chrome.extension.sendRequest({type:'set', key:'log_enable', value:a.checked}, function(response){
	});
	config.log_enable=a.checked;
	proc_updateconfig();
}

function proc_updateconfig(){
	chrome.runtime.sendMessage({action: "config_changed"}, function(){});
	chrome.windows.getAll({"populate" : true}, function(windows){     
		for (var i = 0; i < windows.length; i++) {
			var win = windows[i];        
			for (var j = 0; j < win.tabs.length; j++) {
				var tab = win.tabs[j];
				var s=tab.url || '';
				if(s){
					s=s.toLowerCase();
					if(s.indexOf('://'+bgdata.g_extensionid)>=0 || s.indexOf('iblogbox.com/chrome/useragent/option')>=0){
						//chrome.tabs.sendRequest(tab.id, {action: "config_changed"} , null); 
						chrome.tabs.sendMessage(tab.id, {action: "config_changed"}); 
					}
				}				
			}
		}      
	});		
}


function other_currettab_onclick(flag){
	if (_getid("other_currettab").checked){
		chrome.windows.getLastFocused( function(win) {
			chrome.tabs.getSelected(win.id, function(tab) { 	
				chrome.extension.sendRequest({type:'set_g_config', name:'g_current_tabid', value:tab.id}, function(response){
					if (flag) proc_refreshtab();	
				});
			});
		});			
	}else{		
		chrome.extension.sendRequest({type:'set_g_config', name:'g_current_tabid', value:null}, function(response){
			//if (flag) proc_refreshtab();	
		});
	}	
	_getid("btn_gocurrenttab").style.display="none";	
	if (flag) proc_updateui();
}

/*function change_mode_onchange(){
	var a=document.getElementById("change_mode");				
	bgstorage['change_mode']=a.value;
	config.change_mode=a.value;
}*/

///////////////////////////////////////////////////////////////////////////////////////
function proc_onload(){
	chrome.extension.sendRequest({type:'get_bgstorage'}, function(response){
		if(response){
			bgstorage=response.bgstorage || {};
			bgdata=response.bgdata || {};
			config=response.config || {};			
			proc_onload2();
		}
	});	
}
function proc_onload2(){
	proc_setlang();
	
	document.ondragstart=function(){return false;}
	
	_getid("change_enable").onchange=change_enable_onchange;
	_getid("req_pattern_enable2").onchange=req_pattern_enable_onchange;
	_getid("log_enable").onchange=log_enable_onchange;
	_getid("other_autorefresh").onchange=other_autorefresh_onchange;
	
	_getid("fix1_1").onclick=function(){open_newtab_extension('options.html'); return false;}
	_getid("fix1_2").onclick=function(){open_newtab_extension('viewlog.html'); return false;}
	
	_getid("fix1_10").onclick=function(){open_newtab('https://atomurl.net/myip',false); return false;}
	_getid("fix1_11").onclick=function(){open_newtab('https://iblogbox.com/chrome/useragent/alert.php',false); return false;}
	_getid("fix1_12").onclick=function(){open_newtab('https://iblogbox.com/devtools/js/',false); return false;}
	
	_getid("btn_refreshalltabs").onclick=function(){proc_refreshalltabs(); return false;}
	
	if (bgdata.g_current_tabid){		
		chrome.tabs.get(bgdata.g_current_tabid, function(tab){
			if (tab){
				chrome.windows.getLastFocused( function(win) {
					chrome.tabs.getSelected(win.id, function(tab2) { 	
						if (tab.id==tab2.id) _getid("other_currettab").checked=true;
						else _getid("btn_gocurrenttab").style.display="";
						proc_updateui();
					});
				});
			}else{
				chrome.extension.sendRequest({type:'set_g_config', name:'g_current_tabid', value:null}, function(response){
				});
			}
		});	
	}
	_getid("other_currettab").onclick=function(){other_currettab_onclick(true);}
	
	_getid("btn_gocurrenttab").onclick=function(){
		if (bgdata.g_current_tabid){		
			chrome.tabs.get(bgdata.g_current_tabid, function(tab){
				if (tab){
					chrome.tabs.update(tab.id, {active:true});
					if(tab.windowId){
						chrome.windows.update(tab.windowId, {focused:true});
					}
				}
			});
		}		
	}
	
	init();	
}

window.onload=proc_onload;
