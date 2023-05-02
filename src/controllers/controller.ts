/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export enum CtrlType {
    SOCKET      = "socket",
    SECURITY    = "security",
    METEO       = "meteo"
}

export interface IController {
    start(): boolean
    getType(): CtrlType
    getName(): string
}

export class Controller implements IController {
    constructor(
        private type: CtrlType,
        private name: string
    ) { }

    public start(): boolean {
        return true
    }

    public getType(): CtrlType {
        return this.type
    }

    public getName(): string {
        return this.name
    }
}
