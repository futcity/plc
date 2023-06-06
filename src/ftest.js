/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { loadMinConfigs } from "./utils/configs.js"
import { log, LogType, LogMod } from "./utils/log.js"
import { GpioMode, GpioState, getGpioAll } from "./core/gpio.js"
import { clearDisplay, homeDisplay, printDisplay, posDisplay } from "./core/lcd.js"
import { readWireKeys } from "./core/onewire.js"

const FTEST_LOOP_DELAY = 1000

var lastState = GpioState.LOW

function testGpio() {
    log(LogType.INFO, LogMod.FTEST, "")
    log(LogType.INFO, LogMod.FTEST, "GPIO TEST")

    getGpioAll().forEach((gpio, name) => {
        if (gpio.mode == GpioMode.INPUT) {
            log(LogType.INFO, LogMod.FTEST, `Read gpio "${name}" state: ${(gpio.read() == GpioState.HIGH) ? "HIGH" : "LOW"}`)
        }
    })

    log(LogType.INFO, LogMod.FTEST, "")

    if (lastState == GpioState.HIGH) {
        lastState = GpioState.LOW
    } else {
        lastState = GpioState.HIGH
    }

    getGpioAll().forEach((gpio, name) => {
        if (gpio.mode == GpioMode.OUTPUT) {
            log(LogType.INFO, LogMod.FTEST, `Set gpio "${name}" state: ${(lastState == GpioState.HIGH) ? "HIGH" : "LOW"}`)
        }
    })
}

function testDisplay() {
    log(LogType.INFO, LogMod.FTEST, "")
    log(LogType.INFO, LogMod.FTEST, "LCD TEST")

    clearDisplay()
    homeDisplay()
    posDisplay(0, 0)
    printDisplay("  FACTORY TEST  ")
    posDisplay(1, 0)
    printDisplay("  DISPLAY TEST  ")
}

function testOneWire() {
    log(LogType.INFO, LogMod.FTEST, "")
    log(LogType.INFO, LogMod.FTEST, "OneWire TEST")

    readWireKeys((keys, err) => {
        if (err) {
            log(LogType.ERROR, LogMod.FTEST, "Failed to read keys", err.message)
        } else {
            log(LogType.INFO, LogMod.FTEST, `${keys}`)
        }
    })
}

function ftest() {
    log(LogType.INFO, LogMod.FTEST, "=================================================")

    testGpio()
    testDisplay()
    testOneWire()
}

function main() {
    try {
        loadMinConfigs("./data/configs")
    } catch(err) {
        log(LogType.ERROR, LogMod.INDEX, "Failed to read configs", err.message)
        process.exit(-1)
    }

    setInterval(() => { ftest() }, FTEST_LOOP_DELAY)
}

main()