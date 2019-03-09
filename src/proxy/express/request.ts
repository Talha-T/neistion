import { IRequest } from "../universal";
import { IncomingHttpHeaders } from "http";
import { Request as ExpressRequest } from "express";
import { HttpMethod } from "../../options";

export class Request implements IRequest {
  constructor(request: ExpressRequest, method: HttpMethod) {
    this.parameters = method == "GET" ? request.query : request.body;
    this.headers = request.headers;
  }
  public parameters: any;
  public headers: IncomingHttpHeaders;
}
