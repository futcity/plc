/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { onewire } from "../../core/onewire.js"
import { LogMod, log } from "../../utils/log.js"
import { MeteoSensor } from "./msensor.js"

const READ_ERRORS_MAX   = 3

export class DS18B20 extends MeteoSensor {
    constructor(name, id) {
        this.id = id
        super(name)
    }

    readData() {
        onewire.readTemp(this.id, (temp, err) => {
            if (err) {
                if (this.errors == READ_ERRORS_MAX) {
                    log.error(LogMod.METEO, `Failed to read meteo sensor "${this.name}"`)
                } else {
                    this.errors++
                }
            } else {
                if (this.errors == READ_ERRORS_MAX) {
                    log.info(LogMod.METEO, `Meteo sensor "${this.name}" is online`)
                }
                this.errors = 0
                this.temperature = temp
            }
        })
    }
}