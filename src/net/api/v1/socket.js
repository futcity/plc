/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as socket from "../../../controllers/socket.js"
import * as api from "./api.js"
import * as log from "../../../utils/log.js"

/*********************************************************************/
/*                        PRIVATE FUNCTIONS                          */
/*********************************************************************/

function info(req, resp) {
    resp.setHeader('Content-Type', 'application/json')
    const ret = { result: false, data: [] }

    const ctrl = socket.getController(req.query.ctrl)
    if (!ctrl) {
        ret.error = `Controller "${req.query.ctrl}" not found`
        resp.send(ret)
        return
    }

    for (const sock of socket.getSockets(ctrl)) {
        ret.data.push({ name: sock.name, value: sock.status })
    }

    ret.result = true
    resp.send(ret)
}

function status(req, resp) {
    resp.setHeader('Content-Type', 'application/json')
    const ret = { result: false, data: {} }

    const ctrl = socket.getController(req.query.ctrl)
    if (!ctrl) {
        ret.error = `Controller "${req.query.ctrl}" not found`
        resp.send(ret)
        log.error(log.mod.SERVER, ret.error)
        return
    }
    
    const sock = socket.getSocket(ctrl, req.query.socket)
    if (!sock) {
        ret.error = `Socket "${req.query.socket}" not found`
        resp.send(ret)
        log.error(log.mod.SERVER, ret.error)
        return
    }

    try {
        socket.setStatus(ctrl, sock, !socket.status)
    } catch(err) {
        ret.error = `Failed to set status for socket "${sock.name}" controller "${ctrl.name}"`
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
    exp.get(api.socket.INFO, (req, resp) => { info(req, resp) })
    exp.get(api.socket.STATUS, (req, resp) => { status(req, resp) })
}