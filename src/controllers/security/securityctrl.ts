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
import { IOneWire } from "../../core/onewire";
import { IDB } from "../../utils/db/db";
import { ILog, Mod } from "../../utils/log";
import { Controller, CtrlType, IController } from "../controller";
import { ISecuritySensor } from "./securitysensor";

const READ_SENSORS_DELAY = 1000
const ALARM_DELAY = 250
const KEYS_CHECK_DELAY = 100
const KEYS_READ_DELAY = 3000

export enum SecurityPin {
    STATUS,
    BUZZER,
    ALARM_LED,
    ALARM_RELAY
}

export interface ISecurityController extends IController {
    setPin(pin: SecurityPin, gpio: string): void
    addSensor(sensor: ISecuritySensor): void
    getSensor(name: string): ISecuritySensor | undefined
    getSensors(): ISecuritySensor[]
    setStatus(status: boolean, save: boolean | undefined): void
    getStatus(): boolean
    getAlarm(): boolean
    addKey(key: string): void
}

export class SecurityController extends Controller implements ISecurityController {
    private sensors: ISecuritySensor[] = new Array<ISecuritySensor>()
    private pins: Map<SecurityPin, string> = new Map<SecurityPin, string>()
    private keys: string[] = new Array<string>()
    private status: boolean = false
    private alarm: boolean = false
    private lastAlrm: boolean = false

    constructor(
        private readonly log: ILog,
        private readonly gpio: IGpio,
        private readonly db: IDB,
        private readonly ow: IOneWire,
        type: CtrlType,
        name: string
    ) {
        super(type, name)
    }

    public addKey(key: string) {
        this.keys.push(key)
    }

    public setPin(pin: SecurityPin, gpio: string): void {
        this.pins.set(pin, gpio)
    }

    public addSensor(sensor: ISecuritySensor): void {
        this.sensors.push(sensor)
    }

    public getSensor(name: string): ISecuritySensor | undefined {
        for (const sensor of this.sensors) {
            if (sensor.getName() == name) {
                return sensor
            }
        }
    }

    public getSensors() : ISecuritySensor[] {
        return this.sensors
    }

    public override start(): boolean {
        setInterval(() => { this.readSensors() }, READ_SENSORS_DELAY)
        setTimeout(() => { this.readKeys() }, KEYS_CHECK_DELAY)
        return true
    }

    public setStatus(status: boolean, save: boolean=true): void {
        this.status = status

        if (status) {
            this.setPinState(SecurityPin.STATUS, GpioState.HIGH)
        } else {
            this.setAlarm(false)
            this.setPinState(SecurityPin.STATUS, GpioState.LOW)
	    for (const sensor of this.sensors) {
		sensor.setDetected(false)
	    }
        }
        
        this.log.info(Mod.SECURITYCTRL, `Security status changed to "${this.status}"`)

        if (save) {
            this.db.curDB().update(CtrlType.SECURITY, super.getName(), "global", "status", this.status)
            this.db.curDB().save()
        }
    }

    public getStatus(): boolean {
        return this.status
    }

    public getAlarm(): boolean {
        return this.alarm
    }
    
    private readSensors() {
        if (!this.status)
            return

        for (const sensor of this.sensors) {
            const state = sensor.readState()
            if (state) {
                if (!sensor.getDetected()) {
                    this.log.info(Mod.SECURITYCTRL, `Security sensor "${sensor.getName()}" was detected penetration`)
                    if (sensor.getAlarm() && this.status) {
                        this.setAlarm(true)
                        this.log.info(Mod.SECURITYCTRL, `Alarm was started`)
                    }
                }
                sensor.setDetected(true)
            }
        }
    }

    private setPinState(pin: SecurityPin, state: GpioState) {
        const pinName: string = <string>this.pins.get(pin)
        const p = this.gpio.getPin(pinName)
        if (p) { p.write(state) }
    }

    private setAlarm(value: boolean): void {
        if (this.alarm == value)
            return

        this.alarm = value

        if (this.alarm) {
            this.setPinState(SecurityPin.ALARM_RELAY, GpioState.HIGH)
            setTimeout(() => { this.handlerAlarm() }, ALARM_DELAY)
        } else {
            this.lastAlrm = false
            this.setPinState(SecurityPin.ALARM_LED, GpioState.LOW)
            this.setPinState(SecurityPin.ALARM_RELAY, GpioState.LOW)
            this.setPinState(SecurityPin.BUZZER, GpioState.LOW)
        }
    }

    private handlerAlarm() {
        if (!this.alarm)
            return

        if (!this.lastAlrm) {
            this.setPinState(SecurityPin.ALARM_LED, GpioState.HIGH)
            this.setPinState(SecurityPin.BUZZER, GpioState.HIGH)
        } else {
            this.setPinState(SecurityPin.ALARM_LED, GpioState.LOW)
            this.setPinState(SecurityPin.BUZZER, GpioState.LOW)
        }

        this.lastAlrm = !this.lastAlrm

        setTimeout(() => { this.handlerAlarm() }, ALARM_DELAY)
    }

    private readKeys(): void {
        const key = this.ow.readKey()

        if (key != "") {
            for (const k of this.keys) {
                if (key == k) {
		    this.ow.clearKey()
                    this.log.info(Mod.SECURITYCTRL, `Valid key "${key}" detected`)
                    try {
                        this.setStatus(!this.getStatus(), true)
                    } catch (err: any) {
                        this.log.error(Mod.SECURITYCTRL, "Failed to switch security status by key", err.message)
                    }
                    break
                }
	    }
    
            setTimeout(() => { this.readKeys() }, KEYS_READ_DELAY)
        } else {
            setTimeout(() => { this.readKeys() }, KEYS_CHECK_DELAY)
        }
    }
}
