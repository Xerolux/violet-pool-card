import { css } from 'lit';

export const premiumThemeStyles = css`
  :host {
    --vpc-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    --vpc-spacing: 16px;
    --vpc-radius: 20px;
    --vpc-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.1);
    --vpc-backdrop: blur(0px);
  }

  ha-card.theme-classic {
    --vpc-bg: #ffffff;
    --vpc-surface: #f5f5f7;
    --vpc-primary: #007AFF;
    --vpc-text: #1d1d1f;
    --vpc-text-secondary: #86868b;
    --vpc-success: #34C759;
    --vpc-warning: #FF9F0A;
    --vpc-danger: #FF3B30;
  }

  ha-card.theme-midnight {
    --vpc-bg: #1c1c1e;
    --vpc-surface: #2c2c2e;
    --vpc-primary: #0A84FF;
    --vpc-text: #ffffff;
    --vpc-text-secondary: #8e8e93;
    --vpc-success: #30D158;
    --vpc-warning: #FFD60A;
    --vpc-danger: #FF453A;
    --vpc-border: 1px solid rgba(255, 255, 255, 0.1);
  }

  ha-card.theme-elegance {
    --vpc-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --vpc-surface: rgba(255, 255, 255, 0.15);
    --vpc-primary: #ffffff;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.7);
    --vpc-success: #4ade80;
    --vpc-warning: #fbbf24;
    --vpc-danger: #f87171;
    --vpc-backdrop: blur(16px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.2);
  }

  ha-card.theme-vibrant {
    --vpc-bg: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --vpc-surface: rgba(255, 255, 255, 0.2);
    --vpc-primary: #ffffff;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.8);
    --vpc-success: #4ade80;
    --vpc-warning: #fde047;
    --vpc-danger: #fca5a5;
    --vpc-backdrop: blur(12px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.25);
  }

  ha-card.theme-pure {
    --vpc-bg: #ffffff;
    --vpc-surface: #fafafa;
    --vpc-primary: #000000;
    --vpc-text: #000000;
    --vpc-text-secondary: #666666;
    --vpc-success: #10b981;
    --vpc-warning: #f59e0b;
    --vpc-danger: #ef4444;
    --vpc-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    --vpc-border: 1px solid rgba(0, 0, 0, 0.05);
  }

  ha-card.theme-frost {
    --vpc-bg: rgba(255, 255, 255, 0.7);
    --vpc-surface: rgba(255, 255, 255, 0.5);
    --vpc-primary: #007AFF;
    --vpc-text: #1d1d1f;
    --vpc-text-secondary: #86868b;
    --vpc-success: #34C759;
    --vpc-warning: #FF9F0A;
    --vpc-danger: #FF3B30;
    --vpc-backdrop: blur(24px) saturate(180%);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.3);
    --vpc-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  ha-card.theme-glow {
    --vpc-bg: #1a1a2e;
    --vpc-surface: #16213e;
    --vpc-primary: #00d4ff;
    --vpc-text: #eaeaea;
    --vpc-text-secondary: #a0a0a0;
    --vpc-success: #00ff88;
    --vpc-warning: #ffaa00;
    --vpc-danger: #ff0055;
    --vpc-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    --vpc-border: 1px solid rgba(0, 212, 255, 0.3);
  }

  ha-card.theme-metallic {
    --vpc-bg: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%);
    --vpc-surface: rgba(255, 255, 255, 0.1);
    --vpc-primary: #ecf0f1;
    --vpc-text: #ffffff;
    --vpc-text-secondary: #bdc3c7;
    --vpc-success: #2ecc71;
    --vpc-warning: #f39c12;
    --vpc-danger: #e74c3c;
    --vpc-backdrop: blur(8px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.2);
  }

  ha-card.theme-ocean {
    --vpc-bg: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    --vpc-surface: rgba(255, 255, 255, 0.12);
    --vpc-primary: #ffffff;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.75);
    --vpc-success: #4ade80;
    --vpc-warning: #fbbf24;
    --vpc-danger: #f87171;
    --vpc-backdrop: blur(20px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.2);
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }

  ha-card.theme-sunset {
    --vpc-bg: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    --vpc-surface: rgba(255, 255, 255, 0.25);
    --vpc-primary: #ffffff;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.8);
    --vpc-success: #4ade80;
    --vpc-warning: #fde047;
    --vpc-danger: #fca5a5;
    --vpc-backdrop: blur(12px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.3);
  }

  ha-card.theme-forest {
    --vpc-bg: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
    --vpc-surface: rgba(255, 255, 255, 0.15);
    --vpc-primary: #ffffff;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.75);
    --vpc-success: #86efac;
    --vpc-warning: #fde047;
    --vpc-danger: #fca5a5;
    --vpc-backdrop: blur(14px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.2);
  }

  ha-card.theme-aurora {
    --vpc-bg: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
    --vpc-surface: rgba(255, 255, 255, 0.18);
    --vpc-primary: #ffffff;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.8);
    --vpc-success: #4ade80;
    --vpc-warning: #fde047;
    --vpc-danger: #fca5a5;
    --vpc-backdrop: blur(20px);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.25);
    background-size: 400% 400%;
    animation: gradient-shift 15s ease infinite;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  }

  ha-card.theme-glassmorphism {
    --vpc-bg: rgba(255, 255, 255, 0.1);
    --vpc-surface: rgba(255, 255, 255, 0.05);
    --vpc-primary: rgba(255, 255, 255, 0.9);
    --vpc-text: rgba(255, 255, 255, 0.95);
    --vpc-text-secondary: rgba(255, 255, 255, 0.7);
    --vpc-success: #4ade80;
    --vpc-warning: #fbbf24;
    --vpc-danger: #f87171;
    --vpc-backdrop: blur(24px) saturate(180%);
    --vpc-border: 1px solid rgba(255, 255, 255, 0.18);
    --vpc-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  }

  ha-card.theme-neon {
    --vpc-bg: #0a0a0a;
    --vpc-surface: rgba(255, 255, 255, 0.05);
    --vpc-primary: #00ff88;
    --vpc-text: #ffffff;
    --vpc-text-secondary: #888888;
    --vpc-success: #00ff88;
    --vpc-warning: #ffaa00;
    --vpc-danger: #ff0055;
    --vpc-border: 1px solid rgba(0, 255, 136, 0.3);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1);
  }

  ha-card.theme-premium {
    --vpc-bg: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%);
    --vpc-surface: rgba(255, 255, 255, 0.15);
    --vpc-primary: #ffd700;
    --vpc-text: #ffffff;
    --vpc-text-secondary: rgba(255, 255, 255, 0.75);
    --vpc-success: #4ade80;
    --vpc-warning: #fbbf24;
    --vpc-danger: #f87171;
    --vpc-backdrop: blur(16px);
    --vpc-border: 2px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 8px 32px rgba(255, 215, 0, 0.2);
  }

  ha-card.theme-minimalist {
    --vpc-bg: #fafafa;
    --vpc-surface: #f5f5f5;
    --vpc-primary: #2196F3;
    --vpc-text: #212121;
    --vpc-text-secondary: #757575;
    --vpc-success: #4CAF50;
    --vpc-warning: #FF9800;
    --vpc-danger: #F44336;
    --vpc-shadow: none;
    --vpc-border: 1px solid #e0e0e0;
  }

  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
