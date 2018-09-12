"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("./decorator");
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const body_parser_1 = __importDefault(require("body-parser"));
const sandhands_1 = require("sandhands");
/**
 * The main class for Neistion.
 */
class Neistion {
    /**
     * Constructs Neistion Object.
     * @param options The required options, includes api calls too.
     * @param autoSetup Set as false, if you don't want to setup API on constructor.
     */
    constructor(options, autoSetup = true) {
        this.handleRequest = (apiCall, expressMethod) => {
            expressMethod(apiCall.route, (req, res) => __awaiter(this, void 0, void 0, function* () {
                this.debug("A call to: " + apiCall.route);
                // Sends the result, if ran succesfully.
                // Otherwise, returns status code 500 (Internal Server Error).
                try {
                    // Get parameters considering method.
                    const parameters = apiCall.method === "GET" ? req.query
                        : req.body;
                    // Check parameter types
                    if (!sandhands_1.valid(parameters, apiCall.parametersSchema)) {
                        // Send 400 error with missing parameters.
                        this.debug("Parameters not valid!");
                        const errors = sandhands_1.details(parameters, apiCall.parametersSchema);
                        return res.status(400).send(this.options.json ? JSON.stringify(errors) : errors);
                    }
                    // Run verify function.
                    if (apiCall.verify) {
                        this.debug("Verifying..");
                        if (!(yield apiCall.verify(req.headers, parameters))) {
                            // If not verified, return unauthorized.
                            return res.status(401).send("Unauthorized");
                        }
                    }
                    // Stuff here is complicated because of callbacks..
                    const shouldContinue = yield (new Promise((resolve, reject) => {
                        if (typeof (apiCall.verifyCallback) === "function") {
                            this.debug("Verifying..");
                            apiCall.verifyCallback(req.headers, parameters, (result) => {
                                if (typeof (result) == "boolean") {
                                    if (!result) {
                                        res.status(401).send("Unauthorized");
                                        return resolve(false);
                                    }
                                    return resolve(true);
                                }
                                else {
                                    res.status(result.status).send(JSON.stringify(result.message));
                                    return resolve(false);
                                }
                            });
                        }
                        else {
                            resolve(true);
                        }
                    }));
                    if (!shouldContinue) {
                        return;
                    }
                    // Run the API call.
                    const result = yield apiCall.call(parameters);
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
            }));
        };
        /**
         * Gets sandhands schema from Typescript class.
         * You need to put @sandhandsProp decorator for every property.
         */
        this.getSandhandsSchema = decorator_1.getSandhandsSchema;
        this.options = options;
        // Set json option to true by default.
        if (this.options.json === undefined) {
            this.options.json = true;
        }
        if (autoSetup) {
            this.setup();
        }
    }
    debug(message) {
        if (this.options.debug) {
            console.log(message);
        }
    }
    /**
     * Sets the server up, but doesn't start it.
     */
    setup() {
        this.debug("Setting up...");
        // Express is re-setup every time this method is called.
        this.server = express_1.default();
        this.debug("Initializing middlewares...");
        // Initialize body parsing.
        this.server.use(body_parser_1.default.json({}));
        this.server.use(body_parser_1.default.urlencoded({
            extended: false
        }));
        // Loops through all methods and registers them to the express.
        this.options.calls.forEach((call) => {
            // If provided a string, get registered class.
            if (typeof (call.parametersSchema) === "string") {
                call.parametersSchema = decorator_1.getSandhandsSchema(call.parametersSchema);
            }
            this.handleRequest(call, utils_1.getMethodFromMethodEnum(call.method, this.server));
        });
        this.debug("Loaded all routes!");
    }
    /**
     * Starts the setup server.
     * @param port Port to listen to.
     */
    start(port) {
        return __awaiter(this, void 0, void 0, function* () {
            // Run custom code if present.
            if (this.options.express) {
                this.debug("Custom express code present. Running it..");
                this.options.express(this.server);
            }
            yield this.server.listen(port);
            this.debug("Started server!");
        });
    }
}
exports.Neistion = Neistion;
