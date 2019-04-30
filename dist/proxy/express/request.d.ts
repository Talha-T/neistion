/// <reference types="node" />
import { IRequest } from "../universal";
import { IncomingHttpHeaders } from "http";
import { Request as ExpressRequest } from "express";
import { HttpMethod } from "../../options";
export declare class Request implements IRequest {
    constructor(request: ExpressRequest, method: HttpMethod);
    parameters: any;
    headers: IncomingHttpHeaders;
}
