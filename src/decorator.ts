import "reflect-metadata";

// Redefining types here, as I don't want this file to require other files,
// so we get a better performance.

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
 * Defines the storage of all schemas. 
 */
interface ISchemas {
    [key: string]: ISandhandsSchema;
}

// The schemas store.
const schemas: ISchemas = {};

/**
 * Apply this decorator to export this property to a sandhands object. 
 */
function sandhandsProp(target: any, key: string) {
    const schemaKey = target.constructor.name;
    if (!schemas[schemaKey]) {
        schemas[schemaKey] = {};
    }
    const type = Reflect.getMetadata("design:type", target, key).name;
    // Convert strings into constructors.
    const typeStringToConstructor: { [key: string]: any } = {
        String: String,
        Number: Number,
        Boolean: Boolean,
        Object: Object
    }

    // Set schema object's key to type.
    schemas[schemaKey][key] = typeStringToConstructor[type];
}

/**
 * Returns the sandhands schema with **class name**.
 * @param key The class name of the schema generated.
 */
function getSandhandsSchema(key: string): ISandhandsSchema {
    return schemas[key];
}

export { sandhandsProp, getSandhandsSchema };