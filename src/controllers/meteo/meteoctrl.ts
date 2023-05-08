/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { ILog, Mod } from "../../utils/log";
import { Controller, CtrlType, IController } from "../controller";
import { IMeteoSensor, INVALID_VALUE, MeteoSensorType } from "./sensors/meteosens";

const READ_SENSORS_DELAY = 1000
const SENSOR_TRIES_MAX = 3

export interface IMeteoController extends IController {
    addSensor(sensor: IMeteoSensor): void
    getSensor(name: string): IMeteoSensor | undefined
    getSensors(): IMeteoSensor[]
}

export class MeteoController extends Controller implements IMeteoController {
    private sensors: IMeteoSensor[] = new Array<IMeteoSensor>();

    constructor(
        private readonly log: ILog,
        type: CtrlType,
        name: string
    ) {
        super(type, name)
    }

    public addSensor(sensor: IMeteoSensor): void {
        this.sensors.push(sensor)
    }

    public getSensor(name: string): IMeteoSensor | undefined {
        for (const socket of this.sensors) {
            if (socket.getName() == name) {
                return socket
            }
        }
    }

    public getSensors() : IMeteoSensor[] {
        return this.sensors
    }

    public override start(): boolean {
        setTimeout(() => { this.readSensors() }, READ_SENSORS_DELAY)
        return true
    }
    
    private readSensors() {
        for (const sensor of this.sensors) {
            const ret = sensor.readData()

            if (!sensor.getError()) {
                if (!ret) {
                    sensor.setTries(sensor.getTries() + 1)
                }

                if (sensor.getTries() == SENSOR_TRIES_MAX) {
                    this.log.error(Mod.METEOCTRL, `Failed to read meteo sensor "${sensor.getName()}"`)
                    sensor.setError(true)
                }
            } else {
                if (ret) {
                    sensor.setError(false)
                    sensor.setTries(0)
                    this.log.info(Mod.METEOCTRL, `Meteo sensor "${sensor.getName()}" is online `)
                }
            }
        }

        setTimeout(() => { this.readSensors() }, READ_SENSORS_DELAY)
    }
}
