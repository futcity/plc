/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readFileSync } from "fs"

import * as log from "./log.js"
import * as gpio from "../core/gpio.js"
import * as extenders from "../core/extenders.js"
import * as lcd from "../core/lcd.js"
import * as socket from "../controllers/socket.js"
import * as security from "../controllers/security.js"
import * as meteo from "../controllers/meteo.js"
import * as db from "../database/db.js"

/*********************************************************************/
/*                          PRIVATE FUNCTIONS                        */
/*********************************************************************/

function readFromFile(fileName) {
    const rawData = readFileSync(fileName)
    return JSON.parse(rawData.toString())
}

function readBoardConfigs(path) {
    const factory = readFromFile(`${path}/factory.json`)
    log.info(log.mod.CONFIGS, `Board "${factory.device}-${factory.revision}" detected`)

    const data = readFromFile(`${path}/boards/${factory.device}-${factory.revision}.json`)

    /**
     * Extenders
     */

    for (const ex of data.extenders) {
        let type = extenders.PCF8574

        switch (ex.type) {
            case "mcp23017":
                type = extenders.MCP23017
                break

            case "pcf8574":
                type = extenders.PCF8574
                break

            case "ads1115":
                type = extenders.ADS1115
                break

            default:
                throw new Error(`Unknown Extender type "${ex.type}"`)
        }

        extenders.addUnit(ex.name, type, ex.base, ex.addr)

        log.info(log.mod.CONFIGS, `Add extender "${ex.name}" type "${ex.type}" base "${ex.base}" addr "${ex.addr}"`)
    }

    /**
     * GPIO
     */

    for (const g of data.gpio) {
        let mode = gpio.INPUT
        let pull = gpio.OFF

        switch (g.mode) {
            case "input":
                mode = gpio.INPUT
                break

            case "output":
                mode = gpio.OUTPUT
                break

            default:
                throw new Error(`Unknown GPIO mode "${g.mode}"`)
        }

        switch (g.pull) {
            case "up":
                pull = gpio.UP
                break

            case "down":
                pull = gpio.DOWN
                break

            case "off":
                pull = gpio.OFF
                break

            default:
                throw new Error(`Unknown GPIO mode "${g.mode}"`)
        }

        gpio.addPin(g.name, mode, pull, g.pin)

        log.info(log.mod.CONFIGS, `Add pin "${g.name}" gpio "${g.pin}" mode "${g.mode}" pull "${g.pull}"`)
    }

    /**
     * LCD
     */

    for (const l of data.lcd) {
        lcd.addDisplay(l.name,
            l.pins.rs,
            l.pins.rw,
            l.pins.e,
            l.pins.k,
            l.pins.d4,
            l.pins.d5,
            l.pins.d6,
            l.pins.d7
        )

        log.info(log.mod.CONFIGS, `Add display "${l.name}"`)
    }
}

function readGeneralConfigs(path) {
    const data = readFromFile(`${path}/general.json`)

    switch (data.db.type) {
        case "jdb":
            log.info(log.mod.CONFIGS, `Loading JDB from file "${data.db.jdb.file}"`)
            try {
                db.setType(db.JDB)
                db.loadFromFile(data.db.jdb.file)
            } catch (err) {
                log.error(log.mod.CONFIGS, `Failed to load JDB`, err)
                return false
            }
            break

        case "mongo":
            log.info(log.mod.CONFIGS, `Connecting MongoDB to "${data.db.mongo.ip}"`)
            try {
                db.setType(db.MONGO)
                db.connect(data.db.mongo.ip, data.db.mongo.user, data.db.mongo.pass)
            } catch (err) {
                log.error(log.mod.CONFIGS, `Failed to load MongoDB`, err)
                return false
            }
            break

        default:
            throw new Error(`Unknown database type`)
    }
}

function readControllersConfigs(path) {
    const data = readFromFile(`${path}/controllers.json`)

    for (const ctrl of data.controllers) {
        switch (ctrl.type) {
            case "socket":
                log.info(log.mod.CONFIGS, `Add socket controller "${ctrl.name}"`)
                const ctrlSocket = socket.addController(ctrl.name)
                parseSocket(ctrlSocket, ctrl)
                break

            case "meteo":
                log.info(log.mod.CONFIGS, `Add meteo controller "${ctrl.name}"`)
                const ctrlMeteo = meteo.addController(ctrl.name)
                parseMeteo(ctrlMeteo, ctrl)
                break

            case "security":
                log.info(log.mod.CONFIGS, `Add security controller "${ctrl.name}"`)
                const ctrlSecurity = security.addController(ctrl.name)
                parseSecurity(ctrlSecurity, ctrl)
                break

            default:
                throw new Error(`Unknown controller type "${ctrl.type}"`)
        }
    }
}

function parseSocket(ctrl, data) {
    for (const sock of data.sockets) {
        /**
         * Add new socket
         */

        socket.addSocket(ctrl, sock.name, sock.pins.relay, sock.pins.button)
        log.info(log.mod.CONFIGS, `Add socket "${sock.name}" relay "${sock.pins.relay}" button "${sock.pins.button}"`)

        /**
         * Load socket state from Database
         */

        let state = false

        try {
            state = db.select("socket", ctrl.name, sock.name, "status")
        } catch (err) {
            db.insert("socket", ctrl.name, sock.name, "status", state)
            db.save()
        }
    }
}

function parseMeteo(ctrl, data) {
    for (const sensor of data.sensors) {
        switch (sensor.type) {
            case "ds18b20":
                meteo.addSensor(ctrl, sensor.name, meteo.DS18B20_SENSOR, sensor.id)
                break

            default:
                throw new Error(`Unknown meteo sensor type "${sensor.type}"`)
        }
        log.info(log.mod.CONFIGS, `Add meteo sensor "${sensor.name}" type "${sensor.type}" ctrl "${ctrl.name}"`)
    }
}

function parseSecurity(ctrl, data) {
    security.setPin(ctrl, security.STATUS_LED_PIN, data.pins.status)
    security.setPin(ctrl, security.BUZZER_PIN, data.pins.buzzer)
    security.setPin(ctrl, security.ALARM_LED_PIN, data.pins.alarm.led)
    security.setPin(ctrl, security.ALARM_RELAY_PIN, data.pins.alarm.relay)

    log.info(log.mod.CONFIGS, `Security "status" pin is "${data.pins.status}"`)
    log.info(log.mod.CONFIGS, `Security "buzzer" pin is "${data.pins.buzzer}"`)
    log.info(log.mod.CONFIGS, `Security "alarm-led" pin is "${data.pins.alarm.led}"`)
    log.info(log.mod.CONFIGS, `Security "alarm-relay" pin is "${data.pins.alarm.relay}"`)

    for (const key of data.keys) {
        security.addKey(ctrl, key)
        log.info(log.mod.CONFIGS, `Security add key "${key}"`)
    }

    for (const sensor of data.sensors) {
        switch (sensor.type) {
            case "reedswitch":
                security.addSensor(ctrl, sensor.name, security.REED_SWITCH_SENSOR, sensor.pin, sensor.alarm)
                break

            case "pir":
                security.addSensor(ctrl, sensor.name, security.PIR_SENSOR, sensor.pin, sensor.alarm)
                break

            case "microwave":
                security.addSensor(ctrl, sensor.name, security.MICRO_WAVE_SENSOR, sensor.pin, sensor.alarm)
                break

            default:
                throw new Error(`Unknown security sensor type "${sensor.type}"`)
        }
        log.info(log.mod.CONFIGS, `Add security sensor "${sensor.name}" type "${sensor.type}" ctrl "${ctrl.name}"`)
    }

    let status = false
    try {
        status = db.select("security", ctrl.name, "global", "status")
    } catch (err) {
        db.insert("security", ctrl.name, "global", "status", status)
        db.save()
    }

    security.setStatus(ctrl, status, false)
}

/*********************************************************************/
/*                          PUBLIC FUNCTIONS                         */
/*********************************************************************/

/**
 * 
 * @param {string} path 
 */
export function loadMinConfigs(path) {
    readBoardConfigs(path)
}

/**
 * 
 * @param {string} path 
 */
export function loadConfigs(path) {
    readBoardConfigs(path)
    readGeneralConfigs(path)
    readControllersConfigs(path)
}