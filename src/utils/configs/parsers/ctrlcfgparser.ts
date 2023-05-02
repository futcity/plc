/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { CtrlType } from "../../../controllers/controller"
import { IControllers } from "../../../controllers/controllers"
import { IMeteoController } from "../../../controllers/meteo/meteoctrl"
import { Ds18b20Sensor } from "../../../controllers/meteo/sensors/ds18b20"
import { MeteoSensorType } from "../../../controllers/meteo/sensors/meteosens"
import { ISecurityController, SecurityPin } from "../../../controllers/security/securityctrl"
import { SecuritySensor, SecuritySensorType } from "../../../controllers/security/securitysensor"
import { ISocketController } from "../../../controllers/socket/socketctrl"
import { IGpio } from "../../../core/gpio"
import { IOneWire } from "../../../core/onewire"
import { IDB } from "../../db/db"
import { ILog, Mod } from "../../log"

export class ControllersConfigsParser {
    constructor(
        private readonly log: ILog,
        private readonly db: IDB,
        private readonly ctrls: IControllers,
        private readonly ow: IOneWire,
        private readonly gpio: IGpio,
        private readonly data: any
    ) { }

    public parseAll() {
        for (const ctrl of this.data.controllers) {
            switch (ctrl.type) {
                case CtrlType.SOCKET:
                    this.log.info(Mod.APP, `Add socket controller "${ctrl.name}"`)
                    const socket = this.ctrls.createSocket(ctrl.name)
                    this.parseSocket(socket, ctrl)
                    break

                case CtrlType.METEO:
                    this.log.info(Mod.APP, `Add meteo controller "${ctrl.name}"`)
                    const meteo = this.ctrls.createMeteo(ctrl.name)
                    this.parseMeteo(meteo, ctrl)
                    break

                case CtrlType.SECURITY:
                    this.log.info(Mod.APP, `Add security controller "${ctrl.name}"`)
                    const security = this.ctrls.createSecurity(ctrl.name)
                    this.parseSecurity(security, ctrl)
                    break

                default:
                    throw new Error(`Unknown controller type "${ctrl.type}"`)
            }
        }
    }

    private parseSocket(socket: ISocketController, ctrl: any) {
        if (!ctrl.sockets) {
            throw new Error("Sockets not found")
        }

        for (const sock of ctrl.sockets) {
            if (!sock.name) {
                throw new Error("Socket name not found")
            }
            
            /**
             * Add new socket
             */

            socket.addSocket(sock.name, sock.pins.relay, sock.pins.button)
            this.log.info(Mod.APP, `Add socket "${sock.name}" relay "${sock.pins.relay}" button "${sock.pins.button}"`)

            /**
             * Load socket state from Database
             */

            let state: boolean = false
            
            try {
                state = <boolean>this.db.curDB().select(CtrlType.SOCKET, ctrl.name, sock.name, "state")
            } catch (err: any) {
                this.db.curDB().insert(CtrlType.SOCKET, ctrl.name, sock.name, "state", state)
                this.db.curDB().save()
            }

            const s = socket.getSocket(sock.name)
            s?.setState(state, false)
        }
    }

    private parseMeteo(meteo: IMeteoController, ctrl: any) {
        if (!ctrl.sensors) {
            throw new Error("Meteo sensors not found")
        }

        for (const sensor of ctrl.sensors) {
            switch (sensor.type) {
                case "ds18b20":
                    meteo.addSensor(new Ds18b20Sensor(this.ow, sensor.id, sensor.name, MeteoSensorType.DS18B20))
                    break

                default:
                    throw new Error(`Unknown meteo sensor type "${sensor.type}"`)
            }
            this.log.info(Mod.APP, `Add meteo sensor "${sensor.name}" type "${sensor.type}"`)
        }
    }

    private parseSecurity(security: ISecurityController, ctrl: any) {
        if (!ctrl.sensors) {
            throw new Error("Security sensors not found")
        }

        security.setPin(SecurityPin.STATUS, ctrl.pins.status)
        security.setPin(SecurityPin.BUZZER, ctrl.pins.buzzer)
        security.setPin(SecurityPin.ALARM_LED, ctrl.pins.alarm.led)
        security.setPin(SecurityPin.ALARM_RELAY, ctrl.pins.alarm.relay)

        this.log.info(Mod.APP, `Security "status" pin is "${ctrl.pins.status}"`)
        this.log.info(Mod.APP, `Security "buzzer" pin is "${ctrl.pins.buzzer}"`)
        this.log.info(Mod.APP, `Security "alarm-led" pin is "${ctrl.pins.alarm.led}"`)
        this.log.info(Mod.APP, `Security "alarm-relay" pin is "${ctrl.pins.alarm.relay}"`)

        for (const sensor of ctrl.sensors) {
            switch (sensor.type) {
                case "reedswitch":
                    security.addSensor(new SecuritySensor(this.gpio, sensor.name, sensor.pin, SecuritySensorType.REED_SWITCH, sensor.alarm))
                    break

                case "pir":
                    security.addSensor(new SecuritySensor(this.gpio, sensor.name, sensor.pin, SecuritySensorType.PIR, sensor.alarm))
                    break

                case "microwave":
                    security.addSensor(new SecuritySensor(this.gpio, sensor.name, sensor.pin, SecuritySensorType.MICRO_WAVE, sensor.alarm))
                    break

                default:
                    throw new Error(`Unknown security sensor type "${sensor.type}"`)
            }
            this.log.info(Mod.APP, `Add security sensor "${sensor.name}" type "${sensor.type}"`)
        }

        let status: boolean = false
        try {
            status = <boolean>this.db.curDB().select(CtrlType.SECURITY, ctrl.name, "global", "status")
        } catch (err: any) {
            this.db.curDB().insert(CtrlType.SOCKET, ctrl.name, "global", "status", status)
            this.db.curDB().save()
        }

        security.setStatus(status, false)
    }
}