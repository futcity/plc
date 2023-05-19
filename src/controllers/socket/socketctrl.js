/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { log, LogMod } from "../../utils/log.js"
import { db } from "../../database/db.js"
import { Controller } from "../controller.js"

const READ_BUTTONS_DELAY            = 200
const READ_PRESSED_BUTTONS_DELAY    = 1000

export class SocketController extends Controller {
    #sockets = new Map()

    addSocket(socket) {
        this.#sockets.push(socket)
    }

    setStatus(name, status, save) {
        const socket = this.#sockets.get(name)
        if (!socket) {
            throw new Error("Socket not found")
        }

        if (!socket.setStatus(status)) {
            throw new Error(`Failed to write to GPIO "${pin.name}" for controller "${ctrl.name}"`)
        }

        if (save) {
            db.update("socket", this.name, socket.name, "status", status)
            db.save()
        }

        log.info(LogMod.SOCKET, `Socket "${socket.name}" status changed to "${status}" for controller "${this.name}"`)
    }

    start() {
        setInterval(() => this.#readButtons(), READ_BUTTONS_DELAY)
    }

    #readButtons() {
        for (const socket of this.#sockets) {
            if (socket.readButton() && !socket.pressed) {
                socket.pressed = true
                setTimeout(() => { socket.pressed = false }, READ_PRESSED_BUTTONS_DELAY)
    
                try {
                    this.setStatus(socket.name, !socket.status, true)
                    log.info(LogMod.SOCKET, `Socket "${socket.name}" is switched to "${socket.status}" for controller "${ctrl.name}"`)
                }
                catch (err) {
                    log.error(LogMod.SOCKET, `Failed to switch socket "${socket.name}" status for controller "${ctrl.name}"`, err.message)
                }
            }
        }
    }
}