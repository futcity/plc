/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Dirent } from "fs"
import { readdir, readFile } from "fs"
import { INVALID_VALUE } from "../controllers/meteo/sensors/meteosens"

const ONE_WIRE_PATH = "/sys/bus/w1/devices/"
const ONE_WIRE_CACHE_DELAY = 500

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
    start(): void
}

export class OneWire implements IOneWire {
    private sensors: DS18B20[] = new Array<DS18B20>()
    private keys: string[] = new Array<string>()

    public readKeys(): string[] {
        return this.keys
    }

    public readSensors(): DS18B20[] {
        return this.sensors
    }

    public start() {
        setTimeout(() => { this.readCache() }, ONE_WIRE_CACHE_DELAY)
    }

    private findSensorById(id: string): DS18B20 | undefined {
        for (const sensor of this.sensors) {
            if (sensor.id == id) {
                return sensor
            }
        }
    }

    private readCache() {
        readdir(ONE_WIRE_PATH, { withFileTypes: true }, (err: any, files: Dirent[]) => {
            let keys: string[] = new Array<string>()

            files.forEach((file: Dirent) => {
                const fname: string[] = file.name.split("-")

                if (fname.length > 1) {
                    switch (fname[0]) {
                        case OneWirePrefix.IBUTTON:
                            keys.push(fname[1].toUpperCase())
                            break

                        case OneWirePrefix.DS18B20:
                            const data = readFile(ONE_WIRE_PATH + file.name + "/temperature", (err: any, data: Buffer) => {
                                let sensor = this.findSensorById(fname[1].toUpperCase())
                                if (!sensor) {
                                    sensor = new DS18B20(fname[1].toUpperCase(), INVALID_VALUE)
                                    this.sensors.push(sensor)
                                }
                                sensor.temp = parseInt(data.toString()) / 1000
                            })
                            break
                    }
                }
            }, this)

            this.keys = keys
        })

        setTimeout(() => { this.readCache() }, ONE_WIRE_CACHE_DELAY)
    }
}