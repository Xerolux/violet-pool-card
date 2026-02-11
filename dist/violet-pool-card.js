function t(t,e,i,a){var s,o=arguments.length,r=o<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(s=t[n])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,a)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[a+1],t[0]);return new o(i,t,a)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,a))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,v=g?g.emptyScript:"",f=m.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(t,i,e);void 0!==a&&l(this.prototype,t,a)}}static getPropertyDescriptor(t,e,i){const{get:a,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:a,set(e){const o=a?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,a)=>{if(i)t.adoptedStyleSheets=a.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of a){const a=document.createElement("style"),s=e.litNonce;void 0!==s&&a.setAttribute("nonce",s),a.textContent=i.cssText,t.appendChild(a)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,a=i._$Eh.get(t);if(void 0!==a&&this._$Em!==a){const t=i.getPropertyOptions(a),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=a;const o=s.fromAttribute(e,t.type);this[a]=o??this._$Ej?.get(a)??o,this._$Em=null}}requestUpdate(t,e,i,a=!1,s){if(void 0!==t){const o=this.constructor;if(!1===a&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??x)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:a,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===a&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,a=this[e];!0!==t||this._$AL.has(e)||void 0===a||this.C(e,void 0,i,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[b("elementProperties")]=new Map,_[b("finalized")]=new Map,f?.({ReactiveElement:_}),(m.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,C=t=>t,k=$.trustedTypes,A=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+E,z=`<${T}>`,F=document,P=()=>F.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,I="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,D=/>/g,H=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,V=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t,...e)=>({_$litType$:1,strings:t,values:e}),q=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),W=new WeakMap,Y=F.createTreeWalker(F,129);function G(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,a=[];let s,o=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let n,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===R?"!--"===c[1]?r=N:void 0!==c[1]?r=D:void 0!==c[2]?(L.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=s??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,n=c[1],r=void 0===c[3]?H:'"'===c[3]?V:U):r===V||r===U?r=H:r===N||r===D?r=R:(r=H,s=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";o+=r===R?i+z:l>=0?(a.push(n),i.slice(0,l)+S+i.slice(l)+E+h):i+E+(-2===l?e:h)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),a]};class Z{constructor({strings:t,_$litType$:e},i){let a;this.parts=[];let s=0,o=0;const r=t.length-1,n=this.parts,[c,l]=K(t,e);if(this.el=Z.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(a=Y.nextNode())&&n.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const t of a.getAttributeNames())if(t.endsWith(S)){const e=l[o++],i=a.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?at:tt}),a.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:s}),a.removeAttribute(t));if(L.test(a.tagName)){const t=a.textContent.split(E),e=t.length-1;if(e>0){a.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)a.append(t[i],P()),Y.nextNode(),n.push({type:2,index:++s});a.append(t[e],P())}}}else if(8===a.nodeType)if(a.data===T)n.push({type:2,index:s});else{let t=-1;for(;-1!==(t=a.data.indexOf(E,t+1));)n.push({type:7,index:s}),t+=E.length-1}s++}}static createElement(t,e){const i=F.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,a){if(e===q)return e;let s=void 0!==a?i._$Co?.[a]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,a)),void 0!==a?(i._$Co??=[])[a]=s:i._$Cl=s),void 0!==s&&(e=J(t,s._$AS(t,e.values),s,a)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,a=(t?.creationScope??F).importNode(e,!0);Y.currentNode=a;let s=Y.nextNode(),o=0,r=0,n=i[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new Q(s,s.nextSibling,this,t):1===n.type?e=new n.ctor(s,n.name,n.strings,this,t):6===n.type&&(e=new st(s,this,t)),this._$AV.push(e),n=i[++r]}o!==n?.index&&(s=Y.nextNode(),o++)}return Y.currentNode=F,a}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,a){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),O(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,a="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(e);else{const t=new X(a,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,a=0;for(const s of t)a===e.length?e.push(i=new Q(this.O(P()),this.O(P()),this,this.options)):i=e[a],i._$AI(s),a++;a<e.length&&(this._$AR(i&&i._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=C(t).nextSibling;C(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,a,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,a){const s=this.strings;let o=!1;if(void 0===s)t=J(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const a=t;let r,n;for(t=s[0],r=0;r<s.length-1;r++)n=J(this,a[i+r],e,r),n===q&&(n=this._$AH[r]),o||=!O(n)||n!==this._$AH[r],n===j?t=j:t!==j&&(t+=(n??"")+s[r+1]),this._$AH[r]=n}o&&!a&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class at extends tt{constructor(t,e,i,a,s){super(t,e,i,a,s),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??j)===q)return;const i=this._$AH,a=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==j&&(i===j||a);a&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const ot=$.litHtmlPolyfillSupport;ot?.(Z,Q),($.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;class nt extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const a=i?.renderBefore??e;let s=a._$litPart$;if(void 0===s){const t=i?.renderBefore??null;a._$litPart$=s=new Q(e.insertBefore(P(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:x},ht=(t=dt,e,i)=>{const{kind:a,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===a&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===a){const{name:a}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(a,s,t,!0,i)},init(e){return void 0!==e&&this.C(a,void 0,t,e),e}}}if("setter"===a){const{name:a}=i;return function(i){const s=this[a];e.call(this,i),this.requestUpdate(a,s,t,!0,i)}}throw Error("Unsupported decorator location: "+a)};function pt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const a=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),a?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const mt={off:{color:"#757575",icon:"mdi:power-off",label:"OFF"},on:{color:"#4CAF50",icon:"mdi:power-on",label:"ON"},auto:{color:"#2196F3",icon:"mdi:autorenew",label:"AUTO"},manual:{color:"#FF9800",icon:"mdi:hand-back-right",label:"MANUAL"},blocked:{color:"#FFC107",icon:"mdi:block-helper",label:"BLOCKED"},error:{color:"#F44336",icon:"mdi:alert-circle",label:"ERROR"},idle:{color:"#9E9E9E",icon:"mdi:sleep",label:"IDLE"},heat:{color:"#FF5722",icon:"mdi:fire",label:"HEAT"},heating:{color:"#FF5722",icon:"mdi:fire",label:"HEATING"},cool:{color:"#00BCD4",icon:"mdi:snowflake",label:"COOL"},cooling:{color:"#00BCD4",icon:"mdi:snowflake",label:"COOLING"}};let gt=class extends nt{constructor(){super(...arguments),this.pulse=!1,this.showIcon=!0}render(){const t=mt[this.state]||mt.off,e=this.label||t.label,i=this.icon||t.icon;return B`
      <div
        class="badge ${this.state} ${this.pulse?"pulse":""}"
        style="--badge-color: ${t.color}"
      >
        ${this.showIcon?B`<ha-icon icon="${i}"></ha-icon>`:""}
        <span class="label">${e}</span>
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
    `}};t([pt()],gt.prototype,"state",void 0),t([pt()],gt.prototype,"label",void 0),t([pt()],gt.prototype,"icon",void 0),t([pt({type:Boolean})],gt.prototype,"pulse",void 0),t([pt({type:Boolean})],gt.prototype,"showIcon",void 0),gt=t([lt("status-badge")],gt);const vt={normal:{color:"#4CAF50",icon:"mdi:check-circle"},ok:{color:"#4CAF50",icon:"mdi:check-circle"},low:{color:"#2196F3",icon:"mdi:arrow-down-circle"},high:{color:"#FF9800",icon:"mdi:arrow-up-circle"},critical:{color:"#F44336",icon:"mdi:alert-circle"},warning:{color:"#FF9800",icon:"mdi:alert"},error:{color:"#F44336",icon:"mdi:close-circle"}};let ft=class extends nt{constructor(){super(...arguments),this.unit="",this.label="",this.status="normal",this.decimals=1,this.showStatus=!0,this.showRange=!1,this.large=!1}formatValue(t){return null==t?"--":t.toFixed(this.decimals)}getStatusFromValue(){return void 0===this.value||null===this.value?"normal":"normal"!==this.status?this.status:void 0!==this.min&&this.value<this.min?this.value<.9*this.min?"critical":"low":void 0!==this.max&&this.value>this.max?this.value>1.1*this.max?"critical":"high":"normal"}render(){const t=this.getStatusFromValue(),e=vt[t];return B`
      <div class="value-display ${this.large?"large":""}">
        ${this.label?B`<div class="label">${this.label}</div>`:""}

        <div class="value-container">
          <div class="value" style="color: ${e.color}">
            ${this.formatValue(this.value)}
            ${this.unit?B`<span class="unit">${this.unit}</span>`:""}
          </div>

          ${this.showStatus?B`
                <ha-icon
                  icon="${e.icon}"
                  style="color: ${e.color}"
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
    `}};t([pt({type:Number})],ft.prototype,"value",void 0),t([pt()],ft.prototype,"unit",void 0),t([pt()],ft.prototype,"label",void 0),t([pt()],ft.prototype,"status",void 0),t([pt({type:Number})],ft.prototype,"min",void 0),t([pt({type:Number})],ft.prototype,"max",void 0),t([pt({type:Number})],ft.prototype,"target",void 0),t([pt({type:Number})],ft.prototype,"decimals",void 0),t([pt({type:Boolean})],ft.prototype,"showStatus",void 0),t([pt({type:Boolean})],ft.prototype,"showRange",void 0),t([pt({type:Boolean})],ft.prototype,"large",void 0),ft=t([lt("value-display")],ft);let bt=class extends nt{constructor(){super(...arguments),this.compact=!1}parsePipeSeparated(t){if(!t||"string"!=typeof t)return{status:""};const e=t.split("|");if(2===e.length){const t=parseInt(e[0],10),i=this.formatStatusText(e[1]);return{level:isNaN(t)?void 0:t,status:i}}return{status:this.formatStatusText(t)}}formatStatusText(t){return t?t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "):""}parseArray(t){return Array.isArray(t)?t.map(t=>this.formatStatusText(t)).filter(t=>t):[]}getIconForStatus(t){const e=t.toLowerCase();return e.includes("freeze")||e.includes("frost")?"mdi:snowflake-alert":e.includes("blocked")||e.includes("block")?"mdi:block-helper":e.includes("threshold")||e.includes("limit")?"mdi:speedometer":e.includes("temp")?"mdi:thermometer-alert":e.includes("error")?"mdi:alert-circle":e.includes("ok")||e.includes("normal")?"mdi:check-circle":"mdi:information"}getColorForStatus(t){const e=t.toLowerCase();return e.includes("error")||e.includes("critical")?"var(--error-color, #F44336)":e.includes("blocked")||e.includes("freeze")?"var(--warning-color, #FF9800)":e.includes("ok")||e.includes("normal")?"var(--success-color, #4CAF50)":"var(--info-color, #2196F3)"}render(){if(!this.raw)return B``;if(Array.isArray(this.raw)){const t=this.parseArray(this.raw);return 0===t.length?B``:B`
        <div class="detail-status-list ${this.compact?"compact":""}">
          ${t.map(t=>B`
              <div class="status-item" style="color: ${this.getColorForStatus(t)}">
                <ha-icon icon="${this.icon||this.getIconForStatus(t)}"></ha-icon>
                <span class="status-text">${t}</span>
              </div>
            `)}
        </div>
      `}const t=this.parsePipeSeparated(this.raw);if(!t.status)return B``;const e=this.getColorForStatus(t.status),i=this.icon||this.getIconForStatus(t.status);return B`
      <div class="detail-status ${this.compact?"compact":""}" style="color: ${e}">
        <ha-icon icon="${i}"></ha-icon>
        <div class="status-content">
          ${void 0!==t.level?B`<span class="level">Level ${t.level}:</span>`:""}
          <span class="status-text">${t.status}</span>
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
    `}};t([pt()],bt.prototype,"raw",void 0),t([pt()],bt.prototype,"icon",void 0),t([pt({type:Boolean})],bt.prototype,"compact",void 0),bt=t([lt("detail-status")],bt);const yt={info:{color:"#2196F3",backgroundColor:"rgba(33, 150, 243, 0.1)",icon:"mdi:information"},warning:{color:"#FF9800",backgroundColor:"rgba(255, 152, 0, 0.1)",icon:"mdi:alert"},error:{color:"#F44336",backgroundColor:"rgba(244, 67, 54, 0.1)",icon:"mdi:alert-circle"},success:{color:"#4CAF50",backgroundColor:"rgba(76, 175, 80, 0.1)",icon:"mdi:check-circle"}};let xt=class extends nt{constructor(){super(...arguments),this.warnings=[],this.defaultType="warning",this.dismissable=!1,this.dismissedWarnings=new Set}normalizeWarnings(){return this.warnings.map(t=>"string"==typeof t?{text:this.formatWarningText(t),type:this.getWarningType(t),dismissable:this.dismissable}:{...t,text:this.formatWarningText(t.text),type:t.type||this.defaultType,dismissable:void 0!==t.dismissable?t.dismissable:this.dismissable})}formatWarningText(t){return t?t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "):""}getWarningType(t){const e=t.toLowerCase();return e.includes("error")||e.includes("critical")||e.includes("failed")?"error":e.includes("blocked")||e.includes("threshold")||e.includes("limit")?"warning":e.includes("ok")||e.includes("success")||e.includes("complete")?"success":"info"}handleDismiss(t){this.dismissedWarnings.add(t.text),this.requestUpdate(),this.dispatchEvent(new CustomEvent("warning-dismissed",{detail:{warning:t},bubbles:!0,composed:!0}))}isDismissed(t){return this.dismissedWarnings.has(t.text)}render(){const t=this.normalizeWarnings().filter(t=>!this.isDismissed(t));return 0===t.length?B``:B`
      <div class="warning-chips">
        ${t.map(t=>this.renderChip(t))}
      </div>
    `}renderChip(t){const e=t.type||this.defaultType,i=yt[e],a=t.icon||i.icon;return B`
      <div
        class="chip ${e}"
        style="
          --chip-color: ${i.color};
          --chip-bg: ${i.backgroundColor};
        "
      >
        <ha-icon icon="${a}"></ha-icon>
        <span class="chip-text">${t.text}</span>
        ${t.dismissable?B`
              <button
                class="dismiss-button"
                @click="${()=>this.handleDismiss(t)}"
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
    `}};t([pt({type:Array})],xt.prototype,"warnings",void 0),t([pt()],xt.prototype,"defaultType",void 0),t([pt({type:Boolean})],xt.prototype,"dismissable",void 0),t([ut()],xt.prototype,"dismissedWarnings",void 0),xt=t([lt("warning-chips")],xt);let wt=class extends nt{constructor(){super(...arguments),this.min=0,this.max=100,this.step=1,this.value=0,this.unit="",this.label="",this.disabled=!1,this.vertical=!1,this.showValue=!0,this.showMinMax=!1,this.isDragging=!1,this.localValue=0,this.debounceDelay=300}connectedCallback(){super.connectedCallback(),this.localValue=this.value}updated(t){t.has("value")&&!this.isDragging&&(this.localValue=this.value)}handleInput(t){const e=Number(t.target.value);this.localValue=e,this.isDragging=!0,this.dispatchEvent(new CustomEvent("slider-input",{detail:{value:e},bubbles:!0,composed:!0}))}handleChange(t){const e=Number(t.target.value);this.localValue=e,this.isDragging=!1,this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))},this.debounceDelay)}handleStart(){this.isDragging=!0}handleEnd(){this.isDragging=!1}getLabelForValue(t){if(!this.labels||0===this.labels.length)return"";if("string"==typeof this.labels[0]){const e=Math.round((t-this.min)/this.step);return this.labels[e]||""}const e=this.labels.find(e=>e.value===t);return e?e.label:""}getAllLabels(){if(!this.labels||0===this.labels.length)return[];const t=this.max-this.min;return"string"==typeof this.labels[0]?this.labels.map((e,i)=>{const a=this.min+i*this.step;return{value:a,label:e,position:(a-this.min)/t*100}}):this.labels.map(e=>{const i=(e.value-this.min)/t*100;return{value:e.value,label:e.label,position:i}})}formatValue(t){const e=this.getLabelForValue(t);if(e)return e;const i=this.step<1?1:0;return`${t.toFixed(i)}${this.unit}`}render(){const t=(this.localValue-this.min)/(this.max-this.min)*100,e=this.getAllLabels();return B`
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
              style="--percentage: ${t}%"
            />
          </div>

          ${this.showMinMax?B`<span class="min-max-label">${this.formatValue(this.max)}</span>`:""}
        </div>

        ${e.length>0?B`
              <div class="labels">
                ${e.map(t=>B`
                    <span
                      class="label-item ${this.localValue===t.value?"active":""}"
                      style="left: ${t.position}%"
                      @click="${()=>!this.disabled&&this.handleChange({target:{value:t.value}})}"
                    >
                      ${t.label}
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
    `}};t([pt({type:Number})],wt.prototype,"min",void 0),t([pt({type:Number})],wt.prototype,"max",void 0),t([pt({type:Number})],wt.prototype,"step",void 0),t([pt({type:Number})],wt.prototype,"value",void 0),t([pt()],wt.prototype,"unit",void 0),t([pt()],wt.prototype,"label",void 0),t([pt({type:Array})],wt.prototype,"labels",void 0),t([pt({type:Boolean})],wt.prototype,"disabled",void 0),t([pt({type:Boolean})],wt.prototype,"vertical",void 0),t([pt({type:Boolean})],wt.prototype,"showValue",void 0),t([pt({type:Boolean})],wt.prototype,"showMinMax",void 0),t([ut()],wt.prototype,"isDragging",void 0),t([ut()],wt.prototype,"localValue",void 0),wt=t([lt("slider-control")],wt);let _t=class extends nt{constructor(){super(...arguments),this.actions=[],this.vertical=!1,this.compact=!1,this.loadingStates=new Map}async handleActionClick(t,e){if(!t.disabled&&!this.loadingStates.get(e)){if(t.confirmMessage&&!await this.showConfirmation(t.confirmMessage))return;this.loadingStates.set(e,!0),this.requestUpdate();try{await t.action(),this.dispatchEvent(new CustomEvent("action-executed",{detail:{action:t,index:e},bubbles:!0,composed:!0}))}catch(i){this.dispatchEvent(new CustomEvent("action-error",{detail:{action:t,index:e,error:i},bubbles:!0,composed:!0}))}finally{this.loadingStates.set(e,!1),this.requestUpdate()}}}async showConfirmation(t){return confirm(t)}renderAction(t,e){const i=this.loadingStates.get(e)||t.loading,a=t.disabled||i;return B`
      <button
        class="quick-action ${t.active?"active":""} ${a?"disabled":""} ${i?"loading":""}"
        @click="${()=>this.handleActionClick(t,e)}"
        ?disabled="${a}"
        style="${t.color?`--action-color: ${t.color}`:""}"
        title="${t.label}"
      >
        <div class="action-content">
          ${i?B`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`:B`<ha-icon icon="${t.icon}"></ha-icon>`}
          ${this.compact?"":B`<span class="action-label">${t.label}</span>`}
        </div>
      </button>
    `}render(){return 0===this.actions.length?B``:B`
      <div class="quick-actions ${this.vertical?"vertical":""} ${this.compact?"compact":""}">
        ${this.actions.map((t,e)=>this.renderAction(t,e))}
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
    `}};t([pt({type:Array})],_t.prototype,"actions",void 0),t([pt({type:Boolean})],_t.prototype,"vertical",void 0),t([pt({type:Boolean})],_t.prototype,"compact",void 0),t([ut()],_t.prototype,"loadingStates",void 0),_t=t([lt("quick-actions")],_t);class $t{constructor(t){this.hass=t}showToast(t,e=3e3){const i=new CustomEvent("hass-notification",{detail:{message:t,duration:e},bubbles:!0,composed:!0});window.dispatchEvent(i)}async callService(t,e,i){try{return await this.hass.callService(t,e,i),{success:!0}}catch(t){const e=t instanceof Error?t.message:String(t);return this.showToast(`Error: ${e}`,5e3),{success:!1,error:e}}}async controlPump(t,e,i,a){const s={entity_id:t,action:e};void 0!==i&&(s.speed=i),void 0!==a&&(s.duration=a);const o=await this.callService("violet_pool_controller","control_pump",s);if(o.success){const t=void 0!==i?` (Speed ${i})`:"";this.showToast(`Pump ${e.toUpperCase()}${t}`)}return o}async setTemperature(t,e){const i=await this.callService("climate","set_temperature",{entity_id:t,temperature:e});return i.success&&this.showToast(`Temperature set to ${e}°C`),i}async setHvacMode(t,e){const i=await this.callService("climate","set_hvac_mode",{entity_id:t,hvac_mode:e});return i.success&&this.showToast(`HVAC mode set to ${e.toUpperCase()}`),i}async setNumberValue(t,e){const i=await this.callService("number","set_value",{entity_id:t,value:e});return i.success&&this.showToast(`Value set to ${e}`),i}async turnOn(t){const e=t.split(".")[0],i=await this.callService(e,"turn_on",{entity_id:t});return i.success&&this.showToast(`${t.split(".")[1]} turned ON`),i}async turnOff(t){const e=t.split(".")[0],i=await this.callService(e,"turn_off",{entity_id:t});return i.success&&this.showToast(`${t.split(".")[1]} turned OFF`),i}async toggle(t){const e=t.split(".")[0],i=await this.callService(e,"toggle",{entity_id:t});return i.success&&this.showToast(`${t.split(".")[1]} toggled`),i}async smartDosing(t,e,i="on"){const a=await this.callService("violet_pool_controller","smart_dosing",{dosing_type:t,duration:e,action:i});if(a.success){const i={cl:"Chlorine",phm:"pH-",php:"pH+",floc:"Flocculant"};this.showToast(`${i[t]} dosing for ${e}s`)}return a}async manualDosing(t,e=30){const i=t.match(/dos_\d+_(\w+)/);if(!i)return{success:!1,error:"Could not determine dosing type from entity"};const a={cl:"cl",phm:"phm",php:"php",floc:"floc"}[i[1]];return a?this.smartDosing(a,e):{success:!1,error:`Unknown dosing type: ${i[1]}`}}async setPumpSpeed(t,e){return e<0||e>3?{success:!1,error:"Speed must be between 0 and 3"}:this.controlPump(t,"on",e)}async setControllerMode(t,e){if("off"===e)return this.turnOff(t);const i="manual"===e?"on":"auto";return this.controlPump(t,i)}}class Ct{static parsePumpState(t){if(!t||"string"!=typeof t)return{status:"",rawState:""};const e=t.split("|");if(2===e.length){const i=parseInt(e[0],10),a=this.formatSnakeCase(e[1]);return{level:isNaN(i)?void 0:i,status:a,rawState:t}}return{status:this.formatSnakeCase(t),rawState:t}}static parseHeaterState(t){return this.parsePumpState(t)}static parseSolarState(t){return this.parsePumpState(t)}static formatSnakeCase(t){return t?t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "):""}static getCurrentTemperature(t){const e=t?.attributes?.current_temperature;return void 0!==e?Number(e):void 0}static getTargetTemperature(t){const e=t?.attributes?.temperature;return void 0!==e?Number(e):void 0}static getMinTemperature(t){const e=t?.attributes?.min_temp;return void 0!==e?Number(e):void 0}static getMaxTemperature(t){const e=t?.attributes?.max_temp;return void 0!==e?Number(e):void 0}}class kt{static getTemperatureColor(t){return t<15?{color:"#2196F3",intensity:"high"}:t<20?{color:"#00BCD4",intensity:"medium"}:t<26?{color:"#4CAF50",intensity:"low"}:t<30?{color:"#FF9800",intensity:"medium"}:{color:"#F44336",intensity:"high"}}static getPhColor(t,e=7.2){const i=Math.abs(t-e);return i<.1?{color:"#4CAF50",intensity:"low"}:i<.3?{color:"#8BC34A",intensity:"low"}:i<.5?{color:"#FF9800",intensity:"medium"}:{color:"#F44336",intensity:"high"}}static getOrpColor(t,e=700){return t<e-100?{color:"#F44336",intensity:"high"}:t<e-50?{color:"#FF9800",intensity:"medium"}:t>e+100?{color:"#F44336",intensity:"high"}:t>e+50?{color:"#FF9800",intensity:"medium"}:{color:"#4CAF50",intensity:"low"}}static getPumpSpeedColor(t){switch(t){case 0:default:return{color:"#757575",intensity:"low"};case 1:return{color:"#2196F3",intensity:"low"};case 2:return{color:"#4CAF50",intensity:"medium"};case 3:return{color:"#FF9800",intensity:"high"}}}static getEntityStateColor(t){const e=t.toLowerCase();return"on"===e||"heat"===e||"active"===e?{color:"#4CAF50",intensity:"medium"}:"off"===e||"idle"===e?{color:"#757575",intensity:"low"}:"auto"===e?{color:"#2196F3",intensity:"medium"}:"manual"===e?{color:"#FF9800",intensity:"medium"}:e.includes("blocked")||e.includes("error")?{color:"#F44336",intensity:"high"}:e.includes("warning")?{color:"#FFC107",intensity:"medium"}:{color:"#9E9E9E",intensity:"low"}}static getPercentageColor(t,e=100){const i=Math.abs(t-e);return i<10?{color:"#4CAF50",intensity:"low"}:i<25?{color:"#8BC34A",intensity:"low"}:i<50?{color:"#FF9800",intensity:"medium"}:{color:"#F44336",intensity:"high"}}static getIntensityOpacity(t){switch(t){case"low":return.15;case"medium":return.25;case"high":return.35;default:return.2}}static applyColorToElement(t,e,i=!0){if(t.style.setProperty("--state-color",e.color),i){const i=this.getIntensityOpacity(e.intensity),a=this.hexToRgb(e.color);a&&(t.style.background=`rgba(${a.r}, ${a.g}, ${a.b}, ${i})`)}}static hexToRgb(t){const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}}let At=class extends nt{setConfig(t){if(!t.card_type)throw new Error("You need to define a card_type");if("overview"!==t.card_type&&"system"!==t.card_type&&!t.entity)throw new Error("You need to define an entity");this.config={show_state:!0,show_detail_status:!0,show_controls:!0,show_runtime:!1,show_history:!1,size:"medium",theme:"luxury",animation:"smooth",blur_intensity:10,style:"standard",show_flow_animation:!1,entity_prefix:"violet_pool",...t}}_buildEntityId(t,e){return`${t}.${this.config.entity_prefix||"violet_pool"}_${e}`}_getEntityId(t,e,i,a){return this.config[t]||(void 0!==a&&this.config.entities&&this.config.entities[a]?this.config.entities[a]:this._buildEntityId(e,i))}_showMoreInfo(t){const e=new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0});this.dispatchEvent(e)}render(){if(!this.config||!this.hass)return B``;if(this.config.entity&&!this.hass.states[this.config.entity])return B`
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
        `}}_getCardClasses(t,e){const i=[];return i.push(`size-${e.size||"medium"}`),e.theme?i.push(`theme-${e.theme}`):i.push(e.style||"standard"),e.animation&&"none"!==e.animation&&i.push(`animation-${e.animation}`),(e.show_flow_animation||"energetic"===e.animation)&&t&&i.push("flow-active"),t&&i.push("is-active"),i.join(" ")}_getAccentColor(t,e){if(e.accent_color)return e.accent_color;switch(t){case"pump":default:return"#2196F3";case"heater":return"#FF5722";case"solar":return"#FF9800";case"dosing":return"#4CAF50";case"overview":return"#7C4DFF"}}renderSystemCard(){const t=this._getEntityId("pump_entity","switch","pump",0),e=this._getEntityId("heater_entity","climate","heater",1),i=this._getEntityId("solar_entity","climate","solar",2),a=this._getEntityId("chlorine_entity","switch","dos_1_cl",3),s=(t,e,i={})=>"overview"===t||this.hass.states[e]?{...this.config,card_type:t,entity:e,...i}:null,o=s("overview","",{name:"Pool Overview"}),r=s("pump",t,{show_runtime:!0}),n=s("heater",e),c=s("solar",i),l=s("dosing",a,{dosing_type:"chlorine"});return B`
      <div class="system-grid">
        ${o?this.renderOverviewCard(o):""}
        ${r?this.renderPumpCard(r):""}
        ${n?this.renderHeaterCard(n):""}
        ${c?this.renderSolarCard(c):""}
        ${l?this.renderDosingCard(l):""}
      </div>
    `}renderPumpCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,a=t.name||e.attributes.friendly_name||"Pump",s=e.attributes?.PUMPSTATE||"",o=this._getAccentColor("pump",t),r=Ct.parsePumpState(s),n=void 0!==r.level?r.level:0,c=[e.attributes?.PUMP_RPM_0||0,e.attributes?.PUMP_RPM_1||0,e.attributes?.PUMP_RPM_2||0,e.attributes?.PUMP_RPM_3||0][n]||0,l=e.attributes?.runtime||0,d=Math.floor(l/3600),h=Math.floor(l%3600/60),p=d>0?`${d}h ${h}min`:`${h}min`,u=kt.getPumpSpeedColor(n),m=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.turnOff(t.entity)},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.controlPump(t.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:speedometer-slow",label:"ECO",action:async()=>{const e=new $t(this.hass);await e.setPumpSpeed(t.entity,1)},active:1===n,color:"#4CAF50"},{icon:"mdi:speedometer-medium",label:"Normal",action:async()=>{const e=new $t(this.hass);await e.setPumpSpeed(t.entity,2)},active:2===n,color:"#FF9800"},{icon:"mdi:speedometer",label:"Boost",action:async()=>{const e=new $t(this.hass);await e.setPumpSpeed(t.entity,3)},active:3===n,color:"#F44336"}],g="on"===i||n>0;return B`
      <ha-card
        class="${this._getCardClasses(g,t)}"
        style="--card-accent: ${o}"
        @click="${()=>this._showMoreInfo(t.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${g?"icon-active":""}">
              <ha-icon
                icon="${t.icon||"mdi:pump"}"
                class="${g?"pump-running":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              ${n>0?B`<span class="header-subtitle" style="color: ${u.color}">Level ${n} ${c>0?`· ${c} RPM`:""}</span>`:B`<span class="header-subtitle">${i}</span>`}
            </div>
            ${t.show_state?B`<status-badge .state="${i}" .pulse="${g}"></status-badge>`:""}
          </div>

          ${t.show_detail_status&&s?B`<detail-status .raw="${s}"></detail-status>`:""}

          ${t.show_controls?B`
                <slider-control
                  label="Pump Speed"
                  min="0"
                  max="3"
                  step="1"
                  .value="${n}"
                  .labels="${["OFF","ECO","Normal","Boost"]}"
                  @value-changed="${e=>this._handlePumpSpeedChange(e,t.entity)}"
                ></slider-control>

                <quick-actions .actions="${m}"></quick-actions>
              `:""}

          ${t.show_runtime&&l>0?B`
                <div class="info-row">
                  <ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span class="info-label">Runtime</span>
                  <span class="info-value">${p}</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}async _handlePumpSpeedChange(t,e){const i=t.detail.value,a=new $t(this.hass);await a.setPumpSpeed(e,i)}renderHeaterCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,a=t.name||e.attributes.friendly_name||"Heater",s=this._getAccentColor("heater",t),o=Ct.getCurrentTemperature(e),r=Ct.getTargetTemperature(e),n=Ct.getMinTemperature(e)||18,c=Ct.getMaxTemperature(e)||35,l=e.attributes?.HEATERSTATE||"",d=e.attributes?.outside_temperature,h=e.attributes?.min_outside_temperature||14.5,p=l.includes("BLOCKED_BY_OUTSIDE_TEMP")||void 0!==d&&d<h,u=void 0!==o?kt.getTemperatureColor(o):void 0,m=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"off")},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:fire",label:"HEAT",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"heat")},active:"heat"===i||"heating"===i,color:"#FF5722"}],g="heating"===i||"heat"===i;return B`
      <ha-card
        class="${this._getCardClasses(g,t)}"
        style="--card-accent: ${s}"
        @click="${()=>this._showMoreInfo(t.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${g?"icon-active":""}">
              <ha-icon
                icon="${t.icon||"mdi:radiator"}"
                class="${g?"heater-active":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle">${i}</span>
            </div>
            ${t.show_state?B`<status-badge .state="${i}"></status-badge>`:""}
          </div>

          ${void 0!==o?B`
                <div class="temp-hero" style="--temp-color: ${u?.color||"var(--vpc-primary)"}">
                  <span class="temp-hero-value">${o.toFixed(1)}</span>
                  <span class="temp-hero-unit">°C</span>
                  ${void 0!==r?B`<span class="temp-hero-target">→ ${r.toFixed(1)}°C</span>`:""}
                </div>
              `:""}

          ${t.show_detail_status&&l?B`<detail-status .raw="${l}"></detail-status>`:""}

          ${void 0!==d?B`
                <div class="info-row ${p?"info-row-warning":""}">
                  <ha-icon icon="mdi:thermometer"></ha-icon>
                  <span class="info-label">Outside</span>
                  <span class="info-value">${d.toFixed(1)}°C</span>
                  ${p?B`<span class="info-badge warning">Min ${h}°C</span>`:""}
                </div>
              `:""}

          ${t.show_controls?B`
                ${void 0!==r?B`
                      <slider-control
                        label="Target Temperature"
                        .min="${n}"
                        .max="${c}"
                        step="0.5"
                        .value="${r}"
                        unit="°C"
                        showMinMax
                        @value-changed="${e=>this._handleTemperatureChange(e,t.entity)}"
                      ></slider-control>
                    `:""}
                <quick-actions .actions="${m}"></quick-actions>
              `:""}
        </div>
      </ha-card>
    `}async _handleTemperatureChange(t,e){const i=t.detail.value,a=new $t(this.hass);await a.setTemperature(e,i)}renderSolarCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,a=t.name||e.attributes.friendly_name||"Solar",s=this._getAccentColor("solar",t),o=Ct.getCurrentTemperature(e),r=Ct.getTargetTemperature(e),n=Ct.getMinTemperature(e)||18,c=Ct.getMaxTemperature(e)||32,l=e.attributes?.absorber_temperature,d=void 0!==l&&void 0!==o?l-o:void 0,h=e.attributes?.SOLARSTATE||"",p=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"off")},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:sun-thermometer",label:"ON",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"heat")},active:"heat"===i||"heating"===i,color:"#FF9800"}],u="heating"===i||"heat"===i;return B`
      <ha-card
        class="${this._getCardClasses(u,t)}"
        style="--card-accent: ${s}"
        @click="${()=>this._showMoreInfo(t.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${u?"icon-active":""}">
              <ha-icon
                icon="${t.icon||"mdi:solar-power"}"
                class="${u?"solar-active":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle">${i}</span>
            </div>
            ${t.show_state?B`<status-badge .state="${i}"></status-badge>`:""}
          </div>

          ${t.show_detail_status&&h?B`<detail-status .raw="${h}"></detail-status>`:""}

          <div class="solar-temps">
            ${void 0!==o?B`
                  <div class="info-row">
                    <ha-icon icon="mdi:pool"></ha-icon>
                    <span class="info-label">Pool</span>
                    <span class="info-value">${o.toFixed(1)}°C</span>
                  </div>
                `:""}
            ${void 0!==l?B`
                  <div class="info-row">
                    <ha-icon icon="mdi:solar-panel"></ha-icon>
                    <span class="info-label">Absorber</span>
                    <span class="info-value">${l.toFixed(1)}°C</span>
                  </div>
                `:""}
            ${void 0!==d?B`
                  <div class="delta-display ${d>0?"delta-positive":"delta-negative"}">
                    <ha-icon icon="${d>0?"mdi:arrow-up":"mdi:arrow-down"}"></ha-icon>
                    <span class="delta-value">\u0394 ${d>0?"+":""}${d.toFixed(1)}°C</span>
                    <span class="delta-hint">${d<0?"Too cold for heating":d<3?"Heating possible":"Ideal for heating"}</span>
                  </div>
                `:""}
          </div>

          ${t.show_controls?B`
                ${void 0!==r?B`
                      <slider-control
                        label="Target Temperature"
                        .min="${n}"
                        .max="${c}"
                        step="0.5"
                        .value="${r}"
                        unit="°C"
                        showMinMax
                        @value-changed="${e=>this._handleTemperatureChange(e,t.entity)}"
                      ></slider-control>
                    `:""}
                <quick-actions .actions="${p}"></quick-actions>
              `:""}
        </div>
      </ha-card>
    `}renderDosingCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,a=t.name||e.attributes.friendly_name||"Dosing",s=this._getAccentColor("dosing",t),o=t.dosing_type||this._detectDosingType(t.entity),r=Object.keys(e.attributes||{}).find(t=>t.includes("DOS_")&&t.includes("_STATE")),n=r?e.attributes[r]:[];let c,l,d,h,p="",u="mdi:test-tube";if("chlorine"===o){const t=this._getEntityId("orp_value_entity","sensor","orp_value"),e=this.hass.states[t];c=e?parseFloat(e.state):void 0;const i=this._getEntityId("target_orp_entity","number","target_orp"),a=this.hass.states[i];l=a?parseFloat(a.state):void 0,d=a?.attributes?.min||600,h=a?.attributes?.max||800,p="mV",u="mdi:flash"}else if("ph_minus"===o||"ph_plus"===o){const t=this._getEntityId("ph_value_entity","sensor","ph_value"),e=this.hass.states[t];c=e?parseFloat(e.state):void 0;const i=this._getEntityId("target_ph_entity","number","target_ph"),a=this.hass.states[i];l=a?parseFloat(a.state):void 0,d=a?.attributes?.min||6.8,h=a?.attributes?.max||7.8,p="",u="mdi:ph"}const m=e.attributes?.dosing_volume_24h,g=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.turnOff(t.entity)},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.turnOn(t.entity)},active:"on"===i||"auto"===i,color:"#2196F3"},{icon:"mdi:play-circle",label:"Dose 30s",action:async()=>{const e=new $t(this.hass);await e.manualDosing(t.entity,30)},color:"#4CAF50",confirmMessage:"Start manual dosing for 30 seconds?"},{icon:"mdi:play-speed",label:"Dose 60s",action:async()=>{const e=new $t(this.hass);await e.manualDosing(t.entity,60)},color:"#FF9800",confirmMessage:"Start manual dosing for 60 seconds?"}],v="on"===i&&Array.isArray(n)&&n.some(t=>t.includes("ACTIVE")),f=void 0!==c?"chlorine"===o?kt.getOrpColor(c,l):kt.getPhColor(c,l):void 0;return B`
      <ha-card
        class="${this._getCardClasses(v,t)}"
        style="--card-accent: ${s}"
        @click="${()=>this._showMoreInfo(t.entity)}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${v?"icon-active":""}">
              <ha-icon
                icon="${t.icon||this._getDosingIcon(o)}"
                class="${v?"dosing-active":""}"
              ></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${a}</span>
              <span class="header-subtitle">${i}</span>
            </div>
            ${t.show_state?B`<status-badge .state="${i}" .pulse="${v}"></status-badge>`:""}
          </div>

          ${void 0!==c?B`
                <div class="dosing-hero">
                  <div class="dosing-current" style="color: ${f?.color||"var(--vpc-text)"}">
                    <ha-icon icon="${u}"></ha-icon>
                    <span class="dosing-current-value">${c.toFixed("chlorine"===o?0:1)}</span>
                    <span class="dosing-current-unit">${p}</span>
                  </div>
                  ${void 0!==l?B`
                        <div class="dosing-target">
                          <ha-icon icon="mdi:arrow-right-thin"></ha-icon>
                          <span>${l.toFixed("chlorine"===o?0:1)}${p}</span>
                        </div>
                      `:""}
                  ${void 0!==d&&void 0!==h?B`
                        <div class="dosing-range">
                          <span>Min ${d.toFixed("chlorine"===o?0:1)}${p}</span>
                          <span class="dosing-range-sep">\u2022</span>
                          <span>Max ${h.toFixed("chlorine"===o?0:1)}${p}</span>
                        </div>
                      `:""}
                </div>
              `:""}

          ${t.show_detail_status&&Array.isArray(n)&&n.length>0?B`<warning-chips .warnings="${n}" defaultType="warning"></warning-chips>`:""}

          ${t.show_controls?B`<quick-actions .actions="${g}"></quick-actions>`:""}

          ${t.show_history&&void 0!==m?B`
                <div class="info-row">
                  <ha-icon icon="mdi:chart-line"></ha-icon>
                  <span class="info-label">Last 24h</span>
                  <span class="info-value">${m}ml</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}_detectDosingType(t){return t.includes("_cl")?"chlorine":t.includes("_phm")?"ph_minus":t.includes("_php")?"ph_plus":t.includes("_floc")?"flocculant":"chlorine"}_getDosingIcon(t){switch(t){case"chlorine":default:return"mdi:flask-outline";case"ph_minus":return"mdi:flask-minus";case"ph_plus":return"mdi:flask-plus";case"flocculant":return"mdi:flask"}}renderOverviewCard(t=this.config){const e=t.name||"Pool Status",i=this._getAccentColor("overview",t),a=this._getEntityId("pump_entity","switch","pump",0),s=this._getEntityId("heater_entity","climate","heater",1),o=this._getEntityId("solar_entity","climate","solar",2),r=this._getEntityId("chlorine_entity","switch","dos_1_cl",3),n=this._getEntityId("ph_minus_entity","switch","dos_2_phm",4),c=this.hass.states[a],l=this.hass.states[s],d=this.hass.states[o],h=this.hass.states[r],p=this.hass.states[n],u=this._getEntityId("pool_temp_entity","sensor","temperature",5),m=this._getEntityId("ph_value_entity","sensor","ph_value",6),g=this._getEntityId("orp_value_entity","sensor","orp_value",7),v=this.hass.states[u],f=this.hass.states[m],b=this.hass.states[g],y=v?parseFloat(v.state):void 0,x=f?parseFloat(f.state):void 0,w=b?parseFloat(b.state):void 0,_=void 0!==y?kt.getTemperatureColor(y):void 0,$=void 0!==x?kt.getPhColor(x):void 0,C=void 0!==w?kt.getOrpColor(w):void 0,k=void 0===(A=x)||isNaN(A)?"unknown":A<7||A>7.4?"warning":"ok";var A;const S=void 0===(E=w)||isNaN(E)?"unknown":E<650?"warning":E>750?"high":"ok";var E;const T=[];if(c){const t=c.attributes?.PUMPSTATE||"",e=Ct.parsePumpState(t);T.push({icon:"mdi:pump",name:"Pump",status:e.status||c.state,state:c.state,entityId:a})}if(l){const t=l.attributes?.HEATERSTATE||"",e=Ct.parseHeaterState(t);T.push({icon:"mdi:radiator",name:"Heater",status:e.status||l.state,state:l.state,entityId:s})}if(d){const t=d.attributes?.SOLARSTATE||"",e=Ct.parseSolarState(t);T.push({icon:"mdi:solar-power",name:"Solar",status:e.status||d.state,state:d.state,entityId:o})}if(h){const t=h.attributes?.DOS_1_CL_STATE||[],e=Array.isArray(t)&&t.length>0?Ct.formatSnakeCase(t[0]):h.state;T.push({icon:"mdi:flask-outline",name:"Chlorine",status:e,state:h.state,entityId:r})}if(p){const t=p.attributes?.DOS_2_PHM_STATE||[],e=Array.isArray(t)&&t.length>0?Ct.formatSnakeCase(t[0]):p.state;T.push({icon:"mdi:flask-minus",name:"pH-",status:e,state:p.state,entityId:n})}const z=[];if("warning"===S&&z.push("ORP too low - Check chlorine dosing"),"high"===S&&z.push("ORP too high - Stop chlorine dosing"),"warning"===k&&z.push("pH out of range - Check dosing"),c?.attributes?.PUMPSTATE?.includes("ANTI_FREEZE")){const t=l?.attributes?.outside_temperature;z.push("Frost protection active"+(t?` (${t.toFixed(1)}°C)`:""))}const F=T.some(t=>["on","auto","heat","heating"].includes(t.state));return B`
      <ha-card
        class="${this._getCardClasses(F,t)}"
        style="--card-accent: ${i}"
      >
        <div class="accent-bar"></div>
        <div class="card-content">
          <div class="header">
            <div class="header-icon ${F?"icon-active":""}">
              <ha-icon icon="mdi:pool"></ha-icon>
            </div>
            <div class="header-info">
              <span class="name">${e}</span>
              <span class="header-subtitle">${F?"Active":"Idle"}</span>
            </div>
          </div>

          <!-- Water Chemistry Grid -->
          <div class="chemistry-grid">
            ${void 0!==y?B`
                  <div class="chemistry-card" style="--chem-color: ${_?.color||"#4CAF50"}"
                    @click="${t=>{t.stopPropagation(),this._showMoreInfo(u)}}">
                    <ha-icon icon="mdi:thermometer-water"></ha-icon>
                    <span class="chemistry-val">${y.toFixed(1)}°C</span>
                    <span class="chemistry-label">Temperature</span>
                  </div>
                `:""}
            ${void 0!==x?B`
                  <div class="chemistry-card" style="--chem-color: ${$?.color||"#4CAF50"}"
                    @click="${t=>{t.stopPropagation(),this._showMoreInfo(m)}}">
                    <ha-icon icon="mdi:ph"></ha-icon>
                    <span class="chemistry-val">pH ${x.toFixed(1)}</span>
                    <span class="chemistry-label">${"ok"===k?"Optimal":"Attention"}</span>
                  </div>
                `:""}
            ${void 0!==w?B`
                  <div class="chemistry-card" style="--chem-color: ${C?.color||"#4CAF50"}"
                    @click="${t=>{t.stopPropagation(),this._showMoreInfo(g)}}">
                    <ha-icon icon="mdi:flash"></ha-icon>
                    <span class="chemistry-val">${w.toFixed(0)}mV</span>
                    <span class="chemistry-label">${"ok"===S?"Optimal":"warning"===S?"Low":"High"}</span>
                  </div>
                `:""}
          </div>

          <!-- Active Devices -->
          ${T.length>0?B`
                <div class="overview-section">
                  <div class="section-title">
                    <ha-icon icon="mdi:devices"></ha-icon>
                    <span>Devices</span>
                  </div>
                  <div class="device-list">
                    ${T.map(t=>B`
                        <div class="device-row"
                          @click="${e=>{e.stopPropagation(),this._showMoreInfo(t.entityId)}}">
                          <ha-icon
                            icon="${t.icon}"
                            class="${["on","auto","heat","heating"].includes(t.state)?"device-active":"device-inactive"}"
                          ></ha-icon>
                          <span class="device-name">${t.name}</span>
                          <span class="device-status">${t.status}</span>
                          <div class="device-dot ${["on","auto","heat","heating"].includes(t.state)?"dot-active":"dot-inactive"}"></div>
                        </div>
                      `)}
                  </div>
                </div>
              `:""}

          <!-- Warnings -->
          ${z.length>0?B`
                <div class="overview-section">
                  <div class="section-title warning-title">
                    <ha-icon icon="mdi:alert-outline"></ha-icon>
                    <span>Warnings</span>
                  </div>
                  <div class="warning-list">
                    ${z.map(t=>B`
                        <div class="warning-row">
                          <ha-icon icon="${t.includes("Frost")?"mdi:snowflake-alert":"mdi:alert-circle"}"></ha-icon>
                          <span>${t}</span>
                        </div>
                      `)}
                  </div>
                </div>
              `:B`
                <div class="all-ok-display">
                  <ha-icon icon="mdi:check-circle"></ha-icon>
                  <span>All systems normal</span>
                </div>
              `}
        </div>
      </ha-card>
    `}renderCompactCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,a=t.name||e.attributes.friendly_name||"Entity",s=t.entity.split(".")[0];let o=t.icon;o||(o="switch"===s&&t.entity.includes("pump")?"mdi:pump":"climate"===s&&t.entity.includes("heater")?"mdi:radiator":"climate"===s&&t.entity.includes("solar")?"mdi:solar-power":"switch"===s&&t.entity.includes("dos")?"mdi:flask-outline":"mdi:circle");let r="",n="";if(e.attributes?.PUMPSTATE){const t=Ct.parsePumpState(e.attributes.PUMPSTATE);r=t.status,void 0!==t.level&&t.level>0&&(n=`Level ${t.level}`)}else if(e.attributes?.HEATERSTATE){r=Ct.parseHeaterState(e.attributes.HEATERSTATE).status;const t=Ct.getCurrentTemperature(e);void 0!==t&&(n=`${t.toFixed(1)}°C`)}else if(e.attributes?.SOLARSTATE){r=Ct.parseSolarState(e.attributes.SOLARSTATE).status;const t=Ct.getCurrentTemperature(e);void 0!==t&&(n=`${t.toFixed(1)}°C`)}else if(Object.keys(e.attributes||{}).some(t=>t.includes("DOS_")&&t.includes("_STATE"))){const i=Object.keys(e.attributes||{}).find(t=>t.includes("DOS_")&&t.includes("_STATE")),a=i?e.attributes[i]:[];Array.isArray(a)&&a.length>0&&(r=Ct.formatSnakeCase(a[0]));const s=this._detectDosingType(t.entity);if("chlorine"===s){const t=this._getEntityId("orp_value_entity","sensor","orp_value"),e=this.hass.states[t];e&&(n=`${parseFloat(e.state).toFixed(0)}mV`)}else if("ph_minus"===s||"ph_plus"===s){const t=this._getEntityId("ph_value_entity","sensor","ph_value"),e=this.hass.states[t];e&&(n=`pH ${parseFloat(e.state).toFixed(1)}`)}}const c="on"===i||"auto"===i||"heat"===i||"heating"===i;return B`
      <ha-card
        class="compact-card ${this._getCardClasses(c,t)}"
        @click="${()=>this._showMoreInfo(t.entity)}"
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
         BASE VARIABLES
         ============================================ */
      :host {
        --vpc-spacing: 16px;
        --vpc-radius: 16px;
        --vpc-bg: var(--ha-card-background, var(--card-background-color, #fff));
        --vpc-border: none;
        --vpc-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.08));
        --vpc-backdrop: none;
        --vpc-primary: var(--primary-color, #2196F3);
        --vpc-text: var(--primary-text-color, #212121);
        --vpc-text-secondary: var(--secondary-text-color, #757575);
        --vpc-icon-size: 24px;
        --vpc-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        --card-accent: var(--primary-color, #2196F3);

        display: block;
      }

      /* ============================================
         THEME OVERRIDES (fixed: on ha-card, not :host)
         ============================================ */
      ha-card.theme-luxury,
      ha-card.theme-glass {
        --vpc-bg: rgba(255, 255, 255, 0.65);
        --vpc-backdrop: blur(20px) saturate(180%);
        --vpc-radius: 24px;
        --vpc-border: 1px solid rgba(255, 255, 255, 0.3);
        --vpc-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      }

      ha-card.theme-modern {
        --vpc-radius: 20px;
        --vpc-spacing: 20px;
        --vpc-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
      }

      ha-card.theme-minimalist {
        --vpc-radius: 12px;
        --vpc-shadow: none;
        --vpc-border: 1px solid rgba(0,0,0,0.06);
      }

      ha-card.theme-neon {
        --vpc-bg: linear-gradient(145deg, #1a1a2e, #0a0a1a);
        --vpc-border: 1px solid rgba(0, 255, 255, 0.15);
        --vpc-shadow: 0 0 20px rgba(0, 255, 255, 0.08);
        --vpc-radius: 8px;
        --vpc-primary: #00ffff;
        --vpc-text: #e0e0e0;
        --vpc-text-secondary: #808080;
      }

      ha-card.theme-premium {
        --vpc-bg: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,255,0.95) 100%);
        --vpc-radius: 20px;
        --vpc-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,255,255,0.8);
        --vpc-border: 1px solid rgba(255,255,255,0.6);
      }

      /* Dark mode support via HA's dark-mode variables */
      @media (prefers-color-scheme: dark) {
        ha-card.theme-luxury,
        ha-card.theme-glass {
          --vpc-bg: rgba(20, 20, 30, 0.7);
          --vpc-border: 1px solid rgba(255, 255, 255, 0.08);
          --vpc-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        ha-card.theme-premium {
          --vpc-bg: linear-gradient(135deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.95) 100%);
          --vpc-border: 1px solid rgba(255,255,255,0.06);
        }
        ha-card.theme-minimalist {
          --vpc-border: 1px solid rgba(255,255,255,0.06);
        }
      }

      /* ============================================
         HA-CARD BASE
         ============================================ */
      ha-card {
        padding: var(--vpc-spacing);
        background: var(--vpc-bg);
        border-radius: var(--vpc-radius);
        box-shadow: var(--vpc-shadow);
        border: var(--vpc-border);
        backdrop-filter: var(--vpc-backdrop);
        -webkit-backdrop-filter: var(--vpc-backdrop);
        transition: var(--vpc-transition);
        overflow: hidden;
        position: relative;
        cursor: pointer;
      }

      ha-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      ha-card.theme-neon:hover {
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.15);
      }

      ha-card.theme-neon.is-active {
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.25), inset 0 0 15px rgba(0, 255, 255, 0.05);
        border-color: rgba(0, 255, 255, 0.4);
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
        opacity: 0.7;
        transition: opacity 0.3s ease, height 0.3s ease;
      }

      ha-card.is-active .accent-bar {
        height: 4px;
        opacity: 1;
        background: linear-gradient(90deg, var(--card-accent), color-mix(in srgb, var(--card-accent) 70%, white));
      }

      ha-card.theme-neon .accent-bar {
        background: linear-gradient(90deg, #00ffff, #7c4dff, #00ffff);
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
      }

      ha-card.theme-minimalist .accent-bar {
        height: 2px;
        opacity: 0.5;
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
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.08);
        transition: var(--vpc-transition);
        flex-shrink: 0;
      }

      .header-icon.icon-active {
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.15);
        box-shadow: 0 0 0 4px rgba(var(--rgb-primary-color, 33,150,243), 0.06);
      }

      ha-card.theme-neon .header-icon {
        background: rgba(0, 255, 255, 0.08);
        border: 1px solid rgba(0, 255, 255, 0.15);
      }

      ha-card.theme-neon .header-icon.icon-active {
        background: rgba(0, 255, 255, 0.12);
        box-shadow: 0 0 12px rgba(0, 255, 255, 0.15);
      }

      .header-icon ha-icon {
        --mdc-icon-size: 24px;
        color: var(--vpc-primary);
      }

      .header-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .name {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.2px;
        color: var(--vpc-text);
        line-height: 1.3;
      }

      .header-subtitle {
        font-size: 13px;
        color: var(--vpc-text-secondary);
        text-transform: capitalize;
        line-height: 1.2;
      }

      /* ============================================
         ICONS & ANIMATIONS
         ============================================ */
      ha-icon {
        --mdc-icon-size: var(--vpc-icon-size);
        color: var(--vpc-primary);
        transition: var(--vpc-transition);
      }

      @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }

      .pump-running { animation: rotate 2s linear infinite; }
      .heater-active { animation: breathe 2s ease-in-out infinite; color: #FF5722; }
      .solar-active { animation: breathe 3s ease-in-out infinite; color: #FF9800; }
      .dosing-active { animation: pulse-glow 2s ease-in-out infinite; color: #4CAF50; }

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
         DOSING HERO DISPLAY
         ============================================ */
      .dosing-hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px;
        border-radius: 16px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
      }

      ha-card.theme-neon .dosing-hero {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.08);
      }

      .dosing-current {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .dosing-current ha-icon {
        --mdc-icon-size: 20px;
      }

      .dosing-current-value {
        font-size: 32px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.5px;
      }

      .dosing-current-unit {
        font-size: 16px;
        font-weight: 500;
        opacity: 0.7;
      }

      .dosing-target {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--vpc-text-secondary);
        font-size: 14px;
        font-weight: 500;
      }

      .dosing-target ha-icon {
        --mdc-icon-size: 18px;
        opacity: 0.6;
      }

      .dosing-range {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--vpc-text-secondary);
        opacity: 0.8;
      }

      .dosing-range-sep {
        opacity: 0.4;
      }

      /* ============================================
         INFO ROWS (unified: rpm, runtime, outside temp, etc.)
         ============================================ */
      .info-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
        font-size: 14px;
        color: var(--vpc-text);
      }

      ha-card.theme-neon .info-row {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.08);
      }

      .info-row ha-icon {
        --mdc-icon-size: 18px;
        color: var(--vpc-text-secondary);
        flex-shrink: 0;
      }

      .info-label {
        flex: 1;
        font-weight: 500;
        color: var(--vpc-text-secondary);
      }

      .info-value {
        font-weight: 600;
        color: var(--vpc-text);
      }

      .info-badge {
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
      }

      .info-badge.warning {
        background: rgba(255, 152, 0, 0.15);
        color: #ef6c00;
      }

      .info-row-warning {
        background: rgba(255, 152, 0, 0.08);
        border: 1px solid rgba(255, 152, 0, 0.2);
      }

      /* ============================================
         SOLAR TEMPERATURE SECTION
         ============================================ */
      .solar-temps {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .delta-display {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
      }

      .delta-positive {
        background: rgba(76, 175, 80, 0.08);
        color: #2e7d32;
      }

      .delta-negative {
        background: rgba(244, 67, 54, 0.08);
        color: #c62828;
      }

      .delta-display ha-icon {
        --mdc-icon-size: 18px;
      }

      .delta-value {
        font-weight: 700;
      }

      .delta-hint {
        font-size: 12px;
        font-weight: 400;
        opacity: 0.7;
        margin-left: auto;
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
         OVERVIEW: DEVICE LIST
         ============================================ */
      .device-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .device-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.03);
        cursor: pointer;
        transition: var(--vpc-transition);
      }

      .device-row:hover {
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.06);
      }

      ha-card.theme-neon .device-row {
        background: rgba(0, 255, 255, 0.04);
        border: 1px solid rgba(0, 255, 255, 0.06);
      }

      .device-row ha-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }

      .device-active {
        color: var(--vpc-primary) !important;
      }

      .device-inactive {
        color: var(--vpc-text-secondary) !important;
        opacity: 0.5;
      }

      .device-name {
        font-weight: 500;
        flex: 1;
        font-size: 14px;
        color: var(--vpc-text);
      }

      .device-status {
        color: var(--vpc-text-secondary);
        font-size: 13px;
      }

      .device-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .dot-active {
        background: #4CAF50;
        box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
      }

      .dot-inactive {
        background: var(--vpc-text-secondary);
        opacity: 0.3;
      }

      /* ============================================
         OVERVIEW: WARNINGS
         ============================================ */
      .warning-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .warning-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 12px;
        background: rgba(255, 152, 0, 0.08);
        border: 1px solid rgba(255, 152, 0, 0.15);
        font-size: 13px;
        font-weight: 500;
        color: #ef6c00;
      }

      .warning-row ha-icon {
        --mdc-icon-size: 18px;
        color: #ef6c00;
        flex-shrink: 0;
      }

      .all-ok-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px;
        border-radius: 12px;
        background: rgba(76, 175, 80, 0.08);
        border: 1px solid rgba(76, 175, 80, 0.15);
        color: #2e7d32;
        font-weight: 500;
        font-size: 14px;
      }

      .all-ok-display ha-icon {
        --mdc-icon-size: 20px;
        color: #2e7d32;
      }

      /* ============================================
         COMPACT CARD
         ============================================ */
      ha-card.compact-card {
        padding: 12px 16px;
      }

      .compact-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.04);
        flex-shrink: 0;
        transition: var(--vpc-transition);
      }

      .compact-icon-active {
        background: rgba(var(--rgb-primary-color, 33,150,243), 0.1);
      }

      .compact-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .compact-icon ha-icon.active {
        color: var(--vpc-primary);
      }

      .compact-icon ha-icon.inactive {
        color: var(--vpc-text-secondary);
        opacity: 0.5;
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
      }

      .compact-value {
        font-weight: 600;
        color: var(--vpc-text);
      }

      .compact-detail {
        color: var(--vpc-text-secondary);
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
      }

      ha-card.size-small .header-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }

      ha-card.size-small .name {
        font-size: 14px;
      }

      ha-card.size-small .temp-hero-value {
        font-size: 32px;
      }

      ha-card.size-large {
        --vpc-spacing: 24px;
        --vpc-icon-size: 28px;
      }

      ha-card.size-large .header-icon {
        width: 52px;
        height: 52px;
        border-radius: 16px;
      }

      ha-card.size-large .name {
        font-size: 18px;
      }

      ha-card.size-large .temp-hero-value {
        font-size: 52px;
      }

      ha-card.size-fullscreen {
        --vpc-spacing: 32px;
        --vpc-icon-size: 32px;
        height: 100%;
        min-height: 80vh;
      }

      ha-card.size-fullscreen .header-icon {
        width: 56px;
        height: 56px;
        border-radius: 18px;
      }

      ha-card.size-fullscreen .name {
        font-size: 20px;
      }

      ha-card.size-fullscreen .temp-hero-value {
        font-size: 64px;
      }

      /* ============================================
         ANIMATION VARIANTS
         ============================================ */
      ha-card.animation-subtle {
        transition: all 0.2s ease;
      }

      ha-card.animation-subtle:hover {
        transform: translateY(-1px);
      }

      ha-card.animation-smooth {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      }

      ha-card.animation-energetic {
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      ha-card.animation-energetic:hover {
        transform: translateY(-3px) scale(1.005);
      }

      /* Flow animation for active state */
      @keyframes flow-gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      ha-card.flow-active .accent-bar {
        background: linear-gradient(90deg,
          var(--card-accent),
          color-mix(in srgb, var(--card-accent) 60%, white),
          var(--card-accent)
        );
        background-size: 200% 100%;
        animation: flow-gradient 3s ease-in-out infinite;
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
          padding: 10px 6px;
        }

        .chemistry-val {
          font-size: 14px;
        }

        .system-grid {
          grid-template-columns: 1fr;
        }

        .temp-hero-value {
          font-size: 36px;
        }

        .dosing-current-value {
          font-size: 28px;
        }
      }
    `}getCardSize(){switch(this.config?.card_type){case"compact":return 1;case"overview":return 5;default:return 3}}static getStubConfig(){return{type:"custom:violet-pool-card",entity_prefix:"violet_pool",entity:"switch.violet_pool_pump",card_type:"pump"}}static async getConfigElement(){return await Promise.resolve().then(function(){return Et}),document.createElement("violet-pool-card-editor")}};t([pt({attribute:!1})],At.prototype,"hass",void 0),t([ut()],At.prototype,"config",void 0),At=t([lt("violet-pool-card")],At),window.customCards=window.customCards||[],window.customCards.push({type:"violet-pool-card",name:"Violet Pool Card",description:"Premium card for Violet Pool Controller with glassmorphism design",preview:!0});let St=class extends nt{setConfig(t){this._config=t}render(){return this.hass&&this._config?B`
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
            @closed="${t=>t.stopPropagation()}"
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
              ${["small","medium","large","fullscreen"].map(t=>B`
                  <button
                    class="size-button ${this._config.size===t?"active":""}"
                    @click="${()=>this._sizeChanged(t)}"
                  >
                    <div class="size-preview size-${t}"></div>
                    <span>${this._formatSizeName(t)}</span>
                  </button>
                `)}
            </div>
          </div>

          <!-- Theme Picker -->
          <div class="picker-container">
            <label>Theme Style</label>
            <div class="theme-picker">
              ${[{value:"luxury",icon:"🌟",label:"Luxury",desc:"Glassmorphism"},{value:"modern",icon:"🎯",label:"Modern",desc:"Clean & Minimal"},{value:"minimalist",icon:"⚪",label:"Minimalist",desc:"Ultra Clean"},{value:"glass",icon:"💎",label:"Glass",desc:"Pure Glass"},{value:"neon",icon:"⚡",label:"Neon",desc:"RGB Glow"},{value:"premium",icon:"👑",label:"Premium",desc:"Gradient Shine"}].map(t=>B`
                  <button
                    class="theme-button ${this._config.theme===t.value?"active":""}"
                    @click="${()=>this._themeChanged(t.value)}"
                  >
                    <div class="theme-preview theme-${t.value}">
                      <span class="theme-icon">${t.icon}</span>
                    </div>
                    <div class="theme-info">
                      <span class="theme-label">${t.label}</span>
                      <span class="theme-desc">${t.desc}</span>
                    </div>
                  </button>
                `)}
            </div>
          </div>

          <!-- Animation Picker -->
          <div class="picker-container">
            <label>Animation Level</label>
            <div class="animation-picker">
              ${[{value:"none",icon:"⏸️",label:"None",desc:"Static"},{value:"subtle",icon:"🌙",label:"Subtle",desc:"Professional"},{value:"smooth",icon:"✨",label:"Smooth",desc:"Balanced"},{value:"energetic",icon:"🚀",label:"Energetic",desc:"Dynamic"}].map(t=>B`
                  <button
                    class="animation-button ${this._config.animation===t.value?"active":""}"
                    @click="${()=>this._animationChanged(t.value)}"
                  >
                    <span class="anim-icon">${t.icon}</span>
                    <div class="anim-info">
                      <span class="anim-label">${t.label}</span>
                      <span class="anim-desc">${t.desc}</span>
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
                  @closed="${t=>t.stopPropagation()}"
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
    `:B``}_formatSizeName(t){return{small:"Small",medium:"Medium",large:"Large",fullscreen:"Fullscreen"}[t]||t}_cardTypeChanged(t){const e=t.target;this._config.card_type!==e.value&&(this._config={...this._config,card_type:e.value},this._fireConfigChanged())}_entityPrefixChanged(t){const e=t.target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g,"_");this._config.entity_prefix!==e&&(this._config={...this._config,entity_prefix:e||"violet_pool"},this._fireConfigChanged())}_entityChanged(t){const e=t.detail;this._config.entity!==e.value&&(this._config={...this._config,entity:e.value},this._fireConfigChanged())}_sizeChanged(t){this._config={...this._config,size:t},this._fireConfigChanged()}_themeChanged(t){this._config={...this._config,theme:t},this._fireConfigChanged()}_animationChanged(t){this._config={...this._config,animation:t},this._fireConfigChanged()}_nameChanged(t){const e=t.target;this._config={...this._config,name:e.value||void 0},this._fireConfigChanged()}_iconChanged(t){this._config={...this._config,icon:t.detail.value||void 0},this._fireConfigChanged()}_showStateChanged(t){const e=t.target;this._config={...this._config,show_state:e.checked},this._fireConfigChanged()}_showDetailStatusChanged(t){const e=t.target;this._config={...this._config,show_detail_status:e.checked},this._fireConfigChanged()}_showControlsChanged(t){const e=t.target;this._config={...this._config,show_controls:e.checked},this._fireConfigChanged()}_showRuntimeChanged(t){const e=t.target;this._config={...this._config,show_runtime:e.checked},this._fireConfigChanged()}_showHistoryChanged(t){const e=t.target;this._config={...this._config,show_history:e.checked},this._fireConfigChanged()}_dosingTypeChanged(t){const e=t.target;this._config={...this._config,dosing_type:e.value},this._fireConfigChanged()}_accentColorChanged(t){const e=t.target;this._config={...this._config,accent_color:e.value||void 0},this._fireConfigChanged()}_iconColorChanged(t){const e=t.target;this._config={...this._config,icon_color:e.value||void 0},this._fireConfigChanged()}_blurIntensityChanged(t){const e=t.target;this._config={...this._config,blur_intensity:parseInt(e.value)||10},this._fireConfigChanged()}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)}static get styles(){return r`
      .card-config{display:flex;flex-direction:column;gap:16px;padding:16px}
      .config-section{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#e0e0e0);border-radius:12px;padding:16px}
      .section-header{display:flex;align-items:center;gap:8px;margin-bottom:16px;font-weight:600;font-size:14px;color:var(--primary-text-color)}
      .section-header ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}
      .prefix-info{display:flex;align-items:flex-start;gap:8px;padding:12px;margin-top:12px;background:rgba(var(--rgb-primary-color,33,150,243),0.1);border-radius:8px;font-size:12px;color:var(--secondary-text-color);line-height:1.4}
      .prefix-info ha-icon{--mdc-icon-size:18px;color:var(--primary-color);flex-shrink:0;margin-top:2px}
      .premium-section{background:linear-gradient(135deg,rgba(102,126,234,0.05) 0%,rgba(118,75,162,0.05) 100%);border:2px solid rgba(102,126,234,0.2)}
      .premium-header{color:#667eea}
      .picker-container{margin-bottom:24px}
      .picker-container>label{display:block;font-weight:500;margin-bottom:12px;color:var(--primary-text-color)}
      .size-picker,.animation-picker{display:grid;gap:8px}
      .size-picker{grid-template-columns:repeat(4,1fr)}
      .theme-picker,.animation-picker{grid-template-columns:repeat(2,1fr)}
      .theme-picker{gap:12px}
      .size-button,.theme-button,.animation-button{display:flex;align-items:center;gap:12px;padding:12px;background:var(--secondary-background-color);border:2px solid var(--divider-color);border-radius:8px;cursor:pointer;transition:all 0.2s}
      .size-button{flex-direction:column;gap:8px}
      .theme-button{border-radius:12px;text-align:left}
      .size-button:hover,.theme-button:hover,.animation-button:hover{border-color:var(--primary-color)}
      .theme-button:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.1)}
      .size-button.active,.theme-button.active,.animation-button.active{border-color:var(--primary-color);background:rgba(var(--rgb-primary-color,33,150,243),0.1)}
      .size-button.active{background:var(--primary-color);color:white}
      .theme-button.active{box-shadow:0 0 0 3px rgba(var(--rgb-primary-color,33,150,243),0.2)}
      .size-preview{width:40px;height:30px;background:currentColor;border-radius:4px;opacity:0.3}
      .size-preview.size-small{width:25px;height:20px}
      .size-preview.size-medium{width:35px;height:25px}
      .size-preview.size-large{width:45px;height:32px}
      .size-preview.size-fullscreen{width:50px;height:38px}
      .size-button.active .size-preview{opacity:1}
      .size-button span{font-size:11px;font-weight:500}
      .theme-preview{width:48px;height:48px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px}
      .theme-preview.theme-luxury{background:linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,255,255,0.85));border:1px solid rgba(255,255,255,0.6)}
      .theme-preview.theme-modern{background:var(--card-background-color);border:1px solid var(--divider-color)}
      .theme-preview.theme-minimalist{background:var(--card-background-color);box-shadow:0 1px 3px rgba(0,0,0,0.1)}
      .theme-preview.theme-glass{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
      .theme-preview.theme-neon{background:linear-gradient(135deg,#0f0c29,#302b63);border:2px solid #2196f3;box-shadow:0 0 20px rgba(33,150,243,0.4)}
      .theme-preview.theme-premium{background:linear-gradient(135deg,#667eea,#764ba2)}
      .theme-info,.anim-info{display:flex;flex-direction:column;gap:2px}
      .theme-label,.anim-label{font-weight:600;color:var(--primary-text-color)}
      .theme-label{font-size:13px}
      .anim-label{font-size:12px}
      .theme-desc,.anim-desc{color:var(--secondary-text-color)}
      .theme-desc{font-size:11px}
      .anim-desc{font-size:10px}
      .anim-icon{font-size:20px}
      .advanced-section{background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;padding:12px}
      .advanced-section summary{display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;font-size:14px;color:var(--primary-text-color);list-style:none}
      .advanced-section summary::-webkit-details-marker{display:none}
      .advanced-section summary ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}
      .advanced-content{display:flex;flex-direction:column;gap:12px;margin-top:16px}
      ha-select,ha-textfield,ha-entity-picker,ha-icon-picker{width:100%}
      ha-formfield{display:flex;align-items:center;margin-bottom:12px}
    `}};t([pt({attribute:!1})],St.prototype,"hass",void 0),t([ut()],St.prototype,"_config",void 0),St=t([lt("violet-pool-card-editor")],St);var Et=Object.freeze({__proto__:null,get VioletPoolCardEditor(){return St}});export{At as VioletPoolCard};
