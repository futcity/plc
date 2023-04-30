/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { ILog } from "../utils/log"
import { Board, IBoard } from "./board/board"
import { Extenders, IExtenders } from "./extenders"
import { Gpio, IGpio } from "./gpio"
import { ILiquidCrystal, LiquidCrystal } from "./lcd"

export interface ICore {
    createBoard(): void
    createGpio(): void
    createExtenders(): void
    createLiquidCrystal(): void
    getLiquidCrystal(): ILiquidCrystal
    getExtenders(): IExtenders
    getBoard(): IBoard
    getGpio(): IGpio
}

export class Core implements ICore {
    private board: IBoard
    private gpio: IGpio
    private ext: IExtenders
    private lcd: ILiquidCrystal

    public createBoard() {
        this.board = new Board()
    }

    public createGpio() {
        this.gpio = new Gpio(this.board)
    }

    public createExtenders() {
        this.ext = new Extenders(this.board)
    }

    public createLiquidCrystal() {
        this.lcd = new LiquidCrystal(this.board)
    }

    public getLiquidCrystal(): ILiquidCrystal {
        return this.lcd
    }

    public getExtenders(): IExtenders {
        return this.ext
    }

    public getBoard(): IBoard {
        return this.board
    }

    public getGpio(): IGpio {
        return this.gpio
    }
}