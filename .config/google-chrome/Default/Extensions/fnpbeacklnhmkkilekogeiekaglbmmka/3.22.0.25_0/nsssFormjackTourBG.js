(()=>{const{uiConstants:i,telemetryWrapper:o,constants:n,uiConstants:{MESSAGES:l}}=NSSS,{utils:s,utils:{isNil:T},localizer:S,extensionAdapter:_,alarmHelper:e,constants:a}=SymBfw;NSSS.formjackTourBG=new class{constructor(){this.handleMessage=this.handleMessage.bind(this)}_iterateAndLocalize(a,t,s){return Object.keys(a).forEach(e=>{var r=""===t?e:t+"."+e;if("object"==typeof a[e]&&null!==a[e])return this._iterateAndLocalize(a[e],r,s);null!==a[e]&&(s[r]=S.getLocalizedString(a[e]))}),s}_getLocalizedFormjackTourUIStrings(e){return this._iterateAndLocalize(e,"",{})}_getFormjackTourUIStrings(e){var r=i.FORMJACK_TOUR_UI;return this._getLocalizedFormjackTourUIStrings(r[e])}_shouldShowReverseImage(e,r){return e===a.os.MAC?"rtl"===r:"ltr"===r}_launchTourURL(e){var r=_.getExtensionURL(i.FORMJACK_TOUR_UI.HTML);_.createTab(`${r}?${i.formjackTour.TOUR_TYPE_PARAM}=`+e)}async initialize(){await NSSS.init.ready();var e=NSSS.globalSettings.isFormjackTourDisplayed();e||T(e)&&(_.isManifestV3Extension()?NSSS.isFreshInstall?(NSSS.globalSettings.setFormjackTourDisplayed(!1),await this._registerTourDisplayScheduler()):this._setAndDisplayTourUi(i.formjackTour.TOUR_TYPE.EXISTING_USER):this._handleTourUiForMv2())}async _handleTourUiForMv2(){await NSSS.PrivacyPromptController.isFreshInstall()?this._setAndDisplayTourUi(i.formjackTour.TOUR_TYPE.NEW_USER):this._setAndDisplayTourUi(i.formjackTour.TOUR_TYPE.EXISTING_USER)}_setAndDisplayTourUi(e){T(e)||(NSSS.globalSettings.setFormjackTourDisplayed(!0),this._launchTourURL(e))}async _registerTourDisplayScheduler(){await e.setAlarm(n.ALARM_NAMES.FORMJACK_TOUR_SCHEDULER,{delayInMinutes:60})}async handleTourDisplayScheduler(e){e===n.ALARM_NAMES.FORMJACK_TOUR_SCHEDULER&&(_.getExtensionURL(i.FORMJACK_TOUR_UI.HTML),this._launchTourURL(i.formjackTour.TOUR_TYPE.NEW_USER))}_initFormjackTourUI(e){var e=new URL(e),e=new URLSearchParams(e.search).get(i.formjackTour.TOUR_TYPE_PARAM),r=S.getCurrentLanguageDirection(),a=s.getOSType(),t={};return t.direction=r,t.productName=n.PRODUCT_NAME,t.strings=this._getFormjackTourUIStrings(e),t.tourType=e,t.showReverseImage=this._shouldShowReverseImage(a,r),t}handleMessage(e,r,a){if(!(T(e)||T(e.name)||T(a)||T(a.url))){var t=e.name,s=e.tourType===i.formjackTour.TOUR_TYPE.NEW_USER;switch(t){case l.FORMJACK_TOUR_UI_INIT:r(this._initFormjackTourUI(a.url));break;case l.FORMJACK_TOUR_CLOSE_BUTTON_CLICKED:_.getTabsWithURL(a.url,e=>{T(e)||T(e[0])||_.closeTabAndEnsureBrowserIsAlive(_.getTabID(e[0]))}),o.sendFormjackTourUIClosed(s);break;case l.FORMJACK_TOUR_UI_SHOWN:NSSS.globalSettings.setFormjackTourDisplayed(!0),o.sendFormjackTourUIDisplayed(s);break;case l.FORMJACK_TOUR_LEARN_MORE_LINK_CLICKED:NSSS.formjackProtectionUtils.handleLearnMoreLinkClicked(n.FORMJACK_LEARNMORE_LAUNCH_POINT.FORMJACK_TOUR)}}}},NSSS.formjackTourBG.initialize(),_.addMessageListener(NSSS.formjackTourBG.handleMessage)})();