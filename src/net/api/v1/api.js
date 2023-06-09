/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export class IndexApi {
    static INFO = "/api/v1/"
}

export class MeteoApi {
    static INFO = "/api/v1/meteo"
}

export class SecurityApi {
    static INFO = "/api/v1/security"
    static STATUS = "/api/v1/security/status"
}

export class SocketApi {
    static INFO = "/api/v1/socket"
    static STATUS = "/api/v1/socket/status"
}