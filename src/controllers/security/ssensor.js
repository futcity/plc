/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { gpio, GpioState } from "../../core/gpio.js"

export class SecuritySensorType {
    static MICRO_WAVE   = 0
    static PIR          = 1
    static REED_SWITCH  = 2
}

export class SecuritySensor {
    /**
     * 
     * @param {string} name 
     * @param {SecuritySensorType} type 
     * @param {string} pin 
     * @param {boolean} alarm
     */
    constructor(name, type, pin, alarm) {
        this.name = name
        this.type = type
        this.pin = pin
        this.alarm = alarm
        this.detected = false
    }

    /**
     * 
     * @returns {boolean}
     */
    readState() {
        const pin = gpio.getPin(this.pin)

        if (pin) {
            switch (this.type) {
                case SecuritySensorType.MICRO_WAVE:
                case SecuritySensorType.REED_SWITCH:
                    if (pin.read() == GpioState.LOW) {
                        return true
                    }
                    break

                case SecuritySensorType.PIR:
                    if (pin.read() == GpioState.HIGH) {
                        return true
                    }
                    break
            }
        }

        return false
    }
}