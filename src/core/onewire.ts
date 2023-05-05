/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Dirent, readdir, readFile } from "fs"
import { INVALID_VALUE } from "../controllers/meteo/sensors/meteosens"

const ONE_WIRE_PATH = "/sys/bus/w1/devices/"
const ONE_WIRE_TEMP_DELAY = 5000
const ONE_WIRE_KEY_DELAY = 1000

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
    readKey(): string
    readSensors(): DS18B20[]
    start(): void
    clearKey(): void
}

export class OneWire implements IOneWire {
    private sensors: DS18B20[] = new Array<DS18B20>()
    private key: string

    public readKey(): string {
        return this.key
    }

    public clearKey() {
	this.key = ""
    }

    public readSensors(): DS18B20[] {
        return this.sensors
    }

    public start() {
        setInterval(() => { this.readTempCache() }, ONE_WIRE_TEMP_DELAY)
        setInterval(() => { this.readButtonCache() }, ONE_WIRE_KEY_DELAY)
    }

    private findSensorById(id: string): DS18B20 | undefined {
        for (const sensor of this.sensors) {
            if (sensor.id == id) {
                return sensor
            }
        }
    }

    private readCache(processCache: (prefix: OneWirePrefix, id: string) => any) {
        readdir(ONE_WIRE_PATH, { withFileTypes: true }, async (err: any, files: Dirent[]) => {
            for (const file of files) {
                const fname = file.name.split("-")
                if (fname.length > 1) {
                    processCache(<OneWirePrefix>fname[0], fname[1])
                }
            }
        })
    }

    private readTempCache() {
        this.readCache((prefix: OneWirePrefix, id: string) => {
            if (prefix == OneWirePrefix.DS18B20) {
                readFile(`${ONE_WIRE_PATH}${prefix}-${id}/temperature`, (err: any, data: Buffer) => {
                    let sensor = this.findSensorById(id.toUpperCase())
                    if (!sensor) {
                        sensor = new DS18B20(id.toUpperCase(), INVALID_VALUE)
                        this.sensors.push(sensor)
                    }
                    sensor.temp = parseInt(data.toString()) / 1000
                })
            }
        })
    }

    private readButtonCache() {
        this.key = ""
        this.readCache((prefix: OneWirePrefix, id: string) => {
            if (prefix == OneWirePrefix.IBUTTON) {
                this.key = id.toUpperCase()
            }
        })
    }
}
