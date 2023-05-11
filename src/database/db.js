/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as jdb from "./jsondb.js"

/*********************************************************************/
/*                         PRIVATE VARIABLES                         */
/*********************************************************************/

var Type

/*********************************************************************/
/*                         PRIVATE CONSTANT                         */
/*********************************************************************/

export const JDB = "jdb"
export const MONGO = "mongo"

/*********************************************************************/
/*                         PRIVATE FUNCTIONS                         */
/*********************************************************************/

export function setType(type) {
    Type = type
}

export function select(db, table, param, subParam) {
    switch (Type) {
        case JDB:
            jdb.select(db, table, param, subParam)
            break

        default:
            throw new Error("Unknown database type")
    }
}

export function update(db, table, param, subParam, value) {
    switch (Type) {
        case JDB:
            jdb.update(db, table, param, subParam, value)
            break

        default:
            throw new Error("Unknown database type")
    }
}

export function insert(db, table, param, subParam, value) {
    switch (Type) {
        case JDB:
            jdb.insert(db, table, param, subParam, value)
            break

        default:
            throw new Error("Unknown database type")
    }
}

export function loadFromFile(fileName) {
    switch (Type) {
        case JDB:
            jdb.loadFromFile(fileName)
            break

        default:
            throw new Error("Unknown database type")
    }
}

export function save() {
    switch (Type) {
        case JDB:
            jdb.save()
            break

        default:
            throw new Error("Unknown database type")
    }
}

export function connect(ip, user, pass) {
    switch (Type) {
        case JDB:
            jdb.connect(ip, user, pass)
            break

        default:
            throw new Error("Unknown database type")
    }
}