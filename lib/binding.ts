const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    getLogUri(): string;
    tail(lineCb: Function): void;
    start(lineCb: Function): void;
};

class FastTail {
    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    getLogUri() {
        return this._addonInstance.getLogUri();
    }

    tail(lineCb: Function) {
        return this._addonInstance.tail(lineCb);
    }

    start(lineCb: Function) {
        this.tail((buffer: ArrayBuffer) => {
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
        
            lineCb(lines);
        });
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

