export class RequestError {

    constructor (public message: string) {

    }

    toString() {
        return this.message;
    }

}