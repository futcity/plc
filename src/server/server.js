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
import { log, logMod } from "../utils/log.js"
import { apiSocket } from "./api/v1/socket/socketapi.js"
import { apiSecurity } from "./api/v1/security/securityapi.js"

class ApiServer {
    #port = 80
    #app = express()

    setPort(port) {
        this.#port = port
    }

    start() {
        apiSocket.register(this.#app)
        apiSecurity.register(this.#app)

        this.#app.listen(this.#port, () => {
            log.info(logMod.SERVER, "API server was started at port: " + this.#port)
        })
    }
}

export const server = new ApiServer()
