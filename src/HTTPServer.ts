/*
   We probably shouldn't install either express or fastify in the neiston dependencies
   Because installing either one creates unnecessary dependencies
   However this also means that we're requiring them to install an additional dependency
   Every time they install so it's kind of debatable. I'll leave it up to you how to handle that but
   in any case this code is good to make sure at least one is installed.
*/
try {
  require("express")
} catch(error) {
  if (!error.startsWith("Cannot find module")) throw error // Throw the error directly if it is some other error when requiring than not being able to find the package
  try {
    require("fastify")
  } catch(error) {
    if (!error.startsWith("Cannot find module")) throw error
    throw new Error("Requires either Fastify or Express to be installed.")
  }
}

const allowedMethods: Array<string> = [ "DELETE", "GET", "HEAD", "PATCH", "POST", "PUT", "OPTIONS" ]

class HTTPServer {
  type: string;
  app: Object;
  constructor(serverType: string) {
    if (!["express", "fastify"].includes(serverType)) throw new Error("Invalid Server Type");
    this.type = serverType;
    this.app = require(this.type)();
  }
  declareRoute(...args: any[]) {
    if (args.length < 2) throw new Error("Missing Arguments");
    if (args.length > 3) throw new Error("Too Many Arguments");
    const method: string = args[0] as string;
    if (!allowedMethods.includes(method)) throw new Error(`Invalid HTTP Method "${method}"`);
    const path: string = args.length > 2 && typeof args[1] === "string" ? args[1] : "";
    const handler: Function = args[args.length - 1] as Function;
    if (typeof handler !== 'function') throw new Error("Route handler must be a function.");
    if (path) {
      this.app[method](path, this.createUniversalHandler(handler));
    } else {
      this.app[method](this.createUniversalHandler(handler));
    }
  }
  createUniversalHandler(inputHandler): Function {
    return (req: Object, res: Object) => {
      return inputHandler(new UniversalRequest(this.type, req), new UniversalResponse(this.type, res))
    }
  }
}

class UniversalRequest {
  appType: string;
  request: Object;
  constructor(appType: string, request: Object) {
    this.appType = appType
    this.request = request
  }
}

export default HTTPServer
