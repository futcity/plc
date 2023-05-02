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
import { IOneWire } from "../core/onewire"
import { IDB } from "../utils/db/db"
import { ILog } from "../utils/log"
import { CtrlType, IController } from "./controller"
import { IMeteoController, MeteoController } from "./meteo/meteoctrl"
import { ISecurityController, SecurityController } from "./security/securityctrl"
import { ISocketController, SocketController } from "./socket/socketctrl"

export interface IControllers {
    createSocket(name: string): ISocketController
    createMeteo(name: string): IMeteoController
    createSecurity(name: string): ISecurityController
    getController(name: string): IController | undefined
    getControllers(): IController[]
}

export class Controllers implements IControllers {
    private ctrls: Map<string, IController> = new Map();

    constructor(
        private readonly log: ILog,
        private readonly gpio: IGpio,
        private readonly db: IDB,
        private readonly ow: IOneWire
    ) { }

    public createSocket(name: string): ISocketController {
        const socket = new SocketController(this.log, this.gpio, this.db, CtrlType.SOCKET, name)
        this.ctrls.set(name, socket)
        return socket
    }

    public createMeteo(name: string): IMeteoController {
        const meteo = new MeteoController(this.log, CtrlType.METEO, name)
        this.ctrls.set(name, meteo)
        return meteo
    }

    public createSecurity(name: string): ISecurityController {
        const security = new SecurityController(this.log, this.gpio, this.db, this.ow, CtrlType.SECURITY, name)
        this.ctrls.set(name, security)
        return security
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
