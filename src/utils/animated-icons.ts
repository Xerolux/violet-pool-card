import { html, TemplateResult } from 'lit';

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
      ${isOn ? html`
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
        ${rays.map(angle => html`
          <rect x="22.5" y="3" width="3" height="5.5" rx="1.5"
                fill="${color}" fill-opacity="${active ? 0.75 : 0.3}"
                style="transform:rotate(${angle}deg);transform-origin:24px 24px"/>
        `)}
      </g>
      ${active ? html`
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
      ${coverWidth > 0 ? html`
        <rect x="2" y="4" width="${coverWidth}" height="40" rx="9"
              fill="${color}" fill-opacity="0.82"/>
        ${Array.from({ length: slatCount }, (_, i) => html`
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
      ${on ? html`
        <circle cx="24" cy="24" r="23" fill="${rgbStr}" fill-opacity="${0.07 + bNorm * 0.18}"
                style="will-change:opacity;animation:light-glow 2.6s ease-in-out infinite"/>
        <circle cx="24" cy="24" r="17" fill="${rgbStr}" fill-opacity="${0.09 + bNorm * 0.12}"/>
        <g style="transform-origin:24px 24px;will-change:transform;animation:spin-slow 9s linear infinite">
          ${glowRays.map(a => html`
            <line x1="24" y1="5" x2="24" y2="9" stroke="${rgbStr}"
                  stroke-width="2.2" stroke-linecap="round" stroke-opacity="${0.4 + bNorm * 0.4}"
                  style="transform:rotate(${a}deg);transform-origin:24px 24px"/>
          `)}
        </g>
      ` : html`<circle cx="24" cy="24" r="22" fill="${fallbackColor}" fill-opacity="0.07"/>`}
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
      ${active ? html`
        <circle cx="20" cy="22" r="1.5" fill="white" fill-opacity="0.6" style="will-change:transform;animation:bubble-float 2s ease-in-out infinite"/>
        <circle cx="28" cy="20" r="1.5" fill="white" fill-opacity="0.6" style="will-change:transform;animation:bubble-float 2s ease-in-out infinite 0.5s"/>
      ` : ''}
    </svg>`;
}

/**
 * Animated gauge needle for chemistry/sensor readings
 */
export function gaugeNeedleSVG(value: number, min: number, max: number, color: string): TemplateResult {
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percent = (normalizedValue - min) / (max - min);
  const rotation = percent * 180 - 90;

  return html`
    <svg viewBox="0 0 100 60" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gauge arc -->
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="8" stroke-linecap="round"/>
      <!-- Value arc -->
      <path d="M 10 50 A 40 40 0 0 1 ${10 + 80*percent} ${50 - 40*(1-Math.cos(percent*Math.PI))}"
            fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
            style="will-change:stroke-dasharray;animation:gauge-fill 0.6s ease-out forwards"/>
      <!-- Needle pivot -->
      <circle cx="50" cy="50" r="3" fill="${color}"/>
      <!-- Needle -->
      <line x1="50" y1="50" x2="50" y2="15" stroke="${color}" stroke-width="3" stroke-linecap="round"
            style="will-change:transform;transform:rotate(${rotation}deg);transform-origin:50px 50px;transition:transform 0.5s cubic-bezier(0.34,1.4,0.64,1)"/>
      <!-- Center cap -->
      <circle cx="50" cy="50" r="5" fill="${color}" fill-opacity="0.8"/>
      <circle cx="50" cy="50" r="2" fill="white"/>
    </svg>`;
}

/**
 * Animated filter pressure gauge with warning colors
 */
export function filterGaugeSVG(pressure: number, maxPressure: number, _color?: string): TemplateResult {
  void _color;
  const percent = Math.min(pressure / maxPressure, 1);
  const statusColor = percent > 0.8 ? '#FF5722' : percent > 0.6 ? '#FF9F0A' : '#34C759';

  return html`
    <svg viewBox="0 0 100 100" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer ring -->
      <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
      <!-- Background arc (full range) -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="12" stroke-linecap="round"/>
      <!-- Colored pressure arc -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="${statusColor}" stroke-width="12" stroke-linecap="round"
              stroke-dasharray="${percent * 240} 240"
              style="will-change:stroke-dasharray;transform:rotate(-90deg);transform-origin:50px 50px;transition:stroke 0.4s ease, stroke-dasharray 0.6s cubic-bezier(0.34,1.4,0.64,1)"/>
      <!-- Gauge labels -->
      <text x="20" y="55" text-anchor="middle" font-size="10" fill="rgba(0,0,0,0.4)">0</text>
      <text x="80" y="55" text-anchor="middle" font-size="10" fill="rgba(0,0,0,0.4)">${maxPressure}</text>
      <!-- Center value display -->
      <circle cx="50" cy="50" r="25" fill="white" fill-opacity="0.95"/>
      <text x="50" y="48" text-anchor="middle" font-size="20" font-weight="bold" fill="${statusColor}">${Math.round(pressure)}</text>
      <text x="50" y="60" text-anchor="middle" font-size="11" fill="rgba(0,0,0,0.5)">bar</text>
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
        return html`<circle cx="${x}" cy="${y}" r="1.5" fill="${color}" fill-opacity="0.6"/>`;
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
      ${severity === 'error' ? html`
        <circle cx="24" cy="24" r="22" fill="${color}" fill-opacity="${bgOpacity}"
                style="will-change:r,fill-opacity;animation:alert-pulse 1.5s ease-in-out infinite"/>
      ` : ''}

      <!-- Alert triangle/bell/info -->
      ${severity === 'error' ? html`
        <!-- Triangle -->
        <path d="M24,6 L42,38 L6,38 Z" fill="${color}" fill-opacity="0.9"/>
        <text x="24" y="35" text-anchor="middle" font-size="20" fill="white" font-weight="bold">!</text>
      ` : severity === 'warning' ? html`
        <!-- Bell -->
        <path d="M24,8 C20,8 16,10 16,14 L16,24 C16,28 14,30 14,32 L34,32 C34,30 32,28 32,24 L32,14 C32,10 28,8 24,8 Z"
              fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="0.5"/>
        <circle cx="24" cy="38" r="2" fill="${color}" fill-opacity="0.7"/>
      ` : html`
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
      ${open ? html`
        <circle cx="9" cy="24" r="2" fill="white" fill-opacity="0.7" style="will-change:transform;animation:flow-dot 1.2s ease-in-out infinite"/>
        <circle cx="39" cy="24" r="2" fill="white" fill-opacity="0.7" style="will-change:transform;animation:flow-dot 1.2s ease-in-out infinite 0.3s"/>
      ` : ''}
    </svg>`;
}
