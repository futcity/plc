/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IDB } from "../../db/db"
import { JsonDatabase } from "../../db/jsondb"
import { MongoDatabase } from "../../db/mongodb"
import { ILog, Mod } from "../../log"

export class MainConfigsParser {
    constructor(
        private readonly log: ILog,
        private readonly db: IDB,
        private readonly data: any
    ) { }

    public parseDatabase() {
        if (!this.data.db) {
            throw new Error(`Database settings not found`)
        }

        switch (this.data.db.type) {
            case "jdb":
                this.log.info(Mod.APP, `Loading JDB from file "${this.data.db.jdb.file}"`)
                try {
                    this.db.setDb(new JsonDatabase())
                    this.db.curDB().loadFromFile(this.data.db.jdb.file)
                } catch (err: any) {
                    this.log.error(Mod.APP, `Failed to load JDB`, err)
                    return false
                }
                break

            case "mongo":
                this.log.info(Mod.APP, `Connecting MongoDB to "${this.data.db.mongo.ip}"`)
                try {
                    this.db.setDb(new MongoDatabase())
                    this.db.curDB().connect(this.data.db.mongo.ip, this.data.db.mongo.user, this.data.db.mongo.pass)
                } catch (err: any) {
                    this.log.error(Mod.APP, `Failed to load MongoDB`, err)
                    return false
                }
                break

            default:
                throw new Error(`Unknown database type`)
        }
    }
}