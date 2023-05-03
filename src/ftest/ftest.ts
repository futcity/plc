/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { GpioMode, GpioState, IGpio, IGpioPin } from "../core/gpio"
import { ILCDModule, ILiquidCrystal } from "../core/lcd"
import { IOneWire } from "../core/onewire"

const FTEST_PRINT_DELAY = 1000

export class FactoryTest {
    private lastState: boolean = false

    constructor(
        private readonly gpio: IGpio,
        private readonly lcd: ILiquidCrystal,
        private readonly ow: IOneWire
    ) { }

    public start() {
        setTimeout(() => { this.testAll() }, FTEST_PRINT_DELAY)
    }

    private testAll() {
        console.log("[FTEST] ========================================================")

            this.testInputs()
            this.testOutputs()
            this.testDisplays()
            this.testOneWire()

            this.lastState = !this.lastState
            setTimeout(() => { this.testAll() }, FTEST_PRINT_DELAY)
    }

    private testInputs() {
        console.log(`[FTEST] INPUTS:`)

        this.gpio.getPins().forEach((pin: IGpioPin, name: string) => {
            if (pin.getMode() == GpioMode.INPUT) {
                const state: string = (pin.read() == GpioState.HIGH) ? "HIGH" : "LOW"
                console.log(`[FTEST]        GPIO "${name}" readed state "${state}"`)
            }
        }, this)
    }

    private testOutputs() {
        console.log("")
        console.log(`[FTEST] OUTPUTS:`)
        
        this.gpio.getPins().forEach((pin: IGpioPin, name: string) => {
            if (pin.getMode() == GpioMode.OUTPUT) {
                if (this.lastState) {
                    pin.write(GpioState.HIGH)
                } else {
                    pin.write(GpioState.LOW)
                }

                const state: string = (this.lastState) ? "HIGH" : "LOW"
                console.log(`[FTEST]        GPIO "${name}" set state to "${state}"`)
            }
        }, this)
    }

    private testDisplays() {
        console.log("")
        console.log(`[FTEST] LCD:`)

        this.lcd.getDisplays().forEach((lcd: ILCDModule, name: string) => {
            const row1 = "      FCPLC"
            const row2 = " FACTORY  TEST"

            lcd.clear()
            lcd.home()
            lcd.print(row1)
            lcd.pos(1, 0)
            lcd.print(row2)

            console.log(`[FTEST]        LCD "${name}" set text "${row1}" "${row2}"`)
        }) 
    }

    private testOneWire() {
        console.log("")
        console.log(`[FTEST] ONE WIRE:`)

        console.log(`[FTEST]        KEYS:`);
        for (const key of this.ow.readKeys()) {
            console.log(`[FTEST]                     ${key}`);
        }

        console.log(`[FTEST]        TEMP SENSORS:`);
        for (const sensor of this.ow.readSensors()) {
            console.log(`[FTEST]                     SensorId: "${sensor.id}" SensorTemp: "${sensor.temp}"`);
        }
    }
}