/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Controller } from "./controller.js"

/** @type {Array<Controller>} */
var Controllers = []

/**
 * 
 * @param {Controller} ctrl 
 */
export function addController(ctrl) {
    Controllers.push(ctrl)
}

/**
 * 
 * @param {string} name 
 * @returns {Controller}
 */
export function getController(name) {
    for (const ctrl of Controllers) {
        if (ctrl.name == name) {
            return ctrl
        }
    }
}

export function startControllers() {
    for (const ctrl of Controllers) {
        ctrl.start()
    }
}