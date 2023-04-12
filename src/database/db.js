/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { MongoClient } from "mongodb"

class Database {
    #ip = ""
    #user = ""
    #pass = ""

    setCreds(ip, user, pass) {
        this.#ip = ip
        this.#user = user
        this.#pass = pass
    }

    async connect() {
        const mc = new MongoClient("mongodb://" + this.#user + ":" +
            this.#pass + "@" + this.#ip);
        this.client = await mc.connect();
    }

    async insert(db, col, val) {
        if (!this.isConnected()) {
            this.connect()
        }
        return await this.client.db(db).collection(col).insertOne(val)
    }

    async update(db, col, filter, val) {
        if (!this.isConnected()) {
            this.connect()
        }
        return await this.client.db(db).collection(col).updateOne(filter, { $set: val })
    }

    async updateAll(db, col, filter, val) {
        if (!this.isConnected()) {
            this.connect()
        }
        return await this.client.db(db).collection(col).updateMany(filter, { $set: val })
    }

    async delete(db, col, val) {
        if (!this.isConnected()) {
            this.connect()
        }
        return await this.client.db(db).collection(col).deleteMany(val)
    }

    async select(db, col, filter) {
        if (!this.isConnected()) {
            this.connect()
        }
        return await this.client.db(db).collection(col).findOne(filter)
    }

    async selectAll(db, col) {
        if (!this.isConnected()) {
            this.connect()
        }
        return await this.client.db(db).collection(col).find().toArray()
    }

    isConnected() {
        return !!this.client &&
                !!this.client.topology && 
                this.client.topology.isConnected()
    }

    close() {
        this.client.close()
    }
}

export const db = new Database()
