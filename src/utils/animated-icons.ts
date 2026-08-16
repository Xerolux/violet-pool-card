/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Utility: Animated Icons – SVG-Animationen für Pumpe, Heizung, Solar und Poolabdeckung
 * Erstellt von Xerolux | MIT License
 */

import { html, svg, TemplateResult } from 'lit';

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Animated spinning pump impeller SVG
 * speed: 0=off, 1=ECO(slow), 2=Normal(medium), 3=Boost(fast)
 */
export function pumpSVG(speed: number, color: string): TemplateResult {
  const dur = speed === 0 ? 'none' : speed === 1 ? '3.2s' : speed === 2 ? '1.5s' : '0.62s';
  const isOn = speed > 0;
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${isOn ? 0.13 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/>
      <circle cx="24" cy="24" r="13.5" fill="none" stroke="${color}" stroke-width="0.7" stroke-opacity="0.18" stroke-dasharray="5 3"/>
      <g style="transform-origin:24px 24px;will-change:transform;animation:${dur !== 'none' ? `rotate ${dur} linear infinite` : 'none'}">
        <ellipse cx="24" cy="14" rx="4" ry="8.5" fill="${color}" fill-opacity="0.9"/>
        <ellipse cx="34" cy="24" rx="8.5" ry="4" fill="${color}" fill-opacity="0.7"/>
        <ellipse cx="24" cy="34" rx="4" ry="8.5" fill="${color}" fill-opacity="0.9"/>
        <ellipse cx="14" cy="24" rx="8.5" ry="4" fill="${color}" fill-opacity="0.7"/>
      </g>
      <circle cx="24" cy="24" r="5" fill="${color}"/>
      <circle cx="24" cy="24" r="2.5" fill="white" fill-opacity="0.9"/>
      ${isOn ? svg`
        <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="3"
          stroke-dasharray="${speed * 33} 100" stroke-opacity="0.5" stroke-linecap="round"
          transform="rotate(-90 24 24)"/>
      ` : ''}
    </svg>`;
}

/**
 * Flickering flame heater icon
 */
export function heaterSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.14 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/>
      <path d="M24,8 C17,15 12,20 14,27 C15,33 20,38 24,40 C28,38 33,33 34,27 C36,20 31,15 24,8Z"
            fill="${color}" fill-opacity="${active ? 0.88 : 0.5}"
            style="${active ? 'will-change:opacity;animation:flicker 1.9s ease-in-out infinite;transform-origin:24px 40px' : ''}"/>
      <path d="M24,19 C21,23 19,26 20,30 C21,34 22.5,37 24,38 C25.5,37 27,34 28,30 C29,26 27,23 24,19Z"
            fill="white" fill-opacity="${active ? 0.55 : 0.2}"
            style="${active ? 'animation:flicker 1.4s ease-in-out infinite 0.2s;transform-origin:24px 38px' : ''}"/>
      <ellipse cx="24" cy="39" rx="8" ry="2.5" fill="${color}" fill-opacity="${active ? 0.28 : 0.1}"/>
    </svg>`;
}

/**
 * Animated solar sun with rotating rays
 */
export function solarSVG(active: boolean, color: string): TemplateResult {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.13 : 0.07}"/>
      <g style="transform-origin:24px 24px;will-change:transform;animation:${active ? 'spin-slow 14s linear infinite' : 'none'}">
        ${rays.map(angle => svg`
          <rect x="22.5" y="3" width="3" height="5.5" rx="1.5"
                fill="${color}" fill-opacity="${active ? 0.75 : 0.3}"
                style="transform:rotate(${angle}deg);transform-origin:24px 24px"/>
        `)}
      </g>
      ${active ? svg`
        <circle cx="24" cy="24" r="14" fill="none" stroke="${color}" stroke-width="1.5"
          stroke-opacity="0.35" style="will-change:transform;animation:breathe 2.8s ease-in-out infinite"/>
      ` : ''}
      <circle cx="24" cy="24" r="10.5" fill="${color}" fill-opacity="${active ? 0.9 : 0.45}"/>
      <circle cx="24" cy="24" r="7" fill="white" fill-opacity="${active ? 0.5 : 0.22}"/>
    </svg>`;
}

/**
 * Pool cover top-down view with sliding cover panel
 * position: 0=closed, 100=open
 */
export function coverSVG(position: number, isMoving: boolean, color: string): TemplateResult {
  const coverWidth = Math.round((1 - Math.max(0, Math.min(100, position)) / 100) * 72);
  const slatCount = Math.min(Math.floor(coverWidth / 7), 11);

  return html`
    <svg viewBox="0 0 90 48" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">
      <!-- Pool shell -->
      <rect x="2" y="4" width="76" height="40" rx="9" fill="rgba(0,160,255,0.1)"
            stroke="${color}" stroke-width="1.5" stroke-opacity="0.35"/>
      <!-- Water texture -->
      <path d="M8,19 C17,15 27,23 37,19 C47,15 57,23 67,19 C71,17 74,19 77,19"
            fill="none" stroke="rgba(0,150,255,0.45)" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M8,29 C17,25 27,33 37,29 C47,25 57,33 67,29 C71,27 74,29 77,29"
            fill="none" stroke="rgba(0,150,255,0.25)" stroke-width="1.1" stroke-linecap="round"/>
      <!-- Cover panel -->
      ${coverWidth > 0 ? svg`
        <rect x="2" y="4" width="${coverWidth}" height="40" rx="9"
              fill="${color}" fill-opacity="0.82"/>
        ${Array.from({ length: slatCount }, (_, i) => svg`
          <line x1="${9 + i * 7}" y1="6" x2="${9 + i * 7}" y2="42"
                stroke="white" stroke-width="0.6" stroke-opacity="0.22"/>
        `)}
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
export function lightSVG(on: boolean, rgb: [number, number, number] | null, brightness: number, fallbackColor: string): TemplateResult {
  const rgbStr = rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : fallbackColor;
  const bNorm = on ? brightness / 255 : 0;
  const glowRays = [0, 60, 120, 180, 240, 300];

  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      ${on ? svg`
        <circle cx="24" cy="24" r="23" fill="${rgbStr}" fill-opacity="${0.07 + bNorm * 0.18}"
                style="will-change:opacity;animation:light-glow 2.6s ease-in-out infinite"/>
        <circle cx="24" cy="24" r="17" fill="${rgbStr}" fill-opacity="${0.09 + bNorm * 0.12}"/>
        <g style="transform-origin:24px 24px;will-change:transform;animation:spin-slow 9s linear infinite">
          ${glowRays.map(a => svg`
            <line x1="24" y1="5" x2="24" y2="9" stroke="${rgbStr}"
                  stroke-width="2.2" stroke-linecap="round" stroke-opacity="${0.4 + bNorm * 0.4}"
                  style="transform:rotate(${a}deg);transform-origin:24px 24px"/>
          `)}
        </g>
      ` : svg`<circle cx="24" cy="24" r="22" fill="${fallbackColor}" fill-opacity="0.07"/>`}
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
export function dosingDropletSVG(active: boolean, level: number, color: string): TemplateResult {
  const scale = Math.max(0.3, Math.min(1, level / 100));
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.15 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/>
      <!-- Water droplet -->
      <path d="M24,8 C18,15 14,20 14,26 C14,32.6 18.6,38 24,38 C29.4,38 34,32.6 34,26 C34,20 30,15 24,8Z"
            fill="${color}" fill-opacity="${active ? 0.8 : 0.4}"
            style="will-change:transform;${active ? 'animation:droplet-pulse 1.5s ease-in-out infinite' : ''}"/>
      <!-- Level fill -->
      <rect x="14" y="${28 - 8*scale}" width="20" height="${8*scale}" rx="10"
            fill="${color}" fill-opacity="0.5"
            style="will-change:height;animation:${active ? 'fill-rise 2s ease-in-out infinite' : ''}"/>
      <!-- Bubbles -->
      ${active ? svg`
        <circle cx="20" cy="22" r="1.5" fill="white" fill-opacity="0.6" style="will-change:transform;animation:bubble-float 2s ease-in-out infinite"/>
        <circle cx="28" cy="20" r="1.5" fill="white" fill-opacity="0.6" style="will-change:transform;animation:bubble-float 2s ease-in-out infinite 0.5s"/>
      ` : ''}
    </svg>`;
}

/**
 * Animated water temperature glyph with wave motion
 */
export function waterThermometerSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.14 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.34"/>
      <path d="M15,29 C18,26 20,20 20,14 C20,11.3 22.2,9 25,9 C27.8,9 30,11.3 30,14 C30,20 32,26 35,29"
            fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="23" y="14" width="4" height="15" rx="2" fill="${color}" fill-opacity="${active ? 0.75 : 0.5}"/>
      <circle cx="25" cy="33" r="6" fill="${color}" fill-opacity="${active ? 0.88 : 0.55}"/>
      <path d="M9,37 C13,34 17,40 21,37 C25,34 29,40 33,37 C36,35 39,37 41,37"
            fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-opacity="${active ? 0.6 : 0.35}"
            style="${active ? 'animation:wave-drift 2.2s ease-in-out infinite' : ''}"/>
      <path d="M9,41 C13,38 17,44 21,41 C25,38 29,44 33,41 C36,39 39,41 41,41"
            fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-opacity="${active ? 0.3 : 0.18}"
            style="${active ? 'animation:wave-drift 2.2s ease-in-out infinite 0.4s' : ''}"/>
    </svg>`;
}

/**
 * Animated pH chemistry icon
 */
export function phOrbSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.13 : 0.06}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.34"/>
      <circle cx="24" cy="24" r="12.5" fill="${color}" fill-opacity="${active ? 0.18 : 0.1}"
              style="${active ? 'animation:breathe 2.6s ease-in-out infinite' : ''}"/>
      <path d="M14,25 C18,20 21,15 24,10 C27,15 30,20 34,25 C34,31 29.5,36 24,36 C18.5,36 14,31 14,25Z"
            fill="${color}" fill-opacity="${active ? 0.82 : 0.58}"/>
      <path d="M17,26 C19.7,22.4 21.7,18.5 24,14.7 C26.3,18.5 28.3,22.4 31,26"
            fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-opacity="${active ? 0.8 : 0.55}"/>
      <text x="24" y="30.2" text-anchor="middle" font-size="8.5" font-weight="700" fill="white" opacity="0.92">pH</text>
      ${active ? svg`
        <circle cx="15.5" cy="17" r="1.5" fill="white" fill-opacity="0.55" style="animation:bubble-float 1.9s ease-in-out infinite"/>
        <circle cx="33" cy="18.5" r="1.2" fill="white" fill-opacity="0.4" style="animation:bubble-float 2.2s ease-in-out infinite 0.35s"/>
      ` : ''}
    </svg>`;
}

/**
 * Animated chlorine chemistry icon
 */
export function chlorineOrbSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.13 : 0.06}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.34"/>
      <path d="M24,10 C18,16 14,20.5 14,27 C14,33 18.4,38 24,38 C29.6,38 34,33 34,27 C34,20.5 30,16 24,10Z"
            fill="${color}" fill-opacity="${active ? 0.84 : 0.58}"/>
      <text x="24" y="28.5" text-anchor="middle" font-size="8.5" font-weight="700" fill="white" opacity="0.94">Cl</text>
      <path d="M19.5,17.5 C21.8,15.7 26.2,15.7 28.5,17.5" fill="none" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
      ${active ? svg`
        <circle cx="16" cy="19" r="1.4" fill="white" fill-opacity="0.52" style="animation:bubble-float 1.8s ease-in-out infinite"/>
        <circle cx="31.5" cy="16.5" r="1.3" fill="white" fill-opacity="0.42" style="animation:bubble-float 2s ease-in-out infinite 0.45s"/>
        <circle cx="35" cy="24" r="3.5" fill="none" stroke="${color}" stroke-width="1.2" stroke-opacity="0.35"
                style="animation:ring-pulse 2s ease-out infinite"/>
      ` : ''}
    </svg>`;
}

/**
 * Animated salt crystal icon
 */
export function saltCrystalSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.12 : 0.06}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.34"/>
      <polygon points="24,10 31,16 31,26 24,32 17,26 17,16" fill="${color}" fill-opacity="${active ? 0.86 : 0.58}"/>
      <polygon points="24,15 27.8,18.2 27.8,23.8 24,27 20.2,23.8 20.2,18.2" fill="white" fill-opacity="${active ? 0.34 : 0.18}"/>
      <path d="M10,35 L16,28 M38,35 L32,28 M24,37 L24,31" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-opacity="${active ? 0.68 : 0.35}"/>
      ${active ? svg`
        <path d="M24,7 L24,11 M14,14 L17,17 M34,14 L31,17" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.55"
              style="animation:light-glow 2.4s ease-in-out infinite"/>
      ` : ''}
    </svg>`;
}

/**
 * Animated ORP / redox icon
 */
export function orpEnergySVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.12 : 0.06}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.34"/>
      <path d="M26,9 L16,26 H23 L21,39 L32,21 H25 Z"
            fill="${color}" fill-opacity="${active ? 0.9 : 0.62}"/>
      ${active ? svg`
        <circle cx="24" cy="24" r="14.5" fill="none" stroke="${color}" stroke-width="1.2" stroke-opacity="0.28"
                style="animation:ring-pulse 1.9s ease-out infinite"/>
      ` : ''}
    </svg>`;
}

/** Options for {@link chemGaugeSVG}. */
export interface ChemGaugeOptions {
  /** Measured value. `undefined` renders the gauge in an empty "no data" state. */
  value?: number;
  /** Displayed scale as [from, to]. */
  range: [number, number];
  /** Optimal zone highlighted on the arc as [from, to]. */
  ideal?: [number, number];
  /** Arc / needle / value colour. */
  color: string;
  /** Unit printed next to the value (e.g. `mV`). */
  unit?: string;
  /** Decimals used for the value and the scale labels. */
  decimals?: number;
  /** Accessible description of the reading. */
  ariaLabel?: string;
}

/**
 * Geometry of the gauge: a semicircle around (50,46) with radius 34 inside a
 * 100×76 viewBox. The bottom strip is reserved for the numeric reading, so the
 * needle never overlaps the value.
 */
const GAUGE_CX = 50;
const GAUGE_CY = 46;
const GAUGE_R = 34;

/**
 * Point on the gauge arc for a fraction 0..1 (0 = left end, 1 = right end).
 * Exported so the geometry can be unit-tested without a DOM.
 */
export function gaugePoint(fraction: number, radius = GAUGE_R): { x: number; y: number } {
  // The arc sweeps from 180° (left) to 0° (right) in SVG coordinates.
  const angle = Math.PI * (1 - clamp01(fraction));
  return {
    x: GAUGE_CX + radius * Math.cos(angle),
    y: GAUGE_CY - radius * Math.sin(angle),
  };
}

/**
 * Arc path between two fractions of the gauge sweep.
 *
 * The full sweep is a semicircle, so any segment of it is at most 180° and the
 * large-arc flag is always 0. Setting it from `to - from > 0.5` made every
 * reading past the midpoint take the long way round the circle.
 */
function gaugeArc(from: number, to: number, radius = GAUGE_R): string {
  const start = gaugePoint(from, radius);
  const end = gaugePoint(to, radius);
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

/**
 * Half-circle gauge for chemistry readings (pH, ORP, …).
 *
 * Renders the scale, the optimal zone, a value arc, a needle and — crucially —
 * the numeric value itself, so the tile is readable without a tooltip.
 */
export function chemGaugeSVG(options: ChemGaugeOptions): TemplateResult {
  const { range, ideal, color, unit = '', decimals = 1, ariaLabel } = options;
  const [min, max] = range;
  const span = max - min;
  const hasValue = options.value !== undefined && Number.isFinite(options.value);

  const fractionOf = (v: number) => (span > 0 ? clamp01((v - min) / span) : 0);
  const fraction = hasValue ? fractionOf(options.value as number) : 0;

  // The needle is drawn pointing straight up and rotated into place, because
  // `transform` transitions smoothly in every browser while `x2`/`y2` do not.
  const rotation = fraction * 180 - 90;
  const needleLength = GAUGE_R - 5;

  const idealFrom = ideal ? fractionOf(Math.min(ideal[0], ideal[1])) : undefined;
  const idealTo = ideal ? fractionOf(Math.max(ideal[0], ideal[1])) : undefined;
  const hasIdeal = idealFrom !== undefined && idealTo !== undefined && idealTo - idealFrom > 0.001;

  const label = ariaLabel
    ?? (hasValue ? `${(options.value as number).toFixed(decimals)}${unit ? ` ${unit}` : ''}` : 'Keine Daten');

  const scaleLabel = 'var(--vpc-text-tertiary, rgba(60,60,67,0.45))';

  return html`
    <svg viewBox="0 0 100 76" style="width:100%;height:100%;display:block"
         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" font-family="inherit">
      <!-- Scale -->
      <path d="${gaugeArc(0, 1)}" fill="none" stroke-width="7" stroke-linecap="round"
            style="stroke:var(--vpc-gauge-track, rgba(120,120,128,0.18))"/>

      <!-- Value arc -->
      ${hasValue && fraction > 0.004 ? svg`
        <path d="${gaugeArc(0, fraction)}" fill="none" stroke-width="7" stroke-linecap="round"
              style="stroke:${color};transition:stroke 0.3s ease"/>
      ` : ''}

      <!-- Optimal zone, drawn inside the main arc so the value arc can never
           cover it – that is what made the target band disappear at high readings -->
      ${hasIdeal ? svg`
        <path d="${gaugeArc(idealFrom as number, idealTo as number, GAUGE_R - 6.5)}" fill="none"
              stroke-width="3" stroke-linecap="butt"
              style="stroke:var(--vpc-success, #34C759)"/>
      ` : ''}

      <!-- Needle -->
      ${hasValue ? svg`
        <line x1="${GAUGE_CX}" y1="${GAUGE_CY}" x2="${GAUGE_CX}" y2="${GAUGE_CY - needleLength}"
              stroke-width="2.6" stroke-linecap="round"
              transform="rotate(${rotation.toFixed(2)} ${GAUGE_CX} ${GAUGE_CY})"
              style="stroke:${color};transition:transform 0.5s cubic-bezier(0.34,1.4,0.64,1),stroke 0.3s ease"/>
        <circle cx="${GAUGE_CX}" cy="${GAUGE_CY}" r="4.2" style="fill:${color}"/>
        <circle cx="${GAUGE_CX}" cy="${GAUGE_CY}" r="1.7" style="fill:var(--vpc-bg, #fff)"/>
      ` : svg`
        <circle cx="${GAUGE_CX}" cy="${GAUGE_CY}" r="4.2" style="fill:var(--vpc-gauge-track, rgba(120,120,128,0.18))"/>
      `}

      <!-- Scale end labels -->
      <text x="3" y="55" text-anchor="start" font-size="7.5" style="fill:${scaleLabel}">${min.toFixed(decimals)}</text>
      <text x="97" y="55" text-anchor="end" font-size="7.5" style="fill:${scaleLabel}">${max.toFixed(decimals)}</text>

      <!-- Reading -->
      <text x="${GAUGE_CX}" y="72" text-anchor="middle" font-size="19" font-weight="700"
            style="fill:${hasValue ? color : scaleLabel}" letter-spacing="-0.5"
        >${hasValue ? (options.value as number).toFixed(decimals) : '--'}${unit ? svg`<tspan font-size="9" font-weight="600" style="fill:${scaleLabel}" dx="2">${unit}</tspan>` : ''}</text>
    </svg>`;
}

/**
 * Backwards-compatible wrapper around {@link chemGaugeSVG}.
 * @deprecated Prefer `chemGaugeSVG` – it also renders the value and the optimal zone.
 */
export function gaugeNeedleSVG(value: number, min: number, max: number, color: string): TemplateResult {
  return chemGaugeSVG({ value, range: [min, max], color });
}

/**
 * Animated filter pressure gauge with warning colors
 */
export function filterGaugeSVG(pressure: number, maxPressure: number): TemplateResult {
  const safeMax = maxPressure > 0 ? maxPressure : 1;
  const percent = clamp01(pressure / safeMax);
  const statusColor = percent > 0.8 ? '#FF5722' : percent > 0.6 ? '#FF9F0A' : '#34C759';

  // Actual circumference of the r=40 ring – the old hard-coded 240 made the
  // arc overshoot the scale by ~5%.
  const circumference = 2 * Math.PI * 40;
  const dash = percent * circumference;
  const muted = 'var(--vpc-text-tertiary, rgba(60,60,67,0.45))';

  return html`
    <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg"
         role="img" aria-label="${pressure.toFixed(2)} von ${safeMax} bar" font-family="inherit">
      <!-- Outer ring -->
      <circle cx="50" cy="50" r="48" fill="none" stroke-width="2" style="stroke:var(--vpc-gauge-track, rgba(120,120,128,0.18))"/>
      <!-- Background arc (full range) -->
      <circle cx="50" cy="50" r="40" fill="none" stroke-width="12" stroke-linecap="round" style="stroke:var(--vpc-gauge-track, rgba(120,120,128,0.18))"/>
      <!-- Colored pressure arc -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="${statusColor}" stroke-width="12" stroke-linecap="round"
              stroke-dasharray="${dash.toFixed(2)} ${circumference.toFixed(2)}"
              style="will-change:stroke-dasharray;transform:rotate(-90deg);transform-origin:50px 50px;transition:stroke 0.4s ease, stroke-dasharray 0.6s cubic-bezier(0.34,1.4,0.64,1)"/>
      <!-- Center value display: inherits the card background so it works in dark themes -->
      <circle cx="50" cy="50" r="25" style="fill:var(--vpc-bg, #fff)"/>
      <text x="50" y="50" text-anchor="middle" font-size="20" font-weight="700" fill="${statusColor}">${pressure.toFixed(pressure < 10 ? 1 : 0)}</text>
      <text x="50" y="62" text-anchor="middle" font-size="10" style="fill:${muted}">bar</text>
      <!-- Scale ends -->
      <text x="50" y="88" text-anchor="middle" font-size="9" style="fill:${muted}">0 – ${safeMax} bar</text>
    </svg>`;
}

/**
 * Animated chart/graph for sensor data
 */
export function chartSVG(values: number[], color: string): TemplateResult {
  if (!values || values.length === 0) values = [0];

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * 80 + 10;
    const y = 70 - ((v - min) / range) * 50;
    return `${x},${y}`;
  }).join(' ');

  return html`
    <svg viewBox="0 0 100 80" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid -->
      <line x1="10" y1="70" x2="90" y2="70" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/>
      <!-- Chart line -->
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="will-change:stroke-dasharray;animation:line-draw 1.2s ease-out forwards;stroke-dasharray:${values.length*2} ${values.length*2}"/>
      <!-- Area under line -->
      <polygon points="10,70 ${points} 90,70" fill="${color}" fill-opacity="0.1"/>
      <!-- Data points -->
      ${values.map((v, i) => {
        const x = (i / (values.length - 1 || 1)) * 80 + 10;
        const y = 70 - ((v - min) / range) * 50;
        return svg`<circle cx="${x}" cy="${y}" r="1.5" fill="${color}" fill-opacity="0.6"/>`;
      })}
    </svg>`;
}

/**
 * Animated alert/notification icon with pulse
 */
export function alertPulseSVG(severity: 'info' | 'warning' | 'error', color: string): TemplateResult {
  const bgOpacity = severity === 'error' ? 0.15 : severity === 'warning' ? 0.12 : 0.08;

  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <!-- Pulsing background circles -->
      ${severity === 'error' ? svg`
        <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${bgOpacity}"
                style="will-change:r,fill-opacity;animation:alert-pulse 1.5s ease-in-out infinite"/>
      ` : ''}

      <!-- Alert triangle/bell/info -->
      ${severity === 'error' ? svg`
        <!-- Triangle -->
        <path d="M24,6 L42,38 L6,38 Z" fill="${color}" fill-opacity="0.9"/>
        <text x="24" y="35" text-anchor="middle" font-size="20" fill="white" font-weight="bold">!</text>
      ` : severity === 'warning' ? svg`
        <!-- Bell -->
        <path d="M24,8 C20,8 16,10 16,14 L16,24 C16,28 14,30 14,32 L34,32 C34,30 32,28 32,24 L32,14 C32,10 28,8 24,8 Z"
              fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="0.5"/>
        <circle cx="24" cy="38" r="2" fill="${color}" fill-opacity="0.7"/>
      ` : svg`
        <!-- Info circle -->
        <circle cx="24" cy="24" r="18" fill="none" stroke="${color}" stroke-width="2" stroke-opacity="0.8"/>
        <circle cx="24" cy="16" r="1.5" fill="${color}"/>
        <text x="24" y="30" text-anchor="middle" font-size="10" fill="${color}" font-weight="bold">i</text>
      `}

      <!-- Outer pulse ring -->
      <circle cx="24" cy="24" r="22" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0"
              style="will-change:r,stroke-opacity;animation:ring-pulse 1.8s ease-out infinite"/>
    </svg>`;
}

/**
 * Valve / pipe icon for fill/drain valves
 */
export function valveSVG(open: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${open ? 0.13 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/>
      <!-- Pipe horizontal -->
      <rect x="4" y="20" width="16" height="8" rx="4" fill="${color}" fill-opacity="0.7"/>
      <rect x="28" y="20" width="16" height="8" rx="4" fill="${color}" fill-opacity="0.7"/>
      <!-- Valve body -->
      <rect x="18" y="16" width="12" height="16" rx="3" fill="${color}" fill-opacity="0.85"/>
      <!-- Valve handle -->
      <rect x="22" y="8" width="4" height="10" rx="2" fill="${color}" fill-opacity="0.9"
            style="will-change:transform;transform:rotate(${open ? 0 : 90}deg);transform-origin:24px 18px;transition:transform 0.4s ease"/>
      <rect x="17" y="7" width="14" height="3" rx="1.5" fill="${color}" fill-opacity="0.75"
            style="will-change:transform;transform:rotate(${open ? 0 : 90}deg);transform-origin:24px 8.5px;transition:transform 0.4s ease"/>
      <!-- Flow indicator -->
      ${open ? svg`
        <circle cx="9" cy="24" r="2" fill="white" fill-opacity="0.7" style="will-change:transform;animation:flow-dot 1.2s ease-in-out infinite"/>
        <circle cx="39" cy="24" r="2" fill="white" fill-opacity="0.7" style="will-change:transform;animation:flow-dot 1.2s ease-in-out infinite 0.3s"/>
      ` : ''}
    </svg>`;
}

/**
 * Animated backwash icon
 */
export function backwashSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.15 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.38"/>
      <circle cx="24" cy="24" r="10" fill="none" stroke="${color}" stroke-width="1.4" stroke-opacity="0.24"/>
      <!-- Arrows forming a circle to represent backwash -->
      <path d="M24,12 A12,12 0 1,1 12,24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"
            style="${active ? 'animation:spin-slow 3.2s linear infinite;transform-origin:24px 24px' : ''}"/>
      <polygon points="12,24 8,18 16,18" fill="${color}" />
      <path d="M24,36 A12,12 0 1,1 36,24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"
            style="${active ? 'animation:spin-slow 3.2s linear infinite reverse;transform-origin:24px 24px' : ''}"/>
      <polygon points="36,24 40,30 32,30" fill="${color}" />
    </svg>`;
}

/**
 * Refill icon
 */
export function refillSVG(level: number, maxLevel: number, color: string): TemplateResult {
  const percent = Math.min(level / maxLevel, 1);
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="0.12"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.32"/>
      <rect x="17" y="14" width="14" height="20" rx="4" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="18.5" y="${34 - 18 * percent}" width="11" height="${18 * percent}" rx="3" fill="${color}" fill-opacity="0.72"/>
      <path d="M34,14 C37,16 39,18 39,22 C39,25.8 36.5,28.5 33.5,29.5"
            fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      <path d="M35,15 L39,14 L38,18" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      ${percent < 0.45 ? svg`
        <path d="M12,37 C15,34 18,40 21,37 C24,34 27,40 30,37" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.55"
              style="animation:wave-drift 2.1s ease-in-out infinite"/>
      ` : ''}
    </svg>`;
}

/**
 * Overflow protection icon – alerts when water level exceeds threshold
 */
export function overflowSVG(waterLevel: number, maxLevel: number, overflowEnabled: boolean, color: string): TemplateResult {
  const percent = Math.min(waterLevel / maxLevel, 1.2);
  const isOverflowing = percent > 1;
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${isOverflowing ? 0.25 : 0.12}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.32"/>
      <!-- Container -->
      <rect x="16" y="12" width="16" height="24" rx="3" fill="none" stroke="${color}" stroke-width="2"/>
      <!-- Water level indicator -->
      <rect x="17.5" y="${35 - 22 * Math.min(percent, 1)}" width="13" height="${22 * Math.min(percent, 1)}" rx="2" fill="${color}" fill-opacity="0.65"/>
      <!-- Warning triangle for overflow -->
      ${isOverflowing ? svg`
        <path d="M24,8 L28,14 L20,14 Z" fill="${color}" fill-opacity="0.9"/>
        <circle cx="24" cy="10" r="1.2" fill="white" fill-opacity="0.8"/>
        <path d="M24,11 L24,12.5" stroke="white" stroke-width="0.8" stroke-opacity="0.8"/>
      ` : ''}
      <!-- Overflow waves animation when enabled -->
      ${overflowEnabled && isOverflowing ? svg`
        <path d="M16,12 C19,10 22,14 25,12 C28,10 31,14 34,12" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.7"
              style="animation:wave-pulse 0.8s ease-in-out infinite"/>
      ` : ''}
    </svg>`;
}

/**
 * Solar surplus icon
 */
export function solarSurplusSVG(hasSurplus: boolean, _isExporting: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${hasSurplus ? 0.15 : 0.07}"/>
      <circle cx="24" cy="24" r="12" fill="${color}" fill-opacity="0.8"/>
      <!-- Rays -->
      ${[0,45,90,135,180,225,270,315].map(deg => svg`
        <line x1="24" y1="8" x2="24" y2="4" stroke="${color}" stroke-width="2" style="transform:rotate(${deg}deg);transform-origin:24px 24px;"/>
      `)}
    </svg>`;
}

/**
 * Flow rate icon
 */
export function flowRateSVG(_flow: number, _maxFlow: number, color: string): TemplateResult {
  const active = _flow > 0;
  const waveOpacity = active ? 0.95 : 0.45;
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.12 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.3"/>
      <path d="M9,22 C13,18 17,26 21,22 C25,18 29,26 33,22 C36,20 38,22 39,22" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-opacity="${waveOpacity}"
            style="${active ? 'animation:wave-drift 1.6s ease-in-out infinite' : ''}"/>
      <path d="M9,28 C13,24 17,32 21,28 C25,24 29,32 33,28 C36,26 38,28 39,28" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-opacity="${active ? 0.7 : 0.3}"
            style="${active ? 'animation:wave-drift 1.6s ease-in-out infinite 0.25s' : ''}"/>
      ${active ? svg`
        <circle cx="15" cy="17" r="1.4" fill="white" fill-opacity="0.55" style="animation:bubble-float 1.7s ease-in-out infinite"/>
        <circle cx="31" cy="16" r="1.2" fill="white" fill-opacity="0.4" style="animation:bubble-float 2s ease-in-out infinite 0.35s"/>
      ` : ''}
    </svg>`;
}

/**
 * Inlet icon
 */
export function inletSVG(isInflowing: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${isInflowing ? 0.15 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.3"/>
      <rect x="9" y="20" width="16" height="8" rx="4" fill="${color}" fill-opacity="0.72" />
      <path d="M25,24 H38" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <path d="M33,18 L39,24 L33,30" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      ${isInflowing ? svg`
        <circle cx="15" cy="24" r="2" fill="white" fill-opacity="0.75" style="animation:flow-dot 1.1s ease-in-out infinite"/>
        <circle cx="22" cy="24" r="2" fill="white" fill-opacity="0.6" style="animation:flow-dot 1.1s ease-in-out infinite 0.25s"/>
      ` : ''}
    </svg>`;
}

/**
 * Counter current icon
 */
export function counterCurrentSVG(isActive: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${isActive ? 0.15 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.3"/>
      <!-- Two opposite arrows -->
      <path d="M14,18 H32 M32,18 L27.5,13.5 M32,18 L27.5,22.5" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
            style="${isActive ? 'animation:wave-drift 1.4s ease-in-out infinite' : ''}"/>
      <path d="M34,30 H16 M16,30 L20.5,25.5 M16,30 L20.5,34.5" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
            style="${isActive ? 'animation:wave-drift 1.4s ease-in-out infinite reverse' : ''}"/>
      ${isActive ? svg`<circle cx="24" cy="24" r="4.5" fill="${color}" fill-opacity="0.18" style="animation:breathe 1.8s ease-in-out infinite"/>` : ''}
    </svg>`;
}

/**
 * Automation / rules icon
 */
export function automationRulesSVG(activeCount: number, color: string): TemplateResult {
  const intensity = clamp01(activeCount / 7);
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${0.07 + intensity * 0.08}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.32"/>
      <rect x="10" y="13" width="10" height="8" rx="3" fill="${color}" fill-opacity="0.86"/>
      <rect x="28" y="13" width="10" height="8" rx="3" fill="${color}" fill-opacity="0.86"/>
      <rect x="19" y="27" width="10" height="8" rx="3" fill="${color}" fill-opacity="0.86"/>
      <path d="M20,17 H28 M24,17 V27" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.9"/>
      ${activeCount > 0 ? svg`
        <circle cx="24" cy="24" r="15" fill="none" stroke="${color}" stroke-width="1.1" stroke-opacity="0.24" style="animation:ring-pulse 2.2s ease-out infinite"/>
      ` : ''}
    </svg>`;
}

/**
 * Diagnostics / health icon
 */
export function diagnosticsPulseSVG(active: boolean, color: string): TemplateResult {
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${active ? 0.12 : 0.07}"/>
      <circle cx="24" cy="24" r="21" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.32"/>
      <rect x="11" y="12" width="26" height="24" rx="6" fill="none" stroke="${color}" stroke-width="2"/>
      <path d="M14,25 H19 L22,19 L26,29 L29,23 H34" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
            style="${active ? 'animation:breathe 1.8s ease-in-out infinite' : ''}"/>
      <circle cx="34.5" cy="14.5" r="2.5" fill="${color}" fill-opacity="${active ? 0.88 : 0.45}"/>
    </svg>`;
}

/**
 * Chlorine Canister icon
 */
export function chlorineCanisterSVG(_level: number, _maxLevel: number, color: string): TemplateResult {
  const fill = clamp01((_maxLevel > 0 ? _level / _maxLevel : 0.66));
  const fillY = 34 - (18 * fill);
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="0.11"/>
      <rect x="16" y="10" width="16" height="28" rx="4" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="19" y="8" width="10" height="4" rx="1.8" fill="${color}" fill-opacity="0.78"/>
      <rect x="17.5" y="${fillY}" width="13" height="${18 * fill}" rx="3" fill="${color}" fill-opacity="0.55"/>
      <path d="M18.5,24 C21,21 23.5,17 24,15.5 C24.5,17 27,21 29.5,24 C29.5,27.3 27,30 24,30 C21,30 18.5,27.3 18.5,24Z"
            fill="${color}" fill-opacity="0.82"/>
      <text x="24" y="35" text-anchor="middle" font-size="7.4" font-weight="700" fill="${color}">Cl</text>
    </svg>`;
}

/**
 * pH Plus Canister icon
 */
export function phPlusCanisterSVG(_level: number, _maxLevel: number, color: string): TemplateResult {
  const fill = clamp01((_maxLevel > 0 ? _level / _maxLevel : 0.66));
  const fillY = 34 - (18 * fill);
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="0.11"/>
      <rect x="16" y="10" width="16" height="28" rx="4" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="19" y="8" width="10" height="4" rx="1.8" fill="${color}" fill-opacity="0.78"/>
      <rect x="17.5" y="${fillY}" width="13" height="${18 * fill}" rx="3" fill="${color}" fill-opacity="0.52"/>
      <path d="M24,16 C21.8,19.6 19.8,22.2 18.5,25 C18.5,28.1 20.9,30.5 24,30.5 C27.1,30.5 29.5,28.1 29.5,25 C28.2,22.2 26.2,19.6 24,16Z"
            fill="${color}" fill-opacity="0.78"/>
      <path d="M24,20 L24,27 M20.5,23.5 L27.5,23.5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;
}

/**
 * pH Minus Canister icon
 */
export function phMinusCanisterSVG(_level: number, _maxLevel: number, color: string): TemplateResult {
  const fill = clamp01((_maxLevel > 0 ? _level / _maxLevel : 0.66));
  const fillY = 34 - (18 * fill);
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="0.11"/>
      <rect x="16" y="10" width="16" height="28" rx="4" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="19" y="8" width="10" height="4" rx="1.8" fill="${color}" fill-opacity="0.78"/>
      <rect x="17.5" y="${fillY}" width="13" height="${18 * fill}" rx="3" fill="${color}" fill-opacity="0.52"/>
      <path d="M24,16 C21.8,19.6 19.8,22.2 18.5,25 C18.5,28.1 20.9,30.5 24,30.5 C27.1,30.5 29.5,28.1 29.5,25 C28.2,22.2 26.2,19.6 24,16Z"
            fill="${color}" fill-opacity="0.78"/>
      <path d="M20.5,23.5 L27.5,23.5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;
}

/**
 * Flocculant Canister icon
 */
export function flocculantCanisterSVG(_level: number, _maxLevel: number, color: string): TemplateResult {
  const fill = clamp01((_maxLevel > 0 ? _level / _maxLevel : 0.66));
  const fillY = 34 - (18 * fill);
  return html`
    <svg viewBox="0 0 48 48" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="0.11"/>
      <rect x="16" y="10" width="16" height="28" rx="4" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="19" y="8" width="10" height="4" rx="1.8" fill="${color}" fill-opacity="0.78"/>
      <rect x="17.5" y="${fillY}" width="13" height="${18 * fill}" rx="3" fill="${color}" fill-opacity="0.5"/>
      <circle cx="20" cy="23" r="2.1" fill="${color}" fill-opacity="0.82"/>
      <circle cx="28" cy="21.5" r="1.8" fill="${color}" fill-opacity="0.72"/>
      <circle cx="24.5" cy="27" r="2.6" fill="${color}" fill-opacity="0.9"/>
    </svg>`;
}
