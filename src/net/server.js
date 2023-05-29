/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import express from "express"
import { log, LogMod, LogType } from "../utils/log.js"

var Exp = express()
var Port = 8080
var Handlers = []

/**
 * 
 * @param {number} port 
 */
export function setServerPort(port) {
    Port = port
}

export function addServerHandler(handler) {
    Handlers.push(handler)
}

export function startServer() {
    for (const handler of Handlers) {
        handler.register(Exp)
    }

    Exp.listen(Port, () => {
        log(LogType.INFO, LogMod.SERVER, "API server was started at port: " + Port)
    })
}