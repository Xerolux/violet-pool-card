import { css } from 'lit';

/**
 * Reusable component-specific styles extracted from inline CSS
 */

/**
 * Card base styling - for ha-card elements
 */
export const cardBaseStyles = css`
  ha-card {
    font-family: var(--vpc-font);
    padding: var(--vpc-spacing);
    background: var(--vpc-bg);
    border-radius: var(--vpc-radius);
    box-shadow: var(--vpc-shadow);
    border: var(--vpc-border);
    backdrop-filter: var(--vpc-backdrop);
    -webkit-backdrop-filter: var(--vpc-backdrop);
    transition: transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1),
      box-shadow 0.22s ease;
    overflow: visible;
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  ha-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.11), 0 2px 6px rgba(0, 0, 0, 0.05);
    will-change: transform, box-shadow;
  }

  ha-card:active {
    transform: scale(0.985);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }
`;

/**
 * Button and interactive element styles
 */
export const buttonStyles = css`
  button {
    padding: var(--ds-spacing-sm) var(--ds-spacing-md);
    border: none;
    border-radius: var(--ds-radius-sm);
    font-size: var(--ds-font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 44px;
    -webkit-tap-highlight-color: transparent;
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    will-change: transform, box-shadow;
  }

  button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:focus {
    outline: 2px solid var(--ds-color-primary);
    outline-offset: 2px;
  }
`;

/**
 * Icon animation styles
 */
export const iconAnimationStyles = css`
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.65;
      transform: scale(0.95);
    }
  }

  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.85;
    }
  }

  @keyframes flicker {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  @keyframes light-glow {
    0%,
    100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes flow-dot {
    0% {
      transform: translateX(-8px);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(8px);
      opacity: 0;
    }
  }

  @keyframes neon-flow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }
`;

/**
 * Header and title styles
 */
export const headerStyles = css`
  .header {
    display: flex;
    align-items: center;
    gap: var(--ds-spacing-lg);
  }

  .header-icon {
    width: 46px;
    height: 46px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 12%, transparent);
    transition: background 0.25s ease, box-shadow 0.25s ease;
    flex-shrink: 0;
  }

  .header-icon.icon-active {
    background: color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 18%, transparent);
    box-shadow: 0 0 0 5px color-mix(in srgb, var(--icon-accent, var(--vpc-primary)) 8%, transparent);
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
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.3px;
    color: var(--vpc-text);
    line-height: 1.25;
  }

  .header-subtitle {
    font-size: 13px;
    font-weight: 400;
    color: var(--vpc-text-secondary);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
    min-width: 0;
  }
`;

/**
 * Grid layout styles for chemistry and device lists
 */
export const gridLayoutStyles = css`
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
    padding: 14px 6px 12px;
    border-radius: var(--ds-radius-md);
    background: var(--vpc-surface);
    cursor: pointer;
    transition: transform 0.18s ease, background 0.18s ease;
    position: relative;
    overflow: hidden;
    min-height: 44px;
    contain: layout style paint;
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
    will-change: transform, background;
  }

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
    border-radius: var(--ds-radius-md);
    background: var(--vpc-surface);
    cursor: pointer;
    transition: background 0.18s ease, transform 0.15s ease;
    min-height: 44px;
    contain: layout style paint;
  }

  .device-row:hover {
    background: color-mix(in srgb, var(--vpc-primary) 6%, var(--vpc-surface));
    transform: scale(1.005);
    will-change: transform, background;
  }

  @media (max-width: 600px) {
    .chemistry-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }

    .chemistry-card {
      padding: 11px 6px 10px;
      min-height: auto;
    }
  }
`;

/**
 * Responsive size modifiers for cards
 */
export const sizeModifierStyles = css`
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

  ha-card.size-small .name {
    font-size: 14px;
  }

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

  ha-card.size-large .name {
    font-size: 18px;
  }

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

  ha-card.size-fullscreen .name {
    font-size: 20px;
  }
`;

/**
 * Animation modifier styles
 */
export const animationModifierStyles = css`
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
    transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.25s ease;
  }

  ha-card.animation-energetic {
    transition: transform 0.2s cubic-bezier(0.34, 1.6, 0.64, 1), box-shadow 0.2s ease;
  }

  ha-card.animation-energetic:hover {
    transform: translateY(-4px) scale(1.008);
  }
`;

/**
 * Error state styling
 */
export const errorStateStyles = css`
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
    background: color-mix(in srgb, var(--vpc-danger, #ff3b30) 10%, transparent);
    flex-shrink: 0;
  }

  .error-icon ha-icon {
    --mdc-icon-size: 24px;
    color: var(--vpc-danger, #ff3b30);
  }

  .error-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .error-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--vpc-danger, #ff3b30);
    letter-spacing: -0.2px;
  }

  .error-entity {
    font-size: 12px;
    color: var(--vpc-text-secondary);
    font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
    opacity: 0.7;
  }
`;

/**
 * Responsive design breakpoints
 */
export const responsiveStyles = css`
  @media (max-width: 600px) {
    :host {
      --vpc-spacing: 14px;
      --vpc-icon-size: 18px;
    }

    .header {
      gap: var(--ds-spacing-md);
    }

    .header-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    .header-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .name {
      font-size: 14px;
    }
  }

  @media (pointer: coarse) {
    button,
    .device-row,
    .chemistry-card {
      min-height: 44px;
    }
  }
`;
