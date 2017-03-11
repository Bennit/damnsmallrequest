export enum REQUEST_EXCEPTION {
    CLIENT_ABORTED,
    SERVER_ABORTED,
    NETWORK_ERROR
}

export class RequestException {

    constructor (
        public type: REQUEST_EXCEPTION,
        public details?: any
    ) {

    }

}
