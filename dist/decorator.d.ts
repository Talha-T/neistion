import "reflect-metadata";
declare type VariableType = StringConstructor | BooleanConstructor | NumberConstructor | ObjectConstructor | undefined | null;
/**
 * Defines how a sandhands schema should be.
 */
interface ISandhandsSchema {
    [key: string]: VariableType;
}
/**
 * Apply this decorator to export this property to a sandhands object.
 */
declare function sandhandsProp(target: any, key: string): void;
/**
 * Returns the sandhands schema with **class name**.
 * @param key The class name of the schema generated.
 */
declare function getSandhandsSchema(key: string): ISandhandsSchema;
export { sandhandsProp, getSandhandsSchema };
