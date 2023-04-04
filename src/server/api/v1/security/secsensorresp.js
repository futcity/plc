/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export class SecuritySensorResponse {
    constructor(name, type, alarm, detected) {
        this.name = name
        this.type = type
        this.alarm = alarm
        this.detected = detected
    }
}
