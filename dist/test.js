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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class RandomParameters {
}
__decorate([
    index_1.sandhandsProp,
    __metadata("design:type", Number)
], RandomParameters.prototype, "min", void 0);
__decorate([
    index_1.sandhandsProp,
    __metadata("design:type", Number)
], RandomParameters.prototype, "max", void 0);
const api = new index_1.Neistion(new index_1.ExpressApp(), {
    routes: [
        {
            route: "/random",
            method: "GET",
            parametersSchema: "RandomParameters",
            call(parameters) {
                const { max, min } = parameters;
                return Math.floor(Math.random() * (max - min)) + min;
            },
            verify(headers, parameters) {
                return parameters.max > parameters.min;
            }
        }
    ],
    debug: true,
    strictPropertyCheck: true,
    afterInit(app) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(app);
            console.log("called");
        });
    },
});
api.start(3000);
