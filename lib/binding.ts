const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    getLogUri(): string;
    tail(lineCb: (line: string) => void, eof: () => void): void;
};

class FastTail {
    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    getLogUri() {
        return this._addonInstance.getLogUri();
    }

    tail(lineCb: (line: string) => void, eof: () => void) {
        return this._addonInstance.tail(lineCb, eof);
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

