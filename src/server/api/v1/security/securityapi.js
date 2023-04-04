/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { logMod } from "../../../../utils/log.js"
import { ServerResponse } from "../../../response.js"
import { SecuritySensorResponse } from "./secsensorresp.js"
import { SecurityInfoResponse } from "./securityinforesp.js"
import { app } from "../../../../app/app.js"

class SecurityApi {
    register(app) {
        app.get(apiSecurity.INFO, (req, res) => { res.json(this.#info(req)) })
    }

    #info(req) {
        let module = app.getModule(req.query.mod)
        if (!module) {
            return new ServerResponse(logMod.SECURITY_API).error(
                "Module " + req.query.mod + " not found")
        }

        let ctrl = module.getController(req.query.ctrl)
        if (!ctrl) {
            return new ServerResponse(logMod.SECURITY_API).error(
                "Controller " + req.query.ctrl + " not found")
        }

        /*
         * Get one of sensors
         */

        if (req.query.name) {
            let sensor = ctrl.getSensor(req.query.name)
            if (!sensor) {
                return new ServerResponse(logMod.SECURITY_API).error(
                    "Security sensor " + req.query.name + " not found")
            }

            return new ServerResponse(logMod.SECURITY_API).ok(
                new SecuritySensorResponse(sensor.name, sensor.type, sensor.alarm, sensor.detected),
                    "Getting security sensor info")
        }

        /*
         * Get all sensors list
         */

        let sensors = []

        for (let sensor of ctrl.getSensors()) {
            sensors.push(new SecuritySensorResponse(sensor.name, sensor.type, sensor.alarm, sensor.detected))
        }

        return new ServerResponse(logMod.SECURITY_API).ok(
            new SecurityInfoResponse(ctrl.getAlarm(), sensors),
                "Getting security sensors list")
    }
}

export const apiSecurity = new SecurityApi()
