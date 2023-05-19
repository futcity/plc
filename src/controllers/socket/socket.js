/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { gpio, GpioState } from "../../core/gpio.js"

export class Socket {
    constructor(name, relay, button) {
        this.name = name
        this.relay = relay
        this.button = button
        this.pressed = false
        this.status = false
    }

    readButton() {
        const pin = gpio.getPin(this.button)
    
        if (pin) {
            if (pin.read() == GpioState.HIGH) {
                return true
            }
        }
    
        return false
    }

    setStatus(status) {
        if (!this.#writeRelay(status)) {
            return false
        }
        this.status = status
        return true
    }

    #writeRelay(state) {
        const pin = gpio.getPin(this.button)
    
        if (pin) {
            if (pin.write(state ? GpioState.HIGH : GpioState.LOW)) {
                return true
            }
        }
    
        return false
    }
}