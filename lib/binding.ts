const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    getLogUri(): string;
    tail(lineCb: Function): void;
    tail(lineCb: Function, eofCb: Function): void;
};

class FastTail {
    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    getLogUri() {
        return this._addonInstance.getLogUri();
    }

    tail(lineCb: Function, eofCb: Function = () => {}) {
        return this._addonInstance.tail(lineCb, eofCb);
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

