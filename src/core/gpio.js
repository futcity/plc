/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { board, brdPinState, brdPinMode, brdPinPull } from "../core/board/board.js"

export const gpioState = {
    LOW:    0,
    HIGH:   1
}

export const gpioMode = {
    INPUT:  0,
    OUTPUT: 1
}

export const gpioPullType = {
    DOWN:   0,
    HIGH:   1,
    NONE:   2
}

export const gpioExtType = {
    PCF8574:    0,
    MCP23017:   1
}

export class GpioExtender {
    constructor(name, type, addr, base) {
        this.name = name
        this.type = type
        this.addr = addr
        this.base = base
        this.active = true
    }

    init() {
        switch (this.type) {
            case gpioExtType.MCP23017:
                return board.initMCP23017(this.base, this.addr)

            case gpioExtType.PCF8574:
                return board.initPCF8574(this.base, this.addr)
        }
        return false
    }

    checkActive() {
    }
}

export class GpioPin {
    constructor(name, pin, mode, pull) {
        this.name = name
        this.pin = pin
        this.mode = mode
        this.pull = pull
    }

    init() {
        let mode = brdPinMode.OUTPUT
        let pull = brdPinPull.NONE

        switch (this.mode) {
            case gpioMode.OUTPUT:
                mode = brdPinMode.OUTPUT
                break

            case gpioMode.INPUT:
                mode = brdPinMode.INPUT
                break
        }

        if (!board.setPinMode(this.pin, mode))
            return false
            
        switch (this.pull) {
            case brdPinPull.DOWN:
                pull = brdPinPull.DOWN
                break

            case brdPinPull.UP:
                pull = brdPinPull.UP
                break

            case brdPinPull.NONE:
                pull = brdPinPull.NONE
                break
        }

        if (!board.setPinPull(this.pin, pull))
            return false

        return true
    }
}

class Gpio {
    #pins = new Map()
    #extenders = []

    readPin(pin) {
        if (pin == "")
            return gpioState.HIGH;

        let p = this.#pins.get(pin)
        let state = board.readPin(p.pin)

        switch (state) {
            case brdPinState.HIGH:
                return gpioState.HIGH

            case brdPinState.LOW:
                return gpioState.LOW
        }

        return gpioState.HIGH
    }

    writePin(pin, state) {
        if (pin == "")
            return true

        let p = this.#pins.get(pin)

        switch (state) {
            case gpioState.HIGH:
                return board.writePin(p.pin, brdPinState.HIGH)

            case gpioState.LOW:
                return board.writePin(p.pin, brdPinState.LOW)
        }

        return false
    }

    addExtender(ext) {
        if (!ext.init())
            return false
        
        this.#extenders.push(ext)
        return true
    }

    addPin(pin) {
        if (!pin.init())
            return false
        
        this.#pins.set(pin.name, pin)
        return true
    }
}

export const gpio = new Gpio()
