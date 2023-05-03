/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

var isSandBox: boolean = false
var libBoard: any

if (!isSandBox) {
    libBoard = require("bindings")("board")
}

export interface IBoard {
    setPinMode(pin: number, mode: number): boolean
    setPinPull(pin: number, pull: number): boolean
    readPin(pin: number): boolean
    analogReadPin(pin: number): number
    writePin(pin: number, state: number): boolean
    initMCP23017(base: number, addr: number): boolean
    initPCF8574(base: number, addr: number): boolean
    initADS1115(base: number, addr: number): boolean
    initLCD1602(rs: number, rw: number, e: number, k: number, d4: number, d5: number, d6: number, d7: number): boolean
    clearLCD1602(): boolean
    homeLCD1602(): boolean
    posLCD1602(row: number, col: number): boolean
    printLCD1602(text: string): boolean
}

export class Board implements IBoard {
    public initMCP23017(base: number, addr: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.initMCP23017(base, addr)
        } else {
            return true
        }
    }

    public initPCF8574(base: number, addr: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.initPCF8574(base, addr)
        } else {
            return true
        }
    }

    public initADS1115(base: number, addr: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.initADS1115(base, addr)
        } else {
            return true
        }
    }

    public initLCD1602(rs: number, rw: number, e: number, k: number, d4: number, d5: number, d6: number, d7: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.initLCD1602(rs, rw, e, k, d4, d5, d6, d7)
        } else {
            return true
        }
    }

    public clearLCD1602(): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.clearLCD1602()
        } else {
            return true
        }
    }

    public homeLCD1602(): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.homeLCD1602()
        } else {
            return true
        }
    }

    public posLCD1602(row: number, col: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.posLCD1602(col, row)
        } else {
            return true
        }
    }

    public printLCD1602(text: string): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.printLCD1602(text)
        } else {
            return true
        }
    }

    public setPinMode(pin: number, mode: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.setPinMode(pin, mode)
        } else {
            return true
        }
    }

    public setPinPull(pin: number, pull: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.setPinPull(pin, pull)
        } else {
            return true
        }
    }

    public readPin(pin: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.getPinState(pin)
        } else {
            return false
        }
    }

    public analogReadPin(pin: number): number {
        if (!isSandBox) {
            return <number>libBoard.getPinAnalogState(pin)
        } else {
            return 0
        }
    }

    public writePin(pin: number, state: number): boolean {
        if (!isSandBox) {
            return <boolean>libBoard.setPinState(pin, state)
        } else {
            return true
        }
    }
}
