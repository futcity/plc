/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { log, logMod } from "../../utils/log.js"
import { gpio, gpioState } from "../../core/gpio.js"
import { Controller } from "../controller.js"

const READ_SENSORS_DELAY = 1000
const ALARM_DELAY = 500

export const secPins = {
    STATUS_LED: 0,
    ALARM_BUZZER: 1,
    ALARM_RELAY: 2,
    ALARM_LED: 3,
    KEY_READER: 4
}

export class SecurityController extends Controller {
    #sensors = []
    #alarm = false
    #lastAlarm = false

    addSensor(sensor) {
        this.#sensors.push(sensor)
        return true
    }

    getSensors() {
        return this.#sensors
    }

    getSensor(name) {
        for (let sensor of this.#sensors) {
            if (sensor.name == name)
                return sensor
        }
        return undefined
    }

    getAlarm() {
        return this.#alarm
    }

    setStatus(val) {
        super.setStatus(val)

        if (!val) {
            if (this.#alarm)
                this.#setAlarm(false)

            for (let sensor of this.#sensors) {
                sensor.detected = false
            }

            if (!gpio.writePin(super.getPin(secPins.ALARM_BUZZER), gpioState.LOW))
                log.error(logMod.SECURITY, "Failed to write alarm buzzer pin")

            if (!gpio.writePin(super.getPin(secPins.ALARM_LED), gpioState.LOW))
                log.error(logMod.SECURITY, "Failed to write alarm led pin")

            if (!gpio.writePin(super.getPin(secPins.ALARM_RELAY), gpioState.LOW))
                log.error(logMod.SECURITY, "Failed to write alarm relay pin")

            if (!gpio.writePin(super.getPin(secPins.STATUS_LED), gpioState.LOW))
                log.error(logMod.SECURITY, "Failed to write status led pin")
        } else {
            if (!gpio.writePin(super.getPin(secPins.STATUS_LED), gpioState.HIGH))
                log.error(logMod.SECURITY, "Failed to write status led pin")
        }
        return true
    }

    start() {
        super.start()
        setTimeout(() => { this.#readSensors() }, READ_SENSORS_DELAY)
        return true
    }

    #readSensors() {
        if (super.getStatus()) {
            for (let sensor of this.#sensors) {
                let lastState = sensor.detected

                if (!sensor.readPin()) {
                    log.error(logMod.SECURITY, "Failed to read pin of sensor " + sensor.name)
                }

                if (sensor.detected && (sensor.detected != lastState)) {
                    log.info(logMod.SECURITY, "Security sensor " + sensor.name + " is detected")
                    if (!this.#alarm) {
                        this.#setAlarm(true)
                    }
                }
            }
        }

        setTimeout(() => { this.#readSensors() }, READ_SENSORS_DELAY)
    }

    #setAlarm(val) {
        this.#alarm = val
        if (val) {
            if (!gpio.writePin(super.getPin(secPins.ALARM_RELAY), gpioState.HIGH))
                log.error(logMod.SECURITY, "Failed to write alarm relay pin")

            log.info(logMod.SECURITY, "Security alarm start")
    
            this.tmrAlarm = setInterval(() => { this.#alarmHandler() }, ALARM_DELAY)
        } else {
            log.info(logMod.SECURITY, "Security alarm stop")

            if (this.tmrAlarm) {
                clearInterval(this.tmrAlarm)
            }
        }
    }

    #alarmHandler() {
        this.#lastAlarm = !this.#lastAlarm

        if (!super.getStatus())
            return

        if (this.#lastAlarm) {
            if (!gpio.writePin(super.getPin(secPins.ALARM_BUZZER), gpioState.HIGH))
                log.error(logMod.SECURITY, "Failed to write alarm buzzer pin")

            if (!gpio.writePin(super.getPin(secPins.ALARM_LED), gpioState.HIGH))
                log.error(logMod.SECURITY, "Failed to write alarm led pin")
        } else {
            if (!gpio.writePin(super.getPin(secPins.ALARM_BUZZER), gpioState.LOW))
                log.error(logMod.SECURITY, "Failed to write alarm buzzer pin")

            if (!gpio.writePin(super.getPin(secPins.ALARM_LED), gpioState.LOW))
                log.error(logMod.SECURITY, "Failed to write alarm led pin")
        }
    }
}
