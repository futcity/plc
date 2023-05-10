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

const IBUTTON_PREFIX = "01"
const DS18B20_PREFIX = "28"

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

/**
 * 
 * @param {function} listKeys 
 */
export function readKeys(listKeys) {
    readdir(ONE_WIRE_PATH, { withFileTypes: true }, (err, files) => {
        let keys = []

        if (!err) {
            for (const file of files) {
                const fname = file.name.split("-")
                if (fname.length > 0) {
                    if (fname[0] == IBUTTON_PREFIX) {
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
export function readTemp(id, showTemp) {
    readFile(`${ONE_WIRE_PATH}/${DS18B20_PREFIX}-${id.toLowerCase()}/temperature`, (err, data) => {
        showTemp(parseInt(data.toString()) / 1000, err)
    })
}