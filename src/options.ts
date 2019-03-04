import { Express, RequestHandler } from "express";
import { IncomingHttpHeaders } from "http";

/**
 * Represents available http methods.
*/
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

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
interface IApiRoute<T> {
    /**
     * The function called when verified succesfully.
     */
    call: (parameters: T) => Promise<any> | any;
    /**
     * The http method for this api.
     */
    method: HttpMethod,
    /**
     * The schema of required parameter object. Put an empty object if not required.
     * You can use ClassName for a class with sandhandsProp decorator instead of providing a schema, too.
     */
    parametersSchema: ISandhandsSchema | string,
    /**
     * An array of middlewares to be run only for this route.
     */
    perRouteMiddlewares?: RequestHandler[];
    /**
     * The express route string.
     */
    route: string,
    /**
     * The optional verify function.
     * Ran **after** parameter validation.
     */
    verify?: (headers: IncomingHttpHeaders, parameters: T) =>
        Promise<boolean> | boolean | Promise<IStatusMessagePair> | IStatusMessagePair;
    /**
     * The optional verify function, but with a callback instead.
     */
    verifyCallback?: (headers: IncomingHttpHeaders, parameters: IncomingParameters,
        returnCallback: (result: IStatusMessagePair | boolean) => void) => void;

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
    routes: IApiRoute<any>[],
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
    /**
     * If set to true, parameter objects with extra properties will be an invalid parameter.
     */
    strictPropertyCheck?: boolean;
}

export {
    NeistionOptions, ISandhandsSchema, IStatusMessagePair, HttpMethod, IApiRoute,
    IncomingParameters, VariableType
};