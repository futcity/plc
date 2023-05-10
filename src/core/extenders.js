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
/*                         PRIVATE VARIABLES                         */
/*********************************************************************/

var Units = []

/*********************************************************************/
/*                         PUBLIC CONSTANTS                          */
/*********************************************************************/

export const MCP23017   = 0
export const PCF8574    = 1
export const ADS1115    = 2

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

export function addUnit(name, type, base, addr) {
    switch (type) {
        case MCP23017:
            if (!board.initMCP23017(base, addr))
                throw new Error(`Failed to init MCP23017 extender "${name}"`)
            break

        case PCF8574:
            if (!board.initPCF8574(base, addr))
                throw new Error(`Failed to init PCF8574 extender "${name}"`)
            break

        case ADS1115:
            if (!board.initADS1115(base, addr))
                throw new Error(`Failed to init ADS1115 extender "${name}"`)
            break
    }

    Units.push({
        name: name,
        type: type,
        base: base,
        addr: addr
    })
}

export function getUnits() {
    return Units
}