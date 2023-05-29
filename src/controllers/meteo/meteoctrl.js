/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { MeteoSensor } from "./sensors/msensor.js"
import { Controller } from "../controller.js"

const READ_SENSORS_DELAY    = 5000

export class MeteoController extends Controller {
    /** @type {Array<MeteoSensor>} */
    #sensors = []

    constructor(name) {
        super(name)
    }

    /**
     * 
     * @param {MeteoSensor} sensor 
     */
    addSensor(sensor) {
        this.#sensors.push(sensor)
    }

    /**
     * 
     * @returns {Array<MeteoSensor>}
     */
    getSensors() {
        return this.#sensors
    }

    start() {
        setInterval(() => { this.#readSensors() }, READ_SENSORS_DELAY)
    }

    #readSensors() {
        for (const sensor of this.#sensors) {
            sensor.readData()
        }
    }
}