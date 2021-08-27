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
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("./decorator");
const utils_1 = require("./utils");
const directory_routes_1 = __importDefault(require("directory-routes"));
/**
 * The main class for Neistion.
 */
class Neistion {
    /**
     * Constructs Neistion Object.
     * @param options The required options, includes api routes too.
     * @param autoSetup Set as false, if you don't want to setup API on constructor.
     */
    constructor(app, options = { routes: [], json: true, secure: false }, autoSetup = true) {
        /**
         * Gets sandhands schema from Typescript class.
         * You need to put @sandhandsProp decorator for every property.
         */
        this.getSandhandsSchema = decorator_1.getSandhandsSchema;
        this.options = options;
        this.app = app;
        if (autoSetup) {
            this.setup();
        }
    }
    debug(message) {
        if (this.options.debug) {
            console.log(message);
        }
    }
    send(res, result, json = true) {
        if (json && this.options.json) {
            res.send(JSON.stringify(result));
        }
        else {
            res.send(String(result));
        }
    }
    handleRoute(route) {
        // If provided a string, get registered class.
        if (typeof route.parametersSchema === "string") {
            route.parametersSchema = decorator_1.getSandhandsSchema(route.parametersSchema);
        }
        this.app.register(route);
    }
    /**
     * Sets the server up, but doesn't start it.
     */
    setup() {
        this.debug("Setting up...");
        if (this.options.afterInit) {
            this.debug("Custom after init code present. Running it..");
            this.app.afterInit = this.options.afterInit;
        }
        this.app.init(this);
        // Loops through all methods and registers them to the express.
        this.options.routes.forEach((route) => {
            this.app.register(route);
        });
        this.debug("Loaded all routes!");
    }
    /**
     * Starts the setup server.
     * @param port Port to listen to.
     * @param port IP to listen to.
     */
    start(port, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            // Run custom code if present.
            yield this.app.listen(port, ip);
            this.debug("Started server!");
        });
    }
    /**
     * Adds an API route to the route handlers.
     * @param route The API route to add to.
     */
    addRoute(route) {
        this.options.routes.push(route);
        this.handleRoute(route);
    }
    /**
     * Adds all routes under a directory.
     * @param routesDirectoryPath Absolute path to the routes directory.
     */
    addRoutesFromDirectory(routesDirectoryPath = __dirname + "/routes") {
        return __awaiter(this, void 0, void 0, function* () {
            const routes = yield directory_routes_1.default(routesDirectoryPath);
            routes.forEach((route) => {
                const [path, routeExport] = route;
                // Check if export structure is correct.
                if (!utils_1.instanceOfApiRoute(routeExport)) {
                    this.debug(`${path} does not implement IApiRoute`);
                    throw new Error(`Route ${path} is not an IApiRoute`);
                }
                // If it is correct, handle the route.
                this.handleRoute(routeExport);
            });
        });
    }
}
exports.Neistion = Neistion;
