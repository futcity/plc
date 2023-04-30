/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { App } from "./app"
import { Modules as Modules } from "./mod"

function main() {
    const mod = Modules.getInstance()
    const app = App.getInstance(mod)
    app.build()
    app.start()
}

main()
