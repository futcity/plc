/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { SecuritySensor, secSensorType } from "../../controllers/security/securitysensor.js"
import { secPins } from "../../controllers/security/securityctrl.js"
import { tankPins } from "../../controllers/watertank/watertankctrl.js"
import { WaterLevel } from "../../controllers/watertank/waterlvl.js"
import { Socket } from "../../controllers/socket/socket.js"
import { wateringTime, wateringPins } from "../../controllers/watering/wateringctrl.js"
import { log, logMod } from "../log.js"

export class ConfigsLoader {
    constructor(data, ctrl) {
        this.data = data
        this.ctrl = ctrl
    }

    loadSecurity() {
        log.info(logMod.CONFIGS_LOADER, "Add Security controller")

        this.ctrl.setPin(secPins.STATUS_LED, this.data.pins.status)
        this.ctrl.setPin(secPins.ALARM_LED, this.data.pins.alarm)
        this.ctrl.setPin(secPins.ALARM_BUZZER, this.data.pins.buzzer)
        this.ctrl.setPin(secPins.ALARM_RELAY, this.data.pins.relay)

        for (let sens of this.data.sensors) {
            let type = secSensorType.REED_SWITCH

            switch (sens.type) {
                case "reedswitch":
                    type = secSensorType.REED_SWITCH
                    break

                case "pir":
                    type = secSensorType.PIR
                    break

                case "microwave":
                    type = secSensorType.MICRO_WAVE
                    break
                
                default:
                    log.error(logMod.CONFIGS_LOADER, "Unknown security sensor type: " + sens.type)
                    return false
            }

            log.info(logMod.CONFIGS_LOADER,
                "Add security sensor Name: " + sens.name + 
                " Type: " + sens.type + " Pin: " + sens.pin + " Alarm: " + sens.alarm)

            let sensor = new SecuritySensor(sens.name, sens.type, sens.pin, sens.alarm)
            this.ctrl.addSensor(sensor)
        }
        return true
    }

    loadSocket() {
        log.info(logMod.CONFIGS_LOADER, "Add Socket controller")

        for (let sock of this.data.sockets) {
            if (this.ctrl.addSocket(new Socket(sock.name, sock.relay, sock.button))) {
                log.info(logMod.CONFIGS_LOADER, "Add socket Name: " + sock.name + " Relay: " + sock.relay + " Button: " + sock.button)
            } else {
                log.error(logMod.CONFIGS_LOADER, "Failed to add socket: " + sock.name)
                return false
            }
        }

        return true
    }

    loadWatering() {
        log.info(logMod.CONFIGS_LOADER, "Add Watering controller")
        
        this.ctrl.setPin(wateringPins.STATUS, this.data.pins.status)
        this.ctrl.setPin(wateringPins.RELAY, this.data.pins.relay)
        this.ctrl.setTime(wateringTime.ON, this.data.on)
        this.ctrl.setTime(wateringTime.OFF, this.data.off)

        return true
    }

    loadWaterTank() {
        log.info(logMod.CONFIGS_LOADER, "Add WaterTank controller")

        this.ctrl.setPin(tankPins.PUMP_RELAY, this.data.pins.pump)
        this.ctrl.setPin(tankPins.FILL_RELAY, this.data.pins.fill)

        for (let level of this.data.levels) {
            this.ctrl.addLevel(new WaterLevel(level.name, level.pin))
            log.info(logMod.CONFIGS_LOADER, "Add water level Name: " + level.name + " Pin: " + level.pin)
        }

        return true
    }
}
