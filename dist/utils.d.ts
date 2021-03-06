import { HttpMethod, IApiRoute } from "./options";
import { Express, RequestHandler } from "express";
/**
 * Returns http methods from enums.
 * @param method The HTTP method to get Enum for.
 * @param express The express server
 */
export declare function getMethodFromMethodEnum(method: HttpMethod, express: Express): ((route: string, ...handlers: RequestHandler[]) => Express) | ((route: string, ...handlers: RequestHandler[]) => Express) | ((route: string, ...handlers: RequestHandler[]) => Express) | ((route: string, ...handlers: RequestHandler[]) => Express);
/**
 * Checks if object is a correct IApiRoute.
 * @param object Object to check for.
 */
export declare function instanceOfApiRoute<T>(object: any): object is IApiRoute<T>;
