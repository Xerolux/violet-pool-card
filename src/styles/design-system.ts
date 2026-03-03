import { css } from 'lit';

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
    --ds-spacing-xs: ${SPACING.xs};
    --ds-spacing-sm: ${SPACING.sm};
    --ds-spacing-md: ${SPACING.md};
    --ds-spacing-lg: ${SPACING.lg};
    --ds-spacing-xl: ${SPACING.xl};
    --ds-spacing-xxl: ${SPACING.xxl};

    /* Border Radius */
    --ds-radius-xs: ${BORDER_RADIUS.xs};
    --ds-radius-sm: ${BORDER_RADIUS.sm};
    --ds-radius-md: ${BORDER_RADIUS.md};
    --ds-radius-lg: ${BORDER_RADIUS.lg};
    --ds-radius-xl: ${BORDER_RADIUS.xl};
    --ds-radius-full: ${BORDER_RADIUS.full};

    /* Typography */
    --ds-font-size-xs: ${TYPOGRAPHY.xs};
    --ds-font-size-sm: ${TYPOGRAPHY.sm};
    --ds-font-size-base: ${TYPOGRAPHY.base};
    --ds-font-size-lg: ${TYPOGRAPHY.lg};
    --ds-font-size-xl: ${TYPOGRAPHY.xl};
    --ds-font-size-2xl: ${TYPOGRAPHY['2xl']};
    --ds-font-size-3xl: ${TYPOGRAPHY['3xl']};
    --ds-font-size-4xl: ${TYPOGRAPHY['4xl']};
    --ds-font-size-5xl: ${TYPOGRAPHY['5xl']};
    --ds-font-size-6xl: ${TYPOGRAPHY['6xl']};

    /* Icon Sizes */
    --ds-icon-xs: ${ICON_SIZE.xs};
    --ds-icon-sm: ${ICON_SIZE.sm};
    --ds-icon-md: ${ICON_SIZE.md};
    --ds-icon-lg: ${ICON_SIZE.lg};
    --ds-icon-xl: ${ICON_SIZE.xl};
    --ds-icon-2xl: ${ICON_SIZE['2xl']};
    --ds-icon-3xl: ${ICON_SIZE['3xl']};
    --ds-icon-4xl: ${ICON_SIZE['4xl']};

    /* Colors */
    --ds-color-success: ${COLORS.success};
    --ds-color-warning: ${COLORS.warning};
    --ds-color-error: ${COLORS.error};
    --ds-color-info: ${COLORS.info};
    --ds-color-active: ${COLORS.active};
    --ds-color-primary: ${COLORS.primary};
    --ds-color-secondary: ${COLORS.secondary};
    --ds-color-accent: ${COLORS.accent};

    /* Transitions */
    --ds-transition-fast: ${TRANSITIONS.fast};
    --ds-transition-normal: ${TRANSITIONS.normal};
    --ds-transition-slow: ${TRANSITIONS.slow};

    /* Touch Targets */
    --ds-touch-min: ${TOUCH_TARGET.min};
    --ds-touch-comfortable: ${TOUCH_TARGET.comfortable};
    --ds-touch-large: ${TOUCH_TARGET.large};
  }
`;
