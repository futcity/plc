/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IControllers, Controllers } from "./controllers/controllers"
import { Core, ICore } from "./core/core"
import { IWebHandlers, WebHandlers } from "./net/api/handlers"
import { INetwork, Network } from "./net/network"
import { ILog } from "./utils/log"
import { IUtils, Utils } from "./utils/utils"
import { ApiVer } from "./net/api/api"
import { IGpio } from "./core/gpio"
import { IDB } from "./utils/db/db"
import { FactoryTest } from "./ftest/ftest"
import { ILiquidCrystal } from "./core/lcd"

export interface IModules {
    createUtils(): IUtils
    createCore(): ICore
    createWebHandlers(log: ILog, ctrls: IControllers, api: ApiVer): IWebHandlers
    createNetwork(log: ILog, ctrls: IControllers): INetwork
    createControllers(log: ILog, gpio: IGpio, db: IDB): IControllers
    createFTest(gpio: IGpio, lcd: ILiquidCrystal): FactoryTest
}

export class Modules implements IModules {
    private static instanse: Modules

    public static getInstance(): Modules {
        if (!this.instanse) {
            this.instanse = new Modules()
        }
        return this.instanse
    }

    public createUtils(): IUtils {
        return new Utils()
    }

    public createCore(): ICore {
        return new Core()
    }

    public createNetwork(log: ILog, ctrls: IControllers): INetwork {
        return new Network(log, ctrls, this)
    }

    public createWebHandlers(log: ILog, ctrls: IControllers, api: ApiVer): IWebHandlers {
        return new WebHandlers(log, ctrls, api)
    }

    public createControllers(log: ILog, gpio: IGpio, db: IDB): IControllers {
        return new Controllers(log, gpio, db)
    }

    public createFTest(gpio: IGpio, lcd: ILiquidCrystal): FactoryTest {
        return new FactoryTest(gpio, lcd)
    }
}