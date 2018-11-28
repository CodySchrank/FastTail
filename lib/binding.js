"use strict";
const addon = require('../build/Release/fasttail-native');
;
class FastTail {
    constructor(logUri) {
        this.pollRate = 100;
        this.tailFromBeginning = false;
        this._addonInstance = new addon.FastTail(logUri);
    }
    getLogUri() {
        return this._addonInstance.getLogUri();
    }
    getLastIndex() {
        return this._addonInstance.getLastIndex();
    }
    readFromIndex(index, lineCb) {
        return this._addonInstance.readFromIndex(index, lineCb);
    }
    tailBlock(lineCb) {
        if (this.tailFromBeginning) {
            this.readFromIndex(0, (lines, index) => {
                lineCb(lines, index);
                let currentIndex = index;
                let prevIndex = currentIndex;
                setInterval(() => {
                    this.readFromIndex(currentIndex, (newLines, newIndex) => {
                        currentIndex = newIndex;
                        if (currentIndex != prevIndex) {
                            lineCb(newLines, newIndex);
                            currentIndex = newIndex;
                            prevIndex = currentIndex;
                        }
                    });
                }, this.pollRate);
            });
        }
        else {
            let currentIndex = this.getLastIndex();
            currentIndex++;
            let prevIndex = currentIndex;
            setInterval(() => {
                this.readFromIndex(currentIndex, (lines, newIndex) => {
                    currentIndex = newIndex;
                    if (currentIndex != prevIndex) {
                        lineCb(lines, newIndex);
                        currentIndex = newIndex;
                        prevIndex = currentIndex;
                    }
                });
            }, this.pollRate);
        }
    }
}
module.exports = FastTail;
