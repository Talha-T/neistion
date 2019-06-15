import "reflect-metadata";
import { ParameterTypes } from "./definitions";
declare type VariableType = StringConstructor | BooleanConstructor | NumberConstructor | ObjectConstructor | undefined | null | any;
/**
 * Defines how a sandhands schema should be.
 */
interface ISandhandsSchema {
    [key: string]: VariableType;
}
export declare function extend(schemaName: string): (constructor: Function) => void;
/**
 * Apply this decorator to export this property to a sandhands object.
 */
declare function sandhandsProp(target: any, key: string): void;
declare function optionalSandhandsProp(target: any, key: string): void;
export declare function customizedSandhandsProp(options: ParameterTypes): (target: any, key: string) => void;
/**
 * Returns the sandhands schema with **class name**.
 * @param key The class name of the schema generated.
 */
declare function getSandhandsSchema(key: string): ISandhandsSchema;
export { sandhandsProp, optionalSandhandsProp, getSandhandsSchema, ISandhandsSchema, VariableType };
