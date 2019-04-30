"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(response) {
        this.response = response;
    }
    status(code) {
        this.response.status(code);
        return this;
    }
    send(body) {
        this.response.send(body);
        return this;
    }
}
exports.Response = Response;
