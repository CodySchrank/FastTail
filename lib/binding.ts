const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    getLogUri(): string;
    tail(lineCb: (line: string) => void): void;
};

class FastTail {
    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    getLogUri() {
        return this._addonInstance.getLogUri();
    }

    tail(lineCb: (line: string) => void) {
        return this._addonInstance.tail(lineCb);
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

