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

import { log, LogMod, LogType } from "./log.js"
import { GpioMode, GpioPull, GpioPin, GpioType, addGpio } from "../core/gpio.js"
import { UnitType, Unit, addStackUnit } from "../core/stack.js"
import { initDisplay } from "../core/lcd.js"
import { connectDB, insertDB, loadFromFileDB, saveDB, selectDB, setDB } from "../database/db.js"
import { JsonDatabase } from "../database/jsondb.js"
import { MongoDatabase } from "../database/mongodb.js"
import { ApiVersion } from "../net/api/api.js"
import { IndexHandlerV1 } from "../net/api/v1/indexh.js"
import { SecurityHandlerV1 } from "../net/api/v1/securityh.js"
import { SocketHandlerV1 } from "../net/api/v1/socket.js"
import { MeteoHandlerV1 } from "../net/api/v1/meteoh.js"
import { SocketController } from "../controllers/socket/socketctrl.js"
import { addController } from "../controllers/controllers.js"
import { MeteoController } from "../controllers/meteo/meteoctrl.js"
import { SecurityController, SecurityPins } from "../controllers/security/security.js"
import { SecuritySensor, SecuritySensorType } from "../controllers/security/ssensor.js"
import { DS18B20 } from "../controllers/meteo/sensors/ds18b20.js"
import { addServerHandler, setServerPort } from "../net/server.js"
import { Socket } from "../controllers/socket/socket.js"

function readFromFile(fileName) {
    const rawData = readFileSync(fileName)
    return JSON.parse(rawData.toString())
}

function readBoardConfigs(path) {
    const factory = readFromFile(`${path}/factory.json`)
    log(LogType.INFO, LogMod.CONFIGS, `Board "${factory.device}-${factory.revision}" detected`)

    const data = readFromFile(`${path}/boards/${factory.device}-${factory.revision}.json`)

    /**
     * Extenders units
     */

    for (const un of data.units) {
        let type = UnitType.PCF8574

        switch (un.type) {
            case "mcp23017":
                type = UnitType.MCP23017
                break

            case "pcf8574":
                type = UnitType.PCF8574
                break

            case "ads1115":
                type = UnitType.ADS1115
                break

            default:
                throw new Error(`Unknown extender unit type "${un.type}"`)
        }

        addStackUnit(new Unit(un.name, type, un.base, un.addr))

        log(LogType.INFO, LogMod.CONFIGS, `Add extender "${un.name}" type "${un.type}" base "${un.base}" addr "${un.addr}"`)
    }

    /**
     * GPIO
     */

    for (const g of data.gpio) {
        let mode = GpioMode.INPUT
        let pull = GpioPull.OFF
        let type = GpioType.DIGITAL

        switch (g.type) {
            case "digital":
                type = GpioType.DIGITAL
                break

            case "analog":
                type = GpioType.ANALOG
                break

            default:
                throw new Error(`Unknown GPIO type "${g.type}"`)
        }

        switch (g.mode) {
            case "input":
                mode = GpioMode.INPUT
                break

            case "output":
                mode = GpioMode.OUTPUT
                break

            default:
                throw new Error(`Unknown GPIO mode "${g.mode}"`)
        }

        switch (g.pull) {
            case "up":
                pull = GpioPull.UP
                break

            case "down":
                pull = GpioPull.DOWN
                break

            case "off":
                pull = GpioPull.OFF
                break

            default:
                throw new Error(`Unknown GPIO mode "${g.mode}"`)
        }

        addGpio(new GpioPin(g.name, type, g.pin, mode, pull))

        log(LogType.INFO, LogMod.CONFIGS, `Add pin "${g.name}" type "${g.type}" gpio "${g.pin}" mode "${g.mode}" pull "${g.pull}"`)
    }

    /**
     * LCD
     */

    log(LogType.INFO, LogMod.CONFIGS, `Init display 16x2`)
    initDisplay(data.lcd.rs, data.lcd.rw, data.lcd.e, data.lcd.k, data.lcd.d4, data.lcd.d5, data.lcd.d6, data.lcd.d7)
}

function readGeneralConfigs(path) {
    const data = readFromFile(`${path}/general.json`)

    switch (data.db.type) {
        case "jdb":
            log(LogType.INFO, LogMod.CONFIGS, `Loading JDB from file "${data.db.jdb.file}"`)
            setDB(new JsonDatabase())
            loadFromFileDB(data.db.jdb.file)
            break

        case "mongo":
            log(LogType.INFO, LogMod.CONFIGS, `Connecting MongoDB to "${data.db.mongo.ip}"`)
            setDB(new MongoDatabase())
            connectDB(data.db.mongo.ip, data.db.mongo.user, data.db.mongo.pass)
            break

        default:
            throw new Error(`Unknown database type`)
    }

    switch (data.server.api) {
        case ApiVersion.V1:
            addServerHandler(new IndexHandlerV1())
            addServerHandler(new MeteoHandlerV1())
            addServerHandler(new SecurityHandlerV1())
            addServerHandler(new SocketHandlerV1())
            break

        default:
            throw new Error(`Unknown server API`)
    }
    setServerPort(data.server.port)
}

function readControllersConfigs(path) {
    const data = readFromFile(`${path}/controllers.json`)

    for (const ctrl of data.controllers) {
        switch (ctrl.type) {
            case "socket":
                log(LogType.INFO, LogMod.CONFIGS, `Add socket controller "${ctrl.name}"`)
                const ctrlSocket = new SocketController(ctrl.name)
                addController(ctrlSocket)
                parseSocket(ctrlSocket, ctrl)
                break

            case "meteo":
                log(LogType.INFO, LogMod.CONFIGS, `Add meteo controller "${ctrl.name}"`)
                const ctrlMeteo = new MeteoController(ctrl.name)
                addController(ctrlMeteo)
                parseMeteo(ctrlMeteo, ctrl)
                break

            case "security":
                log(LogType.INFO, LogMod.CONFIGS, `Add security controller "${ctrl.name}"`)
                const ctrlSecurity = new SecurityController(ctrl.name)
                addController(ctrlSecurity)
                parseSecurity(ctrlSecurity, ctrl)
                break

            default:
                throw new Error(`Unknown controller type "${ctrl.type}"`)
        }
    }
}

/**
 * 
 * @param {SocketController} ctrl 
 * @param {*} data 
 */
function parseSocket(ctrl, data) {
    for (const sock of data.sockets) {
        log(LogType.INFO, LogMod.CONFIGS, `Add socket "${sock.name}" relay "${sock.pins.relay}" button "${sock.pins.button}"`)

        /**
         * Add new socket
         */

        ctrl.addSocket(new Socket(sock.name, sock.pins.relay, sock.pins.button))

        /**
         * Load socket state from Database
         */

        let state = false

        try {
            state = selectDB("socket", ctrl.name, sock.name, "status")
        } catch (err) {
            insertDB("socket", ctrl.name, sock.name, "status", state)
            saveDB()
        }
    }
}

/**
 * 
 * @param {MeteoController} ctrl 
 * @param {*} data 
 */
function parseMeteo(ctrl, data) {
    for (const sensor of data.sensors) {
        log(LogType.INFO, LogMod.CONFIGS, `Add meteo sensor "${sensor.name}" type "${sensor.type}"`)
        switch (sensor.type) {
            case "ds18b20":
                ctrl.addSensor(new DS18B20(sensor.name, sensor.id))
                break

            default:
                throw new Error(`Unknown meteo sensor type "${sensor.type}"`)
        }
    }
}

/**
 * 
 * @param {SecurityController} ctrl 
 * @param {*} data 
 */
function parseSecurity(ctrl, data) {
    ctrl.setPin(SecurityPins.STATUS_LED, data.pins.status)
    ctrl.setPin(SecurityPins.BUZZER, data.pins.buzzer)
    ctrl.setPin(SecurityPins.ALARM_LED, data.pins.alarm.led)
    ctrl.setPin(SecurityPins.ALARM_RELAY, data.pins.alarm.relay)

    log(LogType.INFO, LogMod.CONFIGS, `Security "status" pin is "${data.pins.status}"`)
    log(LogType.INFO, LogMod.CONFIGS, `Security "buzzer" pin is "${data.pins.buzzer}"`)
    log(LogType.INFO, LogMod.CONFIGS, `Security "alarm-led" pin is "${data.pins.alarm.led}"`)
    log(LogType.INFO, LogMod.CONFIGS, `Security "alarm-relay" pin is "${data.pins.alarm.relay}"`)

    for (const key of data.keys) {
        ctrl.addKey(key)
        log(LogType.INFO, LogMod.CONFIGS, `Security add key "${key}"`)
    }

    for (const sensor of data.sensors) {
        log(LogType.INFO, LogMod.CONFIGS, `Add security sensor "${sensor.name}" type "${sensor.type}"`)
        switch (sensor.type) {
            case "reedswitch":
                ctrl.addSensor(new SecuritySensor(sensor.name, SecuritySensorType.REED_SWITCH, sensor.pin, sensor.alarm))
                break

            case "pir":
                ctrl.addSensor(new SecuritySensor(sensor.name, SecuritySensorType.PIR, sensor.pin, sensor.alarm))
                break

            case "microwave":
                ctrl.addSensor(new SecuritySensor(sensor.name, SecuritySensorType.MICRO_WAVE, sensor.pin, sensor.alarm))
                break

            default:
                throw new Error(`Unknown security sensor type "${sensor.type}"`)
        }
    }

    let status = false
    try {
        status = selectDB("security", ctrl.name, "global", "status")
    } catch (err) {
        insertDB("security", ctrl.name, "global", "status", status)
        saveDB()
    }

    ctrl.setStatus(status, false)
}

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