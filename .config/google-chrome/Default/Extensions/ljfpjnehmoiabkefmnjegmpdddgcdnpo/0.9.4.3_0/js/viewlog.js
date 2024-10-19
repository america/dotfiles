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
chrome.extension.onRequest={};
chrome.extension.onRequest.addListener=function(p1){
	chrome.runtime.onMessage.addListener(p1);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//bgstorage['log_config']='';
/*for (var i = 0; i < bgstorage.length; i++){
	var a=bgstorage.key(i);
	alert(a);
	bgstorage.removeItem(a);		
}	*/
	
var type_default=["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"];
var type_default_text=["Main frame", "Sub frame", "Stylesheet", "Script", "Image", "Object", "xmlhttprequest", "Other"];

var viewlog_refreshhotkey,viewlog_refreshhotkey2;
var viewlog_clearhotkey,viewlog_clearhotkey2;

function get_actionkey(hotkey,hotkey2){
	var control="";
	if (hotkey=="ctrl+shift") control="Ctrl+Shift+";
	else if (hotkey=="ctrl+alt") control="Ctrl+Alt+";
	else if (hotkey=="ctrl") control="Ctrl+";
	else if (hotkey=="alt") control="Alt+";
	else if (hotkey=="shift") control="Shift+";
	
	if ((hotkey2>=65) && (hotkey2<=90)) {
		control=control+String.fromCharCode(hotkey2);
	} else if ((hotkey2>=112) && (hotkey2<=121)) {
		control=control+"F"+(hotkey2-111);
	} else if ((hotkey2>=48) && (hotkey2<=57)) {
		control=control+String.fromCharCode(hotkey2);
	} else if ((hotkey2>=188) && (hotkey2<=191)) {
		control=control+String.fromCharCode(hotkey2-188+44);
	} else if ((hotkey2>=219) && (hotkey2<=221)) {		
		control=control+String.fromCharCode(hotkey2-219+91);
	} else if (hotkey2==37) {		
		control=control+'Left';
	} else if (hotkey2==38) {		
		control=control+'Up';
	} else if (hotkey2==39) {		
		control=control+'Right';
	} else if (hotkey2==40) {		
		control=control+'Down';
	} else if (hotkey2==33) {		
		control=control+'PageUp';
	} else if (hotkey2==34) {		
		control=control+'PageDown';
	} else if (hotkey2==35) {		
		control=control+'End';
	} else if (hotkey2==36) {		
		control=control+'Home';
	} else {
		control="";
	}	
	if (control=="") control=chrome.i18n.getMessage('conf_none');
	return control;
}

function init(){
	try{
		viewlog_refreshhotkey=toSafeString(bgstorage['viewlog_refreshhotkey']);
		viewlog_refreshhotkey=viewlog_refreshhotkey.toLowerCase();
		viewlog_refreshhotkey2=toSafeString(bgstorage['viewlog_refreshhotkey2']);
		var a=document.getElementById('btn_reload');
		if (a) a.innerHTML="<img src='images/reload.png' align='absmiddle'> "+_i18n('msg_refresh')+"("+get_actionkey(viewlog_refreshhotkey,viewlog_refreshhotkey2)+")";
	
		viewlog_clearhotkey=toSafeString(bgstorage['viewlog_clearhotkey']);
		viewlog_clearhotkey=viewlog_clearhotkey.toLowerCase();
		viewlog_clearhotkey2=toSafeString(bgstorage['viewlog_clearhotkey2']);
		var a=document.getElementById('btn_clear');
		if (a) a.innerHTML="<img src='images/clear.png' align='absmiddle'> "+_i18n('msg_clearlog')+"("+get_actionkey(viewlog_clearhotkey,viewlog_clearhotkey2)+")";
	}catch(err){}

	chrome.extension.sendRequest({type:'get_g_config', name:'log_enable'});
	chrome.extension.sendRequest({type:'get_g_config', name:'change_enable'}, function(response){
		var a=document.getElementById("log_enable");
		a.disabled=!response;
		var b=document.getElementById("log_enable_font");
		if(a.disabled) b.style.color='silver'; else b.style.color='';
	});
		
	//bgstorage['log_config']='{"type":["image"]}';		
	var a=document.getElementById('config_pattern');
	a.onkeydown=config_pattern_onkeydown;
	
	//document.addEventListener("click",doc_eventClick);
	document.addEventListener("mousedown",doc_mousedown);	
	document.addEventListener("keydown",doc_keydown);	
	
	for (var i = 0; i < type_default.length; ++i) {    	
		var a=document.getElementById("config_type_"+type_default[i]);
		if (a) {
			a.checked=false;
			a.onchange = function(){
				proc_setconfig();
			}
		}
	}
	
	var log_config={};
	try{
		log_config=JSON.parse(bgstorage['log_config']);     	
	}catch(err){}
	
	try{
		if (log_config.type){
			for (var i = 0; i < log_config.type.length; ++i) {    	
				for (var j = 0; j < type_default.length; ++j) {    	
					if (log_config.type[i]==type_default[j]){
						var b=document.getElementById("config_type_"+type_default[j]);
						if (b) b.checked=true;
					}
				}
			}
		}
		
		var b=document.getElementById('config_method');
		b.value=log_config.method;		
		
		var b=document.getElementById('config_pattern');
		if (!log_config.pattern) log_config.pattern='';
		b.value=log_config.pattern;
		
		var b=document.getElementById('config_enablepattern');
		if (log_config.enablepattern==null) log_config.enablepattern=true;
		b.checked=log_config.enablepattern;

		var b=document.getElementById('config_autoselect');
		if (log_config.autoselect==null) log_config.autoselect=false;
		b.checked=log_config.autoselect;
	}catch(err){}
		
	proc_uichange();
			
	proc_loadlog();	
	
	setInterval(function(){
		chrome.extension.sendRequest({type:'get_g_config', name:'log_enable'}); //keepalive
	},2000);
}

function proc_setconfig(saveonly){
	var c=[];
	for (var i = 0; i < type_default.length; ++i) {    	
		var a=document.getElementById("config_type_"+type_default[i]);
		if (a && a.checked) c[c.length]=type_default[i];
	}	
	
	var a={};
	a.type=c;
	a.method=document.getElementById('config_method').value;
	a.pattern=document.getElementById('config_pattern').value;
	a.enablepattern=document.getElementById('config_enablepattern').checked;
	a.autoselect=document.getElementById('config_autoselect').checked;
	
	bgstorage['log_config']=JSON.stringify(a);
	chrome.extension.sendRequest({type:'set', key:'log_config', value:JSON.stringify(a)}, function(response){
	});
	//location.reload();
	
	if (!saveonly){
		close_viewheader();
		proc_loadlog();
	}
}

var g_log_data=[];
function proc_loadlog(){
	//g_log_data=bgmodule.g_config.log_data.slice(0); //copy array
	chrome.extension.sendRequest({type:'get_g_config', name:'log_data'}, function(response){
		g_log_data=response;
		proc_loadlog2();
	});
}
function proc_loadlog2(){		
	var a=document.getElementById("log_data");	
	
	var log_config={};
	try{
		log_config=JSON.parse(bgstorage['log_config']);     	
	}catch(err){}
	
	log_config.re=null;	
	if (log_config.enablepattern && log_config.pattern){
		var s=log_config.pattern;
		if(s.indexOf("r/")==0) {
			s=s.substr(2,s.length);
		} else {
			s=s.replace(/\./g, "\\.").replace(/\?/g, "\\\?").replace(/\x2a/g, "(.*)");
			s="^" + s + "$";
		}	
		try {
			log_config.re=new RegExp(s);
		} catch (err) {}							
	}
	
	var surl,time,flag;
	var s='<table width=100% border="1" cellpadding="1" cellspacing="0" bordercolor="silver" style="min-width:1200px;border-collapse:collapse">'+
		'<td align=center width=30><b>'+_i18n('msg_time')+'</b><td align=center width=30><b>Type(Filter)</b><td align=center width=30><b>Method</b><td align=center><b>URL</b><td width=30>'+
		'<td align=center width=30><b>'+_i18n('msg_header')+'</b><td width=350 align=center><b>'+_i18n('msg_changedua')+'</b>';
			
	for (var i = 0; i < g_log_data.length; ++i) {    
		var c=g_log_data[i];
		
		if (log_config.re){
			if (!c.details.url.match(log_config.re)) continue;
		}
		
		var cc=log_config.type;
		if (cc && cc.length > 0){
			flag=false;
			for (var j = 0; j < cc.length; ++j) {    
				if (cc[j]==c.details.type){
					flag=true;
					break;
				}
			}
			if (!flag) continue;
		}
		
		var cc=log_config.method;
		if (cc){
			if (c.details.method!=cc) continue;
		}
				
		/*surl=html_entity_encode(c.details.url);
		if (surl.length>120){
			surl=surl.substr(0,120)+'...';
		}*/
		
		var now=new Date(c.details.timeStamp);   	  	
		//time=(now.getMonth()+1)+'/'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
		time=now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
		
		surl=html_entity_encode(c.details.url);
		
		s=s+'<tr>';		
		s=s+'<td width=30>'+time+'<td width=30>'+c.details.type+'<td width=30>'+c.details.method+'<td><input type=text style="width:100%" spellcheck=false id="fix1_3_'+i+'" value="'+surl+'">'
			+'<td width=30><a href="'+surl+'" target="_blank">'+_i18n('msg_link')+'</a>'
			+'<td width=30 align=center><a id="fix1_5_'+i+'" href="#" class=alinktext>'+_i18n('msg_view')+'</a>'
			+'<td width=350><input type=text style="width:100%" spellcheck=false value="'+html_entity_encode(c.data[0].value)+'" id="fix1_4_'+i+'">';
	}
	s=s+'</table>';
	a.innerHTML=s;	
	
	for (var i = 0; i < g_log_data.length; ++i) {    
		var a=_getid('fix1_3_'+i);
		if (a) a.onclick=function(){input_onclick(this);}
		var a=_getid('fix1_4_'+i);
		if (a) a.onclick=function(){input_onclick(this);}
		var a=_getid('fix1_5_'+i);
		if (a) {
			a.data=i;
			a.onclick=function(){proc_viewheader(event,this.data); return false;}
		}
	}	
}

function input_onclick(f){
	var a=document.getElementById('config_autoselect');
	if (a.checked){
		//if(window.getSelection()) window.getSelection().setBaseAndExtent(f, 0, f, 1);
		f.select();
	}
}

function proc_viewheader(event,idx){
	if ((idx<0) || (idx>g_log_data.length-1)) return;
	var c=g_log_data[idx];
	var a=c.details.requestHeaders;
	if (!a) return;
	var s='';
	for (var i = 0; i < a.length; ++i) {    	
		if (s) s=s+'\n';
		s=s+a[i].name+': '+a[i].value;
	}
	
	var b=event.target;
	var aa=0;
	var cc=0;
   while (b && !isNaN(b.offsetLeft) && !isNaN(b.offsetTop)) {
        aa += b.offsetLeft;
        cc += b.offsetTop;
        b = b.offsetParent;
   }	    
	var x=aa+event.target.offsetWidth+7;
	var y=cc+1;
	
	//var x=event.clientX+10+document.body.scrollLeft;
	//var y=event.clientY+10+document.body.scrollTop;	

	var a=document.getElementById("layer_headers");	
	var b=document.getElementById("txt_viewheader");
	if (b){
		b.value=s;
		//alert(a.offsetWidth+','+a.offsetHeight);
	} else {
		s='&nbsp;<label>['+_i18n('msg_orgheader')+']</label>&nbsp;<a id="fix1_6" href="#" class=alinktext title="'+_i18n('msg_close')+'"><img src="images/close.png" align="absmiddle"></a>'+
			'&nbsp;&nbsp;<label><input id="viewlog_viewheaderautoclose" type=checkbox>'+_i18n('msg_autocloseonclick')+'</label>'+
			'<br><textarea id="txt_viewheader" style="width:550px;height:140px;background-color:#FFFFE1;border:0px;padding:3px" wrap="on" spellcheck=false>'+s+'</textarea>';		
		a.innerHTML=s;	   
	}		
	a.style["background-color"]="#FFFFE1";
	a.style["border"]="1px solid #000000";
	a.style["padding"]="0px";	
	a.style.display='';
	
	var b=document.getElementById("txt_viewheader");
	if(b){
		proc_blockwheel(b);
	}
	
	var c=_getid('fix1_6');
	if (c) c.onclick=function(){close_viewheader(); return false;}
	var c=document.getElementById("viewlog_viewheaderautoclose");	
	if (c) {
		c.onclick=viewlog_viewheaderautoclose_onclick;
		c.checked=toBool(bgstorage["viewlog_viewheaderautoclose"]);
	}
	
	var x1=x;
	var y1=y;
	var w1=a.offsetWidth;
	var h1=a.offsetHeight;
	var diff=30;
		
	if ((x+w1) > (window.innerWidth-diff)) 
		x=(window.innerWidth-diff)-w1;
	var h=document.body.scrollTop+window.innerHeight;
	if ((y+h1) > (h-diff))
		y=(h-diff)-h1;
		
	if (x < x1) x=aa-w1-3;
	if (x < 0) x=0;
	
	a.style.left=x+'px';
	a.style.top=y+'px';	
}

function close_viewheader(){
	var a=document.getElementById("layer_headers");
	if (a) a.style.display='none';	
}

function viewlog_viewheaderautoclose_onclick(){
	var c=document.getElementById("viewlog_viewheaderautoclose");	
	if (c){
		bgstorage["viewlog_viewheaderautoclose"]=c.checked;
		chrome.extension.sendRequest({type:'set', key:'viewlog_viewheaderautoclose', value:c.checked}, function(response){
		});
	}
}

function doc_mousedown(e){
	if (e.button!=0) return;
	var obj=document.getElementById("layer_headers");
	if (obj && (obj.style.display=="")) {
		if (!toBool(bgstorage["viewlog_viewheaderautoclose"])) return;
		var b=e.target;
		while (b) {
			if (b.id=="layer_headers")
				return;
			b = b.parentElement;
		}
		
		obj.style.display='none';	
	}
}

function doc_keydown(e){
	var code=e.keyCode;
	var press_ctrl=typeof e.modifiers=='undefined'?e.ctrlKey:e.modifiers&Event.CONTROL_MASK;
	var press_alt=typeof e.modifiers=='undefined'?e.altKey:e.modifiers&Event.ALT_MASK;
	var press_shift=typeof e.modifiers=='undefined'?e.shiftKey:e.modifiers&Event.SHIFT_MASK;		
	
	var control="";
	if ((press_ctrl) && (press_shift)) control="ctrl+shift";
	else if ((press_ctrl) && (press_alt)) control="ctrl+alt";
	else if (press_ctrl) control="ctrl";
	else if (press_alt) control="alt";
	else if (press_shift) control="shift";	
		
	var flag=false;
	if ((code==viewlog_refreshhotkey2) && (control==viewlog_refreshhotkey)) {
		proc_loadlog();
		flag=true;
	} else if ((code==viewlog_clearhotkey2) && (control==viewlog_clearhotkey)) {
		proc_clearlog();
		flag=true;
	}

	if (flag){
		e.preventDefault();  
		e.stopPropagation(); 
		e.returnValue = false; 				
	}	
}

function proc_clearlog(){
	//bgmodule.g_config.log_data=[];
	chrome.extension.sendRequest({type:'set_g_config', name:'log_data'}, function(response){
	});
	g_log_data=[];
	//bgstorage['log_data']=[];
	//location.reload();
	proc_loadlog();
	//var a=document.getElementById("log_data");
	//a.innerHTML='';
	close_viewheader();
}

function config_pattern_onkeydown(e){
	var code=e.keyCode;
	var press_ctrl=typeof e.modifiers=='undefined'?e.ctrlKey:e.modifiers&Event.CONTROL_MASK;
	var press_alt=typeof e.modifiers=='undefined'?e.altKey:e.modifiers&Event.ALT_MASK;
	var press_shift=typeof e.modifiers=='undefined'?e.shiftKey:e.modifiers&Event.SHIFT_MASK;		

	if ((!press_ctrl) && (!press_alt) && (!press_shift)) {
		if (code==13) {
			proc_setconfig();
			return;	
		}
	}			
}

function config_pattern_help(){
	var s='ex: http*://www.google.*/*, http://*.google.com*\n\nYou can use regular expression. paste "r/" before regular expression.\nex: r/^http:\\/\\/[A-Za-z0-9]+\\/';
	alert(s);
}

function proc_uichange(){
	var a=document.getElementById("config_enablepattern");
	var b=document.getElementById("config_pattern");
	var c=document.getElementById("btn_apply");
	
	var f;
	if (a.checked) f=false;
	else f=true;
	b.disabled=f;
	c.disabled=f;
}

function log_enable_onchange(){
	var a=document.getElementById("log_enable");				
	bgstorage['log_enable']=a.checked;
	//bgmodule.g_config.log_enable=a.checked;
	chrome.extension.sendRequest({type:'set', key:'log_enable', value:a.checked}, function(response){
	});
}


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
function proc_onload(){
	proc_setlang();
	
	_getid("btn_reload").onclick=proc_loadlog;
	_getid("btn_clear").onclick=proc_clearlog;
	_getid("log_enable").onclick=log_enable_onchange;
	_getid("config_method").onchange=function(){proc_setconfig();}
	
	_getid("config_enablepattern").onclick=function(){proc_setconfig(); proc_uichange();}
	_getid("btn_apply").onclick=function(){proc_setconfig();}
	_getid("config_autoselect").onclick=function(){proc_setconfig(true);}
	
	_getid("fix1_1").onclick=function(){config_pattern_help(); return false;};
	_getid("fix1_2").onclick=function(){open_newtab_extension('options.html'); return false;}

	chrome.extension.sendRequest({type:'get_bgstorage'}, function(response){
		if(response){
			bgstorage=response.bgstorage || {};
			init();
		}
	});	
}

window.onload=proc_onload;

function windowonresize(){	
	var obj=document.getElementById("layer_message");
	if (obj) obj.style.display="none";
	var obj=document.getElementById("layer_message2");
	if (obj) obj.style.display="none";
	var obj=document.getElementById("layer_message3");
	if (obj) obj.style.display="none";	
}
window.onresize=windowonresize;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	if (request.action == "config_changed") {  
		chrome.extension.sendRequest({type:'get_g_config', name:'log_enable'});
		chrome.extension.sendRequest({type:'get_g_config', name:'change_enable'}, function(response){
			var a=document.getElementById("log_enable");
			if(a) a.disabled=!response;
			var b=document.getElementById("log_enable_font");
			if(a.disabled) b.style.color='silver'; else b.style.color='';
		});
	}else if (request.action == "log_enable") { //keepalive
		var a=document.getElementById("log_enable");
		if(a) a.checked=request.value;
		if(!request.value){
			show_message("<label2><font style='font-size:13px'>URL sniffer feature is disabled. You have to enable URL sniffer feature on menus.</font></label2>",null,null,null,3000500);
		}else{
			var obj=document.getElementById("layer_message2");
			if (obj && obj.style.display=='') obj.style.display="none";
		}
		var a=document.getElementById("log_enable");
		if(a) a.disabled=!request.change_enable;
		var b=document.getElementById("log_enable_font");
		if(a.disabled) b.style.color='silver'; else b.style.color='';
	}	
});
