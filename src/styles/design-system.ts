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

// Color Palette
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

// Design system CSS custom properties
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
  }
`;
