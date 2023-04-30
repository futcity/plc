/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readFileSync } from "fs"

export interface IConfigs {
    loadFromFile(fileName: string): any
}

export class Configs implements IConfigs {
    public loadFromFile(fileName: string): any {
        const rawData = readFileSync(fileName)
        return JSON.parse(rawData.toString())
    }
}