/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

export interface IDatabase {
    connect(ip: string, user: string, pass: string): void
    loadFromFile(fileName: string): void
    save(): void
    insert(db: string, table: string, param: string, subParam: string, value: any): void
    update(db: string, table: string, param: string, subParam: string, value: any): void
    select(db: string, table: string, param: string, subParam: string): any
}