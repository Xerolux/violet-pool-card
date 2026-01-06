function t(t,e,i,s){var a,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(n=(o<3?a(n):o>3?a(e,i,n):a(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),a=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=a.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,g=m.trustedTypes,v=g?g.emptyScript:"",f=m.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!c(t,e),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);a?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),a=e.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=a.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const o=this.constructor;if(!1===s&&(a=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??x)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==a||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,f?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,C=t=>t,k=$.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+E,P=`<${T}>`,z=document,F=()=>z.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,D="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,N=/>/g,R=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,L=/"/g,V=/^(?:script|style|textarea|title)$/i,q=(t,...e)=>({_$litType$:1,strings:t,values:e}),B=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),W=new WeakMap,G=z.createTreeWalker(z,129);function Y(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let a,o=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<i;e++){const i=t[e];let r,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===H?"!--"===c[1]?n=U:void 0!==c[1]?n=N:void 0!==c[2]?(V.test(c[2])&&(a=RegExp("</"+c[2],"g")),n=R):void 0!==c[3]&&(n=R):n===R?">"===c[0]?(n=a??H,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,r=c[1],n=void 0===c[3]?R:'"'===c[3]?L:I):n===L||n===I?n=R:n===U||n===N?n=H:(n=R,a=void 0);const p=n===R&&t[e+1].startsWith("/>")?" ":"";o+=n===H?i+P:l>=0?(s.push(r),i.slice(0,l)+A+i.slice(l)+E+p):i+E+(-2===l?e:p)}return[Y(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,o=0;const n=t.length-1,r=this.parts,[c,l]=K(t,e);if(this.el=Z.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&r.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=l[o++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);r.push({type:1,index:a,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(E)&&(r.push({type:6,index:a}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],F()),G.nextNode(),r.push({type:2,index:++a});s.append(t[e],F())}}}else if(8===s.nodeType)if(s.data===T)r.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)r.push({type:7,index:a}),t+=E.length-1}a++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===B)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=J(t,a._$AS(t,e.values),a,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);G.currentNode=s;let a=G.nextNode(),o=0,n=0,r=i[0];for(;void 0!==r;){if(o===r.index){let e;2===r.type?e=new Q(a,a.nextSibling,this,t):1===r.type?e=new r.ctor(a,r.name,r.strings,this,t):6===r.type&&(e=new at(a,this,t)),this._$AV.push(e),r=i[++n]}o!==r?.index&&(a=G.nextNode(),o++)}return G.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),O(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Z(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new Q(this.O(F()),this.O(F()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=C(t).nextSibling;C(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,s){const a=this.strings;let o=!1;if(void 0===a)t=J(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let n,r;for(t=a[0],n=0;n<a.length-1;n++)r=J(this,s[i+n],e,n),r===B&&(r=this._$AH[n]),o||=!O(r)||r!==this._$AH[n],r===j?t=j:t!==j&&(t+=(r??"")+a[n+1]),this._$AH[n]=r}o&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class st extends tt{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??j)===B)return;const i=this._$AH,s=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const ot=$.litHtmlPolyfillSupport;ot?.(Z,Q),($.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;class rt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new Q(e.insertBefore(F(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const ct=nt.litElementPolyfillSupport;ct?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:x},pt=(t=dt,e,i)=>{const{kind:s,metadata:a}=i;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const a=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,a,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const a=this[s];e.call(this,i),this.requestUpdate(s,a,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return ht({...t,state:!0,attribute:!1})}const mt={off:{color:"#757575",icon:"mdi:power-off",label:"OFF"},on:{color:"#4CAF50",icon:"mdi:power-on",label:"ON"},auto:{color:"#2196F3",icon:"mdi:autorenew",label:"AUTO"},manual:{color:"#FF9800",icon:"mdi:hand-back-right",label:"MANUAL"},blocked:{color:"#FFC107",icon:"mdi:block-helper",label:"BLOCKED"},error:{color:"#F44336",icon:"mdi:alert-circle",label:"ERROR"},idle:{color:"#9E9E9E",icon:"mdi:sleep",label:"IDLE"},heat:{color:"#FF5722",icon:"mdi:fire",label:"HEAT"},heating:{color:"#FF5722",icon:"mdi:fire",label:"HEATING"},cool:{color:"#00BCD4",icon:"mdi:snowflake",label:"COOL"},cooling:{color:"#00BCD4",icon:"mdi:snowflake",label:"COOLING"}};let gt=class extends rt{constructor(){super(...arguments),this.pulse=!1,this.showIcon=!0}render(){const t=mt[this.state]||mt.off,e=this.label||t.label,i=this.icon||t.icon;return q`
      <div
        class="badge ${this.state} ${this.pulse?"pulse":""}"
        style="--badge-color: ${t.color}"
      >
        ${this.showIcon?q`<ha-icon icon="${i}"></ha-icon>`:""}
        <span class="label">${e}</span>
      </div>
    `}static get styles(){return n`
      :host {
        display: inline-block;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 16px;
        background: var(--badge-color);
        color: white;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }

      .badge:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
      }

      .badge ha-icon {
        --mdc-icon-size: 16px;
        display: flex;
        align-items: center;
      }

      .label {
        line-height: 1;
      }

      /* Pulse animation for active/warning states */
      .badge.pulse {
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.85;
          transform: scale(1.02);
        }
      }

      /* Rotate animation for auto state */
      .badge.auto ha-icon {
        animation: rotate 3s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Breathing animation for heating/cooling */
      .badge.heating,
      .badge.cooling {
        animation: breathe 2s ease-in-out infinite;
      }

      @keyframes breathe {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}};t([ht()],gt.prototype,"state",void 0),t([ht()],gt.prototype,"label",void 0),t([ht()],gt.prototype,"icon",void 0),t([ht({type:Boolean})],gt.prototype,"pulse",void 0),t([ht({type:Boolean})],gt.prototype,"showIcon",void 0),gt=t([lt("status-badge")],gt);const vt={normal:{color:"#4CAF50",icon:"mdi:check-circle"},ok:{color:"#4CAF50",icon:"mdi:check-circle"},low:{color:"#2196F3",icon:"mdi:arrow-down-circle"},high:{color:"#FF9800",icon:"mdi:arrow-up-circle"},critical:{color:"#F44336",icon:"mdi:alert-circle"},warning:{color:"#FF9800",icon:"mdi:alert"},error:{color:"#F44336",icon:"mdi:close-circle"}};let ft=class extends rt{constructor(){super(...arguments),this.unit="",this.label="",this.status="normal",this.decimals=1,this.showStatus=!0,this.showRange=!1,this.large=!1}formatValue(t){return null==t?"--":t.toFixed(this.decimals)}getStatusFromValue(){return void 0===this.value||null===this.value?"normal":"normal"!==this.status?this.status:void 0!==this.min&&this.value<this.min?this.value<.9*this.min?"critical":"low":void 0!==this.max&&this.value>this.max?this.value>1.1*this.max?"critical":"high":"normal"}render(){const t=this.getStatusFromValue(),e=vt[t];return q`
      <div class="value-display ${this.large?"large":""}">
        ${this.label?q`<div class="label">${this.label}</div>`:""}

        <div class="value-container">
          <div class="value" style="color: ${e.color}">
            ${this.formatValue(this.value)}
            ${this.unit?q`<span class="unit">${this.unit}</span>`:""}
          </div>

          ${this.showStatus?q`
                <ha-icon
                  icon="${e.icon}"
                  style="color: ${e.color}"
                ></ha-icon>
              `:""}
        </div>

        ${void 0!==this.target?q`
              <div class="target">
                → ${this.formatValue(this.target)}${this.unit}
              </div>
            `:""}

        ${!this.showRange||void 0===this.min&&void 0===this.max?"":q`
              <div class="range">
                ${void 0!==this.min?q`<span class="range-min">Min: ${this.formatValue(this.min)}${this.unit}</span>`:""}
                ${void 0!==this.max?q`<span class="range-max">Max: ${this.formatValue(this.max)}${this.unit}</span>`:""}
              </div>
            `}
      </div>
    `}static get styles(){return n`
      :host {
        display: block;
      }

      .value-display {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .value-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .value {
        font-size: 24px;
        font-weight: 700;
        line-height: 1;
        color: var(--primary-text-color);
        display: flex;
        align-items: baseline;
        gap: 4px;
      }

      .value-display.large .value {
        font-size: 32px;
        font-weight: 800;
      }

      .unit {
        font-size: 16px;
        font-weight: 500;
        opacity: 0.8;
      }

      .value-display.large .unit {
        font-size: 20px;
      }

      ha-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }

      .target {
        font-size: 14px;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .range {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: var(--disabled-text-color);
        margin-top: 4px;
      }

      .range-min::before {
        content: '▼ ';
        color: var(--info-color, #2196F3);
      }

      .range-max::before {
        content: '▲ ';
        color: var(--warning-color, #FF9800);
      }
    `}};t([ht({type:Number})],ft.prototype,"value",void 0),t([ht()],ft.prototype,"unit",void 0),t([ht()],ft.prototype,"label",void 0),t([ht()],ft.prototype,"status",void 0),t([ht({type:Number})],ft.prototype,"min",void 0),t([ht({type:Number})],ft.prototype,"max",void 0),t([ht({type:Number})],ft.prototype,"target",void 0),t([ht({type:Number})],ft.prototype,"decimals",void 0),t([ht({type:Boolean})],ft.prototype,"showStatus",void 0),t([ht({type:Boolean})],ft.prototype,"showRange",void 0),t([ht({type:Boolean})],ft.prototype,"large",void 0),ft=t([lt("value-display")],ft);let bt=class extends rt{constructor(){super(...arguments),this.compact=!1}parsePipeSeparated(t){if(!t||"string"!=typeof t)return{status:""};const e=t.split("|");if(2===e.length){const t=parseInt(e[0],10),i=this.formatStatusText(e[1]);return{level:isNaN(t)?void 0:t,status:i}}return{status:this.formatStatusText(t)}}formatStatusText(t){return t?t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "):""}parseArray(t){return Array.isArray(t)?t.map(t=>this.formatStatusText(t)).filter(t=>t):[]}getIconForStatus(t){const e=t.toLowerCase();return e.includes("freeze")||e.includes("frost")?"mdi:snowflake-alert":e.includes("blocked")||e.includes("block")?"mdi:block-helper":e.includes("threshold")||e.includes("limit")?"mdi:speedometer":e.includes("temp")?"mdi:thermometer-alert":e.includes("error")?"mdi:alert-circle":e.includes("ok")||e.includes("normal")?"mdi:check-circle":"mdi:information"}getColorForStatus(t){const e=t.toLowerCase();return e.includes("error")||e.includes("critical")?"var(--error-color, #F44336)":e.includes("blocked")||e.includes("freeze")?"var(--warning-color, #FF9800)":e.includes("ok")||e.includes("normal")?"var(--success-color, #4CAF50)":"var(--info-color, #2196F3)"}render(){if(!this.raw)return q``;if(Array.isArray(this.raw)){const t=this.parseArray(this.raw);return 0===t.length?q``:q`
        <div class="detail-status-list ${this.compact?"compact":""}">
          ${t.map(t=>q`
              <div class="status-item" style="color: ${this.getColorForStatus(t)}">
                <ha-icon icon="${this.icon||this.getIconForStatus(t)}"></ha-icon>
                <span class="status-text">${t}</span>
              </div>
            `)}
        </div>
      `}const t=this.parsePipeSeparated(this.raw);if(!t.status)return q``;const e=this.getColorForStatus(t.status),i=this.icon||this.getIconForStatus(t.status);return q`
      <div class="detail-status ${this.compact?"compact":""}" style="color: ${e}">
        <ha-icon icon="${i}"></ha-icon>
        <div class="status-content">
          ${void 0!==t.level?q`<span class="level">Level ${t.level}:</span>`:""}
          <span class="status-text">${t.status}</span>
        </div>
      </div>
    `}static get styles(){return n`
      :host {
        display: block;
      }

      .detail-status {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        border-left: 3px solid currentColor;
        font-size: 14px;
        line-height: 1.4;
      }

      .detail-status.compact {
        padding: 4px 8px;
        font-size: 12px;
      }

      .detail-status ha-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }

      .detail-status.compact ha-icon {
        --mdc-icon-size: 16px;
      }

      .status-content {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
        flex: 1;
      }

      .level {
        font-weight: 600;
        opacity: 0.9;
      }

      .status-text {
        font-weight: 500;
      }

      /* List styles for array input */
      .detail-status-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .detail-status-list.compact {
        gap: 4px;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: var(--card-background-color);
        border-radius: 6px;
        border-left: 2px solid currentColor;
        font-size: 13px;
      }

      .detail-status-list.compact .status-item {
        padding: 4px 8px;
        font-size: 11px;
      }

      .status-item ha-icon {
        --mdc-icon-size: 16px;
        flex-shrink: 0;
      }

      .detail-status-list.compact .status-item ha-icon {
        --mdc-icon-size: 14px;
      }

      .status-item .status-text {
        font-weight: 500;
      }
    `}};t([ht()],bt.prototype,"raw",void 0),t([ht()],bt.prototype,"icon",void 0),t([ht({type:Boolean})],bt.prototype,"compact",void 0),bt=t([lt("detail-status")],bt);const yt={info:{color:"#2196F3",backgroundColor:"rgba(33, 150, 243, 0.1)",icon:"mdi:information"},warning:{color:"#FF9800",backgroundColor:"rgba(255, 152, 0, 0.1)",icon:"mdi:alert"},error:{color:"#F44336",backgroundColor:"rgba(244, 67, 54, 0.1)",icon:"mdi:alert-circle"},success:{color:"#4CAF50",backgroundColor:"rgba(76, 175, 80, 0.1)",icon:"mdi:check-circle"}};let xt=class extends rt{constructor(){super(...arguments),this.warnings=[],this.defaultType="warning",this.dismissable=!1,this.dismissedWarnings=new Set}normalizeWarnings(){return this.warnings.map(t=>"string"==typeof t?{text:this.formatWarningText(t),type:this.getWarningType(t),dismissable:this.dismissable}:{...t,text:this.formatWarningText(t.text),type:t.type||this.defaultType,dismissable:void 0!==t.dismissable?t.dismissable:this.dismissable})}formatWarningText(t){return t?t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "):""}getWarningType(t){const e=t.toLowerCase();return e.includes("error")||e.includes("critical")||e.includes("failed")?"error":e.includes("blocked")||e.includes("threshold")||e.includes("limit")?"warning":e.includes("ok")||e.includes("success")||e.includes("complete")?"success":"info"}handleDismiss(t){this.dismissedWarnings.add(t.text),this.requestUpdate(),this.dispatchEvent(new CustomEvent("warning-dismissed",{detail:{warning:t},bubbles:!0,composed:!0}))}isDismissed(t){return this.dismissedWarnings.has(t.text)}render(){const t=this.normalizeWarnings().filter(t=>!this.isDismissed(t));return 0===t.length?q``:q`
      <div class="warning-chips">
        ${t.map(t=>this.renderChip(t))}
      </div>
    `}renderChip(t){const e=t.type||this.defaultType,i=yt[e],s=t.icon||i.icon;return q`
      <div
        class="chip ${e}"
        style="
          --chip-color: ${i.color};
          --chip-bg: ${i.backgroundColor};
        "
      >
        <ha-icon icon="${s}"></ha-icon>
        <span class="chip-text">${t.text}</span>
        ${t.dismissable?q`
              <button
                class="dismiss-button"
                @click="${()=>this.handleDismiss(t)}"
                title="Dismiss"
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            `:""}
      </div>
    `}static get styles(){return n`
      :host {
        display: block;
      }

      .warning-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 16px;
        background: var(--chip-bg);
        color: var(--chip-color);
        font-size: 13px;
        font-weight: 500;
        line-height: 1.2;
        border: 1px solid var(--chip-color);
        transition: all 0.2s ease;
      }

      .chip:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .chip ha-icon {
        --mdc-icon-size: 16px;
        flex-shrink: 0;
      }

      .chip-text {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .dismiss-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        border: none;
        background: none;
        color: var(--chip-color);
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }

      .dismiss-button:hover {
        opacity: 1;
      }

      .dismiss-button ha-icon {
        --mdc-icon-size: 14px;
      }

      /* Pulse animation for error chips */
      .chip.error {
        animation: pulse-error 2s ease-in-out infinite;
      }

      @keyframes pulse-error {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.85;
        }
      }

      /* Responsive: Stack chips on small screens */
      @media (max-width: 600px) {
        .warning-chips {
          flex-direction: column;
        }

        .chip {
          width: 100%;
          box-sizing: border-box;
        }

        .chip-text {
          white-space: normal;
          overflow: visible;
        }
      }
    `}};t([ht({type:Array})],xt.prototype,"warnings",void 0),t([ht()],xt.prototype,"defaultType",void 0),t([ht({type:Boolean})],xt.prototype,"dismissable",void 0),t([ut()],xt.prototype,"dismissedWarnings",void 0),xt=t([lt("warning-chips")],xt);let _t=class extends rt{constructor(){super(...arguments),this.min=0,this.max=100,this.step=1,this.value=0,this.unit="",this.label="",this.disabled=!1,this.vertical=!1,this.showValue=!0,this.showMinMax=!1,this.isDragging=!1,this.localValue=0,this.debounceDelay=300}connectedCallback(){super.connectedCallback(),this.localValue=this.value}updated(t){t.has("value")&&!this.isDragging&&(this.localValue=this.value)}handleInput(t){const e=Number(t.target.value);this.localValue=e,this.isDragging=!0,this.dispatchEvent(new CustomEvent("slider-input",{detail:{value:e},bubbles:!0,composed:!0}))}handleChange(t){const e=Number(t.target.value);this.localValue=e,this.isDragging=!1,this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=window.setTimeout(()=>{this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))},this.debounceDelay)}handleStart(){this.isDragging=!0}handleEnd(){this.isDragging=!1}getLabelForValue(t){if(!this.labels||0===this.labels.length)return"";if("string"==typeof this.labels[0]){const e=Math.round((t-this.min)/this.step);return this.labels[e]||""}const e=this.labels.find(e=>e.value===t);return e?e.label:""}getAllLabels(){if(!this.labels||0===this.labels.length)return[];const t=this.max-this.min;return"string"==typeof this.labels[0]?this.labels.map((e,i)=>{const s=this.min+i*this.step;return{value:s,label:e,position:(s-this.min)/t*100}}):this.labels.map(e=>{const i=(e.value-this.min)/t*100;return{value:e.value,label:e.label,position:i}})}formatValue(t){const e=this.getLabelForValue(t);if(e)return e;const i=this.step<1?1:0;return`${t.toFixed(i)}${this.unit}`}render(){const t=(this.localValue-this.min)/(this.max-this.min)*100,e=this.getAllLabels();return q`
      <div class="slider-container ${this.vertical?"vertical":""} ${this.disabled?"disabled":""}">
        ${this.label?q`<div class="slider-label">${this.label}</div>`:""}

        ${this.showValue?q`
              <div class="value-display ${this.isDragging?"dragging":""}">
                ${this.formatValue(this.localValue)}
              </div>
            `:""}

        <div class="slider-wrapper">
          ${this.showMinMax?q`<span class="min-max-label">${this.formatValue(this.min)}</span>`:""}

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

          ${this.showMinMax?q`<span class="min-max-label">${this.formatValue(this.max)}</span>`:""}
        </div>

        ${e.length>0?q`
              <div class="labels">
                ${e.map(t=>q`
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
    `}static get styles(){return n`
      :host {
        display: block;
      }

      .slider-container {
        width: 100%;
        user-select: none;
      }

      .slider-container.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .slider-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }

      .value-display {
        text-align: center;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 12px;
        color: var(--primary-text-color);
        transition: all 0.2s ease;
      }

      .value-display.dragging {
        color: var(--primary-color);
        transform: scale(1.05);
      }

      .slider-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
      }

      .min-max-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 40px;
        text-align: center;
      }

      .slider-track-wrapper {
        flex: 1;
        position: relative;
      }

      /* Slider input styling */
      .slider {
        width: 100%;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: linear-gradient(
          to right,
          var(--primary-color) 0%,
          var(--primary-color) var(--percentage),
          var(--disabled-color, #e0e0e0) var(--percentage),
          var(--disabled-color, #e0e0e0) 100%
        );
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .slider:hover {
        opacity: 0.9;
      }

      .slider:disabled {
        cursor: not-allowed;
      }

      /* Webkit (Chrome, Safari, Edge) */
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        border: 3px solid white;
      }

      .slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
      }

      .slider:active::-webkit-slider-thumb {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      /* Firefox */
      .slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
      }

      .slider::-moz-range-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
      }

      .slider:active::-moz-range-thumb {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      /* Firefox track */
      .slider::-moz-range-track {
        background: transparent;
        border: none;
      }

      /* Labels */
      .labels {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      .label-item {
        position: absolute;
        transform: translateX(-50%);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .label-item:hover {
        background: var(--divider-color, rgba(0, 0, 0, 0.05));
        color: var(--primary-text-color);
      }

      .label-item.active {
        font-weight: 600;
        color: var(--primary-color);
      }

      /* Vertical mode */
      .slider-container.vertical .slider {
        transform: rotate(-90deg);
        transform-origin: left center;
      }

      /* Touch optimization */
      @media (pointer: coarse) {
        .slider::-webkit-slider-thumb {
          width: 28px;
          height: 28px;
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
        }
      }
    `}};t([ht({type:Number})],_t.prototype,"min",void 0),t([ht({type:Number})],_t.prototype,"max",void 0),t([ht({type:Number})],_t.prototype,"step",void 0),t([ht({type:Number})],_t.prototype,"value",void 0),t([ht()],_t.prototype,"unit",void 0),t([ht()],_t.prototype,"label",void 0),t([ht({type:Array})],_t.prototype,"labels",void 0),t([ht({type:Boolean})],_t.prototype,"disabled",void 0),t([ht({type:Boolean})],_t.prototype,"vertical",void 0),t([ht({type:Boolean})],_t.prototype,"showValue",void 0),t([ht({type:Boolean})],_t.prototype,"showMinMax",void 0),t([ut()],_t.prototype,"isDragging",void 0),t([ut()],_t.prototype,"localValue",void 0),_t=t([lt("slider-control")],_t);let wt=class extends rt{constructor(){super(...arguments),this.actions=[],this.vertical=!1,this.compact=!1,this.loadingStates=new Map}async handleActionClick(t,e){if(!t.disabled&&!this.loadingStates.get(e)){if(t.confirmMessage&&!await this.showConfirmation(t.confirmMessage))return;this.loadingStates.set(e,!0),this.requestUpdate();try{await t.action(),this.dispatchEvent(new CustomEvent("action-executed",{detail:{action:t,index:e},bubbles:!0,composed:!0}))}catch(i){this.dispatchEvent(new CustomEvent("action-error",{detail:{action:t,index:e,error:i},bubbles:!0,composed:!0}))}finally{this.loadingStates.set(e,!1),this.requestUpdate()}}}async showConfirmation(t){return confirm(t)}renderAction(t,e){const i=this.loadingStates.get(e)||t.loading,s=t.disabled||i;return q`
      <button
        class="quick-action ${t.active?"active":""} ${s?"disabled":""} ${i?"loading":""}"
        @click="${()=>this.handleActionClick(t,e)}"
        ?disabled="${s}"
        style="${t.color?`--action-color: ${t.color}`:""}"
        title="${t.label}"
      >
        <div class="action-content">
          ${i?q`<ha-icon icon="mdi:loading" class="spin"></ha-icon>`:q`<ha-icon icon="${t.icon}"></ha-icon>`}
          ${this.compact?"":q`<span class="action-label">${t.label}</span>`}
        </div>
      </button>
    `}render(){return 0===this.actions.length?q``:q`
      <div class="quick-actions ${this.vertical?"vertical":""} ${this.compact?"compact":""}">
        ${this.actions.map((t,e)=>this.renderAction(t,e))}
      </div>
    `}static get styles(){return n`
      :host {
        display: block;
      }

      .quick-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .quick-actions.vertical {
        flex-direction: column;
      }

      .quick-actions.compact {
        gap: 4px;
      }

      .quick-action {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        background: var(--card-background-color, #fff);
        border: 2px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .quick-actions.compact .quick-action {
        padding: 10px;
        min-width: 48px;
        min-height: 48px;
      }

      .quick-action:hover:not(.disabled) {
        background: var(--divider-color, rgba(0, 0, 0, 0.05));
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .quick-action:active:not(.disabled) {
        transform: translateY(0);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }

      .quick-action.active {
        background: var(--action-color, var(--primary-color));
        border-color: var(--action-color, var(--primary-color));
        color: white;
      }

      .quick-action.active:hover:not(.disabled) {
        background: var(--action-color, var(--primary-color));
        opacity: 0.9;
      }

      .quick-action.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .quick-action.loading {
        pointer-events: none;
      }

      .action-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
      }

      .quick-actions.compact .action-content {
        gap: 0;
      }

      .quick-action ha-icon {
        --mdc-icon-size: 20px;
        flex-shrink: 0;
      }

      .quick-actions.compact .quick-action ha-icon {
        --mdc-icon-size: 24px;
      }

      .action-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Loading animation */
      .spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* Ripple effect on click */
      .quick-action::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .quick-action:active:not(.disabled)::before {
        width: 200%;
        height: 200%;
      }

      /* Touch optimization */
      @media (pointer: coarse) {
        .quick-action {
          min-height: 48px;
        }
      }

      /* Responsive: Stack vertically on small screens */
      @media (max-width: 600px) {
        .quick-actions:not(.vertical) {
          flex-direction: column;
        }

        .quick-action {
          width: 100%;
        }
      }
    `}};t([ht({type:Array})],wt.prototype,"actions",void 0),t([ht({type:Boolean})],wt.prototype,"vertical",void 0),t([ht({type:Boolean})],wt.prototype,"compact",void 0),t([ut()],wt.prototype,"loadingStates",void 0),wt=t([lt("quick-actions")],wt);class $t{constructor(t){this.hass=t}showToast(t,e=3e3){const i=new CustomEvent("hass-notification",{detail:{message:t,duration:e},bubbles:!0,composed:!0});window.dispatchEvent(i)}async callService(t,e,i){try{return await this.hass.callService(t,e,i),{success:!0}}catch(t){const e=t instanceof Error?t.message:String(t);return this.showToast(`Error: ${e}`,5e3),{success:!1,error:e}}}async controlPump(t,e,i,s){const a={entity_id:t,action:e};void 0!==i&&(a.speed=i),void 0!==s&&(a.duration=s);const o=await this.callService("violet_pool_controller","control_pump",a);if(o.success){const t=void 0!==i?` (Speed ${i})`:"";this.showToast(`Pump ${e.toUpperCase()}${t}`)}return o}async setTemperature(t,e){const i=await this.callService("climate","set_temperature",{entity_id:t,temperature:e});return i.success&&this.showToast(`Temperature set to ${e}°C`),i}async setHvacMode(t,e){const i=await this.callService("climate","set_hvac_mode",{entity_id:t,hvac_mode:e});return i.success&&this.showToast(`HVAC mode set to ${e.toUpperCase()}`),i}async setNumberValue(t,e){const i=await this.callService("number","set_value",{entity_id:t,value:e});return i.success&&this.showToast(`Value set to ${e}`),i}async turnOn(t){const e=t.split(".")[0],i=await this.callService(e,"turn_on",{entity_id:t});return i.success&&this.showToast(`${t.split(".")[1]} turned ON`),i}async turnOff(t){const e=t.split(".")[0],i=await this.callService(e,"turn_off",{entity_id:t});return i.success&&this.showToast(`${t.split(".")[1]} turned OFF`),i}async toggle(t){const e=t.split(".")[0],i=await this.callService(e,"toggle",{entity_id:t});return i.success&&this.showToast(`${t.split(".")[1]} toggled`),i}async smartDosing(t,e,i="on"){const s=await this.callService("violet_pool_controller","smart_dosing",{dosing_type:t,duration:e,action:i});if(s.success){const i={cl:"Chlorine",phm:"pH-",php:"pH+",floc:"Flocculant"};this.showToast(`${i[t]} dosing for ${e}s`)}return s}async manualDosing(t,e=30){const i=t.match(/dos_\d+_(\w+)/);if(!i)return{success:!1,error:"Could not determine dosing type from entity"};const s={cl:"cl",phm:"phm",php:"php",floc:"floc"}[i[1]];return s?this.smartDosing(s,e):{success:!1,error:`Unknown dosing type: ${i[1]}`}}async setPumpSpeed(t,e){return e<0||e>3?{success:!1,error:"Speed must be between 0 and 3"}:this.controlPump(t,"on",e)}async setControllerMode(t,e){if("off"===e)return this.turnOff(t);const i="manual"===e?"on":"auto";return this.controlPump(t,i)}}class Ct{static parsePumpState(t){if(!t||"string"!=typeof t)return{status:"",rawState:""};const e=t.split("|");if(2===e.length){const i=parseInt(e[0],10),s=this.formatSnakeCase(e[1]);return{level:isNaN(i)?void 0:i,status:s,rawState:t}}return{status:this.formatSnakeCase(t),rawState:t}}static parseHeaterState(t){return this.parsePumpState(t)}static parseSolarState(t){return this.parsePumpState(t)}static formatSnakeCase(t){return t?t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "):""}static getCurrentTemperature(t){const e=t?.attributes?.current_temperature;return void 0!==e?Number(e):void 0}static getTargetTemperature(t){const e=t?.attributes?.temperature;return void 0!==e?Number(e):void 0}static getMinTemperature(t){const e=t?.attributes?.min_temp;return void 0!==e?Number(e):void 0}static getMaxTemperature(t){const e=t?.attributes?.max_temp;return void 0!==e?Number(e):void 0}}let kt=class extends rt{setConfig(t){if(!t.card_type)throw new Error("You need to define a card_type");if("overview"!==t.card_type&&"system"!==t.card_type&&!t.entity)throw new Error("You need to define an entity");this.config={show_state:!0,show_detail_status:!0,show_controls:!0,show_runtime:!1,show_history:!1,size:"medium",theme:"luxury",animation:"smooth",blur_intensity:10,style:"standard",show_flow_animation:!1,entity_prefix:"violet_pool",...t}}_buildEntityId(t,e){return`${t}.${this.config.entity_prefix||"violet_pool"}_${e}`}_getEntityId(t,e,i,s){return this.config[t]||(void 0!==s&&this.config.entities&&this.config.entities[s]?this.config.entities[s]:this._buildEntityId(e,i))}render(){if(!this.config||!this.hass)return q``;if(this.config.entity&&!this.hass.states[this.config.entity])return q`
          <ha-card>
            <div class="error">
              <ha-icon icon="mdi:alert-circle"></ha-icon>
              <span>Entity ${this.config.entity} not found</span>
            </div>
          </ha-card>
        `;switch(this.config.card_type){case"pump":return this.renderPumpCard();case"heater":return this.renderHeaterCard();case"solar":return this.renderSolarCard();case"dosing":return this.renderDosingCard();case"overview":return this.renderOverviewCard();case"compact":return this.renderCompactCard();case"system":return this.renderSystemCard();default:return q`
          <ha-card>
            <div class="error">
              <ha-icon icon="mdi:alert-circle"></ha-icon>
              <span>Unknown card_type: ${this.config.card_type}</span>
            </div>
          </ha-card>
        `}}_getCardClasses(t,e){const i=[];return i.push(`size-${e.size||"medium"}`),e.theme?i.push(`theme-${e.theme}`):i.push(e.style||"standard"),e.animation&&"none"!==e.animation&&i.push(`animation-${e.animation}`),(e.show_flow_animation||"energetic"===e.animation)&&t&&i.push("flow-active"),t&&i.push("is-active"),i.join(" ")}renderSystemCard(){const t=this._getEntityId("pump_entity","switch","pump",0),e=this._getEntityId("heater_entity","climate","heater",1),i=this._getEntityId("solar_entity","climate","solar",2),s=this._getEntityId("chlorine_entity","switch","dos_1_cl",3),a=(t,e,i={})=>"overview"===t||this.hass.states[e]?{...this.config,card_type:t,entity:e,...i}:null,o=a("overview","",{name:"Pool Overview"}),n=a("pump",t,{show_runtime:!0}),r=a("heater",e),c=a("solar",i),l=a("dosing",s,{dosing_type:"chlorine"});return q`
      <div class="system-grid">
        ${o?this.renderOverviewCard(o):""}
        ${n?this.renderPumpCard(n):""}
        ${r?this.renderHeaterCard(r):""}
        ${c?this.renderSolarCard(c):""}
        ${l?this.renderDosingCard(l):""}
      </div>
    `}renderPumpCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,s=t.name||e.attributes.friendly_name||"Pump",a=e.attributes?.PUMPSTATE||"",o=Ct.parsePumpState(a),n=void 0!==o.level?o.level:0,r=[e.attributes?.PUMP_RPM_0||0,e.attributes?.PUMP_RPM_1||0,e.attributes?.PUMP_RPM_2||0,e.attributes?.PUMP_RPM_3||0][n]||0,c=e.attributes?.runtime||0,l=Math.floor(c/3600),d=Math.floor(c%3600/60),p=l>0?`${l}h ${d}min`:`${d}min`,h=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.turnOff(t.entity)},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.controlPump(t.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:speedometer-slow",label:"ECO",action:async()=>{const e=new $t(this.hass);await e.setPumpSpeed(t.entity,1)},active:1===n,color:"#4CAF50"},{icon:"mdi:speedometer-medium",label:"Normal",action:async()=>{const e=new $t(this.hass);await e.setPumpSpeed(t.entity,2)},active:2===n,color:"#FF9800"},{icon:"mdi:speedometer",label:"Boost",action:async()=>{const e=new $t(this.hass);await e.setPumpSpeed(t.entity,3)},active:3===n,color:"#F44336"}],u="on"===i||n>0;return q`
      <ha-card class="${this._getCardClasses(u,t)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${t.icon||"mdi:pump"}"
              class="${u?"pump-running":""}"
            ></ha-icon>
            <span class="name">${s}</span>
            ${t.show_state?q`<status-badge .state="${i}" .pulse="${u}"></status-badge>`:""}
            ${n>0?q`<span class="badge-secondary">Level ${n}</span>`:""}
          </div>

          ${t.show_detail_status&&a?q`<detail-status .raw="${a}"></detail-status>`:""}

          ${r>0?q`
                <div class="rpm-display">
                  <ha-icon icon="mdi:rotate-right"></ha-icon>
                  <span>${r} RPM</span>
                </div>
              `:""}

          ${t.show_controls?q`
                <slider-control
                  label="Pump Speed"
                  min="0"
                  max="3"
                  step="1"
                  .value="${n}"
                  .labels="${["OFF","ECO","Normal","Boost"]}"
                  @value-changed="${e=>this._handlePumpSpeedChange(e,t.entity)}"
                ></slider-control>

                <quick-actions .actions="${h}"></quick-actions>
              `:""}

          ${t.show_runtime&&c>0?q`
                <div class="runtime-display">
                  <ha-icon icon="mdi:timer-outline"></ha-icon>
                  <span>Runtime: ${p}</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}async _handlePumpSpeedChange(t,e){const i=t.detail.value,s=new $t(this.hass);await s.setPumpSpeed(e,i)}renderHeaterCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,s=t.name||e.attributes.friendly_name||"Heater",a=Ct.getCurrentTemperature(e),o=Ct.getTargetTemperature(e),n=Ct.getMinTemperature(e)||18,r=Ct.getMaxTemperature(e)||35,c=e.attributes?.HEATERSTATE||"",l=e.attributes?.outside_temperature,d=e.attributes?.min_outside_temperature||14.5,p=c.includes("BLOCKED_BY_OUTSIDE_TEMP")||void 0!==l&&l<d,h=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"off")},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:fire",label:"HEAT",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"heat")},active:"heat"===i||"heating"===i,color:"#FF5722"}],u="heating"===i||"heat"===i;return q`
      <ha-card class="${this._getCardClasses(u,t)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${t.icon||"mdi:radiator"}"
              class="${u?"heater-active":""}"
            ></ha-icon>
            <span class="name">${s}</span>
            ${t.show_state?q`<status-badge .state="${i}"></status-badge>`:""}
          </div>

          ${void 0!==a?q`
                <value-display
                  .value="${a}"
                  unit="°C"
                  label="Current Temperature"
                  .target="${o}"
                  large
                ></value-display>
              `:""}

          ${t.show_detail_status&&c?q`<detail-status .raw="${c}"></detail-status>`:""}

          ${void 0!==l?q`
                <div class="outside-temp-display ${p?"blocked":""}">
                  <ha-icon icon="mdi:thermometer"></ha-icon>
                  <span>Outside: ${l.toFixed(1)}°C</span>
                  ${p?q`<span class="warning-text">(Min: ${d}°C)</span>`:""}
                </div>
              `:""}

          ${t.show_controls?q`
                ${void 0!==o?q`
                      <slider-control
                        label="Target Temperature"
                        .min="${n}"
                        .max="${r}"
                        step="0.5"
                        .value="${o}"
                        unit="°C"
                        showMinMax
                        @value-changed="${e=>this._handleTemperatureChange(e,t.entity)}"
                      ></slider-control>
                    `:""}

                <quick-actions .actions="${h}"></quick-actions>
              `:""}
        </div>
      </ha-card>
    `}async _handleTemperatureChange(t,e){const i=t.detail.value,s=new $t(this.hass);await s.setTemperature(e,i)}renderSolarCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,s=t.name||e.attributes.friendly_name||"Solar",a=Ct.getCurrentTemperature(e),o=Ct.getTargetTemperature(e),n=Ct.getMinTemperature(e)||18,r=Ct.getMaxTemperature(e)||32,c=e.attributes?.absorber_temperature,l=void 0!==c&&void 0!==a?c-a:void 0,d=e.attributes?.SOLARSTATE||"",p=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"off")},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"auto")},active:"auto"===i,color:"#2196F3"},{icon:"mdi:sun-thermometer",label:"ON",action:async()=>{const e=new $t(this.hass);await e.setHvacMode(t.entity,"heat")},active:"heat"===i||"heating"===i,color:"#FF9800"}],h="heating"===i||"heat"===i;return q`
      <ha-card class="${this._getCardClasses(h,t)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${t.icon||"mdi:solar-power"}"
              class="${h?"solar-active":""}"
            ></ha-icon>
            <span class="name">${s}</span>
            ${t.show_state?q`<status-badge .state="${i}"></status-badge>`:""}
          </div>

          ${t.show_detail_status&&d?q`<detail-status .raw="${d}"></detail-status>`:""}

          <div class="solar-temps">
            ${void 0!==a?q`
                  <div class="temp-item">
                    <ha-icon icon="mdi:pool"></ha-icon>
                    <span class="temp-label">Pool:</span>
                    <span class="temp-value">${a.toFixed(1)}°C</span>
                  </div>
                `:""}
            ${void 0!==c?q`
                  <div class="temp-item">
                    <ha-icon icon="mdi:solar-panel"></ha-icon>
                    <span class="temp-label">Absorber:</span>
                    <span class="temp-value">${c.toFixed(1)}°C</span>
                  </div>
                `:""}
            ${void 0!==l?q`
                  <div class="temp-delta ${l>0?"positive":"negative"}">
                    <ha-icon icon="${l>0?"mdi:arrow-up":"mdi:arrow-down"}"></ha-icon>
                    <span>Δ ${l>0?"+":""}${l.toFixed(1)}°C</span>
                    ${l<0?q`<span class="delta-hint">(too cold for heating)</span>`:l<3?q`<span class="delta-hint">(heating possible)</span>`:q`<span class="delta-hint">(ideal for heating)</span>`}
                  </div>
                `:""}
          </div>

          ${t.show_controls?q`
                ${void 0!==o?q`
                      <slider-control
                        label="Target Temperature"
                        .min="${n}"
                        .max="${r}"
                        step="0.5"
                        .value="${o}"
                        unit="°C"
                        showMinMax
                        @value-changed="${e=>this._handleTemperatureChange(e,t.entity)}"
                      ></slider-control>
                    `:""}

                <quick-actions .actions="${p}"></quick-actions>
              `:""}
        </div>
      </ha-card>
    `}renderDosingCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,s=t.name||e.attributes.friendly_name||"Dosing",a=t.dosing_type||this._detectDosingType(t.entity),o=Object.keys(e.attributes||{}).find(t=>t.includes("DOS_")&&t.includes("_STATE")),n=o?e.attributes[o]:[];let r,c,l,d,p="",h="mdi:test-tube";if("chlorine"===a){const t=this._getEntityId("orp_value_entity","sensor","orp_value"),e=this.hass.states[t];r=e?parseFloat(e.state):void 0;const i=this._getEntityId("target_orp_entity","number","target_orp"),s=this.hass.states[i];c=s?parseFloat(s.state):void 0,l=s?.attributes?.min||600,d=s?.attributes?.max||800,p="mV",h="mdi:flash"}else if("ph_minus"===a||"ph_plus"===a){const t=this._getEntityId("ph_value_entity","sensor","ph_value"),e=this.hass.states[t];r=e?parseFloat(e.state):void 0;const i=this._getEntityId("target_ph_entity","number","target_ph"),s=this.hass.states[i];c=s?parseFloat(s.state):void 0,l=s?.attributes?.min||6.8,d=s?.attributes?.max||7.8,p="",h="mdi:ph"}const u=e.attributes?.dosing_volume_24h,m=[{icon:"mdi:power-off",label:"OFF",action:async()=>{const e=new $t(this.hass);await e.turnOff(t.entity)},active:"off"===i,color:"#757575"},{icon:"mdi:autorenew",label:"AUTO",action:async()=>{const e=new $t(this.hass);await e.turnOn(t.entity)},active:"on"===i||"auto"===i,color:"#2196F3"},{icon:"mdi:play-circle",label:"Dose 30s",action:async()=>{const e=new $t(this.hass);await e.manualDosing(t.entity,30)},color:"#4CAF50",confirmMessage:"Start manual dosing for 30 seconds?"},{icon:"mdi:play-speed",label:"Dose 60s",action:async()=>{const e=new $t(this.hass);await e.manualDosing(t.entity,60)},color:"#FF9800",confirmMessage:"Start manual dosing for 60 seconds?"}],g="on"===i&&n.some(t=>t.includes("ACTIVE"));return q`
      <ha-card class="${this._getCardClasses(g,t)}">
        <div class="card-content">
          <div class="header">
            <ha-icon
              icon="${t.icon||this._getDosingIcon(a)}"
              class="${g?"dosing-active":""}"
            ></ha-icon>
            <span class="name">${s}</span>
            ${t.show_state?q`<status-badge .state="${i}" .pulse="${g}"></status-badge>`:""}
          </div>

          ${void 0!==r&&void 0!==c?q`
                <div class="dosing-values">
                  <div class="value-row">
                    <ha-icon icon="${h}"></ha-icon>
                    <span class="current-value">${r.toFixed("chlorine"===a?0:1)}${p}</span>
                    <ha-icon icon="mdi:arrow-right" class="arrow-icon"></ha-icon>
                    <span class="target-value">${c.toFixed("chlorine"===a?0:1)}${p}</span>
                  </div>
                  ${void 0!==l&&void 0!==d?q`
                        <div class="threshold-row">
                          <span class="threshold-label">Min:</span>
                          <span class="threshold-value">${l.toFixed("chlorine"===a?0:1)}${p}</span>
                          <span class="separator">|</span>
                          <span class="threshold-label">Max:</span>
                          <span class="threshold-value">${d.toFixed("chlorine"===a?0:1)}${p}</span>
                        </div>
                      `:""}
                </div>
              `:""}

          ${t.show_detail_status&&n&&Array.isArray(n)&&n.length>0?q`<warning-chips .warnings="${n}" defaultType="warning"></warning-chips>`:""}

          ${t.show_controls?q`<quick-actions .actions="${m}"></quick-actions>`:""}

          ${t.show_history&&void 0!==u?q`
                <div class="dosing-history">
                  <ha-icon icon="mdi:chart-line"></ha-icon>
                  <span>Last 24h: ${u}ml</span>
                </div>
              `:""}
        </div>
      </ha-card>
    `}_detectDosingType(t){return t.includes("_cl")?"chlorine":t.includes("_phm")?"ph_minus":t.includes("_php")?"ph_plus":t.includes("_floc")?"flocculant":"chlorine"}_getDosingIcon(t){switch(t){case"chlorine":default:return"mdi:flask-outline";case"ph_minus":return"mdi:flask-minus";case"ph_plus":return"mdi:flask-plus";case"flocculant":return"mdi:flask"}}renderOverviewCard(t=this.config){const e=t.name||"Pool Status",i=this._getEntityId("pump_entity","switch","pump",0),s=this._getEntityId("heater_entity","climate","heater",1),a=this._getEntityId("solar_entity","climate","solar",2),o=this._getEntityId("chlorine_entity","switch","dos_1_cl",3),n=this._getEntityId("ph_minus_entity","switch","dos_2_phm",4),r=this.hass.states[i],c=this.hass.states[s],l=this.hass.states[a],d=this.hass.states[o],p=this.hass.states[n],h=this._getEntityId("pool_temp_entity","sensor","temperature",5),u=this._getEntityId("ph_value_entity","sensor","ph_value",6),m=this._getEntityId("orp_value_entity","sensor","orp_value",7),g=this.hass.states[h],v=this.hass.states[u],f=this.hass.states[m],b=g?parseFloat(g.state):void 0,y=v?parseFloat(v.state):void 0,x=f?parseFloat(f.state):void 0,_=(w=y)?w<7||w>7.4?"warning":"ok":"unknown";var w;const $=(C=x)?C<650?"warning":C>750?"high":"ok":"unknown";var C;const k=[];if(r){const t=r.attributes?.PUMPSTATE||"",e=Ct.parsePumpState(t);k.push({icon:"mdi:pump",name:"Pump",status:e.status||r.state,state:r.state})}if(c){const t=c.attributes?.HEATERSTATE||"",e=Ct.parseHeaterState(t);k.push({icon:"mdi:radiator",name:"Heater",status:e.status||c.state,state:c.state})}if(l){const t=l.attributes?.SOLARSTATE||"",e=Ct.parseSolarState(t);k.push({icon:"mdi:solar-power",name:"Solar",status:e.status||l.state,state:l.state})}if(d){const t=d.attributes?.DOS_1_CL_STATE||[],e=Array.isArray(t)&&t.length>0?Ct.formatSnakeCase(t[0]):d.state;k.push({icon:"mdi:flask-outline",name:"Chlorine",status:e,state:d.state})}if(p){const t=p.attributes?.DOS_2_PHM_STATE||[],e=Array.isArray(t)&&t.length>0?Ct.formatSnakeCase(t[0]):p.state;k.push({icon:"mdi:flask-minus",name:"pH-",status:e,state:p.state})}const S=[];if("warning"===$&&S.push("ORP too low - Check chlorine dosing"),"high"===$&&S.push("ORP too high - Stop chlorine dosing"),"warning"===_&&S.push("pH out of range - Check dosing"),r?.attributes?.PUMPSTATE?.includes("ANTI_FREEZE")){const t=c?.attributes?.outside_temperature;S.push("Frost protection active"+(t?` (${t.toFixed(1)}°C)`:""))}const A=k.some(t=>["on","auto","heat","heating"].includes(t.state));return q`
      <ha-card class="${this._getCardClasses(A,t)}">
        <div class="card-content overview-content">
          <div class="header">
            <ha-icon icon="mdi:pool"></ha-icon>
            <span class="name">${e}</span>
          </div>

          <!-- Water Chemistry -->
          <div class="water-chemistry">
            ${void 0!==b?q`
                  <div class="chemistry-item">
                    <ha-icon icon="mdi:thermometer"></ha-icon>
                    <div class="chemistry-value">
                      <span class="value">${b.toFixed(1)}°C</span>
                      <span class="status-indicator ok">OK</span>
                    </div>
                  </div>
                `:""}
            ${void 0!==y?q`
                  <div class="chemistry-item">
                    <ha-icon icon="mdi:ph"></ha-icon>
                    <div class="chemistry-value">
                      <span class="value">pH ${y.toFixed(1)}</span>
                      <span class="status-indicator ${_}">${_.toUpperCase()}</span>
                    </div>
                  </div>
                `:""}
            ${void 0!==x?q`
                  <div class="chemistry-item">
                    <ha-icon icon="mdi:flash"></ha-icon>
                    <div class="chemistry-value">
                      <span class="value">${x.toFixed(0)}mV</span>
                      <span class="status-indicator ${$}">${"warning"===$?"LOW":"high"===$?"HIGH":"OK"}</span>
                    </div>
                  </div>
                `:""}
          </div>

          <!-- Active Devices -->
          ${k.length>0?q`
                <div class="overview-section">
                  <div class="section-title">Active Devices:</div>
                  <div class="device-list">
                    ${k.map(t=>q`
                        <div class="device-item">
                          <ha-icon
                            icon="${t.icon}"
                            class="${"on"===t.state||"auto"===t.state||"heat"===t.state||"heating"===t.state?"active":"inactive"}"
                          ></ha-icon>
                          <span class="device-name">${t.name}</span>
                          <span class="device-status">(${t.status})</span>
                        </div>
                      `)}
                  </div>
                </div>
              `:""}

          <!-- Warnings -->
          ${S.length>0?q`
                <div class="overview-section">
                  <div class="section-title">Warnings:</div>
                  <div class="warnings-list">
                    ${S.map(t=>q`
                        <div class="warning-item">
                          <ha-icon icon="${t.includes("Frost")?"mdi:snowflake-alert":"mdi:alert-circle"}"></ha-icon>
                          <span>${t}</span>
                        </div>
                      `)}
                  </div>
                </div>
              `:q`
                <div class="overview-section">
                  <div class="all-ok">
                    <ha-icon icon="mdi:check-circle"></ha-icon>
                    <span>All systems normal</span>
                  </div>
                </div>
              `}
        </div>
      </ha-card>
    `}renderCompactCard(t=this.config){const e=this.hass.states[t.entity],i=e.state,s=t.name||e.attributes.friendly_name||"Entity",a=t.entity.split(".")[0];let o=t.icon;o||(o="switch"===a&&t.entity.includes("pump")?"mdi:pump":"climate"===a&&t.entity.includes("heater")?"mdi:radiator":"climate"===a&&t.entity.includes("solar")?"mdi:solar-power":"switch"===a&&t.entity.includes("dos")?"mdi:flask-outline":"mdi:circle");let n="",r="";if(e.attributes?.PUMPSTATE){const t=Ct.parsePumpState(e.attributes.PUMPSTATE);n=t.status,void 0!==t.level&&t.level>0&&(r=`Level ${t.level}`)}else if(e.attributes?.HEATERSTATE){n=Ct.parseHeaterState(e.attributes.HEATERSTATE).status;const t=Ct.getCurrentTemperature(e);void 0!==t&&(r=`${t.toFixed(1)}°C`)}else if(e.attributes?.SOLARSTATE){n=Ct.parseSolarState(e.attributes.SOLARSTATE).status;const t=Ct.getCurrentTemperature(e);void 0!==t&&(r=`${t.toFixed(1)}°C`)}else if(Object.keys(e.attributes||{}).some(t=>t.includes("DOS_")&&t.includes("_STATE"))){const i=Object.keys(e.attributes||{}).find(t=>t.includes("DOS_")&&t.includes("_STATE")),s=i?e.attributes[i]:[];Array.isArray(s)&&s.length>0&&(n=Ct.formatSnakeCase(s[0]));const a=this._detectDosingType(t.entity);if("chlorine"===a){const t=this._getEntityId("orp_value_entity","sensor","orp_value"),e=this.hass.states[t];e&&(r=`${parseFloat(e.state).toFixed(0)}mV`)}else if("ph_minus"===a||"ph_plus"===a){const t=this._getEntityId("ph_value_entity","sensor","ph_value"),e=this.hass.states[t];e&&(r=`pH ${parseFloat(e.state).toFixed(1)}`)}}const c="on"===i||"auto"===i||"heat"===i||"heating"===i;return q`
      <ha-card class="compact-card ${this._getCardClasses(c,t)}">
        <div class="card-content compact">
          <ha-icon
            icon="${o}"
            class="${c?"active":"inactive"}"
          ></ha-icon>
          <div class="compact-info">
            <span class="name">${s}</span>
            <div class="compact-details">
              ${r?q`<span class="current-value-compact">${r}</span>`:""}
              ${n?q`<span class="detail-compact">${n}</span>`:""}
            </div>
          </div>
          <status-badge .state="${i}"></status-badge>
        </div>
      </ha-card>
    `}static get styles(){return n`
      :host {
        --vpc-spacing: 16px;
        --vpc-radius: 16px;
        --vpc-bg: var(--ha-card-background, var(--card-background-color, #fff));
        --vpc-border: none;
        --vpc-shadow: var(--ha-card-box-shadow, none);
        --vpc-backdrop: none;
        --vpc-primary: var(--primary-color);
        --vpc-text: var(--primary-text-color);
        --vpc-text-secondary: var(--secondary-text-color);
        --vpc-icon-size: 24px;
        --vpc-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

        display: block;
      }

      :host(.theme-luxury), :host(.theme-glass) {
        --vpc-bg: rgba(255, 255, 255, 0.65);
        --vpc-backdrop: blur(20px) saturate(180%);
        --vpc-radius: 24px;
        --vpc-border: 1px solid rgba(255, 255, 255, 0.3);
        --vpc-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
      }
      .dark :host(.theme-luxury), .dark :host(.theme-glass) {
        --vpc-bg: rgba(20, 20, 20, 0.65);
        --vpc-border: 1px solid rgba(255, 255, 255, 0.1);
      }

      :host(.theme-modern) {
        --vpc-radius: 26px;
        --vpc-spacing: 20px;
        --vpc-bg: var(--card-background-color, #fff);
        --vpc-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      :host(.theme-neon) {
        --vpc-bg: linear-gradient(145deg, #1a1a1a, #0a0a0a);
        --vpc-border: 1px solid rgba(0, 255, 255, 0.2);
        --vpc-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
        --vpc-radius: 4px;
        --vpc-primary: #00ffff;
        --vpc-text: #ffffff;
        --vpc-text-secondary: #b0b0b0;
      }

      :host(.theme-premium) {
        --vpc-bg: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,255,0.9) 100%);
        --vpc-radius: 20px;
        --vpc-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
        --vpc-border: 1px solid rgba(255,255,255,0.8);
      }
      .dark :host(.theme-premium) {
        --vpc-bg: linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.95) 100%);
        --vpc-border: 1px solid rgba(255,255,255,0.05);
      }

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
      }

      :host(.theme-neon) ha-card.is-active {
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1);
        border-color: rgba(0, 255, 255, 0.6);
      }

      .card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card-content.compact {
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 4px;
      }

      ha-icon {
        --mdc-icon-size: var(--vpc-icon-size);
        color: var(--vpc-primary);
        transition: var(--vpc-transition);
      }

      .name {
        flex: 1;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.3px;
        color: var(--vpc-text);
      }

      .rpm-display, .runtime-display, .outside-temp-display,
      .solar-temps, .dosing-history, .error, .chemistry-item,
      .device-item, .warning-item {
        background: rgba(var(--rgb-primary-text-color, 0,0,0), 0.04);
        border-radius: 12px;
        padding: 10px;
      }

      .theme-neon .rpm-display, .theme-neon .runtime-display,
      .theme-neon .outside-temp-display, .theme-neon .solar-temps {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.1);
      }

      .rpm-display, .runtime-display, .outside-temp-display {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        color: var(--vpc-text);
      }

      .outside-temp-display.blocked {
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid #ff9800;
      }

      .warning-text {
        color: #ff9800;
        font-size: 12px;
        margin-left: 4px;
      }

      .badge-secondary {
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 500;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }

      @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes pulse-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

      .pump-running { animation: rotate 2s linear infinite; }
      .heater-active { animation: pulse-glow 2s ease-in-out infinite; color: #FF5722; }
      .solar-active { color: #ff9800; }
      .dosing-active { animation: pulse-glow 2s ease-in-out infinite; color: #4caf50; }

      .solar-temps { display: flex; flex-direction: column; gap: 8px; }
      .temp-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
      .temp-label { color: var(--vpc-text-secondary); width: 80px; }
      .temp-value { font-weight: 600; color: var(--vpc-text); }
      .temp-delta { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-weight: 600; }
      .temp-delta.positive { color: #4caf50; }
      .temp-delta.negative { color: #f44336; }

      .dosing-values { display: flex; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; background: rgba(var(--rgb-primary-text-color), 0.03); }
      .value-row { display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 20px; }
      .current-value { font-weight: 700; }
      .target-value { color: var(--vpc-text-secondary); font-weight: 500; }
      .threshold-row { display: flex; justify-content: center; gap: 8px; font-size: 12px; color: var(--vpc-text-secondary); }

      .water-chemistry { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .chemistry-item { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
      .chemistry-value .value { font-size: 15px; font-weight: 700; }

      .status-indicator { padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
      .status-indicator.ok { background: rgba(76, 175, 80, 0.2); color: #2e7d32; }
      .status-indicator.warning { background: rgba(255, 152, 0, 0.2); color: #ef6c00; }
      .status-indicator.high { background: rgba(244, 67, 54, 0.2); color: #c62828; }

      .device-list, .warnings-list { display: flex; flex-direction: column; gap: 8px; }
      .device-item, .warning-item { display: flex; align-items: center; gap: 12px; }
      .device-name { font-weight: 500; flex: 1; }
      .device-status { color: var(--vpc-text-secondary); font-size: 13px; }
      .device-item ha-icon.active { color: var(--vpc-primary); }
      .device-item ha-icon.inactive { color: var(--vpc-text-secondary); opacity: 0.5; }

      .system-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }

      .compact-info { flex: 1; }
      .compact-details { display: flex; gap: 10px; font-size: 12px; margin-top: 2px; }
      .current-value-compact { font-weight: 600; color: var(--vpc-text); }
      .detail-compact { color: var(--vpc-text-secondary); }

      .error { background: rgba(244, 67, 54, 0.1); color: #d32f2f; display: flex; align-items: center; gap: 8px; }

      .size-small { --vpc-spacing: 12px; --vpc-icon-size: 20px; }
      .size-large { --vpc-spacing: 24px; --vpc-icon-size: 28px; }
      .size-fullscreen { --vpc-spacing: 32px; --vpc-icon-size: 32px; height: 100%; min-height: 80vh; }
    `}getCardSize(){switch(this.config?.card_type){case"compact":return 1;case"overview":return 5;default:return 3}}static getStubConfig(){return{type:"custom:violet-pool-card",entity_prefix:"violet_pool",entity:"switch.violet_pool_pump",card_type:"pump"}}static async getConfigElement(){return await Promise.resolve().then(function(){return At}),document.createElement("violet-pool-card-editor")}};t([ht({attribute:!1})],kt.prototype,"hass",void 0),t([ut()],kt.prototype,"config",void 0),kt=t([lt("violet-pool-card")],kt),window.customCards=window.customCards||[],window.customCards.push({type:"violet-pool-card",name:"Violet Pool Card",description:"Custom card for Violet Pool Controller",preview:!0});let St=class extends rt{setConfig(t){this._config=t}render(){return this.hass&&this._config?q`
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
        ${"overview"!==this._config.card_type&&"system"!==this._config.card_type?q`
              <div class="config-section">
                <div class="section-header">
                  <ha-icon icon="mdi:account-circle"></ha-icon>
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
              ${["small","medium","large","fullscreen"].map(t=>q`
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
              ${[{value:"luxury",icon:"🌟",label:"Luxury",desc:"Glassmorphism"},{value:"modern",icon:"🎯",label:"Modern",desc:"Clean & Minimal"},{value:"minimalist",icon:"⚪",label:"Minimalist",desc:"Ultra Clean"},{value:"glass",icon:"💎",label:"Glass",desc:"Pure Glass"},{value:"neon",icon:"⚡",label:"Neon",desc:"RGB Glow"},{value:"premium",icon:"👑",label:"Premium",desc:"Gradient Shine"}].map(t=>q`
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
              ${[{value:"none",icon:"⏸️",label:"None",desc:"Static"},{value:"subtle",icon:"🌙",label:"Subtle",desc:"Professional"},{value:"smooth",icon:"✨",label:"Smooth",desc:"Balanced"},{value:"energetic",icon:"🚀",label:"Energetic",desc:"Dynamic"}].map(t=>q`
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

          ${"pump"===this._config.card_type?q`
                <ha-formfield label="Show runtime counter">
                  <ha-switch
                    .checked="${!0===this._config.show_runtime}"
                    @change="${this._showRuntimeChanged}"
                  ></ha-switch>
                </ha-formfield>
              `:""}

          ${"dosing"===this._config.card_type?q`
                <ha-formfield label="Show dosing history">
                  <ha-switch
                    .checked="${!0===this._config.show_history}"
                    @change="${this._showHistoryChanged}"
                  ></ha-switch>
                </ha-formfield>
              `:""}
        </div>

        <!-- Dosing Type (for dosing cards) -->
        ${"dosing"===this._config.card_type?q`
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
    `:q``}_formatSizeName(t){return{small:"Small",medium:"Medium",large:"Large",fullscreen:"Fullscreen"}[t]||t}_cardTypeChanged(t){const e=t.target;this._config.card_type!==e.value&&(this._config={...this._config,card_type:e.value},this._fireConfigChanged())}_entityPrefixChanged(t){const e=t.target.value.trim().toLowerCase().replace(/[^a-z0-9_]/g,"_");this._config.entity_prefix!==e&&(this._config={...this._config,entity_prefix:e||"violet_pool"},this._fireConfigChanged())}_entityChanged(t){const e=t.detail;this._config.entity!==e.value&&(this._config={...this._config,entity:e.value},this._fireConfigChanged())}_sizeChanged(t){this._config={...this._config,size:t},this._fireConfigChanged()}_themeChanged(t){this._config={...this._config,theme:t},this._fireConfigChanged()}_animationChanged(t){this._config={...this._config,animation:t},this._fireConfigChanged()}_nameChanged(t){const e=t.target;this._config={...this._config,name:e.value||void 0},this._fireConfigChanged()}_iconChanged(t){this._config={...this._config,icon:t.detail.value||void 0},this._fireConfigChanged()}_showStateChanged(t){const e=t.target;this._config={...this._config,show_state:e.checked},this._fireConfigChanged()}_showDetailStatusChanged(t){const e=t.target;this._config={...this._config,show_detail_status:e.checked},this._fireConfigChanged()}_showControlsChanged(t){const e=t.target;this._config={...this._config,show_controls:e.checked},this._fireConfigChanged()}_showRuntimeChanged(t){const e=t.target;this._config={...this._config,show_runtime:e.checked},this._fireConfigChanged()}_showHistoryChanged(t){const e=t.target;this._config={...this._config,show_history:e.checked},this._fireConfigChanged()}_dosingTypeChanged(t){const e=t.target;this._config={...this._config,dosing_type:e.value},this._fireConfigChanged()}_accentColorChanged(t){const e=t.target;this._config={...this._config,accent_color:e.value||void 0},this._fireConfigChanged()}_iconColorChanged(t){const e=t.target;this._config={...this._config,icon_color:e.value||void 0},this._fireConfigChanged()}_blurIntensityChanged(t){const e=t.target;this._config={...this._config,blur_intensity:parseInt(e.value)||10},this._fireConfigChanged()}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)}static get styles(){return n`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
      }

      .config-section {
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 12px;
        padding: 16px;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        font-weight: 600;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .section-header ha-icon {
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

      .prefix-info {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 12px;
        margin-top: 12px;
        background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
        border-radius: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
        line-height: 1.4;
      }

      .prefix-info ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color);
        flex-shrink: 0;
        margin-top: 2px;
      }

      .premium-section {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        border: 2px solid rgba(102, 126, 234, 0.2);
      }

      .premium-header {
        color: #667eea;
      }

      /* Size Picker */
      .picker-container {
        margin-bottom: 24px;
      }

      .picker-container > label {
        display: block;
        font-weight: 500;
        margin-bottom: 12px;
        color: var(--primary-text-color);
      }

      .size-picker {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }

      .size-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--secondary-background-color);
        border: 2px solid var(--divider-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .size-button:hover {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
      }

      .size-button.active {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
      }

      .size-preview {
        width: 40px;
        height: 30px;
        background: currentColor;
        border-radius: 4px;
        opacity: 0.3;
      }

      .size-preview.size-small {
        width: 25px;
        height: 20px;
      }

      .size-preview.size-medium {
        width: 35px;
        height: 25px;
      }

      .size-preview.size-large {
        width: 45px;
        height: 32px;
      }

      .size-preview.size-fullscreen {
        width: 50px;
        height: 38px;
      }

      .size-button.active .size-preview {
        opacity: 1;
      }

      .size-button span {
        font-size: 11px;
        font-weight: 500;
      }

      /* Theme Picker */
      .theme-picker {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .theme-button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border: 2px solid var(--divider-color);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
      }

      .theme-button:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .theme-button.active {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
        box-shadow: 0 0 0 3px rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);
      }

      .theme-preview {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }

      .theme-preview.theme-luxury {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.6);
      }

      .theme-preview.theme-modern {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
      }

      .theme-preview.theme-minimalist {
        background: var(--card-background-color);
        border: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .theme-preview.theme-glass {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .theme-preview.theme-neon {
        background: linear-gradient(135deg, #0f0c29, #302b63);
        border: 2px solid #2196f3;
        box-shadow: 0 0 20px rgba(33, 150, 243, 0.4);
      }

      .theme-preview.theme-premium {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
      }

      .theme-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .theme-label {
        font-weight: 600;
        font-size: 13px;
        color: var(--primary-text-color);
      }

      .theme-desc {
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      /* Animation Picker */
      .animation-picker {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .animation-button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border: 2px solid var(--divider-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .animation-button:hover {
        border-color: var(--primary-color);
      }

      .animation-button.active {
        border-color: var(--primary-color);
        background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
      }

      .anim-icon {
        font-size: 20px;
      }

      .anim-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .anim-label {
        font-weight: 600;
        font-size: 12px;
        color: var(--primary-text-color);
      }

      .anim-desc {
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      /* Advanced Section */
      .advanced-section {
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 12px;
      }

      .advanced-section summary {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        color: var(--primary-text-color);
        list-style: none;
      }

      .advanced-section summary::-webkit-details-marker {
        display: none;
      }

      .advanced-section summary ha-icon {
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }

      .advanced-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;
      }

      /* Form Elements */
      ha-select,
      ha-textfield,
      ha-entity-picker,
      ha-icon-picker {
        width: 100%;
      }

      ha-formfield {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
    `}};t([ht({attribute:!1})],St.prototype,"hass",void 0),t([ut()],St.prototype,"_config",void 0),St=t([lt("violet-pool-card-editor")],St);var At=Object.freeze({__proto__:null,get VioletPoolCardEditor(){return St}});export{kt as VioletPoolCard};
