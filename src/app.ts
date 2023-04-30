/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IControllers } from "./controllers/controllers"
import { ICore } from "./core/core"
import { IModules } from "./mod"
import { ApiVer } from "./net/api/api"
import { INetwork } from "./net/network"
import { BoardConfigsParser } from "./utils/configs/parsers/boardcfgparser"
import { ControllersConfigsParser } from "./utils/configs/parsers/ctrlcfgparser"
import { MainConfigsParser } from "./utils/configs/parsers/maincfgparser"
import { Mod } from "./utils/log"
import { IUtils } from "./utils/utils"

export class App {
    private static instanse: App

    private readonly api: ApiVer = ApiVer.V1

    private utils: IUtils
    private core: ICore
    private ctrls: IControllers
    private net: INetwork

    constructor(
        private readonly mod: IModules
    ) { }

    public static getInstance(mod: IModules): App {
        if (!this.instanse) {
            this.instanse = new App(mod)
        }
        return this.instanse
    }

    public start() {
        const log = this.utils.getLog()
        log.setFilePath("./data/log/")

        /**
         * Loading configs
         */

        if (this.loadConfigsAll("./data/configs/")) {
            log.info(Mod.APP, "Configs was loaded")
        } else {
            process.exit(-1)
        }

        /**
         * Starting controllers
         */

        for (const ctrl of this.ctrls.getControllers()) {
            log.info(Mod.APP, `Starting ${ctrl.getType()} controller "${ctrl.getName()}"`)
            ctrl.start()
        }

        /**
         * Starting server
         */

        try {
            this.net.getServer().registerHandlers()
            this.net.getServer().start()
        } catch (err: any) {
            log.error(Mod.APP, "Failed to start web server", err)
            process.exit(-1)
        }
    }

    public ftest() {
        const log = this.utils.getLog()
        log.setFilePath("./data/log/")

        /**
         * Loading configs
         */

        if (this.loadTestConfigs("./data/configs/")) {
            log.info(Mod.APP, "Configs was loaded")
        } else {
            process.exit(-1)
        }

        /**
         * Starting Factory Test
         */

        this.mod.createFTest(this.core.getGpio(), this.core.getLiquidCrystal()).start()
    }

    public build() {
        this.buildUtils()
        this.buildCore()
        this.buildControllers()
        this.buildNet()
    }

    private buildUtils() {
        this.utils = this.mod.createUtils()
        this.utils.createLog()
        this.utils.createConfigs()
        this.utils.createDB()
    }

    private buildCore() {
        this.core = this.mod.createCore(this.utils.getLog())
        this.core.createBoard()
        this.core.createExtenders()
        this.core.createGpio()
        this.core.createLiquidCrystal()
    }

    private buildControllers() {
        this.ctrls = this.mod.createControllers(
            this.utils.getLog(),
            this.core.getGpio(),
            this.utils.getDB()
        )
    }

    private buildNet() {
        this.net = this.mod.createNetwork(
            this.utils.getLog(),
            this.ctrls
        )
        this.net.createWebHandlers(this.api)
        this.net.createWebServer()
    }

    private loadTestConfigs(path: string): boolean {
        let boardData: any
        const log = this.utils.getLog()

        log.info(Mod.APP, "Starting application")

        /**
         * Reading configs file
         */

        try {
            boardData = this.utils.getConfigs().loadFromFile(path + "board.json")
        } catch (err: any) {
            log.error(Mod.APP, "Failed to load configs", err.message)
            return false
        }

        const cfgBoard = new BoardConfigsParser(
            this.utils.getLog(),
            this.core.getGpio(),
            this.core.getExtenders(),
            this.core.getLiquidCrystal(),
            boardData)

        /**
         * Loading board configs
         */

        log.info(Mod.APP, "Loading board configs")
        try {
            cfgBoard.parseExtenders()
            cfgBoard.parseGpio()
            cfgBoard.parseDisplays()
        } catch (err: any) {
            log.error(Mod.APP, `Failed to load board configs`, <string>err.message)
            return false
        }

        return true
    }

    private loadConfigsAll(path: string): boolean {
        let devData: any
        let boardData: any
        let mainData: any
        let ctrlData: any
        const log = this.utils.getLog()

        log.info(Mod.APP, "Starting application")

        /**
         * Reading device factory
         */

        log.info(Mod.APP, `Loading board factory`)
        try {
            devData = this.utils.getConfigs().loadFromFile(path + "device.json")
        } catch (err: any) {
            log.error(Mod.APP, "Failed to load board factory", err.message)
            return false
        }
        log.info(Mod.APP, `Board "${devData.name}-${devData.revision}" detected`)

        /**
         * Reading configs file
         */

        try {
            boardData = this.utils.getConfigs().loadFromFile(`${path}board/${devData.name}-${devData.revision}.json`)
            mainData = this.utils.getConfigs().loadFromFile(path + "main.json")
            ctrlData = this.utils.getConfigs().loadFromFile(path + "controllers.json")
        } catch (err: any) {
            log.error(Mod.APP, "Failed to load configs", err.message)
            return false
        }

        const cfgBoard = new BoardConfigsParser(
            this.utils.getLog(),
            this.core.getGpio(),
            this.core.getExtenders(),
            this.core.getLiquidCrystal(),
            boardData)

        const cfgMain = new MainConfigsParser(
            this.utils.getLog(),
            this.utils.getDB(),
            mainData)

        const cfgCtrls = new ControllersConfigsParser(
            this.utils.getLog(),
            this.utils.getDB(),
            this.ctrls,
            ctrlData)

        /**
         * Loading board configs
         */

        log.info(Mod.APP, "Loading board configs")
        try {
            cfgBoard.parseExtenders()
            cfgBoard.parseGpio()
            cfgBoard.parseDisplays()
        } catch (err: any) {
            log.error(Mod.APP, `Failed to load board configs`, <string>err.message)
            return false
        }

        /**
         * Loading main configs
         */

        log.info(Mod.APP, `Loading Database`)
        try {
            cfgMain.parseDatabase()
        } catch (err: any) {
            log.error(Mod.APP, `Failed to load Database`, err)
            return false
        }

        /**
         * Loading controllers configs
         */

        log.info(Mod.APP, "Loading Controllers")
        try {
            cfgCtrls.parseAll()
        } catch (err: any) {
            log.error(Mod.APP, `Failed to load Controllers`, <string>err.message)
            return false
        }

        return true
    }
}
