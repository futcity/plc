/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readdirSync, readFileSync } from "fs"

const ONE_WIRE_PATH = "/sys/bus/w1/devices/"

enum OneWirePrefix {
    IBUTTON = "01",
    DS18B20 = "28"
}

export class DS18B20 {
    constructor(
        public id: string,
        public temp: number
    ) { }
}

export interface IOneWire {
    readKeys(): string[]
    readSensors(): DS18B20[]
}

export class OneWire implements IOneWire {
    public readKeys(): string[] {
        let keys: string[] = new Array<string>()

        readdirSync(ONE_WIRE_PATH).forEach(file => {
            let fname = file.split("-")
            if (fname.length > 1) {
                if (fname[0] == OneWirePrefix.IBUTTON) {
                    keys.push(fname[1])
                }
            }
        }, this);

        return keys
    }

    public readSensors(): DS18B20[] {
        let sensors: DS18B20[] = new Array<DS18B20>()

        readdirSync(ONE_WIRE_PATH).forEach(file => {
            let fname = file.split("-")
            if (fname.length > 1) {
                if (fname[0] == OneWirePrefix.DS18B20) {
                    const data = readFileSync(ONE_WIRE_PATH + file + "/temperature")
                    const temp = parseInt(data.toString()) / 1000
                    sensors.push(new DS18B20(fname[1], temp))
                }
            }
        }, this);

        return sensors
    }
}