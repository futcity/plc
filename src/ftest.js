/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { log, logMod } from "./utils/log.js"
import { readFileSync } from "fs"
import { board } from "./core/board/board.js"

class Ftest {
    start() {
        log.info(logMod.FTEST, "Starting FTest ...")

        const cfg = JSON.parse(readFileSync("./fcplc.json").toString())

        for (const pin of cfg.gpio) {
            
        }
    }
}

function main() {
    const ftest = new Ftest()
    ftest.start()
}

main()
