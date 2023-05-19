/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { readFileSync, writeFileSync } from "fs"

export class JsonDatabase {
    #data = {}
    #file = ""

    /**
     * 
     * @param {string} fileName 
     */
    loadFromFile(fileName) {
        const rawData = readFileSync(fileName)
        this.#data = JSON.parse(rawData.toString())
        this.#file = fileName
    }
    
    /**
     * 
     * @param {string} ip 
     * @param {string} user 
     * @param {string} pass 
     */
    connect(ip, user, pass) {
        throw new Error("Method not implemented.")
    }

    /**
     * Save data to file
     */
    save() {
        writeFileSync(this.#file, JSON.stringify(this.#data, null, 4))
    }

    /**
     * 
     * @param {string} db 
     * @param {string} table 
     * @param {string} param 
     * @param {string} subParam 
     * @returns {*}
     */
    select(db, table, param, subParam) {
        return this.#data[db][table][param][subParam]
    }
    
    /**
     * 
     * @param {string} db 
     * @param {string} table 
     * @param {string} param 
     * @param {string} subParam 
     * @param {*} value 
     */
    update(db, table, param, subParam, value) {
        this.#data[db][table][param][subParam] = value
    }
    
    /**
     * 
     * @param {string} db 
     * @param {string} table 
     * @param {string} param 
     * @param {string} subParam 
     * @param {*} value 
     */
    insert(db, table, param, subParam, value) {
        if (!this.#data[db]) {
            this.#data[db] = {}
        }
    
        if (!this.#data[db][table]) {
            this.#data[db][table] = {}
        }
    
        if (!this.#data[db][table][param]) {
            this.#data[db][table][param] = {}
        }
    
        this.#data[db][table][param][subParam] = value
    }
}