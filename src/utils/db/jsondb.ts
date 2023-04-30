/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readFileSync, writeFile, writeFileSync } from "fs"
import { IDatabase } from "./idb"

export class JsonDatabase implements IDatabase {
    private data: any = { }
    private fileName: string = ""

    public select(db: string, table: string, param: string, subParam: string): any {
        return this.data[db][table][param][subParam]
    }

    public update(db: string, table: string, param: string, subParam: string, value: any): void {
        this.data[db][table][param][subParam] = value
    }

    public insert(db: string, table: string, param: string, subParam: string, value: any): void {
        if (!this.data[db]) {
            this.data[db] = {}
        }

        if (!this.data[db][table]) {
            this.data[db][table] = {}
        }

        if (!this.data[db][table][param]) {
            this.data[db][table][param] = {}
        }

        this.data[db][table][param][subParam] = value
    }

    public loadFromFile(fileName: string) {
        const rawData = readFileSync(fileName)
        this.data = JSON.parse(rawData.toString())
        this.fileName = fileName
    }

    public save() {
        writeFileSync(this.fileName, JSON.stringify(this.data, null, 4))
    }

    public connect(ip: string, user: string, pass: string): void {
        throw new Error("Method not implemented.")
    }
}