"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents available http methods.
 *
 * Combine methods via bitwise OR (|) operator.
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 1] = "GET";
    HttpMethod[HttpMethod["POST"] = 2] = "POST";
    HttpMethod[HttpMethod["PUT"] = 4] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 8] = "DELETE";
})(HttpMethod || (HttpMethod = {}));
exports.HttpMethod = HttpMethod;
