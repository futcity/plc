/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { SecurityController } from "../../../controllers/security/security.js"
import { SecurityApi } from "./api.js"
import { log, LogMod, LogType } from "../../../utils/log.js"
import { getController } from "../../../controllers/controllers.js"

export class SecurityHandlerV1 {
    register(exp) {
        exp.get(SecurityApi.INFO, (req, resp) => { this.#info(req, resp) })
        exp.get(SecurityApi.STATUS, (req, resp) => { this.#status(req, resp) })
    }

    #info(req, resp) {
        resp.setHeader('Content-Type', 'application/json')
        const ret = { result: false, error: "", data: [] }
    
        /** @type {SecurityController} */
        const ctrl = getController(req.query.ctrl)
        if (!ctrl) {
            ret.error = `Controller "${req.query.ctrl}" not found`
            resp.send(ret)
            return
        }
    
        for (const sensor of ctrl.getSensors(ctrl)) {
            ret.data.push({ name: sensor.name, value: sensor.detected })
        }
    
        ret.result = true
        resp.send(ret)
    }

    #status(req, resp) {
        resp.setHeader('Content-Type', 'application/json')
        const ret = { result: false, error: "", data: {} }

        /** @type {SecurityController} */
        const ctrl = getController(req.query.ctrl)
        if (!ctrl) {
            ret.error = `Controller "${req.query.ctrl}" not found`
            resp.send(ret)
            return
        }
        
        try {
            if (req.query.state) {
                ctrl.setStatus(req.query.state, true)
            } else {
                ctrl.setStatus(!ctrl.getStatus(ctrl), true)
            }
        } catch(err) {
            ret.error = `Failed to set security status for controller "${ctrl.name}"`
            resp.send(ret)
            log(LogType.ERROR, LogMod.SERVER, ret.error, err.message)
            return
        }

        ret.result = true
        resp.send(ret)
    }
}