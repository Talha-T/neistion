import { HttpMethod } from "./options";
import { Express, RequestHandler } from "express";

/**
 * Returns http methods from enums.
 * @param method The HTTP method to get Enum for.
 * @param express The express server
 */
export function getMethodFromMethodEnum(method: HttpMethod, express: Express) {
    const map = {
        GET: (route: string, handler: RequestHandler) =>
            express.get(route, handler),
        POST: (route: string, handler: RequestHandler) =>
            express.post(route, handler),
        PUT: (route: string, handler: RequestHandler) =>
            express.put(route, handler),
        DELETE: (route: string, handler: RequestHandler) =>
            express.delete(route, handler),
    }
    return map[method];
}

export function getConstructorFromString(typeString: string) {
    const map: { [key: string]: Function} = {
        Object: Object,
        Boolean: Boolean,
        String: String,
        Number: Number
    }
    return map[typeString];
}