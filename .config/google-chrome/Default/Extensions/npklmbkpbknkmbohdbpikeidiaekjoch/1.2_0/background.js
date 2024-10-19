var connections = {};

function connectServer(user, sender, sendResponse) {
    var socket;
    var uid = user.uid;

    if ( ! connections[uid] ) {
        socket = new WebSocket('ws://chrome.postmansmtp.com/?uid=' + uid );
        connections[uid] = socket.readyState;
    }
    
    socket.onopen = function () {
        console.log('Connection Opened ' + new Date());
    };

    socket.onclose = function () {
        console.log('Connection Closed ' + new Date());
    };
    
    socket.onerror = function (error) {
        console.log(error);
    };
    
    socket.onmessage = function (json) {
        console.log(json);
        try {
            var data = JSON.parse(json.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid message: ',json.data);
            return;
        }
        
        var title = `⚠️ ${data.siteUrl} ⚠️`;
        var options = {
            type: 'basic',
            iconUrl: 'postsmtp_icon.png',
            title: title,
            message: data.message
        };
    
        notifyMe(options);
    };

    sendResponse({status: true});
}

function notifyMe(options) {
    if (chrome.notifications.getPermissionLevel) {
        chrome.notifications.getPermissionLevel(function (permissionLevel) {
            if (permissionLevel === 'granted') {
                chrome.notifications.create('', options)
            }
        });
    }
}

chrome.runtime.onMessage.addListener(connectServer);