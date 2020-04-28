/*
Riven
load dependency
"nanobit": "file:../pxt-nanobit"
*/


//% color="#fe9973" weight=10 icon="\uf043"
//% groups='["Arduino Nano Shield", "Nanobit Shield"", "Mecanum Car"]'
namespace nanobit {
    const DigiPinMap = [
        DigitalPin.P16, // D0
        DigitalPin.P13, // D1
        null, // D2~D4 map to led column 4~6
        null,
        null,
        DigitalPin.P9, // D5
        DigitalPin.P7, // D6
        DigitalPin.P6, // D7
        null, // D8~D10 map to led Row 1~3
        null,
        null,
        DigitalPin.P8, // D11
        DigitalPin.P12, // D12
        DigitalPin.P15, // D13
        DigitalPin.P1, // A0
        DigitalPin.P2, // A1
        DigitalPin.P0, // A2
        DigitalPin.P3, // A3
        DigitalPin.P20, // A4/SDA
        DigitalPin.P19, // A5/SCL
        DigitalPin.P4, // A6
        DigitalPin.P10 // A7
    ]

    export enum ArDigiPin {
        //% block=D0/TxD
        D0 = 0,
        //% block=D1/RxD
        D1 = 1,
        //% block=D5
        D5 = 5,
        //% block=D6
        D6 = 6,
        //% block=D7
        D7 = 7,
        //% block=D12
        D12 = 12,
        //% block=D13
        D13 = 13,
        //% block=A0
        A0 = 14,
        //% block=A1
        A1 = 15,
        //% block=A2
        A2 = 16,
        //% block=A3
        A3 = 17,
        //% block=A4/SDA
        A4 = 18,
        //% block=A5/SCL
        A5 = 19,
        //% block=A6
        A6 = 20,
        //% block=A7
        A7 = 21
    }

    const AnalogPinMap = [
        AnalogPin.P1, // A0
        AnalogPin.P2, // A1
        AnalogPin.P0, // A2
        AnalogPin.P3, // A3
        AnalogPin.P4, // A6
        AnalogPin.P10 // A7
    ]

    export enum ArAPin {
        A0 = 0,
        //% block=A1
        A1 = 1,
        //% block=A2
        A2 = 2,
        //% block=A3
        A3 = 3,
        //% block=A6
        A6 = 4,
        //% block=A7
        A7 = 5,
    }

    export enum MotorIdx {
        M1A = 0,
        M1B = 1,
        M2A = 2,
        M2B = 3
    }

    export enum Run {
        //% block=forward
        Forward =0,
        //% block=back
        Back = 1,
        //% block=rightShift
        RightShift = 2,
        //% block=leftShift
        LeftShift = 3,
        //% block=northeast
        Northeast = 4,
        //% block=southeast 
        Southeast = 5,
        //% block=southwest
        Southwest = 6,
        //% block=northwest
        Northwest = 7,
        //% block=rotateRight
        RotateRight = 8,
        //% block=rotateLeft
        RotateLeft = 9,
        //% block=driftRight
        DriftRight = 10,
        //% block=driftLeft
        DriftLeft = 11
    }

    let motorSpd = [0, 0, 0, 0];
    let isMotorExtInit = 0;
    let neoStrip: neopixel.Strip;
    //% block="Digital Read %pin"
    //% group="Arduino Nano Shield" weight=66
    export function DigitalRead(pin: ArDigiPin): number {
        return pins.digitalReadPin(DigiPinMap[pin]);
    }

    //% block="Digital Write %pin %value"
    //% value.min=0 value.max=1
    //% group="Arduino Nano Shield" weight=65
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    //% name.fieldOptions.tooltips="false" name.fieldOptions.width="250"
    export function DigitalWrite(pin: ArDigiPin, value: number): void {
        pins.digitalWritePin(DigiPinMap[pin], value);
    }

    //% block="Analog Write %pin %value"
    //% value.min=0 value.max=1023
    //% group="Arduino Nano Shield" weight=63
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    //% name.fieldOptions.tooltips="false" name.fieldOptions.width="250"
    export function AnalogWrite(pin: ArAPin, value: number): void {
        pins.analogWritePin(AnalogPinMap[pin], value);
    }

    //% block="Analog Read %pin"
    //% group="Arduino Nano Shield" weight=64
    export function AnalogRead(pin: ArAPin): number {
        return pins.analogReadPin(AnalogPinMap[pin]);
    }

    //% block="%pin Pull Mode %mode"
    //% group="Arduino Nano Shield" weight=67
    export function PinMode(pin: ArDigiPin, mode: PinPullMode): void {
        pins.setPull(DigiPinMap[pin], mode);
    }

    //% block="Motor %idx speed%s"
    //% group="Nanobit Shield"  weight=66
    //% spd.min=-255 spd.max=255
    export function MotorExtRun(idx: MotorIdx, spd: number): void {
        if (!isMotorExtInit) {
            MotorExtInit()
        }
        motorSpd[idx] = spd;
        let buf = pins.createBuffer(3)
        // continues write
        buf[0] = 0x80 + (idx + 1) * 2;
        if (motorSpd[idx] >= 0) {
            buf[1] = 0; buf[2] = motorSpd[idx];
        } else {
            buf[1] = Math.abs(motorSpd[idx]); buf[2] = 0;
        }

        pins.i2cWriteBuffer(0, buf)
        // basic.pause(20)
    }


    //% group="Nanobit Shield"  weight=65
    //% m1.min=-255 m1.max=255
    //% m2.min=-255 m2.max=255
    //% m3.min=-255 m3.max=255
    //% m4.min=-255 m4.max=255
    export function MotorExt4(m1: number, m2: number, m3: number, m4: number): void {
        if (!isMotorExtInit) {
            MotorExtInit()
        }
        motorSpd[0] = m1;
        motorSpd[1] = m2;
        motorSpd[2] = m3;
        motorSpd[3] = m4;
        let buf = pins.createBuffer(9)
        // continues write
        buf[0] = 0x80 + 0x2; // start from PWM0
        if (motorSpd[0] >= 0) {
            buf[1] = 0; buf[2] = motorSpd[0];
        } else {
            buf[1] = Math.abs(motorSpd[0]); buf[2] = 0;
        }

        if (motorSpd[1] >= 0) {
            buf[3] = 0; buf[4] = motorSpd[1];
        } else {
            buf[3] = Math.abs(motorSpd[1]); buf[4] = 0;
        }

        if (motorSpd[2] >= 0) {
            buf[5] = 0; buf[6] = motorSpd[2];
        } else {
            buf[5] = Math.abs(motorSpd[2]); buf[6] = 0;
        }

        if (motorSpd[3] >= 0) {
            buf[7] = 0; buf[8] = motorSpd[3];
        } else {
            buf[7] = Math.abs(motorSpd[3]); buf[8] = 0;
        }

        pins.i2cWriteBuffer(0, buf)
        // basic.pause(20)
    }

    //% block="Motor Stop All"
    //% group="Nanobit Shield"  weight=64
    export function MotorExtStop(): void {
        if (!isMotorExtInit) {
            MotorExtInit()
        }
        motorSpd[0] = 0;
        motorSpd[1] = 0;
        motorSpd[2] = 0;
        motorSpd[3] = 0;
        let buf = pins.createBuffer(9)
        // continues write
        buf[0] = 0x2 | 0x80
        pins.i2cWriteBuffer(0, buf)
        basic.pause(20)
    }

    function MotorExtInit() {
        let addr = 0x00
        let buf = pins.createBuffer(2)
        buf[0] = 0x0
        buf[1] = 0x01
        pins.i2cWriteBuffer(addr, buf)
        basic.pause(200)

        pins.i2cWriteNumber(addr, 0x0, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);

        buf = pins.createBuffer(3)
        buf[0] = 0x0C | 0x80
        buf[1] = 0xAA
        buf[2] = 0xAA
        pins.i2cWriteBuffer(addr, buf)
        basic.pause(200)
        isMotorExtInit = 1;
    }

    
    /**
     * Init RGB pixels mounted on nanobit Shield
     */
    //% blockId="nanobit_shield_rgb" block="RGB"
    //% group="Nanobit Shield"  weight=63
    export function rgb(): neopixel.Strip {
        if (!neoStrip) {
            neoStrip = neopixel.create(DigitalPin.P16, 2, NeoPixelMode.RGB)
        }

        return neoStrip;
    }

    /**
     * Car Mode Execute
     * @param mode Servo Channel; eg: S1
     * @param speed [0-255] speed of car; eg: 255
    */
    //% block="Car %mode speed %spd"
    //% group="Mecanum Car"  weight=22
    //% speed.min=0 speed.max=255
    export function MecanumRun(mode: Run, speed: number): void{
        if (mode == 0){
            nanobit.MotorExt4(-speed, speed, speed, -speed)
        }
        else if(mode == 1){
            nanobit.MotorExt4(speed, -speed, -speed, speed)
        }
        else if(mode == 2){
            nanobit.MotorExt4(speed, speed, -speed, -speed)
        }
        else if(mode == 3){
            nanobit.MotorExt4(-speed, -speed, speed, speed)
        }
        else if(mode == 4){
            nanobit.MotorExt4(0, speed, 0, -speed)
        }
        else if(mode == 5){
            nanobit.MotorExt4(speed, 0, -speed, 0)
        }
        else if(mode == 6){
            nanobit.MotorExt4(0, -speed, 0, speed)
        }
        else if(mode == 7){
            nanobit.MotorExt4(-speed, 0, speed, 0)
        }
        else if(mode == 8){
            nanobit.MotorExt4(-speed, -speed, -speed, -speed)
        }
        else if(mode == 9){
            nanobit.MotorExt4(speed, speed, speed, speed)
        }
        else if(mode == 10){
            nanobit.MotorExt4(speed, speed, 0, 0)
        }
        else if(mode == 11){
            nanobit.MotorExt4(-speed, -speed, 0, 0)
        }
    }

}
