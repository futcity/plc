/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { loadMinConfigs } from "./utils/configs.js"
import { log, LogType, LogMod } from "./utils/log.js"
import { gpio } from "./core/gpio.js"

const FTEST_LOOP_DELAY = 1000

function ftest() {
    for (const pin of getGpios()) {
        
    }
}

function main() {
    try {
        loadMinConfigs("./data/configs")
    } catch(err) {
        log(LogType.ERROR, LogMod.INDEX, "Failed to read configs", err.message)
        process.exit(-1)
    }

    setInterval(() => { ftest() }, FTEST_LOOP_DELAY)
}

main()