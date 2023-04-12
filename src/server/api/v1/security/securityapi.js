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
import { ResponseData } from "../../../respdata.js"
import { app } from "../../../../app/app.js"
import { ctrlType } from "../../../../controllers/controller.js"
import { api } from "../api.js"

class SecurityApi {
    register(app) {
        app.get(api.SECURITY_INFO, (req, res) => { res.json(this.#info(req)) })
        app.get(api.SECURITY_STATUS, (req, res) => { res.json(this.#status(req)) })
    }

    #info(req) {
        const ctrl = app.getController(ctrlType.SECURITY, req.query.ctrl)
        if (!ctrl) {
            return new ServerResponse(logMod.SECURITY_API).error(
                "Controller " + req.query.ctrl + " not found")
        }

        /*
         * Get all sensors list
         */

        let data = []

        data.push(new ResponseData("status", ctrl.getStatus()))
        for (const sensor of ctrl.getSensors()) {
            data.push(new ResponseData(sensor.name, sensor.detected))
        }

        return new ServerResponse(logMod.SECURITY_API).ok(data, "Getting security sensors list")
    }

    #status(req) {
        const ctrl = app.getController(ctrlType.SECURITY, req.query.ctrl)
        if (!ctrl) {
            return new ServerResponse(logMod.SECURITY_API).error(
                "Controller " + req.query.ctrl + " not found")
        }

        ctrl.setStatus(!ctrl.getStatus())

        return new ServerResponse(logMod.SECURITY_API).ok({}, "Set security status")
    }
}

export const apiSecurity = new SecurityApi()
