"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns http methods from enums.
 * @param method The HTTP method to get Enum for.
 * @param express The express server
 */
function getMethodFromMethodEnum(method, express) {
    const map = {
        GET: (route, ...handlers) => express.get(route, handlers),
        POST: (route, ...handlers) => express.post(route, handlers),
        PUT: (route, ...handlers) => express.put(route, handlers),
        DELETE: (route, ...handlers) => express.delete(route, handlers),
    };
    return map[method];
}
exports.getMethodFromMethodEnum = getMethodFromMethodEnum;
function getConstructorFromString(typeString) {
    const map = {
        Object: Object,
        Boolean: Boolean,
        String: String,
        Number: Number
    };
    return map[typeString];
}
exports.getConstructorFromString = getConstructorFromString;
