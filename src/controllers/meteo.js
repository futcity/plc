/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as onewire from "../core/onewire.js"

export const DS18B20_SENSOR = 0

const READ_SENSORS_DELAY    = 5000
const READ_ERRORS_MAX       = 3

var Sensors = []

export function readSensors() {
    for (const sensor of Sensors) {
        if (sensor.type == DS18B20_SENSOR) {
            onewire.readTemp(sensor.id, (temp, err) => {
                if (err) {
                    if (sensor.errors == READ_ERRORS_MAX) {
                        log.error(log.mod.METEO, `Failed to read meteo sensor "${sensor.name}"`)
                    } else {
                        sensor.errors++
                    }
                } else {
                    if (sensor.errors == READ_ERRORS_MAX) {
                        log.info(log.mod.METEO, `Meteo sensor "${sensor.name}" is online`)
                    }
                    sensor.errors = 0
                    sensor.temp = temp
                }
            })
        }
    }

    setTimeout(() => { readSensors() }, READ_SENSORS_DELAY)
}

export function addSensor(name, type, id) {
    if ((type != DS18B20_SENSOR)) {
        throw new Error(`Unknown sensor "${name}" type "${type}"`)
    }

    Sensors.push({
        name: name,
        type: type,
        id: id,
        temp: 0,
        errors: 0
    })
}

export function start() {
    setTimeout(() => { readSensors() }, READ_SENSORS_DELAY)
}

export function getSensors() {
    return Sensors
}