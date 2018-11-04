import { HttpMethod } from "./options";
import { Express, RequestHandler } from "express";
/**
 * Returns http methods from enums.
 * @param method The HTTP method to get Enum for.
 * @param express The express server
 */
export declare function getMethodFromMethodEnum(method: HttpMethod, express: Express): ((route: string, ...handlers: RequestHandler[]) => Express) | ((route: string, ...handlers: RequestHandler[]) => Express) | ((route: string, ...handlers: RequestHandler[]) => Express) | ((route: string, ...handlers: RequestHandler[]) => Express);
export declare function getConstructorFromString(typeString: string): Function;
