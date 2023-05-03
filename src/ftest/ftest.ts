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

const FTEST_PRINT_DELAY = 1000

export class FactoryTest {
    private lastState: boolean = false

    constructor(
        private readonly gpio: IGpio,
        private readonly lcd: ILiquidCrystal
    ) { }

    public start() {
        setInterval(() => {
            console.log("[FTEST] ========================================================")
            console.log(`[FTEST] INPUT:`)

            this.gpio.getPins().forEach((pin: IGpioPin, name: string) => {
                if (pin.getMode() == GpioMode.INPUT) {
                    const state: string = (pin.read() == GpioState.HIGH) ? "HIGH" : "LOW"
                    console.log(`[FTEST]        GPIO "${name}" readed state "${state}"`)
                }
            }, this)

            console.log("")
            console.log(`[FTEST] OUTPUT:`)

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

            this.lastState = !this.lastState
        }, FTEST_PRINT_DELAY)
    }
}