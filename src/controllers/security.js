/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as gpio from "../core/gpio.js"
import * as log from "../utils/log.js"
import * as onewire from "../core/onewire.js"

/*********************************************************************/
/*                         PRIVATE CONSTANTS                         */
/*********************************************************************/

const READ_SENSORS_DELAY    = 1000
const ALARM_DELAY           = 250
const KEYS_CHECK_DELAY      = 1000
const KEYS_READED_DELAY     = 3000

/*********************************************************************/
/*                         PRIVATE VARIABLES                         */
/*********************************************************************/

var Controllers = new Map()

/*********************************************************************/
/*                         PRIVATE FUNCTIONS                         */
/*********************************************************************/

function handlerAlarm() {
    Controllers.forEach((ctrl) => {
        if (ctrl.alarm) {
            const pinLed = gpio.getPin(ctrl.pins.get(ALARM_LED_PIN))
            const pinBuzzer = gpio.getPin(ctrl.pins.get(BUZZER_PIN))

            if (!ctrl.lastAlarm) {
                if (pinLed) { gpio.writePin(pinLed, gpio.HIGH) }
                if (pinBuzzer) { gpio.writePin(pinBuzzer, gpio.HIGH) }
            } else {
                if (pinLed) { gpio.writePin(pinLed, gpio.LOW) }
                if (pinBuzzer) { gpio.writePin(pinBuzzer, gpio.LOW) }
            }

            ctrl.lastAlarm = !ctrl.lastAlarm
        }
    })
    setTimeout(() => { handlerAlarm() }, ALARM_DELAY)
}

function setAlarm(ctrl, val) {
    if (ctrl.alarm == val)
        return

    ctrl.alarm = val

    const pinRelay = gpio.getPin(ctrl.pins.get(ALARM_RELAY_PIN))
    const pinLed = gpio.getPin(ctrl.pins.get(ALARM_LED_PIN))
    const pinBuzzer = gpio.getPin(ctrl.pins.get(BUZZER_PIN))

    if (ctrl.alarm) {
        if (pinRelay) { gpio.writePin(pinRelay, gpio.HIGH) }
    } else {
        ctrl.lastAlarm = false
        if (pinRelay) { gpio.writePin(pinRelay, gpio.LOW) }
        if (pinLed) { gpio.writePin(pinLed, gpio.LOW) }
        if (pinBuzzer) { gpio.writePin(pinBuzzer, gpio.LOW) }
    }
}

function readState(sensor) {
    const pin = gpio.getPin(sensor.pin)
    if (pin) {
        switch (sensor.type) {
            case MICRO_WAVE_SENSOR:
            case REED_SWITCH_SENSOR:
                if (gpio.readPin(pin) == gpio.LOW) {
                    return true
                }
                break

            case PIR_SENSOR:
                if (gpio.readPin(pin) == gpio.HIGH) {
                    return true
                }
                break
        }
    }

    return false
}

function readSensors() {
    Controllers.forEach((ctrl) => {
        if (ctrl.status) {
            for (const sensor of ctrl.sensors) {
                if (readState(sensor)) {
                    if (!sensor.detected) {
                        log.info(log.mod.SECURITY, `Security sensor "${sensor.name}" of "${ctrl.name}" was detected penetration`)
                        if (sensor.alarm && ctrl.status) {
                            setAlarm(ctrl, true)
                            log.info(log.mod.SECURITY, `Alarm for "${ctrl.name}" was started`)
                        }
                    }
                    sensor.detected = true
                }
            }
        }
    })
}

function readKeys() {
    onewire.readKeys((keys, err) => {
        if (err) {
            log.error(log.mod.SECURITY, `Failed to read security keys`, err.message)
        } else {
            if (keys.length > 0) {
                let found = false

                Controllers.forEach((ctrl) => {
                    for (const key of keys) {
                        for (const k of ctrl.keys) {
                            if (key == k) {
                                log.info(log.mod.SECURITY, `Valid key "${key}" detected for controller "${ctrl.name}"`)
                                found = true
                                try {
                                    setStatus(ctrl, !ctrl.status, true)
                                    found = true
                                    break
                                } catch (err) {
                                    log.error(log.mod.SECURITY, `Failed to switch security status by key for controller "${ctrl.name}"`, err.message)
                                }
                                break
                            }
                        }
                        if (found) { break }
                    }
                })

                if (!found) {
                    log.error(log.mod.SECURITY, "Ivalid keys detected: " + keys)
                }

                setTimeout(() => { readKeys() }, KEYS_READED_DELAY)
                return
            }
        }
        setTimeout(() => { readKeys() }, KEYS_CHECK_DELAY)
    })
}

/*********************************************************************/
/*                          PUBLIC CONSTANTS                         */
/*********************************************************************/

export const ALARM_LED_PIN      = 0
export const ALARM_RELAY_PIN    = 1
export const BUZZER_PIN         = 2
export const STATUS_LED_PIN     = 3

export const REED_SWITCH_SENSOR = "reedswitch"
export const MICRO_WAVE_SENSOR  = "microwave"
export const PIR_SENSOR         = "pir"

/*********************************************************************/
/*                          PUBLIC FUNCTIONS                         */
/*********************************************************************/

/**
 * 
 * @param {string} name 
 */
export function addController(name) {
    const ctrl = {
        name: name,
        pins: new Map(),
        sensors: [],
        keys: [],
        status: false,
        alarm: false,
        lastAlarm: false
    }

    Controllers.set(name, ctrl)

    return ctrl
}

/**
 * 
 * @param {string} name 
 * @returns Security Controller
 */
export function getController(name) {
    return Controllers.get(name)
}

export function setPin(ctrl, type, name) {
    if ((type != ALARM_LED_PIN) &&
        (type != ALARM_RELAY_PIN) &&
        (type != BUZZER_PIN) &&
        (type != STATUS_LED_PIN)) {
        throw new Error(`Unknown pin "${name}" type "${type}" ctrl "${ctrl.name}"`)
    }

    ctrl.pins.set(type, name)
}

/**
 * 
 * @param {*} ctrl 
 * @param {string} name 
 * @param {number} type 
 * @param {string} pin 
 * @param {boolean} alarm 
 */
export function addSensor(ctrl, name, type, pin, alarm) {
    if ((type != REED_SWITCH_SENSOR) &&
        (type != MICRO_WAVE_SENSOR) &&
        (type != PIR_SENSOR)) {
        throw new Error(`Unknown sensor "${name}" type "${type}" ctrl "${ctrl.name}"`)
    }

    ctrl.sensors.push({
        name: name,
        type: type,
        pin: pin,
        alarm: alarm,
        detected: false
    })
}

export function addKey(ctrl, key) {
    ctrl.keys.push(key)
}

export function getSensors(ctrl) {
    return ctrl.sensors
}

export function getStatus(ctrl) {
    return ctrl.status
}

export function getAlarm(ctrl) {
    return ctrl.alarm
}

/**
 * 
 * @param {*} ctrl 
 * @param {boolean} val 
 */
export function setStatus(ctrl, val, save=true) {
    ctrl.status = val

    const pin = gpio.getPin(ctrl.pins.get(STATUS_LED_PIN))

    if (ctrl.status) {
        if (pin) { gpio.writePin(pin, gpio.HIGH) }
    } else {
        setAlarm(ctrl, false)
        if (pin) { gpio.writePin(pin, gpio.LOW) }
        for (const sensor of ctrl.sensors) {
            sensor.detected = false
        }
    }
    
    log.info(log.mod.SECURITY, `Security status changed to "${ctrl.status}" for controller "${ctrl.name}"`)

    if (save) {
        //db.curDB().update(CtrlType.SECURITY, super.getName(), "global", "Status", Status)
        //db.curDB().save()
    }
}

export function start() {
    setInterval(() => { readSensors() }, READ_SENSORS_DELAY)
    setTimeout(() => { readKeys() }, KEYS_CHECK_DELAY)
    setTimeout(() => { handlerAlarm() }, ALARM_DELAY)
}