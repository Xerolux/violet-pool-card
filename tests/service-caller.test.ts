import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ServiceCaller } from '../src/utils/service-caller';
import { DOSING_CHANNELS } from '../src/utils/dosing-type';

/**
 * The dosing buttons could not work, for three reasons at once.
 *
 * `smart_dosing` is stricter than the card was: its schema wants an
 * `entity_id` (or a device), a `dosing_type` from its own list, and a
 * `duration` on every action - `vol.Required`, not defaulted. The card sent no
 * entity at all, the controller's German channel names (`Chlor`,
 * `Flockmittel`), and no duration for `auto` and `stop`. Every one of those is
 * rejected by voluptuous before the handler runs, so "Dose 30s", "Auto" and
 * "STOP" did nothing but raise an error.
 *
 * The accepted values come from the integration's own services.yaml, copied
 * into the fixture by `npm run keys:update`.
 */
const service: { dosing_type: string[]; duration: { min: number; max: number } } = JSON.parse(
  readFileSync(new URL('./fixtures/integration-entity-keys.json', import.meta.url), 'utf-8')
).services.smart_dosing;

// The caller announces what it did through a `hass-notification` event on the
// window; these tests run without a DOM, so it gets somewhere to dispatch to.
(globalThis as unknown as { window: { dispatchEvent: (event: Event) => boolean } }).window = {
  dispatchEvent: () => true,
};

/** Captures what the card asks Home Assistant to do. */
const recordingHass = () => {
  const calls: Array<{ domain: string; service: string; data?: Record<string, unknown> }> = [];
  return {
    calls,
    hass: {
      callService: (domain: string, svc: string, data?: Record<string, unknown>) => {
        calls.push({ domain, service: svc, data });
        return Promise.resolve();
      },
    },
  };
};

const SWITCH = 'switch.violet_pool_controller_chlorine_dosing';

describe('smart_dosing', () => {
  beforeEach(() => {
    // The caller drops a second call to the same service within 500 ms.
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  it('names the entity the service acts on', async () => {
    const { calls, hass } = recordingHass();

    await new ServiceCaller(hass).manualDose(SWITCH, 'Chlorine', 30);

    expect(calls[0].domain).toBe('violet_pool_controller');
    expect(calls[0].service).toBe('smart_dosing');
    expect(calls[0].data?.entity_id).toBe(SWITCH);
  });

  it.each(['manual_dose', 'auto', 'stop'] as const)(
    'sends a duration with %s, because the schema requires one',
    async (action) => {
      const { calls, hass } = recordingHass();

      await new ServiceCaller(hass).smartDosing(SWITCH, 'Chlorine', action);

      expect(calls[0].data?.duration).toBe(30);
    }
  );

  it('keeps the duration inside the range the service accepts', async () => {
    const { calls, hass } = recordingHass();
    const caller = new ServiceCaller(hass);

    await caller.smartDosing(SWITCH, 'Chlorine', 'manual_dose', 1);
    vi.setSystemTime(1000);
    await caller.smartDosing(SWITCH, 'Chlorine', 'manual_dose', 9000);

    expect(calls.map((call) => call.data?.duration)).toEqual([
      service.duration.min,
      service.duration.max,
    ]);
  });

  it.each(DOSING_CHANNELS)('names the $type channel as the service does', (channel) => {
    expect(service.dosing_type).toContain(channel.serviceValue);
  });

  it('does not send the controller spellings the service rejects', () => {
    // What the card used to send. The service translates to these itself.
    expect(service.dosing_type).not.toContain('Chlor');
    expect(service.dosing_type).not.toContain('Flockmittel');
  });
});

describe('manualDosing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  it('finds the channel from the registry key', async () => {
    const { calls, hass } = recordingHass();

    await new ServiceCaller(hass).manualDosing('switch.hundedosierung', 30, 'dos_6_floc');

    expect(calls[0].data?.dosing_type).toBe('Flocculant');
  });

  it('finds the channel from an id the integration creates today', async () => {
    const { calls, hass } = recordingHass();

    await new ServiceCaller(hass).manualDosing(
      'switch.violet_pool_controller_dosing_ph_minus'
    );

    expect(calls[0].data?.dosing_type).toBe('pH-');
  });

  it('says so when the entity identifies no channel', async () => {
    const { calls, hass } = recordingHass();

    const result = await new ServiceCaller(hass).manualDosing('switch.garage_door');

    expect(result.success).toBe(false);
    expect(calls).toEqual([]);
  });
});
