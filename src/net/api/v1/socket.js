/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { SocketController } from "../../../controllers/socket/socketctrl.js"
import { SocketApi } from "./api.js"
import { log, LogMod, LogType } from "../../../utils/log.js"
import { getController } from "../../../controllers/controllers.js"

export class SocketHandlerV1 {
    register(exp) {
        exp.get(SocketApi.INFO, (req, resp) => { this.#info(req, resp) })
        exp.get(SocketApi.STATUS, (req, resp) => { this.#status(req, resp) })
    }

    #info(req, resp) {
        resp.setHeader('Content-Type', 'application/json')
        const ret = { result: false, error: "", data: [] }
    
        /** @type {SocketController} */
        const ctrl = getController(req.query.ctrl)
        if (!ctrl) {
            ret.error = `Controller "${req.query.ctrl}" not found`
            resp.send(ret)
            log(LogType.ERROR, LogMod.SERVER, ret.error)
            return
        }
    
        ctrl.getSockets().forEach((socket) => {
            ret.data.push({ name: socket.name, value: socket.status })
        })
    
        ret.result = true
        resp.send(ret)
    }
    
    #status(req, resp) {
        resp.setHeader('Content-Type', 'application/json')
        const ret = { result: false, error: "", data: {} }
    
        /** @type {SocketController} */
        const ctrl = getController(req.query.ctrl)
        if (!ctrl) {
            ret.error = `Controller "${req.query.ctrl}" not found`
            resp.send(ret)
            log(LogType.ERROR, LogMod.SERVER, ret.error, ret.error)
            return
        }
    
        try {
            ctrl.setStatus(req.query.socket, !ctrl.getStatus(req.query.socket), true)
        } catch(err) {
            ret.error = `Failed to set status for socket "${req.query.socket}" controller "${ctrl.name}"`
            resp.send(ret)
            log(LogType.ERROR, LogMod.SERVER, ret.error, err.message)
            return
        }
    
        ret.result = true
        resp.send(ret)
    }
}