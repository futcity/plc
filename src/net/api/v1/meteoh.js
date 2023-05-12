/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as meteo from "../../../controllers/meteo.js"
import * as api from "./api.js"

/*********************************************************************/
/*                        PRIVATE FUNCTIONS                          */
/*********************************************************************/

function info(req, resp) {
    resp.setHeader('Content-Type', 'application/json')
    const ret = { result: false, data: [] }

    const ctrl = meteo.getController(req.query.ctrl)
    if (!ctrl) {
        ret.error = `Controller "${req.query.ctrl}" not found`
        resp.send(ret)
        return
    }

    for (const sensor of meteo.getSensors(ctrl)) {
        ret.data.push({ name: sensor.name, value: sensor.temp })
    }

    ret.result = true
    resp.send(ret)
}

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

export function register(exp) {
    exp.get(api.meteo.INFO, (req, resp) => { info(req, resp) })
}