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
import { WateringZone } from "../../controllers/watering/wateringzone.js"
import { log, logMod } from "../log.js"

export class ConfigsLoader {
    constructor(data, ctrl) {
        this.data = data
        this.ctrl = ctrl
    }

    loadSecurity() {
        log.info(logMod.CONFIGS_LOADER, "Add Security controller")

        this.ctrl.setPin(secPins.ALARM_LED, this.data.security.pins.alarm.led)
        this.ctrl.setPin(secPins.ALARM_BUZZER, this.data.security.pins.alarm.buzzer)
        this.ctrl.setPin(secPins.ALARM_RELAY, this.data.security.pins.alarm.relay)
        this.ctrl.setPin(secPins.KEY_READER, this.data.security.pins.key)

        for (let sens of this.data.security.sensors) {
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

        for (let sock of this.data.socket.sockets) {
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

        for (let zone of this.data.watering.zones) {
            this.ctrl.addZone(new WateringZone(zone.name, zone.pin))
            log.info(logMod.CONFIGS_LOADER, "Add watering zone Name: " + zone.name + " Pin: " + zone.pin)
        }

        return true
    }

    loadWaterTank() {
        log.info(logMod.CONFIGS_LOADER, "Add WaterTank controller")

        this.ctrl.setPin(tankPins.PUMP_RELAY, this.data.watertank.pins.pump)
        this.ctrl.setPin(tankPins.FILL_RELAY, this.data.watertank.pins.fill)

        for (let level of this.data.watertank.levels) {
            this.ctrl.addLevel(new WaterLevel(level.name, level.pin))
            log.info(logMod.CONFIGS_LOADER, "Add water level Name: " + level.name + " Pin: " + level.pin)
        }

        return true
    }
}
