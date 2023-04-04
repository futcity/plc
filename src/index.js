/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { cfg } from "./utils/configs/configs.js"
import { log, logMod } from "./utils/log.js"
import { app } from "./app/app.js"

function main() {
    log.setPath("./")

    if (!cfg.load("./configs/fcplc.json")) {
        log.error(logMod.INDEX, "Failed to load configs")
        return
    }

    log.info(logMod.INDEX, "Configs loading complete")

    if (!app.start()) {
        log.error(logMod.INDEX, "Failed to start application")
        return
    }
}

main()
