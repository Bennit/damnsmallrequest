import { RequestOptions } from './request-options';
import { ServerResponse } from './server-response';
import { Promise } from 'es6-promise';

/**
 * Performs the request specified by the options and returns a promise
 * that will resolve once the server sent it's response.
 * The promise will be rejected when there is a network failure or
 * other technical issues with establishing the connection.
 */
export type RequestDriver = (options: RequestOptions) => Promise<ServerResponse>;
