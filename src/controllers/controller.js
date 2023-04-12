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
    SOCKET:     0,
    SECURITY:   1,
    WATER_TANK: 2,
    WATERING:   3
}

export class Controller {
    #pins = new Map()
    #status = false

    constructor(name) {
        this.name = name
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
