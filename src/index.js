import * as security from "./controllers/security.js"
import * as socket from "./controllers/socket.js"
import * as meteo from "./controllers/meteo.js"
import * as gpio from "./core/gpio.js"

gpio.addPin("opto", gpio.INPUT, gpio.UP, 100)

const secCtrl = security.addController("table")
security.addSensor(secCtrl, "box", security.REED_SWITCH_SENSOR, "opto", true)
security.setStatus(secCtrl, true)
security.start()

socket.start()
meteo.start()