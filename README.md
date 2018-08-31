- [Neistion](#neistion)
    - [Installation](#installation)
    - [Minimal Example](#minimal-example)
    - [API](#api)
        - [new Neistion([options])](#new-neistionoptions)
            - [options: NeistionOptions](#options-neistionoptions)
            - [- #### calls: IApiCall[]](#calls-iapicall)
            - [ - #### IApiCall](#iapicall)
            - [call: \<PT>(parameters: PT) => Promise<any> | any](#call-ptparameters-pt--promiseany--any)
            - [method: "GET" | "POST" | "PUT" | "DELETE"](#method-%22get%22--%22post%22--%22put%22--%22delete%22)
            - [parametersSchema: ISandhandsSchema | string](#parametersschema-isandhandsschema--string)
            - [route: string](#route-string)
            - [verify?: (headers: IncomingHttpHeaders, parameters: IncomingParameters) => Promise\<boolean> | boolean | Promise\<IStatusMessagePair> | IStatusMessagePair](#verify-headers-incominghttpheaders-parameters-incomingparameters--promiseboolean--boolean--promiseistatusmessagepair--istatusmessagepair)
            - [verifyCallback?: (headers: IncomingHttpHeaders, parameters: IncomingParameters, returnCallback: (result: IStatusMessagePair | boolean) => void) => void](#verifycallback-headers-incominghttpheaders-parameters-incomingparameters-returncallback-result-istatusmessagepair--boolean--void--void)
            - [- #### debug?: boolean](#debug-boolean)
            - [- #### express?: (express: Express) => Promise\<void>](#express-express-express--promisevoid)
            - [- #### json?: boolean](#json-boolean)
            - [api.start(port)](#apistartport)
            - [api.setup()](#apisetup)
    - [Missing something?](#missing-something)
    - [Contact](#contact)

# Neistion
**Only focus on your API. Literally nothing else.**  
node.js API's made easy.
Neistion comes with predefined parameter validation, authorization and more you can think of.
## Installation
```sh
$ npm install neistion --save
```
Remember to add these lines to tsconfig.json:
```
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```
## Minimal Example
```ts
import { Neistion } from "./index";

const api = new Neistion({
    calls: [
        {
            method: "GET",
            parametersSchema: {},
            route: "/test",
            call(parameters: any) {
                return parameters; // Automatically serialized to JSON
            }
        }
    ]
});

api.start(5000);

// localhost:5000/test?a=b
// {"a": "b"}
```
## API
```ts
import { Neistion } from "neistion";
const api = new Neistion(
    {
        ...
    }
);
```

The `api` object is where you define and start your API. You must provide a valid options object, as your API is defined there.

### new Neistion([options])

Returns the main Neistion object, which empowers the API.

Neistion constructor takes a **required** [`NeistionOptions`](#options) instance.

#### options: NeistionOptions

- #### calls: [IApiCall](#iapicall)[]
    This is where you define your **api calls**, so this should be defined.
    - #### IApiCall
        #### call: \<PT>(parameters: PT) => Promise<any> | any
        The main function for the API call. Runs last, after ~~`normalizeParameters`~~,  ~~`transformParameters`~~ and [`verify`](#verify).
        #### method: "GET" | "POST" | "PUT" | "DELETE"
        The method of the API call, as a string.
        #### parametersSchema: ISandhandsSchema | string
        This schema is used to validate incoming request parameters.  
        Examples: 
        ```ts
        {
            key: String
        }
        ```
        or, as a Typescript class:
        ```ts
        import { sandhandsProp } from "neistion";
        class ApiParameterType {
            @sandhandsProp
            public key: string;
        }
        // ...,
        parametersSchema: "ApiParameterType"
        // Because we defined sandhandsProp decorator on property, we can just type the name.
        ```
        #### route: string
        The route string, used by express.
        You can use dynamic routes too, whatever express supports as a route.
        #### verify?: (headers: IncomingHttpHeaders, parameters: IncomingParameters) => Promise\<boolean> | boolean | Promise\<IStatusMessagePair> | IStatusMessagePair
        Takes in `headers` and `parameters` of the request, and returns one of the types above.
        Use this for authentication.
        #### verifyCallback?: (headers: IncomingHttpHeaders, parameters: IncomingParameters,       returnCallback: (result: IStatusMessagePair | boolean) => void) => void
        Same as `verify`, but waits for the callback instead. Designed to be used with old libraries, using callbacks.
- #### debug?: boolean
    Whether the library should log the messages or not.
- #### express?: (express: Express) => Promise\<void>
    Takes express instance in. You can do anything with express you need here. Runs after defining routes.
- #### json?: boolean
    Whether JSON serialization should be made or not. If not, literal objects are written to requests.

#### api.start(port)
    Starts the API up at the given port. **You need to re-`setup()` everytime you modify options of api.**
#### api.setup()
    Redefines the routes, depending on options.

## Missing something?
Feel free to open an issue for requests. They are welcome.
## Contact
Implicit#8954