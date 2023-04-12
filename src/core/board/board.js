/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
//const libBoard = require("bindings")("board")
import { libBoard } from "./libboard.js"

export const brdPinState = {
    LOW:    0,
    HIGH:   1
}

export const brdPinMode = {
    INPUT:  0,
    OUTPUT: 1
}

export const brdPinPull = {
    DOWN:   0,
    UP:     1,
    NONE:   2
}

class Board {
    setPinMode(pin, mode) {
        return libBoard.setPinMode(pin, mode)
    }

    setPinPull(pin, pull) {
        if (pull == brdPinPull.NONE)
            return true
        return libBoard.setPinPull(pin, pull)
    }

    readPin(pin) {
        let state = libBoard.getPinState(pin)
        return state
    }

    writePin(pin, state) {
        return libBoard.setPinState(pin, state)
    }

    initMCP23017(base, addr) {
        return libBoard.initMCP23017(base, addr)
    }

    initPCF8574(base, addr) {
        return libBoard.initPCF8574(base, addr)
    }

    initLCD1602(base, addr) {
        return libBoard.initLCD1602(base, addr)
    }

    clearLCD1602() {
        return libBoard.clearLCD1602()
    }

    homeLCD1602() {
        return libBoard.homeLCD1602()
    }

    posLCD1602(x, y) {
        return libBoard.posLCD1602(x, y)
    }

    printLCD1602(str) {
        return libBoard.printLCD1602(str)
    }
}

export const board = new Board()
