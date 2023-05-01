/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Board, IBoard } from "./board/board"
import { Extenders, IExtenders } from "./extenders"
import { Gpio, IGpio } from "./gpio"
import { ILiquidCrystal, LiquidCrystal } from "./lcd"
import { IOneWire, OneWire } from "./onewire"

export interface ICore {
    createOneWire(): void
    createBoard(): void
    createGpio(): void
    createExtenders(): void
    createLiquidCrystal(): void
    getLiquidCrystal(): ILiquidCrystal
    getExtenders(): IExtenders
    getBoard(): IBoard
    getGpio(): IGpio
    getOneWire(): IOneWire
}

export class Core implements ICore {
    private board: IBoard
    private gpio: IGpio
    private ext: IExtenders
    private lcd: ILiquidCrystal
    private ow: IOneWire

    public createOneWire() {
        this.ow = new OneWire()
    }

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

    public getOneWire(): IOneWire {
        return this.ow
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