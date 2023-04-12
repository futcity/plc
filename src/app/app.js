/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { server } from "../server/server.js"
import { menu } from "./menu.js"
import { ctrlType } from "../controllers/controller.js"
import { log, logMod } from "../utils/log.js"

class Application {
    #socket = []
    #watering = []
    #wtrtank = []
    #security = []

    getControllers(type) {
        switch (type) {
            case ctrlType.SOCKET:
                return this.#socket

            case ctrlType.WATERING:
                return this.#watering

            case ctrlType.WATER_TANK:
                return this.#wtrtank

            case ctrlType.SECURITY:
                return this.#security
        }
    }

    addController(type, ctrl) {
        switch (type) {
            case ctrlType.SOCKET:
                this.#socket.push(ctrl)
                break

            case ctrlType.WATERING:
                this.#watering.push(ctrl)
                break

            case ctrlType.WATER_TANK:
                this.#wtrtank.push(ctrl)
                break

            case ctrlType.SECURITY:
                this.#security.push(ctrl)
                break
        }
    }

    getController(type, name) {
        const ctrls = this.getControllers(type)
        if (!ctrls) {
            return undefined
        }

        for (const ctrl of ctrls) {
            if (ctrl.name == name)
                return ctrl
        }

        return undefined
    }

    start() {
        log.info(logMod.APP, "Starting Socket controllers")
        for (const ctrl of this.getControllers(ctrlType.SOCKET)) {
            if (!ctrl.start())
                return false
        }

        log.info(logMod.APP, "Starting Watering controllers")
        for (const ctrl of this.getControllers(ctrlType.WATERING)) {
            if (!ctrl.start())
                return false
        }

        log.info(logMod.APP, "Starting WaterTank controllers")
        for (const ctrl of this.getControllers(ctrlType.WATER_TANK)) {
            if (!ctrl.start())
                return false
        }

        log.info(logMod.APP, "Starting Security controllers")
        for (const ctrl of this.getControllers(ctrlType.SECURITY)) {
            if (!ctrl.start())
                return false
        }

        log.info(logMod.APP, "Starting Menu")
        menu.start()

        log.info(logMod.APP, "Starting API server")
        server.start()

        return true
    }
}

export const app = new Application()
