/// <reference types="node" />
import { Express } from "express";
import { IncomingHttpHeaders } from "http";
/**
 * Represents available http methods.
 *
 * Combine methods via bitwise OR (|) operator.
 */
declare enum HttpMethod {
    GET = 1,
    POST = 2,
    PUT = 4,
    DELETE = 8
}
declare type VariableType = StringConstructor | BooleanConstructor | NumberConstructor | ObjectConstructor | undefined | null;
/**
 * Defines how a sandhands schema should be.
 */
interface ISandhandsSchema {
    [key: string]: VariableType;
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
     */
    parametersSchema: ISandhandsSchema;
    /**
     * The express route string.
     */
    route: string;
    /**
     * The optional verify function.
     */
    verify?: (headers: IncomingHttpHeaders, parameters: IncomingParameters) => Promise<boolean> | boolean;
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
export { NeistionOptions, ISandhandsSchema, HttpMethod, IApiCall };
