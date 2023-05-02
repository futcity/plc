/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { Express } from "express";

export enum ApiVer {
    V1 = "v1"
}

export enum ApiRoutesV1 {
    API_ROUTE_INDEX_INFO        = "/",
    API_ROUTE_SOCKET_INFO       = "/api/v1/socket",
    API_ROUTE_SOCKET_SWITCH     = "/api/v1/socket/switch",
    API_ROUTE_METEO_INFO        = "/api/v1/meteo",
}

export interface IApi {
    register(exp: Express): void
}