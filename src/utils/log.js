/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

/*********************************************************************/
/*                          PUBLIC CONSTANTS                         */
/*********************************************************************/

export const mod = {
    INDEX:      "INDEX",
    SOCKET:     "SOCKET",
    SECURITY:   "SECURITY",
    METEO:      "METEO"
}

export function info(mod, message) {
    console.log("INFO", mod, message)
}

export function error(mod, message, err="") {
    console.log("ERROR", mod, message, err)
}