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
chrome.extension.onRequest={};
chrome.extension.onRequest.addListener=function(p1){
	chrome.runtime.onMessage.addListener(p1);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function trim(str) {
  	return str.replace(/^\s*|\s*$/g,"");
}

function makequeryescape(str) {
  	str=str.replace(/&/gi, "%26");  	
  	return str;
}

function html_entity_decode(str)
{
  str = str.replace(/&amp;/gi, "&");
  str = str.replace(/&gt;/gi, ">");
  str = str.replace(/&lt;/gi, "<");
  str = str.replace(/&quot;/gi, "\"");
  str = str.replace(/&#039;/gi, "'");
  return str;
}

function html_entity_encode(str)
{
  str = str.replace(/&/gi, "&amp;");
  str = str.replace(/>/gi, "&gt;");
  str = str.replace(/</gi, "&lt;");
  str = str.replace(/\"/gi, "&quot;");
  str = str.replace(/\'/gi, "&#039;");
  return str;
}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function toBool(str){
	if (typeof(str)=='boolean'){
		return str;
	}
  return ("false" === str) ? false : true;
}
function getValue(s,s_find,s_end){
  s_find=s_find.toLowerCase();
  s_end=s_end.toLowerCase();
  
  ss=s.toLowerCase();    
  p1=ss.indexOf(s_find);
  if (p1<0) return;
  s1=s.substr(p1+s_find.length,s.length);
  
  ss=s1.toLowerCase();
  p1=ss.indexOf(s_end);
  if (p1<0) return;
  s1=s1.substr(0,p1);
  return s1;
}

var messagetimer=null;
function show_message(s,x,y,padding,timeout){
	if (!x) x=10;
	if (!y) y=10;
	if (!padding) padding=5;
	if (!timeout) timeout=2000;

	var kind=1;
	var obj=document.getElementById("layer_message");
	if (!obj) {
		var obj=document.getElementById("layer_message2");
		if (!obj) {
			var obj=document.getElementById("layer_message3");
			if (!obj) return;
			kind=3;
		} else {
			kind=2;
		}
	}
	
	obj.style.left="1px";
	obj.style.top="1px";		
	obj.innerHTML="<label2>"+s+"</label2>";
	obj.style.display="";	
	
	if (kind==1) {
		x=document.body.scrollLeft+x;	
		y=document.body.scrollTop+y;;
	} else if (kind==2) {
		x=document.body.scrollLeft+((window.innerWidth-obj.clientWidth) / 2);
		y=document.body.scrollTop+((window.innerHeight-obj.clientHeight) / 2);
	} else {
		x=document.body.offsetWidth-obj.clientWidth-5;
		y=document.body.scrollTop+y;;
	}
	x=parseInt(x);
	y=parseInt(y);
	
	obj.style.left=x+"px";
	obj.style.top=y+"px";		
	obj.style["background-color"]="#FFFFE1";
	obj.style["border"]="1px solid #000000";
	obj.style["padding"]=padding+"px";
	
	if (messagetimer) clearTimeout(messagetimer);
	messagetimer=setTimeout(hide_message, timeout);
}

function hide_message(){
	var obj=document.getElementById("layer_message");
	if (obj) obj.style.display="none";
	var obj=document.getElementById("layer_message2");
	if (obj) obj.style.display="none";
	var obj=document.getElementById("layer_message3");
	if (obj) obj.style.display="none";
}

function changebox(c){
	var f=c.previousSibling;
	if (f) {
		if (f.type=="checkbox") {
			f.checked = !f.checked;
			if (f.onchange) f.onchange();
			if (f.onclick) f.onclick();
		}
	}
}

function changeboxbyid(c){
	var f=document.getElementById(c);
	if (f){
		if (f.type=="checkbox") {
			f.checked = !f.checked;
			if (f.onchange) f.onchange();
			if (f.onclick) f.onclick();
		}
	}
}

function regex_decode(str){
  str = str.replace(/\\/gi, "\\\\");
  str = str.replace(/\^/gi, "\\^");
  str = str.replace(/\$/gi, "\\$");
  str = str.replace(/\*/gi, "\\*");
  str = str.replace(/\+/gi, "\\+");
  str = str.replace(/\?/gi, "\\?");
  str = str.replace(/\./gi, "\\.");
  str = str.replace(/\(/gi, "\\(");
  str = str.replace(/\)/gi, "\\)");
  str = str.replace(/\|/gi, "\\|");
  str = str.replace(/\{/gi, "\\{");
  str = str.replace(/\}/gi, "\\}");
  str = str.replace(/\[/gi, "\\[");		
  str = str.replace(/\]/gi, "\\]");
  return str;
}

function getparam(s,name){
	name=name+"=";
	name=name.toLowerCase();
	var p1=s.toLowerCase().indexOf(name);
	if (p1<0) return "";
	s=s.substr(p1+name.length);
	var p2=s.toLowerCase().indexOf("&");
	if (p2>=0) {
		return s.substr(0,p2);
	} else {
		return s;
	}
}	

function fillnumber(s){
	s=String(s);
	if ( s.length==1 ) { 
		return '0'+s;  
	}
	return s;
}	

function isurl_links(s) {
	//var regexp = /^(?:http:\/\/)?(?:[\w-]+\.)+[a-z]{2,6}/i;
	var regexp = /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{2,6}/i;	
	return regexp.test(s);
}

function cutstring(s,len){
	var k=0;
	for (var i = 0 ; i < s.length ; i++) {
		if (ishangul(s[i])) k=k+2;
		else k=k+1
		if (k >= len) {
			return s.substr(0,i);
		}
	}	
	return s;
}

function toSafeString(str){
	if (str==null) return '';
	else return str;
}

function _getid(id){
	return document.getElementById(id);
}

function proc_setlang(){
	var re = /\[([^\[\]]+?)\]/g;	
	var s,s1,p2;
	
	function convert(s){
		s=s.replace(re, function(str,p1) {  
				if (!p1) return '';
				p2=p1.split('|');
				if (p2.length==2){
					s1=chrome.i18n.getMessage(p2[0]);
					if (!s1) s1=p2[1];
				} else {
					s1=chrome.i18n.getMessage(p1);
				}
  				return s1;
			});		
		return s;
	}
	
	var a=document.getElementsByTagName('*');
	for(var i = 0; i < a.length; i++){    
		if (a[i].id=='i18n'){
			s=convert(a[i].title);								
			if (s) a[i].innerHTML=s;
			a[i].title='';
  		} else if (a[i].title) {
  			a[i].title=convert(a[i].title);					
  		}
	}
}

function _i18n(name){
	return chrome.i18n.getMessage(name);
}

function getOffset(b,e) {
    var a = 0;
    var c = 0;

    while (b && !isNaN(b.offsetLeft) && !isNaN(b.offsetTop)) {
        a += b.offsetLeft;
        c += b.offsetTop;
        b = b.offsetParent;
    }

    if (e) {
    	b2=e.target;
    	while (b2 && !isNaN(b2.scrollLeft) && !isNaN(b2.scrollTop)) {
    		if (b2==document.body) break;
      	  	a = a-b2.scrollLeft;
      	  	c = c-b2.scrollTop;
			if (b2.parentElement) b2=b2.parentElement;
			else b2=b2.parentNode;
    	}
    }
       
    return {
        left: a,
        top: c
    }
}



//var bgmodule=chrome.extension.getBackgroundPage();
var gisdefault=false;

function set_notsaved(){
	document.getElementById("status").innerHTML = "&nbsp;"+chrome.i18n.getMessage('conf_notsaved');
	document.getElementById("status2").innerHTML = "&nbsp;"+chrome.i18n.getMessage('conf_notsaved');
}
function set_saved(){
	document.getElementById("status").innerHTML = "&nbsp;"+chrome.i18n.getMessage('conf_saved');
	document.getElementById("status2").innerHTML = "&nbsp;"+chrome.i18n.getMessage('conf_saved');
}

function proc_hotkey1_out(){
	return '<option value="">'+chrome.i18n.getMessage('conf_none')+'</option><option value="alt">Alt</option><option value="ctrl">Ctrl</option><option value="ctrl+shift">Ctrl+Shift</option><option value="ctrl+alt">Ctrl+Alt</option>';
}
function proc_hotkey2_out(){
   	var s1='<option value="">'+chrome.i18n.getMessage('conf_none')+'</option>';
	for (i=1;i <= 10; i++) { s1+='<option value="'+(111+i)+'">F'+i+'</option>';	}
	for (i=48;i <= 57; i++) { 	s=String.fromCharCode(i); s1+='<option value="'+i+'">'+s+'</option>'; }
	for (i=65;i <= 90; i++) { 	s=String.fromCharCode(i); s1+='<option value="'+i+'">'+s+'</option>'; }
	return s1;
}

function presetValues_bool(name1,name2,callback){	
	if (gisdefault) {
		chrome.extension.sendRequest({type:'getdefault', key:name2 }, function(response) {
			document.getElementById(name1).checked = response;
			if (callback) callback();
		});
	} else {
		chrome.extension.sendRequest({type:'get', key:name2 }, function(response) {
			document.getElementById(name1).checked = toBool(response);
			if (callback) callback();
		});
	}
	document.getElementById(name1).onchange = function(){
		set_notsaved();
	}
}
function presetValues2(name1,name2,callback){	
	if (gisdefault) {
		chrome.extension.sendRequest({type:'getdefault', key:name2 }, function(response) {
			document.getElementById(name1).value = toSafeString(response);
			if (callback) callback();
		});
	} else {
		chrome.extension.sendRequest({type:'get', key:name2 }, function(response) {		
			document.getElementById(name1).value = toSafeString(response);
			if (callback) callback();
		});
	}
	document.getElementById(name1).onchange = function(){
		set_notsaved();
	}
}
function _getvalue(name2, callback){	
	if (gisdefault) {
		chrome.extension.sendRequest({type:'getdefault', key:name2 }, function(response) {
			if (callback) callback(response);
		});
	} else {
		chrome.extension.sendRequest({type:'get', key:name2 }, function(response) {		
			if (callback) callback(response);
		});
	}
}
function _setvalue(name2, value, callback){	
	chrome.extension.sendRequest({type:'set', key:name2, value: value }, function(response) {		
		if (callback) callback();
	});
}
function _bgaction(value, callback){	
	chrome.extension.sendRequest({type:'bgaction', value: value}, function(response) {
		if(callback) callback(response);
	});
}

function presetValues(isdefault){
	gisdefault=isdefault;
	
	//presetValues_bool("change_enable","change_enable");		
	try{			
		for (var i = 0; i < type_default.length; ++i) {    
			var b=document.getElementById('change_type_'+type_default[i]);				
			if (b) {
				b.checked=false;
				b.onchange = function(){
					set_notsaved();
				}
			}
		}
		
		_getvalue('change_type',function(s){
			var a=JSON.parse(s); 
			for (var i = 0; i < a.length; ++i) {    
				var b=document.getElementById('change_type_'+a[i]);				
				if (b) b.checked=true;
			}
		});
	}catch(err){}
	
	if(gisdefault){
		ua_data_make(function(){
			ua_data_load();
		}); 
	}else{
		ua_data_load();	
	}

	//presetValues_bool("log_enable","log_enable");				
	presetValues_bool("req_pattern_enable2","req_pattern_enable2");	

	if (gisdefault){
		req_pattern_make(function(){
			req_pattern_load();
		});	
	}else{
		req_pattern_load();
	}
	
	presetValues2("viewlog_refreshhotkey","viewlog_refreshhotkey");
	presetValues2("viewlog_refreshhotkey2","viewlog_refreshhotkey2");
	presetValues2("viewlog_clearhotkey","viewlog_clearhotkey");
	presetValues2("viewlog_clearhotkey2","viewlog_clearhotkey2");
}

function setdefault(){
  	presetValues(true);
  	set_notsaved();
}

function saveOptions() {	
	//_setvalue('change_enable', document.getElementById("change_enable").checked);
	
	var c=[];
	for (var i = 0; i < type_default.length; ++i) {    
		var b=document.getElementById('change_type_'+type_default[i]);				
		if (b) {
			if (b.checked) c[c.length]=type_default[i];
		}
	}
	_setvalue('change_type', JSON.stringify(c));
	
	var b=JSON.parse(JSON.stringify(ua_data));
	for (var i = 0; i < b.length; i++){  
		delete b[i].idx;
	}
	_setvalue('ua_data', JSON.stringify(b));

	//_setvalue('log_enable', document.getElementById("log_enable").checked);			
	_setvalue('req_pattern_enable2', document.getElementById("req_pattern_enable2").checked);
	
	var b=JSON.parse(JSON.stringify(req_pattern));
	for (var i = 0; i < b.length; i++){  
		delete b[i].idx;
	}
	_setvalue('req_pattern', JSON.stringify(b));
	
	_setvalue('viewlog_refreshhotkey', document.getElementById("viewlog_refreshhotkey").value);
	_setvalue('viewlog_refreshhotkey2', document.getElementById("viewlog_refreshhotkey2").value);
	_setvalue('viewlog_clearhotkey', document.getElementById("viewlog_clearhotkey").value);
	_setvalue('viewlog_clearhotkey2', document.getElementById("viewlog_clearhotkey2").value);
	
	_bgaction(1);
	/*bgmodule.g_config.load();
	bgmodule.proc_updatecurrent(null);*/
	
	set_saved();
	show_message("<label2><font style='font-size:13px'>"+chrome.i18n.getMessage('conf_saved')+"</font></label2>");
}

function closeoption(){
	_bgaction(5);
	/*chrome.windows.getLastFocused( function(win) {
		var windowId=win.id;							
		chrome.tabs.getSelected(windowId, function(tab) { 					
			chrome.tabs.remove(tab.id);
		});    	
	});*/
}

function other_onkeydown(e){ 
	var code=e.keyCode;
	var press_ctrl=typeof e.modifiers=='undefined'?e.ctrlKey:e.modifiers&Event.CONTROL_MASK;
	var press_alt=typeof e.modifiers=='undefined'?e.altKey:e.modifiers&Event.ALT_MASK;
	var press_shift=typeof e.modifiers=='undefined'?e.shiftKey:e.modifiers&Event.SHIFT_MASK;			
	var flag=false;
	if(!press_ctrl && press_alt && !press_shift){
		flag=true;
		if (code==112) {
			saveOptions();
		/*} else if (code==113) {
			setdefault();*/
		}else if(code==38){
			_getid('fix1_15').onclick();
		}else if(code==40){
			_getid('fix1_16').onclick();
		}else{
			flag=false;
		}
	}else if(!press_ctrl && press_alt && press_shift){
		flag=true;
		if(code==38){
			_getid('fix1_19').onclick();
		}else if(code==40){
			_getid('fix1_20').onclick();
		}else{
			flag=false;
		}
	}
	if(flag){
    	if (e.preventDefault) {e.preventDefault(); e.stopPropagation();}
		else {e.returnValue = false; e.cancelBubble = true;}		
	}
}

function init(){
	document.addEventListener('keydown', other_onkeydown); 	
	windowonscroll();
}

var gcount=0;
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
var ua_data=[];	
var ua_data_current_idx=-1;
var c_sel_color='#F2FFF2';

function ua_data_make(callback){
	try{
		if (gisdefault){
			if (ua_data.length>0) return;
		}
		_getvalue('ua_data',function(s){
			ua_data=[];		
			ua_data=JSON.parse(s);  
			if(callback) callback();
		});
	}catch(err){}
	
	var a=document.getElementById("btn_ua_data_edit");		
	a.disabled=true;	
}

function ua_set_event(idx){
		var a=_getid('fix1_17_'+idx);
		if (a) {
			a.data=idx;
			a.onclick=function(){
				var idx=this.data;
				for (var i = 0; i < ua_data.length; i++){    	
					if(ua_data[i].idx==idx){
						ua_data_current_idx=idx;	
						
						for(var j=0; j < ua_data.length; j++) {
							var c=document.getElementById("tr_ua_data_"+ua_data[j].idx);		
							if (c) c.bgColor="";
						}	
						var c=document.getElementById("tr_ua_data_"+idx);		
						if (c) c.bgColor=c_sel_color;
						var a=document.getElementById("ua_ab");		
						a.value=ua_data[i].ab;
						//a.focus();
						var a=document.getElementById("ua_name");		
						a.value=ua_data[i].name;
						var a=document.getElementById("ua_uastring");		
						a.value=ua_data[i].uastring;	
						var a=document.getElementById("btn_ua_data_edit");		
						a.disabled=false;
						break;
					}
				}
			};
		}
		var a=_getid('fix1_18_'+idx);
		if (a) {
			a.data=idx;
			a.onclick=function(){
				var idx=this.data;
				for (var i = 0; i < ua_data.length; i++){    	
					if(ua_data[i].idx==idx){
						var a=_getid('tr_ua_data_'+idx);
						if(a) a.parentNode.removeChild(a);		
						ua_data.splice(i,1);
						set_notsaved();
						break;
					}
				}
				return false;
			};
		}
		var a=_getid('fix1_19_'+idx);
		if(a){
			a.data=idx;
			a.onclick=function(){
				var idx=this.data;
				for (var i = 0; i < ua_data.length; i++){    	
					if(ua_data[i].idx==idx){
						ua_data[i].hide=this.checked;
						set_notsaved();	
						break;
					}
				}				
			};
		}
}
function ua_get_text(data){
	var idx=data.idx;
	s='<td>'+data.ab+'</td><td>'+data.name+'</td><td>'+data.uastring+'</td>';
	
	var s1='';
	if (data.hide) s1='checked';
	s+='<td><label><input type=checkbox id="fix1_19_'+idx+'" title="'+_i18n('msg_hidefromlist')+'" '+s1+'></label></td>';						
	
	var s1='';
	if(ua_data_current_idx==idx) s1='checked';
	s+='<td><label><input type=radio id="fix1_17_'+idx+'" name=uasel title="'+_i18n('msg_select')+'" '+s1+'></label></td>';

	s+='<td><a id="fix1_18_'+idx+'" href="#" class=alinktext title="'+_i18n('msg_delete')+'"><img src="images/close.png"></a></td></tr>';
	return s;
}

function ua_data_load(){
	ua_data_current_idx=-1;	
	for (var i = 0; i < ua_data.length; i++) {    	
		gcount++;
		ua_data[i].idx=gcount;
	}

	var s='<table id="ua_table" width=100% border="1" cellpadding="3" cellspacing="2" bordercolor="silver" style="border-collapse:collapse"><tr><td><b>Flag</b><td><b>'+_i18n('msg_name')+'</b><td><b>'+_i18n('msg_agentstring')+'</b>';
	s+='<td><input type=checkbox id="fix1_19_all" title="Select,Deselect all">';
	s+='<td colspan=2 align=center><a id="fix1_15" href="#" class=alinktext title="'+_i18n('msg_moveup')+' (Alt+Up)"><img src="images/up.png"></a>&nbsp;&nbsp;<a id="fix1_16" href="#" class=alinktext title="'+_i18n('msg_movedown')+' (Alt+Down)"><img src="images/down.png"></a>';
	
	if (ua_data.length==0) s=s+'<tr><td colspan=100>No data</td></tr>';
	var s1;
	for (var i = 0; i < ua_data.length; i++) {    	
		s+='<tr id="tr_ua_data_'+ua_data[i].idx+'">';
		s+=ua_get_text(ua_data[i]);
		s+='</tr>';		
	}
	s=s+'</table>';

	var a=_getid("ua_data");				
	a.innerHTML=s;	
	for (var i = 0; i < ua_data.length; i++) {    	
		ua_set_event(ua_data[i].idx);
	}		

	_getid("fix1_19_all").onclick=function(){
		for (var i = 0; i < ua_data.length; i++) {    	
			ua_data[i].hide=this.checked;
			var a=_getid('fix1_19_'+ua_data[i].idx);
			if(a){
				a.checked=this.checked;
			}
		}
		set_notsaved();			
	}
	_getid('fix1_15').onclick=function(){ua_data_move(0); return false;}
	_getid('fix1_16').onclick=function(){ua_data_move(1); return false;}
}

function ua_data_edit_ok(){
	var idx=ua_data_current_idx;
	for (var i = 0; i < ua_data.length; i++){  
		if(ua_data[i].idx==idx){
			if (!ua_data_check()) return;	
			var a=document.getElementById("ua_ab");		
			ua_data[i].ab=a.value;
			var a=document.getElementById("ua_name");		
			ua_data[i].name=a.value;
			var a=document.getElementById("ua_uastring");		
			ua_data[i].uastring=a.value;	

			var a=_getid('tr_ua_data_'+idx);
			if(a){
				a.innerHTML=ua_get_text(ua_data[i]);
				ua_set_event(ua_data[i].idx);
			}
			set_notsaved();	
			break;
		}
	}		
}
function ua_data_add_ok(){
	if (!ua_data_check()) return;
	
	var b={};	
	var a=document.getElementById("ua_ab");		
	b.ab=a.value;
	var a=document.getElementById("ua_name");		
	b.name=a.value;	
	var a=document.getElementById("ua_uastring");		
	b.uastring=a.value;		
	gcount++;
	b.idx=gcount;
	
	ua_data.push(b);
	ua_data_current_idx=b.idx;
	
	var a=document.getElementById("btn_ua_data_edit");		
	a.disabled=false;

	for(var j=0; j < ua_data.length; j++) {
		var c=document.getElementById("tr_ua_data_"+ua_data[j].idx);		
		if (c) c.bgColor="";
	}	
	var obj=_getid("ua_table");	
	var tr=document.createElement("tr");
	tr.id='tr_ua_data_'+b.idx;
	tr.bgColor=c_sel_color;
	tr.innerHTML=ua_get_text(b);
	obj.appendChild(tr);		
	ua_set_event(b.idx);

	set_notsaved();	
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; 
};

function ua_data_move(direct){
	var idx=ua_data_current_idx;
	for (var i = 0; i < ua_data.length; i++){  
		if(ua_data[i].idx==idx){
			var dest;
			if (direct==1){
				var j=i+1;
				if (j>ua_data.length-1) return;
				dest=_getid('tr_ua_data_'+ua_data[j].idx);
				ua_data.move(i,j);
			} else {
				var j=i-1;
				if (j<0) return;
				dest=_getid('tr_ua_data_'+ua_data[j].idx);
				ua_data.move(i,j);
			}	
			var src=_getid('tr_ua_data_'+idx);
			if(src && dest){
				var newsrc=src.cloneNode(true);
				if (direct==1){
					dest.parentNode.insertBefore(newsrc,dest.nextSibling);
				}else{
					dest.parentNode.insertBefore(newsrc,dest);
				}
				src.parentNode.removeChild(src);			
				ua_set_event(idx);
			}			
			set_notsaved();		
			return;
		}
	}
	alert(_i18n('msg_selectone'));
}

function ua_data_reload(){	
	ua_data_load();
	var a=document.getElementById("btn_ua_data_edit");		
	a.disabled=true;	
	set_notsaved();	
}
function ua_data_clearall(){
	var answer=confirm(_i18n('msg_areyousure'));				
	if (!answer) return;
	ua_data=[];
	ua_data_reload();
}
function ua_data_loaddefault(){
	ua_data=[];
	gisdefault=true;
	ua_data_make(function(){
		ua_data_reload();
		alert(_i18n('msg_loadeddefault'));
	});
}
function ua_data_check(){
	var a=document.getElementById("ua_ab");		
	var ua_ab=a.value;
	if (!ua_ab) {
		alert('You have to input flag(abbreviation).');
		a.focus();
		return;
	}

	var a=document.getElementById("ua_name");		
	var ua_name=a.value;
	if (!ua_name) {
		alert('You have to input name.');
		a.focus();
		return;
	}
	
	var a=document.getElementById("ua_uastring");		
	var ua_uastring=a.value;		
	if (!ua_uastring) {
		alert('You have to input User Agent string.');
		a.focus();
		return;
	}
	return true;	
}



var req_pattern=[];	
var req_pattern_current_idx=-1;
var type_default=["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"];
var type_default_text=["Main frame", "Sub frame", "Stylesheet", "Script", "Image", "Object", "xmlhttprequest", "Other"];

function req_pattern_make(callback){
	try{
		if (gisdefault){
			if (req_pattern.length>0) return;
		}
		_getvalue('req_pattern',function(s){
			req_pattern=[];		
			req_pattern=JSON.parse(s);     	
			if(callback) callback();
		});
	}catch(err){}
	
	var a=document.getElementById("btn_req_pattern_edit");		
	a.disabled=true;	
}

function req_set_event(idx){
		var a=_getid('fix1_21_'+idx);
		if (a){
			a.data=idx;
			a.onclick=function(){
				var idx=this.data;
				for (var i = 0; i < req_pattern.length; i++){    	
					if(req_pattern[i].idx==idx){
						req_pattern_current_idx=idx;	
	
						for(var j = 0; j < req_pattern.length; j++) {
							var c=document.getElementById("tr_patten_"+req_pattern[j].idx);		
							if (c) c.bgColor="";
						}	
						var c=document.getElementById("tr_patten_"+idx);		
						if (c) c.bgColor=c_sel_color;
						var a=document.getElementById("req_pattern_pattern");		
						a.value=req_pattern[i].pattern;
						//a.focus();
	
						for (var j = 0; j < type_default.length; ++j) {    
							var b=document.getElementById('req_pattern_type_'+type_default[j]);				
							if (b) b.checked=false;
						}
	
						for (var j = 0; j < req_pattern[i].type.length; ++j) {    
							var b=document.getElementById('req_pattern_type_'+req_pattern[i].type[j]);				
							if (b) b.checked=true;
						}
	
						var a=document.getElementById("req_pattern_uastring");		
						if (req_pattern[i].data && (req_pattern[i].data.length>0))
							a.value=req_pattern[i].data[0].value;
	
						var a=document.getElementById("btn_req_pattern_edit");		
						a.disabled=false;				
						break;
					}
				}
			};
		}
		var a=_getid('fix1_22_'+idx);
		if (a) {
			a.data=idx;
			a.onclick=function(){
				var idx=this.data;
				for (var i = 0; i < req_pattern.length; i++){    	
					if(req_pattern[i].idx==idx){
						var a=_getid('tr_patten_'+idx);
						if(a) a.parentNode.removeChild(a);		
						req_pattern.splice(i,1);
						set_notsaved();
						break;
					}
				}
				return false;
			};
		}
		var a=_getid('fix1_23_'+idx);
		if (a) {
			a.data=idx;
			a.onclick=function(){
				var idx=this.data;
				for (var i = 0; i < req_pattern.length; i++){    	
					if(req_pattern[i].idx==idx){
						req_pattern[i].active=this.checked;
						set_notsaved();	
						break;
					}
				}				
			};
		}
}
function req_get_text(a){
	var idx=a.idx;
		var s1='';
		for (var j = 0; j < a.type.length; ++j) {    	
			for (var k = 0; k < type_default.length; ++k) {    	
				if (a.type[j]==type_default[k]){
					if (s1!='') s1=s1+', ';
					s1=s1+type_default_text[k];
					break;
				}
			}
		}
		
		var s2='';
		if (a.data && (a.data.length>0))		
			s2=a.data[0].value;
		if (!s2) s2=_i18n('msg_defaultchrome');
		
		var s3='<label><input type=checkbox id="fix1_23_'+idx+'"></label>';
		if (a.active) s3='<label><input type=checkbox checked id="fix1_23_'+idx+'"></label>';

		var s='<td>'+(i+1)+'<td>'+s3+'<td width=800><table width=100% border="1" cellpadding="1" cellspacing="1" bordercolor="silver" style="border-collapse:collapse"><tr><td>'+a.pattern+'<td>'+s1+'<tr><td colspan=100>'+s2+'</table></td>';

		s1='';
		if(req_pattern_current_idx==idx) s1='checked';
		s+='<td><label><input type=radio id="fix1_21_'+idx+'" name=patternsel title="'+_i18n('msg_select')+'" '+s1+'></label></td>';

		s+='<td><a id="fix1_22_'+idx+'" href="#" class=alinktext title="'+_i18n('msg_delete')+'"><img src="images/close.png"></a></td>';
	return s;
}

function req_pattern_load(){
	req_pattern_current_idx=-1;	
	for (var i = 0; i < req_pattern.length; i++) {    	
		gcount++;
		req_pattern[i].idx=gcount;
	}

	var s='<table id="req_table" width=100% border="1" cellpadding="3" cellspacing="2" bordercolor="silver" style="border-collapse:collapse">';
	s+='<td><td width=30>'+_i18n('msg_active')+'<td>'+_i18n('msg_pattern')+'<td colspan=2 align=center><a id="fix1_19" href="#" class=alinktext title="'+_i18n('msg_moveup')+' (Alt+Shift+Up)"><img src="images/up.png"></a>&nbsp;&nbsp;<a id="fix1_20" href="#" class=alinktext title="'+_i18n('msg_movedown')+' (Alt+Shift+Down)"><img src="images/down.png"></a>';
	
	if (req_pattern.length==0) s=s+'<tr><td colspan=100>No data</td></tr>';	
	for (var i = 0; i < req_pattern.length; ++i) {    	
		s+='<tr id="tr_patten_'+req_pattern[i].idx+'">';
		s+=req_get_text(req_pattern[i]);
		s+='</tr>';		
	}
	s=s+'</table>';

	var a=_getid("req_pattern");				
	a.innerHTML=s;
	for (var i = 0; i < req_pattern.length; ++i) {    	
		req_set_event(req_pattern[i].idx);
	}		
	
	_getid('fix1_19').onclick=function(){req_pattern_move(0); return false;}
	_getid('fix1_20').onclick=function(){req_pattern_move(1); return false;}
}	

function req_pattern_edit_ok(){
	var idx=req_pattern_current_idx;
	for (var i = 0; i < req_pattern.length; i++){  
		if(req_pattern[i].idx==idx){
			if (!req_pattern_check()) return;	
			var a=document.getElementById("req_pattern_pattern");		
			req_pattern[i].pattern=a.value;
	
			var c=[];
			for (var j = 0; j < type_default.length; ++j) {    
				var b=document.getElementById('req_pattern_type_'+type_default[j]);				
				if (b) {
					if (b.checked) c[c.length]=type_default[j];
				}
			}
			req_pattern[i].type=c;
	
			var a=document.getElementById("req_pattern_uastring");		
			if (req_pattern[i].data && req_pattern[i].data.length>0)
				req_pattern[i].data[0].value=a.value;	
		
			var a=_getid('tr_patten_'+idx);
			if(a){
				a.innerHTML=req_get_text(req_pattern[i]);
				req_set_event(req_pattern[i].idx);
			}
			set_notsaved();	
			break;
		}
	}
}
function req_pattern_add_ok(){
	if (!req_pattern_check()) return;
	
	var b={};
	
	var a=document.getElementById("req_pattern_pattern");		
	b.pattern=a.value;

	var c=[];
	for (var i = 0; i < type_default.length; ++i) {    
		var bb=document.getElementById('req_pattern_type_'+type_default[i]);				
		if (bb) {
			if (bb.checked) c[c.length]=type_default[i];
		}
	}
	b.type=c;
	
	var a=document.getElementById("req_pattern_uastring");		
	b.data=[];
	var d={};
	d.name='User-Agent';	
	d.value=a.value;
	b.data[0]=d;
	b.active=true;
	gcount++;
	b.idx=gcount;
	
	req_pattern.push(b);
	req_pattern_current_idx=b.idx;
	
	var a=document.getElementById("btn_req_pattern_edit");		
	a.disabled=false;	

	for(var j = 0; j < req_pattern.length; j++) {
		var c=document.getElementById("tr_patten_"+req_pattern[j].idx);		
		if (c) c.bgColor="";
	}	
	var obj=_getid("req_table");	
	var tr=document.createElement("tr");
	tr.id='tr_patten_'+b.idx;
	tr.bgColor=c_sel_color;
	tr.innerHTML=req_get_text(b);
	obj.appendChild(tr);		
	req_set_event(b.idx);

	set_notsaved();	
}
function req_pattern_move(direct){
	var idx=req_pattern_current_idx;
	for (var i = 0; i < req_pattern.length; i++){  
		if(req_pattern[i].idx==idx){
			var dest;
			if (direct==1){
				var j=i+1;
				if (j>req_pattern.length-1) return;
				dest=_getid('tr_patten_'+req_pattern[j].idx);
				req_pattern.move(i,j);
			} else {
				var j=i-1;
				if (j<0) return;
				dest=_getid('tr_patten_'+req_pattern[j].idx);
				req_pattern.move(i,j);
			}	
			var src=_getid('tr_patten_'+idx);
			if(src && dest){
				var newsrc=src.cloneNode(true);
				if (direct==1){
					dest.parentNode.insertBefore(newsrc,dest.nextSibling);
				}else{
					dest.parentNode.insertBefore(newsrc,dest);
				}
				src.parentNode.removeChild(src);			
				req_set_event(idx);
			}			
			set_notsaved();		
			return;
		}
	}
	alert(_i18n('msg_selectone'));
}

function req_pattern_reload(){
	req_pattern_load();
	var a=document.getElementById("btn_req_pattern_edit");		
	a.disabled=true;
	set_notsaved();	
}
function req_pattern_clearall(){
	var answer=confirm(_i18n('msg_areyousure'));				
	if (!answer) return;
	req_pattern=[];
	req_pattern_reload();
}

function req_pattern_check(){
	var a=document.getElementById("req_pattern_pattern");		
	var req_pattern_pattern=a.value;
	if (!req_pattern_pattern) {
		alert('You have to input pattern.');
		a.focus();
		return;
	}
	/*var a=document.getElementById("req_pattern_uastring");		
	var req_pattern_uastring=a.value;
	if (!req_pattern_uastring) {
		alert('You have to User Agent string.');
		a.focus();
		return;
	}*/	
	return true;	
}



function ua_data_show_trans(){
	var a=document.getElementById("div_ua_data_trans");		
	if (a.style.display=='') a.style.display='none';
	else a.style.display='';
}

function ua_data_export(){
	var b=JSON.parse(JSON.stringify(ua_data));
	for (var i = 0; i < b.length; i++){  
		delete b[i].idx;
	}
	var s=JSON.stringify(b);	
	var a=document.getElementById("txt_ua_data_trans");		
	a.value=s;
}

function ua_data_import(){
	var a=document.getElementById("txt_ua_data_trans");		
	try{
		var b=JSON.parse(a.value);     			
	}catch(err){
		alert(_i18n('msg_occurerror'));
		return;
	}
	ua_data=b;
	
	ua_data_reload();	
	alert('Imported!!');
}

function req_pattern_show_trans(){
	var a=document.getElementById("div_req_pattern_trans");		
	if (a.style.display=='') a.style.display='none';
	else a.style.display='';
}

function req_pattern_export(){
	var b=JSON.parse(JSON.stringify(req_pattern));
	for (var i = 0; i < b.length; i++){  
		delete b[i].idx;
	}
	var s=JSON.stringify(b);	
	var a=document.getElementById("txt_req_pattern_trans");		
	a.value=s;
}
function req_pattern_import(){
	var a=document.getElementById("txt_req_pattern_trans");		
	try{
		var b=JSON.parse(a.value);     			
	}catch(err){
		alert(_i18n('msg_occurerror'));
		return;
	}
	req_pattern=b;
	
	req_pattern_reload();	
	
	alert('Imported!!');
}

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
function proc_onload(){
	proc_setlang();
	
	var a=document.getElementsByTagName('FORM');
	for(var i = 0; i < a.length; i++){    
		a[i].onsubmit=function(){return false;};
	}	
	
	_getid("viewlog_refreshhotkey").innerHTML=proc_hotkey1_out();
	_getid("viewlog_refreshhotkey2").innerHTML=proc_hotkey2_out();
	_getid("viewlog_clearhotkey").innerHTML=proc_hotkey1_out();
	_getid("viewlog_clearhotkey2").innerHTML=proc_hotkey2_out();
	
	_getid("fix1_1").href='https://chrome.google.com/webstore/detail/ljfpjnehmoiabkefmnjegmpdddgcdnpo?hl='+window.navigator.language;
	_getid("fix1_2").href='https://chrome.google.com/webstore/detail/ljfpjnehmoiabkefmnjegmpdddgcdnpo?hl='+window.navigator.language;
	
	//_getid("first_form").onsubmit=function(){return false;}
	_getid("btn_ua_data_edit").onclick=ua_data_edit_ok;
	_getid("fix1_3").onclick=ua_data_add_ok;
	_getid("fix1_4").onclick=ua_data_loaddefault;
	_getid("fix1_5").onclick=ua_data_clearall;
	_getid("fix1_6").onclick=ua_data_show_trans;
	_getid("fix1_7").onclick=ua_data_export;
	_getid("fix1_8").onclick=ua_data_import;
	//_getid("fix1_9").onsubmit=function(){return false;}
	_getid("btn_req_pattern_edit").onclick=req_pattern_edit_ok;
	_getid("fix1_10").onclick=req_pattern_add_ok;
	_getid("fix1_11").onclick=req_pattern_clearall;
	_getid("fix1_12").onclick=req_pattern_export;
	_getid("fix1_13").onclick=req_pattern_import;
	//_getid("fix1_14").onsubmit=function(){return false;}
	//_getid("btn_afterinit").onclick=proc_afterinit;
	_getid("btn_saveOptions1").onclick=saveOptions;
	_getid("btn_closeoption1").onclick=closeoption;
	_getid("btn_setdefault1").onclick=setdefault;
	
	_getid("btn_settings").onclick=function(){
		var a=document.getElementById("div_settings_trans");		
		if (a.style.display=='') a.style.display='none';
		else a.style.display='';		
	};
	
	_getid("btn_export").onclick=function(){
		var s,a;
		_bgaction(4, function(s){
			_getid("text_settings_trans").value=s;
		});
		/*var list=[];
		for (var i = 0; i < localStorage.length; i++){
			a=localStorage.key(i);
			s=localStorage[a];
			var g = {name: a, data: s};
			list[list.length]=g;			
		}
		_getid("text_settings_trans").value=JSON.stringify(list);*/
	};

	_getid("btn_import").onclick=function(){
		var s=trim(_getid("text_settings_trans").value);
		if(!s){
			alert("No data entered.");
			return;
		}		
		var answer = confirm("The current settings will be overwritten.\n\n"+_i18n("msg_areyousure"));		
		if(!answer) return;		
		var c=0;		
		var g;
		try{
			var list=JSON.parse(s);				
			for (var i = 0; i < list.length; i++){
				g=list[i];
				_setvalue(g.name, g.data);
				//localStorage[g.name]=g.data;
			}		
			c=list.length;
		}catch(err){}
		
		if(c>0){
			_bgaction(2, function(){
				setTimeout(function(){
					alert("Import success. This page will be reloaded.");
					location.reload();
				},10);
			});
			/*try{
				bgmodule.setStorageDefaults();
			}catch(err){}	
			try{
				bgmodule.g_config.load();
			}catch(err){}	
			bgmodule.g_current_tabid=null;
			bgmodule.proc_init();			
			alert("Import success. This page will be reloaded.");
			location.reload();*/
		}else{
			alert("Import failed. Check the input data.");
		}
	};
		
	_getid("btn_saveOptions2").onclick=saveOptions;
	_getid("btn_closeoption2").onclick=closeoption;
	_getid("btn_setdefault2").onclick=setdefault;
	
	ua_data_make(function(){
		req_pattern_make(function(){
			presetValues(false); init();	
		}); 
	}); 
}

function windowonscroll(){	
	var obj=document.getElementById("float_saveoptions");
	obj.style.position="fixed";
	
	var a=document.getElementById("main_table");
	var b=document.getElementById("first_form");
	
	var c=0;
	while (b && !isNaN(b.offsetTop)) {
        c += b.offsetTop;
        b = b.offsetParent;
	}
	
	var d=getOffset(a);
	var x=d.left+a.offsetWidth-document.body.scrollLeft;
	var y=document.body.scrollTop+10;
	if (y < c) y=c-document.body.scrollTop;
	else y=10;
		
	obj.style.left=x+"px";
	obj.style.top=y+"px";			
	obj.style.display="";	
}
window.onscroll=windowonscroll;

function windowonresize(){	
	var obj=document.getElementById("layer_message");
	if (obj) obj.style.display="none";
	var obj=document.getElementById("layer_message2");
	if (obj) obj.style.display="none";
	var obj=document.getElementById("layer_message3");
	if (obj) obj.style.display="none";	
	windowonscroll();
}
window.onresize=windowonresize;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.action == "config_changed") {  		
		var a=document.getElementById("req_pattern_enable2");				
		if (a){
			//a.checked=bgmodule.g_config.req_pattern_enable2;
			_bgaction(3, function(s){
				a.checked=s;
			});
		}
	}
});

proc_onload();
//window.onload=proc_onload;
