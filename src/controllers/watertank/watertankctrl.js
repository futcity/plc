/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { gpio, gpioState } from "../../core/gpio.js"
import { log, logMod } from "../../utils/log.js"
import { Controller } from "../controller.js"

const PROCESS_DELAY = 1000

export const tankPins = {
    PUMP_RELAY: 0,
    FILL_RELAY: 1
}

export class WaterTankController extends Controller {
    #levels = []
    #level = 0
    #prsntPerLvl = 0

    addLevel(lvl) {
        this.#levels.push(lvl)
        this.#prsntPerLvl = (100 / this.#levels.length)
    }

    getLevel() {
        return this.#level
    }

    start() {
        setTimeout(() => { this.#process() }, PROCESS_DELAY)
        return true
    }

    #process() {
        this.#readLevels()
        this.#pumpControl()
        this.#fillControl()

        setTimeout(() => { this.#process() }, PROCESS_DELAY)
    }

    #readLevels() {
        this.#level = 0
        let fullTank = true

        for (let level of this.#levels) {
            if (level.readLevel()) {
                this.#level += this.#prsntPerLvl
            } else {
                fullTank = false
            }
        }

        if (fullTank) {
            this.#level = 100
        }
    }

    #pumpControl() {
        if (this.#level == 0) {
            if (!gpio.writePin(super.getPin(tankPins.PUMP_RELAY), gpioState.LOW))
                log.error(logMod.WATER_TANK, "Failed to write pump pin")
        } else {
            if (!gpio.writePin(super.getPin(tankPins.PUMP_RELAY), gpioState.HIGH))
                log.error(logMod.WATER_TANK, "Failed to write pump pin")
        }
    }

    #fillControl() {
        if (this.#level < 100) {
            if (!gpio.writePin(super.getPin(tankPins.FILL_RELAY), gpioState.HIGH))
                log.error(logMod.WATER_TANK, "Failed to write fill relay pin")
        } else {
            if (!gpio.writePin(super.getPin(tankPins.FILL_RELAY), gpioState.LOW))
                log.error(logMod.WATER_TANK, "Failed to write fill relay pin")
        }
    }
}
