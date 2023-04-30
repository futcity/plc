/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Configs } from "./configs/configs"
import { Database, IDB } from "./db/db"
import { Log } from "./log"

export interface IUtils {
    createLog(): void
    createConfigs(): void
    getLog(): Log
    getConfigs(): Configs
    createDB(): void
    getDB(): IDB
}

export class Utils implements IUtils {
    private log: Log
    private cfg: Configs
    private db: IDB

    public createLog() {
        this.log = new Log()
    }

    public createConfigs() {
        this.cfg = new Configs()
    }

    public createDB() {
        this.db = new Database()
    }

    public getDB(): IDB {
        return this.db
    }

    public getLog(): Log {
        return this.log
    }

    public getConfigs(): Configs {
        return this.cfg
    }
}