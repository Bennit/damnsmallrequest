import { HTTP_METHOD } from './http-method';
import { ServerResponse } from './server-response';
import { RequestOptions } from './request-options';
import { RequestException, REQUEST_EXCEPTION } from './request-exception';
import { Promise } from 'es6-promise';

declare function require (string): any;
declare var console: any;

var http = require('http');
var https = require('https');
var url = require('url');

function buildHttpRequest(options: RequestOptions) {
    var parsedUrl = url.parse(options.url);
    return {
        method: options.method || 'GET',
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        headers: options.headers
    }
}

function buildServerResponse (req, res, body: string): ServerResponse {
    return {
        status: res.statusCode,
        statusText: res.statusMessage,
        body: body,
        headers: res.headers,
        driver: 'NODE',
        raw: { req: req, res: res }
    };
}

export function NodeRequestDriver (options: RequestOptions): any {
    return new Promise((resolve, reject) => {
        var rawRequest = buildHttpRequest(options);
        var requestProvider = rawRequest.protocol === 'https:' ? https : http;
        
        console.log('%s %s', options.method || 'GET', options.url);
        var req = requestProvider.request(rawRequest, (res) => {
            var body = '';
            res.on('data', chunk => body += chunk)
            res.on('end', () => resolve(buildServerResponse(req, res, body)));
        });
        req.on('abort', (evt) => reject(new RequestException(REQUEST_EXCEPTION.CLIENT_ABORTED, evt)));
        req.on('aborted', (evt) => reject(new RequestException(REQUEST_EXCEPTION.SERVER_ABORTED, evt)));
        req.on('error', (evt) => reject(new RequestException(REQUEST_EXCEPTION.NETWORK_ERROR, evt)));
        
        if(options.body) {
            console.log('data: %s', options.body);
            req.write(options.body);
        }
        req.end();
    });
}