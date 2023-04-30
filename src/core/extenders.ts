/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IBoard } from "./board/board"

export enum ExtType {
    MCP23017,
    PCF8574,
    ADS1115
}

export interface IExtender {
}

export class Extender implements IExtender {
    constructor(
        private readonly type: ExtType,
        private readonly addr: number,
        private readonly base: number
    ) { }
}

export interface IExtenders {
    addExtender(name: string, type: ExtType, base: number, addr: number): void
}

export class Extenders implements IExtenders {
    private ext: Map<string, IExtender> = new Map<string, IExtender>()

    constructor(
        private readonly board: IBoard,
    ) { }

    public addExtender(name: string, type: ExtType, base: number, addr: number): void {
        const ext = new Extender(type, base, addr)

        switch (type) {
            case ExtType.MCP23017:
                if (!this.board.initMCP23017(base, addr))
                    throw new Error(`Failed to init MCP23017 extender "${name}"`)
                break

            case ExtType.PCF8574:
                if (!this.board.initPCF8574(base, addr))
                    throw new Error(`Failed to init PCF8574 extender "${name}"`)
                break

            case ExtType.ADS1115:
                if (!this.board.initADS1115(base, addr))
                    throw new Error(`Failed to init ADS1115 extender "${name}"`)
                break
        }

        this.ext.set(name, ext)
    }
}