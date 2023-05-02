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
import { IMeteoController } from "../../../../controllers/meteo/meteoctrl";

export class MeteoApiV1 implements IApi {
    constructor(
        private readonly log: ILog,
        private readonly ctrls: IControllers
    ) { }

    public register(exp: Express): void {
        exp.get(ApiRoutesV1.API_ROUTE_METEO_INFO, (req: Request, resp: Response) => { this.info(req, resp) })
    }

    private info(req: Request, resp: Response) {
        const res = new ServerResponse(false, "", [])

        const ctrl = <IMeteoController>this.ctrls.getController(<string>req.query.ctrl)
        if (!ctrl) {
            res.error = `Controller "${<string>req.query.ctrl}" not found`
            this.log.error(Mod.METEOH, res.error)
            resp.send(res)
            return
        }

        for (const sensor of ctrl.getSensors()) {
            if (!sensor.getError()) {
                res.data.push(new ResponseParam(sensor.getName(), sensor.getTemp()))
            } else {
                res.data.push(new ResponseParam(sensor.getName(), "error"))
            }
        }

        resp.setHeader('Content-Type', 'application/json')
        res.result = true
        resp.send(res)
    }
}
