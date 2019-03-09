import { IncomingHttpHeaders } from "http";
import { IApiRoute } from "../options";
import { Neistion } from "../main";

export interface IResponse {
  status: (code: number) => this;
  send: (body: any) => this;
}

export interface IRequest {
  parameters: any;
  headers: IncomingHttpHeaders;
}

export interface IApp<T> {
  afterInit?: (app: T) => void;
  init: (neistion: Neistion<T>) => void;
  listen: (port: number) => void;
  register: <K>(route: IApiRoute<K>) => void;
}
