/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IndexApi } from "./api.js"

export class IndexHandlerV1 {
    /**
     * 
     * @param {Express} exp 
     */
    register(exp) {
        exp.get(IndexApi.INFO, (req, resp) => { this.#info(req, resp) })
    }

    #info(req, resp) {
        resp.send("<h1>FCPLC</h1>")
    }
}