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
import * as log from "../utils/log.js"
import * as indexV1 from "./api/v1/indexh.js"

/*********************************************************************/
/*                        PRIVATE VARIABLES                          */
/*********************************************************************/

var Exp = express()
var Port = 8080
var Api

/*********************************************************************/
/*                         PUBLIC CONSTANTS                          */
/*********************************************************************/

export const APIv1 = "v1"

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

export function setAPI(api) {
    Api = api
}

export function setPort(port) {
    Port = port
}

export function start() {
    switch (Api) {
        case APIv1:
            indexV1.register(Exp)
            break

        default:
            throw new Error("Unknown API version detected")
    }

    Exp.listen(Port, () => {
        log.info(log.mod.SERVER, "API server was started at port: " + Port)
    })
}