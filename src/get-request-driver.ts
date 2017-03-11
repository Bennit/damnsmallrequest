import { REQUEST_DRIVER_TYPE } from './request-driver-type';
import { RequestDriver } from './request-driver';
import { NodeRequestDriver } from './node-request-driver';
import { buildMockRequestDriver } from './mock-request-driver';
import { BrowserRequestDriver } from './browser-request-driver';
import { RequestError } from './request-error';

declare var window: any;

/**
 * Obtain the request driver for the given type
 */
export function getRequestDriver (type?: REQUEST_DRIVER_TYPE, mockData?: any): RequestDriver {
    if(type === undefined) {
      return getRequestDriver(typeof window !== 'undefined' ? 'BROWSER' : 'NODE');
    }
    switch(type) {
      case 'BROWSER':
        return BrowserRequestDriver;
      case 'NODE':
        return NodeRequestDriver;
      case 'MOCK':
        return buildMockRequestDriver(mockData);
    }
    throw new RequestError('Unknown request driver type: ' + type);
}
