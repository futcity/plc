/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IDatabase } from "./idb"

export class MongoDatabase implements IDatabase {
    public insert(db: string, table: string, param: string, subParam: string, value: any): void {
        throw new Error("Method not implemented.")
    }

    public select(db: string, table: string, param: string, subParam: string) {
        throw new Error("Method not implemented.")
    }

    public update(db: string, table: string, param: string, subParam: string, value: any): void {
        throw new Error("Method not implemented.")
    }

    public loadFromFile(fileName: string) {
        throw new Error("Method not implemented.")
    }

    public save() {
        throw new Error("Method not implemented.")
    }

    public connect(ip: string, user: string, pass: string): void {
        throw new Error("Method not implemented.")
    }
}