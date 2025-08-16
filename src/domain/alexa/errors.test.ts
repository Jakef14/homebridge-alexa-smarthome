import { UnsupportedDeviceError } from './errors';
import { SmartHomeDevice } from './get-devices';

describe('UnsupportedDeviceError', () => {
  test('includes APPLICATION in supported device types', () => {
    const device: SmartHomeDevice = {
      id: 'id',
      endpointId: 'endpoint',
      displayName: 'name',
      supportedOperations: [],
      enabled: true,
      deviceType: 'OTHER',
      serialNumber: 'sn',
      model: 'model',
      manufacturer: 'manufacturer',
    };

    const error = new UnsupportedDeviceError(device);
    expect(error.message).toContain('APPLICATION');
  });
});
