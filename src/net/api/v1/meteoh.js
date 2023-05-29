/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { MeteoApi } from "./api.js"
import { getController } from "../../../controllers/controllers.js"
import { MeteoController } from "../../../controllers/meteo/meteoctrl.js"

export class MeteoHandlerV1 {
    /**
     * 
     * @param {Express} exp 
     */
    register(exp) {
        exp.get(MeteoApi.INFO, (req, resp) => { this.#info(req, resp) })
    }

    #info(req, resp) {
        resp.setHeader('Content-Type', 'application/json')
        const ret = { result: false, error: "", data: [] }

        /** @type {MeteoController} */
        const ctrl = getController(req.query.ctrl)
        if (!ctrl) {
            ret.error = `Controller "${req.query.ctrl}" not found`
            resp.send(ret)
            return
        }

        for (const sensor of ctrl.getSensors(ctrl)) {
            ret.data.push({ name: sensor.name, value: sensor.temp })
        }

        ret.result = true
        resp.send(ret)
    }
}