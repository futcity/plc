import * as gpio from "../core/gpio.js"
import * as log from "../utils/log.js"

const READ_BUTTONS_DELAY            = 200
const READ_PRESSED_BUTTONS_DELAY    = 1000

var sockets = []

/**
 * 
 * @param {string} name 
 * @param {gpio} relay 
 * @param {gpio} button 
 */
export function addSocket(name, relay, button) {
    sockets.push({
        name: name,
        relay: relay,
        button: button,
        status: false,
        pressed: false
    })
}

/**
 * 
 * @param {string} name 
 */
export function getSocket(name) {
    for (const socket of sockets) {
        if (socket.name == name) {
            return socket
        }
    }
}

/**
 * 
 * @param {*} socket 
 * @param {boolean} status 
 */
export function setStatus(socket, status, save) {
    const pin = gpio.getPin(socket.relay)

    if (pin) {
        if (!gpio.writePin(pin, (status) ? gpio.HIGH : gpio.LOW))
            throw new Error(`Failed to write to GPIO "${gpio.name}"`)
    }

    if (save) {
        //throw new Error(`Failed to save socket status to db "${gpio.name}"`)
    }

    socket.status = status
}

export function getStatus(socket) {
    return socket.status
}

export function readButton(socket) {
    const pin = gpio.getPin(socket.button)

    if (pin) {
        if (gpio.readPin(pin) == gpio.HIGH) {
            return true
        }
    }

    return false
}

export function start() {
    setInterval(() => readButtons(), READ_BUTTONS_DELAY)
}

function readButtons() {
    for (const socket of sockets) {
        if (readButton(socket) && !socket.pressed) {
            socket.pressed = true
            setTimeout(() => { socket.pressed = false }, READ_PRESSED_BUTTONS_DELAY)

            try {
                setStatus(socket, !getStatus(socket), true)
                log.info(log.mod.SOCKET, `Socket "${socket.name}" is switched to "${socket.status}"`)
            }
            catch (err) {
                log.error(log.mod.SOCKET, `Failed to switch socket "${socket.name}" status`)
            }
        }
    }
}