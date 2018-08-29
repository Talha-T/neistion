import { NeistionOptions, ISandhandsSchema } from "./options";
/**
 * Defines what a Neistion should have.
 */
interface INeistion {
    /**
     * The options for neistion.
     */
    options: NeistionOptions;
    /**
     * Returns a sandhands schema for **class name**.
     * You need to apply @sandhandsProp decorator to properties of class.
     */
    getSandhandsSchema: (key: string) => ISandhandsSchema | undefined;
    /**
     * Sets up the API.
     */
    setup: () => void;
    /**
     * Starts the setup API.
     */
    start: (port: number) => Promise<void>;
}
/**
 * The main class for Neistion.
 */
declare class Neistion implements INeistion {
    /**
     * Constructs Neistion Object.
     * @param options The required options, includes api calls too.
     */
    constructor(options: NeistionOptions);
    private server;
    private handleRequest;
    private debug;
    /**
     * Gets sandhands schema from Typescript class.
     * You need to put @sandhandsProp decorator for every property.
     */
    getSandhandsSchema: (key: string) => ISandhandsSchema | undefined;
    /**
     * The current options.
     */
    readonly options: NeistionOptions;
    /**
     * Sets the server up, but doesn't start it.
     */
    setup(): void;
    /**
     * Starts the setup server.
     * @param port Port to listen to.
     */
    start(port: Number): Promise<void>;
}
export { INeistion, Neistion };
