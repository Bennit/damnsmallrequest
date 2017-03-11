import { HTTP_METHOD } from './http-method';

export interface RequestOptions {
    url: string,
    method: HTTP_METHOD,
    body?: string,
    headers?: any;
}
