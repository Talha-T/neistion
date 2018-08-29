import { Express } from "express";
import { IncomingHttpHeaders } from "http";

/**
 * Represents available http methods.
 * 
 * Combine methods via bitwise OR (|) operator.
 */
enum HttpMethod {
    GET = 1,
    POST = 2,
    PUT = 4,
    DELETE = 8
}

// Available types for sandhands.
type VariableType = StringConstructor | BooleanConstructor | NumberConstructor
    | ObjectConstructor | undefined | null;

/**
 * Defines how a sandhands schema should be.
 */
interface ISandhandsSchema {
    [key: string]: VariableType
}

/**
 * Defines how a parameter schema should be.
 */
interface IParametersSchema {
    [key: string]: ISandhandsSchema
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
    method: HttpMethod,
    /**
     * The schema of required parameter object. Put an empty object if not required.
     */
    parametersSchema: ISandhandsSchema,
    /**
     * The express route string.
     */
    route: string,
    /**
     * The optional verify function.
     */
    verify?: (headers: IncomingHttpHeaders, parameters: IncomingParameters) => Promise<boolean> | boolean;
}

/**
 * Defines a wrapper for request headers.
 */
interface IHeaders {
    [header: string]: string;
}

/**
 * Predefines Authorization header.
 */
interface IAuthorizationHeaders extends IHeaders {
    Authorization: string;
}

/**
 * Predefines x-access-token header.
 */
interface IAccessTokenHeaders extends IHeaders {
    "x-access-token": string;
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
    calls: IApiCall[],
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