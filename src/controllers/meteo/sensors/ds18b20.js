/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readWireTemp } from "../../../core/onewire.js"
import { LogMod, LogType, log } from "../../../utils/log.js"
import { MeteoSensor } from "./msensor.js"

const READ_ERRORS_MAX   = 3

export class DS18B20 extends MeteoSensor {
    /**
     * 
     * @param {string} name 
     * @param {number} id 
     */
    constructor(name, id) {
        super(name)
        this.id = id
    }

    readData() {
        readWireTemp(this.id, (temp, err) => {
            if (err) {
                if (this.errors == READ_ERRORS_MAX) {
                    log(LogType.ERROR, LogMod.METEO, `Failed to read meteo sensor "${this.name}"`)
                } else {
                    this.errors++
                }
            } else {
                if (this.errors == READ_ERRORS_MAX) {
                    log(LogType.INFO, LogMod.METEO, `Meteo sensor "${this.name}" is online`)
                }
                this.errors = 0
                this.temperature = temp
            }
        })
    }
}