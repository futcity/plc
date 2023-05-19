/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export class MeteoSensor {
    constructor(name) {
        this.name = name
        this.temperature = 0
        this.humidity = 0
        this.pressure = 0
        this.errors = 0
    }

    readData() { }
}