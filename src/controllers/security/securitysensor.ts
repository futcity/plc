/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { GpioState, IGpio } from "../../core/gpio"

export enum SecuritySensorType {
    REED_SWITCH,
    MICRO_WAVE,
    PIR
}

export interface ISecuritySensor {
    readState(): boolean
    getDetected(): boolean
    setDetected(val: boolean): void
    getName(): string
    getAlarm(): boolean
}

export class SecuritySensor implements ISecuritySensor {
    private detected: boolean = false

    constructor(
        private readonly gpio: IGpio,
        private readonly name: string,
        private readonly pin: string,
        private readonly type: SecuritySensorType,
        private readonly alarm: boolean
    ) { }

    public readState(): boolean {
        const pin = this.gpio.getPin(this.pin)
        if (!pin) {
            return false
        }

        const rawState = pin.read()

        switch (this.type) {
            case SecuritySensorType.MICRO_WAVE:
            case SecuritySensorType.REED_SWITCH:
                if (rawState == GpioState.LOW) {
                    return true
                } else {
                    return false
                }
                break

            case SecuritySensorType.PIR:
                if (rawState == GpioState.HIGH) {
                    return true
                } else {
                    return false
                }
                break
        }

        return false
    }

    public getDetected(): boolean {
        return this.detected
    }

    public setDetected(val: boolean) {
        this.detected = val
    }

    public getName(): string {
        return this.name
    }

    public getAlarm(): boolean {
        return this.alarm
    }
}