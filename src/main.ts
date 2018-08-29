import { getSandhandsSchema } from "./decorator";
import express, { Express, RequestHandler } from "express";
import { NeistionOptions, ISandhandsSchema, IApiCall } from "./options";
import { getMethodFromMethodEnum, getConstructorFromString } from "./utils";
import bodyParser from "body-parser";
import { HttpMethod } from ".";
import { valid, details } from "sandhands";

//////////////////////////////////////
// The main class and entry point. ///
//////////////////////////////////////

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
class Neistion implements INeistion {
    /**
     * Constructs Neistion Object.
     * @param options The required options, includes api calls too.
     */
    constructor(options: NeistionOptions) {
        this.options = options;
        // Set json option to true by default.
        if (this.options.json === undefined) {
            this.options.json = true;
        }
    }
    private server!: Express;
    private handleRequest: (call: IApiCall, expressMethod: (route: string, handler: RequestHandler) => void) => void =
        (apiCall, expressMethod) => {
            expressMethod(apiCall.route, async (req, res) => {
                this.debug("A call to: " + apiCall.route);
                // Sends the result, if ran succesfully.
                // Otherwise, returns status code 500 (Internal Server Error).

                try {
                    // Get parameters considering method.
                    const parameters = apiCall.method === HttpMethod.GET ? req.query
                        : req.body;

                    // Check parameter types
                    if (!valid(parameters, apiCall.parametersSchema)) {
                        // Send 400 error with missing parameters.
                        this.debug("Parameters not valid!");
                        const errors = details(parameters, apiCall.parametersSchema);
                        return res.status(400).send(
                            this.options.json ? JSON.stringify(errors) : errors
                        );
                    }

                    // Run verify function.
                    if (apiCall.verify) {
                        this.debug("Verifying..");
                        if (!(await apiCall.verify(req.headers, parameters))) {
                            // If not verified, return unauthorized.
                            return res.status(401).send("Unauthorized");
                        }
                    }

                    // Run the API call.
                    const result = await apiCall.call(parameters);
                    // Convert to json, if wanted.
                    if (this.options.json) {
                        res.send(JSON.stringify(result));
                    }
                    else {
                        res.send(result);
                    }
                    this.debug("Call successful!");
                }
                catch (err) {
                    console.log("Caught error: ");
                    console.log(err);
                    res.status(500).send("Internal Server Error");
                }
            });
        };
    private debug(message: string) {
        if (this.options.debug) {
            console.log(message);
        }
    }
    /**
     * Gets sandhands schema from Typescript class.
     * You need to put @sandhandsProp decorator for every property.
     */
    public getSandhandsSchema: (key: string) => ISandhandsSchema | undefined = getSandhandsSchema;
    /**
     * The current options.
     */
    public readonly options: NeistionOptions;
    /**
     * Sets the server up, but doesn't start it.
     */
    public setup(): void {
        this.debug("Setting up...");
        // Express is re-setup every time this method is called.
        this.server = express();

        this.debug("Initializing middlewares...");
        // Initialize body parsing.
        this.server.use(bodyParser.json({}))
        this.server.use(bodyParser.urlencoded({
            extended: false
        }));

        // Loops through all methods and registers them to the express.
        this.options.calls.forEach((call) => {
            this.handleRequest(call,
                getMethodFromMethodEnum(call.method, this.server))
        });
        this.debug("Loaded all routes!");
    }
    /**
     * Starts the setup server.
     * @param port Port to listen to.
     */
    public async start(port: Number): Promise<void> {
        // Run custom code if present.
        if (this.options.express) {
            this.debug("Custom express code present. Running it..");
            this.options.express(this.server);
        }
        await this.server.listen(port);
        this.debug("Started server!");
    }

}

export { INeistion, Neistion };