/*********************************************************************/
/*                                                                   */
/* Future City Programmable Logic Controller                         */
/*                                                                   */
/* Copyright (C) 2023 Denisov Smart Devices Limited                  */
/* License: GPLv3                                                    */
/* Written by Sergey Denisov aka LittleBuster (DenisovS21@gmail.com) */
/*                                                                   */
/*********************************************************************/

#include <napi.h>
#include <wiringPi.h>
#include <mcp23017.h>
#include <pcf8574.h>
#include <lcd.h>
#include <ads1115.h>

#define LCD_INIT_RETRIES    3
#define LCD_ROWS            2
#define LCD_COLS            16
#define LCD_BITS            4

class Board : public Napi::Addon<Board>
{
public:
    Board(Napi::Env env, Napi::Object exports)
    {
        wiringPiSetup();
        DefineAddon(exports, {
            InstanceMethod("setPinMode", &Board::setPinMode),
            InstanceMethod("setPinState", &Board::setPinState),
            InstanceMethod("getPinState", &Board::getPinState),
            InstanceMethod("getPinAnalogState", &Board::getPinAnalogState),
            InstanceMethod("setPinPull", &Board::setPinPull),
            InstanceMethod("initMCP23017", &Board::initMCP23017),
            InstanceMethod("initPCF8574", &Board::initPCF8574),
            InstanceMethod("initADS1115", &Board::initADS1115),
            InstanceMethod("initLCD1602", &Board::initLCD1602),
            InstanceMethod("clearLCD1602", &Board::clearLCD1602),
            InstanceMethod("homeLCD1602", &Board::homeLCD1602),
            InstanceMethod("posLCD1602", &Board::posLCD1602),
            InstanceMethod("printLCD1602", &Board::printLCD1602),
        });
    }

 private:
    int fdLCD = 0;

    Napi::Value setPinMode(const Napi::CallbackInfo& info)
    {
        int pin = info[0].ToNumber().Int32Value();
        int state = info[1].ToNumber().Int32Value();

        pinMode(pin, state);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value setPinState(const Napi::CallbackInfo& info)
    {
        int pin = info[0].ToNumber().Int32Value();
        int val = info[1].ToNumber().Int32Value();

        digitalWrite(pin, val);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value setPinPull(const Napi::CallbackInfo& info)
    {
        int pin = info[0].ToNumber().Int32Value();
        int up = info[1].ToNumber().Int32Value();

        if (up)
            pullUpDnControl(pin, PUD_UP);
        else
            pullUpDnControl(pin, PUD_DOWN);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value getPinState(const Napi::CallbackInfo& info)
    {
        int pin = info[0].ToNumber().Int32Value();

        return Napi::Number::New(info.Env(), digitalRead(pin));
    }

    Napi::Value getPinAnalogState(const Napi::CallbackInfo& info)
    {
        int pin = info[0].ToNumber().Int32Value();

        return Napi::Number::New(info.Env(), analogRead(pin));
    }

    Napi::Value initMCP23017(const Napi::CallbackInfo& info)
    {
        int base = info[0].ToNumber().Int32Value();
        int addr = info[1].ToNumber().Int32Value();

        return Napi::Number::New(info.Env(), mcp23017Setup(base, addr));
    }

    Napi::Value initPCF8574(const Napi::CallbackInfo& info)
    {
        int base = info[0].ToNumber().Int32Value();
        int addr = info[1].ToNumber().Int32Value();

        return Napi::Number::New(info.Env(), pcf8574Setup(base, addr));
    }

    Napi::Value initLCD1602(const Napi::CallbackInfo& info)
    {
        int rs = info[0].ToNumber().Int32Value();
        int rw = info[1].ToNumber().Int32Value();
        int e =  info[2].ToNumber().Int32Value();
        int k =  info[3].ToNumber().Int32Value();
        int d4 = info[4].ToNumber().Int32Value();
        int d5 = info[5].ToNumber().Int32Value();
        int d6 = info[6].ToNumber().Int32Value();
        int d7 = info[7].ToNumber().Int32Value();

        pinMode(rw, OUTPUT);
        digitalWrite(rw, LOW);
        pinMode(k, OUTPUT);
        digitalWrite(k, HIGH);

        for (int i = 0; i < LCD_INIT_RETRIES; i++)
        {
            this->fdLCD = lcdInit(LCD_ROWS, LCD_COLS, LCD_BITS, rs, e, d4, d5, d6, d7, 0, 0, 0, 0);
            if (this->fdLCD != 0)
                break;
            delay(100);
        }

        if (this->fdLCD == 0)
            return Napi::Number::New(info.Env(), 0);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value clearLCD1602(const Napi::CallbackInfo& info)
    {
        if (this->fdLCD == 0)
            return Napi::Number::New(info.Env(), 0);

        lcdClear(this->fdLCD);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value homeLCD1602(const Napi::CallbackInfo& info)
    {
        if (this->fdLCD == 0)
            return Napi::Number::New(info.Env(), 0);

        lcdHome(this->fdLCD);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value posLCD1602(const Napi::CallbackInfo& info)
    {
        if (this->fdLCD == 0)
            return Napi::Number::New(info.Env(), 0);

        int x = info[0].ToNumber().Int32Value();
        int y = info[1].ToNumber().Int32Value();

        lcdPosition(this->fdLCD, x, y);

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value printLCD1602(const Napi::CallbackInfo& info)
    {
        if (this->fdLCD == 0)
            return Napi::Number::New(info.Env(), 0);

        lcdPuts(this->fdLCD, info[0].ToString().Utf8Value().c_str());

        return Napi::Number::New(info.Env(), 1);
    }

    Napi::Value initADS1115(const Napi::CallbackInfo& info)
    {
        int base = info[0].ToNumber().Int32Value();
        int addr = info[1].ToNumber().Int32Value();

        return Napi::Number::New(info.Env(), ads1115Setup(base, addr));
    }
};

NODE_API_ADDON(Board)