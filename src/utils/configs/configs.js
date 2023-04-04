/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { logMod, log } from "../log.js"
import { gpio, extType, GpioExtender, GpioPin, gpioMode } from "../../core/gpio.js"
import { readFileSync } from "fs"
import { app } from "../../app/app.js"
import { ctrlType } from "../../controllers/controller.js"
import { server } from "../../server/server.js"
import { SocketController } from "../../controllers/socket/socketctrl.js"
import { WaterTankController } from "../../controllers/watertank/watertankctrl.js"
import { WateringController } from "../../controllers/watering/wateringctrl.js"
import { SecurityController } from "../../controllers/security/securityctrl.js"
import { ConfigsLoader } from "./loader.js"

class Configs {
    load(path) {
        let data = this.#loadFromFile(path)

        server.setPort(data.server.port)

        if (!this.#loadExtenders(data)) {
            log.error(logMod.CONFIGS, "Failed to load Extenders")
            return false
        }

        if (!this.#loadGpio(data)) {
            log.error(logMod.CONFIGS, "Failed to load GPIO")
            return false
        }

        if (!this.#loadControllers(data)) {
            log.error(logMod.CONFIGS, "Failed to load controllers")
            return false
        }
        
        return true
    }

    #loadFromFile(fileName) {
        let rawData = readFileSync(fileName)
        return JSON.parse(rawData.toString())
    }

    #loadExtenders(data) {
        for (let ext of data.extenders) {
            if (ext.enabled) {
                let type = extType.MCP23017

                switch (ext.type) {
                    case "mcp23017":
                        type = extType.MCP23017
                        break

                    case "pcf8574":
                        type = extType.PCF8574
                        break
                }

                if (gpio.addExtender(new GpioExtender(ext.name, type, ext.addr, ext.base))) {
                    log.info(logMod.CONFIGS, "Add extender Name: " + ext.name + " Type: " + ext.type + " Addr: " + ext.addr + " Base: " + ext.base)
                } else {
                    log.error(logMod.CONFIGS, "Failed to add extender: " + ext.name)
                    return false
                }
            }
        }
        return true
    }

    #loadGpio(data) {
        for (let pin of data.gpio) {
            if (pin.enabled) {
                let mode = gpioMode.OUTPUT

                switch (pin.mode) {
                    case "output":
                        mode = gpioMode.OUTPUT
                        break
                    case "input":
                        mode = gpioMode.INPUT
                        break
                    default:
                        log.error(logMod.CONFIGS, "Unknown gpio mode: " + pin.mode)
                        return false
                }

                if (gpio.addPin(new GpioPin(pin.name, pin.pin, mode, pin.pullup, pin.pulldown))) {
                    log.info(logMod.CONFIGS, "Add gpio Name: " + pin.name + " Pin: " + pin.pin + " Mode: " + pin.mode)
                } else {
                    log.error(logMod.CONFIGS, "Failed to add gpio Name: " + pin.name)
                    return false
                }
            }
        }
        return true
    }

    #loadControllers(data) {
        for (let ctrl of data.controllers) {
            if (ctrl.enabled) {
                switch (ctrl.type) {
                    case ctrlType.SOCKET:
                        {
                            let controller = new SocketController(ctrl.name, ctrl.type)
                            let loader = new ConfigsLoader(ctrl, controller)
                            if (loader.loadSocket()) {
                                app.addController(controller)
                            } else {
                                log.error(logMod.CONFIGS, "Failed to load socket controller: " + ctrl.name)
                                return false
                            }
                        }
                        break

                    case ctrlType.WATER_TANK:
                        {
                            let controller = new WaterTankController(ctrl.name, ctrl.type)
                            let loader = new ConfigsLoader(ctrl, controller)
                            if (loader.loadWaterTank()) {
                                app.addController(controller)
                            } else {
                                log.error(logMod.CONFIGS, "Failed to load water tank controller: " + ctrl.name)
                                return false
                            }
                        }
                        break

                    case ctrlType.WATERING:
                        {    
                            let controller = new WateringController(ctrl.name, ctrl.type)
                            let loader = new ConfigsLoader(ctrl, controller)
                            if (loader.loadWatering()) {
                                app.addController(controller)
                            } else {
                                log.error(logMod.CONFIGS, "Failed to load watering controller: " + ctrl.name)
                                return false
                            }
                        }
                        break

                    case ctrlType.SECURITY:
                        {
                            let controller = new SecurityController(ctrl.name, ctrl.type)
                            let loader = new ConfigsLoader(ctrl, controller)
                            if (loader.loadSecurity()) {
                                app.addController(controller)
                            } else {
                                log.error(logMod.CONFIGS, "Failed to load security controller: " + ctrl.name)
                                return false
                            }
                        }
                        break

                    default:
                        log.error(logMod.CONFIGS, "Unknown controller type: " + ctrl.type)
                        return false
                }
            }
        }
        return true
    }
}

export const cfg = new Configs()
