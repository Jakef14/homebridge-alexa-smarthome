import { constant } from 'fp-ts/lib/function';
import type { Characteristic } from 'homebridge';
import { match } from 'ts-pattern';
import { CapabilityState } from '../domain/alexa';

/**
 * Ensure the HomeKit TargetHeatingCoolingState characteristic exposes a
 * numeric value for a fan-only operating mode. HomeKit only defines OFF, HEAT,
 * COOL and AUTO, but many HVAC devices (such as Mitsubishi mini splits)
 * support a "fan only" mode which Alexa exposes as `FAN_ONLY`.  We assign a
 * constant value of `4` to represent this mode if it has not been defined
 * previously.
 */
const ensureFanOnlyValue = (characteristic: typeof Characteristic): number => {
  const target = characteristic.TargetHeatingCoolingState as unknown as {
    FAN_ONLY?: number;
  };
  if (typeof target.FAN_ONLY !== 'number') {
    target.FAN_ONLY = 4;
  }
  return target.FAN_ONLY;
};

export const mapAlexaModeToHomeKit = (
  value: CapabilityState['value'],
  characteristic: typeof Characteristic,
) => {
  const fanOnly = ensureFanOnlyValue(characteristic);
  return match(value)
    .with('HEAT', constant(characteristic.TargetHeatingCoolingState.HEAT))
    .with('COOL', constant(characteristic.TargetHeatingCoolingState.COOL))
    .with('AUTO', constant(characteristic.TargetHeatingCoolingState.AUTO))
    .with('FAN_ONLY', constant(fanOnly))
    .otherwise(constant(characteristic.TargetHeatingCoolingState.OFF));
};

export const mapHomekitModeToAlexa = (
  value: number,
  characteristic: typeof Characteristic,
) => {
  const fanOnly = ensureFanOnlyValue(characteristic);
  return match(value)
    .with(characteristic.TargetHeatingCoolingState.OFF, constant('OFF'))
    .with(characteristic.TargetHeatingCoolingState.HEAT, constant('HEAT'))
    .with(characteristic.TargetHeatingCoolingState.COOL, constant('COOL'))
    .with(characteristic.TargetHeatingCoolingState.AUTO, constant('AUTO'))
    .with(fanOnly, constant('FAN_ONLY'))
    .otherwise(constant('AUTO'));
};
