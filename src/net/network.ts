/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IControllers } from "../controllers/controllers"
import { IModules } from "../mod"
import { ILog } from "../utils/log"
import { IWebHandlers } from "./api/handlers"
import { IWebServer, WebServer } from "./server"

export interface INetwork {
    createWebHandlers(): void
    createWebServer(): void
    getServer(): IWebServer
    getHandlers(): IWebHandlers
}

export class Network implements INetwork {
    private handlers: IWebHandlers
    private server: IWebServer

    constructor(
        private readonly log: ILog,
        private readonly ctrls: IControllers,
        private readonly mod: IModules
    ) { }

    public createWebHandlers(): void {
        this.handlers = this.mod.createWebHandlers(
            this.log,
            this.ctrls
        )
    }

    public createWebServer(): void {
        this.server = new WebServer(this.log, this.handlers)
    }

    public getServer(): IWebServer {
        return this.server
    }

    public getHandlers(): IWebHandlers {
        return this.handlers
    }
}
