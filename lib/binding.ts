const addon = require('../build/Release/fasttail-native');

interface IFastTailNative
{
    pollRate: number;
    tailFromEnd: boolean;
    getLogUri(): string;
    readFromIndex(index: number, lineCb: (line: string) => void, eof: (index: number) => void): void;
    tail(lineCb: (line: string) => void, eof: (index: number) => void): void;
};

class FastTail {
    public pollRate: number = 100;
    public tailFromEnd: boolean = true;

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
        this.readFromIndex(0, (line: string) => {
            //This is hacky and could be much faster if it had dedicated method. but i dont care
            if(!this.tailFromEnd) {
                lineCb(line);
            }
        }, (index: number) => {
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

