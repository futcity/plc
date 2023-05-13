/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as configs from "./utils/configs.js"
import * as log from "./utils/log.js"

const FTEST_LOOP_DELAY = 1000

function ftest() {
    
}

function main() {
    try {
        configs.loadMinConfigs("./data/configs")
    } catch(err) {
        log.error(log.mod.INDEX, "Failed to read configs", err.message)
        process.exit(-1)
    }

    setInterval(() => { ftest() }, FTEST_LOOP_DELAY)
}

main()