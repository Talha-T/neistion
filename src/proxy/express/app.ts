import { IApp } from "../universal";
import express, { Express } from "express";
import bodyParser = require("body-parser");
import { IApiRoute, IStatusMessagePair } from "../../options";
import { getSandhandsSchema } from "../../decorator";
import { getMethodFromMethodEnum } from "../../utils";
import { Neistion } from "../../main";
import { valid, details } from "sandhands";
import https from "https";
import { readFileSync } from "fs";

export class ExpressApp implements IApp<Express> {
  private app: Express = express();
  private neistion!: Neistion<Express>;
  afterInit?: ((app: Express) => void) | undefined;
  init(neistion: Neistion<Express>) {
    this.app.use(
      bodyParser.json({
        limit: neistion.options.bodyLimit,
      })
    );
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );
    this.neistion = neistion;

    // If custom afterInit is present, run it.
    if (this.afterInit) this.afterInit(this.app);
  }
  listen(port: number, ip?: string) {
    if (!this.neistion.options.secure) {
      if (ip !== undefined) {
        this.app.listen(port, ip);
      } else {
        this.app.listen(port);
      }
    } else {
      const server = https.createServer(
        {
          key: readFileSync(this.neistion.options.sslKey!),
          cert: readFileSync(this.neistion.options.sslCert!),
        },
        this.app
      );

      server.listen(port, ip);
    }
  }
  register<K>(route: IApiRoute<K>) {
    if (typeof route.parametersSchema === "string") {
      route.parametersSchema = getSandhandsSchema(route.parametersSchema);
    }

    const expressMethod = getMethodFromMethodEnum(route.method, this.app);

    const routeMiddlewares = route.perRouteMiddlewares || [];
    const sandhandsOptions = {
      strict: this.neistion.options.strictPropertyCheck || false,
    };
    expressMethod(route.route, ...routeMiddlewares, async (req, res) => {
      this.neistion.debug("A call to: " + route.route);
      // Sends the result, if ran succesfully.
      // Otherwise, returns status code 500 (Internal Server Error).

      try {
        // Get parameters considering method.
        const parameters = route.method === "GET" ? req.query : req.body;

        const schema: any =
          typeof route.parametersSchema === "string"
            ? getSandhandsSchema(route.parametersSchema)
            : route.parametersSchema;

        // Converts parameters to correct type according to schema
        Object.keys(schema).forEach((key) => {
          // Avoid errors
          if (parameters[key]) {
            if (typeof schema[key] == "function") {
              parameters[key] = schema[key](parameters[key]);
            } else if (Array.isArray(schema[key])) {
              if (typeof schema[key] === "function") {
                const oldParameters = parameters[key];
                parameters[key] = [];
                oldParameters.forEach((x: any) =>
                  parameters[key].push(schema[key][0](x))
                );
              }
            } else {
              const func = schema[key]._;
              if (typeof func === "function") {
                parameters[key] = schema[key]._(parameters[key]);
              }
              if (Array.isArray(func)) {
                const oldParameters = parameters[key];
                const arrayFunc = func[0];
                if (typeof arrayFunc === "function") {
                  parameters[key] = [];
                  oldParameters.forEach((x: any) =>
                    parameters[key].push(func[0](x))
                  );
                }
              }
            }
          }
        });

        // Check parameter types
        if (!valid(parameters, schema, sandhandsOptions)) {
          // Send 400 error with missing parameters.
          this.neistion.debug("Parameters not valid!");
          const errors = details(parameters, schema, sandhandsOptions);
          return res
            .status(400)
            .send(this.neistion.options.json ? JSON.stringify(errors) : errors);
        }

        let verified = true;

        // Run verify function.
        if (route.verify) {
          this.neistion.debug("Verifying..");
          const result = await route.verify(req.headers, parameters);
          if (typeof result == "boolean") {
            if (!result) {
              this.neistion.debug("Not verified!");
              res.status(401).send("Unauthorized");
              verified = false;
              return;
            }
          } else {
            res.status(result.status).send(JSON.stringify(result.message));
            this.neistion.debug("Not verified!");
            verified = false;
            return;
          }
        }

        if (!verified) return;
        // Stuff here is complicated because of callbacks..
        const shouldContinue = await new Promise((resolve, reject) => {
          if (typeof route.verifyCallback === "function") {
            this.neistion.debug("Verifying..");
            route.verifyCallback(
              req.headers,
              parameters,
              (result: boolean | IStatusMessagePair) => {
                if (typeof result == "boolean") {
                  if (!result) {
                    this.neistion.debug("Not verified!");
                    res.status(401).send("Unauthorized");
                    return resolve(false);
                  }
                  return resolve(true);
                } else {
                  res
                    .status(result.status)
                    .send(JSON.stringify(result.message));
                  this.neistion.debug("Not verified!");
                  return resolve(result.status < 400); // 4xx and 5xx are error codes.
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
        const result = await route.call(
          parameters,
          (route.getParamaters || (() => undefined))(req, res)
        );
        // Convert to json, if wanted.
        this.neistion.send(res, result);
        this.neistion.debug("Call successful!");
      } catch (err) {
        this.neistion.debug("Caught error: ");
        this.neistion.debug(err);
        res.status(500).send("Internal Server Error");
      }
    });
  }
}
