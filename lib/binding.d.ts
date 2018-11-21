declare class FastTail {
    pollRate: number;
    tailFromBeginning: boolean;
    constructor(logUri: string);
    getLogUri(): string;
    getLastIndex(): number;
    readFromIndex(index: number, lineCb: (line: string) => void, eof?: (index: number) => void): void;
    protected tail(lineCb: (line: string) => void, eof?: (index: number) => void): void;
    private _addonInstance;
}
export = FastTail;
