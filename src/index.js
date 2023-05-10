import * as security from "./controllers/security.js"
import * as socket from "./controllers/socket.js"
import * as meteo from "./controllers/meteo.js"
import * as gpio from "./core/gpio.js"

gpio.addPin("opto", gpio.INPUT, gpio.UP, 100)
gpio.addPin("opto2", gpio.INPUT, gpio.UP, 101)
gpio.addPin("rly16", gpio.INPUT, gpio.OFF, 103)

const secCtrl = security.addController("table")
security.addSensor(secCtrl, "box", security.REED_SWITCH_SENSOR, "opto", true)
security.setStatus(secCtrl, true)
security.start()

const ctrlSocket = socket.addController("rack")
socket.addSocket(ctrlSocket, "switch1", "rly16", "opto2")
socket.start()

const s = socket.getController("rack")
const sock = socket.getSocket(s, "switch1")
socket.setStatus(s, sock, false)

meteo.start()