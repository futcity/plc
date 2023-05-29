/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { startControllers } from "./controllers/controllers.js"
import { loadConfigs } from "./utils/configs.js"
import { log, LogMod, LogType } from "./utils/log.js"
import { startServer } from "./net/server.js"

function main() {
    try {
        loadConfigs("./data/configs")
    } catch(err) {
        log(LogType.ERROR, LogMod.INDEX, "Failed to read configs", err.message)
        process.exit(-1)
    }

    try {
        startServer()
    } catch(err) {
        log(LogType.ERROR, LogMod.INDEX, "Failed to start server", err.message)
        process.exit(-1)
    }

    startControllers()
}

main()