"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const decorator_1 = require("./decorator");
class RandomParameters {
}
__decorate([
    index_1.optionalSandhandsProp,
    __metadata("design:type", Number)
], RandomParameters.prototype, "min", void 0);
__decorate([
    index_1.sandhandsProp,
    __metadata("design:type", Number)
], RandomParameters.prototype, "max", void 0);
__decorate([
    decorator_1.customizedSandhandsProp({
        minLength: 4,
        lowercase: true
    }),
    __metadata("design:type", String)
], RandomParameters.prototype, "password", void 0);
console.log(index_1.getSandhandsSchema(RandomParameters.name));
const api = new index_1.Neistion(new index_1.ExpressApp(), {
    routes: [
        {
            route: "/random",
            method: "GET",
            parametersSchema: RandomParameters.name,
            call(parameters) {
                const { max } = parameters;
                const min = parameters.min || 0;
                return Math.floor(Math.random() * (max - min)) + min;
            },
            verify(headers, parameters) {
                return parameters.max > (parameters.min || 0);
            }
        }
    ],
    debug: true,
    strictPropertyCheck: true
});
api.start(3000);
