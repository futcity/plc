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

import { log, LogMod } from "./log.js"
import { gpio, GpioMode, GpioPull, GpioPin } from "../core/gpio.js"
import { stack, UnitType, Unit } from "../core/stack.js"
import { lcd } from "../core/lcd.js"
import * as socket from "../controllers/socket.js"
import * as security from "../controllers/security.js"
import * as meteo from "../controllers/meteo.js"
import { db } from "../database/db.js"
import { JsonDatabase } from "../database/jsondb.js"
import { MongoDatabase } from "../database/mongodb.js"
import * as server from "../net/server.js"

class Configs {
    /**
     * 
     * @param {string} path 
     */
    loadMinConfigs(path) {
        this.#readBoardConfigs(path)
    }
    
    /**
     * 
     * @param {string} path 
     */
    loadConfigs(path) {
        this.#readBoardConfigs(path)
        this.#readGeneralConfigs(path)
        this.#readControllersConfigs(path)
    }

    #readFromFile(fileName) {
        const rawData = readFileSync(fileName)
        return JSON.parse(rawData.toString())
    }
    
    #readBoardConfigs(path) {
        const factory = this.#readFromFile(`${path}/factory.json`)
        log.info(LogMod.CONFIGS, `Board "${factory.device}-${factory.revision}" detected`)
    
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
    
            stack.addUnit(new Unit(un.name, type, un.base, un.addr))
    
            log.info(LogMod.CONFIGS, `Add extender "${un.name}" type "${un.type}" base "${un.base}" addr "${un.addr}"`)
        }
    
        /**
         * GPIO
         */
    
        for (const g of data.gpio) {
            let mode = GpioMode.INPUT
            let pull = GpioPull.OFF
    
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
    
            gpio.addPin(new GpioPin(g.name, mode, pull, g.pin))
    
            log.info(LogMod.CONFIGS, `Add pin "${g.name}" gpio "${g.pin}" mode "${g.mode}" pull "${g.pull}"`)
        }
    
        /**
         * LCD
         */
    
        log.info(LogMod.CONFIGS, `Init display 16x2`)
        lcd.initDisplay(data.lcd.rs, data.lcd.rw, data.lcd.e, data.lcd.k, data.lcd.d4, data.lcd.d5, data.lcd.d6, data.lcd.d7)
    }
    
    #readGeneralConfigs(path) {
        const data = readFromFile(`${path}/general.json`)
    
        switch (data.db.type) {
            case "jdb":
                log.info(LogMod.CONFIGS, `Loading JDB from file "${data.db.jdb.file}"`)
                db.setDB(new JsonDatabase())
                db.loadFromFile(data.db.jdb.file)
                break
    
            case "mongo":
                log.info(LogMod.CONFIGS, `Connecting MongoDB to "${data.db.mongo.ip}"`)
                db.setDB(new MongoDatabase())
                db.connect(data.db.mongo.ip, data.db.mongo.user, data.db.mongo.pass)
                break
    
            default:
                throw new Error(`Unknown database type`)
        }
    
        server.setAPI(data.server.api)
        server.setPort(data.server.port)
    }
    
    #readControllersConfigs(path) {
        const data = readFromFile(`${path}/controllers.json`)
    
        for (const ctrl of data.controllers) {
            switch (ctrl.type) {
                case "socket":
                    log.info(LogMod.CONFIGS, `Add socket controller "${ctrl.name}"`)
                    const ctrlSocket = socket.addController(ctrl.name)
                    parseSocket(ctrlSocket, ctrl)
                    break
    
                case "meteo":
                    log.info(LogMod.CONFIGS, `Add meteo controller "${ctrl.name}"`)
                    const ctrlMeteo = meteo.addController(ctrl.name)
                    parseMeteo(ctrlMeteo, ctrl)
                    break
    
                case "security":
                    log.info(LogMod.CONFIGS, `Add security controller "${ctrl.name}"`)
                    const ctrlSecurity = security.addController(ctrl.name)
                    parseSecurity(ctrlSecurity, ctrl)
                    break
    
                default:
                    throw new Error(`Unknown controller type "${ctrl.type}"`)
            }
        }
    }
    
    #parseSocket(ctrl, data) {
        for (const sock of data.sockets) {
            /**
             * Add new socket
             */
    
            socket.addSocket(ctrl, sock.name, sock.pins.relay, sock.pins.button)
            log.info(LogMod.CONFIGS, `Add socket "${sock.name}" relay "${sock.pins.relay}" button "${sock.pins.button}"`)
    
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
    
    #parseMeteo(ctrl, data) {
        for (const sensor of data.sensors) {
            switch (sensor.type) {
                case "ds18b20":
                    meteo.addSensor(ctrl, sensor.name, meteo.DS18B20_SENSOR, sensor.id)
                    break
    
                default:
                    throw new Error(`Unknown meteo sensor type "${sensor.type}"`)
            }
            log.info(LogMod.CONFIGS, `Add meteo sensor "${sensor.name}" type "${sensor.type}"`)
        }
    }
    
    #parseSecurity(ctrl, data) {
        security.setPin(ctrl, security.STATUS_LED_PIN, data.pins.status)
        security.setPin(ctrl, security.BUZZER_PIN, data.pins.buzzer)
        security.setPin(ctrl, security.ALARM_LED_PIN, data.pins.alarm.led)
        security.setPin(ctrl, security.ALARM_RELAY_PIN, data.pins.alarm.relay)
    
        log.info(LogMod.CONFIGS, `Security "status" pin is "${data.pins.status}"`)
        log.info(LogMod.CONFIGS, `Security "buzzer" pin is "${data.pins.buzzer}"`)
        log.info(LogMod.CONFIGS, `Security "alarm-led" pin is "${data.pins.alarm.led}"`)
        log.info(LogMod.CONFIGS, `Security "alarm-relay" pin is "${data.pins.alarm.relay}"`)
    
        for (const key of data.keys) {
            security.addKey(ctrl, key)
            log.info(LogMod.CONFIGS, `Security add key "${key}"`)
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
            log.info(LogMod.CONFIGS, `Add security sensor "${sensor.name}" type "${sensor.type}"`)
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
}

export const cfg = new Configs()