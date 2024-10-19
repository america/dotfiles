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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
function proc_localstorage_trasn(){ //v2->v3
	function go(callback){
		setTimeout(function(){window.close();},5000);
		if(!window.localStorage){
			callback();return;
		}	
		var b={};
		for (var a in localStorage){
			if(a) b[a]=localStorage[a];
		}
		chrome.extension.sendRequest({type:'bgaction', value:10, data:b}, function(r) {
			callback();
		});
	}
	go(function(){
		window.close();
	});
}

if(getparam(location.href,'transv2')=='ok'){
	proc_localstorage_trasn();
}else{
	chrome.extension.sendRequest({type:'get_bgstorage'}, function(r) {
		if(r && r.bgdata && r.bgdata.g_extensionid){
			location.href='https://iblogbox.com/chrome/useragent/option/v0.9.3.6.php?g_extensionid='+r.bgdata.g_extensionid;
		}
	});
}