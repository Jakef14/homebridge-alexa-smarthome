import { Characteristic } from 'homebridge';
import {
  mapAlexaModeToHomeKit,
  mapHomekitModeToAlexa,
} from './thermostat-mapper';

describe('thermostat-mapper fan-only mode', () => {
  it('maps FAN_ONLY from Alexa to HomeKit', () => {
    const value = mapAlexaModeToHomeKit('FAN_ONLY', Characteristic);
    const fanOnly =
      (Characteristic.TargetHeatingCoolingState as any).FAN_ONLY || 4;
    expect(value).toBe(fanOnly);
  });

  it('maps fan-only from HomeKit to Alexa', () => {
    const fanOnly =
      (Characteristic.TargetHeatingCoolingState as any).FAN_ONLY || 4;
    const mode = mapHomekitModeToAlexa(fanOnly, Characteristic);
    expect(mode).toBe('FAN_ONLY');
  });
});
