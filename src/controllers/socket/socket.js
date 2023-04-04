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

export class Socket {
    #state = false

    constructor(name, relay, button, en) {
        this.name = name
        this.relay = relay
        this.button = button
        this.enabled = en
    }

    readButton() {
        if (gpio.readPin(this.button) == gpioState.HIGH) {
            return this.switchState()
        }
        return false
    }

    setState(val) {
        this.#state = val
        return this.#updateRelay()
    }

    getState() {
        return this.#state
    }

    switchState() {
        return this.setState(!this.getState())
    }

    #updateRelay() {
        if (this.state) {
            if (!gpio.writePin(this.relay, gpioState.HIGH))
                return false
        } else {
            if (!gpio.writePin(this.relay, gpioState.LOW))
                return false
        }
        return true
    }
}
