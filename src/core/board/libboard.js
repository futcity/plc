/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

class BoardLibrary {
    setPinMode(pin, mode) {
        return true
    }

    setPinPull(pin, pull) {
        return true
    }

    getPinState(pin) {
        return 0
    }

    setPinState(pin, state) {
        return true
    }

    initMCP23017(base, addr) {
        return true
    }

    initPCF8574(base, addr) {
        return true
    }

    initLCD1602(base, addr) {
        return true
    }

    clearLCD1602() {
        return true
    }

    homeLCD1602() {
        return true
    }

    posLCD1602(x, y) {
        return true
    }

    printLCD1602(str) {
        return true
    }
}

export const libBoard = new BoardLibrary()
