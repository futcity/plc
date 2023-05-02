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
import { ISecurityController } from "../../../../controllers/security/securityctrl";

export class SecurityApiV1 implements IApi {
    constructor(
        private readonly log: ILog,
        private readonly ctrls: IControllers
    ) { }

    public register(exp: Express): void {
        exp.get(ApiRoutesV1.API_ROUTE_SECURITY_INFO, (req: Request, resp: Response) => { this.info(req, resp) })
        exp.get(ApiRoutesV1.API_ROUTE_SECURITY_STATUS, (req: Request, resp: Response) => { this.status(req, resp) })
    }

    private info(req: Request, resp: Response) {
        const res = new ServerResponse(false, "", [])

        const ctrl = <ISecurityController>this.ctrls.getController(<string>req.query.ctrl)
        if (!ctrl) {
            res.error = `Controller "${<string>req.query.ctrl}" not found`
            this.log.error(Mod.SECURITYH, res.error)
            resp.send(res)
            return
        }

        res.data.push(new ResponseParam("status", ctrl.getStatus()))
        res.data.push(new ResponseParam("alarm", ctrl.getAlarm()))

        for (const sensor of ctrl.getSensors()) {
            res.data.push(new ResponseParam(sensor.getName(), sensor.getDetected()))
        }

        resp.setHeader('Content-Type', 'application/json')
        res.result = true
        resp.send(res)
    }

    private status(req: Request, resp: Response) {
        const res = new ServerResponse(false, "", [])

        const ctrl = <ISecurityController>this.ctrls.getController(<string>req.query.ctrl)
        if (!ctrl) {
            res.error = `Controller "${<string>req.query.ctrl}" not found`
            this.log.error(Mod.SECURITYH, res.error)
            resp.send(res)
            return
        }

        try {
            ctrl.setStatus(!ctrl.getStatus(), true)
        } catch(err: any) {
            res.error = `Failed to switch security status`
            this.log.error(Mod.SECURITYH, res.error, err.message)
            resp.send(res)
            return
        }

        resp.setHeader('Content-Type', 'application/json')
        res.result = true
        resp.send(res)
    }
}
