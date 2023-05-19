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

class LiquidCrystal {
    /**
     * 
     * @param {string} name 
     * @param {number} rs 
     * @param {number} rw 
     * @param {number} e 
     * @param {number} k 
     * @param {number} d4 
     * @param {number} d5 
     * @param {number} d6 
     * @param {number} d7 
     */
    initDisplay(name, rs, rw, e, k, d4, d5, d6, d7) {
        if (!board.initLCD1602(rs, rw, e, k, d4, d5, d6, d7))
            throw new Error("Failed to init display")
    }

    /**
     * 
     * @returns {boolean}
     */
    home() {
        return board.homeLCD1602()
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @returns {boolean}
     */
    pos(row, col) {
        return board.posLCD1602(row, col)
    }

    /**
     * 
     * @param {string} text 
     * @returns {boolean}
     */
    print(text) {
        return board.printLCD1602(text)
    }

    /**
     * 
     * @returns {boolean}
     */
    clear() {
        return board.clearLCD1602()
    }
}

export var lcd = new LiquidCrystal()