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

var pins = []

export const LOW    = 0
export const HIGH   = 1

export const INPUT  = 0
export const OUTPUT = 1

export const DOWN   = 0
export const UP     = 1
export const OFF    = 2

/**
 * 
 * @param {string} name 
 * @param {number} mode 
 * @param {number} pull 
 * @param {number} pin 
 */
export function addPin(name, mode, pull, pin) {
    const gpio = {
        name: name,
        mode: mode,
        pull: pull,
        pin: pin
    }

    if (!board.setPinMode(gpio.pin, gpio.mode))
        throw new Error(`Failed to set I/O GPIO mode "${gpio.name}"`)

    if (!board.setPinPull(gpio.pin, gpio.pull))
        throw new Error(`Failed to set Pull mode for GPIO "${gpio.name}"`)

    pins.push(gpio)
}

/**
 * 
 * @param {string} name 
 */
export function getPin(name) {
    for (const pin of pins) {
        if (pin.name == name) {
            return pin
        }
    }
}

export function getPins() {
    return pins
}

export function readPin(pin) {
    if (board.readPin(pin.pin))
        return HIGH
    return LOW
}

export function writePin(pin, state) {
    return board.writePin(pin.pin, state)
}

export function readPinA(pin) {
    return board.analogReadPin(pin.pin)
}