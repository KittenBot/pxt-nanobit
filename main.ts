/*
Riven
load dependency
"nanobit": "file:../pxt-nanobit"
*/


//% color="#08979c" weight=10 icon="\uf043"
namespace nanobit {
    export enum arduinoPin {
        //% block=D13
        D13 = DigitalPin.P15
    }

    // block = "Digital Read %pin"
    export function DigitalRead(pin: arduinoPin): number {
        return 0;
    }
}
