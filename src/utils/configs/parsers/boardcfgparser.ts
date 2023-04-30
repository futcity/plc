/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { ExtType, IExtenders } from "../../../core/extenders"
import { GpioMode, GpioPull, IGpio } from "../../../core/gpio"
import { ILiquidCrystal } from "../../../core/lcd"
import { ILog, Mod } from "../../log"

export class BoardConfigsParser {
    constructor(
        private readonly log: ILog,
        private readonly gpio: IGpio,
        private readonly ext: IExtenders,
        private readonly lcd: ILiquidCrystal,
        private readonly data: any
    ) { }

    public parseExtenders() {
        if (!this.data.extenders) {
            throw new Error("Extenders not found")
        }

        for (const ex of this.data.extenders) {
            if (ex.enabled === false) {
                continue
            }

            let type: ExtType = ExtType.PCF8574

            switch (ex.type) {
                case "mcp23017":
                    type = ExtType.MCP23017
                    break

                case "pcf8574":
                    type = ExtType.PCF8574
                    break

                case "ads1115":
                    type = ExtType.ADS1115
                    break
            }

            this.ext.addExtender(ex.name, type, ex.base, ex.addr)

            this.log.info(Mod.APP, `Add extender "${ex.name}" type "${ex.type}" base "${ex.base}" addr "${ex.addr}"`)
        }
    }

    public parseGpio() {
        if (!this.data.gpio) {
            throw new Error("Gpio not found")
        }

        for (const g of this.data.gpio) {
            let mode: GpioMode = GpioMode.INPUT
            let pull: GpioPull = GpioPull.NONE

            switch (g.mode) {
                case "input":
                    mode = GpioMode.INPUT
                    break

                case "output":
                    mode = GpioMode.OUTPUT
                    break

                default:
                    throw new Error(`Unknown GPIO mode "${g.mode}"`)
            }

            switch (g.pull) {
                case "up":
                    pull = GpioPull.UP
                    break

                case "down":
                    pull = GpioPull.DOWN
                    break

                case "none":
                    pull = GpioPull.NONE
                    break

                default:
                    throw new Error(`Unknown GPIO mode "${g.mode}"`)
            }

            this.gpio.addPin(g.name, mode, pull, g.pin)

            this.log.info(Mod.APP, `Add pin "${g.name}" gpio "${g.pin}" mode "${g.mode}" pull "${g.pull}"`)
        }
    }

    public parseDisplays() {
        if (!this.data.lcd) {
            throw new Error("LCD not found")
        }

        for (const lcd of this.data.lcd) {
            this.lcd.addDisplay(lcd.name,
                lcd.pins.rs,
                lcd.pins.rw,
                lcd.pins.e,
                lcd.pins.k,
                lcd.pins.d4,
                lcd.pins.d5,
                lcd.pins.d6,
                lcd.pins.d7
            )
            this.log.info(Mod.APP, `Add display "${lcd.name}"`)
        }
    }
}