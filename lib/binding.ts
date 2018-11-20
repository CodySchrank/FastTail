const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    getLogUri(): string;
    tail(index: number, lineCb: (line: string) => void, eof: (index: number) => void): void;
};

class FastTail {
    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    public getLogUri() {
        return this._addonInstance.getLogUri();
    }

    public tail(index: number, lineCb: (line: string) => void, eof: (index: number) => void) {
        return this._addonInstance.tail(index, lineCb, eof);
    }

    protected start(lineCb: (line: string) => void, eof: (index: number) => void) {
        this.tail(0, lineCb, (index: number) => {
            eof(index);

            let currentIndex = index;
            let prevIndex = currentIndex;

            setInterval(() => {
                this.tail(currentIndex, lineCb, (newIndex) => {
                    currentIndex = newIndex;
                    if(currentIndex != prevIndex) {
                        eof(newIndex);
                        currentIndex = newIndex;
                        prevIndex = currentIndex;
                    }
                });
            }, 1000);
        })
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

