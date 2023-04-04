/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export const brdPinState = {
    LOW:    0,
    HIGH:   1
}

export const brdPinMode = {
    INPUT:  0,
    OUTPUT: 1
}

export const brdPinPull = {
    PULL_DOWN:  0,
    PULL_UP:    1
}

class Board {
    setMode(pin, mode) {
        switch (mode) {
            case brdPinMode.OUTPUT:
                break

            case brdPinMode.INPUT:
                break
        }
        return true
    }

    pullUp(pin) {
        return true
    }

    pullDown(pin) {
        return true
    }

    readPin(pin) {
        return brdPinState.LOW
    }

    writePin(pin, state) {
        switch (state) {
            case brdPinState.HIGH:
                break

            case brdPinState.LOW:
                break
        }
        return true
    }

    initMCP23017(addr, base) {
        return true
    }

    initPCF8574(addr, base) {
        return true
    }
}

export const board = new Board()
