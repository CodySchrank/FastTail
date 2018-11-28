declare class FastTail {
    pollRate: number;
    tailFromBeginning: boolean;
    constructor(logUri: string);
    getLogUri(): string;
    getLastIndex(): number;
    readFromIndex(index: number, lineCb: (lines: string[], lastIndex: number) => void): void;
    tailBlock(lineCb: (lines: string[], lastIndex: number) => void): void;
    private _addonInstance;
}
export = FastTail;
