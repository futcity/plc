/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { ILog } from "../../../utils/log";
import { ApiRoutesV1, IApi } from "../api";
import { Express, Request, Response } from "express";

export class IndexApi implements IApi {
    constructor(
        private readonly log: ILog
    ) { }

    public register(exp: Express): void {
        exp.get(ApiRoutesV1.API_ROUTE_INDEX_INFO, (req: Request, resp: Response) => { this.info(req, resp) })
    }

    private info(req: Request, resp: Response) {
        resp.send("<h1>FCPLC</h1>")
    }
}