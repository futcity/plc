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

export enum GpioState {
    LOW,
    HIGH
}

export enum GpioMode {
    INPUT,
    OUTPUT
}

export enum GpioPull {
    DOWN,
    UP,
    NONE
}

export interface IGpioPin {
    setMode(mode: GpioMode): boolean
    setPull(pull: GpioPull): boolean
    read(): GpioState
    write(state: GpioState): boolean
    analogRead(): number
    getPin(): number
    getMode(): GpioMode
}

export class GpioPin implements IGpioPin {
    private mode: GpioMode = GpioMode.INPUT

    constructor(
        private readonly board: IBoard,
        private readonly pin: number
    ) { }

    public getMode(): GpioMode {
        return this.mode
    }

    public setMode(mode: GpioMode): boolean {
        this.mode = mode
        return this.board.setPinMode(this.pin, mode)
    }

    public setPull(pull: GpioPull): boolean {
        return this.board.setPinPull(this.pin, pull)
    }

    public read(): GpioState {
        if (this.board.readPin(this.pin))
            return GpioState.HIGH
        return GpioState.LOW
    }

    public write(state: GpioState): boolean {
        return this.board.writePin(this.pin, state)
    }

    public analogRead(): number {
        return this.board.analogReadPin(this.pin)
    }

    public getPin(): number {
        return this.pin
    }
}

export interface IGpio {
    addPin(name: string, mode: GpioMode, pull: GpioPull, pin: number): void
    getPin(name: string): IGpioPin | undefined
    getPins(): Map<string, IGpioPin>
}

export class Gpio implements IGpio {
    private pins: Map<string, IGpioPin> = new Map<string, IGpioPin>()

    constructor(
        private readonly board: IBoard
    ) { }

    public addPin(name: string, mode: GpioMode, pull: GpioPull, pin: number): void {
        const p = new GpioPin(this.board, pin)

        if (!p.setMode(mode))
            throw new Error(`Failed to set I/O GPIO mode "${name}"`)

        if (!p.setPull(pull))
            throw new Error(`Failed to set Pull mode for GPIO "${name}"`)

        this.pins.set(name, p)
    }

    public getPin(name: string): IGpioPin | undefined {
        return this.pins.get(name)
    }

    public getPins(): Map<string, IGpioPin> {
        return this.pins
    }
}