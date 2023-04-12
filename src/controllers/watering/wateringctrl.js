/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Controller } from "../controller.js"

export const wateringPins = {
    STATUS: 0,
    RELAY:  1
}

export const wateringTime = {
    ON:     0,
    OFF:    1
}

export class WateringController extends Controller {
    #time = new Map()
    #pins = new Map()

    setTime(type, time) {
        this.#time.set(type, time)
    }

    setPin(type, pin) {
        this.#pins.set(type, pin)
    }

    start() {
        super.start()
        return true
    }
}
