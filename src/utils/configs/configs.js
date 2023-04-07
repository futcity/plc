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
import { gpio, gpioExtType, GpioExtender, GpioPin, gpioPullType, gpioMode } from "../../core/gpio.js"
import { readFileSync } from "fs"
import { app } from "../../app/app.js"
import { ctrlType } from "../../controllers/controller.js"
import { server } from "../../server/server.js"
import { SocketController } from "../../controllers/socket/socketctrl.js"
import { WaterTankController } from "../../controllers/watertank/watertankctrl.js"
import { WateringController } from "../../controllers/watering/wateringctrl.js"
import { SecurityController } from "../../controllers/security/securityctrl.js"
import { ConfigsLoader } from "./loader.js"
import { menu } from "../../app/menu.js"

class Configs {
    load(path) {
        let data = this.#loadFromFile(path)

        if (!this.#loadExtenders(data)) {
            log.error(logMod.CONFIGS, "Failed to load Extenders")
            return false
        }

        if (!this.#loadGpio(data)) {
            log.error(logMod.CONFIGS, "Failed to load GPIO")
            return false
        }

        server.setPort(data.server.port)

        if (!this.#loadControllers(data)) {
            log.error(logMod.CONFIGS, "Failed to load controllers")
            return false
        }

        if (!this.#loadMenu(data)) {
            log.error(logMod.CONFIGS, "Failed to init menu")
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
                let type = gpioExtType.MCP23017

                switch (ext.type) {
                    case "mcp23017":
                        type = gpioExtType.MCP23017
                        break

                    case "pcf8574":
                        type = gpioExtType.PCF8574
                        break

                    default:
                        log.error(logMod.CONFIGS, "Unknown extender type: " + ext.type)
                        return false
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
            let mode = gpioMode.OUTPUT
            let pull = gpioPullType.NONE

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

            switch (pin.pull) {
                case "down":
                    pull = gpioPullType.DOWN
                    break

                case "up":
                    pull = gpioPullType.UP
                    break

                case "none":
                    pull = gpioPullType.NONE
                    break

                default:
                    log.error(logMod.CONFIGS, "Unknown gpio pull type: " + pin.pull)
                    return false
            }

            if (gpio.addPin(new GpioPin(pin.name, pin.pin, mode, pull))) {
                log.info(logMod.CONFIGS, "Add gpio Name: " + pin.name + " Pin: " + pin.pin + " Mode: " + pin.mode)
            } else {
                log.error(logMod.CONFIGS, "Failed to add gpio Name: " + pin.name)
                return false
            }
        }
        return true
    }

    #loadMenu(data) {
        if (!menu.initLCD(data.menu.lcd.base, data.menu.lcd.addr)) {
            log.error(logMod.CONFIGS, "Failed to init menu LCD")
            return false
        }

        menu.setButtons(data.menu.buttons.up, data.menu.buttons.red, data.menu.buttons.down)

        return true
    }

    #loadControllers(data) {
        for (let ctrl of data.controllers) {
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
        return true
    }
}

export const cfg = new Configs()
