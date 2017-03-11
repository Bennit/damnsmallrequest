import { HTTP_METHOD } from './http-method';
import { ServerResponse } from './server-response';
import { RequestOptions } from './request-options';
import { RequestError } from './request-error';
import { Promise } from 'es6-promise';

declare var JSON: any;
declare var RegExp: any;
declare var console: any;

function getPathFromUrl (url) {
    return new RegExp('http[s]?:\/\/)?([^\/\s]+\/)(.*)').exec(url)[3];
}

export function buildMockRequestDriver (mockData: any) {

    if(!mockData) {
        throw new RequestError('[MockRequestDriver] mockData not supplied');
    }

    return function (options: RequestOptions): Promise<ServerResponse> {
        var key = options.method + ' ' + options.url;
        if(!mockData.hasOwnProperty(key)) {
            key = options.method + ' /' + getPathFromUrl(options.url);
        }
        
        var mock;
        if(mockData.hasOwnProperty(key)) {
            mock = mockData[key];
        } else {
            return Promise.reject('[MockRequestDriver] Not Implemented: ' + key);
        }

        var response: ServerResponse;
        if(typeof(mock) === 'function') {
            console.log('[MockRequestDriver] (fn) %s', key);
            response = mock(options);
        } else if(typeof(mock) === 'object') {
            console.log('[MockRequestDriver] %s', key);
            response = mock;
        } else {
            return Promise.reject('[MockRequestDriver] Invalid Mock: ' + key);
        }
        // serialize body if needed
        if(typeof(response.body) === 'object') {
            response.body = JSON.stringify(response.body);
        }
        response.driver = 'MOCK';
        return Promise.resolve(response);
    };

}