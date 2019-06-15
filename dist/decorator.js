"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// The schemas store.
const schemas = {};
// Convert strings into constructors.
const typeStringToConstructor = {
    String: String,
    Number: Number,
    Boolean: Boolean
};
function extend(schemaName) {
    return function (constructor) {
        const baseSchema = getSandhandsSchema(schemaName);
        let newSchema = getSandhandsSchema(constructor.name);
        Object.keys(baseSchema).forEach(key => {
            newSchema[key] = baseSchema[key];
        });
        schemas[constructor.name] = newSchema;
    };
}
exports.extend = extend;
/**
 * Apply this decorator to export this property to a sandhands object.
 */
function sandhandsProp(target, key) {
    const schemaKey = target.constructor.name;
    if (!schemas[schemaKey]) {
        schemas[schemaKey] = {};
    }
    const type = Reflect.getMetadata("design:type", target, key).name;
    // Set schema object's key to type.
    schemas[schemaKey][key] = typeStringToConstructor[type] || type;
}
exports.sandhandsProp = sandhandsProp;
function optionalSandhandsProp(target, key) {
    const schemaKey = target.constructor.name;
    const type = Reflect.getMetadata("design:type", target, key).name;
    if (!schemas[schemaKey]) {
        schemas[schemaKey] = {};
    }
    schemas[schemaKey][key] = {
        _: typeStringToConstructor[type],
        optional: true
    };
}
exports.optionalSandhandsProp = optionalSandhandsProp;
function customizedSandhandsProp(options) {
    return function (target, key) {
        const schemaKey = target.constructor.name;
        const type = Reflect.getMetadata("design:type", target, key).name;
        if (!schemas[schemaKey]) {
            schemas[schemaKey] = {};
        }
        schemas[schemaKey][key] = Object.assign({ _: typeStringToConstructor[type] }, options);
    };
}
exports.customizedSandhandsProp = customizedSandhandsProp;
/**
 * Returns the sandhands schema with **class name**.
 * @param key The class name of the schema generated.
 */
function getSandhandsSchema(key) {
    return schemas[key];
}
exports.getSandhandsSchema = getSandhandsSchema;
