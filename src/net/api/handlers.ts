/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IControllers } from "../../controllers/controllers";
import { ILog } from "../../utils/log";
import { SocketApiV1 } from "./v1/controllers/socketapi";
import { ApiVer, IApi } from "./api";
import { IndexApi } from "./v1/indexh";
import { MeteoApiV1 } from "./v1/controllers/meteoapi";
import { SecurityApiV1 } from "./v1/controllers/securityapi";

export enum Handlers {
    INDEX,
    SOCKET,
    SECURITY,
    METEO
}

export interface IWebHandlers {
    createHandlers(api: ApiVer): void
    getHandler(handler: Handlers): IApi | undefined
    getHandlers(): IApi[]
}

export class WebHandlers implements IWebHandlers {
    private handlers: Map<Handlers, IApi> = new Map();

    constructor(
        private readonly log: ILog,
        private readonly ctrls: IControllers
    ) { }

    public createHandlers(api: ApiVer) {
        switch (api) {
            case ApiVer.V1:
                this.handlers.set(Handlers.INDEX, new IndexApi(this.log))
                this.handlers.set(Handlers.SOCKET, new SocketApiV1(this.log, this.ctrls))
                this.handlers.set(Handlers.METEO, new MeteoApiV1(this.log, this.ctrls))
                this.handlers.set(Handlers.SECURITY, new SecurityApiV1(this.log, this.ctrls))
                break

            default:
                throw new Error("Unknown API version")
        }
    }

    public getHandler(handler: Handlers): IApi | undefined {
        return this.handlers.get(handler)
    }

    public getHandlers(): IApi[] {
        let handlers: IApi[] = new Array();

        this.handlers.forEach((value: IApi, key: Handlers) => {
            handlers.push(value)
        }, this)

        return handlers
    }
}