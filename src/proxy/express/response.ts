import { IResponse } from "../universal";
import { Response as ExpressResponse } from "express";

export class Response implements IResponse {
  constructor(response: ExpressResponse) {
    this.response = response;
  }
  private response: ExpressResponse;
  public status(code: number) {
    this.response.status(code);
    return this;
  }
  send(body: any) {
    this.response.send(body);
    return this;
  }
}
