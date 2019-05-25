/**
 * Represents available options for objects.
 */
export interface IObjectOptions {
    /**
     * Flag as true to require all input values to be defined by the format in order to be valid. Defalt: true
     */
    strict?: boolean;
    /**
     * Flag as true on a property to make that property not required (if the input has the property the format for that property is applied)
     */
    optional?: boolean;
}
/**
 * Represents available options for strings.
 */
export interface IStringOptions {
    /**
     * Set a string to whitelist the input string.
     */
    allowed?: string;
    /**
     * Set a string to blacklist the input string.
     */
    banned?: string;
    /**
     * Flag as true to required the string be a valid email.
     */
    email?: string;
    /**
     * Flag as true to required the string be lowercase.
     */
    lowercase?: boolean;
    /**
     * Set the minimum required length of the string. Default: 1
     */
    minLength?: number;
    /**
     * Set the maximum required length of the string.
     */
    maxLength?: number;
    /**
     * Set the exact required length of the string.
     */
    length?: number;
    /**
     * Set a regular expression to test the input string.
     */
    regex?: RegExp;
    /**
     * Flag as true to required the string be uppercase.
     */
    uppercase?: boolean;
    /**
     * Flag as false to ban whitespace.
     */
    whitespace?: boolean;
    /**
     * Flag as false to ban whitespace at the beginning and end of the string
     **/
    trimmed?: boolean;
}
/**
 * Represents available options for numbers.
 */
export interface INumberOptions {
    /**
     * Flag as true to allow NaN. Default: false
     */
    allowNaN?: boolean;
    /**
     * Flag as false to allow Infinity. Default: true
     */
    finite?: boolean;
    /**
     * Set the minimum value of the input
     */
    min?: number;
    /**
     * Set the maximum value of the input
     */
    max?: number;
    /**
     * Flag as true to require even numbers.
     */
    even?: number;
    /**
     * Flag as true to require odd numbers.
     */
    odd?: number;
}
/**
 * Represents available options for booleans.
 */
export interface IBooleanOptions {
    /**
     * Checks if boolean is equal to this value.
     */
    equalTo?: boolean;
}
export interface IParameterizedOptionsBase {
    _: ParameterTypes;
}
export interface IParamaterizedStringOptions extends INumberOptions, IParameterizedOptionsBase {
}
export interface IParamaterizedNumberOptions extends INumberOptions, IParameterizedOptionsBase {
}
export interface IParamaterizedBooleanOptions extends IBooleanOptions, IParameterizedOptionsBase {
}
export interface IParameterizedObjectOptions extends IObjectOptions, IParameterizedOptionsBase {
}
export declare type ParameterTypes = IObjectOptions | INumberOptions | IStringOptions | IBooleanOptions;
