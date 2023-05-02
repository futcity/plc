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

export interface ILCDModule {
    init(rs: number, rw: number, e: number, k: number, d4: number, d5: number, d6: number, d7: number): boolean
    clear(): boolean
    pos(row: number, col: number): boolean
    home(): boolean
    print(str: string): boolean
}

export class LCDModule implements ILCDModule {
    constructor(
        private readonly board: IBoard,
        private readonly rs: number,
        private readonly rw: number,
        private readonly e: number,
        private readonly k: number,
        private readonly d4: number,
        private readonly d5: number,
        private readonly d6: number,
        private readonly d7: number
    ) { }

    public init(): boolean {
        return this.board.initLCD1602(
            this.rs,
            this.rw,
            this.e,
            this.k,
            this.d4,
            this.d5,
            this.d6,
            this.d7
        )
    }

    public clear(): boolean {
        return this.board.clearLCD1602()
    }

    public pos(row: number, col: number): boolean {
        return this.board.posLCD1602(row, col)
    }

    public home(): boolean {
        return this.board.homeLCD1602()
    }

    public print(str: string): boolean {
        return this.board.printLCD1602(str)
    }
}

export interface ILiquidCrystal {
    addDisplay(name: string, rs: number, rw: number, e: number, k: number, d4: number, d5: number, d6: number, d7: number): boolean
    getDisplay(name: string): ILCDModule | undefined
    getDisplays(): Map<string, ILCDModule>
}

export class LiquidCrystal implements ILiquidCrystal {
    private displays: Map<string, ILCDModule> = new Map<string, ILCDModule>()

    constructor(
        private readonly board: IBoard
    ) { }

    public addDisplay(name: string, rs: number, rw: number, e: number, k: number, d4: number, d5: number, d6: number, d7: number): boolean {
        const lcd = new LCDModule(this.board, rs, rw, e, k, d4, d5, d6, d7)

        if (!lcd.init())
            return false
        this.displays.set(name, lcd)

        return true
    }

    public getDisplay(name: string): ILCDModule | undefined {
        return this.displays.get(name)
    }

    public getDisplays(): Map<string, ILCDModule> {
        return this.displays
    }
}