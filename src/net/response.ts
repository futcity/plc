/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export class ResponseParam {
    constructor(
        public name: string,
        public value: any
    ) { }
}

export class ServerResponse {
    constructor(
        public result: boolean,
        public error: string,
        public data: ResponseParam[]
    ) { }
}