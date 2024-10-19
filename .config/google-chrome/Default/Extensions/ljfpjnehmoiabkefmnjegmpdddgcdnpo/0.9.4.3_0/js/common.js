function ChromeVersion() {
  try {
  	var s=(navigator.userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1];
  	return s;
  } catch(e) {}
  return;
}

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

function get_domainfromurl(url){
    var f="";
    try {
      if (url && url.trim()) {               
        var b = url.trim();
        var h = b.indexOf("//");
        if (h == -1) {
          h = 0
        } else {
          h += 2
        }
        if (h < b.length){
          var c = b.indexOf("/", h);
          if (c == -1) {
            c = b.length
          }
          f = b.substring(h, c);
          if (!f || f.indexOf(".") == -1) 
            f="";
        }
      }
    } catch (g) {}            
  return f;
}  

function get_shorturl(url){
		try {
			if (url && url.trim()) {           		
				var b = url.trim();
				var h = b.indexOf("//");
				if (h == -1) {
					h = 0
				} else {
					h += 2
				}
				if (h < b.length){
					var c = b.indexOf("?", h);
					if (c == -1) {
						c = b.lastIndexOf("/");
						if ((c == -1) || (c <= h)) {
							c = b.length
						}
					}
					var f = b.substring(h, c);
					if (!f || f.indexOf(".") == -1) 
						f="";
				}
			}
		} catch (g) {}            
	return f;
}	

var other_newtablast=false;

function open_newtab(surl,last,nosel){
	var ulast=false;
	if (other_newtablast){
		ulast=true;
		last=true;
	}
	
	chrome.windows.getLastFocused(function(win) {				
		/*if (last || ulast || nosel || (win && win.incognito)){
		}else{
			window.open(surl);
			return;
		}*/	
	
		var sel=true;
		if (nosel) sel=false;
		var param={url:surl, selected:sel};	
	
		function openit(){
			chrome.tabs.create(param, function(tab){
				if (tab) chrome.windows.update(tab.windowId, {focused:true});
			});		
		}
	
		if (!win) openit();
		if (win.type=="popup") last=true;
		chrome.tabs.getSelected(win.id, function(tab) {			
			if (tab){
				if (last){
					//param.openerTabId=tab.id;
				}else{
					//param.openerTabId=tab.id;
					param.index=tab.index+1;
					//param.index=tab.index;
				}
			}
			openit();
		});		
	});		
}

function open_newtab_exist2(surl,last,id){
  /*search_opentab_reuse=toBool(localStorage["search_opentab_reuse"]);
  if (!search_opentab_reuse) {
    open_newtab(surl,last);
    return;	
  }*/
  if (other_newtablast) last=true;
  chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
  		var surl2=surl.toLowerCase();
  		var sdomain=get_shorturl(surl2);
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (!tab.url) continue;			
			var s=tab.url;
			s=s.toLowerCase();
			var sdomain2=get_shorturl(s);						
			if ( ((sdomain2=="") && (surl2!="") && (s.indexOf(surl2)==0)) || ((sdomain2!="") && (sdomain!="") && (sdomain2.indexOf(sdomain)==0)) ) {
				if (tab.id!=id) {
					chrome.tabs.update(tab.id, {url: surl, active:true});
					return;
				}
			}
		}		
		open_newtab(surl,last);
  });	
}

function open_newtab_exist(surl,last,dup){
	if (other_newtablast) last=true;
	if (dup) {
		chrome.tabs.getSelected(null, function(tab) {
			open_newtab_exist2(surl,last,tab.id);			
		});
	} else {
		open_newtab_exist2(surl,last,-1);
	}
}

function getextensionUrl(relurl){
  if(typeof(chrome) == "undefined"){
    return "."+relurl;
  } else {
    return chrome.runtime.getURL(relurl); 
  }
}

function open_newtab_extension(s){	
	s=getextensionUrl(s);
	open_newtab_exist(s,false,false);
}

function find_tab(surl,select,last){
  if (other_newtablast) last=true;
  chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT}, function(tabs) {
  		var surl2=surl.toLowerCase();
  		var sdomain=get_shorturl(surl2);
		for (var i = 0, tab; tab = tabs[i]; i++) {
			if (!tab.url) continue;			
			var s=tab.url;
			s=s.toLowerCase();
			var sdomain2=get_shorturl(s);
			if ( ((sdomain2=="") && (surl2==s)) || ((sdomain2!="") && (sdomain==sdomain2)) ) {
				chrome.tabs.update(tab.id, {active:select});
				return;
			}
		}		
		open_newtab(surl,last);
  });	
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

function get_chrome_major_version(){
	var s=navigator.userAgent;
	s=getValue(s,"Chrome/"," ");
	if (s==null) s="";
	s=s.split(".");	
	var v=0;	
	if (s.length > 0) {
		v=parseInt(s[0]);
	}
	if (isNaN(v)) v=0;		
	return v;
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

function open_currenttab(surl,select,response) {
	chrome.windows.getLastFocused( function(win) {
		var windowId=win.id;							
		chrome.tabs.getSelected(windowId, function(tab) { 				
			chrome.tabs.update(tab.id, {'url': surl, active:select});
			if (response!=null) response();
		});		
	});		
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

function proc_blockwheel(obj){
function block_onmousewheel(event){
	var delta = 0;
	if (!event) return;
	if (event.wheelDelta) {
		delta = event.wheelDelta/120;
		if (window.opera) delta = -delta;
	} else if (event.detail) delta = -event.detail/3;
	delta=parseInt(delta);
	if (!delta) return;
	
	var flag=false;
	var obj=this;
	if (!obj) return;
	
	if (delta>0){
		if (obj.scrollTop<=0) flag=true;
	} else {
		if (obj.scrollTop+obj.offsetHeight >= obj.scrollHeight) flag=true;
	}
	
	if (flag) {
		if (event.preventDefault) {event.preventDefault(); event.stopPropagation();}
		else {event.returnValue = false; event.cancelBubble = true;}
	}
}
	obj.onmousewheel=block_onmousewheel;
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
