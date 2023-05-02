/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import moment from 'moment'
import color from 'colorts'
import { appendFile } from 'fs'

enum LogType {
    INFO,
    WARN,
    ERROR
}

export enum Mod {
    INDEX = "INDEX",
    CONFIGS = "CONFIGS",
    SOCKETCTRL = "SOCKETCTRL",
    SOCKETH = "SOCKETH",
    SERVER = "SERVER",
    APP = "APP",
    DB = "DB",
    LOG = "LOG",
    METEOCTRL = "METEOCTRL",
    METEOH = "METEOH"
}

export interface ILog {
    setFilePath(path: string): void
    info(module: Mod, msg: string): void
    warn(module: Mod, msg: string): void
    error(module: Mod, msg: string, err?: string): void
}

export class Log implements ILog {
    private path: string = "./"

    public setFilePath(path: string): void {
        this.path = path
    }

    public info(module: Mod, msg: string): void {
        this.logging(module, LogType.INFO, msg)
        this.saveToFile(module, LogType.INFO, msg)
    }

    public warn(module: Mod, msg: string): void {
        this.logging(module, LogType.WARN, msg)
        this.saveToFile(module, LogType.WARN, msg)
    }

    public error(module: Mod, msg: string, err: string=""): void {
        this.logging(module, LogType.ERROR, msg, err)
        this.saveToFile(module, LogType.ERROR, msg, err)
    }

    private async saveToFile(module: Mod, type: LogType, msg: string, err: string="") {
        const time = moment(new Date(), "hh:mm:ss")

        let outStr = "[" + time.format("YYYY-MM-DD") + "][" + time.format("hh:mm:ss") + "]["

        switch (type) {
            case LogType.INFO:
                outStr += "INFO"
                break

            case LogType.WARN:
                outStr += "WARN"
                break

            case LogType.ERROR:
                outStr += "ERROR"
                break
        }

        outStr += "][" + module + "] "
        let fileName = time.format("YYYY-MM-DD") + ".log"

        appendFile(this.path + fileName, outStr + msg + "\n", (e) => {
            if (e) {
                this.logging(Mod.LOG, LogType.ERROR, "Fail to write to log file", e.message)
                return
            }

            if (err != "") {
                appendFile(this.path + fileName, outStr + err + "\n", (e) => {
                    if (e)
                        this.logging(Mod.LOG, LogType.ERROR, "Fail to write to log file", e.message)
                })
            }
        })
    }

    private logging(module: Mod, type: LogType, msg: string, err: string="") {
        const time = moment(new Date(), "hh:mm:ss")
        
        let outStr = "[" + color(time.format("YYYY-MM-DD")).blue + "][" +  color(time.format("hh:mm:ss")).cyan + "]["
 
        switch (type) {
            case LogType.INFO:
                outStr += color("INFO").green
                break

            case LogType.WARN:
                outStr += color("WARN").yellow
                break

            case LogType.ERROR:
                outStr += color("ERROR").red
                break
        }

        outStr += "][" + color(module).magenta + "] "

        console.log(outStr + msg)
        if (err != "") {
            console.log(outStr + err)
        }
    }
}