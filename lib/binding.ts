const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    getLogUri(): string;
    tail(lineCb: (buffer: ArrayBuffer) => void): void;
    start(lineCb: (lines: string[]) => void): void;
    convert(buffer: ArrayBuffer): string[]
};

class FastTail {
    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    getLogUri() {
        return this._addonInstance.getLogUri();
    }

    tail(lineCb: (buffer: ArrayBuffer) => void) {
        return this._addonInstance.tail(lineCb);
    }

    start(lineCb: (lines: string[]) => void) {
        this.tail((buffer: ArrayBuffer) => {
            lineCb(this.convert(buffer));
        });
    }

    convert(buffer: ArrayBuffer): string[] {
        let barr = new Uint8Array(buffer);
        let lines: string[] = [];
    
        let line = "";
    
        for(let i = 0; i < barr.length; i++) {
            let c = barr[i];
    
            if(c) {
                const char = String.fromCharCode(c);
                line += char;
            } else {
                lines.push(line);
                line = "";
            }
        }

        return lines;
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

