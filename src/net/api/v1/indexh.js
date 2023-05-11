/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

/*********************************************************************/
/*                        PRIVATE FUNCTIONS                          */
/*********************************************************************/

function info(req, resp) {
    resp.send("<h1>FCPLC</h1>")
}

/*********************************************************************/
/*                         PUBLIC FUNCTIONS                          */
/*********************************************************************/

export function register(exp) {
    exp.get("/", (req, resp) => { info(req, resp) })
}