!function n(i,c,s){function r(t,e){if(!c[t]){if(!i[t]){var a="function"==typeof require&&require;if(!e&&a)return a(t,!0);if(o)return o(t,!0);throw(e=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",e}a=c[t]={exports:{}},i[t][0].call(a.exports,function(e){return r(i[t][1][e]||e)},a,a.exports,n,i,c,s)}return c[t].exports}for(var o="function"==typeof require&&require,e=0;e<s.length;e++)r(s[e]);return r}({1:[function(e,t,a){Object.defineProperty(a,"__esModule",{value:!0});var n=function(e,t,a){return t&&i(e.prototype,t),a&&i(e,a),e};function i(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var l=SymBfw.constants.uiConstants.NOTIFICATION,c=SymBfw.utils.isntNil,d=SymBfw.extensionAdapter,s=(e=>{var t=a;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);function a(e){var t;if(this instanceof a)return(t=((e,t)=>{if(e)return!t||"object"!=typeof t&&"function"!=typeof t?e:t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")})(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,e))).state={notifications:e.notifications,isExpanded:!1},e.direction&&t.setDirection(e.direction),t.onLearnMoreClick=t.onLearnMoreClick.bind(t),t;throw new TypeError("Cannot call a class as a function")}return t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e),n(a,[{key:"setDirection",value:function(e){var t=document.getElementsByTagName("body");c(t)&&c(t[0])&&t[0].setAttribute("dir",e)}},{key:"sendMessage",value:function(e,t){d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:t,notificationID:e}})}},{key:"onCloseClicked",value:function(e,t,a){SymBfw.utils.isTrustedEvent(a)&&this.sendMessage(e,l.MESSAGES.NOTIFICATION_CLOSED)}},{key:"onDefaultButtonClicked",value:function(e,t,a){SymBfw.utils.isTrustedEvent(a)&&this.sendMessage(e,l.MESSAGES.DEFAULT_BUTTON_PRESSED)}},{key:"onSecondaryLinkClicked",value:function(e,t,a){SymBfw.utils.isTrustedEvent(a)&&this.sendMessage(e,l.MESSAGES.SECONDARY_LINK_PRESSED)}},{key:"onLearnMoreClick",value:function(t,e,a){var n=this;SymBfw.utils.isTrustedEvent(a)&&this.setState({isExpanded:!this.state.isExpanded},function(){var e;n.state.isExpanded?(e=n.refs.messageBody.offsetHeight,d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.RESIZE_IFRAME_HEIGHT,iframeHeight:e,notificationID:t}})):d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.FIXED_IFRAME_HEIGHT,iframeHeight:l.WARNING_HEIGHT}})})}},{key:"onThirdButtonClicked",value:function(e,t,a){SymBfw.utils.isTrustedEvent(a)&&this.sendMessage(e,l.MESSAGES.THIRD_BUTTON_PRESSED)}},{key:"closeNotification",value:function(e){var t=this.state.notifications;t.splice(e,1),this.setState({notifications:t})}},{key:"getIconStyle",value:function(e){var t={};return t.backgroundImage="url(../../"+e+")",t}},{key:"getNotifications",value:function(){for(var s=this,r=[],e=l.STACK_COUNT,o=[],t=0;(t<e||0===r.length)&&t<this.state.notifications.length;t++)(t=>{var e=s.state.notifications[t];if(!1===e.isAllowed)return;var a=e.notificationID,n=(o.push(a),"notify");switch(e.type){case l.TYPE.QUESTION:n+=" actionable";break;case l.TYPE.WARNING_QUESTION:n+=" actionable-warning",d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.FIXED_IFRAME_HEIGHT,iframeHeight:l.WARNING_HEIGHT}})}var i=null,c=(s.state.isExpanded&&(i=React.createElement("div",{className:"learn-more-content"},e.learnMoreDescriptionFirstParagraph,React.createElement("div",{className:"learn-more-second-paragraph"},e.learnMoreDescriptionSecondParagraph,e.secondaryLink?React.createElement("span",{className:"learn-more-redirect-link",onClick:s.onSecondaryLinkClicked.bind(s,a,t)},e.secondaryLink):null))),React.createElement("div",{key:a},React.createElement("div",{className:n},React.createElement("div",{className:"icon-close",onClick:s.onCloseClicked.bind(s,a,t)}),React.createElement("div",{className:"notification-message-content"},React.createElement("div",{className:"icon good-image",style:s.getIconStyle(e.imageUrl)}),React.createElement("div",{className:"message-container"},e.title?React.createElement("div",{className:"title"},e.title):null,React.createElement("div",{className:"message"},e.description),React.createElement("div",{className:"extra-message"},React.createElement("div",{className:"line1"},e.line1),React.createElement("div",{className:"line2"},e.line2)))),React.createElement("div",{className:"actions"},e.secondaryLink?React.createElement("div",{className:"dont-ask",onClick:s.onSecondaryLinkClicked.bind(s,a,t)},e.secondaryLink):null,e.defaultButton?React.createElement("div",{className:"action-button",onClick:s.onDefaultButtonClicked.bind(s,a,t)},e.defaultButton):null,e.thirdButton?React.createElement("div",{className:"third-action-button",onClick:s.onThirdButtonClicked.bind(s,a,t)},e.thirdButton):null)),React.createElement("div",{className:"divider"}))),i=React.createElement("div",{key:a,className:"antialiased"},React.createElement("div",{className:"notification-header"},React.createElement("div",{className:"icon-close-white",onClick:s.onCloseClicked.bind(s,a,t)}),React.createElement("div",{className:"notification-header-title-icon"}),React.createElement("div",{className:"notification-header-title"},React.createElement("span",{className:"header-title-primary"},React.createElement("b",null,e.primaryHeaderTitle)),React.createElement("span",null,e.secondaryHeaderTitle))),React.createElement("div",{className:"notification-body"},React.createElement("div",{className:n},React.createElement("div",{className:"icon-danger good-image",style:s.getIconStyle(e.imageUrl)}),e.title?React.createElement("div",{className:"title-danger"},e.title):null),React.createElement("div",{className:"message-body-danger"},React.createElement("div",{className:"message-danger"},e.description),React.createElement("div",{className:"focused-title"},e.focusedTitle),React.createElement("div",{ref:"messageBody"},i),React.createElement("div",{id:"learn-more-link",className:"learn-more-link",onClick:s.onLearnMoreClick.bind(s,a,t)},s.state.isExpanded?e.expandableLinkTextAfterExpand:e.expandableLinkTextBeforeExpand),React.createElement("div",{className:"actions"},e.defaultButton?React.createElement("div",{className:"danger-action-button",onClick:function(e){return s.onDefaultButtonClicked(a,t,e)}},e.defaultButton):null)),React.createElement("div",{className:"divider"})));e.type===l.TYPE.WARNING_QUESTION?r.push(i):r.push(c)})(t);return d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.NOTIFICATIONS_SHOWN,notificationArray:o}}),r}},{key:"render",value:function(){var e=this.getNotifications();return 0===e.length?(d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.HIDE_NOTIFICATIONS}}),null):React.createElement("div",{className:"notify-center"},e)}}]),a})(React.Component);a.default=s,d.sendMessage({id:l.MESSAGES.UI_INIT},function(e){ReactDOM.render(React.createElement(s,{notifications:e.notifications,direction:e.direction}),document.getElementById("container"))})},{}]},{},[1]);