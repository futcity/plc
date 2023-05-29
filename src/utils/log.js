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

export class LogType {
    static ERROR = "ERROR"
    static INFO = "INFO"
}

/**
 * 
 * @param {LogType} type 
 * @param {LogMod} module 
 * @param {string} msg 
 * @param {string} err 
 */
export function log(type, module, msg, err="") {
    console.log(type, module, msg, err)
}