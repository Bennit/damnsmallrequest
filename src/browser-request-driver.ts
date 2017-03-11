import { Promise } from 'es6-promise';
import { HTTP_METHOD } from './http-method';
import { ServerResponse } from './server-response';
import { RequestOptions } from './request-options';

declare var window: any;
declare var XMLHttpRequest: any;
declare type XMLHttpRequest = any;
declare var Object: any;

const READY_STATE_DONE = 4; // xhr readyState 4 means the request is done.

function buildServerResponse (xhr: XMLHttpRequest): ServerResponse {
    return {
        status: xhr.status,
        statusText: xhr.statusText,
        body: xhr.responseText,
        headers: {},//TODO - map server response headers
        driver: 'BROWSER',
        raw: xhr
    };
}

function buildXhr (options: RequestOptions): XMLHttpRequest {
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    var headers = options.headers;
    if (headers) {
        Object.keys(headers).forEach(header => {
            var value = headers[header];
            xhr.setRequestHeader(header, value);
        });
    }
    xhr.send(options.body);
    return xhr;
}

export function BrowserRequestDriver (options: RequestOptions): Promise<ServerResponse> {
    return new Promise((resolve, reject) => {
        var xhr = buildXhr(options);
        xhr.onreadystatechange = function () {  
            if (xhr.readyState === READY_STATE_DONE) {
                resolve(buildServerResponse(xhr));
            }
        };
    });
}
