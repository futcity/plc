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

class Board {
    /**
     * 
     * @param {number} base 
     * @param {number} addr 
     * @returns {boolean}
     */
    initMCP23017(base, addr) {
        if (!isSandBox) {
            return libBoard.initMCP23017(base, addr)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {number} base 
     * @param {number} addr 
     * @returns {boolean}
     */
    initPCF8574(base, addr) {
        if (!isSandBox) {
            return libBoard.initPCF8574(base, addr)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {number} base 
     * @param {number} addr 
     * @returns {boolean}
     */
    initADS1115(base, addr) {
        if (!isSandBox) {
            return libBoard.initADS1115(base, addr)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {number} rs 
     * @param {number} rw 
     * @param {number} e 
     * @param {number} k 
     * @param {number} d4 
     * @param {number} d5 
     * @param {number} d6 
     * @param {number} d7 
     * @returns {boolean}
     */
    initLCD1602(rs, rw, e, k, d4, d5, d6, d7) {
        if (!isSandBox) {
            return libBoard.initLCD1602(rs, rw, e, k, d4, d5, d6, d7)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @returns {boolean}
     */
    clearLCD1602() {
        if (!isSandBox) {
            return libBoard.clearLCD1602()
        } else {
            return true
        }
    }
    
    /**
     * 
     * @returns {boolean}
     */
    homeLCD1602() {
        if (!isSandBox) {
            return libBoard.homeLCD1602()
        } else {
            return true
        }
    }
    
    /**
     * 
     * @returns {boolean}
     */
    posLCD1602(row, col) {
        if (!isSandBox) {
            return libBoard.posLCD1602(col, row)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {string} text
     * @returns {boolean}
     */
    printLCD1602(text) {
        if (!isSandBox) {
            return libBoard.printLCD1602(text)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {number} pin 
     * @param {number} mode 
     * @returns {boolean}
     */
    setPinMode(pin, mode) {
        if (!isSandBox) {
            return libBoard.setPinMode(pin, mode)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {number} pin 
     * @param {number} pull 
     * @returns {boolean}
     */
    setPinPull(pin, pull) {
        if (!isSandBox) {
            return libBoard.setPinPull(pin, pull)
        } else {
            return true
        }
    }
    
    /**
     * 
     * @param {number} pin 
     * @returns {boolean}
     */
    readPin(pin) {
        if (!isSandBox) {
            return libBoard.getPinState(pin)
        } else {
            return false
        }
    }
    
    /**
     * 
     * @param {number} pin 
     * @returns {boolean}
     */
    analogReadPin(pin) {
        if (!isSandBox) {
            return libBoard.getPinAnalogState(pin)
        } else {
            return 0
        }
    }
    
    /**
     * 
     * @param {number} pin 
     * @param {number} state 
     * @returns {boolean}
     */
    writePin(pin, state) {
        if (!isSandBox) {
            return libBoard.setPinState(pin, state)
        } else {
            return true
        }
    }
}

export var board = new Board()