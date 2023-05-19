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
import { log, LogMod } from "../../utils/log.js"
import { onewire } from "../../core/onewire.js"
import { db } from "../../database/db.js"
import { SecuritySensor } from "./ssensor.js"
import { Controller } from "../controller.js"

const READ_SENSORS_DELAY    = 1000
const ALARM_DELAY           = 250
const KEYS_CHECK_DELAY      = 1000
const KEYS_READED_DELAY     = 3000

export class SecurityPins {
    static ALARM_LED    = 0
    static ALARM_RELAY  = 1
    static STATUS_LED   = 2
    static BUZZER       = 3
}

export class SecurityController extends Controller {
    #pins = new Map()
    #keys = []
    #sensors = []
    #alarm = false
    #status = false
    #lastAlarm = false
    #tmrAlarm

    constructor() {
    }

    /**
     * 
     * @param {SecurityPins} pin 
     * @param {string} name 
     */
    setPin(pin, name) {
        this.#pins.set(pin, name)
    }

    /**
     * 
     * @param {SecuritySensor} sensor 
     */
    addSensor(sensor) {
        this.#sensors.push(sensor)
    }

    /**
     * 
     * @param {string} key 
     */
    addKey(key) {
        this.#keys.push(key)
    }

    /**
     * 
     * @returns {boolean}
     */
    getAlarm() {
        return this.#alarm
    }

    /**
     * 
     * @returns {boolean}
     */
    getStatus() {
        return this.#status
    }

    start() {
        setInterval(() => { this.#readSensors() }, READ_SENSORS_DELAY)
        setInterval(() => { this.#readKeys() }, KEYS_CHECK_DELAY)
    }

    setStatus(val, save=true) {
        this.#status = val
    
        const pin = gpio.getPin(this.#pins.get(SecurityPins.STATUS_LED))
    
        if (ctrl.status) {
            if (pin) { pin.write(GpioState.HIGH) }
        } else {
            this.#setAlarm(false)
            if (pin) { pin.write(GpioState.LOW) }
            for (const sensor of this.#sensors) {
                sensor.detected = false
            }
        }
        
        log.info(LogMod.SECURITY, `Security controller "${this.name}" changed status to "${this.#status}"`)
    
        if (save) {
            db.update("security", this.name, "global", "status", this.#status)
            db.save()
        }
    }

    #readSensors() {
        for (const sensor of this.#sensors) {
            if (sensor.readState()) {
                if (!sensor.detected) {
                    log.info(LogMod.SECURITY, `Security sensor "${sensor.name}" of ctrl "${this.name}" was detected penetration`)
                    
                    if (sensor.alarm && this.#status) {
                        this.#setAlarm(true)
                        log.info(LogMod.SECURITY, `Alarm for "${this.name}" was started`)
                    }
                }

                sensor.detected = true
            }
        }
    }

    /**
     * 
     * @param {string} key 
     * @returns {boolean}
     */
    #checkKey(key) {
        for (const k of this.#keys) {
            if (k == key) {
                return true
            }
        }
        return false
    }

    #readKeys() {
        onewire.readKeys((keys, err) => {
            if (err) {
                log.error(LogMod.SECURITY, `Failed to read security keys`, err.message)
            } else {
                if (keys.length > 0) {
                    let found = false
    
                    for (const key of keys) {
                        if (this.#checkKey(key)) {
                            log.info(LogMod.SECURITY, `Valid key "${key}" detected for controller "${this.name}"`)
                            
                            try {
                                this.#setStatus(!this.status, true)
                                found = true
                            } catch (err) {
                                log.error(LogMod.SECURITY, `Failed to switch security status by key for ctrl "${this.name}"`, err.message)
                            }

                            break
                        }
                    }
    
                    if (!found) {
                        log.error(LogMod.SECURITY, "Ivalid keys detected: " + keys)
                    }
                }
            }
        })
    }

    #setAlarm(val) {
        if (this.#alarm == val)
            return
    
        this.#alarm = val
    
        const pinRelay = gpio.getPin(this.#pins.get(SecurityPins.ALARM_RELAY))
        const pinLed = gpio.getPin(this.#pins.get(SecurityPins.ALARM_LED))
        const pinBuzzer = gpio.getPin(this.#pins.get(SecurityPins.BUZZER))
    
        if (this.#alarm) {
            if (pinRelay) { pinRelay.write(GpioState.HIGH) }
            this.#tmrAlarm = setInterval(() => { this.#handlerAlarm() }, ALARM_DELAY)
        } else {
            if (pinRelay) { pinRelay.write(GpioState.LOW) }
            if (pinLed) { pinLed.write(GpioState.LOW) }
            if (pinBuzzer) { pinBuzzer.write(GpioState.LOW) }
            this.lastAlarm = false
            clearInterval(this.#tmrAlarm)
        }
    }

    #handlerAlarm() {
        if (!this.#alarm)
            return

        const pinLed = gpio.getPin(this.#pins.get(SecurityPins.ALARM_LED))
        const pinBuzzer = gpio.getPin(this.#pins.get(SecurityPins.BUZZER))

        if (!this.#lastAlarm) {
            if (pinLed) { pinLed.write(GpioState.HIGH) }
            if (pinBuzzer) { pinBuzzer.write(GpioState.HIGH) }
        } else {
            if (pinLed) { pinLed.write(GpioState.LOW) }
            if (pinBuzzer) { pinBuzzer.write(GpioState.LOW) }
        }

        this.#lastAlarm = !this.#lastAlarm
    }
}