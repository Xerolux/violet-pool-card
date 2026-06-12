/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Styles: Animation Keyframes – CSS-Animationen für visuelle Effekte (Pulse, Shimmer, Rainbow)
 * Erstellt von Xerolux | MIT License
 */

import { css } from 'lit';

export const advancedAnimationStyles = css`
  /* === DROPLET ANIMATIONS === */
  @keyframes droplet-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }

  @keyframes fill-rise {
    0%, 100% {
      height: 0;
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      height: 100%;
      opacity: 0.5;
    }
  }

  @keyframes bubble-float {
    0% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-30px) translateX(15px) scale(0);
      opacity: 0;
    }
  }

  /* === GAUGE & SENSOR ANIMATIONS === */
  @keyframes gauge-fill {
    from {
      stroke-dasharray: 0 240;
    }
    to {
      stroke-dasharray: var(--gauge-dash) 240;
    }
  }

  @keyframes line-draw {
    from {
      stroke-dasharray: 0 300;
    }
    to {
      stroke-dasharray: 300 300;
    }
  }

  /* === ALERT ANIMATIONS === */
  @keyframes alert-pulse {
    0%, 100% {
      r: 22;
      fill-opacity: var(--bg-opacity);
    }
    50% {
      r: 25;
      fill-opacity: calc(var(--bg-opacity) * 1.3);
    }
  }

  @keyframes ring-pulse {
    0% {
      r: 20;
      stroke-opacity: 0.8;
    }
    100% {
      r: 32;
      stroke-opacity: 0;
    }
  }

  /* === LOADER ANIMATIONS === */
  @keyframes spinner-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes skeleton-loading {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  /* === TRANSITION ANIMATIONS === */
  @keyframes slide-in-top {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-bottom {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* === CHART ANIMATIONS === */
  @keyframes chart-bar-grow {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: var(--bar-height);
      opacity: 1;
    }
  }

  @keyframes value-count {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* === INTERACTIVE ANIMATIONS === */
  @keyframes button-ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.5;
    }
    100% {
      width: 300px;
      height: 300px;
      opacity: 0;
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-4px);
    }
    75% {
      transform: translateX(4px);
    }
  }

  @keyframes success-checkmark {
    0% {
      stroke-dasharray: 60 60;
      stroke-dashoffset: 60;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      stroke-dasharray: 60 60;
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }

  /* === FOCUS & ATTENTION === */
  @keyframes focus-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }

  /* === CARD ENTRANCE ANIMATIONS === */
  @keyframes card-entrance {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  /* === SPECIAL EFFECTS === */
  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(0, 212, 255, 0);
    }
  }

  @keyframes color-shift {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }

  @keyframes rainbow-border {
    0% {
      border-color: #ff0000;
    }
    16% {
      border-color: #ff7f00;
    }
    33% {
      border-color: #ffff00;
    }
    50% {
      border-color: #00ff00;
    }
    66% {
      border-color: #0000ff;
    }
    83% {
      border-color: #4b0082;
    }
    100% {
      border-color: #ff0000;
    }
  }

  /* === UTILITY ANIMATION CLASSES === */
  .animate-pulse {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .animate-spin {
    animation: spinner-rotate 1s linear infinite;
  }

  .animate-bounce {
    animation: bounce-in 0.6s cubic-bezier(0.34, 1.4, 0.64, 1);
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .animate-slide-in {
    animation: slide-in-bottom 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
  }

  .animate-loading {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.05) 100%
    );
    background-size: 1000px 100%;
    animation: skeleton-loading 2s infinite;
  }

  .animate-shimmer {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .animate-glow {
    animation: glow-pulse 2s ease-in-out infinite;
  }

  /* Respect user preference for reduced motion (accessibility / battery) */
  @media (prefers-reduced-motion: reduce) {
    .animate-pulse,
    .animate-spin,
    .animate-bounce,
    .animate-shake,
    .animate-fade-in,
    .animate-slide-in,
    .animate-loading,
    .animate-shimmer,
    .animate-glow {
      animation: none;
    }
  }
`;
