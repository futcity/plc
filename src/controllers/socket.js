/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import * as gpio from "../core/gpio.js"
import * as log from "../utils/log.js"
import * as db from "../database/db.js"

/*********************************************************************/
/*                         PRIVATE CONSTANTS                         */
/*********************************************************************/

const READ_BUTTONS_DELAY            = 200
const READ_PRESSED_BUTTONS_DELAY    = 1000

/*********************************************************************/
/*                         PRIVATE VARIABLES                         */
/*********************************************************************/

var Controllers = new Map()

/*********************************************************************/
/*                         PRIVATE FUNCTIONS                         */
/*********************************************************************/

function readButton(socket) {
    const pin = gpio.getPin(socket.button)

    if (pin) {
        if (gpio.readPin(pin) == gpio.HIGH) {
            return true
        }
    }

    return false
}

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                         */
/*********************************************************************/

/**
 * 
 * @param {string} name 
 */
export function addController(name) {
    const ctrl = {
        name: name,
        sockets: []
    }

    Controllers.set(name, ctrl)

    return ctrl
}

/**
 * 
 * @param {string} name 
 * @returns Socket Controller
 */
export function getController(name) {
    return Controllers.get(name)
}

/**
* 
* @param {object} ctrl
* @param {string} name 
*/
export function getSocket(ctrl, name) {
   for (const socket of ctrl.sockets) {
       if (socket.name == name) {
           return socket
       }
   }
}

/**
* 
* @param {object} ctrl
* @param {string} name 
*/
export function getSockets(ctrl) {
    return ctrl.sockets
}

/**
 * 
 * @param {object} ctrl
 * @param {string} name 
 * @param {string} relay 
 * @param {string} button 
 */
export function addSocket(ctrl, name, relay, button) {
    ctrl.sockets.push({
        name: name,
        relay: relay,
        button: button,
        status: false,
        pressed: false
    })
}

/**
 * 
 * @param {object} socket 
 * @param {boolean} status 
 * @param {boolean} save 
 */
export function setStatus(ctrl, socket, status, save=true) {
    const pin = gpio.getPin(socket.relay)

    if (pin) {
        if (!gpio.writePin(pin, (status) ? gpio.HIGH : gpio.LOW)) {
            throw new Error(`Failed to write to GPIO "${pin.name}" for controller "${ctrl.name}"`)
        }
    }

    if (save) {
        db.update("socket", ctrl.name, socket.name, "status", socket.status)
        db.save()
    }

    socket.status = status
    log.info(log.mod.SOCKET, `Socket "${socket.name}" status changed to "${socket.status}" for controller "${ctrl.name}"`)
}

export function start() {
    if (Controllers.size > 0) {
        setInterval(() => readButtons(), READ_BUTTONS_DELAY)
    }
}

function readButtons() {
    Controllers.forEach((ctrl) => {
        for (const socket of ctrl.sockets) {
            if (readButton(socket) && !socket.pressed) {
                socket.pressed = true
                setTimeout(() => { socket.pressed = false }, READ_PRESSED_BUTTONS_DELAY)
    
                try {
                    setStatus(ctrl, socket, !socket.status, true)
                    log.info(log.mod.SOCKET, `Socket "${socket.name}" is switched to "${socket.status}" for controller "${ctrl.name}"`)
                }
                catch (err) {
                    log.error(log.mod.SOCKET, `Failed to switch socket "${socket.name}" status for controller "${ctrl.name}"`, err.message)
                }
            }
        }
    })
}