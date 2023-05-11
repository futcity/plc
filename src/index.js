/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as security from "./controllers/security.js"
import * as socket from "./controllers/socket.js"
import * as meteo from "./controllers/meteo.js"
import * as configs from "./utils/configs.js"
import * as log from "./utils/log.js"
import * as server from "./net/server.js"

function main() {
    try {
        configs.loadConfigs("./data/configs")
    } catch(err) {
        log.error(log.mod.INDEX, "Failed to read configs", err.message)
        process.exit(-1)
    }

    security.start()
    socket.start()
    meteo.start()

    try {
        server.start()
    } catch(err) {
        log.error(log.mod.INDEX, "Failed to start server", err.message)
        process.exit(-1)
    }
}

main()