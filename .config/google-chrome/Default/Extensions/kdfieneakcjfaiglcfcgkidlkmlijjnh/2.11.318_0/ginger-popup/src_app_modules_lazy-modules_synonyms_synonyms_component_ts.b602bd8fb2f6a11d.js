"use strict";(self.webpackChunkginger_popup=self.webpackChunkginger_popup||[]).push([["src_app_modules_lazy-modules_synonyms_synonyms_component_ts"],{8386:(D,_,t)=>{t.r(_),t.d(_,{SynonymsComponent:()=>l,SynonymsModule:()=>a});var r=t(1670),e=t(3184),y=t(6362),p=t(410),d=t(8951),g=t(9337),u=t(116),m=t(8373),h=t(3607),C=t(2271),f=t(991),v=t(1604),E=t(9518);const M=["container"];function O(i,n){}function P(i,n){1&i&&(e.ynx(0),e.TgZ(1,"div",2),e._UZ(2,"g-icon",3),e.TgZ(3,"span",4),e._uU(4," Copied to clipboard "),e.qZA()(),e.BQk())}class l extends h.H{constructor(n,o,s,c,x){super(),this.doc=n,this.elementRef=o,this.heightCalculationService=s,this.synonymsPopupTabSynonymsService=c,this.clipboard=x,this.word="",this.isReadOnly=!1,this.synonymCopied=!1}ngOnInit(){var n=this;return(0,r.Z)(function*(){yield n.loadSynonymsComponent(),n.heightCalculationService.addElements([{selector:".speller-synonyms-popup-tab-synonyms__title",method:"scrollHeight",parent:n.elementRef.nativeElement},{selector:".speller-synonyms-popup-tab-synonyms__list",method:"scrollHeight",parent:n.elementRef.nativeElement},{selector:"ngx-speller-synonyms-popup-error",method:"scrollHeight",parent:n.elementRef.nativeElement},{selector:"ngx-speller-synonyms-popup-premium-promo",method:"scrollHeight",parent:n.elementRef.nativeElement},{selector:".speller-synonyms-popup-tab-synonyms__rephrase",method:"scrollHeight",parent:n.elementRef.nativeElement},{selector:"g-header",method:"scrollHeight",parent:n.doc}]),n.heightCalculationService.height$.pipe((0,d.R)(n.destroy$),(0,g.b)(o=>{o<m.Zz.default&&(o=m.Zz.default),(0,p.FM)(o)})).subscribe(),n.calculateHeight(),n.synonymsPopupTabSynonymsService.error$.pipe((0,d.R)(n.destroy$),(0,u.h)(o=>!!o),(0,g.b)(()=>{n.navigate&&n.navigate(m.r.definitions)})).subscribe()})()}ngOnDestroy(){super.ngOnDestroy(),this.heightCalculationService.destroy()}loadSynonymsComponent(){var n=this;return(0,r.Z)(function*(){var o,s;const c=(yield Promise.resolve().then(t.bind(t,991))).SynonymsPopupTabSynonymsComponent;null===(o=n.container)||void 0===o||o.clear(),n.synonymsComponent=null===(s=n.container)||void 0===s?void 0:s.createComponent(c),n.synonymsComponent.instance.word=n.word,n.synonymsComponent.instance.updateHeight=n.calculateHeight.bind(n),n.synonymsComponent.instance.replace=n.replaceSynonym.bind(n),n.synonymsComponent.instance.rephrase=n.rephrase.bind(n),n.synonymsComponent.instance.isFullRephraseGingerAvaliable=!!n.isMultiWord,n.synonymsComponent.instance.updateHeight=n.calculateHeight.bind(n),n.synonymsComponent.instance.user=n.user})()}calculateHeight(){setTimeout(()=>{this.heightCalculationService.calculate()})}rephrase(){window.parent.postMessage("runRephrase:","*")}replaceSynonym(n=""){this.isReadOnly?this.copySynonym(n):window.parent.postMessage(`replaceSynonym:${n}`,"*")}copySynonym(n){var o=this;return(0,r.Z)(function*(){var s;!n||(null===(s=o.clipboard)||void 0===s||s.copy(n),window.parent.postMessage("copySynonym:","*"),o.synonymCopied=!0,yield(0,p.Vs)(2e3),o.synonymCopied=!1)})()}}l.\u0275fac=function(n){return new(n||l)(e.Y36(y.K0),e.Y36(e.SBq),e.Y36(p.ne),e.Y36(f.SynonymsPopupTabSynonymsService),e.Y36(v.TU))},l.\u0275cmp=e.Xpm({type:l,selectors:[["g-synonyms"]],viewQuery:function(n,o){if(1&n&&e.Gf(M,5,e.s_b),2&n){let s;e.iGM(s=e.CRH())&&(o.container=s.first)}},features:[e.qOj],decls:3,vars:1,consts:[["container",""],[4,"ngIf"],[1,"g-synonyms__clipboard"],["name","icon-check",1,"g-synonyms__clipboard-icon"],[1,"g-synonyms__clipboard-text"]],template:function(n,o){1&n&&(e.YNc(0,O,0,0,"ng-template",null,0,e.W1O),e.YNc(2,P,5,0,"ng-container",1)),2&n&&(e.xp6(2),e.Q6J("ngIf",o.synonymCopied))},directives:[y.O5,E.o],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;height:100%;overflow:auto}[_nghost-%COMP%]   .g-synonyms__clipboard[_ngcontent-%COMP%]{position:fixed;bottom:10px;left:10px;background:#054063;min-height:40px;box-shadow:0 0 40px #00000026;border-radius:6px;padding:3px 10px;transition:.2s;pointer-events:none;z-index:9999;display:flex;justify-content:center;align-items:center}[_nghost-%COMP%]   .g-synonyms__clipboard-text[_ngcontent-%COMP%]{color:#fff;font-size:14px;font-weight:500;text-align:left}[_nghost-%COMP%]   .g-synonyms__clipboard-icon[_ngcontent-%COMP%]{margin-right:5px}"]});class a{}a.\u0275fac=function(n){return new(n||a)},a.\u0275mod=e.oAB({type:a}),a.\u0275inj=e.cJS({imports:[[y.ez,C.m]]})}}]);
//# sourceMappingURL=src_app_modules_lazy-modules_synonyms_synonyms_component_ts.b602bd8fb2f6a11d.js.map