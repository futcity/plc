/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { log, logMod } from "../../utils/log.js"
import { Controller } from "../controller.js"

const READ_BUTTON_DELAY = 100
const READ_PRESSED_BUTTON_DELAY = 1000

export class SocketController extends Controller {
    #sockets = []

    addSocket(socket) {
        this.#sockets.push(socket)
        return true
    }

    getSockets() {
        return this.#sockets
    }

    getSocket(name) {
        for (let socket of this.#sockets) {
            if (socket.name == name)
                return socket
        }
        return undefined
    }

    start() {
        super.start()
        setTimeout(() => { this.#readButtons() }, READ_BUTTON_DELAY)
        return true
    }

    #readButtons() {
        let pressed = false

        for (let socket of this.#sockets) {
            if (socket.readButton()) {
                pressed = true
                log.info(logMod.SOCKET, "Socket " + socket.name + " switched to " + socket.getState())
            }
        }

        if (pressed) {
            setTimeout(() => { this.#readButtons() }, READ_PRESSED_BUTTON_DELAY)
        } else {
            setTimeout(() => { this.#readButtons() }, READ_BUTTON_DELAY)
        }
    }
}
