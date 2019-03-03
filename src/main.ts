import { getSandhandsSchema } from "./decorator";
import express, { Express, RequestHandler } from "express";
import {
  NeistionOptions,
  ISandhandsSchema,
  IApiRoute,
  IStatusMessagePair
} from "./options";
import { getMethodFromMethodEnum } from "./utils";
import bodyParser from "body-parser";
import { valid, details } from "sandhands";
import directoryRoutes from "directory-routes";

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
   * @param options The required options, includes api routes too.
   * @param autoSetup Set as false, if you don't want to setup API on constructor.
   */
  constructor(options: NeistionOptions = { routes: [] }, autoSetup = true) {
    this.options = options;
    // Set json option to true by default.
    if (this.options.json === undefined) {
      this.options.json = true;
    }
    if (autoSetup) {
      this.setup();
    }
  }
  private server!: Express;
  private handleRequest: (
    routeDefinition: IApiRoute,
    expressMethod: (route: string, ...handlers: RequestHandler[]) => void
  ) => void = (apiRoute, expressMethod) => {
    const routeMiddlewares = apiRoute.perRouteMiddlewares || [];
    const sandhandsOptions = {
      strict: this.options.strictPropertyCheck || false
    };
    expressMethod(apiRoute.route, ...routeMiddlewares, async (req, res) => {
      this.debug("A call to: " + apiRoute.route);
      // Sends the result, if ran succesfully.
      // Otherwise, returns status code 500 (Internal Server Error).

      try {
        // Get parameters considering method.
        const parameters = apiRoute.method === "GET" ? req.query : req.body;

        const schema: any =
          typeof apiRoute.parametersSchema === "string"
            ? getSandhandsSchema(apiRoute.parametersSchema)
            : apiRoute.parametersSchema;

        // Check parameter types
        if (!valid(parameters, schema, sandhandsOptions)) {
          // Send 400 error with missing parameters.
          this.debug("Parameters not valid!");
          const errors = details(parameters, schema, sandhandsOptions);
          return res
            .status(400)
            .send(this.options.json ? JSON.stringify(errors) : errors);
        }

        // Run verify function.
        if (apiRoute.verify) {
          this.debug("Verifying..");
          if (!(await apiRoute.verify(req.headers, parameters))) {
            // If not verified, return unauthorized.
            return res.status(401).send("Unauthorized");
          }
        }

        // Stuff here is complicated because of callbacks..
        const shouldContinue = await new Promise((resolve, reject) => {
          if (typeof apiRoute.verifyCallback === "function") {
            this.debug("Verifying..");
            apiRoute.verifyCallback(
              req.headers,
              parameters,
              (result: boolean | IStatusMessagePair) => {
                if (typeof result == "boolean") {
                  if (!result) {
                    res.status(401).send("Unauthorized");
                    return resolve(false);
                  }
                  return resolve(true);
                } else {
                  res
                    .status(result.status)
                    .send(JSON.stringify(result.message));
                  return resolve(false);
                }
              }
            );
          } else {
            resolve(true);
          }
        });

        if (!shouldContinue) {
          return;
        }
        // Call the API route.
        const result = await apiRoute.call(parameters);
        // Convert to json, if wanted.
        this.send(res, result);
        this.debug("Call successful!");
      } catch (err) {
        console.log("Caught error: ");
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });
  };
  private send(res: express.Response, result: any) {
    if (this.options.json) {
      res.send(JSON.stringify(result));
    } else {
      res.send(result);
    }
  }
  private debug(message: string) {
    if (this.options.debug) {
      console.log(message);
    }
  }
  private handleRoute(route: IApiRoute): void {
    // If provided a string, get registered class.
    if (typeof route.parametersSchema === "string") {
      route.parametersSchema = getSandhandsSchema(route.parametersSchema);
    }
    this.handleRequest(route, getMethodFromMethodEnum(route.method, this.server));
  }
  /**
   * Gets sandhands schema from Typescript class.
   * You need to put @sandhandsProp decorator for every property.
   */
  public getSandhandsSchema: (
    key: string
  ) => ISandhandsSchema | undefined = getSandhandsSchema;
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
    this.server.use(bodyParser.json({}));
    this.server.use(
      bodyParser.urlencoded({
        extended: false
      })
    );

    // Loops through all methods and registers them to the express.
    this.options.routes.forEach(route => {
      this.handleRoute(route);
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

  /**
   * Adds an API route to the route handlers.
   * @param route The API route to add to.
   */
  public addRoute(route: IApiRoute): void {
    this.options.routes.push(route);
    this.handleRoute(route);
  }

  /*public addRoutesFromDirectory(routesDirectoryPath = __dirname + '/routes'): void {
    directoryRoutes()
  }*/
}

export { INeistion, Neistion };
