/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { ILog, Log, Mod } from "../utils/log"
import { IWebHandlers } from "./api/handlers"
import express, { Express } from "express";

export interface IWebServer {
    registerHandlers(): void
    start(): void
}

export class WebServer implements IWebServer {
    private port: number = 8090
    private exp: Express = express()

    constructor(
        private readonly log: ILog,
        private readonly handlers: IWebHandlers
    ) {
    }

    public registerHandlers(): void {
        this.handlers.getHandlers().forEach(handler => {
            handler.register(this.exp)
        }, this)
    }

    public start(): void {
        this.exp.listen(this.port, () => {
            this.log.info(Mod.SERVER, "API server was started at port: " + this.port)
        })
    }
}
