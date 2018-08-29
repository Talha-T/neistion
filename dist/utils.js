"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
/**
 * Returns http methods from enums.
 * @param method The HTTP method to get Enum for.
 * @param express The express server
 */
function getMethodFromMethodEnum(method, express) {
    const map = {
        [options_1.HttpMethod.GET]: (route, handler) => express.get(route, handler),
        [options_1.HttpMethod.POST]: (route, handler) => express.post(route, handler),
        [options_1.HttpMethod.PUT]: (route, handler) => express.put(route, handler),
        [options_1.HttpMethod.DELETE]: (route, handler) => express.delete(route, handler),
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
