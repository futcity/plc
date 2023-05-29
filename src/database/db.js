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

/** @type {JsonDatabase|MongoDatabase} */
var Database = null

/**
 * 
 * @param {JsonDatabase | MongoDatabase} newdb 
 */
export function setDB(newdb) {
    Database = newdb
}

/**
 * 
 * @param {string} fileName 
 */
export function loadFromFileDB(fileName) {
    Database.loadFromFile(fileName)
}

/**
 * 
 * @param {string} ip 
 * @param {string} user 
 * @param {string} pass 
 */
export function connectDB(ip, user, pass) {
    Database.connect(ip, user, pass)
}

/**
 * Save data to file
 */
export function saveDB() {
    Database.save()
}

/**
 * 
 * @param {string} dbname 
 * @param {string} table 
 * @param {string} param 
 * @param {string} subParam 
 * @returns {*}
 */
export function selectDB(dbname, table, param, subParam) {
    return Database.select(dbname, table, param, subParam)
}

/**
 * 
 * @param {string} dbname 
 * @param {string} table 
 * @param {string} param 
 * @param {string} subParam 
 * @param {*} value 
 */
export function updateDB(dbname, table, param, subParam, value) {
    Database.update(dbname, table, param, subParam, value)
}

/**
 * 
 * @param {string} dbname 
 * @param {string} table 
 * @param {string} param 
 * @param {string} subParam 
 * @param {*} value 
 */
export function insertDB(dbname, table, param, subParam, value) {
    Database.insert(dbname, table, param, subParam, value)
}