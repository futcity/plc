/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { log, LogMod, LogType } from "../../utils/log.js"
import { saveDB, updateDB } from "../../database/db.js"
import { Controller } from "../controller.js"
import { Socket } from "./socket.js"

const READ_BUTTONS_DELAY            = 200
const READ_PRESSED_BUTTONS_DELAY    = 1000

export class SocketController extends Controller {
    /** @type {Map<string, Socket>} */
    #sockets = new Map()

    constructor(name) {
        super(name)
    }

    /**
     * 
     * @param {Socket} socket 
     */
    addSocket(socket) {
        this.#sockets.set(socket.name, socket)
    }

    /**
     * 
     * @returns {Map<string, Socket>}
     */
    getSockets() {
        return this.#sockets
    }

    /**
     * 
     * @param {string} name 
     * @param {boolean} status 
     * @param {boolean} save 
     */
    setStatus(name, status, save) {
        const socket = this.#sockets.get(name)
        if (!socket) {
            throw new Error("Socket not found")
        }

        if (!socket.setStatus(status)) {
            throw new Error(`Failed to write to GPIO "${pin.name}" for controller "${ctrl.name}"`)
        }

        if (save) {
            updateDB("socket", this.name, socket.name, "status", status)
            saveDB()
        }

        log(LogType.INFO, LogMod.SOCKET, `Socket "${socket.name}" status changed to "${status}" for controller "${this.name}"`)
    }

    /**
     * 
     * @param {string} name Socket name
     * @return {boolean}
     */
    getStatus(name) {
        const socket = this.#sockets.get(name)
        if (!socket) {
            throw new Error("Socket not found")
        }
        return socket.status
    }

    start() {
        setInterval(() => this.#readButtons(), READ_BUTTONS_DELAY)
    }

    #readButtons() {
        this.#sockets.forEach((socket, name) => {
            if (socket.readButton() && !socket.pressed) {
                socket.pressed = true
                setTimeout(() => { socket.pressed = false }, READ_PRESSED_BUTTONS_DELAY)

                try {
                    this.setStatus(socket.name, !socket.status, true)
                    log(LogType.INFO, LogMod.SOCKET, `Socket "${socket.name}" is switched to "${socket.status}" for controller "${this.name}"`)
                }
                catch (err) {
                    log(LogType.ERROR, LogMod.SOCKET, `Failed to switch socket "${socket.name}" status for controller "${this.name}"`, err.message)
                }
            }
        })
    }
}