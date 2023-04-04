/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export const ctrlType = {
    SOCKET:     "socket",
    SECURITY:   "security",
    WATER_TANK: "watertank",
    WATERING:   "watering"
}

export class Controller {
    #pins = new Map()
    #status = false

    constructor(name, type) {
        this.name = name
        this.type = type
    }

    setPin(id, pin) {
        this.#pins.set(id, pin)
    }

    getPin(id) {
        return this.#pins.get(id)
    }

    start() {
        return true
    }

    setStatus(val) {
        this.#status = val
        return true
    }

    getStatus() {
        return this.#status
    }
}
