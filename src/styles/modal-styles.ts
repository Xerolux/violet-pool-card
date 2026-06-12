/**
 * Violet Pool Card – Custom Lovelace Card for Home Assistant
 * © 2026 Xerolux | https://github.com/Xerolux/violet-pool-card
 *
 * Styles: Confirmation Modal – Globale Styles für den Bestätigungsdialog.
 * Der Dialog wird an document.body angehängt und liegt damit außerhalb des
 * Shadow DOM. Diese Styles müssen deshalb einmalig in document.head
 * injiziert werden (siehe injectModalStyles()).
 * Erstellt von Xerolux | MIT License
 */

export const MODAL_CSS = `
.vpc-confirmation-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: vpc-modal-fade-in 0.2s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}

.vpc-confirmation-dialog {
  background: var(--card-background-color, var(--ha-card-background, #fff));
  color: var(--primary-text-color, #212121);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  width: min(400px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  animation: vpc-modal-slide-up 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.vpc-confirmation-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vpc-confirmation-message {
  font-size: 15px;
  color: var(--primary-text-color, #212121);
  margin: 0;
  line-height: 1.5;
  overflow-wrap: break-word;
}

.vpc-confirmation-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.vpc-confirmation-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  min-height: 44px;
  min-width: 88px;
}

.vpc-btn-cancel {
  background: var(--divider-color, rgba(0, 0, 0, 0.12));
  color: var(--primary-text-color, #212121);
}

.vpc-btn-cancel:hover {
  filter: brightness(0.95);
}

.vpc-btn-confirm {
  background: var(--primary-color, #007aff);
  color: var(--text-primary-color, #fff);
}

.vpc-btn-confirm:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.vpc-confirmation-buttons button:focus-visible {
  outline: 2px solid var(--primary-color, #007aff);
  outline-offset: 2px;
}

@keyframes vpc-modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes vpc-modal-slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 600px) {
  .vpc-confirmation-buttons {
    flex-direction: column-reverse;
  }

  .vpc-confirmation-buttons button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vpc-confirmation-overlay,
  .vpc-confirmation-dialog {
    animation: none;
  }
}
`;

const STYLE_ID = 'vpc-modal-styles';

/** Injects the modal styles into document.head exactly once. */
export function injectModalStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = MODAL_CSS;
  document.head.appendChild(style);
}
