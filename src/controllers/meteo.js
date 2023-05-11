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
import * as log from "../utils/log.js"

/*********************************************************************/
/*                        PRIVATE CONSTANTS                          */
/*********************************************************************/

const READ_SENSORS_DELAY    = 5000
const READ_ERRORS_MAX       = 3

/*********************************************************************/
/*                        PRIVATE VARIABLES                          */
/*********************************************************************/

var Controllers = new Map()

/*********************************************************************/
/*                        PRIVATE FUNCTIONS                          */
/*********************************************************************/

function readSensors() {
    Controllers.forEach((ctrl) => {
        for (const sensor of ctrl.sensors) {
            if (sensor.type == DS18B20_SENSOR) {
                onewire.readTemp(sensor.id, (temp, err) => {
                    if (err) {
                        if (sensor.errors == READ_ERRORS_MAX) {
                            log.error(log.mod.METEO, `Failed to read meteo sensor "${sensor.name}" ctrl "${ctrl.name}"`)
                        } else {
                            sensor.errors++
                        }
                    } else {
                        if (sensor.errors == READ_ERRORS_MAX) {
                            log.info(log.mod.METEO, `Meteo sensor "${sensor.name}" ctrl "${ctrl.name}" is online`)
                        }
                        sensor.errors = 0
                        sensor.temp = temp
                    }
                })
            }
        }
    })
}

/*********************************************************************/
/*                         PUBLIC CONSTANTS                          */
/*********************************************************************/

export const DS18B20_SENSOR = 0

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

/**
 * 
 * @param {string} name 
 */
export function addController(name) {
    const ctrl = {
        name: name,
        sensors: []
    }

    Controllers.set(name, ctrl)

    return ctrl
}

/**
 * 
 * @param {string} name 
 * @returns Meteo Controller
 */
export function getController(name) {
    return Controllers.get(name)
}

export function addSensor(ctrl, name, type, id) {
    if ((type != DS18B20_SENSOR)) {
        throw new Error(`Unknown sensor "${name}" type "${type}" for controller "${ctrl.name}"`)
    }

    ctrl.sensors.push({
        name: name,
        type: type,
        id: id,
        temp: 0,
        errors: 0
    })
}

export function start() {
    if (Controllers.size > 0) {
        setInterval(() => { readSensors() }, READ_SENSORS_DELAY)
    }
}

export function getSensors(ctrl) {
    return ctrl.sensors
}