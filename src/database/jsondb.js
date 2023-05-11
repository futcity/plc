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

/*********************************************************************/
/*                         PRIVATE VARIABLES                         */
/*********************************************************************/

var Data = {}
var FileName = ""

/*********************************************************************/
/*                          PUBLIC FUNCTIONS                         */
/*********************************************************************/

export function select(db, table, param, subParam) {
    return Data[db][table][param][subParam]
}

export function update(db, table, param, subParam, value) {
    Data[db][table][param][subParam] = value
}

export function insert(db, table, param, subParam, value) {
    if (!Data[db]) {
        Data[db] = {}
    }

    if (!Data[db][table]) {
        Data[db][table] = {}
    }

    if (!Data[db][table][param]) {
        Data[db][table][param] = {}
    }

    Data[db][table][param][subParam] = value
}

export function loadFromFile(fileName) {
    const rawData = readFileSync(fileName)
    Data = JSON.parse(rawData.toString())
    FileName = fileName
}

export function save() {
    writeFileSync(FileName, JSON.stringify(Data, null, 4))
}

export function connect(ip, user, pass) {
    throw new Error("Method not implemented.")
}