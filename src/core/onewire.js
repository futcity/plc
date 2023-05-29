/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readdir, readFile } from "fs"

/*********************************************************************/
/*                         PRIVATE CONSTANTS                         */
/*********************************************************************/

const ONE_WIRE_PATH = "/sys/bus/w1/devices"
const TEMP_IVALID_VAL = -127

class Prefix {
    static IBUTTON  = "01"
    static DS18B20  = "28"
}

/**
 * 
 * @param {function} listKeys 
 */
export function readWireKeys(listKeys) {
    readdir(ONE_WIRE_PATH, { withFileTypes: true }, (err, files) => {
        let keys = []

        if (!err) {
            for (const file of files) {
                const fname = file.name.split("-")
                if (fname.length > 0) {
                    if (fname[0] == Prefix.IBUTTON) {
                        keys.push(fname[1].toUpperCase())
                    }
                }
            }
        }
        
        listKeys(keys, err)
    })
}

/**
 * 
 * @param {string} id 
 * @param {function} showTemp 
 */
export function readWireTemp(id, showTemp) {
    readFile(`${ONE_WIRE_PATH}/${Prefix.DS18B20}-${id.toLowerCase()}/temperature`, (err, data) => {
        const temp = TEMP_IVALID_VAL
        
        if (data) {
            temp = parseInt(data.toString()) / 1000
        }

        showTemp(temp, err)
    })
}