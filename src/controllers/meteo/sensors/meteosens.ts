/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export const INVALID_VALUE = -127

export enum MeteoSensorType {
    DS18B20
}

export interface IMeteoSensor {
    readData(): boolean
    getTemp(): number
    getHumidity(): number
    getPressure(): number
    getType(): MeteoSensorType
    getName(): string
    getError(): boolean
    setError(err: boolean): void
    getTries(): number
    setTries(tries: number): void
}

export class MeteoSensor implements IMeteoSensor {
    private error: boolean
    private tries: number = 0

    constructor(
        private readonly name: string,
        private readonly type: MeteoSensorType,
    ) { }

    public getTries(): number {
        return this.tries
    }

    public setTries(tries: number) {
        this.tries = tries
    }
    
    public readData(): boolean {
        return false
    }

    public getName(): string {
        return this.name
    }

    public getType(): MeteoSensorType {
        return this.type
    }

    public getTemp(): number {
        return INVALID_VALUE
    }

    public getHumidity(): number {
        return INVALID_VALUE
    }

    public getPressure(): number {
        return INVALID_VALUE
    }

    public getError(): boolean {
        return this.error
    }

    public setError(err: boolean) {
        this.error = err
    }
}
