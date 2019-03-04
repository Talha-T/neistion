- [Neistion](#neistion)
  - [Installation](#installation)
  - [Minimal Example](#minimal-example)
  - [API](#api)
    - [new Neistion([options])](#new-neistionoptions)
      - [options: NeistionOptions](#options-neistionoptions)
      - [api.start(port)](#apistartport)
      - [api.setup()](#apisetup)
      - [api.addApiCall(call)](#apiaddapicallcall)
      - [api.addRoutesFromDirectory(routesDirectoryPath)](#apiaddroutesfromdirectoryroutesdirectorypath)
  - [Missing something?](#missing-something)
  - [Contact](#contact)

# Neistion
**Declare your APIs instead of building them.**  
Neistion comes with predefined parameter validation and sanitization, authorization and more you can think of.
Neistion is born to **simplify** your job as a framework.
## Installation
```sh
$ npm install neistion --save
```
Remember to add these lines to tsconfig.json (if you are going to use decorators):
```
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```
## Minimal Example
```ts
import { IncomingHttpHeaders } from "http";
import { Neistion, sandhandsProp } from "./index";

class RandomParameters {
  @sandhandsProp
  public min!: number;
  @sandhandsProp
  public max!: number;
}

const api = new Neistion({
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
  strictPropertyCheck: true
});

api.start(3000);
```
![example](minimal_example.gif)
## API
```ts
import { Neistion } from "neistion";
const api = new Neistion(
    {
        ...
    }
);
```

The `api` object is where you declare and start your API. You can provide an options object if you need.

### new Neistion([options])

Returns the main Neistion object, which empowers the API.

#### options: NeistionOptions

- #### routes: [IApiRoute](#iapiroute)[]
    This is where you define your **api calls** within options, so this should be defined even if it should be empty.
    - #### IApiRoute<PT>
        #### call: (parameters: PT) => Promise<any> | any
        The function to be called for the API route. Runs last, after ~~`normalizeParameters`~~,  ~~`transformParameters`~~ and [`verify`](#verify).
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
        parametersSchema: "ApiParameterType"
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
        #### verifyCallback?: (headers: IncomingHttpHeaders, parameters: IncomingParameters,       returnCallback: (result: IStatusMessagePair | boolean) => void) => void
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
    Example tree structure:
    ```ts
    api.addRoutesFromDirectory() // uses the default path, which is /routes
    ```

    ```
    - routes
        - random.js
        - index.js
    ```
    All of the files inside `routes` directory should implement IApiRoute, otherwise an error will be thrown.

## Missing something?
Feel free to open an issue for requests. They are welcome.
## Contact
Implicit#8954