import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { HomebridgeAPI } from 'homebridge/lib/api';
import AlexaRemote from '../alexa-remote.js';
import { AlexaSmartHomePlatform } from '../platform';
import ThermostatAccessory from './thermostat-accessory';

describe('thermostat accessory supported modes', () => {
  test('exposes HEAT when heating supported', async () => {
    const device = {
      id: '123',
      endpointId: 'endpoint-1',
      displayName: 'test air conditioner',
      supportedOperations: ['setTargetSetpoint'],
      enabled: true,
      deviceType: 'APPLICATION',
      serialNumber: 'SN',
      model: 'Model',
      manufacturer: 'Manufacturer',
    };

    const platform = createPlatform();
    const uuid = platform.HAP.uuid.generate(device.id);
    const platAcc = new platform.api.platformAccessory(
      device.displayName,
      uuid,
    );
    const acc = new ThermostatAccessory(platform, device, platAcc);
    acc.configureServices();

    const C = acc.Characteristic.TargetHeatingCoolingState;
    expect(acc.service.getCharacteristic(C).props.validValues).not.toContain(
      C.HEAT,
    );

    const state = {
      featureName: 'thermostat',
      name: 'thermostatMode',
      value: 'HEAT',
    } as any;
    platform.deviceStore.updateCache([device.id], {
      [device.id]: O.some([E.right(state)]),
    });
    (acc as any).detectSupportedModes();
    (acc as any).constrainTargetStateProps();

    expect(acc.service.getCharacteristic(C).props.validValues).toContain(
      C.HEAT,
    );
  });
});

function createPlatform(): AlexaSmartHomePlatform {
  return new AlexaSmartHomePlatform(
    global.MockLogger,
    global.createPlatformConfig(),
    new HomebridgeAPI(),
  );
}
