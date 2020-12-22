import { NeistionOptions, ISandhandsSchema, IApiRoute } from "./options";
import { IResponse, IApp } from "./proxy/universal";
/**
 * Defines what a Neistion should have.
 */
interface INeistion<T> {
    /**
     * The options for neistion.
     */
    options: NeistionOptions<T>;
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
    start: (port: number, ip?: string) => Promise<void>;
}
/**
 * The main class for Neistion.
 */
declare class Neistion<Q> implements INeistion<Q> {
    /**
     * Constructs Neistion Object.
     * @param options The required options, includes api routes too.
     * @param autoSetup Set as false, if you don't want to setup API on constructor.
     */
    constructor(app: IApp<Q>, options?: NeistionOptions<Q>, autoSetup?: boolean);
    private app;
    debug(message: string): void;
    send(res: IResponse, result: any): void;
    private handleRoute;
    /**
     * Gets sandhands schema from Typescript class.
     * You need to put @sandhandsProp decorator for every property.
     */
    getSandhandsSchema: (key: string) => ISandhandsSchema | undefined;
    /**
     * The current options.
     */
    readonly options: NeistionOptions<Q>;
    /**
     * Sets the server up, but doesn't start it.
     */
    setup(): void;
    /**
     * Starts the setup server.
     * @param port Port to listen to.
     * @param port IP to listen to.
     */
    start(port: number, ip?: string): Promise<void>;
    /**
     * Adds an API route to the route handlers.
     * @param route The API route to add to.
     */
    addRoute<T>(route: IApiRoute<T>): void;
    /**
     * Adds all routes under a directory.
     * @param routesDirectoryPath Absolute path to the routes directory.
     */
    addRoutesFromDirectory(routesDirectoryPath?: string): Promise<void>;
}
export { INeistion, Neistion };
