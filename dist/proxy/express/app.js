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
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
const decorator_1 = require("../../decorator");
const utils_1 = require("../../utils");
const sandhands_1 = require("sandhands");
class ExpressApp {
    constructor() {
        this.app = express_1.default();
    }
    init(neistion) {
        this.app.use(bodyParser.json({}));
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.neistion = neistion;
        // If custom afterInit is present, run it.
        if (this.afterInit)
            this.afterInit(this.app);
    }
    listen(port) {
        this.app.listen(port);
    }
    register(route) {
        if (typeof route.parametersSchema === "string") {
            route.parametersSchema = decorator_1.getSandhandsSchema(route.parametersSchema);
        }
        const expressMethod = utils_1.getMethodFromMethodEnum(route.method, this.app);
        const routeMiddlewares = route.perRouteMiddlewares || [];
        const sandhandsOptions = {
            strict: this.neistion.options.strictPropertyCheck || false
        };
        expressMethod(route.route, ...routeMiddlewares, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.neistion.debug("A call to: " + route.route);
            // Sends the result, if ran succesfully.
            // Otherwise, returns status code 500 (Internal Server Error).
            try {
                // Get parameters considering method.
                const parameters = route.method === "GET" ? req.query : req.body;
                const schema = typeof route.parametersSchema === "string"
                    ? decorator_1.getSandhandsSchema(route.parametersSchema)
                    : route.parametersSchema;
                // Converts parameters to correct type according to schema
                Object.keys(schema).forEach(key => {
                    // Avoid errors
                    if (parameters[key]) {
                        if (typeof schema[key] == "function") {
                            parameters[key] = schema[key](parameters[key]);
                        }
                        else {
                            parameters[key] = schema[key]._(parameters[key]);
                        }
                    }
                });
                // Check parameter types
                if (!sandhands_1.valid(parameters, schema, sandhandsOptions)) {
                    // Send 400 error with missing parameters.
                    this.neistion.debug("Parameters not valid!");
                    const errors = sandhands_1.details(parameters, schema, sandhandsOptions);
                    return res
                        .status(400)
                        .send(this.neistion.options.json ? JSON.stringify(errors) : errors);
                }
                let verified = true;
                // Run verify function.
                if (route.verify) {
                    this.neistion.debug("Verifying..");
                    const result = yield route.verify(req.headers, parameters);
                    if (typeof result == "boolean") {
                        if (!result) {
                            this.neistion.debug("Not verified!");
                            res.status(401).send("Unauthorized");
                            verified = false;
                            return;
                        }
                    }
                    else {
                        res.status(result.status).send(JSON.stringify(result.message));
                        this.neistion.debug("Not verified!");
                        verified = false;
                        return;
                    }
                }
                if (!verified)
                    return;
                // Stuff here is complicated because of callbacks..
                const shouldContinue = yield new Promise((resolve, reject) => {
                    if (typeof route.verifyCallback === "function") {
                        this.neistion.debug("Verifying..");
                        route.verifyCallback(req.headers, parameters, (result) => {
                            if (typeof result == "boolean") {
                                if (!result) {
                                    this.neistion.debug("Not verified!");
                                    res.status(401).send("Unauthorized");
                                    return resolve(false);
                                }
                                return resolve(true);
                            }
                            else {
                                res
                                    .status(result.status)
                                    .send(JSON.stringify(result.message));
                                this.neistion.debug("Not verified!");
                                return resolve(result.status < 400); // 4xx and 5xx are error codes.
                            }
                        });
                    }
                    else {
                        resolve(true);
                    }
                });
                if (!shouldContinue) {
                    return;
                }
                // Call the API route.
                const result = yield route.call(parameters, (route.getParamaters || (() => undefined))(req));
                // Convert to json, if wanted.
                this.neistion.send(res, result);
                this.neistion.debug("Call successful!");
            }
            catch (err) {
                this.neistion.debug("Caught error: ");
                this.neistion.debug(err);
                res.status(500).send("Internal Server Error");
            }
        }));
    }
}
exports.ExpressApp = ExpressApp;
