"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Request {
    constructor(request, method) {
        this.parameters = method == "GET" ? request.query : request.body;
        this.headers = request.headers;
    }
}
exports.Request = Request;
