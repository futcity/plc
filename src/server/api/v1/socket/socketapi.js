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
import { SocketResponse } from "./socketresp.js"
import { app } from "../../../../app/app.js"
import { api } from "../api.js"

class SocketApi {
    register(app) {
        app.get(api.SOCKET_INFO, (req, res) => { res.json(this.#info(req)) })
        app.get(api.SOCKET_SWITCH, (req, res) => { res.json(this.#switch(req)) })
    }

    #info(req) {
        let ctrl = app.getController(req.query.ctrl)
        if (!ctrl) {
            return new ServerResponse(logMod.SOCKET_API).error(
                "Controller " + req.query.ctrl + " not found")
        }

        /*
         * Get all sockets list
         */

        let sockets = []

        for (let socket of ctrl.getSockets()) {
            sockets.push(new SocketResponse(socket.name, socket.getState()))
        }

        return new ServerResponse(logMod.SOCKET_API).ok(
            sockets, "Getting sockets list")
    }

    #switch(req) {
        let ctrl = app.getController(req.query.ctrl)
        if (!ctrl) {
            return new ServerResponse(logMod.SOCKET_API).error(
                "Controller " + req.query.ctrl + " not found")
        }

        let socket = ctrl.getSocket(req.query.name)
        if (!socket) {
            return new ServerResponse(logMod.SOCKET_API).error(
                "Socket " + req.query.name + " not found")
        }

        if (socket.switchState()) {
            return new ServerResponse(logMod.SOCKET_API).ok({},
                "Socket " + socket.name + " switched to " + socket.getState())
        } else {
            return new ServerResponse(logMod.SOCKET_API).error(
                "Failed to switch socket " + socket.name)
        }
    }
}

export const apiSocket = new SocketApi()
