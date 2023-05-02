/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IOneWire } from "../../../core/onewire"
import { IMeteoSensor, INVALID_VALUE, MeteoSensor, MeteoSensorType } from "./meteosens"

export class Ds18b20Sensor extends MeteoSensor implements IMeteoSensor {
    private temp: number = INVALID_VALUE

    constructor(
        private readonly ow: IOneWire,
        private readonly id: string,
        name: string,
        type: MeteoSensorType
    ) {
        super(name, type)
     }

    public override readData(): boolean {
        for (const sensor of this.ow.readSensors()) {
            if (sensor.id == this.id) {
                if (sensor.temp == INVALID_VALUE) {
                    return false
                }
                else {
                    this.temp = sensor.temp
                }
            }
        }
        return false
    }

    public override getTemp(): number {
        return this.temp
    }
}