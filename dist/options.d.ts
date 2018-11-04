/// <reference types="node" />
import { Express, RequestHandler } from "express";
import { IncomingHttpHeaders } from "http";
/**
 * Represents available http methods.
*/
declare type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
declare type VariableType = StringConstructor | BooleanConstructor | NumberConstructor | ObjectConstructor | undefined | null;
/**
 * Defines how a sandhands schema should be.
 */
interface ISandhandsSchema {
    [key: string]: VariableType;
}
/**
 * Represents a class with message and status.
 */
interface IStatusMessagePair {
    /**
     * The message of the pair.
     */
    message: string;
    /**
     * The status of the pair.
     */
    status: number;
}
/**
 * Defines an api call and its properties
 */
interface IApiCall {
    /**
     * The function called when verified succesfully.
     */
    call: <PT>(parameters: PT) => Promise<any> | any;
    /**
     * The http method for this api.
     */
    method: HttpMethod;
    /**
     * The schema of required parameter object. Put an empty object if not required.
     * You can use ClassName for a class with sandhandsProp decorator instead of providing a schema, too.
     */
    parametersSchema: ISandhandsSchema | string;
    /**
     * An array of middlewares to be run only for this route.
     */
    perRouteMiddlewares?: RequestHandler[];
    /**
     * The express route string.
     */
    route: string;
    /**
     * The optional verify function.
     */
    verify?: (headers: IncomingHttpHeaders, parameters: IncomingParameters) => Promise<boolean> | boolean | Promise<IStatusMessagePair> | IStatusMessagePair;
    /**
     * The optional verify function, but with a callback instead.
     */
    verifyCallback?: (headers: IncomingHttpHeaders, parameters: IncomingParameters, returnCallback: (result: IStatusMessagePair | boolean) => void) => void;
}
/**
 * Defines incoming parameters.
 */
interface IncomingParameters {
    [key: string]: any;
}
/**
 * Defines the main Apifier class.
 */
interface NeistionOptions {
    /**
     * List of api methods and commands for this route.
     */
    calls: IApiCall[];
    /**
     * Whether debugging should be made or not.
     */
    debug?: boolean;
    /**
     * Custom codes for you to run with express.
     */
    express?: (express: Express) => Promise<void>;
    /**
     * If set to true, returned resultts are automatically converted to json.
     * True by default.
     */
    json?: boolean;
}
export { NeistionOptions, ISandhandsSchema, IStatusMessagePair, HttpMethod, IApiCall, IncomingParameters, VariableType };
