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

export const ALARM_LED_PIN      = 0
export const ALARM_RELAY_PIN    = 1
export const BUZZER_PIN         = 2
export const STATUS_LED_PIN     = 3

export const REED_SWITCH_SENSOR = "reedswitch"
export const MICRO_WAVE_SENSOR  = "microwave"
export const PIR_SENSOR         = "pir"

const READ_SENSORS_DELAY    = 1000
const ALARM_DELAY           = 250
const KEYS_CHECK_DELAY      = 1000
const KEYS_READED_DELAY     = 3000

var Pins = new Map()
var Sensors = []
var Keys = []
var Status = false
var Alarm = false
var LastAlarm = false

function handlerAlarm() {
    if (!Alarm)
        return

    const pinLed = gpio.getPin(Pins.get(ALARM_LED_PIN))
    const pinBuzzer = gpio.getPin(Pins.get(BUZZER_PIN))

    if (!LastAlarm) {
        if (pinLed) { gpio.writePin(pinLed, gpio.HIGH) }
        if (pinBuzzer) { gpio.writePin(pinBuzzer, gpio.HIGH) }
    } else {
        if (pinLed) { gpio.writePin(pinLed, gpio.LOW) }
        if (pinBuzzer) { gpio.writePin(pinBuzzer, gpio.LOW) }
    }

    LastAlarm = !LastAlarm

    setTimeout(() => { handlerAlarm() }, ALARM_DELAY)
}

function setAlarm(val) {
    if (Alarm == val)
        return

    Alarm = val

    const pinRelay = gpio.getPin(Pins.get(ALARM_RELAY_PIN))
    const pinLed = gpio.getPin(Pins.get(ALARM_LED_PIN))
    const pinBuzzer = gpio.getPin(Pins.get(BUZZER_PIN))

    if (Alarm) {
        setTimeout(() => { handlerAlarm() }, ALARM_DELAY)
        if (pinRelay) { gpio.writePin(pinRelay, gpio.HIGH) }
    } else {
        LastAlarm = false
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
    if (!Status)
        return

    for (const sensor of Sensors) {
        const state = readState(sensor)
        if (state) {
            if (!sensor.detected) {
                log.info(log.mod.SECURITY, `Security sensor "${sensor.name}" was detected penetration`)
                if (sensor.alarm && Status) {
                    setAlarm(true)
                    log.info(log.mod.SECURITY, `Alarm was started`)
                }
            }
            sensor.detected = true
        }
    }
}

function readKeys() {
    onewire.readKeys((keys, err) => {
        if (err) {
            log.error(log.mod.SECURITY, `Failed to read security keys`, err.message)
        } else {
            if (keys.length > 0) {
                let found = false

                for (const key of keys) {
                    for (const k of Keys) {
                        if (key == k) {
                            log.info(log.mod.SECURITY, `Valid key "${key}" detected`)
                            found = true
                            try {
                                setStatus(!Status, true)
                                found = true
                                break
                            } catch (err) {
                                log.error(log.mod.SECURITY, "Failed to switch security status by key", err.message)
                            }
                            break
                        }
                    }
                    if (found) { break }
                }

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

export function setPin(type, name) {
    if ((type != ALARM_LED_PIN) &&
        (type != ALARM_RELAY_PIN) &&
        (type != BUZZER_PIN) &&
        (type != STATUS_LED_PIN)) {
        throw new Error(`Unknown pin "${name}" type "${type}"`)
    }

    Pins.set(type, name)
}

export function addSensor(name, type, pin, alarm) {
    if ((type != REED_SWITCH_SENSOR) &&
        (type != MICRO_WAVE_SENSOR) &&
        (type != PIR_SENSOR)) {
        throw new Error(`Unknown sensor "${name}" type "${type}"`)
    }

    Sensors.push({
        name: name,
        type: type,
        pin: pin,
        alarm: alarm,
        detected: false
    })
}

export function addKey(key) {
    Keys.push(key)
}

export function getSensors() {
    return Sensors
}

export function getStatus() {
    return Status
}

export function getAlarm() {
    return Alarm
}

export function setStatus(val) {
    Status = val

    const pin = gpio.getPin(Pins.get(STATUS_LED_PIN))

    if (Status) {
        if (pin) { gpio.writePin(pin, gpio.HIGH) }
    } else {
        setAlarm(false)
        if (pin) { gpio.writePin(pin, gpio.LOW) }
        for (const sensor of Sensors) {
            sensor.detected = false
        }
    }
    
    log.info(log.mod.SECURITY, `Security Status changed to "${Status}"`)

    if (save) {
        //db.curDB().update(CtrlType.SECURITY, super.getName(), "global", "Status", Status)
        //db.curDB().save()
    }
}

export function start() {
    setInterval(() => { readSensors() }, READ_SENSORS_DELAY)
    setTimeout(() => { readKeys() }, KEYS_CHECK_DELAY)
}