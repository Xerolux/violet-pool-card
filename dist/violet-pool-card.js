/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const STATE_CONFIG = {
    off: { color: '#757575', icon: 'mdi:power-off', label: 'OFF' },
    on: { color: '#4CAF50', icon: 'mdi:power-on', label: 'ON' },
    auto: { color: '#2196F3', icon: 'mdi:autorenew', label: 'AUTO' },
    manual: { color: '#FF9800', icon: 'mdi:hand-back-right', label: 'MANUAL' },
    blocked: { color: '#FFC107', icon: 'mdi:block-helper', label: 'BLOCKED' },
    error: { color: '#F44336', icon: 'mdi:alert-circle', label: 'ERROR' },
    idle: { color: '#9E9E9E', icon: 'mdi:sleep', label: 'IDLE' },
    heat: { color: '#FF5722', icon: 'mdi:fire', label: 'HEAT' },
    heating: { color: '#FF5722', icon: 'mdi:fire', label: 'HEATING' },
    cool: { color: '#00BCD4', icon: 'mdi:snowflake', label: 'COOL' },
    cooling: { color: '#00BCD4', icon: 'mdi:snowflake', label: 'COOLING' },
};
class StatusBadge extends i {
    constructor() {
        super(...arguments);
        this.pulse = false;
        this.showIcon = true;
    }
    render() {
        const config = STATE_CONFIG[this.state] || STATE_CONFIG.off;
        const displayLabel = this.label || config.label;
        const displayIcon = this.icon || config.icon;
        return b` <div class="badge ${this.state} ${this.pulse ? 'pulse' : ''}" style="--badge-color: ${config.color}" > ${this.showIcon ? b `<ha-icon icon="${displayIcon}"></ha-icon>` : ''}
        <span class="label">${displayLabel}</span>
      </div>
    `;
    }
    static get styles() {
        return i$3`:host{display:inline-block}.badge{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 14px;border-radius:16px;background:var(--badge-color);color:white;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.2s ease}.badge:hover{transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,0.15)}.badge ha-icon{--mdc-icon-size:16px;display:flex;align-items:center}.label{line-height:1}.badge.pulse{animation:pulse 2s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.85;transform:scale(1.02)}}.badge.auto ha-icon{animation:rotate 3s linear infinite}@keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.badge.heating,.badge.cooling{animation:breathe 2s ease-in-out infinite}@keyframes breathe{0%,100%{opacity:1}50%{opacity:0.7}}`;
    }
}
__decorate([
    n()
], StatusBadge.prototype, "state", void 0);
__decorate([
    n()
], StatusBadge.prototype, "label", void 0);
__decorate([
    n()
], StatusBadge.prototype, "icon", void 0);
__decorate([
    n({ type: Boolean })
], StatusBadge.prototype, "pulse", void 0);
__decorate([
    n({ type: Boolean })
], StatusBadge.prototype, "showIcon", void 0);
if (!customElements.get('vpc-status-badge')) {
    customElements.define('vpc-status-badge', StatusBadge);
}

const STATUS_CONFIG = {
    normal: { color: '#4CAF50', icon: 'mdi:check-circle' },
    ok: { color: '#4CAF50', icon: 'mdi:check-circle' },
    low: { color: '#2196F3', icon: 'mdi:arrow-down-circle' },
    high: { color: '#FF9800', icon: 'mdi:arrow-up-circle' },
    critical: { color: '#F44336', icon: 'mdi:alert-circle' },
    warning: { color: '#FF9800', icon: 'mdi:alert' },
    error: { color: '#F44336', icon: 'mdi:close-circle' },
};
class ValueDisplay extends i {
    constructor() {
        super(...arguments);
        this.unit = '';
        this.label = '';
        this.status = 'normal';
        this.decimals = 1;
        this.showStatus = true;
        this.showRange = false;
        this.large = false;
    }
    formatValue(val) {
        if (val === undefined || val === null)
            return '--';
        return val.toFixed(this.decimals);
    }
    getStatusFromValue() {
        if (this.value === undefined || this.value === null)
            return 'normal';
        // If explicit status is set, use it
        if (this.status !== 'normal')
            return this.status;
        // Auto-calculate status based on min/max
        if (this.min !== undefined && this.value < this.min) {
            return this.value < this.min * 0.9 ? 'critical' : 'low';
        }
        if (this.max !== undefined && this.value > this.max) {
            return this.value > this.max * 1.1 ? 'critical' : 'high';
        }
        return 'normal';
    }
    render() {
        const currentStatus = this.getStatusFromValue();
        const statusConfig = STATUS_CONFIG[currentStatus];
        return b` <div class="value-display ${this.large ? 'large' : ''}"> ${this.label ? b `<div class="label">${this.label}</div>` : ''}

        <div class="value-container">
          <div class="value" style="color: ${statusConfig.color}">
            ${this.formatValue(this.value)}
            ${this.unit ? b`<span class="unit">${this.unit}</span>` : ''}
          </div>

          ${this.showStatus
            ? b` <ha-icon icon="${statusConfig.icon}" style="color: ${statusConfig.color}" ></ha-icon> `
            : ''}
        </div>

        ${this.target !== undefined
            ? b` <div class="target"> → ${this.formatValue(this.target)}${this.unit} </div> `
            : ''}

        ${this.showRange && (this.min !== undefined || this.max !== undefined)
            ? b` <div class="range"> ${this.min !== undefined ? b `<span class="range-min">Min: ${this.formatValue(this.min)}${this.unit}</span>`
                : ''}
                ${this.max !== undefined
                ? b`<span class="range-max">Max: ${this.formatValue(this.max)}${this.unit}</span>`
                : ''}
              </div>
            `
            : ''}
      </div>
    `;
    }
    static get styles() {
        return i$3`:host{display:block}.value-display{display:flex;flex-direction:column;gap:4px}.label{font-size:12px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px}.value-container{display:flex;align-items:center;gap:8px}.value{font-size:24px;font-weight:700;line-height:1;color:var(--primary-text-color);display:flex;align-items:baseline;gap:4px}.value-display.large .value{font-size:32px;font-weight:800}.unit{font-size:16px;font-weight:500;opacity:0.8}.value-display.large .unit{font-size:20px}ha-icon{--mdc-icon-size:20px;flex-shrink:0}.target{font-size:14px;color:var(--secondary-text-color);display:flex;align-items:center;gap:4px}.range{display:flex;gap:12px;font-size:11px;color:var(--disabled-text-color);margin-top:4px}.range-min::before{content:'\\25BC ';color:var(--info-color,#2196F3)}.range-max::before{content:'\\25B2 ';color:var(--warning-color,#FF9800)}`;
    }
}
__decorate([
    n({ type: Number })
], ValueDisplay.prototype, "value", void 0);
__decorate([
    n()
], ValueDisplay.prototype, "unit", void 0);
__decorate([
    n()
], ValueDisplay.prototype, "label", void 0);
__decorate([
    n()
], ValueDisplay.prototype, "status", void 0);
__decorate([
    n({ type: Number })
], ValueDisplay.prototype, "min", void 0);
__decorate([
    n({ type: Number })
], ValueDisplay.prototype, "max", void 0);
__decorate([
    n({ type: Number })
], ValueDisplay.prototype, "target", void 0);
__decorate([
    n({ type: Number })
], ValueDisplay.prototype, "decimals", void 0);
__decorate([
    n({ type: Boolean })
], ValueDisplay.prototype, "showStatus", void 0);
__decorate([
    n({ type: Boolean })
], ValueDisplay.prototype, "showRange", void 0);
__decorate([
    n({ type: Boolean })
], ValueDisplay.prototype, "large", void 0);
if (!customElements.get('vpc-value-display')) {
    customElements.define('vpc-value-display', ValueDisplay);
}

class DetailStatus extends i {
    constructor() {
        super(...arguments);
        this.compact = false;
    }
    parsePipeSeparated(raw) {
        if (!raw || typeof raw !== 'string') {
            return { status: '' };
        }
        const parts = raw.split('|');
        if (parts.length === 2) {
            const level = parseInt(parts[0], 10);
            const status = this.formatStatusText(parts[1]);
            return { level: isNaN(level) ? undefined : level, status };
        }
        return { status: this.formatStatusText(raw) };
    }
    formatStatusText(text) {
        if (!text)
            return '';
        return text
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    parseArray(raw) {
        if (!Array.isArray(raw))
            return [];
        return raw.map((item) => this.formatStatusText(item)).filter((item) => item);
    }
    getIconForStatus(status) {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('freeze') || lowerStatus.includes('frost')) {
            return 'mdi:snowflake-alert';
        }
        if (lowerStatus.includes('blocked') || lowerStatus.includes('block')) {
            return 'mdi:block-helper';
        }
        if (lowerStatus.includes('threshold') || lowerStatus.includes('limit')) {
            return 'mdi:speedometer';
        }
        if (lowerStatus.includes('temp')) {
            return 'mdi:thermometer-alert';
        }
        if (lowerStatus.includes('error')) {
            return 'mdi:alert-circle';
        }
        if (lowerStatus.includes('ok') || lowerStatus.includes('normal')) {
            return 'mdi:check-circle';
        }
        return 'mdi:information';
    }
    getColorForStatus(status) {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('error') || lowerStatus.includes('critical')) {
            return 'var(--error-color, #F44336)';
        }
        if (lowerStatus.includes('blocked') || lowerStatus.includes('freeze')) {
            return 'var(--warning-color, #FF9800)';
        }
        if (lowerStatus.includes('ok') || lowerStatus.includes('normal')) {
            return 'var(--success-color, #4CAF50)';
        }
        return 'var(--info-color, #2196F3)';
    }
    render() {
        if (!this.raw) {
            return b``;
        }
        // Handle array input
        if (Array.isArray(this.raw)) {
            const statuses = this.parseArray(this.raw);
            if (statuses.length === 0)
                return b``;
            return b` <div class="detail-status-list ${this.compact ? 'compact' : ''}"> ${statuses.map((status) => b `
              <div class="status-item" style="color: ${this.getColorForStatus(status)}">
                <ha-icon icon="${this.icon || this.getIconForStatus(status)}"></ha-icon>
                <span class="status-text">${status}</span>
              </div>
            `)}
        </div>
      `;
        }
        // Handle pipe-separated string
        const parsed = this.parsePipeSeparated(this.raw);
        if (!parsed.status)
            return b``;
        const statusColor = this.getColorForStatus(parsed.status);
        const statusIcon = this.icon || this.getIconForStatus(parsed.status);
        return b` <div class="detail-status ${this.compact ? 'compact' : ''}" style="color: ${statusColor}"><ha-icon icon="${statusIcon}"></ha-icon><div class="status-content"> ${parsed.level !== undefined ? b `<span class="level">Level ${parsed.level}:</span>`
            : ''}
          <span class="status-text">${parsed.status}</span>
        </div>
      </div>
    `;
    }
    static get styles() {
        return i$3`:host{display:block}.detail-status{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--card-background-color);border-radius:8px;border-left:3px solid currentColor;font-size:14px;line-height:1.4}.detail-status.compact{padding:4px 8px;font-size:12px}.detail-status ha-icon{--mdc-icon-size:20px;flex-shrink:0}.detail-status.compact ha-icon{--mdc-icon-size:16px}.status-content{display:flex;flex-wrap:wrap;align-items:center;gap:4px;flex:1}.level{font-weight:600;opacity:0.9}.status-text{font-weight:500}.detail-status-list{display:flex;flex-direction:column;gap:6px}.detail-status-list.compact{gap:4px}.status-item{display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--card-background-color);border-radius:6px;border-left:2px solid currentColor;font-size:13px}.detail-status-list.compact .status-item{padding:4px 8px;font-size:11px}.status-item ha-icon{--mdc-icon-size:16px;flex-shrink:0}.detail-status-list.compact .status-item ha-icon{--mdc-icon-size:14px}.status-item .status-text{font-weight:500}`;
    }
}
__decorate([
    n()
], DetailStatus.prototype, "raw", void 0);
__decorate([
    n()
], DetailStatus.prototype, "icon", void 0);
__decorate([
    n({ type: Boolean })
], DetailStatus.prototype, "compact", void 0);
if (!customElements.get('vpc-detail-status')) {
    customElements.define('vpc-detail-status', DetailStatus);
}

const CHIP_CONFIG = {
    info: {
        color: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        icon: 'mdi:information',
    },
    warning: {
        color: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        icon: 'mdi:alert',
    },
    error: {
        color: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        icon: 'mdi:alert-circle',
    },
    success: {
        color: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        icon: 'mdi:check-circle',
    },
};
class WarningChips extends i {
    constructor() {
        super(...arguments);
        this.warnings = [];
        this.defaultType = 'warning';
        this.dismissable = false;
        this.dismissedWarnings = new Set();
    }
    normalizeWarnings() {
        return this.warnings.map((warning) => {
            if (typeof warning === 'string') {
                return {
                    text: this.formatWarningText(warning),
                    type: this.getWarningType(warning),
                    dismissable: this.dismissable,
                };
            }
            return {
                ...warning,
                text: this.formatWarningText(warning.text),
                type: warning.type || this.defaultType,
                dismissable: warning.dismissable !== undefined ? warning.dismissable : this.dismissable,
            };
        });
    }
    formatWarningText(text) {
        if (!text)
            return '';
        return text
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    getWarningType(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('error') || lowerText.includes('critical') || lowerText.includes('failed')) {
            return 'error';
        }
        if (lowerText.includes('blocked') || lowerText.includes('threshold') || lowerText.includes('limit')) {
            return 'warning';
        }
        if (lowerText.includes('ok') || lowerText.includes('success') || lowerText.includes('complete')) {
            return 'success';
        }
        return 'info';
    }
    handleDismiss(warning) {
        this.dismissedWarnings.add(warning.text);
        this.requestUpdate();
        // Dispatch event for parent component
        this.dispatchEvent(new CustomEvent('warning-dismissed', {
            detail: { warning },
            bubbles: true,
            composed: true,
        }));
    }
    isDismissed(warning) {
        return this.dismissedWarnings.has(warning.text);
    }
    render() {
        const normalizedWarnings = this.normalizeWarnings().filter((w) => !this.isDismissed(w));
        if (normalizedWarnings.length === 0) {
            return b``;
        }
        return b` <div class="warning-chips"> ${normalizedWarnings.map((warning) => this.renderChip(warning))} </div> `;
    }
    renderChip(warning) {
        const type = warning.type || this.defaultType;
        const config = CHIP_CONFIG[type];
        const icon = warning.icon || config.icon;
        return b` <div class="chip ${type}" style=" --chip-color: ${config.color}; --chip-bg: ${config.backgroundColor}; " ><ha-icon icon="${icon}"></ha-icon><span class="chip-text">${warning.text}</span> ${warning.dismissable ? b `
              <button
                class="dismiss-button"
                @click="${() => this.handleDismiss(warning)}"
                title="Dismiss"
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            `
            : ''}
      </div>
    `;
    }
    static get styles() {
        return i$3`:host{display:block}.warning-chips{display:flex;flex-wrap:wrap;gap:8px}.chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:16px;background:var(--chip-bg);color:var(--chip-color);font-size:13px;font-weight:500;line-height:1.2;border:1px solid var(--chip-color);transition:all 0.2s ease}.chip:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(0,0,0,0.1)}.chip ha-icon{--mdc-icon-size:16px;flex-shrink:0}.chip-text{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dismiss-button{display:flex;align-items:center;justify-content:center;padding:0;margin:0;border:none;background:none;color:var(--chip-color);cursor:pointer;opacity:0.7;transition:opacity 0.2s ease}.dismiss-button:hover{opacity:1}.dismiss-button ha-icon{--mdc-icon-size:14px}.chip.error{animation:pulse-error 2s ease-in-out infinite}@keyframes pulse-error{0%,100%{opacity:1}50%{opacity:0.85}}@media(max-width:600px){.warning-chips{flex-direction:column}.chip{width:100%;box-sizing:border-box}.chip-text{white-space:normal;overflow:visible}}`;
    }
}
__decorate([
    n({ type: Array })
], WarningChips.prototype, "warnings", void 0);
__decorate([
    n()
], WarningChips.prototype, "defaultType", void 0);
__decorate([
    n({ type: Boolean })
], WarningChips.prototype, "dismissable", void 0);
__decorate([
    r()
], WarningChips.prototype, "dismissedWarnings", void 0);
if (!customElements.get('vpc-warning-chips')) {
    customElements.define('vpc-warning-chips', WarningChips);
}

class SliderControl extends i {
    constructor() {
        super(...arguments);
        this.min = 0;
        this.max = 100;
        this.step = 1;
        this.value = 0;
        this.unit = '';
        this.label = '';
        this.disabled = false;
        this.vertical = false;
        this.showValue = true;
        this.showMinMax = false;
        this.isDragging = false;
        this.localValue = 0;
        this.debounceDelay = 300; // ms
    }
    connectedCallback() {
        super.connectedCallback();
        this.localValue = this.value;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up debounce timer to prevent memory leaks
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
    updated(changedProperties) {
        if (changedProperties.has('value') && !this.isDragging) {
            this.localValue = this.value;
        }
    }
    handleInput(e) {
        const value = Number(e.target.value);
        this.localValue = value;
        this.isDragging = true;
        // Dispatch input event for live updates (no debounce)
        this.dispatchEvent(new CustomEvent('slider-input', {
            detail: { value },
            bubbles: true,
            composed: true,
        }));
    }
    handleChange(e) {
        const value = Number(e.target.value);
        this.localValue = value;
        this.isDragging = false;
        // Clear existing debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        // Debounce the value-changed event
        this.debounceTimer = window.setTimeout(() => {
            this.dispatchEvent(new CustomEvent('value-changed', {
                detail: { value },
                bubbles: true,
                composed: true,
            }));
        }, this.debounceDelay);
    }
    handleStart() {
        this.isDragging = true;
    }
    handleEnd() {
        this.isDragging = false;
    }
    getLabelForValue(value) {
        if (!this.labels || this.labels.length === 0) {
            return '';
        }
        // If labels is array of strings, map to values
        if (typeof this.labels[0] === 'string') {
            const index = Math.round((value - this.min) / this.step);
            return this.labels[index] || '';
        }
        // If labels is array of SliderLabel objects
        const sliderLabels = this.labels;
        const label = sliderLabels.find((l) => l.value === value);
        return label ? label.label : '';
    }
    getAllLabels() {
        if (!this.labels || this.labels.length === 0) {
            return [];
        }
        const range = this.max - this.min;
        // If labels is array of strings
        if (typeof this.labels[0] === 'string') {
            return this.labels.map((label, index) => {
                const value = this.min + index * this.step;
                const position = ((value - this.min) / range) * 100;
                return { value, label, position };
            });
        }
        // If labels is array of SliderLabel objects
        return this.labels.map((item) => {
            const position = ((item.value - this.min) / range) * 100;
            return { value: item.value, label: item.label, position };
        });
    }
    formatValue(value) {
        // Check if we have a label for this value
        const label = this.getLabelForValue(value);
        if (label) {
            return label;
        }
        // Otherwise format as number
        const decimals = this.step < 1 ? 1 : 0;
        return `${value.toFixed(decimals)}${this.unit}`;
    }
    render() {
        const percentage = ((this.localValue - this.min) / (this.max - this.min)) * 100;
        const allLabels = this.getAllLabels();
        return b` <div class="slider-container ${this.vertical ? 'vertical' : ''} ${this.disabled ? 'disabled' : ''}"> ${this.label ? b `<div class="slider-label">${this.label}</div>` : ''}

        ${this.showValue
            ? b` <div class="value-display ${this.isDragging ? 'dragging' : ''}"> ${this.formatValue(this.localValue)} </div> `
            : ''}

        <div class="slider-wrapper">
          ${this.showMinMax
            ? b`<span class="min-max-label">${this.formatValue(this.min)}</span>`
            : ''}

          <div class="slider-track-wrapper">
            <input
              type="range"
              class="slider"
              min="${this.min}"
              max="${this.max}"
              step="${this.step}"
              .value="${this.localValue.toString()}"
              ?disabled="${this.disabled}"
              @input="${this.handleInput}"
              @change="${this.handleChange}"
              @mousedown="${this.handleStart}"
              @mouseup="${this.handleEnd}"
              @touchstart="${this.handleStart}"
              @touchend="${this.handleEnd}"
              style="--percentage: ${percentage}%"
            />
          </div>

          ${this.showMinMax
            ? b`<span class="min-max-label">${this.formatValue(this.max)}</span>`
            : ''}
        </div>

        ${allLabels.length > 0
            ? b` <div class="labels"> ${allLabels.map((item) => b `
                    <span
                      class="label-item ${this.localValue === item.value ? 'active' : ''}"
                      style="left: ${item.position}%"
                      title="${item.label}"
                      @click="${() => !this.disabled && this.handleChange({ target: { value: item.value } })}"
                    >
                      ${item.label}
                    </span>
                  `)}
              </div>
            `
            : ''}
      </div>
    `;
    }
    static get styles() {
        return i$3`:host{display:block}.slider-container{width:100%;user-select:none}.slider-container.disabled{opacity:0.5;pointer-events:none}.slider-label{font-size:12px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}.value-display{text-align:center;font-size:28px;font-weight:700;margin-bottom:12px;color:var(--primary-text-color);transition:all 0.2s ease}.value-display.dragging{color:var(--primary-color);transform:scale(1.05)}.slider-wrapper{display:flex;align-items:center;gap:12px;padding:8px 0}.min-max-label{font-size:11px;color:var(--secondary-text-color);min-width:40px;text-align:center}.slider-track-wrapper{flex:1;position:relative}.slider{width:100%;height:8px;-webkit-appearance:none;appearance:none;background:linear-gradient(to right,var(--primary-color) 0%,var(--primary-color) var(--percentage),var(--disabled-color,#e0e0e0) var(--percentage),var(--disabled-color,#e0e0e0) 100%);border-radius:4px;outline:none;cursor:pointer;transition:opacity 0.2s}.slider:hover{opacity:0.9}.slider:disabled{cursor:not-allowed}.slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:var(--primary-color);cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.2s ease;border:3px solid white}.slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 3px 8px rgba(0,0,0,0.3)}.slider:active::-webkit-slider-thumb{transform:scale(1.15);box-shadow:0 4px 12px rgba(0,0,0,0.4)}.slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:var(--primary-color);cursor:pointer;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.2s ease}.slider::-moz-range-thumb:hover{transform:scale(1.1);box-shadow:0 3px 8px rgba(0,0,0,0.3)}.slider:active::-moz-range-thumb{transform:scale(1.15);box-shadow:0 4px 12px rgba(0,0,0,0.4)}.slider::-moz-range-track{background:transparent;border:none}.labels{position:relative;display:flex;justify-content:space-between;margin-top:16px;font-size:11px;color:var(--secondary-text-color)}.label-item{position:absolute;transform:translateX(-50%);cursor:pointer;padding:4px 8px;border-radius:4px;transition:all 0.2s ease;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;text-align:center}.label-item:hover{background:var(--divider-color,rgba(0,0,0,0.05));color:var(--primary-text-color)}.label-item.active{font-weight:600;color:var(--primary-color)}.slider-container.vertical .slider{transform:rotate(-90deg);transform-origin:left center}@media(pointer:coarse){.slider::-webkit-slider-thumb{width:28px;height:28px}.slider::-moz-range-thumb{width:28px;height:28px}}`;
    }
}
__decorate([
    n({ type: Number })
], SliderControl.prototype, "min", void 0);
__decorate([
    n({ type: Number })
], SliderControl.prototype, "max", void 0);
__decorate([
    n({ type: Number })
], SliderControl.prototype, "step", void 0);
__decorate([
    n({ type: Number })
], SliderControl.prototype, "value", void 0);
__decorate([
    n()
], SliderControl.prototype, "unit", void 0);
__decorate([
    n()
], SliderControl.prototype, "label", void 0);
__decorate([
    n({ type: Array })
], SliderControl.prototype, "labels", void 0);
__decorate([
    n({ type: Boolean })
], SliderControl.prototype, "disabled", void 0);
__decorate([
    n({ type: Boolean })
], SliderControl.prototype, "vertical", void 0);
__decorate([
    n({ type: Boolean })
], SliderControl.prototype, "showValue", void 0);
__decorate([
    n({ type: Boolean })
], SliderControl.prototype, "showMinMax", void 0);
__decorate([
    r()
], SliderControl.prototype, "isDragging", void 0);
__decorate([
    r()
], SliderControl.prototype, "localValue", void 0);
if (!customElements.get('vpc-slider-control')) {
    customElements.define('vpc-slider-control', SliderControl);
}

class QuickActions extends i {
    constructor() {
        super(...arguments);
        this.actions = [];
        this.vertical = false;
        this.compact = false;
        this.loadingStates = new Map();
    }
    async handleActionClick(action, index) {
        if (action.disabled || this.loadingStates.get(index)) {
            return;
        }
        // Show confirmation if needed
        if (action.confirmMessage) {
            const confirmed = await this.showConfirmation(action.confirmMessage);
            if (!confirmed) {
                return;
            }
        }
        // Set loading state
        this.loadingStates.set(index, true);
        this.requestUpdate();
        try {
            // Execute action
            await action.action();
            // Dispatch event
            this.dispatchEvent(new CustomEvent('action-executed', {
                detail: { action, index },
                bubbles: true,
                composed: true,
            }));
        }
        catch (error) {
            console.error('Quick action failed:', error);
            // Dispatch error event
            this.dispatchEvent(new CustomEvent('action-error', {
                detail: { action, index, error },
                bubbles: true,
                composed: true,
            }));
        }
        finally {
            // Clear loading state
            this.loadingStates.set(index, false);
            this.requestUpdate();
        }
    }
    async showConfirmation(message) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'confirmation-overlay';
            const dialog = document.createElement('div');
            dialog.className = 'confirmation-dialog';
            dialog.innerHTML = `
        <div class="confirmation-content">
          <p class="confirmation-message">${message}</p>
          <div class="confirmation-buttons">
            <button class="btn-cancel" aria-label="Cancel">Cancel</button>
            <button class="btn-confirm" aria-label="Confirm">Confirm</button>
          </div>
        </div>
      `;
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
            const cleanup = () => {
                overlay.remove();
            };
            const cancelBtn = dialog.querySelector('.btn-cancel');
            const confirmBtn = dialog.querySelector('.btn-confirm');
            cancelBtn?.addEventListener('click', () => {
                resolve(false);
                cleanup();
            });
            confirmBtn?.addEventListener('click', () => {
                resolve(true);
                cleanup();
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    resolve(false);
                    cleanup();
                }
            });
            // Keyboard support
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    resolve(false);
                    cleanup();
                    document.removeEventListener('keydown', handleKeydown);
                }
                if (e.key === 'Enter') {
                    resolve(true);
                    cleanup();
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);
            // Focus confirm button
            confirmBtn?.focus();
        });
    }
    renderAction(action, index) {
        const isLoading = this.loadingStates.get(index) || action.loading;
        const isDisabled = action.disabled || isLoading;
        return b` <button class="quick-action ${action.active ? 'active' : ''} ${isDisabled ? 'disabled' : ''} ${isLoading ? 'loading' : ''}" @click="${() => this.handleActionClick(action, index)}" ?disabled="${isDisabled}" style="${action.color ? `--action-color: ${action.color}` : ''}"
        title="${action.label}"
        aria-label="${action.label}"
        aria-busy="${isLoading ? 'true' : 'false'}"
        aria-disabled="${isDisabled ? 'true' : 'false'}"
      >
        <div class="action-content">
          ${isLoading
            ? b`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`
            : b`<ha-icon icon="${action.icon}"></ha-icon>`}
          ${!this.compact ? b`<span class="action-label">${action.label}</span>` : ''}
        </div>
      </button>
    `;
    }
    render() {
        if (this.actions.length === 0) {
            return b``;
        }
        return b` <div class="quick-actions ${this.vertical ? 'vertical' : ''} ${this.compact ? 'compact' : ''}"> ${this.actions.map((action, index) => this.renderAction(action, index))} </div> `;
    }
    static get styles() {
        return i$3`:host{display:block;}.quick-actions{display:flex;gap:6px;flex-wrap:wrap;}.quick-actions.vertical{flex-direction:column;}.quick-actions.compact{gap:4px;}.quick-action{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;padding:8px 10px;border:2px solid var(--divider-color, rgba(0, 0, 0, 0.12));border-radius:8px;background:var(--card-background-color, #fff);color:var(--primary-text-color);cursor:pointer;font-size:12px;font-weight:500;transition:all 0.2s ease;position:relative;overflow:hidden;}.quick-actions.compact .quick-action{padding:8px;min-width:48px;min-height:48px;}.quick-action:hover:not(.disabled){background:var(--divider-color, rgba(0, 0, 0, 0.05));border-color:var(--primary-color);transform:translateY(-2px);box-shadow:0 2px 8px rgba(0, 0, 0, 0.1);}.quick-action:active:not(.disabled){transform:translateY(0);box-shadow:0 1px 4px rgba(0, 0, 0, 0.1);}.quick-action.active{background:var(--action-color, var(--primary-color));border-color:var(--action-color, var(--primary-color));color:white;}.quick-action.active:hover:not(.disabled){background:var(--action-color, var(--primary-color));opacity:0.9;}.quick-action.disabled{opacity:0.5;cursor:not-allowed;}.quick-action.loading{pointer-events:none;}.action-content{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;}.quick-actions.compact .action-content{gap:0;}.quick-action ha-icon{--mdc-icon-size:20px;flex-shrink:0;}.quick-actions.compact .quick-action ha-icon{--mdc-icon-size:24px;}.action-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.spin{animation:spin 1s linear infinite;}@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}.quick-action::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:rgba(255, 255, 255, 0.3);transform:translate(-50%, -50%);transition:width 0.6s, height 0.6s;}.quick-action:active:not(.disabled)::before{width:200%;height:200%;}@media (pointer:coarse){.quick-action{min-height:44px;}}@media (max-width:600px){.quick-actions:not(.vertical){flex-direction:column;}.quick-action{width:100%;}}`;
    }
}
__decorate([
    n({ type: Array })
], QuickActions.prototype, "actions", void 0);
__decorate([
    n({ type: Boolean })
], QuickActions.prototype, "vertical", void 0);
__decorate([
    n({ type: Boolean })
], QuickActions.prototype, "compact", void 0);
__decorate([
    r()
], QuickActions.prototype, "loadingStates", void 0);
if (!customElements.get('vpc-quick-actions')) {
    customElements.define('vpc-quick-actions', QuickActions);
}

class ServiceCaller {
    constructor(hass) {
        this.hass = hass;
    }
    showToast(message, duration = 3000) {
        // Dispatch event for toast notification
        const event = new CustomEvent('hass-notification', {
            detail: { message, duration },
            bubbles: true,
            composed: true,
        });
        window.dispatchEvent(event);
    }
    async callService(domain, service, serviceData) {
        try {
            await this.hass.callService(domain, service, serviceData);
            return { success: true };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Service call failed: ${domain}.${service}`, error);
            this.showToast(`Error: ${errorMessage}`, 5000);
            return { success: false, error: errorMessage };
        }
    }
    async controlPump(entity, action, speed, duration) {
        const serviceData = {
            entity_id: entity,
            action,
        };
        if (speed !== undefined) {
            serviceData.speed = speed;
        }
        if (duration !== undefined) {
            serviceData.duration = duration;
        }
        const result = await this.callService('violet_pool_controller', 'control_pump', serviceData);
        if (result.success) {
            const speedLabel = speed !== undefined ? ` (Speed ${speed})` : '';
            this.showToast(`Pump ${action.toUpperCase()}${speedLabel}`);
        }
        return result;
    }
    async setTemperature(entity, temperature) {
        const result = await this.callService('climate', 'set_temperature', {
            entity_id: entity,
            temperature,
        });
        if (result.success) {
            this.showToast(`Temperature set to ${temperature}°C`);
        }
        return result;
    }
    async setHvacMode(entity, mode) {
        const result = await this.callService('climate', 'set_hvac_mode', {
            entity_id: entity,
            hvac_mode: mode,
        });
        if (result.success) {
            this.showToast(`HVAC mode set to ${mode.toUpperCase()}`);
        }
        return result;
    }
    async setNumberValue(entity, value) {
        const result = await this.callService('number', 'set_value', {
            entity_id: entity,
            value,
        });
        if (result.success) {
            this.showToast(`Value set to ${value}`);
        }
        return result;
    }
    async turnOn(entity) {
        const domain = entity.split('.')[0];
        const result = await this.callService(domain, 'turn_on', {
            entity_id: entity,
        });
        if (result.success) {
            this.showToast(`${entity.split('.')[1]} turned ON`);
        }
        return result;
    }
    async turnOff(entity) {
        const domain = entity.split('.')[0];
        const result = await this.callService(domain, 'turn_off', {
            entity_id: entity,
        });
        if (result.success) {
            this.showToast(`${entity.split('.')[1]} turned OFF`);
        }
        return result;
    }
    async toggle(entity) {
        const domain = entity.split('.')[0];
        const result = await this.callService(domain, 'toggle', {
            entity_id: entity,
        });
        if (result.success) {
            this.showToast(`${entity.split('.')[1]} toggled`);
        }
        return result;
    }
    async smartDosing(dosingType, duration, action = 'on') {
        const result = await this.callService('violet_pool_controller', 'smart_dosing', {
            dosing_type: dosingType,
            duration,
            action,
        });
        if (result.success) {
            const typeLabels = {
                cl: 'Chlorine',
                phm: 'pH-',
                php: 'pH+',
                floc: 'Flocculant',
            };
            this.showToast(`${typeLabels[dosingType]} dosing for ${duration}s`);
        }
        return result;
    }
    async manualDosing(entity, duration = 30) {
        // Extract dosing type from entity name
        const dosingTypeMatch = entity.match(/dos_\d+_(\w+)/);
        if (!dosingTypeMatch) {
            return {
                success: false,
                error: 'Could not determine dosing type from entity',
            };
        }
        const dosingTypeMap = {
            cl: 'cl',
            phm: 'phm',
            php: 'php',
            floc: 'floc',
        };
        const dosingType = dosingTypeMap[dosingTypeMatch[1]];
        if (!dosingType) {
            return {
                success: false,
                error: `Unknown dosing type: ${dosingTypeMatch[1]}`,
            };
        }
        return this.smartDosing(dosingType, duration);
    }
    async setPumpSpeed(entity, speed) {
        if (speed < 0 || speed > 3) {
            return {
                success: false,
                error: 'Speed must be between 0 and 3',
            };
        }
        return this.controlPump(entity, 'on', speed);
    }
    async setControllerMode(entity, mode) {
        if (mode === 'off') {
            return this.turnOff(entity);
        }
        // For manual mode, use 'on' action
        const action = mode === 'manual' ? 'on' : 'auto';
        return this.controlPump(entity, action);
    }
}

class EntityHelper {
    static parsePumpState(pumpState) {
        if (!pumpState || typeof pumpState !== 'string') {
            return { status: '', rawState: '' };
        }
        const parts = pumpState.split('|');
        if (parts.length === 2) {
            const level = parseInt(parts[0], 10);
            const status = this.formatSnakeCase(parts[1]);
            return {
                level: isNaN(level) ? undefined : level,
                status,
                rawState: pumpState,
            };
        }
        return {
            status: this.formatSnakeCase(pumpState),
            rawState: pumpState,
        };
    }
    static parseHeaterState(heaterState) {
        return this.parsePumpState(heaterState);
    }
    static parseSolarState(solarState) {
        return this.parsePumpState(solarState);
    }
    static formatSnakeCase(text) {
        if (!text)
            return '';
        return text
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    static getCurrentTemperature(entity) {
        const temp = entity?.attributes?.current_temperature;
        return temp !== undefined ? Number(temp) : undefined;
    }
    static getTargetTemperature(entity) {
        const temp = entity?.attributes?.temperature;
        return temp !== undefined ? Number(temp) : undefined;
    }
    static getMinTemperature(entity) {
        const temp = entity?.attributes?.min_temp;
        return temp !== undefined ? Number(temp) : undefined;
    }
    static getMaxTemperature(entity) {
        const temp = entity?.attributes?.max_temp;
        return temp !== undefined ? Number(temp) : undefined;
    }
}

class StateColorHelper {
    static getTemperatureColor(temp) {
        if (temp < 15) {
            return { color: '#2196F3', intensity: 'high' }; // Cold - Blue
        }
        else if (temp < 20) {
            return { color: '#00BCD4', intensity: 'medium' }; // Cool - Cyan
        }
        else if (temp < 26) {
            return { color: '#4CAF50', intensity: 'low' }; // Ideal - Green
        }
        else if (temp < 30) {
            return { color: '#FF9800', intensity: 'medium' }; // Warm - Orange
        }
        else {
            return { color: '#F44336', intensity: 'high' }; // Hot - Red
        }
    }
    static getPhColor(ph, targetPh = 7.2) {
        const diff = Math.abs(ph - targetPh);
        if (diff < 0.1) {
            return { color: '#4CAF50', intensity: 'low' }; // Perfect - Green
        }
        else if (diff < 0.3) {
            return { color: '#8BC34A', intensity: 'low' }; // Good - Light Green
        }
        else if (diff < 0.5) {
            return { color: '#FF9800', intensity: 'medium' }; // Attention - Orange
        }
        else {
            return { color: '#F44336', intensity: 'high' }; // Critical - Red
        }
    }
    static getOrpColor(orp, targetOrp = 700) {
        if (orp < targetOrp - 100) {
            return { color: '#F44336', intensity: 'high' }; // Too low - Red
        }
        else if (orp < targetOrp - 50) {
            return { color: '#FF9800', intensity: 'medium' }; // Low - Orange
        }
        else if (orp > targetOrp + 100) {
            return { color: '#F44336', intensity: 'high' }; // Too high - Red
        }
        else if (orp > targetOrp + 50) {
            return { color: '#FF9800', intensity: 'medium' }; // High - Orange
        }
        else {
            return { color: '#4CAF50', intensity: 'low' }; // Good - Green
        }
    }
    static getPumpSpeedColor(speed) {
        switch (speed) {
            case 0:
                return { color: '#757575', intensity: 'low' }; // OFF - Gray
            case 1:
                return { color: '#2196F3', intensity: 'low' }; // ECO - Blue
            case 2:
                return { color: '#4CAF50', intensity: 'medium' }; // Normal - Green
            case 3:
                return { color: '#FF9800', intensity: 'high' }; // Boost - Orange
            default:
                return { color: '#757575', intensity: 'low' }; // Unknown - Gray
        }
    }
    static getEntityStateColor(state) {
        const stateLower = state.toLowerCase();
        if (stateLower === 'on' || stateLower === 'heat' || stateLower === 'active') {
            return { color: '#4CAF50', intensity: 'medium' }; // Active - Green
        }
        else if (stateLower === 'off' || stateLower === 'idle') {
            return { color: '#757575', intensity: 'low' }; // Inactive - Gray
        }
        else if (stateLower === 'auto') {
            return { color: '#2196F3', intensity: 'medium' }; // Auto - Blue
        }
        else if (stateLower === 'manual') {
            return { color: '#FF9800', intensity: 'medium' }; // Manual - Orange
        }
        else if (stateLower.includes('blocked') || stateLower.includes('error')) {
            return { color: '#F44336', intensity: 'high' }; // Error/Blocked - Red
        }
        else if (stateLower.includes('warning')) {
            return { color: '#FFC107', intensity: 'medium' }; // Warning - Amber
        }
        else {
            return { color: '#9E9E9E', intensity: 'low' }; // Unknown - Gray
        }
    }
    static getPercentageColor(percentage, ideal = 100) {
        const diff = Math.abs(percentage - ideal);
        if (diff < 10) {
            return { color: '#4CAF50', intensity: 'low' }; // Perfect - Green
        }
        else if (diff < 25) {
            return { color: '#8BC34A', intensity: 'low' }; // Good - Light Green
        }
        else if (diff < 50) {
            return { color: '#FF9800', intensity: 'medium' }; // Attention - Orange
        }
        else {
            return { color: '#F44336', intensity: 'high' }; // Critical - Red
        }
    }
    static getIntensityOpacity(intensity) {
        switch (intensity) {
            case 'low':
                return 0.15;
            case 'medium':
                return 0.25;
            case 'high':
                return 0.35;
            default:
                return 0.2;
        }
    }
    static applyColorToElement(element, colorConfig, useBackground = true) {
        element.style.setProperty('--state-color', colorConfig.color);
        if (useBackground) {
            const opacity = this.getIntensityOpacity(colorConfig.intensity);
            const rgb = this.hexToRgb(colorConfig.color);
            if (rgb) {
                element.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            }
        }
    }
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    }
}

/**
 * Animated spinning pump impeller SVG
 * speed: 0=off, 1=ECO(slow), 2=Normal(medium), 3=Boost(fast)
 */
function pumpSVG(speed, color) {
    const dur = speed === 0 ? 'none' : speed === 1 ? '3.2s' : speed === 2 ? '1.5s' : '0.62s';
    const isOn = speed > 0;
    return b` <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${isOn ? 0.13 : 0.07}"/><circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/><circle cx="24" cy="24" r="13.5" fill="none" stroke="${color}" stroke-width="0.7" stroke-opacity="0.18" stroke-dasharray="5 3"/><g style="transform-origin:24px 24px;will-change:transform;animation:${dur !== 'none' ? `rotate ${dur} linear infinite` : 'none'}">
        <ellipse cx="24" cy="14" rx="4" ry="8.5" fill="${color}" fill-opacity="0.9"/>
        <ellipse cx="34" cy="24" rx="8.5" ry="4" fill="${color}" fill-opacity="0.7"/>
        <ellipse cx="24" cy="34" rx="4" ry="8.5" fill="${color}" fill-opacity="0.9"/>
        <ellipse cx="14" cy="24" rx="8.5" ry="4" fill="${color}" fill-opacity="0.7"/>
      </g>
      <circle cx="24" cy="24" r="5" fill="${color}"/>
      <circle cx="24" cy="24" r="2.5" fill="white" fill-opacity="0.9"/>
      ${isOn ? b` <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="${speed * 33} 100" stroke-opacity="0.5" stroke-linecap="round" transform="rotate(-90 24 24)"/> ` : ''}
    </svg>`;
}
/**
 * Flickering flame heater icon
 */
function heaterSVG(active, color) {
    return b` <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.14 : 0.07}"/><circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/><path d="M24,8 C17,15 12,20 14,27 C15,33 20,38 24,40 C28,38 33,33 34,27 C36,20 31,15 24,8Z" fill="${color}" fill-opacity="${active ? 0.88 : 0.5}" style="${active ? 'will-change:opacity;animation:flicker 1.9s ease-in-out infinite;transform-origin:24px 40px' : ''}"/><path d="M24,19 C21,23 19,26 20,30 C21,34 22.5,37 24,38 C25.5,37 27,34 28,30 C29,26 27,23 24,19Z" fill="white" fill-opacity="${active ? 0.55 : 0.2}" style="${active ? 'animation:flicker 1.4s ease-in-out infinite 0.2s;transform-origin:24px 38px' : ''}"/><ellipse cx="24" cy="39" rx="8" ry="2.5" fill="${color}" fill-opacity="${active ? 0.28 : 0.1}"/></svg>`;
}
/**
 * Animated solar sun with rotating rays
 */
function solarSVG(active, color) {
    const rays = [0, 45, 90, 135, 180, 225, 270, 315];
    return b` <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.13 : 0.07}"/><g style="transform-origin:24px 24px;will-change:transform;animation:${active ? 'spin-slow 14s linear infinite' : 'none'}"> ${rays.map(angle => b `
          <rect x="22.5" y="3" width="3" height="5.5" rx="1.5"
                fill="${color}" fill-opacity="${active ? 0.75 : 0.3}"
                style="transform:rotate(${angle}deg);transform-origin:24px 24px"/>
        `)}
      </g>
      ${active ? b` <circle cx="24" cy="24" r="14" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.35" style="will-change:transform;animation:breathe 2.8s ease-in-out infinite"/> ` : ''}
      <circle cx="24" cy="24" r="10.5" fill="${color}" fill-opacity="${active ? 0.9 : 0.45}"/>
      <circle cx="24" cy="24" r="7" fill="white" fill-opacity="${active ? 0.5 : 0.22}"/>
    </svg>`;
}
/**
 * Pool cover top-down view with sliding cover panel
 * position: 0=closed, 100=open
 */
function coverSVG(position, isMoving, color) {
    const coverWidth = Math.round((1 - Math.max(0, Math.min(100, position)) / 100) * 72);
    const slatCount = Math.min(Math.floor(coverWidth / 7), 11);
    return b` <svg viewBox="0 0 90 48" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><!-- Pool shell --><rect x="2" y="4" width="76" height="40" rx="9" fill="rgba(0,160,255,0.1)" stroke="${color}" stroke-width="1.5" stroke-opacity="0.35"/><!-- Water texture --><path d="M8,19 C17,15 27,23 37,19 C47,15 57,23 67,19 C71,17 74,19 77,19" fill="none" stroke="rgba(0,150,255,0.45)" stroke-width="1.4" stroke-linecap="round"/><path d="M8,29 C17,25 27,33 37,29 C47,25 57,33 67,29 C71,27 74,29 77,29" fill="none" stroke="rgba(0,150,255,0.25)" stroke-width="1.1" stroke-linecap="round"/><!-- Cover panel --> ${coverWidth > 0 ? b `
        <rect x="2" y="4" width="${coverWidth}" height="40" rx="9"
              fill="${color}" fill-opacity="0.82"/>
        ${Array.from({ length: slatCount }, (_, i) => b` <line x1="${9 + i * 7}" y1="6" x2="${9 + i * 7}" y2="42" stroke="white" stroke-width="0.6" stroke-opacity="0.22"/> `)}
      ` : ''}
      <!-- Motor / reel housing -->
      <rect x="80" y="8" width="8" height="32" rx="4"
            fill="${color}" fill-opacity="0.45"/>
      <circle cx="84" cy="24" r="5" fill="${color}" fill-opacity="${isMoving ? 0.9 : 0.35}"
              style="${isMoving ? 'will-change:transform;animation:rotate 1.2s linear infinite' : ''}"/>
      <circle cx="84" cy="24" r="2" fill="white" fill-opacity="${isMoving ? 0.8 : 0.4}"/>
    </svg>`;
}
/**
 * Glowing pool light with optional RGB color
 * on: light state, rgb: [r,g,b] or null, brightness: 0-255
 */
function lightSVG(on, rgb, brightness, fallbackColor) {
    const rgbStr = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : fallbackColor;
    const bNorm = on ? brightness / 255 : 0;
    const glowRays = [0, 60, 120, 180, 240, 300];
    return b` <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg"> ${on ? b `
        <circle cx="24" cy="24" r="23" fill="${rgbStr}" fill-opacity="${0.07 + bNorm * 0.18}"
                style="will-change:opacity;animation:light-glow 2.6s ease-in-out infinite"/>
        <circle cx="24" cy="24" r="17" fill="${rgbStr}" fill-opacity="${0.09 + bNorm * 0.12}"/>
        <g style="transform-origin:24px 24px;will-change:transform;animation:spin-slow 9s linear infinite">
          ${glowRays.map(a => b` <line x1="24" y1="5" x2="24" y2="9" stroke="${rgbStr}" stroke-width="2.2" stroke-linecap="round" stroke-opacity="${0.4 + bNorm * 0.4}" style="transform:rotate(${a}deg);transform-origin:24px 24px"/> `)}
        </g>
      ` : b`<circle cx="24" cy="24" r="22" fill="${fallbackColor}" fill-opacity="0.07"/>`}
      <!-- Housing ring -->
      <circle cx="24" cy="24" r="20" fill="none" stroke="${on ? rgbStr : fallbackColor}"
              stroke-width="1.5" stroke-opacity="${on ? 0.55 : 0.3}"/>
      <!-- LED lens -->
      <circle cx="24" cy="24" r="12" fill="${on ? rgbStr : fallbackColor}"
              fill-opacity="${on ? 0.88 : 0.28}"/>
      <!-- Lens highlight -->
      <ellipse cx="20.5" cy="19.5" rx="4" ry="3" fill="white"
               fill-opacity="${on ? 0.38 : 0.1}"
               style="transform:rotate(-20deg);transform-origin:20.5px 19.5px"/>
      <!-- Mount points -->
      <circle cx="24" cy="6" r="2" fill="${fallbackColor}" fill-opacity="0.3"/>
      <circle cx="24" cy="42" r="2" fill="${fallbackColor}" fill-opacity="0.3"/>
    </svg>`;
}
/**
 * Animated water droplet for dosing
 */
function dosingDropletSVG(active, level, color) {
    const scale = Math.max(0.3, Math.min(1, level / 100));
    return b` <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.15 : 0.07}"/><circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/><!-- Water droplet --><path d="M24,8 C18,15 14,20 14,26 C14,32.6 18.6,38 24,38 C29.4,38 34,32.6 34,26 C34,20 30,15 24,8Z" fill="${color}" fill-opacity="${active ? 0.8 : 0.4}" style="will-change:transform;${active ? 'animation:droplet-pulse 1.5s ease-in-out infinite' : ''}"/><!-- Level fill --><rect x="14" y="${28 - 8 * scale}" width="20" height="${8 * scale}" rx="10" fill="${color}" fill-opacity="0.5" style="will-change:height;animation:${active ? 'fill-rise 2s ease-in-out infinite' : ''}"/><!-- Bubbles --> ${active ? b `
        <circle cx="20" cy="22" r="1.5" fill="white" fill-opacity="0.6" style="will-change:transform;animation:bubble-float 2s ease-in-out infinite"/>
        <circle cx="28" cy="20" r="1.5" fill="white" fill-opacity="0.6" style="will-change:transform;animation:bubble-float 2s ease-in-out infinite 0.5s"/>
      ` : ''}
    </svg>`;
}
/**
 * Animated gauge needle for chemistry/sensor readings
 */
function gaugeNeedleSVG(value, min, max, color) {
    const normalizedValue = Math.max(min, Math.min(max, value));
    const percent = (normalizedValue - min) / (max - min);
    const rotation = percent * 180 - 90;
    return b` <svg viewBox="0 0 100 60" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><!-- Background gauge arc --><path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="8" stroke-linecap="round"/><!-- Value arc --><path d="M 10 50 A 40 40 0 0 1 ${10 + 80 * percent} ${50 - 40 * (1 - Math.cos(percent * Math.PI))}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" style="will-change:stroke-dasharray;animation:gauge-fill 0.6s ease-out forwards"/><!-- Needle pivot --><circle cx="50" cy="50" r="3" fill="${color}"/><!-- Needle --><line x1="50" y1="50" x2="50" y2="15" stroke="${color}" stroke-width="3" stroke-linecap="round" style="will-change:transform;transform:rotate(${rotation}deg);transform-origin:50px 50px;transition:transform 0.5s cubic-bezier(0.34,1.4,0.64,1)"/><!-- Center cap --><circle cx="50" cy="50" r="5" fill="${color}" fill-opacity="0.8"/><circle cx="50" cy="50" r="2" fill="white"/></svg>`;
}
/**
 * Animated filter pressure gauge with warning colors
 */
function filterGaugeSVG(pressure, maxPressure, _color) {
    const percent = Math.min(pressure / maxPressure, 1);
    const statusColor = percent > 0.8 ? '#FF5722' : percent > 0.6 ? '#FF9F0A' : '#34C759';
    return b` <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><!-- Outer ring --><circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2"/><!-- Background arc (full range) --><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="12" stroke-linecap="round"/><!-- Colored pressure arc --><circle cx="50" cy="50" r="40" fill="none" stroke="${statusColor}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${percent * 240} 240" style="will-change:stroke-dasharray;transform:rotate(-90deg);transform-origin:50px 50px;transition:stroke 0.4s ease, stroke-dasharray 0.6s cubic-bezier(0.34,1.4,0.64,1)"/><!-- Gauge labels --><text x="20" y="55" text-anchor="middle" font-size="10" fill="rgba(0,0,0,0.4)">0</text><text x="80" y="55" text-anchor="middle" font-size="10" fill="rgba(0,0,0,0.4)">${maxPressure}</text><!-- Center value display --><circle cx="50" cy="50" r="25" fill="white" fill-opacity="0.95"/><text x="50" y="48" text-anchor="middle" font-size="20" font-weight="bold" fill="${statusColor}">${Math.round(pressure)}</text><text x="50" y="60" text-anchor="middle" font-size="11" fill="rgba(0,0,0,0.5)">bar</text></svg>`;
}
/**
 * Animated chart/graph for sensor data
 */
function chartSVG(values, color) {
    if (!values || values.length === 0)
        values = [0];
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const points = values.map((v, i) => {
        const x = (i / (values.length - 1 || 1)) * 80 + 10;
        const y = 70 - ((v - min) / range) * 50;
        return `${x},${y}`;
    }).join(' ');
    return b` <svg viewBox="0 0 100 80" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"><!-- Grid --><line x1="10" y1="70" x2="90" y2="70" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/><!-- Chart line --><polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="will-change:stroke-dasharray;animation:line-draw 1.2s ease-out forwards;stroke-dasharray:${values.length * 2} ${values.length * 2}"/><!-- Area under line --><polygon points="10,70 ${points} 90,70" fill="${color}" fill-opacity="0.1"/><!-- Data points --> ${values.map((v, i) => { const x = (i / (values.length - 1 || 1)) * 80 + 10; const y = 70 - ((v - min) / range) * 50; return b `<circle cx="${x}" cy="${y}" r="1.5" fill="${color}" fill-opacity="0.6"/>`;
    })}
    </svg>`;
}

class VioletPoolCard extends i {
    setConfig(config) {
        if (!config.card_type) {
            throw new Error('You need to define a card_type');
        }
        if (config.card_type !== 'overview' && config.card_type !== 'system' && config.card_type !== 'details' && config.card_type !== 'chemical' && config.card_type !== 'cover' && config.card_type !== 'light' && !config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = {
            show_state: true,
            show_detail_status: true,
            show_controls: true,
            show_runtime: false,
            show_history: false,
            size: 'medium',
            theme: 'apple',
            animation: 'smooth',
            blur_intensity: 10,
            style: 'standard',
            show_flow_animation: false,
            entity_prefix: 'violet_pool',
            ...config,
        };
    }
    _buildEntityId(domain, suffix) {
        const prefix = this.config.entity_prefix || 'violet_pool';
        return `${domain}.${prefix}_${suffix}`;
    }
    _getEntityId(configKey, domain, suffix, entitiesIndex) {
        const configValue = this.config[configKey];
        if (configValue) {
            return configValue;
        }
        if (entitiesIndex !== undefined && this.config.entities && this.config.entities[entitiesIndex]) {
            return this.config.entities[entitiesIndex];
        }
        return this._buildEntityId(domain, suffix);
    }
    /**
     * Returns human-readable state label
     */
    _getFriendlyState(state, cardType) {
        const map = {
            'on': 'Active',
            'off': 'Off',
            'auto': 'Auto',
            'heat': 'Heating',
            'heating': 'Heating',
            'cool': 'Cooling',
            'cooling': 'Cooling',
            'idle': 'Idle',
            'unavailable': 'Unavailable',
            'unknown': 'Unknown',
            'manual': 'Manual',
        };
        if (cardType === 'pump' && state === 'on')
            return 'Running';
        return map[state] ?? state.charAt(0).toUpperCase() + state.slice(1);
    }
    /**
     * Returns percentage (0-100) of value within min-max range, clamped.
     */
    _getValuePercent(value, min, max) {
        if (max <= min)
            return 0;
        return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    }
    /**
     * Open more-info dialog for an entity
     */
    _showMoreInfo(entityId) {
        const event = new CustomEvent('hass-more-info', {
            detail: { entityId },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    render() {
        if (!this.config || !this.hass) {
            return b``;
        }
        if (this.config.entity) {
            const entity = this.hass.states[this.config.entity];
            if (!entity) {
                return b` <ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${this.config.entity}</span></div></div></ha-card> `;
            }
        }
        switch (this.config.card_type) {
            case 'pump':
                return this.renderPumpCard();
            case 'heater':
                return this.renderHeaterCard();
            case 'solar':
                return this.renderSolarCard();
            case 'dosing':
                return this.renderDosingCard();
            case 'overview':
                return this.renderOverviewCard();
            case 'compact':
                return this.renderCompactCard();
            case 'system':
                return this.renderSystemCard();
            case 'details':
                return this.renderDetailsCard();
            case 'chemical':
                return this.renderChemicalCard();
            case 'sensor':
                return this.renderSensorCard();
            case 'cover':
                return this.renderCoverCard();
            case 'light':
                return this.renderLightCard();
            case 'filter':
                return this.renderFilterCard();
            case 'statistics':
                return this.renderStatisticsCard();
            case 'weather':
                return this.renderWeatherCard();
            case 'maintenance':
                return this.renderMaintenanceCard();
            case 'alerts':
                return this.renderAlertsCard();
            case 'comparison':
                return this.renderComparisonCard();
            default:
                return b` <ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Unknown Card Type</span><span class="error-entity">${this.config.card_type}</span></div></div></ha-card> `;
        }
    }
    _getCardClasses(isActive, config) {
        const classes = [];
        classes.push(`size-${config.size || 'medium'}`);
        if (config.theme) {
            classes.push(`theme-${config.theme}`);
        }
        else {
            classes.push(config.style || 'standard');
        }
        if (config.animation && config.animation !== 'none') {
            classes.push(`animation-${config.animation}`);
        }
        if ((config.show_flow_animation || config.animation === 'energetic') && isActive) {
            classes.push('flow-active');
        }
        if (isActive) {
            classes.push('is-active');
        }
        return classes.join(' ');
    }
    /**
     * Render loading skeleton for entity while data loads
     */
    _renderLoadingSkeleton(config) {
        return b` <ha-card class="${this._getCardClasses(false, config)}"><div class="accent-bar" style="opacity: 0.3;"></div><div class="card-content"><div class="header"><div class="header-icon" style="background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite;"></div><div class="header-info"><div style="width: 120px; height: 18px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 4px; margin-bottom: 8px;"></div><div style="width: 80px; height: 14px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 4px;"></div></div></div><div style="margin-top: 12px; height: 48px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 8px;"></div><div style="margin-top: 12px; height: 44px; background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.05) 100%); background-size: 1000px 100%; animation: skeleton-loading 2s infinite; border-radius: 8px;"></div></div></ha-card> `;
    }
    /**
     * Get minutes since last entity update
     */
    _getMinutesSinceUpdate(entity) {
        if (!entity?.last_updated)
            return 0;
        const lastUpdate = new Date(entity.last_updated);
        const now = new Date();
        return Math.floor((now.getTime() - lastUpdate.getTime()) / 60000);
    }
    /**
     * Render timeout indicator if data is stale
     */
    _renderTimeoutIndicator(entity) {
        const minutesStale = this._getMinutesSinceUpdate(entity);
        if (minutesStale < 1)
            return b``;
        const isError = minutesStale > 30;
        const bgColor = isError ? 'rgba(255,59,48,0.08)' : 'rgba(255,159,10,0.08)';
        const borderColor = isError ? 'rgba(255,59,48,0.2)' : 'rgba(255,159,10,0.2)';
        const textColor = isError ? '#FF3B30' : '#FF9F0A';
        return b` <div style="padding: 8px 12px; border-radius: 8px; background: ${bgColor}; border: 1px solid ${borderColor}; font-size: 12px; color: ${textColor}; margin-top: 8px; display: flex; align-items: center; justify-content: space-between;"><span>⚠️ Daten ${minutesStale} Minute${minutesStale > 1 ? 'n' : ''} alt</span><button style="margin-left: 8px; padding: 4px 8px; background: ${textColor}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;" @click="${() => this.requestUpdate()}"> ↻ </button></div> `;
    }
    /**
     * Render Quick-Settings Panel with common pool actions
     */
    _renderQuickSettingsPanel() {
        const pumpEntityId = this._getEntityId('pump_entity', 'switch', 'pump', 0);
        const heaterEntityId = this._getEntityId('heater_entity', 'climate', 'heater', 1);
        return b` <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 12px; background: var(--vpc-surface); border-radius: 12px; margin-top: 12px;"><!-- Pump Presets --> ${[ { label: '⚡ Boost', speed: 3, icon: 'mdi:rocket' }, { label: '⚙️ Normal', speed: 2, icon: 'mdi:speedometer' }, { label: '🔋 Eco', speed: 1, icon: 'mdi:leaf' }, { label: '❌ Off', speed: 0, icon: 'mdi:power-off' }, ].map(preset => b `
          <button style="padding: 10px; border: 1px solid var(--vpc-text-secondary); border-radius: 8px; background: transparent; color: var(--vpc-text); font-weight: 600; cursor: pointer; font-size: 12px; transition: all 0.2s;"
                  @click="${(e) => {
            e.stopPropagation();
            if (preset.speed === 0) {
                this.hass.callService('switch', 'turn_off', { entity_id: pumpEntityId });
            }
            else {
                this.hass.callService('switch', 'turn_on', { entity_id: pumpEntityId, service_data: { speed: preset.speed } });
            }
        }}"
                  @mouseover="${(e) => { e.target.style.background = 'var(--vpc-primary)'; e.target.style.color = 'white'; }}"
                  @mouseout="${(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--vpc-text)'; }}">
            ${preset.label}
          </button>
        `)}

        <!-- Heater Controls -->
        <button style="padding: 10px; border: 1px solid var(--vpc-warning); border-radius: 8px; background: transparent; color: var(--vpc-warning); font-weight: 600; cursor: pointer; font-size: 12px; grid-column: span 2;"
                @click="${(e) => { e.stopPropagation(); this.hass.callService('climate', 'set_temperature', { entity_id: heaterEntityId, temperature: 26 }); }}">
          🔥 Heater +2°
        </button>
      </div>
    `;
    }
    /**
     * Get accent color for card type
     */
    _getAccentColor(cardType, config) {
        if (config.accent_color)
            return config.accent_color;
        switch (cardType) {
            case 'pump': return '#2196F3';
            case 'heater': return '#FF5722';
            case 'solar': return '#FF9800';
            case 'dosing': return '#4CAF50';
            case 'overview': return '#7C4DFF';
            case 'cover': return '#5AC8FA';
            case 'light': return '#AF52DE';
            case 'filter': return '#FF9500';
            case 'statistics': return '#3F51B5';
            case 'weather': return '#00BCD4';
            case 'maintenance': return '#FF5252';
            case 'alerts': return '#FF6F00';
            case 'comparison': return '#9C27B0';
            default: return '#2196F3';
        }
    }
    renderSystemCard() {
        const pumpEntity = this._getEntityId('pump_entity', 'switch', 'pump', 0);
        const heaterEntity = this._getEntityId('heater_entity', 'climate', 'heater', 1);
        const solarEntity = this._getEntityId('solar_entity', 'climate', 'solar', 2);
        const dosingEntity = this._getEntityId('chlorine_entity', 'switch', 'dos_1_cl', 3);
        const createSubConfig = (type, entity, extra = {}) => {
            if (type !== 'overview' && !this.hass.states[entity])
                return null;
            return {
                ...this.config,
                card_type: type,
                entity: entity,
                // Ensure entity_prefix is always propagated to sub-cards (bug fix)
                entity_prefix: this.config.entity_prefix || 'violet_pool',
                ...extra
            };
        };
        const coverEntitySys = this._getEntityId('cover_entity', 'cover', 'cover');
        const lightEntitySys = this._getEntityId('light_entity', 'light', 'light');
        const filterEntitySys = this._getEntityId('filter_entity', 'sensor', 'filter_pressure');
        const overviewConfig = createSubConfig('overview', '', { name: 'Pool Overview' });
        const pumpConfig = createSubConfig('pump', pumpEntity, { show_runtime: true });
        const heaterConfig = createSubConfig('heater', heaterEntity);
        const solarConfig = createSubConfig('solar', solarEntity);
        const dosingConfig = createSubConfig('dosing', dosingEntity, { dosing_type: 'chlorine' });
        const coverConfig = createSubConfig('cover', coverEntitySys);
        const lightConfig = createSubConfig('light', lightEntitySys);
        const filterConfig = createSubConfig('filter', filterEntitySys);
        return b` <div class="system-grid"> ${overviewConfig ? this.renderOverviewCard(overviewConfig) : ''} ${pumpConfig ? this.renderPumpCard(pumpConfig) : ''} ${heaterConfig ? this.renderHeaterCard(heaterConfig) : ''} ${solarConfig ? this.renderSolarCard(solarConfig) : ''} ${dosingConfig ? this.renderDosingCard(dosingConfig) : ''} ${coverConfig ? this.renderCoverCard(coverConfig) : ''} ${lightConfig ? this.renderLightCard(lightConfig) : ''} ${filterConfig ? this.renderFilterCard(filterConfig) : ''} </div> `;
    }
    renderPumpCard(config = this.config) {
        const entity = this.hass.states[config.entity];
        if (!entity)
            return this._renderLoadingSkeleton(config);
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Pump';
        const pumpState = entity.attributes?.PUMPSTATE || '';
        const accentColor = this._getAccentColor('pump', config);
        const parsedState = EntityHelper.parsePumpState(pumpState);
        const currentSpeed = parsedState.level !== undefined ? parsedState.level : 0;
        const rpmLevel0 = entity.attributes?.PUMP_RPM_0 || 0;
        const rpmLevel1 = entity.attributes?.PUMP_RPM_1 || 0;
        const rpmLevel2 = entity.attributes?.PUMP_RPM_2 || 0;
        const rpmLevel3 = entity.attributes?.PUMP_RPM_3 || 0;
        const rpmValues = [rpmLevel0, rpmLevel1, rpmLevel2, rpmLevel3];
        const currentRPM = rpmValues[currentSpeed] || 0;
        const runtimeSeconds = entity.attributes?.runtime || 0;
        const runtimeHours = Math.floor(runtimeSeconds / 3600);
        const runtimeMinutes = Math.floor((runtimeSeconds % 3600) / 60);
        const runtimeDisplay = runtimeHours > 0
            ? `${runtimeHours}h ${runtimeMinutes}min`
            : `${runtimeMinutes}min`;
        const speedColor = StateColorHelper.getPumpSpeedColor(currentSpeed);
        const isRunning = state === 'on' || currentSpeed > 0;
        const speedLabels = ['OFF', 'ECO', 'Normal', 'Boost'];
        const speedColors = ['#8E8E93', '#34C759', '#FF9F0A', '#FF3B30'];
        const speedIcons = ['mdi:power-off', 'mdi:speedometer-slow', 'mdi:speedometer-medium', 'mdi:speedometer'];
        return b` <ha-card class="${this._getCardClasses(isRunning, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isRunning ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${config.icon ? b `<ha-icon icon="${config.icon}" class="${isRunning ? 'pump-running' : ''}"></ha-icon>` : pumpSVG(currentSpeed, accentColor)}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle" style="${isRunning ? `color: ${speedColor.color}` : ''}">
                ${isRunning
            ? `${speedLabels[currentSpeed]}${currentRPM > 0 ? ` \u00B7 ${currentRPM} RPM` : ''}`
            : this._getFriendlyState(state, 'pump')}
              </span>
            </div>
            ${config.show_state
            ? b`<vpc-status-badge .state="${state}" .pulse="${isRunning}"></vpc-status-badge>`
            : ''}
          </div>

          <!-- Speed Segments Visual Indicator -->
          <div class="speed-segments-container">
            <div class="speed-segments">
              ${[1, 2, 3].map(level => {
            const speedHelp = [
                '',
                'ECO-Modus – Langsame Filtration, sehr energieeffizient. Ideal für Nacht-Grundzirkulation.',
                'Normal-Modus – Standard-Filtration für den täglichen Betrieb.',
                'Boost-Modus – Maximale Leistung. Für Rückspülung, Staubsaugen oder schnelles Chemikalien-Mischen.'
            ];
            return b` <button class="speed-segment tooltip-wrap ${currentSpeed === level ? 'seg-active' : currentSpeed > level ? 'seg-past' : ''}" style="--seg-color: ${speedColors[level]}" @click="${(e) => { e.stopPropagation(); const sc = new ServiceCaller(this.hass); sc.setPumpSpeed(config.entity, level); }}" ><ha-icon icon="${speedIcons[level]}" style="--mdc-icon-size: 14px"></ha-icon><span>${speedLabels[level]}</span><div class="t-tip t-up"><div class="t-tip-title">${speedLabels[level]}-Geschwindigkeit</div><div class="t-tip-desc">${speedHelp[level]}</div></div></button> `;
        })}
            </div>
            <button
              class="speed-off-btn tooltip-wrap ${currentSpeed === 0 ? 'seg-active' : ''}"
              style="--seg-color: ${speedColors[0]}"
              @click="${(e) => { e.stopPropagation(); const sc = new ServiceCaller(this.hass); sc.turnOff(config.entity); }}"
            >
              <ha-icon icon="mdi:power" style="--mdc-icon-size: 16px"></ha-icon>
              <div class="t-tip t-up">
                <div class="t-tip-title">Pumpe AUS</div>
                <div class="t-tip-desc">Pumpe vollständig ausschalten. Die Filtration wird gestoppt.</div>
              </div>
            </button>
          </div>

          ${config.show_detail_status && pumpState
            ? b`<vpc-detail-status .raw="${pumpState}"></vpc-detail-status>`
            : ''}

          ${config.show_controls
            ? b` <vpc-slider-control label="Speed Level" min="0" max="3" step="1" .value="${currentSpeed}" .labels="${['OFF', 'ECO', 'Normal', 'Boost']}" @value-changed="${(e) => this._handlePumpSpeedChange(e, config.entity)}" ></vpc-slider-control> `
            : ''}

          ${config.show_runtime && runtimeSeconds > 0
            ? b` <div class="info-row"><ha-icon icon="mdi:timer-outline"></ha-icon><span class="info-label">Runtime</span><span class="info-value">${runtimeDisplay}</span></div> `
            : ''}
        </div>
      </ha-card>
    `;
    }
    async _handlePumpSpeedChange(e, entityId) {
        const speed = e.detail.value;
        const serviceCaller = new ServiceCaller(this.hass);
        await serviceCaller.setPumpSpeed(entityId, speed);
    }
    renderHeaterCard(config = this.config) {
        const entity = this.hass.states[config.entity];
        if (!entity)
            return this._renderLoadingSkeleton(config);
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Heater';
        const accentColor = this._getAccentColor('heater', config);
        const currentTemp = EntityHelper.getCurrentTemperature(entity);
        const targetTemp = EntityHelper.getTargetTemperature(entity);
        const minTemp = EntityHelper.getMinTemperature(entity) || 18;
        const maxTemp = EntityHelper.getMaxTemperature(entity) || 35;
        const heaterState = entity.attributes?.HEATERSTATE || '';
        const outsideTemp = entity.attributes?.outside_temperature;
        const minOutsideTemp = entity.attributes?.min_outside_temperature || 14.5;
        const isBlockedByOutsideTemp = heaterState.includes('BLOCKED_BY_OUTSIDE_TEMP') ||
            (outsideTemp !== undefined && outsideTemp < minOutsideTemp);
        const tempColor = currentTemp !== undefined
            ? StateColorHelper.getTemperatureColor(currentTemp)
            : undefined;
        const quickActions = [
            {
                icon: 'mdi:power-off',
                label: 'OFF',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.setHvacMode(config.entity, 'off');
                },
                active: state === 'off',
                color: '#757575',
                confirmMessage: undefined,
            },
            {
                icon: 'mdi:autorenew',
                label: 'AUTO',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.setHvacMode(config.entity, 'auto');
                },
                active: state === 'auto',
                color: '#2196F3',
            },
            {
                icon: 'mdi:fire',
                label: 'HEAT',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.setHvacMode(config.entity, 'heat');
                },
                active: state === 'heat' || state === 'heating',
                color: '#FF5722',
            },
        ];
        const isHeating = state === 'heating' || state === 'heat';
        const tempPct = currentTemp !== undefined
            ? this._getValuePercent(currentTemp, minTemp, maxTemp)
            : undefined;
        const targetPct = targetTemp !== undefined
            ? this._getValuePercent(targetTemp, minTemp, maxTemp)
            : undefined;
        return b` <ha-card class="${this._getCardClasses(isHeating, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isHeating ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${config.icon ? b `<ha-icon icon="${config.icon}" class="${isHeating ? 'heater-active' : ''}"></ha-icon>` : heaterSVG(isHeating, accentColor)}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${this._getFriendlyState(state)}</span></div> ${config.show_state ? b`<vpc-status-badge .state="${state}"></vpc-status-badge>`
            : ''}
          </div>

          ${currentTemp !== undefined
            ? b` <div class="temp-hero tooltip-wrap" style="--temp-color: ${tempColor?.color || 'var(--vpc-primary)'}; position: relative;"><div class="temp-hero-main"><span class="temp-hero-value">${currentTemp.toFixed(1)}</span><span class="temp-hero-unit">°C</span></div> ${targetTemp !== undefined ? b `
                        <div class="temp-hero-target-pill">
                          <ha-icon icon="mdi:target" style="--mdc-icon-size: 13px"></ha-icon>
                          <span>${targetTemp.toFixed(1)}°C</span>
                        </div>
                      `
                : ''}
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:thermometer-water"></ha-icon>Wassertemperatur</div>
                  <div class="t-tip-desc">Aktuelle Pooltemperatur${targetTemp !== undefined ? `. Ziel: ${targetTemp.toFixed(1)}°C` : ''}. ${currentTemp < 24 ? 'Noch kalt zum Schwimmen.' : currentTemp <= 30 ? 'Ideale Badetemperatur.' : 'Etwas warm – Heizung prüfen.'}</div>
                  <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>24°C – 30°C Komfort</div>
                </div>
                </div>
                ${tempPct !== undefined
                ? b` <div class="temp-range-bar"><div class="temp-range-track"><div class="temp-range-fill" style="width: ${tempPct}%; background: ${tempColor?.color || accentColor}"></div> ${targetPct !== undefined ? b `<div class="temp-range-target" style="left: ${targetPct}%"></div>`
                    : ''}
                        </div>
                        <div class="temp-range-labels">
                          <span>${minTemp}°C</span>
                          <span>${maxTemp}°C</span>
                        </div>
                      </div>
                    `
                : ''}
              `
            : ''}

          ${config.show_detail_status && heaterState
            ? b`<vpc-detail-status .raw="${heaterState}"></vpc-detail-status>`
            : ''}

          ${outsideTemp !== undefined
            ? b` <div class="info-row tooltip-wrap ${isBlockedByOutsideTemp ? 'info-row-warning' : ''}" style="position:relative"><ha-icon icon="mdi:thermometer"></ha-icon><span class="info-label">Außentemperatur</span><span class="info-value">${outsideTemp.toFixed(1)}°C</span> ${isBlockedByOutsideTemp ? b `<span class="info-badge warning">Min ${minOutsideTemp}°C</span>`
                : ''}
                <div class="t-tip">
                  <div class="t-tip-title"><ha-icon icon="mdi:thermometer-alert"></ha-icon>Außentemperatur</div>
                  <div class="t-tip-desc">${isBlockedByOutsideTemp ? `Heizung gesperrt! Außentemperatur (${outsideTemp.toFixed(1)}°C) liegt unter dem Minimum von ${minOutsideTemp}°C. Frostschutz aktiv.` : `Aktuelle Außentemperatur. Heizung wird bei unter ${minOutsideTemp}°C Außentemperatur gesperrt (Frostschutz).`}</div>
                  ${isBlockedByOutsideTemp ? b`<div class="t-tip-warn"><ha-icon icon="mdi:snowflake-alert"></ha-icon>Heizung gesperrt</div>` : ''}
                </div>
                </div>
              `
            : ''}

          ${config.show_controls
            ? b` ${targetTemp !== undefined ? b `
                      <vpc-slider-control
                        label="Target Temperature"
                        .min="${minTemp}"
                        .max="${maxTemp}"
                        step="0.5"
                        .value="${targetTemp}"
                        unit="°C"
                        showMinMax
                        @value-changed="${(e) => this._handleTemperatureChange(e, config.entity)}"
                      ></vpc-slider-control>
                    `
                : ''}
                <vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>
              `
            : ''}
        </div>
      </ha-card>
    `;
    }
    async _handleTemperatureChange(e, entityId) {
        const temperature = e.detail.value;
        const serviceCaller = new ServiceCaller(this.hass);
        await serviceCaller.setTemperature(entityId, temperature);
    }
    renderSolarCard(config = this.config) {
        const entity = this.hass.states[config.entity];
        if (!entity)
            return this._renderLoadingSkeleton(config);
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Solar';
        const accentColor = this._getAccentColor('solar', config);
        const poolTemp = EntityHelper.getCurrentTemperature(entity);
        const targetTemp = EntityHelper.getTargetTemperature(entity);
        const minTemp = EntityHelper.getMinTemperature(entity) || 18;
        const maxTemp = EntityHelper.getMaxTemperature(entity) || 32;
        const absorberTemp = entity.attributes?.absorber_temperature;
        const tempDelta = absorberTemp !== undefined && poolTemp !== undefined
            ? absorberTemp - poolTemp
            : undefined;
        const solarState = entity.attributes?.SOLARSTATE || '';
        const quickActions = [
            {
                icon: 'mdi:power-off',
                label: 'OFF',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.setHvacMode(config.entity, 'off');
                },
                active: state === 'off',
                color: '#757575',
            },
            {
                icon: 'mdi:autorenew',
                label: 'AUTO',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.setHvacMode(config.entity, 'auto');
                },
                active: state === 'auto',
                color: '#2196F3',
            },
            {
                icon: 'mdi:sun-thermometer',
                label: 'ON',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.setHvacMode(config.entity, 'heat');
                },
                active: state === 'heat' || state === 'heating',
                color: '#FF9800',
            },
        ];
        const isSolarActive = state === 'heating' || state === 'heat';
        const poolTempPct = poolTemp !== undefined
            ? this._getValuePercent(poolTemp, minTemp, maxTemp)
            : undefined;
        const targetTempPct = targetTemp !== undefined
            ? this._getValuePercent(targetTemp, minTemp, maxTemp)
            : undefined;
        return b` <ha-card class="${this._getCardClasses(isSolarActive, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isSolarActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${config.icon ? b `<ha-icon icon="${config.icon}" class="${isSolarActive ? 'solar-active' : ''}"></ha-icon>` : solarSVG(isSolarActive, accentColor)}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${this._getFriendlyState(state)}</span></div> ${config.show_state ? b`<vpc-status-badge .state="${state}"></vpc-status-badge>`
            : ''}
          </div>

          ${config.show_detail_status && solarState
            ? b`<vpc-detail-status .raw="${solarState}"></vpc-detail-status>`
            : ''}

          <div class="solar-temps">
            <!-- Solar temperature comparison: pool vs absorber -->
            <div class="solar-temp-comparison">
              ${poolTemp !== undefined
            ? b` <div class="solar-temp-tile"><ha-icon icon="mdi:pool" style="--mdc-icon-size: 18px"></ha-icon><div class="solar-temp-tile-val">${poolTemp.toFixed(1)}°C</div><div class="solar-temp-tile-label">Pool</div></div> `
            : ''}
              ${tempDelta !== undefined
            ? b` <div class="solar-delta-badge tooltip-wrap ${tempDelta >= 3 ? 'delta-great' : tempDelta > 0 ? 'delta-ok' : 'delta-low'}" style="position:relative"><ha-icon icon="${tempDelta >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'}" style="--mdc-icon-size: 16px"></ha-icon><span>${tempDelta > 0 ? '+' : ''}${tempDelta.toFixed(1)}°C</span><div class="t-tip"><div class="t-tip-title"><ha-icon icon="mdi:delta"></ha-icon>Temperaturdifferenz</div><div class="t-tip-desc">Differenz zwischen Absorber (Kollektor) und Pool. ${tempDelta >= 3 ? 'Sehr gute Solarbedingungen! Heizung wird aktiv.' : tempDelta > 0 ? 'Solarbeheizung möglich, aber noch schwach.' : 'Absorber kälter als Pool – keine Solarheizung möglich.'}</div><div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>&gt; 3°C für aktive Solarheizung</div></div></div> `
            : ''}
              ${absorberTemp !== undefined
            ? b` <div class="solar-temp-tile"><ha-icon icon="mdi:solar-panel" style="--mdc-icon-size: 18px"></ha-icon><div class="solar-temp-tile-val">${absorberTemp.toFixed(1)}°C</div><div class="solar-temp-tile-label">Absorber</div></div> `
            : ''}
            </div>
            ${poolTempPct !== undefined
            ? b` <div class="temp-range-bar"><div class="temp-range-track"><div class="temp-range-fill" style="width: ${poolTempPct}%; background: ${accentColor}"></div> ${targetTempPct !== undefined ? b `<div class="temp-range-target" style="left: ${targetTempPct}%"></div>`
                : ''}
                    </div>
                    <div class="temp-range-labels">
                      <span>${minTemp}°C</span>
                      <span>${maxTemp}°C</span>
                    </div>
                  </div>
                `
            : ''}
            ${tempDelta !== undefined
            ? b` <div class="delta-hint-text"> ${tempDelta < 0 ? '❄ Too cold for solar heating' : tempDelta < 3 ? '⚡ Solar heating possible' : '☀ Ideal conditions for solar heating'} </div> `
            : ''}
          </div>

          ${config.show_controls
            ? b` ${targetTemp !== undefined ? b `
                      <vpc-slider-control
                        label="Target Temperature"
                        .min="${minTemp}"
                        .max="${maxTemp}"
                        step="0.5"
                        .value="${targetTemp}"
                        unit="°C"
                        showMinMax
                        @value-changed="${(e) => this._handleTemperatureChange(e, config.entity)}"
                      ></vpc-slider-control>
                    `
                : ''}
                <vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>
              `
            : ''}
        </div>
      </ha-card>
    `;
    }
    renderDosingCard(config = this.config) {
        const entity = this.hass.states[config.entity];
        if (!entity)
            return this._renderLoadingSkeleton(config);
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Dosing';
        const accentColor = this._getAccentColor('dosing', config);
        const dosingType = config.dosing_type || this._detectDosingType(config.entity);
        const dosingStateKey = Object.keys(entity.attributes || {}).find((key) => key.includes('DOS_') && key.includes('_STATE'));
        const dosingState = dosingStateKey ? entity.attributes[dosingStateKey] : [];
        let currentValue;
        let targetValue;
        let minValue;
        let maxValue;
        let unit = '';
        if (dosingType === 'chlorine') {
            const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value');
            const orpSensor = this.hass.states[orpSensorId];
            currentValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
            const targetOrpId = this._getEntityId('target_orp_entity', 'number', 'target_orp');
            const targetEntity = this.hass.states[targetOrpId];
            targetValue = targetEntity ? parseFloat(targetEntity.state) : undefined;
            minValue = targetEntity?.attributes?.min || 600;
            maxValue = targetEntity?.attributes?.max || 800;
            unit = 'mV';
        }
        else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
            const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value');
            const phSensor = this.hass.states[phSensorId];
            currentValue = phSensor ? parseFloat(phSensor.state) : undefined;
            const targetPhId = this._getEntityId('target_ph_entity', 'number', 'target_ph');
            const targetEntity = this.hass.states[targetPhId];
            targetValue = targetEntity ? parseFloat(targetEntity.state) : undefined;
            minValue = targetEntity?.attributes?.min || 6.8;
            maxValue = targetEntity?.attributes?.max || 7.8;
            unit = '';
        }
        const dosingVolume24h = entity.attributes?.dosing_volume_24h;
        const quickActions = [
            {
                icon: 'mdi:power-off',
                label: 'OFF',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.turnOff(config.entity);
                },
                active: state === 'off',
                color: '#757575',
            },
            {
                icon: 'mdi:autorenew',
                label: 'AUTO',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.turnOn(config.entity);
                },
                active: state === 'on' || state === 'auto',
                color: '#2196F3',
            },
            {
                icon: 'mdi:play-circle',
                label: 'Dose 30s',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.manualDosing(config.entity, 30);
                },
                color: '#4CAF50',
                confirmMessage: 'Start manual dosing for 30 seconds?',
            },
            {
                icon: 'mdi:play-speed',
                label: 'Dose 60s',
                action: async () => {
                    const serviceCaller = new ServiceCaller(this.hass);
                    await serviceCaller.manualDosing(config.entity, 60);
                },
                color: '#FF9800',
                confirmMessage: 'Start manual dosing for 60 seconds?',
            },
        ];
        // Safely check dosingState is an array before calling .some()
        const isDosing = state === 'on' && Array.isArray(dosingState) && dosingState.some((s) => s.includes('ACTIVE'));
        // Get color and percent for current value
        const valueColor = currentValue !== undefined
            ? dosingType === 'chlorine'
                ? StateColorHelper.getOrpColor(currentValue, targetValue)
                : StateColorHelper.getPhColor(currentValue, targetValue)
            : undefined;
        const valuePct = currentValue !== undefined && minValue !== undefined && maxValue !== undefined
            ? this._getValuePercent(currentValue, minValue, maxValue)
            : undefined;
        const targetPct = targetValue !== undefined && minValue !== undefined && maxValue !== undefined
            ? this._getValuePercent(targetValue, minValue, maxValue)
            : undefined;
        const decimals = dosingType === 'chlorine' ? 0 : 1;
        const dosingLabel = dosingType === 'chlorine' ? 'ORP' : dosingType === 'ph_minus' ? 'pH' : dosingType === 'ph_plus' ? 'pH' : 'Floc';
        const valueStatusLabel = valueColor
            ? (dosingType === 'chlorine'
                ? (currentValue < (targetValue ?? 650) ? 'Low' : currentValue > (targetValue ?? 750) ? 'High' : 'Optimal')
                : (currentValue < 7.0 ? 'Acidic' : currentValue > 7.4 ? 'Alkaline' : 'Optimal'))
            : '';
        return b` <ha-card class="${this._getCardClasses(isDosing, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity)}" ><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isDosing ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">${isDosing ? dosingDropletSVG(isDosing, currentValue ? (currentValue / (maxValue || 100)) * 100 : 50, accentColor) : b `<ha-icon icon="${config.icon || this._getDosingIcon(dosingType)}" class="${isDosing ? 'dosing-active' : ''}" ></ha-icon>`}</div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${this._getFriendlyState(state)}</span></div> ${config.show_state ? b`<vpc-status-badge .state="${state}" .pulse="${isDosing}"></vpc-status-badge>`
            : ''}
          </div>

          ${currentValue !== undefined
            ? b` <!-- Dosing value hero with progress bar --><div class="dosing-value-block tooltip-wrap" style="position:relative"><div class="dosing-value-row"><div class="dosing-value-main" style="color: ${valueColor?.color || 'var(--vpc-text)'}"><span class="dosing-label-tag">${dosingLabel}</span><span class="dosing-current-value">${currentValue.toFixed(decimals)}</span><span class="dosing-current-unit">${unit}</span></div><div class="dosing-status-pill" style="background: ${valueColor?.color ? valueColor.color + '18' : 'rgba(0,0,0,0.05)'}; color: ${valueColor?.color || 'var(--vpc-text-secondary)'}"> ${valueStatusLabel} </div></div><div class="t-tip t-up"><div class="t-tip-title"><ha-icon icon="${this._getDosingIcon(dosingType)}"></ha-icon>${dosingType === 'chlorine' ? 'ORP – Chlorwirksamkeit' : 'pH-Wert'}</div><div class="t-tip-desc">${dosingType === 'chlorine' ? `Redoxpotential (ORP) zeigt, wie wirksam das Chlor Keime abtötet. Aktuell: ${currentValue.toFixed(0)} mV${targetValue !== undefined ? `, Ziel: ${targetValue.toFixed(0)} mV` : ''}.` : `pH-Wert des Poolwassers. Aktuell: ${currentValue.toFixed(1)}${targetValue !== undefined ? `, Ziel: ${targetValue.toFixed(1)}` : ''}.`}</div>
                <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>${dosingType === 'chlorine' ? '650 – 750 mV Optimal' : '7.0 – 7.4 Optimal'}</div>
              </div> ${valuePct !== undefined ? b` <div class="chem-range-bar"><div class="chem-range-track"><div class="chem-range-fill" style="width: ${valuePct}%; background: ${valueColor?.color || accentColor}"></div> ${targetPct !== undefined ? b ` <div class="chem-range-target" style="left: ${targetPct}%"><div class="chem-target-line"></div><div class="chem-target-label">${targetValue.toFixed(decimals)}${unit}</div></div> `
                : ''}
                          </div>
                          <div class="chem-range-labels">
                            <span>${minValue.toFixed(decimals)}${unit}</span>
                            <span>${maxValue.toFixed(decimals)}${unit}</span>
                          </div>
                        </div>
                      `
                : ''}
                </div>
              `
            : ''}

          ${config.show_detail_status && Array.isArray(dosingState) && dosingState.length > 0
            ? b`<vpc-warning-chips .warnings="${dosingState}" defaultType="warning"></vpc-warning-chips>`
            : ''}

          ${config.show_controls
            ? b`<vpc-quick-actions .actions="${quickActions}"></vpc-quick-actions>`
            : ''}

          ${config.show_history && dosingVolume24h !== undefined
            ? b` <div class="info-row"><ha-icon icon="mdi:chart-line"></ha-icon><span class="info-label">Last 24h</span><span class="info-value">${dosingVolume24h}ml</span></div> `
            : ''}
        </div>
      </ha-card>
    `;
    }
    _detectDosingType(entity) {
        if (entity.includes('_cl'))
            return 'chlorine';
        if (entity.includes('_phm'))
            return 'ph_minus';
        if (entity.includes('_php'))
            return 'ph_plus';
        if (entity.includes('_floc'))
            return 'flocculant';
        return 'chlorine';
    }
    _getDosingIcon(dosingType) {
        switch (dosingType) {
            case 'chlorine': return 'mdi:flask-outline';
            case 'ph_minus': return 'mdi:flask-minus';
            case 'ph_plus': return 'mdi:flask-plus';
            case 'flocculant': return 'mdi:flask';
            default: return 'mdi:flask-outline';
        }
    }
    renderOverviewCard(config = this.config) {
        const name = config.name || 'Pool Status';
        const accentColor = this._getAccentColor('overview', config);
        const pumpEntityId = this._getEntityId('pump_entity', 'switch', 'pump', 0);
        const heaterEntityId = this._getEntityId('heater_entity', 'climate', 'heater', 1);
        const solarEntityId = this._getEntityId('solar_entity', 'climate', 'solar', 2);
        const chlorineEntityId = this._getEntityId('chlorine_entity', 'switch', 'dos_1_cl', 3);
        const phEntityId = this._getEntityId('ph_minus_entity', 'switch', 'dos_2_phm', 4);
        const pumpEntity = this.hass.states[pumpEntityId];
        const heaterEntity = this.hass.states[heaterEntityId];
        const solarEntity = this.hass.states[solarEntityId];
        const chlorineEntity = this.hass.states[chlorineEntityId];
        const phEntity = this.hass.states[phEntityId];
        const poolTempSensorId = this._getEntityId('pool_temp_entity', 'sensor', 'temperature', 5);
        const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value', 6);
        const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value', 7);
        const poolTempSensor = this.hass.states[poolTempSensorId];
        const phSensor = this.hass.states[phSensorId];
        const orpSensor = this.hass.states[orpSensorId];
        const poolTemp = poolTempSensor ? parseFloat(poolTempSensor.state) : undefined;
        const phValue = phSensor ? parseFloat(phSensor.state) : undefined;
        const orpValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
        // Color-coded values
        const tempColor = poolTemp !== undefined ? StateColorHelper.getTemperatureColor(poolTemp) : undefined;
        const phColor = phValue !== undefined ? StateColorHelper.getPhColor(phValue) : undefined;
        const orpColor = orpValue !== undefined ? StateColorHelper.getOrpColor(orpValue) : undefined;
        const getPhStatus = (ph) => {
            if (ph === undefined || isNaN(ph))
                return 'unknown';
            if (ph < 7.0 || ph > 7.4)
                return 'warning';
            return 'ok';
        };
        const getOrpStatus = (orp) => {
            if (orp === undefined || isNaN(orp))
                return 'unknown';
            if (orp < 650)
                return 'warning';
            if (orp > 750)
                return 'high';
            return 'ok';
        };
        const phStatus = getPhStatus(phValue);
        const orpStatus = getOrpStatus(orpValue);
        const activeDevices = [];
        if (pumpEntity) {
            const pumpState = pumpEntity.attributes?.PUMPSTATE || '';
            const parsedPumpState = EntityHelper.parsePumpState(pumpState);
            activeDevices.push({
                icon: 'mdi:pump',
                name: 'Pump',
                status: parsedPumpState.status || pumpEntity.state,
                state: pumpEntity.state,
                entityId: pumpEntityId,
            });
        }
        if (heaterEntity) {
            const heaterState = heaterEntity.attributes?.HEATERSTATE || '';
            const parsedHeaterState = EntityHelper.parseHeaterState(heaterState);
            activeDevices.push({
                icon: 'mdi:radiator',
                name: 'Heater',
                status: parsedHeaterState.status || heaterEntity.state,
                state: heaterEntity.state,
                entityId: heaterEntityId,
            });
        }
        if (solarEntity) {
            const solarState = solarEntity.attributes?.SOLARSTATE || '';
            const parsedSolarState = EntityHelper.parseSolarState(solarState);
            activeDevices.push({
                icon: 'mdi:solar-power',
                name: 'Solar',
                status: parsedSolarState.status || solarEntity.state,
                state: solarEntity.state,
                entityId: solarEntityId,
            });
        }
        if (chlorineEntity) {
            const clState = chlorineEntity.attributes?.DOS_1_CL_STATE || [];
            const statusText = Array.isArray(clState) && clState.length > 0
                ? EntityHelper.formatSnakeCase(clState[0])
                : chlorineEntity.state;
            activeDevices.push({
                icon: 'mdi:flask-outline',
                name: 'Chlorine',
                status: statusText,
                state: chlorineEntity.state,
                entityId: chlorineEntityId,
            });
        }
        if (phEntity) {
            const phState = phEntity.attributes?.DOS_2_PHM_STATE || [];
            const statusText = Array.isArray(phState) && phState.length > 0
                ? EntityHelper.formatSnakeCase(phState[0])
                : phEntity.state;
            activeDevices.push({
                icon: 'mdi:flask-minus',
                name: 'pH-',
                status: statusText,
                state: phEntity.state,
                entityId: phEntityId,
            });
        }
        // Cover entity
        const coverEntityId = this._getEntityId('cover_entity', 'cover', 'cover');
        const coverEntity = this.hass.states[coverEntityId];
        if (coverEntity) {
            const pos = coverEntity.attributes?.current_position;
            const isMoving = coverEntity.state === 'opening' || coverEntity.state === 'closing';
            activeDevices.push({
                icon: coverEntity.state === 'open' ? 'mdi:window-shutter-open' : isMoving ? 'mdi:window-shutter' : 'mdi:window-shutter',
                name: coverEntity.attributes.friendly_name || 'Abdeckung',
                status: pos !== undefined ? `${Math.round(pos)}%${isMoving ? (coverEntity.state === 'opening' ? ' ↑' : ' ↓') : ''}` : (coverEntity.state === 'open' ? 'Offen' : 'Zu'),
                state: coverEntity.state === 'open' ? 'on' : coverEntity.state === 'closed' ? 'off' : 'auto',
                entityId: coverEntityId,
            });
        }
        // Light entity
        const lightEntityId = this._getEntityId('light_entity', 'light', 'light');
        const lightEntity = this.hass.states[lightEntityId];
        if (lightEntity) {
            const br = lightEntity.attributes?.brightness;
            const brText = br !== undefined ? ` · ${Math.round(br / 255 * 100)}%` : '';
            activeDevices.push({
                icon: lightEntity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off-outline',
                name: lightEntity.attributes.friendly_name || 'Beleuchtung',
                status: lightEntity.state === 'on' ? `An${brText}` : 'Aus',
                state: lightEntity.state,
                entityId: lightEntityId,
            });
        }
        const warnings = [];
        // Filter entity
        const filterEntityId = this._getEntityId('filter_entity', 'sensor', 'filter_pressure');
        const filterEntity = this.hass.states[filterEntityId];
        if (filterEntity) {
            const pressureVal = parseFloat(filterEntity.state);
            activeDevices.push({
                icon: 'mdi:filter',
                name: filterEntity.attributes.friendly_name || 'Filter',
                status: !isNaN(pressureVal) ? `${pressureVal.toFixed(2)} bar` : filterEntity.state,
                state: !isNaN(pressureVal) && pressureVal > 1.2 ? 'auto' : 'on',
                entityId: filterEntityId,
            });
        }
        if (orpStatus === 'warning')
            warnings.push('ORP too low - Check chlorine dosing');
        if (orpStatus === 'high')
            warnings.push('ORP too high - Stop chlorine dosing');
        if (phStatus === 'warning')
            warnings.push('pH out of range - Check dosing');
        if (pumpEntity?.attributes?.PUMPSTATE?.includes('ANTI_FREEZE')) {
            const outsideTemp = heaterEntity?.attributes?.outside_temperature;
            warnings.push(`Frost protection active${outsideTemp ? ` (${outsideTemp.toFixed(1)}°C)` : ''}`);
        }
        const anyActive = activeDevices.some(d => ['on', 'auto', 'heat', 'heating'].includes(d.state));
        const activeCount = activeDevices.filter(d => ['on', 'auto', 'heat', 'heating'].includes(d.state)).length;
        // Progress percentages for chemistry tiles
        const tempPct = poolTemp !== undefined ? this._getValuePercent(poolTemp, 18, 35) : undefined;
        const phPct = phValue !== undefined ? this._getValuePercent(phValue, 6.5, 8.0) : undefined;
        const orpPct = orpValue !== undefined ? this._getValuePercent(orpValue, 500, 900) : undefined;
        // Ideal zone positions for range bar (pH: 7.0-7.4, ORP: 650-750)
        const phIdealStartPct = this._getValuePercent(7.0, 6.5, 8.0);
        const phIdealEndPct = this._getValuePercent(7.4, 6.5, 8.0);
        const orpIdealStartPct = this._getValuePercent(650, 500, 900);
        const orpIdealEndPct = this._getValuePercent(750, 500, 900);
        return b` <ha-card class="${this._getCardClasses(anyActive, config)}" style="--card-accent: ${accentColor}" ><div class="accent-bar"></div><div class="card-content"><!-- Header --><div class="header"><div class="header-icon ${anyActive ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}"><ha-icon icon="mdi:pool"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle"> ${anyActive ? `${activeCount} device${activeCount !== 1 ? 's' : ''} active` : 'All systems idle'}
              </span>
            </div>
            ${warnings.length > 0
            ? b`<div class="overview-warning-badge">${warnings.length}</div>`
            : anyActive
                ? b`<div class="overview-active-dot"></div>`
                : ''}
          </div>

          <!-- Water Chemistry - Apple Health style metric tiles -->
          <div class="chemistry-grid">
            ${poolTemp !== undefined
            ? b` <div class="chemistry-card tooltip-wrap" style="--chem-color: ${tempColor?.color || '#4CAF50'}" @click="${(e) => { e.stopPropagation(); this._showMoreInfo(poolTempSensorId); }}"><div class="chem-icon-wrap"><ha-icon icon="mdi:thermometer-water"></ha-icon></div><span class="chemistry-val">${poolTemp.toFixed(1)}°</span><span class="chemistry-unit">°C</span><span class="chemistry-label">${poolTemp < 22 ? 'Kalt' : poolTemp < 26 ? 'OK' : poolTemp <= 30 ? 'Ideal' : 'Warm'}</span> ${tempPct !== undefined ? b `<div class="chem-mini-bar"><div class="chem-mini-ideal" style="left:${this._getValuePercent(24, 18, 35)}%;width:${this._getValuePercent(30, 18, 35) - this._getValuePercent(24, 18, 35)}%"></div><div class="chem-mini-fill" style="width: ${tempPct}%; background: ${tempColor?.color || '#4CAF50'}"></div></div>`
                : ''}
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:thermometer-water"></ha-icon>Wassertemperatur</div>
                    <div class="t-tip-desc">Aktuelle Pooltemperatur. Der grüne Bereich zeigt die Komfortzone zum Schwimmen.</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>24°C – 30°C Komfort</div>
                  </div>
                  </div>
                `
            : ''}
            ${phValue !== undefined
            ? b` <div class="chemistry-card tooltip-wrap" style="--chem-color: ${phColor?.color || '#4CAF50'}" @click="${(e) => { e.stopPropagation(); this._showMoreInfo(phSensorId); }}"><div class="chem-icon-wrap"><ha-icon icon="mdi:ph"></ha-icon></div><span class="chemistry-val">${phValue.toFixed(1)}</span><span class="chemistry-unit">pH</span><span class="chemistry-label">${phStatus === 'ok' ? 'Optimal' : 'Achtung'}</span> ${phPct !== undefined ? b `
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${phIdealStartPct}%; width: ${phIdealEndPct - phIdealStartPct}%"></div>
                            <div class="chem-mini-fill" style="width: ${phPct}%; background: ${phColor?.color || '#4CAF50'}"></div>
                          </div>
                        `
                : ''}
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:ph"></ha-icon>pH-Wert</div>
                    <div class="t-tip-desc">Misst den Säuregehalt des Wassers. Zu niedrig: reizt Haut/Augen. Zu hoch: Chlor verliert Wirkung.</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>7.0 – 7.4 Optimal</div>
                    ${phValue < 7.0 ? b`<div class="t-tip-warn"><ha-icon icon="mdi:arrow-up"></ha-icon>pH+ zugeben zum Erhöhen</div>` : phValue > 7.4 ? b`<div class="t-tip-warn"><ha-icon icon="mdi:arrow-down"></ha-icon>pH- zugeben zum Senken</div>` : ''}
                  </div>
                  </div>
                `
            : ''}
            ${orpValue !== undefined
            ? b` <div class="chemistry-card tooltip-wrap" style="--chem-color: ${orpColor?.color || '#4CAF50'}" @click="${(e) => { e.stopPropagation(); this._showMoreInfo(orpSensorId); }}"><div class="chem-icon-wrap"><ha-icon icon="mdi:lightning-bolt"></ha-icon></div><span class="chemistry-val">${orpValue.toFixed(0)}</span><span class="chemistry-unit">mV</span><span class="chemistry-label">${orpStatus === 'ok' ? 'Optimal' : orpStatus === 'warning' ? 'Niedrig' : 'Hoch'}</span> ${orpPct !== undefined ? b `
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${orpIdealStartPct}%; width: ${orpIdealEndPct - orpIdealStartPct}%"></div>
                            <div class="chem-mini-fill" style="width: ${orpPct}%; background: ${orpColor?.color || '#4CAF50'}"></div>
                          </div>
                        `
                : ''}
                  <div class="t-tip">
                    <div class="t-tip-title"><ha-icon icon="mdi:lightning-bolt"></ha-icon>ORP – Desinfektionskraft</div>
                    <div class="t-tip-desc">Redoxpotential zeigt, wie wirksam das Chlor Bakterien abtöten kann. Zu niedrig = unzureichende Desinfektion.</div>
                    <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>650 – 750 mV Optimal</div>
                    ${orpValue < 650 ? b`<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>Chlordosierung erhöhen</div>` : orpValue > 750 ? b`<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>Chlordosierung reduzieren</div>` : ''}
                  </div>
                  </div>
                `
            : ''}
          </div>

          <!-- Quick Settings Panel -->
          ${config.show_controls !== false ? this._renderQuickSettingsPanel() : ''}

          <!-- Device List - clean rows -->
          ${activeDevices.length > 0
            ? b` <div class="overview-section"><div class="section-title"><span>Devices</span><span class="section-count">${activeDevices.length}</span></div><div class="device-list"> ${activeDevices.map((device) => b `
                        <div class="device-row"
                          @click="${(e) => { e.stopPropagation(); this._showMoreInfo(device.entityId); }}">
                          <div class="device-icon-wrap ${['on', 'auto', 'heat', 'heating'].includes(device.state) ? 'device-icon-active' : ''}">
                            <ha-icon icon="${device.icon}"></ha-icon>
                          </div>
                          <div class="device-info">
                            <span class="device-name">${device.name}</span>
                            <span class="device-status">${device.status}</span>
                          </div>
                          <div class="device-dot ${['on', 'auto', 'heat', 'heating'].includes(device.state) ? 'dot-active' : 'dot-inactive'}"></div>
                        </div>
                      `)}
                  </div>
                </div>
              `
            : ''}

          <!-- Warnings / All OK -->
          ${warnings.length > 0
            ? b` <div class="overview-section"><div class="section-title warning-title"><ha-icon icon="mdi:alert-outline" style="--mdc-icon-size: 14px"></ha-icon><span>Alerts</span></div><div class="warning-list"> ${warnings.map((warning) => b `
                        <div class="warning-row">
                          <ha-icon icon="${warning.includes('Frost') ? 'mdi:snowflake-alert' : 'mdi:alert-circle'}" style="--mdc-icon-size: 16px"></ha-icon>
                          <span>${warning}</span>
                        </div>
                      `)}
                  </div>
                </div>
              `
            : b` <div class="all-ok-display"><ha-icon icon="mdi:check-circle" style="--mdc-icon-size: 18px"></ha-icon><span>All systems normal</span></div> `}
        </div>
      </ha-card>
    `;
    }
    renderDetailsCard(config = this.config) {
        const title = config.name || config.title || 'Details';
        const entities = config.entities || [];
        const icon = config.icon;
        if (!entities.length) {
            return b` <ha-card class="theme-${config.theme || 'luxury'} size-${config.size || 'medium'}"><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">No Entities Configured</span><span class="error-entity">Please provide 'entities' list in card config</span></div></div></ha-card> `;
        }
        return b` <ha-card class="theme-${config.theme || 'luxury'} size-${config.size || 'medium'}"><div class="card-content" style="padding: var(--vpc-spacing, 16px);"> ${b `
          <div class="card-header" style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            ${icon ? b`<div class="header-icon" style="width:38px;height:38px;border-radius:10px;background:var(--vpc-surface);display:flex;align-items:center;justify-content:center;color:var(--vpc-primary);"><ha-icon icon="${icon}"></ha-icon></div>` : ''}
            <div class="name" style="font-size:16px;font-weight:600;color:var(--vpc-text);margin:0;">${title}</div>
          </div>
          ` }
          <div class="device-list">
            ${entities.map(entityConf => {
            let entityId = '';
            let entityName = '';
            let entityIcon = '';
            if (typeof entityConf === 'string') {
                entityId = entityConf;
            }
            else {
                entityId = entityConf.entity;
                entityName = entityConf.name;
                entityIcon = entityConf.icon;
            }
            const stateObj = this.hass.states[entityId];
            if (!stateObj) {
                return b` <div class="device-row"><div class="device-info"><div class="device-name">${entityId}</div><div class="device-status" style="color:var(--vpc-danger, #FF3B30)">Not found</div></div></div> `;
            }
            const domain = entityId.split('.')[0];
            const dispName = entityName || stateObj.attributes.friendly_name || entityId;
            let dispIcon = entityIcon || stateObj.attributes.icon;
            if (!dispIcon) {
                if (domain === 'switch' || domain === 'light' || domain === 'binary_sensor') {
                    dispIcon = stateObj.state === 'on' ? 'mdi:check-circle' : 'mdi:circle-outline';
                }
                else if (domain === 'sensor' && stateObj.attributes.device_class === 'temperature') {
                    dispIcon = 'mdi:thermometer';
                }
                else if (domain === 'sensor' && stateObj.attributes.unit_of_measurement === '%') {
                    dispIcon = 'mdi:water-percent';
                }
                else {
                    dispIcon = 'mdi:information-outline';
                }
            }
            const isSwitchLike = ['switch', 'light', 'input_boolean'].includes(domain);
            const isBinary = domain === 'binary_sensor';
            const isOn = stateObj.state === 'on';
            const isActionable = isSwitchLike;
            let dispState = stateObj.state;
            if (stateObj.attributes.unit_of_measurement) {
                dispState += ' ' + stateObj.attributes.unit_of_measurement;
            }
            const onClick = () => {
                if (isActionable) {
                    this.hass.callService('homeassistant', 'toggle', { entity_id: entityId });
                }
                else {
                    const event = new Event('hass-more-info', { bubbles: true, composed: true });
                    event.detail = { entityId: entityId };
                    this.dispatchEvent(event);
                }
            };
            return b` <div class="device-row" @click="${onClick}"><div class="device-icon-wrap ${isOn && (isSwitchLike || isBinary) ? 'device-icon-active' : ''}"><ha-icon icon="${dispIcon}"></ha-icon></div><div class="device-info"><div class="device-name">${dispName}</div><div class="device-status">${dispState}</div></div> ${isSwitchLike ? b `
                    <div class="device-dot ${isOn ? 'dot-active' : 'dot-inactive'}"></div>
                  ` : ''}
                </div>
              `;
        })}
          </div>
        </div>
      </ha-card>
    `;
    }
    renderCompactCard(config = this.config) {
        const entity = this.hass.states[config.entity];
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Entity';
        const domain = config.entity.split('.')[0];
        let icon = config.icon;
        if (!icon) {
            if (domain === 'switch' && config.entity.includes('pump')) {
                icon = 'mdi:pump';
            }
            else if (domain === 'climate' && config.entity.includes('heater')) {
                icon = 'mdi:radiator';
            }
            else if (domain === 'climate' && config.entity.includes('solar')) {
                icon = 'mdi:solar-power';
            }
            else if (domain === 'switch' && config.entity.includes('dos')) {
                icon = 'mdi:flask-outline';
            }
            else if (domain === 'cover') {
                icon = entity.state === 'open' ? 'mdi:window-shutter-open' : 'mdi:window-shutter';
            }
            else if (domain === 'light') {
                icon = entity.state === 'on' ? 'mdi:lightbulb-on' : 'mdi:lightbulb-off-outline';
            }
            else if (domain === 'sensor' && config.entity.includes('filter')) {
                icon = 'mdi:filter';
            }
            else {
                icon = 'mdi:circle';
            }
        }
        let detailStatus = '';
        let currentValue = '';
        if (entity.attributes?.PUMPSTATE) {
            const parsedState = EntityHelper.parsePumpState(entity.attributes.PUMPSTATE);
            detailStatus = parsedState.status;
            if (parsedState.level !== undefined && parsedState.level > 0) {
                currentValue = `Level ${parsedState.level}`;
            }
        }
        else if (entity.attributes?.HEATERSTATE) {
            const parsedState = EntityHelper.parseHeaterState(entity.attributes.HEATERSTATE);
            detailStatus = parsedState.status;
            const temp = EntityHelper.getCurrentTemperature(entity);
            if (temp !== undefined) {
                currentValue = `${temp.toFixed(1)}°C`;
            }
        }
        else if (entity.attributes?.SOLARSTATE) {
            const parsedState = EntityHelper.parseSolarState(entity.attributes.SOLARSTATE);
            detailStatus = parsedState.status;
            const temp = EntityHelper.getCurrentTemperature(entity);
            if (temp !== undefined) {
                currentValue = `${temp.toFixed(1)}°C`;
            }
        }
        else if (Object.keys(entity.attributes || {}).some(key => key.includes('DOS_') && key.includes('_STATE'))) {
            const dosingStateKey = Object.keys(entity.attributes || {}).find(key => key.includes('DOS_') && key.includes('_STATE'));
            const dosingState = dosingStateKey ? entity.attributes[dosingStateKey] : [];
            if (Array.isArray(dosingState) && dosingState.length > 0) {
                detailStatus = EntityHelper.formatSnakeCase(dosingState[0]);
            }
            const dosingType = this._detectDosingType(config.entity);
            if (dosingType === 'chlorine') {
                const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value');
                const orpSensor = this.hass.states[orpSensorId];
                if (orpSensor) {
                    currentValue = `${parseFloat(orpSensor.state).toFixed(0)}mV`;
                }
            }
            else if (dosingType === 'ph_minus' || dosingType === 'ph_plus') {
                const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value');
                const phSensor = this.hass.states[phSensorId];
                if (phSensor) {
                    currentValue = `pH ${parseFloat(phSensor.state).toFixed(1)}`;
                }
            }
        }
        else if (domain === 'cover') {
            const pos = entity.attributes?.current_position;
            if (pos !== undefined)
                currentValue = `${Math.round(pos)}%`;
            detailStatus = entity.state === 'open' ? 'Geöffnet' : entity.state === 'closed' ? 'Geschlossen' : entity.state === 'opening' ? 'Öffnet…' : entity.state === 'closing' ? 'Schließt…' : entity.state;
        }
        else if (domain === 'light') {
            const br = entity.attributes?.brightness;
            if (br !== undefined)
                currentValue = `${Math.round(br / 255 * 100)}%`;
            detailStatus = entity.state === 'on' ? 'An' : 'Aus';
        }
        else if (domain === 'sensor') {
            const unit = entity.attributes?.unit_of_measurement || '';
            const num = parseFloat(entity.state);
            if (!isNaN(num))
                currentValue = `${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}${unit}`;
            detailStatus = entity.attributes.device_class || '';
        }
        const isActive = state === 'on' || state === 'auto' || state === 'heat' || state === 'heating' || state === 'open' || state === 'opening';
        return b` <ha-card class="compact-card ${this._getCardClasses(isActive, config)}" @click="${() => this._showMoreInfo(config.entity)}" ><div class="card-content compact"><div class="compact-icon ${isActive ? 'compact-icon-active' : ''}"><ha-icon icon="${icon}" class="${isActive ? 'active' : 'inactive'}" ></ha-icon></div><div class="compact-info"><span class="name">${name}</span><div class="compact-details"> ${currentValue ? b `<span class="compact-value">${currentValue}</span>` : ''}
              ${detailStatus ? b`<span class="compact-detail">${detailStatus}</span>` : ''}
            </div>
          </div>
          <vpc-status-badge .state="${state}"></vpc-status-badge>
        </div>
      </ha-card>
    `;
    }
    renderChemicalCard(config = this.config) {
        const name = config.name || 'Wasserchemie';
        const accentColor = '#4CAF50';
        const poolTempSensorId = this._getEntityId('pool_temp_entity', 'sensor', 'temperature', 5);
        const phSensorId = this._getEntityId('ph_value_entity', 'sensor', 'ph_value', 6);
        const orpSensorId = this._getEntityId('orp_value_entity', 'sensor', 'orp_value', 7);
        const targetPhId = this._getEntityId('target_ph_entity', 'number', 'target_ph');
        const targetOrpId = this._getEntityId('target_orp_entity', 'number', 'target_orp');
        const poolTempSensor = this.hass.states[poolTempSensorId];
        const phSensor = this.hass.states[phSensorId];
        const orpSensor = this.hass.states[orpSensorId];
        const targetPhEntity = this.hass.states[targetPhId];
        const targetOrpEntity = this.hass.states[targetOrpId];
        const poolTemp = poolTempSensor ? parseFloat(poolTempSensor.state) : undefined;
        const phValue = phSensor ? parseFloat(phSensor.state) : undefined;
        const orpValue = orpSensor ? parseFloat(orpSensor.state) : undefined;
        const targetPh = targetPhEntity ? parseFloat(targetPhEntity.state) : 7.2;
        const targetOrp = targetOrpEntity ? parseFloat(targetOrpEntity.state) : 700;
        const tempColor = poolTemp !== undefined ? StateColorHelper.getTemperatureColor(poolTemp) : undefined;
        const phColor = phValue !== undefined ? StateColorHelper.getPhColor(phValue, targetPh) : undefined;
        const orpColor = orpValue !== undefined ? StateColorHelper.getOrpColor(orpValue, targetOrp) : undefined;
        const getTempStatus = (t) => {
            if (t === undefined)
                return '';
            if (t < 20)
                return 'Sehr kalt';
            if (t < 24)
                return 'Kühl';
            if (t <= 28)
                return 'Perfekt';
            if (t <= 32)
                return 'Angenehm warm';
            return 'Zu warm';
        };
        const getPhStatus = (ph) => {
            if (ph === undefined)
                return 'Unbekannt';
            if (ph < 6.8)
                return 'Zu sauer';
            if (ph < 7.0)
                return 'Leicht sauer';
            if (ph <= 7.4)
                return 'Optimal';
            if (ph <= 7.6)
                return 'Leicht basisch';
            return 'Zu basisch';
        };
        const getOrpStatus = (orp) => {
            if (orp === undefined)
                return 'Unbekannt';
            if (orp < 600)
                return 'Zu niedrig';
            if (orp < 650)
                return 'Niedrig';
            if (orp <= 750)
                return 'Optimal';
            if (orp <= 800)
                return 'Erhöht';
            return 'Zu hoch';
        };
        const phOk = phValue !== undefined && phValue >= 7.0 && phValue <= 7.4;
        const orpOk = orpValue !== undefined && orpValue >= 650 && orpValue <= 750;
        const issuesCount = [!phOk, !orpOk].filter(v => phValue !== undefined && orpValue !== undefined && v).length;
        const overallStatus = issuesCount === 0 ? 'Optimal' : issuesCount === 1 ? 'Achtung' : 'Eingriff nötig';
        const overallColor = issuesCount === 0 ? 'var(--vpc-success, #34C759)' : issuesCount === 1 ? 'var(--vpc-warning, #FF9F0A)' : 'var(--vpc-danger, #FF3B30)';
        const overallIcon = issuesCount === 0 ? 'mdi:water-check' : issuesCount === 1 ? 'mdi:alert' : 'mdi:alert-circle';
        const tempPct = poolTemp !== undefined ? this._getValuePercent(poolTemp, 18, 35) : undefined;
        return b` <ha-card class="${this._getCardClasses(issuesCount === 0 && (phValue !== undefined || orpValue !== undefined), config)}" style="--card-accent: ${accentColor}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || 'mdi:water-check'}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle" style="color: ${overallColor}">${overallStatus}</span></div><div class="chem-overall-badge" style="background: color-mix(in srgb, ${overallColor} 12%, transparent); color: ${overallColor}; border: 1px solid color-mix(in srgb, ${overallColor} 25%, transparent);"><ha-icon icon="${overallIcon}" style="--mdc-icon-size: 14px"></ha-icon><span>${overallStatus}</span></div></div> ${poolTemp !== undefined ? b `
            <div class="chem-section tooltip-wrap">
              <div class="chem-section-header">
                <ha-icon icon="mdi:thermometer-water" style="--mdc-icon-size: 15px; color: ${tempColor?.color || 'var(--vpc-text-secondary)'}"></ha-icon>
                <span>Wassertemperatur</span>
                <span class="chem-section-status" style="color: ${tempColor?.color}">${getTempStatus(poolTemp)}</span>
              </div>
              <div class="chem-big-value" style="color: ${tempColor?.color || 'var(--vpc-text)'}">
                <span class="chem-big-num">${poolTemp.toFixed(1)}</span>
                <span class="chem-big-unit">°C</span>
              </div>
              ${tempPct !== undefined ? b` <div class="chem-gauge-bar"><div class="chem-gauge-track"><div class="chem-gauge-fill" style="width: ${tempPct}%; background: ${tempColor?.color || accentColor}"></div><div class="chem-gauge-zone" style="left: ${this._getValuePercent(24, 18, 35)}%; width: ${this._getValuePercent(30, 18, 35) - this._getValuePercent(24, 18, 35)}%"></div></div><div class="chem-gauge-labels"><span>18°C</span><span class="chem-zone-label">Komfortzone 24–30°C</span><span>35°C</span></div></div> ` : ''}
              <div class="t-tip">
                <div class="t-tip-title"><ha-icon icon="mdi:thermometer-water"></ha-icon>Wassertemperatur</div>
                <div class="t-tip-desc">Aktuelle Pooltemperatur. Die grüne Zone zeigt den idealen Badekomfort-Bereich.</div>
                <div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>24°C – 30°C Komfort</div>
              </div>
            </div>
          ` : ''}

          <div class="chem-dual-grid">
            ${phValue !== undefined ? b` <div class="chem-metric-card tooltip-wrap" style="--chem-color: ${phColor?.color || '#4CAF50'}" @click="${(e) => { e.stopPropagation(); this._showMoreInfo(phSensorId); }}"><div class="chem-metric-header"><ha-icon icon="mdi:ph"></ha-icon><span>pH-Wert</span></div><div style="height: 80px; padding: 8px 0; display: flex; align-items: center; justify-content: center;"> ${gaugeNeedleSVG(phValue, 6.5, 8.0, phColor?.color || '#4CAF50')} </div><div class="chem-metric-status">${getPhStatus(phValue)}</div><div class="t-tip"><div class="t-tip-title"><ha-icon icon="mdi:ph"></ha-icon>pH-Wert</div><div class="t-tip-desc">Säuregehalt des Wassers. Zu niedrig reizt Haut und Augen. Zu hoch reduziert die Chlorwirksamkeit. Ziel: ${targetPh.toFixed(1)}</div><div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>7.0 – 7.4 Optimal</div> ${!phOk ? b `<div class="t-tip-warn"><ha-icon icon="mdi:flask"></ha-icon>${phValue < 7.0 ? 'pH+ zugeben' : 'pH- zugeben'}</div>` : ''}
                </div>
              </div>
            ` : ''}

            ${orpValue !== undefined ? b` <div class="chem-metric-card tooltip-wrap" style="--chem-color: ${orpColor?.color || '#4CAF50'}" @click="${(e) => { e.stopPropagation(); this._showMoreInfo(orpSensorId); }}"><div class="chem-metric-header"><ha-icon icon="mdi:lightning-bolt"></ha-icon><span>ORP</span></div><div style="height: 80px; padding: 8px 0; display: flex; align-items: center; justify-content: center;"> ${gaugeNeedleSVG(orpValue, 500, 900, orpColor?.color || '#4CAF50')} </div><div class="chem-metric-status">${getOrpStatus(orpValue)}</div><div class="t-tip"><div class="t-tip-title"><ha-icon icon="mdi:lightning-bolt"></ha-icon>ORP – Desinfektionskraft</div><div class="t-tip-desc">Redoxpotential misst, wie wirksam das Chlor Keime abtötet. Niedriger ORP = unzureichende Desinfektion. Ziel: ${targetOrp.toFixed(0)} mV</div><div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>650 – 750 mV Optimal</div> ${!orpOk ? b `<div class="t-tip-warn"><ha-icon icon="mdi:flask-outline"></ha-icon>${orpValue < 650 ? 'Chlor erhöhen' : 'Chlor reduzieren'}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          ${issuesCount > 0 ? b` <div class="chem-recommendations"> ${phValue !== undefined && !phOk ? b `
                <div class="chem-rec-row" style="--rec-color: ${phColor?.color || 'var(--vpc-warning)'}">
                  <ha-icon icon="mdi:ph"></ha-icon>
                  <span>${phValue < 7.0 ? 'pH zu sauer: pH+ Mittel zugeben' : 'pH zu basisch: pH- Mittel zugeben'}</span>
                </div>
              ` : ''}
              ${orpValue !== undefined && !orpOk ? b` <div class="chem-rec-row" style="--rec-color: ${orpColor?.color || 'var(--vpc-warning)'}"><ha-icon icon="mdi:flask-outline"></ha-icon><span>${orpValue < 650 ? 'ORP zu niedrig: Chlordosierung erhöhen' : 'ORP zu hoch: Chlordosierung reduzieren'}</span></div> ` : ''}
            </div>
          ` : b` <div class="all-ok-display"><ha-icon icon="mdi:water-check" style="--mdc-icon-size: 18px"></ha-icon><span>Wasserqualität optimal</span></div> `}
        </div>
      </ha-card>
    `;
    }
    renderSensorCard(config = this.config) {
        const entity = this.hass.states[config.entity];
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Sensor';
        const unit = entity.attributes.unit_of_measurement || '';
        const accentColor = config.accent_color || this._getAccentColor('overview', config);
        const numValue = parseFloat(state);
        const isNumeric = !isNaN(numValue);
        const deviceClass = entity.attributes.device_class;
        const tooltipMap = {
            temperature: { title: 'Temperatur', desc: 'Aktuelle Temperaturmessung des Sensors.', ideal: '24°C – 30°C (Pool)' },
            ph: { title: 'pH-Wert', desc: 'Säuregehalt des Poolwassers.', ideal: '7.0 – 7.4' },
            voltage: { title: 'ORP / Spannung', desc: 'Redoxpotential – Desinfektionskraft des Wassers.', ideal: '650 – 750 mV' },
            humidity: { title: 'Luftfeuchtigkeit', desc: 'Relative Luftfeuchtigkeit in Prozent.' },
            pressure: { title: 'Druck', desc: 'Aktueller Druckwert.' },
        };
        const tooltip = tooltipMap[deviceClass] || { title: name, desc: 'Sensorwert aus dem Violet Pool System.' };
        const displayValue = isNumeric
            ? (numValue % 1 === 0 ? numValue.toFixed(0) : numValue.toFixed(1))
            : state;
        return b` <ha-card class="${this._getCardClasses(false, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(config.entity)}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || (deviceClass === 'temperature' ? 'mdi:thermometer' : deviceClass === 'ph' ? 'mdi:ph' : 'mdi:gauge')}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${deviceClass ? deviceClass.charAt(0).toUpperCase() + deviceClass.slice(1) : 'Sensor'}</span></div></div> ${isNumeric ? b `
            <div style="padding: 12px 0; min-height: 100px; display: flex; flex-direction: column; align-items: center;">
              <div style="height: 70px; width: 100%; display: flex; align-items: center;">
                ${chartSVG([numValue * 0.8, numValue, numValue * 1.1, numValue * 0.9, numValue, numValue * 1.05], accentColor)}
              </div>
              <div class="sensor-big-value" style="margin-top: 8px;">
                <span class="sensor-num">${displayValue}</span>
                ${unit ? b`<span class="sensor-unit">${unit}</span>` : ''}
              </div>
            </div>
          ` : b` <div class="sensor-value-display"><div class="sensor-big-value"><span class="sensor-state-text">${state}</span></div></div> `}

          <div class="tooltip-wrap" style="width: 100%; position: relative;">
            <div class="t-tip" style="position: static; opacity: 0.7; background: var(--vpc-surface); transform: none; width: 100%; max-width: 100%; margin-top: 8px; padding: 8px; border: none; box-shadow: none; border-radius: 8px;">
              <div class="t-tip-title"><ha-icon icon="mdi:information-outline"></ha-icon>${tooltip.title}</div>
              <div class="t-tip-desc">${tooltip.desc}</div>
              ${tooltip.ideal ? b`<div class="t-tip-ideal"><ha-icon icon="mdi:target"></ha-icon>${tooltip.ideal}</div>` : ''}
            </div>
          </div>
        </div>
      </ha-card>
    `;
    }
    renderCoverCard(config = this.config) {
        const entityId = config.cover_entity || config.entity || this._buildEntityId('cover', 'cover');
        const entity = this.hass.states[entityId];
        if (!entity) {
            return b`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Cover nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
        }
        const state = entity.state;
        const name = config.name || entity.attributes.friendly_name || 'Pool Abdeckung';
        const position = entity.attributes.current_position ?? (state === 'open' ? 100 : 0);
        const isMoving = state === 'opening' || state === 'closing';
        const accentColor = this._getAccentColor('cover', config);
        const stateLabels = {
            open: 'Geöffnet', closed: 'Geschlossen',
            opening: 'Öffnet…', closing: 'Schließt…', stopped: 'Gestoppt',
        };
        const coverStatusColor = state === 'open' ? 'var(--vpc-success,#34C759)'
            : state === 'closed' ? accentColor
                : isMoving ? 'var(--vpc-warning,#FF9F0A)'
                    : 'var(--vpc-text-secondary)';
        const badgeState = state === 'open' ? 'on' : state === 'closed' ? 'off' : 'auto';
        return b` <ha-card class="${this._getCardClasses(state === 'open' || isMoving, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(entityId)}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${state !== 'closed' ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}"> ${config.icon ? b `<ha-icon icon="${config.icon}"></ha-icon>`
            : b`<ha-icon icon="${state === 'open' ? 'mdi:window-shutter-open' : isMoving ? 'mdi:window-shutter' : 'mdi:window-shutter'}"></ha-icon>`}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="color:${coverStatusColor}">${stateLabels[state] || state}</span>
            </div>
            ${config.show_state !== false ? b`<vpc-status-badge .state="${badgeState}" .pulse="${isMoving}"></vpc-status-badge>` : ''}
          </div>

          <!-- Animated pool visualization -->
          <div class="cover-visual">
            ${coverSVG(position, isMoving, accentColor)}
          </div>

          <!-- Position row -->
          <div class="info-row">
            <ha-icon icon="${isMoving ? 'mdi:rotate-3d-variant' : 'mdi:percent'}" style="--mdc-icon-size:17px"></ha-icon>
            <span class="info-label">Position</span>
            <span class="info-value" style="color:${coverStatusColor}">${Math.round(position)}%</span>
            ${isMoving ? b`<span class="cover-moving-pill">${state === 'opening' ? '▲ Öffnet' : '▼ Schließt'}</span>` : ''}
          </div>

          <!-- Position bar -->
          <div class="cover-pos-bar">
            <div class="cover-pos-fill" style="width:${position}%;background:${accentColor}"></div>
          </div>

          <!-- Position slider -->
          ${config.show_controls !== false ? b` <vpc-slider-control label="Position" min="0" max="100" step="5" .value="${Math.round(position)}" unit="%" @value-changed="${(e) => { e.stopPropagation(); this.hass.callService('cover', 'set_cover_position', { entity_id: entityId, position: e.detail.value }); }}" ></vpc-slider-control> ` : ''}

          <!-- Open / Stop / Close buttons -->
          ${config.show_controls !== false ? b` <div class="cover-controls"><button class="cover-btn cover-btn-open ${state === 'open' ? 'cvr-active' : ''}" @click="${(e) => { e.stopPropagation(); this.hass.callService('cover', 'open_cover', { entity_id: entityId }); }}"><ha-icon icon="mdi:arrow-up" style="--mdc-icon-size:17px"></ha-icon><span>Öffnen</span></button><button class="cover-btn cover-btn-stop ${state === 'stopped' ? 'cvr-active' : ''}" @click="${(e) => { e.stopPropagation(); this.hass.callService('cover', 'stop_cover', { entity_id: entityId }); }}"><ha-icon icon="mdi:stop" style="--mdc-icon-size:17px"></ha-icon><span>Stop</span></button><button class="cover-btn cover-btn-close ${state === 'closed' ? 'cvr-active' : ''}" @click="${(e) => { e.stopPropagation(); this.hass.callService('cover', 'close_cover', { entity_id: entityId }); }}"><ha-icon icon="mdi:arrow-down" style="--mdc-icon-size:17px"></ha-icon><span>Schließen</span></button></div> ` : ''}
        </div>
      </ha-card>`;
    }
    renderLightCard(config = this.config) {
        const entityId = config.light_entity || config.entity || this._buildEntityId('light', 'light');
        const entity = this.hass.states[entityId];
        if (!entity) {
            return b`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Licht nicht gefunden</span><span class="error-entity">${entityId}</span></div></div></ha-card>`;
        }
        const state = entity.state;
        const isOn = state === 'on';
        const name = config.name || entity.attributes.friendly_name || 'Pool Licht';
        const brightness = entity.attributes.brightness ?? 128;
        const brightnessPercent = Math.round((brightness / 255) * 100);
        const rgb = entity.attributes.rgb_color ?? null;
        const rgbStr = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : null;
        const accentColor = rgbStr || config.accent_color || this._getAccentColor('light', config);
        const colorTemp = entity.attributes.color_temp;
        const effect = entity.attributes.effect;
        return b` <ha-card class="${this._getCardClasses(isOn, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(entityId)}"><div class="accent-bar" style="${isOn && rgb ? `background:${rgbStr};opacity:1` : ''}"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${isOn ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}">
              ${config.icon
            ? b`<ha-icon icon="${config.icon}"></ha-icon>`
            : lightSVG(isOn, rgb, brightness, accentColor)}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isOn ? `color:${accentColor}` : ''}">
                ${isOn ? (effect ? effect : brightnessPercent + '%') : 'Aus'}
              </span>
            </div>
            ${config.show_state !== false ? b`<vpc-status-badge .state="${state}" .pulse="${isOn}"></vpc-status-badge>` : ''}
          </div>

          ${isOn ? b` <!-- Color presets --><div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;"> ${[ { label: '🔴 Rot', rgb: [255, 0, 0] }, { label: '🟢 Grün', rgb: [0, 255, 0] }, { label: '🔵 Blau', rgb: [0, 0, 255] }, { label: '🟡 Gelb', rgb: [255, 255, 0] }, ].map(preset => b `
                <button style="padding: 8px; border: none; border-radius: 8px; background: rgb(${preset.rgb[0]}, ${preset.rgb[1]}, ${preset.rgb[2]}); color: white; font-weight: 600; cursor: pointer; transition: transform 0.2s; font-size: 11px;"
                        @click="${(e) => { e.stopPropagation(); this.hass.callService('light', 'turn_on', { entity_id: entityId, rgb_color: preset.rgb }); }}"
                        @mouseover="${(e) => e.target.style.transform = 'scale(1.05)'}"
                        @mouseout="${(e) => e.target.style.transform = 'scale(1)'}">
                  ${preset.label}
                </button>
              `)}
            </div>

            <!-- Color swatch with interactive color picker -->
            ${rgb ? b` <div class="light-color-swatch" style="background:${rgbStr};box-shadow:0 6px 24px ${rgbStr}50"><span class="light-color-label">RGB ${rgb[0]}, ${rgb[1]}, ${rgb[2]}</span><span class="light-color-hint">Farbe wählen</span><input type="color" .value="${'#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}" @click="${(e) => e.stopPropagation()}" @change="${(e) => { e.stopPropagation(); const hex = e.target.value; const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16); this.hass.callService('light', 'turn_on', { entity_id: entityId, rgb_color: [r, g, b] }); }}"/></div> ` : colorTemp ? b` <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px;"><!-- Kelvin Slider for Color Temperature --><div style="padding: 12px; background: var(--vpc-surface); border-radius: 12px;"><div style="font-size: 12px; font-weight: 600; color: var(--vpc-text); margin-bottom: 8px;">Farbtemperatur</div><div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;"><div style="width: 30px; text-align: center; font-size: 11px; color: var(--vpc-text-secondary);">🔵<br/>6500K</div><input type="range" min="154" max="500" value="${colorTemp || 250}" style="flex: 1; height: 6px; cursor: pointer;" @change="${(e) => { const mirek = parseInt(e.target.value); this.hass.callService('light', 'turn_on', { entity_id: entityId, color_temp: mirek }); }}"/><div style="width: 30px; text-align: center; font-size: 11px; color: var(--vpc-text-secondary);">🟠<br/>2000K</div></div><div style="margin-top: 8px; padding: 8px; background: linear-gradient(90deg, #FFA500 0%, #FFD700 50%, #87CEEB 100%); border-radius: 4px; height: 20px;"></div></div></div> ` : ''}

            <!-- Brightness -->
            <div class="info-row">
              <ha-icon icon="mdi:brightness-6" style="--mdc-icon-size:17px"></ha-icon>
              <span class="info-label">Helligkeit</span>
              <span class="info-value">${brightnessPercent}%</span>
            </div>
            <div class="cover-pos-bar">
              <div class="cover-pos-fill" style="width:${brightnessPercent}%;background:${accentColor}"></div>
            </div>

            ${config.show_controls !== false ? b` <div class="light-brightness-row"><vpc-slider-control label="Helligkeit" min="1" max="100" step="5" .value="${brightnessPercent}" unit="%" @value-changed="${(e) => { e.stopPropagation(); this.hass.callService('light', 'turn_on', { entity_id: entityId, brightness_pct: e.detail.value }); }}" ></vpc-slider-control></div> ` : ''}
          ` : ''}

          ${config.show_controls !== false ? b` <div class="cover-controls"><button class="cover-btn cover-btn-open ${isOn ? 'cvr-active' : ''}" style="--cvr-btn-color:${accentColor}" @click="${(e) => { e.stopPropagation(); this.hass.callService('light', 'turn_on', { entity_id: entityId }); }}"><ha-icon icon="mdi:lightbulb-on" style="--mdc-icon-size:17px"></ha-icon><span>An</span></button><button class="cover-btn cover-btn-close ${!isOn ? 'cvr-active' : ''}" @click="${(e) => { e.stopPropagation(); this.hass.callService('light', 'turn_off', { entity_id: entityId }); }}"><ha-icon icon="mdi:lightbulb-off" style="--mdc-icon-size:17px"></ha-icon><span>Aus</span></button></div> ` : ''}
        </div>
      </ha-card>`;
    }
    renderFilterCard(config = this.config) {
        const pressureEntityId = config.filter_pressure_entity || config.entity || this._buildEntityId('sensor', 'filter_pressure');
        const filterEntityId = config.filter_entity;
        const backwashEntityId = config.backwash_entity;
        const pressureEntity = this.hass.states[pressureEntityId];
        if (!pressureEntity) {
            return b`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Filter nicht gefunden</span><span class="error-entity">${pressureEntityId}</span></div></div></ha-card>`;
        }
        const pressure = parseFloat(pressureEntity.state) || 0;
        const name = config.name || pressureEntity.attributes.friendly_name || 'Filter';
        const accentColor = this._getAccentColor('filter', config);
        const filterEntity = filterEntityId ? this.hass.states[filterEntityId] : undefined;
        const backwashEntity = backwashEntityId ? this.hass.states[backwashEntityId] : undefined;
        const isFilterOn = filterEntity ? filterEntity.state === 'on' : true;
        const isBackwashing = backwashEntity ? backwashEntity.state === 'on' : false;
        // Pressure zones: 0-0.5 low, 0.5-1.2 normal, 1.2-1.6 elevated, >1.6 critical
        const pressureColor = pressure < 0.5 ? 'var(--vpc-text-secondary)'
            : pressure < 1.2 ? 'var(--vpc-success,#34C759)'
                : pressure < 1.6 ? 'var(--vpc-warning,#FF9F0A)'
                    : 'var(--vpc-danger,#FF3B30)';
        const pressureLabel = pressure < 0.5 ? 'Niedrig'
            : pressure < 1.2 ? 'Normal'
                : pressure < 1.6 ? 'Erhöht – bald rückspülen'
                    : 'Kritisch – sofort rückspülen!';
        // Arc gauge: semicircle, 0-3 bar range
        return b` <ha-card class="${this._getCardClasses(isFilterOn, config)}" style="--card-accent: ${accentColor}" @click="${() => this._showMoreInfo(pressureEntityId)}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon ${isFilterOn ? 'icon-active' : ''}" style="--icon-accent: ${accentColor}"> ${config.icon ? b `<ha-icon icon="${config.icon}"></ha-icon>`
            : b`<ha-icon icon="${isBackwashing ? 'mdi:rotate-right' : 'mdi:filter'}" class="${isBackwashing ? 'pump-running' : ''}"></ha-icon>`}
            </div>
            <div class="header-info">
              <span class="name">${name}</span>
              <span class="header-subtitle" style="${isBackwashing ? 'color:var(--vpc-warning,#FF9F0A)' : ''}">
                ${isBackwashing ? 'Rückspülung läuft…' : isFilterOn ? 'Aktiv' : 'Aus'}
              </span>
            </div>
            ${config.show_state !== false ? b`<vpc-status-badge .state="${isFilterOn ? 'on' : 'off'}" .pulse="${isBackwashing}"></vpc-status-badge>` : ''}
          </div>

          <!-- Pressure gauge with animated needle -->
          <div class="filter-gauge-wrap" style="padding: 12px 0;">
            ${filterGaugeSVG(pressure, 3)}
          </div>

          <!-- Status row -->
          <div class="info-row ${pressure >= 1.6 ? 'info-row-warning' : ''}">
            <ha-icon icon="mdi:gauge" style="--mdc-icon-size:17px;color:${pressureColor}"></ha-icon>
            <span class="info-label">Filterdruck</span>
            <span class="info-value" style="color:${pressureColor}">${pressureLabel}</span>
          </div>

          ${filterEntity ? b` <div class="info-row"><ha-icon icon="${isFilterOn ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}" style="--mdc-icon-size:17px;color:${isFilterOn ? 'var(--vpc-success,#34C759)' : 'var(--vpc-text-secondary)'}"></ha-icon><span class="info-label">Filterpumpe</span><span class="info-value">${isFilterOn ? 'An' : 'Aus'}</span></div> ` : ''}

          ${config.show_controls !== false && backwashEntity ? b` <div class="cover-controls"><button class="cover-btn ${isBackwashing ? 'cover-btn-close cvr-active' : 'cover-btn-open'}" style="--cvr-btn-color:${accentColor}" @click="${(e) => { e.stopPropagation(); this.hass.callService('switch', isBackwashing ? 'turn_off' : 'turn_on', { entity_id: backwashEntityId }); }}"><ha-icon icon="${isBackwashing ? 'mdi:stop' : 'mdi:rotate-right'}" style="--mdc-icon-size:17px"></ha-icon><span>${isBackwashing ? 'Rückspülung stoppen' : 'Rückspülen starten'}</span></button></div> ` : ''}
        </div>
      </ha-card>`;
    }
    /**
     * Render Statistics Card - displays trend data and graphs
     */
    renderStatisticsCard(config = this.config) {
        const entity = config.entity ? this.hass.states[config.entity] : undefined;
        const name = config.name || entity?.attributes.friendly_name || 'Statistics';
        const accentColor = this._getAccentColor('statistics', config);
        if (!entity) {
            return b`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${config.entity}</span></div></div></ha-card>`;
        }
        const currentValue = parseFloat(entity.state) || 0;
        // Mock historical data for demo
        const historicalValues = [2, 5, 8, 12, 15, 18, 16, 19, 22, 20, 25, 28];
        return b` <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon icon-active" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || 'mdi:chart-line'}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">Trend Analysis</span></div></div><div class="sensor-value-display" style="margin-top: 8px"><div class="sensor-big-value"><span class="sensor-num">${currentValue.toFixed(1)}</span><span class="sensor-unit">${entity.attributes.unit_of_measurement || ''}</span></div></div><div style="margin-top: 16px; padding: 12px; background: var(--vpc-surface); border-radius: 12px;"> ${chartSVG(historicalValues, accentColor)} </div><div class="info-row"><ha-icon icon="mdi:trending-up" style="--mdc-icon-size:17px;color:${accentColor}"></ha-icon><span class="info-label">Last 12 readings</span><span class="info-value">+${(Math.max(...historicalValues) - Math.min(...historicalValues)).toFixed(1)}</span></div></div></ha-card> `;
    }
    /**
     * Render Weather Impact Card - shows how weather affects pool conditions
     */
    renderWeatherCard(config = this.config) {
        const entity = config.entity ? this.hass.states[config.entity] : undefined;
        const name = config.name || entity?.attributes.friendly_name || 'Weather';
        const accentColor = this._getAccentColor('weather', config);
        if (!entity) {
            return b`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${config.entity}</span></div></div></ha-card>`;
        }
        return b` <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon icon-active" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || 'mdi:cloud'}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">Current Conditions</span></div></div><div class="info-row"><ha-icon icon="mdi:temperature-celsius" style="--mdc-icon-size:17px;color:var(--vpc-warning, #FF9F0A)"></ha-icon><span class="info-label">Air Temperature</span><span class="info-value">${entity.attributes.temperature || 'N/A'}°</span></div><div class="info-row"><ha-icon icon="mdi:water-percent" style="--mdc-icon-size:17px;color:#0A84FF"></ha-icon><span class="info-label">Humidity</span><span class="info-value">${entity.attributes.humidity || 'N/A'}%</span></div><div class="info-row"><ha-icon icon="mdi:weather-cloudy" style="--mdc-icon-size:17px;color:#8E8E93"></ha-icon><span class="info-label">Condition</span><span class="info-value">${entity.state || 'Unknown'}</span></div><div style="margin-top: 12px; padding: 12px; background: var(--vpc-surface); border-radius: 12px; font-size: 12px; color: var(--vpc-text-secondary);"> ⚠️ Rain forecasted - may affect water chemistry. Consider increasing filtration. </div></div></ha-card> `;
    }
    /**
     * Render Maintenance Card - shows schedules and recommendations
     */
    renderMaintenanceCard(config = this.config) {
        const accentColor = this._getAccentColor('maintenance', config);
        const name = config.name || 'Maintenance';
        return b` <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon icon-active" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || 'mdi:wrench'}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">Schedule & Tasks</span></div></div><div class="info-row info-row-warning"><ha-icon icon="mdi:alert-circle" style="--mdc-icon-size:17px;color:var(--vpc-warning, #FF9F0A)"></ha-icon><span class="info-label">Filter Backwash</span><span class="info-value">Due soon</span></div><div class="info-row"><ha-icon icon="mdi:test-tube" style="--mdc-icon-size:17px;color:var(--vpc-primary)"></ha-icon><span class="info-label">Water Test</span><span class="info-value">3 days ago</span></div><div class="info-row"><ha-icon icon="mdi:calendar-check" style="--mdc-icon-size:17px;color:var(--vpc-success, #34C759)"></ha-icon><span class="info-label">Quarterly Service</span><span class="info-value">In 45 days</span></div><div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;"><button style="padding: 10px 16px; border: none; border-radius: 10px; background: ${accentColor}; color: white; font-weight: 600; cursor: pointer; transition: all 0.2s;"> 📝 Log Task </button></div></div></ha-card> `;
    }
    /**
     * Render Alerts Card - shows active alerts and notifications
     */
    renderAlertsCard(config = this.config) {
        const accentColor = this._getAccentColor('alerts', config);
        const name = config.name || 'System Alerts';
        // Mock alerts
        const alerts = [
            { severity: 'warning', message: 'pH slightly elevated', icon: 'mdi:water-alert' },
            { severity: 'info', message: 'Backwash scheduled', icon: 'mdi:information' },
        ];
        return b` <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon icon-active" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || 'mdi:bell-alert'}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">${alerts.length} active</span></div></div><div style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;"> ${alerts.map(alert => { const bgColor = alert.severity === 'error' ? 'rgba(255,59,48,0.1)' : alert.severity === 'warning' ? 'rgba(255,159,10,0.1)' : 'rgba(0,122,255,0.08)'; const textColor = alert.severity === 'error' ? '#FF3B30' : alert.severity === 'warning' ? '#FF9F0A' : '#0A84FF'; return b `
                <div class="warning-row" style="background: ${bgColor}; border-color: ${textColor}33;">
                  <ha-icon icon="${alert.icon}" style="--mdc-icon-size:16px;color:${textColor}"></ha-icon>
                  <span style="flex:1;color:${textColor}">${alert.message}</span>
                </div>
              `;
        })}
          </div>
        </div>
      </ha-card>
    `;
    }
    /**
     * Render Comparison Card - shows current vs target values
     */
    renderComparisonCard(config = this.config) {
        const entity = config.entity ? this.hass.states[config.entity] : undefined;
        const targetEntity = config.target_entity ? this.hass.states[config.target_entity] : undefined;
        const name = config.name || entity?.attributes.friendly_name || 'Comparison';
        const accentColor = this._getAccentColor('comparison', config);
        if (!entity) {
            return b`<ha-card><div class="error-state"><div class="error-icon"><ha-icon icon="mdi:alert-circle-outline"></ha-icon></div><div class="error-info"><span class="error-title">Entity Not Found</span><span class="error-entity">${config.entity}</span></div></div></ha-card>`;
        }
        const current = parseFloat(entity.state) || 0;
        const target = targetEntity ? parseFloat(targetEntity.state) : 25;
        const diff = current - target;
        const diffPercent = ((diff / target) * 100).toFixed(1);
        const isHigher = diff > 0;
        return b` <ha-card class="${this._getCardClasses(true, config)}" style="--card-accent: ${accentColor}"><div class="accent-bar"></div><div class="card-content"><div class="header"><div class="header-icon icon-active" style="--icon-accent: ${accentColor}"><ha-icon icon="${config.icon || 'mdi:compare'}"></ha-icon></div><div class="header-info"><span class="name">${name}</span><span class="header-subtitle">Current vs Target</span></div></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px;"><div style="padding: 14px; background: var(--vpc-surface); border-radius: 12px; text-align: center;"><div style="font-size: 11px; color: var(--vpc-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Current</div><div style="font-size: 32px; font-weight: 700; color: ${accentColor}; line-height: 1;">${current.toFixed(1)}</div><div style="font-size: 13px; color: var(--vpc-text-secondary); margin-top: 3px;">${entity.attributes.unit_of_measurement || ''}</div></div><div style="padding: 14px; background: var(--vpc-surface); border-radius: 12px; text-align: center;"><div style="font-size: 11px; color: var(--vpc-text-secondary); text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Target</div><div style="font-size: 32px; font-weight: 700; color: var(--vpc-success, #34C759); line-height: 1;">${target.toFixed(1)}</div><div style="font-size: 13px; color: var(--vpc-text-secondary); margin-top: 3px;">${entity.attributes.unit_of_measurement || ''}</div></div></div><div class="info-row" style="margin-top: 12px; background: ${isHigher ? 'rgba(255,59,48,0.08)' : 'rgba(52,199,89,0.08)'};"><ha-icon icon="${isHigher ? 'mdi:trending-up' : 'mdi:trending-down'}" style="--mdc-icon-size:17px;color:${isHigher ? '#FF3B30' : '#34C759'}"></ha-icon><span class="info-label">Difference</span><span class="info-value" style="color:${isHigher ? '#FF3B30' : '#34C759'}">${isHigher ? '+' : ''}${diff.toFixed(1)} (${diffPercent}%)</span></div></div></ha-card> `;
    }
    static get styles() {
        return i$3`:host{--vpc-font:-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;--vpc-spacing:18px;--vpc-radius:20px;--vpc-inner-radius:12px;--vpc-bg:var(--ha-card-background, var(--card-background-color, #ffffff));--vpc-surface:rgba(120,120,128,0.06);--vpc-border:none;--vpc-shadow:0 2px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);--vpc-backdrop:none;--vpc-primary:var(--primary-color, #007AFF);--vpc-success:#34C759;--vpc-warning:#FF9F0A;--vpc-danger:#FF3B30;--vpc-purple:#AF52DE;--vpc-teal:#5AC8FA;--vpc-orange:#FF9500;--vpc-indigo:#5856D6;--vpc-text:var(--primary-text-color, #1C1C1E);--vpc-text-secondary:var(--secondary-text-color, #6D6D72);--vpc-text-tertiary:rgba(60,60,67,0.45);--vpc-icon-size:22px;--vpc-transition:all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);--vpc-transition-fast:all 0.18s ease;--card-accent:var(--primary-color, #007AFF);--icon-accent:var(--card-accent);display:block;font-family:var(--vpc-font);}ha-card.theme-apple{--vpc-bg:#ffffff;--vpc-shadow:0 2px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);--vpc-radius:22px;--vpc-inner-radius:13px;--vpc-surface:rgba(120,120,128,0.06);--vpc-primary:#007AFF;}ha-card.theme-dark{--vpc-bg:#1C1C1E;--vpc-surface:rgba(255,255,255,0.06);--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-shadow:0 4px 30px rgba(0,0,0,0.4);--vpc-radius:22px;--vpc-text:#FFFFFF;--vpc-text-secondary:#8E8E93;--vpc-text-tertiary:rgba(255,255,255,0.25);--vpc-primary:#0A84FF;--vpc-success:#30D158;--vpc-warning:#FFD60A;--vpc-danger:#FF453A;}ha-card.theme-luxury, ha-card.theme-glass{--vpc-bg:rgba(255,255,255,0.72);--vpc-backdrop:blur(24px) saturate(180%);--vpc-radius:26px;--vpc-border:1px solid rgba(255,255,255,0.4);--vpc-shadow:0 8px 40px rgba(31,38,135,0.12), 0 2px 8px rgba(0,0,0,0.06);}ha-card.theme-modern{--vpc-radius:18px;--vpc-spacing:20px;--vpc-shadow:0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);}ha-card.theme-minimalist{--vpc-radius:14px;--vpc-shadow:none;--vpc-border:1px solid rgba(0,0,0,0.07);--vpc-surface:transparent;}ha-card.theme-neon{--vpc-bg:#0D0D14;--vpc-border:1px solid rgba(0,212,255,0.2);--vpc-shadow:0 0 30px rgba(0,212,255,0.07);--vpc-radius:14px;--vpc-primary:#00D4FF;--vpc-text:#E8E8F0;--vpc-text-secondary:#6E6E80;--vpc-surface:rgba(0,212,255,0.04);--vpc-success:#00E676;--vpc-warning:#FFEA00;--vpc-danger:#FF1744;}ha-card.theme-premium{--vpc-bg:linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,248,255,0.96) 100%);--vpc-radius:24px;--vpc-shadow:0 12px 50px -8px rgba(80,80,160,0.15), 0 0 0 1px rgba(255,255,255,0.9);--vpc-border:1px solid rgba(255,255,255,0.7);}@media (prefers-color-scheme:dark){ha-card.theme-apple{--vpc-bg:#1C1C1E;--vpc-surface:rgba(255,255,255,0.06);--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-text:#FFFFFF;--vpc-text-secondary:#8E8E93;--vpc-primary:#0A84FF;--vpc-success:#30D158;--vpc-warning:#FFD60A;--vpc-danger:#FF453A;}ha-card.theme-luxury, ha-card.theme-glass{--vpc-bg:rgba(18,18,30,0.80);--vpc-border:1px solid rgba(255,255,255,0.09);--vpc-shadow:0 8px 40px rgba(0,0,0,0.45);}ha-card.theme-premium{--vpc-bg:linear-gradient(145deg, rgba(28,28,38,0.97) 0%, rgba(20,20,32,0.97) 100%);--vpc-border:1px solid rgba(255,255,255,0.07);}ha-card.theme-minimalist{--vpc-border:1px solid rgba(255,255,255,0.07);}ha-card.theme-modern{--vpc-shadow:0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04);}}ha-card{font-family:var(--vpc-font);padding:var(--vpc-spacing);background:var(--vpc-bg);border-radius:var(--vpc-radius);box-shadow:var(--vpc-shadow);border:var(--vpc-border);backdrop-filter:var(--vpc-backdrop);-webkit-backdrop-filter:var(--vpc-backdrop);transition:transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s ease;overflow:visible;position:relative;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;}ha-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.05);}ha-card:active{transform:scale(0.985);box-shadow:0 2px 8px rgba(0,0,0,0.07);transition:transform 0.1s ease, box-shadow 0.1s ease;}ha-card.theme-dark:hover{box-shadow:0 8px 30px rgba(0,0,0,0.5);}ha-card.theme-neon:hover{box-shadow:0 0 40px rgba(0,212,255,0.12), 0 4px 20px rgba(0,0,0,0.3);}ha-card.theme-neon.is-active{box-shadow:0 0 50px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.35);}.accent-bar{position:absolute;top:0;left:0;right:0;height:3px;background:var(--card-accent);opacity:0.65;transition:opacity 0.3s ease, height 0.3s ease;}ha-card.is-active .accent-bar{height:4px;opacity:1;}ha-card.theme-neon .accent-bar{background:linear-gradient(90deg, #00D4FF, #7C4DFF, #00D4FF);box-shadow:0 0 12px rgba(0,212,255,0.5);height:2px;animation:neon-flow 3s linear infinite;}ha-card.theme-minimalist .accent-bar{height:2px;opacity:0.45;}@keyframes neon-flow{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}.card-content{display:flex;flex-direction:column;gap:14px;}.card-content.compact{flex-direction:row;align-items:center;gap:14px;}.header{display:flex;align-items:center;gap:14px;}.header-icon{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 12%, transparent);transition:background 0.25s ease, box-shadow 0.25s ease;flex-shrink:0;}.header-icon.icon-active{background:color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 18%, transparent);box-shadow:0 0 0 5px color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 8%, transparent);}ha-card.theme-neon .header-icon{background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.18);}ha-card.theme-neon .header-icon.icon-active{box-shadow:0 0 16px rgba(0,212,255,0.25);}.header-icon ha-icon{--mdc-icon-size:24px;color:var(--icon-accent, var(--vpc-primary));}.header-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}.name{font-family:var(--vpc-font);font-size:16px;font-weight:600;letter-spacing:-0.3px;color:var(--vpc-text);line-height:1.25;}.header-subtitle{font-family:var(--vpc-font);font-size:13px;font-weight:400;color:var(--vpc-text-secondary);line-height:1.2;}ha-icon{--mdc-icon-size:var(--vpc-icon-size);color:var(--vpc-primary);transition:color 0.2s ease;}@keyframes rotate{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}@keyframes pulse-glow{0%, 100%{opacity:1;transform:scale(1);}50%{opacity:0.65;transform:scale(0.95);}}@keyframes breathe{0%, 100%{transform:scale(1);opacity:1;}50%{transform:scale(1.08);opacity:0.85;}}@keyframes spin-slow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}.pump-running{animation:rotate 1.8s linear infinite;}.heater-active{animation:breathe 2.5s ease-in-out infinite;color:var(--vpc-danger, #FF3B30);}.solar-active{animation:breathe 3s ease-in-out infinite;color:var(--vpc-warning, #FF9F0A);}.dosing-active{animation:pulse-glow 2s ease-in-out infinite;color:var(--vpc-success, #34C759);}.speed-segments-container{display:flex;align-items:center;gap:8px;}.speed-segments{display:flex;flex:1;gap:6px;}.speed-segment{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:9px 6px;border-radius:var(--vpc-inner-radius, 12px);border:none;background:var(--vpc-surface, rgba(120,120,128,0.06));color:var(--vpc-text-secondary);font-family:var(--vpc-font);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s ease;-webkit-tap-highlight-color:transparent;letter-spacing:-0.2px;position:relative;overflow:visible;}.speed-segment:hover{background:color-mix(in srgb, var(--seg-color) 10%, transparent);color:var(--seg-color);}.speed-segment.seg-active{background:color-mix(in srgb, var(--seg-color) 15%, transparent);color:var(--seg-color);font-weight:600;box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--seg-color) 40%, transparent);}.speed-segment.seg-past{background:color-mix(in srgb, var(--seg-color) 08%, transparent);color:color-mix(in srgb, var(--seg-color) 70%, var(--vpc-text-secondary));}.speed-off-btn{width:38px;height:38px;border-radius:12px;border:none;background:var(--vpc-surface);color:var(--vpc-text-secondary);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.18s ease;flex-shrink:0;-webkit-tap-highlight-color:transparent;}.speed-off-btn:hover{background:rgba(255,59,48,0.1);color:var(--vpc-danger, #FF3B30);}.speed-off-btn.seg-active{background:rgba(255,59,48,0.12);color:var(--vpc-danger, #FF3B30);box-shadow:inset 0 0 0 1.5px rgba(255,59,48,0.3);}ha-card.theme-neon .speed-segment{border:1px solid rgba(0,212,255,0.1);}ha-card.theme-neon .speed-segment.seg-active{box-shadow:0 0 12px color-mix(in srgb, var(--seg-color) 50%, transparent);}.temp-hero{display:flex;align-items:center;gap:12px;padding:6px 0 4px;}.temp-hero-main{display:flex;align-items:baseline;gap:4px;}.temp-hero-value{font-family:var(--vpc-font);font-size:44px;font-weight:700;line-height:1;letter-spacing:-2px;color:var(--temp-color, var(--vpc-text));}.temp-hero-unit{font-size:22px;font-weight:400;color:var(--temp-color, var(--vpc-text));opacity:0.65;letter-spacing:-0.5px;}.temp-hero-target-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:100px;background:var(--vpc-surface);font-size:13px;font-weight:500;color:var(--vpc-text-secondary);white-space:nowrap;}.temp-range-bar, .chem-range-bar{display:flex;flex-direction:column;gap:5px;}.temp-range-track, .chem-range-track{height:6px;background:var(--vpc-surface);border-radius:100px;position:relative;overflow:visible;}.temp-range-fill, .chem-range-fill{height:100%;border-radius:100px;transition:width 0.5s cubic-bezier(0.34,1.4,0.64,1);}.temp-range-target{position:absolute;top:50%;transform:translate(-50%, -50%);width:3px;height:14px;background:var(--vpc-text-secondary);border-radius:2px;opacity:0.7;}.temp-range-labels, .chem-range-labels{display:flex;justify-content:space-between;font-size:11px;font-weight:400;color:var(--vpc-text-tertiary, rgba(60,60,67,0.45));letter-spacing:0px;}.dosing-value-block{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);}ha-card.theme-neon .dosing-value-block{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.dosing-value-row{display:flex;align-items:center;justify-content:space-between;gap:10px;}.dosing-value-main{display:flex;align-items:baseline;gap:6px;}.dosing-label-tag{font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:var(--vpc-text-secondary);}.dosing-current-value{font-family:var(--vpc-font);font-size:32px;font-weight:700;line-height:1;letter-spacing:-1px;}.dosing-current-unit{font-size:15px;font-weight:400;opacity:0.65;}.dosing-status-pill{padding:4px 10px;border-radius:100px;font-size:12px;font-weight:600;white-space:nowrap;}.chem-range-target{position:absolute;top:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;align-items:center;gap:2px;}.chem-target-line{width:2px;height:14px;background:var(--vpc-text);border-radius:2px;opacity:0.5;}.chem-target-label{position:absolute;top:16px;font-size:9px;font-weight:600;color:var(--vpc-text-secondary);white-space:nowrap;transform:translateX(-50%);}.chem-mini-bar{width:100%;height:4px;background:var(--vpc-surface, rgba(120,120,128,0.1));border-radius:100px;overflow:hidden;position:relative;margin-top:4px;}.chem-mini-fill{height:100%;border-radius:100px;transition:width 0.5s cubic-bezier(0.34,1.4,0.64,1);}.chem-mini-ideal{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.18);border-radius:2px;}.solar-temp-comparison{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px;background:var(--vpc-surface);border-radius:var(--vpc-inner-radius, 12px);}ha-card.theme-neon .solar-temp-comparison{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.solar-temp-tile{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}.solar-temp-tile ha-icon{--mdc-icon-size:18px;color:var(--vpc-text-secondary);}.solar-temp-tile-val{font-size:20px;font-weight:700;letter-spacing:-0.5px;color:var(--vpc-text);line-height:1;}.solar-temp-tile-label{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.3px;}.solar-delta-badge{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 12px;border-radius:100px;font-size:12px;font-weight:700;}.delta-great{background:rgba(52,199,89,0.12);color:var(--vpc-success, #34C759);}.delta-ok{background:rgba(255,159,10,0.12);color:var(--vpc-warning, #FF9F0A);}.delta-low{background:rgba(255,59,48,0.10);color:var(--vpc-danger, #FF3B30);}.delta-hint-text{font-size:12px;font-weight:400;color:var(--vpc-text-secondary);padding:2px 0;}.chemistry-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;}.chemistry-card{display:flex;flex-direction:column;align-items:center;gap:2px;padding:14px 8px 12px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);cursor:pointer;transition:transform 0.18s ease, background 0.18s ease;position:relative;overflow:visible;}.chemistry-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--chem-color, var(--vpc-primary));opacity:0.6;border-radius:100px;}.chemistry-card:hover{transform:scale(1.02);background:color-mix(in srgb, var(--chem-color) 8%, var(--vpc-surface));}ha-card.theme-neon .chemistry-card{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.chem-icon-wrap{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--chem-color, var(--vpc-primary)) 12%, transparent);margin-bottom:4px;}.chem-icon-wrap ha-icon{--mdc-icon-size:16px;color:var(--chem-color, var(--vpc-primary));}.chemistry-val{font-family:var(--vpc-font);font-size:18px;font-weight:700;letter-spacing:-0.5px;color:var(--chem-color, var(--vpc-text));line-height:1;}.chemistry-unit{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);letter-spacing:0.2px;}.chemistry-label{font-size:10px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.4px;}.overview-warning-badge{width:22px;height:22px;border-radius:50%;background:var(--vpc-danger, #FF3B30);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}.overview-active-dot{width:10px;height:10px;border-radius:50%;background:var(--vpc-success, #34C759);box-shadow:0 0 8px rgba(52,199,89,0.5);flex-shrink:0;animation:pulse-glow 2s ease-in-out infinite;}.overview-section{display:flex;flex-direction:column;gap:6px;}.section-title{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.6px;padding:0 2px;}.section-count{margin-left:auto;font-size:11px;font-weight:500;color:var(--vpc-text-tertiary);}.warning-title ha-icon{color:var(--vpc-warning, #FF9F0A);}.warning-title{color:var(--vpc-warning, #FF9F0A);}.temp-hero{display:flex;align-items:baseline;gap:4px;padding:8px 0;}.temp-hero-value{font-size:42px;font-weight:800;line-height:1;color:var(--temp-color, var(--vpc-text));letter-spacing:-1px;}.temp-hero-unit{font-size:22px;font-weight:500;color:var(--temp-color, var(--vpc-text));opacity:0.7;}.temp-hero-target{font-size:16px;font-weight:500;color:var(--vpc-text-secondary);margin-left:12px;}.info-row{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);font-size:14px;color:var(--vpc-text);font-family:var(--vpc-font);}ha-card.theme-neon .info-row{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.08);}.info-row ha-icon{--mdc-icon-size:17px;color:var(--vpc-text-secondary);flex-shrink:0;}.info-label{flex:1;font-weight:400;color:var(--vpc-text-secondary);}.info-value{font-weight:600;color:var(--vpc-text);letter-spacing:-0.2px;}.info-badge{padding:3px 9px;border-radius:100px;font-size:11px;font-weight:600;}.info-badge.warning{background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 12%, transparent);color:var(--vpc-warning, #FF9F0A);}.info-row-warning{background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 06%, transparent);border:1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 18%, transparent);}.solar-temps{display:flex;flex-direction:column;gap:8px;}.chemistry-grid{display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;}.chemistry-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:14px;background:rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);cursor:pointer;transition:var(--vpc-transition);border:1px solid transparent;}.chemistry-card:hover{background:rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);transform:translateY(-1px);}ha-card.theme-neon .chemistry-card{background:rgba(0, 255, 255, 0.04);border:1px solid rgba(0, 255, 255, 0.08);}.chemistry-card ha-icon{--mdc-icon-size:20px;color:var(--chem-color, var(--vpc-primary));}.chemistry-val{font-size:16px;font-weight:700;color:var(--chem-color, var(--vpc-text));line-height:1;}.chemistry-label{font-size:11px;font-weight:500;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.3px;}.overview-section{display:flex;flex-direction:column;gap:8px;}.section-title{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--vpc-text-secondary);text-transform:uppercase;letter-spacing:0.5px;padding:0 2px;}.section-title ha-icon{--mdc-icon-size:16px;color:var(--vpc-text-secondary);}.warning-title ha-icon{color:#ef6c00;}.warning-title{color:#ef6c00;}.device-list{display:flex;flex-direction:column;gap:3px;}.device-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--vpc-inner-radius, 12px);background:var(--vpc-surface);cursor:pointer;transition:background 0.18s ease, transform 0.15s ease;}.device-row:hover{background:color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));transform:scale(1.005);}ha-card.theme-neon .device-row{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.06);}.device-icon-wrap{width:32px;height:32px;border-radius:9px;background:var(--vpc-surface);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s ease;}.device-icon-wrap ha-icon{--mdc-icon-size:18px;color:var(--vpc-text-secondary);}.device-icon-active{background:color-mix(in srgb, var(--vpc-primary) 12%, transparent);}.device-icon-active ha-icon{color:var(--vpc-primary) !important;}.device-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px;}.device-name{font-weight:500;font-size:14px;letter-spacing:-0.1px;color:var(--vpc-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.device-status{color:var(--vpc-text-secondary);font-size:12px;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.device-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}.dot-active{background:var(--vpc-success, #34C759);box-shadow:0 0 6px rgba(52,199,89,0.5);}.dot-inactive{background:var(--vpc-text-secondary);opacity:0.25;}.warning-list{display:flex;flex-direction:column;gap:5px;}.warning-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--vpc-inner-radius, 12px);background:color-mix(in srgb, var(--vpc-warning, #FF9F0A) 8%, transparent);border:1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 20%, transparent);font-size:13px;font-weight:500;color:var(--vpc-warning, #FF9F0A);}.warning-row ha-icon{color:var(--vpc-warning, #FF9F0A);flex-shrink:0;}.all-ok-display{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:var(--vpc-inner-radius, 12px);background:color-mix(in srgb, var(--vpc-success, #34C759) 8%, transparent);border:1px solid color-mix(in srgb, var(--vpc-success, #34C759) 18%, transparent);color:var(--vpc-success, #34C759);font-weight:500;font-size:14px;}.all-ok-display ha-icon{color:var(--vpc-success, #34C759);}ha-card.compact-card{padding:12px 14px;}.compact-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--vpc-surface);flex-shrink:0;transition:background 0.2s ease;}.compact-icon-active{background:color-mix(in srgb, var(--vpc-primary) 12%, transparent);}.compact-icon ha-icon{--mdc-icon-size:20px;}.compact-icon ha-icon.active{color:var(--vpc-primary);}.compact-icon ha-icon.inactive{color:var(--vpc-text-secondary);opacity:0.45;}.compact-info{flex:1;min-width:0;}.compact-details{display:flex;gap:8px;font-size:12px;margin-top:2px;align-items:center;}.compact-value{font-weight:600;color:var(--vpc-text);letter-spacing:-0.2px;}.compact-detail{color:var(--vpc-text-secondary);font-size:11px;}.system-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:20px;}.error-state{display:flex;align-items:center;gap:14px;padding:20px;}.error-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(244, 67, 54, 0.1);}.error-icon ha-icon{--mdc-icon-size:24px;color:#d32f2f;}.error-info{display:flex;flex-direction:column;gap:2px;}.error-title{font-size:14px;font-weight:600;color:#d32f2f;}.error-entity{font-size:12px;color:var(--vpc-text-secondary);font-family:monospace;}ha-card.size-small{--vpc-spacing:12px;--vpc-icon-size:20px;--vpc-radius:16px;}ha-card.size-small .header-icon{width:38px;height:38px;border-radius:11px;}ha-card.size-small .name{font-size:14px;}ha-card.size-small .temp-hero-value{font-size:34px;letter-spacing:-1.5px;}ha-card.size-large{--vpc-spacing:22px;--vpc-icon-size:28px;--vpc-radius:26px;}ha-card.size-large .header-icon{width:54px;height:54px;border-radius:17px;}ha-card.size-large .name{font-size:18px;}ha-card.size-large .temp-hero-value{font-size:56px;letter-spacing:-3px;}ha-card.size-fullscreen{--vpc-spacing:28px;--vpc-icon-size:32px;--vpc-radius:28px;height:100%;min-height:80vh;}ha-card.size-fullscreen .header-icon{width:60px;height:60px;border-radius:19px;}ha-card.size-fullscreen .name{font-size:20px;}ha-card.size-fullscreen .temp-hero-value{font-size:68px;letter-spacing:-4px;}ha-card.animation-none{transition:none !important;}ha-card.animation-none:hover, ha-card.animation-none:active{transform:none !important;}ha-card.animation-subtle{transition:transform 0.15s ease, box-shadow 0.15s ease;}ha-card.animation-subtle:hover{transform:translateY(-1px);}ha-card.animation-smooth{transition:transform 0.25s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.25s ease;}ha-card.animation-energetic{transition:transform 0.2s cubic-bezier(0.34,1.6,0.64,1), box-shadow 0.2s ease;}ha-card.animation-energetic:hover{transform:translateY(-4px) scale(1.008);}@keyframes flow-gradient{0%{background-position:0% 50%;}100%{background-position:200% 50%;}}ha-card.flow-active .accent-bar{background:linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 60%, white), var(--card-accent));background-size:200% 100%;animation:flow-gradient 2.5s linear infinite;}.error-state{display:flex;align-items:center;gap:14px;padding:20px;}.error-icon{width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--vpc-danger, #FF3B30) 10%, transparent);flex-shrink:0;}.error-icon ha-icon{--mdc-icon-size:24px;color:var(--vpc-danger, #FF3B30);}.error-info{display:flex;flex-direction:column;gap:3px;}.error-title{font-size:15px;font-weight:600;color:var(--vpc-danger, #FF3B30);letter-spacing:-0.2px;}.error-entity{font-size:12px;color:var(--vpc-text-secondary);font-family:'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;opacity:0.7;}.system-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:16px;}@media (max-width:600px){.chemistry-grid{grid-template-columns:repeat(3, 1fr);gap:6px;}.chemistry-card{padding:11px 6px 10px;}.chemistry-val{font-size:16px;}.system-grid{grid-template-columns:1fr;}.temp-hero-value{font-size:38px;letter-spacing:-1.5px;}.dosing-current-value{font-size:28px;}.speed-segment{font-size:11px;padding:8px 4px;}}@media (pointer:coarse){.speed-segment, .speed-off-btn, .device-row, .chemistry-card{min-height:44px;}}.speed-segment{min-width:0;}.speed-segment span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}.tooltip-wrap{position:relative;}.t-tip{position:absolute;top:calc(100% + 7px);left:50%;transform:translateX(-50%) translateY(-4px) scale(0.94);transform-origin:top center;z-index:9999;min-width:148px;max-width:250px;padding:9px 12px;background:rgba(18,18,26,0.94);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.11);border-radius:11px;box-shadow:0 8px 28px rgba(0,0,0,0.4),0 2px 6px rgba(0,0,0,0.25);opacity:0;pointer-events:none;transition:opacity 0.13s ease,transform 0.17s cubic-bezier(0.34,1.4,0.64,1),transition-delay 0s;white-space:normal;text-align:left;}.tooltip-wrap:hover .t-tip{opacity:1;transform:translateX(-50%) translateY(0) scale(1);transition-delay:0.38s;}.t-tip.t-up{top:auto;bottom:calc(100% + 7px);transform-origin:bottom center;transform:translateX(-50%) translateY(4px) scale(0.94);}.tooltip-wrap:hover .t-tip.t-up{transform:translateX(-50%) translateY(0) scale(1);}.t-tip-title{font-size:11.5px;font-weight:600;color:rgba(255,255,255,0.94);margin-bottom:4px;display:flex;align-items:center;gap:5px;}.t-tip-title ha-icon{--mdc-icon-size:13px;color:rgba(255,255,255,0.55);flex-shrink:0;}.t-tip-desc{font-size:11px;color:rgba(255,255,255,0.67);line-height:1.55;}.t-tip-ideal{display:flex;align-items:center;gap:5px;margin-top:6px;padding:3px 8px;background:rgba(52,199,89,0.18);border-radius:6px;font-size:10.5px;font-weight:600;color:#34C759;}.t-tip-ideal ha-icon{--mdc-icon-size:11px;flex-shrink:0;}.t-tip-warn{display:flex;align-items:center;gap:5px;margin-top:5px;padding:3px 8px;background:rgba(255,159,10,0.16);border-radius:6px;font-size:10.5px;font-weight:600;color:#FF9F0A;}.chem-overall-badge{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:100px;font-size:11.5px;font-weight:600;flex-shrink:0;}.chem-overall-badge ha-icon{--mdc-icon-size:14px;}.chem-section{background:var(--vpc-surface);border-radius:var(--vpc-inner-radius,12px);padding:13px 15px;display:flex;flex-direction:column;gap:9px;position:relative;overflow:visible;}.chem-section-header{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--vpc-text-secondary);}.chem-section-status{margin-left:auto;font-weight:600;font-size:12px;}.chem-big-value{display:flex;align-items:baseline;gap:5px;}.chem-big-num{font-size:42px;font-weight:700;letter-spacing:-2px;line-height:1;}.chem-big-unit{font-size:20px;font-weight:400;opacity:0.6;letter-spacing:-0.5px;}.chem-gauge-bar{display:flex;flex-direction:column;gap:5px;}.chem-gauge-track{height:7px;background:rgba(0,0,0,0.07);border-radius:100px;position:relative;overflow:visible;}ha-card.theme-dark .chem-gauge-track,ha-card.theme-neon .chem-gauge-track{background:rgba(255,255,255,0.08);}.chem-gauge-fill{height:100%;border-radius:100px;transition:width 0.55s cubic-bezier(0.34,1.4,0.64,1);}.chem-gauge-zone{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.22);border-radius:2px;}.chem-gauge-labels{display:flex;justify-content:space-between;font-size:10.5px;color:var(--vpc-text-tertiary);}.chem-zone-label{font-size:10.5px;color:var(--vpc-success,#34C759);font-weight:500;}.chem-dual-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}.chem-metric-card{background:var(--vpc-surface);border-radius:var(--vpc-inner-radius,12px);padding:13px 12px;display:flex;flex-direction:column;gap:6px;cursor:pointer;transition:transform 0.15s ease,border-color 0.15s ease;border:1px solid transparent;position:relative;overflow:visible;}.chem-metric-card:hover{transform:scale(1.025);border-color:color-mix(in srgb,var(--chem-color,var(--vpc-primary)) 22%,transparent);}.chem-metric-header{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--vpc-text-secondary);}.chem-metric-header ha-icon{color:var(--chem-color,var(--vpc-primary));--mdc-icon-size:15px;}.chem-metric-value{font-size:34px;font-weight:700;letter-spacing:-1.5px;line-height:1;color:var(--chem-color,var(--vpc-text));}.chem-metric-unit{font-size:12px;font-weight:500;color:var(--vpc-text-secondary);margin-top:-3px;}.chem-metric-status{font-size:11px;font-weight:600;color:var(--chem-color,var(--vpc-text-secondary));}.chem-metric-bar{display:flex;flex-direction:column;gap:4px;}.chem-metric-track{height:5px;background:rgba(0,0,0,0.07);border-radius:100px;position:relative;overflow:visible;}ha-card.theme-dark .chem-metric-track{background:rgba(255,255,255,0.08);}.chem-metric-ideal{position:absolute;top:0;height:100%;background:rgba(52,199,89,0.2);border-radius:2px;}.chem-metric-fill{height:100%;border-radius:100px;background:var(--chem-color,var(--vpc-primary));transition:width 0.5s ease;}.chem-metric-target{position:absolute;top:50%;transform:translate(-50%,-50%);width:2px;height:13px;background:var(--vpc-text);border-radius:1px;opacity:0.45;}.chem-metric-labels{display:flex;justify-content:space-between;font-size:10px;color:var(--vpc-text-tertiary);}.chem-recommendations{display:flex;flex-direction:column;gap:6px;}.chem-rec-row{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:var(--vpc-inner-radius,12px);background:color-mix(in srgb,var(--rec-color,var(--vpc-warning)) 9%,transparent);border:1px solid color-mix(in srgb,var(--rec-color,var(--vpc-warning)) 22%,transparent);font-size:12.5px;font-weight:500;color:var(--rec-color,var(--vpc-warning));}.chem-rec-row ha-icon{--mdc-icon-size:15px;flex-shrink:0;}.sensor-value-display{background:var(--vpc-surface);border-radius:var(--vpc-inner-radius,12px);padding:18px 16px;display:flex;align-items:center;justify-content:center;position:relative;overflow:visible;}.sensor-big-value{display:flex;align-items:baseline;gap:6px;}.sensor-num{font-size:56px;font-weight:700;letter-spacing:-2.5px;line-height:1;color:var(--card-accent,var(--vpc-primary));}.sensor-unit{font-size:26px;font-weight:400;opacity:0.6;letter-spacing:-0.5px;color:var(--card-accent,var(--vpc-text));}.sensor-state-text{font-size:28px;font-weight:600;color:var(--vpc-text);}.device-row{overflow:visible;}@keyframes flicker{0%,100%{transform:scaleX(1) skewX(0deg);opacity:1;}25%{transform:scaleX(1.06) skewX(-2deg);opacity:0.88;}50%{transform:scaleX(0.96) skewX(1.5deg);opacity:0.82;}75%{transform:scaleX(1.04) skewX(-1deg);opacity:0.94;}}@keyframes light-glow{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.65;transform:scale(1.07);}}@keyframes flow-dot{0%,100%{opacity:0.7;transform:scale(1);}50%{opacity:0.3;transform:scale(0.6);}}.header-icon svg{display:block;width:100%;height:100%;}.cover-visual{padding:2px 0;}.cover-pos-bar{height:5px;background:var(--vpc-surface);border-radius:100px;overflow:hidden;margin-top:-4px;}.cover-pos-fill{height:100%;border-radius:100px;transition:width 0.55s cubic-bezier(0.34,1.4,0.64,1);}.cover-moving-pill{padding:2px 8px;border-radius:100px;font-size:11px;font-weight:600;background:rgba(255,159,10,0.14);color:var(--vpc-warning,#FF9F0A);white-space:nowrap;}.cover-controls{display:flex;gap:7px;}.cover-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px;border:none;border-radius:var(--vpc-inner-radius,12px);background:var(--vpc-surface);color:var(--vpc-text-secondary);font-family:var(--vpc-font);font-size:11.5px;font-weight:500;cursor:pointer;transition:all 0.18s ease;-webkit-tap-highlight-color:transparent;}.cover-btn:hover{background:color-mix(in srgb,var(--card-accent) 12%,transparent);color:var(--card-accent);}.cover-btn-open.cvr-active{background:rgba(52,199,89,0.13);color:var(--vpc-success,#34C759);box-shadow:inset 0 0 0 1.5px rgba(52,199,89,0.32);}.cover-btn-stop.cvr-active{background:rgba(255,159,10,0.13);color:var(--vpc-warning,#FF9F0A);box-shadow:inset 0 0 0 1.5px rgba(255,159,10,0.32);}.cover-btn-close.cvr-active{background:rgba(255,59,48,0.12);color:var(--vpc-danger,#FF3B30);box-shadow:inset 0 0 0 1.5px rgba(255,59,48,0.3);}.light-color-swatch{height:54px;border-radius:var(--vpc-inner-radius,12px);display:flex;align-items:center;justify-content:center;transition:background 0.4s ease,box-shadow 0.4s ease;}.light-color-label{font-size:11.5px;font-weight:600;color:white;text-shadow:0 1px 4px rgba(0,0,0,0.45);letter-spacing:0.1px;}.light-brightness-row{margin-top:-4px;}.light-color-swatch{position:relative;overflow:hidden;}.light-color-swatch input[type=color]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;padding:0;}.light-color-hint{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.65);pointer-events:none;}.filter-gauge-wrap{display:flex;justify-content:center;padding:4px 0 0;}`;
    }
    getCardSize() {
        switch (this.config?.card_type) {
            case 'compact':
                return 1;
            case 'overview':
                return 5;
            case 'details':
                return Math.ceil((this.config.entities?.length || 1) / 2) + 1;
            case 'chemical':
                return 6;
            case 'sensor':
                return 2;
            case 'cover':
                return 4;
            case 'light':
                return 3;
            default:
                return 3;
        }
    }
    static getStubConfig() {
        return {
            type: 'custom:violet-pool-card',
            entity_prefix: 'violet_pool',
            entity: 'switch.violet_pool_pump',
            card_type: 'pump',
        };
    }
    static async getConfigElement() {
        await Promise.resolve().then(function () { return violetPoolCardEditor; });
        return document.createElement('violet-pool-card-editor');
    }
}
__decorate([
    n({ attribute: false })
], VioletPoolCard.prototype, "hass", void 0);
__decorate([
    r()
], VioletPoolCard.prototype, "config", void 0);
if (!customElements.get('violet-pool-card')) {
    // Inject modal styles globally
    const modalStyles = `
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.2s ease;
      backdrop-filter: blur(4px);
      padding: 16px;
    }
    .confirmation-dialog {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 90%;
      width: 400px;
      animation: slideUp 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    .confirmation-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .confirmation-message {
      font-size: 14px;
      color: var(--primary-text-color);
      margin: 0;
      line-height: 1.5;
    }
    .confirmation-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    .confirmation-buttons button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 44px;
      min-width: 44px;
    }
    .btn-cancel {
      background: var(--divider-color, rgba(0, 0, 0, 0.12));
      color: var(--primary-text-color);
    }
    .btn-cancel:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.2));
    }
    .btn-confirm {
      background: var(--primary-color, #007aff);
      color: white;
    }
    .btn-confirm:hover {
      opacity: 0.9;
      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @media (max-width: 600px) {
      .confirmation-dialog { width: 90%; }
      .confirmation-buttons { flex-direction: column-reverse; }
      .confirmation-buttons button { width: 100%; }
    }
  `;
    const styleElement = document.createElement('style');
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);
    customElements.define('violet-pool-card', VioletPoolCard);
}
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'violet-pool-card',
    name: 'Violet Pool Card',
    description: 'Premium card for Violet Pool Controller with glassmorphism design',
    preview: true,
    // Add icon for Card Picker if missing. This is ignored by HACS list but useful for HA Add Card UI.
});

class VioletPoolCardEditor extends i {
    setConfig(config) {
        this._config = config;
    }
    render() {
        if (!this.hass || !this._config) {
            return b``;
        }
        const needsEntity = !['overview', 'system', 'details', 'chemical', 'cover', 'light'].includes(this._config.card_type);
        const coverOrLight = this._config.card_type === 'cover' || this._config.card_type === 'light';
        const domainFilter = {
            pump: ['switch'], heater: ['climate'], solar: ['climate'],
            dosing: ['switch'], compact: [], sensor: ['sensor'],
            cover: ['cover'], light: ['light'],
        };
        const includeDomains = domainFilter[this._config.card_type] || [];
        return b` <div class="card-config"><!-- Card Type Selection --><div class="config-section"><div class="section-header"><ha-icon icon="mdi:card-outline"></ha-icon><span>Card Type</span></div><ha-select label="Card Type" .value="${this._config.card_type}" @selected="${this._cardTypeChanged}" @closed="${(e) => e.stopPropagation()}" ><mwc-list-item value="pump">🔵 Pump</mwc-list-item><mwc-list-item value="heater">🔥 Heater</mwc-list-item><mwc-list-item value="solar">☀️ Solar</mwc-list-item><mwc-list-item value="dosing">💧 Dosing</mwc-list-item><mwc-list-item value="cover">🪟 Cover</mwc-list-item><mwc-list-item value="light">💡 Light</mwc-list-item><mwc-list-item value="overview">📊 Overview</mwc-list-item><mwc-list-item value="compact">📋 Compact</mwc-list-item><mwc-list-item value="system">🖥️ System Dashboard</mwc-list-item><mwc-list-item value="details">📝 Details</mwc-list-item><mwc-list-item value="chemical">🧪 Chemistry</mwc-list-item><mwc-list-item value="sensor">📡 Sensor</mwc-list-item></ha-select></div><!-- Controller Configuration --><div class="config-section"><div class="section-header"><ha-icon icon="mdi:chip"></ha-icon><span>Controller Configuration</span></div><ha-textfield label="Entity Prefix" .value="${this._config.entity_prefix || 'violet_pool'}" @input="${this._entityPrefixChanged}" helper="Name of your pool controller (e.g., 'violet_pool', 'pool_1', 'garden_pool')" ></ha-textfield><div class="prefix-info"><ha-icon icon="mdi:information-outline"></ha-icon><span> The entity prefix should match your Violet Pool Controller name in Home Assistant. All entities will be automatically discovered based on this prefix. </span></div></div><!-- Entity Selection --> ${needsEntity || coverOrLight ? b `
          <div class="config-section">
            <div class="section-header">
              <ha-icon icon="mdi:lightning-bolt"></ha-icon>
              <span>Entity</span>
            </div>
            <ha-entity-picker
              label="${coverOrLight ? (this._config.card_type === 'cover' ? 'Cover Entity' : 'Licht Entity') : 'Entity'}"
              .hass="${this.hass}"
              .value="${this._config.entity}"
              .includeDomains="${includeDomains.length ? includeDomains : undefined}"
              @value-changed="${this._entityChanged}"
              allow-custom-entity
            ></ha-entity-picker>
          </div>
        ` : ''}

        <!-- Premium Design Options -->
        <div class="config-section premium-section">
          <div class="section-header premium-header">
            <ha-icon icon="mdi:palette"></ha-icon>
            <span>✨ Premium Design</span>
          </div>

          <!-- Size Picker -->
          <div class="picker-container">
            <label>Card Size</label>
            <div class="size-picker">
              ${['small', 'medium', 'large', 'fullscreen'].map((size) => b` <button class="size-button ${this._config.size === size ? 'active' : ''}" @click="${() => this._sizeChanged(size)}" ><div class="size-preview size-${size}"></div><span>${this._formatSizeName(size)}</span></button> `)}
            </div>
          </div>

          <!-- Theme Picker -->
          <div class="picker-container">
            <label>Theme Style</label>
            <div class="theme-picker">
              ${[
            { value: 'apple', icon: '', label: 'Apple', desc: 'Clean & Light', preview: '#fff' },
            { value: 'dark', icon: '', label: 'Dark', desc: 'Deep Dark', preview: '#1C1C1E' },
            { value: 'glass', icon: '', label: 'Glass', desc: 'Frosted Glass', preview: 'rgba(255,255,255,0.7)' },
            { value: 'modern', icon: '', label: 'Modern', desc: 'Minimal Flat', preview: '#f8f8fa' },
            { value: 'minimalist', icon: '', label: 'Minimal', desc: 'Ultra Clean', preview: '#fff' },
            { value: 'neon', icon: '', label: 'Neon', desc: 'Dark Glow', preview: '#0D0D14' },
        ].map((theme) => b` <button class="theme-button ${this._config.theme === theme.value || (!this._config.theme && theme.value === 'apple') ? 'active' : ''}" @click="${() => this._themeChanged(theme.value)}" ><div class="theme-preview theme-${theme.value}"><div class="theme-dot" style="background:${theme.preview}"></div></div><div class="theme-info"><span class="theme-label">${theme.label}</span><span class="theme-desc">${theme.desc}</span></div></button> `)}
            </div>
          </div>

          <!-- Animation Picker -->
          <div class="picker-container">
            <label>Animation Level</label>
            <div class="animation-picker">
              ${[
            { value: 'none', icon: '⏸️', label: 'None', desc: 'Static' },
            { value: 'subtle', icon: '🌙', label: 'Subtle', desc: 'Professional' },
            { value: 'smooth', icon: '✨', label: 'Smooth', desc: 'Balanced' },
            { value: 'energetic', icon: '🚀', label: 'Energetic', desc: 'Dynamic' },
        ].map((anim) => b` <button class="animation-button ${this._config.animation === anim.value ? 'active' : ''}" @click="${() => this._animationChanged(anim.value)}" ><span class="anim-icon">${anim.icon}</span><div class="anim-info"><span class="anim-label">${anim.label}</span><span class="anim-desc">${anim.desc}</span></div></button> `)}
            </div>
          </div>
        </div>

        <!-- Basic Options -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>Basic Options</span>
          </div>

          <ha-textfield
            label="Custom Name (optional)"
            .value="${this._config.name || ''}"
            @input="${this._nameChanged}"
          ></ha-textfield>

          <ha-icon-picker
            label="Custom Icon (optional)"
            .hass="${this.hass}"
            .value="${this._config.icon || ''}"
            @value-changed="${this._iconChanged}"
          ></ha-icon-picker>
        </div>

        <!-- Display Options -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:eye"></ha-icon>
            <span>Display Options</span>
          </div>

          <ha-formfield label="Show state badge">
            <ha-switch
              .checked="${this._config.show_state !== false}"
              @change="${this._showStateChanged}"
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show detail status">
            <ha-switch
              .checked="${this._config.show_detail_status !== false}"
              @change="${this._showDetailStatusChanged}"
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show controls">
            <ha-switch
              .checked="${this._config.show_controls !== false}"
              @change="${this._showControlsChanged}"
            ></ha-switch>
          </ha-formfield>

          ${this._config.card_type === 'pump'
            ? b` <ha-formfield label="Show runtime counter"><ha-switch .checked="${this._config.show_runtime === true}" @change="${this._showRuntimeChanged}" ></ha-switch></ha-formfield> `
            : ''}

          ${this._config.card_type === 'dosing'
            ? b` <ha-formfield label="Show dosing history"><ha-switch .checked="${this._config.show_history === true}" @change="${this._showHistoryChanged}" ></ha-switch></ha-formfield> `
            : ''}
        </div>

        <!-- Dosing Type (for dosing cards) -->
        ${this._config.card_type === 'dosing'
            ? b` <div class="config-section"><div class="section-header"><ha-icon icon="mdi:flask"></ha-icon><span>Dosing Type</span></div><ha-select label="Dosing Type" .value="${this._config.dosing_type || 'chlorine'}" @selected="${this._dosingTypeChanged}" @closed="${(e) => e.stopPropagation()}" ><mwc-list-item value="chlorine">💧 Chlorine (ORP)</mwc-list-item><mwc-list-item value="ph_minus">➖ pH Minus</mwc-list-item><mwc-list-item value="ph_plus">➕ pH Plus</mwc-list-item><mwc-list-item value="flocculant">🌊 Flocculant</mwc-list-item></ha-select></div> `
            : ''}

        <!-- Entity Overrides (card-type specific) -->
        ${['pump', 'heater', 'solar', 'dosing', 'overview', 'system', 'chemical'].includes(this._config.card_type) ? b` <details class="advanced-section"><summary><ha-icon icon="mdi:swap-horizontal"></ha-icon><span>Entityen überschreiben</span></summary><div class="advanced-content"> ${this._config.card_type === 'pump' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? b `
                <ha-entity-picker label="Pumpe (override)" .hass="${this.hass}" .value="${this._config.pump_entity || ''}" .includeDomains="${['switch']}" @value-changed="${(e) => this._overrideChanged('pump_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker>
              ` : ''}
              ${this._config.card_type === 'heater' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? b` <ha-entity-picker label="Heater (override)" .hass="${this.hass}" .value="${this._config.heater_entity || ''}" .includeDomains="${['climate']}" @value-changed="${(e) => this._overrideChanged('heater_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker> ` : ''}
              ${this._config.card_type === 'solar' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? b` <ha-entity-picker label="Solar (override)" .hass="${this.hass}" .value="${this._config.solar_entity || ''}" .includeDomains="${['climate']}" @value-changed="${(e) => this._overrideChanged('solar_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker> ` : ''}
              ${this._config.card_type === 'dosing' || this._config.card_type === 'overview' || this._config.card_type === 'system' ? b` <ha-entity-picker label="Chlorine Dosing (override)" .hass="${this.hass}" .value="${this._config.chlorine_entity || ''}" .includeDomains="${['switch']}" @value-changed="${(e) => this._overrideChanged('chlorine_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker> ` : ''}
              ${['dosing', 'overview', 'system', 'chemical'].includes(this._config.card_type) ? b` <ha-entity-picker label="pH-Sensor (override)" .hass="${this.hass}" .value="${this._config.ph_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e) => this._overrideChanged('ph_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker><ha-entity-picker label="ORP-Sensor (override)" .hass="${this.hass}" .value="${this._config.orp_value_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e) => this._overrideChanged('orp_value_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker> ` : ''}
              ${['heater', 'solar', 'overview', 'system', 'chemical'].includes(this._config.card_type) ? b` <ha-entity-picker label="Pool-Temperatur (override)" .hass="${this.hass}" .value="${this._config.pool_temp_entity || ''}" .includeDomains="${['sensor']}" @value-changed="${(e) => this._overrideChanged('pool_temp_entity', e.detail.value)}" allow-custom-entity></ha-entity-picker> ` : ''}
            </div>
          </details>
        ` : ''}

        <!-- Advanced Customization -->
        <details class="advanced-section">
          <summary>
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Advanced Customization</span>
          </summary>

          <div class="advanced-content">
            <ha-textfield
              label="Accent Color (hex)"
              .value="${this._config.accent_color || ''}"
              placeholder="#2196F3"
              @input="${this._accentColorChanged}"
            ></ha-textfield>

            <ha-textfield
              label="Icon Color (hex)"
              .value="${this._config.icon_color || ''}"
              placeholder="#2196F3"
              @input="${this._iconColorChanged}"
            ></ha-textfield>

            <ha-textfield
              type="number"
              label="Blur Intensity (0-30)"
              .value="${this._config.blur_intensity || 10}"
              min="0"
              max="30"
              @input="${this._blurIntensityChanged}"
            ></ha-textfield>
          </div>
        </details>
      </div>
    `;
    }
    _formatSizeName(size) {
        const names = {
            small: 'Small',
            medium: 'Medium',
            large: 'Large',
            fullscreen: 'Fullscreen',
        };
        return names[size] || size;
    }
    _cardTypeChanged(ev) {
        const target = ev.target;
        if (this._config.card_type === target.value)
            return;
        this._config = {
            ...this._config,
            card_type: target.value,
        };
        this._fireConfigChanged();
    }
    _entityPrefixChanged(ev) {
        const target = ev.target;
        const value = target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        if (this._config.entity_prefix === value)
            return;
        this._config = {
            ...this._config,
            entity_prefix: value || 'violet_pool',
        };
        this._fireConfigChanged();
    }
    _entityChanged(ev) {
        const target = ev.detail;
        if (this._config.entity === target.value)
            return;
        this._config = {
            ...this._config,
            entity: target.value,
        };
        this._fireConfigChanged();
    }
    _sizeChanged(size) {
        this._config = {
            ...this._config,
            size: size,
        };
        this._fireConfigChanged();
    }
    _themeChanged(theme) {
        this._config = {
            ...this._config,
            theme: theme,
        };
        this._fireConfigChanged();
    }
    _animationChanged(animation) {
        this._config = {
            ...this._config,
            animation: animation,
        };
        this._fireConfigChanged();
    }
    _nameChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            name: target.value || undefined,
        };
        this._fireConfigChanged();
    }
    _iconChanged(ev) {
        this._config = {
            ...this._config,
            icon: ev.detail.value || undefined,
        };
        this._fireConfigChanged();
    }
    _showStateChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            show_state: target.checked,
        };
        this._fireConfigChanged();
    }
    _showDetailStatusChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            show_detail_status: target.checked,
        };
        this._fireConfigChanged();
    }
    _showControlsChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            show_controls: target.checked,
        };
        this._fireConfigChanged();
    }
    _showRuntimeChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            show_runtime: target.checked,
        };
        this._fireConfigChanged();
    }
    _showHistoryChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            show_history: target.checked,
        };
        this._fireConfigChanged();
    }
    _dosingTypeChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            dosing_type: target.value,
        };
        this._fireConfigChanged();
    }
    _accentColorChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            accent_color: target.value || undefined,
        };
        this._fireConfigChanged();
    }
    _iconColorChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            icon_color: target.value || undefined,
        };
        this._fireConfigChanged();
    }
    _blurIntensityChanged(ev) {
        const target = ev.target;
        this._config = {
            ...this._config,
            blur_intensity: parseInt(target.value) || 10,
        };
        this._fireConfigChanged();
    }
    _overrideChanged(key, value) {
        this._config = {
            ...this._config,
            [key]: value || undefined,
        };
        this._fireConfigChanged();
    }
    _fireConfigChanged() {
        const event = new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    static get styles() {
        return i$3`:host{font-family:-apple-system, system-ui, 'Segoe UI', sans-serif;}.card-config{display:flex;flex-direction:column;gap:14px;padding:16px;}.config-section{background:var(--card-background-color, #fff);border:1px solid var(--divider-color, rgba(0,0,0,0.08));border-radius:14px;padding:16px;}.section-header{display:flex;align-items:center;gap:8px;margin-bottom:14px;font-weight:600;font-size:14px;letter-spacing:-0.2px;color:var(--primary-text-color);}.section-header ha-icon{--mdc-icon-size:18px;color:var(--primary-color);}.prefix-info{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;margin-top:10px;background:rgba(0,122,255,0.07);border-radius:10px;font-size:12px;color:var(--secondary-text-color);line-height:1.4;}.prefix-info ha-icon{--mdc-icon-size:16px;color:#007AFF;flex-shrink:0;margin-top:2px;}.premium-section{background:var(--card-background-color, #fff);border:2px solid rgba(0,122,255,0.15);}.premium-header{color:#007AFF;}.picker-container{margin-bottom:20px;}.picker-container:last-child{margin-bottom:0;}.picker-container > label{display:block;font-weight:500;font-size:13px;margin-bottom:10px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px;}.size-picker{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}.theme-picker{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}.animation-picker{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}.size-button, .theme-button, .animation-button{display:flex;align-items:center;gap:10px;padding:10px;background:var(--secondary-background-color, rgba(120,120,128,0.06));border:1.5px solid transparent;border-radius:10px;cursor:pointer;transition:all 0.16s ease;font-family:inherit;}.size-button{flex-direction:column;gap:6px;align-items:center;}.theme-button{flex-direction:column;gap:6px;align-items:center;padding:10px 8px;}.size-button:hover, .theme-button:hover, .animation-button:hover{border-color:rgba(0,122,255,0.3);background:rgba(0,122,255,0.05);}.size-button.active, .animation-button.active{border-color:#007AFF;background:rgba(0,122,255,0.1);color:#007AFF;}.theme-button.active{border-color:#007AFF;background:rgba(0,122,255,0.08);box-shadow:0 0 0 3px rgba(0,122,255,0.15);}.size-preview{width:36px;height:26px;border-radius:6px;border:2px solid currentColor;opacity:0.3;}.size-preview.size-small{width:22px;height:18px;}.size-preview.size-medium{width:30px;height:22px;}.size-preview.size-large{width:40px;height:28px;}.size-preview.size-fullscreen{width:46px;height:34px;}.size-button.active .size-preview{opacity:1;}.size-button span{font-size:11px;font-weight:500;}.theme-preview{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(0,0,0,0.08);}.theme-preview.theme-apple{background:#F2F2F7;}.theme-preview.theme-dark{background:#1C1C1E;}.theme-preview.theme-glass{background:rgba(255,255,255,0.6);backdrop-filter:blur(8px);}.theme-preview.theme-modern{background:#f8f8fa;border:1px solid #eee;}.theme-preview.theme-minimalist{background:#fff;}.theme-preview.theme-neon{background:#0D0D14;border:1px solid rgba(0,212,255,0.3);}.theme-preview.theme-luxury{background:linear-gradient(135deg,rgba(255,255,255,0.9),rgba(240,240,255,0.9));}.theme-dot{width:20px;height:20px;border-radius:50%;border:2px solid rgba(0,0,0,0.1);}.theme-info, .anim-info{display:flex;flex-direction:column;gap:1px;}.theme-label, .anim-label{font-weight:600;color:var(--primary-text-color);font-size:12px;}.theme-desc, .anim-desc{color:var(--secondary-text-color);font-size:10px;}.anim-icon{font-size:18px;}.advanced-section{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:14px;padding:14px;}.advanced-section summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:14px;color:var(--primary-text-color);list-style:none;}.advanced-section summary::-webkit-details-marker{display:none;}.advanced-section summary ha-icon{--mdc-icon-size:18px;color:var(--primary-color);}.advanced-content{display:flex;flex-direction:column;gap:12px;margin-top:14px;}ha-select, ha-textfield, ha-entity-picker, ha-icon-picker{width:100%;}ha-formfield{display:flex;align-items:center;margin-bottom:10px;}`;
    }
}
__decorate([
    n({ attribute: false })
], VioletPoolCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], VioletPoolCardEditor.prototype, "_config", void 0);
if (!customElements.get('violet-pool-card-editor')) {
    customElements.define('violet-pool-card-editor', VioletPoolCardEditor);
}

var violetPoolCardEditor = /*#__PURE__*/Object.freeze({
    __proto__: null,
    VioletPoolCardEditor: VioletPoolCardEditor
});

export { VioletPoolCard };
//# sourceMappingURL=violet-pool-card.js.map
