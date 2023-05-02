/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IGpio } from "../../core/gpio";
import { IDB } from "../../utils/db/db";
import { ILog, Mod } from "../../utils/log";
import { Controller, CtrlType, IController } from "../controller";
import { ISocket, Socket } from "./socket";

const READ_BUTTONS_DELAY = 100
const READ_PRESSED_BUTTONS_DELAY = 1000

export interface ISocketController extends IController {
    addSocket(name: string, relay: string, button: string): void
    getSocket(name: string): ISocket | undefined
    getSockets(): ISocket[]
}

export class SocketController extends Controller implements ISocketController {
    private sockets: ISocket[] = new Array<ISocket>();

    constructor(
        private readonly log: ILog,
        private readonly gpio: IGpio,
        private readonly db: IDB,
        type: CtrlType,
        name: string
    ) {
        super(type, name)
    }

    public addSocket(name: string, relay: string, button: string): void {
        this.sockets.push(new Socket(this.gpio, this.db, super.getName(), name, relay, button))
    }

    public getSocket(name: string): ISocket | undefined {
        for (const socket of this.sockets) {
            if (socket.getName() == name) {
                return socket
            }
        }
    }

    public getSockets() : ISocket[] {
        return this.sockets
    }

    public override start(): boolean {
        setTimeout(() => { this.readButtons() }, READ_BUTTONS_DELAY)
        return true
    }
    
    private readButtons() {
        let pressed: boolean = false

        for (const socket of this.sockets) {
            if (socket.readButton()) {
                pressed = true

                if (socket.switchState()) {
                    this.log.info(Mod.SOCKETCTRL, `Socket "${socket.getName()}" is switched to "${socket.getState()}"`)
                } else {
                    this.log.error(Mod.SOCKETCTRL, `Failed to switch socket "${socket.getName()}" state`)
                }
            }
        }

        if (pressed) {
            setTimeout(() => { this.readButtons() }, READ_PRESSED_BUTTONS_DELAY)
        } else {
            setTimeout(() => { this.readButtons() }, READ_BUTTONS_DELAY)
        }
    }
}
