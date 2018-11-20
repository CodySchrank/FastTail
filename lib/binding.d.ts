declare class FastTail {
    pollRate: number;
    constructor(logUri: string);
    getLogUri(): string;
    readFromIndex(index: number, lineCb: (line: string) => void, eof?: (index: number) => void): void;
    protected tail(lineCb: (line: string) => void, eof?: (index: number) => void): void;
    private _addonInstance;
}
export = FastTail;
