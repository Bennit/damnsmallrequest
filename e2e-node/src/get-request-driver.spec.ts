import { getRequestDriver } from '../../build/index';
import { NodeRequestDriver } from '../../build/node-request-driver';

describe('getRequestDriver', () => {
    
    it('should automatically provide NodeRequestDriver when in node environment', () => {
        var driver = getRequestDriver();
        expect(driver).toBe(NodeRequestDriver);
    });

    it('should provide NodeRequestDriver when asked for it', () => {
        var driver = getRequestDriver('NODE');
        expect(driver).toBe(NodeRequestDriver);
    });

});
