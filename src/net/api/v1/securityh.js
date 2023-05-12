/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as security from "../../../controllers/security.js"
import * as api from "./api.js"
import * as log from "../../../utils/log.js"

/*********************************************************************/
/*                        PRIVATE FUNCTIONS                          */
/*********************************************************************/

function info(req, resp) {
    resp.setHeader('Content-Type', 'application/json')
    const ret = { result: false, data: [] }

    const ctrl = security.getController(req.query.ctrl)
    if (!ctrl) {
        ret.error = `Controller "${req.query.ctrl}" not found`
        resp.send(ret)
        return
    }

    for (const sensor of security.getSensors(ctrl)) {
        ret.data.push({ name: sensor.name, value: sensor.detected })
    }

    ret.result = true
    resp.send(ret)
}

function status(req, resp) {
    resp.setHeader('Content-Type', 'application/json')
    const ret = { result: false, data: {} }

    const ctrl = security.getController(req.query.ctrl)
    if (!ctrl) {
        ret.error = `Controller "${req.query.ctrl}" not found`
        resp.send(ret)
        log.error(log.mod.SERVER, ret.error)
        return
    }
    
    try {
        if (req.query.state) {
            security.setStatus(ctrl, req.query.state)
        } else {
            security.setStatus(ctrl, !security.getStatus(ctrl))
        }
    } catch(err) {
        ret.error = `Failed to set security status for controller "${ctrl.name}"`
        resp.send(ret)
        log.error(log.mod.SERVER, ret.error, err.message)
        return
    }

    ret.result = true
    resp.send(ret)
}

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

export function register(exp) {
    exp.get(api.security.INFO, (req, resp) => { info(req, resp) })
    exp.get(api.security.STATUS, (req, resp) => { status(req, resp) })
}