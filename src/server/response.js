/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { log, logMod } from "../utils/log.js"

export class ServerResponse {
    #mod = logMod.INDEX

    constructor(mod) {
        this.#mod = mod
    }

    error(msg) {
        log.error(this.#mod, msg)
        return { result: false, error: msg }
    }

    ok(dat, msg) {
        log.info(this.#mod, msg)
        return { result: true, data: dat }
    }
}
