/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { server } from "../server/server.js"

class Application {
    #ctrls = []

    addController(ctrl) {
        this.#ctrls.push(ctrl)
    }

    getControllers() {
        return this.#ctrls
    }

    getController(name) {
        for (let ctrl of this.#ctrls) {
            if (ctrl.name == name)
                return ctrl
        }
    }

    start() {
        for (let ctrl of this.#ctrls) {
            if (!ctrl.start())
                return false
        }

        server.start()

        return true
    }
}

export const app = new Application()
