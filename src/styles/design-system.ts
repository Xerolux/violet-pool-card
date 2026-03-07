import { css, unsafeCSS } from 'lit';

/**
 * Violet Pool Card Design System
 * Centralized definitions for spacing, colors, typography, and icon sizes
 */

// Spacing Scale (8px base unit)
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
} as const;

// Border Radius Scale
export const BORDER_RADIUS = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '999px',
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  xs: '11px',
  sm: '12px',
  base: '13px',
  lg: '14px',
  xl: '16px',
  '2xl': '18px',
  '3xl': '20px',
  '4xl': '24px',
  '5xl': '32px',
  '6xl': '44px',
} as const;

// Icon Sizes
export const ICON_SIZE = {
  xs: '14px',
  sm: '16px',
  md: '18px',
  lg: '20px',
  xl: '22px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px',
} as const;

// Color Palette - Enhanced
export const COLORS = {
  // Status Colors
  success: '#34C759',
  warning: '#FF9F0A',
  error: '#FF3B30',
  info: '#00BCD4',

  // State Colors
  active: '#4CAF50',
  inactive: '#757575',
  offline: '#9E9E9E',

  // Theme Colors
  primary: '#007AFF',
  secondary: '#5AC8FA',
  accent: '#AF52DE',

  // Temperature Colors
  cold: '#2196F3',
  warm: '#FF5722',
  hot: '#F44336',

  // Component States
  disabled: 'rgba(0, 0, 0, 0.5)',
  hover: 'rgba(0, 0, 0, 0.05)',
  focus: 'rgba(0, 122, 255, 0.1)',

  // Premium Gradients
  gradientAurora: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
  gradientSunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  gradientOcean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientNeon: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
  gradientGlassmorphism: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',

  // Glow Effects
  glowBlue: '0 0 20px rgba(0, 122, 255, 0.3)',
  glowGreen: '0 0 20px rgba(52, 199, 89, 0.3)',
  glowOrange: '0 0 20px rgba(255, 159, 10, 0.3)',
  glowPurple: '0 0 20px rgba(175, 82, 222, 0.3)',
} as const;

// Transitions
export const TRANSITIONS = {
  fast: 'all 0.18s ease',
  normal: 'all 0.28s cubic-bezier(0.34, 1.4, 0.64, 1)',
  slow: 'all 0.48s ease',
} as const;

// Touch target sizes (mobile accessibility)
export const TOUCH_TARGET = {
  min: '44px',
  comfortable: '48px',
  large: '56px',
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
} as const;

// Design system CSS custom properties - Enhanced
export const designSystemStyles = css`
  :root {
    /* Spacing */
    --ds-spacing-xs: ${unsafeCSS(SPACING.xs)};
    --ds-spacing-sm: ${unsafeCSS(SPACING.sm)};
    --ds-spacing-md: ${unsafeCSS(SPACING.md)};
    --ds-spacing-lg: ${unsafeCSS(SPACING.lg)};
    --ds-spacing-xl: ${unsafeCSS(SPACING.xl)};
    --ds-spacing-xxl: ${unsafeCSS(SPACING.xxl)};

    /* Border Radius */
    --ds-radius-xs: ${unsafeCSS(BORDER_RADIUS.xs)};
    --ds-radius-sm: ${unsafeCSS(BORDER_RADIUS.sm)};
    --ds-radius-md: ${unsafeCSS(BORDER_RADIUS.md)};
    --ds-radius-lg: ${unsafeCSS(BORDER_RADIUS.lg)};
    --ds-radius-xl: ${unsafeCSS(BORDER_RADIUS.xl)};
    --ds-radius-full: ${unsafeCSS(BORDER_RADIUS.full)};

    /* Typography */
    --ds-font-size-xs: ${unsafeCSS(TYPOGRAPHY.xs)};
    --ds-font-size-sm: ${unsafeCSS(TYPOGRAPHY.sm)};
    --ds-font-size-base: ${unsafeCSS(TYPOGRAPHY.base)};
    --ds-font-size-lg: ${unsafeCSS(TYPOGRAPHY.lg)};
    --ds-font-size-xl: ${unsafeCSS(TYPOGRAPHY.xl)};
    --ds-font-size-2xl: ${unsafeCSS(TYPOGRAPHY['2xl'])};
    --ds-font-size-3xl: ${unsafeCSS(TYPOGRAPHY['3xl'])};
    --ds-font-size-4xl: ${unsafeCSS(TYPOGRAPHY['4xl'])};
    --ds-font-size-5xl: ${unsafeCSS(TYPOGRAPHY['5xl'])};
    --ds-font-size-6xl: ${unsafeCSS(TYPOGRAPHY['6xl'])};

    /* Icon Sizes */
    --ds-icon-xs: ${unsafeCSS(ICON_SIZE.xs)};
    --ds-icon-sm: ${unsafeCSS(ICON_SIZE.sm)};
    --ds-icon-md: ${unsafeCSS(ICON_SIZE.md)};
    --ds-icon-lg: ${unsafeCSS(ICON_SIZE.lg)};
    --ds-icon-xl: ${unsafeCSS(ICON_SIZE.xl)};
    --ds-icon-2xl: ${unsafeCSS(ICON_SIZE['2xl'])};
    --ds-icon-3xl: ${unsafeCSS(ICON_SIZE['3xl'])};
    --ds-icon-4xl: ${unsafeCSS(ICON_SIZE['4xl'])};

    /* Colors */
    --ds-color-success: ${unsafeCSS(COLORS.success)};
    --ds-color-warning: ${unsafeCSS(COLORS.warning)};
    --ds-color-error: ${unsafeCSS(COLORS.error)};
    --ds-color-info: ${unsafeCSS(COLORS.info)};
    --ds-color-active: ${unsafeCSS(COLORS.active)};
    --ds-color-primary: ${unsafeCSS(COLORS.primary)};
    --ds-color-secondary: ${unsafeCSS(COLORS.secondary)};
    --ds-color-accent: ${unsafeCSS(COLORS.accent)};

    /* Transitions */
    --ds-transition-fast: ${unsafeCSS(TRANSITIONS.fast)};
    --ds-transition-normal: ${unsafeCSS(TRANSITIONS.normal)};
    --ds-transition-slow: ${unsafeCSS(TRANSITIONS.slow)};

    /* Touch Targets */
    --ds-touch-min: ${unsafeCSS(TOUCH_TARGET.min)};
    --ds-touch-comfortable: ${unsafeCSS(TOUCH_TARGET.comfortable)};
    --ds-touch-large: ${unsafeCSS(TOUCH_TARGET.large)};

    /* Premium Effects */
    --ds-blur-light: blur(8px);
    --ds-blur-medium: blur(16px);
    --ds-blur-heavy: blur(24px);
    --ds-saturation-boost: saturate(1.2);
    
    /* Shadows - Enhanced */
    --ds-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
    --ds-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
    --ds-shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
    --ds-shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.20);
    --ds-shadow-glow: 0 0 20px rgba(0, 122, 255, 0.3);
    
    /* Animation Timing */
    --ds-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --ds-ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ds-ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;
