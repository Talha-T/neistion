import { getSandhandsSchema } from "./decorator";
import {
  NeistionOptions,
  ISandhandsSchema,
  IApiRoute,
} from "./options";
import { instanceOfApiRoute } from "./utils";
import directoryRoutes from "directory-routes";
import { IResponse, IApp } from "./proxy/universal";

//////////////////////////////////////
// The main class and entry point. ///
//////////////////////////////////////

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
class Neistion<Q> implements INeistion<Q> {
  /**
   * Constructs Neistion Object.
   * @param options The required options, includes api routes too.
   * @param autoSetup Set as false, if you don't want to setup API on constructor.
   */
  constructor(
    app: IApp<Q>,
    options: NeistionOptions<Q> = { routes: [], json: true },
    autoSetup = true
  ) {
    this.options = options;
    this.app = app;
    if (autoSetup) {
      this.setup();
    }
  }
  private app!: IApp<Q>;
  public debug(message: string) {
    if (this.options.debug) {
      console.log(message);
    }
  }
  public send(res: IResponse, result: any) {
    if (this.options.json) {
      res.send(JSON.stringify(result));
    } else {
      res.send(String(result));
    }
  }
  private handleRoute<T>(route: IApiRoute<T>): void {
    // If provided a string, get registered class.
    if (typeof route.parametersSchema === "string") {
      route.parametersSchema = getSandhandsSchema(route.parametersSchema);
    }
    this.app.register(route);
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
  public readonly options: NeistionOptions<Q>;
  /**
   * Sets the server up, but doesn't start it.
   */
  public setup(): void {
    this.debug("Setting up...");

    if (this.options.afterInit) {
      this.debug("Custom after init code present. Running it..");
      this.app.afterInit = this.options.afterInit;
    }
    this.app.init(this);

    // Loops through all methods and registers them to the express.
    this.options.routes.forEach(route => {
      this.app.register(route);
    });

    this.debug("Loaded all routes!");
  }
  /**
   * Starts the setup server.
   * @param port Port to listen to.
   * @param port IP to listen to.
   */
  public async start(port: number, ip?: string): Promise<void> {
    // Run custom code if present.
    await this.app.listen(port, ip);
    this.debug("Started server!");
  }

  /**
   * Adds an API route to the route handlers.
   * @param route The API route to add to.
   */
  public addRoute<T>(route: IApiRoute<T>): void {
    this.options.routes.push(route);
    this.handleRoute(route);
  }

  /**
   * Adds all routes under a directory.
   * @param routesDirectoryPath Absolute path to the routes directory.
   */
  public async addRoutesFromDirectory(
    routesDirectoryPath = __dirname + "/routes"
  ): Promise<void> {
    const routes = await directoryRoutes(routesDirectoryPath);
    routes.forEach(route => {
      const [path, routeExport] = route;
      // Check if export structure is correct.
      if (!instanceOfApiRoute(routeExport)) {
        this.debug(`${path} does not implement IApiRoute`);
        throw new Error(`Route ${path} is not an IApiRoute`);
      }
      // If it is correct, handle the route.
      this.handleRoute(routeExport);
    });
  }
}

export { INeistion, Neistion };
