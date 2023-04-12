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
import { db, dbName } from "../../database/db.js"

export class Socket {
    #state = false

    constructor(ctrlName, name, relay, button, en) {
        this.ctrlName = ctrlName
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

    setState(val, save=true) {
        this.#state = val

        if (save) {
            db.update(dbName.SOCKET, this.ctrlName, { name: this.name }, { state: this.#state })
        }
    
        return this.#updateRelay()
    }

    getState() {
        return this.#state
    }

    switchState() {
        return this.setState(!this.getState())
    }

    #updateRelay() {
        if (this.#state) {
            if (!gpio.writePin(this.relay, gpioState.HIGH)) {
                return false
            }
        } else {
            if (!gpio.writePin(this.relay, gpioState.LOW)) {
                return false
            }
        }
        return true
    }
}
