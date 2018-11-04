import { HttpMethod } from "./options";
import { Express, RequestHandler } from "express";

/**
 * Returns http methods from enums.
 * @param method The HTTP method to get Enum for.
 * @param express The express server
 */
export function getMethodFromMethodEnum(method: HttpMethod, express: Express) {
    const map = {
        GET: (route: string, ...handlers: RequestHandler[]) =>
            express.get(route, handlers),
        POST: (route: string, ...handlers: RequestHandler[]) =>
            express.post(route, handlers),
        PUT: (route: string, ...handlers: RequestHandler[]) =>
            express.put(route, handlers),
        DELETE: (route: string, ...handlers: RequestHandler[]) =>
            express.delete(route, handlers),
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