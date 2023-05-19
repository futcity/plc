/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export class LogMod {
    static INDEX       = "INDEX"
    static SOCKET      = "SOCKET"
    static SECURITY    = "SECURITY"
    static METEO       = "METEO"
    static CONFIGS     = "CONFIGS"
    static SERVER      = "SERVER"
}

class Logger {
    /**
     * 
     * @param {LogMod} mod 
     * @param {string} message 
     */
    info(mod, message) {
        console.log("INFO", mod, message)
    }

    /**
     * 
     * @param {LogMod} mod 
     * @param {string} message 
     * @param {string} err 
     */
    error(mod, message, err="") {
        console.log("ERROR", mod, message, err)
    }
}

export var log = new Logger()