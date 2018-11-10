"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const api = new index_1.Neistion({
    calls: [
        {
            route: "/test",
            method: "GET",
            perRouteMiddlewares: [(req, res, next) => {
                    next();
                }],
            call(parameters) {
                return "success!";
            },
            parametersSchema: {},
        }
    ],
    debug: true
});
api.start(3000);
api.addApiCall({
    method: "GET",
    route: "/test2",
    call(parameters) {
        return parameters;
    },
    parametersSchema: {}
});
