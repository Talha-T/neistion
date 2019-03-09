- [Neistion](#neistion)
  - [Installation](#installation)
  - [Example](#example)
  - [API](#api)
    - [new Neistion(app, [options])](#new-neistionapp-options)
      - [app: IApp<T>](#app-iappt)
      - [options: NeistionOptions](#options-neistionoptions)
      - [api.start(port)](#apistartport)
      - [api.setup()](#apisetup)
      - [api.addApiCall(call)](#apiaddapicallcall)
      - [api.addRoutesFromDirectory(routesDirectoryPath)](#apiaddroutesfromdirectoryroutesdirectorypath)
  - [Missing something?](#missing-something)
  - [Contact](#contact)

# Neistion

**Declare your APIs instead of writing them.**  
Neistion comes with predefined parameter validation and sanitization, authorization and more you can think of. Supports multiple frameworks, and you can create your own framework wrapper easily.

## Installation

```sh
$ npm install neistion --save
```

Remember to add these lines to tsconfig.json (if you are going to use decorators):

```
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

## Example

```ts
import { IncomingHttpHeaders } from "http";
import { Neistion, sandhandsProp, ExpressApp } from "neistion";

class RandomParameters {
  @sandhandsProp
  public min!: number;
  @sandhandsProp
  public max!: number;
}

cconst api = new Neistion(new ExpressApp(), {
  routes: [
    {
      route: "/random",
      method: "GET",
      parametersSchema: "RandomParameters",
      call(parameters: RandomParameters) {
        const { max, min } = parameters;
        return Math.floor(Math.random() * (max - min)) + min;
      },
      verify(headers: IncomingHttpHeaders, parameters: RandomParameters) {
        return parameters.max > parameters.min;
      }
    }
  ],
  debug: true,
  strictPropertyCheck: true,
});

api.start(3000);
```

![example](example.gif)

## API

### new Neistion(app, [options])

Returns the main Neistion object, which empowers the API.

#### app: IApp<T>
    This is the proxy between Neistion and your framework. Change this to change what framework is used in your API. You can easily implement your own proxy, check `src/proxy/` for that.

    Currently, available options are `ExpressApp` and ~~`FastifyApp`~~

#### options: NeistionOptions

- #### routes: [IApiRoute](#iapiroute)[]
  This is where you define your **api calls** within options, so this should be defined even if it should be empty.
  - #### IApiRoute<PT>
    #### call: (parameters: PT) => Promise<any> | any
    The function to be called for the API route. Runs last, after ~~`normalizeParameters`~~, ~~`transformParameters`~~ and [`verify`](#verify).
    #### method: "GET" | "POST" | "PUT" | "DELETE"
    The method of the API call, as a string.
    #### parametersSchema: ISandhandsSchema | string
    This schema is used to validate incoming request parameters.  
     Examples:
    ```ts
    {
        key: String,
        number: Number,
        isCool: Boolean
    }
    ```
    or, as a Typescript class using power of decorators:
    ```ts
    import { sandhandsProp } from "neistion";
    class ApiParameterType {
      @sandhandsProp
      public key: string;
    }
    // ...,
    parametersSchema: "ApiParameterType";
    // Because we defined sandhandsProp decorator on property, we can just type the name. Otherwise, we should duplicat e it.
    ```
    #### perRouteMiddlewares: RequestHandler[]
    An array of middlewares to be run only for this route.
    #### route: string
    The route string, used by express.
    You can use dynamic routes too, whatever express supports as a route.
    #### verify?: (headers: IncomingHttpHeaders, parameters: PT) => Promise\<boolean> | boolean | Promise\<IStatusMessagePair> | IStatusMessagePair
    Takes in `headers` and `parameters` of the request, and returns one of the types above.
    Use this for authentication.
    #### verifyCallback?: (headers: IncomingHttpHeaders, parameters: IncomingParameters, returnCallback: (result: IStatusMessagePair | boolean) => void) => void
    Same as `verify`, but waits for the callback instead. Designed to be used with old libraries, using callbacks.
- #### debug?: boolean
  Whether the library should log the debug messages or not.
- #### express?: (express: Express) => Promise\<void>
  Takes express instance in. You can do anything with express you need here. Runs after defining routes.
- #### json?: boolean
  Whether JSON serialization should be made or not. If not, literal objects are written to requests.
- #### strictPropertyCheck?: boolean
  If set to true, parameter objects with extra properties will be an invalid parameter.

#### api.start(port)

    Starts the API up at the given port.

#### api.setup()

    Redefines the routes from scratch, depending on options.

#### api.addApiCall(call)

    Adds an API call to the route handlers. You do not need to `setup()` after this function.

#### api.addRoutesFromDirectory(routesDirectoryPath)

    Adds all modules inside given directory as routes to the API.
    
    api.addRoutesFromDirectory() // uses the default path, which is /routes

    Example tree structure:
    - routes
        - random.js
        - index.js
 
    All of the files inside `routes` directory should implement IApiRoute, otherwise an error will be thrown.

## Missing something?

Feel free to open an issue for requests. They are welcome.

## Contact

Implicit#8954
