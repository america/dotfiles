!function a(i,c,s){function r(t,e){if(!c[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(o)return o(t,!0);throw(e=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",e}n=c[t]={exports:{}},i[t][0].call(n.exports,function(e){return r(i[t][1][e]||e)},n,n.exports,a,i,c,s)}return c[t].exports}for(var o="function"==typeof require&&require,e=0;e<s.length;e++)r(s[e]);return r}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e};function i(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var l=SymBfw.constants.uiConstants.NOTIFICATION,c=SymBfw.utils.isntNil,d=SymBfw.extensionAdapter,s=function(e){var t=n;if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);function n(e){var t;if(this instanceof n)return(t=function(e,t){if(e)return!t||"object"!=typeof t&&"function"!=typeof t?e:t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e))).state={notifications:e.notifications,isExpanded:!1},e.direction&&t.setDirection(e.direction),t.onLearnMoreClick=t.onLearnMoreClick.bind(t),t;throw new TypeError("Cannot call a class as a function")}return t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e),a(n,[{key:"setDirection",value:function(e){var t=document.getElementsByTagName("body");c(t)&&c(t[0])&&t[0].setAttribute("dir",e)}},{key:"sendMessage",value:function(e,t){d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:t,notificationID:e}})}},{key:"onCloseClicked",value:function(e,t,n){SymBfw.utils.isTrustedEvent(n)&&this.sendMessage(e,l.MESSAGES.NOTIFICATION_CLOSED)}},{key:"onDefaultButtonClicked",value:function(e,t,n){SymBfw.utils.isTrustedEvent(n)&&this.sendMessage(e,l.MESSAGES.DEFAULT_BUTTON_PRESSED)}},{key:"onSecondaryLinkClicked",value:function(e,t,n){SymBfw.utils.isTrustedEvent(n)&&this.sendMessage(e,l.MESSAGES.SECONDARY_LINK_PRESSED)}},{key:"onLearnMoreClick",value:function(t,e,n){var a=this;SymBfw.utils.isTrustedEvent(n)&&this.setState({isExpanded:!this.state.isExpanded},function(){var e;a.state.isExpanded?(e=a.refs.messageBody.offsetHeight,d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.RESIZE_IFRAME_HEIGHT,iframeHeight:e,notificationID:t}})):d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.FIXED_IFRAME_HEIGHT,iframeHeight:l.WARNING_HEIGHT}})})}},{key:"onThirdButtonClicked",value:function(e,t,n){SymBfw.utils.isTrustedEvent(n)&&this.sendMessage(e,l.MESSAGES.THIRD_BUTTON_PRESSED)}},{key:"closeNotification",value:function(e){var t=this.state.notifications;t.splice(e,1),this.setState({notifications:t})}},{key:"getIconStyle",value:function(e){var t={};return t.backgroundImage="url(../../"+e+")",t}},{key:"getNotifications",value:function(){for(var s=this,r=[],e=l.STACK_COUNT,o=[],t=0;(t<e||0===r.length)&&t<this.state.notifications.length;t++)!function(t){var e=s.state.notifications[t];if(!1===e.isAllowed)return;var n=e.notificationID,a=(o.push(n),"notify");switch(e.type){case l.TYPE.QUESTION:a+=" actionable";break;case l.TYPE.WARNING_QUESTION:a+=" actionable-warning",d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.FIXED_IFRAME_HEIGHT,iframeHeight:l.WARNING_HEIGHT}})}var i=null,c=(s.state.isExpanded&&(i=React.createElement("div",{className:"learn-more-content"},e.learnMoreDescriptionFirstParagraph,React.createElement("div",{className:"learn-more-second-paragraph"},e.learnMoreDescriptionSecondParagraph,e.secondaryLink?React.createElement("span",{className:"learn-more-redirect-link",onClick:s.onSecondaryLinkClicked.bind(s,n,t)},e.secondaryLink):null))),React.createElement("div",{key:n},React.createElement("div",{className:a},React.createElement("div",{className:"icon-close",onClick:s.onCloseClicked.bind(s,n,t)}),React.createElement("div",{className:"notification-message-content"},React.createElement("div",{className:"icon good-image",style:s.getIconStyle(e.imageUrl)}),React.createElement("div",{className:"message-container"},e.title?React.createElement("div",{className:"title"},e.title):null,React.createElement("div",{className:"message"},e.description),React.createElement("div",{className:"extra-message"},React.createElement("div",{className:"line1"},e.line1),React.createElement("div",{className:"line2"},e.line2)))),React.createElement("div",{className:"actions"},e.secondaryLink?React.createElement("div",{className:"dont-ask",onClick:s.onSecondaryLinkClicked.bind(s,n,t)},e.secondaryLink):null,e.defaultButton?React.createElement("div",{className:"action-button",onClick:s.onDefaultButtonClicked.bind(s,n,t)},e.defaultButton):null,e.thirdButton?React.createElement("div",{className:"third-action-button",onClick:s.onThirdButtonClicked.bind(s,n,t)},e.thirdButton):null)),React.createElement("div",{className:"divider"}))),i=React.createElement("div",{key:n,className:"antialiased"},React.createElement("div",{className:"notification-header"},React.createElement("div",{className:"icon-close-white",onClick:s.onCloseClicked.bind(s,n,t)}),React.createElement("div",{className:"notification-header-title-icon"}),React.createElement("div",{className:"notification-header-title"},React.createElement("span",{className:"header-title-primary"},React.createElement("b",null,e.primaryHeaderTitle)),React.createElement("span",null,e.secondaryHeaderTitle))),React.createElement("div",{className:"notification-body"},React.createElement("div",{className:a},React.createElement("div",{className:"icon-danger good-image",style:s.getIconStyle(e.imageUrl)}),e.title?React.createElement("div",{className:"title-danger"},e.title):null),React.createElement("div",{className:"message-body-danger"},React.createElement("div",{className:"message-danger"},e.description),React.createElement("div",{className:"focused-title"},e.focusedTitle),React.createElement("div",{ref:"messageBody"},i),React.createElement("div",{id:"learn-more-link",className:"learn-more-link",onClick:s.onLearnMoreClick.bind(s,n,t)},s.state.isExpanded?e.expandableLinkTextAfterExpand:e.expandableLinkTextBeforeExpand),React.createElement("div",{className:"actions"},e.defaultButton?React.createElement("div",{className:"danger-action-button",onClick:function(e){return s.onDefaultButtonClicked(n,t,e)}},e.defaultButton):null)),React.createElement("div",{className:"divider"})));e.type===l.TYPE.WARNING_QUESTION?r.push(i):r.push(c)}(t);return d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.NOTIFICATIONS_SHOWN,notificationArray:o}}),r}},{key:"render",value:function(){var e=this.getNotifications();return 0===e.length?(d.sendMessage({id:l.MESSAGES.DEFAULT_MESSAGE,payload:{eventID:l.MESSAGES.HIDE_NOTIFICATIONS}}),null):React.createElement("div",{className:"notify-center"},e)}}]),n}(React.Component);n.default=s,d.sendMessage({id:l.MESSAGES.UI_INIT},function(e){ReactDOM.render(React.createElement(s,{notifications:e.notifications,direction:e.direction}),document.getElementById("container"))})},{}]},{},[1]);