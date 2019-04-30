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
/**
 * Checks if object is a correct IApiRoute.
 * @param object Object to check for.
 */
function instanceOfApiRoute(object) {
    return 'route' in object;
}
exports.instanceOfApiRoute = instanceOfApiRoute;
