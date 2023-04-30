/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { CtrlType } from "../../../controllers/controller"
import { IControllers } from "../../../controllers/controllers"
import { ISocketController } from "../../../controllers/socket/socketctrl"
import { IDB } from "../../db/db"
import { ILog, Mod } from "../../log"

export class ControllersConfigsParser {
    constructor(
        private readonly log: ILog,
        private readonly db: IDB,
        private readonly ctrls: IControllers,
        private readonly data: any
    ) { }

    public parseAll() {
        for (const ctrl of this.data.controllers) {
            switch (ctrl.type) {
                case CtrlType.SOCKET:
                    this.log.info(Mod.APP, `Add socket controller "${ctrl.name}"`)
                    const socket = this.ctrls.createSocket(ctrl.name)
                    this.parseSocket(socket, ctrl)
                    break

                default:
                    throw new Error(`Unknown controller type "${ctrl.type}"`)
            }
        }
    }

    private parseSocket(socket: ISocketController, ctrl: any) {
        if (!ctrl.sockets) {
            throw new Error("Sockets not found")
        }

        for (const sock of ctrl.sockets) {
            if (!sock.name) {
                throw new Error("Socket name not found")
            }
            
            /**
             * Add new socket
             */

            socket.addSocket(sock.name, sock.pins.relay, sock.pins.button)
            this.log.info(Mod.APP, `Add socket "${sock.name}" relay "${sock.pins.relay}" button "${sock.pins.button}"`)

            /**
             * Load socket state from Database
             */

            let state: boolean = false
            
            try {
                state = <boolean>this.db.curDB().select(CtrlType.SOCKET, ctrl.name, sock.name, "state")
            } catch (err: any) {
                this.db.curDB().insert(CtrlType.SOCKET, ctrl.name, sock.name, "state", state)
                this.db.curDB().save()
            }

            const s = socket.getSocket(sock.name)
            s?.setState(state, false)
        }
    }
}