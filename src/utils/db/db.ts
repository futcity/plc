/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

import { IDatabase } from "./idb"

export interface IDB {
    setDb(db: IDatabase): void
    curDB(): IDatabase 
}

export class Database implements IDB {
    private db: IDatabase

    public setDb(db: IDatabase): void {
        this.db = db
    }

    public curDB(): IDatabase {
        return this.db
    }
}