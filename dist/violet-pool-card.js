function e(e,t,i,a){var s,o=arguments.length,r=o<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,a);else for(var n=e.length-1;n>=0;n--)(s=e[n])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),s=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new o(i,e,a)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,a))(t)})(e):e,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,v=m?m.emptyScript:"",f=g.reactiveElementPolyfillSupport,x=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},y=(e,t)=>!c(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&l(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:s}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const o=a?.call(this);s?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,a)=>{if(i)e.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of a){const a=document.createElement("style"),s=t.litNonce;void 0!==s&&a.setAttribute("nonce",s),a.textContent=i.cssText,e.appendChild(a)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=a;const o=s.fromAttribute(t,e.type);this[a]=o??this._$Ej?.get(a)??o,this._$Em=null}}requestUpdate(e,t,i,a=!1,s){if(void 0!==e){const o=this.constructor;if(!1===a&&(s=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??y)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:s},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==s||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[x("elementProperties")]=new Map,$[x("finalized")]=new Map,f?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.2");const _=globalThis,C=e=>e,k=_.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,F="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+E,T=`<${S}>`,z=document,P=()=>z.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,N=/>/g,H=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,V=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(e,...t)=>({_$litType$:1,strings:e,values:t}),j=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),W=new WeakMap,Y=z.createTreeWalker(z,129);function G(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const K=(e,t)=>{const i=e.length-1,a=[];let s,o=2===t?"<svg>":3===t?"<math>":"",r=R;for(let t=0;t<i;t++){const i=e[t];let n,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===R?"!--"===c[1]?r=D:void 0!==c[1]?r=N:void 0!==c[2]?(L.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=s??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,n=c[1],r=void 0===c[3]?H:'"'===c[3]?V:U):r===V||r===U?r=H:r===D||r===N?r=R:(r=H,s=void 0);const p=r===H&&e[t+1].startsWith("/>")?" ":"";o+=r===R?i+T:l>=0?(a.push(n),i.slice(0,l)+F+i.slice(l)+E+p):i+E+(-2===l?t:p)}return[G(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class Z{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let s=0,o=0;const r=e.length-1,n=this.parts,[c,l]=K(e,t);if(this.el=Z.createElement(c,i),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=Y.nextNode())&&n.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(F)){const t=l[o++],i=a.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?ae:ee}),a.removeAttribute(e)}else e.startsWith(E)&&(n.push({type:6,index:s}),a.removeAttribute(e));if(L.test(a.tagName)){const e=a.textContent.split(E),t=e.length-1;if(t>0){a.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],P()),Y.nextNode(),n.push({type:2,index:++s});a.append(e[t],P())}}}else if(8===a.nodeType)if(a.data===S)n.push({type:2,index:s});else{let e=-1;for(;-1!==(e=a.data.indexOf(E,e+1));)n.push({type:7,index:s}),e+=E.length-1}s++}}static createElement(e,t){const i=z.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,a){if(t===j)return t;let s=void 0!==a?i._$Co?.[a]:i._$Cl;const o=O(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(e),s._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=s:i._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,a)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??z).importNode(t,!0);Y.currentNode=a;let s=Y.nextNode(),o=0,r=0,n=i[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Q(s,s.nextSibling,this,e):1===n.type?t=new n.ctor(s,n.name,n.strings,this,e):6===n.type&&(t=new se(s,this,e)),this._$AV.push(t),n=i[++r]}o!==n?.index&&(s=Y.nextNode(),o++)}return Y.currentNode=z,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),O(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new J(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Z(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const s of e)a===t.length?t.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=t[a],i._$AI(s),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=C(e).nextSibling;C(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,s){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(e,t=this,i,a){const s=this.strings;let o=!1;if(void 0===s)e=X(this,e,t,0),o=!O(e)||e!==this._$AH&&e!==j,o&&(this._$AH=e);else{const a=e;let r,n;for(e=s[0],r=0;r<s.length-1;r++)n=X(this,a[i+r],t,r),n===j&&(n=this._$AH[r]),o||=!O(n)||n!==this._$AH[r],n===q?e=q:e!==q&&(e+=(n??"")+s[r+1]),this._$AH[r]=n}o&&!a&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class ae extends ee{constructor(e,t,i,a,s){super(e,t,i,a,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??q)===j)return;const i=this._$AH,a=e===q&&i!==q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==q&&(i===q||a);a&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const oe=_.litHtmlPolyfillSupport;oe?.(Z,Q),(_.litHtmlVersions??=[]).push("3.3.2");const re=globalThis;class ne extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let s=a._$litPart$;if(void 0===s){const e=i?.renderBefore??null;a._$litPart$=s=new Q(t.insertBefore(P(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}ne._$litElement$=!0,ne.finalized=!0,re.litElementHydrateSupport?.({LitElement:ne});const ce=re.litElementPolyfillSupport;ce?.({LitElement:ne}),(re.litElementVersions??=[]).push("4.2.2");const le=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},pe=(e=de,t,i)=>{const{kind:a,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,s,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const s=this[a];t.call(this,i),this.requestUpdate(a,s,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};function he(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ue(e){return he({...e,state:!0,attribute:!1})}const ge={off:{color:"#757575",icon:"mdi:power-off",label:"OFF"},on:{color:"#4CAF50",icon:"mdi:power-on",label:"ON"},auto:{color:"#2196F3",icon:"mdi:autorenew",label:"AUTO"},manual:{color:"#FF9800",icon:"mdi:hand-back-right",label:"MANUAL"},blocked:{color:"#FFC107",icon:"mdi:block-helper",label:"BLOCKED"},error:{color:"#F44336",icon:"mdi:alert-circle",label:"ERROR"},idle:{color:"#9E9E9E",icon:"mdi:sleep",label:"IDLE"},heat:{color:"#FF5722",icon:"mdi:fire",label:"HEAT"},heating:{color:"#FF5722",icon:"mdi:fire",label:"HEATING"},cool:{color:"#00BCD4",icon:"mdi:snowflake",label:"COOL"},cooling:{color:"#00BCD4",icon:"mdi:snowflake",label:"COOLING"}};let me=class extends ne{constructor(){super(...arguments),this.pulse=!1,this.showIcon=!0}render(){const e=ge[this.state]||ge.off,t=this.label||e.label,i=this.icon||e.icon;return B`
      <div
        class="badge ${this.state} ${this.pulse?"pulse":""}"
        style="--badge-color: ${e.color}"
      >
        ${this.showIcon?B`<ha-icon icon="${i}"></ha-icon>`:""}
        <span class="label">${t}</span>
      </div>
    `}static get styles(){return r`
      :host{display:inline-block}
      .badge{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 14px;border-radius:16px;background:var(--badge-color);color:white;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.1);transition:all 0.2s ease}
      .badge:hover{transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,0.15)}
      .badge ha-icon{--mdc-icon-size:16px;display:flex;align-items:center}
      .label{line-height:1}
      .badge.pulse{animation:pulse 2s ease-in-out infinite}
      @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.85;transform:scale(1.02)}}
      .badge.auto ha-icon{animation:rotate 3s linear infinite}
      @keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .badge.heating,.badge.cooling{animation:breathe 2s ease-in-out infinite}
      @keyframes breathe{0%,100%{opacity:1}50%{opacity:0.7}}
    `}};e([he()],me.prototype,"state",void 0),e([he()],me.prototype,"label",void 0),e([he()],me.prototype,"icon",void 0),e([he({type:Boolean})],me.prototype,"pulse",void 0),e([he({type:Boolean})],me.prototype,"showIcon",void 0),me=e([le("status-badge")],me);const ve={normal:{color:"#4CAF50",icon:"mdi:check-circle"},ok:{color:"#4CAF50",icon:"mdi:check-circle"},low:{color:"#2196F3",icon:"mdi:arrow-down-circle"},high:{color:"#FF9800",icon:"mdi:arrow-up-circle"},critical:{color:"#F44336",icon:"mdi:alert-circle"},warning:{color:"#FF9800",icon:"mdi:alert"},error:{color:"#F44336",icon:"mdi:close-circle"}};let fe=class extends ne{constructor(){super(...arguments),this.unit="",this.label="",this.status="normal",this.decimals=1,this.showStatus=!0,this.showRange=!1,this.large=!1}formatValue(e){return null==e?"--":e.toFixed(this.decimals)}getStatusFromValue(){return void 0===this.value||null===this.value?"normal":"normal"!==this.status?this.status:void 0!==this.min&&this.value<this.min?this.value<.9*this.min?"critical":"low":void 0!==this.max&&this.value>this.max?this.value>1.1*this.max?"critical":"high":"normal"}render(){const e=this.getStatusFromValue(),t=ve[e];return B`
      <div class="value-display ${this.large?"large":""}">
        ${this.label?B`<div class="label">${this.label}</div>`:""}

        <div class="value-container">
          <div class="value" style="color: ${t.color}">
            ${this.formatValue(this.value)}
            ${this.unit?B`<span class="unit">${this.unit}</span>`:""}
          </div>

          ${this.showStatus?B`
                <ha-icon
                  icon="${t.icon}"
                  style="color: ${t.color}"
                ></ha-icon>
              `:""}
        </div>

        ${void 0!==this.target?B`
              <div class="target">
                → ${this.formatValue(this.target)}${this.unit}
              </div>
            `:""}

        ${!this.showRange||void 0===this.min&&void 0===this.max?"":B`
              <div class="range">
                ${void 0!==this.min?B`<span class="range-min">Min: ${this.formatValue(this.min)}${this.unit}</span>`:""}
                ${void 0!==this.max?B`<span class="range-max">Max: ${this.formatValue(this.max)}${this.unit}</span>`:""}
              </div>
            `}
      </div>
    `}static get styles(){return r`
      :host{display:block}
      .value-display{display:flex;flex-direction:column;gap:4px}
      .label{font-size:12px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px}
      .value-container{display:flex;align-items:center;gap:8px}
      .value{font-size:24px;font-weight:700;line-height:1;color:var(--primary-text-color);display:flex;align-items:baseline;gap:4px}
      .value-display.large .value{font-size:32px;font-weight:800}
      .unit{font-size:16px;font-weight:500;opacity:0.8}
      .value-display.large .unit{font-size:20px}
      ha-icon{--mdc-icon-size:20px;flex-shrink:0}
      .target{font-size:14px;color:var(--secondary-text-color);display:flex;align-items:center;gap:4px}
      .range{display:flex;gap:12px;font-size:11px;color:var(--disabled-text-color);margin-top:4px}
      .range-min::before{content:'\\25BC ';color:var(--info-color,#2196F3)}
      .range-max::before{content:'\\25B2 ';color:var(--warning-color,#FF9800)}
    `}};e([he({type:Number})],fe.prototype,"value",void 0),e([he()],fe.prototype,"unit",void 0),e([he()],fe.prototype,"label",void 0),e([he()],fe.prototype,"status",void 0),e([he({type:Number})],fe.prototype,"min",void 0),e([he({type:Number})],fe.prototype,"max",void 0),e([he({type:Number})],fe.prototype,"target",void 0),e([he({type:Number})],fe.prototype,"decimals",void 0),e([he({type:Boolean})],fe.prototype,"showStatus",void 0),e([he({type:Boolean})],fe.prototype,"showRange",void 0),e([he({type:Boolean})],fe.prototype,"large",void 0),fe=e([le("value-display")],fe);let xe=class extends ne{constructor(){super(...arguments),this.compact=!1}parsePipeSeparated(e){if(!e||"string"!=typeof e)return{status:""};const t=e.split("|");if(2===t.length){const e=parseInt(t[0],10),i=this.formatStatusText(t[1]);return{level:isNaN(e)?void 0:e,status:i}}return{status:this.formatStatusText(e)}}formatStatusText(e){return e?e.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" "):""}parseArray(e){return Array.isArray(e)?e.map(e=>this.formatStatusText(e)).filter(e=>e):[]}getIconForStatus(e){const t=e.toLowerCase();return t.includes("freeze")||t.includes("frost")?"mdi:snowflake-alert":t.includes("blocked")||t.includes("block")?"mdi:block-helper":t.includes("threshold")||t.includes("limit")?"mdi:speedometer":t.includes("temp")?"mdi:thermometer-alert":t.includes("error")?"mdi:alert-circle":t.includes("ok")||t.includes("normal")?"mdi:check-circle":"mdi:information"}getColorForStatus(e){const t=e.toLowerCase();return t.includes("error")||t.includes("critical")?"var(--error-color, #F44336)":t.includes("blocked")||t.includes("freeze")?"var(--warning-color, #FF9800)":t.includes("ok")||t.includes("normal")?"var(--success-color, #4CAF50)":"var(--info-color, #2196F3)"}render(){if(!this.raw)return B``;if(Array.isArray(this.raw)){const e=this.parseArray(this.raw);return 0===e.length?B``:B`
        <div class="detail-status-list ${this.compact?"compact":""}">
          ${e.map(e=>B`
              <div class="status-item" style="color: ${this.getColorForStatus(e)}">
                <ha-icon icon="${this.icon||this.getIconForStatus(e)}"></ha-icon>
                <span class="status-text">${e}</span>
              </div>
            `)}
        </div>
      `}const e=this.parsePipeSeparated(this.raw);if(!e.status)return B``;const t=this.getColorForStatus(e.status),i=this.icon||this.getIconForStatus(e.status);return B`
      <div class="detail-status ${this.compact?"compact":""}" style="color: ${t}">
        <ha-icon icon="${i}"></ha-icon>
        <div class="status-content">
          ${void 0!==e.level?B`<span class="level">Level ${e.level}:</span>`:""}
          <span class="status-text">${e.status}</span>
        </div>
      </div>
    `}static get styles(){return r`
      :host{display:block}
      .detail-status{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--card-background-color);border-radius:8px;border-left:3px solid currentColor;font-size:14px;line-height:1.4}
      .detail-status.compact{padding:4px 8px;font-size:12px}
      .detail-status ha-icon{--mdc-icon-size:20px;flex-shrink:0}
      .detail-status.compact ha-icon{--mdc-icon-size:16px}
      .status-content{display:flex;flex-wrap:wrap;align-items:center;gap:4px;flex:1}
      .level{font-weight:600;opacity:0.9}
      .status-text{font-weight:500}
      .detail-status-list{display:flex;flex-direction:column;gap:6px}
      .detail-status-list.compact{gap:4px}
      .status-item{display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--card-background-color);border-radius:6px;border-left:2px solid currentColor;font-size:13px}
      .detail-status-list.compact .status-item{padding:4px 8px;font-size:11px}
      .status-item ha-icon{--mdc-icon-size:16px;flex-shrink:0}
      .detail-status-list.compact .status-item ha-icon{--mdc-icon-size:14px}
      .status-item .status-text{font-weight:500}
    `}};e([he()],xe.prototype,"raw",void 0),e([he()],xe.prototype,"icon",void 0),e([he({type:Boolean})],xe.prototype,"compact",void 0),xe=e([le("detail-status")],xe);const be={info:{color:"#2196F3",backgroundColor:"rgba(33, 150, 243, 0.1)",icon:"mdi:information"},warning:{color:"#FF9800",backgroundColor:"rgba(255, 152, 0, 0.1)",icon:"mdi:alert"},error:{color:"#F44336",backgroundColor:"rgba(244, 67, 54, 0.1)",icon:"mdi:alert-circle"},success:{color:"#4CAF50",backgroundColor:"rgba(76, 175, 80, 0.1)",icon:"mdi:check-circle"}};let ye=class extends ne{constructor(){super(...arguments),this.warnings=[],this.defaultType="warning",this.dismissable=!1,this.dismissedWarnings=new Set}normalizeWarnings(){return this.warnings.map(e=>"string"==typeof e?{text:this.formatWarningText(e),type:this.getWarningType(e),dismissable:this.dismissable}:{...e,text:this.formatWarningText(e.text),type:e.type||this.defaultType,dismissable:void 0!==e.dismissable?e.dismissable:this.dismissable})}formatWarningText(e){return e?e.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" "):""}getWarningType(e){const t=e.toLowerCase();return t.includes("error")||t.includes("critical")||t.includes("failed")?"error":t.includes("blocked")||t.includes("threshold")||t.includes("limit")?"warning":t.includes("ok")||t.includes("success")||t.includes("complete")?"success":"info"}handleDismiss(e){this.dismissedWarnings.add(e.text),this.requestUpdate(),this.dispatchEvent(new CustomEvent("warning-dismissed",{detail:{warning:e},bubbles:!0,composed:!0}))}isDismissed(e){return this.dismissedWarnings.has(e.text)}render(){const e=this.normalizeWarnings().filter(e=>!this.isDismissed(e));return 0===e.length?B``:B`
      <div class="warning-chips">
        ${e.map(e=>this.renderChip(e))}
      </div>
    `}renderChip(e){const t=e.type||this.defaultType,i=be[t],a=e.icon||i.icon;return B`
      <div
        class="chip ${t}"
        style="
          --chip-color: ${i.color};
          --chip-bg: ${i.backgroundColor};
        "
      >
        <ha-icon icon="${a}"></ha-icon>
        <span class="chip-text">${e.text}</span>
        ${e.dismissable?B`
              <button
                class="dismiss-button"
                @click="${()=>this.handleDismiss(e)}"
                title="Dismiss"
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            `:""}
      </div>
    `}static get styles(){return r`
      :host{display:block}
      .warning-chips{display:flex;flex-wrap:wrap;gap:8px}
      .chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:16px;background:var(--chip-bg);color:var(--chip-color);font-size:13px;font-weight:500;line-height:1.2;border:1px solid var(--chip-color);transition:all 0.2s ease}
      .chip:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(0,0,0,0.1)}
      .chip ha-icon{--mdc-icon-size:16px;flex-shrink:0}
      .chip-text{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .dismiss-button{display:flex;align-items:center;justify-content:center;padding:0;margin:0;border:none;background:none;color:var(--chip-color);cursor:pointer;opacity:0.7;transition:opacity 0.2s ease}
      .dismiss-button:hover{opacity:1}
      .dismiss-button ha-icon{--mdc-icon-size:14px}
      .chip.error{animation:pulse-error 2s ease-in-out infinite}
      @keyframes pulse-error{0%,100%{opacity:1}50%{opacity:0.85}}
      @media(max-width:600px){.warning-chips{flex-direction:column}.chip{width:100%;box-sizing:border-box}.chip-text{white-space:normal;overflow:visible}}
    `}};e([he({type:Array})],ye.prototype,"warnings",void 0),e([he()],ye.prototype,"defaultType",void 0),e([he({type:Boolean})],ye.prototype,"dismissable",void 0),e([ue()],ye.prototype,"dismissedWarnings",void 0),ye=e([le("warning-chips")],ye);let we=class extends ne{constructor(){super(...arguments),this.min=0,this.max=100,this.step=1,this.value=0,this.unit="",this.label="",this.disabled=!1,this.vertical=!1,this.showValue=!0,this.showMinMax=!1,this.isDragging=!1,this.localValue=0,this.debounceDelay=300}connectedCallback(){super.connectedCallback(),this.localValue=this.value}updated(e){e.has("value")&&!this.isDragging&&(this.localValue=this.value)}handleInput(e){const t=Number(e.target.value);this.localValue=t,this.isDragging=!0,this.dispatchEvent(new CustomEvent("slider-input",{detail:{value:t},bubbles:!0,composed:!0}))}handleChange(e){const t=Number(e.target.value);this.localValue=t,this.isDragging=!1,this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))},this.debounceDelay)}handleStart(){this.isDragging=!0}handleEnd(){this.isDragging=!1}getLabelForValue(e){if(!this.labels||0===this.labels.length)return"";if("string"==typeof this.labels[0]){const t=Math.round((e-this.min)/this.step);return this.labels[t]||""}const t=this.labels.find(t=>t.value===e);return t?t.label:""}getAllLabels(){if(!this.labels||0===this.labels.length)return[];const e=this.max-this.min;return"string"==typeof this.labels[0]?this.labels.map((t,i)=>{const a=this.min+i*this.step;return{value:a,label:t,position:(a-this.min)/e*100}}):this.labels.map(t=>{const i=(t.value-this.min)/e*100;return{value:t.value,label:t.label,position:i}})}formatValue(e){const t=this.getLabelForValue(e);if(t)return t;const i=this.step<1?1:0;return`${e.toFixed(i)}${this.unit}`}render(){const e=(this.localValue-this.min)/(this.max-this.min)*100,t=this.getAllLabels();return B`
      <div class="slider-container ${this.vertical?"vertical":""} ${this.disabled?"disabled":""}">
        ${this.label?B`<div class="slider-label">${this.label}</div>`:""}

        ${this.showValue?B`
              <div class="value-display ${this.isDragging?"dragging":""}">
                ${this.formatValue(this.localValue)}
              </div>
            `:""}

        <div class="slider-wrapper">
          ${this.showMinMax?B`<span class="min-max-label">${this.formatValue(this.min)}</span>`:""}

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
              style="--percentage: ${e}%"
            />
          </div>

          ${this.showMinMax?B`<span class="min-max-label">${this.formatValue(this.max)}</span>`:""}
        </div>

        ${t.length>0?B`
              <div class="labels">
                ${t.map(e=>B`
                    <span
                      class="label-item ${this.localValue===e.value?"active":""}"
                      style="left: ${e.position}%"
                      @click="${()=>!this.disabled&&this.handleChange({target:{value:e.value}})}"
                    >
                      ${e.label}
                    </span>
                  `)}
              </div>
            `:""}
      </div>
    `}static get styles(){return r`
      :host{display:block}
      .slider-container{width:100%;user-select:none}
      .slider-container.disabled{opacity:0.5;pointer-events:none}
      .slider-label{font-size:12px;font-weight:500;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
      .value-display{text-align:center;font-size:28px;font-weight:700;margin-bottom:12px;color:var(--primary-text-color);transition:all 0.2s ease}
      .value-display.dragging{color:var(--primary-color);transform:scale(1.05)}
      .slider-wrapper{display:flex;align-items:center;gap:12px;padding:8px 0}
      .min-max-label{font-size:11px;color:var(--secondary-text-color);min-width:40px;text-align:center}
      .slider-track-wrapper{flex:1;position:relative}
      .slider{width:100%;height:8px;-webkit-appearance:none;appearance:none;background:linear-gradient(to right,var(--primary-color) 0%,var(--primary-color) var(--percentage),var(--disabled-color,#e0e0e0) var(--percentage),var(--disabled-color,#e0e0e0) 100%);border-radius:4px;outline:none;cursor:pointer;transition:opacity 0.2s}
      .slider:hover{opacity:0.9}
      .slider:disabled{cursor:not-allowed}
      .slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;border-radius:50%;background:var(--primary-color);cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.2s ease;border:3px solid white}
      .slider::-webkit-slider-thumb:hover{transform:scale(1.1);box-shadow:0 3px 8px rgba(0,0,0,0.3)}
      .slider:active::-webkit-slider-thumb{transform:scale(1.15);box-shadow:0 4px 12px rgba(0,0,0,0.4)}
      .slider::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:var(--primary-color);cursor:pointer;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);transition:all 0.2s ease}
      .slider::-moz-range-thumb:hover{transform:scale(1.1);box-shadow:0 3px 8px rgba(0,0,0,0.3)}
      .slider:active::-moz-range-thumb{transform:scale(1.15);box-shadow:0 4px 12px rgba(0,0,0,0.4)}
      .slider::-moz-range-track{background:transparent;border:none}
      .labels{position:relative;display:flex;justify-content:space-between;margin-top:12px;font-size:11px;color:var(--secondary-text-color)}
      .label-item{position:absolute;transform:translateX(-50%);cursor:pointer;padding:4px 8px;border-radius:4px;transition:all 0.2s ease;white-space:nowrap}
      .label-item:hover{background:var(--divider-color,rgba(0,0,0,0.05));color:var(--primary-text-color)}
      .label-item.active{font-weight:600;color:var(--primary-color)}
      .slider-container.vertical .slider{transform:rotate(-90deg);transform-origin:left center}
      @media(pointer:coarse){.slider::-webkit-slider-thumb{width:28px;height:28px}.slider::-moz-range-thumb{width:28px;height:28px}}
    `}};e([he({type:Number})],we.prototype,"min",void 0),e([he({type:Number})],we.prototype,"max",void 0),e([he({type:Number})],we.prototype,"step",void 0),e([he({type:Number})],we.prototype,"value",void 0),e([he()],we.prototype,"unit",void 0),e([he()],we.prototype,"label",void 0),e([he({type:Array})],we.prototype,"labels",void 0),e([he({type:Boolean})],we.prototype,"disabled",void 0),e([he({type:Boolean})],we.prototype,"vertical",void 0),e([he({type:Boolean})],we.prototype,"showValue",void 0),e([he({type:Boolean})],we.prototype,"showMinMax",void 0),e([ue()],we.prototype,"isDragging",void 0),e([ue()],we.prototype,"localValue",void 0),we=e([le("slider-control")],we);let $e=class extends ne{constructor(){super(...arguments),this.actions=[],this.vertical=!1,this.compact=!1,this.loadingStates=new Map}async handleActionClick(e,t){if(!e.disabled&&!this.loadingStates.get(t)){if(e.confirmMessage&&!await this.showConfirmation(e.confirmMessage))return;this.loadingStates.set(t,!0),this.requestUpdate();try{await e.action(),this.dispatchEvent(new CustomEvent("action-executed",{detail:{action:e,index:t},bubbles:!0,composed:!0}))}catch(i){this.dispatchEvent(new CustomEvent("action-error",{detail:{action:e,index:t,error:i},bubbles:!0,composed:!0}))}finally{this.loadingStates.set(t,!1),this.requestUpdate()}}}async showConfirmation(e){return confirm(e)}renderAction(e,t){const i=this.loadingStates.get(t)||e.loading,a=e.disabled||i;return B`
      <button
        class="quick-action ${e.active?"active":""} ${a?"disabled":""} ${i?"loading":""}"
        @click="${()=>this.handleActionClick(e,t)}"
        ?disabled="${a}"
        style="${e.color?`--action-color: ${e.color}`:""}"
        title="${e.label}"
      >
        <div class="action-content">
          ${i?B`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`:B`<ha-icon icon="${e.icon}"></ha-icon>`}
          ${this.compact?"":B`<span class="action-label">${e.label}</span>`}
        </div>
      </button>
    `}render(){return 0===this.actions.length?B``:B`
      <div class="quick-actions ${this.vertical?"vertical":""} ${this.compact?"compact":""}">
        ${this.actions.map((e,t)=>this.renderAction(e,t))}
      </div>
    `}static get styles(){return r`
      :host{display:block}
      .quick-actions{display:flex;gap:8px;flex-wrap:wrap}
      .quick-actions.vertical{flex-direction:column}
      .quick-actions.compact{gap:4px}
      .quick-action{flex:1;min-width:0;display:flex;align-items:center;justify-content:center;padding:12px 16px;border:2px solid var(--divider-color,rgba(0,0,0,0.12));border-radius:8px;background:var(--card-background-color,#fff);color:var(--primary-text-color);cursor:pointer;font-size:14px;font-weight:500;transition:all 0.2s ease;position:relative;overflow:hidden}
      .quick-actions.compact .quick-action{padding:10px;min-width:48px;min-height:48px}
      .quick-action:hover:not(.disabled){background:var(--divider-color,rgba(0,0,0,0.05));border-color:var(--primary-color);transform:translateY(-2px);box-shadow:0 2px 8px rgba(0,0,0,0.1)}
      .quick-action:active:not(.disabled){transform:translateY(0);box-shadow:0 1px 4px rgba(0,0,0,0.1)}
      .quick-action.active{background:var(--action-color,var(--primary-color));border-color:var(--action-color,var(--primary-color));color:white}
      .quick-action.active:hover:not(.disabled){background:var(--action-color,var(--primary-color));opacity:0.9}
      .quick-action.disabled{opacity:0.5;cursor:not-allowed}
      .quick-action.loading{pointer-events:none}
      .action-content{display:flex;align-items:center;justify-content:center;gap:8px;width:100%}
      .quick-actions.compact .action-content{gap:0}
      .quick-action ha-icon{--mdc-icon-size:20px;flex-shrink:0}
      .quick-actions.compact .quick-action ha-icon{--mdc-icon-size:24px}
      .action-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .spin{animation:spin 1s linear infinite}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .quick-action::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;border-radius:50%;background:rgba(255,255,255,0.3);transform:translate(-50%,-50%);transition:width 0.6s,height 0.6s}
      .quick-action:active:not(.disabled)::before{width:200%;height:200%}
      @media(pointer:coarse){.quick-action{min-height:48px}}
      @media(max-width:600px){.quick-actions:not(.vertical){flex-direction:column}.quick-action{width:100%}}
    `}};e([he({type:Array})],$e.prototype,"actions",void 0),e([he({type:Boolean})],$e.prototype,"vertical",void 0),e([he({type:Boolean})],$e.prototype,"compact",void 0),e([ue()],$e.prototype,"loadingStates",void 0),$e=e([le("quick-actions")],$e);class _e{constructor(e){this.hass=e}showToast(e,t=3e3){const i=new CustomEvent("hass-notification",{detail:{message:e,duration:t},bubbles:!0,composed:!0});window.dispatchEvent(i)}async callService(e,t,i){try{return await this.hass.callService(e,t,i),{success:!0}}catch(e){const t=e instanceof Error?e.message:String(e);return this.showToast(`Error: ${t}`,5e3),{success:!1,error:t}}}async controlPump(e,t,i,a){const s={entity_id:e,action:t};void 0!==i&&(s.speed=i),void 0!==a&&(s.duration=a);const o=await this.callService("violet_pool_controller","control_pump",s);if(o.success){const e=void 0!==i?` (Speed ${i})`:"";this.showToast(`Pump ${t.toUpperCase()}${e}`)}return o}async setTemperature(e,t){const i=await this.callService("climate","set_temperature",{entity_id:e,temperature:t});return i.success&&this.showToast(`Temperature set to ${t}°C`),i}async setHvacMode(e,t){const i=await this.callService("climate","set_hvac_mode",{entity_id:e,hvac_mode:t});return i.success&&this.showToast(`HVAC mode set to ${t.toUpperCase()}`),i}async setNumberValue(e,t){const i=await this.callService("number","set_value",{entity_id:e,value:t});return i.success&&this.showToast(`Value set to ${t}`),i}async turnOn(e){const t=e.split(".")[0],i=await this.callService(t,"turn_on",{entity_id:e});return i.success&&this.showToast(`${e.split(".")[1]} turned ON`),i}async turnOff(e){const t=e.split(".")[0],i=await this.callService(t,"turn_off",{entity_id:e});return i.success&&this.showToast(`${e.split(".")[1]} turned OFF`),i}async toggle(e){const t=e.split(".")[0],i=await this.callService(t,"toggle",{entity_id:e});return i.success&&this.showToast(`${e.split(".")[1]} toggled`),i}async smartDosing(e,t,i="on"){const a=await this.callService("violet_pool_controller","smart_dosing",{dosing_type:e,duration:t,action:i});if(a.success){const i={cl:"Chlorine",phm:"pH-",php:"pH+",floc:"Flocculant"};this.showToast(`${i[e]} dosing for ${t}s`)}return a}async manualDosing(e,t=30){const i=e.match(/dos_\d+_(\w+)/);if(!i)return{success:!1,error:"Could not determine dosing type from entity"};const a={cl:"cl",phm:"phm",php:"php",floc:"floc"}[i[1]];return a?this.smartDosing(a,t):{success:!1,error:`Unknown dosing type: ${i[1]}`}}async setPumpSpeed(e,t){return t<0||t>3?{success:!1,error:"Speed must be between 0 and 3"}:this.controlPump(e,"on",t)}async setControllerMode(e,t){if("off"===t)return this.turnOff(e);const i="manual"===t?"on":"auto";return this.controlPump(e,i)}}class Ce{static parsePumpState(e){if(!e||"string"!=typeof e)return{status:"",rawState:""};const t=e.split("|");if(2===t.length){const i=parseInt(t[0],10),a=this.formatSnakeCase(t[1]);return{level:isNaN(i)?void 0:i,status:a,rawState:e}}return{status:this.formatSnakeCase(e),rawState:e}}static parseHeaterState(e){return this.parsePumpState(e)}static parseSolarState(e){return this.parsePumpState(e)}static formatSnakeCase(e){return e?e.split("_").map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(" "):""}static getCurrentTemperature(e){const t=e?.attributes?.current_temperature;return void 0!==t?Number(t):void 0}static getTargetTemperature(e){const t=e?.attributes?.temperature;return void 0!==t?Number(t):void 0}static getMinTemperature(e){const t=e?.attributes?.min_temp;return void 0!==t?Number(t):void 0}static getMaxTemperature(e){const t=e?.attributes?.max_temp;return void 0!==t?Number(t):void 0}}class ke{static getTemperatureColor(e){return e<15?{color:"#2196F3",intensity:"high"}:e<20?{color:"#00BCD4",intensity:"medium"}:e<26?{color:"#4CAF50",intensity:"low"}:e<30?{color:"#FF9800",intensity:"medium"}:{color:"#F44336",intensity:"high"}}static getPhColor(e,t=7.2){const i=Math.abs(e-t);return i<.1?{color:"#4CAF50",intensity:"low"}:i<.3?{color:"#8BC34A",intensity:"low"}:i<.5?{color:"#FF9800",intensity:"medium"}:{color:"#F44336",intensity:"high"}}static getOrpColor(e,t=700){return e<t-100?{color:"#F44336",intensity:"high"}:e<t-50?{color:"#FF9800",intensity:"medium"}:e>t+100?{color:"#F44336",intensity:"high"}:e>t+50?{color:"#FF9800",intensity:"medium"}:{color:"#4CAF50",intensity:"low"}}static getPumpSpeedColor(e){switch(e){case 0:default:return{color:"#757575",intensity:"low"};case 1:return{color:"#2196F3",intensity:"low"};case 2:return{color:"#4CAF50",intensity:"medium"};case 3:return{color:"#FF9800",intensity:"high"}}}static getEntityStateColor(e){const t=e.toLowerCase();return"on"===t||"heat"===t||"active"===t?{color:"#4CAF50",intensity:"medium"}:"off"===t||"idle"===t?{color:"#757575",intensity:"low"}:"auto"===t?{color:"#2196F3",intensity:"medium"}:"manual"===t?{color:"#FF9800",intensity:"medium"}:t.includes("blocked")||t.includes("error")?{color:"#F44336",intensity:"high"}:t.includes("warning")?{color:"#FFC107",intensity:"medium"}:{color:"#9E9E9E",intensity:"low"}}static getPercentageColor(e,t=100){const i=Math.abs(e-t);return i<10?{color:"#4CAF50",intensity:"low"}:i<25?{color:"#8BC34A",intensity:"low"}:i<50?{color:"#FF9800",intensity:"medium"}:{color:"#F44336",intensity:"high"}}static getIntensityOpacity(e){switch(e){case"low":return.15;case"medium":return.25;case"high":return.35;default:return.2}}static applyColorToElement(e,t,i=!0){if(e.style.setProperty("--state-color",t.color),i){const i=this.getIntensityOpacity(t.intensity),a=this.hexToRgb(t.color);a&&(e.style.background=`rgba(${a.r}, ${a.g}, ${a.b}, ${i})`)}}static hexToRgb(e){const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}}let Ae=class extends ne{setConfig(e){if(!e.card_type)throw new Error("You need to define a card_type");if("overview"!==e.card_type&&"system"!==e.card_type&&!e.entity)throw new Error("You need to define an entity");this.config={show_state:!0,show_detail_status:!0,show_controls:!0,show_runtime:!1,show_history:!1,size:"medium",theme:"apple",animation:"smooth",blur_intensity:10,style:"standard",show_flow_animation:!1,entity_prefix:"violet_pool",...e}}_buildEntityId(e,t){return`${e}.${this.config.entity_prefix||"violet_pool"}_${t}`}_getEntityId(e,t,i,a){return this.config[e]||(void 0!==a&&this.config.entities&&this.config.entities[a]?this.config.entities[a]:this._buildEntityId(t,i))}_getFriendlyState(e,t){return"pump"===t&&"on"===e?"Running":{on:"Active",off:"Off",auto:"Auto",heat:"Heating",heating:"Heating",cool:"Cooling",cooling:"Cooling",idle:"Idle",unavailable:"Unavailable",unknown:"Unknown",manual:"Manual"}[e]??e.charAt(0).toUpperCase()+e.slice(1)}_getValuePercent(e,t,i){return i<=t?0:Math.min(100,Math.max(0,(e-t)/(i-t)*100))}_showMoreInfo(e){const t=new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0});this.dispatchEvent(t)}render(){if(!this.config||!this.hass)return B``;if(this.config.entity&&!this.hass.states[this.config.entity])return B`
          <ha-card>
            <div class="error-state">
              <div class="error-icon">
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
              </div>
              <div class="error-info">
                <span class="error-title">Entity Not Found</span>
                <span class="error-entity">${this.config.entity}</span>
              </div>
            </div>
          </ha-card>
        `;switch(this.config.card_type){case"pump":return this.renderPumpCard();case"heater":return this.renderHeaterCard();case"solar":return this.renderSolarCard();case"dosing":return this.renderDosingCard();case"overview":return this.renderOverviewCard();case"compact":return this.renderCompactCard();case"system":return this.renderSystemCard();default:return B`
          <ha-card>
            <div class="error-state">
              <div class="error-icon">
                <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
              </div>
              <div class="error-info">
                <span class="error-title">Unknown Card Type</span>
                <span class="error-entity">${this.config.card_type}</span>
              </div>
            </div>
          </ha-card>
        `}}_getCardClasses(e,t){const i=[];return i.push(`size-${t.size||"medium"}`),t.theme?i.push(`theme-${t.theme}`):i.push(t.style||"standard"),t.animation&&"none"!==t.animation&&i.push(`animation-${t.animation}`),(t.show_flow_animation||"energetic"===t.animation)&&e&&i.push("flow-active"),e&&i.push("is-active"),i.join(" ")}_getAccentColor(e,t){if(t.accent_color)return t.accent_color;switch(e){case"pump":default:return"#2196F3";case"heater":return"#FF5722";case"solar":return"#FF9800";case"dosing":return"#4CAF50";case"overview":return"#7C4DFF"}}renderSystemCard(){const e=this._getEntityId("pump_entity","switch","pump",0),t=this._getEntityId("heater_entity","climate","heater",1),i=this._getEntityId("solar_entity","climate","solar",2),a=this._getEntityId("chlorine_entity","switch","dos_1_cl",3),s=(e,t,i={})=>"overview"===e||this.hass.states[t]?{...this.config,card_type:e,entity:t,entity_prefix:this.config.entity_prefix||"violet_pool",...i}:null,o=s("overview","",{name:"Pool Overview"}),r=s("pump",e,{show_runtime:!0}),n=s("heater",t),c=s("solar",i),l=s("dosing",a,{dosing_type:"chlorine"});return B`
      <div class="system-grid">
        ${o?this.renderOverviewCard(o):""}
        ${r?this.renderPumpCard(r):""}
        ${n?this.renderHeaterCard(n):""}
        ${c?this.renderSolarCard(c):""}
        ${l?this.renderDosingCard(l):""}
      </div>
    `}renderPumpCard(e=this.config){const t=this.hass.states[e.entity],i=t.state,a=e.name||t.attributes.friendly_name||"Pump",s=t.attributes?.PUMPSTATE||"",o=this._getAccentColor("pump",e),r=Ce.parsePumpState(s),n=void 0!==r.level?r.level:0,c=[t.attributes?.PUMP_RPM_0||0,t.attributes?.PUMP_RPM_1||0,t.attributes?.PUMP_RPM_2||0,t.attributes?.PUMP_RPM_3||0][n]||0,l=t.attributes?.runtime||0,d=Math.floor(l/3600),p=Math.floor(l%3600/60),h=d>0?`${d}h ${p}min`:`${p}min`,u=ke.getPumpSpeedColor(n),g="on"===i||n>0,m=["OFF","ECO","Normal","Boost"],v=["#8E8E93","#34C759","#FF9F0A","#FF3B30"],f=["mdi:power-off","mdi:speedometer-slow","mdi:speedometer-medium","mdi:speedometer"];return B`
      <ha-card
        class="${this._getCardClasses(g,e)}"
        style="--card-accent: ${o}"
        @click="${()=>this._showMoreInfo(e.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${g?"icon-active":""}" style="--icon-accent: ${o}">
              <ha-icon
                icon="${e.icon||"mdi:pump"}"
                class="${g?"pump-running":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle" style="${g?`color: ${u.color}`:""}">
                ${g?`${m[n]}${c>0?` · ${c} RPM`:""}`:this._getFriendlyState(i,"pump")}
              </span>
            </div>
            ${e.show_state?B`<status-badge .state="${i}" .pulse="${g}"></status-badge>`:""}
          </div>

          <!-- Speed Segments Visual Indicator -->
          <div class="speed-segments-container">
            <div class="speed-segments">
              ${[1,2,3].map(t=>B`
                <button
                  class="speed-segment ${n===t?"seg-active":n>t?"seg-past":""}"
                  style="--seg-color: ${v[t]}"
                  @click="${i=>{i.stopPropagation(),new _e(this.hass).setPumpSpeed(e.entity,t)}}"
                  title="${m[t]}"
                >
                  <ha-icon icon="${f[t]}" style="--mdc-icon-size: 14px"></ha-icon>
                  <span>${m[t]}</span>
                </button>
              `)}
            </div>
            <button
              class="speed-off-btn ${0===n?"seg-active":""}"
              style="--seg-color: ${v[0]}"
              @click="${t=>{t.stopPropagation(),new _e(this.hass).turnOff(e.entity)}}"
              title="OFF"
            >
              <ha-icon icon="mdi:power" style="--mdc-icon-size: 16px"></ha-icon>
            </button>
          </div>

          ${e.show_detail_status&&s?B`<detail-status .raw="${s}"></detail-status>`:""}

          ${e.show_controls?B`
                <slider-control
                  label="Speed Level"
                  min="0"
                  max="3"
                  step="1"
                  .value="${n}"
                  .labels="${["OFF","ECO","Normal","Boost"]}"
                  @value-changed="${t=>this._handlePumpSpeedChange(t,e.entity)}"
                ></slider-control>
              `:""}

          ${e.show_runtime&&l>0?B`
                <div class="info-row">
                  <ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span class="info-label">Runtime</span>
                  <span class="info-value">${h}</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}async _handlePumpSpeedChange(e,t){const i=e.detail.value,a=new _e(this.hass);await a.setPumpSpeed(t,i)}renderHeaterCard(e=this.config){const t=this.hass.states[e.entity],i=t.state,a=e.name||t.attributes.friendly_name||"Heater",s=this._getAccentColor("heater",e),o=Ce.getCurrentTemperature(t),r=Ce.getTargetTemperature(t),n=Ce.getMinTemperature(t)||18,c=Ce.getMaxTemperature(t)||35,l=t.attributes?.HEATERSTATE||"",d=t.attributes?.outside_temperature,p=t.attributes?.min_outside_temperature||14.5,h=l.includes("BLOCKED_BY_OUTSIDE_TEMP")||void 0!==d&&d<p,u=void 0!==o?ke.getTemperatureColor(o):void 0,g=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const t=new _e(this.hass);await t.setHvacMode(e.entity,"off")},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const t=new _e(this.hass);await t.setHvacMode(e.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:fire",label:"HEAT",action:async()=>{const t=new _e(this.hass);await t.setHvacMode(e.entity,"heat")},active:"heat"===i||"heating"===i,color:"#FF5722"}],m="heating"===i||"heat"===i,v=void 0!==o?this._getValuePercent(o,n,c):void 0,f=void 0!==r?this._getValuePercent(r,n,c):void 0;return B`
      <ha-card
        class="${this._getCardClasses(m,e)}"
        style="--card-accent: ${s}"
        @click="${()=>this._showMoreInfo(e.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${m?"icon-active":""}" style="--icon-accent: ${s}">
              <ha-icon
                icon="${e.icon||"mdi:radiator"}"
                class="${m?"heater-active":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle">${this._getFriendlyState(i)}</span>
            </div>
            ${e.show_state?B`<status-badge .state="${i}"></status-badge>`:""}
          </div>

          ${void 0!==o?B`
                <div class="temp-hero" style="--temp-color: ${u?.color||"var(--vpc-primary)"}">
                  <div class="temp-hero-main">
                    <span class="temp-hero-value">${o.toFixed(1)}</span>
                    <span class="temp-hero-unit">°C</span>
                  </div>
                  ${void 0!==r?B`
                        <div class="temp-hero-target-pill">
                          <ha-icon icon="mdi:target" style="--mdc-icon-size: 13px"></ha-icon>
                          <span>${r.toFixed(1)}°C</span>
                        </div>
                      `:""}
                </div>
                ${void 0!==v?B`
                      <div class="temp-range-bar">
                        <div class="temp-range-track">
                          <div class="temp-range-fill" style="width: ${v}%; background: ${u?.color||s}"></div>
                          ${void 0!==f?B`<div class="temp-range-target" style="left: ${f}%"></div>`:""}
                        </div>
                        <div class="temp-range-labels">
                          <span>${n}°C</span>
                          <span>${c}°C</span>
                        </div>
                      </div>
                    `:""}
              `:""}

          ${e.show_detail_status&&l?B`<detail-status .raw="${l}"></detail-status>`:""}

          ${void 0!==d?B`
                <div class="info-row ${h?"info-row-warning":""}">
                  <ha-icon icon="mdi:thermometer"></ha-icon>
                  <span class="info-label">Outside</span>
                  <span class="info-value">${d.toFixed(1)}°C</span>
                  ${h?B`<span class="info-badge warning">Min ${p}°C</span>`:""}
                </div>
              `:""}

          ${e.show_controls?B`
                ${void 0!==r?B`
                      <slider-control
                        label="Target Temperature"
                        .min="${n}"
                        .max="${c}"
                        step="0.5"
                        .value="${r}"
                        unit="°C"
                        showMinMax
                        @value-changed="${t=>this._handleTemperatureChange(t,e.entity)}"
                      ></slider-control>
                    `:""}
                <quick-actions .actions="${g}"></quick-actions>
              `:""}
        </div>
      </ha-card>
    `}async _handleTemperatureChange(e,t){const i=e.detail.value,a=new _e(this.hass);await a.setTemperature(t,i)}renderSolarCard(e=this.config){const t=this.hass.states[e.entity],i=t.state,a=e.name||t.attributes.friendly_name||"Solar",s=this._getAccentColor("solar",e),o=Ce.getCurrentTemperature(t),r=Ce.getTargetTemperature(t),n=Ce.getMinTemperature(t)||18,c=Ce.getMaxTemperature(t)||32,l=t.attributes?.absorber_temperature,d=void 0!==l&&void 0!==o?l-o:void 0,p=t.attributes?.SOLARSTATE||"",h=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const t=new _e(this.hass);await t.setHvacMode(e.entity,"off")},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const t=new _e(this.hass);await t.setHvacMode(e.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:sun-thermometer",label:"ON",action:async()=>{const t=new _e(this.hass);await t.setHvacMode(e.entity,"heat")},active:"heat"===i||"heating"===i,color:"#FF9800"}],u="heating"===i||"heat"===i,g=void 0!==o?this._getValuePercent(o,n,c):void 0,m=void 0!==r?this._getValuePercent(r,n,c):void 0;return B`
      <ha-card
        class="${this._getCardClasses(u,e)}"
        style="--card-accent: ${s}"
        @click="${()=>this._showMoreInfo(e.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${u?"icon-active":""}" style="--icon-accent: ${s}">
              <ha-icon
                icon="${e.icon||"mdi:solar-power"}"
                class="${u?"solar-active":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle">${this._getFriendlyState(i)}</span>
            </div>
            ${e.show_state?B`<status-badge .state="${i}"></status-badge>`:""}
          </div>

          ${e.show_detail_status&&p?B`<detail-status .raw="${p}"></detail-status>`:""}

          <div class="solar-temps">
            <!-- Solar temperature comparison: pool vs absorber -->
            <div class="solar-temp-comparison">
              ${void 0!==o?B`
                    <div class="solar-temp-tile">
                      <ha-icon icon="mdi:pool" style="--mdc-icon-size: 18px"></ha-icon>
                      <div class="solar-temp-tile-val">${o.toFixed(1)}°C</div>
                      <div class="solar-temp-tile-label">Pool</div>
                    </div>
                  `:""}
              ${void 0!==d?B`
                    <div class="solar-delta-badge ${d>=3?"delta-great":d>0?"delta-ok":"delta-low"}">
                      <ha-icon icon="${d>=0?"mdi:trending-up":"mdi:trending-down"}" style="--mdc-icon-size: 16px"></ha-icon>
                      <span>${d>0?"+":""}${d.toFixed(1)}°C</span>
                    </div>
                  `:""}
              ${void 0!==l?B`
                    <div class="solar-temp-tile">
                      <ha-icon icon="mdi:solar-panel" style="--mdc-icon-size: 18px"></ha-icon>
                      <div class="solar-temp-tile-val">${l.toFixed(1)}°C</div>
                      <div class="solar-temp-tile-label">Absorber</div>
                    </div>
                  `:""}
            </div>
            ${void 0!==g?B`
                  <div class="temp-range-bar">
                    <div class="temp-range-track">
                      <div class="temp-range-fill" style="width: ${g}%; background: ${s}"></div>
                      ${void 0!==m?B`<div class="temp-range-target" style="left: ${m}%"></div>`:""}
                    </div>
                    <div class="temp-range-labels">
                      <span>${n}°C</span>
                      <span>${c}°C</span>
                    </div>
                  </div>
                `:""}
            ${void 0!==d?B`
                  <div class="delta-hint-text">
                    ${d<0?"❄ Too cold for solar heating":d<3?"⚡ Solar heating possible":"☀ Ideal conditions for solar heating"}
                  </div>
                `:""}
          </div>

          ${e.show_controls?B`
                ${void 0!==r?B`
                      <slider-control
                        label="Target Temperature"
                        .min="${n}"
                        .max="${c}"
                        step="0.5"
                        .value="${r}"
                        unit="°C"
                        showMinMax
                        @value-changed="${t=>this._handleTemperatureChange(t,e.entity)}"
                      ></slider-control>
                    `:""}
                <quick-actions .actions="${h}"></quick-actions>
              `:""}
        </div>
      </ha-card>
    `}renderDosingCard(e=this.config){const t=this.hass.states[e.entity],i=t.state,a=e.name||t.attributes.friendly_name||"Dosing",s=this._getAccentColor("dosing",e),o=e.dosing_type||this._detectDosingType(e.entity),r=Object.keys(t.attributes||{}).find(e=>e.includes("DOS_")&&e.includes("_STATE")),n=r?t.attributes[r]:[];let c,l,d,p,h="";if("chlorine"===o){const e=this._getEntityId("orp_value_entity","sensor","orp_value"),t=this.hass.states[e];c=t?parseFloat(t.state):void 0;const i=this._getEntityId("target_orp_entity","number","target_orp"),a=this.hass.states[i];l=a?parseFloat(a.state):void 0,d=a?.attributes?.min||600,p=a?.attributes?.max||800,h="mV"}else if("ph_minus"===o||"ph_plus"===o){const e=this._getEntityId("ph_value_entity","sensor","ph_value"),t=this.hass.states[e];c=t?parseFloat(t.state):void 0;const i=this._getEntityId("target_ph_entity","number","target_ph"),a=this.hass.states[i];l=a?parseFloat(a.state):void 0,d=a?.attributes?.min||6.8,p=a?.attributes?.max||7.8,h=""}const u=t.attributes?.dosing_volume_24h,g=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const t=new _e(this.hass);await t.turnOff(e.entity)},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const t=new _e(this.hass);await t.turnOn(e.entity)},active:"on"===i||"auto"===i,color:"#2196F3"},{icon:"mdi:play-circle",label:"Dose 30s",action:async()=>{const t=new _e(this.hass);await t.manualDosing(e.entity,30)},color:"#4CAF50",confirmMessage:"Start manual dosing for 30 seconds?"},{icon:"mdi:play-speed",label:"Dose 60s",action:async()=>{const t=new _e(this.hass);await t.manualDosing(e.entity,60)},color:"#FF9800",confirmMessage:"Start manual dosing for 60 seconds?"}],m="on"===i&&Array.isArray(n)&&n.some(e=>e.includes("ACTIVE")),v=void 0!==c?"chlorine"===o?ke.getOrpColor(c,l):ke.getPhColor(c,l):void 0,f=void 0!==c&&void 0!==d&&void 0!==p?this._getValuePercent(c,d,p):void 0,x=void 0!==l&&void 0!==d&&void 0!==p?this._getValuePercent(l,d,p):void 0,b="chlorine"===o?0:1,y="chlorine"===o?"ORP":"ph_minus"===o||"ph_plus"===o?"pH":"Floc",w=v?"chlorine"===o?c<(l??650)?"Low":c>(l??750)?"High":"Optimal":c<7?"Acidic":c>7.4?"Alkaline":"Optimal":"";return B`
      <ha-card
        class="${this._getCardClasses(m,e)}"
        style="--card-accent: ${s}"
        @click="${()=>this._showMoreInfo(e.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${m?"icon-active":""}" style="--icon-accent: ${s}">
              <ha-icon
                icon="${e.icon||this._getDosingIcon(o)}"
                class="${m?"dosing-active":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle">${this._getFriendlyState(i)}</span>
            </div>
            ${e.show_state?B`<status-badge .state="${i}" .pulse="${m}"></status-badge>`:""}
          </div>

          ${void 0!==c?B`
                <!-- Dosing value hero with progress bar -->
                <div class="dosing-value-block">
                  <div class="dosing-value-row">
                    <div class="dosing-value-main" style="color: ${v?.color||"var(--vpc-text)"}">
                      <span class="dosing-label-tag">${y}</span>
                      <span class="dosing-current-value">${c.toFixed(b)}</span>
                      <span class="dosing-current-unit">${h}</span>
                    </div>
                    <div class="dosing-status-pill" style="background: ${v?.color?v.color+"18":"rgba(0,0,0,0.05)"}; color: ${v?.color||"var(--vpc-text-secondary)"}">
                      ${w}
                    </div>
                  </div>
                  ${void 0!==f?B`
                        <div class="chem-range-bar">
                          <div class="chem-range-track">
                            <div class="chem-range-fill" style="width: ${f}%; background: ${v?.color||s}"></div>
                            ${void 0!==x?B`
                                  <div class="chem-range-target" style="left: ${x}%">
                                    <div class="chem-target-line"></div>
                                    <div class="chem-target-label">${l.toFixed(b)}${h}</div>
                                  </div>
                                `:""}
                          </div>
                          <div class="chem-range-labels">
                            <span>${d.toFixed(b)}${h}</span>
                            <span>${p.toFixed(b)}${h}</span>
                          </div>
                        </div>
                      `:""}
                </div>
              `:""}

          ${e.show_detail_status&&Array.isArray(n)&&n.length>0?B`<warning-chips .warnings="${n}" defaultType="warning"></warning-chips>`:""}

          ${e.show_controls?B`<quick-actions .actions="${g}"></quick-actions>`:""}

          ${e.show_history&&void 0!==u?B`
                <div class="info-row">
                  <ha-icon icon="mdi:chart-line"></ha-icon>
                  <span class="info-label">Last 24h</span>
                  <span class="info-value">${u}ml</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}_detectDosingType(e){return e.includes("_cl")?"chlorine":e.includes("_phm")?"ph_minus":e.includes("_php")?"ph_plus":e.includes("_floc")?"flocculant":"chlorine"}_getDosingIcon(e){switch(e){case"chlorine":default:return"mdi:flask-outline";case"ph_minus":return"mdi:flask-minus";case"ph_plus":return"mdi:flask-plus";case"flocculant":return"mdi:flask"}}renderOverviewCard(e=this.config){const t=e.name||"Pool Status",i=this._getAccentColor("overview",e),a=this._getEntityId("pump_entity","switch","pump",0),s=this._getEntityId("heater_entity","climate","heater",1),o=this._getEntityId("solar_entity","climate","solar",2),r=this._getEntityId("chlorine_entity","switch","dos_1_cl",3),n=this._getEntityId("ph_minus_entity","switch","dos_2_phm",4),c=this.hass.states[a],l=this.hass.states[s],d=this.hass.states[o],p=this.hass.states[r],h=this.hass.states[n],u=this._getEntityId("pool_temp_entity","sensor","temperature",5),g=this._getEntityId("ph_value_entity","sensor","ph_value",6),m=this._getEntityId("orp_value_entity","sensor","orp_value",7),v=this.hass.states[u],f=this.hass.states[g],x=this.hass.states[m],b=v?parseFloat(v.state):void 0,y=f?parseFloat(f.state):void 0,w=x?parseFloat(x.state):void 0,$=void 0!==b?ke.getTemperatureColor(b):void 0,_=void 0!==y?ke.getPhColor(y):void 0,C=void 0!==w?ke.getOrpColor(w):void 0,k=void 0===(A=y)||isNaN(A)?"unknown":A<7||A>7.4?"warning":"ok";var A;const F=void 0===(E=w)||isNaN(E)?"unknown":E<650?"warning":E>750?"high":"ok";var E;const S=[];if(c){const e=c.attributes?.PUMPSTATE||"",t=Ce.parsePumpState(e);S.push({icon:"mdi:pump",name:"Pump",status:t.status||c.state,state:c.state,entityId:a})}if(l){const e=l.attributes?.HEATERSTATE||"",t=Ce.parseHeaterState(e);S.push({icon:"mdi:radiator",name:"Heater",status:t.status||l.state,state:l.state,entityId:s})}if(d){const e=d.attributes?.SOLARSTATE||"",t=Ce.parseSolarState(e);S.push({icon:"mdi:solar-power",name:"Solar",status:t.status||d.state,state:d.state,entityId:o})}if(p){const e=p.attributes?.DOS_1_CL_STATE||[],t=Array.isArray(e)&&e.length>0?Ce.formatSnakeCase(e[0]):p.state;S.push({icon:"mdi:flask-outline",name:"Chlorine",status:t,state:p.state,entityId:r})}if(h){const e=h.attributes?.DOS_2_PHM_STATE||[],t=Array.isArray(e)&&e.length>0?Ce.formatSnakeCase(e[0]):h.state;S.push({icon:"mdi:flask-minus",name:"pH-",status:t,state:h.state,entityId:n})}const T=[];if("warning"===F&&T.push("ORP too low - Check chlorine dosing"),"high"===F&&T.push("ORP too high - Stop chlorine dosing"),"warning"===k&&T.push("pH out of range - Check dosing"),c?.attributes?.PUMPSTATE?.includes("ANTI_FREEZE")){const e=l?.attributes?.outside_temperature;T.push("Frost protection active"+(e?` (${e.toFixed(1)}°C)`:""))}const z=S.some(e=>["on","auto","heat","heating"].includes(e.state)),P=S.filter(e=>["on","auto","heat","heating"].includes(e.state)).length,O=void 0!==b?this._getValuePercent(b,18,35):void 0,M=void 0!==y?this._getValuePercent(y,6.5,8):void 0,I=void 0!==w?this._getValuePercent(w,500,900):void 0,R=this._getValuePercent(7,6.5,8),D=this._getValuePercent(7.4,6.5,8),N=this._getValuePercent(650,500,900),H=this._getValuePercent(750,500,900);return B`
      <ha-card
        class="${this._getCardClasses(z,e)}"
        style="--card-accent: ${i}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <!-- Header -->
          <div class="header">
            <div class="header-icon ${z?"icon-active":""}" style="--icon-accent: ${i}">
              <ha-icon icon="mdi:pool"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${t}</span>
              <span class="header-subtitle">
                ${z?`${P} device${1!==P?"s":""} active`:"All systems idle"}
              </span>
            </div>
            ${T.length>0?B`<div class="overview-warning-badge">${T.length}</div>`:z?B`<div class="overview-active-dot"></div>`:""}
          </div>

          <!-- Water Chemistry - Apple Health style metric tiles -->
          <div class="chemistry-grid">
            ${void 0!==b?B`
                  <div class="chemistry-card" style="--chem-color: ${$?.color||"#4CAF50"}"
                    @click="${e=>{e.stopPropagation(),this._showMoreInfo(u)}}">
                    <div class="chem-icon-wrap">
                      <ha-icon icon="mdi:thermometer-water"></ha-icon>
                    </div>
                    <span class="chemistry-val">${b.toFixed(1)}°</span>
                    <span class="chemistry-unit">°C</span>
                    <span class="chemistry-label">Temp</span>
                    ${void 0!==O?B`<div class="chem-mini-bar"><div class="chem-mini-fill" style="width: ${O}%; background: ${$?.color||"#4CAF50"}"></div></div>`:""}
                  </div>
                `:""}
            ${void 0!==y?B`
                  <div class="chemistry-card" style="--chem-color: ${_?.color||"#4CAF50"}"
                    @click="${e=>{e.stopPropagation(),this._showMoreInfo(g)}}">
                    <div class="chem-icon-wrap">
                      <ha-icon icon="mdi:ph"></ha-icon>
                    </div>
                    <span class="chemistry-val">${y.toFixed(1)}</span>
                    <span class="chemistry-unit">pH</span>
                    <span class="chemistry-label">${"ok"===k?"Optimal":"Attention"}</span>
                    ${void 0!==M?B`
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${R}%; width: ${D-R}%"></div>
                            <div class="chem-mini-fill" style="width: ${M}%; background: ${_?.color||"#4CAF50"}"></div>
                          </div>
                        `:""}
                  </div>
                `:""}
            ${void 0!==w?B`
                  <div class="chemistry-card" style="--chem-color: ${C?.color||"#4CAF50"}"
                    @click="${e=>{e.stopPropagation(),this._showMoreInfo(m)}}">
                    <div class="chem-icon-wrap">
                      <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                    </div>
                    <span class="chemistry-val">${w.toFixed(0)}</span>
                    <span class="chemistry-unit">mV</span>
                    <span class="chemistry-label">${"ok"===F?"Optimal":"warning"===F?"Low":"High"}</span>
                    ${void 0!==I?B`
                          <div class="chem-mini-bar">
                            <div class="chem-mini-ideal" style="left: ${N}%; width: ${H-N}%"></div>
                            <div class="chem-mini-fill" style="width: ${I}%; background: ${C?.color||"#4CAF50"}"></div>
                          </div>
                        `:""}
                  </div>
                `:""}
          </div>

          <!-- Device List - clean rows -->
          ${S.length>0?B`
                <div class="overview-section">
                  <div class="section-title">
                    <span>Devices</span>
                    <span class="section-count">${S.length}</span>
                  </div>
                  <div class="device-list">
                    ${S.map(e=>B`
                        <div class="device-row"
                          @click="${t=>{t.stopPropagation(),this._showMoreInfo(e.entityId)}}">
                          <div class="device-icon-wrap ${["on","auto","heat","heating"].includes(e.state)?"device-icon-active":""}">
                            <ha-icon icon="${e.icon}"></ha-icon>
                          </div>
                          <div class="device-info">
                            <span class="device-name">${e.name}</span>
                            <span class="device-status">${e.status}</span>
                          </div>
                          <div class="device-dot ${["on","auto","heat","heating"].includes(e.state)?"dot-active":"dot-inactive"}"></div>
                        </div>
                      `)}
                  </div>
                </div>
              `:""}

          <!-- Warnings / All OK -->
          ${T.length>0?B`
                <div class="overview-section">
                  <div class="section-title warning-title">
                    <ha-icon icon="mdi:alert-outline" style="--mdc-icon-size: 14px"></ha-icon>
                    <span>Alerts</span>
                  </div>
                  <div class="warning-list">
                    ${T.map(e=>B`
                        <div class="warning-row">
                          <ha-icon icon="${e.includes("Frost")?"mdi:snowflake-alert":"mdi:alert-circle"}" style="--mdc-icon-size: 16px"></ha-icon>
                          <span>${e}</span>
                        </div>
                      `)}
                  </div>
                </div>
              `:B`
                <div class="all-ok-display">
                  <ha-icon icon="mdi:check-circle" style="--mdc-icon-size: 18px"></ha-icon>
                  <span>All systems normal</span>
                </div>
              `}
        </div>
      </ha-card>
    `}renderCompactCard(e=this.config){const t=this.hass.states[e.entity],i=t.state,a=e.name||t.attributes.friendly_name||"Entity",s=e.entity.split(".")[0];let o=e.icon;o||(o="switch"===s&&e.entity.includes("pump")?"mdi:pump":"climate"===s&&e.entity.includes("heater")?"mdi:radiator":"climate"===s&&e.entity.includes("solar")?"mdi:solar-power":"switch"===s&&e.entity.includes("dos")?"mdi:flask-outline":"mdi:circle");let r="",n="";if(t.attributes?.PUMPSTATE){const e=Ce.parsePumpState(t.attributes.PUMPSTATE);r=e.status,void 0!==e.level&&e.level>0&&(n=`Level ${e.level}`)}else if(t.attributes?.HEATERSTATE){r=Ce.parseHeaterState(t.attributes.HEATERSTATE).status;const e=Ce.getCurrentTemperature(t);void 0!==e&&(n=`${e.toFixed(1)}°C`)}else if(t.attributes?.SOLARSTATE){r=Ce.parseSolarState(t.attributes.SOLARSTATE).status;const e=Ce.getCurrentTemperature(t);void 0!==e&&(n=`${e.toFixed(1)}°C`)}else if(Object.keys(t.attributes||{}).some(e=>e.includes("DOS_")&&e.includes("_STATE"))){const i=Object.keys(t.attributes||{}).find(e=>e.includes("DOS_")&&e.includes("_STATE")),a=i?t.attributes[i]:[];Array.isArray(a)&&a.length>0&&(r=Ce.formatSnakeCase(a[0]));const s=this._detectDosingType(e.entity);if("chlorine"===s){const e=this._getEntityId("orp_value_entity","sensor","orp_value"),t=this.hass.states[e];t&&(n=`${parseFloat(t.state).toFixed(0)}mV`)}else if("ph_minus"===s||"ph_plus"===s){const e=this._getEntityId("ph_value_entity","sensor","ph_value"),t=this.hass.states[e];t&&(n=`pH ${parseFloat(t.state).toFixed(1)}`)}}const c="on"===i||"auto"===i||"heat"===i||"heating"===i;return B`
      <ha-card
        class="compact-card ${this._getCardClasses(c,e)}"
        @click="${()=>this._showMoreInfo(e.entity)}"
      >
        <div class="card-content compact">
          <div class="compact-icon ${c?"compact-icon-active":""}">
            <ha-icon
              icon="${o}"
              class="${c?"active":"inactive"}"
            ></ha-icon>
          </div>
          <div class="compact-info">
            <span class="name">${a}</span>
            <div class="compact-details">
              ${n?B`<span class="compact-value">${n}</span>`:""}
              ${r?B`<span class="compact-detail">${r}</span>`:""}
            </div>
          </div>
          <status-badge .state="${i}"></status-badge>
        </div>
      </ha-card>
    `}static get styles(){return r`
      /* ============================================
         BASE VARIABLES — Apple / Samsung design system
         ============================================ */
      :host {
        /* Typography — SF Pro on Apple, Roboto on Android, system-ui everywhere */
        --vpc-font: -apple-system, 'SF Pro Display', 'SF Pro Text', system-ui,
                    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

        /* Spacing */
        --vpc-spacing: 18px;
        --vpc-radius: 20px;
        --vpc-inner-radius: 12px;

        /* Color tokens */
        --vpc-bg: var(--ha-card-background, var(--card-background-color, #ffffff));
        --vpc-surface: rgba(120,120,128,0.06);
        --vpc-border: none;
        --vpc-shadow: 0 2px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);
        --vpc-backdrop: none;

        /* Semantic colors — Apple system palette */
        --vpc-primary: var(--primary-color, #007AFF);
        --vpc-success: #34C759;
        --vpc-warning: #FF9F0A;
        --vpc-danger: #FF3B30;
        --vpc-purple: #AF52DE;
        --vpc-teal: #5AC8FA;
        --vpc-orange: #FF9500;
        --vpc-indigo: #5856D6;

        /* Text */
        --vpc-text: var(--primary-text-color, #1C1C1E);
        --vpc-text-secondary: var(--secondary-text-color, #6D6D72);
        --vpc-text-tertiary: rgba(60,60,67,0.45);

        /* Icon */
        --vpc-icon-size: 22px;

        /* Motion — Apple spring curve */
        --vpc-transition: all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1);
        --vpc-transition-fast: all 0.18s ease;

        /* Card accent (per-card) */
        --card-accent: var(--primary-color, #007AFF);
        --icon-accent: var(--card-accent);

        display: block;
        font-family: var(--vpc-font);
      }

      /* ============================================
         THEME OVERRIDES — applied on ha-card
         ============================================ */

      /* ---- Apple (default) ---- */
      ha-card.theme-apple {
        --vpc-bg: #ffffff;
        --vpc-shadow: 0 2px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
        --vpc-radius: 22px;
        --vpc-inner-radius: 13px;
        --vpc-surface: rgba(120,120,128,0.06);
        --vpc-primary: #007AFF;
      }

      /* ---- Dark ---- */
      ha-card.theme-dark {
        --vpc-bg: #1C1C1E;
        --vpc-surface: rgba(255,255,255,0.06);
        --vpc-border: 1px solid rgba(255,255,255,0.08);
        --vpc-shadow: 0 4px 30px rgba(0,0,0,0.4);
        --vpc-radius: 22px;
        --vpc-text: #FFFFFF;
        --vpc-text-secondary: #8E8E93;
        --vpc-text-tertiary: rgba(255,255,255,0.25);
        --vpc-primary: #0A84FF;
        --vpc-success: #30D158;
        --vpc-warning: #FFD60A;
        --vpc-danger: #FF453A;
      }

      /* ---- Luxury / Glass ---- */
      ha-card.theme-luxury,
      ha-card.theme-glass {
        --vpc-bg: rgba(255,255,255,0.72);
        --vpc-backdrop: blur(24px) saturate(180%);
        --vpc-radius: 26px;
        --vpc-border: 1px solid rgba(255,255,255,0.4);
        --vpc-shadow: 0 8px 40px rgba(31,38,135,0.12), 0 2px 8px rgba(0,0,0,0.06);
      }

      /* ---- Modern ---- */
      ha-card.theme-modern {
        --vpc-radius: 18px;
        --vpc-spacing: 20px;
        --vpc-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04);
      }

      /* ---- Minimalist ---- */
      ha-card.theme-minimalist {
        --vpc-radius: 14px;
        --vpc-shadow: none;
        --vpc-border: 1px solid rgba(0,0,0,0.07);
        --vpc-surface: transparent;
      }

      /* ---- Neon (legacy) — remapped to a cleaner dark neon ---- */
      ha-card.theme-neon {
        --vpc-bg: #0D0D14;
        --vpc-border: 1px solid rgba(0,212,255,0.2);
        --vpc-shadow: 0 0 30px rgba(0,212,255,0.07);
        --vpc-radius: 14px;
        --vpc-primary: #00D4FF;
        --vpc-text: #E8E8F0;
        --vpc-text-secondary: #6E6E80;
        --vpc-surface: rgba(0,212,255,0.04);
        --vpc-success: #00E676;
        --vpc-warning: #FFEA00;
        --vpc-danger: #FF1744;
      }

      /* ---- Premium (legacy) — refined frosted gradient ---- */
      ha-card.theme-premium {
        --vpc-bg: linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,248,255,0.96) 100%);
        --vpc-radius: 24px;
        --vpc-shadow: 0 12px 50px -8px rgba(80,80,160,0.15), 0 0 0 1px rgba(255,255,255,0.9);
        --vpc-border: 1px solid rgba(255,255,255,0.7);
      }

      /* ---- Auto dark mode ---- */
      @media (prefers-color-scheme: dark) {
        ha-card.theme-apple {
          --vpc-bg: #1C1C1E;
          --vpc-surface: rgba(255,255,255,0.06);
          --vpc-border: 1px solid rgba(255,255,255,0.08);
          --vpc-text: #FFFFFF;
          --vpc-text-secondary: #8E8E93;
          --vpc-primary: #0A84FF;
          --vpc-success: #30D158;
          --vpc-warning: #FFD60A;
          --vpc-danger: #FF453A;
        }
        ha-card.theme-luxury,
        ha-card.theme-glass {
          --vpc-bg: rgba(18,18,30,0.80);
          --vpc-border: 1px solid rgba(255,255,255,0.09);
          --vpc-shadow: 0 8px 40px rgba(0,0,0,0.45);
        }
        ha-card.theme-premium {
          --vpc-bg: linear-gradient(145deg, rgba(28,28,38,0.97) 0%, rgba(20,20,32,0.97) 100%);
          --vpc-border: 1px solid rgba(255,255,255,0.07);
        }
        ha-card.theme-minimalist {
          --vpc-border: 1px solid rgba(255,255,255,0.07);
        }
        ha-card.theme-modern {
          --vpc-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04);
        }
      }

      /* ============================================
         HA-CARD BASE
         ============================================ */
      ha-card {
        font-family: var(--vpc-font);
        padding: var(--vpc-spacing);
        background: var(--vpc-bg);
        border-radius: var(--vpc-radius);
        box-shadow: var(--vpc-shadow);
        border: var(--vpc-border);
        backdrop-filter: var(--vpc-backdrop);
        -webkit-backdrop-filter: var(--vpc-backdrop);
        transition: transform 0.22s cubic-bezier(0.34,1.4,0.64,1),
                    box-shadow 0.22s ease;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }

      ha-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.11), 0 2px 6px rgba(0,0,0,0.05);
      }

      ha-card:active {
        transform: scale(0.985);
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      ha-card.theme-dark:hover {
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      }

      ha-card.theme-neon:hover {
        box-shadow: 0 0 40px rgba(0,212,255,0.12), 0 4px 20px rgba(0,0,0,0.3);
      }

      ha-card.theme-neon.is-active {
        box-shadow: 0 0 50px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.04);
        border-color: rgba(0,212,255,0.35);
      }

      /* ============================================
         ACCENT BAR (top gradient line)
         ============================================ */
      .accent-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--card-accent);
        opacity: 0.65;
        transition: opacity 0.3s ease, height 0.3s ease;
      }

      ha-card.is-active .accent-bar {
        height: 4px;
        opacity: 1;
      }

      ha-card.theme-neon .accent-bar {
        background: linear-gradient(90deg, #00D4FF, #7C4DFF, #00D4FF);
        box-shadow: 0 0 12px rgba(0,212,255,0.5);
        height: 2px;
        animation: neon-flow 3s linear infinite;
      }

      ha-card.theme-minimalist .accent-bar {
        height: 2px;
        opacity: 0.45;
      }

      @keyframes neon-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      /* ============================================
         CARD CONTENT
         ============================================ */
      .card-content {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .card-content.compact {
        flex-direction: row;
        align-items: center;
        gap: 14px;
      }

      /* ============================================
         HEADER
         ============================================ */
      .header {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .header-icon {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* Use the per-card accent as tinted background */
        background: color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 12%, transparent);
        transition: background 0.25s ease, box-shadow 0.25s ease;
        flex-shrink: 0;
      }

      .header-icon.icon-active {
        background: color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 18%, transparent);
        box-shadow: 0 0 0 5px color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 8%, transparent);
      }

      ha-card.theme-neon .header-icon {
        background: rgba(0,212,255,0.08);
        border: 1px solid rgba(0,212,255,0.18);
      }

      ha-card.theme-neon .header-icon.icon-active {
        box-shadow: 0 0 16px rgba(0,212,255,0.25);
      }

      .header-icon ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-accent, var(--vpc-primary));
      }

      .header-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .name {
        font-family: var(--vpc-font);
        font-size: 16px;
        font-weight: 600;
        letter-spacing: -0.3px;
        color: var(--vpc-text);
        line-height: 1.25;
      }

      .header-subtitle {
        font-family: var(--vpc-font);
        font-size: 13px;
        font-weight: 400;
        color: var(--vpc-text-secondary);
        line-height: 1.2;
      }

      /* ============================================
         ICONS & ANIMATIONS
         ============================================ */
      ha-icon {
        --mdc-icon-size: var(--vpc-icon-size);
        color: var(--vpc-primary);
        transition: color 0.2s ease;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%  { opacity: 0.65; transform: scale(0.95); }
      }
      @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.08); opacity: 0.85; }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .pump-running { animation: rotate 1.8s linear infinite; }
      .heater-active { animation: breathe 2.5s ease-in-out infinite; color: var(--vpc-danger, #FF3B30); }
      .solar-active  { animation: breathe 3s ease-in-out infinite; color: var(--vpc-warning, #FF9F0A); }
      .dosing-active { animation: pulse-glow 2s ease-in-out infinite; color: var(--vpc-success, #34C759); }

      /* ============================================
         PUMP — SPEED SEGMENTS
         ============================================ */
      .speed-segments-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .speed-segments {
        display: flex;
        flex: 1;
        gap: 6px;
      }

      .speed-segment {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 9px 6px;
        border-radius: var(--vpc-inner-radius, 12px);
        border: none;
        background: var(--vpc-surface, rgba(120,120,128,0.06));
        color: var(--vpc-text-secondary);
        font-family: var(--vpc-font);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.18s ease;
        -webkit-tap-highlight-color: transparent;
        letter-spacing: -0.2px;
      }

      .speed-segment:hover {
        background: color-mix(in srgb, var(--seg-color) 10%, transparent);
        color: var(--seg-color);
      }

      .speed-segment.seg-active {
        background: color-mix(in srgb, var(--seg-color) 15%, transparent);
        color: var(--seg-color);
        font-weight: 600;
        box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--seg-color) 40%, transparent);
      }

      .speed-segment.seg-past {
        background: color-mix(in srgb, var(--seg-color) 08%, transparent);
        color: color-mix(in srgb, var(--seg-color) 70%, var(--vpc-text-secondary));
      }

      .speed-off-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        border: none;
        background: var(--vpc-surface);
        color: var(--vpc-text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.18s ease;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent;
      }

      .speed-off-btn:hover {
        background: rgba(255,59,48,0.1);
        color: var(--vpc-danger, #FF3B30);
      }

      .speed-off-btn.seg-active {
        background: rgba(255,59,48,0.12);
        color: var(--vpc-danger, #FF3B30);
        box-shadow: inset 0 0 0 1.5px rgba(255,59,48,0.3);
      }

      ha-card.theme-neon .speed-segment {
        border: 1px solid rgba(0,212,255,0.1);
      }
      ha-card.theme-neon .speed-segment.seg-active {
        box-shadow: 0 0 12px color-mix(in srgb, var(--seg-color) 50%, transparent);
      }

      /* ============================================
         TEMPERATURE HERO
         ============================================ */
      .temp-hero {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 0 4px;
      }

      .temp-hero-main {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }

      .temp-hero-value {
        font-family: var(--vpc-font);
        font-size: 44px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -2px;
        color: var(--temp-color, var(--vpc-text));
      }

      .temp-hero-unit {
        font-size: 22px;
        font-weight: 400;
        color: var(--temp-color, var(--vpc-text));
        opacity: 0.65;
        letter-spacing: -0.5px;
      }

      .temp-hero-target-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 100px;
        background: var(--vpc-surface);
        font-size: 13px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        white-space: nowrap;
      }

      /* ============================================
         TEMPERATURE / VALUE RANGE BAR
         ============================================ */
      .temp-range-bar,
      .chem-range-bar {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .temp-range-track,
      .chem-range-track {
        height: 6px;
        background: var(--vpc-surface);
        border-radius: 100px;
        position: relative;
        overflow: visible;
      }

      .temp-range-fill,
      .chem-range-fill {
        height: 100%;
        border-radius: 100px;
        transition: width 0.5s cubic-bezier(0.34,1.4,0.64,1);
      }

      .temp-range-target {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 3px;
        height: 14px;
        background: var(--vpc-text-secondary);
        border-radius: 2px;
        opacity: 0.7;
      }

      .temp-range-labels,
      .chem-range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 400;
        color: var(--vpc-text-tertiary, rgba(60,60,67,0.45));
        letter-spacing: 0px;
      }

      /* ============================================
         CHEMICAL RANGE BAR (dosing card)
         ============================================ */
      .dosing-value-block {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 14px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
      }

      ha-card.theme-neon .dosing-value-block {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .dosing-value-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .dosing-value-main {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }

      .dosing-label-tag {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--vpc-text-secondary);
      }

      .dosing-current-value {
        font-family: var(--vpc-font);
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -1px;
      }

      .dosing-current-unit {
        font-size: 15px;
        font-weight: 400;
        opacity: 0.65;
      }

      .dosing-status-pill {
        padding: 4px 10px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
      }

      .chem-range-target {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .chem-target-line {
        width: 2px;
        height: 14px;
        background: var(--vpc-text);
        border-radius: 2px;
        opacity: 0.5;
      }

      .chem-target-label {
        position: absolute;
        top: 16px;
        font-size: 9px;
        font-weight: 600;
        color: var(--vpc-text-secondary);
        white-space: nowrap;
        transform: translateX(-50%);
      }

      .chem-mini-bar {
        width: 100%;
        height: 4px;
        background: var(--vpc-surface, rgba(120,120,128,0.1));
        border-radius: 100px;
        overflow: hidden;
        position: relative;
        margin-top: 4px;
      }

      .chem-mini-fill {
        height: 100%;
        border-radius: 100px;
        transition: width 0.5s cubic-bezier(0.34,1.4,0.64,1);
      }

      .chem-mini-ideal {
        position: absolute;
        top: 0;
        height: 100%;
        background: rgba(52,199,89,0.18);
        border-radius: 2px;
      }

      /* ============================================
         SOLAR — TEMPERATURE COMPARISON
         ============================================ */
      .solar-temp-comparison {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px;
        background: var(--vpc-surface);
        border-radius: var(--vpc-inner-radius, 12px);
      }

      ha-card.theme-neon .solar-temp-comparison {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .solar-temp-tile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        flex: 1;
      }

      .solar-temp-tile ha-icon {
        --mdc-icon-size: 18px;
        color: var(--vpc-text-secondary);
      }

      .solar-temp-tile-val {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
        color: var(--vpc-text);
        line-height: 1;
      }

      .solar-temp-tile-label {
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .solar-delta-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 12px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 700;
      }

      .delta-great {
        background: rgba(52,199,89,0.12);
        color: var(--vpc-success, #34C759);
      }
      .delta-ok {
        background: rgba(255,159,10,0.12);
        color: var(--vpc-warning, #FF9F0A);
      }
      .delta-low {
        background: rgba(255,59,48,0.10);
        color: var(--vpc-danger, #FF3B30);
      }

      .delta-hint-text {
        font-size: 12px;
        font-weight: 400;
        color: var(--vpc-text-secondary);
        padding: 2px 0;
      }

      /* ============================================
         OVERVIEW — CHEMISTRY GRID
         ============================================ */
      .chemistry-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .chemistry-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 14px 8px 12px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
        cursor: pointer;
        transition: transform 0.18s ease, background 0.18s ease;
        position: relative;
        overflow: hidden;
      }

      .chemistry-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--chem-color, var(--vpc-primary));
        opacity: 0.6;
        border-radius: 100px;
      }

      .chemistry-card:hover {
        transform: scale(1.02);
        background: color-mix(in srgb, var(--chem-color) 8%, var(--vpc-surface));
      }

      ha-card.theme-neon .chemistry-card {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .chem-icon-wrap {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--chem-color, var(--vpc-primary)) 12%, transparent);
        margin-bottom: 4px;
      }

      .chem-icon-wrap ha-icon {
        --mdc-icon-size: 16px;
        color: var(--chem-color, var(--vpc-primary));
      }

      .chemistry-val {
        font-family: var(--vpc-font);
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.5px;
        color: var(--chem-color, var(--vpc-text));
        line-height: 1;
      }

      .chemistry-unit {
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        letter-spacing: 0.2px;
      }

      .chemistry-label {
        font-size: 10px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      /* ============================================
         OVERVIEW — HEADER EXTRAS
         ============================================ */
      .overview-warning-badge {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--vpc-danger, #FF3B30);
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .overview-active-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--vpc-success, #34C759);
        box-shadow: 0 0 8px rgba(52,199,89,0.5);
        flex-shrink: 0;
        animation: pulse-glow 2s ease-in-out infinite;
      }

      /* ============================================
         OVERVIEW — SECTIONS
         ============================================ */
      .overview-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 600;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 0 2px;
      }

      .section-count {
        margin-left: auto;
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-tertiary);
      }

      .warning-title ha-icon { color: var(--vpc-warning, #FF9F0A); }
      .warning-title { color: var(--vpc-warning, #FF9F0A); }

      /* ============================================
         TEMPERATURE HERO DISPLAY
         ============================================ */
      .temp-hero {
        display: flex;
        align-items: baseline;
        gap: 4px;
        padding: 8px 0;
      }

      .temp-hero-value {
        font-size: 42px;
        font-weight: 800;
        line-height: 1;
        color: var(--temp-color, var(--vpc-text));
        letter-spacing: -1px;
      }

      .temp-hero-unit {
        font-size: 22px;
        font-weight: 500;
        color: var(--temp-color, var(--vpc-text));
        opacity: 0.7;
      }

      .temp-hero-target {
        font-size: 16px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        margin-left: 12px;
      }

      /* ============================================
         INFO ROWS — runtime, outside temp, etc.
         ============================================ */
      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
        font-size: 14px;
        color: var(--vpc-text);
        font-family: var(--vpc-font);
      }

      ha-card.theme-neon .info-row {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.08);
      }

      .info-row ha-icon {
        --mdc-icon-size: 17px;
        color: var(--vpc-text-secondary);
        flex-shrink: 0;
      }

      .info-label {
        flex: 1;
        font-weight: 400;
        color: var(--vpc-text-secondary);
      }

      .info-value {
        font-weight: 600;
        color: var(--vpc-text);
        letter-spacing: -0.2px;
      }

      .info-badge {
        padding: 3px 9px;
        border-radius: 100px;
        font-size: 11px;
        font-weight: 600;
      }

      .info-badge.warning {
        background: color-mix(in srgb, var(--vpc-warning, #FF9F0A) 12%, transparent);
        color: var(--vpc-warning, #FF9F0A);
      }

      .info-row-warning {
        background: color-mix(in srgb, var(--vpc-warning, #FF9F0A) 06%, transparent);
        border: 1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 18%, transparent);
      }

      /* ============================================
         SOLAR TEMPERATURE SECTION
         ============================================ */
      .solar-temps {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      /* ============================================
         OVERVIEW: CHEMISTRY GRID
         ============================================ */
      .chemistry-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .chemistry-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 14px 8px;
        border-radius: 14px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
        cursor: pointer;
        transition: var(--vpc-transition);
        border: 1px solid transparent;
      }

      .chemistry-card:hover {
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);
        transform: translateY(-1px);
      }

      ha-card.theme-neon .chemistry-card {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.08);
      }

      .chemistry-card ha-icon {
        --mdc-icon-size: 20px;
        color: var(--chem-color, var(--vpc-primary));
      }

      .chemistry-val {
        font-size: 16px;
        font-weight: 700;
        color: var(--chem-color, var(--vpc-text));
        line-height: 1;
      }

      .chemistry-label {
        font-size: 11px;
        font-weight: 500;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      /* ============================================
         OVERVIEW: SECTIONS
         ============================================ */
      .overview-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--vpc-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 0 2px;
      }

      .section-title ha-icon {
        --mdc-icon-size: 16px;
        color: var(--vpc-text-secondary);
      }

      .warning-title ha-icon {
        color: #ef6c00;
      }

      .warning-title {
        color: #ef6c00;
      }

      /* ============================================
         OVERVIEW — DEVICE LIST
         ============================================ */
      .device-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .device-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: var(--vpc-surface);
        cursor: pointer;
        transition: background 0.18s ease, transform 0.15s ease;
      }

      .device-row:hover {
        background: color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));
        transform: scale(1.005);
      }

      ha-card.theme-neon .device-row {
        background: rgba(0,212,255,0.04);
        border: 1px solid rgba(0,212,255,0.06);
      }

      .device-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: var(--vpc-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.2s ease;
      }

      .device-icon-wrap ha-icon {
        --mdc-icon-size: 18px;
        color: var(--vpc-text-secondary);
      }

      .device-icon-active {
        background: color-mix(in srgb, var(--vpc-primary) 12%, transparent);
      }

      .device-icon-active ha-icon {
        color: var(--vpc-primary) !important;
      }

      .device-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .device-name {
        font-weight: 500;
        font-size: 14px;
        letter-spacing: -0.1px;
        color: var(--vpc-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .device-status {
        color: var(--vpc-text-secondary);
        font-size: 12px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .device-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .dot-active {
        background: var(--vpc-success, #34C759);
        box-shadow: 0 0 6px rgba(52,199,89,0.5);
      }

      .dot-inactive {
        background: var(--vpc-text-secondary);
        opacity: 0.25;
      }

      /* ============================================
         OVERVIEW — WARNINGS & ALL-OK
         ============================================ */
      .warning-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .warning-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: color-mix(in srgb, var(--vpc-warning, #FF9F0A) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--vpc-warning, #FF9F0A) 20%, transparent);
        font-size: 13px;
        font-weight: 500;
        color: var(--vpc-warning, #FF9F0A);
      }

      .warning-row ha-icon {
        color: var(--vpc-warning, #FF9F0A);
        flex-shrink: 0;
      }

      .all-ok-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px;
        border-radius: var(--vpc-inner-radius, 12px);
        background: color-mix(in srgb, var(--vpc-success, #34C759) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--vpc-success, #34C759) 18%, transparent);
        color: var(--vpc-success, #34C759);
        font-weight: 500;
        font-size: 14px;
      }

      .all-ok-display ha-icon {
        color: var(--vpc-success, #34C759);
      }

      /* ============================================
         COMPACT CARD
         ============================================ */
      ha-card.compact-card {
        padding: 12px 14px;
      }

      .compact-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--vpc-surface);
        flex-shrink: 0;
        transition: background 0.2s ease;
      }

      .compact-icon-active {
        background: color-mix(in srgb, var(--vpc-primary) 12%, transparent);
      }

      .compact-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .compact-icon ha-icon.active {
        color: var(--vpc-primary);
      }

      .compact-icon ha-icon.inactive {
        color: var(--vpc-text-secondary);
        opacity: 0.45;
      }

      .compact-info {
        flex: 1;
        min-width: 0;
      }

      .compact-details {
        display: flex;
        gap: 8px;
        font-size: 12px;
        margin-top: 2px;
        align-items: center;
      }

      .compact-value {
        font-weight: 600;
        color: var(--vpc-text);
        letter-spacing: -0.2px;
      }

      .compact-detail {
        color: var(--vpc-text-secondary);
        font-size: 11px;
      }

      /* ============================================
         SYSTEM GRID
         ============================================ */
      .system-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
      }

      /* ============================================
         ERROR STATE
         ============================================ */
      .error-state {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px;
      }

      .error-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(244, 67, 54, 0.1);
      }

      .error-icon ha-icon {
        --mdc-icon-size: 24px;
        color: #d32f2f;
      }

      .error-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .error-title {
        font-size: 14px;
        font-weight: 600;
        color: #d32f2f;
      }

      .error-entity {
        font-size: 12px;
        color: var(--vpc-text-secondary);
        font-family: monospace;
      }

      /* ============================================
         SIZE VARIANTS
         ============================================ */
      ha-card.size-small {
        --vpc-spacing: 12px;
        --vpc-icon-size: 20px;
        --vpc-radius: 16px;
      }

      ha-card.size-small .header-icon {
        width: 38px;
        height: 38px;
        border-radius: 11px;
      }

      ha-card.size-small .name { font-size: 14px; }
      ha-card.size-small .temp-hero-value { font-size: 34px; letter-spacing: -1.5px; }

      ha-card.size-large {
        --vpc-spacing: 22px;
        --vpc-icon-size: 28px;
        --vpc-radius: 26px;
      }

      ha-card.size-large .header-icon {
        width: 54px;
        height: 54px;
        border-radius: 17px;
      }

      ha-card.size-large .name { font-size: 18px; }
      ha-card.size-large .temp-hero-value { font-size: 56px; letter-spacing: -3px; }

      ha-card.size-fullscreen {
        --vpc-spacing: 28px;
        --vpc-icon-size: 32px;
        --vpc-radius: 28px;
        height: 100%;
        min-height: 80vh;
      }

      ha-card.size-fullscreen .header-icon {
        width: 60px;
        height: 60px;
        border-radius: 19px;
      }

      ha-card.size-fullscreen .name { font-size: 20px; }
      ha-card.size-fullscreen .temp-hero-value { font-size: 68px; letter-spacing: -4px; }

      /* ============================================
         ANIMATION VARIANTS
         ============================================ */
      ha-card.animation-none {
        transition: none !important;
      }
      ha-card.animation-none:hover,
      ha-card.animation-none:active {
        transform: none !important;
      }

      ha-card.animation-subtle {
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      ha-card.animation-subtle:hover {
        transform: translateY(-1px);
      }

      ha-card.animation-smooth {
        transition: transform 0.25s cubic-bezier(0.34,1.4,0.64,1),
                    box-shadow 0.25s ease;
      }

      ha-card.animation-energetic {
        transition: transform 0.2s cubic-bezier(0.34,1.6,0.64,1),
                    box-shadow 0.2s ease;
      }
      ha-card.animation-energetic:hover {
        transform: translateY(-4px) scale(1.008);
      }

      /* Flow animation for active cards */
      @keyframes flow-gradient {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      ha-card.flow-active .accent-bar {
        background: linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 60%, white), var(--card-accent));
        background-size: 200% 100%;
        animation: flow-gradient 2.5s linear infinite;
      }

      /* ============================================
         ERROR STATE
         ============================================ */
      .error-state {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px;
      }

      .error-icon {
        width: 46px;
        height: 46px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--vpc-danger, #FF3B30) 10%, transparent);
        flex-shrink: 0;
      }

      .error-icon ha-icon {
        --mdc-icon-size: 24px;
        color: var(--vpc-danger, #FF3B30);
      }

      .error-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .error-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--vpc-danger, #FF3B30);
        letter-spacing: -0.2px;
      }

      .error-entity {
        font-size: 12px;
        color: var(--vpc-text-secondary);
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
        opacity: 0.7;
      }

      /* ============================================
         SYSTEM GRID
         ============================================ */
      .system-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
      }

      /* ============================================
         RESPONSIVE
         ============================================ */
      @media (max-width: 600px) {
        .chemistry-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .chemistry-card {
          padding: 11px 6px 10px;
        }

        .chemistry-val {
          font-size: 16px;
        }

        .system-grid {
          grid-template-columns: 1fr;
        }

        .temp-hero-value {
          font-size: 38px;
          letter-spacing: -1.5px;
        }

        .dosing-current-value {
          font-size: 28px;
        }

        .speed-segment {
          font-size: 11px;
          padding: 8px 4px;
        }
      }

      /* ============================================
         TOUCH DEVICES
         ============================================ */
      @media (pointer: coarse) {
        .speed-segment,
        .speed-off-btn,
        .device-row,
        .chemistry-card {
          min-height: 44px;
        }
      }
    `}getCardSize(){switch(this.config?.card_type){case"compact":return 1;case"overview":return 5;default:return 3}}static getStubConfig(){return{type:"custom:violet-pool-card",entity_prefix:"violet_pool",entity:"switch.violet_pool_pump",card_type:"pump"}}static async getConfigElement(){return await Promise.resolve().then(function(){return Ee}),document.createElement("violet-pool-card-editor")}};e([he({attribute:!1})],Ae.prototype,"hass",void 0),e([ue()],Ae.prototype,"config",void 0),Ae=e([le("violet-pool-card")],Ae),window.customCards=window.customCards||[],window.customCards.push({type:"violet-pool-card",name:"Violet Pool Card",description:"Premium card for Violet Pool Controller with glassmorphism design",preview:!0});let Fe=class extends ne{setConfig(e){this._config=e}render(){return this.hass&&this._config?B`
      <div class="card-config">
        <!-- Card Type Selection -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:card-outline"></ha-icon>
            <span>Card Type</span>
          </div>

          <ha-select
            label="Card Type"
            .value="${this._config.card_type}"
            @selected="${this._cardTypeChanged}"
            @closed="${e=>e.stopPropagation()}"
          >
            <mwc-list-item value="pump">🔵 Pump</mwc-list-item>
            <mwc-list-item value="heater">🔥 Heater</mwc-list-item>
            <mwc-list-item value="solar">☀️ Solar</mwc-list-item>
            <mwc-list-item value="dosing">💧 Dosing</mwc-list-item>
            <mwc-list-item value="overview">📊 Overview</mwc-list-item>
            <mwc-list-item value="compact">📋 Compact</mwc-list-item>
            <mwc-list-item value="system">🖥️ System Dashboard</mwc-list-item>
          </ha-select>
        </div>

        <!-- Controller Configuration -->
        <div class="config-section">
          <div class="section-header">
            <ha-icon icon="mdi:chip"></ha-icon>
            <span>Controller Configuration</span>
          </div>

          <ha-textfield
            label="Entity Prefix"
            .value="${this._config.entity_prefix||"violet_pool"}"
            @input="${this._entityPrefixChanged}"
            helper="Name of your pool controller (e.g., 'violet_pool', 'pool_1', 'garden_pool')"
          ></ha-textfield>

          <div class="prefix-info">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>
              The entity prefix should match your Violet Pool Controller name in Home Assistant.
              All entities will be automatically discovered based on this prefix.
            </span>
          </div>
        </div>

        <!-- Entity Selection (not for overview/system) -->
        ${"overview"!==this._config.card_type&&"system"!==this._config.card_type?B`
              <div class="config-section">
                <div class="section-header">
                  <ha-icon icon="mdi:lightning-bolt"></ha-icon>
                  <span>Entity</span>
                </div>

                <ha-entity-picker
                  label="Entity"
                  .hass="${this.hass}"
                  .value="${this._config.entity}"
                  @value-changed="${this._entityChanged}"
                  allow-custom-entity
                ></ha-entity-picker>
              </div>
            `:""}

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
              ${["small","medium","large","fullscreen"].map(e=>B`
                  <button
                    class="size-button ${this._config.size===e?"active":""}"
                    @click="${()=>this._sizeChanged(e)}"
                  >
                    <div class="size-preview size-${e}"></div>
                    <span>${this._formatSizeName(e)}</span>
                  </button>
                `)}
            </div>
          </div>

          <!-- Theme Picker -->
          <div class="picker-container">
            <label>Theme Style</label>
            <div class="theme-picker">
              ${[{value:"apple",icon:"",label:"Apple",desc:"Clean & Light",preview:"#fff"},{value:"dark",icon:"",label:"Dark",desc:"Deep Dark",preview:"#1C1C1E"},{value:"glass",icon:"",label:"Glass",desc:"Frosted Glass",preview:"rgba(255,255,255,0.7)"},{value:"modern",icon:"",label:"Modern",desc:"Minimal Flat",preview:"#f8f8fa"},{value:"minimalist",icon:"",label:"Minimal",desc:"Ultra Clean",preview:"#fff"},{value:"neon",icon:"",label:"Neon",desc:"Dark Glow",preview:"#0D0D14"}].map(e=>B`
                  <button
                    class="theme-button ${this._config.theme===e.value||!this._config.theme&&"apple"===e.value?"active":""}"
                    @click="${()=>this._themeChanged(e.value)}"
                  >
                    <div class="theme-preview theme-${e.value}">
                      <div class="theme-dot" style="background:${e.preview}"></div>
                    </div>
                    <div class="theme-info">
                      <span class="theme-label">${e.label}</span>
                      <span class="theme-desc">${e.desc}</span>
                    </div>
                  </button>
                `)}
            </div>
          </div>

          <!-- Animation Picker -->
          <div class="picker-container">
            <label>Animation Level</label>
            <div class="animation-picker">
              ${[{value:"none",icon:"⏸️",label:"None",desc:"Static"},{value:"subtle",icon:"🌙",label:"Subtle",desc:"Professional"},{value:"smooth",icon:"✨",label:"Smooth",desc:"Balanced"},{value:"energetic",icon:"🚀",label:"Energetic",desc:"Dynamic"}].map(e=>B`
                  <button
                    class="animation-button ${this._config.animation===e.value?"active":""}"
                    @click="${()=>this._animationChanged(e.value)}"
                  >
                    <span class="anim-icon">${e.icon}</span>
                    <div class="anim-info">
                      <span class="anim-label">${e.label}</span>
                      <span class="anim-desc">${e.desc}</span>
                    </div>
                  </button>
                `)}
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
            .value="${this._config.name||""}"
            @input="${this._nameChanged}"
          ></ha-textfield>

          <ha-icon-picker
            label="Custom Icon (optional)"
            .hass="${this.hass}"
            .value="${this._config.icon||""}"
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
              .checked="${!1!==this._config.show_state}"
              @change="${this._showStateChanged}"
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show detail status">
            <ha-switch
              .checked="${!1!==this._config.show_detail_status}"
              @change="${this._showDetailStatusChanged}"
            ></ha-switch>
          </ha-formfield>

          <ha-formfield label="Show controls">
            <ha-switch
              .checked="${!1!==this._config.show_controls}"
              @change="${this._showControlsChanged}"
            ></ha-switch>
          </ha-formfield>

          ${"pump"===this._config.card_type?B`
                <ha-formfield label="Show runtime counter">
                  <ha-switch
                    .checked="${!0===this._config.show_runtime}"
                    @change="${this._showRuntimeChanged}"
                  ></ha-switch>
                </ha-formfield>
              `:""}

          ${"dosing"===this._config.card_type?B`
                <ha-formfield label="Show dosing history">
                  <ha-switch
                    .checked="${!0===this._config.show_history}"
                    @change="${this._showHistoryChanged}"
                  ></ha-switch>
                </ha-formfield>
              `:""}
        </div>

        <!-- Dosing Type (for dosing cards) -->
        ${"dosing"===this._config.card_type?B`
              <div class="config-section">
                <div class="section-header">
                  <ha-icon icon="mdi:flask"></ha-icon>
                  <span>Dosing Type</span>
                </div>

                <ha-select
                  label="Dosing Type"
                  .value="${this._config.dosing_type||"chlorine"}"
                  @selected="${this._dosingTypeChanged}"
                  @closed="${e=>e.stopPropagation()}"
                >
                  <mwc-list-item value="chlorine">💧 Chlorine (ORP)</mwc-list-item>
                  <mwc-list-item value="ph_minus">➖ pH Minus</mwc-list-item>
                  <mwc-list-item value="ph_plus">➕ pH Plus</mwc-list-item>
                  <mwc-list-item value="flocculant">🌊 Flocculant</mwc-list-item>
                </ha-select>
              </div>
            `:""}

        <!-- Advanced Customization -->
        <details class="advanced-section">
          <summary>
            <ha-icon icon="mdi:tune"></ha-icon>
            <span>Advanced Customization</span>
          </summary>

          <div class="advanced-content">
            <ha-textfield
              label="Accent Color (hex)"
              .value="${this._config.accent_color||""}"
              placeholder="#2196F3"
              @input="${this._accentColorChanged}"
            ></ha-textfield>

            <ha-textfield
              label="Icon Color (hex)"
              .value="${this._config.icon_color||""}"
              placeholder="#2196F3"
              @input="${this._iconColorChanged}"
            ></ha-textfield>

            <ha-textfield
              type="number"
              label="Blur Intensity (0-30)"
              .value="${this._config.blur_intensity||10}"
              min="0"
              max="30"
              @input="${this._blurIntensityChanged}"
            ></ha-textfield>
          </div>
        </details>
      </div>
    `:B``}_formatSizeName(e){return{small:"Small",medium:"Medium",large:"Large",fullscreen:"Fullscreen"}[e]||e}_cardTypeChanged(e){const t=e.target;this._config.card_type!==t.value&&(this._config={...this._config,card_type:t.value},this._fireConfigChanged())}_entityPrefixChanged(e){const t=e.target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g,"_");this._config.entity_prefix!==t&&(this._config={...this._config,entity_prefix:t||"violet_pool"},this._fireConfigChanged())}_entityChanged(e){const t=e.detail;this._config.entity!==t.value&&(this._config={...this._config,entity:t.value},this._fireConfigChanged())}_sizeChanged(e){this._config={...this._config,size:e},this._fireConfigChanged()}_themeChanged(e){this._config={...this._config,theme:e},this._fireConfigChanged()}_animationChanged(e){this._config={...this._config,animation:e},this._fireConfigChanged()}_nameChanged(e){const t=e.target;this._config={...this._config,name:t.value||void 0},this._fireConfigChanged()}_iconChanged(e){this._config={...this._config,icon:e.detail.value||void 0},this._fireConfigChanged()}_showStateChanged(e){const t=e.target;this._config={...this._config,show_state:t.checked},this._fireConfigChanged()}_showDetailStatusChanged(e){const t=e.target;this._config={...this._config,show_detail_status:t.checked},this._fireConfigChanged()}_showControlsChanged(e){const t=e.target;this._config={...this._config,show_controls:t.checked},this._fireConfigChanged()}_showRuntimeChanged(e){const t=e.target;this._config={...this._config,show_runtime:t.checked},this._fireConfigChanged()}_showHistoryChanged(e){const t=e.target;this._config={...this._config,show_history:t.checked},this._fireConfigChanged()}_dosingTypeChanged(e){const t=e.target;this._config={...this._config,dosing_type:t.value},this._fireConfigChanged()}_accentColorChanged(e){const t=e.target;this._config={...this._config,accent_color:t.value||void 0},this._fireConfigChanged()}_iconColorChanged(e){const t=e.target;this._config={...this._config,icon_color:t.value||void 0},this._fireConfigChanged()}_blurIntensityChanged(e){const t=e.target;this._config={...this._config,blur_intensity:parseInt(t.value)||10},this._fireConfigChanged()}_fireConfigChanged(){const e=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(e)}static get styles(){return r`
      :host { font-family: -apple-system, system-ui, 'Segoe UI', sans-serif; }
      .card-config { display:flex; flex-direction:column; gap:14px; padding:16px; }
      .config-section {
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, rgba(0,0,0,0.08));
        border-radius: 14px;
        padding: 16px;
      }
      .section-header {
        display:flex; align-items:center; gap:8px; margin-bottom:14px;
        font-weight:600; font-size:14px; letter-spacing:-0.2px;
        color:var(--primary-text-color);
      }
      .section-header ha-icon { --mdc-icon-size:18px; color:var(--primary-color); }
      .prefix-info {
        display:flex; align-items:flex-start; gap:8px; padding:10px 12px;
        margin-top:10px;
        background: rgba(0,122,255,0.07);
        border-radius:10px; font-size:12px;
        color:var(--secondary-text-color); line-height:1.4;
      }
      .prefix-info ha-icon { --mdc-icon-size:16px; color:#007AFF; flex-shrink:0; margin-top:2px; }
      .premium-section {
        background: var(--card-background-color, #fff);
        border: 2px solid rgba(0,122,255,0.15);
      }
      .premium-header { color: #007AFF; }
      .picker-container { margin-bottom:20px; }
      .picker-container:last-child { margin-bottom:0; }
      .picker-container > label {
        display:block; font-weight:500; font-size:13px;
        margin-bottom:10px; color:var(--secondary-text-color);
        text-transform:uppercase; letter-spacing:0.5px;
      }
      .size-picker {
        display:grid; grid-template-columns:repeat(4,1fr); gap:6px;
      }
      .theme-picker {
        display:grid; grid-template-columns:repeat(3,1fr); gap:8px;
      }
      .animation-picker {
        display:grid; grid-template-columns:repeat(2,1fr); gap:6px;
      }
      .size-button, .theme-button, .animation-button {
        display:flex; align-items:center; gap:10px; padding:10px;
        background:var(--secondary-background-color, rgba(120,120,128,0.06));
        border:1.5px solid transparent; border-radius:10px;
        cursor:pointer; transition:all 0.16s ease;
        font-family: inherit;
      }
      .size-button { flex-direction:column; gap:6px; align-items:center; }
      .theme-button { flex-direction:column; gap:6px; align-items:center; padding:10px 8px; }
      .size-button:hover, .theme-button:hover, .animation-button:hover {
        border-color: rgba(0,122,255,0.3);
        background: rgba(0,122,255,0.05);
      }
      .size-button.active, .animation-button.active {
        border-color: #007AFF;
        background: rgba(0,122,255,0.1);
        color: #007AFF;
      }
      .theme-button.active {
        border-color: #007AFF;
        background: rgba(0,122,255,0.08);
        box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
      }
      .size-preview {
        width:36px; height:26px; border-radius:6px;
        border:2px solid currentColor; opacity:0.3;
      }
      .size-preview.size-small  { width:22px; height:18px; }
      .size-preview.size-medium { width:30px; height:22px; }
      .size-preview.size-large  { width:40px; height:28px; }
      .size-preview.size-fullscreen { width:46px; height:34px; }
      .size-button.active .size-preview { opacity:1; }
      .size-button span { font-size:11px; font-weight:500; }
      .theme-preview {
        width:44px; height:44px; border-radius:12px;
        display:flex; align-items:center; justify-content:center;
        overflow:hidden; border:1px solid rgba(0,0,0,0.08);
      }
      .theme-preview.theme-apple  { background:#F2F2F7; }
      .theme-preview.theme-dark   { background:#1C1C1E; }
      .theme-preview.theme-glass  { background:rgba(255,255,255,0.6); backdrop-filter:blur(8px); }
      .theme-preview.theme-modern { background:#f8f8fa; border:1px solid #eee; }
      .theme-preview.theme-minimalist { background:#fff; }
      .theme-preview.theme-neon   { background:#0D0D14; border:1px solid rgba(0,212,255,0.3); }
      .theme-preview.theme-luxury { background:linear-gradient(135deg,rgba(255,255,255,0.9),rgba(240,240,255,0.9)); }
      .theme-dot {
        width:20px; height:20px; border-radius:50%;
        border:2px solid rgba(0,0,0,0.1);
      }
      .theme-info, .anim-info { display:flex; flex-direction:column; gap:1px; }
      .theme-label, .anim-label { font-weight:600; color:var(--primary-text-color); font-size:12px; }
      .theme-desc, .anim-desc { color:var(--secondary-text-color); font-size:10px; }
      .anim-icon { font-size:18px; }
      .advanced-section {
        background:var(--card-background-color);
        border:1px solid var(--divider-color);
        border-radius:14px; padding:14px;
      }
      .advanced-section summary {
        display:flex; align-items:center; gap:8px; cursor:pointer;
        font-weight:600; font-size:14px; color:var(--primary-text-color);
        list-style:none;
      }
      .advanced-section summary::-webkit-details-marker { display:none; }
      .advanced-section summary ha-icon { --mdc-icon-size:18px; color:var(--primary-color); }
      .advanced-content { display:flex; flex-direction:column; gap:12px; margin-top:14px; }
      ha-select, ha-textfield, ha-entity-picker, ha-icon-picker { width:100%; }
      ha-formfield { display:flex; align-items:center; margin-bottom:10px; }
    `}};e([he({attribute:!1})],Fe.prototype,"hass",void 0),e([ue()],Fe.prototype,"_config",void 0),Fe=e([le("violet-pool-card-editor")],Fe);var Ee=Object.freeze({__proto__:null,get VioletPoolCardEditor(){return Fe}});export{Ae as VioletPoolCard};
