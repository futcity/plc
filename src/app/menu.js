/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { board } from "../core/board/board.js"
import { gpio, gpioState } from "../core/gpio.js"

const LCD_UPDATE_INTERVAL = 5000
const READ_BUTTON_DELAY = 100
const READ_PRESSED_BUTTON_DELAY = 1000

class Menu {
    #upRow = "   FCPLC  1v0"
    #downRow = "    DSD Ltd."

    initLCD(base, addr) {
        return board.initLCD1602(base, addr)
    }

    setButtons(up, red, down) {
        this.btnUp = up
        this.btnRed = red
        this.btnDown = down
    }

    start() {
        setInterval(() => { this.#updateLCD() }, LCD_UPDATE_INTERVAL);
    }

    #updateLCD() {
        board.clearLCD1602()
        board.homeLCD1602()
        board.printLCD1602(this.#upRow)
        board.posLCD1602(0, 1)
        board.printLCD1602(this.#downRow)
    }

    #readButtons() {
        let pressed = false

        const stateUp = gpio.readPin(this.btnUp)
        const stateRed = gpio.readPin(this.btnRed)
        const stateDown = gpio.readPin(this.btnDown)

        if ((stateUp == gpioState.LOW) ||
            (stateRed == gpioState.LOW) ||
            (stateDown == gpioState.LOW)) {
            pressed = true
        }

        if (pressed) {
            setTimeout(() => { this.#readButtons() }, READ_PRESSED_BUTTON_DELAY)
        } else {
            setTimeout(() => { this.#readButtons() }, READ_BUTTON_DELAY)
        }
    }
}

export const menu = new Menu()
