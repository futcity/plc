/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IGpio } from "../core/gpio"
import { IDB } from "../utils/db/db"
import { ILog } from "../utils/log"
import { CtrlType, IController } from "./controller"
import { ISocketController, SocketController } from "./socket/socketctrl"

export interface IControllers {
    createSocket(name: string): ISocketController
    getController(name: string): IController | undefined
    getControllers(): IController[]
}

export class Controllers implements IControllers {
    private ctrls: Map<string, IController> = new Map();

    constructor(
        private readonly log: ILog,
        private readonly gpio: IGpio,
        private readonly db: IDB
    ) { }

    public createSocket(name: string): ISocketController {
        const socket = new SocketController(this.log, this.gpio, this.db, CtrlType.SOCKET, name)
        this.ctrls.set(name, socket)
        return socket
    }

    public getController(name: string): IController | undefined {
        return this.ctrls.get(name)
    }

    public getControllers(): IController[] {
        let controllers: IController[] = new Array();

        this.ctrls.forEach((value: IController, key: string) => {
            controllers.push(value)
        }, this)

        return controllers
    }
}
