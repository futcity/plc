/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as board from "../core/board/board.js"

/*********************************************************************/
/*                        PRIVATE VARIABLES                          */
/*********************************************************************/

var Displays = []

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

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
export function addDisplay(name, rs, rw, e, k, d4, d5, d6, d7) {
    if (!board.initLCD1602(rs, rw, e, k, d4, d5, d6, d7))
        throw new Error("Failed to init display")

    Displays.push({
        name: name
    })
}

export function getDisplay(name) {
    for (const lcd of Displays) {
        if (lcd.name == name) {
            return lcd
        }
    }
}

export function clear(lcd) {
    board.clearLCD1602()
}
