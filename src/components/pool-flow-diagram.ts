/**
 * Responsive SVG pool circulation diagram.
 *
 * It deliberately exposes data-part/data-segment attributes like the sibling
 * heat-pump flow card so live DOM checks can verify nodes, direction and
 * activity without relying on pixels alone.
 */

import { LitElement, css, html, nothing, svg, type CSSResultGroup, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { i18n } from '../utils/i18n';
import {
  buildPoolFlowModel,
  type PoolFlowEntities,
  type PoolFlowFact,
  type PoolFlowHass,
  type PoolFlowNode,
  type PoolFlowOptions,
} from '../utils/pool-flow';

const MODE_LABELS: Record<PoolFlowOptions['mode'], () => string> = {
  circulation: () => i18n.t('pool_flow_mode_circulation'),
  treatment: () => i18n.t('pool_flow_mode_treatment'),
  complete: () => i18n.t('pool_flow_mode_complete'),
};

const NODE_ICONS: Record<PoolFlowNode['key'], string> = {
  pool: '🏊',
  pump: '⚙',
  filter: '◫',
  heater: '🔥',
  solar: '☀',
  dosing: '🧪',
};

const NODE_LABELS: Record<PoolFlowNode['key'], () => string> = {
  pool: () => i18n.t('pool_flow_pool'),
  pump: () => i18n.t('pump'),
  filter: () => i18n.t('filter'),
  heater: () => i18n.t('heater'),
  solar: () => i18n.t('solar'),
  dosing: () => i18n.t('dosing'),
};

const FACT_ICONS: Record<PoolFlowFact['key'], string> = {
  temperature: 'mdi:pool-thermometer',
  flow: 'mdi:waves-arrow-right',
  pressure: 'mdi:gauge',
  level: 'mdi:cup-water',
  ph: 'mdi:ph',
  orp: 'mdi:lightning-bolt',
  chlorine: 'mdi:flask',
  backwash: 'mdi:autorenew',
  refill: 'mdi:water-plus',
};

const FACT_LABELS: Record<PoolFlowFact['key'], () => string> = {
  temperature: () => i18n.t('metric_water_temp'),
  flow: () => i18n.t('pool_flow_flow_rate'),
  pressure: () => i18n.t('pool_flow_filter_pressure'),
  level: () => i18n.t('pool_flow_water_level'),
  ph: () => i18n.t('metric_ph'),
  orp: () => i18n.t('chem_label_orp'),
  chlorine: () => i18n.t('metric_chlorine'),
  backwash: () => i18n.t('backwash_name'),
  refill: () => i18n.t('pool_flow_refill'),
};

export class PoolFlowDiagram extends LitElement {
  @property({ attribute: false }) public hass!: PoolFlowHass;
  @property({ attribute: false }) public entities: PoolFlowEntities = {};
  @property({ attribute: false }) public options!: PoolFlowOptions;
  @property() public title = '';

  private _showMoreInfo(entityId?: string): void {
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  private _nodeKeydown(event: KeyboardEvent, entityId?: string): void {
    if (!entityId || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    this._showMoreInfo(entityId);
  }

  private _renderNode(node: PoolFlowNode, index: number, count: number): TemplateResult {
    const usableWidth = 760;
    const x = count === 1 ? 450 : 70 + (usableWidth / (count - 1)) * index;
    const activeClass = node.active ? 'node-active' : 'node-idle';
    return svg`
      <g
        class="flow-node ${activeClass} ${node.entityId ? 'interactive' : ''}"
        data-node="${node.key}"
        transform="translate(${x} 120)"
        role="${node.entityId ? 'button' : 'img'}"
        tabindex="${node.entityId ? '0' : '-1'}"
        aria-label="${NODE_LABELS[node.key]()}${node.value ? `: ${node.value}` : ''}"
        @click="${() => this._showMoreInfo(node.entityId)}"
        @keydown="${(event: KeyboardEvent) => this._nodeKeydown(event, node.entityId)}"
      >
        <rect class="node-panel" x="-58" y="-48" width="116" height="96" rx="24"></rect>
        <circle class="node-icon-bg" cx="0" cy="-15" r="22"></circle>
        <text class="node-icon" x="0" y="-8" text-anchor="middle">${NODE_ICONS[node.key]}</text>
        <text class="node-label" x="0" y="20" text-anchor="middle">${NODE_LABELS[node.key]()}</text>
        ${node.value
          ? html`<text class="node-value" x="0" y="38" text-anchor="middle">${node.value}</text>`
          : nothing}
      </g>
    `;
  }

  private _renderConnections(nodes: PoolFlowNode[], active: boolean): TemplateResult[] {
    if (nodes.length < 2) return [];
    const usableWidth = 760;
    const gap = usableWidth / (nodes.length - 1);
    const lineClass = active ? 'flow-active' : 'flow-idle';
    const paths: TemplateResult[] = [];

    for (let index = 0; index < nodes.length - 1; index += 1) {
      const fromX = 128 + gap * index;
      const toX = 12 + gap * (index + 1);
      paths.push(svg`
        <path
          class="flow-line ${lineClass}"
          data-part="circulation-main"
          data-segment="${nodes[index].key}-${nodes[index + 1].key}"
          d="M ${fromX} 120 H ${toX}"
          marker-end="url(#pool-flow-arrow)"
        ></path>
      `);
    }

    const lastX = 70 + usableWidth;
    paths.push(svg`
      <path
        class="flow-line flow-return ${lineClass}"
        data-part="circulation-return"
        data-segment="return-to-pool"
        d="M ${lastX} 170 V 230 H 70 V 170"
        marker-end="url(#pool-flow-arrow)"
      ></path>
    `);
    return paths;
  }

  private _renderFact(fact: PoolFlowFact): TemplateResult {
    return html`
      <button
        class="fact ${fact.active ? 'fact-active' : ''} ${fact.available ? '' : 'fact-unavailable'}"
        data-fact="${fact.key}"
        ?disabled="${!fact.entityId}"
        @click="${() => this._showMoreInfo(fact.entityId)}"
      >
        <span class="fact-icon"><ha-icon icon="${FACT_ICONS[fact.key]}"></ha-icon></span>
        <span class="fact-copy">
          <span class="fact-label">${FACT_LABELS[fact.key]()}</span>
          <span class="fact-value">${fact.value}</span>
        </span>
      </button>
    `;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.options) return html``;
    const model = buildPoolFlowModel(this.hass, this.entities, this.options);
    const title = this.title || i18n.t('pool_flow_title');

    return html`
      <section class="diagram-shell ${model.active ? 'is-active' : 'is-idle'}">
        <header class="diagram-header">
          <div class="title-block">
            <span class="title-icon"><ha-icon icon="mdi:pool"></ha-icon></span>
            <span>
              <strong>${title}</strong>
              <small>${MODE_LABELS[this.options.mode]()}</small>
            </span>
          </div>
          <span class="flow-status ${model.active ? 'status-active' : 'status-idle'}">
            <span class="status-dot"></span>
            ${model.active ? i18n.t('pool_flow_active') : i18n.t('pool_flow_idle')}
          </span>
        </header>

        <div class="canvas-wrap">
          <svg
            class="flow-canvas"
            viewBox="0 0 900 270"
            role="group"
            aria-label="${title}: ${model.active ? i18n.t('pool_flow_active') : i18n.t('pool_flow_idle')}"
          >
            <defs>
              <linearGradient id="pool-flow-gradient" x1="0" x2="1">
                <stop offset="0%" stop-color="var(--vpc-primary, #00A6FB)"></stop>
                <stop offset="100%" stop-color="var(--vpc-success, #34C759)"></stop>
              </linearGradient>
              <marker id="pool-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--vpc-primary, #00A6FB)"></path>
              </marker>
            </defs>
            ${this._renderConnections(model.nodes, model.active)}
            ${model.nodes.map((node, index) => this._renderNode(node, index, model.nodes.length))}
          </svg>
        </div>

        ${model.facts.length
          ? html`
              <div class="facts-heading">
                <span>${i18n.t('pool_flow_facts')}</span>
                <span>${model.facts.filter((entry) => entry.available).length}/${model.facts.length}</span>
              </div>
              <div class="facts-grid">${model.facts.map((entry) => this._renderFact(entry))}</div>
            `
          : nothing}
      </section>
    `;
  }

  public static get styles(): CSSResultGroup {
    return css`
      :host{display:block;color:var(--primary-text-color,#1d1d1f);font-family:var(--vpc-font,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif);}
      .diagram-shell{display:flex;flex-direction:column;gap:14px;}
      .diagram-header{display:flex;align-items:center;justify-content:space-between;gap:16px;}
      .title-block{display:flex;align-items:center;gap:11px;min-width:0;}
      .title-block>span:last-child{display:flex;flex-direction:column;gap:2px;min-width:0;}
      .title-block strong{font-size:17px;line-height:1.2;letter-spacing:-.25px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .title-block small{font-size:11px;color:var(--secondary-text-color,#68686f);text-transform:uppercase;letter-spacing:.55px;}
      .title-icon{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:color-mix(in srgb,var(--vpc-primary,#00A6FB) 14%,transparent);color:var(--vpc-primary,#00A6FB);}
      .title-icon ha-icon{--mdc-icon-size:23px;}
      .flow-status{display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap;}
      .status-active{color:var(--vpc-success,#34C759);background:color-mix(in srgb,var(--vpc-success,#34C759) 12%,transparent);}
      .status-idle{color:var(--vpc-text-secondary,var(--secondary-text-color));background:var(--vpc-surface,rgba(120,120,128,.09));}
      .status-dot{width:8px;height:8px;border-radius:50%;background:currentColor;}
      .status-active .status-dot{box-shadow:0 0 0 5px color-mix(in srgb,var(--vpc-success,#34C759) 15%,transparent);animation:pool-status-pulse 1.8s ease-in-out infinite;}
      .canvas-wrap{border-radius:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--vpc-primary,#00A6FB) 7%,transparent),color-mix(in srgb,var(--vpc-success,#34C759) 4%,transparent));border:1px solid color-mix(in srgb,var(--vpc-primary,#00A6FB) 14%,transparent);overflow-x:auto;overflow-y:hidden;overscroll-behavior-inline:contain;scrollbar-width:thin;}
      .flow-canvas{display:block;width:100%;height:auto;min-height:220px;overflow:visible;}
      .flow-line{fill:none;stroke:url(#pool-flow-gradient);stroke-width:8;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;}
      .flow-line.flow-idle{opacity:.2;stroke-dasharray:3 10;}
      .flow-line.flow-active{stroke-dasharray:12 10;animation:pool-flow-dash 1s linear infinite;filter:drop-shadow(0 0 4px color-mix(in srgb,var(--vpc-primary,#00A6FB) 50%,transparent));}
      .flow-return{stroke-width:6;opacity:.8;}
      .flow-node{outline:none;}
      .flow-node.interactive{cursor:pointer;}
      .node-panel{fill:var(--vpc-card-bg,var(--ha-card-background,var(--card-background-color,#fff)));stroke:color-mix(in srgb,var(--vpc-primary,#00A6FB) 18%,var(--divider-color,transparent));stroke-width:2;filter:drop-shadow(0 9px 14px rgba(0,0,0,.10));transition:transform .18s ease,stroke .18s ease;}
      .flow-node.interactive:hover .node-panel,.flow-node.interactive:focus-visible .node-panel{stroke:var(--vpc-primary,#00A6FB);transform:translateY(-2px);}
      .flow-node.node-active .node-panel{stroke:color-mix(in srgb,var(--vpc-success,#34C759) 55%,var(--vpc-primary,#00A6FB));}
      .node-icon-bg{fill:color-mix(in srgb,var(--vpc-primary,#00A6FB) 12%,transparent);}
      .node-active .node-icon-bg{fill:color-mix(in srgb,var(--vpc-success,#34C759) 16%,transparent);}
      .node-icon{font-size:23px;dominant-baseline:middle;}
      .node-label{font-size:12px;font-weight:750;fill:var(--primary-text-color,#1d1d1f);}
      .node-value{font-size:10px;font-weight:650;fill:var(--secondary-text-color,#68686f);text-transform:capitalize;}
      .facts-heading{display:flex;align-items:center;justify-content:space-between;padding:0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--secondary-text-color,#68686f);}
      .facts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:8px;}
      .fact{appearance:none;border:1px solid color-mix(in srgb,var(--vpc-primary,#00A6FB) 10%,var(--divider-color,transparent));background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#1d1d1f);border-radius:13px;padding:10px 11px;display:flex;align-items:center;gap:9px;text-align:left;font:inherit;min-width:0;transition:transform .16s ease,border-color .16s ease,background .16s ease;}
      .fact:not(:disabled){cursor:pointer;}
      .fact:not(:disabled):hover,.fact:not(:disabled):focus-visible{transform:translateY(-1px);border-color:color-mix(in srgb,var(--vpc-primary,#00A6FB) 45%,transparent);outline:none;}
      .fact-active{background:color-mix(in srgb,var(--vpc-success,#34C759) 10%,transparent);}
      .fact-unavailable{opacity:.48;}
      .fact-icon{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--vpc-primary,#00A6FB) 11%,transparent);color:var(--vpc-primary,#00A6FB);flex-shrink:0;}
      .fact-icon ha-icon{--mdc-icon-size:17px;}
      .fact-copy{display:flex;flex-direction:column;gap:1px;min-width:0;}
      .fact-label{font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.35px;color:var(--secondary-text-color,#68686f);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .fact-value{font-size:14px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize;}
      @keyframes pool-flow-dash{to{stroke-dashoffset:-22;}}
      @keyframes pool-status-pulse{50%{opacity:.55;transform:scale(.86);}}
      @media(max-width:600px){.diagram-header{align-items:flex-start;}.flow-status{padding:5px 8px;font-size:10px;}.flow-canvas{width:720px;max-width:none;min-height:216px;}.facts-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.title-block strong{font-size:15px;}}
      @media(prefers-reduced-motion:reduce){.flow-line.flow-active,.status-active .status-dot{animation:none!important;}.fact,.node-panel{transition:none!important;}}
    `;
  }
}

if (!customElements.get('pool-flow-diagram')) {
  customElements.define('pool-flow-diagram', PoolFlowDiagram);
}

declare global {
  interface HTMLElementTagNameMap {
    'pool-flow-diagram': PoolFlowDiagram;
  }
}
