/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IControllers } from "../../../../controllers/controllers";
import { ILog, Mod } from "../../../../utils/log";
import { ApiRoutesV1, IApi } from "../../api";
import { Express, Request, Response } from "express";
import { ResponseParam, ServerResponse } from "../../../response";
import { ISocketController } from "../../../../controllers/socket/socketctrl";

export class SocketApiV1 implements IApi {
    constructor(
        private readonly log: ILog,
        private readonly ctrls: IControllers
    ) { }

    public register(exp: Express): void {
        exp.get(ApiRoutesV1.API_ROUTE_SOCKET_INFO, (req: Request, resp: Response) => { this.info(req, resp) })
        exp.get(ApiRoutesV1.API_ROUTE_SOCKET_SWITCH, (req: Request, resp: Response) => { this.swtch(req, resp) })
    }

    private info(req: Request, resp: Response) {
        const res = new ServerResponse(false, "", [])

        const ctrl = <ISocketController>this.ctrls.getController(<string>req.query.ctrl)
        if (!ctrl) {
            res.error = `Controller "${<string>req.query.ctrl}" not found`
            this.log.error(Mod.SOCKETH, res.error)
            resp.send(res)
            return
        }

        for (const socket of ctrl.getSockets()) {
            res.data.push(new ResponseParam(socket.getName(), socket.getState()))
        }

        resp.setHeader('Content-Type', 'application/json')
        res.result = true
        resp.send(res)
    }

    private swtch(req: Request, resp: Response) {
        const res = new ServerResponse(false, "", [])

        const ctrl = <ISocketController>this.ctrls.getController(<string>req.query.ctrl)
        if (!ctrl) {
            res.error = `Controller "${<string>req.query.ctrl}" not found`
            this.log.error(Mod.SOCKETH, res.error)
            resp.send(res)
            return
        }

        const socket = ctrl.getSocket(<string>req.query.name)
        if (!socket) {
            res.error = `Socket "${<string>req.query.name}" not found`
            this.log.error(Mod.SOCKETH, res.error)
            resp.send(res)
            return
        }

        if (!socket?.switchState()) {
            res.error = `Failed to switch socket "${<string>req.query.name}" state`
            this.log.error(Mod.SOCKETH, res.error)
            resp.send(res)
            return
        }

        resp.setHeader('Content-Type', 'application/json')
        res.result = true
        resp.send(res)
    }
}
