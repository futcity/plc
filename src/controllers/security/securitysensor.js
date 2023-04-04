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

export const secSensorType = {
    REED_SWITCH: 0,
    PIR: 1,
    MICRO_WAVE: 2
}

export class SecuritySensor {
    constructor(name, type, pin, alarm) {
        this.name = name
        this.type = type
        this.pin = pin
        this.alarm = alarm
        this.detected = false
    }

    readPin() {
        switch (this.type) {
            case secSensorType.PIR:
            case secSensorType.REED_SWITCH:
                if (gpio.readPin(this.pin) == gpioState.HIGH) {
                    this.detected = true
                }
                break

            case secSensorType.MICRO_WAVE:
                if (gpio.readPin(this.pin) == gpioState.LOW) {
                    this.detected = true
                }
                break
        }
        return true
    }
}
