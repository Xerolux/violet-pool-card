import { describe, it, expect, beforeEach } from 'vitest';
import { i18n } from '../src/utils/i18n';

describe('i18n', () => {
  beforeEach(() => {
    i18n.setLanguage('de');
  });

  it('defaults to German', () => {
    expect(i18n.getLanguage()).toBe('de');
  });

  it('translates a key in German', () => {
    expect(i18n.t('pump')).toBe('Pumpe');
  });

  it('translates a key in English after switching language', () => {
    i18n.setLanguage('en');
    expect(i18n.t('pump')).toBe('Pump');
  });

  it('returns the key itself when a translation is missing', () => {
    // Cast to any to simulate a missing key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(i18n.t('nonexistent_key' as any)).toBe('nonexistent_key');
  });

  it('German time labels use "her" not "ago"', () => {
    i18n.setLanguage('de');
    expect(i18n.t('minutesAgo')).toBe('Minuten her');
    expect(i18n.t('hoursAgo')).toBe('Stunden her');
    expect(i18n.t('daysAgo')).toBe('Tage her');
  });

  it('translates service toast keys', () => {
    i18n.setLanguage('de');
    expect(i18n.t('svc_pump_eco_mode')).toBe('ECO-Modus');
    expect(i18n.t('svc_pump_force_off')).toBe('Force AUS');

    i18n.setLanguage('en');
    expect(i18n.t('svc_pump_eco_mode')).toBe('ECO Mode');
    expect(i18n.t('svc_pump_force_off')).toBe('Force OFF');
  });

  it('setLanguage is a no-op when language is unchanged', () => {
    i18n.setLanguage('de');
    i18n.setLanguage('de'); // no-op
    expect(i18n.getLanguage()).toBe('de');
  });
});
