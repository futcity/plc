/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { JsonDatabase } from "./jsondb.js"
import { MongoDatabase } from "./mongodb.js"

class Database {
    #db

    /**
     * 
     * @param {JsonDatabase | MongoDatabase} newdb 
     */
    setDB(newdb) {
        this.#db = newdb
    }

    /**
     * 
     * @param {string} fileName 
     */
    loadFromFile(fileName) {
        this.#db.loadFromFile(fileName)
    }
    
    /**
     * 
     * @param {string} ip 
     * @param {string} user 
     * @param {string} pass 
     */
    connect(ip, user, pass) {
        this.#db.connect(ip, user, pass)
    }

    /**
     * Save data to file
     */
    save() {
        this.#db.save()
    }

    /**
     * 
     * @param {string} dbname 
     * @param {string} table 
     * @param {string} param 
     * @param {string} subParam 
     * @returns {*}
     */
    select(dbname, table, param, subParam) {
        return this.#db.select(dbname, table, param, subParam)
    }
    
    /**
     * 
     * @param {string} dbname 
     * @param {string} table 
     * @param {string} param 
     * @param {string} subParam 
     * @param {*} value 
     */
    update(dbname, table, param, subParam, value) {
        this.#db.update(dbname, table, param, subParam, value)
    }

    /**
     * 
     * @param {string} dbname 
     * @param {string} table 
     * @param {string} param 
     * @param {string} subParam 
     * @param {*} value 
     */
    insert(dbname, table, param, subParam, value) {
        this.#db.insert(dbname, table, param, subParam, value)
    }
}

export var db = new Database()