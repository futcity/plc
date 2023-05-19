/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { board } from "./board/board.js"

export class UnitType {
    static MCP23017 = 0
    static PCF8574  = 1
    static ADS1115  = 2
}

export class Unit {
    /**
     * 
     * @param {string} name 
     * @param {UnitType} type 
     * @param {number} base 
     * @param {number} addr 
     */
    constructor(name, type, base, addr) {
        this.name = name
        this.type = type
        this.base = base
        this.addr = addr
    }
}

class Stack {
    #units = new Map()

    /**
     * 
     * @param {Unit} unit 
     */
    addUnit(unit) {
        switch (unit.type) {
            case UnitType.MCP23017:
                if (!board.initMCP23017(base, addr))
                    throw new Error(`Failed to init MCP23017 extender unit "${unit.name}"`)
                break
    
            case UnitType.PCF8574:
                if (!board.initPCF8574(base, addr))
                    throw new Error(`Failed to init PCF8574 extender unit "${unit.name}"`)
                break
    
            case UnitType.ADS1115:
                if (!board.initADS1115(base, addr))
                    throw new Error(`Failed to init ADS1115 extender unit "${unit.name}"`)
                break
        }
        this.#units.set(unit.name, unit)
    }
}

export var stack = new Stack()