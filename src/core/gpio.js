/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as board from "./board/board.js"

/** @type {Map<string, GpioPin>} */
var Pins = new Map()

export class GpioState {
    static  LOW     = 0
    static  HIGH    = 1
}

export class GpioMode  {
    static INPUT    = 0
    static OUTPUT   = 1
}

export class GpioPull {
    static DOWN = 0
    static UP   = 1
    static OFF  = 2
}

export class GpioType {
    static DIGITAL  = 0
    static ANALOG   = 1
}

export class GpioPin {
    /**
     * 
     * @param {string} name 
     * @param {GpioType} type
     * @param {number} pin 
     * @param {GpioMode} mode
     * @param {GpioPull} pull 
     * 
     */
    constructor(name, type, pin, mode, pull) {
        this.name = name
        this.type = type
        this.pin = pin
        this.mode = mode
        this.pull = pull
    }

    /**
     * 
     * @returns {GpioState | number}
     */
    read() {
        if (this.type == GpioType.DIGITAL) {
            if (board.readPin(this.pin))
                return GpioState.HIGH
            return GpioState.LOW
        }
    }
    
    /**
     * 
     * @param {GpioState | number} state 
     * @returns {boolean}
     */
    write(state) {
        if (this.type == GpioType.DIGITAL) {
            return board.writePin(this.pin, state)
        }
    }
}

/**
 * 
 * @param {GpioPin} pin 
 */
export function addGpio(pin) {
    if (!board.setPinMode(pin.pin, pin.mode))
        throw new Error(`Failed to set I/O GPIO mode "${pin.name}"`)

    if (!board.setPinPull(pin.pin, pin.pull))
        throw new Error(`Failed to set Pull mode for GPIO "${pin.name}"`)

    Pins.set(pin.name, pin)
}

/**
 * 
 * @returns {Map<string, GpioPin>}
 */
export function getGpioAll() {
    return Pins
}

/**
 * 
 * @param {string} name 
 * @returns {GpioPin | undefined}
 */
export function getGpio(name) {
    return Pins.get(name)
}
