const addon = require('../build/Release/binding');

interface IFastTailNative
{
    getLogUri(): string;
    readFromIndex(index: number, lineCb: (line: string) => void, eof: (index: number) => void): void;
    tail(lineCb: (line: string) => void, eof: (index: number) => void): void;
};

class FastTail {
    public pollRate: number = 100;

    constructor(logUri: string) {
        this._addonInstance = new addon.FastTail(logUri)
    }

    public getLogUri() {
        return this._addonInstance.getLogUri();
    }

    public readFromIndex(index: number, lineCb: (line: string) => void, eof: (index: number) => void = () => {}) {
        return this._addonInstance.readFromIndex(index, lineCb, eof);
    }

    protected tail(lineCb: (line: string) => void, eof: (index: number) => void = () => {}) {
        this.readFromIndex(0, lineCb, (index: number) => {
            eof(index);

            let currentIndex = index;
            let prevIndex = currentIndex;

            setInterval(() => {
                this.readFromIndex(currentIndex, lineCb, (newIndex) => {
                    currentIndex = newIndex;
                    if(currentIndex != prevIndex) {
                        eof(newIndex);
                        currentIndex = newIndex;
                        prevIndex = currentIndex;
                    }
                });
            }, this.pollRate);
        })
    }

    // private members
    private _addonInstance: IFastTailNative;
}

export = FastTail;

