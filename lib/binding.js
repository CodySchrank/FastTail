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
    readFromIndex(index, lineCb, eof = () => { }) {
        return this._addonInstance.readFromIndex(index, lineCb, eof);
    }
    tail(lineCb, eof = () => { }) {
        if (this.tailFromBeginning) {
            this.readFromIndex(0, lineCb, (index) => {
                eof(index);
                let currentIndex = index;
                let prevIndex = currentIndex;
                setInterval(() => {
                    this.readFromIndex(currentIndex, lineCb, (newIndex) => {
                        currentIndex = newIndex;
                        if (currentIndex != prevIndex) {
                            eof(newIndex);
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
                this.readFromIndex(currentIndex, lineCb, (newIndex) => {
                    currentIndex = newIndex;
                    if (currentIndex != prevIndex) {
                        eof(newIndex);
                        currentIndex = newIndex;
                        prevIndex = currentIndex;
                    }
                });
            }, this.pollRate);
        }
    }
}
module.exports = FastTail;
