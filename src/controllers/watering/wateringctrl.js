/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Controller } from "../controller.js"

export class WateringController extends Controller {
    #zones = []

    start() {
        super.start()
        return true
    }

    addZone(zone) {
        this.#zones.push(zone)
    }
}
