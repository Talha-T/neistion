"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// The schemas store.
const schemas = {};
/**
 * Apply this decorator to export this property to a sandhands object.
 */
function sandhandsProp(target, key) {
    const schemaKey = target.constructor.name;
    if (!schemas[schemaKey]) {
        schemas[schemaKey] = {};
    }
    const type = Reflect.getMetadata("design:type", target, key).name;
    // Convert strings into constructors.
    const typeStringToConstructor = {
        String: String,
        Number: Number,
        Boolean: Boolean,
        Object: Object
    };
    // Set schema object's key to type.
    schemas[schemaKey][key] = typeStringToConstructor[type] || type;
}
exports.sandhandsProp = sandhandsProp;
/**
 * Returns the sandhands schema with **class name**.
 * @param key The class name of the schema generated.
 */
function getSandhandsSchema(key) {
    return schemas[key];
}
exports.getSandhandsSchema = getSandhandsSchema;
