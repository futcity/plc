/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export class MongoDatabase {
    #data = {}

    /**
     * 
     * @param {string} fileName 
     */
    loadFromFile(fileName) {
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
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
        throw new Error("Method not implemented.")
    }
}