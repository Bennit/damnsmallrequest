import { REQUEST_DRIVER_TYPE } from './request-driver-type';

export interface ServerResponse {
    status: number,
    statusText: string,
    body: string,
    headers: any,
    driver: REQUEST_DRIVER_TYPE,
    raw: any
}
