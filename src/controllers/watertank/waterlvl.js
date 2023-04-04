/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { gpio, gpioState } from "../../core/gpio.js"

export class WaterLevel {
    constructor(name, pin) {
        this.name = name
        this.pin = pin
    }

    readLevel() {
        let val = gpio.readPin(this.pin)

        if (val == gpioState.HIGH) {
            return true
        }

        return false
    }
}
