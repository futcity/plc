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

function readControllers(path) {
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
            //state = this.db.curDB().select(CtrlType.SOCKET, ctrl.name, sock.name, "state")
        } catch (err) {
            //this.db.curDB().insert(CtrlType.SOCKET, ctrl.name, sock.name, "state", state)
            //this.db.curDB().save()
        }
    }
}

function parseMeteo(ctrl, data) {
    
}

function parseSecurity(ctrl, data) {
    
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
    readControllers(path)
}