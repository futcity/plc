/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

/*********************************************************************/
/*                         PRIVATE VARIABLES                         */
/*********************************************************************/

var isSandBox = true
var libBoard

if (!isSandBox) {
    libBoard = require("bindings")("board")
}

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

export function initMCP23017(base, addr) {
    if (!isSandBox) {
        return libBoard.initMCP23017(base, addr)
    } else {
        return true
    }
}

export function initPCF8574(base, addr) {
    if (!isSandBox) {
        return libBoard.initPCF8574(base, addr)
    } else {
        return true
    }
}

export function initADS1115(base, addr) {
    if (!isSandBox) {
        return libBoard.initADS1115(base, addr)
    } else {
        return true
    }
}

export function initLCD1602(rs, rw, e, k, d4, d5, d6, d7) {
    if (!isSandBox) {
        return libBoard.initLCD1602(rs, rw, e, k, d4, d5, d6, d7)
    } else {
        return true
    }
}

export function clearLCD1602() {
    if (!isSandBox) {
        return libBoard.clearLCD1602()
    } else {
        return true
    }
}

export function homeLCD1602() {
    if (!isSandBox) {
        return libBoard.homeLCD1602()
    } else {
        return true
    }
}

export function posLCD1602(row, col) {
    if (!isSandBox) {
        return libBoard.posLCD1602(col, row)
    } else {
        return true
    }
}

export function printLCD1602(text) {
    if (!isSandBox) {
        return libBoard.printLCD1602(text)
    } else {
        return true
    }
}

export function setPinMode(pin, mode) {
    if (!isSandBox) {
        return libBoard.setPinMode(pin, mode)
    } else {
        return true
    }
}

export function setPinPull(pin, pull) {
    if (!isSandBox) {
        return libBoard.setPinPull(pin, pull)
    } else {
        return true
    }
}

export function readPin(pin) {
    if (!isSandBox) {
        return libBoard.getPinState(pin)
    } else {
        return false
    }
}

export function analogReadPin(pin) {
    if (!isSandBox) {
        return libBoard.getPinAnalogState(pin)
    } else {
        return 0
    }
}

export function writePin(pin, state) {
    if (!isSandBox) {
        return libBoard.setPinState(pin, state)
    } else {
        return true
    }
}
