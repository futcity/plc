/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { GpioState, IGpio } from "../../core/gpio";
import { IDB } from "../../utils/db/db";
import { CtrlType } from "../controller";

export interface ISocket {
    readButton(): boolean
    getState(): boolean
    setState(state: boolean, save?: boolean): boolean
    switchState(): boolean
    getName(): string
}

export class Socket implements ISocket {
    private state: boolean = false

    constructor(
        private readonly gpio: IGpio,
        private readonly db: IDB,
        private readonly ctrlName: string,
        private name: string,
        private relay: string,
        private button: string
    ) { }

    public readButton(): boolean {
        const pin = this.gpio.getPin(this.button)

        if (pin) {
            if (pin.read() == GpioState.HIGH) {
                return true
            }
        }

        return false
    }

    public getState(): boolean {
        return this.state
    }

    public setState(state: boolean, save: boolean=true): boolean {
        const pin = this.gpio.getPin(this.relay)
        this.state = state

        if (pin) {
            const ret = pin.write((state == true) ? GpioState.HIGH : GpioState.LOW)
    
            if (save) {
                this.db.curDB().update(CtrlType.SOCKET, this.ctrlName, this.name, "state", this.state)
                this.db.curDB().save()
            }
    
            return ret
        }

        return true
    }

    public switchState(): boolean {
        return this.setState(!this.getState())
    }

    public getName(): string {
        return this.name
    }
}
