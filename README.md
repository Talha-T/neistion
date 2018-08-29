# Neistion
**Only focus on your API. Literally nothing else.**  
Parameter check, authorization & express made easy.
## Example
with authorization, and parameter types.
```ts
import { Neistion, HttpMethod, getSandhandsSchema, sandhandsProp } from "./index";

class TestParameter {
    @sandhandsProp
    present: boolean = false;
}

const api = new Neistion({
    calls: [
        {
            method: HttpMethod.POST,
            parametersSchema: getSandhandsSchema("TestParameter"),
            route: "/test",
            async call(parameters: any) {
                return parameters;
            },
            verify(headers, parameters) {
                if (headers.authorization) {
                    return true;
                }
                return false;
            }
        }
    ],
    debug: true
});

api.setup();
api.start(5000);
```
### Setup
`npm install neistion --save`
Add these lines to tsconfig.json:
```
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```
### Why?
Because everyone likes easier.
Neistion saves you from coding express, parameter types, authorization and much more.
### How?
There are only 2 dependencies: express and sandhands.
I use sandhands for type checks, it is pretty useful.
### More?
Feel free to open an issue for requests. They are welcome.
### Contact
Implicit#8954