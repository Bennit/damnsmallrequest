import { getRequestDriver, HTTP_METHOD, RequestException, REQUEST_EXCEPTION, NodeRequestDriver } from '../../build';
import { createServer, IncomingMessage, ServerResponse, Server } from 'http';

type Listener = (req: IncomingMessage, res: ServerResponse) => void;

describe('HTTP Requests', () => {

    const request = getRequestDriver();
    const protocol = 'http';
    const host = 'localhost';
    const port = 3000;
    const baseUrl = protocol + '://' + host + ':' + port;

    var listener: Listener;

    function setSimpleListener(statusCode: number, statusMessage: string, body: string) {
        listener = (req, res) => {
            res.statusCode = statusCode;
            res.statusMessage = statusMessage;
            res.end(body);
        };
    }

    function simpleRequest(method: HTTP_METHOD, url?: string) {
        return request({ method: method, url: url ? url : baseUrl });
    }

    var server: Server;
    

    beforeEach((done) => {
        listener = null;// reset listener
        server = createServer((req, res) => {
            if(!listener) {
                fail('performed request without setting listener');
            }
            listener(req, res);
        });
        server.on('listening', () => done());
        server.listen(port, host);
    });

    afterEach((done) => {
        server.close(() => done());
    });

    it('should return a promise that resolves with the correct data', (done) => {
        var status = 200;
        var statusText = 'OK';
        var body = 'lorem ipsum';
        setSimpleListener(status, statusText, body);
        
        simpleRequest('GET')
            .then(data => {
                expect(data.status).toBe(status);
                expect(data.statusText).toBe(statusText);
                expect(data.body).toBe(body);
            })
            .catch(err => fail('Request failed: ' + err))
            .then(done, done);
    });

    // must pass relatively large timeout to trigger ENOTFOUND
    it('should return a promise that rejects with a network error "ENOTFOUND"', (done) => {
        simpleRequest('GET', 'http://fakehost')
            .then(data => fail('Request should fail'))
            .catch(err => {
                expect(err instanceof RequestException).toBeTruthy();
                var typedErr = <RequestException> err;
                // compare enum string value to make the test more verbose
                expect(REQUEST_EXCEPTION[typedErr.type]).toBe(REQUEST_EXCEPTION[REQUEST_EXCEPTION.NETWORK_ERROR]);
                expect(typedErr.details.code).toBe('ENOTFOUND');
            })
            .then(done, done);
    }, 10000);

});
