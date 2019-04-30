import { IResponse } from "../universal";
import { Response as ExpressResponse } from "express";
export declare class Response implements IResponse {
    constructor(response: ExpressResponse);
    private response;
    status(code: number): this;
    send(body: any): this;
}
