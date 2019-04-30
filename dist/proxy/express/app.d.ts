import { IApp } from "../universal";
import { Express } from "express";
import { IApiRoute } from "../../options";
import { Neistion } from "../../main";
export declare class ExpressApp implements IApp<Express> {
    private app;
    private neistion;
    afterInit?: ((app: Express) => void) | undefined;
    init(neistion: Neistion<Express>): void;
    listen(port: number): void;
    register<K>(route: IApiRoute<K>): void;
}
